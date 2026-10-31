import { prisma } from "@/db/client.js";

export const findUserByUsernameOrEmail = async ({
  username,
  email,
}: {
  username?: string;
  email?: string;
}) => {
  return await prisma.users.findFirst({
    where: {
      OR: [{ username: username }, { email: email }],
    },
  });
};

export const findUserById = async (userId: string) => {
  return await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });
};

export const findUserByEmailToken = async (hashedToken: string) => {
  return await prisma.users.findUnique({
    where: {
      email_token_hash: hashedToken,
    },
  });
};

export const updateUserVerifiedStatus = async (userId: string) => {
  return await prisma.users.update({
    where: { id: userId },
    data: {
      email_token_hash: null,
      is_verified: true,
    },
  });
};

export const createUser = async ({
  name,
  username,
  email,
  hashedPassword,
  hashedToken,
}: {
  name: string;
  username: string;
  email: string;
  hashedPassword: string;
  hashedToken: string;
}) => {
  const newUser = await prisma.users.create({
    data: {
      name: name,
      username: username,
      email: email,
      password_hash: hashedPassword,
      role: "USER",
      is_verified: false,
      email_token_hash: hashedToken,
    },
  });
  return newUser;
};
