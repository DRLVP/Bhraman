import { BookingStatus, PaymentStatus } from '@/models/Booking';

/**
 * Admin dashboard types
 */

// Admin user type
export interface AdminUser {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  profileImage?: string;
  phone?: string;
  role: 'admin';
  permissions: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Admin dashboard statistics
export interface AdminStats {
  totalPackages: number;
  totalBookings: number;
  totalUsers: number;
  totalRevenue: number;
  pendingBookings: number;
  recentBookings: RecentBooking[];
  monthlyStats: MonthlyStats;
}

// Recent booking for dashboard
export interface RecentBooking {
  _id: string;
  packageTitle: string;
  userName: string;
  startDate: string;
  numberOfPeople: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

// Monthly statistics for dashboard charts
export interface MonthlyStats {
  bookings: {
    labels: string[];
    data: number[];
  };
  revenue: {
    labels: string[];
    data: number[];
  };
}

// Package type for admin dashboard
export interface AdminPackage {
  _id: string;
  title: string;
  slug: string;
  description: string;
  duration: number;
  location: string;
  price: number;
  images: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  featured: boolean;
  maxGroupSize: number;
  createdAt: string;
  updatedAt: string;
}

// Booking type for admin dashboard
export interface AdminBooking {
  _id: string;
  userId: string;
  packageId: string;
  packageDetails?: {
    title: string;
    location: string;
    duration: number;
    price: number;
  };
  userDetails?: {
    name: string;
    email: string;
    phone?: string;
  };
  startDate: string;
  numberOfPeople: number;
  totalAmount: number;
  status: BookingStatus;
  paymentId?: string;
  paymentStatus: PaymentStatus;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

// User type for admin dashboard
export interface AdminUserDetails {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  profileImage?: string;
  phone?: string;
  role: 'user' | 'admin';
  permissions?: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  bookingsCount?: number;
  totalSpent?: number;
}

// Pagination response type
export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Filter options for packages
export interface PackageFilterOptions {
  search?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  duration?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

// Filter options for bookings
export interface BookingFilterOptions {
  search?: string;
  status?: BookingStatus | 'all';
  paymentStatus?: PaymentStatus | 'all';
  startDateFrom?: string;
  startDateTo?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

// Filter options for users
export interface UserFilterOptions {
  search?: string;
  role?: 'user' | 'admin' | 'all';
  sort?: string;
  page?: number;
  limit?: number;
}

// Home configuration sections
export interface HomeConfig {
  _id: string;
  heroSection: {
    heading: string;
    subheading: string;
    backgroundImage: string;
    ctaText: string;
    ctaLink: string;
  };
  featuredPackagesSection: {
    heading: string;
    subheading: string;
    packageIds: string[];
  };
  testimonialsSection: {
    heading: string;
    subheading: string;
    testimonials: {
      name: string;
      location: string;
      image?: string;
      rating: number;
      text: string;
    }[];
  };
  aboutSection: {
    heading: string;
    content: string;
    image: string;
  };
  contactSection: {
    heading: string;
    subheading: string;
    email: string;
    phone: string;
    address: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// Admin action result
export interface AdminActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}