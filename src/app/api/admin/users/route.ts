import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/adminUtils';
import connectDB from '@/lib/db';
import User from '@/models/User';

/**
 * Get all users with pagination, filtering, and sorting
 */
export async function GET(request: Request) {
  try {
    // Check if the current user is an admin
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return new NextResponse('Forbidden: Admin access required', { status: 403 });
    }
    
    // Parse query parameters
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const role = url.searchParams.get('role') || 'all';
    const sort = url.searchParams.get('sort') || 'name';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Connect to MongoDB
    await connectDB();
    
    // Build query
    const query: Record<string, unknown> = {};
    
    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Add role filter
    if (role !== 'all') {
      query.role = role;
    }
    
    // Count total documents
    const total = await User.countDocuments(query);
    
    // Get users with pagination and sorting
    const users = await User.find(query)
      .select('_id clerkId name email phone profileImage role createdAt updatedAt')
      .sort({ [sort]: sort === 'createdAt' ? -1 : 1 })
      .skip(skip)
      .limit(limit);
    
    // Get booking counts for each user
    const usersWithBookingCounts = await Promise.all(
      users.map(async (user) => {
        // Count bookings for this user
        const bookingCount = await import('@/models/Booking')
          .then(module => module.default.countDocuments({ userId: user._id }));
        
        return {
          ...user.toObject(),
          _id: user._id.toString(),
          bookingCount
        };
      })
    );
    
    // Calculate pagination info
    const pages = Math.ceil(total / limit);
    
    return NextResponse.json({
      data: usersWithBookingCounts,
      pagination: {
        total,
        page,
        limit,
        pages
      }
    });
  } catch (error) {
    console.error('Error getting users:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}