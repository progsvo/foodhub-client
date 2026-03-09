import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const userName = review.user?.name ?? "Anonymous";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
          {initial}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{userName}</span>
            <span className="text-sm text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={
                  i < review.rating
                    ? "text-yellow-500"
                    : "text-muted-foreground/40"
                }
              >
                ★
              </span>
            ))}
          </div>
          {review.comment && (
            <p className="text-sm text-muted-foreground">{review.comment}</p>
          )}
        </div>
      </div>
    </div>
  );
}
