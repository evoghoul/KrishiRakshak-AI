'use client'

import { useRef, useState } from 'react'
import { Camera, Upload, ScanLine, X, Leaf, ArrowDownLeft } from 'lucide-react'

export function ScanCrop() {
  const inputRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [showGuide, setShowGuide] = useState(true)

  function handleFiles(files: FileList | null) {
    if (files && files.length > 0) {
      setFileName(files[0].name)
      setShowGuide(false)
    }
  }

  return (
    <section
      aria-label="Scan crop for diseases"
      className="relative flex flex-col rounded-3xl border border-border bg-card p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-secondary">
            <ScanLine className="size-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-bold text-foreground">Scan Crop for Diseases</h2>
            <p className="text-xs text-muted-foreground">Upload or capture a photo of the affected leaves</p>
          </div>
        </div>
      </div>

      {/* Coach-mark tooltip pointing toward the AI Voice Guide in the sidebar (bottom-left) */}
      {showGuide && (
        <div className="pointer-events-none absolute -bottom-3 left-4 z-20 hidden -translate-x-2 translate-y-full lg:block">
          <div className="pointer-events-auto relative flex max-w-xs items-start gap-2 rounded-2xl bg-foreground px-4 py-3 text-background shadow-lg">
            <ArrowDownLeft className="mt-0.5 size-4 shrink-0 animate-bounce text-background" aria-hidden="true" />
            <p className="text-xs font-medium leading-snug text-balance">
              Click here to upload your diseased leaves
            </p>
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="ml-1 shrink-0 rounded-full p-0.5 text-background/70 transition-colors hover:text-background"
              aria-label="Dismiss guide"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
            <span className="absolute -top-1.5 left-8 size-3 rotate-45 bg-foreground" aria-hidden="true" />
          </div>
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={`flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          dragging ? 'border-primary bg-secondary' : 'border-border bg-secondary/40'
        }`}
      >
        {fileName ? (
          <>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
              <Leaf className="size-7 text-primary" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{fileName}</p>
              <p className="mt-1 text-xs text-muted-foreground">Ready to analyze</p>
            </div>
            <button
              type="button"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Diagnose Now
            </button>
          </>
        ) : (
          <>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
              <Upload className="size-7 text-primary" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Drag &amp; drop a leaf photo</p>
              <p className="mt-1 text-xs text-muted-foreground">or choose an option below</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => cameraRef.current?.click()}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Camera className="size-4" aria-hidden="true" />
                Take Photo
              </button>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <Upload className="size-4" aria-hidden="true" />
                Upload File
              </button>
            </div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
          aria-label="Upload crop image"
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
          aria-label="Capture crop image with camera"
        />
      </div>
    </section>
  )
}
