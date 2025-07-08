import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/adminUtils';
import connectDB from '@/lib/db';
import Package from '@/models/Package';
import Booking, { BookingStatus } from '@/models/Booking';
import User from '@/models/User';

/**
 * Get dashboard statistics
 */
export async function GET() {
  try {
    // Check if the current user is an admin
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return new NextResponse('Forbidden: Admin access required', { status: 403 });
    }
    
    // Connect to MongoDB
    await connectDB();
    
    // Get counts
    const totalPackages = await Package.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const pendingBookings = await Booking.countDocuments({ status: BookingStatus.PENDING });
    
    // Calculate total revenue
    const revenueResult = await Booking.aggregate([
      {
        $match: {
          status: { $in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    
    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('packageId', 'title')
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Format recent bookings for the dashboard
    const formattedRecentBookings = recentBookings.map(booking => ({
      id: booking._id.toString(),
      packageName: booking.packageId ? (booking.packageId as any).title : 'Unknown Package',
      customerName: booking.userId ? (booking.userId as any).name : booking.contactInfo.name,
      date: booking.createdAt.toISOString(),
      amount: booking.totalAmount.toString(),
      status: booking.status
    }));
    
    // Get monthly booking statistics for the current year
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);
    
    const monthlyStats = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear, $lte: endOfYear }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Format monthly stats (fill in missing months with zeros)
    const formattedMonthlyStats = Array.from({ length: 12 }, (_, i) => {
      const monthData = monthlyStats.find(stat => stat._id === i + 1);
      return {
        month: i + 1,
        count: monthData ? monthData.count : 0,
        revenue: monthData ? monthData.revenue : 0
      };
    });
    
    return NextResponse.json({
      data: {
        totalPackages,
        totalBookings,
        totalUsers,
        totalRevenue,
        pendingBookings,
        recentBookings: formattedRecentBookings,
        monthlyStats: formattedMonthlyStats
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}