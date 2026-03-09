"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createMeal,
  updateMeal,
} from "@/services/meal.service";
import type { Category, Meal } from "@/types";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

const createSchema = z.object({
  name: z
    .string()
    .min(2, "Meal name must be at least 2 characters")
    .max(200, "Meal name must be at most 200 characters")
    .trim(),
  description: z.string(),
  price: z.number().refine((n) => !Number.isNaN(n) && n > 0, "Price must be a positive number"),
  image: z.union([
    z.string().url("Image must be a valid URL"),
    z.literal(""),
  ]),
  cuisine: z.string(),
  dietaryPreference: z.string(),
  categoryId: z.string().min(1, "Category is required"),
  isAvailable: z.boolean(),
});

const updateSchema = z.object({
  name: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || (val.length >= 2 && val.length <= 200),
      "Meal name must be 2-200 characters"
    ),
  description: z.string(),
  price: z.number().refine((n) => !Number.isNaN(n) && n > 0, "Price must be a positive number"),
  image: z.union([
    z.string().url("Image must be a valid URL"),
    z.literal(""),
  ]),
  cuisine: z.string(),
  dietaryPreference: z.string(),
  categoryId: z.string(),
  isAvailable: z.boolean(),
});

interface MealFormProps {
  meal?: Meal | null;
  categories: Category[];
  mode: "create" | "edit";
}

export function MealForm({ meal, categories, mode }: MealFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: meal?.name ?? "",
      description: meal?.description ?? "",
      price: meal?.price ?? 0,
      image: meal?.image ?? "",
      cuisine: meal?.cuisine ?? "",
      dietaryPreference: meal?.dietaryPreference ?? "",
      categoryId: meal?.categoryId ?? "",
      isAvailable: meal?.isAvailable ?? true,
    },
    validators: {
      onSubmit: mode === "create" ? createSchema : updateSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      const toastId =
        mode === "create"
          ? toast.loading("Creating meal...")
          : toast.loading("Updating meal...");

      try {
        const priceNum = typeof value.price === "string" ? parseFloat(value.price) : value.price;
        const payload = {
          name: value.name?.trim() || undefined,
          description: value.description?.trim() || undefined,
          price: priceNum,
          image: value.image?.trim() || null,
          cuisine: value.cuisine?.trim() || undefined,
          dietaryPreference: value.dietaryPreference?.trim() || undefined,
          categoryId: value.categoryId || undefined,
          isAvailable: value.isAvailable,
        };

        const res =
          mode === "create"
            ? await createMeal({
                name: value.name?.trim() ?? "",
                price: priceNum,
                categoryId: value.categoryId ?? "",
                description: value.description?.trim() || undefined,
                image: value.image?.trim() || null,
                cuisine: value.cuisine?.trim() || undefined,
                dietaryPreference: value.dietaryPreference?.trim() || undefined,
                isAvailable: value.isAvailable,
              })
            : await updateMeal(meal!.id, payload);

        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }

        toast.success(
          mode === "create" ? "Meal created" : "Meal updated",
          { id: toastId }
        );
        router.push("/provider/meals");
        router.refresh();
      } catch {
        toast.error("Something went wrong", { id: toastId });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Add meal" : "Edit meal"}
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Add a new meal to your menu"
            : "Update meal details"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {meal?.image && (
          <div className="relative h-20 w-32 overflow-hidden rounded-md">
            <Image
              src={meal.image}
              alt={meal.name}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
        )}
        <form
          id="meal-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor="meal-name">Meal name</FieldLabel>
                    <Input
                      id="meal-name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Grilled Chicken"
                      disabled={isSubmitting}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="description">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="meal-description">Description</FieldLabel>
                  <Textarea
                    id="meal-description"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Describe your meal"
                    disabled={isSubmitting}
                    rows={3}
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="price">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor="meal-price">Price</FieldLabel>
                    <Input
                      id="meal-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={field.state.value === 0 ? "" : field.state.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.handleChange(val === "" ? 0 : parseFloat(val) || 0);
                      }}
                      placeholder="0.00"
                      disabled={isSubmitting}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="categoryId">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor="meal-category">Category</FieldLabel>
                    <Select
                      id="meal-category"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isSubmitting}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="image">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor="meal-image">Image URL</FieldLabel>
                    <Input
                      id="meal-image"
                      type="url"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="https://..."
                      disabled={isSubmitting}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="cuisine">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="meal-cuisine">Cuisine</FieldLabel>
                  <Input
                    id="meal-cuisine"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Italian, Asian"
                    disabled={isSubmitting}
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="dietaryPreference">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="meal-dietary">Dietary preference</FieldLabel>
                  <Input
                    id="meal-dietary"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Vegetarian, Vegan"
                    disabled={isSubmitting}
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="isAvailable">
              {(field) => (
                <Field orientation="horizontal">
                  <input
                    type="checkbox"
                    id="meal-available"
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    disabled={isSubmitting}
                    className="h-4 w-4 rounded border-input"
                  />
                  <FieldLabel htmlFor="meal-available">Available</FieldLabel>
                </Field>
              )}
            </form.Field>
          </FieldGroup>
          <div className="mt-4 flex gap-2">
            <Button
              type="submit"
              form="meal-form"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Add meal"
                  : "Save changes"}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/provider/meals">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
