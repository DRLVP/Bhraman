'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PendingBookingsPage() {
  const router = useRouter();
  
  // This is a simple redirect page that filters the main bookings page to show only pending bookings
  useEffect(() => {
    router.push('/admin/bookings?status=pending');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}