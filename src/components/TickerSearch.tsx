import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Loader2, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { searchStocks } from "@/api/stockApi";
import type { AppStatus, StockSuggestion } from "@/types/stock";

interface TickerSearchProps {
  status: AppStatus;
  error: string | null;
  onSearch: (ticker: string) => void;
  onReset: () => void;
}

export function TickerSearch({ status, error, onSearch, onReset }: TickerSearchProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "loading";
  const hasData = status === "loaded";

  // Debounced search for suggestions
  const fetchSuggestions = useCallback(
    (query: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (query.trim().length < 1) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }
      debounceRef.current = setTimeout(async () => {
        try {
          const results = await searchStocks(query.trim());
          setSuggestions(results);
          setShowDropdown(results.length > 0);
          setHighlightedIndex(-1);
        } catch {
          setSuggestions([]);
          setShowDropdown(false);
        }
      }, 300);
    },
    []
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setInput(value);
    if (!hasData) {
      fetchSuggestions(value);
    }
  };

  const selectSuggestion = (suggestion: StockSuggestion) => {
    setInput(suggestion.ticker);
    setShowDropdown(false);
    setSuggestions([]);
    onSearch(suggestion.ticker);
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed && !isLoading) {
      setShowDropdown(false);
      setSuggestions([]);
      // If a suggestion is highlighted, use that
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        selectSuggestion(suggestions[highlightedIndex]);
      } else {
        onSearch(trimmed);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === "Enter") handleSubmit();
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          selectSuggestion(suggestions[highlightedIndex]);
        } else {
          handleSubmit();
        }
        break;
      case "Escape":
        setShowDropdown(false);
        break;
    }
  };

  const handleReset = () => {
    setInput("");
    setSuggestions([]);
    setShowDropdown(false);
    onReset();
  };

  return (
    <div className="space-y-3" ref={containerRef}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search by company name or ticker (e.g. Apple, MSFT)"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0 && !hasData) setShowDropdown(true);
            }}
            disabled={isLoading}
            className="font-medium"
          />

          {/* Suggestions dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
              {suggestions.map((s, i) => (
                <button
                  key={s.ticker}
                  type="button"
                  className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-accent transition-colors ${
                    i === highlightedIndex ? "bg-accent" : ""
                  } ${i === 0 ? "rounded-t-md" : ""} ${
                    i === suggestions.length - 1 ? "rounded-b-md" : ""
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectSuggestion(s);
                  }}
                  onMouseEnter={() => setHighlightedIndex(i)}
                >
                  <span>
                    <span className="font-semibold tracking-wider">{s.ticker}</span>
                    <span className="ml-2 text-muted-foreground">{s.name}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

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
