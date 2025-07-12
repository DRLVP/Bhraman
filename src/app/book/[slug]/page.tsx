'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingForm from '@/components/forms/BookingForm';
import useAuth from '@/hooks/useUserAuth';
import axios from 'axios';
import Image from 'next/image';
import { IPackage } from '@/models/Package';

export default function BookPackagePage({ params }: { params: { slug: string } }) {
  // Use React.use() to unwrap params object as recommended by Next.js
  const { slug } = use(params);
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [packageInfo, setPackageInfo] = useState<IPackage | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // Redirect to Clerk's sign-in page with return URL
      router.push(`/sign-in?redirect_url=${encodeURIComponent(`/book/${slug}`)}`);
    }
  }, [isLoaded, isSignedIn, router, slug]);

  useEffect(() => {
    // Fetch the package data based on the slug
    const fetchPackage = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/packages/${slug}`);
        // Make sure we're accessing the data property from the API response
        setPackageInfo(response.data.data);
      } catch (err: Error | unknown) {
        setError(
          (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || 
          (err instanceof Error ? err.message : 'Package not found')
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackage();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !packageInfo) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600 mb-6">{error || 'Package not found'}</p>
        <Link href="/packages">
          <Button>Browse All Packages</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href={`/packages/${packageInfo.slug}`} className="flex items-center text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Package Details
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <Image
                src={packageInfo.images && packageInfo.images.length > 0 ? packageInfo.images[0] : '/placeholder-image.jpg'} 
                alt={packageInfo.title} 
                className="h-48 w-full object-cover md:h-full md:w-48"
                width={300}
                height={300}
              />
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Book {packageInfo.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                <div>{packageInfo.location}</div>
                <div>•</div>
                <div>{packageInfo.duration}</div>
                <div>•</div>
                <div>Max {packageInfo.maxGroupSize} people</div>
              </div>
              <div className="mb-2">
                <span className="text-gray-600">Price per person:</span>
              </div>
              <div className="flex items-center">
                {packageInfo.discountedPrice ? (
                  <>
                    <span className="text-gray-400 line-through text-lg">₹{packageInfo.price ? packageInfo.price.toLocaleString() : '0'}</span>
                    <span className="text-2xl font-bold text-gray-900 ml-2">₹{packageInfo.discountedPrice ? packageInfo.discountedPrice.toLocaleString() : '0'}</span>
                    <span className="ml-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                      {Math.round(((packageInfo.price || 0) - (packageInfo.discountedPrice || 0)) / (packageInfo.price || 1) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">₹{packageInfo.price ? packageInfo.price.toLocaleString() : '0'}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Information</h2>
          <BookingForm 
            packageId={packageInfo._id} 
            packageName={packageInfo.title}
            price={packageInfo.price}
            discountedPrice={packageInfo.discountedPrice}
            maxGroupSize={packageInfo.maxGroupSize}
          />
        </div>
      </div>
    </main>
  );
}