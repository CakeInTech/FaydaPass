import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Define route patterns
  const publicRoutes = ['/', '/docs', '/verify', '/callback', '/verified'];
  const authRoutes = ['/login', '/signup', '/plan-selection'];
  const protectedRoutes = ['/dashboard'];
  const adminRoutes = ['/admin'];

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  // Check if route is auth-related
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  // Check if route is admin-only
  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  // Allow public routes
  if (isPublicRoute) {
    return res;
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Redirect unauthenticated users to login
  if ((isProtectedRoute || isAdminRoute) && !session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // For protected routes, verify user profile and role
  if ((isProtectedRoute || isAdminRoute) && session) {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!profile) {
        // User exists in auth but not in profiles table
        return NextResponse.redirect(new URL('/signup?step=complete', req.url));
      }

      // Check admin access
      if (isAdminRoute && profile.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // Add user role to headers for use in components
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-role', profile.role);
      requestHeaders.set('x-user-id', session.user.id);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}