import { prisma } from "@/db/client.js";
import { RegisterType } from "./auth.validation.js";

export const findUserByUsernameOrEmail = async ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {
  return await prisma.users.findFirst({
    where: {
      OR: [{ username: username }, { email: email }],
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
      name: name,
      username: username,
      email: email,
      password_hash: hashedPassword,
      role: "USER",
    },
  });
  return newUser;
};
