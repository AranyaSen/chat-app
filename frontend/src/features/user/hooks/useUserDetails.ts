import { useQuery } from "@tanstack/react-query";

import { userApi } from "@/features/user/api/user.api";

export function useUserDetails() {
  return useQuery({
    queryKey: ["user", "details"],
    queryFn: userApi.details,
    retry: false,
  });
}
