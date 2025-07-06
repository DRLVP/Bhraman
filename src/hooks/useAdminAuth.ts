'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

type AdminData = {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  profileImage?: string;
  isAdmin: boolean;
};

/**
 * Hook to check if the current user has admin access
 * and retrieve admin-specific data
 */
export function useAdminAuth() {
  const { isSignedIn, user } = useUser();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!isSignedIn || !user) {
        console.log('User not signed in or no user data');
        setAdminData(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching admin data for user:', user.id);
        const response = await axios.get('/api/admin-auth/me');
        console.log("API response for admin check:", JSON.stringify(response.data));
        
        // Ensure we have valid admin data with the correct role
        if (response.data && response.data.role === 'admin') {
          console.log("Valid admin data received:", response.data);
          setAdminData(response.data);
        } else {
          console.log("Invalid or non-admin data received:", response.data);
          setAdminData(null);
        }
        
      } catch (err: any) {
        console.error('Error checking admin status:', err);
        setError(err.response?.data || 'Failed to verify admin status');
        setAdminData(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminStatus();
  }, [isSignedIn, user]);

  /**
   * Check if the admin has a specific permission
   * @param permission - The permission to check
   * @returns Boolean indicating if the admin has the permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!adminData) return false;
    
    // All admins have all permissions
    return true;
  };

  // Explicitly check if the user has admin role
  // This is a critical check that determines admin access
  const isAdminUser = !!adminData && adminData.role === 'admin';
  
  console.log('Final admin check results:');
  console.log('- adminData exists:', !!adminData);
  console.log('- adminData role:', adminData?.role);
  console.log('- isAdminUser calculated value:', isAdminUser);
  console.log('- isLoading:', isLoading);
  
  return {
    // This is the key property used by components to determine admin access
    isAdmin: isAdminUser,
    adminData,
    isLoading,
    error,
    hasPermission,
  };
}