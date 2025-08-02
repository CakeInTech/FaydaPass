import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Temporarily disable middleware to allow access to admin login
  // This will be re-enabled once authentication is properly set up
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
