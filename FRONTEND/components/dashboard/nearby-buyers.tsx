'use client'

import { MapPin, BadgeCheck, Phone } from 'lucide-react'

type Buyer = {
  name: string
  type: string
  distanceKm: number
  crop: string
  price: number
  unit: string
  verified: boolean
}

const BUYERS: Buyer[] = [
  { name: 'Sri Lakshmi Traders', type: 'Wholesaler', distanceKm: 4.2, crop: 'Tomato', price: 2600, unit: 'quintal', verified: true },
  { name: 'AgroFresh Exports', type: 'Exporter', distanceKm: 9.8, crop: 'Chili', price: 19200, unit: 'quintal', verified: true },
  { name: 'Guntur Spice Mandi', type: 'Aggregator', distanceKm: 12.5, crop: 'Turmeric', price: 14600, unit: 'quintal', verified: true },
  { name: 'Krishna Rice Mills', type: 'Processor', distanceKm: 15.1, crop: 'Paddy', price: 2240, unit: 'quintal', verified: false },
]

export function NearbyBuyers() {
  return (
    <section className="flex h-full flex-col rounded-3xl border border-border bg-card p-5 lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Verified Nearby Buyers</h2>
          <p className="text-sm text-muted-foreground">Sell directly, skip the middleman</p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
          {BUYERS.length} nearby
        </span>
      </div>

      <ul className="mt-4 flex flex-1 flex-col gap-3">
        {BUYERS.map((buyer) => (
          <li
            key={buyer.name}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-semibold text-foreground">{buyer.name}</span>
                {buyer.verified && (
                  <BadgeCheck className="size-4 shrink-0 text-primary" aria-label="Verified buyer" />
                )}
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span>{buyer.type}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {buyer.distanceKm} km
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-bold text-primary">₹{buyer.price.toLocaleString('en-IN')}</div>
                <div className="text-xs text-muted-foreground">{buyer.crop} /{buyer.unit}</div>
              </div>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Phone className="size-3.5" aria-hidden="true" />
                Connect
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
