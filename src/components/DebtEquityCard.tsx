import { Info, AlertTriangle } from "lucide-react";
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
import type { DebtEquityHistoryEntry } from "@/types/stock";

interface DebtEquityCardProps {
  debtEquityHistory: DebtEquityHistoryEntry[];
}

function formatDeRatio(value: number): string {
  return value.toFixed(2);
}

export function DebtEquityCard({ debtEquityHistory }: DebtEquityCardProps) {
  const validEntries = debtEquityHistory.filter(
    (e) => e.debtToEquity !== null
  ) as Array<{ year: string; debtToEquity: number }>;

  const avgDe =
    validEntries.length > 0
      ? validEntries.reduce((sum, e) => sum + e.debtToEquity, 0) /
        validEntries.length
      : null;

  const highLeverage = avgDe !== null && avgDe > 1.5;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Debt-to-Equity History</CardTitle>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Total Debt to Equity ratio shows how much debt the company uses
                relative to shareholders' equity. High leverage can inflate ROE
                but increases financial risk.
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
              <TableHead className="text-right">D/E Ratio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {debtEquityHistory.map((entry) => (
              <TableRow key={entry.year}>
                <TableCell className="font-medium">{entry.year}</TableCell>
                <TableCell className="text-right">
                  {entry.debtToEquity != null ? (
                    <span
                      className={
                        entry.debtToEquity > 1.5
                          ? "font-medium text-amber-600"
                          : "font-medium"
                      }
                    >
                      {formatDeRatio(entry.debtToEquity)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {avgDe != null && (
          <div className="mt-4 pt-3 border-t flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">
              {validEntries.length}-Year Average:
            </span>
            <span className="font-semibold">{formatDeRatio(avgDe)}</span>
          </div>
        )}

        {highLeverage && (
          <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3 flex gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              High average D/E ratio. The company's ROE may be amplified by
              financial leverage rather than operational excellence. Consider
              whether the debt level is sustainable.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
