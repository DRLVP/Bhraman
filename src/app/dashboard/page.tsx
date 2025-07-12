'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useUserAuth';



export default function DashboardPage() {
  // Get user data from our custom hook that fetches from backend
  const { userData, isLoading } = useAuth();
  console.log('user data in dashboard page::', userData);
  
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your personal information and account settings</p>
        {isLoading && <p className="text-gray-500">Loading your profile data...</p>}
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
                    <p className="mt-1 text-gray-900">{userData?.name || 'Loading...'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                    <p className="mt-1 text-gray-900">{userData?.email || 'Loading...'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="mt-1 text-gray-900">{userData?.phone || 'Not provided'}</p>
                  </div>
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