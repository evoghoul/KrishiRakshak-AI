'use client'

import { useState } from 'react'
import { MapPin, BadgeCheck, Phone, MessageSquare, X, Send, CheckCircle2, Building, ShieldCheck, IndianRupee } from 'lucide-react'

type Buyer = {
  name: string
  type: string
  distanceKm: number
  crop: string
  price: number
  unit: string
  verified: boolean
  phone: string
  licenseId: string
  address: string
}

const BUYERS: Buyer[] = [
  { name: 'Sri Lakshmi Traders', type: 'Wholesaler', distanceKm: 4.2, crop: 'Tomato', price: 2600, unit: 'quintal', verified: true, phone: '+91 98480 12345', licenseId: 'AP-GTR-APMC-8821', address: 'Shop 14, Guntur Main APMC Yard, Andhra Pradesh' },
  { name: 'AgroFresh Exports', type: 'Exporter', distanceKm: 9.8, crop: 'Chilli', price: 19200, unit: 'quintal', verified: true, phone: '+91 98492 67890', licenseId: 'AP-EXP-GTR-4102', address: 'Plot 8B, Auto Nagar Industrial Area, Guntur' },
  { name: 'Guntur Spice Mandi Aggregators', type: 'Aggregator', distanceKm: 12.5, crop: 'Turmeric', price: 14600, unit: 'quintal', verified: true, phone: '+91 94401 54321', licenseId: 'AP-SPICE-DUG-309', address: 'Duggirala Turmeric Terminal, Guntur District' },
  { name: 'Krishna Rice Processing Mills', type: 'Processor', distanceKm: 15.1, crop: 'Paddy', price: 2240, unit: 'quintal', verified: true, phone: '+91 98855 98765', licenseId: 'AP-MILL-TNL-1144', address: 'Tenali Highway Junction, Guntur' },
]

export function NearbyBuyers() {
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null)
  const [offerTons, setOfferTons] = useState('5')
  const [offerPrice, setOfferPrice] = useState('')
  const [offerSubmitted, setOfferSubmitted] = useState(false)

  const handleOpenConnect = (buyer: Buyer) => {
    setSelectedBuyer(buyer)
    setOfferPrice(buyer.price.toString())
    setOfferSubmitted(false)
  }

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault()
    setOfferSubmitted(true)
    setTimeout(() => {
      // Auto close after 2.5s
      setTimeout(() => {
        setSelectedBuyer(null)
        setOfferSubmitted(false)
      }, 2000)
    }, 500)
  }

  return (
    <section className="flex h-full flex-col rounded-3xl border border-border bg-card p-5 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Verified Nearby Buyers</h2>
          <p className="text-sm text-muted-foreground">Sell directly, skip the middleman</p>
        </div>
        <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
          {BUYERS.length} verified buyers
        </span>
      </div>

      <ul className="mt-4 flex flex-1 flex-col gap-3">
        {BUYERS.map((buyer) => (
          <li
            key={buyer.name}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4 hover:border-primary/40 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-bold text-foreground text-sm">{buyer.name}</span>
                {buyer.verified && (
                  <BadgeCheck className="size-4 shrink-0 text-primary" aria-label="Verified APMC buyer" />
                )}
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground/80">{buyer.type}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-primary" aria-hidden="true" />
                  {buyer.distanceKm} km away
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-extrabold text-primary text-base">₹{buyer.price.toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-muted-foreground">{buyer.crop} /{buyer.unit}</div>
              </div>
              <button
                type="button"
                onClick={() => handleOpenConnect(buyer)}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2.5 text-xs font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 shadow-sm"
              >
                <Phone className="size-3.5" aria-hidden="true" />
                Connect
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Interactive Direct Buyer Connect Modal */}
      {selectedBuyer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedBuyer(null)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border bg-secondary/40 p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Building className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-foreground">{selectedBuyer.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-primary font-bold">
                    <ShieldCheck className="size-3.5" /> APMC Verified Buyer
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedBuyer(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Quick Details */}
              <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buying Crop:</span>
                  <span className="font-bold text-foreground">{selectedBuyer.crop}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Offered Procurement Rate:</span>
                  <span className="font-extrabold text-primary">₹{selectedBuyer.price.toLocaleString('en-IN')} / {selectedBuyer.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">APMC License:</span>
                  <span className="font-mono text-foreground">{selectedBuyer.licenseId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="font-medium text-foreground text-right max-w-[200px]">{selectedBuyer.address}</span>
                </div>
              </div>

              {/* Direct Call & WhatsApp Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedBuyer.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-xs font-extrabold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all text-center"
                >
                  <Phone className="size-4" /> Call Buyer
                </a>
                <a
                  href={`https://wa.me/919848012345?text=Hello%2C%20I%20am%20a%20farmer%20from%20KrishiRakshak%20interested%20in%20selling%20my%20${encodeURIComponent(selectedBuyer.crop)}%20harvest.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 px-4 text-xs font-extrabold text-white shadow-sm hover:bg-emerald-700 transition-all text-center"
                >
                  <MessageSquare className="size-4" /> WhatsApp
                </a>
              </div>

              {/* In-App Direct Quotation / Deal Proposal Form */}
              <form onSubmit={handleSubmitOffer} className="rounded-2xl border border-border bg-background p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Send Direct Deal Offer
                </h4>

                {offerSubmitted ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-4 text-primary animate-in zoom-in">
                    <CheckCircle2 className="size-10 text-primary" />
                    <p className="text-sm font-extrabold">Deal Offer Sent Successfully!</p>
                    <p className="text-xs text-muted-foreground text-center">
                      The buyer has received your quantity quotation and will call you on your registered mobile.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-muted-foreground block mb-1">Your Harvest (Quintals)</label>
                        <input
                          type="number"
                          value={offerTons}
                          onChange={(e) => setOfferTons(e.target.value)}
                          min="1"
                          required
                          className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs font-bold text-foreground outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-muted-foreground block mb-1">Target Price (₹/Quintal)</label>
                        <input
                          type="number"
                          value={offerPrice}
                          onChange={(e) => setOfferPrice(e.target.value)}
                          min="100"
                          required
                          className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs font-bold text-foreground outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="rounded-xl bg-primary/10 p-2.5 flex justify-between items-center text-xs font-bold">
                      <span className="text-muted-foreground">Estimated Total Value:</span>
                      <span className="text-primary font-extrabold text-sm">
                        ₹{((parseFloat(offerTons) || 0) * (parseFloat(offerPrice) || 0)).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-extrabold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98]"
                    >
                      <Send className="size-3.5" /> Submit Direct Offer to Buyer
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

