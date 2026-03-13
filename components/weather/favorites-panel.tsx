import { Heart, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  favorites: string[];
  onSelect: (city: string) => Promise<void>;
  onRemove: (city: string) => Promise<void>;
};

export function FavoritesPanel({ favorites, onSelect, onRemove }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-accent" />
          Favorite Cities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {favorites.length === 0 ? (
          <p className="text-sm text-muted-foreground">No favorites yet</p>
        ) : (
          favorites.map((city) => (
            <div key={city} className="flex items-center justify-between rounded-xl bg-secondary p-2">
              <button
                type="button"
                className="text-sm font-medium hover:underline"
                onClick={() => onSelect(city)}
              >
                {city}
              </button>
              <Button variant="ghost" size="sm" onClick={() => onRemove(city)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
