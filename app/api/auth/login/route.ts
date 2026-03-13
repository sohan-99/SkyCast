import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { signToken, authCookieName, authCookieOptions } from "@/lib/server/auth";
import { connectDb } from "@/lib/server/db";
import { User } from "@/lib/server/models/user";
import { handleApiError } from "@/lib/server/response";
import { loginSchema } from "@/lib/server/schemas";

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const body = loginSchema.parse(await request.json());

    const user = await User.findOne({ email: body.email });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const validPassword = await bcrypt.compare(body.password, user.password);
    if (!validPassword) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ userId: user._id.toString(), email: user.email });
    const response = NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        favoriteCities: user.favoriteCities
      }
    });

    response.cookies.set(authCookieName, token, authCookieOptions);
    return response;
  } catch (error) {
    return handleApiError(error, "Unable to login");
  }
}
