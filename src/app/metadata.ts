import { Metadata } from 'next';
import axios from 'axios';

// Generate metadata dynamically
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch home config from API
    // Using absolute URL to avoid TypeError: Invalid URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const { data: responseData } = await axios.get(`${baseUrl}/api/home-config`, {
      headers: { 'Cache-Control': 'max-age=3600' }, // Revalidate every hour
    });
    
    const { data } = responseData;
    
    // Return dynamic metadata if available, otherwise fallback to defaults
    return {
      title: data?.seo?.title || 'Bhraman - Explore the Beauty of India',
      description: data?.seo?.description || 'Discover amazing places and create unforgettable memories with our premium travel packages',
      keywords: data?.seo?.keywords || ['travel', 'india', 'packages', 'tours'],
    };
  } catch (err: unknown) {
    console.error('Error generating metadata:', err);
    return metadata; // Return default metadata on error
  }
}

// Default metadata
export const metadata: Metadata = {
  title: 'Bhraman - Explore the Beauty of India',
  description: 'Discover amazing places and create unforgettable memories with our premium travel packages',
  keywords: ['travel', 'india', 'packages', 'tours'],
};