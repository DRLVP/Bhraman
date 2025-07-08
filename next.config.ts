import type { NextConfig } from "next";

// Next.js automatically loads environment variables from .env files
// No need to manually load them using @next/env

const nextConfig: NextConfig = {
  /* config options here */
  
  // Configure middleware to handle both user and admin authentication
  experimental: {
    // Add any valid experimental options here if needed
  },
  
  // Configure images to allow Cloudinary and Unsplash domains
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'via.placeholder.com', 'img.clerk.com'],
  },
  
  // Add webpack configuration to handle Node.js modules
  webpack: (config, { isServer }) => {
    // If client-side (browser), provide empty modules for Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

export default nextConfig;
