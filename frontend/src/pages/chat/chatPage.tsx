import { AmbientBackground } from "@/components/layout/ambientBackground";
import { ChatPlaceholder } from "@/features/chat/components/chatPlaceholder";
import { ChatSidebar } from "@/features/chat/components/chatSidebar";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useAuthStore } from "@/stores/authStore";

export function ChatPage() {
  const user = useAuthStore((state) => state.user);
  const { logout, isLoggingOut } = useLogout();

  if (!user) return null;

  return (
    <div className="relative h-dvh overflow-hidden p-2.5 sm:p-4 lg:p-5">
      <AmbientBackground />

      <div className="relative mx-auto flex h-full max-w-[1200px] flex-col overflow-hidden rounded-[26px] glass-panel shadow-soft sm:rounded-[30px] md:flex-row">
        <ChatSidebar
          user={user}
          onSignOut={() => void logout()}
          isSigningOut={isLoggingOut}
          className="w-full shrink-0 border-b border-border/55 md:w-[300px] md:border-b-0 md:border-r"
        />
        <ChatPlaceholder user={user} />
      </div>
    </div>
  );
}
