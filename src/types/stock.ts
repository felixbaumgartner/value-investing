// --- Finnhub API types ---

/** Finnhub /quote response */
export interface FinnhubQuote {
  c: number;   // current price
  d: number;   // change
  dp: number;  // percent change
  h: number;   // high
  l: number;   // low
  o: number;   // open
  pc: number;  // previous close
  t: number;   // timestamp
}

/** Finnhub /stock/profile2 response */
export interface FinnhubProfile {
  country: string;
  currency: string;
  exchange: string;
  finnhubIndustry: string;
  ipo: string;
  logo: string;
  marketCapitalization: number; // in millions
  name: string;
  ticker: string;
  shareOutstanding: number;
  weburl: string;
}

/** A single line-item inside a Finnhub SEC filing report section */
export interface FinnhubReportItem {
  concept: string;
  label: string;
  value: number;
  unit: string;
}

/** A single annual 10-K filing from Finnhub */
export interface FinnhubFiling {
  accessNumber: string;
  symbol: string;
  cik: string;
  year: number;
  quarter: number;
  form: string;
  startDate: string;
  endDate: string;
  filedDate: string;
  report: {
    bs: FinnhubReportItem[];
    ic: FinnhubReportItem[];
    cf: FinnhubReportItem[];
  };
}

/** Finnhub /stock/financials-reported response */
export interface FinnhubFinancialsReported {
  cik: string;
  data: FinnhubFiling[];
  symbol: string;
}

/** Finnhub /stock/metric response */
export interface FinnhubMetrics {
  metric: Record<string, number>;
  metricType: string;
  series: {
    annual: Record<string, Array<{ period: string; v: number }>>;
    quarterly: Record<string, Array<{ period: string; v: number }>>;
  };
}

// --- Finnhub search types ---

/** Finnhub /search result item */
export interface FinnhubSearchResult {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

/** Finnhub /search response */
export interface FinnhubSearchResponse {
  count: number;
  result: FinnhubSearchResult[];
}

// --- Bing / MSN types ---

/** Bing autosuggest stock result */
export interface BingStockSuggestion {
  RT00S: string;    // ticker
  OS01W: string;    // full company name
  AC040: string;    // exchange
  SecId: string;    // MSN instrument ID
}

/** MSN Quotes API response item */
export interface MsnQuote {
  price: number;
  peRatio: number | null;
  marketCap: number | null;
  displayName: string;
  symbol: string;
  exchangeName: string;
}

// --- App-level types ---

/** A stock suggestion for the search dropdown */
export interface StockSuggestion {
  ticker: string;
  name: string;
  type: string;
}

// --- App-level types (unchanged) ---

export interface QuoteData {
  symbol: string;
  name: string;
  price: number;
  eps: number | null;
  pe: number | null;
  marketCap: number | null;
  exchange: string;
}

export interface EpsHistoryEntry {
  year: string;
  eps: number | null;
  epsDiluted: number | null;
}

export interface PeHistoryEntry {
  year: string;
  peRatio: number;
}

export interface EpsCagr {
  threeYear: number | null;
  fiveYear: number | null;
  sevenYear: number | null;
}

export interface NpvResult {
  discountRate: number;
  discountRateLabel: string;
  npv: number;
}

export interface BvpsHistoryEntry {
  year: string;
  bvps: number | null;
}

export interface RoeHistoryEntry {
  year: string;
  roe: number | null; // as decimal, e.g. 0.15 = 15%
}

export type AppStatus = "idle" | "loading" | "loaded" | "error";
