import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
    console.log("Middleware executed for:", req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Define route patterns
        const publicRoutes = ['/', '/docs', '/verify', '/callback', '/verified', '/plan-selection'];
        const authRoutes = ['/login', '/signup'];
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
          return true;
        }

        // Allow auth routes for unauthenticated users
        if (isAuthRoute && !token) {
          return true;
        }

        // Redirect authenticated users away from auth routes
        if (isAuthRoute && token) {
          return false; // This will redirect to the default page
        }

        // Require authentication for protected routes
        if (isProtectedRoute || isAdminRoute) {
          if (!token) {
            return false; // This will redirect to login
          }

          // Check admin access
          if (isAdminRoute) {
            return token.role === 'admin';
          }

          return true;
        }

        return true;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

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