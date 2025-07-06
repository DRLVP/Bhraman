'use client';

import { useState, useCallback } from 'react';
import { useAdminAuth } from './useAdminAuth';

// Admin user interface
export interface AdminUser {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  profileImage?: string;
  phone?: string;
  role: 'admin';
  permissions: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Pagination interface
interface PaginationOptions {
  page: number;
  limit: number;
}

// Response interface
interface AdminUsersResponse {
  data: AdminUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface UseAdminUsersReturn {
  admins: AdminUser[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  fetchAdmins: (options?: Partial<PaginationOptions & { search?: string }>) => Promise<AdminUsersResponse | null>;
  getAdmin: (id: string) => Promise<AdminUser | null>;
  createAdmin: (email: string, permissions?: string[]) => Promise<AdminUser | null>;
  updateAdmin: (id: string, data: Partial<AdminUser>) => Promise<AdminUser | null>;
  deleteAdmin: (id: string) => Promise<boolean>;
}

export function useAdminUsers(): UseAdminUsersReturn {
  const { isAdmin } = useAdminAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    pages: number;
  }>({ total: 0, page: 1, limit: 10, pages: 0 });

  const fetchAdmins = useCallback(async (
    options?: Partial<PaginationOptions & { search?: string }>
  ): Promise<AdminUsersResponse | null> => {
    if (!isAdmin) {
      setError('Admin access required');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (options?.page) queryParams.append('page', options.page.toString());
      if (options?.limit) queryParams.append('limit', options.limit.toString());
      if (options?.search) queryParams.append('search', options.search);

      const response = await fetch(`/api/admin?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch admin users');
      }

      const data: AdminUsersResponse = await response.json();
      setAdmins(data.data);
      setPagination(data.pagination);
      return data;
    } catch (err) {
      console.error('Error fetching admin users:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const getAdmin = useCallback(async (id: string): Promise<AdminUser | null> => {
    if (!isAdmin) {
      setError('Admin access required');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch admin user');
      }

      const { data } = await response.json();
      return data;
    } catch (err) {
      console.error(`Error fetching admin user ${id}:`, err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const createAdmin = useCallback(async (
    email: string,
    permissions: string[] = []
  ): Promise<AdminUser | null> => {
    if (!isAdmin) {
      setError('Admin access required');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, permissions }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create admin user');
      }

      const { data } = await response.json();
      
      // Update the local state with the new admin
      setAdmins(prevAdmins => [...prevAdmins, data]);
      setPagination(prev => ({ ...prev, total: prev.total + 1 }));
      
      return data;
    } catch (err) {
      console.error('Error creating admin user:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const updateAdmin = useCallback(async (
    id: string,
    data: Partial<AdminUser>
  ): Promise<AdminUser | null> => {
    if (!isAdmin) {
      setError('Admin access required');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update admin user');
      }

      const { data: updatedAdmin } = await response.json();
      
      // Update the local state with the updated admin
      setAdmins(prevAdmins => 
        prevAdmins.map(admin => 
          admin._id === id ? updatedAdmin : admin
        )
      );
      
      return updatedAdmin;
    } catch (err) {
      console.error(`Error updating admin user ${id}:`, err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const deleteAdmin = useCallback(async (id: string): Promise<boolean> => {
    if (!isAdmin) {
      setError('Admin access required');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete admin user');
      }

      // Update the local state by removing the deleted admin
      setAdmins(prevAdmins => prevAdmins.filter(admin => admin._id !== id));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      
      return true;
    } catch (err) {
      console.error(`Error deleting admin user ${id}:`, err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  return {
    admins,
    isLoading,
    error,
    pagination,
    fetchAdmins,
    getAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin,
  };
}