import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const STATUS_FLOW: OrderStatus[] = ["PLACED", "PREPARING", "READY", "DELIVERED"];

function getStatusIndex(status: OrderStatus): number {
  const idx = STATUS_FLOW.indexOf(status);
  return idx >= 0 ? idx : -1;
}

interface OrderStatusTimelineProps {
  status: OrderStatus;
}

export function OrderStatusTimeline({ status }: OrderStatusTimelineProps) {
  const currentIndex = getStatusIndex(status);
  const isCancelled = status === "CANCELLED";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        {STATUS_FLOW.map((s, index) => {
          const isCompleted = currentIndex > index;
          const isCurrent = currentIndex === index;
          const isLast = index === STATUS_FLOW.length - 1;

          return (
            <div key={s} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-medium",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isCurrent && !isCancelled && "border-primary bg-primary text-primary-foreground",
                    isCurrent && isCancelled && "border-destructive",
                    !isCompleted && !isCurrent && "border-muted-foreground/30"
                  )}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>
                <span
                  className={cn(
                    "mt-1 text-xs font-medium",
                    (isCompleted || isCurrent) && !isCancelled
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {s}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "mx-1 h-0.5 flex-1",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      {isCancelled && (
        <p className="text-center text-sm text-destructive">
          This order was cancelled.
        </p>
      )}
    </div>
  );
}
