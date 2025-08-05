import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create Supabase client for middleware
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Define route patterns
  const publicRoutes = ['/', '/docs', '/verify', '/callback', '/verified'];
  const authRoutes = ['/login', '/signup', '/plan-selection', '/developer-login', '/company-login', '/developer-signup', '/company-signup'];
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
      // Use a simpler admin check to avoid RLS recursion
      const userEmail = session.user.email;
      const isAdmin = userEmail === 'admin@faydapass.com' || 
                     userEmail?.includes('admin') ||
                     session.user.user_metadata?.role === 'admin';

      // Check admin access
      if (isAdminRoute && !isAdmin) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // For non-admin routes, try to get profile but don't fail if RLS blocks it
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError && !isAdmin) {
        console.error('Profile fetch error:', profileError);
        // User exists in auth but not in profiles table
        return NextResponse.redirect(new URL('/signup?step=complete', req.url));
      }

      // Add user role to headers for use in components
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-role', profile?.role || (isAdmin ? 'admin' : 'user'));
      requestHeaders.set('x-user-id', session.user.id);
      requestHeaders.set('x-user-email', userEmail || '');

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error('Middleware error:', error);
      // Don't redirect on middleware errors, let the app handle it
      return res;
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