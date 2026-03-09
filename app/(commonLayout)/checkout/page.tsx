import { redirect } from "next/navigation";

import { CheckoutForm } from "@/components/modules/checkout/CheckoutForm";
import { getCart } from "@/services/cart.service";

export default async function CheckoutPage() {
  const res = await getCart();

  if (!res.success && res.message === "Unauthorized") {
    redirect("/login?redirect=/checkout");
  }

  const cart = res.data;

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      <CheckoutForm initialCart={cart} />
    </div>
  );
}
