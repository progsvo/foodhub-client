import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { MealForm } from "@/components/modules/provider/MealForm";
import { getCategories } from "@/services/category.service";
import { getProfile } from "@/services/user.service.server";

export default async function AddMealPage() {
  const profileRes = await getProfile();

  if (!profileRes.success || !profileRes.data) {
    redirect("/login?redirect=/provider/meals/new");
  }

  const profile = profileRes.data;

  if (profile.role !== "PROVIDER") {
    redirect("/");
  }

  if (!profile.providerProfile) {
    redirect("/profile?message=Create a provider profile first to manage meals");
  }

  const categoriesRes = await getCategories();
  const categories = categoriesRes.data ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/provider/meals">← Back to meals</Link>
        </Button>
      </div>

      <h1 className="mb-8 text-3xl font-bold">Add meal</h1>

      <MealForm categories={categories} mode="create" />
    </div>
  );
}
