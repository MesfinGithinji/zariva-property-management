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

export interface PropertySearchResult {
  id: number;
  name: string;
  location: string;
  landlord_name: string | null;
}

export interface JoinRequestOut {
  id: number;
  reference_number: string;
  tenant_id: number;
  property_id: number;
  message: string | null;
  status: "pending" | "approved" | "approved_with_modifications" | "declined";
  unit_id: number | null;
  lease_id: number | null;
  decision_by: string | null;
  decision_date: string | null;
  decline_reason: string | null;
  created_at: string;
  tenant_name: string | null;
  tenant_email: string | null;
  property_name: string | null;
  unit_number: string | null;
}

export interface ConsentOut {
  id: number;
  reference_number: string;
  notice_version: string;
  lease_admin_consent: boolean;
  communications_consent: boolean;
  marketing_consent: boolean;
  national_id: string | null;
  consented_at: string;
  withdrawn_at: string | null;
}

export interface DataSubjectRequestOut {
  id: number;
  reference_number: string;
  request_type: "access" | "rectification" | "erasure" | "portability" | "objection";
  description: string | null;
  status: string;
  created_at: string;
  resolved_at: string | null;
  response: string | null;
  requester_name: string | null;
}

export interface SubletRequestOut {
  id: number;
  reference_number: string;
  tenant_id: number;
  lease_id: number;
  subtenant_name: string;
  subtenant_id_no: string;
  proposed_commencement: string;
  proposed_duration: string;
  monthly_rent_to_subtenant: number;
  purpose: "full_sublet" | "room_only" | "full_assignment";
  reason: string;
  status: string;
  decision_by: string | null;
  decision_date: string | null;
  additional_conditions: string | null;
  decline_reason: string | null;
  created_at: string;
  tenant_name: string | null;
}

export interface AlterationRequestOut {
  id: number;
  reference_number: string;
  tenant_id: number;
  lease_id: number;
  description_of_works: string;
  contractor_name: string | null;
  contractor_contact: string | null;
  estimated_start_date: string | null;
  estimated_duration: string | null;
  estimated_cost: number | null;
  status: string;
  decision_by: string | null;
  decision_date: string | null;
  modification_conditions: string | null;
  decline_reason: string | null;
  created_at: string;
  tenant_name: string | null;
}

export interface PetDetail {
  id: number;
  animal_type: string;
  breed: string | null;
  number: number;
  vaccinated: boolean;
}

export interface PetConsentOut {
  id: number;
  reference_number: string;
  tenant_id: number;
  lease_id: number;
  pets: PetDetail[];
  additional_deposit: number | null;
  status: string;
  decision_by: string | null;
  decision_date: string | null;
  decline_reason: string | null;
  created_at: string;
  tenant_name: string | null;
}
