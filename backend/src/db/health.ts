import { prisma } from "./client.js";

export const connectDb = async () => {
  await prisma.$connect();
};

export const disconnectDb = async () => {
  await prisma.$disconnect();
};

export const isDBHealthy = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
};
