export type Payload = {
  username: string;
  userId: string;
  isActive: boolean;
  isVerified: boolean;
  role: "USER" | "ADMIN";
  iat?: number;
  exp?: number;
};

declare global {
  namespace Express {
    interface Request {
      user?: Payload;
    }
  }
}
