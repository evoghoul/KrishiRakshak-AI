'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Bug, CloudLightning, ChevronRight, Loader2 } from 'lucide-react'
import { db } from '@/lib/firebase'
import { collection, onSnapshot, query } from 'firebase/firestore'

interface FirestoreAlert {
  id: string
  title: string
  subtitle: string
  urgency: 'urgent' | 'warning' | 'info'
  icon: string
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<FirestoreAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen to real-time updates from the "alerts" collection
    const q = query(collection(db, 'alerts'))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedAlerts: FirestoreAlert[] = []
      snapshot.forEach((doc) => {
        fetchedAlerts.push({ id: doc.id, ...doc.data() } as FirestoreAlert)
      })
      
      // Sort so urgent is at the top
      fetchedAlerts.sort((a, b) => {
        const weight = { urgent: 3, warning: 2, info: 1 }
        return weight[b.urgency] - weight[a.urgency]
      })
      
      setAlerts(fetchedAlerts)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching alerts:", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const activeWarningsCount = alerts.filter(a => a.urgency === 'urgent' || a.urgency === 'warning').length

  return (
    <section className="flex h-full flex-col rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-lg bg-destructive/10">
          <AlertTriangle className="size-5 text-destructive" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-bold text-foreground">Urgent Alerts</h2>
          <p className="text-xs text-muted-foreground">
            {loading ? 'Syncing...' : `${activeWarningsCount} active pest/weather warnings`}
          </p>
        </div>
      </div>

      <ul className="mt-4 flex flex-1 flex-col gap-3">
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            No active alerts at the moment.
          </div>
        ) : (
          alerts.map((alert) => {
            const Icon = alert.icon === 'CloudLightning' ? CloudLightning : Bug
            const isUrgent = alert.urgency === 'urgent'
            
            return (
              <li key={alert.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-2xl border border-border bg-background p-3 text-left transition-colors hover:border-primary/40 hover:bg-secondary"
                >
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                      isUrgent
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-secondary text-primary'
                    }`}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      {alert.title}
                      {isUrgent && (
                        <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-destructive">
                          Urgent
                        </span>
                      )}
                    </span>
                    <span className="text-xs leading-relaxed text-muted-foreground">{alert.subtitle}</span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </button>
              </li>
            )
          })
        )}
      </ul>
    </section>
  )
}
