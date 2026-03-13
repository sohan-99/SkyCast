import axios from "axios";

const geoClient = axios.create({
  baseURL: "https://geocoding-api.open-meteo.com/v1",
  timeout: 8000
});

const weatherClient = axios.create({
  baseURL: "https://api.open-meteo.com/v1",
  timeout: 10000
});

function wmoToCondition(code: number): { main: string; description: string } {
  if (code === 0) return { main: "Clear", description: "Clear sky" };
  if (code === 1) return { main: "Clear", description: "Mainly clear" };
  if (code === 2) return { main: "Clouds", description: "Partly cloudy" };
  if (code === 3) return { main: "Clouds", description: "Overcast" };
  if (code === 45 || code === 48) return { main: "Fog", description: "Foggy" };
  if (code >= 51 && code <= 55) return { main: "Drizzle", description: "Drizzle" };
  if (code >= 56 && code <= 57) return { main: "Drizzle", description: "Freezing drizzle" };
  if (code >= 61 && code <= 65) return { main: "Rain", description: "Rain" };
  if (code >= 66 && code <= 67) return { main: "Rain", description: "Freezing rain" };
  if (code >= 71 && code <= 77) return { main: "Snow", description: "Snow" };
  if (code >= 80 && code <= 82) return { main: "Rain", description: "Rain showers" };
  if (code >= 85 && code <= 86) return { main: "Snow", description: "Snow showers" };
  if (code === 95) return { main: "Thunderstorm", description: "Thunderstorm" };
  if (code === 96 || code === 99) return { main: "Thunderstorm", description: "Thunderstorm with hail" };
  return { main: "Unknown", description: "Unknown" };
}

function wmoToIcon(code: number, isDay: boolean): string {
  const dayNight = isDay ? "d" : "n";
  if (code === 0) return `01${dayNight}`;
  if (code === 1) return `02${dayNight}`;
  if (code === 2) return `03${dayNight}`;
  if (code === 3) return `04${dayNight}`;
  if (code === 45 || code === 48) return `50${dayNight}`;
  if (code >= 51 && code <= 57) return `09${dayNight}`;
  if (code >= 61 && code <= 67) return `10${dayNight}`;
  if (code >= 71 && code <= 77) return `13${dayNight}`;
  if (code >= 80 && code <= 82) return `09${dayNight}`;
  if (code >= 85 && code <= 86) return `13${dayNight}`;
  if (code >= 95) return `11${dayNight}`;
  return `01${dayNight}`;
}

async function geocode(city: string) {
  const { data } = await geoClient.get("/search", {
    params: { name: city, count: 1, language: "en", format: "json" }
  });

  const result = data.results?.[0];
  if (!result) {
    throw new Error(`City not found: ${city}`);
  }

  return {
    name: result.name as string,
    country: result.country_code as string,
    lat: result.latitude as number,
    lon: result.longitude as number
  };
}

async function reverseGeocode(lat: number, lon: number) {
  const reverseClient = axios.create({
    baseURL: "https://nominatim.openstreetmap.org",
    timeout: 8000
  });

  let cityName = "Your Location";
  let country = "";

  try {
    const { data } = await reverseClient.get("/reverse", {
      params: { lat, lon, format: "json" },
      headers: { "User-Agent": "SkyCast-WeatherApp/1.0" }
    });

    cityName =
      data.address?.city ??
      data.address?.town ??
      data.address?.village ??
      data.address?.municipality ??
      data.name ??
      "Your Location";
    country = data.address?.country_code?.toUpperCase() ?? "";
  } catch {
    // Ignore reverse geocode failure and keep fallback label.
  }

  return { cityName, country };
}

async function fetchCurrentByCoords(lat: number, lon: number, cityName: string, country: string) {
  const { data } = await weatherClient.get("/forecast", {
    params: {
      latitude: lat,
      longitude: lon,
      current:
        "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code,is_day",
      wind_speed_unit: "ms",
      timezone: "auto"
    }
  });

  const current = data.current;
  const condition = wmoToCondition(current.weather_code);
  const icon = wmoToIcon(current.weather_code, Boolean(current.is_day));

  return {
    name: cityName,
    sys: { country },
    dt: Math.floor(Date.now() / 1000),
    weather: [{ main: condition.main, description: condition.description, icon }],
    main: {
      temp: current.temperature_2m,
      feels_like: current.apparent_temperature,
      humidity: current.relative_humidity_2m
    },
    wind: { speed: current.wind_speed_10m }
  };
}

async function fetchForecastByCoords(lat: number, lon: number, cityName: string, country: string) {
  const { data } = await weatherClient.get("/forecast", {
    params: {
      latitude: lat,
      longitude: lon,
      daily:
        "weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,relative_humidity_2m_max",
      wind_speed_unit: "ms",
      timezone: "auto",
      forecast_days: 5
    }
  });

  const daily = data.daily as {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    wind_speed_10m_max: number[];
    relative_humidity_2m_max: number[];
  };

  const list = daily.time.map((dateStr, index) => {
    const condition = wmoToCondition(daily.weather_code[index]);
    const icon = wmoToIcon(daily.weather_code[index], true);
    const avgTemp = (daily.temperature_2m_max[index] + daily.temperature_2m_min[index]) / 2;

    return {
      dt: Math.floor(new Date(`${dateStr}T12:00:00`).getTime() / 1000),
      dt_txt: `${dateStr} 12:00:00`,
      weather: [{ main: condition.main, description: condition.description, icon }],
      main: {
        temp: Math.round(avgTemp * 10) / 10,
        humidity: daily.relative_humidity_2m_max[index]
      },
      wind: { speed: daily.wind_speed_10m_max[index] }
    };
  });

  return {
    city: { name: cityName, country },
    list
  };
}

export async function getCurrentWeather(city: string) {
  const location = await geocode(city);
  return fetchCurrentByCoords(location.lat, location.lon, location.name, location.country);
}

export async function getCurrentWeatherByCoords(lat: number, lon: number) {
  const { cityName, country } = await reverseGeocode(lat, lon);
  return fetchCurrentByCoords(lat, lon, cityName, country);
}

export async function getForecast(city: string) {
  const location = await geocode(city);
  return fetchForecastByCoords(location.lat, location.lon, location.name, location.country);
}

export async function getForecastByCoords(lat: number, lon: number) {
  const { cityName, country } = await reverseGeocode(lat, lon);
  return fetchForecastByCoords(lat, lon, cityName, country);
}
