'use client';

import { useEffect } from 'react';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SignOutPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    // Sign out and redirect to home page
    const performSignOut = async () => {
      await signOut();
      router.push('/');
    };

    performSignOut();
  }, [signOut, router]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-md text-center">
      <h1 className="text-2xl font-bold mb-6">Signing out...</h1>
      <p>You are being signed out. Please wait.</p>
    </div>
  );
}