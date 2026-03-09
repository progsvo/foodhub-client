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
import { updateProfile } from "@/services/user.service";
import type { UserProfile } from "@/types";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().max(50),
  image: z.union([z.string().url("Image must be a valid URL"), z.literal("")]),
});

interface ProfileEditFormProps {
  profile: UserProfile;
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: profile.name ?? "",
      phone: profile.phone ?? "",
      image: profile.image ?? "",
    },
    validators: {
      onSubmit: profileSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      const toastId = toast.loading("Updating profile...");

      try {
        const res = await updateProfile({
          name: value.name.trim(),
          phone: value.phone?.trim() || undefined,
          image: value.image?.trim() || null,
        });

        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }

        toast.success("Profile updated", { id: toastId });
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
        <CardTitle>Edit profile</CardTitle>
        <CardDescription>
          Update your name, phone, and profile image
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {profile.image && (
          <div className="relative h-20 w-20 overflow-hidden rounded-full">
            <Image
              src={profile.image}
              alt={profile.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        )}
        <form
          id="profile-form"
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
                    <FieldLabel htmlFor="profile-name">Name</FieldLabel>
                    <Input
                      id="profile-name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isSubmitting}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="phone">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="profile-phone">Phone</FieldLabel>
                  <Input
                    id="profile-phone"
                    type="tel"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Optional"
                    disabled={isSubmitting}
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
                    <FieldLabel htmlFor="profile-image">
                      Profile image URL
                    </FieldLabel>
                    <Input
                      id="profile-image"
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
          </FieldGroup>
          <Button
            type="submit"
            form="profile-form"
            disabled={isSubmitting}
            className="mt-4"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
