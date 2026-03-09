import type { ApiResponse, UserProfile } from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:5000";

/**
 * Updates user status (admin only). Call from client with credentials.
 */
export async function updateUserStatus(
  userId: string,
  status: "ACTIVE" | "SUSPENDED"
): Promise<ApiResponse<UserProfile | null>> {
  const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  const json = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: json.message ?? "Failed to update user status",
      data: null,
    };
  }

  return {
    success: true,
    message: json.message ?? "User status updated",
    data: json.data ?? null,
  };
}
