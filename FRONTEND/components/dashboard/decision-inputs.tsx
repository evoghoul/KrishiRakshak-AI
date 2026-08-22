'use client'

import {
  Sprout,
  Scale,
  CalendarDays,
  IndianRupee,
  TrendingUp,
  Thermometer,
  Warehouse,
  Coins,
  MapPin,
  Users,
  AlertTriangle,
  BrainCircuit,
  RefreshCw
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLanguage, type SupportedLang } from '@/lib/language-context'

type Tone = 'neutral' | 'good' | 'warn' | 'bad'

type InputItem = {
  id: string
  icon: LucideIcon
  label: string
  value: string
  hint?: string
  tone?: Tone
}

const INPUTS_TRANSLATIONS: Record<SupportedLang, any> = {
  en: {
    title: 'Decision Inputs',
    subtitle: 'Live data feeding the AI engine',
    runBtn: 'Run Analysis',
    analyzingBtn: 'Analyzing...',
    labels: {
      crop: 'Crop',
      volume: 'Quantity',
      harvestDate: 'Harvested',
      currentPrice: 'Current Price',
      expectedPrice: 'Expected in 3 days',
      tempHumidity: 'Temp / Humidity',
      storageAvailable: 'Storage Available',
      storageCost: 'Storage Cost',
      distance: 'Distance to Market',
      buyerDemand: 'Buyer Demand',
      spoilageProb: 'Spoilage Probability',
    },
    hints: {
      hybrid: 'Hybrid',
      fresh: 'Fresh',
      humid: 'High humidity',
      perishable: 'Perishable',
    }
  },
  te: {
    title: 'నిర్ణయం కోసం వివరాలు',
    subtitle: 'AI ఇంజిన్‌కు వెళ్తున్న ప్రత్యక్ష డేటా',
    runBtn: 'విశ్లేషణ ప్రారంభించండి',
    analyzingBtn: 'విశ్లేషిస్తోంది...',
    labels: {
      crop: 'పంట',
      volume: 'పరిమాణం',
      harvestDate: 'కోత తేదీ',
      currentPrice: 'ప్రస్తుత ధర',
      expectedPrice: '3 రోజుల్లో అంచనా',
      tempHumidity: 'ఉష్ణోగ్రత / తేమ',
      storageAvailable: 'నిల్వ అవకాశం',
      storageCost: 'నిల్వ ఖర్చు',
      distance: 'మార్కెట్ దూరం',
      buyerDemand: 'కొనుగోలుదారుల డిమాండ్',
      spoilageProb: 'పాడయ్యే అవకాశం',
    },
    hints: {
      hybrid: 'హైబ్రిడ్',
      fresh: 'తాజా',
      humid: 'అధిక తేమ',
      perishable: 'త్వరగా పాడవుతుంది',
    }
  },
  hi: {
    title: 'निर्णय के लिए इनपुट',
    subtitle: 'AI इंजन को फीड हो रहा लाइव डेटा',
    runBtn: 'विश्लेषण चलाएँ',
    analyzingBtn: 'विश्लेषण हो रहा है...',
    labels: {
      crop: 'फसल',
      volume: 'मात्रा',
      harvestDate: 'कटाई की तारीख',
      currentPrice: 'वर्तमान मूल्य',
      expectedPrice: '3 दिनों में अनुमानित',
      tempHumidity: 'तापमान / नमी',
      storageAvailable: 'भंडारण उपलब्ध',
      storageCost: 'भंडारण लागत',
      distance: 'बाजार की दूरी',
      buyerDemand: 'खरीदार की मांग',
      spoilageProb: 'खराब होने की संभावना',
    },
    hints: {
      hybrid: 'हाइब्रिड',
      fresh: 'ताज़ा',
      humid: 'उच्च नमी',
      perishable: 'जल्दी खराब होने वाला',
    }
  }
} as any

export function DecisionInputs({ data, setData, onCalculate, isCalculating }: any) {
  const { lang } = useLanguage()
  const t = INPUTS_TRANSLATIONS[lang] || INPUTS_TRANSLATIONS.en

  // We map the master data dynamically to your beautiful UI cards using the translated strings
  const ITEMS: InputItem[] = [
    { id: 'crop', icon: Sprout, label: t.labels.crop, value: data.crop, hint: t.hints.hybrid },
    { id: 'volume', icon: Scale, label: t.labels.volume, value: `${data.volume} kg` },
    { id: 'harvestDate', icon: CalendarDays, label: t.labels.harvestDate, value: data.harvestDate, hint: t.hints.fresh },
    { id: 'currentPrice', icon: IndianRupee, label: t.labels.currentPrice, value: `₹${data.currentPrice}/kg` },
    { id: 'expectedPrice', icon: TrendingUp, label: t.labels.expectedPrice, value: `₹${data.expectedPrice}/kg`, hint: '+30%', tone: 'good' },
    { id: 'tempHumidity', icon: Thermometer, label: t.labels.tempHumidity, value: data.tempHumidity, hint: t.hints.humid, tone: 'warn' },
    { id: 'storageAvailable', icon: Warehouse, label: t.labels.storageAvailable, value: data.storageAvailable, tone: 'good' },
    { id: 'storageCost', icon: Coins, label: t.labels.storageCost, value: `₹${data.storageCost}/kg/day` },
    { id: 'distance', icon: MapPin, label: t.labels.distance, value: `${data.distance} km` },
    { id: 'buyerDemand', icon: Users, label: t.labels.buyerDemand, value: data.buyerDemand, tone: 'good' },
    { id: 'spoilageProb', icon: AlertTriangle, label: t.labels.spoilageProb, value: data.spoilageProb, hint: t.hints.perishable, tone: 'bad' },
  ]

  const TONE_STYLES: Record<Tone, string> = {
    neutral: 'text-foreground',
    good: 'text-primary',
    warn: 'text-amber-500',
    bad: 'text-destructive',
  }

  return (
    <section
      aria-labelledby="inputs-heading"
      className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-secondary">
            <Scale className="size-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h2 id="inputs-heading" className="text-lg font-bold text-foreground">
              {t.title}
            </h2>
            <p className="text-xs text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>

        {/* The Action Button to trigger the AI Engine */}
        <button
          onClick={onCalculate}
          disabled={isCalculating}
          className={`flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-md transition-all ${
            isCalculating ? 'opacity-80 scale-95' : 'hover:scale-105 hover:bg-primary/90'
          }`}
        >
          {isCalculating ? (
            <RefreshCw className="size-4 animate-spin" />
          ) : (
            <BrainCircuit className="size-4" />
          )}
          {isCalculating ? t.analyzingBtn : t.runBtn}
        </button>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 max-h-[500px] overflow-y-auto pr-2 pb-2">
        {ITEMS.map((item) => {
          const Icon = item.icon
          const tone = item.tone ?? 'neutral'
          return (
            <div
              key={item.id}
              className="group flex items-start gap-3 rounded-2xl border border-border bg-background p-4 transition-colors hover:border-primary/50 relative overflow-hidden cursor-text"
            >
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary transition-colors group-hover:bg-primary/10">
                <Icon className="size-4 text-primary" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                {/* 
                  Editable Inputs: We allow the user to click and type a new value, 
                  which dynamically updates the master 'data' state! 
                */}
                <input 
                  type="text"
                  value={data[item.id] || item.value.replace(/[^0-9a-zA-Z. ]/g, '')} // Clean value for editing, preserved your logic
                  onChange={(e) => setData({ ...data, [item.id]: e.target.value })}
                  className={`mt-0.5 w-full bg-transparent text-base font-bold outline-none focus:border-b focus:border-primary transition-all ${TONE_STYLES[tone]}`}
                />
                {item.hint ? (
                  <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}