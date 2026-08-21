import { AlertTriangle, Bug, CloudLightning, ChevronRight } from 'lucide-react'

interface Alert {
  title: string
  detail: string
  severity: 'high' | 'medium'
  icon: typeof Bug
}

const ALERTS: Alert[] = [
  {
    title: 'Leaf-curl virus risk',
    detail: 'Whitefly activity rising in nearby Tomato fields.',
    severity: 'high',
    icon: Bug,
  },
  {
    title: 'Stem borer watch',
    detail: 'Check Paddy tillers for dead-heart symptoms.',
    severity: 'medium',
    icon: Bug,
  },
  {
    title: 'Evening thunderstorm',
    detail: 'Delay pesticide spraying after 5 PM today.',
    severity: 'medium',
    icon: CloudLightning,
  },
]

export function AlertsPanel() {
  return (
    <section className="flex h-full flex-col rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-lg bg-destructive/10">
          <AlertTriangle className="size-5 text-destructive" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-bold text-foreground">Urgent Alerts</h2>
          <p className="text-xs text-muted-foreground">3 active pest warnings</p>
        </div>
      </div>

      <ul className="mt-4 flex flex-1 flex-col gap-3">
        {ALERTS.map((alert) => {
          const Icon = alert.icon
          return (
            <li key={alert.title}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-background p-3 text-left transition-colors hover:border-primary/40 hover:bg-secondary"
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                    alert.severity === 'high'
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-secondary text-primary'
                  }`}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    {alert.title}
                    {alert.severity === 'high' && (
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-destructive">
                        Urgent
                      </span>
                    )}
                  </span>
                  <span className="text-xs leading-relaxed text-muted-foreground">{alert.detail}</span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
