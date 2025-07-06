'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Users, Star, Search } from 'lucide-react';
import usePackageStore from '@/store/usePackageStore';

// Filter options
const locations = ['All Locations', 'Sikkim', 'Kerala', 'Rajasthan', 'Goa', 'Himachal Pradesh', 'Andaman'];
const durations = ['Any Duration', '1-3 days', '4-7 days', '8+ days'];
const priceRanges = ['Any Price', 'Under ₹20,000', '₹20,000 - ₹30,000', '₹30,000 - ₹40,000', 'Above ₹40,000'];
const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'duration-low', label: 'Duration: Short to Long' },
  { value: 'duration-high', label: 'Duration: Long to Short' }
];

export default function PackagesPage() {
  const { 
    packages, 
    isLoading, 
    error, 
    filters, 
    fetchPackages, 
    setFilters, 
    resetFilters 
  } = usePackageStore();
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 6;
  
  // Calculate pagination
  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = packages.slice(indexOfFirstPackage, indexOfLastPackage);
  const totalPages = Math.ceil(packages.length / packagesPerPage);
  
  // Fetch packages on component mount and when filters change
  useEffect(() => {
    fetchPackages();
  }, [filters, fetchPackages]);
  
  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters({ [filterName]: value });
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Packages</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our carefully curated travel packages designed to give you the best experience of India's diverse landscapes and cultures.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search packages..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <Button 
              className="md:w-auto"
              onClick={() => fetchPackages()}
            >
              Search
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select 
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={filters.location || 'All Locations'}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <select 
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={filters.duration || 'Any Duration'}
                onChange={(e) => handleFilterChange('duration', e.target.value)}
              >
                {durations.map((duration) => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <select 
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={filters.priceRange || 'Any Price'}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              >
                {priceRanges.map((range) => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select 
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={filters.sortBy || 'popular'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Reset Filters Button */}
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
            <p>{error}</p>
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && !error && packages.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">No packages found</h3>
            <p className="text-gray-600">Try adjusting your filters or search criteria</p>
          </div>
        )}

        {/* Packages Grid */}
        {!isLoading && !error && packages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentPackages.map((pkg) => (
              <div key={pkg._id || pkg.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-60">
                  <img 
                    src={pkg.image || pkg.images?.[0]} 
                    alt={pkg.title} 
                    className="w-full h-full object-cover"
                  />
                  {pkg.discountedPrice && pkg.discountedPrice < pkg.price && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                      {Math.round(((pkg.price - pkg.discountedPrice) / pkg.price) * 100)}% OFF
                    </div>
                  )}
                  {pkg.featured && (
                    <div className="absolute top-4 left-4 bg-primary text-white text-sm font-bold px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-yellow-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(pkg.rating || 4.5) ? 'fill-current' : 'stroke-current fill-none'}`} 
                      />
                    ))}
                    <span className="text-gray-600 text-sm ml-2">
                      {pkg.rating || 4.5} ({pkg.reviewCount || 0} reviews)
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {pkg.location}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{pkg.shortDescription}</p>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {pkg.duration}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      Max {pkg.maxGroupSize} people
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {pkg.discountedPrice && pkg.discountedPrice < pkg.price ? (
                        <>
                          <span className="text-gray-400 line-through text-sm">₹{pkg.price.toLocaleString()}</span>
                          <span className="text-2xl font-bold text-gray-900 ml-2">₹{pkg.discountedPrice.toLocaleString()}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-gray-900">₹{pkg.price.toLocaleString()}</span>
                      )}
                      <span className="text-gray-600 text-sm"> / person</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Link href={`/packages/${pkg.slug}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/book/${pkg.slug}`} className="flex-1">
                      <Button className="w-full">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && packages.length > 0 && (
          <div className="flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Show first page, last page, and pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                  if (i === 4) pageNum = totalPages;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 border ${currentPage === pageNum ? 'border-primary bg-primary-50 text-primary' : 'border-gray-300 bg-white text-gray-500'} text-sm font-medium hover:bg-gray-50`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </main>
  );
}