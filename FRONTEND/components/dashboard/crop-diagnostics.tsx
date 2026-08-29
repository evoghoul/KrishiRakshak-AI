'use client'

import { useState } from 'react'
import { Activity, AlertTriangle, CheckCircle2, Bug, ScanLine, X, Sparkles } from 'lucide-react'

export function CropDiagnostics({ scanData }: { scanData: any }) {
  // Empty State: Awaiting Scan
  if (!scanData) {
    return (
      <section id="crop-diagnostics-section" className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-secondary">
            <Activity className="size-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-bold text-foreground">Crop Health & Alerts</h2>
            <p className="text-xs text-muted-foreground">Awaiting AI vision scan</p>
          </div>
        </div>
        
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/30 p-8 text-center">
          <ScanLine className="size-12 text-muted-foreground/30 mb-3 animate-pulse" />
          <p className="text-sm font-bold text-foreground">Upload a leaf photo</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
            AI diagnostic results and disease identification will appear here once the scan is complete.
          </p>
        </div>
      </section>
    )
  }

  // Invalid State: Non-Plant Uploaded
  if (scanData && scanData.is_plant === false) {
    return (
      <section className="flex flex-col rounded-3xl border border-amber-500/30 bg-card p-6 shadow-sm animate-in fade-in duration-300">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <AlertTriangle className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Invalid Subject Detected
              </h2>
              <p className="text-xs text-muted-foreground">AI Vision Validation Notice</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-600">
            Not a Plant
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 mb-3">
            <AlertTriangle className="size-7" />
          </div>
          <h3 className="text-sm font-extrabold text-foreground mb-1">
            No Agricultural Foliage Detected
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
            {scanData.message || 'This photo does not appear to be an agricultural plant or crop leaf. Please upload a clear, focused photo of a crop leaf for diagnosis.'}
          </p>
          <div className="mt-4 flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground bg-background/80 rounded-xl p-3 border border-border max-w-xs mx-auto text-left">
            <span>✅ Upload: Tomato, Paddy, Cotton, Chilli, Wheat leaf</span>
            <span>❌ Avoid: Animals, furniture, human faces, blurry shots</span>
          </div>
        </div>
      </section>
    )
  }

  // Active State: Real AI Data Received
  const conditionStr = (scanData.condition || '').toLowerCase()
  const isHealthy = conditionStr.includes('healthy') || conditionStr.includes('unknown disease')
  
  const style = isHealthy
    ? { icon: CheckCircle2, badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', dot: 'bg-emerald-500' }
    : { icon: Bug, badge: 'bg-rose-500/10 text-rose-600 border-rose-500/20', dot: 'bg-rose-500' }
    
  const Icon = style.icon

  return (
    <section className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Activity className="size-5" aria-hidden="true" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">Crop Health & Alerts</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                <Sparkles className="size-2.5" /> {(scanData.confidence * 100).toFixed(1)}% Match
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Pathology analysis complete</p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider border ${style.badge}`}>
          <span className={`size-2 rounded-full ${style.dot} animate-ping`} />
          {isHealthy ? 'Healthy' : 'Diseased'}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {/* Identified Crop & Disease Card */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 p-4">
          <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border ${style.badge}`}>
            <Icon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold uppercase tracking-wider text-muted-foreground">Crop Diagnosed</p>
            <p className="text-sm font-extrabold text-foreground truncate">{scanData.crop}</p>
            <p className={`text-xs font-semibold truncate mt-0.5 ${isHealthy ? 'text-emerald-600' : 'text-destructive'}`}>
              {scanData.condition}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}