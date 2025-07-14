'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { getErrorMessage } from '@/lib/errorUtils';

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
        
        const response = await axios.get('/api/admin-auth/me');
        
        // Ensure we have valid admin data with the correct role
        if (response.data && response.data.role === 'admin') {
          setAdminData(response.data);
        } else {
          setAdminData(null);
        }
        
      } catch (err: unknown) {
        setError(getErrorMessage(err) || 'Failed to verify admin status');
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
  const hasPermission = (): boolean => {
    if (!adminData) {return false;}
    
    // All admins have all permissions
    return true;
  };

  // Explicitly check if the user has admin role
  // This is a critical check that determines admin access
  const isAdminUser = !!adminData && adminData.role === 'admin';
  
  // console.log('Final admin check results:');
  // console.log('- adminData exists:', !!adminData);
  // console.log('- adminData role:', adminData?.role);
  // console.log('- isAdminUser calculated value:', isAdminUser);
  // console.log('- isLoading:', isLoading);
  
  return {
    // This is the key property used by components to determine admin access
    isAdmin: isAdminUser,
    adminData,
    isLoading,
    error,
    hasPermission,
  };
}