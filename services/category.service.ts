import type { ApiResponse, Category } from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:5000";

export async function getCategories(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ApiResponse<Category[]>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);

  const url = `${API_URL}/api/categories?${searchParams.toString()}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      return { data: [], success: false, message: "Failed to fetch categories" };
    }
    return res.json();
  } catch {
    return { data: [], success: false, message: "Service unavailable" };
  }
}

/**
 * Creates a category (admin only). Call from client with credentials.
 */
export async function createCategory(data: {
  name: string;
  image?: string | null;
}): Promise<ApiResponse<Category>> {
  const res = await fetch(`${API_URL}/api/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: json.message ?? "Failed to create category",
      data: null as unknown as Category,
    };
  }

  return {
    success: true,
    message: json.message ?? "Category created",
    data: json.data ?? null,
  };
}

/**
 * Updates a category (admin only). Call from client with credentials.
 */
export async function updateCategory(
  id: string,
  data: { name?: string; image?: string | null }
): Promise<ApiResponse<Category | null>> {
  const res = await fetch(`${API_URL}/api/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: json.message ?? "Failed to update category",
      data: null,
    };
  }

  return {
    success: true,
    message: json.message ?? "Category updated",
    data: json.data ?? null,
  };
}

/**
 * Deletes a category (admin only). Call from client with credentials.
 */
export async function deleteCategory(id: string): Promise<ApiResponse<null>> {
  const res = await fetch(`${API_URL}/api/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const json = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: json.message ?? "Failed to delete category",
      data: null,
    };
  }

  return {
    success: true,
    message: json.message ?? "Category deleted",
    data: null,
  };
}
