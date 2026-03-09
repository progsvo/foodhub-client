import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProviderProfile } from "@/types";

interface ProviderCardProps {
  provider: ProviderProfile;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const imageUrl =
    provider.image ||
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80";

  return (
    <Link href={`/providers/${provider.id}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={imageUrl}
            alt={provider.businessName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardHeader className="p-4">
          <CardTitle className="line-clamp-1">{provider.businessName}</CardTitle>
          {provider.description && (
            <CardDescription className="line-clamp-2">
              {provider.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {provider.address && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {provider.address}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
