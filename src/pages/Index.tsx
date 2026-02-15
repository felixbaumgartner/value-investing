import { useState } from "react";
import { useStockData } from "@/hooks/useStockData";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TickerSearch } from "@/components/TickerSearch";
import { StockOverview } from "@/components/StockOverview";
import { WatchlistPanel } from "@/components/WatchlistPanel";
import { EpsGrowthCard } from "@/components/EpsGrowthCard";
import { PeRatioCard } from "@/components/PeRatioCard";
import { FutureEpsInput } from "@/components/FutureEpsInput";
import { FuturePriceInput } from "@/components/FuturePriceInput";
import { NpvTable } from "@/components/NpvTable";
import { ValuationSummary } from "@/components/ValuationSummary";
import { BvpsGrowthCard } from "@/components/BvpsGrowthCard";
import { RoeHistoryCard } from "@/components/RoeHistoryCard";
import { FutureBvpsInput } from "@/components/FutureBvpsInput";
import { FutureRoeInput } from "@/components/FutureRoeInput";
import { DebtEquityCard } from "@/components/DebtEquityCard";
import { CrossMethodComparison } from "@/components/CrossMethodComparison";
import { BookValueInsights } from "@/components/BookValueInsights";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star } from "lucide-react";
import type { WatchlistItem } from "@/types/stock";

export default function Index() {
  const {
    status,
    error,
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
    // Book Value tab
    bvpsHistory,
    bvpsCagr,
    roeHistory,
    debtEquityHistory,
    currentBvps,
    currentRoe,
    expectedBvpsCagr,
    expectedRoe,
    expectedPeBv,
    futureBvps,
    futureEpsFromBv,
    futurePriceFromBv,
    npvResultsBv,
    fetchStock,
    setExpectedCagr,
    setExpectedPe,
    setExpectedBvpsCagr,
    setExpectedRoe,
    setExpectedPeBv,
    reset,
  } = useStockData();

  const watchlist = useWatchlist();
  const [showWatchlist, setShowWatchlist] = useState(false);

  const isLoaded = status === "loaded";
  const isLoading = status === "loading";

  const bothMethodsComplete =
    npvResults.length > 0 && npvResultsBv.length > 0;

  const handleSaveToWatchlist = () => {
    if (!quote) return;
    const npvAt10Earnings = npvResults.find((r) => r.discountRate === 0.1)?.npv ?? null;
    const npvAt10BookValue = npvResultsBv.find((r) => r.discountRate === 0.1)?.npv ?? null;
    const now = new Date().toISOString();

    const item: WatchlistItem = {
      ticker: quote.symbol,
      name: quote.name,
      priceAtSave: quote.price,
      assumptions: {
        expectedCagr,
        expectedPe,
        expectedBvpsCagr,
        expectedRoe,
        expectedPeBv,
      },
      results: {
        futurePrice,
        npvAt10Earnings,
        futurePriceFromBv,
        npvAt10BookValue,
      },
      savedAt: now,
    };
    watchlist.addOrUpdate(item);
  };

  const handleLoadFromWatchlist = (item: WatchlistItem) => {
    fetchStock(item.ticker, item.assumptions);
    setShowWatchlist(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 space-y-6">
        {/* Ticker Search + Watchlist toggle */}
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <TickerSearch
              status={status}
              error={error}
              onSearch={fetchStock}
              onReset={reset}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowWatchlist(!showWatchlist)}
            className="relative shrink-0 mt-0"
          >
            <Star className="h-4 w-4" fill={showWatchlist ? "currentColor" : "none"} />
            {watchlist.items.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                {watchlist.items.length}
              </span>
            )}
          </Button>
        </div>

        {/* Watchlist Panel */}
        {showWatchlist && (
          <WatchlistPanel
            items={watchlist.items}
            onLoad={handleLoadFromWatchlist}
            onRemove={watchlist.remove}
          />
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="space-y-6 animate-fade-in">
            <Skeleton className="h-40 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-56" />
              <Skeleton className="h-56" />
            </div>
          </div>
        )}

        {/* Stock Overview — shared across both tabs */}
        {isLoaded && quote && (
          <div className="animate-fade-in">
            <StockOverview
              quote={quote}
              currentBvps={currentBvps}
              currentRoe={currentRoe}
              isInWatchlist={watchlist.isInWatchlist(quote.symbol)}
              onSaveToWatchlist={handleSaveToWatchlist}
            />
          </div>
        )}

        {/* Valuation Tabs */}
        {isLoaded && (
          <Tabs defaultValue="earnings" className="animate-fade-in">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="earnings">Earnings Valuation</TabsTrigger>
              <TabsTrigger value="bookvalue">Book Value Valuation</TabsTrigger>
            </TabsList>

            {/* ── Tab 1: Earnings (EPS & P/E) Valuation ── */}
            <TabsContent value="earnings" className="space-y-6">
              {/* EPS Growth + P/E History side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EpsGrowthCard epsCagr={epsCagr} epsHistory={epsHistory} />
                <PeRatioCard currentPe={currentPe} peHistory={peHistory} />
              </div>

              {/* User Input Section */}
              {currentEps !== null && (
                <>
                  <Separator />
                  <FutureEpsInput
                    currentEps={currentEps}
                    epsCagr={epsCagr}
                    expectedCagr={expectedCagr}
                    futureEps={futureEps}
                    onCagrChange={setExpectedCagr}
                  />
                </>
              )}

              {/* Future Price Input — visible after CAGR is set */}
              {futureEps !== null && (
                <FuturePriceInput
                  futureEps={futureEps}
                  peHistory={peHistory}
                  currentPe={currentPe}
                  expectedPe={expectedPe}
                  futurePrice={futurePrice}
                  onPeChange={setExpectedPe}
                />
              )}

              {/* NPV Table — visible after future price is calculated */}
              {futurePrice !== null && quote && npvResults.length > 0 && (
                <>
                  <Separator />
                  <NpvTable
                    futurePrice={futurePrice}
                    currentPrice={quote.price}
                    npvResults={npvResults}
                  />
                  <ValuationSummary
                    currentPrice={quote.price}
                    futurePrice={futurePrice}
                    npvResults={npvResults}
                  />
                  {bothMethodsComplete && (
                    <CrossMethodComparison
                      currentPrice={quote.price}
                      earningsNpvResults={npvResults}
                      bookValueNpvResults={npvResultsBv}
                    />
                  )}
                </>
              )}
            </TabsContent>

            {/* ── Tab 2: Book Value Valuation ── */}
            <TabsContent value="bookvalue" className="space-y-6">
              {/* BVPS Growth Card — always visible */}
              <BvpsGrowthCard bvpsCagr={bvpsCagr} bvpsHistory={bvpsHistory} />

              {/* Step 1: Expected BVPS CAGR */}
              {currentBvps !== null && (
                <>
                  <Separator />
                  <FutureBvpsInput
                    currentBvps={currentBvps}
                    bvpsCagr={bvpsCagr}
                    expectedBvpsCagr={expectedBvpsCagr}
                    futureBvps={futureBvps}
                    onCagrChange={setExpectedBvpsCagr}
                  />
                </>
              )}

              {/* ROE + D/E History + Step 2 — visible after BVPS CAGR is set */}
              {futureBvps !== null && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RoeHistoryCard roeHistory={roeHistory} />
                    <DebtEquityCard debtEquityHistory={debtEquityHistory} />
                  </div>
                  <FutureRoeInput
                    futureBvps={futureBvps}
                    roeHistory={roeHistory}
                    expectedRoe={expectedRoe}
                    futureEpsFromBv={futureEpsFromBv}
                    onRoeChange={setExpectedRoe}
                  />
                </>
              )}

              {/* P/E History + Step 3 — visible after ROE is set */}
              {futureEpsFromBv !== null && (
                <>
                  <Separator />
                  <PeRatioCard currentPe={currentPe} peHistory={peHistory} />
                  <FuturePriceInput
                    futureEps={futureEpsFromBv}
                    peHistory={peHistory}
                    currentPe={currentPe}
                    expectedPe={expectedPeBv}
                    futurePrice={futurePriceFromBv}
                    onPeChange={setExpectedPeBv}
                    title="Step 3: Set Your Expected P/E Ratio"
                  />
                </>
              )}

              {/* NPV Table + Insights — visible after future price is calculated */}
              {futurePriceFromBv !== null && quote && npvResultsBv.length > 0 && futureBvps !== null && currentBvps !== null && (
                <>
                  <Separator />
                  <NpvTable
                    futurePrice={futurePriceFromBv}
                    currentPrice={quote.price}
                    npvResults={npvResultsBv}
                  />
                  <ValuationSummary
                    currentPrice={quote.price}
                    futurePrice={futurePriceFromBv}
                    npvResults={npvResultsBv}
                  />
                  <BookValueInsights
                    currentPrice={quote.price}
                    currentBvps={currentBvps}
                    futureBvps={futureBvps}
                    futurePriceFromBv={futurePriceFromBv}
                  />
                  {bothMethodsComplete && (
                    <CrossMethodComparison
                      currentPrice={quote.price}
                      earningsNpvResults={npvResults}
                      bookValueNpvResults={npvResultsBv}
                    />
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      <Footer />
    </div>
  );
}
