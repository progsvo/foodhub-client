import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { OrderCard } from "@/components/modules/orders/OrderCard";
import { getOrders } from "@/services/order.service.server";

export default async function OrdersPage() {
  const res = await getOrders({ sortOrder: "desc" });

  if (!res.success && res.message === "Unauthorized") {
    redirect("/login?redirect=/orders");
  }

  const orders = res.data ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="mb-4 text-muted-foreground">You have no orders yet</p>
          <Button asChild>
            <Link href="/meals">Browse Meals</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
