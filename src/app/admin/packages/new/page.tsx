'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PackageForm from '@/components/forms/PackageForm';

export default function NewPackagePage() {
  const router = useRouter();
  
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
        <h1 className="text-2xl font-bold text-gray-900">Create New Package</h1>
        <p className="text-gray-600 mt-1">Add a new travel package to your offerings.</p>
      </div>
      
      <PackageForm />
    </div>
  );
}