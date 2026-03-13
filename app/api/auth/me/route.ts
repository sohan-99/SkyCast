import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/lib/server/auth";
import { connectDb } from "@/lib/server/db";
import { User } from "@/lib/server/models/user";
import { handleApiError } from "@/lib/server/response";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    await connectDb();

    const user = await User.findById(auth.userId).select("name email favoriteCities createdAt");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return handleApiError(error, "Unable to fetch current user");
  }
}
