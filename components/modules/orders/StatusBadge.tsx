import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types";

const statusVariants: Record<
  OrderStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PLACED: "default",
  PREPARING: "secondary",
  READY: "outline",
  DELIVERED: "secondary",
  CANCELLED: "destructive",
};

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={statusVariants[status] ?? "outline"}>
      {status}
    </Badge>
  );
}
