"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/modules/cart/CartItem";
import { Separator } from "@/components/ui/separator";
import type { Cart } from "@/types";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:5000";

interface CartContentProps {
  initialCart: Cart | null;
}

export function CartContent({ initialCart }: CartContentProps) {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(initialCart);
  const [removingMealId, setRemovingMealId] = useState<string | null>(null);
  const [updatingMealId, setUpdatingMealId] = useState<string | null>(null);

  const handleRemove = async (mealId: string) => {
    setRemovingMealId(mealId);
    try {
      const res = await fetch(`${API_URL}/api/cart/items/${mealId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Failed to remove item");
        return;
      }

      toast.success("Item removed from cart");
      setCart(data.data);
      router.refresh();
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setRemovingMealId(null);
    }
  };

  const handleQuantityChange = async (mealId: string, quantity: number) => {
    if (quantity < 1) return;
    setUpdatingMealId(mealId);
    try {
      const res = await fetch(`${API_URL}/api/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mealId, quantity }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Failed to update quantity");
        return;
      }

      setCart(data.data);
      router.refresh();
    } catch {
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingMealId(null);
    }
  };

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
    <div className="space-y-6">
      <div className="space-y-4">
        {cart.items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={handleRemove}
            onQuantityChange={handleQuantityChange}
            isRemoving={removingMealId === item.mealId}
            isUpdating={updatingMealId === item.mealId}
          />
        ))}
      </div>
      <Separator />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xl font-bold">
          Total: ${cart.totalPrice.toFixed(2)}
        </p>
        <Button asChild size="lg">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
      </div>
    </div>
  );
}
