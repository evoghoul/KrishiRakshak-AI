'use client'

import { useRef, useState } from 'react'
import { Camera, Upload, ScanLine, X, ArrowDownLeft, RefreshCw, CheckCircle2 } from 'lucide-react'

export function ScanCrop({ onScanComplete }: { onScanComplete: (data: any) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  function handleFiles(files: FileList | null) {
    if (files && files.length > 0) {
      const file = files[0]
      setFileName(file.name)
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
      setIsComplete(false)
    }
  }

  const handleDiagnose = async () => {
    if (!selectedFile) return
    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append('crop_image', selectedFile)

      const response = await fetch('http://localhost:8000/api/scan', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.status === 'success') {
        onScanComplete(data.data)
        setIsComplete(true)
      }
    } catch (error) {
      console.error("AI Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <section className="relative flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-secondary">
          <ScanLine className="size-5 text-primary" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-bold text-foreground">Scan Crop for Diseases</h2>
          <p className="text-xs text-muted-foreground">Upload photo of affected leaves</p>
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        className={`flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          dragging ? 'border-primary bg-secondary' : 'border-border bg-secondary/40'
        }`}
      >
        {fileName ? (
          <div className="flex flex-col items-center w-full animate-in zoom-in duration-300">
            {imagePreview && (
              <div className="relative h-40 w-40 overflow-hidden rounded-2xl border-2 border-border shadow-md mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Crop Leaf" className="object-cover w-full h-full" />
              </div>
            )}
            
            <p className="text-sm font-semibold text-foreground truncate max-w-[200px] mb-4">{fileName}</p>

            {isComplete ? (
              <div className="flex flex-col items-center gap-2 text-primary">
                <CheckCircle2 className="size-8" />
                <span className="text-sm font-bold">Analysis Complete!</span>
                <span className="text-xs text-muted-foreground">Check the Diagnostics panel.</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleDiagnose}
                disabled={isAnalyzing}
                className={`flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md transition-all ${
                  isAnalyzing ? 'opacity-80 scale-95' : 'hover:scale-105'
                }`}
              >
                {isAnalyzing ? <><RefreshCw className="size-4 animate-spin" /> Processing via AI...</> : 'Diagnose Now'}
              </button>
            )}
          </div>
        ) : (
          <>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
              <Upload className="size-7 text-primary" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Drag &amp; drop a leaf photo</p>
            </div>
            <div className="flex gap-3 w-full max-w-[250px]">
              <button onClick={() => cameraRef.current?.click()} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm">
                <Camera className="size-4" /> Camera
              </button>
              <button onClick={() => inputRef.current?.click()} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm hover:bg-secondary">
                <Upload className="size-4" /> File
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