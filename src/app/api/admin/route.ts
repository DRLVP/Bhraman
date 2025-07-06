import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/adminUtils';
import connectDB from '@/lib/db';
import User from '@/models/User';

/**
 * Get all admin users
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
    
    // Get all admin users
    const admins = await User.find({ role: 'admin' })
      .select('_id name email permissions lastLogin')
      .sort({ name: 1 });
    
    return NextResponse.json({ data: admins });
  } catch (error) {
    console.error('Error getting admins:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Create a new admin user
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
    if (!body.email || !body.name) {
      return new NextResponse('Email and name are required', { status: 400 });
    }
    
    // Connect to MongoDB
    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email });
    
    if (existingUser) {
      // If user exists but is not an admin, update to admin
      if (existingUser.role !== 'admin') {
        existingUser.role = 'admin';
        existingUser.permissions = body.permissions || [];
        await existingUser.save();
        
        return NextResponse.json({
          message: 'User promoted to admin successfully',
          data: existingUser
        });
      }
      
      return new NextResponse('Admin with this email already exists', { status: 400 });
    }
    
    // Create a new admin user
    const newAdmin = await User.create({
      email: body.email,
      name: body.name,
      phone: body.phone,
      role: 'admin',
      permissions: body.permissions || []
    });
    
    return NextResponse.json({
      message: 'Admin created successfully',
      data: newAdmin
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating admin:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}