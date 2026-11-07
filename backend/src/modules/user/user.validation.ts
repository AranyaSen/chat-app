import z from "zod";

export const searchUsersSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
});

export const searchUsersRequestSchema = z.object({
  query: searchUsersSchema,
});

export type SearchUserType = z.infer<typeof searchUsersSchema>;
