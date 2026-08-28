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

  // Highly visual options for Volume
  const volumeOptions = [
    { label: '1 Basket (~50 kg)', value: '50', icon: '🧺' },
    { label: '1 Cart (~200 kg)', value: '200', icon: '🛒' },
    { label: '1 Tractor (~1000 kg)', value: '1000', icon: '🚜' },
    { label: '1 Truck (~5000 kg)', value: '5000', icon: '🚚' },
  ]

  return (
    <section
      aria-labelledby="inputs-heading"
      className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm h-full"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sprout className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id="inputs-heading" className="text-xl font-extrabold text-foreground">
            Smart AI Calculator
          </h2>
          <p className="text-sm text-muted-foreground">Auto-detecting market rates & logistics</p>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {/* Detected Crop */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-background shadow-sm text-2xl">
              🌾
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Detected Crop</p>
              {data.crop ? (
                <p className="text-2xl font-black text-foreground capitalize">{data.crop}</p>
              ) : (
                <p className="text-sm font-semibold text-destructive mt-1">⚠️ No crop detected. Please scan a crop first.</p>
              )}
            </div>
          </div>
        </div>

        {/* Visual Volume Selector */}
        <div>
          <p className="mb-3 text-sm font-bold text-foreground flex items-center gap-2">
            <Scale className="size-4 text-muted-foreground" /> 
            Estimated Quantity
          </p>
          <div className="grid grid-cols-2 gap-3">
            {volumeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setData({ ...data, volume: opt.value })}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${
                  data.volume === opt.value
                    ? 'border-primary bg-primary/10 scale-[1.02]'
                    : 'border-border bg-background hover:border-primary/40 hover:bg-secondary/50'
                }`}
              >
                <span className="text-3xl mb-2">{opt.icon}</span>
                <span className={`text-sm font-bold ${data.volume === opt.value ? 'text-primary' : 'text-foreground'}`}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="size-3.5" />
          <span>Auto-calculating distance...</span>
        </div>
        
        <button
          onClick={onCalculate}
          disabled={isCalculating || !data.crop}
          className={`flex items-center gap-2 rounded-xl px-6 py-3 text-base font-extrabold shadow-lg transition-all ${
            isCalculating || !data.crop 
              ? 'bg-muted text-muted-foreground opacity-80 scale-95 cursor-not-allowed' 
              : 'bg-primary text-primary-foreground hover:scale-105 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20'
          }`}
        >
          {isCalculating ? (
            <RefreshCw className="size-5 animate-spin" />
          ) : (
            <BrainCircuit className="size-5" />
          )}
          {isCalculating ? 'Analyzing Market...' : 'Find Best Option'}
        </button>
      </div>
    </section>
  )
}