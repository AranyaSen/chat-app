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
    select: {
      name: true,
      username: true,
      email: true,
      is_active: true,
      id: true,
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

export const updateEmailTokenHash = async ({
  userEmail,
  hashedToken,
}: {
  userEmail: string;
  hashedToken: string;
}) => {
  return await prisma.users.update({
    where: {
      email: userEmail,
    },
    data: {
      email_token_hash: hashedToken,
    },
  });
};

export const requestChangeEmail = async ({
  userId,
  email,
  hashedToken,
}: {
  userId: string;
  email: string;
  hashedToken: string;
}) => {
  return await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      email: email,
      email_token_hash: hashedToken,
      // is_verified: false,
    },
  });
};

export const createUser = async ({
  name,
  username,
  email,
  hashedPassword,
}: {
  name: string;
  username: string;
  email: string;
  hashedPassword: string;
}) => {
  const newUser = await prisma.users.create({
    data: {
      name,
      username,
      email,
      password_hash: hashedPassword,
      role: "USER",
      is_verified: false,
    },
    select: {
      name: true,
      username: true,
      email: true,
      id: true,
      is_verified: true,
    },
  });
  return newUser;
};
