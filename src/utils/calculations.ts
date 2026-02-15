import type { NpvResult } from "@/types/stock";
import { DISCOUNT_RATES, PROJECTION_YEARS } from "@/constants/valuation";

/**
 * Compute CAGR (Compound Annual Growth Rate).
 * Returns null if either value is <= 0 (can't compute meaningful CAGR).
 */
export function computeCagr(
  beginValue: number,
  endValue: number,
  years: number
): number | null {
  if (years <= 0 || beginValue <= 0 || endValue <= 0) return null;
  return Math.pow(endValue / beginValue, 1 / years) - 1;
}

/**
 * Given an array of EPS values sorted most-recent-first,
 * compute CAGR for 3, 5, and 7 year periods.
 *
 * epsValues[0] = most recent year
 * epsValues[3] = 3 years ago  -> 3-year CAGR
 * epsValues[5] = 5 years ago  -> 5-year CAGR
 * epsValues[7] = 7 years ago  -> 7-year CAGR
 */
export function computeEpsCagrs(epsValues: Array<number | null>): {
  threeYear: number | null;
  fiveYear: number | null;
  sevenYear: number | null;
} {
  const current = epsValues[0];

  const computePeriodCagr = (years: 3 | 5 | 7): number | null => {
    const startingEps = epsValues[years];
    if (current === null || startingEps === null) return null;
    return computeCagr(startingEps, current, years);
  };

  return {
    threeYear: epsValues.length > 3 ? computePeriodCagr(3) : null,
    fiveYear: epsValues.length > 5 ? computePeriodCagr(5) : null,
    sevenYear: epsValues.length > 7 ? computePeriodCagr(7) : null,
  };
}

/**
 * Future EPS = Current EPS * (1 + expectedCagr)^5
 */
export function computeFutureEps(
  currentEps: number,
  expectedCagr: number
): number {
  return currentEps * Math.pow(1 + expectedCagr, PROJECTION_YEARS);
}

/**
 * Future Price = Future EPS * Expected P/E
 */
export function computeFuturePrice(
  futureEps: number,
  expectedPe: number
): number {
  return futureEps * expectedPe;
}

/**
 * NPV = Future Price / (1 + discount_rate)^5
 */
export function computeNpv(
  futurePrice: number,
  discountRate: number
): number {
  return futurePrice / Math.pow(1 + discountRate, PROJECTION_YEARS);
}

/**
 * Compute NPV at all standard discount rates.
 */
export function computeAllNpvs(futurePrice: number): NpvResult[] {
  return DISCOUNT_RATES.map((rate) => ({
    discountRate: rate,
    discountRateLabel: `${(rate * 100).toFixed(0)}%`,
    npv: computeNpv(futurePrice, rate),
  }));
}

// ── Book Value Valuation helpers ────────────────────────────────────

/**
 * Given an array of BVPS values sorted most-recent-first,
 * compute CAGR for 3, 5, and 7 year periods.
 */
export function computeBvpsCagrs(bvpsValues: Array<number | null>): {
  threeYear: number | null;
  fiveYear: number | null;
  sevenYear: number | null;
} {
  const current = bvpsValues[0];

  const computePeriodCagr = (years: 3 | 5 | 7): number | null => {
    const startingBvps = bvpsValues[years];
    if (current === null || startingBvps === null) return null;
    return computeCagr(startingBvps, current, years);
  };

  return {
    threeYear: bvpsValues.length > 3 ? computePeriodCagr(3) : null,
    fiveYear: bvpsValues.length > 5 ? computePeriodCagr(5) : null,
    sevenYear: bvpsValues.length > 7 ? computePeriodCagr(7) : null,
  };
}

/**
 * Future BVPS = Current BVPS * (1 + expectedCagr)^5
 */
export function computeFutureBvps(
  currentBvps: number,
  expectedCagr: number
): number {
  return currentBvps * Math.pow(1 + expectedCagr, PROJECTION_YEARS);
}

/**
 * Future EPS (from book value) = Future BVPS * Expected ROE
 */
export function computeFutureEpsFromBv(
  futureBvps: number,
  expectedRoe: number
): number {
  return futureBvps * expectedRoe;
}

/**
 * Implied annual return if you buy at currentPrice and sell at futurePrice in 5 years.
 */
export function computeImpliedAnnualReturn(
  futurePrice: number,
  currentPrice: number
): number {
  if (currentPrice <= 0) return 0;
  return Math.pow(futurePrice / currentPrice, 1 / PROJECTION_YEARS) - 1;
}

// ── Verdict helpers (shared by ValuationSummary & WatchlistPanel) ───

export type Verdict = "undervalued" | "fairly-valued" | "overvalued";

export function getVerdict(currentPrice: number, npvAt10: number): Verdict {
  if (npvAt10 > currentPrice * 1.15) return "undervalued";
  if (npvAt10 < currentPrice * 0.85) return "overvalued";
  return "fairly-valued";
}

export const verdictConfig: Record<
  Verdict,
  { label: string; className: string; description: string }
> = {
  undervalued: {
    label: "Potentially Undervalued",
    className: "bg-green-100 text-green-800 border-green-200",
    description:
      "Based on your inputs, the stock appears to be trading below its estimated fair value at a 10% discount rate.",
  },
  "fairly-valued": {
    label: "Fairly Valued",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    description:
      "Based on your inputs, the stock appears to be trading near its estimated fair value at a 10% discount rate.",
  },
  overvalued: {
    label: "Potentially Overvalued",
    className: "bg-red-100 text-red-800 border-red-200",
    description:
      "Based on your inputs, the stock appears to be trading above its estimated fair value at a 10% discount rate.",
  },
};
