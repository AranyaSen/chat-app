import { parseAsString, useQueryState } from "nuqs";
import { AmbientBackground } from "@/components/layout/ambientBackground";
import { ChatPlaceholder } from "@/features/conversations/components/chatPlaceholder";
import { ChatSidebar } from "@/features/conversations/components/chatSidebar";
import { ChatWindow } from "@/features/conversations/components/chatWindow";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { type UserSearchResult } from "@/features/user/types";

export function ConversationsPage() {
  const user = useAuthStore((state) => state.user);
  const [selectedConversationId, setSelectedConversationId] = useQueryState(
    "conversation",
    parseAsString,
  );

  const [chatUser, setChatUser] = useState<UserSearchResult>(null);

  const handleSelectChatUser = (user: UserSearchResult) => {
    setChatUser(user);
    if (user.conversationId) {
      setSelectedConversationId(user.conversationId);
      return;
    }
    setSelectedConversationId(null);
  };

  if (!user) return null;

  return (
    <div className="relative h-dvh overflow-hidden p-2.5 sm:p-4 lg:p-5">
      <AmbientBackground />

      <div className="relative mx-auto flex h-full max-w-300 flex-col overflow-hidden rounded-[26px] glass-panel shadow-soft sm:rounded-[30px] md:flex-row">
        <ChatSidebar
          user={user}
          selectedConversationId={selectedConversationId}
          onSelectChatUser={handleSelectChatUser}
          className="h-[45dvh] w-full shrink-0 border-b border-border/55 md:h-auto md:w-79.5 md:border-b-0 md:border-r"
        />

        {selectedConversationId ? (
          <ChatWindow
            user={user}
            conversationId={selectedConversationId}
            selectedChatUser={chatUser}
          />
        ) : (
          <ChatPlaceholder />
        )}
      </div>
    </div>
  );
}
