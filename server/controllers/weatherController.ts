import { Request, Response } from "express";
import { AxiosError } from "axios";

import { WeatherHistory } from "../models/WeatherHistory";
import {
  getCurrentWeather,
  getCurrentWeatherByCoords,
  getForecast,
  getForecastByCoords
} from "../services/weatherService";

export async function currentWeather(req: Request, res: Response) {
  try {
    const { city } = req.params;
    const { lat, lon } = req.query;

    const data =
      city === "geo" && lat && lon
        ? await getCurrentWeatherByCoords(Number(lat), Number(lon))
        : await getCurrentWeather(city);

    if (req.user?.userId) {
      await WeatherHistory.create({
        userId: req.user.userId,
        city: data.name,
        temperature: data.main.temp,
        condition: data.weather?.[0]?.main ?? "Unknown",
        searchedAt: new Date()
      });
    }

    return res.json(data);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("City not found:")) {
      return res.status(404).json({ message: error.message });
    }

    if (error instanceof AxiosError) {
      return res.status(502).json({ message: "Weather provider is temporarily unavailable" });
    }

    return res.status(500).json({ message: "Unable to fetch current weather" });
  }
}

export async function forecastWeather(req: Request, res: Response) {
  try {
    const { city } = req.params;
    const { lat, lon } = req.query;

    const data =
      city === "geo" && lat && lon
        ? await getForecastByCoords(Number(lat), Number(lon))
        : await getForecast(city);

    return res.json(data);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("City not found:")) {
      return res.status(404).json({ message: error.message });
    }

    if (error instanceof AxiosError) {
      return res.status(502).json({ message: "Weather provider is temporarily unavailable" });
    }

    return res.status(500).json({ message: "Unable to fetch forecast" });
  }
}
