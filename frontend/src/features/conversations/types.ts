export type ChatUser = {
  id: string;
  username: string;
  name: string;
  image?: string | null;
};

export type ChatMessage = {
  id: string;
  sent_at: string;
  content: string | null;
  edited_at: string | null;
  user: string;
};

type LastMessagePreview = {
  id?: string;
  content?: string | null;
  sender_id?: string;
  sent_at?: string;
};
export type ConversationListItem = {
  conversationId: string | null;
  user: ChatUser | null;
  lastMessage?: LastMessagePreview;
};
