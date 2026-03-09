import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getCategories } from "@/services/category.service";
import { getMeals } from "@/services/meal.service";
import { getProviders } from "@/services/provider.service";
import type { Category, Meal, ProviderProfile } from "@/types";
import { MealCard } from "@/components/modules/homepage/MealCard";
import { ProviderCard } from "@/components/modules/homepage/ProviderCard";
import { SearchMeals } from "@/components/modules/homepage/SearchMeals";

const FEATURED_MEALS_LIMIT = 8;
const FEATURED_PROVIDERS_LIMIT = 6;
const CATEGORIES_LIMIT = 12;

interface HomePageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { search } = await searchParams;

  const [categoriesRes, mealsRes, providersRes] = await Promise.all([
    getCategories({ limit: CATEGORIES_LIMIT }),
    getMeals({ limit: FEATURED_MEALS_LIMIT, search: search ?? undefined }),
    getProviders({ limit: FEATURED_PROVIDERS_LIMIT }),
  ]);

  const categories: Category[] = categoriesRes.data ?? [];
  const meals: Meal[] = mealsRes.data ?? [];
  const providers: ProviderProfile[] = providersRes.data ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16 flex flex-col items-center justify-center py-12 text-center md:py-20">
        <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg md:h-80">
          <Image
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&q=80"
            alt="FoodHub Hero"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1920px"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          Welcome to FoodHub
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
          Order meals from your favorite food providers. Browse menus, place
          orders, and track delivery.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/meals">Browse Meals</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/providers">View Providers</Link>
          </Button>
        </div>
      </section>

      {/* Search Meals */}
      <section className="mb-16">
        <SearchMeals />
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link key={category.id} href={`/meals?categoryId=${category.id}`}>
                <Button variant="secondary" size="sm" className="rounded-full">
                  {category.name}
                </Button>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Meals */}
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Meals</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/meals">View all</Link>
          </Button>
        </div>
        {meals.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No meals found. {search ? "Try a different search." : "Check back later."}
          </p>
        )}
      </section>

      {/* Featured Providers */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Providers</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/providers">View all</Link>
          </Button>
        </div>
        {providers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No providers yet. Check back later.
          </p>
        )}
      </section>
    </div>
  );
}
