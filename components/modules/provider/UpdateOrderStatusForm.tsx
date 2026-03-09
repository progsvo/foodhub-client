"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/services/order.service";
import type { OrderStatus } from "@/types";
import { toast } from "sonner";

const VALID_TRANSITIONS: Record<string, OrderStatus[]> = {
  PLACED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

interface UpdateOrderStatusFormProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function UpdateOrderStatusForm({
  orderId,
  currentStatus,
}: UpdateOrderStatusFormProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const nextStatuses = VALID_TRANSITIONS[currentStatus] ?? [];

  if (nextStatuses.length === 0) {
    return null;
  }

  const handleUpdate = async (
    status: "PREPARING" | "READY" | "DELIVERED" | "CANCELLED"
  ) => {
    setIsUpdating(true);
    const toastId = toast.loading("Updating order status...");
    try {
      const res = await updateOrderStatus(orderId, status as "PREPARING" | "READY" | "DELIVERED" | "CANCELLED");
      if (!res.success) {
        toast.error(res.message, { id: toastId });
        return;
      }
      toast.success("Order status updated", { id: toastId });
      router.refresh();
    } catch {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {nextStatuses.map((status) => (
        <Button
          key={status}
          variant={status === "CANCELLED" ? "destructive" : "default"}
          size="sm"
          onClick={() => handleUpdate(status as "PREPARING" | "READY" | "DELIVERED" | "CANCELLED")}
          disabled={isUpdating}
        >
          Mark as {status}
        </Button>
      ))}
    </div>
  );
}
