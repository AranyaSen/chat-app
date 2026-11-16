import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLoader } from "@/components/feedback/appLoader";
import { userApi } from "@/features/user/api/user.api";
import { useAuthStore } from "@/stores/authStore";
import { socket } from "@/lib/socket";

export const AppBootstrap = ({ children }: { children: ReactNode }) => {
  const { data: userDetails, isPending } = useQuery({
    queryKey: ["user-details"],
    queryFn: userApi.details,
    retry: false,
  });

  const setSession = useAuthStore((state) => state.setSession);
  const details = userDetails?.data;

  useEffect(() => {
    if (!details) return;

    setSession({
      username: details.username,
      id: details.id,
      name: details.name,
      email: details.email,
      is_active: details.is_active,
      is_verified: details.is_verified,
      image: details.image,
    });

    socket.connect();
    return () => { socket.disconnect(); };
  }, [details, setSession]);

  if (isPending) {
    return <AppLoader />;
  }

  return children;
};
