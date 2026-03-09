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
import { UpdateOrderStatusForm } from "@/components/modules/provider/UpdateOrderStatusForm";
import { getProfile } from "@/services/user.service.server";
import { getProviderOrderById } from "@/services/order.service.server";
import type { Order } from "@/types";

interface ProviderOrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProviderOrderDetailsPage({
  params,
}: ProviderOrderDetailsPageProps) {
  const { id } = await params;

  const profileRes = await getProfile();

  if (!profileRes.success || !profileRes.data) {
    redirect(`/login?redirect=/provider/orders/${id}`);
  }

  const profile = profileRes.data;

  if (profile.role !== "PROVIDER" || !profile.providerProfile) {
    redirect("/");
  }

  const orderRes = await getProviderOrderById(id);

  if (!orderRes.success || !orderRes.data) {
    if (orderRes.message === "Unauthorized") {
      redirect(`/login?redirect=/provider/orders/${id}`);
    }
    notFound();
  }

  const order: Order = orderRes.data;
  const customerName = order.user?.name ?? "Customer";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/provider/orders">← Back to orders</Link>
        </Button>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id.slice(-8)}</h1>
            <p className="text-muted-foreground">
              {new Date(order.createdAt).toLocaleString()} · {customerName}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <StatusBadge status={order.status} />
            <UpdateOrderStatusForm orderId={order.id} currentStatus={order.status} />
          </div>
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
