'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, CreditCard, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useUserAuth';
import axios from 'axios';
import Image from 'next/image';

// Define booking interface
interface Booking {
  _id: string;
  packageId: {
    _id: string;
    title: string;
    slug: string;
    location: string;
    duration: number;
    images: string[];
  };
  startDate: string;
  numberOfPeople: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}



export default function BookingsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch bookings from the API
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isLoaded || !isSignedIn) return;
      
      try {
        setIsLoading(true);
        // Try to fetch bookings from API
        try {
          const response = await axios.get('/api/bookings');
          console.log("bookings in my booking page::", JSON.stringify(response.data));
          setBookings(response.data.data);
        } catch (apiError) {
          console.error('API Error:', apiError);
          // Fallback to mock data if API fails
          const mockBookings: Booking[] = [
            {
              _id: '1',
              packageId: {
                _id: '101',
                title: 'Spiritual Varanasi Retreat',
                slug: 'spiritual-varanasi-retreat',
                location: 'Varanasi, Uttar Pradesh',
                duration: 5,
                images: ['/placeholder-image.jpg']
              },
              startDate: new Date().toISOString(),
              numberOfPeople: 2,
              totalAmount: 25000,
              status: 'confirmed',
              paymentStatus: 'completed',
              contactInfo: {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+91 9876543210'
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              _id: '2',
              packageId: {
                _id: '102',
                title: 'Himalayan Adventure',
                slug: 'himalayan-adventure',
                location: 'Rishikesh, Uttarakhand',
                duration: 7,
                images: ['/placeholder-image.jpg']
              },
              startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              numberOfPeople: 1,
              totalAmount: 35000,
              status: 'pending',
              paymentStatus: 'pending',
              contactInfo: {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+91 9876543210'
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ];
          setBookings(mockBookings);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch bookings');
        console.error('Error fetching bookings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [isLoaded, isSignedIn]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Group bookings by status
  const upcomingBookings = bookings.filter(booking => 
    ['confirmed', 'pending'].includes(booking.status)
  );
  
  const pastBookings = bookings.filter(booking => 
    ['completed', 'cancelled'].includes(booking.status)
  );
  
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600">View and manage your travel bookings</p>
      </div>

      {/* Upcoming Bookings */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Trips</h2>
        {upcomingBookings.length > 0 ? (
          <div className="space-y-6">
            {upcomingBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="md:flex-shrink-0">
                    <Image
                      src={booking.packageId.images && booking.packageId.images.length > 0 
                        ? booking.packageId.images[0] 
                        : '/placeholder-image.jpg'} 
                      alt={booking.packageId.title} 
                      className="h-48 w-full object-cover md:h-full md:w-48"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{booking.packageId.title}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {booking.packageId.location}
                        </div>
                        <div className="flex items-center text-gray-600 mb-4">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(booking.startDate)}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6 md:text-right">
                        <div className="mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-2 md:justify-end">
                          <CreditCard className="h-4 w-4 mr-1" />
                          ₹{booking.totalAmount.toLocaleString()}
                        </div>
                        <div className="flex items-center text-gray-600 md:justify-end">
                          <Clock className="h-4 w-4 mr-1" />
                          Payment: {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/bookings/${booking._id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/packages/${booking.packageId.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          View Package <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                      {booking.status === 'confirmed' && (
                        <Button size="sm" variant="destructive">
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">You don't have any upcoming trips.</p>
            <Button asChild>
              <Link href="/packages">Browse Packages</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Past Bookings */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Past Trips</h2>
        {pastBookings.length > 0 ? (
          <div className="space-y-6">
            {pastBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="md:flex-shrink-0">
                    <Image 
                      src={booking.packageId.images && booking.packageId.images.length > 0 
                        ? booking.packageId.images[0] 
                        : '/placeholder-image.jpg'} 
                      alt={booking.packageId.title} 
                      className="h-48 w-full object-cover md:h-full md:w-48"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{booking.packageId.title}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {booking.packageId.location}
                        </div>
                        <div className="flex items-center text-gray-600 mb-4">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(booking.startDate)}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6 md:text-right">
                        <div className="mb-2">
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-2 md:justify-end">
                          <CreditCard className="h-4 w-4 mr-1" />
                          ₹{booking.totalAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/bookings/${booking._id}`}>
                          View Details
                        </Link>
                      </Button>
                      {booking.status === 'completed' && (
                        <Button size="sm" variant="outline">
                          Write a Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">You don't have any past trips.</p>
          </div>
        )}
      </div>
    </div>
  );
}