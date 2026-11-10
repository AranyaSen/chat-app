import type {
  ApiResponse,
  AuthUser,
  RegisterPayload,
} from "@/features/auth/types";
import { apiRequest } from "@/lib/api";

export const registerApi = {
  register(payload: RegisterPayload) {
    return apiRequest<ApiResponse<AuthUser>>({
      url: "/auth/register",
      method: "POST",
      data: payload,
      retryOnUnauthorized: false,
    });
  },
};
