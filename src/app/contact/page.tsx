'use client';

import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useHomeConfig } from '@/hooks/useHomeConfig';

export default function ContactPage() {
  const { homeConfig, isLoading } = useHomeConfig();
  
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
            <p>We'd love to hear from you. Contact us using the information below.</p>
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
            <a href="#" className="text-gray-600 hover:text-blue-600">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-400">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-600 hover:text-pink-600">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-red-600">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
              </a>
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
                  You can book a travel package by browsing our packages, selecting the one you're interested in, 
                  and clicking the "Book Now" button. Follow the steps to complete your booking, including providing 
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
                  service team with your requirements, and we'll work with you to create a personalized travel experience.
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