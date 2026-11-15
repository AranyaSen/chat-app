import type {
  ApiResponse,
  ChangeEmailPayload,
  MessageResponse,
  VerifiedEmailUser,
} from "@/features/auth/types/auth.types";
import { api } from "@/lib/api";

export const authApi = {
  async verifyEmail(token: string) {
    const response = await api.get<ApiResponse<VerifiedEmailUser>>(
      "/auth/verify-email",
      { params: { token } },
    );
    return response.data;
  },

  async changeEmail(payload: ChangeEmailPayload) {
    const response = await api.post<ApiResponse<null>>(
      "/auth/change-email",
      payload,
    );
    return response.data;
  },

  async refresh() {
    const response = await api.post<MessageResponse>("/auth/refresh");
    return response.data;
  },

  async logout() {
    const response = await api.post<ApiResponse<null>>("/auth/logout");
    return response.data;
  },
};
