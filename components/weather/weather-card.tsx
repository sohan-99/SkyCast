import Image from "next/image";
import { CloudSun, Droplets, Wind } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherResponse } from "@/lib/types";

type Props = {
  weather: WeatherResponse;
  title?: string;
  unit: "C" | "F";
};

export function WeatherCard({ weather, title = "Current Weather", unit }: Props) {
  const icon = weather.weather?.[0]?.icon;
  const windSpeedKmh = (weather.wind.speed * 3.6).toFixed(1);
  const displayTemp =
    unit === "F" ? Math.round((weather.main.temp * 9) / 5 + 32) : Math.round(weather.main.temp);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <CloudSun className="h-5 w-5 text-primary" />
          {title} - {weather.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-4xl font-bold">{displayTemp} {unit}</p>
            <p className="text-sm capitalize text-muted-foreground">{weather.weather?.[0]?.description}</p>
          </div>
          {icon ? (
            <Image
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              width={90}
              height={90}
              alt={weather.weather?.[0]?.main ?? "Weather icon"}
              className="animate-float"
            />
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
          <div className="rounded-xl bg-secondary p-3">
            <p className="text-muted-foreground">Humidity</p>
            <p className="mt-1 flex items-center gap-2 font-semibold">
              <Droplets className="h-4 w-4 text-primary" />
              {weather.main.humidity}%
            </p>
          </div>
          <div className="rounded-xl bg-secondary p-3">
            <p className="text-muted-foreground">Wind</p>
            <p className="mt-1 flex items-center gap-2 font-semibold">
              <Wind className="h-4 w-4 text-primary" />
              {windSpeedKmh} km/h
            </p>
          </div>
          <div className="rounded-xl bg-secondary p-3">
            <p className="text-muted-foreground">Condition</p>
            <p className="mt-1 font-semibold">{weather.weather?.[0]?.main}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
