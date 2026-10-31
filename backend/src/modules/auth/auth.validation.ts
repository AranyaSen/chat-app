import z from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(50),
  username: z.string().trim().min(3).max(30),
  password: z.string().min(8).max(32),
  email: z.string().trim().email(),
});

export const loginSchema = z.object({
  username: z.string().trim().min(3),
  password: z.string().min(1),
});

export const changeEmailSchema = z.object({
  email: z.string().trim().email(),
});

export const registerRequestSchema = z.object({
  body: registerSchema,
});

export const loginRequestSchema = z.object({
  body: loginSchema,
});

export const changeEmailRequestSchema = z.object({
  body: changeEmailSchema,
});

export type RegisterType = z.infer<typeof registerSchema>;
export type LoginType = z.infer<typeof loginSchema>;
