'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Calendar,
  User,
  MapPin,
  Clock,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useAdminBookings, BookingStatus, PaymentStatus } from '@/hooks/useAdminBookings';

export default function BookingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    bookings,
    pagination,
    isLoading,
    error,
    fetchBookings,
  } = useAdminBookings();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const status = statusFilter !== 'all' ? statusFilter as BookingStatus : undefined;
    fetchBookings(currentPage, 10, status, undefined, searchQuery)
      .catch((err: Error | unknown) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: err instanceof Error ? err.message : 'Failed to fetch bookings',
        });
      });
  }, [fetchBookings, currentPage, statusFilter, toast, searchQuery]);

  console.log('all booking in the booking pages::', bookings);
  

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    const status = statusFilter !== 'all' ? statusFilter as BookingStatus : undefined;
    fetchBookings(1, 10, status, undefined, searchQuery)
      .catch((err: Error | unknown) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: err instanceof Error ? err.message : 'Failed to fetch bookings',
        });
      });
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case BookingStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800';
      case BookingStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case BookingStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case PaymentStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case PaymentStatus.REFUNDED:
        return 'bg-purple-100 text-purple-800';
      case PaymentStatus.FAILED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (isLoading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600 mt-1">Manage all your travel bookings</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by customer name, email or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <Button type="submit" className="cursor-pointer">Search</Button>
          </form>

          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="all" className="cursor-pointer">All Statuses</option>
              <option value={BookingStatus.PENDING}>Pending</option>
              <option value={BookingStatus.CONFIRMED}>Confirmed</option>
              <option value={BookingStatus.CANCELLED}>Cancelled</option>
              <option value={BookingStatus.COMPLETED}>Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings list */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No bookings found. Adjust your search or filters to see more results.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & People
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => {
                  // Get package info from populated fields, handling all possible cases
                  let packageInfo = { title: 'Unknown Package', location: 'Unknown Location' };
                  
                  // Only try to extract info if packageId is an object (not null or string)
                  if (booking.packageId && typeof booking.packageId === 'object') {
                    packageInfo = { 
                      title: (booking.packageId as { title?: string })?.title || 'Unknown Package', 
                      location: (booking.packageId as { location?: string })?.location || 'Unknown Location', 
                    };
                  }
                  
                  // Handle all possible userId cases: string, object, or null
                  let userInfo = { name: 'Unknown', email: 'Unknown' };
                  
                  if (booking.userId && typeof booking.userId === 'object') {
                    // Use userId object when it's populated
                    userInfo = { 
                      name: (booking.userId as { name?: string })?.name || 'Unknown', 
                      email: (booking.userId as { email?: string })?.email || 'Unknown', 
                    };
                  } else {
                    // Use contact info when userId is null or a string
                    userInfo = { 
                      name: booking.contactInfo?.name || 'Unknown', 
                      email: booking.contactInfo?.email || 'Unknown', 
                    };
                  }
                  
                  return (
                    <tr key={booking._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/admin/bookings/${booking._id}`)}>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 hover:text-primary">{packageInfo.title}</span>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {packageInfo.location}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            Booked on {booking.createdAt ? formatDate(booking.createdAt) : 'Unknown date'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 hover:text-primary">{userInfo.name}</span>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">{userInfo.email}</span>
                          <span className="text-xs text-gray-500 mt-1">{booking.contactInfo?.phone || 'No phone'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            <span className="text-sm text-gray-900">{booking.startDate ? formatDate(booking.startDate) : 'No date'}</span>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">
                            {booking.numberOfPeople !== undefined ? `${booking.numberOfPeople} ${booking.numberOfPeople === 1 ? 'person' : 'people'}` : 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">₹{booking.totalAmount ? booking.totalAmount.toLocaleString() : '0'}</div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(booking.paymentStatus || '')}`}>
                          {booking.paymentStatus ? booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status || '')}`}>
                          {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {e.stopPropagation(); // Prevent row click event from firing
                            router.push(`/admin/bookings/${booking._id}`);
                          }}
                          className="inline-flex items-center cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:text-gray-900 cursor-pointer'}`}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            <div className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{pagination.pages}</span>
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.pages}
              className={`flex items-center text-sm font-medium ${currentPage === pagination.pages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:text-gray-900 cursor-pointer'}`}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}