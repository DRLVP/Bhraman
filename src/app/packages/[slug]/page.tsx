'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Users, Check, X, ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import usePackageStore from '@/store/usePackageStore';
import Image from 'next/image';


export default function PackageDetailPage() {
  const params = useParams();
  const { slug } = params;
  
  const { 
    currentPackage, 
    isLoadingPackage, 
    packageError, 
    fetchPackageBySlug, 
  } = usePackageStore();
  
  // Fetch package data on component mount
  useEffect(() => {
    if (slug) {
      fetchPackageBySlug(slug as string);
    }
  }, [slug, fetchPackageBySlug]);
  
  // Loading state
  if (isLoadingPackage) {
    return (
      <div className="container mx-auto py-20 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Error state
  if (packageError) {
    return (
      <div className="container mx-auto py-20 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{packageError}</p>
          <Link href="/packages" className="mt-4 inline-flex items-center text-primary hover:text-primary-dark transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Packages
          </Link>
        </div>
      </div>
    );
  }
  
  // Package not found state
  if (!currentPackage) {
    return (
      <div className="container mx-auto py-20 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Package Not Found</h2>
          <p className="mb-6">The package you are looking for does not exist or has been removed.</p>
          <Link href="/packages">
            <Button>Browse All Packages</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Destructure package data for easier access
  const packageData = currentPackage;

  console.log('package data in single package page::', packageData);
  

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/packages" className="flex items-center text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Packages
          </Link>
        </div>

        {/* Package Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{packageData.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-1 text-primary" />
              {packageData.location}
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-1 text-primary" />
              {packageData.duration}
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-1 text-primary" />
              Max {packageData.maxGroupSize} people
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {packageData.images.map((image, index) => (
            <div 
              key={index} 
              className={`rounded-lg overflow-hidden ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
            >
              <Image
                src={image} 
                alt={`${packageData.title} - Image ${index + 1}`} 
                className="w-full h-full object-cover"
                style={{ height: index === 0 ? '400px' : '200px' }}
                width={index === 0 ? 600 : 300}
                height={index === 0 ? 400 : 200}
              />
            </div>
          ))}
        </div>

        {/* Price and Booking */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <p className="text-gray-600 mb-1">Price per person</p>
              <div className="flex items-center">
                {packageData.discountedPrice ? (
                  <>
                    <span className="text-gray-400 line-through text-lg">₹{packageData.price.toLocaleString()}</span>
                    <span className="text-3xl font-bold text-gray-900 ml-2">₹{packageData.discountedPrice.toLocaleString()}</span>
                    <span className="ml-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                      {Math.round(((packageData.price - packageData.discountedPrice) / packageData.price) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">₹{packageData.price.toLocaleString()}</span>
                )}
              </div>
            </div>
            <Link href={`/book/${packageData.slug}`} className="mt-4 md:mt-0">
              <Button size="lg" className="px-8">
                Book Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Package Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-600 mb-8 whitespace-pre-line">{packageData.description}</p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Itinerary</h2>
            <div className="space-y-6 mb-8">
              {packageData.itinerary.map((day) => (
                <div key={day.day} className="border-l-4 border-primary pl-4 pb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Day {day.day}: {day.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{day.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Inclusions</h3>
              <ul className="space-y-2">
                {packageData.inclusions.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Exclusions</h3>
              <ul className="space-y-2">
                {packageData.exclusions.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        

        {/* Call to Action */}
        <div className="bg-primary text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Explore {packageData.title}</h2>
          <p className="text-lg mb-6">Book your adventure today and create memories that will last a lifetime.</p>
          <Link href={`/book/${packageData.slug}`}>
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Book This Package
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}