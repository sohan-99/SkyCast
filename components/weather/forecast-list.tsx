import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForecastResponse } from "@/lib/types";

type Props = {
  forecast: ForecastResponse;
  unit: "C" | "F";
};

export function ForecastList({ forecast, unit }: Props) {
  const noonSamples = forecast.list.filter((item) => item.dt_txt.includes("12:00:00")).slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-5">
          {noonSamples.map((item) => {
            const date = new Date(item.dt * 1000);
            const icon = item.weather?.[0]?.icon;
            const displayTemp =
              unit === "F" ? Math.round((item.main.temp * 9) / 5 + 32) : Math.round(item.main.temp);

            return (
              <div key={item.dt} className="rounded-xl bg-secondary p-3 text-center">
                <p className="text-sm font-medium">{date.toLocaleDateString(undefined, { weekday: "short" })}</p>
                {icon ? (
                  <Image
                    src={`https://openweathermap.org/img/wn/${icon}.png`}
                    width={48}
                    height={48}
                    alt={item.weather?.[0]?.main ?? "Weather icon"}
                    className="mx-auto"
                  />
                ) : null}
                <p className="text-lg font-bold">{displayTemp} {unit}</p>
                <p className="text-xs text-muted-foreground">{item.weather?.[0]?.main}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
