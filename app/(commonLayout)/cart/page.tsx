import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CartContent } from "@/components/modules/cart/CartContent";
import { getCart } from "@/services/cart.service";

export default async function CartPage() {
  const res = await getCart();

  if (!res.success && res.message === "Unauthorized") {
    redirect("/login?redirect=/cart");
  }

  const cart = res.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>
      <CartContent initialCart={cart} />
    </div>
  );
}
