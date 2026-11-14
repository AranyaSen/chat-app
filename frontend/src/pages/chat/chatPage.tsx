import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";

import { AmbientBackground } from "@/components/layout/ambientBackground";
import { ChatPlaceholder } from "@/features/chat/components/chatPlaceholder";
import { ChatSidebar } from "@/features/chat/components/chatSidebar";
import { ChatWindow } from "@/features/chat/components/chatWindow";
import { useConversations } from "@/features/chat/hooks/useConversations";
import { useFindDirectConversation } from "@/features/chat/hooks/useFindDirectConversation";
import type {
  ChatUser,
  Conversation,
  ConversationListItem,
} from "@/features/chat/types";
import { getConversationPeer } from "@/features/chat/utils";
import { useLogout } from "@/features/auth/hooks/useLogout";
import type { UserSearchResult } from "@/features/user/types";
import { useAuthStore } from "@/stores/authStore";

const EMPTY_CONVERSATIONS: ConversationListItem[] = [];

export function ChatPage() {
  const user = useAuthStore((state) => state.user);
  const { logout, isLoggingOut } = useLogout();
  const queryClient = useQueryClient();
  const [selectedConversationId, setSelectedConversationId] = useQueryState(
    "conversation",
    parseAsString,
  );
  const [draftPeer, setDraftPeer] = useState<ChatUser | null>(null);

  const {
    data: conversationsData,
    isPending: isLoadingConversations,
    isError: isConversationsError,
  } = useConversations();
  const { mutate: findDirectConversation, isPending: isResolvingUser } =
    useFindDirectConversation();

  const conversations = conversationsData?.data ?? EMPTY_CONVERSATIONS;
  const selectedConversation =
    conversations.find(
      ({ conversation }) => conversation.id === selectedConversationId,
    )?.conversation ?? null;
  const selectedPeer =
    getConversationPeer(selectedConversation, user?.id ?? "") ?? draftPeer;
  const isDraft = !selectedConversationId && Boolean(draftPeer);

  useEffect(() => {
    if (
      selectedConversationId ||
      draftPeer ||
      isLoadingConversations ||
      conversations.length === 0
    ) {
      return;
    }

    setSelectedConversationId(conversations[0].conversation.id);
  }, [
    conversations,
    draftPeer,
    isLoadingConversations,
    selectedConversationId,
    setSelectedConversationId,
  ]);

  if (!user) return null;

  const handleSelectConversation = (conversation: Conversation) => {
    setDraftPeer(null);
    setSelectedConversationId(conversation.id);
  };

  const handleSelectUser = (result: UserSearchResult) => {
    setSelectedConversationId(null);
    setDraftPeer({
      id: result.id,
      user_id: result.user_id,
      username: result.username,
      name: result.name,
      image: result.image,
    });

    findDirectConversation(result.id, {
      onSuccess: (response) => {
        if (response.data?.id) {
          setSelectedConversationId(response.data.id);
          void queryClient.invalidateQueries({ queryKey: ["conversations"] });
          return;
        }

        setSelectedConversationId(null);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not open this conversation.",
        );
      },
    });
  };

  return (
    <div className="relative h-dvh overflow-hidden p-2.5 sm:p-4 lg:p-5">
      <AmbientBackground />

      <div className="relative mx-auto flex h-full max-w-[1200px] flex-col overflow-hidden rounded-[26px] glass-panel shadow-soft sm:rounded-[30px] md:flex-row">
        <ChatSidebar
          user={user}
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          isLoadingConversations={isLoadingConversations}
          isConversationsError={isConversationsError}
          isResolvingUser={isResolvingUser}
          onSelectConversation={handleSelectConversation}
          onSelectUser={handleSelectUser}
          onSignOut={() => void logout()}
          isSigningOut={isLoggingOut}
          className="h-[45dvh] w-full shrink-0 border-b border-border/55 md:h-auto md:w-[318px] md:border-b-0 md:border-r"
        />

        {selectedConversationId || isDraft ? (
          <ChatWindow
            user={user}
            conversationId={selectedConversationId}
            conversation={selectedConversation}
            peer={selectedPeer}
            isDraft={isDraft}
          />
        ) : (
          <ChatPlaceholder />
        )}
      </div>
    </div>
  );
}
