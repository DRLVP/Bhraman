import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

/**
 * User data interface
 */
interface UserData {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  profileImage?: string;
  phone?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Custom hook for authentication and user role management
 * @returns Authentication state and user role information
 */
export const useAuth = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [role, setRole] = useState<string>('user');

  useEffect(() => {
    const fetchUserRole = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          // Fetch user data from our API
          const response = await axios.get('/api/auth/me');
          if (response) {
            const data = response.data;
            setUserData(data);
            setRole(data.role || 'user');
          }
        } catch (err: unknown) {
          console.error('Error fetching user role:', err);
          // We don't set an error state here as this is a background fetch
          // and we don't want to show an error to the user
        } finally {
          setIsLoading(false);
        }
      } else if (isLoaded && !isSignedIn) {
        setUserData(null);
        setRole('user');
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [isLoaded, isSignedIn, user]);

  return {
    user,
    userData,
    role,
    isLoaded,
    isSignedIn,
    isLoading,
    isUser: role === 'user',
    isAdmin: role === 'admin',
  };
};

export default useAuth;