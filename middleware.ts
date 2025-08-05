import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  try {
    // Create Supabase client for middleware with proper error handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            try {
              return req.cookies.get(name)?.value;
            } catch (error) {
              console.warn('Cookie get error:', error);
              return undefined;
            }
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              req.cookies.set({
                name,
                value,
                ...options,
              });
              response = NextResponse.next({
                request: {
                  headers: req.headers,
                },
              });
              response.cookies.set({
                name,
                value,
                ...options,
              });
            } catch (error) {
              console.warn('Cookie set error:', error);
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              req.cookies.set({
                name,
                value: '',
                ...options,
              });
              response = NextResponse.next({
                request: {
                  headers: req.headers,
                },
              });
              response.cookies.set({
                name,
                value: '',
                ...options,
              });
            } catch (error) {
              console.warn('Cookie remove error:', error);
            }
          },
        },
      }
    );

    // Get session with error handling
    let session = null;
    try {
      const { data: { session: sessionData }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.warn('Session error:', sessionError);
      } else {
        session = sessionData;
      }
    } catch (error) {
      console.warn('Session fetch error:', error);
    }

    const { pathname } = req.nextUrl;

    // Define route patterns
    const publicRoutes = ['/', '/docs', '/verify', '/callback', '/verified'];
    const authRoutes = ['/login', '/signup', '/plan-selection'];
    const protectedRoutes = ['/dashboard'];
    const adminRoutes = ['/admin'];

    // Check route types
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some(route => 
      pathname === route || pathname.startsWith(route)
    );
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname === route || pathname.startsWith(route)
    );
    const isAdminRoute = adminRoutes.some(route => 
      pathname === route || pathname.startsWith(route)
    );

    // Allow public routes
    if (isPublicRoute) {
      return response;
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

    // For admin routes, check admin status using simple email check
    if (isAdminRoute && session) {
      const userEmail = session.user.email;
      const isAdmin = userEmail === 'admin@faydapass.com' || 
                     userEmail?.includes('admin') ||
                     session.user.user_metadata?.role === 'admin';

      if (!isAdmin) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Add user context to headers (for debugging)
    const requestHeaders = new Headers(req.headers);
    if (session?.user) {
      requestHeaders.set('x-user-id', session.user.id);
      requestHeaders.set('x-user-email', session.user.email || '');
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    console.error('Middleware error:', error);
    // Return response without modification on errors
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}