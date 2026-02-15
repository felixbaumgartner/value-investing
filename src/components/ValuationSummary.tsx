import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/utils/formatters";
import { computeImpliedAnnualReturn, getVerdict, verdictConfig } from "@/utils/calculations";
import { cn } from "@/lib/utils";
import type { NpvResult } from "@/types/stock";

interface ValuationSummaryProps {
  currentPrice: number;
  futurePrice: number;
  npvResults: NpvResult[];
}

export function ValuationSummary({
  currentPrice,
  futurePrice,
  npvResults,
}: ValuationSummaryProps) {
  const npvAt10 = npvResults.find((r) => r.discountRate === 0.1);
  if (!npvAt10) return null;

  const verdict = getVerdict(currentPrice, npvAt10.npv);
  const config = verdictConfig[verdict];

  const minNpv = Math.min(...npvResults.map((r) => r.npv));
  const maxNpv = Math.max(...npvResults.map((r) => r.npv));

  const impliedReturn = computeImpliedAnnualReturn(futurePrice, currentPrice);

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="text-center space-y-3">
          <Badge
            variant="outline"
            className={cn("text-sm px-4 py-1.5", config.className)}
          >
            {config.label}
          </Badge>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div>
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-lg font-bold">{formatCurrency(currentPrice)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">NPV at 10%</p>
              <p className="text-lg font-bold text-primary">
                {formatCurrency(npvAt10.npv)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">NPV Range</p>
              <p className="text-lg font-bold">
                {formatCurrency(minNpv)} - {formatCurrency(maxNpv)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Implied Annual Return</p>
              <p
                className={cn(
                  "text-lg font-bold",
                  impliedReturn >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {formatPercent(impliedReturn)}
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          {config.description}
        </p>

        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
          <p className="text-xs text-yellow-800">
            This is not financial advice. This calculator provides estimates based
            on your inputs and assumptions. Always do your own research and
            consult a financial advisor before making investment decisions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
