import { Activity, AlertTriangle, CheckCircle2, Bug } from 'lucide-react'

interface DiagnosticRow {
  crop: string
  status: string
  detail: string
  level: 'healthy' | 'watch' | 'risk'
}

const ROWS: DiagnosticRow[] = [
  { crop: 'Tomato — Block A', status: 'Early Blight risk', detail: 'Humid conditions detected', level: 'risk' },
  { crop: 'Paddy — Block C', status: 'Healthy', detail: 'No issues found today', level: 'healthy' },
  { crop: 'Tomato — Block B', status: 'Leaf curl watch', detail: 'Monitor for whitefly', level: 'watch' },
]

const LEVEL_STYLES: Record<DiagnosticRow['level'], { icon: typeof Activity; badge: string; dot: string }> = {
  healthy: { icon: CheckCircle2, badge: 'bg-primary/10 text-primary', dot: 'bg-primary' },
  watch: { icon: AlertTriangle, badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  risk: { icon: Bug, badge: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
}

export function CropDiagnostics() {
  return (
    <section
      aria-label="Crop health and alerts"
      className="flex flex-col rounded-3xl border border-border bg-card p-6"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-secondary">
          <Activity className="size-5 text-primary" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-bold text-foreground">Crop Health &amp; Alerts</h2>
          <p className="text-xs text-muted-foreground">AI diagnostics across your fields</p>
        </div>
      </div>

      <ul className="flex flex-1 flex-col gap-3">
        {ROWS.map((row) => {
          const style = LEVEL_STYLES[row.level]
          const Icon = style.icon
          return (
            <li
              key={row.crop}
              className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 p-4"
            >
              <span className={`flex size-10 items-center justify-center rounded-xl ${style.badge}`}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{row.crop}</p>
                <p className="truncate text-xs text-muted-foreground">{row.detail}</p>
              </div>
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}
              >
                <span className={`size-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
                {row.status}
              </span>
            </li>
          )
        })}
      </ul>

      <button
        type="button"
        className="mt-4 rounded-xl border border-border bg-card py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
      >
        View full diagnostic report
      </button>
    </section>
  )
}
