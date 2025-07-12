'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserCircle, Package, CreditCard, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';

// Dashboard sidebar navigation items
const navigation = [
  { name: 'Profile', href: '/dashboard', icon: UserCircle },
  { name: 'My Bookings', href: '/dashboard/bookings', icon: Package },
  { name: 'Payment History', href: '/dashboard/payments', icon: CreditCard },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    // Check if the user is authenticated once the Clerk is loaded
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in?callbackUrl=/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If not signed in, we'll redirect in the useEffect
  if (!isSignedIn) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Mobile sidebar toggle */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center p-4 bg-white shadow-md">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-4 flex-1">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">Budh Bhraman</span>
            </Link>
          </div>
        </div>

        {/* Sidebar for desktop */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">Budh Bhraman</span>
            </Link>
            <button
              type="button"
              className="lg:hidden text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                  {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.emailAddresses?.[0]?.emailAddress || ''}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-primary"
              >
                <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-primary" />
                {item.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:bg-gray-50 hover:text-primary"
                asChild
              >
                <Link href="/sign-out">
                  <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                  Sign Out
                </Link>
              </Button>
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:ml-64">
          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}


    </div>
  );
}