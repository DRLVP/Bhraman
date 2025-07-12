'use client';

import { useState, useEffect } from 'react';
import { Search, RefreshCw, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminUserManagement, User } from '@/hooks/useAdminUserManagement';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import Image from 'next/image';

export default function UsersPage() {
  const { isAdmin, isLoading: authLoading } = useAdminAuth();
  const { toast } = useToast();
  const {
    users,
    isLoading: apiLoading,
    error: apiError,
    pagination,
    fetchUsers,
  } = useAdminUserManagement();
  console.log('is admin check in admin users page::', isAdmin);
  
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy] = useState<string>('name');

  useEffect(() => {
    // Load users when component mounts and isAdmin is available
    if (!authLoading) {
      loadUsers();
    }
  }, [authLoading, loadUsers]);
  console.log('users list in admin users page::', users);
  
  const loadUsers = async () => {
    // Don't show error toast during initial loading
    if (authLoading) {
      return;
    }
    
    if (!isAdmin) {
      setError('Admin access required');
      console.log('is admin in users page in::', isAdmin);
      toast({
        title: 'Access Denied',
        description: 'Admin access is required to view this page',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await fetchUsers({
        page: pagination.page,
        limit: pagination.limit,
        role: 'user',
        search: searchQuery,
        sort: sortBy,
      });
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (users) {
      setFilteredUsers(users);
    }
    if (apiError) {
      setError(apiError);
    }
    if (!apiLoading) {
      setIsLoading(false);
    }
  }, [users, apiError, apiLoading]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchUsers({
      page: 1,
      limit: pagination.limit,
      role: 'user',
      search: searchQuery,
      sort: sortBy,
    });
  };

  const handlePageChange = async (page: number) => {
    await fetchUsers({
      page: page,
      limit: pagination.limit,
      role: 'user',
      search: searchQuery,
      sort: sortBy,
    });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAdmin && !authLoading) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        Admin access required to view this page
        <Button 
          onClick={() => window.location.href = '/'} 
          variant="outline" 
          className="mt-4 flex items-center gap-2 cursor-pointer"
        >
          Return to Home
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        {error}
        <Button 
          onClick={loadUsers} 
          variant="outline" 
          className="mt-4 flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Registered Users</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <form onSubmit={handleSearch} className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="submit" 
            className="absolute right-0 top-0 h-full px-3 rounded-l-none cursor-pointer"
          >
            Search
          </Button>
        </form>
        
        <div className="flex gap-2">
          <Button 
            onClick={loadUsers}
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      {filteredUsers.length === 0 ? (
        <div className="bg-gray-50 p-6 text-center rounded-lg shadow-sm">
          <p className="text-gray-500">No users found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.profileImage ? (
                            <Image
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.profileImage}
                              alt={user.name}
                              width={40}
                              height={40}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 font-medium">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {user.phone || 'Not provided'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.bookingCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/users/${user._id}`}
                        className="text-primary hover:text-primary-dark cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}