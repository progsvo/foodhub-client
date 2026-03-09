import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getCategories } from "@/services/category.service";
import { getMeals } from "@/services/meal.service";
import { getProfile } from "@/services/user.service.server";
import { MealsTable } from "@/components/modules/provider/MealsTable";

export default async function ProviderMealsPage() {
  const profileRes = await getProfile();

  if (!profileRes.success || !profileRes.data) {
    redirect("/login?redirect=/provider/meals");
  }

  const profile = profileRes.data;

  if (profile.role !== "PROVIDER") {
    redirect("/");
  }

  if (!profile.providerProfile) {
    redirect("/profile?message=Create a provider profile first to manage meals");
  }

  const [mealsRes, categoriesRes] = await Promise.all([
    getMeals({ providerId: profile.providerProfile.id }),
    getCategories(),
  ]);

  const meals = mealsRes.data ?? [];
  const categories = categoriesRes.data ?? [];
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/">← Back to home</Link>
        </Button>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Meals</h1>
        <Button asChild>
          <Link href="/provider/meals/new">Add meal</Link>
        </Button>
      </div>

      <MealsTable meals={meals} categoryMap={categoryMap} />
    </div>
  );
}
