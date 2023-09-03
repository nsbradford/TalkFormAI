// store.ts
import create from 'zustand';
import { Session } from '@supabase/gotrue-js';

type Store = {
  user: User | null;
  session: Session | null;
  isSessionLoading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setIsSessionLoading: (isLoading: boolean) => void;
};

export const useStore = create<Store>((set) => ({
  user: null,
  session: null,
  isSessionLoading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setIsSessionLoading:
