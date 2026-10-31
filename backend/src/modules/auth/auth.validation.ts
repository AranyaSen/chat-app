import z from "zod";

export const registerSchema = z.object({
  name: z.string(),
  username: z.string(),
  password: z.string(),
  email: z.string(),
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type RegisterType = z.infer<typeof registerSchema>;
export type LoginType = z.infer<typeof loginSchema>;
