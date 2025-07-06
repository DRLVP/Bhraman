'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BookingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  
  // Get the booking ID from the URL query parameters
  const bookingId = searchParams.get('bookingId');
  
  // Redirect to the booking details page after 5 seconds
  useEffect(() => {
    if (!bookingId) {
      router.push('/dashboard/bookings');
      return;
    }
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/dashboard/bookings/${bookingId}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [bookingId, router]);
  
  if (!bookingId) {
    return null; // Will redirect in the useEffect
  }
  
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Submitted!</h1>
        
        <p className="text-gray-600 mb-6">
          Your booking has been successfully submitted and is pending confirmation by our administrators. You will be notified once it's confirmed. Thank you for choosing Bhraman for your travel needs.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="text-gray-700 mb-2">Booking ID: <span className="font-semibold">{bookingId}</span></p>
          <p className="text-gray-700">
            You will be redirected to your booking details in {countdown} seconds...
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/dashboard/bookings">
              View All Bookings
            </Link>
          </Button>
          
          <Button asChild>
            <Link href={`/dashboard/bookings/${bookingId}`} className="flex items-center gap-2">
              View Booking Details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}