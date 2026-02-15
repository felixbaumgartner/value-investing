# Value Investing Calculator

A stock analysis tool that estimates fair value using two complementary approaches — **Earnings (EPS) Valuation** and **Book Value Valuation**. Built for value investors who want a quick, assumptions-driven way to evaluate whether a stock is undervalued.

**Live demo:** [value-investing-nine.vercel.app](https://value-investing-nine.vercel.app)

## Features

- **Earnings Valuation** — Project future EPS using historical CAGR, set an expected P/E ratio, and compute Net Present Value at multiple discount rates
- **Book Value Valuation** — Project future BVPS, apply expected ROE to derive future earnings, then discount back to present value
- **Cross-Method Comparison** — See how both valuation methods converge (or diverge) for the same stock
- **Watchlist** — Save stocks with your assumptions to localStorage; reload any stock with one click and get fresh data with your saved inputs restored
- **Insight Cards** — Implied annual return, P/B ratio, D/E ratio health indicator
- **Company Search** — Autocomplete search by ticker or company name via Finnhub API

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **Finnhub API** — quotes, company profiles, financial metrics, historical data
- **MSN Finance API** — accurate P/E ratios as a secondary source
- **Vercel** — hosting

## Getting Started

```bash
# Install dependencies
npm install

# Create .env with your Finnhub API key (free at https://finnhub.io)
echo "VITE_FINNHUB_API_KEY=your_key_here" > .env

# Start dev server
npm run dev
```

## Project Structure

```
src/
├── api/            # Finnhub + MSN API clients
├── components/     # UI components (cards, inputs, panels)
│   ├── layout/     # Header, Footer
│   └── ui/         # shadcn/ui primitives
├── constants/      # Valuation constants (discount rates, slider ranges)
├── hooks/          # useStockData (data fetching + state), useWatchlist (localStorage)
├── pages/          # Index.tsx (main page)
├── types/          # TypeScript interfaces
└── utils/          # Calculation functions, formatters
```

## How It Works

1. Search for a stock by ticker or company name
2. Review historical EPS, BVPS, P/E, ROE, and D/E data
3. Set your growth assumptions using sliders (EPS CAGR, P/E, BVPS CAGR, ROE)
4. View the projected future price and NPV at 5%, 8%, 10%, 12%, 15% discount rates
5. Get a verdict: Undervalued, Fairly Valued, or Overvalued
6. Save to your watchlist for quick access later
