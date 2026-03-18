"use client";

import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { AuthUser } from "@/lib/types";
import { fetchCurrentUser, loginUser, logoutUser, registerUser } from "@/services/auth-service";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const response = await fetchCurrentUser();
      setUser(response.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await loginUser({ email, password });
      await refreshUser();
      toast.success("Welcome back");
      router.push("/");
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message ?? "Unable to login"
          : "Unable to login";
      toast.error(message);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await registerUser({ name, email, password });
      await refreshUser();
      toast.success("Account created");
      router.push("/");
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message ?? "Unable to register"
          : "Unable to register";
      toast.error(message);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      toast.success("Logged out");
      router.push("/login");
    } catch {
      toast.error("Unable to logout");
    }
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
