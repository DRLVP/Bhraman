import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import HomeConfig from '@/models/HomeConfig';

/**
 * Get home page configuration for public access
 */
export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Get the home config (there should only be one)
    const homeConfig = await HomeConfig.findOne();
    
    // If no config exists, return a 404
    if (!homeConfig) {
      return new NextResponse('Home configuration not found', { status: 404 });
    }
    
    return NextResponse.json({ data: homeConfig });
  } catch (error) {
    console.error('Error getting home config:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}