import { authConfig } from "@/config/authConfig.js";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { randomBytes } from "node:crypto";

const encodedAccessSecret = new TextEncoder().encode(authConfig.accessSecret);
const encodedRefreshSecret = new TextEncoder().encode(authConfig.refreshSecret);

export type AuthPayload = {
  username: string;
  userId: string;
  isActive: boolean;
  isVerified: boolean;
  role: "USER" | "ADMIN";
};

export const generateAccessToken = async (payload: AuthPayload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(authConfig.accessExpiry)
    .sign(encodedAccessSecret);
};

export const generateRefreshToken = async (payload: AuthPayload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(authConfig.refreshExpiry)
    .sign(encodedRefreshSecret);
};

export const verifyAccessToken = async (
  token: string,
): Promise<AuthPayload & JWTPayload> => {
  const { payload } = await jwtVerify<AuthPayload>(token, encodedAccessSecret, {
    algorithms: ["HS256"],
  });
  return payload;
};

export const verifyRefreshToken = async (
  token: string,
): Promise<AuthPayload & JWTPayload> => {
  const { payload } = await jwtVerify<AuthPayload>(
    token,
    encodedRefreshSecret,
    {
      algorithms: ["HS256"],
    },
  );
  return payload;
};

export const generateUserId = () => {
  const userId = `USR-${randomBytes(16).toString("base64url")}`;
  return userId;
};
