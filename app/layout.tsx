import type { Metadata } from "next";
import { Space_Grotesk, Urbanist } from "next/font/google";
import type { ReactNode } from "react";

import "@/styles/globals.css";
import { Providers } from "@/components/providers";

const headingFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });
const bodyFont = Urbanist({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "SkyCast | Weather Forecast",
  description: "Modern weather forecast app with geolocation, favorites, and 5-day forecast.",
  keywords: ["weather", "forecast", "openweathermap", "nextjs", "dashboard"]
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${headingFont.variable} ${bodyFont.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
