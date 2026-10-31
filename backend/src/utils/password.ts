import argon2, { Algorithm, hash, Options, verify } from "@node-rs/argon2";

const options: Options = {
  algorithm: Algorithm.Argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

export const hashPassword = async (password: string): Promise<string> => {
  return hash(password, options);
};

export const verifyPassword = async (
  password: string,
  hashPassword: string,
): Promise<boolean> => {
  return verify(hashPassword, password);
};
