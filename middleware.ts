import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Check if the request is for an admin route
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = req.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute) {
    // For admin routes (except login), we'll let the client-side handle authentication
    // The AdminLayout component will redirect to login if not authenticated
    return res;
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
