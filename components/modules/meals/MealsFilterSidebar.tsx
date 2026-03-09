"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Category } from "@/types";

const CUISINE_OPTIONS = [
  { value: "", label: "All cuisines" },
  { value: "Italian", label: "Italian" },
  { value: "Asian", label: "Asian" },
  { value: "American", label: "American" },
  { value: "Mexican", label: "Mexican" },
  { value: "Mediterranean", label: "Mediterranean" },
];

const DIETARY_OPTIONS = [
  { value: "", label: "All" },
  { value: "Vegetarian", label: "Vegetarian" },
  { value: "Vegan", label: "Vegan" },
];

export interface MealsFilterParams {
  search?: string;
  categoryId?: string;
  cuisine?: string;
  dietaryPreference?: string;
  minPrice?: string;
  maxPrice?: string;
}

interface MealsFilterSidebarProps {
  categories: Category[];
  currentParams: MealsFilterParams;
}

export function MealsFilterSidebar({
  categories,
  currentParams,
}: MealsFilterSidebarProps) {
  const router = useRouter();

  const handleApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const params = new URLSearchParams();
    const search = formData.get("search")?.toString().trim();
    const categoryId = formData.get("categoryId")?.toString().trim();
    const cuisine = formData.get("cuisine")?.toString().trim();
    const dietaryPreference = formData.get("dietaryPreference")?.toString().trim();
    const minPrice = formData.get("minPrice")?.toString().trim();
    const maxPrice = formData.get("maxPrice")?.toString().trim();

    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId);
    if (cuisine) params.set("cuisine", cuisine);
    if (dietaryPreference) params.set("dietaryPreference", dietaryPreference);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    const qs = params.toString();
    router.push(`/meals${qs ? `?${qs}` : ""}`);
  };

  const handleClear = () => {
    const search = currentParams.search;
    router.push(search ? `/meals?search=${encodeURIComponent(search)}` : "/meals");
  };

  const hasActiveFilters =
    currentParams.categoryId ||
    currentParams.cuisine ||
    currentParams.dietaryPreference ||
    currentParams.minPrice ||
    currentParams.maxPrice;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleApply} className="space-y-4">
          {currentParams.search && (
            <input type="hidden" name="search" value={currentParams.search} />
          )}

          <div className="space-y-2">
            <Label htmlFor="filter-category">Category</Label>
            <Select
              id="filter-category"
              name="categoryId"
              defaultValue={currentParams.categoryId ?? ""}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-cuisine">Cuisine</Label>
            <Select
              id="filter-cuisine"
              name="cuisine"
              defaultValue={currentParams.cuisine ?? ""}
            >
              {CUISINE_OPTIONS.map((o) => (
                <option key={o.value || "all"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-dietary">Dietary preference</Label>
            <Select
              id="filter-dietary"
              name="dietaryPreference"
              defaultValue={currentParams.dietaryPreference ?? ""}
            >
              {DIETARY_OPTIONS.map((o) => (
                <option key={o.value || "all"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-min-price">Min price ($)</Label>
            <Input
              id="filter-min-price"
              name="minPrice"
              type="number"
              min={0}
              step={0.01}
              placeholder="0"
              defaultValue={currentParams.minPrice ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-max-price">Max price ($)</Label>
            <Input
              id="filter-max-price"
              name="maxPrice"
              type="number"
              min={0}
              step={0.01}
              placeholder="Any"
              defaultValue={currentParams.maxPrice ?? ""}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button type="submit">Apply</Button>
            {hasActiveFilters && (
              <Button type="button" variant="ghost" onClick={handleClear}>
                Clear filters
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
