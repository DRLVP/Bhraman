'use client';

import { useState, useCallback } from 'react';
import { useAdminAuth } from './useAdminAuth';

interface Package {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  duration: number;
  location: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    image?: string;
  }[];
  featured: boolean;
  maxGroupSize: number;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface UseAdminPackagesReturn {
  packages: Package[];
  pagination: Pagination;
  isLoading: boolean;
  error: string | null;
  fetchPackages: (page?: number, limit?: number, search?: string, featured?: boolean) => Promise<void>;
  createPackage: (packageData: Omit<Package, '_id' | 'slug' | 'createdAt' | 'updatedAt'>) => Promise<Package | null>;
  updatePackage: (id: string, packageData: Partial<Package>) => Promise<Package | null>;
  deletePackage: (id: string) => Promise<boolean>;
  getPackage: (id: string) => Promise<Package | null>;
}

export function useAdminPackages(): UseAdminPackagesReturn {
  const { isAdmin } = useAdminAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = useCallback(async (
    page: number = 1,
    limit: number = 10,
    search: string = '',
    featured?: boolean
  ) => {
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      if (search) params.append('search', search);
      if (featured !== undefined) params.append('featured', featured.toString());

      const response = await fetch(`/api/admin/packages?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch packages');
      }

      const data = await response.json();
      setPackages(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const getPackage = useCallback(async (id: string): Promise<Package | null> => {
    if (!isAdmin) {
      setError('Admin access required');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/packages/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch package');
      }

      const { data } = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching package:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const createPackage = useCallback(async (
    packageData: Omit<Package, '_id' | 'slug' | 'createdAt' | 'updatedAt'>
  ): Promise<Package | null> => {
    if (!isAdmin) {
      setError('Admin access required');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(packageData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create package');
      }

      const { data } = await response.json();
      
      // Update the packages list with the new package
      setPackages(prev => [data, ...prev]);
      setPagination(prev => ({ ...prev, total: prev.total + 1 }));
      
      return data;
    } catch (err) {
      console.error('Error creating package:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const updatePackage = useCallback(async (
    id: string,
    packageData: Partial<Package>
  ): Promise<Package | null> => {
    if (!isAdmin) {
      setError('Admin access required');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/packages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(packageData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update package');
      }

      const { data } = await response.json();
      
      // Update the packages list with the updated package
      setPackages(prev => 
        prev.map(pkg => pkg._id === id ? data : pkg)
      );
      
      return data;
    } catch (err) {
      console.error('Error updating package:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const deletePackage = useCallback(async (id: string): Promise<boolean> => {
    if (!isAdmin) {
      setError('Admin access required');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/packages/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete package');
      }

      // Remove the deleted package from the list
      setPackages(prev => prev.filter(pkg => pkg._id !== id));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      
      return true;
    } catch (err) {
      console.error('Error deleting package:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  return {
    packages,
    pagination,
    isLoading,
    error,
    fetchPackages,
    createPackage,
    updatePackage,
    deletePackage,
    getPackage,
  };
}