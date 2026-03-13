import { NextRequest, NextResponse } from "next/server";

import { getOptionalAuth } from "@/lib/server/auth";
import { connectDb } from "@/lib/server/db";
import { WeatherHistory } from "@/lib/server/models/weather-history";
import { handleApiError } from "@/lib/server/response";
import { getCurrentWeather, getCurrentWeatherByCoords } from "@/lib/server/weather";

export async function GET(
  request: NextRequest,
  { params }: { params: { city: string } }
) {
  try {
    await connectDb();
    const auth = getOptionalAuth(request);
    const lat = request.nextUrl.searchParams.get("lat");
    const lon = request.nextUrl.searchParams.get("lon");

    const data =
      params.city === "geo" && lat && lon
        ? await getCurrentWeatherByCoords(Number(lat), Number(lon))
        : await getCurrentWeather(params.city);

    if (auth?.userId) {
      await WeatherHistory.create({
        userId: auth.userId,
        city: data.name,
        temperature: data.main.temp,
        condition: data.weather?.[0]?.main ?? "Unknown",
        searchedAt: new Date()
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, "Unable to fetch current weather");
  }
}
