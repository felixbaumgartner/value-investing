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
import { formatCurrency, formatPeRatio } from "@/utils/formatters";
import { PE_INPUT } from "@/constants/valuation";
import type { PeHistoryEntry } from "@/types/stock";

interface FuturePriceInputProps {
  futureEps: number;
  peHistory: PeHistoryEntry[];
  currentPe: number | null;
  expectedPe: number | null;
  futurePrice: number | null;
  onPeChange: (pe: number) => void;
  title?: string;
}

export function FuturePriceInput({
  futureEps,
  peHistory,
  currentPe,
  expectedPe,
  futurePrice,
  onPeChange,
  title = "Step 2: Set Your Expected P/E Ratio",
}: FuturePriceInputProps) {
  const clampPe = (value: number) =>
    Math.min(PE_INPUT.max, Math.max(PE_INPUT.min, value));

  const sliderValue = expectedPe !== null ? clampPe(expectedPe) : PE_INPUT.defaultValue;

  const handleSliderChange = (values: number[]) => {
    const nextValue = values[0];
    if (nextValue === undefined) return;
    onPeChange(clampPe(nextValue));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!Number.isNaN(val)) {
      onPeChange(clampPe(val));
    }
  };

  const avgPe =
    peHistory.length > 0
      ? peHistory.reduce((sum, e) => sum + e.peRatio, 0) / peHistory.length
      : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">
            {title}
          </CardTitle>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Set the P/E ratio you expect the stock to trade at in 5 years.
                Use the historical average as a guide.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label className="text-sm text-muted-foreground">
            Expected P/E ratio in Year 5
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            {currentPe != null && currentPe > 0 && (
              <>
                Current P/E: <span className="font-medium text-foreground">{formatPeRatio(currentPe)}</span>
              </>
            )}
            {avgPe != null && (
              <>
                {currentPe != null && currentPe > 0 ? " | " : ""}
                Avg P/E: <span className="font-medium text-foreground">{formatPeRatio(avgPe)}</span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-10 text-right shrink-0">{PE_INPUT.min}x</span>
          <Slider
            min={PE_INPUT.min}
            max={PE_INPUT.max}
            step={PE_INPUT.step}
            value={[sliderValue]}
            onValueChange={handleSliderChange}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-10 shrink-0">{PE_INPUT.max}x</span>
          <div className="flex items-center gap-1 w-24 shrink-0">
            <Input
              type="number"
              value={sliderValue.toFixed(1)}
              onChange={handleInputChange}
              className="h-9 text-right"
              min={PE_INPUT.min}
              max={PE_INPUT.max}
              step={PE_INPUT.step}
            />
            <span className="text-sm font-medium">x</span>
          </div>
        </div>

        {expectedPe !== null && futurePrice !== null && (
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Future EPS (Year 5)</span>
              <span className="font-medium">{formatCurrency(futureEps)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Expected P/E</span>
              <span className="font-medium">{formatPeRatio(expectedPe)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="text-sm font-medium">Price/Share (Year 5)</span>
              <span className="font-bold text-primary">
                {formatCurrency(futurePrice)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(futureEps)} x {formatPeRatio(expectedPe)} ={" "}
              {formatCurrency(futurePrice)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
