'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Users, CreditCard, Clock, Download, Mail, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useAuth from '@/hooks/useUserAuth';
import axios from 'axios';

// Define booking interface
interface Booking {
  _id: string;
  packageId: {
    _id: string;
    title: string;
    slug: string;
    location: string;
    duration: number;
    description: string;
    price: number;
    images: string[];
    itinerary?: {
      _id: string;
      day: number;
      title: string;
      description: string;
    }[];
  };
  startDate: string;
  numberOfPeople: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentId?: string;
  specialRequests?: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
  // Unwrap params with React.use()
  const unwrappedParams = use(params);
  const { isSignedIn, isLoaded } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!isLoaded || !isSignedIn) return;
      
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/bookings/${unwrappedParams.id}`);
        console.log("response after fetching details::", response.data);
        
        const data = response.data;
        console.log("data is::", data);
        
        // Check if data is directly the booking object or nested in a data property
        if (data && data._id) {
          // Data is directly the booking object
          setBooking(data);
        } else if (data && data.data && data.data._id) {
          // Data is nested in a data property
          setBooking(data.data);
        } else {
          console.error('Invalid booking data structure:', data);
          throw new Error('Invalid booking data structure');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred while fetching booking details');
        console.error('Error fetching booking details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [isLoaded, isSignedIn, unwrappedParams.id]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Calculate end date based on start date and package duration
  const calculateEndDate = (startDate: string, duration: number) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + duration - 1); // -1 because duration includes the start day
    return formatDate(date.toISOString());
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }
  
  // Show not found state
  if (!booking) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600 mb-4">Booking not found</p>
        <Button asChild>
          <Link href="/dashboard/bookings">Back to Bookings</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/dashboard/bookings" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Bookings
        </Link>
        <h1 className="text-2xl font-bold tracking-tight mt-2">{booking.packageId.title}</h1>
        <div className="text-sm text-gray-500">Booking ID: {booking._id}</div>
      </div>
      <div className="mt-4 md:mt-0">
        <span 
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'
          }`}
        >
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      {/* Package Images */}
      {booking.packageId.images && booking.packageId.images.length > 0 && (
        <div className="mb-8 overflow-hidden rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {booking.packageId.images.map((image, index) => (
              <div key={index} className={`${index === 0 ? 'md:col-span-2 row-span-2' : ''} overflow-hidden rounded-lg h-48 md:h-auto`}>
                <img 
                  src={image.replace(/"/g, '').trim()} 
                  alt={`${booking.packageId.title} - Image ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Booking Details */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Booking Details</h2>
            </div>
            <div className="p-6">
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-500 mb-1">Package Description</p>
                <p className="text-gray-900">{booking.packageId.description}</p>
              </div>
              
              {booking.status === 'pending' && (
                <div className="mb-4 pb-4 border-b border-gray-200 bg-yellow-50 p-4 rounded-md">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Booking Pending Confirmation</p>
                      <p className="text-yellow-700 text-sm mt-1">Your booking is currently pending confirmation by our administrators. You will be notified once it's confirmed.</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Destination</p>
                    <p className="mt-1 text-gray-900">{booking.packageId.location}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Travel Dates</p>
                    <p className="mt-1 text-gray-900">
                      {formatDate(booking.startDate)} - {calculateEndDate(booking.startDate, booking.packageId.duration)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Travelers</p>
                    <p className="mt-1 text-gray-900">
                      {booking.numberOfPeople} Travelers
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Booking Date</p>
                    <p className="mt-1 text-gray-900">{formatDate(booking.createdAt)}</p>
                  </div>
                </div>
              </div>

              {booking.specialRequests && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-start">
                    <MessageSquare className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Special Requests</p>
                      <p className="mt-1 text-gray-600">{booking.specialRequests || 'No special requests'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Itinerary */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Itinerary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {booking.packageId.itinerary ? (
                  booking.packageId.itinerary.map((day) => (
                    <div key={day.day} className="border-l-4 border-primary pl-4 pb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Day {day.day}: {day.title}
                      </h3>
                      <p className="text-gray-600">{day.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-600">Itinerary details not available</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment and Contact Info */}
        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Package Price</p>
                  <p className="mt-1 text-gray-900">₹{booking.packageId.price.toLocaleString()} per person</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">₹{booking.totalAmount.toLocaleString()}</p>
                </div>
                <div className="flex items-start">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment ID</p>
                    <p className="mt-1 text-gray-900">{booking.paymentId || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Date</p>
                    <p className="mt-1 text-gray-900">{booking.paymentStatus === 'completed' ? formatDate(booking.updatedAt) : 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Status</p>
                  <p className="mt-1">
                    <Badge variant={booking.paymentStatus === 'completed' ? 'success' : booking.paymentStatus === 'pending' ? 'outline' : 'destructive'} className="ml-2">
                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </Badge>
                  </p>
                </div>
                
                {booking.paymentStatus === 'pending' && (
                  <div className="mt-2 bg-gray-50 p-3 rounded-md text-sm text-gray-600">
                    <p>Payment is pending confirmation by our administrators.</p>
                  </div>
                )}
                <div className="pt-4">
                  <Button disabled={booking.paymentStatus !== 'completed'} className="mt-2">
                    <Download className="mr-2 h-4 w-4" /> Download Invoice
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-gray-900">{booking.contactInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="mt-1 text-gray-900">{booking.contactInfo.phone}</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="w-full">
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Button asChild variant="outline">
          <Link href={`/packages/${booking.packageId.slug}`}>
            View Package
          </Link>
        </Button>
        {booking.status === 'confirmed' && (
          <Button variant="destructive" onClick={() => setShowCancelModal(true)}>
            Cancel Booking
          </Button>
        )}
      </div>
    </div>
  );
}