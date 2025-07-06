'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock booking data
const mockBookingData = {
  id: 'BK12345',
  packageName: 'Sikkim Explorer',
  packageSlug: 'sikkim-explorer',
  startDate: '2023-12-15',
  endDate: '2023-12-22',
  adults: 2,
  children: 1,
  totalAmount: 89250,
  paymentStatus: 'paid',
  bookingStatus: 'confirmed',
  customerName: 'Rahul Sharma',
  customerEmail: 'rahul.sharma@example.com',
  customerPhone: '+91 9876543210',
};

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const bookingId = searchParams.get('booking_id');
    const paymentId = searchParams.get('payment_id');

    if (!bookingId) {
      setError('Booking information not found');
      setIsLoading(false);
      return;
    }

    // In a real application, you would fetch the booking data based on the booking ID
    // const fetchBookingDetails = async () => {
    //   try {
    //     setIsLoading(true);
    //     const response = await fetch(`/api/bookings/${bookingId}?payment_id=${paymentId || ''}`);
    //     if (!response.ok) throw new Error('Booking not found');
    //     const data = await response.json();
    //     setBookingData(data);
    //   } catch (err: any) {
    //     setError(err.message);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchBookingDetails();

    // Using mock data for now
    setTimeout(() => {
      setBookingData({
        ...mockBookingData,
        id: bookingId,
        paymentId: paymentId || 'PAY12345',
      });
      setIsLoading(false);
    }, 1000);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600 mb-6">{error || 'Booking information not found'}</p>
        <Link href="/packages">
          <Button>Browse Packages</Button>
        </Link>
      </div>
    );
  }

  // Format dates
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Thank you for booking with Bhraman. Your adventure awaits!
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Booking Details</h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Booking ID</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{bookingData.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Payment ID</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{bookingData.paymentId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Package</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{bookingData.packageName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">₹{bookingData.totalAmount.toLocaleString()}</p>
              </div>
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Travel Dates</p>
                  <p className="mt-1 text-gray-900">
                    {formatDate(bookingData.startDate)} - {formatDate(bookingData.endDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Travelers</p>
                  <p className="mt-1 text-gray-900">
                    {bookingData.adults} {bookingData.adults === 1 ? 'Adult' : 'Adults'}
                    {bookingData.children > 0 && `, ${bookingData.children} ${bookingData.children === 1 ? 'Child' : 'Children'}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Customer Information</h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="mt-1 text-gray-900">{bookingData.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 text-gray-900">{bookingData.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="mt-1 text-gray-900">{bookingData.customerPhone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {bookingData.bookingStatus.charAt(0).toUpperCase() + bookingData.bookingStatus.slice(1)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">What's Next?</h2>
          </div>
          <div className="px-6 py-4">
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm font-medium">1</div>
                </div>
                <p className="ml-3 text-gray-600">
                  You will receive a confirmation email with all booking details shortly.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm font-medium">2</div>
                </div>
                <p className="ml-3 text-gray-600">
                  Our travel expert will contact you within 24 hours to discuss any specific requirements.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm font-medium">3</div>
                </div>
                <p className="ml-3 text-gray-600">
                  You can view your booking details anytime in your account dashboard.
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/dashboard/bookings">
            <Button className="w-full sm:w-auto">
              View My Bookings
            </Button>
          </Link>
          <Link href="/packages">
            <Button variant="outline" className="w-full sm:w-auto">
              Browse More Packages
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}