'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Calendar, Users, Star } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import usePackageStore from '@/store/usePackageStore';
import { useEffect } from 'react';

// Mock data for testimonials
const testimonials = [
  {
    id: '1',
    name: 'Rahul Sharma',
    location: 'Delhi',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    rating: 5,
    text: 'Our trip to Sikkim was absolutely amazing! The itinerary was perfectly planned, and our guide was knowledgeable and friendly. The views were breathtaking, and the accommodations were comfortable. Highly recommend!'
  },
  {
    id: '2',
    name: 'Priya Patel',
    location: 'Mumbai',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    rating: 4,
    text: 'The Kerala backwaters tour exceeded our expectations. The houseboat experience was unique and peaceful. The food was delicious, and the staff was attentive. A perfect getaway from the city hustle.'
  },
  {
    id: '3',
    name: 'Amit Kumar',
    location: 'Bangalore',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    rating: 5,
    text: 'Rajasthan Heritage tour was a cultural delight! The palaces, forts, and local experiences were unforgettable. Our guide made sure we experienced the authentic Rajasthani culture. Will definitely book with Bhraman again!'
  }
];

export default function Home() {
  const { featuredPackages, fetchFeaturedPackages, isLoading } = usePackageStore();
  
  useEffect(() => {
    fetchFeaturedPackages();
  }, [fetchFeaturedPackages]);

  return (
    <main>
      <Navbar/>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da)', 
            filter: 'brightness(0.7)'
          }}
        />
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Explore the Beauty of India
          </h1>
          <p className="text-xl sm:text-2xl mb-8">
            Discover amazing places and create unforgettable memories with our premium travel packages
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Explore Packages
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our most popular travel packages
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
                    <img 
                      src={pkg.images && pkg.images.length > 0 ? pkg.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'} 
                      alt={pkg.title} 
                      className="w-full h-full object-cover"
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No packages found. Please check back later.</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/packages">
              <Button variant="outline" className="flex items-center gap-2">
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
              <img 
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa" 
                alt="About Bhraman" 
                className="rounded-lg shadow-md w-full h-auto"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About Bhraman</h2>
              <h3 className="text-xl text-gray-600 mb-6">Your Trusted Travel Partner</h3>
              <p className="text-gray-600 mb-6">
                Bhraman is a premier travel agency specializing in curated travel experiences across India. With over 10 years of experience, we pride ourselves on creating memorable journeys that showcase the rich cultural heritage, stunning landscapes, and authentic experiences that India has to offer.
              </p>
              <p className="text-gray-600 mb-8">
                Our team of expert travel consultants works closely with local guides and partners to ensure that every aspect of your trip is carefully planned and executed. We believe in responsible tourism and strive to support local communities while minimizing our environmental impact.
              </p>
              <Link href="/about">
                <Button className="flex items-center gap-2">
                  Learn More About Us
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Read testimonials from our satisfied travelers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                
                <div className="flex text-yellow-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < testimonial.rating ? 'fill-current' : 'stroke-current fill-none'}`} 
                    />
                  ))}
                </div>
                
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Contact us today to plan your perfect trip or browse our packages to find your dream destination.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Explore Packages
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
}
