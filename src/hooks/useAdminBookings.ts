'use client';

import { useState, useCallback } from 'react';
import { useAdminAuth } from './useAdminAuth';

// Booking status enum (must match the backend enum)
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

// Payment status enum (must match the backend enum)
export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Package {
  _id: string;
  title: string;
  slug: string;
}

interface Booking {
  _id: string;
  userId: string | User;
  packageId: string | Package;
  startDate: string;
  numberOfPeople: number;
  totalAmount: number;
  status: BookingStatus;
  paymentId?: string;
  paymentStatus: PaymentStatus;
  contactInfo: ContactInfo;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface UseAdminBookingsReturn {
  bookings: Booking[];
  pagination: Pagination;
  isLoading: boolean;
  error: string | null;
  fetchBookings: (page?: number, limit?: number, status?: BookingStatus, paymentStatus?: PaymentStatus, search?: string) => Promise<void>;
  createBooking: (bookingData: Omit<Booking, '_id' | 'createdAt' | 'updatedAt'>) => Promise<Booking | null>;
  updateBooking: (id: string, bookingData: Partial<Booking>) => Promise<Booking | null>;
  deleteBooking: (id: string) => Promise<boolean>;
  getBooking: (id: string) => Promise<Booking | null>;
}

export function useAdminBookings(): UseAdminBookingsReturn {
  const { isAdmin } = useAdminAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async (
    page: number = 1,
    limit: number = 10,
    status?: BookingStatus,
    paymentStatus?: PaymentStatus,
    search: string = ''
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
      
      if (status) params.append('status', status);
      if (paymentStatus) params.append('paymentStatus', paymentStatus);
      if (search) params.append('search', search);

      const response = await fetch(`/api/admin/bookings?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const getBooking = useCallback(async (id: string): Promise<Booking | null> => {
    if (!isAdmin) {
      setError('Admin access required');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/bookings/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch booking');
      }

      const { data } = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching booking:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const createBooking = useCallback(async (
    bookingData: Omit<Booking, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<Booking | null> => {
    if (!isAdmin) {
      setError('Admin access required');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      const { data } = await response.json();
      
      // Update the bookings list with the new booking
      setBookings(prev => [data, ...prev]);
      setPagination(prev => ({ ...prev, total: prev.total + 1 }));
      
      return data;
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const updateBooking = useCallback(async (
    id: string,
    bookingData: Partial<Booking>
  ): Promise<Booking | null> => {
    if (!isAdmin) {
      setError('Admin access required');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update booking');
      }

      const { data } = await response.json();
      
      // Update the bookings list with the updated booking
      setBookings(prev => 
        prev.map(booking => booking._id === id ? data : booking)
      );
      
      return data;
    } catch (err) {
      console.error('Error updating booking:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const deleteBooking = useCallback(async (id: string): Promise<boolean> => {
    if (!isAdmin) {
      setError('Admin access required');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete booking');
      }

      // Remove the deleted booking from the list
      setBookings(prev => prev.filter(booking => booking._id !== id));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      
      return true;
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  return {
    bookings,
    pagination,
    isLoading,
    error,
    fetchBookings,
    createBooking,
    updateBooking,
    deleteBooking,
    getBooking,
  };
}