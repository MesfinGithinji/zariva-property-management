const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("zariva_token");
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
    throw new Error((err as any).detail ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

// ─── API Types ───────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  role: "landlord" | "tenant" | "admin";
  phone: string | null;
  is_active: boolean;
  profile_image: string | null;
}

export interface PropertyOut {
  id: number;
  owner_id: number;
  name: string;
  location: string;
  address: string;
  type: string;
  status: string;
  year_built: number;
  property_value: number;
  description: string | null;
  image_url: string | null;
  created_at: string;
  total_units: number;
  occupied_units: number;
  occupancy_rate: number;
  monthly_income: number;
}

export interface TenantDetail {
  id: number;
  email: string;
  full_name: string;
  phone: string | null;
  role: string;
  is_active: boolean;
  profile_image: string | null;
  lease_status: string | null;
  payment_status: string | null;
  monthly_rent: number | null;
  balance: number | null;
  property_name: string | null;
  unit_number: string | null;
}

export interface LeaseOut {
  id: number;
  unit_id: number;
  tenant_id: number;
  monthly_rent: number;
  deposit: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  tenant_name: string | null;
  unit_number: string | null;
  property_name: string | null;
}

export interface PaymentOut {
  id: number;
  lease_id: number;
  tenant_id: number;
  amount: number;
  payment_date: string;
  month_for: string;
  method: string;
  reference: string | null;
  status: string;
  created_at: string;
  tenant_name: string | null;
  property_name: string | null;
  unit_number: string | null;
}

export interface MaintenanceOut {
  id: number;
  unit_id: number;
  tenant_id: number;
  issue: string;
  description: string | null;
  category: string;
  priority: string;
  status: string;
  assigned_to: string | null;
  estimated_completion: string | null;
  completed_date: string | null;
  cost: number | null;
  submitted_date: string;
  tenant_name: string | null;
  unit_number: string | null;
  property_name: string | null;
}

export interface MaintenanceStats {
  pending: number;
  in_progress: number;
  completed: number;
  high_priority: number;
}

export interface PaymentSummary {
  monthly_collected: number;
  month: string;
}
