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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

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
    fetchStock,
    setExpectedCagr,
    setExpectedPe,
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

        {/* Stock Overview */}
        {isLoaded && quote && (
          <div className="animate-fade-in">
            <StockOverview quote={quote} />
          </div>
        )}

        {/* EPS Growth + P/E History side by side */}
        {isLoaded && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <EpsGrowthCard epsCagr={epsCagr} epsHistory={epsHistory} />
            <PeRatioCard currentPe={currentPe} peHistory={peHistory} />
          </div>
        )}

        {/* User Input Section */}
        {isLoaded && currentEps !== null && (
          <>
            <Separator
              className="animate-fade-in"
              style={{ animationDelay: "200ms" }}
            />

            <div
              className="animate-fade-in"
              style={{ animationDelay: "250ms" }}
            >
              <FutureEpsInput
                currentEps={currentEps}
                epsCagr={epsCagr}
                expectedCagr={expectedCagr}
                futureEps={futureEps}
                onCagrChange={setExpectedCagr}
              />
            </div>
          </>
        )}

        {/* Future Price Input — visible after CAGR is set */}
        {futureEps !== null && (
          <div className="animate-fade-in">
            <FuturePriceInput
              futureEps={futureEps}
              peHistory={peHistory}
              currentPe={currentPe}
              expectedPe={expectedPe}
              futurePrice={futurePrice}
              onPeChange={setExpectedPe}
            />
          </div>
        )}

        {/* NPV Table — visible after future price is calculated */}
        {futurePrice !== null && quote && npvResults.length > 0 && (
          <>
            <Separator className="animate-fade-in" />

            <div className="animate-fade-in">
              <NpvTable
                futurePrice={futurePrice}
                currentPrice={quote.price}
                npvResults={npvResults}
              />
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
              <ValuationSummary
                currentPrice={quote.price}
                npvResults={npvResults}
              />
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
