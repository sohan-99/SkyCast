"use client";

import { AxiosError } from "axios";
import { motion } from "framer-motion";
import { MapPin, LogOut, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FavoritesPanel } from "@/components/weather/favorites-panel";
import { ForecastList } from "@/components/weather/forecast-list";
import { HistoryPanel } from "@/components/weather/history-panel";
import { SearchForm } from "@/components/weather/search-form";
import { WeatherCard } from "@/components/weather/weather-card";
import { useAuth } from "@/context/auth-context";
import { HistoryEntry } from "@/lib/types";
import {
  addFavoriteCity,
  fetchCurrentWeather,
  fetchCurrentWeatherByCoords,
  fetchFavoriteCities,
  fetchForecast,
  fetchForecastByCoords,
  fetchSearchHistory,
  removeFavoriteCity
} from "@/services/weather-service";
import { useWeatherStore } from "@/store/weather-store";

const DEFAULT_CITY = "New York";

export default function DashboardPage() {
  const { user, logout, isAuthenticated, isLoading: isCheckingAuth } = useAuth();
  const router = useRouter();
  const { currentWeather, forecast, setCurrentWeather, setForecast } = useWeatherStore();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");

  const loadUserData = useCallback(async () => {
    const [favoriteResponse, historyResponse] = await Promise.all([
      fetchFavoriteCities(),
      fetchSearchHistory()
    ]);

    setFavorites(favoriteResponse.favoriteCities ?? []);
    setHistory(historyResponse.history ?? []);
  }, []);

  const searchCity = useCallback(
    async (city: string) => {
      setLoading(true);
      try {
        const [weatherData, forecastData] = await Promise.all([
          fetchCurrentWeather(city),
          fetchForecast(city)
        ]);
        setCurrentWeather(weatherData);
        setForecast(forecastData);
        if (isAuthenticated) {
          await loadUserData();
        }
      } catch (error) {
        const message =
          error instanceof AxiosError
            ? error.response?.data?.message ?? "Unable to search weather right now"
            : "Unable to search weather right now";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [setCurrentWeather, setForecast, loadUserData, isAuthenticated]
  );

  const detectLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLoading(true);
        try {
          const { latitude, longitude } = position.coords;
          const weather = await fetchCurrentWeatherByCoords(
            latitude,
            longitude
          );
          const forecastData = await fetchForecastByCoords(latitude, longitude);
          setCurrentWeather(weather);
          setForecast(forecastData);
          if (isAuthenticated) {
            await loadUserData();
          }
        } catch (error) {
          const message =
            error instanceof AxiosError
              ? error.response?.data?.message ?? "Unable to get weather from current location"
              : "Unable to get weather from current location";
          toast.error(message);
        } finally {
          setLoading(false);
        }
      },
      () => toast.error("Location permission denied")
    );
  }, [setCurrentWeather, setForecast, loadUserData, isAuthenticated]);

  const onAddFavorite = useCallback(async () => {
    if (!currentWeather?.name) {
      toast.error("Search a city before saving");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to save cities");
      router.push("/login");
      return;
    }

    const response = await addFavoriteCity(currentWeather.name);
    setFavorites(response.favoriteCities ?? []);
    toast.success("City saved to favorites");
  }, [currentWeather?.name, isAuthenticated, router]);

  const onRemoveFavorite = useCallback(async (city: string) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const response = await removeFavoriteCity(city);
    setFavorites(response.favoriteCities ?? []);
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      void loadUserData();
    }
  }, [isAuthenticated, loadUserData]);

  useEffect(() => {
    if (!currentWeather) {
      void searchCity(DEFAULT_CITY);
    }
  }, [currentWeather, searchCity]);

  if (isCheckingAuth) {
    return <main className="mx-auto max-w-6xl px-4 py-8">Loading dashboard...</main>;
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-6">
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-3xl font-bold">Weather Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {isAuthenticated ? `Welcome back, ${user?.name}` : "Browse weather as guest. Login to save cities."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" onClick={detectLocation} className="gap-2">
            <MapPin className="h-4 w-4" />
            Current Location
          </Button>
          {isAuthenticated ? (
            <Button variant="outline" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          )}
        </div>
      </motion.header>

      <SearchForm onSearch={searchCity} />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {currentWeather ? (
            <WeatherCard weather={currentWeather} unit={tempUnit} onUnitChange={setTempUnit} />
          ) : null}
          {forecast ? <ForecastList forecast={forecast} unit={tempUnit} /> : null}
          {loading ? (
            <Card>
              <CardContent className="pt-6">Loading weather data...</CardContent>
            </Card>
          ) : null}
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Button 
              onClick={onAddFavorite} 
              className="w-full gap-2"
              disabled={!isAuthenticated}
            >
              <Heart className="h-4 w-4" />
              Save Current City
            </Button>
            {!isAuthenticated && (
              <p className="text-xs text-muted-foreground text-center">
                Sign in to save your favorite cities
              </p>
            )}
          </div>
          {isAuthenticated ? (
            <>
              <FavoritesPanel favorites={favorites} onSelect={searchCity} onRemove={onRemoveFavorite} />
              <HistoryPanel history={history} unit={tempUnit} />
            </>
          ) : (
            <Card>
              <CardContent className="space-y-3 pt-6 text-sm text-muted-foreground">
                <p>Login to view favorites and search history.</p>
                <Link href="/login" className="font-semibold text-primary underline">
                  Go to login
                </Link>
              </CardContent>
            </Card>
          )}
        </motion.aside>
      </div>
    </main>
  );
}
