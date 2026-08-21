'use client'

import { useState } from 'react'
import { Bell, Search } from 'lucide-react'
import { DashboardSidebar, type DashboardTab } from '@/components/dashboard/sidebar'
import { DashboardHome } from '@/components/dashboard/dashboard-home'
import { GrowBetter } from '@/components/dashboard/grow-better'
import { SellSmarter } from '@/components/dashboard/sell-smarter'
import { LoseLess } from '@/components/dashboard/lose-less'

const TAB_META: Record<DashboardTab, { title: string; subtitle: string }> = {
  home: { title: 'Namaste, Ravi', subtitle: "Here's what's happening on your farm today." },
  grow: { title: 'Grow Better', subtitle: 'AI guidance to boost your crop yields.' },
  sell: { title: 'Sell Smarter', subtitle: 'Live market prices and the best time to sell.' },
  lose: { title: 'Lose Less', subtitle: 'Prevent pests, disease, and post-harvest loss.' },
}

export default function Page() {
  const [tab, setTab] = useState<DashboardTab>('home')
  const meta = TAB_META[tab]

  return (
    <div className="flex min-h-svh w-full bg-background text-foreground">
      <DashboardSidebar active={tab} onChange={setTab} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between gap-4 border-b border-border bg-background/80 px-6 backdrop-blur lg:px-8">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-foreground lg:text-2xl">{meta.title}</h1>
            <p className="truncate text-sm text-muted-foreground">{meta.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 md:flex">
              <Search className="size-4 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search crops, prices..."
                className="w-48 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                aria-label="Search"
              />
            </div>
            <button
              type="button"
              className="relative flex size-11 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-secondary"
              aria-label="Notifications"
            >
              <Bell className="size-5" aria-hidden="true" />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-destructive" />
            </button>
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              RK
            </span>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 lg:px-8 lg:py-8">
          {tab === 'home' && <DashboardHome />}
          {tab === 'grow' && <GrowBetter />}
          {tab === 'sell' && <SellSmarter />}
          {tab === 'lose' && <LoseLess />}
        </main>
      </div>
    </div>
  )
}
