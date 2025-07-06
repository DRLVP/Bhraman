/**
 * Admin dashboard constants
 */

// Admin permissions
export const ADMIN_PERMISSIONS = {
  // Package permissions
  VIEW_PACKAGES: 'view:packages',
  CREATE_PACKAGE: 'create:package',
  EDIT_PACKAGE: 'edit:package',
  DELETE_PACKAGE: 'delete:package',
  
  // Booking permissions
  VIEW_BOOKINGS: 'view:bookings',
  CREATE_BOOKING: 'create:booking',
  EDIT_BOOKING: 'edit:booking',
  DELETE_BOOKING: 'delete:booking',
  
  // User permissions
  VIEW_USERS: 'view:users',
  CREATE_USER: 'create:user',
  EDIT_USER: 'edit:user',
  DELETE_USER: 'delete:user',
  
  // Admin permissions
  VIEW_ADMINS: 'view:admins',
  CREATE_ADMIN: 'create:admin',
  EDIT_ADMIN: 'edit:admin',
  DELETE_ADMIN: 'delete:admin',
  MANAGE_PERMISSIONS: 'manage:permissions',
  
  // Dashboard permissions
  VIEW_DASHBOARD: 'view:dashboard',
  
  // Content management permissions
  MANAGE_HOME_CONFIG: 'manage:home-config',
  
  // Super admin permission (has all permissions)
  SUPER_ADMIN: '*',
};

// Admin dashboard navigation items
export const ADMIN_NAV_ITEMS = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: 'Dashboard',
    permission: ADMIN_PERMISSIONS.VIEW_DASHBOARD,
  },
  {
    title: 'Packages',
    href: '/admin/packages',
    icon: 'Package',
    permission: ADMIN_PERMISSIONS.VIEW_PACKAGES,
  },
  {
    title: 'Bookings',
    href: '/admin/bookings',
    icon: 'CalendarCheck',
    permission: ADMIN_PERMISSIONS.VIEW_BOOKINGS,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: 'Users',
    permission: ADMIN_PERMISSIONS.VIEW_USERS,
  },
  {
    title: 'Settings',
    icon: 'Settings',
    children: [
      {
        title: 'Admins',
        href: '/admin/settings/admins',
        icon: 'Shield',
        permission: ADMIN_PERMISSIONS.VIEW_ADMINS,
      },
      {
        title: 'Permissions',
        href: '/admin/settings/permissions',
        icon: 'Lock',
        permission: ADMIN_PERMISSIONS.MANAGE_PERMISSIONS,
      },
      {
        title: 'Home Page',
        href: '/admin/settings/home-config',
        icon: 'Home',
        permission: ADMIN_PERMISSIONS.MANAGE_HOME_CONFIG,
      },
    ],
  },
];

// Booking status options for filtering
export const BOOKING_STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Completed', value: 'completed' },
];

// Payment status options for filtering
export const PAYMENT_STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Failed', value: 'failed' },
  { label: 'Refunded', value: 'refunded' },
];

// Package sorting options
export const PACKAGE_SORT_OPTIONS = [
  { label: 'Newest First', value: 'createdAt:desc' },
  { label: 'Oldest First', value: 'createdAt:asc' },
  { label: 'Price: Low to High', value: 'price:asc' },
  { label: 'Price: High to Low', value: 'price:desc' },
  { label: 'Title: A-Z', value: 'title:asc' },
  { label: 'Title: Z-A', value: 'title:desc' },
];

// Booking sorting options
export const BOOKING_SORT_OPTIONS = [
  { label: 'Newest First', value: 'createdAt:desc' },
  { label: 'Oldest First', value: 'createdAt:asc' },
  { label: 'Amount: Low to High', value: 'totalAmount:asc' },
  { label: 'Amount: High to Low', value: 'totalAmount:desc' },
  { label: 'Start Date: Earliest', value: 'startDate:asc' },
  { label: 'Start Date: Latest', value: 'startDate:desc' },
];

// Default pagination options
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
};

// Dashboard card colors
export const DASHBOARD_CARD_COLORS = {
  packages: 'bg-blue-50 text-blue-700 border-blue-200',
  bookings: 'bg-green-50 text-green-700 border-green-200',
  users: 'bg-purple-50 text-purple-700 border-purple-200',
  revenue: 'bg-amber-50 text-amber-700 border-amber-200',
};

// Chart colors
export const CHART_COLORS = {
  primary: '#4F46E5', // indigo-600
  secondary: '#0EA5E9', // sky-500
  tertiary: '#10B981', // emerald-500
  quaternary: '#F59E0B', // amber-500
  background: '#F9FAFB', // gray-50
  grid: '#E5E7EB', // gray-200
};

// Form validation messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be at most ${max} characters`,
  min: (min: number) => `Must be at least ${min}`,
  max: (max: number) => `Must be at most ${max}`,
  pattern: 'Invalid format',
  url: 'Please enter a valid URL',
  phone: 'Please enter a valid phone number',
};