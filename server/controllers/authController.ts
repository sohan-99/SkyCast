import bcrypt from "bcryptjs";
import { Request, Response } from "express";

import { env } from "../config/env";
import { User } from "../models/User";
import { signToken } from "../utils/jwt";

const cookieOptions = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  const token = signToken({ userId: user._id.toString(), email: user.email });

  res.cookie("auth_token", token, cookieOptions);
  return res.status(201).json({
    message: "Registration successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      favoriteCities: user.favoriteCities
    }
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({ userId: user._id.toString(), email: user.email });
  res.cookie("auth_token", token, cookieOptions);

  return res.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      favoriteCities: user.favoriteCities
    }
  });
}

export async function me(req: Request, res: Response) {
  const user = await User.findById(req.user?.userId).select("name email favoriteCities createdAt");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ user });
}

export function logout(_: Request, res: Response) {
  res.clearCookie("auth_token", cookieOptions);
  return res.json({ message: "Logged out" });
}
