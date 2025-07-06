'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock,
  Package,
  UserCog,
  UserX,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserDetailProps {
  params: {
    id: string;
  };
}

interface Booking {
  _id: string;
  packageName: string;
  startDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  createdAt: string;
}

interface UserDetail {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  profileImage?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  bookings: Booking[];
  bookingCount: number;
}

export default function UserDetailPage({ params }: UserDetailProps) {
  const router = useRouter();
  const { id } = params;
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/users/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        setUser(data);
      } catch (error: any) {
        console.error('Error fetching user:', error);
        setError(error.message || 'Failed to load user details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const updateUserRole = async (newRole: 'user' | 'admin') => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user role');
      }
      
      // Update local state
      setUser(prev => prev ? { ...prev, role: newRole } : null);
    } catch (error: any) {
      console.error('Error updating user role:', error);
      setError(error.message || 'Failed to update user role. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteUser = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }
      
      router.push('/admin/users');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      setError(error.message || 'Failed to delete user. Please try again.');
      setShowDeleteConfirm(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        {error || 'User not found'}
        <div className="mt-4">
          <Link 
            href="/admin/users"
            className="text-primary hover:underline"
          >
            Return to users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link 
          href="/admin/users"
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </Link>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-xl font-medium">
                {user.name.charAt(0)}
              </span>
            )}
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600 flex items-center gap-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                {user.role === 'admin' ? 'Admin' : 'User'}
              </span>
              <span className="mx-1">•</span>
              <Clock className="h-4 w-4 mr-1" />
              Joined {formatDate(user.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {user.role === 'user' ? (
            <Button
              onClick={() => updateUserRole('admin')}
              disabled={isUpdating}
              className="flex items-center gap-1"
            >
              <UserCog className="h-4 w-4" />
              Make Admin
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => updateUserRole('user')}
              disabled={isUpdating}
              className="flex items-center gap-1"
            >
              <UserX className="h-4 w-4" />
              Remove Admin
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isUpdating}
            className="flex items-center gap-1 text-red-500 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete User
          </Button>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone and will remove all user data including bookings.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={deleteUser}
                disabled={isUpdating}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isUpdating ? 'Deleting...' : 'Delete User'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Information Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">User Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-500">Email</div>
                <div className="text-gray-900">{user.email}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-500">Phone</div>
                <div className="text-gray-900">{user.phone || 'Not provided'}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-500">Joined</div>
                <div className="text-gray-900">{formatDate(user.createdAt)}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-500">Last Updated</div>
                <div className="text-gray-900">{formatDateTime(user.updatedAt)}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Package className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-500">Total Bookings</div>
                <div className="text-gray-900">{user.bookingCount}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bookings Card */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Bookings</h2>
          
          {user.bookings.length === 0 ? (
            <div className="bg-gray-50 p-6 text-center rounded-lg">
              <p className="text-gray-500">No bookings found for this user.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Package
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {user.bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.packageName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(booking.startDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{booking.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          href={`/admin/bookings/${booking._id}`}
                          className="text-primary hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}