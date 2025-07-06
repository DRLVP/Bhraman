'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Calendar, 
  Users, 
  TrendingUp, 
  DollarSign,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useUserAuth';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onClick?: () => void;
}

const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  trendValue,
  onClick 
}: DashboardCardProps) => {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm p-6 
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
          {trend && trendValue && (
            <div className="flex items-center mt-2">
              <span 
                className={`
                  flex items-center text-sm font-medium
                  ${trend === 'up' ? 'text-green-500' : ''}
                  ${trend === 'down' ? 'text-red-500' : ''}
                  ${trend === 'neutral' ? 'text-gray-500' : ''}
                `}
              >
                {trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                {trend === 'down' && <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />}
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary bg-opacity-10 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
};

interface RecentBookingProps {
  id: string;
  packageName: string;
  customerName: string;
  date: string;
  amount: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const RecentBooking = ({ 
  id, 
  packageName, 
  customerName, 
  date, 
  amount, 
  status 
}: RecentBookingProps) => {
  const router = useRouter();
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  
  return (
    <tr 
      className="hover:bg-gray-50 cursor-pointer"
      onClick={() => router.push(`/admin/bookings/${id}`)}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{packageName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customerName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{date}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{amount}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>
    </tr>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    recentBookings: [] as RecentBookingProps[]
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/admin/dashboard');
        // const data = await response.json();
        // setStats(data);
        
        // For now, we'll use mock data
        setStats({
          totalPackages: 12,
          totalBookings: 48,
          totalUsers: 156,
          totalRevenue: 245000,
          pendingBookings: 5,
          recentBookings: [
            {
              id: '1',
              packageName: 'Sikkim Explorer',
              customerName: 'Rahul Sharma',
              date: '2023-06-15',
              amount: '₹24,500',
              status: 'confirmed'
            },
            {
              id: '2',
              packageName: 'Darjeeling Hills',
              customerName: 'Priya Patel',
              date: '2023-06-12',
              amount: '₹18,900',
              status: 'pending'
            },
            {
              id: '3',
              packageName: 'Gangtok Adventure',
              customerName: 'Amit Kumar',
              date: '2023-06-10',
              amount: '₹32,000',
              status: 'confirmed'
            },
            {
              id: '4',
              packageName: 'Pelling Retreat',
              customerName: 'Sneha Gupta',
              date: '2023-06-08',
              amount: '₹15,750',
              status: 'cancelled'
            },
            {
              id: '5',
              packageName: 'Lachung Winter',
              customerName: 'Vikram Singh',
              date: '2023-06-05',
              amount: '₹28,300',
              status: 'confirmed'
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.firstName || 'Admin'}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Total Packages"
          value={stats.totalPackages}
          icon={<Package className="h-6 w-6 text-primary" />}
          onClick={() => router.push('/admin/packages')}
        />
        <DashboardCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<Calendar className="h-6 w-6 text-primary" />}
          onClick={() => router.push('/admin/bookings')}
        />
        <DashboardCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-6 w-6 text-primary" />}
          onClick={() => router.push('/admin/users')}
        />
        <DashboardCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6 text-primary" />}
          trend="up"
          trendValue="12% from last month"
        />
        <DashboardCard
          title="Pending Bookings"
          value={stats.pendingBookings}
          icon={<Clock className="h-6 w-6 text-primary" />}
          description="Requires your attention"
          onClick={() => router.push('/admin/bookings/pending')}
        />
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentBookings.map((booking) => (
                <RecentBooking key={booking.id} {...booking} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <button 
            onClick={() => router.push('/admin/bookings')}
            className="text-primary hover:text-primary-dark font-medium text-sm"
          >
            View all bookings
          </button>
        </div>
      </div>
    </div>
  );
}