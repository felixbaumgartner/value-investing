import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { formatCurrency, formatPeRatio, formatPercent, formatMarketCap } from "@/utils/formatters";
import type { QuoteData } from "@/types/stock";

interface StockOverviewProps {
  quote: QuoteData;
  currentBvps: number | null;
  currentRoe: number | null;
  isInWatchlist?: boolean;
  onSaveToWatchlist?: () => void;
}

export function StockOverview({ quote, currentBvps, currentRoe, isInWatchlist, onSaveToWatchlist }: StockOverviewProps) {
  const hasEps = quote.eps !== null && Number.isFinite(quote.eps);
  const hasPositivePe =
    quote.pe !== null && Number.isFinite(quote.pe) && quote.pe > 0;
  const hasBvps = currentBvps !== null && Number.isFinite(currentBvps);
  const hasRoe = currentRoe !== null && Number.isFinite(currentRoe);
  const currentPb =
    hasBvps && currentBvps > 0 ? quote.price / currentBvps : null;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{quote.symbol}</h2>
              <Badge variant="secondary">{quote.exchange}</Badge>
            </div>
            <p className="text-muted-foreground">{quote.name}</p>
          </div>
          <div className="text-right flex items-start gap-2">
            <div>
              <p className="text-2xl font-bold">{formatCurrency(quote.price)}</p>
              <p className="text-sm text-muted-foreground">
                Mkt Cap: {formatMarketCap(quote.marketCap)}
              </p>
            </div>
            {onSaveToWatchlist && (
              <Button
                size="sm"
                variant={isInWatchlist ? "default" : "outline"}
                onClick={onSaveToWatchlist}
                className="shrink-0"
              >
                <Star
                  className="h-4 w-4 mr-1"
                  fill={isInWatchlist ? "currentColor" : "none"}
                />
                {isInWatchlist ? "Update" : "Save"}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Current EPS (TTM)</p>
            <p className="text-lg font-semibold">
              {hasEps && quote.eps !== null ? formatCurrency(quote.eps) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current P/E (TTM)</p>
            <p className="text-lg font-semibold">
              {hasPositivePe && quote.pe !== null ? formatPeRatio(quote.pe) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Book Value / Share</p>
            <p className="text-lg font-semibold">
              {hasBvps ? formatCurrency(currentBvps) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Return on Equity</p>
            <p className="text-lg font-semibold">
              {hasRoe ? formatPercent(currentRoe) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Price / Book</p>
            <p className="text-lg font-semibold">
              {currentPb != null ? `${currentPb.toFixed(2)}x` : "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
