import type {
  ApiResponse,
  ChangeEmailPayload,
  MessageResponse,
  VerifiedEmailUser,
} from "@/features/auth/types";
import { apiRequest } from "@/lib/api";

export const authApi = {
  verifyEmail(token: string) {
    return apiRequest<ApiResponse<VerifiedEmailUser>>({
      url: "/auth/verify-email",
      method: "GET",
      params: { token },
      retryOnUnauthorized: false,
    });
  },

  changeEmail(payload: ChangeEmailPayload) {
    return apiRequest<ApiResponse<null>>({
      url: "/auth/change-email",
      method: "POST",
      data: payload,
    });
  },

  refresh() {
    return apiRequest<MessageResponse>({
      url: "/auth/refresh",
      method: "POST",
      retryOnUnauthorized: false,
    });
  },

  logout() {
    return apiRequest<ApiResponse<null>>({
      url: "/auth/logout",
      method: "POST",
    });
  },
};
