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
  ETHEREAL_USER: z.string(),
  ETHEREAL_PASS: z.string(),
  ETHEREAL_USER_NAME: z.string(),
  EMAIL_VERIFICATION_LINK: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configurations:", parsed.error);
  process.exit(1);
}

export const env = parsed.data;
