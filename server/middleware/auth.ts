import { NextFunction, Request, Response } from "express";

import { verifyToken } from "../utils/jwt";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const bearer = req.header("Authorization")?.replace("Bearer ", "");
  const cookieToken = req.cookies?.auth_token as string | undefined;
  const token = bearer || cookieToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    req.user = verifyToken(token) as Request["user"];
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function optionalAuthMiddleware(req: Request, _: Response, next: NextFunction) {
  const bearer = req.header("Authorization")?.replace("Bearer ", "");
  const cookieToken = req.cookies?.auth_token as string | undefined;
  const token = bearer || cookieToken;

  if (!token) {
    return next();
  }

  try {
    req.user = verifyToken(token) as Request["user"];
  } catch {
    req.user = undefined;
  }

  return next();
}
