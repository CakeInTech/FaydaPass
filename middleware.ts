import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req: NextRequest) {
  // Create Supabase client for middleware
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase environment variables in middleware");
    return NextResponse.redirect(new URL("/", req.url));
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get the authorization header
  const authHeader = req.headers.get("authorization");
  let accessToken = null;

  // Try to get token from Authorization header
  if (authHeader && authHeader.startsWith("Bearer ")) {
    accessToken = authHeader.substring(7);
  }

  // If no token in header, try to get from cookies
  if (!accessToken) {
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      accessToken =
        cookies["sb-access-token"] || cookies["supabase-auth-token"];
    }
  }

  const url = req.nextUrl.clone();
  const { pathname } = url;

  // Define protected routes
  const protectedRoutes = [
    "/admin/dashboard",
    "/admin/settings",
    "/admin/users",
    "/admin/verifications",
    "/admin/webhooks",
    "/company-dashboard",
    "/developer-dashboard",
  ];

  // Define auth routes (login/signup)
  const authRoutes = ["/admin/login", "/company-signup", "/developer-signup"];

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If it's a protected route, check authentication
  if (isProtectedRoute) {
    try {
      if (!accessToken) {
        console.log("No access token found, redirecting to login");
        // Redirect to appropriate login based on route
        if (pathname.startsWith("/admin")) {
          return NextResponse.redirect(new URL("/admin/login", req.url));
        } else if (pathname.startsWith("/company-dashboard")) {
          return NextResponse.redirect(new URL("/company-login", req.url));
        } else if (pathname.startsWith("/developer-dashboard")) {
          return NextResponse.redirect(new URL("/developer-login", req.url));
        }
      }

      // Verify the token with Supabase
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(accessToken || "");

      if (error || !user) {
        console.log("Invalid or expired token, redirecting to login");
        // Clear any auth cookies
        const response = NextResponse.redirect(
          new URL("/admin/login", req.url)
        );
        response.cookies.delete("sb-access-token");
        response.cookies.delete("supabase-auth-token");
        return response;
      }

      // For admin routes, check if user is admin
      if (pathname.startsWith("/admin")) {
        const { data: adminUser } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", user.email)
          .single();

        if (!adminUser) {
          console.log("User is not admin, redirecting to home");
          return NextResponse.redirect(new URL("/", req.url));
        }
      }

      // Token is valid, allow access
      return NextResponse.next();
    } catch (error) {
      console.error("Middleware authentication error:", error);
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // If it's an auth route and user is already authenticated, redirect to appropriate dashboard
  if (isAuthRoute) {
    try {
      if (accessToken) {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser(accessToken);

        if (!error && user) {
          // Check if user is admin
          if (pathname.startsWith("/admin/login")) {
            const { data: adminUser } = await supabase
              .from("admin_users")
              .select("*")
              .eq("email", user.email)
              .single();

            if (adminUser) {
              return NextResponse.redirect(
                new URL("/admin/dashboard", req.url)
              );
            }
          }

          // Check user type and redirect accordingly
          const { data: userRecord } = await supabase
            .from("users")
            .select("user_type")
            .eq("email", user.email)
            .single();

          if (userRecord) {
            if (userRecord.user_type === "company_user") {
              return NextResponse.redirect(
                new URL("/company-dashboard", req.url)
              );
            } else if (userRecord.user_type === "developer") {
              return NextResponse.redirect(
                new URL("/developer-dashboard", req.url)
              );
            }
          }
        }
      }
    } catch (error) {
      console.error("Middleware auth route check error:", error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/company-dashboard/:path*",
    "/developer-dashboard/:path*",
    "/company-signup",
    "/developer-signup",
    "/company-login",
    "/developer-login",
  ],
};
