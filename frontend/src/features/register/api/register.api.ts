import type { ApiResponse } from "@/features/auth/types/auth.types";
import type { RegisterPayload, RegisterResult } from "../types/register.types";
import { api } from "@/lib/api";

export const registerApi = {
  async register(payload: RegisterPayload) {
    const response = await api.post<ApiResponse<RegisterResult>>(
      "/auth/register",
      payload,
    );
    return response.data;
  },
};
