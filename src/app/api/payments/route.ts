import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import User from '@/models/User';
import Package from '@/models/Package';
import { PaymentStatus } from '@/models/Booking';

/**
 * Get all payments for the current user
 */
export async function GET() {
  try {
    // Check if the user is authenticated
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Connect to MongoDB
    await connectDB();
    
    // Get the user from our database
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }
    
    // Check if the user has the 'user' role
    if (user.role !== 'user') {
      return new NextResponse('Only users can access payment history', { status: 403 });
    }
    
    // Get bookings with payment information for this user
    const bookings = await Booking.find({ 
      userId: user._id,
      // Only include bookings that have payment information
      $or: [
        { paymentStatus: PaymentStatus.COMPLETED },
        { paymentStatus: PaymentStatus.REFUNDED },
        { paymentId: { $exists: true, $ne: null } }
      ]
    })
    .lean() // Use lean() to get plain JavaScript objects instead of Mongoose documents
    .sort({ createdAt: -1 });
    
    // Get all package IDs from bookings
    const packageIds = bookings.map(booking => booking.packageId);
    
    // Fetch all packages in a single query
    const packages = await Package.find({ _id: { $in: packageIds } }).lean();
    
    // Create a map of package IDs to package titles for quick lookup
    const packageMap = {};
    packages.forEach(pkg => {
      packageMap[pkg._id.toString()] = pkg.title;
    });
    
    // Transform bookings into payment records
    const payments = bookings.map(booking => {
      // Get package name from the map, or use a default
      const packageId = booking.packageId.toString();
      const packageName = packageMap[packageId] || 'Package';
      
      return {
        id: booking.paymentId || `PAY-${booking._id}`,
        bookingId: booking._id,
        packageName,
        amount: booking.totalAmount,
        status: booking.paymentStatus,
        date: booking.updatedAt || booking.createdAt,
        paymentMethod: booking.paymentId ? 'Online Payment' : 'Direct Payment',
        // Additional payment details could be added here if available
      };
    });
    
    return NextResponse.json({
      data: payments,
    });
  } catch (error) {
    console.error('Error getting payment history:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}