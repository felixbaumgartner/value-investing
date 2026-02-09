/**
 * Format a number as USD currency.
 */
export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number as a percentage (e.g., 0.163 -> "16.3%").
 */
export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "N/A";
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Format P/E ratio with "x" suffix (e.g., 30.2 -> "30.2x").
 */
export function formatPeRatio(value: number): string {
  if (!Number.isFinite(value)) return "N/A";
  return `${value.toFixed(1)}x`;
}

/**
 * Format large numbers with abbreviations (e.g., 2.5T, 150B).
 */
export function formatMarketCap(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "N/A";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return formatCurrency(value);
}
