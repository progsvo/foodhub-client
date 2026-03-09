import type { ApiResponse, Meal } from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:5000";

export interface GetMealsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  cuisine?: string;
  dietaryPreference?: string;
  minPrice?: number;
  maxPrice?: number;
  providerId?: string;
}

export async function getMeals(
  params?: GetMealsParams
): Promise<ApiResponse<Meal[]>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
  if (params?.cuisine) searchParams.set("cuisine", params.cuisine);
  if (params?.dietaryPreference)
    searchParams.set("dietaryPreference", params.dietaryPreference);
  if (params?.minPrice) searchParams.set("minPrice", String(params.minPrice));
  if (params?.maxPrice) searchParams.set("maxPrice", String(params.maxPrice));
  if (params?.providerId) searchParams.set("providerId", params.providerId);

  const url = `${API_URL}/api/meals?${searchParams.toString()}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      return { data: [], success: false, message: "Failed to fetch meals" };
    }
    return res.json();
  } catch {
    return { data: [], success: false, message: "Service unavailable" };
  }
}

export async function getMealById(
  id: string
): Promise<ApiResponse<Meal | null>> {
  const url = `${API_URL}/api/meals/${id}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      if (res.status === 404) {
        return { data: null, success: false, message: "Meal not found" };
      }
      return { data: null, success: false, message: "Failed to fetch meal" };
    }
    const json = await res.json();
    return { data: json.data, success: true, message: json.message };
  } catch {
    return { data: null, success: false, message: "Service unavailable" };
  }
}

export interface CreateMealInput {
  name: string;
  description?: string;
  price: number;
  image?: string | null;
  cuisine?: string;
  dietaryPreference?: string;
  categoryId: string;
  isAvailable?: boolean;
}

export interface UpdateMealInput {
  name?: string;
  description?: string;
  price?: number;
  image?: string | null;
  cuisine?: string;
  dietaryPreference?: string;
  categoryId?: string;
  isAvailable?: boolean;
}

/**
 * Creates a meal. Call from client with credentials.
 * Requires PROVIDER role and provider profile.
 */
export async function createMeal(
  data: CreateMealInput
): Promise<ApiResponse<Meal | null>> {
  const res = await fetch(`${API_URL}/api/provider/meals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    return {
      success: false,
      message: json.message ?? "Failed to create meal",
      data: null,
    };
  }
  return {
    success: true,
    message: json.message ?? "Meal created successfully",
    data: json.data ?? null,
  };
}

/**
 * Updates a meal. Call from client with credentials.
 * Requires PROVIDER role and meal ownership.
 */
export async function updateMeal(
  id: string,
  data: UpdateMealInput
): Promise<ApiResponse<Meal | null>> {
  const res = await fetch(`${API_URL}/api/provider/meals/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    return {
      success: false,
      message: json.message ?? "Failed to update meal",
      data: null,
    };
  }
  return {
    success: true,
    message: json.message ?? "Meal updated successfully",
    data: json.data ?? null,
  };
}

/**
 * Deletes a meal. Call from client with credentials.
 * Requires PROVIDER role and meal ownership.
 */
export async function deleteMeal(id: string): Promise<ApiResponse<null>> {
  const res = await fetch(`${API_URL}/api/provider/meals/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      success: false,
      message: json.message ?? "Failed to delete meal",
      data: null,
    };
  }
  return {
    success: true,
    message: json.message ?? "Meal deleted successfully",
    data: null,
  };
}
