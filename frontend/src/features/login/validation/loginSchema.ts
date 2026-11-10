import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Enter your username")
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be 30 characters or fewer"),
  password: z.string().min(1, "Enter your password"),
});

export type LoginValues = z.infer<typeof loginSchema>;
