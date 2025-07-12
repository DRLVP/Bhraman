'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from './useAdminAuth';
import axios from 'axios';

// Dashboard statistics interface
export interface DashboardStats {
  totalPackages: number;
  totalBookings: number;
  totalUsers: number;
  totalRevenue: number;
  pendingBookings: number;
  recentBookings: {
    id: string;
    packageName: string;
    customerName: string;
    date: string;
    amount: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  }[];
  monthlyStats: {
    month: number;
    count: number;
    revenue: number;
  }[];
}

/**
 * Custom hook for fetching admin dashboard statistics
 */
export function useAdminDashboard() {
  const { isAdmin } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch dashboard statistics
   */
  const fetchDashboardStats = async (): Promise<void> => {
    if (!isAdmin) {
      setError('Admin access required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get('/api/admin/dashboard');
      setStats(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard statistics');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch stats on mount
  useEffect(() => {
    fetchDashboardStats();
  }, [isAdmin, fetchDashboardStats]);

  return {
    stats,
    isLoading,
    error,
    refreshStats: fetchDashboardStats,
  };
}