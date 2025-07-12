import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/adminUtils';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    // Get the current admin using the unified authentication system
    const admin = await getCurrentAdmin();
    console.log('got admin when In backend::', admin);
    
    
    // If not authenticated or not an admin, return 403
    if (!admin) {
      return new NextResponse('Forbidden: Admin access required', { status: 403 });
    }
    
    // Return admin data
    return NextResponse.json(admin);
  } catch (error) {
    console.error('Error getting current admin:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Register a new admin or update an existing user to have admin role
 */
export async function POST(request: Request) {
  try {
    // Get the current authenticated user
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Connect to MongoDB
    await connectDB();
    
    // Find the user in our database
    let user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      // Create a new user with admin role if they don't exist
      user = await User.create({
        clerkId: userId,
        email: body.email,
        name: body.name || 'Admin User',
        profileImage: body.profileImage,
        role: 'admin',
        permissions: [], // All admins have all permissions by default
        lastLogin: new Date(),
      });
    } else {
      // Update existing user to have admin role
      user.role = 'admin';
      user.permissions = []; // All admins have all permissions by default
      user.lastLogin = new Date();
      await user.save();
    }
    
    return NextResponse.json({
      id: user._id.toString(),
      clerkId: userId,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions,
      profileImage: user.profileImage,
      isAdmin: true,
    });
  } catch (error) {
    console.error('Error registering admin:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}