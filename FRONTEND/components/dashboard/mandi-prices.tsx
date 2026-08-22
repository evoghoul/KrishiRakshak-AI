'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, Search } from 'lucide-react'

type Trend = 'up' | 'down' | 'flat'

type MandiRow = {
  crop: string
  variety: string
  market: string
  price: number
  unit: string
  change: number
  trend: Trend
}

const TREND_STYLES: Record<Trend, { icon: typeof TrendingUp; className: string }> = {
  up: { icon: TrendingUp, className: 'text-primary' },
  down: { icon: TrendingDown, className: 'text-destructive' },
  flat: { icon: Minus, className: 'text-muted-foreground' },
}

export function MandiPrices() {
  const [query, setQuery] = useState('')
  const [marketData, setMarketData] = useState<MandiRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // SECURE BACKEND FETCH (Fixes the CORS error!)
  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/prices')
        const data = await response.json()

        if (!data.error && Array.isArray(data)) {
          setMarketData(data)
        }
      } catch (error) {
        console.error("Failed to fetch live prices:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLivePrices()
  }, [])

  const filtered = marketData.filter((r) =>
    `${r.crop} ${r.variety} ${r.market}`.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <section className="flex h-full flex-col rounded-3xl border border-border bg-card p-5 lg:p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Wholesale Market Information</h2>
          <p className="text-sm text-muted-foreground">Live mandi prices near Vadlamudi</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          Live Gov Data
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 focus-within:border-primary transition-colors">
        <Search className="size-4 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search crop or market..."
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="pb-3 pr-4 font-semibold">Crop</th>
              <th className="pb-3 pr-4 font-semibold">Market</th>
              <th className="pb-3 pr-4 text-right font-semibold">Price</th>
              <th className="pb-3 text-right font-semibold">24h</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                  Fetching live market data from Agmarknet...
                </td>
              </tr>
            )}
            {!isLoading && filtered.map((row, index) => {
              const t = TREND_STYLES[row.trend]
              const Icon = t.icon
              return (
                <tr key={`${row.crop}-${row.market}-${index}`} className="border-b border-border/60 last:border-0 hover:bg-secondary/40 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="font-semibold text-foreground">{row.crop}</div>
                    <div className="text-xs text-muted-foreground">{row.variety}</div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-muted-foreground">{row.market}</td>
                  <td className="py-3 pr-4 text-right">
                    <div className="font-semibold text-foreground">₹{row.price.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-muted-foreground">/{row.unit}</div>
                  </td>
                  <td className="py-3 text-right">
                    <span className={`inline-flex items-center justify-end gap-1 text-sm font-semibold ${t.className}`}>
                      <Icon className="size-4" aria-hidden="true" />
                      {row.trend === 'flat' ? '0%' : `${Math.abs(row.change)}%`}
                    </span>
                  </td>
                </tr>
              )
            })}
            {!isLoading && filtered.length === 0 && marketData.length > 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                  No markets match &quot;{query}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}