export type AuthUser = {
  id: string;
  user_id?: string;
  name: string;
  username: string;
  email: string;
  is_verified: boolean;
  is_active?: boolean;
  image?: string | null;
};

export type VerifiedEmailUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  is_active: boolean;
};

export type RegisterPayload = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type ChangeEmailPayload = {
  email: string;
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

export type PendingVerification = {
  username: string;
  email?: string;
  requestedAt: number;
};

export type ApiFieldError = {
  field: string;
  message: string;
};

export type ApiErrorPayload = {
  success?: boolean;
  message?: string;
  errors?: ApiFieldError[];
};
