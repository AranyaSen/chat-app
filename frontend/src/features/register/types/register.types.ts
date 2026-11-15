export type RegisterPayload = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type RegisterResult = {
  name: string;
  username: string;
  email: string;
  is_verified: boolean;
};
