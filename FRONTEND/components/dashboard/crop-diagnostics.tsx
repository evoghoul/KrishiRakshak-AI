'use client'

import { useState } from 'react'
import { Activity, AlertTriangle, CheckCircle2, Bug, ScanLine, FileText, X } from 'lucide-react'

export function CropDiagnostics({ scanData }: { scanData: any }) {
  const [modalOpen, setModalOpen] = useState(false)

  // Empty State: Awaiting Scan
  if (!scanData) {
    return (
      <section className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-secondary">
            <Activity className="size-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-bold text-foreground">Crop Health & Alerts</h2>
            <p className="text-xs text-muted-foreground">Awaiting AI vision scan</p>
          </div>
        </div>
        
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/40 p-8 text-center">
          <ScanLine className="size-12 text-muted-foreground/30 mb-3 animate-pulse" />
          <p className="text-sm font-bold text-foreground">Upload a leaf photo</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
            AI diagnostic results and field alerts will appear here once the scan is complete.
          </p>
        </div>
      </section>
    )
  }

  // Active State: Real AI Data Received
  const level = scanData.status.toLowerCase()
  const style = level === 'healthy' ? { icon: CheckCircle2, badge: 'bg-primary/10 text-primary', dot: 'bg-primary' }
              : level === 'risk' ? { icon: Bug, badge: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' }
              : { icon: AlertTriangle, badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' }
  const Icon = style.icon

  return (
    <section className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-secondary">
          <Activity className="size-5 text-primary" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-bold text-foreground">AI Vision Results</h2>
          <p className="text-xs text-muted-foreground">Live diagnostic completed</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-primary/40 bg-primary/5 p-4">
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${style.badge}`}>
            <Icon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">{scanData.crop}</p>
            <p className="truncate text-xs text-muted-foreground">{scanData.disease}</p>
          </div>
          <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${style.badge}`}>
            <span className={`size-1.5 rounded-full ${style.dot}`} />
            {scanData.status}
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-secondary/40 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wide text-foreground mb-1">Recommended Action</h4>
          <p className="text-sm font-medium text-muted-foreground leading-relaxed">{scanData.treatment}</p>
        </div>
      </div>

      <button onClick={() => setModalOpen(true)} className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 shadow-sm transition-all">
        <FileText className="size-4" /> View Full Pathologist Report
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-lg font-bold text-foreground">Detailed AI Analysis</h3>
              <button onClick={() => setModalOpen(false)} className="rounded-full p-2 hover:bg-secondary"><X className="size-5" /></button>
            </div>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="text-sm leading-relaxed text-foreground">{scanData.details}</p>
              </div>
            </div>
            <button onClick={() => setModalOpen(false)} className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground">
              Close Report
            </button>
          </div>
        </div>
      )}
    </section>
  )
}