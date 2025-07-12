'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import usePackageStore from '@/store/usePackageStore';
import { useHomeConfig } from '@/hooks/useHomeConfig';
import { useEffect } from 'react';

export default function HomeClient() {
  const { featuredPackages, fetchFeaturedPackages, isLoading: packagesLoading } = usePackageStore();
  const { homeConfig, isLoading: configLoading } = useHomeConfig();
  
  useEffect(() => {
    fetchFeaturedPackages();
  }, [fetchFeaturedPackages]);
  
  const isLoading = packagesLoading || configLoading;

  return (
    <main>
      <Navbar/>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: `url(${homeConfig?.heroSection?.backgroundImage || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=80'})`, 
            filter: 'brightness(0.7)',
          }}
        />
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            {homeConfig?.heroSection?.heading || 'Explore the Beauty of India'}
          </h1>
          <p className="text-xl sm:text-2xl mb-8">
            {homeConfig?.heroSection?.subheading || 'Discover amazing places and create unforgettable memories with our premium travel packages'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={homeConfig?.heroSection?.ctaLink || '/packages'}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white cursor-pointer">
                {homeConfig?.heroSection?.ctaText || 'Explore Packages'}
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 cursor-pointer">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {homeConfig?.featuredPackagesSection?.heading || 'Popular Destinations'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {homeConfig?.featuredPackagesSection?.subheading || 'Explore our most popular travel packages'}
            </p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-gray-600">Loading packages...</p>
            </div>
          ) : featuredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPackages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-60">
                    <Image 
                      src={pkg.images && pkg.images.length > 0 ? pkg.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'} 
                      alt={pkg.title} 
                      className="w-full h-full object-cover"
                      width={400}
                      height={300}
                    />
                    {pkg.discountedPrice && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                        {Math.round(((pkg.price - pkg.discountedPrice) / pkg.price) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">  
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {pkg.location}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {pkg.duration} {pkg.duration === 1 ? 'day' : 'days'}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        Max {pkg.maxGroupSize} people
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {pkg.discountedPrice ? (
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
                        <Button variant="outline" className="w-full cursor-pointer">
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/book/${pkg.slug}`} className="flex-1">
                        <Button className="w-full cursor-pointer">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No packages found. Please check back later.</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/packages">
              <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                View All Packages
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                {homeConfig?.aboutSection?.heading || 'About Bhraman'}
              </h2>
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: homeConfig?.aboutSection?.content || 
                  `<p>
                    Bhraman is a premier travel company specializing in curated travel experiences across India. 
                    With over 10 years of experience, we've helped thousands of travelers discover the beauty, 
                    culture, and heritage of India.
                  </p>
                  <p>
                    Our team of expert travel consultants and local guides ensure that every journey is authentic, 
                    comfortable, and memorable. We pride ourselves on attention to detail, personalized service, 
                    and sustainable travel practices.
                  </p>
                  <p>
                    Whether you're looking for adventure, relaxation, cultural immersion, or a mix of experiences, 
                    Bhraman has the perfect package for you.
                  </p>`,
                }} />
              </div>
              <div className="mt-8">
                <Link href="/about">
                  <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                    Learn More <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image 
                src={homeConfig?.aboutSection?.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80'} 
                alt="About Bhraman" 
                className="rounded-lg shadow-xl w-full h-auto object-cover"
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            {homeConfig?.contactSection?.heading || 'Ready to Start Your Adventure?'}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {homeConfig?.contactSection?.subheading || 'Contact us today to plan your perfect trip or browse our packages to find your dream destination.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 cursor-pointer">
                Explore Packages
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 cursor-pointer">
                Contact us
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
}