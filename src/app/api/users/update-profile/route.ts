import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    // Check if the user is authenticated
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Get the current user from Clerk
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new NextResponse('User not found', { status: 404 });
    }
    
    // Parse the request body
    const body = await request.json();
    const { firstName, lastName, phone } = body;
    
    // Connect to MongoDB
    await connectDB();
    
    // Find the user in our database
    let dbUser = await User.findOne({ clerkId: userId });
    
    if (!dbUser) {
      // Create a new user if they don't exist in our database
      dbUser = new User({
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: `${firstName || clerkUser.firstName} ${lastName || clerkUser.lastName}`,
        phone: phone || '',
        profileImage: clerkUser.imageUrl,
      });
    } else {
      // Update existing user
      dbUser.name = `${firstName || clerkUser.firstName} ${lastName || clerkUser.lastName}`;
      if (phone) dbUser.phone = phone;
    }
    
    // Save the user
    await dbUser.save();
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: dbUser._id.toString(),
        clerkId: userId,
        email: dbUser.email,
        name: dbUser.name,
        phone: dbUser.phone,
        profileImage: dbUser.profileImage,
        role: dbUser.role,
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}