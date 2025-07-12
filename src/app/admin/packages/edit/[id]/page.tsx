'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PackageForm from '@/components/forms/PackageForm';
import axios from 'axios';
import { use } from 'react';

interface PackageEditPageProps {
  params: {
    id: string;
  };
}

export default function EditPackagePage({ params }: PackageEditPageProps) {
  const { id } = use(params); // Unwrap the params Promise with React.use()
  const [packageData, setPackageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setIsLoading(true);
        // Use the admin API endpoint to fetch package data
        const response = await axios.get(`/api/admin/packages/${id}`);
        
        // Convert MongoDB _id to id for the form
        const data = response.data.data;
        const packageWithId = {
          ...data,
          id: data._id,
        };
        setPackageData(packageWithId);
      } catch (error) {
        console.error('Error fetching package:', error);
        setError('Failed to load package data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        {error}
        <div className="mt-4">
          <Link 
            href="/admin/packages"
            className="text-primary hover:underline"
          >
            Return to packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link 
          href="/admin/packages"
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to packages
        </Link>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Package</h1>
        <p className="text-gray-600 mt-1">Update the details of your travel package.</p>
      </div>
      
      {packageData && (
        <PackageForm 
          initialData={packageData} 
          isEditing={true} 
        />
      )}
    </div>
  );
}