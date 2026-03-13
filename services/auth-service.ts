import { apiClient } from "@/services/api-client";

type AuthPayload = {
  email: string;
  password: string;
};

type RegisterPayload = AuthPayload & {
  name: string;
};

export async function registerUser(payload: RegisterPayload) {
  const { data } = await apiClient.post("/api/auth/register", payload);
  return data;
}

export async function loginUser(payload: AuthPayload) {
  const { data } = await apiClient.post("/api/auth/login", payload);
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get("/api/auth/me");
  return data;
}

export async function logoutUser() {
  const { data } = await apiClient.post("/api/auth/logout");
  return data;
}
