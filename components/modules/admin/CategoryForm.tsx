"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createCategory, updateCategory } from "@/services/category.service";
import type { Category } from "@/types";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  image: z.union([z.string().url("Image must be a valid URL"), z.literal("")]),
});

interface CategoryFormProps {
  category?: Category | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const router = useRouter();
  const isEdit = !!category;

  const form = useForm({
    defaultValues: {
      name: category?.name ?? "",
      image: category?.image ?? "",
    },
    onSubmit: async ({ value }) => {
      const parsed = categorySchema.safeParse({
        name: value.name,
        image: value.image || "",
      });
      if (!parsed.success) {
        const firstIssue = parsed.error.issues[0];
        toast.error(firstIssue?.message ?? "Validation failed");
        return;
      }

      const toastId = toast.loading(isEdit ? "Updating category..." : "Creating category...");
      try {
        const res = isEdit
          ? await updateCategory(category.id, {
              name: parsed.data.name,
              image: parsed.data.image || null,
            })
          : await createCategory({
              name: parsed.data.name,
              image: parsed.data.image || null,
            });

        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success(isEdit ? "Category updated" : "Category created", { id: toastId });
        onSuccess?.();
        router.refresh();
      } catch {
        toast.error("Something went wrong", { id: toastId });
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field name="name">
        {(field) => (
          <FieldGroup>
            <FieldLabel>Name</FieldLabel>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Category name"
            />
            <FieldError>{field.state.meta.errors?.[0]}</FieldError>
          </FieldGroup>
        )}
      </form.Field>
      <form.Field name="image">
        {(field) => (
          <FieldGroup>
            <FieldLabel>Image URL (optional)</FieldLabel>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="https://..."
            />
            <FieldError>{field.state.meta.errors?.[0]}</FieldError>
          </FieldGroup>
        )}
      </form.Field>
      <div className="flex gap-2">
        <Button type="submit" disabled={form.state.isSubmitting}>
          {isEdit ? "Update" : "Create"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
