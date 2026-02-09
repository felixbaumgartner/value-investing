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
