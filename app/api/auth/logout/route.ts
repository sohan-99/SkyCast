import { NextResponse } from "next/server";

import { authCookieName, authCookieOptions } from "@/lib/server/auth";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set(authCookieName, "", { ...authCookieOptions, maxAge: 0 });
  return response;
}
