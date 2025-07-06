'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth as useAdmin } from '@/hooks/useAdminAuth';
import { useUser } from '@clerk/nextjs';

type AdminProtectedProps = {
  children: ReactNode;
  requiredPermission?: string;
  fallback?: ReactNode;
};

/**
 * Component to protect admin routes in the frontend
 * Redirects to sign-in page if not authenticated
 * Redirects to unauthorized page if not an admin
 */
export default function AdminProtected({
  children,
  requiredPermission,
  fallback = <div className="p-8 text-center">Loading...</div>,
}: AdminProtectedProps) {
  const router = useRouter();
  const { isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { isAdmin, isLoading: isAdminLoading, adminData, hasPermission } = useAdmin();

  useEffect(() => {
    // Wait for both user and admin status to load
    if (!isUserLoaded || isAdminLoading) return;

    console.log("AdminProtected component status:", {
      isUserLoaded,
      isSignedIn,
      isAdmin,
      isAdminLoading,
      adminData: !!adminData
    });
    
    // If not signed in, redirect to sign-in
    if (!isSignedIn) {
      console.log("AdminProtected: Redirecting to sign-in - User not signed in");
      router.push('/sign-in?redirect_url=/admin');
      return;
    }
    
    // Only redirect to unauthorized if we're sure the user is not an admin
    // Add a small delay to ensure admin data is fully loaded
    if (isSignedIn && !isAdminLoading && isAdmin === false) {
      console.log("AdminProtected: Redirecting to unauthorized - User is not an admin");
      
      // Add a small delay to ensure all data is loaded
      const redirectTimer = setTimeout(() => {
        router.push('/unauthorized');
      }, 500);
      
      return () => clearTimeout(redirectTimer);
    }

    // All admins have all permissions, no need to check specific permissions
  }, [isUserLoaded, isSignedIn, isAdmin, isAdminLoading, requiredPermission, router]);

  // Show fallback while loading or if not authorized
  if (!isUserLoaded || isAdminLoading || !isSignedIn || !isAdmin) {
    return <>{fallback}</>;
  }

  // All admins have full access, no need to check specific permissions

  // User is authenticated and authorized
  return <>{children}</>;
}