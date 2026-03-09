"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

interface AddToCartButtonProps {
  mealId: string;
  mealName: string;
  disabled?: boolean;
}

export function AddToCartButton({
  mealId,
  mealName,
  disabled = false,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const handleAddToCart = async () => {
    if (!session?.user) {
      toast.error("Please log in to add items to cart");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mealId, quantity: 1 }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Failed to add to cart");
        return;
      }

      toast.success(`${mealName} added to cart`);
      router.refresh();
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <Button disabled>
        Loading...
      </Button>
    );
  }

  if (!session?.user) {
    return (
      <Button asChild disabled={disabled}>
        <Link href={`/login?redirect=/meals/${mealId}`}>
          Log in to add to cart
        </Link>
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || loading}
    >
      {loading ? "Adding..." : "Add to cart"}
    </Button>
  );
}
