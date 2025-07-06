import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/adminUtils';
import connectDB from '@/lib/db';
import User from '@/models/User';

/**
 * Get a specific user by ID
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if the current user is an admin
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return new NextResponse('Forbidden: Admin access required', { status: 403 });
    }
    
    // Connect to MongoDB
    await connectDB();
    
    // Get the user by ID
    const user = await User.findById(params.id)
      .select('_id clerkId name email phone profileImage role createdAt updatedAt');
    
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }
    
    // Get user's bookings
    const Booking = (await import('@/models/Booking')).default;
    const bookings = await Booking.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('packageId', 'name');
    
    // Count total bookings
    const bookingCount = await Booking.countDocuments({ userId: user._id });
    
    // Format user data
    const userData = {
      ...user.toObject(),
      _id: user._id.toString(),
      bookingCount,
      recentBookings: bookings.map((booking: any) => ({
        _id: booking._id.toString(),
        packageName: booking.packageId?.name || 'Unknown Package',
        startDate: booking.startDate,
        status: booking.status,
        totalAmount: booking.totalAmount,
        createdAt: booking.createdAt
      }))
    };
    
    return NextResponse.json({ data: userData });
  } catch (error) {
    console.error('Error getting user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Update a user's role
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if the current user is an admin
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return new NextResponse('Forbidden: Admin access required', { status: 403 });
    }
    
    // Parse the request body
    const body = await request.json();
    const { role } = body;
    
    // Validate role
    if (role !== 'user' && role !== 'admin') {
      return new NextResponse('Invalid role', { status: 400 });
    }
    
    // Connect to MongoDB
    await connectDB();
    
    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      { role },
      { new: true }
    ).select('_id name email role');
    
    if (!updatedUser) {
      return new NextResponse('User not found', { status: 404 });
    }
    
    return NextResponse.json({
      message: `User role updated to ${role}`,
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Delete a user
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if the current user is an admin
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return new NextResponse('Forbidden: Admin access required', { status: 403 });
    }
    
    // Connect to MongoDB
    await connectDB();
    
    // Delete the user
    const deletedUser = await User.findByIdAndDelete(params.id);
    
    if (!deletedUser) {
      return new NextResponse('User not found', { status: 404 });
    }
    
    return NextResponse.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}