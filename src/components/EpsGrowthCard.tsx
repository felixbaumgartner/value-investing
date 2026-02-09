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
import type { EpsCagr, EpsHistoryEntry } from "@/types/stock";

interface EpsGrowthCardProps {
  epsCagr: EpsCagr;
  epsHistory: EpsHistoryEntry[];
}

export function EpsGrowthCard({ epsCagr, epsHistory }: EpsGrowthCardProps) {
  const rows = [
    {
      label: "3-Year",
      cagr: epsCagr.threeYear,
      startEps: epsHistory[3]?.epsDiluted,
      endEps: epsHistory[0]?.epsDiluted,
    },
    {
      label: "5-Year",
      cagr: epsCagr.fiveYear,
      startEps: epsHistory[5]?.epsDiluted,
      endEps: epsHistory[0]?.epsDiluted,
    },
    {
      label: "7-Year",
      cagr: epsCagr.sevenYear,
      startEps: epsHistory[7]?.epsDiluted,
      endEps: epsHistory[0]?.epsDiluted,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">EPS Growth (CAGR)</CardTitle>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Compound Annual Growth Rate of Diluted Earnings Per Share over
                3, 5, and 7 year periods.
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
              <TableHead className="text-right">Start EPS</TableHead>
              <TableHead className="text-right">End EPS</TableHead>
              <TableHead className="text-right">CAGR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="font-medium">{row.label}</TableCell>
                <TableCell className="text-right">
                  {row.startEps != null ? formatCurrency(row.startEps) : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  {row.endEps != null ? formatCurrency(row.endEps) : "N/A"}
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
      </CardContent>
    </Card>
  );
}
