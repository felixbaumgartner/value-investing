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
import { BVPS_CAGR_INPUT } from "@/constants/valuation";
import type { EpsCagr } from "@/types/stock";

interface FutureBvpsInputProps {
  currentBvps: number;
  bvpsCagr: EpsCagr;
  expectedBvpsCagr: number | null;
  futureBvps: number | null;
  onCagrChange: (cagr: number) => void;
}

export function FutureBvpsInput({
  currentBvps,
  bvpsCagr,
  expectedBvpsCagr,
  futureBvps,
  onCagrChange,
}: FutureBvpsInputProps) {
  const clampPercent = (value: number) =>
    Math.min(BVPS_CAGR_INPUT.max, Math.max(BVPS_CAGR_INPUT.min, value));

  const sliderValue =
    expectedBvpsCagr !== null ? clampPercent(expectedBvpsCagr * 100) : 0;

  const handleSliderChange = (values: number[]) => {
    const nextValue = values[0];
    if (nextValue === undefined) return;
    onCagrChange(clampPercent(nextValue) / 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!Number.isNaN(val)) {
      onCagrChange(clampPercent(val) / 100);
    }
  };

  const hintCagr =
    bvpsCagr.threeYear ?? bvpsCagr.fiveYear ?? bvpsCagr.sevenYear;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">
            Step 1: Set Your Expected BVPS Growth
          </CardTitle>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Based on the historical CAGR above, set what you believe the
                Book Value Per Share growth rate will be over the next 5 years.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label className="text-sm text-muted-foreground">
            Expected BVPS CAGR for next 5 years
          </Label>
          {hintCagr !== null && (
            <p className="text-xs text-muted-foreground mt-1">
              Hint: Historical 3-yr CAGR was{" "}
              <span className="font-medium text-foreground">
                {formatPercent(hintCagr)}
              </span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-10 text-right shrink-0">{BVPS_CAGR_INPUT.min}%</span>
          <Slider
            min={BVPS_CAGR_INPUT.min}
            max={BVPS_CAGR_INPUT.max}
            step={BVPS_CAGR_INPUT.step}
            value={[sliderValue]}
            onValueChange={handleSliderChange}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-10 shrink-0">{BVPS_CAGR_INPUT.max}%</span>
          <div className="flex items-center gap-1 w-24 shrink-0">
            <Input
              type="number"
              value={sliderValue.toFixed(1)}
              onChange={handleInputChange}
              className="h-9 text-right"
              min={BVPS_CAGR_INPUT.min}
              max={BVPS_CAGR_INPUT.max}
              step={BVPS_CAGR_INPUT.step}
            />
            <span className="text-sm font-medium">%</span>
          </div>
        </div>

        {expectedBvpsCagr !== null && futureBvps !== null && (
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current BVPS</span>
              <span className="font-medium">{formatCurrency(currentBvps)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Expected CAGR</span>
              <span className="font-medium">
                {formatPercent(expectedBvpsCagr)}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="text-sm font-medium">BVPS (Year 5)</span>
              <span className="font-bold text-primary">
                {formatCurrency(futureBvps)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(currentBvps)} x (1 +{" "}
              {formatPercent(expectedBvpsCagr)})
              <sup>5</sup> = {formatCurrency(futureBvps)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
