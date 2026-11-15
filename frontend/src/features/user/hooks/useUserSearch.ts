import { useQuery } from "@tanstack/react-query";

import { userApi } from "@/features/user/api/user.api";

export function useUserSearch(username: string) {
  return useQuery({
    queryKey: ["users", "search", username],
    queryFn: () => userApi.search(username),
    enabled: username.length > 0,
  });
}
