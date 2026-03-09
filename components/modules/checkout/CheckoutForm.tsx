"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createOrder } from "@/services/order.service";
import type { Cart } from "@/types";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

const checkoutSchema = z.object({
  deliveryAddress: z
    .string()
    .min(5, "Delivery address must be at least 5 characters")
    .max(500, "Delivery address must not exceed 500 characters"),
});

interface CheckoutFormProps {
  initialCart: Cart | null;
}

export function CheckoutForm({ initialCart }: CheckoutFormProps) {
  const router = useRouter();
  const [cart] = useState<Cart | null>(initialCart);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      deliveryAddress: "",
    },
    validators: {
      onSubmit: checkoutSchema,
    },
    onSubmit: async ({ value }) => {
      if (!cart || cart.items.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      setIsSubmitting(true);
      const toastId = toast.loading("Placing order...");

      try {
        const res = await createOrder(value.deliveryAddress);

        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }

        toast.success("Order placed successfully", { id: toastId });
        router.push("/orders");
        router.refresh();
      } catch {
        toast.error("Something went wrong, please try again.", { id: toastId });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <p className="mb-4 text-muted-foreground">Your cart is empty</p>
        <Button asChild>
          <Link href="/meals">Browse Meals</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Delivery Address</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="checkout-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="deliveryAddress">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Full delivery address
                      </FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Street, apartment, city, postal code"
                        rows={4}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {cart.items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.meal.name} × {item.quantity}
                </span>
                <span>
                  ${(item.meal.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${cart.totalPrice.toFixed(2)}</span>
          </div>
          <Button
            form="checkout-form"
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing order..." : "Place order"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
