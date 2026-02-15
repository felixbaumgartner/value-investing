import { ApiError, finnhubFetch } from "./client";
import type {
  FinnhubQuote,
  FinnhubProfile,
  FinnhubMetrics,
  FinnhubSearchResponse,
  StockSuggestion,
  BingStockSuggestion,
  MsnQuote,
} from "@/types/stock";

// ── Finnhub endpoints ──────────────────────────────────────────────

export async function fetchQuote(ticker: string): Promise<FinnhubQuote> {
  const data = await finnhubFetch<FinnhubQuote>("/quote", {
    symbol: ticker.toUpperCase(),
  });
  if (!data || data.c === 0) {
    throw new ApiError("No quote data found for this ticker symbol", 404, "/quote");
  }
  return data;
}

export async function fetchProfile(ticker: string): Promise<FinnhubProfile> {
  const data = await finnhubFetch<FinnhubProfile>("/stock/profile2", {
    symbol: ticker.toUpperCase(),
  });
  if (!data || !data.ticker) {
    throw new ApiError("No profile data found for this ticker symbol", 404, "/stock/profile2");
  }
  return data;
}

export async function fetchBasicFinancials(
  ticker: string
): Promise<FinnhubMetrics> {
  return finnhubFetch<FinnhubMetrics>("/stock/metric", {
    symbol: ticker.toUpperCase(),
    metric: "all",
  });
}

export async function searchStocks(query: string): Promise<StockSuggestion[]> {
  const data = await finnhubFetch<FinnhubSearchResponse>("/search", {
    q: query,
  });
  if (!data?.result) return [];
  return data.result
    .filter((r) => r.type === "Common Stock" && !r.symbol.includes("."))
    .slice(0, 6)
    .map((r) => ({
      ticker: r.displaySymbol,
      name: r.description,
      type: r.type,
    }));
}

// ── MSN / Bing endpoints (for correct current P/E) ────────────────

const BING_SUGGEST_URL =
  "https://services.bingapis.com/contentservices-finance.csautosuggest/api/v1/Query";
const MSN_QUOTES_URL = "https://assets.msn.com/service/Finance/Quotes";
const MSN_API_KEY = "0QfOX3Vn51YCzitbLaRkTTBadtWpgTN8NZLW0C1SEM";

/** Resolve a ticker to an MSN SecId via Bing autosuggest */
async function resolveSecId(ticker: string): Promise<string | null> {
  try {
    const url = new URL(BING_SUGGEST_URL);
    url.searchParams.set("query", ticker.toUpperCase());
    url.searchParams.set("market", "en-us");
    url.searchParams.set("count", "1");

    const res = await fetch(url.toString());
    if (!res.ok) return null;

    const json = await res.json();
    const stocks: BingStockSuggestion[] = json?.data?.stocks ?? [];
    if (stocks.length === 0) return null;

    const match = stocks.find(
      (s) => s.RT00S.toUpperCase() === ticker.toUpperCase()
    );
    return match?.SecId ?? stocks[0].SecId ?? null;
  } catch {
    return null;
  }
}

/** Fetch the current P/E from MSN Quotes API using a SecId */
export async function fetchMsnPeRatio(ticker: string): Promise<number | null> {
  try {
    const secId = await resolveSecId(ticker);
    if (!secId) return null;

    const url = new URL(MSN_QUOTES_URL);
    url.searchParams.set("apikey", MSN_API_KEY);
    url.searchParams.set("activityId", "s1");
    url.searchParams.set("ocid", "finance-utils-peregrine");
    url.searchParams.set("cm", "en-us");
    url.searchParams.set("it", "web");
    url.searchParams.set("ids", secId);
    url.searchParams.set("wrapodata", "false");

    const res = await fetch(url.toString());
    if (!res.ok) return null;

    const json: MsnQuote[] = await res.json();
    if (!Array.isArray(json) || json.length === 0) return null;

    const pe = json[0].peRatio;
    return typeof pe === "number" && Number.isFinite(pe) && pe > 0 ? pe : null;
  } catch {
    return null;
  }
}
