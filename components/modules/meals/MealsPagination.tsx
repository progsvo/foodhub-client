"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MealsPaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  baseParams: Record<string, string | undefined>;
}

function buildSearchParams(
  page: number,
  baseParams: Record<string, string | undefined>
): string {
  const params = new URLSearchParams();
  params.set("page", String(page));
  Object.entries(baseParams).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return params.toString();
}

export function MealsPagination({
  currentPage,
  totalPages,
  total,
  limit,
  baseParams,
}: MealsPaginationProps) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Showing {start}-{end} of {total} meals
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          asChild
          disabled={currentPage <= 1}
        >
          <Link
            href={
              currentPage <= 1
                ? "#"
                : `/meals?${buildSearchParams(currentPage - 1, baseParams)}`
            }
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Link>
        </Button>
        <span className="px-3 text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          asChild
          disabled={currentPage >= totalPages}
        >
          <Link
            href={
              currentPage >= totalPages
                ? "#"
                : `/meals?${buildSearchParams(currentPage + 1, baseParams)}`
            }
            aria-disabled={currentPage >= totalPages}
            className={
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          >
            Next
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
