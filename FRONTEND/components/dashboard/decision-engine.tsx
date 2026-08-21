'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Warehouse,
  Zap,
  Factory,
  Users,
  CheckCircle2,
  Minus,
  Plus,
  Equal,
  Volume2,
  Square,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type ActionKey = 'store' | 'sell' | 'process' | 'pool'

type Action = {
  key: ActionKey
  label: string
  icon: LucideIcon
  verdict: string
  tagline: string
  recommended: boolean
  net: number
  narration: string
  breakdown: { label: string; value: number; kind: 'cost' | 'gain' }[]
}

const ACTIONS: Action[] = [
  {
    key: 'store',
    label: 'Store 2 Days',
    icon: Warehouse,
    verdict: 'STORE FOR 2 DAYS',
    tagline: 'Hold in cold storage, then sell at the price peak.',
    recommended: true,
    net: 18500,
    narration:
      'The AI recommends storing your 50 quintals of tomato for 2 days. Storage will cost 4,000 rupees, but the expected price gain is 22,500 rupees. That means a net profit increase of 18,500 rupees compared to selling today.',
    breakdown: [
      { label: 'Storage Cost (50Q × ₹40 × 2 days)', value: -4000, kind: 'cost' },
      { label: 'Expected Price Gain (₹450/Q × 50Q)', value: 22500, kind: 'gain' },
    ],
  },
  {
    key: 'sell',
    label: 'Sell Now',
    icon: Zap,
    verdict: 'SELL NOW',
    tagline: 'Immediate cash, zero storage risk.',
    recommended: false,
    net: 0,
    narration:
      'Selling now gives you 60,000 rupees today at 1,200 rupees per quintal, with no storage cost and no spoilage risk. But you miss the expected price rise over the next 3 days.',
    breakdown: [
      { label: 'Revenue Today (₹1,200/Q × 50Q)', value: 60000, kind: 'gain' },
      { label: 'Missed Price Gain vs storing', value: -18500, kind: 'cost' },
    ],
  },
  {
    key: 'process',
    label: 'Process',
    icon: Factory,
    verdict: 'PROCESS INTO PUREE',
    tagline: 'Convert to puree to beat 45% spoilage risk.',
    recommended: false,
    net: 12000,
    narration:
      'Processing your tomatoes into puree adds value and avoids the 45 percent spoilage risk, for an estimated net gain of 12,000 rupees. However, it requires processing time and access to a unit.',
    breakdown: [
      { label: 'Value-Add Revenue', value: 30000, kind: 'gain' },
      { label: 'Processing & Packaging Cost', value: -18000, kind: 'cost' },
    ],
  },
  {
    key: 'pool',
    label: 'Pool',
    icon: Users,
    verdict: 'POOL WITH VILLAGE',
    tagline: 'Join the village pool for a bulk price bonus.',
    recommended: false,
    net: 15000,
    narration:
      'Pooling with your village group unlocks a 12 percent bulk price bonus, for an estimated net gain of 15,000 rupees. This requires waiting until the pool reaches its target quantity.',
    breakdown: [
      { label: 'Bulk Price Bonus (12%)', value: 18000, kind: 'gain' },
      { label: 'Pool Logistics Share', value: -3000, kind: 'cost' },
    ],
  },
]

function formatSigned(value: number) {
  const sign = value < 0 ? '-' : '+'
  return `${sign}₹${Math.abs(value).toLocaleString('en-IN')}`
}

export function DecisionEngine() {
  const [active, setActive] = useState<ActionKey>('store')
  const [speaking, setSpeaking] = useState(false)
  const supportsSpeech = useRef(false)

  const action = ACTIONS.find((a) => a.key === active) ?? ACTIONS[0]

  useEffect(() => {
    supportsSpeech.current =
      typeof window !== 'undefined' && 'speechSynthesis' in window
    return () => {
      if (supportsSpeech.current) window.speechSynthesis.cancel()
    }
  }, [])

  // Stop narration when switching actions.
  useEffect(() => {
    if (supportsSpeech.current) window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [active])

  function toggleAudio() {
    if (!supportsSpeech.current) return
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    const utterance = new SpeechSynthesisUtterance(action.narration)
    utterance.rate = 0.95
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setSpeaking(true)
  }

  return (
    <section aria-labelledby="decision-heading" className="flex flex-col gap-4">
      <h2 id="decision-heading" className="sr-only">
        AI Decision
      </h2>

      {/* Alternative action tabs */}
      <div
        role="tablist"
        aria-label="Decision options"
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {ACTIONS.map((a) => {
          const Icon = a.icon
          const selected = a.key === active
          return (
            <button
              key={a.key}
              role="tab"
              aria-selected={selected}
              type="button"
              onClick={() => setActive(a.key)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-colors ${
                selected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground hover:bg-secondary'
              }`}
            >
              <Icon className="size-5" aria-hidden="true" />
              <span className="text-xs font-semibold leading-tight">{a.label}</span>
              {a.recommended ? (
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide ${
                    selected ? 'text-primary-foreground/90' : 'text-primary'
                  }`}
                >
                  AI Pick
                </span>
              ) : (
                <span className="text-[10px] font-medium uppercase tracking-wide opacity-0">
                  spacer
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Massive verdict banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-primary p-6 text-primary-foreground shadow-lg lg:p-8">
        <div
          className="pointer-events-none absolute -right-8 -top-10 size-48 rounded-full bg-primary-foreground/10 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/80">
            <Sparkles className="size-4" aria-hidden="true" />
            AI Verdict
          </div>
          <p className="mt-3 text-pretty text-4xl font-black leading-none tracking-tight lg:text-6xl">
            {action.verdict}
          </p>
          <p className="mt-4 max-w-md text-pretty text-sm text-primary-foreground/90 lg:text-base">
            {action.tagline}
          </p>
          {action.net > 0 ? (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-2 text-sm font-bold">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Net gain {formatSigned(action.net)} vs selling today
            </div>
          ) : (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-2 text-sm font-bold">
              Baseline option
            </div>
          )}
        </div>
      </div>

      {/* WHY explainable breakdown */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
              Why?
            </h3>
            <p className="text-xs text-muted-foreground">
              Transparent financial breakdown
            </p>
          </div>
          <button
            type="button"
            onClick={toggleAudio}
            aria-pressed={speaking}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {speaking ? (
              <>
                <Square className="size-4" aria-hidden="true" />
                Stop
              </>
            ) : (
              <>
                <Volume2 className="size-4" aria-hidden="true" />
                Play Audio
              </>
            )}
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {action.breakdown.map((row) => {
            const isCost = row.kind === 'cost'
            const RowIcon = isCost ? Minus : Plus
            return (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                      isCost
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-secondary text-primary'
                    }`}
                  >
                    <RowIcon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{row.label}</span>
                </div>
                <span
                  className={`text-base font-bold tabular-nums ${
                    isCost ? 'text-destructive' : 'text-primary'
                  }`}
                >
                  {formatSigned(row.value)}
                </span>
              </div>
            )
          })}

          {/* Net result */}
          <div className="mt-1 flex items-center justify-between gap-4 rounded-2xl border-2 border-primary/40 bg-secondary p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Equal className="size-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-bold text-foreground">
                {action.net > 0 ? 'Net Profit Increase' : 'Net Difference'}
              </span>
            </div>
            <span className="text-xl font-black tabular-nums text-primary">
              {formatSigned(action.net)}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
