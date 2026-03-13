"use client";

import Link from "next/link";

import { RegisterForm } from "@/components/auth/register-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-6 flex justify-end">
        <ThemeToggle />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Join SkyCast and save your favorite cities.</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="font-semibold text-primary">Login</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
