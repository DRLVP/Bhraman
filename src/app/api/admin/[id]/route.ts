import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/adminUtils';
import connectDB from '@/lib/db';
import User from '@/models/User';

/**
 * Get a specific admin user by ID
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check if the current user is an admin
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return new NextResponse('Forbidden: Admin access required', { status: 403 });
    }
    
    // Connect to MongoDB
    await connectDB();
    
    // Await params before accessing its properties
    const { id } = await params;
    
    // Get the admin by ID
    const adminUser = await User.findOne({ _id: id, role: 'admin' })
      .select('_id name email permissions lastLogin');
    
    if (!adminUser) {
      return new NextResponse('Admin not found', { status: 404 });
    }
    
    return NextResponse.json({ data: adminUser });
  } catch (error) {
    console.error('Error getting admin:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Update an admin user
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
    
    // Await params before accessing its properties
    const { id } = await params;
    
    // Determine which ID to use for finding the document
    const documentId = body._id || id;
    
    // Remove _id from body to prevent MongoDB errors
    if (body._id) {
      delete body._id;
    }
    
    // Find the admin to update
    const adminToUpdate = await User.findOne({ _id: documentId, role: 'admin' });
    
    if (!adminToUpdate) {
      return new NextResponse('Admin not found', { status: 404 });
    }
    
    // Update the admin
    if (body.name) {adminToUpdate.name = body.name;}
    if (body.email) {adminToUpdate.email = body.email;}
    if (body.phone) {adminToUpdate.phone = body.phone;}
    if (body.permissions) {adminToUpdate.permissions = body.permissions;}
    
    await adminToUpdate.save();
    
    return NextResponse.json({
      message: 'Admin updated successfully',
      data: adminToUpdate,
    });
  } catch (error) {
    console.error('Error updating admin:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Delete an admin user
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check if the current user is an admin
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return new NextResponse('Forbidden: Admin access required', { status: 403 });
    }
    
    // Connect to MongoDB
    await connectDB();
    
    // Await params before accessing its properties
    const { id } = await params;
    
    // Find the admin to delete
    const adminToDelete = await User.findOne({ _id: id, role: 'admin' });
    
    if (!adminToDelete) {
      return new NextResponse('Admin not found', { status: 404 });
    }
    
    // Don't allow deleting yourself
    if (adminToDelete._id.toString() === admin.id) {
      return new NextResponse('Cannot delete your own admin account', { status: 400 });
    }
    
    // Update the user role to 'user' instead of deleting the account
    adminToDelete.role = 'user';
    adminToDelete.permissions = [];
    await adminToDelete.save();
    
    return NextResponse.json({
      message: 'Admin removed successfully',
    });
  } catch (error) {
    console.error('Error removing admin:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}