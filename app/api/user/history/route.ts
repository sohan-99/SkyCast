import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/lib/server/auth";
import { connectDb } from "@/lib/server/db";
import { WeatherHistory } from "@/lib/server/models/weather-history";
import { handleApiError } from "@/lib/server/response";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    await connectDb();

    const history = await WeatherHistory.find({ userId: auth.userId })
      .sort({ searchedAt: -1 })
      .limit(10)
      .select("city temperature condition searchedAt");

    return NextResponse.json({ history });
  } catch (error) {
    return handleApiError(error, "Unable to fetch search history");
  }
}
