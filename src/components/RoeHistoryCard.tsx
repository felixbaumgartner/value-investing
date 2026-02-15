import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";
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
import { formatPercent } from "@/utils/formatters";
import type { RoeHistoryEntry } from "@/types/stock";

interface RoeHistoryCardProps {
  roeHistory: RoeHistoryEntry[];
}

export function RoeHistoryCard({ roeHistory }: RoeHistoryCardProps) {
  const validRoe = roeHistory.filter((e) => e.roe !== null) as Array<{
    year: string;
    roe: number;
  }>;

  const avgRoe =
    validRoe.length > 0
      ? validRoe.reduce((sum, entry) => sum + entry.roe, 0) / validRoe.length
      : null;

  // Determine trend: compare most recent to oldest
  const trend = (() => {
    if (validRoe.length < 2) return "flat" as const;
    const newest = validRoe[0].roe;
    const oldest = validRoe[validRoe.length - 1].roe;
    if (newest > oldest * 1.1) return "up" as const;
    if (newest < oldest * 0.9) return "down" as const;
    return "flat" as const;
  })();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Return on Equity History</CardTitle>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Return on Equity (ROE) measures how much profit a company
                generates per dollar of shareholders' equity. It indicates
                management efficiency in using equity capital.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Year</TableHead>
              <TableHead className="text-right">ROE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roeHistory.map((entry) => (
              <TableRow key={entry.year}>
                <TableCell className="font-medium">{entry.year}</TableCell>
                <TableCell className="text-right">
                  {entry.roe != null ? (
                    <span
                      className={
                        entry.roe >= 0
                          ? "font-medium"
                          : "font-medium text-red-600"
                      }
                    >
                      {formatPercent(entry.roe)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {avgRoe != null && (
          <div className="mt-4 pt-3 border-t flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">
              {validRoe.length}-Year Average:
            </span>
            <span className="font-semibold">{formatPercent(avgRoe)}</span>
            <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              Trend:
              {trend === "up" && (
                <TrendingUp className="h-3.5 w-3.5 text-green-600" />
              )}
              {trend === "down" && (
                <TrendingDown className="h-3.5 w-3.5 text-red-600" />
              )}
              {trend === "flat" && (
                <Minus className="h-3.5 w-3.5" />
              )}
            </span>
          </div>
        )}

        {/* Estimation hints */}
        <div className="mt-4 rounded-lg bg-muted/50 p-3 space-y-1.5">
          <p className="text-xs font-medium text-foreground">
            Hints for estimating future ROE
          </p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>
              ROE above 15% is generally considered strong
            </li>
            <li>
              Companies with durable competitive advantages (strong brands,
              network effects, high switching costs) tend to sustain high ROE
            </li>
            <li>
              Without competitive moats, high ROE tends to revert toward
              10-15% over time as competition increases
            </li>
            <li>
              Very high ROE (&gt;40%) may reflect high leverage rather than
              operational excellence — check the debt-to-equity ratio
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
