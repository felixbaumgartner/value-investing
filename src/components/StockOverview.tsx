import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPeRatio, formatMarketCap } from "@/utils/formatters";
import type { QuoteData } from "@/types/stock";

interface StockOverviewProps {
  quote: QuoteData;
}

export function StockOverview({ quote }: StockOverviewProps) {
  const hasEps = quote.eps !== null && Number.isFinite(quote.eps);
  const hasPositivePe =
    quote.pe !== null && Number.isFinite(quote.pe) && quote.pe > 0;

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
          <div className="text-right">
            <p className="text-2xl font-bold">{formatCurrency(quote.price)}</p>
            <p className="text-sm text-muted-foreground">
              Mkt Cap: {formatMarketCap(quote.marketCap)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
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
        </div>
      </CardContent>
    </Card>
  );
}
