'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';

// Metadata is now defined in layout.tsx or a separate metadata.ts file

// Mock user data
const mockUserData = {
  id: '1',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  phone: '+91 9876543210',
  address: 'Koramangala, Bangalore, Karnataka',
  joinedDate: '2023-01-15',
  totalBookings: 3,
  upcomingBookings: 1,
};

export default function DashboardPage() {
  const [userData, setUserData] = useState(mockUserData);
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };
  
  // Get user data from Clerk
  const { isLoaded, user } = useUser();
  
  // Update user data when Clerk user is loaded
  useEffect(() => {
    if (isLoaded && user) {
      // In a real app, you might fetch additional user data from your database
      // For now, we'll just update the mock data with Clerk user info
      setUserData(prevData => ({
        ...prevData,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.emailAddresses[0]?.emailAddress || '',
      }));
    }
  }, [isLoaded, user]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your personal information and account settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="mt-1 text-gray-900">{userData.name}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                    <p className="mt-1 text-gray-900">{userData.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="mt-1 text-gray-900">{userData.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="mt-1 text-gray-900">{userData.address}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Member Since</p>
                    <p className="mt-1 text-gray-900">{formatDate(userData.joinedDate)}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="outline">Edit Profile</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Account Summary</h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{userData.totalBookings}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Upcoming Trips</p>
                  <p className="mt-1 text-2xl font-semibold text-primary">{userData.upcomingBookings}</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <Button className="w-full" asChild>
                    <Link href="/dashboard/bookings">View My Bookings</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">My Bookings</h3>
            <p className="text-gray-600 mb-4">View and manage your current and past bookings</p>
            <Button variant="outline" asChild>
              <Link href="/dashboard/bookings">View Bookings</Link>
            </Button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Payment History</h3>
            <p className="text-gray-600 mb-4">Access your payment receipts and transaction history</p>
            <Button variant="outline" asChild>
              <Link href="/dashboard/payments">View Payments</Link>
            </Button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Account Settings</h3>
            <p className="text-gray-600 mb-4">Update your password and notification preferences</p>
            <Button variant="outline" asChild>
              <Link href="/dashboard/settings">Manage Settings</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}