/** FMP /stable/quote response item */
export interface FmpQuote {
  symbol: string;
  name: string;
  price: number;
  changePercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  volume: number;
  exchange: string;
}

/** FMP /stable/income-statement response item (partial) */
export interface FmpIncomeStatement {
  date: string;
  symbol: string;
  reportedCurrency: string;
  period: string;
  revenue: number;
  netIncome: number;
  eps: number | null;
  epsdiluted: number | null;
  weightedAverageShsOut: number;
  weightedAverageShsOutDil: number;
}

/** FMP /stable/key-metrics response item (partial) */
export interface FmpKeyMetrics {
  date: string;
  symbol: string;
  period: string;
  earningsYield: number;
}

// --- App-level types ---

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

export type AppStatus = "idle" | "loading" | "loaded" | "error";
