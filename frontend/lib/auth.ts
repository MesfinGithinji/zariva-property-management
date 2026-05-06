import { api, type AuthUser } from "./api";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("zariva_token");
}

export function setToken(token: string): void {
  localStorage.setItem("zariva_token", token);
}

export function clearAuth(): void {
  localStorage.removeItem("zariva_token");
  localStorage.removeItem("zariva_user");
}

export function getCachedUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("zariva_user");
  if (!raw) return null;
  try { return JSON.parse(raw) as AuthUser; } catch { return null; }
}

export function setCachedUser(user: AuthUser): void {
  localStorage.setItem("zariva_user", JSON.stringify(user));
}

export async function login(
  email: string,
  password: string,
): Promise<AuthUser> {
  const data = await api.post<{
    access_token: string;
    role: string;
    full_name: string;
    user_id: number;
  }>("/auth/login", { email, password });
  setToken(data.access_token);
  const user = await api.get<AuthUser>("/auth/me");
  setCachedUser(user);
  return user;
}
