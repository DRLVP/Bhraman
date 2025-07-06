import { create } from 'zustand';
import axios from 'axios';
import { IPackage } from '@/models/Package';

/**
 * Package store state interface
 */
interface PackageState {
  packages: IPackage[];
  featuredPackages: IPackage[];
  isLoading: boolean;
  error: string | null;
  
  // Single package
  currentPackage: IPackage | null;
  isLoadingPackage: boolean;
  packageError: string | null;
  
  // Filters
  filters: {
    search: string;
    location: string;
    duration: string;
    priceRange: string;
    sortBy: string;
  };
  
  // Actions
  fetchPackages: () => Promise<void>;
  fetchFeaturedPackages: () => Promise<void>;
  fetchPackageBySlug: (slug: string) => Promise<IPackage | null>;
  setFilters: (filters: Partial<PackageState['filters']>) => void;
  resetFilters: () => void;
  resetError: () => void;
}

/**
 * Default filters
 */
const defaultFilters = {
  search: '',
  location: 'All Locations',
  duration: 'Any Duration',
  priceRange: 'Any Price',
  sortBy: 'popular',
};

/**
 * Zustand store for package state management
 */
const usePackageStore = create<PackageState>((set, get) => ({
  packages: [],
  featuredPackages: [],
  isLoading: false,
  error: null,
  
  currentPackage: null,
  isLoadingPackage: false,
  packageError: null,
  
  filters: { ...defaultFilters },
  
  fetchPackages: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { filters } = get();
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.location !== 'All Locations') params.append('location', filters.location);
      if (filters.duration !== 'Any Duration') params.append('duration', filters.duration);
      if (filters.priceRange !== 'Any Price') params.append('priceRange', filters.priceRange);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      
      const response = await axios.get(`/api/packages?${params.toString()}`);
      set({ packages: response.data.data, isLoading: false });
    } catch (error) {
      console.error('Error fetching packages:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch packages', 
        isLoading: false 
      });
    }
  },
  
  fetchFeaturedPackages: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axios.get('/api/packages?featured=true');
      set({ featuredPackages: response.data.data, isLoading: false });
    } catch (error) {
      console.error('Error fetching featured packages:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch featured packages', 
        isLoading: false 
      });
    }
  },
  
  fetchPackageBySlug: async (slug: string) => {
    try {
      set({ isLoadingPackage: true, packageError: null });
      
      const response = await axios.get(`/api/packages/${slug}`);
      const packageData = response.data.data;
      
      set({ currentPackage: packageData, isLoadingPackage: false });
      return packageData;
    } catch (error) {
      console.error(`Error fetching package with slug ${slug}:`, error);
      set({ 
        packageError: error instanceof Error ? error.message : 'Failed to fetch package', 
        isLoadingPackage: false 
      });
      return null;
    }
  },
  
  setFilters: (newFilters) => {
    set({ filters: { ...get().filters, ...newFilters } });
  },
  
  resetFilters: () => {
    set({ filters: { ...defaultFilters } });
  },
  
  resetError: () => {
    set({ error: null, packageError: null });
  },
}));

export default usePackageStore;