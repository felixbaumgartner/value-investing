import { ApiError, fmpFetch } from "./client";
import type { FmpQuote, FmpIncomeStatement, FmpKeyMetrics } from "@/types/stock";

export async function fetchQuote(ticker: string): Promise<FmpQuote> {
  const endpoint = `/quote`;
  const data = await fmpFetch<FmpQuote[]>(endpoint, {
    symbol: ticker.toUpperCase(),
  });
  const firstQuote = data[0];

  if (!firstQuote) {
    throw new ApiError("No quote data found for this ticker symbol", 404, endpoint);
  }

  return firstQuote;
}

export async function fetchIncomeStatements(
  ticker: string,
  limit: number = 5
): Promise<FmpIncomeStatement[]> {
  const safeLimit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, 5) : 5;
  return fmpFetch<FmpIncomeStatement[]>(`/income-statement`, {
    symbol: ticker.toUpperCase(),
    period: "annual",
    limit: String(safeLimit),
  });
}

export async function fetchKeyMetrics(
  ticker: string,
  limit: number = 4
): Promise<FmpKeyMetrics[]> {
  const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 4;
  return fmpFetch<FmpKeyMetrics[]>(`/key-metrics`, {
    symbol: ticker.toUpperCase(),
    period: "annual",
    limit: String(safeLimit),
  });
}
