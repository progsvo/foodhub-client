"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { updateUserStatus } from "@/services/admin.service";
import { toast } from "sonner";

interface UserStatusButtonProps {
  userId: string;
  currentStatus: string | null;
}

export function UserStatusButton({ userId, currentStatus }: UserStatusButtonProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const isSuspended = currentStatus === "SUSPENDED";

  const handleClick = async () => {
    setIsUpdating(true);
    const toastId = toast.loading(isSuspended ? "Activating user..." : "Suspending user...");
    try {
      const res = await updateUserStatus(userId, isSuspended ? "ACTIVE" : "SUSPENDED");
      if (!res.success) {
        toast.error(res.message, { id: toastId });
        return;
      }
      toast.success(isSuspended ? "User activated" : "User suspended", { id: toastId });
      router.refresh();
    } catch {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button
      variant={isSuspended ? "default" : "destructive"}
      size="sm"
      onClick={handleClick}
      disabled={isUpdating}
    >
      {isSuspended ? "Activate" : "Suspend"}
    </Button>
  );
}
