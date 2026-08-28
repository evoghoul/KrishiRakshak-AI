'use client'

import { useEffect, useState } from 'react'
import { Check, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Language {
  code: string
  label: string
  native: string
}

const LANGUAGES: Language[] = [
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
]

interface LanguageModalProps {
  open: boolean
  onSelect: (language: Language) => void
}

type MicState = 'idle' | 'listening' | 'detected'

export function LanguageModal({ open, onSelect }: LanguageModalProps) {
  const [micState, setMicState] = useState<MicState>('idle')
  const [detected, setDetected] = useState<Language | null>(null)

  useEffect(() => {
    if (!open) {
      setMicState('idle')
      setDetected(null)
    }
  }, [open])

  function handleMicTap() {
    if (micState === 'listening') return
    setMicState('listening')
    // Simulate speech capture + language detection
    setTimeout(() => {
      const guess = LANGUAGES[Math.floor(Math.random() * 3)] // te / hi / en
      setDetected(guess)
      setMicState('detected')
    }, 2600)
  }

  function confirm(language: Language) {
    setDetected(language)
    setMicState('detected')
    setTimeout(() => onSelect(language), 450)
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Choose your language"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B5E20]/40 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-2xl">
        <h2 className="text-xl font-bold text-foreground">
          Speak your language
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
          Tap the mic and speak your language
          <br />
          <span className="text-foreground/70">
            (e.g., Telugu, Hindi, English)
          </span>
        </p>

        {/* Mic + pulsing rings + soundwaves */}
        <div className="relative mx-auto my-10 flex size-44 items-center justify-center">
          {micState === 'idle' && (
            <>
              <span className="absolute size-28 rounded-full bg-primary/30 animate-mic-ring" />
              <span
                className="absolute size-28 rounded-full bg-primary/20 animate-mic-ring"
                style={{ animationDelay: '1s' }}
              />
            </>
          )}

          {micState === 'listening' && (
            <span className="absolute size-40 rounded-full bg-primary/10 animate-pulse" />
          )}

          <button
            type="button"
            onClick={handleMicTap}
            aria-label={
              micState === 'listening'
                ? 'Listening to your voice'
                : 'Tap to speak your language'
            }
            className={cn(
              'relative flex size-28 items-center justify-center rounded-full text-primary-foreground shadow-lg transition-transform',
              micState === 'detected'
                ? 'bg-primary'
                : 'bg-primary hover:scale-105 active:scale-95',
            )}
          >
            {micState === 'detected' ? (
              <Check className="size-11" aria-hidden="true" />
            ) : micState === 'listening' ? (
              <Soundwaves />
            ) : (
              <Mic className="size-11" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Status line */}
        <p
          className="min-h-6 text-sm font-medium text-foreground"
          aria-live="polite"
        >
          {micState === 'idle' && 'Tap the microphone to begin'}
          {micState === 'listening' && 'Listening…'}
          {micState === 'detected' && detected && (
            <span className="text-primary">
              Detected {detected.label} ({detected.native}) — setting up…
            </span>
          )}
        </p>

        {/* Manual fallback selection */}
        <div className="mt-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            or choose manually
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => confirm(lang)}
                className={cn(
                  'flex flex-col items-center rounded-xl border border-border bg-secondary/50 px-2 py-2.5 transition hover:border-primary hover:bg-secondary',
                  detected?.code === lang.code &&
                    'border-primary bg-secondary ring-2 ring-primary/30',
                )}
              >
                <span className="text-sm font-semibold text-foreground">
                  {lang.native}
                </span>
                <span className="text-xs text-muted-foreground">
                  {lang.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Soundwaves() {
  const bars = [0, 1, 2, 3, 4]
  return (
    <div
      className="flex h-11 items-center gap-1.5"
      aria-hidden="true"
    >
      {bars.map((i) => (
        <span
          key={i}
          className="w-1.5 rounded-full bg-primary-foreground animate-soundwave"
          style={{
            height: '100%',
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  )
}
