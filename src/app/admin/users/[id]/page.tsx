'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Clock,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import Image from 'next/image';
import { getErrorMessage } from '@/lib/errorUtils';

interface UserDetailProps {
  params: {
    id: string;
  };
}

interface UserDetail {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  profileImage?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  bookingCount: number;
}

export default function UserDetailPage({ params }: UserDetailProps) {
  const router = useRouter();
  // Use React.use() to unwrap params object as recommended by Next.js
  const { id } = use(params);
  const { isAdmin, isLoading: authLoading } = useAdminAuth();
  const { toast } = useToast();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      // Don't check for isAdmin here, let the API handle permissions
      // Only show error toast if not loading and not admin
      if (!authLoading && !isAdmin) {
        setError('Admin access required');
        toast({
          title: 'Access Denied',
          description: 'Admin access is required to view this page',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      // Don't proceed with fetch if still authenticating or not admin
      if (authLoading || !isAdmin) {
        return;
      }
      
      setIsLoading(true);
      try {
        const { data: responseData } = await axios.get(`/api/admin/users/${id}`);
        
        // Check if the user has 'user' role
        if (responseData.data.role !== 'user') {
          throw new Error('Only regular users can be viewed in this section');
        }
        
        setUser(responseData.data);
      } catch (error: unknown) {
        console.error('Error fetching user:', error);
        const errorMessage = getErrorMessage(error) || 'Failed to load user details. Please try again.';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, isAdmin, authLoading, toast]);

  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };



  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        Admin access required to view this page
        <div className="mt-4">
          <Button 
            onClick={() => router.push('/')} 
            variant="outline" 
            className="flex items-center gap-2 cursor-pointer"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        {error || 'User not found'}
        <div className="mt-4">
          <Link 
            href="/admin/users"
            className="text-primary hover:underline cursor-pointer"
          >
            Return to users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link 
          href="/admin/users"
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </Link>
      </div>
      
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {user.profileImage ? (
              <Image
                src={user.profileImage} 
                alt={user.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-3xl font-medium">
                {user.name.charAt(0)}
              </span>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
            <p className="text-gray-600 flex items-center gap-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                User
              </span>
              <span className="mx-1">•</span>
              <Clock className="h-4 w-4 mr-1" />
              Joined {formatDate(user.createdAt)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto">
        {/* User Information Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">User Information</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Email</div>
                <div className="text-gray-900">{user.email}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Phone</div>
                <div className="text-gray-900">{user.phone || 'Not provided'}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Joined</div>
                <div className="text-gray-900">{formatDate(user.createdAt)}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Last Updated</div>
                <div className="text-gray-900">{formatDateTime(user.updatedAt)}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <Package className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Total Bookings</div>
                <div className="text-gray-900">{user.bookingCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}