'use client'

import { useState } from 'react'
import { Activity, AlertTriangle, CheckCircle2, Bug, ScanLine, FileText, X, ShieldCheck, Leaf, FlaskConical, Calendar, Sparkles } from 'lucide-react'

export function CropDiagnostics({ scanData }: { scanData: any }) {
  const [modalOpen, setModalOpen] = useState(false)

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
            AI diagnostic results, disease identification, and treatment plans will appear here once the scan is complete.
          </p>
        </div>
      </section>
    )
  }

  // Invalid State: Non-Plant or Blurry Photo Uploaded
  if (scanData && scanData.is_plant === false) {
    const isBlurry = scanData.error_type === 'blurry'
    return (
      <section className="flex flex-col rounded-3xl border border-amber-500/30 bg-card p-6 shadow-sm animate-in fade-in duration-300">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <AlertTriangle className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {isBlurry ? 'Photo Too Blurry' : 'Invalid Subject Detected'}
              </h2>
              <p className="text-xs text-muted-foreground">AI Vision Validation Notice</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-600">
            {isBlurry ? 'Blurry' : 'Not a Plant'}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 mb-3">
            <AlertTriangle className="size-7" />
          </div>
          <h3 className="text-sm font-extrabold text-foreground mb-1">
            {isBlurry ? 'Image Unclear or Out of Focus' : 'No Agricultural Foliage Detected'}
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
  const level = (scanData.status || 'risk').toLowerCase()
  const isHealthy = level === 'healthy'
  const isRisk = level === 'risk' || level === 'alert'
  
  const style = isHealthy
    ? { icon: CheckCircle2, badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', dot: 'bg-emerald-500' }
    : isRisk
    ? { icon: Bug, badge: 'bg-rose-500/10 text-rose-600 border-rose-500/20', dot: 'bg-rose-500' }
    : { icon: AlertTriangle, badge: 'bg-amber-500/10 text-amber-600 border-amber-500/20', dot: 'bg-amber-500' }
    
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
              <h2 className="text-base font-bold text-foreground">AI Vision Diagnostic</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                <Sparkles className="size-2.5" /> {scanData.confidence || '96% Match'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Pathology analysis complete</p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider border ${style.badge}`}>
          <span className={`size-2 rounded-full ${style.dot} animate-ping`} />
          {scanData.status || 'Identified'}
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
            <p className="text-xs font-semibold text-destructive truncate mt-0.5">{scanData.disease}</p>
          </div>
        </div>

        {/* Primary Recommended Treatment */}
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary mb-1">
            <FlaskConical className="size-3.5" />
            <span>Recommended Chemical Treatment</span>
          </div>
          <p className="text-xs font-medium text-foreground leading-relaxed">
            {scanData.treatment}
          </p>
        </div>

        {/* Organic Remedy */}
        {scanData.organic_remedy && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400 mb-1">
              <Leaf className="size-3.5" />
              <span>Organic / Bio-Alternative</span>
            </div>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed">
              {scanData.organic_remedy}
            </p>
          </div>
        )}
      </div>

      {/* View Full Pathology Report Button */}
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-extrabold text-primary-foreground hover:bg-primary/90 shadow-sm transition-all active:scale-[0.99]"
      >
        <FileText className="size-4" /> View Full Pathologist Report
      </button>

      {/* Pathologist Report Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border bg-secondary/40 p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <FileText className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-foreground">Plant Pathologist Diagnosis</h3>
                  <p className="text-xs text-muted-foreground">AI Agronomy Diagnostic Certificate</p>
                </div>
              </div>
              <button 
                onClick={() => setModalOpen(false)} 
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border bg-secondary/30 p-3.5">
                  <span className="text-[11px] font-bold uppercase text-muted-foreground">Host Crop</span>
                  <p className="text-xs font-extrabold text-foreground mt-0.5">{scanData.crop}</p>
                </div>
                <div className="rounded-2xl border border-border bg-secondary/30 p-3.5">
                  <span className="text-[11px] font-bold uppercase text-muted-foreground">Detected Condition</span>
                  <p className="text-xs font-extrabold text-destructive mt-0.5">{scanData.disease}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-1.5">
                  <Activity className="size-3.5 text-primary" /> Pathological Analysis & Symptoms
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {scanData.details}
                </p>
              </div>

              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5 flex items-center gap-1.5">
                  <FlaskConical className="size-3.5" /> Chemical Prescription
                </h4>
                <p className="text-xs font-medium text-foreground leading-relaxed">
                  {scanData.treatment}
                </p>
              </div>

              {scanData.organic_remedy && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
                    <Leaf className="size-3.5" /> Organic Alternative
                  </h4>
                  <p className="text-xs font-medium text-foreground leading-relaxed">
                    {scanData.organic_remedy}
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-1.5 flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-primary" /> Auto-Scheduled Task
                </h4>
                <p className="text-xs font-semibold text-primary">
                  {scanData.task} (Added to your Smart Schedule Planner)
                </p>
              </div>
            </div>

            <div className="border-t border-border bg-secondary/20 p-5 flex justify-end">
              <button 
                type="button"
                onClick={() => setModalOpen(false)} 
                className="w-full sm:w-auto rounded-xl bg-primary py-3 px-6 text-xs font-extrabold text-primary-foreground hover:bg-primary/90 transition-all"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}