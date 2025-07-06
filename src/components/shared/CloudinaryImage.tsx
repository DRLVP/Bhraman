'use client';

import { CldImage } from 'next-cloudinary';
import { useState } from 'react';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
}

/**
 * CloudinaryImage component that wraps the CldImage component from next-cloudinary
 * with additional error handling and fallback image support
 */
export function CloudinaryImage({
  src,
  alt,
  width = 800,
  height = 600,
  sizes,
  className = '',
  priority = false,
  fallbackSrc = 'https://via.placeholder.com/800x600?text=Image+Not+Found',
}: CloudinaryImageProps) {
  const [error, setError] = useState(false);

  // Check if the src is a Cloudinary URL or public ID
  const isCloudinaryUrl = src?.includes('cloudinary.com');
  const isPublicId = src && !src.startsWith('http') && !src.startsWith('/');

  // If there's an error or no valid source, show the fallback image
  if (error || !src) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  // If it's a Cloudinary URL or public ID, use CldImage
  if (isCloudinaryUrl || isPublicId) {
    return (
      <CldImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={className}
        priority={priority}
        onError={() => setError(true)}
      />
    );
  }

  // For other URLs, use a regular img tag
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
    />
  );
}