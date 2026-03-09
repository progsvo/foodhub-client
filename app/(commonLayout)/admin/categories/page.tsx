"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCategories } from "@/services/category.service";
import { CategoryForm } from "@/components/modules/admin/CategoryForm";
import { DeleteCategoryDialog } from "@/components/modules/admin/DeleteCategoryDialog";
import type { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    const res = await getCategories();
    setCategories(res.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/admin">← Back to dashboard</Link>
        </Button>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <Button onClick={() => setCreateOpen(true)}>Add category</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Image</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No categories yet. Add your first category.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {cat.image ? "Yes" : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditCategory(cat)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteCategory(cat)}
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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add category</DialogTitle>
          </DialogHeader>
          <CategoryForm
            onSuccess={() => {
              setCreateOpen(false);
              loadCategories();
            }}
            onCancel={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editCategory} onOpenChange={(o) => !o && setEditCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit category</DialogTitle>
          </DialogHeader>
          {editCategory && (
            <CategoryForm
              category={editCategory}
              onSuccess={() => {
                setEditCategory(null);
                loadCategories();
              }}
              onCancel={() => setEditCategory(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteCategoryDialog
        category={deleteCategory}
        open={!!deleteCategory}
        onOpenChange={(o) => !o && setDeleteCategory(null)}
        onDeleted={() => {
          setDeleteCategory(null);
          loadCategories();
        }}
      />
    </div>
  );
}
