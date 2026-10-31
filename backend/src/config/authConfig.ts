import { env } from "./env.js";

export const authConfig = {
  accessSecret: env.ACCESS_SECRET,
  refreshSecret: env.REFRESH_SECRET,
  accessExpiry: "15m",
  refreshExpiry: "7d",
  accessMaxAgeMs: 15 * 60 * 1000,
  refreshMaxAgeMs: 7 * 24 * 60 * 60 * 1000,
};
