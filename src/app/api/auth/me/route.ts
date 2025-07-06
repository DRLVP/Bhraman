import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  const { userId } = await auth();

  // If not authenticated, return 401
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Get user from Clerk
    const clerkUser = await currentUser();
    
    // Connect to MongoDB
    await connectDB();

    // Find or create user in our database
    let dbUser = await User.findOne({ clerkId: userId });
    
    if (!dbUser && clerkUser) {
      // Create new user in our database if they don't exist
      dbUser = await User.create({
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
        profileImage: clerkUser.imageUrl,
      });
    }

    if (!clerkUser) {
      return null;
    }
    // Return user data
    return NextResponse.json({
      id: dbUser?._id.toString(),
      clerkId: userId,
      email: dbUser?.email || clerkUser.emailAddresses[0]?.emailAddress || '',
      name: dbUser?.name || `${clerkUser.firstName} ${clerkUser.lastName}`,
      profileImage: dbUser?.profileImage || clerkUser.imageUrl,
      role: dbUser?.role || 'user', // Include user role in the response
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}