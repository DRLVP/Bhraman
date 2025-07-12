import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/adminUtils';
import connectDB from '@/lib/db';
import Package from '@/models/Package';
import { generateSlug } from '@/lib/server-utils';

/**
 * Get all packages
 */
export async function GET(request: Request) {
  try {
    // Check if the current user is an admin
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return new NextResponse('Forbidden: Admin access required', { status: 403 });
    }
    
    // Connect to MongoDB
    await connectDB();
    
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const featured = searchParams.get('featured');
    
    // Build query
    const query: Record<string, unknown> = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (featured === 'true') {
      query.featured = true;
    } else if (featured === 'false') {
      query.featured = false;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get packages with pagination
    const packages = await Package.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Package.countDocuments(query);
    
    return NextResponse.json({
      data: packages,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error getting packages:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Create a new package
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
    const requiredFields = ['title', 'description', 'shortDescription', 'duration', 'location', 'price', 'images'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return new NextResponse(`${field} is required`, { status: 400 });
      }
    }
    
    // Connect to MongoDB
    await connectDB();
    
    // Generate slug from title
    const slug = await generateSlug(body.title);
    
    // Create a new package
    const newPackage = await Package.create({
      ...body,
      slug,
      // Set default values for arrays if not provided
      inclusions: body.inclusions || [],
      exclusions: body.exclusions || [],
      itinerary: body.itinerary || [],
      featured: body.featured || false,
    });
    
    return NextResponse.json({
      message: 'Package created successfully',
      data: newPackage,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating package:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}