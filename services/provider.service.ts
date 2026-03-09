import type { ApiResponse, ProviderProfile } from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:5000";

export async function getProviders(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ApiResponse<ProviderProfile[]>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);

  const url = `${API_URL}/api/providers?${searchParams.toString()}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      return { data: [], success: false, message: "Failed to fetch providers" };
    }
    return res.json();
  } catch {
    return { data: [], success: false, message: "Service unavailable" };
  }
}

export async function getProviderById(
  id: string
): Promise<ApiResponse<ProviderProfile | null>> {
  const url = `${API_URL}/api/providers/${id}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      if (res.status === 404) {
        return { data: null, success: false, message: "Provider not found" };
      }
      return { data: null, success: false, message: "Failed to fetch provider" };
    }
    const json = await res.json();
    return { data: json.data, success: true, message: json.message };
  } catch {
    return { data: null, success: false, message: "Service unavailable" };
  }
}

export interface CreateProviderProfileInput {
  businessName: string;
  description?: string;
  image?: string | null;
  address?: string;
}

export interface UpdateProviderProfileInput {
  businessName?: string;
  description?: string;
  image?: string | null;
  address?: string;
}

/**
 * Creates a provider profile. Call from client with credentials.
 * Requires PROVIDER role.
 */
export async function createProviderProfile(
  data: CreateProviderProfileInput
): Promise<ApiResponse<ProviderProfile | null>> {
  const res = await fetch(`${API_URL}/api/providers/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: json.message ?? "Failed to create provider profile",
      data: null,
    };
  }

  return {
    success: true,
    message: json.message ?? "Provider profile created",
    data: json.data ?? null,
  };
}

/**
 * Updates the current provider's profile. Call from client with credentials.
 * Requires PROVIDER role.
 */
export async function updateProviderProfile(
  data: UpdateProviderProfileInput
): Promise<ApiResponse<ProviderProfile | null>> {
  const res = await fetch(`${API_URL}/api/providers/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: json.message ?? "Failed to update provider profile",
      data: null,
    };
  }

  return {
    success: true,
    message: json.message ?? "Provider profile updated",
    data: json.data ?? null,
  };
}
