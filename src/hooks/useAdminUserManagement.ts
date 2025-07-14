'use client';

import { useState, useCallback } from 'react';
import { useAdminAuth } from './useAdminAuth';
import axios from 'axios';
import { getErrorMessage } from '@/lib/errorUtils';

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
    options?: Partial<PaginationOptions & FilterOptions>,
  ): Promise<UsersResponse | null> => {
    // Allow the fetch to proceed even if isAdmin is false
    // The API will handle the permission check and return appropriate error
    // This prevents unnecessary blocking at the hook level

    try {
      setIsLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (options?.page) {params.append('page', options.page.toString());}
      if (options?.limit) {params.append('limit', options.limit.toString());}
      if (options?.search) {params.append('search', options.search);}
      if (options?.role) {params.append('role', options.role);}
      if (options?.sort) {params.append('sort', options.sort);}

      // Fetch users from API
      const response = await axios.get(`/api/admin/users?${params.toString()}`);
      
      setUsers(response.data.data);
      setPagination(response.data.pagination);

      return response.data;
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Failed to fetch users');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  /**
   * Get a specific user by ID
   */
  const getUser = useCallback(async (id: string): Promise<UserDetail | null> => {
    // Allow the API call to proceed and let the server handle permission checks
    // This prevents unnecessary blocking at the hook level

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(`/api/admin/users/${id}`);
      return response.data.data;
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Failed to fetch user');
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
    role: 'user' | 'admin',
  ): Promise<User | null> => {
    // Allow the API call to proceed and let the server handle permission checks
    // This prevents unnecessary blocking at the hook level

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.patch(`/api/admin/users/${id}`, { role });
      
      // Update local state if the user is in the list
      setUsers((prevUsers) => 
        prevUsers.map((user) => 
          user._id === id ? { ...user, role } : user,
        ),
      );

      return response.data.data;
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Failed to update user role');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  /**
   * Delete a user
   */
  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    // Allow the API call to proceed and let the server handle permission checks
    // This prevents unnecessary blocking at the hook level

    try {
      setIsLoading(true);
      setError(null);

      await axios.delete(`/api/admin/users/${id}`);

      // Remove user from local state
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));

      return true;
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Failed to delete user');
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