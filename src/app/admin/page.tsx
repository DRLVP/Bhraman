'use client';

import { useRouter } from 'next/navigation';
import { 
  Package, 
  Calendar, 
  Users, 
  TrendingUp, 
  IndianRupee,
  Clock,
  RefreshCw,
  BarChart,
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { Button } from '@/components/ui/button';
import MonthlyStatsChart from '@/components/admin/MonthlyStatsChart';

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
  onClick, 
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
  status, 
}: RecentBookingProps) => {
  const router = useRouter();
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
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
  const { adminData } = useAdminAuth();
  const { stats, isLoading, error, refreshStats } = useAdminDashboard();
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        {error}
        <Button 
          onClick={refreshStats} 
          variant="outline" 
          className="mt-4 flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }
  
  if (!stats) {
    return (
      <div className="bg-yellow-50 text-yellow-600 p-4 rounded-md">
        No dashboard data available.
        <Button 
          onClick={refreshStats} 
          variant="outline" 
          className="mt-4 flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {adminData?.name || 'Admin'}!</p>
        </div>
        <Button 
          onClick={refreshStats}
          variant="outline"
          className="flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
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
          value={formatCurrency(stats.totalRevenue)}
          icon={<IndianRupee className="h-6 w-6 text-primary" />}
          // We could calculate trend if we had historical data
          // trend="up"
          // trendValue="12% from last month"
        />
        <DashboardCard
          title="Pending Bookings"
          value={stats.pendingBookings}
          icon={<Clock className="h-6 w-6 text-primary" />}
          description="Requires your attention"
          onClick={() => router.push('/admin/bookings?status=pending')}
        />
      </div>

      {/* Monthly Statistics Chart */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <BarChart className="h-5 w-5 text-primary mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Monthly Statistics</h2>
        </div>
        <MonthlyStatsChart monthlyStats={stats.monthlyStats} />
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
                <RecentBooking 
                  key={booking.id} 
                  id={booking.id}
                  packageName={booking.packageName}
                  customerName={booking.customerName}
                  date={formatDate(booking.date)}
                  amount={formatCurrency(parseFloat(booking.amount))}
                  status={booking.status as 'pending' | 'confirmed' | 'cancelled'}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <button 
            onClick={() => router.push('/admin/bookings')}
            className="text-primary hover:text-primary-dark font-medium text-sm cursor-pointer"
          >
            View all bookings
          </button>
        </div>
      </div>
    </div>
  );
}