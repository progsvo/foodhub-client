"use client";

import Image from "next/image";
import Link from "next/link";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { deleteMeal } from "@/services/meal.service";
import type { Meal } from "@/types";
import { toast } from "sonner";
import { useState } from "react";

interface MealsTableProps {
  meals: Meal[];
  categoryMap: Record<string, string>;
}

export function MealsTable({ meals, categoryMap }: MealsTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const toastId = toast.loading("Deleting meal...");
    try {
      const res = await deleteMeal(deleteId);
      if (!res.success) {
        toast.error(res.message, { id: toastId });
        return;
      }
      toast.success("Meal deleted", { id: toastId });
      setDeleteId(null);
      router.refresh();
    } catch {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {meals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No meals yet. Add your first meal to get started.
                </TableCell>
              </TableRow>
            ) : (
              meals.map((meal) => (
                <TableRow key={meal.id}>
                  <TableCell>
                    {meal.image ? (
                      <div className="relative h-10 w-10 overflow-hidden rounded">
                        <Image
                          src={meal.image}
                          alt={meal.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{meal.name}</TableCell>
                  <TableCell>${meal.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {meal.category?.name ?? categoryMap[meal.categoryId] ?? "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={meal.isAvailable ? "default" : "secondary"}>
                      {meal.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/provider/meals/${meal.id}/edit`}>Edit</Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(meal.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete meal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this meal? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
