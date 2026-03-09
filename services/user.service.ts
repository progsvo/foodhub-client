import type { ApiResponse, UserProfile } from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:5000";

/**
 * Updates the current user's profile. Call from client with credentials.
 */
export async function updateProfile(data: {
  name?: string;
  phone?: string;
  image?: string | null;
}): Promise<ApiResponse<UserProfile | null>> {
  const res = await fetch(`${API_URL}/api/users/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: json.message ?? "Failed to update profile",
      data: null,
    };
  }

  return {
    success: true,
    message: json.message ?? "Profile updated",
    data: json.data ?? null,
  };
}
