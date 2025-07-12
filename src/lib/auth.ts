import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from './db';
import User from '@/models/User';

/**
 * Get the current user from Clerk and our database
 * @returns The current user or null
 */
export const getCurrentUser = async () => {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
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
        role: 'user', // Default role
        permissions: [], // No permissions by default
      });
    }
    
    if (!clerkUser) {
      return null;
    }
    
    // Update last login time
    if (dbUser) {
      dbUser.lastLogin = new Date();
      await dbUser.save();
    }
    
    return {
      id: dbUser?._id.toString(),
      clerkId: userId,
      email: dbUser?.email || clerkUser.emailAddresses[0]?.emailAddress || '',
      name: dbUser?.name || `${clerkUser.firstName} ${clerkUser.lastName}`,
      profileImage: dbUser?.profileImage || clerkUser.imageUrl,
      role: dbUser?.role || 'user',
      permissions: dbUser?.permissions || [],
      isAdmin: dbUser?.role === 'admin',
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};