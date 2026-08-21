'use client'

import { useMemo, useState } from 'react'
import { Search, Landmark, BadgeCheck, IndianRupee, ArrowRight } from 'lucide-react'

interface Scheme {
  name: string
  tag: string
  category: string
  benefit: string
  description: string
}

const SCHEMES: Scheme[] = [
  {
    name: 'PM-Kisan Samman Nidhi',
    tag: 'Income Support',
    category: 'Central',
    benefit: 'Rs 6,000 / year',
    description: 'Direct income support in three equal installments to eligible farmer families.',
  },
  {
    name: 'Pradhan Mantri Fasal Bima Yojana',
    tag: 'Crop Insurance',
    category: 'Central',
    benefit: 'Up to 90% premium subsidy',
    description: 'Insurance cover against crop loss due to natural calamities, pests, and disease.',
  },
  {
    name: 'Kisan Credit Card',
    tag: 'Credit',
    category: 'Central',
    benefit: 'Loans at 4% interest',
    description: 'Short-term credit for cultivation and post-harvest expenses at subsidised rates.',
  },
  {
    name: 'Soil Health Card Scheme',
    tag: 'Advisory',
    category: 'Central',
    benefit: 'Free soil testing',
    description: 'Nutrient status of soil with recommendations on fertilizer dosage per crop.',
  },
  {
    name: 'Rythu Bharosa (AP)',
    tag: 'Income Support',
    category: 'State',
    benefit: 'Rs 13,500 / year',
    description: 'Investment support for Andhra Pradesh farmers per cropping season.',
  },
  {
    name: 'PM Krishi Sinchayee Yojana',
    tag: 'Irrigation',
    category: 'Central',
    benefit: 'Up to 55% subsidy',
    description: 'Financial assistance for micro-irrigation like drip and sprinkler systems.',
  },
]

const FILTERS = ['All', 'Central', 'State'] as const

export function GovSchemes() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SCHEMES.filter((s) => {
      const matchesFilter = filter === 'All' || s.category === filter
      const matchesQuery =
        q === '' ||
        s.name.toLowerCase().includes(q) ||
        s.tag.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
  }, [query, filter])

  return (
    <section
      aria-label="Government schemes and crop assistance"
      className="rounded-3xl border border-border bg-card p-6"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-secondary">
            <Landmark className="size-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-bold text-foreground">Government Schemes &amp; Crop Assistance</h2>
            <p className="text-xs text-muted-foreground">Subsidies and support programs you may qualify for</p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
          <div className="flex min-w-52 flex-1 items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-2 sm:max-w-xs">
            <Search className="size-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search schemes (e.g. PM-Kisan)"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              aria-label="Search schemes"
            />
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-border bg-secondary/40 p-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-secondary/40 py-10 text-center text-sm text-muted-foreground">
          No schemes match your search.
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((scheme) => (
            <li
              key={scheme.name}
              className="flex flex-col rounded-2xl border border-border bg-secondary/40 p-5 transition-colors hover:border-primary/40"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {scheme.tag}
                </span>
                <span className="text-xs font-medium text-muted-foreground">{scheme.category}</span>
              </div>
              <h3 className="text-sm font-bold text-foreground text-balance">{scheme.name}</h3>
              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground">{scheme.description}</p>
              <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-foreground">
                <IndianRupee className="size-4 text-primary" aria-hidden="true" />
                {scheme.benefit}
              </div>
              <button
                type="button"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <BadgeCheck className="size-4" aria-hidden="true" />
                Check Eligibility
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
