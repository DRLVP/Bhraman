'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  MapPin, 
  Users, 
  IndianRupee,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminBookings, PaymentStatus } from '@/hooks/useAdminBookings';
import { useToast } from '@/components/ui/use-toast';

interface BookingDetailProps {
  params: {
    id: string;
  };
}

interface BookingDetail {
  id: string;
  packageId: string;
  packageName: string;
  packageLocation: string;
  packageImage: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  startDate: string;
  numberOfPeople: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: PaymentStatus;
  paymentId?: string;
  paymentMethod?: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export default function BookingDetailPage({ params }: BookingDetailProps) {
  const router = useRouter();
  const { id } = params;
  const { getBooking, updateBooking } = useAdminBookings();
  const { toast } = useToast();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setIsLoading(true);
        setError(null); // Reset error state before fetching
        
        // Directly fetch from API instead of using the hook to ensure we get the latest data
        const response = await axios.get(`/api/admin/bookings/${id}`);
        
        const { data: bookingData } = response.data;
        console.log("bookingData in page", bookingData);
        
        if (bookingData) {
          // Transform the data to match our BookingDetail interface
          const transformedBooking: BookingDetail = {
            id: bookingData._id,
            packageId: bookingData.packageId === null ? '' : (typeof bookingData.packageId === 'string' ? bookingData.packageId : bookingData.packageId._id),
            packageName: bookingData.packageId === null ? 'Unknown Package' : (typeof bookingData.packageId === 'string' ? '' : bookingData.packageId.title),
            packageLocation: bookingData.packageId === null ? 'Unknown Location' : (typeof bookingData.packageId === 'string' ? '' : bookingData.packageId.location || ''),
            packageImage: bookingData.packageId === null ? '' : (typeof bookingData.packageId === 'string' ? '' : bookingData.packageId?.images?.[0] || ''),
            userId: bookingData.userId === null ? '' : (typeof bookingData.userId === 'string' ? bookingData.userId : bookingData.userId._id),
            userName: bookingData.userId === null ? bookingData.contactInfo?.name || '' : (typeof bookingData.userId === 'string' ? '' : bookingData.userId.name),
            userEmail: bookingData.userId === null ? bookingData.contactInfo?.email || '' : (typeof bookingData.userId === 'string' ? '' : bookingData.userId.email),
            userPhone: bookingData.userId === null ? bookingData.contactInfo?.phone || '' : (typeof bookingData.userId === 'string' ? '' : bookingData.userId?.phone || ''),
            startDate: bookingData.startDate || new Date().toISOString(),
            numberOfPeople: bookingData.numberOfPeople || 0,
            totalAmount: bookingData.totalAmount || 0,
            status: bookingData.status || 'pending',
            paymentStatus: bookingData.paymentStatus || 'pending',
            paymentId: bookingData.paymentId || '',
            paymentMethod: 'Cash', // Default payment method since we don't have Razorpay
            contactInfo: bookingData.contactInfo || { name: '', email: '', phone: '' },
            specialRequests: bookingData.specialRequests || '',
            createdAt: bookingData.createdAt || new Date().toISOString(),
            updatedAt: bookingData.updatedAt || new Date().toISOString()
          };
          
          setBooking(transformedBooking);
        } else {
          setError('Booking not found');
        }
      } catch (err: any) {
        console.error('Error fetching booking:', err);
        setError(err.response?.data?.message || 'Failed to load booking details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, [id]);

  const updateBookingStatus = async (status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    if (!booking) return;
    
    setIsUpdating(true);
    try {
      const updatedBooking = await updateBooking(id, { status });
      
      if (updatedBooking) {
        // Transform the updated booking data to match our BookingDetail interface
        const transformedBooking: BookingDetail = {
          ...booking,
          status,
          updatedAt: new Date().toISOString()
        };
        
        setBooking(transformedBooking);
        toast({
          title: "Success",
          description: `Booking status updated to ${status}`,
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: 'Failed to update booking status. Please try again.',
        variant: "destructive",
      });
      setError('Failed to update booking status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const sendConfirmationEmail = async () => {
    setIsUpdating(true);
    try {
      // In a real app, this would be an API call to send an email
      // For now, we'll just show a success message
      toast({
        title: "Success",
        description: 'Confirmation email sent successfully',
        variant: "default",
      });
    } catch (error: any) {
      console.error('Error sending confirmation email:', error);
      toast({
        title: "Error",
        description: 'Failed to send confirmation email. Please try again.',
        variant: "destructive",
      });
      setError('Failed to send confirmation email. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const completePayment = async () => {
    if (!booking) return;
    
    setIsUpdating(true);
    try {
      const updatedBooking = await updateBooking(id, { paymentStatus: PaymentStatus.COMPLETED });
      
      if (updatedBooking) {
        // Transform the updated booking data to match our BookingDetail interface
        const transformedBooking: BookingDetail = {
          ...booking,
          paymentStatus: PaymentStatus.COMPLETED,
          updatedAt: new Date().toISOString()
        };
        
        setBooking(transformedBooking);
        toast({
          title: "Success",
          description: 'Payment marked as completed',
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Error",
        description: 'Failed to update payment status. Please try again.',
        variant: "destructive",
      });
      setError('Failed to update payment status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Unknown date';
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error: any) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return 'Unknown date/time';
    try {
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleString('en-US', options);
    } catch (error: any) {
      console.error('Error formatting date/time:', error);
      return 'Invalid date/time';
    }
  };

  const getStatusColor = (status: string | null | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string | null | undefined) => {
    if (!status) return <AlertCircle className="h-5 w-5 text-gray-500" />;
    
    switch (status) {
      case 'confirmed':
      case 'completed':
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
      case 'refunded':
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        {error || 'Booking not found'}
        <div className="mt-4">
          <Link 
            href="/admin/bookings"
            className="text-primary hover:underline"
          >
            Return to bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link 
          href="/admin/bookings"
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to bookings
        </Link>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking #{booking.id}</h1>
          <p className="text-gray-600 mt-1 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Created on {formatDateTime(booking.createdAt)}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {booking.status === 'pending' && (
            <>
              <Button
                  onClick={() => updateBookingStatus('confirmed')}
                  disabled={isUpdating}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle className="h-4 w-4" />
                  Confirm Booking
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updateBookingStatus('cancelled')}
                  disabled={isUpdating}
                  className="flex items-center gap-1 text-red-500 border-red-200 hover:bg-red-50 cursor-pointer"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel Booking
                </Button>
            </>
          )}
          
          {booking.status === 'confirmed' && (
            <>
              <Button
                  onClick={() => updateBookingStatus('completed')}
                  disabled={isUpdating}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark as Completed
                </Button>
                <Button
                  variant="outline"
                  onClick={() => sendConfirmationEmail()}
                  disabled={isUpdating}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <Mail className="h-4 w-4" />
                  Resend Confirmation
                </Button>
            </>
          )}
          
          {/* Complete Payment Button - Show when payment is pending */}
          {booking.paymentStatus === 'pending' && (
            <Button
              onClick={completePayment}
              disabled={isUpdating}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 cursor-pointer"
            >
              <CreditCard className="h-4 w-4" />
              Complete Payment
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Booking Status Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Booking Status</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Payment Status</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.paymentStatus)}`}>
                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Amount</span>
              <span className="font-medium">₹{booking.totalAmount.toLocaleString()}</span>
            </div>
            
            {booking.paymentId && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment ID</span>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{booking.paymentId}</span>
              </div>
            )}
            
            {booking.paymentMethod && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span>{booking.paymentMethod}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Package Details Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Package Details</h2>
          
          <div className="flex mb-4">
            {booking.packageImage && (
              <img 
                src={booking.packageImage} 
                alt={booking.packageName} 
                className="h-20 w-20 rounded-md object-cover mr-4"
              />
            )}
            
            <div>
              <h3 className="font-medium text-gray-900">{booking.packageName}</h3>
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {booking.packageLocation}
              </div>
              <Link 
                href={`/admin/packages/edit/${booking.packageId}`}
                className="text-primary hover:underline text-sm mt-2 inline-block cursor-pointer"
              >
                View Package
              </Link>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <div className="text-sm font-medium">Start Date</div>
                <div className="text-gray-600">{formatDate(booking.startDate)}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <div className="text-sm font-medium">Group Size</div>
                <div className="text-gray-600">{booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'person' : 'people'}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <IndianRupee className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <div className="text-sm font-medium">Total Amount</div>
                <div className="text-gray-600">₹{booking.totalAmount.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Customer Details Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Details</h2>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <div className="text-sm font-medium">Customer Name</div>
                <div className="text-gray-600">{booking.userName}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <div className="text-sm font-medium">Email</div>
                <div className="text-gray-600">{booking.userEmail}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <div className="text-sm font-medium">Phone</div>
                <div className="text-gray-600">{booking.userPhone}</div>
              </div>
            </div>
            
            <Link 
              href={`/admin/users/${booking.userId}`}
              className="text-primary hover:underline text-sm mt-2 inline-block cursor-pointer"
            >
              View Customer Profile
            </Link>
          </div>
        </div>
      </div>
      
      {/* Contact Information and Special Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <div className="text-sm font-medium">Contact Name</div>
                <div className="text-gray-600">{booking.contactInfo.name}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <div className="text-sm font-medium">Contact Email</div>
                <div className="text-gray-600">{booking.contactInfo.email}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <div className="text-sm font-medium">Contact Phone</div>
                <div className="text-gray-600">{booking.contactInfo.phone}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Special Requests */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Special Requests</h2>
          
          <div className="flex items-start">
            <MessageSquare className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
            <div className="flex-1">
              {booking.specialRequests ? (
                <p className="text-gray-600">{booking.specialRequests}</p>
              ) : (
                <p className="text-gray-500 italic">No special requests</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}