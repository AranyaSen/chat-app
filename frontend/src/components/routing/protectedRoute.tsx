import { useAuthStore } from "@/stores/authStore";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);

  const isLoggedIn = user?.is_logged_in;
  const isVerified = user?.is_verified;

  if (!user || !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
}
