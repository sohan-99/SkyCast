import { NextRequest, NextResponse } from "next/server";

import { connectDb } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/response";
import { getForecast, getForecastByCoords } from "@/lib/server/weather";

export async function GET(
  request: NextRequest,
  { params }: { params: { city: string } }
) {
  try {
    await connectDb();
    const lat = request.nextUrl.searchParams.get("lat");
    const lon = request.nextUrl.searchParams.get("lon");

    const data =
      params.city === "geo" && lat && lon
        ? await getForecastByCoords(Number(lat), Number(lon))
        : await getForecast(params.city);

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, "Unable to fetch forecast");
  }
}
