'use client'

import { Truck, Tractor, MapPin, Star, IndianRupee } from 'lucide-react'

type Vehicle = {
  name: string
  type: 'Mini Truck' | 'Tractor' | 'Truck'
  capacity: string
  distanceKm: number
  freight: number
  rating: number
  available: boolean
}

const VEHICLES: Vehicle[] = [
  { name: 'Tata Ace', type: 'Mini Truck', capacity: '1 Ton', distanceKm: 2.1, freight: 900, rating: 4.7, available: true },
  { name: 'Mahindra Bolero Pickup', type: 'Mini Truck', capacity: '1.5 Tons', distanceKm: 3.5, freight: 1350, rating: 4.5, available: true },
  { name: 'John Deere 5050D', type: 'Tractor', capacity: '3 Tons', distanceKm: 1.8, freight: 1600, rating: 4.8, available: true },
  { name: 'Ashok Leyland Dost', type: 'Truck', capacity: '2.5 Tons', distanceKm: 6.2, freight: 2100, rating: 4.4, available: false },
]

const ICONS = {
  'Mini Truck': Truck,
  Truck: Truck,
  Tractor: Tractor,
} as const

export function LogisticsMatching() {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Logistics &amp; Transportation Matching</h2>
          <p className="text-sm text-muted-foreground">Available mini-trucks and tractors near you</p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
          Est. to Guntur Mandi
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {VEHICLES.map((v) => {
          const Icon = ICONS[v.type]
          return (
            <article
              key={v.name}
              className="flex flex-col rounded-2xl border border-border bg-background p-4"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary">
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-foreground">
                  <Star className="size-3.5 fill-primary text-primary" aria-hidden="true" />
                  {v.rating}
                </span>
              </div>

              <h3 className="mt-3 font-bold text-foreground">{v.name}</h3>
              <p className="text-xs text-muted-foreground">{v.type} · {v.capacity}</p>

              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3.5" aria-hidden="true" />
                {v.distanceKm} km away
              </div>

              <div className="mt-3 flex items-center gap-0.5 text-foreground">
                <IndianRupee className="size-4" aria-hidden="true" />
                <span className="text-xl font-bold">{v.freight.toLocaleString('en-IN')}</span>
                <span className="ml-1 text-xs text-muted-foreground">est. freight</span>
              </div>

              <button
                type="button"
                disabled={!v.available}
                className="mt-4 w-full rounded-xl py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:bg-secondary disabled:text-muted-foreground bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {v.available ? 'Book now' : 'Unavailable'}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
