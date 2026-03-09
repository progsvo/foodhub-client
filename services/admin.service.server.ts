import "server-only";

import type { ApiResponse, Order, UserProfile } from "@/types";
import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:5000";

export interface GetAdminUsersParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  role?: string;
  status?: string;
}

export interface GetAdminOrdersParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
}

/**
 * Fetches all users (admin only). SSR with cookies.
 */
export async function getAdminUsers(
  params?: GetAdminUsersParams
): Promise<
  ApiResponse<UserProfile[]> & { meta?: { page: number; limit: number; total: number } }
> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);
  if (params?.search) searchParams.set("search", params.search);
  if (params?.role) searchParams.set("role", params.role);
  if (params?.status) searchParams.set("status", params.status);

  const url = `${API_URL}/api/admin/users?${searchParams.toString()}`;
  try {
    const res = await fetch(url, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401) {
        return { data: [], success: false, message: "Unauthorized" };
      }
      return { data: [], success: false, message: "Failed to fetch users" };
    }

    const json = await res.json();
    return {
      data: json.data ?? [],
      success: true,
      message: json.message ?? "Users fetched",
      meta: json.meta,
    };
  } catch {
    return { data: [], success: false, message: "Service unavailable" };
  }
}

/**
 * Fetches all orders (admin only). SSR with cookies.
 */
export async function getAdminOrders(
  params?: GetAdminOrdersParams
): Promise<ApiResponse<Order[]> & { meta?: { page: number; limit: number; total: number } }> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);
  if (params?.status) searchParams.set("status", params.status);

  const url = `${API_URL}/api/admin/orders?${searchParams.toString()}`;
  try {
    const res = await fetch(url, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401) {
        return { data: [], success: false, message: "Unauthorized" };
      }
      return { data: [], success: false, message: "Failed to fetch orders" };
    }

    const json = await res.json();
    return {
      data: json.data ?? [],
      success: true,
      message: json.message ?? "Orders fetched",
      meta: json.meta,
    };
  } catch {
    return { data: [], success: false, message: "Service unavailable" };
  }
}
