import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";

export function GuestRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);

  if (!user) return children;
  if (!user.is_verified) return <Navigate to="/verify-email" replace />;

  return <Navigate to="/app" replace />;
}
