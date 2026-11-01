import type {
  ApiResponse,
  AuthUser,
  ChangeEmailPayload,
  LoginPayload,
  MessageResponse,
  RegisterPayload,
  VerifiedEmailUser,
} from "@/features/auth/types";
import { apiRequest } from "@/lib/api";

export const authApi = {
  register(payload: RegisterPayload) {
    return apiRequest<ApiResponse<AuthUser>>({
      url: "/auth/register",
      method: "POST",
      data: payload,
      retryOnUnauthorized: false,
    });
  },

  login(payload: LoginPayload) {
    return apiRequest<ApiResponse<AuthUser>>({
      url: "/auth/login",
      method: "POST",
      data: payload,
      retryOnUnauthorized: false,
    });
  },

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
