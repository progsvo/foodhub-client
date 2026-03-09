"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteCategory } from "@/services/category.service";
import type { Category } from "@/types";
import { toast } from "sonner";

interface DeleteCategoryDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function DeleteCategoryDialog({
  category,
  open,
  onOpenChange,
  onDeleted,
}: DeleteCategoryDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!category) return;
    setIsDeleting(true);
    const toastId = toast.loading("Deleting category...");
    try {
      const res = await deleteCategory(category.id);
      if (!res.success) {
        toast.error(res.message, { id: toastId });
        return;
      }
      toast.success("Category deleted", { id: toastId });
      onOpenChange(false);
      onDeleted?.();
      router.refresh();
    } catch {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{category?.name}&quot;? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
