'use client'

import { useState } from 'react'
import { Truck, Tractor, MapPin, Star, IndianRupee, X, CheckCircle2, Phone, ShieldCheck, Navigation } from 'lucide-react'

type Vehicle = {
  id: string
  name: string
  type: 'Mini Truck' | 'Tractor' | 'Truck'
  capacity: string
  distanceKm: number
  freight: number
  rating: number
  available: boolean
  driverName: string
  driverPhone: string
  plateNumber: string
}

const INITIAL_VEHICLES: Vehicle[] = [
  { id: '1', name: 'Tata Ace (Chhota Hathi)', type: 'Mini Truck', capacity: '1 Ton (10 Quintals)', distanceKm: 2.1, freight: 900, rating: 4.7, available: true, driverName: 'Ramesh Rao', driverPhone: '+91 94408 11223', plateNumber: 'AP 07 TX 4829' },
  { id: '2', name: 'Mahindra Bolero Maxi Truck', type: 'Mini Truck', capacity: '1.5 Tons (15 Quintals)', distanceKm: 3.5, freight: 1350, rating: 4.5, available: true, driverName: 'Suresh Kumar', driverPhone: '+91 98481 99887', plateNumber: 'AP 07 BK 9021' },
  { id: '3', name: 'John Deere 5050D Tractor Trolley', type: 'Tractor', capacity: '3.5 Tons (35 Quintals)', distanceKm: 1.8, freight: 1600, rating: 4.8, available: true, driverName: 'Venkata Reddy', driverPhone: '+91 99592 33445', plateNumber: 'AP 07 TT 1102' },
  { id: '4', name: 'Ashok Leyland Bada Dost', type: 'Truck', capacity: '2.5 Tons (25 Quintals)', distanceKm: 6.2, freight: 2100, rating: 4.4, available: true, driverName: 'Mohan Lal', driverPhone: '+91 97003 44556', plateNumber: 'AP 07 Z 6744' },
]

const ICONS = {
  'Mini Truck': Truck,
  Truck: Truck,
  Tractor: Tractor,
} as const

export function LogisticsMatching() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES)
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null)
  const [pickupVillage, setPickupVillage] = useState('Vadlamudi Farm Gateway')
  const [destinationMandi, setDestinationMandi] = useState('Guntur Main APMC Yard (14 km)')
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [bookingId, setBookingId] = useState('')

  const handleOpenBooking = (vehicle: Vehicle) => {
    setBookingVehicle(vehicle)
    setBookingConfirmed(false)
  }

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingVehicle) return

    const id = `KR-LOG-${Math.floor(1000 + Math.random() * 9000)}`
    setBookingId(id)
    setBookingConfirmed(true)

    // Mark as booked
    setVehicles(prev => prev.map(v => v.id === bookingVehicle.id ? { ...v, available: false } : v))
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-5 lg:p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Logistics &amp; Transportation Matching</h2>
          <p className="text-sm text-muted-foreground">Verified farm-to-mandi mini-trucks and tractor trolleys</p>
        </div>
        <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary flex items-center gap-1">
          <Navigation className="size-3.5" /> Est. to Guntur &amp; Tenali Mandi
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {vehicles.map((v) => {
          const Icon = ICONS[v.type]
          return (
            <article
              key={v.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-background p-4 hover:border-primary/40 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-foreground bg-secondary px-2 py-0.5 rounded-lg">
                    <Star className="size-3.5 fill-amber-500 text-amber-500" aria-hidden="true" />
                    {v.rating}
                  </span>
                </div>

                <h3 className="mt-3 font-extrabold text-foreground text-sm">{v.name}</h3>
                <p className="text-xs text-muted-foreground font-semibold">{v.type} · {v.capacity}</p>

                <div className="mt-2.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3.5 text-primary" aria-hidden="true" />
                  <span>{v.distanceKm} km away from your farm</span>
                </div>

                <div className="mt-2.5 flex items-center gap-0.5 text-foreground">
                  <IndianRupee className="size-4 text-primary" aria-hidden="true" />
                  <span className="text-xl font-black">₹{v.freight.toLocaleString('en-IN')}</span>
                  <span className="ml-1 text-[11px] text-muted-foreground">est. fixed freight</span>
                </div>
              </div>

              <button
                type="button"
                disabled={!v.available}
                onClick={() => handleOpenBooking(v)}
                className="mt-4 w-full rounded-xl py-2.5 text-xs font-extrabold transition-all disabled:cursor-not-allowed disabled:bg-secondary disabled:text-muted-foreground bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] shadow-sm"
              >
                {v.available ? 'Book Farm Pickup' : 'Booked — En Route'}
              </button>
            </article>
          )
        })}
      </div>

      {/* Interactive Logistics Booking Modal */}
      {bookingVehicle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setBookingVehicle(null)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border bg-secondary/40 p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Truck className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-foreground">Book {bookingVehicle.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-primary font-bold">
                    <ShieldCheck className="size-3.5" /> Verified Commercial Agrilogistics
                  </div>
                </div>
              </div>
              <button
                onClick={() => setBookingVehicle(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {bookingConfirmed ? (
                <div className="space-y-4 animate-in zoom-in">
                  <div className="flex flex-col items-center justify-center gap-2 py-4 text-primary">
                    <CheckCircle2 className="size-12 text-primary" />
                    <p className="text-base font-black">Transport Dispatched!</p>
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-bold text-primary">
                      Booking Ref: {bookingId}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-border bg-secondary/30 p-4 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Driver:</span>
                      <span className="font-bold text-foreground">{bookingVehicle.driverName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vehicle Number:</span>
                      <span className="font-mono font-bold text-foreground">{bookingVehicle.plateNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pickup Point:</span>
                      <span className="font-semibold text-foreground">{pickupVillage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Destination:</span>
                      <span className="font-semibold text-foreground">{destinationMandi}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-1.5 font-bold">
                      <span className="text-foreground">Total Freight (Pay on Delivery):</span>
                      <span className="text-primary font-extrabold">₹{bookingVehicle.freight.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={`tel:${bookingVehicle.driverPhone.replace(/[^0-9+]/g, '')}`}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-xs font-extrabold text-primary-foreground hover:bg-primary/90"
                    >
                      <Phone className="size-3.5" /> Call Driver
                    </a>
                    <button
                      type="button"
                      onClick={() => setBookingVehicle(null)}
                      className="rounded-xl border border-border bg-secondary py-3 text-xs font-extrabold text-foreground hover:bg-secondary/80"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  <div className="rounded-2xl border border-border bg-secondary/30 p-3.5 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Driver &amp; Vehicle:</span>
                      <span className="font-bold text-foreground">{bookingVehicle.driverName} ({bookingVehicle.plateNumber})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span className="font-bold text-foreground">{bookingVehicle.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fixed Base Freight:</span>
                      <span className="font-black text-primary text-sm">₹{bookingVehicle.freight.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground block mb-1">Farm Pickup Location</label>
                    <input
                      type="text"
                      value={pickupVillage}
                      onChange={(e) => setPickupVillage(e.target.value)}
                      required
                      className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs font-bold text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground block mb-1">Destination Mandi / Hub</label>
                    <select
                      value={destinationMandi}
                      onChange={(e) => setDestinationMandi(e.target.value)}
                      className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs font-bold text-foreground outline-none focus:border-primary"
                    >
                      <option value="Guntur Main APMC Yard (14 km)">Guntur Main APMC Yard (14 km)</option>
                      <option value="Tenali Wholesale Market (8 km)">Tenali Wholesale Market (8 km)</option>
                      <option value="Duggirala Turmeric Terminal (11 km)">Duggirala Turmeric Terminal (11 km)</option>
                      <option value="Vijayawada Agricultural Terminal (32 km)">Vijayawada Agricultural Terminal (32 km)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-extrabold text-primary-foreground shadow-md hover:bg-primary/90 transition-all active:scale-[0.98]"
                  >
                    <CheckCircle2 className="size-4" /> Confirm &amp; Dispatch Vehicle
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

