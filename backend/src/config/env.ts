import z from "zod";

export const envSchema = z.object({
  NODE_ENV: z.string({ error: "NODE_ENV is required" }),
  PORT: z.string({ error: "PORT is required" }).transform(Number),
  CORS_ORIGINS: z.string({ error: "CORS_ORIGINS is required" }),
  DATABASE_URL: z.string({ error: "DATABASE_URL is required" }),
  DB_MAX_POOL: z.string({ error: "DB_MAX_POOL is required" }).transform(Number),

  ACCESS_SECRET: z.string({ error: "ACCESS_SECRET is required" }),
  REFRESH_SECRET: z.string({ error: "REFRESH_SECRET is required" }),

  MESSAGE_ENCRYPTION_KEY: z
    .string({ error: "MESSAGE_ENCRYPTION_KEY is required" })
    .min(
      64,
      "MESSAGE_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)",
    ),

  EMAIL_HOST: z.string({ error: "EMAIL_HOST is required" }),
  EMAIL_PORT: z.string({ error: "EMAIL_PORT is required" }).transform(Number),
  ETHEREAL_USER: z.string({ error: "ETHEREAL_USER is required" }),
  ETHEREAL_PASS: z.string({ error: "ETHEREAL_PASS is required" }),
  ETHEREAL_USER_NAME: z.string({ error: "ETHEREAL_USER_NAME is required" }),
  EMAIL_VERIFICATION_LINK: z.string({
    error: "EMAIL_VERIFICATION_LINK is required",
  }),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configurations:", parsed.error);
  process.exit(1);
}

export const env = parsed.data;
