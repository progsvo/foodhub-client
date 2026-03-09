import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { MealForm } from "@/components/modules/provider/MealForm";
import { getCategories } from "@/services/category.service";
import { getMealById } from "@/services/meal.service";
import { getProfile } from "@/services/user.service.server";

interface EditMealPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMealPage({ params }: EditMealPageProps) {
  const { id } = await params;

  const profileRes = await getProfile();

  if (!profileRes.success || !profileRes.data) {
    redirect("/login?redirect=/provider/meals/" + id + "/edit");
  }

  const profile = profileRes.data;

  if (profile.role !== "PROVIDER") {
    redirect("/");
  }

  if (!profile.providerProfile) {
    redirect("/profile?message=Create a provider profile first to manage meals");
  }

  const [mealRes, categoriesRes] = await Promise.all([
    getMealById(id),
    getCategories(),
  ]);

  const meal = mealRes.data;
  const categories = categoriesRes.data ?? [];

  if (!meal) {
    notFound();
  }

  if (meal.providerId !== profile.providerProfile.id) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/provider/meals">← Back to meals</Link>
        </Button>
      </div>

      <h1 className="mb-8 text-3xl font-bold">Edit meal</h1>

      <MealForm meal={meal} categories={categories} mode="edit" />
    </div>
  );
}
