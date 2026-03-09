import type { ApiResponse, Cart } from "@/types";
import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:5000";

export async function getCart(): Promise<ApiResponse<Cart | null>> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const url = `${API_URL}/api/cart`;
  try {
    const res = await fetch(url, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401) {
        return { data: null, success: false, message: "Unauthorized" };
      }
      return { data: null, success: false, message: "Failed to fetch cart" };
    }

    const json = await res.json();
    return { data: json.data, success: true, message: json.message };
  } catch {
    return { data: null, success: false, message: "Service unavailable" };
  }
}
