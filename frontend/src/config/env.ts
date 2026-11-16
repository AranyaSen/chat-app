import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.url("Invalid url").optional().or(z.literal("")),
});

export const env = envSchema.parse(import.meta.env);

export const PROXY_BASE_PATH = "/chat-app";
export const PROXY_URL_PATH = `${PROXY_BASE_PATH}/api`;
export const SOCKET_URL_PATH = `${PROXY_BASE_PATH}/socket.io`;
