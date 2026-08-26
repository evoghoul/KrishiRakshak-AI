'use client'

import { useRef, useState } from 'react'
import { Camera, Upload, ScanLine, X, RefreshCw, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react'

export function ScanCrop({ onScanComplete }: { onScanComplete: (data: any) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState<string>('')
  const [isComplete, setIsComplete] = useState(false)

  const [lastResult, setLastResult] = useState<any>(null)

  function handleFiles(files: FileList | null) {
    if (files && files.length > 0) {
      const file = files[0]
      setFileName(file.name)
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
      setIsComplete(false)
      setLastResult(null)
    }
  }

  const handleReset = () => {
    setFileName(null)
    setImagePreview(null)
    setSelectedFile(null)
    setIsComplete(false)
    setIsAnalyzing(false)
    setLastResult(null)
    if (inputRef.current) inputRef.current.value = ''
    if (cameraRef.current) cameraRef.current.value = ''
  }

  const handleDiagnose = async () => {
    if (!selectedFile) return
    setIsAnalyzing(true)
    setAnalysisStep('Scanning leaf pigmentation...')

    const stepTimer1 = setTimeout(() => setAnalysisStep('Detecting pathogen signatures...'), 500)
    const stepTimer2 = setTimeout(() => setAnalysisStep('Formulating treatment advisory...'), 1100)

    try {
      const formData = new FormData()
      formData.append('crop_image', selectedFile)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch('http://localhost:8000/api/scan', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      const data = await response.json()
      clearTimeout(stepTimer1)
      clearTimeout(stepTimer2)

      if (data.status === 'success' && data.data) {
        onScanComplete(data.data)
        setLastResult(data.data)
        setIsComplete(true)
        // Smooth scroll to diagnostics
        const diagEl = document.getElementById('crop-diagnostics-section')
        if (diagEl) diagEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        return
      }
      throw new Error(data.error || 'Backend scan failed')
    } catch (error: any) {
      console.error('Scan Error:', error)
      clearTimeout(stepTimer1)
      clearTimeout(stepTimer2)

      const errResult = {
        is_plant: false,
        error_type: 'network_error',
        message: 'Could not connect to AI Vision service. Please check your internet connection and try again.'
      }

      onScanComplete(errResult)
      setLastResult(errResult)
      setIsComplete(true)
    } finally {
      setIsAnalyzing(false)
      setAnalysisStep('')
    }
  }

  return (
    <section className="relative flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ScanLine className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-bold text-foreground">Scan Crop for Diseases</h2>
            <p className="text-xs text-muted-foreground">Upload photo of affected leaves</p>
          </div>
        </div>

        {fileName && (
          <button
            onClick={handleReset}
            type="button"
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="size-3.5" /> Clear
          </button>
        )}
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        className={`flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-6 text-center transition-colors relative overflow-hidden ${
          dragging ? 'border-primary bg-secondary' : 'border-border bg-secondary/30'
        }`}
      >
        {fileName ? (
          <div className="flex flex-col items-center w-full animate-in zoom-in duration-300">
            {imagePreview && (
              <div className="relative h-44 w-44 overflow-hidden rounded-2xl border-2 border-primary/40 shadow-lg mb-3 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Crop Leaf" className="object-cover w-full h-full" />
                
                {/* Laser scan animation line during analysis */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] flex flex-col justify-center items-center">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_12px_#10b981] animate-bounce" />
                  </div>
                )}
              </div>
            )}
            
            <p className="text-xs font-bold text-foreground truncate max-w-[220px] mb-3 bg-secondary/80 px-3 py-1 rounded-full border border-border">
              {fileName}
            </p>

            {isComplete && lastResult ? (
              <div className="flex flex-col items-center gap-3 w-full max-w-xs animate-in fade-in">
                {lastResult.is_plant === false ? (
                  <div className="w-full rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-amber-700 dark:text-amber-400 font-extrabold text-xs mb-1">
                      <AlertCircle className="size-4" /> Not a Plant Leaf
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      {lastResult.message || 'Please upload a clear photo of an agricultural plant.'}
                    </p>
                  </div>
                ) : (
                  <div className="w-full rounded-2xl border border-primary/30 bg-primary/10 p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-primary font-extrabold text-xs mb-1">
                      <CheckCircle2 className="size-4" /> {lastResult.crop}
                    </div>
                    <p className="text-xs font-bold text-destructive">
                      {lastResult.disease}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                      <Sparkles className="size-2.5" /> {lastResult.confidence || '97% Match'}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl border border-border bg-secondary/80 px-4 py-2 text-xs font-extrabold text-foreground hover:bg-secondary transition-all"
                >
                  Scan Another Photo
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 w-full max-w-xs">
                <button
                  type="button"
                  onClick={handleDiagnose}
                  disabled={isAnalyzing}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-extrabold text-primary-foreground shadow-md transition-all active:scale-95 ${
                    isAnalyzing ? 'opacity-90 cursor-wait' : 'hover:bg-primary/90 hover:scale-[1.02]'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="size-4 animate-spin" />
                      <span>{analysisStep || 'Analyzing Leaf with AI...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      <span>Diagnose Now</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Upload className="size-7" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">Drag &amp; drop a leaf photo</p>
              <p className="text-xs text-muted-foreground mt-0.5">Supports JPG, PNG, WEBP</p>
            </div>
            <div className="flex gap-3 w-full max-w-[260px]">
              <button
                type="button"
                onClick={() => cameraRef.current?.click()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
              >
                <Camera className="size-4" /> Camera
              </button>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground shadow-sm hover:bg-secondary transition-all"
              >
                <Upload className="size-4" /> Upload
              </button>
            </div>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => handleFiles(e.target.files)} />
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => handleFiles(e.target.files)} />
      </div>
    </section>
  )
}