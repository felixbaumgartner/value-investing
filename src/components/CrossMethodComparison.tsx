import { Info, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import type { NpvResult } from "@/types/stock";

interface CrossMethodComparisonProps {
  currentPrice: number;
  earningsNpvResults: NpvResult[];
  bookValueNpvResults: NpvResult[];
}

export function CrossMethodComparison({
  currentPrice,
  earningsNpvResults,
  bookValueNpvResults,
}: CrossMethodComparisonProps) {
  const earningsNpv10 = earningsNpvResults.find(
    (r) => r.discountRate === 0.1
  )?.npv;
  const bookValueNpv10 = bookValueNpvResults.find(
    (r) => r.discountRate === 0.1
  )?.npv;

  if (earningsNpv10 == null || bookValueNpv10 == null) return null;

  const avg = (earningsNpv10 + bookValueNpv10) / 2;
  const divergence =
    avg > 0 ? Math.abs(earningsNpv10 - bookValueNpv10) / avg : 0;
  const converge = divergence < 0.15;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">
            Cross-Method Comparison
          </CardTitle>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Compares fair value estimates from both the Earnings and Book
                Value methods at a 10% discount rate. Convergence increases
                confidence in the estimate.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Earnings Method</p>
            <p className="text-lg font-bold">
              {formatCurrency(earningsNpv10)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Book Value Method</p>
            <p className="text-lg font-bold">
              {formatCurrency(bookValueNpv10)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Price</p>
            <p className="text-lg font-bold">{formatCurrency(currentPrice)}</p>
          </div>
        </div>

        <div
          className={cn(
            "mt-4 rounded-lg border p-3 flex items-center gap-2",
            converge
              ? "bg-green-50 border-green-200"
              : "bg-amber-50 border-amber-200"
          )}
        >
          {converge ? (
            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          )}
          <p
            className={cn(
              "text-xs",
              converge ? "text-green-800" : "text-amber-800"
            )}
          >
            {converge
              ? "Both methods converge on a similar fair value, increasing confidence in the estimate."
              : "The two methods diverge significantly. Investigate which assumptions may be off, or whether the company's earnings and book value tell different stories."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
