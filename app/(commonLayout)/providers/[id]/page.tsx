import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { MealCard } from "@/components/modules/homepage/MealCard";
import { ReviewCard } from "@/components/modules/homepage/ReviewCard";
import { getProviderById } from "@/services/provider.service";
import type { ProviderProfile, Review } from "@/types";

interface ProviderProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProviderProfilePage({
  params,
}: ProviderProfilePageProps) {
  const { id } = await params;
  const res = await getProviderById(id);

  if (!res.data) {
    notFound();
  }

  const provider: ProviderProfile = res.data;
  const imageUrl =
    provider.image ||
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80";
  const meals = provider.meals ?? [];

  // Flatten reviews from all meals for the Reviews section
  const allReviews = meals.flatMap((meal) =>
    (meal.reviews ?? []).map((r) => ({ ...r, mealName: meal.name }))
  );
  const sortedReviews = [...allReviews].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/providers">← Back to providers</Link>
        </Button>
      </div>

      <div className="mb-12 grid gap-8 md:grid-cols-[300px_1fr]">
        {/* Provider image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt={provider.businessName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
            priority
          />
        </div>

        {/* Provider info */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{provider.businessName}</h1>
          {provider.description && (
            <p className="text-muted-foreground">{provider.description}</p>
          )}
          {provider.address && (
            <p className="text-sm text-muted-foreground">{provider.address}</p>
          )}
        </div>
      </div>

      {/* Menu */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Menu</h2>
        {meals.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
            No meals available yet.
          </p>
        )}
      </section>

      {/* Reviews */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Reviews</h2>
        {sortedReviews.length > 0 ? (
          <div className="space-y-4">
            {sortedReviews.map((review) => (
              <div key={review.id} className="space-y-1">
                <ReviewCard review={review as Review} />
                <p className="text-xs text-muted-foreground pl-14">
                  for {(review as Review & { mealName: string }).mealName}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
            No reviews yet.
          </p>
        )}
      </section>
    </div>
  );
}
