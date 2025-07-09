import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import Booking, { BookingStatus, PaymentStatus } from '@/models/Booking';
import User from '@/models/User';
import mongoose from 'mongoose';

// Import Package model - make sure it's loaded before use
import '@/models/Package';
// Now get the model from mongoose models
const Package = mongoose.models.Package;

/**
 * Create a new booking
 */
export async function POST(request: Request) {
  try {
    // Check if the user is authenticated
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['packageId', 'startDate', 'numberOfPeople', 'totalAmount', 'contactInfo'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return new NextResponse(`${field} is required`, { status: 400 });
      }
    }
    
    // Validate contact info
    const requiredContactFields = ['name', 'email', 'phone'];
    for (const field of requiredContactFields) {
      if (!body.contactInfo[field]) {
        return new NextResponse(`contactInfo.${field} is required`, { status: 400 });
      }
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
      return new NextResponse('Only users can book packages', { status: 403 });
    }
    
    // Create a new booking with pending status
    const newBooking = await Booking.create({
      userId: user._id,
      packageId: new mongoose.Types.ObjectId(body.packageId),
      startDate: new Date(body.startDate),
      numberOfPeople: body.numberOfPeople,
      totalAmount: body.totalAmount,
      status: BookingStatus.PENDING, // Set status to pending for admin confirmation
      paymentStatus: PaymentStatus.PENDING, // Set payment status to pending for admin to mark as completed
      contactInfo: body.contactInfo,
      specialRequests: body.specialRequests || '',
    });
    
    return NextResponse.json({
      message: 'Booking created successfully',
      bookingId: newBooking._id.toString(),
      status: newBooking.status,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Get all bookings for the current user
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
      return new NextResponse('Only users can access bookings', { status: 403 });
    }
    
    // Get bookings for this user
    const bookings = await Booking.find({ userId: user._id })
      .populate('packageId', 'title slug location duration price images')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      data: bookings,
    });
  } catch (error) {
    console.error('Error getting bookings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}