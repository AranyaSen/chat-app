import crypto from "crypto";

export const generateEmailToken = () => {
  const token = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  return hashedToken;
};

export const createHashedToken = (rawToken: string) => {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
};
