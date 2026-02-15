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
import { formatCurrency, formatPercent } from "@/utils/formatters";
import type { EpsCagr, BvpsHistoryEntry } from "@/types/stock";

interface BvpsGrowthCardProps {
  bvpsCagr: EpsCagr;
  bvpsHistory: BvpsHistoryEntry[];
}

export function BvpsGrowthCard({ bvpsCagr, bvpsHistory }: BvpsGrowthCardProps) {
  const rows = [
    {
      label: "3-Year",
      cagr: bvpsCagr.threeYear,
      startBvps: bvpsHistory[3]?.bvps,
      endBvps: bvpsHistory[0]?.bvps,
    },
    {
      label: "5-Year",
      cagr: bvpsCagr.fiveYear,
      startBvps: bvpsHistory[5]?.bvps,
      endBvps: bvpsHistory[0]?.bvps,
    },
    {
      label: "7-Year",
      cagr: bvpsCagr.sevenYear,
      startBvps: bvpsHistory[7]?.bvps,
      endBvps: bvpsHistory[0]?.bvps,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">BVPS Growth (CAGR)</CardTitle>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Compound Annual Growth Rate of Book Value of Equity Per Share
                over 3, 5, and 7 year periods.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Start BVPS</TableHead>
              <TableHead className="text-right">End BVPS</TableHead>
              <TableHead className="text-right">CAGR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="font-medium">{row.label}</TableCell>
                <TableCell className="text-right">
                  {row.startBvps != null ? formatCurrency(row.startBvps) : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  {row.endBvps != null ? formatCurrency(row.endBvps) : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  {row.cagr != null ? (
                    <span
                      className={
                        row.cagr >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
                      }
                    >
                      {formatPercent(row.cagr)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {bvpsHistory.length > 0 && (
          <div className="mt-4 pt-3 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Annual BVPS
            </p>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {bvpsHistory.map((entry) => (
                <div key={entry.year} className="text-center">
                  <div className="text-muted-foreground">{entry.year}</div>
                  <div className="font-medium">
                    {entry.bvps != null ? formatCurrency(entry.bvps) : "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
