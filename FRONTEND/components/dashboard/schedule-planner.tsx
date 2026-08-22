'use client'

import { useState } from 'react'
import { CalendarClock, CheckCircle2, Circle, Droplets, ShieldAlert, Sparkles } from 'lucide-react'

export function SchedulePlanner({ rainDelayActive = false, scanData }: { rainDelayActive?: boolean, scanData?: any }) {
  const [completed, setCompleted] = useState<string[]>([])

  const toggleTask = (id: string) => {
    setCompleted(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  }

  const defaultTasks = [
    { id: '1', title: 'Preventive Copper Spray', crop: 'Tomato — Block A', icon: ShieldAlert, color: 'text-destructive', bg: 'bg-destructive/10', date: rainDelayActive ? 'In 3 Days' : 'Today', affectedByRain: true },
    { id: '2', title: 'Irrigation Check', crop: 'Paddy — Block C', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10', date: 'Tomorrow', affectedByRain: false }
  ]

  // If the AI scanned a crop, dynamically inject its prescribed task at the top!
  const aiTask = scanData ? {
    id: 'ai-1', title: scanData.task, crop: scanData.crop, icon: Sparkles, color: 'text-primary', bg: 'bg-primary/10', date: 'Today (AI Prescribed)', affectedByRain: false
  } : null

  const tasks = aiTask ? [aiTask, ...defaultTasks] : defaultTasks

  return (
    <section className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-secondary">
          <CalendarClock className="size-5 text-primary" />
        </span>
        <div>
          <h2 className="text-base font-bold text-foreground">Smart Schedule Planner</h2>
          <p className="text-xs text-muted-foreground">Upcoming tasks & field milestones</p>
        </div>
      </div>
      
      <ul className="flex flex-col gap-3 mt-2">
        {tasks.map(task => {
          const isDone = completed.includes(task.id)
          const Icon = task.icon
          return (
            <li key={task.id} className={`flex items-center gap-4 rounded-2xl border p-4 transition-all ${isDone ? 'border-border bg-secondary/20 opacity-60' : 'border-border bg-secondary/40 hover:border-primary'}`}>
              <button onClick={() => toggleTask(task.id)} className="shrink-0 transition-transform hover:scale-110">
                {isDone ? <CheckCircle2 className="size-6 text-primary" /> : <Circle className="size-6 text-muted-foreground" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`truncate text-sm font-bold ${isDone ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{task.title}</p>
                <p className="truncate text-xs text-muted-foreground mt-0.5">{task.crop}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${task.affectedByRain && rainDelayActive ? 'bg-amber-500/10 text-amber-600' : task.bg + ' ' + task.color}`}>
                  {task.date}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}