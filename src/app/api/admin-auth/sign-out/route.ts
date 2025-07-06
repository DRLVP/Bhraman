import { NextResponse } from 'next/server';
import { auth, clerkClient, createClerkClient } from '@clerk/nextjs/server';
import { envConfig, serverEnvConfig } from '@/constants/envConfig';

export async function POST() {
  try {
    // Get the current session information
    const { sessionId } = await auth();
    
    if (!sessionId) {
      return new NextResponse('No active session', { status: 400 });
    }
    
    // Create a Clerk client
    const clerkClient = createClerkClient({
      publishableKey: envConfig.clerkPublishableKey,
      secretKey: serverEnvConfig.clerkSecretKey
    });
    
    // Revoke the session using the Clerk client
    await clerkClient.sessions.revokeSession(sessionId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error signing out:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}