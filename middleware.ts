import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Check if the request is for an admin route
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute) {
    // For now, we'll let the client-side handle authentication
    // The middleware will be enhanced once we have proper server-side auth
    return res;
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
