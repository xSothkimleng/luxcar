// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Get the pathname from the request URL
  const path = request.nextUrl.pathname;

  // Only check authentication for dashboard routes
  const isDashboardRoute = path.startsWith('/dashboard');

  // If it's not a dashboard route, allow access without checks
  if (!isDashboardRoute) {
    return NextResponse.next();
  }

  // For dashboard routes, check for authentication
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If no token found, redirect to login page
  if (!token) {
    const url = new URL('/auth/login', request.url);
    // Add the original URL as a parameter to redirect back after login
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Check if user has ADMIN role
  if (token.role !== 'ADMIN') {
    // Redirect non-admin users to an unauthorized page
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // User is authenticated, allow access to dashboard
  return NextResponse.next();
}

export const config = {
  // Apply this middleware to any route that might need protection
  matcher: ['/dashboard/:path*'],
};
