import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from './db';
import User from '@/models/User';
import { BookingStatus, PaymentStatus } from '@/models/Booking';

/**
 * Get the current admin user from the database
 * @returns The current admin user or null
 */
export const getCurrentAdmin = async () => {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }
    
    // Connect to MongoDB
    await connectDB();
    
    // Find user in our database and check if they have admin role
    const dbUser = await User.findOne({ 
      clerkId: userId,
      role: 'admin'
    });
    console.log("getting user as admin::", dbUser);
    
    if (!dbUser) {
      return null;
    }
    
    // Update last login time
    dbUser.lastLogin = new Date();
    await dbUser.save();
    
    return {
      id: dbUser._id.toString(),
      clerkId: userId,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      permissions: dbUser.permissions || [],
      profileImage: dbUser.profileImage,
    };
  } catch (error) {
    console.error('Error getting current admin:', error);
    return null;
  }
};

/**
 * Check if a user has admin access
 * @returns Boolean indicating if the user has admin access
 */
export const isAdmin = async () => {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return false;
    }
    
    await connectDB();
    const admin = await User.findOne({ 
      clerkId: userId,
      role: 'admin'
    });
    console.log("checking admin after data::", admin);
    
    return !!admin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Middleware to protect admin routes
 * This function checks if the user is authenticated and has admin role
 * If not, it redirects to the admin sign-in page
 * 
 * @param req - The incoming request
 * @returns NextResponse with redirect or null to continue
 */
export async function adminMiddleware(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    // If not authenticated, redirect to sign-in
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
    
    // Check if user has admin role
    const hasAdminAccess = await isAdmin();

    console.log("after checking is admin or not::", hasAdminAccess);
    
    
    // If not admin, redirect to unauthorized page
    if (!hasAdminAccess) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    
    // Continue if admin
    return null;
  } catch (error) {
    console.error('Error in admin middleware:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
};

/**
 * Helper function to check if a request is from an admin in API routes
 * 
 * @returns Response object or null
 */
export async function checkAdminApiAccess() {
  try {
    const { userId } = await auth();
    
    // If not authenticated
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Check if user has admin role
    const hasAdminAccess = await isAdmin();
    
    // If not admin
    if (!hasAdminAccess) {
      return new NextResponse('Forbidden: Admin access required', { status: 403 });
    }
    
    // Continue if admin
    return null;
  } catch (error) {
    console.error('Error checking admin API access:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

/**
 * Check if a user has specific permission
 * @param permission - The permission to check
 * @returns Boolean indicating if the user has the permission
 */
export const hasPermission = async (permission: string) => {
  try {
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return false;
    }
    
    // All admins have all permissions
    return true;
  } catch (error) {
    console.error(`Error checking permission ${permission}:`, error);
    return false;
  }
};

/**
 * Format a date string to a more readable format
 * @param dateString - The date string to format
 * @param includeTime - Whether to include the time in the formatted date
 * @returns Formatted date string
 */
export function formatAdminDate(dateString: string | Date, includeTime: boolean = false): string {
  if (!dateString) return 'N/A';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return date.toLocaleDateString('en-US', options);
}

/**
 * Format a currency amount
 * @param amount - The amount to format
 * @param currency - The currency code (default: INR)
 * @returns Formatted currency string
 */
export function formatAdminCurrency(amount: number, currency: string = 'INR'): string {
  if (amount === undefined || amount === null) return 'N/A';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get a color for a booking status
 * @param status - The booking status
 * @returns CSS color class
 */
export function getBookingStatusColor(status: BookingStatus): string {
  switch (status) {
    case BookingStatus.CONFIRMED:
      return 'text-green-600 bg-green-100';
    case BookingStatus.PENDING:
      return 'text-yellow-600 bg-yellow-100';
    case BookingStatus.CANCELLED:
      return 'text-red-600 bg-red-100';
    case BookingStatus.COMPLETED:
      return 'text-blue-600 bg-blue-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

/**
 * Get a color for a payment status
 * @param status - The payment status
 * @returns CSS color class
 */
export function getPaymentStatusColor(status: PaymentStatus): string {
  switch (status) {
    case PaymentStatus.COMPLETED:
      return 'text-green-600 bg-green-100';
    case PaymentStatus.PENDING:
      return 'text-yellow-600 bg-yellow-100';
    case PaymentStatus.FAILED:
      return 'text-red-600 bg-red-100';
    case PaymentStatus.REFUNDED:
      return 'text-purple-600 bg-purple-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

/**
 * Calculate the total revenue from an array of bookings
 * @param bookings - Array of booking objects with totalAmount property
 * @returns Total revenue
 */
export function calculateTotalRevenue(bookings: Array<{ totalAmount: number }>): number {
  return bookings.reduce((total, booking) => total + (booking.totalAmount || 0), 0);
}

/**
 * Group bookings by month for statistics
 * @param bookings - Array of booking objects with createdAt property
 * @param months - Number of months to include (default: 6)
 * @returns Object with month labels and booking counts
 */
export function getBookingsByMonth(bookings: Array<{ createdAt: string }>, months: number = 6): {
  labels: string[];
  data: number[];
} {
  const now = new Date();
  const labels: string[] = [];
  const data: number[] = [];
  const monthCounts: Record<string, number> = {};

  // Initialize the last 'months' months with 0 counts
  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    labels.unshift(monthLabel);
    monthCounts[monthLabel] = 0;
  }

  // Count bookings by month
  bookings.forEach(booking => {
    const bookingDate = new Date(booking.createdAt);
    const monthLabel = bookingDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    if (monthCounts[monthLabel] !== undefined) {
      monthCounts[monthLabel]++;
    }
  });

  // Convert to arrays for chart data
  labels.forEach(month => {
    data.push(monthCounts[month]);
  });

  return { labels, data };
}

/**
 * Filter bookings by status
 * @param bookings - Array of booking objects
 * @param status - The status to filter by
 * @returns Filtered array of bookings
 */
export function filterBookingsByStatus<T extends { status: BookingStatus }>(
  bookings: T[],
  status: BookingStatus
): T[] {
  return bookings.filter(booking => booking.status === status);
}

/**
 * Get recent bookings sorted by date
 * @param bookings - Array of booking objects
 * @param limit - Maximum number of bookings to return
 * @returns Array of recent bookings
 */
export function getRecentBookings<T extends { createdAt: string }>(
  bookings: T[],
  limit: number = 5
): T[] {
  return [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

/**
 * Truncate a string to a specified length
 * @param str - The string to truncate
 * @param length - Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
export function truncateAdminString(str: string, length: number = 50): string {
  if (!str) return '';
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

/**
 * Generate a random color for charts
 * @returns Hex color code
 */
export function getRandomChartColor(): string {
  const colors = [
    '#4299E1', // blue
    '#48BB78', // green
    '#F6AD55', // orange
    '#F56565', // red
    '#9F7AEA', // purple
    '#ED64A6', // pink
    '#38B2AC', // teal
    '#ECC94B', // yellow
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Format a phone number for display
 * @param phone - The phone number to format
 * @returns Formatted phone number or N/A if not provided
 */
export function formatAdminPhone(phone?: string): string {
  if (!phone) return 'N/A';
  
  // Basic formatting for Indian phone numbers
  // Adjust as needed for your specific requirements
  if (phone.length === 10) {
    return `+91 ${phone.substring(0, 5)} ${phone.substring(5)}`;
  }
  
  return phone;
}

/**
 * Check if a user has a specific permission
 * @param userPermissions - Array of user permissions
 * @param requiredPermission - The permission to check for
 * @returns Boolean indicating if the user has the permission
 */
export function hasAdminPermission(
  userPermissions: string[] | undefined,
  requiredPermission: string
): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;
  
  // Check for wildcard permission
  if (userPermissions.includes('*')) return true;
  
  return userPermissions.includes(requiredPermission);
}