import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { signToken, authCookieName, authCookieOptions } from "@/lib/server/auth";
import { connectDb } from "@/lib/server/db";
import { User } from "@/lib/server/models/user";
import { handleApiError } from "@/lib/server/response";
import { registerSchema } from "@/lib/server/schemas";

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const body = registerSchema.parse(await request.json());

    const existing = await User.findOne({ email: body.email });
    if (existing) {
      return NextResponse.json({ message: "Email already in use" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);
    const user = await User.create({
      name: body.name,
      email: body.email,
      password: hashedPassword
    });

    const token = signToken({ userId: user._id.toString(), email: user.email });
    const response = NextResponse.json(
      {
        message: "Registration successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          favoriteCities: user.favoriteCities
        }
      },
      { status: 201 }
    );

    response.cookies.set(authCookieName, token, authCookieOptions);
    return response;
  } catch (error) {
    return handleApiError(error, "Unable to register");
  }
}
