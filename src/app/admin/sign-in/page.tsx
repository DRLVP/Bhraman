'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSignIn, useSignUp, useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

export default function AdminSignInPage() {
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp,  setActive: setSignUpActive } = useSignUp();
  const { signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/admin';
  const { toast } = useToast();
  
  // Toggle between sign-in and sign-up forms
  const [isSignIn, setIsSignIn] = useState(true);
  
  // Shared form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  
  // OTP verification states
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isSignInLoaded) {
      setError('Authentication system is not ready yet');
      setLoading(false);
      return;
    }

    try {
      // Sign in with email and password
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        // Set this session as active
        await setSignInActive({ session: result.createdSessionId });

        try {
          // Check if the user is an admin
          const adminResponse = await axios.get('/api/admin-auth/me');
          console.log("response after sign in:::", adminResponse);
          
          // User is an admin, redirect to admin dashboard or the requested URL
          router.push(redirectUrl);
        } catch (adminError) {
          // User is not an admin
          setError(`You do not have admin privileges. Please contact the system administrator. ${adminError}` );
          // Sign out the user since they don't have admin access
          await signOut();
        }
      } else {
        // Sign in failed
        setError('Invalid email or password');
      }
    } catch (err: Error | unknown) {
      console.error('Error signing in:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };
 
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isSignUpLoaded || !signUp) {
      setError('Authentication system is not ready yet');
      setLoading(false);
      return;
    }

    try {
      // Start the sign-up process with Clerk
      await signUp.create({
        emailAddress: email,
        password
      });

      // Prepare email verification (sends OTP to email)
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      
      // Show verification form
      setShowVerification(true);
      setError('Please check your email for a verification code');
      setLoading(false);
    } catch (err: Error | unknown) {
      console.error('Error during sign-up:', err);
      setError(err instanceof Error ? err.message : (err as { errors?: Array<{ message: string }> })?.errors?.[0]?.message || 'An error occurred during sign-up');
      setLoading(false);
    }
  };
  
  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!signUp) {
      setError('Authentication system is not ready yet');
      setLoading(false);
      return;
    }

    try {
      // Verify the email address with the code
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });
      console.log("result after verification", result);
      
      if (result.status === 'complete') {
        // Set the newly created session as active
        const createdSessionId = result.createdSessionId;
        if (createdSessionId && setSignUpActive) {
          await setSignUpActive({ session: createdSessionId });
          router.push("/admin");
        }

        try {
          // Register as admin in MongoDB
          const adminResponse = await axios.post('/api/admin-auth/me', {
            email: email,
            name: email.split('@')[0], // Use part of email as name if not provided
          });

          if (!adminResponse) {
            throw new Error('Failed to register as admin');
          }

          // Redirect to admin dashboard
          router.push('/admin');
        } catch (adminError: Error | unknown) {
          console.error('Error registering as admin:', adminError);
          setError(adminError instanceof Error ? adminError.message : 'Failed to register as admin. Please contact support.');
          setLoading(false);
        }
      } else {
        setError('Verification failed. Please try again.');
        setLoading(false);
      }
    } catch (err: Error | unknown) {
      console.error('Error during verification:', err);
      setError(err instanceof Error ? err.message : (err as { errors?: Array<{ message: string }> })?.errors?.[0]?.message || 'An error occurred during verification');
      setLoading(false);
    }
  };
  
  // Determine which submit handler to use based on the current form and verification state
  const handleSubmit = isSignIn ? handleSignIn : (showVerification ? handleVerification : handleSignUp);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">{isSignIn ? 'Admin Sign In' : 'Admin Registration'}</h1>
          <p className="text-indigo-100 mt-1">{isSignIn ? 'Access your admin dashboard' : 'Create your admin account'}</p>
        </div>
        
        {/* Toggle between sign-in and sign-up */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setIsSignIn(true);
              setShowVerification(false);
              setError('');
            }}
            className={`flex-1 py-3 px-4 text-center font-medium ${isSignIn ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsSignIn(false);
              setShowVerification(false);
              setError('');
            }}
            className={`flex-1 py-3 px-4 text-center font-medium ${!isSignIn ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Sign Up
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {isSignIn ? (
          // Sign In Form
          <form className="p-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-colors duration-200 mt-6 cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        ) : (
          // Sign Up or Verification Form
          !showVerification ? (
            // Sign Up Form
            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                />
              </div>
              {/* Clerk CAPTCHA widget container */}
              <div id="clerk-captcha" data-cl-theme="dark" data-cl-size="flexible" data-cl-language="es-ES" />
              
              <button
                type="submit"
                disabled={loading || !isSignUpLoaded}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-colors duration-200 cursor-pointer mt-4"
              >
                {loading ? 'Processing...' : 'Sign Up'}
              </button>
            </form>
          ) : (
            // Verification Form
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Verify Your Email</h2>
                <p className="text-gray-600 mt-1">We have sent a verification code to {email}</p>
              </div>
              
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter code"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-colors duration-200"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
              
              <p className="text-center text-sm text-gray-600 mt-2">
                Didn&#39t receive the code?{' '}
                <button
                  type="button"
                  onClick={async () => {
                    if (!signUp) {
                      setError('Authentication system is not ready yet');
                      return;
                    }
                    try {
                      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
                      toast({
                        title: "Verification Code Sent",
                        description: "A new verification code has been sent to your email",
                        variant: "default",
                      });
                    } catch (err) {
                      console.error('Error resending code:', err);
                      setError('Failed to resend verification code');
                    }
                  }}
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Resend
                </button>
              </p>
            </form>
          )
        )}
      </div>
    </div>
  );
}