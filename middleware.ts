import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req: NextRequest) {
  // Temporarily disable middleware for testing
  return NextResponse.next();

  const url = req.nextUrl.clone();
  const { pathname } = url;

  // Define protected routes and auth routes
  const protectedRoutes = [
    "/admin/dashboard",
    "/admin/settings",
    "/admin/users",
    "/admin/verifications",
    "/admin/webhooks",
    "/company-dashboard",
    "/developer-dashboard",
  ];

  const authRoutes = [
    "/admin/login",
    "/company-signup",
    "/developer-signup",
    "/company-login",
    "/developer-login",
  ];

  // Check if current route is protected or auth route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // For auth routes, check if user is already authenticated and redirect to appropriate dashboard
  if (isAuthRoute) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables in middleware");
      return NextResponse.next();
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

    if (accessToken) {
      try {
        // Verify the token with Supabase
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser(accessToken);

        if (!error && user) {
          // Check if user is admin
          if (pathname.startsWith("/admin/login")) {
            const isAdmin =
              user.email === "admin@faydapass.com" ||
              user.user_metadata?.role === "admin" ||
              user.email?.includes("admin");

            if (isAdmin) {
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
      } catch (error) {
        console.error("Middleware auth route check error:", error);
      }
    }
  }

  // If it's not a protected route, allow access
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // For protected routes, check authentication
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

  // If no access token, redirect to appropriate login
  if (!accessToken) {
    console.log("No access token found, redirecting to login");
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    } else if (pathname.startsWith("/company-dashboard")) {
      return NextResponse.redirect(new URL("/company-login", req.url));
    } else if (pathname.startsWith("/developer-dashboard")) {
      return NextResponse.redirect(new URL("/developer-login", req.url));
    }
  }

  try {
    // Verify the token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken || "");

    if (error || !user) {
      console.log("Invalid or expired token, redirecting to login");
      // Clear any auth cookies
      const response = NextResponse.redirect(new URL("/admin/login", req.url));
      response.cookies.delete("sb-access-token");
      response.cookies.delete("supabase-auth-token");
      return response;
    }

    // For admin routes, check if user is admin
    if (pathname.startsWith("/admin")) {
      const isAdmin =
        user.email === "admin@faydapass.com" ||
        user.user_metadata?.role === "admin" ||
        user.email?.includes("admin");

      if (!isAdmin) {
        console.log("User is not admin, redirecting to home");
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // For company dashboard, check if user is company_user
    if (pathname.startsWith("/company-dashboard")) {
      const { data: userRecord } = await supabase
        .from("users")
        .select("user_type")
        .eq("email", user.email)
        .single();

      if (userRecord?.user_type !== "company_user") {
        console.log("User is not a company user, redirecting to home");
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // For developer dashboard, check if user is developer
    if (pathname.startsWith("/developer-dashboard")) {
      console.log("Checking developer dashboard access for:", user.email);

      const { data: userRecord, error: userError } = await supabase
        .from("users")
        .select("user_type")
        .eq("email", user.email)
        .single();

      console.log("Developer dashboard user check result:", {
        userRecord,
        userError,
      });

      if (userError || userRecord?.user_type !== "developer") {
        console.log("User is not a developer, redirecting to home");
        return NextResponse.redirect(new URL("/", req.url));
      }

      console.log("Developer access granted");
    }

    // Token is valid and user has correct role, allow access
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware authentication error:", error);
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
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
