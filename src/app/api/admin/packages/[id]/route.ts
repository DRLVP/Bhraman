import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/adminUtils';
import connectDB from '@/lib/db';
import Package from '@/models/Package';
import { generateSlug } from '@/lib/server-utils';

/**
 * Get a specific package by ID
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
    
    const { id } = await params;
    
    // Get the package by ID
    const packageData = await Package.findById(id);
    
    if (!packageData) {
      return new NextResponse('Package not found', { status: 404 });
    }
    
    return NextResponse.json({ data: packageData });
  } catch (error) {
    console.error('Error getting package:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Update a package
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
    
    const { id } = await params;
    
    // Find the package to update
    const packageToUpdate = await Package.findById(id);
    
    if (!packageToUpdate) {
      return new NextResponse('Package not found', { status: 404 });
    }
    
    // Generate new slug if title is updated
    if (body.title && body.title !== packageToUpdate.title) {
      body.slug = await generateSlug(body.title);
    }
    
    // Use the _id from the request body if available, otherwise use the id from params
    // This ensures compatibility with MongoDB's _id field
    const documentId = body._id || id;
    
    // Remove _id from the body to avoid MongoDB errors when updating
    if (body._id) {
      delete body._id;
    }
    
    // Update the package
    const updatedPackage = await Package.findByIdAndUpdate(
      documentId,
      { $set: body },
      { new: true, runValidators: true },
    );
    
    return NextResponse.json({
      message: 'Package updated successfully',
      data: updatedPackage,
    });
  } catch (error) {
    console.error('Error updating package:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Delete a package
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
    
    const { id } = await params;
    
    // Find the package to delete
    const packageToDelete = await Package.findById(id);
    
    if (!packageToDelete) {
      return new NextResponse('Package not found', { status: 404 });
    }
    
    // Delete the package
    await Package.findByIdAndDelete(id);
    
    return NextResponse.json({
      message: 'Package deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting package:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}