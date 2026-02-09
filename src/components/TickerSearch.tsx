import { useState } from "react";
import { Search, Loader2, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AppStatus } from "@/types/stock";

interface TickerSearchProps {
  status: AppStatus;
  error: string | null;
  onSearch: (ticker: string) => void;
  onReset: () => void;
}

export function TickerSearch({ status, error, onSearch, onReset }: TickerSearchProps) {
  const [input, setInput] = useState("");
  const isLoading = status === "loading";
  const hasData = status === "loaded";

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed && !isLoading) {
      onSearch(trimmed);
    }
  };

  const handleReset = () => {
    setInput("");
    onReset();
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Enter stock ticker (e.g. AAPL, MSFT, GOOGL)"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={isLoading}
          className="font-medium tracking-wider"
        />
        {hasData ? (
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {isLoading ? "Loading..." : "Search"}
          </Button>
        )}
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
