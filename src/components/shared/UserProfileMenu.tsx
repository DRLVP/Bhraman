'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Package, UserCircle } from 'lucide-react';
import axios from 'axios';
import useAuth from '@/hooks/useUserAuth';

interface UserProfileMenuProps {
  afterSignOutUrl?: string;
}

const UserProfileMenu = ({ afterSignOutUrl = '/' }: UserProfileMenuProps) => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<{
    id: string;
    clerkId: string;
    name: string;
    email: string;
    profileImage?: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isSignedIn) {
        try {
          setIsLoading(true);
          const { data } = await axios.get('/api/auth/me');
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [isSignedIn]);

  const handleSignOut = async () => {
    await signOut(() => router.push(afterSignOutUrl));
  };

  if (!isSignedIn || !user) {return null;}

  // Use userData if available, otherwise fall back to Clerk user data
  const displayName = userData?.name || user.fullName || 'User';
  const initials = displayName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();
  const profileImage = userData?.profileImage || user.imageUrl;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex items-center focus:outline-none">
                <Avatar className="h-8 w-8 cursor-pointer border border-gray-200 hover:border-primary transition-colors">
                  {isLoading ? (
                    <AvatarFallback className="bg-muted animate-pulse">
                      <span className="sr-only">Loading</span>
                    </AvatarFallback>
                  ) : (
                    <>
                      <AvatarImage src={profileImage} alt={displayName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData?.email || user.emailAddresses[0]?.emailAddress}
            </p>
            {userData?.role && (
              <p className="text-xs mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                  {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                </span>
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
            <UserCircle className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/dashboard')}>
            <Package className="mr-2 h-4 w-4" />
            <span>My Bookings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/admin')}>
                <User className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;