import { Info } from "lucide-react";
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
import { formatPeRatio } from "@/utils/formatters";
import type { PeHistoryEntry } from "@/types/stock";

interface PeRatioCardProps {
  currentPe: number | null;
  peHistory: PeHistoryEntry[];
}

export function PeRatioCard({ currentPe, peHistory }: PeRatioCardProps) {
  const avgPe =
    peHistory.length > 0
      ? peHistory.reduce((sum, entry) => sum + entry.peRatio, 0) / peHistory.length
      : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">P/E Ratio History</CardTitle>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Price-to-Earnings ratio shows how much investors pay per dollar
                of earnings. Lower P/E may indicate undervaluation.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        {currentPe != null && currentPe > 0 && (
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">Current P/E:</span>
            <span className="text-lg font-bold">{formatPeRatio(currentPe)}</span>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Year</TableHead>
              <TableHead className="text-right">P/E Ratio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {peHistory.map((entry) => (
              <TableRow key={entry.year}>
                <TableCell className="font-medium">{entry.year}</TableCell>
                <TableCell className="text-right">
                  {formatPeRatio(entry.peRatio)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {avgPe != null && (
          <div className="mt-4 pt-3 border-t flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">
              {peHistory.length}-Year Average:
            </span>
            <span className="font-semibold">{formatPeRatio(avgPe)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
