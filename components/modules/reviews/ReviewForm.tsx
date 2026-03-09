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
import { Textarea } from "@/components/ui/textarea";
import { createReview } from "@/services/review.service";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { toast } from "sonner";
import * as z from "zod";

const reviewSchema = z.object({
  rating: z.number().min(1, "Select a rating").max(5),
  comment: z.string().max(1000, "Comment must not exceed 1000 characters"),
});

interface ReviewFormProps {
  mealId: string;
  mealName: string;
}

function StarRating({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          className="text-2xl transition-colors hover:scale-110 disabled:pointer-events-none disabled:opacity-50"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <span
            className={
              star <= value ? "text-yellow-500" : "text-muted-foreground/40"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

export function ReviewForm({ mealId, mealName }: ReviewFormProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      rating: 0,
      comment: "",
    },
    validators: {
      onSubmit: reviewSchema,
    },
    onSubmit: async ({ value }) => {
      if (value.rating < 1 || value.rating > 5) {
        toast.error("Please select a rating");
        return;
      }

      setIsSubmitting(true);
      const toastId = toast.loading("Submitting review...");

      try {
        const res = await createReview(
          mealId,
          value.rating,
          value.comment?.trim() || undefined
        );

        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }

        toast.success("Review submitted", { id: toastId });
        router.refresh();
        form.reset();
      } catch {
        toast.error("Something went wrong", { id: toastId });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (isPending) {
    return null;
  }

  if (!session?.user) {
    return (
      <p className="text-sm text-muted-foreground">
        <Link
          href={`/login?redirect=/meals/${mealId}`}
          className="underline hover:text-foreground"
        >
          Log in
        </Link>{" "}
        to leave a review.
      </p>
    );
  }

  return (
    <form
      id="review-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <form.Field name="rating">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel>Your rating</FieldLabel>
                <StarRating
                  value={field.state.value}
                  onChange={(v) => field.handleChange(v)}
                  disabled={isSubmitting}
                />
                {isInvalid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="comment">
          {(field) => (
            <Field>
              <FieldLabel htmlFor="review-comment">Comment (optional)</FieldLabel>
              <Textarea
                id="review-comment"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
                disabled={isSubmitting}
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>
      <Button
        type="submit"
        form="review-form"
        disabled={isSubmitting || form.state.values.rating < 1}
      >
        {isSubmitting ? "Submitting..." : "Submit review"}
      </Button>
    </form>
  );
}
