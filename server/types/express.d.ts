import { JwtPayload } from "jsonwebtoken";

export interface AuthPayload extends JwtPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export {};
