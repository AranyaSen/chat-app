import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";

export function IndexRedirect() {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/login" replace />;
  if (!user.is_verified) return <Navigate to="/verify-email" replace />;

  return <Navigate to="/app" replace />;
}
