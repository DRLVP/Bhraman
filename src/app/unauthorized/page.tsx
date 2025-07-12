'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-red-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Access Denied</h1>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              You don&apos;t have permission to access this page. This area is restricted to administrators only.
            </p>
            {isSignedIn && (
              <p className="text-gray-600 text-sm">
                Signed in as: <span className="font-medium">{user?.primaryEmailAddress?.emailAddress}</span>
              </p>
            )}
          </div>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
            >
              Return to Homepage
            </button>
            
            {isSignedIn ? (
              <button
                onClick={() => router.push('/user/profile')}
                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition duration-200"
              >
                Go to Your Profile
              </button>
            ) : (
              <button
                onClick={() => router.push('/sign-in')}
                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition duration-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}