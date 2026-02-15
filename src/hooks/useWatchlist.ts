import { useState, useCallback, useEffect } from "react";
import type { WatchlistItem } from "@/types/stock";

const STORAGE_KEY = "value-investing-watchlist";

function loadFromStorage(): WatchlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: WatchlistItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export interface UseWatchlistReturn {
  items: WatchlistItem[];
  addOrUpdate: (item: WatchlistItem) => void;
  remove: (ticker: string) => void;
  isInWatchlist: (ticker: string) => boolean;
}

export function useWatchlist(): UseWatchlistReturn {
  const [items, setItems] = useState<WatchlistItem[]>(loadFromStorage);

  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  const addOrUpdate = useCallback((item: WatchlistItem) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.ticker.toUpperCase() === item.ticker.toUpperCase()
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...item, savedAt: prev[idx].savedAt };
        return next;
      }
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((ticker: string) => {
    setItems((prev) =>
      prev.filter((i) => i.ticker.toUpperCase() !== ticker.toUpperCase())
    );
  }, []);

  const isInWatchlist = useCallback(
    (ticker: string) =>
      items.some((i) => i.ticker.toUpperCase() === ticker.toUpperCase()),
    [items]
  );

  return { items, addOrUpdate, remove, isInWatchlist };
}
