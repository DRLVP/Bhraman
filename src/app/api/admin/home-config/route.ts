import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/adminUtils';
import connectDB from '@/lib/db';
import HomeConfig from '@/models/HomeConfig';

/**
 * Get home page configuration
 */
export async function GET() {
  try {
    // Check if the current user is an admin
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return new NextResponse('Forbidden: Admin access required', { status: 403 });
    }
    
    // Connect to MongoDB
    await connectDB();
    
    // Get the home config (there should only be one)
    let homeConfig = await HomeConfig.findOne();
    
    // If no config exists, create a default one
    if (!homeConfig) {
      homeConfig = await HomeConfig.create({
        siteSettings: {
          logo: ''
        },
        heroSection: {
          heading: 'Explore the Beauty of India',
          subheading: 'Discover amazing travel experiences',
          backgroundImage: '/images/default-hero.jpg',
          ctaText: 'Explore Packages',
          ctaLink: '/packages'
        },
        featuredPackagesSection: {
          heading: 'Featured Packages',
          subheading: 'Our most popular travel experiences',
          packageIds: []
        },
        testimonialsSection: {
          heading: 'What Our Customers Say',
          subheading: 'Read testimonials from our satisfied travelers',
          testimonials: []
        },
        aboutSection: {
          heading: 'About Us',
          content: 'We are a travel company dedicated to providing exceptional travel experiences in India.',
          image: '/images/default-about.jpg'
        },
        contactSection: {
          heading: 'Contact Us',
          subheading: 'Get in touch with our team',
          email: 'contact@example.com',
          phone: '+91 1234567890',
          address: 'New Delhi, India',
          workingHours: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed'
        },
        seo: {
          title: 'Bhraman - Explore India',
          description: 'Discover amazing travel experiences in India',
          keywords: ['travel', 'india', 'tourism', 'packages']
        }
      });
    }
    
    return NextResponse.json({ data: homeConfig });
  } catch (error) {
    console.error('Error getting home config:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Update home page configuration
 */
export async function PATCH(request: Request) {
  try {
    // Check if the current user is an admin
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return new NextResponse('Forbidden: Admin access required', { status: 403 });
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Remove _id from body to prevent MongoDB errors
    if (body._id) {
      delete body._id;
    }
    
    // Connect to MongoDB
    await connectDB();
    
    // Get the existing config or create a new one
    let homeConfig = await HomeConfig.findOne();
    
    if (!homeConfig) {
      // Create a new config with the provided data
      homeConfig = await HomeConfig.create(body);
    } else {
      // Update the existing config
      // We use a deep merge approach to update nested objects
      
      // Update siteSettings if provided
      if (body.siteSettings) {
        homeConfig.siteSettings = {
          ...(homeConfig.siteSettings as unknown as Record<string, unknown>),
          ...body.siteSettings
        };
      }
      
      // Update heroSection if provided
      if (body.heroSection) {
        homeConfig.heroSection = {
          ...(homeConfig.heroSection as unknown as Record<string, unknown>),
          ...body.heroSection
        };
      }
      
      // Update featuredPackagesSection if provided
      if (body.featuredPackagesSection) {
        homeConfig.featuredPackagesSection = {
          ...(homeConfig.featuredPackagesSection as unknown as Record<string, unknown>),
          ...body.featuredPackagesSection
        };
      }
      
      // Update testimonialsSection if provided
      if (body.testimonialsSection) {
        homeConfig.testimonialsSection = {
          ...(homeConfig.testimonialsSection as unknown as Record<string, unknown>),
          ...body.testimonialsSection
        };
      }
      
      // Update aboutSection if provided
      if (body.aboutSection) {
        homeConfig.aboutSection = {
          ...(homeConfig.aboutSection as unknown as Record<string, unknown>),
          ...body.aboutSection
        };
      }
      
      // Update contactSection if provided
      if (body.contactSection) {
        homeConfig.contactSection = {
          ...(homeConfig.contactSection as unknown as Record<string, unknown>),
          ...body.contactSection
        };
      }
      
      // Update SEO if provided
      if (body.seo) {
        homeConfig.seo = {
          ...(homeConfig.seo as unknown as Record<string, unknown>),
          ...body.seo
        };
      }
      
      // For keywords array, replace the entire array if provided
        if (body.seo.keywords) {
          homeConfig.seo.keywords = body.seo.keywords;
        }
      }
      
      // Save the updated config
      await homeConfig.save();
    }
    
    return NextResponse.json({
      message: 'Home configuration updated successfully',
      data: homeConfig
    });
  } catch (error) {
    console.error('Error updating home config:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
