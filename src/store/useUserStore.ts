import { create } from 'zustand';

/**
 * User store state interface
 */
interface UserState {
  user: {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
  } | null;
  isLoading: boolean;
  setUser: (user: UserState['user']) => void;
  clearUser: () => void;
  setLoading: (isLoading: boolean) => void;
}

/**
 * Zustand store for user state management
 */
const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: true,
  
  setUser: (user) => set({ user }),
  
  clearUser: () => set({ user: null }),
  
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useUserStore;