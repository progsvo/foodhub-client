import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/modules/orders/StatusBadge";
import type { Order } from "@/types";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const providerName =
    order.provider?.businessName ?? order.provider?.user?.name ?? "Provider";
  const itemCount = order._count?.items ?? order.items?.length ?? 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString()} · {providerName}
          </p>
          <p className="text-xs text-muted-foreground">
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <p className="text-lg font-semibold">
          ${order.totalAmount.toFixed(2)}
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href={`/orders/${order.id}`}>View details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
