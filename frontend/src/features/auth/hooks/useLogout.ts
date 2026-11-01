import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useLogoutMutation } from "@/features/auth/hooks/useAuthMutations";
import { useAuthStore } from "@/stores/authStore";

export function useLogout() {
  const { mutateAsync: requestLogout, isPending } = useLogoutMutation();
  const clearSession = useAuthStore((state) => state.clearSession);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await requestLogout();
    } catch {
      // The local session should still be cleared if the API is unavailable.
    } finally {
      clearSession();
      navigate("/login", { replace: true });
      toast.success("You're signed out");
    }
  };

  return { logout, isLoggingOut: isPending };
}
