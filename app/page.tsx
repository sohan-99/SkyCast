import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-10 md:px-6">
      <div className="mb-8 flex items-center justify-end">
        <ThemeToggle />
      </div>
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl">SkyCast</CardTitle>
          <CardDescription className="text-base">
            Smart weather forecast with geolocation, favorites, and responsive dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Create Account
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
