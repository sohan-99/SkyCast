import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { serverEnv } from "@/lib/server/env";

type AuthPayload = {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
};

export const authCookieName = "auth_token";

export const authCookieOptions = {
  httpOnly: true,
  secure: serverEnv.cookieSecure,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60
};

export function signToken(payload: { userId: string; email: string }) {
  return jwt.sign(payload, serverEnv.jwtSecret, { expiresIn: serverEnv.jwtExpiresIn });
}

export function verifyToken(token: string) {
  return jwt.verify(token, serverEnv.jwtSecret) as AuthPayload;
}

export function getTokenFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization")?.replace("Bearer ", "");
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookieToken = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${authCookieName}=`))
    ?.split("=")[1];

  return authHeader || cookieToken;
}

export function getOptionalAuth(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function requireAuth(request: Request) {
  const auth = getOptionalAuth(request);
  if (!auth) {
    throw new Error("Unauthorized");
  }

  return auth;
}

export function setAuthCookie(token: string) {
  cookies().set(authCookieName, token, authCookieOptions);
}

export function clearAuthCookie() {
  cookies().set(authCookieName, "", { ...authCookieOptions, maxAge: 0 });
}
