'use client';

import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';
import { useHomeConfig } from '@/hooks/useHomeConfig';

export default function ContactPage() {
  const { homeConfig, isLoading } = useHomeConfig();
  
  // Function to render the appropriate icon based on platform name
  const renderSocialIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-6 w-6" />;
      case 'instagram':
        return <Instagram className="h-6 w-6" />;
      case 'twitter':
        return <Twitter className="h-6 w-6" />;
      case 'youtube':
        return <Youtube className="h-6 w-6" />;
      case 'linkedin':
        return <Linkedin className="h-6 w-6" />;
      default:
        return <Facebook className="h-6 w-6" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="h-32 bg-gray-200 rounded w-full max-w-md"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {homeConfig?.contactSection?.heading || 'Contact Us'}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {homeConfig?.contactSection?.subheading || 
            'Have questions about our travel packages or need assistance planning your trip? We are here to help you create unforgettable travel experiences.'}
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
            <p>We&apos;d love to hear from you. Contact us using the information below.</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <MapPin className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Our Office</h3>
                <p className="text-sm text-gray-500">
                  {homeConfig?.contactSection?.address ? (
                    <>
                      {homeConfig.contactSection.address.split(',').map((line, index) => (
                        <span key={index}>
                          {line.trim()}
                          {index < homeConfig.contactSection.address.split(',').length - 1 && <br />}
                        </span>
                      ))}
                    </>
                  ) : (
                    <>
                      123 Travel Street, Connaught Place<br />
                      New Delhi, 110001<br />
                      India
                    </>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Phone className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Phone</h3>
                {homeConfig?.contactSection?.phone ? (
                  homeConfig.contactSection.phone.split(',').map((phone, index) => (
                    <p key={index} className="text-sm text-gray-500">{phone.trim()}</p>
                  ))
                ) : (
                  <>
                    <p className="text-sm text-gray-500">+91 11 2345 6789</p>
                    <p className="text-sm text-gray-500">+91 98765 43210</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Mail className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Email</h3>
                {homeConfig?.contactSection?.email ? (
                  homeConfig.contactSection.email.split(',').map((email, index) => (
                    <p key={index} className="text-sm text-gray-500">{email.trim()}</p>
                  ))
                ) : (
                  <>
                    <p className="text-sm text-gray-500">info@bhraman.com</p>
                    <p className="text-sm text-gray-500">support@bhraman.com</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Working Hours</h3>
                {homeConfig?.contactSection?.workingHours ? (
                  homeConfig.contactSection.workingHours.split('\n').map((line, index) => (
                    <p key={index} className="text-sm text-gray-500">{line.trim()}</p>
                  ))
                ) : (
                  <>
                    <p className="text-sm text-gray-500">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-sm text-gray-500">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-sm text-gray-500">Sunday: Closed</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Connect With Us</h3>
          <div className="flex space-x-4">
            {homeConfig?.siteSettings?.socialMediaLinks && homeConfig.siteSettings.socialMediaLinks.length > 0 ? (
              // Render dynamic social media links
              homeConfig.siteSettings.socialMediaLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-600 hover:text-blue-600"
                  aria-label={link.platform}
                >
                  {renderSocialIcon(link.icon)}
                </a>
              ))
            ) : (
              // Fallback to default social media links if none are configured
              <>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-600">
                  <Youtube className="h-6 w-6" />
                </a>
              </>
            )}
          </div>
        </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Us</h2>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                {/* In a real application, you would use a proper map component like Google Maps or Mapbox */}
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Map would be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-2">Find answers to common questions about our services</p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">How do I book a travel package?</h3>
                <p className="mt-2 text-gray-600">
                  You can book a travel package by browsing our packages, selecting the one you&apos;re interested in, 
                  and clicking the &quot;Book Now&quot; button. Follow the steps to complete your booking, including providing 
                  traveler information and making payment.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">What payment methods do you accept?</h3>
                <p className="mt-2 text-gray-600">
                  We accept various payment methods including credit/debit cards (Visa, MasterCard, American Express), 
                  net banking, UPI, and wallet payments. All payments are processed securely through our payment gateway.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Can I customize a travel package?</h3>
                <p className="mt-2 text-gray-600">
                  Yes, we offer customization options for most of our travel packages. Please contact our customer 
                  service team with your requirements, and we&apos;ll work with you to create a personalized travel experience.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">What is your cancellation policy?</h3>
                <p className="mt-2 text-gray-600">
                  Our cancellation policy varies depending on the package and how far in advance you cancel. Generally, 
                  cancellations made 30+ days before departure receive a full refund minus processing fees. Please refer 
                  to the specific terms and conditions for each package for detailed information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}