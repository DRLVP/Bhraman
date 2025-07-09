import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Package from '@/models/Package';

/**
 * Get a specific package by slug
 */
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    // Connect to MongoDB
    await connectDB();
    
    const { slug } = params;
    
    // Get the package by slug
    const packageData = await Package.findOne({ slug });
    
    if (!packageData) {
      return new NextResponse('Package not found', { status: 404 });
    }
    
    return NextResponse.json({ data: packageData });
  } catch (error) {
    console.error('Error getting package:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}