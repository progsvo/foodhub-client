import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Meal } from "@/types";

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const imageUrl = meal.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80";

  return (
    <Link href={`/meals/${meal.id}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={imageUrl}
            alt={meal.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardHeader className="p-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {meal.cuisine && (
              <Badge variant="secondary" className="text-xs">
                {meal.cuisine}
              </Badge>
            )}
            {meal.dietaryPreference && (
              <Badge variant="outline" className="text-xs">
                {meal.dietaryPreference}
              </Badge>
            )}
          </div>
          <CardTitle className="line-clamp-1">{meal.name}</CardTitle>
          {meal.description && (
            <CardDescription className="line-clamp-2">
              {meal.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardFooter className="p-4 pt-0">
          <span className="text-lg font-semibold text-primary">
            ${meal.price.toFixed(2)}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
