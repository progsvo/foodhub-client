import type { ApiResponse, Review } from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:5000";

/**
 * Creates a review for a meal. User must have a delivered order containing the meal.
 * Returns 400 if not eligible, 409 if already reviewed.
 */
export async function createReview(
  mealId: string,
  rating: number,
  comment?: string
): Promise<ApiResponse<Review | null>> {
  const res = await fetch(`${API_URL}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ mealId, rating, comment: comment || undefined }),
  });

  const json = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: json.message ?? "Failed to submit review",
      data: null,
    };
  }

  return {
    success: true,
    message: json.message ?? "Review submitted",
    data: json.data ?? null,
  };
}
