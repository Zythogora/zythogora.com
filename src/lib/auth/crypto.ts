"server only";

import { hash as argon2Hash, verify as argon2Verify } from "@node-rs/argon2";

import { config } from "@/lib/config";

import type { Options } from "@node-rs/argon2";

const options: Options = {
  algorithm: 2, // Argon2id
  version: 1, // Version 19
  memoryCost: 65536,
  timeCost: 4,
  parallelism: 1,
  secret: new Uint8Array(Buffer.from(config.auth.hash.pepper, "base64")),
};

export const hash = (password: string): Promise<string> => {
  return argon2Hash(password, options);
};

export const verify = (data: {
  hash: string;
  password: string;
}): Promise<boolean> => {
  return argon2Verify(data.hash, data.password, options);
};
