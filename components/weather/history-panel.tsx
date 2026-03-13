import { History } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryEntry } from "@/lib/types";

type Props = {
  history: HistoryEntry[];
  unit: "C" | "F";
};

export function HistoryPanel({ history, unit }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Search History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent searches</p>
        ) : (
          history.map((item, index) => (
            <div key={`${item.city}-${index}`} className="rounded-xl bg-secondary p-3 text-sm">
              <p className="font-semibold">{item.city}</p>
              <p className="text-muted-foreground">
                {unit === "F"
                  ? `${Math.round((item.temperature * 9) / 5 + 32)} F`
                  : `${Math.round(item.temperature)} C`} - {item.condition}
              </p>
              <p className="text-xs text-muted-foreground">{new Date(item.searchedAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
