import z from "zod";

export const envSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.string().transform(Number),
  CORS_ORIGINS: z.string(),
  DATABASE_URL: z.string(),
  DB_MAX_POOL: z.string().transform(Number),

  ACCESS_SECRET: z.string(),
  REFRESH_SECRET: z.string(),

  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.string().transform(Number),
  EMAIL_PROVIDER: z.string(),
  EMAIL_API_KEY: z.string(),
  EMAIL_VERIFICATION_LINK: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configurations:", parsed.error);
  process.exit(1);
}

export const env = parsed.data;
