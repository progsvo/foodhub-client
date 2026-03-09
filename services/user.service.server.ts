import "server-only";

import type { ApiResponse, UserProfile } from "@/types";
import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:5000";

/**
 * Fetches the current user's profile (SSR with cookies).
 */
export async function getProfile(): Promise<ApiResponse<UserProfile | null>> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const url = `${API_URL}/api/users/profile`;
  try {
    const res = await fetch(url, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401) {
        return { data: null, success: false, message: "Unauthorized" };
      }
      return { data: null, success: false, message: "Failed to fetch profile" };
    }

    const json = await res.json();
    return {
      data: json.data ?? null,
      success: true,
      message: json.message ?? "Profile fetched",
    };
  } catch {
    return { data: null, success: false, message: "Service unavailable" };
  }
}
