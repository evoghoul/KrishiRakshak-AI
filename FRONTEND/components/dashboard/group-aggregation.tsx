'use client'

import { Users, Gift, TrendingUp } from 'lucide-react'

type Pool = {
  crop: string
  village: string
  locked: number
  target: number
  unit: string
  bonus: string
  members: number
}

const POOLS: Pool[] = [
  { crop: 'Chili', village: 'Vadlamudi', locked: 18, target: 25, unit: 'Tons', bonus: '12%', members: 14 },
  { crop: 'Turmeric', village: 'Duggirala', locked: 9, target: 20, unit: 'Tons', bonus: '9%', members: 8 },
  { crop: 'Paddy', village: 'Tenali', locked: 42, target: 50, unit: 'Tons', bonus: '7%', members: 23 },
]

export function GroupAggregation() {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary">
            <Users className="size-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-foreground">Farmer-Group Aggregation</h2>
            <p className="text-sm text-muted-foreground">Pool your harvest to unlock bulk price bonuses</p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-xl border border-primary/40 bg-secondary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          Start a new pool
        </button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {POOLS.map((pool) => {
          const pct = Math.round((pool.locked / pool.target) * 100)
          const remaining = pool.target - pool.locked
          return (
            <article key={`${pool.crop}-${pool.village}`} className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-foreground">{pool.crop} Pool</h3>
                  <p className="text-xs text-muted-foreground">{pool.village} village</p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-primary">
                  <Gift className="size-3.5" aria-hidden="true" />
                  {pool.bonus} bonus
                </span>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <span className="text-2xl font-bold text-foreground">
                  {pool.locked}
                  <span className="text-base font-medium text-muted-foreground">/{pool.target} {pool.unit}</span>
                </span>
                <span className="text-sm font-semibold text-primary">{pct}%</span>
              </div>

              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <TrendingUp className="size-3.5 text-primary" aria-hidden="true" />
                  {remaining} {pool.unit} to unlock
                </span>
                <span>{pool.members} farmers</span>
              </div>

              <button
                type="button"
                className="mt-4 w-full rounded-xl bg-primary py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Lock my harvest
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
