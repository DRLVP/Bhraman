'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, CreditCard, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useUserAuth';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

/**
 * BookingForm props interface
 */
interface BookingFormProps {
  packageId: string;
  packageName: string;
  price: number;
  discountedPrice?: number;
  maxGroupSize: number;
}

/**
 * BookingForm component for booking travel packages
 */
const BookingForm = ({
  packageId,
  packageName,
  price,
  discountedPrice,
  maxGroupSize,
}: BookingFormProps) => {
  const router = useRouter();
  const { isSignedIn, isUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    startDate: new Date(),
    numberOfPeople: 1,
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });
  
  // Fetch user data when signed in
  useEffect(() => {
    const fetchUserData = async () => {
      if (isSignedIn) {
        try {
          setIsLoading(true);
          const { data: userData } = await axios.get('/api/users/me');
          
          // Pre-fill form with user data
          setFormData((prev) => ({
            ...prev,
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
          }));
        } catch (err) {
          console.error('Error fetching user data:', err);
          // Don't show error to user, just log it
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchUserData();
  }, [isSignedIn]);

  // Calculate total amount
  const pricePerPerson = discountedPrice || price || 0;
  const totalAmount = pricePerPerson * formData.numberOfPeople;

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear phone error when user types in phone field
    if (name === 'phone') {
      setPhoneError(null);
      
      // Basic phone validation - must be at least 10 digits
      if (value && value.replace(/\D/g, '').length < 10) {
        setPhoneError('Phone number must have at least 10 digits');
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numberOfPeople' ? parseInt(value) || 1 : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPhoneError(null);
    
    // Validate phone number
    if (!formData.phone || formData.phone.trim() === '') {
      setPhoneError('Phone number is required');
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Phone number is required',
      });
      return;
    }
    
    // Check if phone number has at least 10 digits
    if (formData.phone.replace(/\D/g, '').length < 10) {
      setPhoneError('Phone number must have at least 10 digits');
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Phone number must have at least 10 digits',
      });
      return;
    }
    
    setIsLoading(true);

    if (!isSignedIn) {
      setError('Please sign in to book a package');
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'Please sign in to book a package',
      });
      setIsLoading(false);
      return;
    }

    // Check if the user has the 'user' role
    if (!isUser) {
      setError('Only users can book packages. Please contact support if you believe this is an error.');
      toast({
        variant: 'destructive',
        title: 'Authorization Error',
        description: 'Only users can book packages. Please contact support if you believe this is an error.',
      });
      setIsLoading(false);
      return;
    }

    try {
      // Create booking
      const { data } = await axios.post('/api/bookings', {
        packageId,
        startDate: formData.startDate,
        numberOfPeople: formData.numberOfPeople,
        totalAmount,
        contactInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        specialRequests: formData.specialRequests,
      });
      
      // Show success toast with pending status information
      toast({
        title: 'Booking Submitted Successfully',
        description: `Your booking for ${packageName} has been submitted! It will be pending until confirmed by an administrator. You'll be notified once it's confirmed.`,
      });

      // Redirect to booking success page
      router.push(`/dashboard/bookings/success?bookingId=${data.bookingId}`);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while booking';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Book Your Trip</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Date selection */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.startDate instanceof Date ? formData.startDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : new Date();
                  setFormData((prev) => ({
                    ...prev,
                    startDate: date,
                  }));
                }}
                className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Number of people */}
          <div>
            <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700 mb-1">
              Number of People
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="numberOfPeople"
                name="numberOfPeople"
                required
                value={formData.numberOfPeople}
                onChange={handleChange}
                className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              >
                {Array.from({ length: maxGroupSize }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'person' : 'people'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact information */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={`pl-10 block w-full rounded-md border ${phoneError ? 'border-red-500' : 'border-gray-300'} py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary`}
                    placeholder="Enter your 10-digit phone number"
                  />
                </div>
                {phoneError && (
                  <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Special requests */}
          <div>
            <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
              Special Requests (Optional)
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              rows={3}
              value={formData.specialRequests}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Price summary */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between mb-2">
              <span>Price per person:</span>
              <span>₹{pricePerPerson ? pricePerPerson.toLocaleString('en-IN') : '0'}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Number of people:</span>
              <span>{formData.numberOfPeople}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
              <span>Total Amount:</span>
              <span>₹{totalAmount ? totalAmount.toLocaleString('en-IN') : '0'}</span>
            </div>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2"
          >
            {isLoading ? 'Processing...' : 'Confirm Booking'}
            {!isLoading && <CreditCard className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;