"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
  onRemove: (mealId: string) => void;
  onQuantityChange: (mealId: string, quantity: number) => void;
  isRemoving?: boolean;
  isUpdating?: boolean;
}

export function CartItem({
  item,
  onRemove,
  onQuantityChange,
  isRemoving = false,
  isUpdating = false,
}: CartItemProps) {
  const imageUrl =
    item.meal.image ||
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80";
  const lineTotal = (item.meal.price * item.quantity).toFixed(2);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href={`/meals/${item.meal.id}`}
            className="relative aspect-square w-full shrink-0 overflow-hidden rounded-md sm:w-24"
          >
            <Image
              src={imageUrl}
              alt={item.meal.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </Link>
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href={`/meals/${item.meal.id}`}
                className="font-medium hover:underline"
              >
                {item.meal.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                ${item.meal.price.toFixed(2)} each
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={item.quantity <= 1 || isUpdating}
                  onClick={() => onQuantityChange(item.mealId, item.quantity - 1)}
                >
                  −
                </Button>
                <span className="min-w-[2rem] text-center font-medium">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={item.quantity >= 99 || isUpdating}
                  onClick={() => onQuantityChange(item.mealId, item.quantity + 1)}
                >
                  +
                </Button>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                disabled={isRemoving}
                onClick={() => onRemove(item.mealId)}
              >
                {isRemoving ? "Removing..." : "Remove"}
              </Button>
            </div>
            <p className="font-semibold sm:text-right">${lineTotal}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
