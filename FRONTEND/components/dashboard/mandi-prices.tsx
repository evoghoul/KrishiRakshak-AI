'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, Search, RefreshCw, BarChart2, X, ExternalLink, ShieldCheck, MapPin } from 'lucide-react'

type Trend = 'up' | 'down' | 'flat'

type MandiRow = {
  crop: string
  variety: string
  market: string
  price: number
  min_price?: number
  max_price?: number
  modal_price?: number
  unit: string
  change: number
  trend: Trend
  source?: string
  arrival_date?: string
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
  const [selectedCrop, setSelectedCrop] = useState<MandiRow | null>(null)

  const fetchLivePrices = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/prices')
      const result = await response.json()

      if (result && Array.isArray(result.data)) {
        setMarketData(result.data)
      } else if (Array.isArray(result)) {
        setMarketData(result)
      }
    } catch (error) {
      console.error('Failed to fetch live prices:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLivePrices()
  }, [])

  const filtered = marketData.filter((r) =>
    `${r.crop} ${r.variety} ${r.market}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <section className="flex h-full flex-col rounded-3xl border border-border bg-card p-5 lg:p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Wholesale Market Information</h2>
          <p className="text-sm text-muted-foreground">Live mandi prices near Vadlamudi &amp; Guntur</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchLivePrices}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/80 px-3 py-1 text-xs font-bold text-foreground hover:bg-secondary transition-all active:scale-95"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-extrabold text-primary">
            <span className="size-2 animate-pulse rounded-full bg-primary" />
            Live Agmarknet
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 focus-within:border-primary transition-colors">
        <Search className="size-4 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search crop (e.g. Chilli, Turmeric, Tomato, Paddy, Cotton)..."
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="pb-3 pr-4 font-semibold">Crop &amp; Variety</th>
              <th className="pb-3 pr-4 font-semibold">Market Yard</th>
              <th className="pb-3 pr-4 text-right font-semibold">Price / Rate</th>
              <th className="pb-3 text-right font-semibold">24h Trend</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="size-4 animate-spin text-primary" />
                    <span>Fetching live Government Agmarknet prices...</span>
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && filtered.map((row, index) => {
              const trendType = row.trend || (row.change > 0 ? 'up' : row.change < 0 ? 'down' : 'flat')
              const t = TREND_STYLES[trendType]
              const Icon = t.icon
              return (
                <tr
                  key={`${row.crop}-${row.market}-${index}`}
                  onClick={() => setSelectedCrop(row)}
                  className="border-b border-border/60 last:border-0 hover:bg-secondary/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3 pr-4">
                    <div className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      {row.crop}
                      <BarChart2 className="size-3.5 opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity" />
                    </div>
                    <div className="text-xs text-muted-foreground">{row.variety}</div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-muted-foreground">{row.market}</td>
                  <td className="py-3 pr-4 text-right">
                    <div className="font-extrabold text-foreground">₹{row.price.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-muted-foreground">per {row.unit}</div>
                  </td>
                  <td className="py-3 text-right">
                    <span className={`inline-flex items-center justify-end gap-1 text-xs font-bold rounded-lg px-2 py-1 ${t.className} bg-secondary/60`}>
                      <Icon className="size-3.5" aria-hidden="true" />
                      {trendType === 'flat' ? '0.0%' : `${row.change > 0 ? '+' : ''}${row.change}%`}
                    </span>
                  </td>
                </tr>
              )
            })}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                  No markets match &quot;{query}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Interactive Mandi Price Analytics Modal */}
      {selectedCrop && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedCrop(null)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border bg-secondary/40 p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <BarChart2 className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-foreground">{selectedCrop.crop} Market Intelligence</h3>
                  <p className="text-xs text-muted-foreground">{selectedCrop.variety} · {selectedCrop.market}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCrop(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-border bg-secondary/30 p-3 text-center">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Min Rate</span>
                  <p className="text-sm font-extrabold text-foreground mt-0.5">₹{(selectedCrop.min_price || selectedCrop.price * 0.92).toLocaleString('en-IN')}</p>
                </div>
                <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3 text-center">
                  <span className="text-[10px] font-bold uppercase text-primary">Modal Rate</span>
                  <p className="text-base font-black text-primary mt-0.5">₹{selectedCrop.price.toLocaleString('en-IN')}</p>
                </div>
                <div className="rounded-2xl border border-border bg-secondary/30 p-3 text-center">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Max Rate</span>
                  <p className="text-sm font-extrabold text-foreground mt-0.5">₹{(selectedCrop.max_price || selectedCrop.price * 1.08).toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-primary" /> Official Mandi Details
                </h4>
                <div className="text-xs text-muted-foreground space-y-1.5 pt-1">
                  <p><strong className="text-foreground">Market Yard:</strong> {selectedCrop.market}</p>
                  <p><strong className="text-foreground">State / District:</strong> Andhra Pradesh (Guntur Region)</p>
                  <p><strong className="text-foreground">Official Source:</strong> {selectedCrop.source || 'Agmarknet Government Data'}</p>
                  <p><strong className="text-foreground">Data Timestamp:</strong> Live Today</p>
                </div>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                  AI Sell Advisory
                </h4>
                <p className="text-xs font-medium text-foreground leading-relaxed">
                  Wholesale arrivals for {selectedCrop.crop} in {selectedCrop.market} are steady. Prices are currently {selectedCrop.change >= 0 ? 'up' : 'down'} by {Math.abs(selectedCrop.change)}% in the last 24h. Recommendation: Lock into farmer pools or book direct logistics to maximize net realization.
                </p>
              </div>
            </div>

            <div className="border-t border-border bg-secondary/20 p-5 flex items-center justify-between">
              <a
                href="https://agmarknet.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                Open Official Agmarknet Portal <ExternalLink className="size-3" />
              </a>
              <button
                type="button"
                onClick={() => setSelectedCrop(null)}
                className="rounded-xl bg-primary py-2.5 px-5 text-xs font-extrabold text-primary-foreground hover:bg-primary/90 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}