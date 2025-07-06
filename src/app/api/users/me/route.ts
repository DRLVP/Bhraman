import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
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
    
    // Connect to MongoDB
    await connectDB();
    
    // Find the user in our database
    const dbUser = await User.findOne({ clerkId: userId });
    
    if (!dbUser) {
      // Return basic Clerk user data if not found in our database
      return NextResponse.json({
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
        profileImage: clerkUser.imageUrl,
        role: 'user',
      });
    }
    
    // Return user data from our database
    return NextResponse.json({
      id: dbUser._id.toString(),
      clerkId: dbUser.clerkId,
      email: dbUser.email,
      name: dbUser.name,
      phone: dbUser.phone || '',
      profileImage: dbUser.profileImage,
      role: dbUser.role,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}