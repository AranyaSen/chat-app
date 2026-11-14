import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/stores/authStore";

export function useLogout() {
  const queryClient = useQueryClient();
  const { mutate: requestLogout, isPending } = useMutation({
    mutationFn: authApi.logout,
  });
  const clearSession = useAuthStore((state) => state.clearSession);
  const navigate = useNavigate();

  const logout = () => {
    requestLogout(undefined, {
      onSettled: () => {
        // The local session should still be cleared if the API is unavailable.
        clearSession();
        queryClient.clear();
        navigate("/login", { replace: true });
        toast.success("You're signed out");
      },
    });
  };

  return { logout, isLoggingOut: isPending };
}
