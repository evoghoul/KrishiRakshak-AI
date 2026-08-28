'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Warehouse, Zap, Factory, Users, CheckCircle2, Minus, Plus, Equal,
  Volume2, Square, Sparkles, BrainCircuit
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLanguage, type SupportedLang } from '@/lib/language-context'

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

const ENGINE_TRANSLATIONS: Record<SupportedLang, any> = {
  en: {
    aiPick: 'AI Pick',
    aiProcessing: 'AI is processing factors...',
    aiVerdict: 'AI Verdict',
    actionRecommended: 'Action Recommended',
    whyTitle: 'Why?',
    whySub: 'Transparent logic breakdown',
    playAudio: 'Play Audio',
    stopAudio: 'Stop',
    netGain: 'Estimated Net Gain',
    netDiff: 'Net Difference',
    tabs: {
      store: 'Store', sell: 'Sell Now', process: 'Process', pool: 'Pool'
    },
    verdicts: {
      store: 'STORE FOR 3 DAYS', sell: 'SELL IMMEDIATELY', process: 'PROCESS INTO PUREE', pool: 'POOL WITH VILLAGE'
    },
    narrations: {
      store: 'The AI recommends storing your crop. The expected market price surge outweighs your daily cold storage costs.',
      sell: 'Selling now gives you immediate cash. The market is trending down, making storage too risky.',
      process: 'High spoilage risk detected! Processing adds value and saves your crop from going to waste.',
      pool: 'Pooling unlocks a bulk seller bonus, reducing your high transport costs significantly.'
    },
    labels: {
      storageCost: 'Storage Cost (3 Days)',
      expGain: 'Expected Price Gain',
      revToday: 'Revenue Today',
      missedGain: 'Missed Price Gain vs Storing',
      valueAdd: 'Value-Add Revenue',
      processCost: 'Processing & Packaging Cost',
      bulkBonus: 'Bulk Price Bonus (15%)',
      poolLog: 'Pool Logistics Share'
    }
  },
  te: {
    aiPick: 'AI ఎంపిక',
    aiProcessing: 'AI విశ్లేషిస్తోంది...',
    aiVerdict: 'AI తీర్పు',
    actionRecommended: 'సిఫార్సు చేయబడిన చర్య',
    whyTitle: 'ఎందుకు?',
    whySub: 'పారదర్శక తర్కం విశ్లేషణ',
    playAudio: 'వాయిస్ వినండి',
    stopAudio: 'ఆపండి',
    netGain: 'అంచనా వేసిన నికర లాభం',
    netDiff: 'నికర వ్యత్యాసం',
    tabs: {
      store: 'నిల్వ చేయండి', sell: 'ఇప్పుడే అమ్మండి', process: 'ప్రాసెస్ చేయండి', pool: 'పూలింగ్'
    },
    verdicts: {
      store: '3 రోజులు నిల్వ చేయండి', sell: 'వెంటనే అమ్మేయండి', process: 'ప్యూరీగా మార్చండి', pool: 'గ్రామ రైతులతో కలవండి'
    },
    narrations: {
      store: 'పంటను నిల్వ చేయమని AI సిఫార్సు చేస్తోంది. మార్కెట్ ధర పెరుగుదల మీ నిల్వ ఖర్చుల కంటే ఎక్కువగా ఉంది.',
      sell: 'ఇప్పుడే అమ్మడం వల్ల తక్షణ నగదు వస్తుంది. మార్కెట్ తగ్గుముఖం పడుతోంది కాబట్టి నిల్వ చేయడం ప్రమాదకరం.',
      process: 'పాడయ్యే ప్రమాదం ఎక్కువగా ఉంది! ప్రాసెస్ చేయడం వల్ల విలువ పెరుగుతుంది మరియు పంట వృధా కాకుండా ఉంటుంది.',
      pool: 'పూలింగ్ చేయడం వల్ల బల్క్ బోనస్ వస్తుంది, మీ రవాణా ఖర్చులు బాగా తగ్గుతాయి.'
    },
    labels: {
      storageCost: 'నిల్వ ఖర్చు (3 రోజులు)',
      expGain: 'అంచనా వేసిన ధర లాభం',
      revToday: 'నేటి ఆదాయం',
      missedGain: 'నిల్వ చేయకపోవడం వల్ల కోల్పోయిన లాభం',
      valueAdd: 'అదనపు విలువ ఆదాయం',
      processCost: 'ప్రాసెసింగ్ & ప్యాకేజింగ్ ఖర్చు',
      bulkBonus: 'బల్క్ ధర బోనస్ (15%)',
      poolLog: 'రవాణా ఖర్చు వాటా'
    }
  },
  hi: {
    aiPick: 'AI की पसंद',
    aiProcessing: 'AI गणना कर रहा है...',
    aiVerdict: 'AI का निर्णय',
    actionRecommended: 'अनुशंसित कार्रवाई',
    whyTitle: 'क्यों?',
    whySub: 'पारदर्शी तर्क विश्लेषण',
    playAudio: 'ऑडियो सुनें',
    stopAudio: 'रोकें',
    netGain: 'अनुमानित शुद्ध लाभ',
    netDiff: 'शुद्ध अंतर',
    tabs: {
      store: 'स्टोर करें', sell: 'अभी बेचें', process: 'प्रोसेस करें', pool: 'पूलिंग करें'
    },
    verdicts: {
      store: '3 दिनों के लिए स्टोर करें', sell: 'तुरंत बेचें', process: 'प्यूरी में बदलें', pool: 'गांव के साथ पूल करें'
    },
    narrations: {
      store: 'AI आपकी फसल को स्टोर करने की सलाह देता है। अपेक्षित बाजार मूल्य में वृद्धि आपके भंडारण लागत से अधिक है।',
      sell: 'अभी बेचने से आपको तुरंत नकद मिलता है। बाजार नीचे जा रहा है, भंडारण बहुत जोखिम भरा है।',
      process: 'खराब होने का उच्च जोखिम! प्रोसेसिंग मूल्य जोड़ता है और आपकी फसल को बर्बाद होने से बचाता है।',
      pool: 'पूलिंग से थोक विक्रेता बोनस मिलता है, जिससे आपकी उच्च परिवहन लागत काफी कम हो जाती है।'
    },
    labels: {
      storageCost: 'भंडारण लागत (3 दिन)',
      expGain: 'अपेक्षित मूल्य लाभ',
      revToday: 'आज की आय',
      missedGain: 'स्टोर करने की तुलना में छूटा हुआ लाभ',
      valueAdd: 'मूल्य-वर्धित आय',
      processCost: 'प्रोसेसिंग और पैकेजिंग लागत',
      bulkBonus: 'थोक मूल्य बोनस (15%)',
      poolLog: 'पूल लॉजिस्टिक्स लागत'
    }
  }
} as any

function formatSigned(value: number) {
  const sign = value < 0 ? '-' : '+'
  return `${sign}₹${Math.abs(Math.round(value)).toLocaleString('en-IN')}`
}

// NOTICE: We added `data` to the props so it can read live inputs!
export function DecisionEngine({ data = {}, result, isCalculating }: any) {
  const { lang } = useLanguage()
  const t = ENGINE_TRANSLATIONS[lang] || ENGINE_TRANSLATIONS.en

  const [active, setActive] = useState<ActionKey>('store')
  const [speaking, setSpeaking] = useState(false)
  const supportsSpeech = useRef(false)

  // ============================================================================
  // DISPLAY LOGIC
  // ============================================================================

  const metrics = result?.metrics || { sell: 0, store: 0, process: 0, transport: 0, distance: 0 }
  const storeNet = metrics.store || 0
  const sellNet = metrics.sell || 0
  const processNet = metrics.process || 0

  // Dynamic Array mapping to our translated strings and live math
  const ACTIONS: Action[] = [
    {
      key: 'store', label: t.tabs.store, icon: Warehouse, verdict: t.verdicts.store,
      tagline: '', recommended: result?.status === 'store', net: storeNet, narration: t.narrations.store,
      breakdown: [
        { label: 'Estimated Future Revenue', value: storeNet + (metrics.transport || 0) + 500, kind: 'gain' },
        { label: 'Storage & Logistics', value: -((metrics.transport || 0) + 500), kind: 'cost' },
      ],
    },
    {
      key: 'sell', label: t.tabs.sell, icon: Zap, verdict: t.verdicts.sell,
      tagline: '', recommended: result?.status === 'sell', net: sellNet, narration: t.narrations.sell,
      breakdown: [
        { label: 'Market Revenue', value: sellNet + (metrics.transport || 0), kind: 'gain' },
        { label: 'Transport Cost', value: -(metrics.transport || 0), kind: 'cost' },
      ],
    },
    {
      key: 'process', label: t.tabs.process, icon: Factory, verdict: t.verdicts.process,
      tagline: '', recommended: result?.status === 'process', net: processNet, narration: t.narrations.process,
      breakdown: [
        { label: 'Value-Add Revenue', value: processNet + (metrics.transport || 0) + 1500, kind: 'gain' },
        { label: 'Processing & Logistics', value: -((metrics.transport || 0) + 1500), kind: 'cost' },
      ],
    }
  ]

  // Auto-switch tab when AI finishes calculating
  useEffect(() => {
    if (result && result.status) {
      setActive(result.status as ActionKey)
    } else {
      // Auto-select the best mathematical option if no AI override
      const bestAction = ACTIONS.reduce((prev, current) => (prev.net > current.net) ? prev : current)
      setActive(bestAction.key)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, data.volume, data.currentPrice, data.expectedPrice])

  const action = ACTIONS.find((a) => a.key === active) ?? ACTIONS[0]
  const displayVerdict = (result && result.status === active && result.action) ? result.action : action.verdict
  const displayNarration = (result && result.status === active && result.why) ? result.why : action.narration

  useEffect(() => {
    supportsSpeech.current = typeof window !== 'undefined' && 'speechSynthesis' in window
    return () => { if (supportsSpeech.current) window.speechSynthesis.cancel() }
  }, [])

  useEffect(() => {
    if (supportsSpeech.current) window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [active, lang])

  function toggleAudio() {
    if (!supportsSpeech.current) return
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    const utterance = new SpeechSynthesisUtterance(displayNarration)
    // Set appropriate accent based on selected language
    utterance.lang = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN'
    utterance.rate = 0.95
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setSpeaking(true)
  }

  if (!result && !isCalculating) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border border-border bg-card p-6 shadow-sm text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="relative rounded-full bg-primary/10 p-4">
            <BrainCircuit className="size-10 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">{t.aiVerdict}</h2>
        <p className="text-base text-muted-foreground max-w-sm">
          Tap <strong>&quot;Find Best Option&quot;</strong> to auto-calculate live Mandi rates, true logistics, and local storage costs.
        </p>
      </div>
    )
  }

  return (
    <section aria-labelledby="decision-heading" className="flex flex-col gap-4">
      <h2 id="decision-heading" className="sr-only">AI Decision</h2>

      {/* TABS */}
      <div role="tablist" aria-label="Decision options" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ACTIONS.map((a) => {
          const Icon = a.icon
          const selected = a.key === active
          return (
            <button
              key={a.key}
              role="tab"
              aria-selected={selected}
              disabled={isCalculating}
              type="button"
              onClick={() => setActive(a.key)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-colors ${
                selected
                  ? 'border-primary bg-primary text-primary-foreground shadow-md'
                  : 'border-border bg-card text-foreground hover:bg-secondary'
              } ${isCalculating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Icon className="size-5" aria-hidden="true" />
              <span className="text-xs font-semibold leading-tight">{a.label}</span>
              {selected ? (
                <span className="text-[10px] font-bold uppercase tracking-wide text-primary-foreground/90">
                  {t.aiPick}
                </span>
              ) : (
                <span className="text-[10px] font-medium uppercase tracking-wide opacity-0">spacer</span>
              )}
            </button>
          )
        })}
      </div>

      {/* MASSIVE VERDICT BANNER */}
      <div className={`relative overflow-hidden rounded-3xl border p-6 shadow-lg lg:p-8 transition-all duration-500 ${
        isCalculating ? 'bg-secondary border-border animate-pulse' : 'bg-primary border-primary/30 text-primary-foreground'
      }`}>
        <div className="pointer-events-none absolute -right-8 -top-10 size-48 rounded-full bg-primary-foreground/10 blur-2xl" aria-hidden="true" />
        <div className="relative">
          <div className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] ${isCalculating ? 'text-primary' : 'text-primary-foreground/80'}`}>
            {isCalculating ? <BrainCircuit className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {isCalculating ? t.aiProcessing : t.aiVerdict}
          </div>
          <p className={`mt-3 text-pretty text-3xl font-black leading-none tracking-tight lg:text-4xl ${isCalculating ? 'text-muted-foreground' : ''}`}>
            {isCalculating ? '...' : displayVerdict}
          </p>
          {!isCalculating && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-2 text-sm font-bold">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              {t.actionRecommended}
            </div>
          )}
        </div>
      </div>

      {/* WHY EXPLAINABLE BREAKDOWN */}
      <div className={`rounded-3xl border border-border bg-card p-6 transition-opacity duration-300 ${isCalculating ? 'opacity-50' : 'opacity-100'}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-foreground">{t.whyTitle}</h3>
            <p className="text-xs text-muted-foreground">{t.whySub}</p>
          </div>
          <button
            type="button"
            onClick={toggleAudio}
            disabled={isCalculating}
            aria-pressed={speaking}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
          >
            {speaking ? (
              <><Square className="size-4" aria-hidden="true" /> {t.stopAudio}</>
            ) : (
              <><Volume2 className="size-4" aria-hidden="true" /> {t.playAudio}</>
            )}
          </button>
        </div>

        {/* Dynamic AI Narration Text */}
        <div className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/20 text-sm font-medium leading-relaxed text-foreground">
          {displayNarration}
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {action.breakdown.map((row) => {
            const isCost = row.kind === 'cost'
            const RowIcon = isCost ? Minus : Plus
            return (
              <div key={row.label} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center gap-3">
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${isCost ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-primary'}`}>
                    <RowIcon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{row.label}</span>
                </div>
                <span className={`text-base font-bold tabular-nums ${isCost ? 'text-destructive' : 'text-primary'}`}>
                  {formatSigned(row.value)}
                </span>
              </div>
            )
          })}

          <div className="mt-1 flex items-center justify-between gap-4 rounded-2xl border-2 border-primary/40 bg-secondary p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Equal className="size-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-bold text-foreground">
                {action.net > 0 ? t.netGain : t.netDiff}
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