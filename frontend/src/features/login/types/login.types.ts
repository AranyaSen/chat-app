export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResult =
  | {
      id: string;
      name: string;
      username: string;
      email: string;
      is_verified: boolean;
    }
  | {
      testInboxUrl?: string | null;
    };
