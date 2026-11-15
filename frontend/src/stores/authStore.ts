import { create } from "zustand";

import type { AuthUser } from "@/features/auth/types/auth.types";

type AuthStore = {
  user: AuthUser | null;
  setSession: (user: AuthUser) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setSession: (user) => set({ user: { ...user, is_logged_in: true } }),
  clearSession: () => set({ user: null }),
}));
