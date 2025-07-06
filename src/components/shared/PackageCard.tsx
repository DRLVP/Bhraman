'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Package card props interface
 */
interface PackageCardProps {
  id: string;
  title: string;
  slug: string;
  location: string;
  duration: number;
  price: number;
  discountedPrice?: number;
  image: string;
  maxGroupSize: number;
  featured?: boolean;
}

/**
 * Package card component for displaying travel packages
 */
const PackageCard = ({
  id,
  title,
  slug,
  location,
  duration,
  price,
  discountedPrice,
  image,
  maxGroupSize,
  featured = false,
}: PackageCardProps) => {
  // Calculate discount percentage if discounted price is available
  const discountPercentage = discountedPrice
    ? Math.round(((price - discountedPrice) / price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Image container with relative positioning for the featured badge */}
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        {featured && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
            Featured
          </div>
        )}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{title}</h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Package details */}
        <div className="flex justify-between mb-3">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-sm">{duration} days</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            <span className="text-sm">Max {maxGroupSize}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            {discountedPrice ? (
              <div className="flex items-center">
                <span className="text-lg font-bold text-primary">₹{discountedPrice.toLocaleString('en-IN')}</span>
                <span className="text-sm text-gray-500 line-through ml-2">₹{price.toLocaleString('en-IN')}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-primary">₹{price.toLocaleString('en-IN')}</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          <Link href={`/packages/${slug}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          <Link href={`/book/${id}`} className="flex-1">
            <Button className="w-full">Book Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;