'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  StarOff,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useAdminPackages } from '@/hooks/useAdminPackages';
import Image from 'next/image';


export default function PackagesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [limit] = useState(10);
  
  // Use the admin packages hook
  const {
    packages,
    pagination,
    isLoading,
    error,
    fetchPackages,
    deletePackage,
    updatePackage,
  } = useAdminPackages();
  
  // Calculate total pages from pagination
  const totalPages = pagination.pages;
  
  // Fetch packages is now handled by the useAdminPackages hook
  useEffect(() => {
    // The hook will handle the API call and state management
    fetchPackages(currentPage, limit, searchQuery)
      .catch((err) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: err.message || 'Failed to fetch packages',
        });
      });
  }, [currentPage, limit, searchQuery, fetchPackages, toast]);

  useEffect(() => {
    fetchPackages(currentPage, limit, searchQuery)
      .catch((err) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: err.message || 'Failed to fetch packages',
        });
      });
  }, [currentPage, searchQuery, limit, fetchPackages, toast]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchPackages(1, limit, searchQuery)
      .catch((err) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: err.message || 'Failed to fetch packages',
        });
      });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      // Use the updatePackage method from the hook
      await updatePackage(id, { featured: !featured });
      // The hook will update the packages state automatically
      toast({
        title: 'Success',
        description: `Package ${featured ? 'removed from' : 'marked as'} featured successfully`,
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update featured status',
      });
    }
  };

  const handleDelete = async (id: string) => {
    const packageToDelete = packages.find((pkg) => pkg._id === id);
    
    // Use toast for confirmation instead of window.confirm
    toast({
      title: 'Confirm deletion',
      description: `Are you sure you want to delete ${packageToDelete?.title || 'this package'}? This action cannot be undone.`,
      action: (
        <Button 
          variant="destructive" 
          onClick={async () => {
            setIsDeleting(id);
            try {
              // Use the deletePackage method from the hook
              const success = await deletePackage(id);
              if (success) {
                toast({
                  title: 'Success',
                  description: 'Package deleted successfully',
                });
              }
            } catch (error) {
              console.error('Error deleting package:', error);
              toast({
                variant: 'destructive',
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to delete package',
              });
            } finally {
              setIsDeleting(null);
            }
          }}
          className="cursor-pointer"
        >
          Delete
        </Button>
      ),
    });
  };

  if (isLoading && packages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Packages</h1>
        <Button 
          onClick={() => router.push('/admin/packages/new')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add New Package
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <Button type="submit" className="cursor-pointer">Search</Button>
        </form>
      </div>

      {/* Packages table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No packages found. Create your first package!
                  </td>
                </tr>
              ) : (
                packages.map((pkg) => (
                  <tr key={pkg._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          {pkg.images && pkg.images.length > 0 ? (
                            <Image
                              src={pkg.images[0]} 
                              alt={pkg.title} 
                              className="h-10 w-10 rounded-md object-cover"
                              width={100}
                              height={100}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No img</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{pkg.title}</div>
                          <div className="text-sm text-gray-500">{pkg.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pkg.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pkg.duration} {pkg.duration === 1 ? 'day' : 'days'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{pkg.price.toLocaleString()}</div>
                      {pkg.discountedPrice && (
                        <div className="text-xs text-green-600">₹{pkg.discountedPrice.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => toggleFeatured(pkg._id, pkg.featured)}
                        className={`p-1 rounded-full cursor-pointer ${pkg.featured ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-500'}`}
                      >
                        {pkg.featured ? (
                          <Star className="h-5 w-5 fill-current" />
                        ) : (
                          <StarOff className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/packages/${pkg.slug}`}
                          className="text-gray-500 hover:text-gray-700 cursor-pointer"
                          target="_blank"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <button 
                          onClick={() => router.push(`/admin/packages/edit/${pkg._id}`)}
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(pkg._id)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                          disabled={isDeleting === pkg._id}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:text-gray-900 cursor-pointer'}`}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            <div className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:text-gray-900 cursor-pointer'}`}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}