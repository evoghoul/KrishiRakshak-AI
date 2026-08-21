import { Droplets, FlaskConical, Sun, CheckCircle2, Clock } from 'lucide-react'

interface Task {
  time: string
  title: string
  detail: string
  type: 'water' | 'fertilizer' | 'field'
  done: boolean
}

const TASKS: Task[] = [
  { time: '6:00 AM', title: 'Drip irrigation — Tomato Block A', detail: '25 min · 12 L/plant', type: 'water', done: true },
  { time: '8:30 AM', title: 'Apply NPK 19:19:19', detail: 'Paddy Block C · 2 kg/acre', type: 'fertilizer', done: true },
  { time: '11:00 AM', title: 'Field inspection', detail: 'Check soil moisture sensors', type: 'field', done: false },
  { time: '4:30 PM', title: 'Evening irrigation — Paddy', detail: '30 min · maintain 5 cm', type: 'water', done: false },
  { time: '5:30 PM', title: 'Foliar spray — micronutrients', detail: 'Tomato Block B', type: 'fertilizer', done: false },
]

const TYPE_STYLES: Record<Task['type'], { icon: typeof Droplets; badge: string }> = {
  water: { icon: Droplets, badge: 'bg-sky-100 text-sky-600' },
  fertilizer: { icon: FlaskConical, badge: 'bg-primary/10 text-primary' },
  field: { icon: Sun, badge: 'bg-amber-100 text-amber-600' },
}

export function SchedulePlanner() {
  const done = TASKS.filter((t) => t.done).length
  return (
    <section
      aria-label="Irrigation and fertilizer schedule"
      className="rounded-3xl border border-border bg-card p-6"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-secondary">
            <Droplets className="size-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-bold text-foreground">Irrigation &amp; Fertilizer</h2>
            <p className="text-xs text-muted-foreground">Today&apos;s smart schedule · Vadlamudi</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground">
          <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
          {done} of {TASKS.length} done
        </span>
      </div>

      <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {TASKS.map((task) => {
          const style = TYPE_STYLES[task.type]
          const Icon = style.icon
          return (
            <li
              key={task.title}
              className={`flex items-start gap-3 rounded-2xl border p-4 transition-colors ${
                task.done ? 'border-border bg-secondary/40' : 'border-border bg-card'
              }`}
            >
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${style.badge}`}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {task.time}
                </div>
                <p className={`mt-0.5 text-sm font-semibold ${task.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                  {task.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">{task.detail}</p>
              </div>
              {task.done && <CheckCircle2 className="size-5 shrink-0 text-primary" aria-hidden="true" />}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
