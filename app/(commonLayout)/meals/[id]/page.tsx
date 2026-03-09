import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddToCartButton } from "@/components/modules/homepage/AddToCartButton";
import { ReviewCard } from "@/components/modules/homepage/ReviewCard";
import { ReviewForm } from "@/components/modules/reviews/ReviewForm";
import { getMealById } from "@/services/meal.service";
import type { Meal } from "@/types";

interface MealDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function MealDetailsPage({ params }: MealDetailsPageProps) {
  const { id } = await params;
  const res = await getMealById(id);

  if (!res.data) {
    notFound();
  }

  const meal: Meal = res.data;
  const imageUrl =
    meal.image ||
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80";
  const reviews = meal.reviews ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/meals">← Back to meals</Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Meal image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt={meal.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Meal info */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              {meal.cuisine && (
                <Badge variant="secondary">{meal.cuisine}</Badge>
              )}
              {meal.dietaryPreference && (
                <Badge variant="outline">{meal.dietaryPreference}</Badge>
              )}
              {!meal.isAvailable && (
                <Badge variant="destructive">Unavailable</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{meal.name}</h1>
            <p className="mt-2 text-2xl font-semibold text-primary">
              ${meal.price.toFixed(2)}
            </p>
          </div>

          {meal.description && (
            <p className="text-muted-foreground">{meal.description}</p>
          )}

          {/* Provider info */}
          {meal.provider && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="link" className="h-auto p-0" asChild>
                  <Link href={`/providers/${meal.provider.id}`}>
                    {meal.provider.businessName}
                  </Link>
                </Button>
                {meal.provider.address && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {meal.provider.address}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <AddToCartButton
            mealId={meal.id}
            mealName={meal.name}
            disabled={!meal.isAvailable}
          />
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Reviews</h2>
        <div className="mb-8">
          <ReviewForm mealId={meal.id} mealName={meal.name} />
        </div>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No reviews yet.</p>
        )}
      </section>
    </div>
  );
}
