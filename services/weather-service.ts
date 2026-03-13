import { ForecastResponse, WeatherResponse } from "@/lib/types";
import { apiClient } from "@/services/api-client";

export async function fetchCurrentWeather(city: string) {
  const { data } = await apiClient.get<WeatherResponse>(`/api/weather/current/${encodeURIComponent(city)}`);
  return data;
}

export async function fetchCurrentWeatherByCoords(lat: number, lon: number) {
  const { data } = await apiClient.get<WeatherResponse>(`/api/weather/current/geo`, {
    params: { lat, lon }
  });
  return data;
}

export async function fetchForecast(city: string) {
  const { data } = await apiClient.get<ForecastResponse>(
    `/api/weather/forecast/${encodeURIComponent(city)}`
  );
  return data;
}

export async function fetchForecastByCoords(lat: number, lon: number) {
  const { data } = await apiClient.get<ForecastResponse>(`/api/weather/forecast/geo`, {
    params: { lat, lon }
  });
  return data;
}

export async function addFavoriteCity(city: string) {
  const { data } = await apiClient.post("/api/user/favorites", { city });
  return data;
}

export async function removeFavoriteCity(city: string) {
  const { data } = await apiClient.delete("/api/user/favorites", { data: { city } });
  return data;
}

export async function fetchFavoriteCities() {
  const { data } = await apiClient.get<{ favoriteCities: string[] }>("/api/user/favorites");
  return data;
}

export async function fetchSearchHistory() {
  const { data } = await apiClient.get("/api/user/history");
  return data;
}
