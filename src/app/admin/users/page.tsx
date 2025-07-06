'use client';

import { useState, useEffect } from 'react';
import { Search, UserCog, UserX, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminUserManagement, User } from '@/hooks/useAdminUserManagement';
export default function UsersPage() {
  const {
    users,
    isLoading: apiLoading,
    error: apiError,
    pagination,
    fetchUsers,
    updateUserRole
  } = useAdminUserManagement();
  
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  useEffect(() => {
    // Set default role filter to 'user' and load users
    setRoleFilter('user');
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await fetchUsers({
        page: pagination.page,
        limit: pagination.limit,
        role: roleFilter,
        search: searchQuery,
        sort: sortBy
      });
      if (allUsers) {
        console.log("here is the allusers in users page::", allUsers);
        
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
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
      role: roleFilter,
      search: searchQuery,
      sort: sortBy
    });
  };

  const handleRoleChange = async (role: 'all' | 'user' | 'admin') => {
    setRoleFilter(role);
    await fetchUsers({
      page: 1,
      limit: pagination.limit,
      role: role,
      search: searchQuery,
      sort: sortBy
    });
  };

  const handlePageChange = async (page: number) => {
    await fetchUsers({
      page: page,
      limit: pagination.limit,
      role: roleFilter,
      search: searchQuery,
      sort: sortBy
    });
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    setIsUpdating(true);
    try {
      await updateUserRole(userId, newRole);
      // Refresh the user list
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to update user role');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // No need for getCurrentPageUsers as pagination is handled by the API

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
          className="mt-4 flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>
      
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
        </form>
        
        <div className="flex gap-2">
          <select
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
            value={roleFilter}
            onChange={(e) => handleRoleChange(e.target.value as 'all' | 'user' | 'admin')}
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
          
          <Button 
            onClick={loadUsers}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      {filteredUsers.length === 0 ? (
        <div className="bg-gray-50 p-6 text-center rounded-lg">
          <p className="text-gray-500">No users found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
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
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.profileImage}
                              alt={user.name}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.bookingCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {user.role === 'user' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                            onClick={() => handleUpdateUserRole(user._id, 'admin')}
                            disabled={isUpdating}
                          >
                            <UserCog className="h-4 w-4" />
                            Make Admin
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                            onClick={() => handleUpdateUserRole(user._id, 'user')}
                            disabled={isUpdating}
                          >
                            <UserX className="h-4 w-4" />
                            Remove Admin
                          </Button>
                        )}
                      </div>
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
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="flex items-center gap-1"
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