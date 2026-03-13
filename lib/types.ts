export interface AuthUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  favoriteCities: string[];
  createdAt?: string;
}

export interface WeatherResponse {
  name: string;
  weather: { main: string; description: string; icon: string }[];
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  wind: {
    speed: number;
  };
  dt: number;
}

export interface ForecastResponse {
  city: {
    name: string;
    country: string;
  };
  list: Array<{
    dt: number;
    main: {
      temp: number;
      humidity: number;
    };
    weather: { main: string; description: string; icon: string }[];
    wind: {
      speed: number;
    };
    dt_txt: string;
  }>;
}

export interface HistoryEntry {
  city: string;
  temperature: number;
  condition: string;
  searchedAt: string;
}
