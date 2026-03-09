import "server-only";

import type { ApiResponse, Order } from "@/types";
import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:5000";

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
}

/**
 * Fetches the current user's orders (SSR with cookies).
 */
export async function getOrders(
  params?: GetOrdersParams
): Promise<ApiResponse<Order[]> & { meta?: { page: number; limit: number; total: number } }> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);
  if (params?.status) searchParams.set("status", params.status);

  const url = `${API_URL}/api/orders?${searchParams.toString()}`;
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

/**
 * Fetches a single order by ID (SSR with cookies).
 */
export async function getOrderById(
  id: string
): Promise<ApiResponse<Order | null>> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const url = `${API_URL}/api/orders/${id}`;
  try {
    const res = await fetch(url, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401) {
        return { data: null, success: false, message: "Unauthorized" };
      }
      if (res.status === 404 || res.status === 403) {
        return { data: null, success: false, message: "Order not found" };
      }
      return { data: null, success: false, message: "Failed to fetch order" };
    }

    const json = await res.json();
    return {
      data: json.data ?? null,
      success: true,
      message: json.message ?? "Order fetched",
    };
  } catch {
    return { data: null, success: false, message: "Service unavailable" };
  }
}

/**
 * Fetches provider's incoming orders (SSR with cookies).
 * Requires PROVIDER role.
 */
export async function getProviderOrders(
  params?: GetOrdersParams
): Promise<ApiResponse<Order[]> & { meta?: { page: number; limit: number; total: number } }> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);
  if (params?.status) searchParams.set("status", params.status);

  const url = `${API_URL}/api/provider/orders?${searchParams.toString()}`;
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

/**
 * Fetches a single provider order by ID (SSR with cookies).
 * Requires PROVIDER role and order ownership.
 */
export async function getProviderOrderById(
  id: string
): Promise<ApiResponse<Order | null>> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const url = `${API_URL}/api/provider/orders/${id}`;
  try {
    const res = await fetch(url, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401) {
        return { data: null, success: false, message: "Unauthorized" };
      }
      if (res.status === 404 || res.status === 403) {
        return { data: null, success: false, message: "Order not found" };
      }
      return { data: null, success: false, message: "Failed to fetch order" };
    }

    const json = await res.json();
    return {
      data: json.data ?? null,
      success: true,
      message: json.message ?? "Order fetched",
    };
  } catch {
    return { data: null, success: false, message: "Service unavailable" };
  }
}
