import { create } from "zustand";

import { ForecastResponse, WeatherResponse } from "@/lib/types";

type WeatherState = {
  currentWeather: WeatherResponse | null;
  forecast: ForecastResponse | null;
  setCurrentWeather: (value: WeatherResponse | null) => void;
  setForecast: (value: ForecastResponse | null) => void;
};

export const useWeatherStore = create<WeatherState>((set) => ({
  currentWeather: null,
  forecast: null,
  setCurrentWeather: (value) => set({ currentWeather: value }),
  setForecast: (value) => set({ forecast: value })
}));
