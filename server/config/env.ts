import dotenv from "dotenv";

dotenv.config();

const required = ["OPENWEATHER_API_KEY", "MONGODB_URI", "JWT_SECRET"] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongodbUri: process.env.MONGODB_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY as string,
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  cookieSecure: process.env.COOKIE_SECURE === "true"
};
