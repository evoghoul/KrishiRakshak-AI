import {
  Sprout,
  Scale,
  CalendarDays,
  IndianRupee,
  TrendingUp,
  Thermometer,
  Warehouse,
  Coins,
  MapPin,
  Users,
  AlertTriangle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Tone = 'neutral' | 'good' | 'warn' | 'bad'

type InputItem = {
  icon: LucideIcon
  label: string
  value: string
  hint?: string
  tone?: Tone
}

const ITEMS: InputItem[] = [
  { icon: Sprout, label: 'Crop', value: 'Tomato', hint: 'Hybrid' },
  { icon: Scale, label: 'Quantity', value: '50 Quintals' },
  { icon: CalendarDays, label: 'Harvested', value: 'Today', hint: 'Fresh' },
  { icon: IndianRupee, label: 'Current Price', value: '₹1,200/Q' },
  { icon: TrendingUp, label: 'Expected in 3 days', value: '₹1,650/Q', hint: '+37.5%', tone: 'good' },
  { icon: Thermometer, label: 'Temp / Humidity', value: '34°C', hint: 'High humidity', tone: 'warn' },
  { icon: Warehouse, label: 'Storage Available', value: 'Yes', tone: 'good' },
  { icon: Coins, label: 'Storage Cost', value: '₹40/Q/day' },
  { icon: MapPin, label: 'Distance to Market', value: '12 km' },
  { icon: Users, label: 'Buyer Demand', value: 'High', tone: 'good' },
  { icon: AlertTriangle, label: 'Spoilage Probability', value: '45%', hint: 'Perishable', tone: 'bad' },
]

const TONE_STYLES: Record<Tone, string> = {
  neutral: 'text-foreground',
  good: 'text-primary',
  warn: 'text-chart-4',
  bad: 'text-destructive',
}

export function DecisionInputs() {
  return (
    <section
      aria-labelledby="inputs-heading"
      className="flex flex-col rounded-3xl border border-border bg-card p-6"
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-xl bg-secondary">
          <Scale className="size-5 text-primary" aria-hidden="true" />
        </span>
        <div>
          <h2 id="inputs-heading" className="text-lg font-bold text-foreground">
            Decision Inputs
          </h2>
          <p className="text-xs text-muted-foreground">Live data feeding the AI engine</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ITEMS.map((item) => {
          const Icon = item.icon
          const tone = item.tone ?? 'neutral'
          return (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4"
            >
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <Icon className="size-4 text-primary" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                <p className={`text-base font-bold ${TONE_STYLES[tone]}`}>{item.value}</p>
                {item.hint ? (
                  <p className="text-xs text-muted-foreground">{item.hint}</p>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
