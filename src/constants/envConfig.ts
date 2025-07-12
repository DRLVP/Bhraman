// Environment variables in Next.js are automatically loaded from .env files
// and made available via process.env in server components
// For client components, we need to prefix them with NEXT_PUBLIC_

// Client-side environment variables (safe to use in client components)
// Only include variables prefixed with NEXT_PUBLIC_
export const envConfig = {
  // Clerk authentication - client-side
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  
  // Clerk custom pages - client-side
  clerkSignInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  clerkSignUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  clerkAfterSignInUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
  clerkAfterSignUpUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
  
  // Cloudinary - client-side
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  
  // Admin routes - static values, safe for client
  adminSignInUrl: '/sign-in',
  adminDashboardUrl: '/admin',
};

// Server-side environment variables (only use in server components or API routes)
// These will throw errors if accessed from client components
export const serverEnvConfig = {
  mongoDbUrl: process.env.MONGODB_URI,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  
  // Cloudinary - server-side
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
};