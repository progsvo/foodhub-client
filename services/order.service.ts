import type { ApiResponse, Order } from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:5000";

/**
 * Creates an order from the current cart. API returns an array of orders
 * since cart items can span multiple providers (one order per provider).
 * Call from client with credentials.
 */
export async function createOrder(
  deliveryAddress: string
): Promise<ApiResponse<Order[]>> {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ deliveryAddress }),
  });

  const json = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: json.message ?? "Failed to place order",
      data: [],
    };
  }

  return {
    success: true,
    message: json.message ?? "Order placed successfully",
    data: json.data ?? [],
  };
}

/**
 * Updates order status. Call from client with credentials.
 * Requires PROVIDER role and order ownership.
 */
export async function updateOrderStatus(
  id: string,
  status: "PREPARING" | "READY" | "DELIVERED" | "CANCELLED"
): Promise<ApiResponse<Order | null>> {
  const res = await fetch(`${API_URL}/api/provider/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  const json = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: json.message ?? "Failed to update order status",
      data: null,
    };
  }

  return {
    success: true,
    message: json.message ?? "Order status updated",
    data: json.data ?? null,
  };
}
