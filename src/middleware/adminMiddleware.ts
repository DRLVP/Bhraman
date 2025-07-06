import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/lib/adminUtils';

/**
 * Middleware for admin routes
 * This middleware is applied to all admin routes except for the admin sign-in page
 */
export async function middleware(req: NextRequest) {
  // Skip middleware for admin sign-in page (which now includes sign-up functionality)
  if (req.nextUrl.pathname === '/admin/sign-in') {
    return NextResponse.next();
  }
  
  // Apply admin authentication middleware
  return adminMiddleware(req);
}

// Apply this middleware only to admin routes
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};