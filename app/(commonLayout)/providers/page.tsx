import { Suspense } from "react";

import { ProviderCard } from "@/components/modules/homepage/ProviderCard";
import { SearchProviders } from "@/components/modules/providers/SearchProviders";
import { getProviders } from "@/services/provider.service";
import type { ProviderProfile } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ProvidersPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function ProvidersPage({ searchParams }: ProvidersPageProps) {
  const { search } = await searchParams;

  const providersRes = await getProviders({
    limit: 24,
    search: search ?? undefined,
  });
  const providers: ProviderProfile[] = providersRes.data ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-6 text-3xl font-bold">Providers</h1>
        <Suspense
          fallback={
            <Skeleton className="h-10 w-full max-w-md rounded-md" />
          }
        >
          <SearchProviders />
        </Suspense>
      </div>

      {providers.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          {search ? "No providers found. Try a different search." : "No providers yet. Check back later."}
        </p>
      )}
    </div>
  );
}
