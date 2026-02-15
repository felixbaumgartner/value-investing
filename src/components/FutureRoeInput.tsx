import { Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { formatCurrency, formatPercent } from "@/utils/formatters";
import { ROE_INPUT } from "@/constants/valuation";
import type { RoeHistoryEntry } from "@/types/stock";

interface FutureRoeInputProps {
  futureBvps: number;
  roeHistory: RoeHistoryEntry[];
  expectedRoe: number | null;
  futureEpsFromBv: number | null;
  onRoeChange: (roe: number) => void;
}

export function FutureRoeInput({
  futureBvps,
  roeHistory,
  expectedRoe,
  futureEpsFromBv,
  onRoeChange,
}: FutureRoeInputProps) {
  const clampRoe = (value: number) =>
    Math.min(ROE_INPUT.max, Math.max(ROE_INPUT.min, value));

  // expectedRoe is stored as decimal (e.g. 0.15 = 15%), slider works in percentage
  const sliderValue =
    expectedRoe !== null ? clampRoe(expectedRoe * 100) : 15;

  const handleSliderChange = (values: number[]) => {
    const nextValue = values[0];
    if (nextValue === undefined) return;
    onRoeChange(clampRoe(nextValue) / 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!Number.isNaN(val)) {
      onRoeChange(clampRoe(val) / 100);
    }
  };

  const validRoe = roeHistory.filter((e) => e.roe !== null) as Array<{
    year: string;
    roe: number;
  }>;
  const avgRoe =
    validRoe.length > 0
      ? validRoe.reduce((sum, e) => sum + e.roe, 0) / validRoe.length
      : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">
            Step 2: Set Your Expected ROE in Year 5
          </CardTitle>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Set the Return on Equity you expect the company to achieve in
                Year 5. This determines the projected EPS from book value.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label className="text-sm text-muted-foreground">
            Expected ROE in Year 5
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            {avgRoe !== null && (
              <>
                Avg ROE:{" "}
                <span className="font-medium text-foreground">
                  {formatPercent(avgRoe)}
                </span>
              </>
            )}
            {validRoe.length > 0 && (
              <>
                {avgRoe !== null ? " | " : ""}
                Most recent:{" "}
                <span className="font-medium text-foreground">
                  {formatPercent(validRoe[0].roe)}
                </span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Slider
            min={ROE_INPUT.min}
            max={ROE_INPUT.max}
            step={ROE_INPUT.step}
            value={[sliderValue]}
            onValueChange={handleSliderChange}
            className="flex-1"
          />
          <div className="flex items-center gap-1 w-24">
            <Input
              type="number"
              value={sliderValue.toFixed(1)}
              onChange={handleInputChange}
              className="h-9 text-right"
              min={ROE_INPUT.min}
              max={ROE_INPUT.max}
              step={ROE_INPUT.step}
            />
            <span className="text-sm font-medium">%</span>
          </div>
        </div>

        {expectedRoe !== null && futureEpsFromBv !== null && (
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">BVPS (Year 5)</span>
              <span className="font-medium">{formatCurrency(futureBvps)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Expected ROE</span>
              <span className="font-medium">{formatPercent(expectedRoe)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="text-sm font-medium">EPS (Year 5)</span>
              <span className="font-bold text-primary">
                {formatCurrency(futureEpsFromBv)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(futureBvps)} x {formatPercent(expectedRoe)} ={" "}
              {formatCurrency(futureEpsFromBv)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
