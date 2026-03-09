import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderStatusTimeline } from "@/components/modules/orders/OrderStatusTimeline";
import { StatusBadge } from "@/components/modules/orders/StatusBadge";
import { getOrderById } from "@/services/order.service.server";
import type { Order } from "@/types";

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params;
  const res = await getOrderById(id);

  if (!res.success || !res.data) {
    if (res.message === "Unauthorized") {
      redirect(`/login?redirect=/orders/${id}`);
    }
    notFound();
  }

  const order: Order = res.data;
  const providerName =
    order.provider?.businessName ?? order.provider?.user?.name ?? "Provider";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/orders">← Back to orders</Link>
        </Button>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id.slice(-8)}</h1>
            <p className="text-muted-foreground">
              {new Date(order.createdAt).toLocaleString()} · {providerName}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <OrderStatusTimeline status={order.status} />

        <Card>
          <CardHeader>
            <CardTitle>Delivery address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{order.deliveryAddress}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order items</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {order.items.map((item) => {
                const imageUrl =
                  item.meal?.image ||
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80";
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={imageUrl}
                        alt={item.mealName}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.mealName}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.mealPrice.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${(item.mealPrice * item.quantity).toFixed(2)}
                    </p>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex justify-end border-t pt-4">
              <p className="text-xl font-bold">
                Total: ${order.totalAmount.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
