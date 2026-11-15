import type { ApiResponse } from "@/features/auth/types/auth.types";
import type { UserDetails, UserSearchResult } from "@/features/user/types";
import { api } from "@/lib/api";

export const userApi = {
  details: async () => {
    const res = await api.get<ApiResponse<UserDetails>>("/user/details");
    return res.data;
  },

  search: async (username: string) => {
    const res = await api.get<ApiResponse<UserSearchResult[]>>(
      `/user/search/${encodeURIComponent(username)}`,
    );
    return res.data;
  },
};
