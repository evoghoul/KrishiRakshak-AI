import { Sprout, Droplets, CalendarDays, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Crop {
  name: string
  variety: string
  stage: string
  sownDaysAgo: number
  moisture: string
  health: 'healthy' | 'attention'
  healthLabel: string
  progress: number
  emoji?: never
}

const CROPS: Crop[] = [
  {
    name: 'Tomato',
    variety: 'Arka Rakshak',
    stage: 'Flowering',
    sownDaysAgo: 46,
    moisture: 'Optimal',
    health: 'healthy',
    healthLabel: 'Healthy',
    progress: 62,
  },
  {
    name: 'Paddy',
    variety: 'BPT-5204',
    stage: 'Tillering',
    sownDaysAgo: 33,
    moisture: 'Monitor',
    health: 'attention',
    healthLabel: 'Needs attention',
    progress: 44,
  },
]

export function ActiveCrops() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">My Active Crops</h2>
        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {CROPS.map((crop) => (
          <CropCard key={crop.name} crop={crop} />
        ))}
      </div>
    </section>
  )
}

function CropCard({ crop }: { crop: Crop }) {
  const isHealthy = crop.health === 'healthy'
  return (
    <article className="flex items-center gap-5 rounded-3xl border border-border bg-card p-5">
      <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-secondary">
        <Sprout className="size-10 text-primary" aria-hidden="true" />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-foreground">{crop.name}</h3>
            <p className="text-xs text-muted-foreground">{crop.variety}</p>
          </div>
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-semibold',
              isHealthy
                ? 'bg-secondary text-primary'
                : 'bg-destructive/10 text-destructive',
            )}
          >
            {crop.healthLabel}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3.5 text-primary" aria-hidden="true" />
            {crop.stage} · {crop.sownDaysAgo}d
          </span>
          <span className="flex items-center gap-1">
            <Droplets className="size-3.5 text-primary" aria-hidden="true" />
            Moisture: {crop.moisture}
          </span>
        </div>

        <div className="mt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Season progress</span>
            <span className="font-semibold text-foreground">{crop.progress}%</span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={cn('h-full rounded-full', isHealthy ? 'bg-primary' : 'bg-destructive')}
              style={{ width: `${crop.progress}%` }}
            />
          </div>
        </div>
      </div>
    </article>
  )
}
