import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  AuthUser,
  PendingVerification,
} from "@/features/auth/types";

type AuthState = {
  user: AuthUser | null;
  pendingVerification: PendingVerification | null;
  setSession: (user: AuthUser) => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  setPendingVerification: (
    pending: Omit<PendingVerification, "requestedAt">,
  ) => void;
  clearPendingVerification: () => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      pendingVerification: null,
      setSession: (user) => set({ user, pendingVerification: null }),
      updateUser: (patch) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...patch } : null,
        })),
      setPendingVerification: (pending) =>
        set((state) => ({
          pendingVerification: {
            ...pending,
            email:
              pending.email ??
              (state.pendingVerification?.username === pending.username
                ? state.pendingVerification.email
                : undefined),
            requestedAt: Date.now(),
          },
        })),
      clearPendingVerification: () => set({ pendingVerification: null }),
      clearSession: () => set({ user: null, pendingVerification: null }),
    }),
    {
      name: "auth",
      version: 1,
      partialize: (state) => ({
        user: state.user,
        pendingVerification: state.pendingVerification,
      }),
    },
  ),
);
