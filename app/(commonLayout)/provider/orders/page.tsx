import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ProviderOrderCard } from "@/components/modules/provider/ProviderOrderCard";
import { getProfile } from "@/services/user.service.server";
import { getProviderOrders } from "@/services/order.service.server";

export default async function ProviderOrdersPage() {
  const profileRes = await getProfile();

  if (!profileRes.success || !profileRes.data) {
    redirect("/login?redirect=/provider/orders");
  }

  const profile = profileRes.data;

  if (profile.role !== "PROVIDER") {
    redirect("/");
  }

  if (!profile.providerProfile) {
    redirect("/profile?message=Create a provider profile first to manage orders");
  }

  const ordersRes = await getProviderOrders({ sortOrder: "desc" });
  const orders = ordersRes.data ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/">← Back to home</Link>
        </Button>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Incoming Orders</h1>
        <Button asChild variant="outline">
          <Link href="/provider/meals">Manage Meals</Link>
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="mb-4 text-muted-foreground">No incoming orders yet</p>
          <Button asChild variant="outline">
            <Link href="/provider/meals">Manage Meals</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <ProviderOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
