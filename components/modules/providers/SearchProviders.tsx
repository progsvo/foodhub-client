"use client";

import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchProviders() {
  const searchParams = useSearchParams();
  const defaultValue = searchParams.get("search") ?? "";

  return (
    <form action="/providers" method="get" className="flex w-full max-w-md gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="search"
          placeholder="Search providers by name..."
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
