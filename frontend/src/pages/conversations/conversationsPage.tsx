import { parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";
import { AmbientBackground } from "@/components/layout/ambientBackground";
import { ChatPlaceholder } from "@/features/conversations/components/chatPlaceholder";
import { ChatSidebar } from "@/features/conversations/components/chatSidebar";
import { ChatWindow } from "@/features/conversations/components/chatWindow";
import { useConversations } from "@/features/conversations/hooks/useConversations";
import { useFindDirectConversation } from "@/features/conversations/hooks/useFindDirectConversation";
import { useLogout } from "@/features/auth/hooks/useLogout";
import type { UserSearchResult } from "@/features/user/types";
import { useAuthStore } from "@/stores/authStore";

export function ConversationsPage() {
  const user = useAuthStore((state) => state.user);
  const { logout, isLoggingOut } = useLogout();
  const [selectedConversationId, setSelectedConversationId] = useQueryState(
    "conversation",
    parseAsString,
  );

  const {
    data: conversationsData,
    isPending: isLoadingConversations,
    isError: isConversationsError,
  } = useConversations();

  const findDirectConversation = useFindDirectConversation();
  const conversations = conversationsData?.data ?? [];

  if (!user) return null;

  const handleSelectUser = (result: UserSearchResult) => {
    findDirectConversation.mutate(result.id, {
      onSuccess: (response) => {
        const conversationId = response.data?.id;
        if (conversationId) setSelectedConversationId(conversationId);
      },
      onError: () => {
        toast.error("Could not open that conversation.");
      },
    });
  };

  return (
    <div className="relative h-dvh overflow-hidden p-2.5 sm:p-4 lg:p-5">
      <AmbientBackground />

      <div className="relative mx-auto flex h-full max-w-300 flex-col overflow-hidden rounded-[26px] glass-panel shadow-soft sm:rounded-[30px] md:flex-row">
        <ChatSidebar
          user={user}
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          isLoadingConversations={isLoadingConversations}
          isConversationsError={isConversationsError}
          onSelectConversation={setSelectedConversationId}
          onSelectUser={handleSelectUser}
          onSignOut={() => void logout()}
          isSigningOut={isLoggingOut}
          className="h-[45dvh] w-full shrink-0 border-b border-border/55 md:h-auto md:w-79.5 md:border-b-0 md:border-r"
        />

        {selectedConversationId ? (
          <ChatWindow user={user} conversationId={selectedConversationId} />
        ) : (
          <ChatPlaceholder />
        )}
      </div>
    </div>
  );
}
