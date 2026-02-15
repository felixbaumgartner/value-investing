import { useStockData } from "@/hooks/useStockData";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TickerSearch } from "@/components/TickerSearch";
import { StockOverview } from "@/components/StockOverview";
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

  const isLoaded = status === "loaded";
  const isLoading = status === "loading";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 space-y-6">
        {/* Ticker Search — always visible */}
        <TickerSearch
          status={status}
          error={error}
          onSearch={fetchStock}
          onReset={reset}
        />

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
            <StockOverview quote={quote} currentBvps={currentBvps} currentRoe={currentRoe} />
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
                    npvResults={npvResults}
                  />
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

              {/* ROE History + Step 2 — visible after BVPS CAGR is set */}
              {futureBvps !== null && (
                <>
                  <Separator />
                  <RoeHistoryCard roeHistory={roeHistory} />
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

              {/* NPV Table — visible after future price is calculated */}
              {futurePriceFromBv !== null && quote && npvResultsBv.length > 0 && (
                <>
                  <Separator />
                  <NpvTable
                    futurePrice={futurePriceFromBv}
                    currentPrice={quote.price}
                    npvResults={npvResultsBv}
                  />
                  <ValuationSummary
                    currentPrice={quote.price}
                    npvResults={npvResultsBv}
                  />
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
