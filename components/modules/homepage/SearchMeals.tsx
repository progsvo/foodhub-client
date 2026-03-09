"use client";

import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchMealsProps {
  action?: string;
  preserveParams?: string[];
}

export function SearchMeals({
  action = "/",
  preserveParams = [],
}: SearchMealsProps) {
  const searchParams = useSearchParams();
  const defaultValue = searchParams.get("search") ?? "";

  return (
    <form
      action={action}
      method="get"
      className="flex w-full max-w-md gap-2"
    >
      {preserveParams.map((key) => {
        const value = searchParams.get(key);
        if (!value) return null;
        return <input key={key} type="hidden" name={key} value={value} />;
      })}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="search"
          placeholder="Search meals..."
          defaultValue={defaultValue}
          className="pl-9"
        />
      </div>
      <Button type="submit" size="icon" variant="secondary">
        <Search className="size-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
