import { TrendingUp } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Value Investing Calculator
            </h1>
            <p className="text-sm text-muted-foreground">
              Estimate fair value using EPS growth & P/E analysis
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
