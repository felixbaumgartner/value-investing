import { useState, useCallback, useMemo, useRef } from "react";
import {
  fetchQuote,
  fetchProfile,
  fetchBasicFinancials,
  fetchMsnPeRatio,
} from "@/api/stockApi";
import { computeEpsCagrs, computeFutureEps, computeFuturePrice, computeAllNpvs } from "@/utils/calculations";
import type {
  AppStatus,
  QuoteData,
  EpsHistoryEntry,
  PeHistoryEntry,
  EpsCagr,
  NpvResult,
} from "@/types/stock";

export interface UseStockDataReturn {
  status: AppStatus;
  error: string | null;
  ticker: string;

  quote: QuoteData | null;
  epsHistory: EpsHistoryEntry[];
  peHistory: PeHistoryEntry[];
  epsCagr: EpsCagr;
  currentEps: number | null;
  currentPe: number | null;

  expectedCagr: number | null;
  expectedPe: number | null;
  futureEps: number | null;
  futurePrice: number | null;
  npvResults: NpvResult[];

  fetchStock: (ticker: string) => Promise<void>;
  setExpectedCagr: (cagr: number) => void;
  setExpectedPe: (pe: number) => void;
  reset: () => void;
}

function toFiniteNumber(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function extractYear(date: string): string {
  return date.slice(0, 4);
}

export function useStockData(): UseStockDataReturn {
  const [status, setStatus] = useState<AppStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [ticker, setTicker] = useState("");

  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [epsHistory, setEpsHistory] = useState<EpsHistoryEntry[]>([]);
  const [peHistory, setPeHistory] = useState<PeHistoryEntry[]>([]);
  const [epsCagr, setEpsCagr] = useState<EpsCagr>({
    threeYear: null,
    fiveYear: null,
    sevenYear: null,
  });

  const [expectedCagr, setExpectedCagrState] = useState<number | null>(null);
  const [expectedPe, setExpectedPeState] = useState<number | null>(null);
  const requestIdRef = useRef(0);

  const currentEps = quote?.eps ?? null;
  const currentPe = quote?.pe ?? null;

  const futureEps = useMemo(() => {
    if (currentEps === null || expectedCagr === null) return null;
    return computeFutureEps(currentEps, expectedCagr);
  }, [currentEps, expectedCagr]);

  const futurePrice = useMemo(() => {
    if (futureEps === null || expectedPe === null) return null;
    return computeFuturePrice(futureEps, expectedPe);
  }, [futureEps, expectedPe]);

  const npvResults = useMemo(() => {
    if (futurePrice === null) return [];
    return computeAllNpvs(futurePrice);
  }, [futurePrice]);

  const fetchStock = useCallback(async (tickerInput: string) => {
    const t = tickerInput.trim().toUpperCase();
    if (!t) return;
    const requestId = ++requestIdRef.current;

    setTicker(t);
    setStatus("loading");
    setError(null);
    setExpectedCagrState(null);
    setExpectedPeState(null);

    try {
      // All calls in parallel — MSN P/E is best-effort (returns null on failure)
      const [quoteData, profileData, metricsData, msnPe] = await Promise.all([
        fetchQuote(t),
        fetchProfile(t),
        fetchBasicFinancials(t),
        fetchMsnPeRatio(t),
      ]);

      if (requestId !== requestIdRef.current) return;

      const price = toFiniteNumber(quoteData.c);
      if (price === null || price <= 0) {
        throw new Error("Quote data did not include a valid stock price");
      }

      // Current EPS and P/E — prefer MSN P/E (handles complex structures correctly)
      const latestEps =
        toFiniteNumber(metricsData.metric.epsTTM) ??
        toFiniteNumber(metricsData.metric.epsAnnual);

      const finnhubPe =
        toFiniteNumber(metricsData.metric.peTTM) ??
        toFiniteNumber(metricsData.metric.peAnnual);

      const latestPe = msnPe ?? finnhubPe;

      // If MSN gave us a better P/E, also derive a corrected EPS
      const latestEpsCorrected =
        msnPe !== null && price > 0 ? price / msnPe : latestEps;

      setQuote({
        symbol: profileData.ticker,
        name: profileData.name || profileData.ticker,
        price,
        eps: latestEpsCorrected,
        pe: latestPe,
        marketCap: profileData.marketCapitalization
          ? profileData.marketCapitalization * 1_000_000
          : null,
        exchange: profileData.exchange,
      });

      // --- EPS history from metrics annual series (split-adjusted) ---
      const epsSeries = metricsData.series?.annual?.eps ?? [];
      const epsEntries: EpsHistoryEntry[] = epsSeries
        .slice(0, 8)
        .map((item) => {
          const eps = toFiniteNumber(item.v);
          return {
            year: extractYear(item.period),
            eps,
            epsDiluted: eps,
          };
        });
      setEpsHistory(epsEntries);

      const epsValues = epsEntries.map((e) => e.epsDiluted);
      setEpsCagr(computeEpsCagrs(epsValues));

      // --- P/E history from metrics annual series ---
      const peSeries = metricsData.series?.annual?.pe ?? [];
      const peEntries: PeHistoryEntry[] = peSeries
        .slice(0, 8)
        .reduce<PeHistoryEntry[]>((entries, item) => {
          const pe = toFiniteNumber(item.v);
          if (pe !== null && pe > 0) {
            entries.push({
              year: extractYear(item.period),
              peRatio: pe,
            });
          }
          return entries;
        }, []);
      setPeHistory(peEntries);

      setStatus("loaded");
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      setStatus("error");
    }
  }, []);

  const setExpectedCagr = useCallback((cagr: number) => {
    if (!Number.isFinite(cagr)) return;
    setExpectedCagrState(cagr);
  }, []);

  const setExpectedPe = useCallback((pe: number) => {
    if (!Number.isFinite(pe)) return;
    setExpectedPeState(pe);
  }, []);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    setStatus("idle");
    setError(null);
    setTicker("");
    setQuote(null);
    setEpsHistory([]);
    setPeHistory([]);
    setEpsCagr({ threeYear: null, fiveYear: null, sevenYear: null });
    setExpectedCagrState(null);
    setExpectedPeState(null);
  }, []);

  return {
    status,
    error,
    ticker,
    quote,
    epsHistory,
    peHistory,
    epsCagr,
    currentEps,
    currentPe,
    expectedCagr,
    expectedPe,
    futureEps,
    futurePrice,
    npvResults,
    fetchStock,
    setExpectedCagr,
    setExpectedPe,
    reset,
  };
}
