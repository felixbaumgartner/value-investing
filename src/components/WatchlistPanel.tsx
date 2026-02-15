import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, Trash2, Star } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { getVerdict, verdictConfig } from "@/utils/calculations";
import { cn } from "@/lib/utils";
import type { WatchlistItem } from "@/types/stock";

interface WatchlistPanelProps {
  items: WatchlistItem[];
  onLoad: (item: WatchlistItem) => void;
  onRemove: (ticker: string) => void;
}

function VerdictBadge({ price, npv }: { price: number; npv: number | null }) {
  if (npv === null) return <span className="text-muted-foreground">--</span>;
  const verdict = getVerdict(price, npv);
  const config = verdictConfig[verdict];
  return (
    <Badge variant="outline" className={cn("text-xs", config.className)}>
      {config.label.replace("Potentially ", "")}
    </Badge>
  );
}

export function WatchlistPanel({ items, onLoad, onRemove }: WatchlistPanelProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6 text-muted-foreground">
            <Star className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>No stocks saved yet.</p>
            <p className="text-sm">Analyze a stock and click the star to save it.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const bestNpv = (item: WatchlistItem) =>
    item.results.npvAt10Earnings ?? item.results.npvAt10BookValue;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Watchlist</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">NPV (Earnings)</TableHead>
                <TableHead className="text-right">NPV (Book Value)</TableHead>
                <TableHead className="text-center">Verdict</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.ticker}>
                  <TableCell>
                    <span className="font-semibold">{item.ticker}</span>
                    <span className="ml-2 text-sm text-muted-foreground">{item.name}</span>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(item.priceAtSave)}</TableCell>
                  <TableCell className="text-right">
                    {item.results.npvAt10Earnings !== null
                      ? formatCurrency(item.results.npvAt10Earnings)
                      : "--"}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.results.npvAt10BookValue !== null
                      ? formatCurrency(item.results.npvAt10BookValue)
                      : "--"}
                  </TableCell>
                  <TableCell className="text-center">
                    <VerdictBadge price={item.priceAtSave} npv={bestNpv(item)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" onClick={() => onLoad(item)}>
                        <ArrowRight className="h-3.5 w-3.5 mr-1" />
                        Load
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => onRemove(item.ticker)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {items.map((item) => (
            <div
              key={item.ticker}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{item.ticker}</span>
                  <VerdictBadge price={item.priceAtSave} npv={bestNpv(item)} />
                </div>
                <p className="text-sm text-muted-foreground">{formatCurrency(item.priceAtSave)}</p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => onLoad(item)}>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => onRemove(item.ticker)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
