'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useUserAuth';
import { useHomeConfig } from '@/hooks/useHomeConfig';

/**
 * Navigation links configuration
 */
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/packages', label: 'Packages' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

/**
 * Navbar component
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  const { homeConfig } = useHomeConfig();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              {homeConfig?.siteSettings?.logo ? (
                <Image 
                  src={homeConfig.siteSettings.logo} 
                  alt="Budh Bhraman Logo" 
                  className="h-8 w-auto"
                  width={32}
                  height={32}
                />
              ) : (
                <span className="text-xl font-bold text-primary">Budh Bhraman</span>
              )}
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === link.href
                    ? 'text-primary font-semibold'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              <SignedIn>
                <div className="relative group">
                  <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 cursor-pointer">
                    My Account
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Bookings
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                  </div>
                </div>
              </SignedIn>
            </div>

            <div className="flex items-center ml-4">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Link href="/sign-in">
                  <Button size="sm" variant="default">
                    Sign In
                  </Button>
                </Link>
              </SignedOut>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <SignedIn>
              <div className="flex items-center mr-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-50 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === link.href
                  ? 'text-primary font-semibold'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <SignedIn>
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                My Bookings
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
            </SignedIn>

            <SignedOut>
              <Link href="/sign-in">
                <Button
                  size="sm"
                  variant="default"
                  className="w-full mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Button>
              </Link>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;