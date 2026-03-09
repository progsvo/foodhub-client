import { Suspense } from "react";

import { MealCard } from "@/components/modules/homepage/MealCard";
import { SearchMeals } from "@/components/modules/homepage/SearchMeals";
import { MealsFilterSidebar } from "@/components/modules/meals/MealsFilterSidebar";
import { MealsPagination } from "@/components/modules/meals/MealsPagination";
import { getCategories } from "@/services/category.service";
import { getMeals } from "@/services/meal.service";
import type { Meal } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface MealsPageProps {
  searchParams: Promise<{
    search?: string;
    categoryId?: string;
    cuisine?: string;
    dietaryPreference?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

export default async function MealsPage({ searchParams }: MealsPageProps) {
  const params = await searchParams;
  const {
    search,
    categoryId,
    cuisine,
    dietaryPreference,
    minPrice,
    maxPrice,
    page: pageParam,
  } = params;

  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const limit = 24;

  const [mealsRes, categoriesRes] = await Promise.all([
    getMeals({
      page,
      limit,
      search: search ?? undefined,
      categoryId: categoryId ?? undefined,
      cuisine: cuisine ?? undefined,
      dietaryPreference: dietaryPreference ?? undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    }),
    getCategories(),
  ]);

  const meals: Meal[] = mealsRes.data ?? [];
  const categories = categoriesRes.data ?? [];
  const meta = mealsRes.meta ?? { page: 1, limit: 24, total: 0 };
  const totalPages = Math.ceil(meta.total / limit);

  const hasFilters =
    search || categoryId || cuisine || dietaryPreference || minPrice || maxPrice;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-6 text-3xl font-bold">Meals</h1>
        <Suspense
          fallback={
            <Skeleton className="h-10 w-full max-w-md rounded-md" />
          }
        >
          <SearchMeals
            action="/meals"
            preserveParams={[
              "categoryId",
              "cuisine",
              "dietaryPreference",
              "minPrice",
              "maxPrice",
            ]}
          />
        </Suspense>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <MealsFilterSidebar
            categories={categories}
            currentParams={{
              search: search ?? undefined,
              categoryId: categoryId ?? undefined,
              cuisine: cuisine ?? undefined,
              dietaryPreference: dietaryPreference ?? undefined,
              minPrice: minPrice ?? undefined,
              maxPrice: maxPrice ?? undefined,
            }}
          />
        </aside>
        <main className="min-w-0 flex-1">
          {meals.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {meals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>
              <MealsPagination
                currentPage={page}
                totalPages={totalPages}
                total={meta.total}
                limit={limit}
                baseParams={{
                  search: search ?? undefined,
                  categoryId: categoryId ?? undefined,
                  cuisine: cuisine ?? undefined,
                  dietaryPreference: dietaryPreference ?? undefined,
                  minPrice: minPrice ?? undefined,
                  maxPrice: maxPrice ?? undefined,
                }}
              />
            </>
          ) : (
            <p className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
              No meals found.{" "}
              {hasFilters ? "Try different filters." : "Check back later."}
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
