import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/features/auth/api/auth.api";

export function useLoginMutation() {
  return useMutation({ mutationFn: authApi.login });
}

export function useRegisterMutation() {
  return useMutation({ mutationFn: authApi.register });
}

export function useChangeEmailMutation() {
  return useMutation({ mutationFn: authApi.changeEmail });
}

export function useRefreshMutation() {
  return useMutation({ mutationFn: authApi.refresh });
}

export function useLogoutMutation() {
  return useMutation({ mutationFn: authApi.logout });
}

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: authApi.verifyEmail,
    retry: false,
  });
}
