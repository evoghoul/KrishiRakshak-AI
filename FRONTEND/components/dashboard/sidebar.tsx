'use client'

import { Home, Sprout, TrendingUp, ShieldCheck, Mic } from 'lucide-react'
import { KrishiLogo } from '@/components/krishi-logo'
import { cn } from '@/lib/utils'

export type DashboardTab = 'home' | 'grow' | 'sell' | 'lose'

interface NavItem {
  id: DashboardTab
  label: string
  description: string
  icon: typeof Home
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', description: 'Farm overview', icon: Home },
  { id: 'grow', label: 'Grow Better', description: 'Crop guidance', icon: Sprout },
  { id: 'sell', label: 'Sell Smarter', description: 'Market prices', icon: TrendingUp },
  { id: 'lose', label: 'Lose Less', description: 'Reduce waste', icon: ShieldCheck },
]

interface DashboardSidebarProps {
  active: DashboardTab
  onChange: (tab: DashboardTab) => void
}

export function DashboardSidebar({ active, onChange }: DashboardSidebarProps) {
  return (
    <aside className="sticky top-0 flex h-svh w-72 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex h-20 items-center px-6">
        <KrishiLogo />
      </div>

      <nav className="flex flex-1 flex-col gap-1.5 px-4 py-4" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              <span
                className={cn(
                  'flex size-9 items-center justify-center rounded-lg transition-colors',
                  isActive ? 'bg-primary-foreground/15' : 'bg-secondary group-hover:bg-card',
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold">{item.label}</span>
                <span
                  className={cn(
                    'text-xs',
                    isActive ? 'text-primary-foreground/80' : 'text-muted-foreground',
                  )}
                >
                  {item.description}
                </span>
              </span>
            </button>
          )
        })}
      </nav>

      <div className="p-4">
        <button
          type="button"
          className="animate-guide-glow flex w-full items-center gap-3 rounded-2xl bg-primary px-4 py-4 text-left text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
            <span className="animate-mic-ring absolute inset-0 rounded-full bg-primary-foreground/30" />
            <Mic className="size-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-bold">AI Voice Guide</span>
            <span className="text-xs text-primary-foreground/85">Need help? I&apos;ll guide you</span>
          </span>
        </button>
      </div>
    </aside>
  )
}
