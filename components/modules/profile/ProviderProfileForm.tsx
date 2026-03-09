"use client";

import { useState } from "react";
import Image from "next/image";
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
import { Textarea } from "@/components/ui/textarea";
import {
  createProviderProfile,
  updateProviderProfile,
} from "@/services/provider.service";
import type { ProviderProfile } from "@/types";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

const createSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(200, "Business name must be at most 200 characters")
    .trim(),
  description: z.string(),
  image: z.union([
    z.string().url("Image must be a valid URL"),
    z.literal(""),
  ]),
  address: z.string(),
});

const updateSchema = z.object({
  businessName: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || (val.length >= 2 && val.length <= 200),
      "Business name must be 2-200 characters"
    ),
  description: z.string(),
  image: z.union([
    z.string().url("Image must be a valid URL"),
    z.literal(""),
  ]),
  address: z.string(),
});

interface ProviderProfileFormProps {
  providerProfile?: ProviderProfile | null;
  mode: "create" | "edit";
}

export function ProviderProfileForm({
  providerProfile,
  mode,
}: ProviderProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      businessName: providerProfile?.businessName ?? "",
      description: providerProfile?.description ?? "",
      image: providerProfile?.image ?? "",
      address: providerProfile?.address ?? "",
    },
    validators: {
      onSubmit: mode === "create" ? createSchema : updateSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      const toastId =
        mode === "create"
          ? toast.loading("Creating provider profile...")
          : toast.loading("Updating provider profile...");

      try {
        const payload = {
          businessName: value.businessName?.trim() || undefined,
          description: value.description?.trim() || undefined,
          image: value.image?.trim() || null,
          address: value.address?.trim() || undefined,
        };

        const res =
          mode === "create"
            ? await createProviderProfile({
                ...payload,
                businessName: payload.businessName ?? "",
              })
            : await updateProviderProfile(payload);

        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }

        toast.success(
          mode === "create"
            ? "Provider profile created"
            : "Provider profile updated",
          { id: toastId }
        );
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
          {mode === "create" ? "Create provider profile" : "Edit provider profile"}
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Set up your business profile to start listing meals"
            : "Update your business name, description, image, and address"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {providerProfile?.image && (
          <div className="relative h-20 w-32 overflow-hidden rounded-md">
            <Image
              src={providerProfile.image}
              alt={providerProfile.businessName}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
        )}
        <form
          id="provider-profile-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="businessName">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor="provider-business-name">
                      Business name
                    </FieldLabel>
                    <Input
                      id="provider-business-name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Your restaurant or business name"
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
                  <FieldLabel htmlFor="provider-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    id="provider-description"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Tell customers about your business"
                    disabled={isSubmitting}
                    rows={4}
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="image">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor="provider-image">
                      Business image URL
                    </FieldLabel>
                    <Input
                      id="provider-image"
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
            <form.Field name="address">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="provider-address">Address</FieldLabel>
                  <Input
                    id="provider-address"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Your business address"
                    disabled={isSubmitting}
                  />
                </Field>
              )}
            </form.Field>
          </FieldGroup>
          <Button
            type="submit"
            form="provider-profile-form"
            disabled={isSubmitting}
            className="mt-4"
          >
            {isSubmitting
              ? mode === "create"
                ? "Creating..."
                : "Saving..."
              : mode === "create"
                ? "Create profile"
                : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
