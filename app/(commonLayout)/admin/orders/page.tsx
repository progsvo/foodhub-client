import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AdminOrdersFilter } from "@/components/modules/admin/AdminOrdersFilter";
import { StatusBadge } from "@/components/modules/orders/StatusBadge";
import { getProfile } from "@/services/user.service.server";
import { getAdminOrders } from "@/services/admin.service.server";
import type { Order } from "@/types";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const profileRes = await getProfile();
  if (!profileRes.success || !profileRes.data || profileRes.data.role !== "ADMIN") {
    return null;
  }

  const { status } = await searchParams;
  const ordersRes = await getAdminOrders({ sortOrder: "desc", status });
  const orders: Order[] = ordersRes.data ?? [];

  const customerName = (order: Order) => order.user?.name ?? "Customer";
  const providerName = (order: Order) =>
    order.provider?.businessName ?? order.provider?.user?.name ?? "Provider";

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/admin">← Back to dashboard</Link>
        </Button>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">All Orders</h1>
        <AdminOrdersFilter />
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="mb-4 text-muted-foreground">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()} · {customerName(order)} →{" "}
                    {providerName(order)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(order._count?.items ?? order.items?.length ?? 0)} item(s) · $
                    {order.totalAmount.toFixed(2)}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/orders/${order.id}`}>View details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
