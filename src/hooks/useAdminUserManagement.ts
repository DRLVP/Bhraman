'use client';

import { useState, useCallback } from 'react';
import { useAdminAuth } from './useAdminAuth';

// User interface
export interface User {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  profileImage?: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  bookingCount: number;
}

// User details interface with recent bookings
export interface UserDetail extends User {
  recentBookings: {
    _id: string;
    packageName: string;
    startDate: string;
    status: string;
    totalAmount: number;
    createdAt: string;
  }[];
}

// Pagination interface
interface PaginationOptions {
  page: number;
  limit: number;
}

// Filter options
interface FilterOptions {
  search?: string;
  role?: 'user' | 'admin' | 'all';
  sort?: string;
}

// Response interface
interface UsersResponse {
  data: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Hook return interface
interface UseAdminUserManagementReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  fetchUsers: (options?: Partial<PaginationOptions & FilterOptions>) => Promise<UsersResponse | null>;
  getUser: (id: string) => Promise<UserDetail | null>;
  updateUserRole: (id: string, role: 'user' | 'admin') => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
}

/**
 * Custom hook for managing users in the admin panel
 */
export function useAdminUserManagement(): UseAdminUserManagementReturn {
  const { isAdmin } = useAdminAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    pages: number;
  }>({ total: 0, page: 1, limit: 10, pages: 0 });

  /**
   * Fetch users with pagination and filtering
   */
  const fetchUsers = useCallback(async (
    options?: Partial<PaginationOptions & FilterOptions>
  ): Promise<UsersResponse | null> => {
    if (!isAdmin) {
      setError('Admin access required');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (options?.page) params.append('page', options.page.toString());
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.search) params.append('search', options.search);
      if (options?.role) params.append('role', options.role);
      if (options?.sort) params.append('sort', options.sort);

      // Fetch users from API
      const response = await fetch(`/api/admin/users?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data.data);
      setPagination(data.pagination);

      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  /**
   * Get a specific user by ID
   */
  const getUser = useCallback(async (id: string): Promise<UserDetail | null> => {
    if (!isAdmin) {
      setError('Admin access required');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/users/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { data } = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  /**
   * Update a user's role
   */
  const updateUserRole = useCallback(async (
    id: string,
    role: 'user' | 'admin'
  ): Promise<User | null> => {
    if (!isAdmin) {
      setError('Admin access required');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { data } = await response.json();
      
      // Update local state if the user is in the list
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === id ? { ...user, role } : user
        )
      );

      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to update user role');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  /**
   * Delete a user
   */
  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    if (!isAdmin) {
      setError('Admin access required');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Remove user from local state
      setUsers(prevUsers => prevUsers.filter(user => user._id !== id));

      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  return {
    users,
    isLoading,
    error,
    pagination,
    fetchUsers,
    getUser,
    updateUserRole,
    deleteUser,
  };
}