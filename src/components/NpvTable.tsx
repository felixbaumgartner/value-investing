import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { formatCurrency, formatPercent } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import type { NpvResult } from "@/types/stock";

interface NpvTableProps {
  futurePrice: number;
  currentPrice: number;
  npvResults: NpvResult[];
}

export function NpvTable({ futurePrice, currentPrice, npvResults }: NpvTableProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">
            Net Present Value Analysis
          </CardTitle>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                NPV discounts the future stock price back to today's value.
                Higher discount rates reflect higher required returns. Compare
                NPV to the current price to assess value.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-sm text-muted-foreground">
          Future Price (Year 5): <span className="font-semibold text-foreground">{formatCurrency(futurePrice)}</span>
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Discount Rate</TableHead>
              <TableHead className="text-right">NPV (Fair Value Today)</TableHead>
              <TableHead className="text-right">vs Current Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {npvResults.map((result) => {
              const hasCurrentPrice = currentPrice > 0;
              const diff = hasCurrentPrice ? (result.npv - currentPrice) / currentPrice : null;
              const isUpside = diff !== null && diff >= 0;
              const isBenchmark = result.discountRate === 0.1;

              return (
                <TableRow
                  key={result.discountRate}
                  className={cn(
                    isBenchmark && "bg-primary/5 font-medium"
                  )}
                >
                  <TableCell className="font-medium">
                    {result.discountRateLabel}
                    {isBenchmark && (
                      <span className="ml-2 text-xs text-muted-foreground">(benchmark)</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(result.npv)}
                  </TableCell>
                  <TableCell className="text-right">
                    {diff === null ? (
                      <span className="text-muted-foreground">N/A</span>
                    ) : (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 font-semibold",
                          isUpside ? "text-green-600" : "text-red-600"
                        )}
                      >
                        {isUpside ? (
                          <TrendingUp className="h-3.5 w-3.5" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5" />
                        )}
                        {formatPercent(Math.abs(diff))} {isUpside ? "upside" : "downside"}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <p className="mt-3 text-xs text-muted-foreground">
          Current Price: {formatCurrency(currentPrice)}
        </p>
      </CardContent>
    </Card>
  );
}
