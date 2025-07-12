'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  Package,
  Calendar,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { envConfig } from '@/constants/envConfig';
// Use the new admin authentication hook
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
  hasChildren?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const SidebarItem = ({
  icon,
  label,
  href,
  active,
  hasChildren = false,
  isOpen = false,
  onClick,
  children,
}: SidebarItemProps) => {
  return (
    <div className={hasChildren ? 'flex flex-col' : undefined}>
      <Link
        href={hasChildren ? '#' : href}
        onClick={onClick}
        className={`
          flex items-center px-4 py-3 text-sm
          ${active ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}
          ${hasChildren ? 'cursor-pointer' : ''}
          rounded-md transition-colors
        `}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <span className="mr-3">{icon}</span>
            <span>{label}</span>
          </div>
          {hasChildren && (
            <span>
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </span>
          )}
        </div>
      </Link>
      {hasChildren && isOpen && (
        <div className="ml-8 mt-1 space-y-1">{children}</div>
      )}
    </div>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={envConfig.clerkPublishableKey}
    >
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ClerkProvider>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, isAdmin } = useAdminAuth();
  const { isSignedIn, signOut, isLoaded } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [packagesOpen, setPackagesOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);

  console.log('is admin in admin layout::', isAdmin);
  
  // Correct way to set state based on pathname
  useEffect(() => {
    if (pathname.includes('/admin/packages')) {setPackagesOpen(true);}
    if (pathname.includes('/admin/bookings')) {setBookingsOpen(true);}
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle sign out using the signOut function from useAdminAuth hook
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: Error | unknown) {
      console.error('Error signing out:', error);
    }
  };

  // Redirect to sign-in if not authenticated or to unauthorized if not admin
  useEffect(() => {
    // Skip redirect for sign-in page
    if (pathname === '/admin/sign-in') {
      return;
    }
    
    console.log('Admin layout redirect check:', {
      isLoaded,
      isSignedIn,
      isLoading,
      isAdmin,
      pathname,
    });
    
    // Redirect to sign-in if not authenticated
    if (isLoaded && !isSignedIn && !isLoading) {
      console.log('Redirecting to sign-in: User not signed in');
      router.push(`/admin/sign-in?redirect_url=${encodeURIComponent(pathname)}`);
      return;
    }

    // Only redirect to unauthorized if we're sure the user is not an admin
    // Add a small delay to ensure admin data is fully loaded
    if (isLoaded && isSignedIn && !isLoading && isAdmin === false) {
      console.log('Redirecting to unauthorized: User is not an admin');
      // Add a small delay to ensure all data is loaded
      const redirectTimer = setTimeout(() => {
        router.push('/unauthorized');
      }, 500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isLoaded, isSignedIn, isLoading, isAdmin, router, pathname]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-gray-500">Please wait while we load the admin dashboard</p>
        </div>
      </div>
    );
  }

  return (
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar for desktop */}
        <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary">Bhraman Admin</h1>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            <SidebarItem
              icon={<Home className="h-5 w-5" />}
              label="Dashboard"
              href="/admin"
              active={pathname === '/admin'}
            />
            <SidebarItem
              icon={<Package className="h-5 w-5" />}
              label="Packages"
              href="#"
              active={pathname.includes('/admin/packages')}
              hasChildren={true}
              isOpen={packagesOpen}
              onClick={() => setPackagesOpen(!packagesOpen)}
            >
              <Link
                href="/admin/packages"
                className={`block py-2 pl-2 text-sm ${
                  pathname === '/admin/packages'
                    ? 'text-primary font-medium'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                All Packages
              </Link>
              <Link
                href="/admin/packages/new"
                className={`block py-2 pl-2 text-sm ${
                  pathname === '/admin/packages/new'
                    ? 'text-primary font-medium'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Add New Package
              </Link>
            </SidebarItem>
            <SidebarItem
              icon={<Calendar className="h-5 w-5" />}
              label="Bookings"
              href="#"
              active={pathname.includes('/admin/bookings')}
              hasChildren={true}
              isOpen={bookingsOpen}
              onClick={() => setBookingsOpen(!bookingsOpen)}
            >
              <Link
                href="/admin/bookings"
                className={`block py-2 pl-2 text-sm ${
                  pathname === '/admin/bookings'
                    ? 'text-primary font-medium'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                All Bookings
              </Link>
              <Link
                href="/admin/bookings/pending"
                className={`block py-2 pl-2 text-sm ${
                  pathname === '/admin/bookings/pending'
                    ? 'text-primary font-medium'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Pending Bookings
              </Link>
            </SidebarItem>
            <SidebarItem
              icon={<Users className="h-5 w-5" />}
              label="Users"
              href="/admin/users"
              active={pathname === '/admin/users'}
            />
            <SidebarItem
              icon={<Settings className="h-5 w-5" />}
              label="Manage Site"
              href="/admin/manage-site"
              active={pathname === '/admin/manage-site'}
            />
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center text-red-500 hover:text-red-700 transition-colors w-full"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">Bhraman Admin</h1>
          <button
            onClick={toggleMobileMenu}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={closeMobileMenu}
            ></div>
            <div className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-white shadow-xl">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h1 className="text-xl font-bold text-primary">Bhraman Admin</h1>
                <button
                  onClick={closeMobileMenu}
                  className="text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                <SidebarItem
                  icon={<Home className="h-5 w-5" />}
                  label="Dashboard"
                  href="/admin"
                  active={pathname === '/admin'}
                />
                <SidebarItem
                  icon={<Package className="h-5 w-5" />}
                  label="Packages"
                  href="#"
                  active={pathname.includes('/admin/packages')}
                  hasChildren={true}
                  isOpen={packagesOpen}
                  onClick={() => setPackagesOpen(!packagesOpen)}
                >
                  <Link
                    href="/admin/packages"
                    className={`block py-2 pl-2 text-sm ${
                      pathname === '/admin/packages'
                        ? 'text-primary font-medium'
                        : 'text-gray-600 hover:text-primary'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    All Packages
                  </Link>
                  <Link
                    href="/admin/packages/new"
                    className={`block py-2 pl-2 text-sm ${
                      pathname === '/admin/packages/new'
                        ? 'text-primary font-medium'
                        : 'text-gray-600 hover:text-primary'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Add New Package
                  </Link>
                </SidebarItem>
                <SidebarItem
                  icon={<Calendar className="h-5 w-5" />}
                  label="Bookings"
                  href="#"
                  active={pathname.includes('/admin/bookings')}
                  hasChildren={true}
                  isOpen={bookingsOpen}
                  onClick={() => setBookingsOpen(!bookingsOpen)}
                >
                  <Link
                    href="/admin/bookings"
                    className={`block py-2 pl-2 text-sm ${
                      pathname === '/admin/bookings'
                        ? 'text-primary font-medium'
                        : 'text-gray-600 hover:text-primary'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    All Bookings
                  </Link>
                  <Link
                    href="/admin/bookings/pending"
                    className={`block py-2 pl-2 text-sm ${
                      pathname === '/admin/bookings/pending'
                        ? 'text-primary font-medium'
                        : 'text-gray-600 hover:text-primary'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Pending Bookings
                  </Link>
                </SidebarItem>
                <SidebarItem
                  icon={<Users className="h-5 w-5" />}
                  label="Users"
                  href="/admin/users"
                  active={pathname === '/admin/users'}
                />
                <SidebarItem
                  icon={<Settings className="h-5 w-5" />}
                  label="Manage Site"
                  href="/admin/manage-site"
                  active={pathname === '/admin/manage-site'}
                />
              </nav>
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleSignOut}
                  className="flex items-center text-red-500 hover:text-red-700 transition-colors w-full"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 pt-16 md:pt-0">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
  );
}
