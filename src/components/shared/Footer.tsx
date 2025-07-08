import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

/**
 * Footer component
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-bold mb-4 block">
              Budh Bhraman
            </Link>
            <p className="text-gray-400 mb-4">
              Discover the beauty of North East India with our curated travel experiences.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/packages" className="text-gray-400 hover:text-white transition-colors">
                  Packages
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular destinations */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Popular Destinations</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/packages?location=sikkim" className="text-gray-400 hover:text-white transition-colors">
                  Sikkim
                </Link>
              </li>
              <li>
                <Link href="/packages?location=assam" className="text-gray-400 hover:text-white transition-colors">
                  Assam
                </Link>
              </li>
              <li>
                <Link href="/packages?location=meghalaya" className="text-gray-400 hover:text-white transition-colors">
                  Meghalaya
                </Link>
              </li>
              <li>
                <Link href="/packages?location=arunachal-pradesh" className="text-gray-400 hover:text-white transition-colors">
                  Arunachal Pradesh
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Budh Bhraman. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;