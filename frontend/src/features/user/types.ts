export type UserDetails = {
  id: string;
  username: string;
  name: string;
  email: string;
  image: string | null;
  is_active: boolean;
  is_verified: boolean;
  is_logged_in: boolean;
};

export type UserSearchResult = {
  id: string;
  username: string;
  name: string;
  image?: string | null;
  conversationId: string | null;
};
