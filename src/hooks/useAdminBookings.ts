'use client';

import { useState, useCallback } from 'react';
import { useAdminAuth } from './useAdminAuth';
import axios from 'axios';

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

      const response = await axios.get(`/api/admin/bookings?${params.toString()}`);
      setBookings(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch bookings');
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

      const response = await axios.get(`/api/admin/bookings/${id}`);
      return response.data.data;
    } catch (err: any) {
      console.error('Error fetching booking:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch booking');
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

      const response = await axios.post('/api/admin/bookings', bookingData);
      const data = response.data.data;
      
      // Update the bookings list with the new booking
      setBookings(prev => [data, ...prev]);
      setPagination(prev => ({ ...prev, total: prev.total + 1 }));
      
      return data;
    } catch (err: any) {
      console.error('Error creating booking:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create booking');
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

      const response = await axios.patch(`/api/admin/bookings/${id}`, bookingData);
      const data = response.data.data;
      
      // Update the bookings list with the updated booking
      setBookings(prev => 
        prev.map(booking => booking._id === id ? data : booking)
      );
      
      return data;
    } catch (err: any) {
      console.error('Error updating booking:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update booking');
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

      await axios.delete(`/api/admin/bookings/${id}`);

      // Remove the deleted booking from the list
      setBookings(prev => prev.filter(booking => booking._id !== id));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      
      return true;
    } catch (err: any) {
      console.error('Error deleting booking:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete booking');
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