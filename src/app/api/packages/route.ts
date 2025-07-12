import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Package from '@/models/Package';

/**
 * GET handler for fetching packages with optional filtering
 */
export async function GET(request: Request) {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const duration = searchParams.get('duration') || '';
    const priceRange = searchParams.get('priceRange') || '';
    const sortBy = searchParams.get('sortBy') || 'popular';
    const featured = searchParams.get('featured') || '';
    
    // Build query
    const query: Record<string, unknown> = {};
    
    // Add search filter (search in title and description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Add location filter
    if (location && location !== 'All Locations') {
      query.location = location;
    }
    
    // Add duration filter
    if (duration && duration !== 'Any Duration') {
      // Parse duration ranges like "1-3 Days", "4-7 Days", etc.
      const durationParts = duration.split(' ')[0].split('-');
      if (durationParts.length === 2) {
        const [min, max] = durationParts.map(Number);
        query.duration = { $gte: min, $lte: max };
      } else if (duration.includes('+')) {
        // Handle "7+ Days" format
        const min = parseInt(duration.split('+')[0]);
        query.duration = { $gte: min };
      }
    }
    
    // Add price range filter
    if (priceRange && priceRange !== 'Any Price') {
      // Parse price ranges like "$0-$500", "$500-$1000", etc.
      const priceParts = priceRange.replace(/\$/g, '').split('-');
      if (priceParts.length === 2) {
        const [min, max] = priceParts.map(Number);
        query.price = { $gte: min, $lte: max };
      } else if (priceRange.includes('+')) {
        // Handle "$1000+" format
        const min = parseInt(priceRange.replace(/\$/g, '').split('+')[0]);
        query.price = { $gte: min };
      }
    }
    
    // Add featured filter
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Determine sort order
    let sortOptions = {};
    switch (sortBy) {
      case 'price-low-high':
        sortOptions = { price: 1 };
        break;
      case 'price-high-low':
        sortOptions = { price: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'popular':
      default:
        // Assuming higher rating means more popular
        sortOptions = { featured: -1, price: 1 };
        break;
    }
    
    // Execute query
    const packages = await Package.find(query).sort(sortOptions);
    
    return NextResponse.json({ data: packages });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}