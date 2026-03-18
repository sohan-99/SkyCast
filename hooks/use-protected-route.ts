"use client";

import { useAuth } from "@/context/auth-context";

export function useProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  return {
    isAuthorized: isAuthenticated,
    isCheckingAuth: isLoading
  };
}
