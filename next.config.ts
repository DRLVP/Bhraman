import type { NextConfig } from "next";

// Next.js automatically loads environment variables from .env files
// No need to manually load them using @next/env

const nextConfig: NextConfig = {
  /* config options here */
  
  // Configure middleware to handle both user and admin authentication
  experimental: {
    // Add any valid experimental options here if needed
    optimizeCss: true, // Enable CSS optimization
    scrollRestoration: true, // Improve scroll restoration for better UX
  },
  
  // Configure images to allow Cloudinary and Unsplash domains
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'via.placeholder.com', 'img.clerk.com'],
    formats: ['image/avif', 'image/webp'], // Prefer modern image formats
    minimumCacheTTL: 60, // Cache images for at least 60 seconds
  },
  
  // Production optimizations
  poweredByHeader: false, // Remove X-Powered-By header for security
  compress: true, // Enable compression
  reactStrictMode: true, // Enable React strict mode for better error detection
  swcMinify: true, // Use SWC minifier for better performance
  
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
    
    // Optimize bundle size in production
    if (process.env.NODE_ENV === 'production') {
      // Enable tree shaking and module concatenation
      config.optimization.usedExports = true;
    }
    
    return config;
  },
  
  // Disable telemetry for privacy and performance
  telemetry: false,
};

export default nextConfig;
