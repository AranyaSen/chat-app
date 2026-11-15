import type { ApiResponse } from "@/features/auth/types/auth.types";
import type { LoginPayload, LoginResult } from "../types/login.types";
import { api } from "@/lib/api";

export const loginApi = {
  async login(payload: LoginPayload) {
    const response = await api.post<ApiResponse<LoginResult>>(
      "/auth/login",
      payload,
    );
    return response.data;
  },
};
