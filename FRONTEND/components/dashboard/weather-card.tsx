import { Sun, Droplets, CloudRain, Wind, MapPin } from 'lucide-react'

interface Metric {
  label: string
  value: string
  icon: typeof Sun
}

const METRICS: Metric[] = [
  { label: 'Humidity', value: '62%', icon: Droplets },
  { label: 'Rain chance', value: '15%', icon: CloudRain },
  { label: 'Wind', value: '11 km/h', icon: Wind },
]

const HOURLY = [
  { time: 'Now', temp: '34°' },
  { time: '1 PM', temp: '35°' },
  { time: '2 PM', temp: '35°' },
  { time: '3 PM', temp: '34°' },
  { time: '4 PM', temp: '33°' },
  { time: '5 PM', temp: '31°' },
]

export function WeatherCard() {
  return (
    <section className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex size-20 items-center justify-center rounded-2xl bg-secondary">
            <Sun className="size-11 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              Vadlamudi, Andhra Pradesh
            </p>
            <p className="mt-1 flex items-start text-6xl font-bold leading-none text-foreground">
              34<span className="mt-1 text-2xl">°C</span>
            </p>
            <p className="mt-1 text-sm font-medium text-primary">Mostly sunny</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {METRICS.map((m) => {
            const Icon = m.icon
            return (
              <div
                key={m.label}
                className="flex min-w-24 flex-col items-center gap-1.5 rounded-2xl bg-secondary px-4 py-3 text-center"
              >
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <span className="text-lg font-bold text-foreground">{m.value}</span>
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-border sm:grid-cols-6">
        {HOURLY.map((h, i) => (
          <div
            key={h.time}
            className={`flex flex-col items-center gap-1 py-3 ${
              i !== 0 ? 'border-l border-border' : ''
            } ${i >= 3 ? 'border-t sm:border-t-0' : ''}`}
          >
            <span className="text-xs text-muted-foreground">{h.time}</span>
            <Sun className="size-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold text-foreground">{h.temp}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
