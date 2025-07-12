import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/adminUtils';
import connectDB from '@/lib/db';
import Booking, { BookingStatus, PaymentStatus } from '@/models/Booking';

/**
 * Get a specific booking by ID
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
    
    const { id } = params;
    
    // Get the booking by ID and populate related data
    const booking = await Booking.findById(id)
      .populate('userId', 'name email phone')
      .populate('packageId');
    
    if (!booking) {
      return new NextResponse('Booking not found', { status: 404 });
    }
    
    return NextResponse.json({ data: booking });
  } catch (error) {
    console.error('Error getting booking:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Update a booking
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
    
    // Connect to MongoDB
    await connectDB();
    
    const { id } = params;
    
    // Find the booking to update
    const bookingToUpdate = await Booking.findById(id);
    
    if (!bookingToUpdate) {
      return new NextResponse('Booking not found', { status: 404 });
    }
    
    // Validate status if provided
    if (body.status && !Object.values(BookingStatus).includes(body.status)) {
      return new NextResponse('Invalid booking status', { status: 400 });
    }
    
    // Validate payment status if provided
    if (body.paymentStatus && !Object.values(PaymentStatus).includes(body.paymentStatus)) {
      return new NextResponse('Invalid payment status', { status: 400 });
    }
    
    // Use the _id from the request body if available, otherwise use the id from params
    // This ensures compatibility with MongoDB's _id field
    const documentId = body._id || id;
    
    // Remove _id from the body to avoid MongoDB errors when updating
    if (body._id) {
      delete body._id;
    }
    
    // Update the booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      documentId,
      { $set: body },
      { new: true, runValidators: true },
    )
      .populate('userId', 'name email phone')
      .populate('packageId');
    
    return NextResponse.json({
      message: 'Booking updated successfully',
      data: updatedBooking,
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Delete a booking
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
    
    const { id } = params;
    
    // Find the booking to delete
    const bookingToDelete = await Booking.findById(id);
    
    if (!bookingToDelete) {
      return new NextResponse('Booking not found', { status: 404 });
    }
    
    // Delete the booking
    await Booking.findByIdAndDelete(id);
    
    return NextResponse.json({
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}