import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AdminStats {
  totalPackages: number;
  totalBookings: number;
  totalUsers: number;
  totalRevenue: number;
  pendingBookings: number;
}

interface RecentBooking {
  id: string;
  packageName: string;
  customerName: string;
  date: string;
  amount: string;
  status: string;
}

interface MonthlyStats {
  month: number;
  count: number;
  revenue: number;
}

interface AdminState {
  // Dashboard stats
  stats: AdminStats;
  recentBookings: RecentBooking[];
  monthlyStats: MonthlyStats[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchDashboardData: () => Promise<void>;
  resetError: () => void;
}

export const useAdminStore = create<AdminState>(
  devtools(
    persist(
      (set) => ({
        // Initial state
        stats: {
          totalPackages: 0,
          totalBookings: 0,
          totalUsers: 0,
          totalRevenue: 0,
          pendingBookings: 0,
        },
        recentBookings: [],
        monthlyStats: [],
        isLoading: false,
        error: null,
        
        // Actions
        fetchDashboardData: async () => {
          try {
            set({ isLoading: true, error: null });
            
            const response = await fetch('/api/admin/dashboard');
            
            if (!response.ok) {
              throw new Error('Failed to fetch dashboard data');
            }
            
            const { data } = await response.json();
            
            set({
              stats: {
                totalPackages: data.totalPackages,
                totalBookings: data.totalBookings,
                totalUsers: data.totalUsers,
                totalRevenue: data.totalRevenue,
                pendingBookings: data.pendingBookings,
              },
              recentBookings: data.recentBookings,
              monthlyStats: data.monthlyStats,
              isLoading: false,
            });
          } catch (error) {
            console.error('Error fetching dashboard data:', error);
            set({
              error: error instanceof Error ? error.message : 'An unknown error occurred',
              isLoading: false,
            });
          }
        },
        
        resetError: () => set({ error: null }),
      }),
      {
        name: 'admin-store',
        // Only persist specific parts of the state
        partialize: (state) => ({
          stats: state.stats,
          recentBookings: state.recentBookings,
          monthlyStats: state.monthlyStats,
        }),
      }
    )
  )
);