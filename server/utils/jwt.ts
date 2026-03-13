import jwt from "jsonwebtoken";

import { env } from "../config/env";

type SignPayload = {
  userId: string;
  email: string;
};

export function signToken(payload: SignPayload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.jwtSecret);
}
