export type AuthUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  is_verified: boolean;
  is_active?: boolean;
  image?: string | null;
  is_logged_in?: boolean;
};

export type VerifiedEmailUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  is_active: boolean;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type MessageResponse = {
  success: boolean;
  message: string;
};

export type ChangeEmailPayload = {
  email: string;
};
