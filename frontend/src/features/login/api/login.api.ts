import type {
  ApiResponse,
  AuthUser,
  LoginPayload,
} from "@/features/auth/types";
import { apiRequest } from "@/lib/api";

export const loginApi = {
  login(payload: LoginPayload) {
    return apiRequest<ApiResponse<AuthUser>>({
      url: "/auth/login",
      method: "POST",
      data: payload,
      retryOnUnauthorized: false,
    });
  },
};
