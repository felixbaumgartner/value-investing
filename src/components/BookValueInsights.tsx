import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";

interface BookValueInsightsProps {
  currentPrice: number;
  currentBvps: number;
  futureBvps: number;
  futurePriceFromBv: number;
}

function formatPbRatio(value: number): string {
  if (!Number.isFinite(value)) return "N/A";
  return `${value.toFixed(2)}x`;
}

export function BookValueInsights({
  currentPrice,
  currentBvps,
  futureBvps,
  futurePriceFromBv,
}: BookValueInsightsProps) {
  const currentPb = currentBvps > 0 ? currentPrice / currentBvps : null;
  const impliedPb = futureBvps > 0 ? futurePriceFromBv / futureBvps : null;

  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm font-medium mb-3">Price-to-Book Insight</p>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Current P/B</p>
            <p className="text-lg font-bold">
              {currentPb != null ? formatPbRatio(currentPb) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Implied P/B (Year 5)</p>
            <p className="text-lg font-bold">
              {impliedPb != null ? formatPbRatio(impliedPb) : "N/A"}
            </p>
          </div>
        </div>
        {currentPb != null && impliedPb != null && (
          <p className="text-xs text-muted-foreground mt-3 text-center">
            {impliedPb > currentPb * 1.5
              ? "Your assumptions imply a much higher P/B in Year 5 than today — verify that the expected P/E and ROE are realistic."
              : impliedPb < currentPb * 0.5
                ? "Your assumptions imply a much lower P/B in Year 5 than today — the stock may currently be priced for higher growth."
                : "The implied P/B in Year 5 is reasonably consistent with the current P/B ratio."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
