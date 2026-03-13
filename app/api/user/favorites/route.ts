import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/lib/server/auth";
import { connectDb } from "@/lib/server/db";
import { User } from "@/lib/server/models/user";
import { handleApiError } from "@/lib/server/response";
import { favoriteSchema } from "@/lib/server/schemas";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    await connectDb();

    const user = await User.findById(auth.userId).select("favoriteCities");
    return NextResponse.json({ favoriteCities: user?.favoriteCities ?? [] });
  } catch (error) {
    return handleApiError(error, "Unable to fetch favorites");
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    await connectDb();
    const body = favoriteSchema.parse(await request.json());

    const user = await User.findByIdAndUpdate(
      auth.userId,
      { $addToSet: { favoriteCities: body.city } },
      { new: true }
    ).select("favoriteCities");

    return NextResponse.json({ favoriteCities: user?.favoriteCities ?? [] });
  } catch (error) {
    return handleApiError(error, "Unable to add favorite city");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    await connectDb();
    const body = favoriteSchema.parse(await request.json());

    const user = await User.findByIdAndUpdate(
      auth.userId,
      { $pull: { favoriteCities: body.city } },
      { new: true }
    ).select("favoriteCities");

    return NextResponse.json({ favoriteCities: user?.favoriteCities ?? [] });
  } catch (error) {
    return handleApiError(error, "Unable to remove favorite city");
  }
}
