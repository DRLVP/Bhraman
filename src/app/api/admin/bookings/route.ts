import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/adminUtils';
import connectDB from '@/lib/db';
import Booking, { BookingStatus, PaymentStatus } from '@/models/Booking';

/**
 * Get all bookings
 */
export async function GET(request: Request) {
  try {
    // Check if the current user is an admin
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return new NextResponse('Forbidden: Admin access required', { status: 403 });
    }
    
    // Connect to MongoDB
    await connectDB();
    
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const search = searchParams.get('search') || '';
    
    // Build query
    const query: Record<string, unknown> = {};
    
    if (status && Object.values(BookingStatus).includes(status as BookingStatus)) {
      query.status = status;
    }
    
    if (paymentStatus && Object.values(PaymentStatus).includes(paymentStatus as PaymentStatus)) {
      query.paymentStatus = paymentStatus;
    }
    
    if (search) {
      query.$or = [
        { 'contactInfo.name': { $regex: search, $options: 'i' } },
        { 'contactInfo.email': { $regex: search, $options: 'i' } },
        { 'contactInfo.phone': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get bookings with pagination and populate related data
    const bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .populate('packageId', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Booking.countDocuments(query);
    
    return NextResponse.json({
      data: bookings,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting bookings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Create a new booking (admin can create bookings on behalf of users)
 */
export async function POST(request: Request) {
  try {
    // Check if the current user is an admin
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return new NextResponse('Forbidden: Admin access required', { status: 403 });
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['userId', 'packageId', 'startDate', 'numberOfPeople', 'totalAmount', 'contactInfo'];
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
    
    // Create a new booking
    const newBooking = await Booking.create({
      ...body,
      status: body.status || BookingStatus.PENDING,
      paymentStatus: body.paymentStatus || PaymentStatus.PENDING
    });
    
    // Populate related data
    await newBooking.populate('userId', 'name email');
    await newBooking.populate('packageId', 'title slug');
    
    return NextResponse.json({
      message: 'Booking created successfully',
      data: newBooking
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}