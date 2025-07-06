import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import User from '@/models/User';

/**
 * Get a specific booking
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check if the user is authenticated
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Get the booking ID from the URL
    const { id } = await params;
    
    // Connect to MongoDB
    await connectDB();
    
    // Get the user from our database
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }
    
    // Check if the user has the 'user' role
    if (user.role !== 'user') {
      return new NextResponse('Only users can access bookings', { status: 403 });
    }
    
    // Find the booking
    const booking = await Booking.findById(id)
      .populate('packageId', 'title slug location duration price images description itinerary');
    
    if (!booking) {
      return new NextResponse('Booking not found', { status: 404 });
    }
    
    // Check if the booking belongs to the current user
    if (booking.userId.toString() !== user._id.toString()) {
      return new NextResponse('Forbidden: This booking does not belong to you', { status: 403 });
    }
    
    return NextResponse.json({ data: booking });
  } catch (error) {
    console.error('Error getting booking:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Cancel a booking
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check if the user is authenticated
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Get the booking ID from the URL
    const { id } = await params;
    
    // Parse the request body
    const body = await request.json();
    
    // Connect to MongoDB
    await connectDB();
    
    // Get the user from our database
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }
    
    // Check if the user has the 'user' role
    if (user.role !== 'user') {
      return new NextResponse('Only users can access bookings', { status: 403 });
    }
    
    // Find the booking
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return new NextResponse('Booking not found', { status: 404 });
    }
    
    // Check if the booking belongs to the current user
    if (booking.userId.toString() !== user._id.toString()) {
      return new NextResponse('Forbidden: This booking does not belong to you', { status: 403 });
    }
    
    // Update the booking status
    if (body.status) {
      booking.status = body.status;
      await booking.save();
    }
    
    return NextResponse.json({
      message: 'Booking updated successfully',
      status: booking.status,
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}