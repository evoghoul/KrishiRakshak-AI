'use client'

import { useState, useEffect } from 'react'
import { DecisionInputs } from '@/components/dashboard/decision-inputs'
import { DecisionEngine } from '@/components/dashboard/decision-engine'
import { useLanguage, type SupportedLang } from '@/lib/language-context'

const LOSE_LESS_TRANSLATIONS: Record<SupportedLang, any> = {
  en: {
    sellNow: 'SELL NOW',
    storePool: 'STORE FOR 3 DAYS',
    processDry: 'PROCESS / DRY',
    whySell: (cur: string, cost: string, prob: string) => `Current market price (₹${cur}/kg) is at its peak. Storage costs (₹${cost}/kg) will only eat into your margins as the spoilage probability is ${prob}.`,
    whyStore: (exp: string, cost: string, profit: number, dist: string) => `Expected price jumps to ₹${exp}/kg by Wednesday. Spoilage risk is high, but your storage cost (₹${cost}/kg) is much lower than the expected profit margin (+₹${profit}/kg). Distance (${dist}km) requires pooling with nearby farmers to reduce logistics costs by 40%.`,
    whyProcess: (prob: string, cur: string, crop: string) => `No storage available and spoilage probability is ${prob}. To avoid a total loss at the current low price of ₹${cur}/kg, immediately process the ${crop} (e.g., sun-drying or pureeing) to extend shelf life to 6 months.`
  },
  te: {
    sellNow: 'ఇప్పుడే అమ్మండి',
    storePool: '3 రోజులు నిల్వ చేయండి',
    processDry: 'ప్రాసెస్ చేయండి / ఆరబెట్టండి',
    whySell: (cur: string, cost: string, prob: string) => `ప్రస్తుత మార్కెట్ ధర (₹${cur}/kg) గరిష్ట స్థాయిలో ఉంది. నిల్వ ఖర్చులు (₹${cost}/kg) మీ లాభాలను తగ్గిస్తాయి, ఎందుకంటే పాడయ్యే అవకాశం ${prob} గా ఉంది.`,
    whyStore: (exp: string, cost: string, profit: number, dist: string) => `బుధవారం నాటికి ఆశించిన ధర ₹${exp}/kg కి పెరుగుతుంది. పాడయ్యే ప్రమాదం ఎక్కువ, కానీ నిల్వ ఖర్చు (₹${cost}/kg) ఆశించిన లాభం (+₹${profit}/kg) కంటే చాలా తక్కువ. దూరం (${dist}కి.మీ) కారణంగా రవాణా ఖర్చులను 40% తగ్గించడానికి సమీప రైతులతో పూలింగ్ అవసరం.`,
    whyProcess: (prob: string, cur: string, crop: string) => `నిల్వ సౌకర్యం లేదు మరియు పాడయ్యే అవకాశం ${prob} గా ఉంది. ₹${cur}/kg తక్కువ ధర వద్ద నష్టాన్ని నివారించడానికి, వెంటనే ${crop} ని ప్రాసెస్ చేయండి (ఉదా. ఎండబెట్టడం లేదా ప్యూరీ చేయడం) తద్వారా నిల్వ సమయం 6 నెలలకు పెరుగుతుంది.`
  },
  hi: {
    sellNow: 'अभी बेचें',
    storePool: '3 दिन स्टोर करें',
    processDry: 'प्रोसेस / सुखाएं',
    whySell: (cur: string, cost: string, prob: string) => `वर्तमान बाज़ार मूल्य (₹${cur}/kg) अपने चरम पर है। भंडारण लागत (₹${cost}/kg) आपके मुनाफे को कम करेगी क्योंकि खराब होने की संभावना ${prob} है।`,
    whyStore: (exp: string, cost: string, profit: number, dist: string) => `बुधवार तक संभावित मूल्य ₹${exp}/kg तक बढ़ जाएगा। खराब होने का जोखिम अधिक है, लेकिन भंडारण लागत (₹${cost}/kg) संभावित मुनाफे (+₹${profit}/kg) से बहुत कम है। दूरी (${dist}km) के कारण रसद लागत को 40% तक कम करने के लिए आस-पास के किसानों के साथ पूलिंग आवश्यक है।`,
    whyProcess: (prob: string, cur: string, crop: string) => `कोई भंडारण उपलब्ध नहीं है और खराब होने की संभावना ${prob} है। ₹${cur}/kg के वर्तमान कम मूल्य पर पूर्ण नुकसान से बचने के लिए, तुरंत ${crop} को प्रोसेस करें (जैसे, धूप में सुखाना या प्यूरी बनाना) ताकि शेल्फ जीवन 6 महीने तक बढ़ सके।`
  },
  ta: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' },
  kn: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' },
  ml: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' },
  mr: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' },
  gu: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' },
  bn: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' },
  pa: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' },
  or: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' },
  as: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' },
  ur: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' },
  sa: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' },
  ne: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' },
  kok: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' },
  mai: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' },
  doi: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' },
  ks: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' },
  mni: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' },
  sat: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' },
  sd: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' },
  brx: { sellNow: 'SELL NOW', storePool: 'STORE FOR 3 DAYS', processDry: 'PROCESS / DRY', whySell: () => '', whyStore: () => '', whyProcess: () => '' }
} as any

export function LoseLess() {
  const { lang } = useLanguage()
  const t = LOSE_LESS_TRANSLATIONS[lang] || LOSE_LESS_TRANSLATIONS.en

  const [decisionData, setDecisionData] = useState({
    crop: '', // Will be auto-filled from localStorage
    volume: '500',  // Default to 1 Basket
    lat: 0,
    lng: 0
  })

  // 2. AI RESULT STATE
  const [aiResult, setAiResult] = useState<{action: string, why: string, status: 'sell' | 'store' | 'process' | 'pool', metrics?: any} | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // 3. AUTO-FILL ON MOUNT
  useEffect(() => {
    // A) Get Crop from Scanner
    const savedCrop = localStorage.getItem('krishirakshak_active_crop')
    if (savedCrop) {
      setDecisionData(prev => ({ ...prev, crop: savedCrop }))
    }

    // B) Get GPS Coordinates silently
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setDecisionData(prev => ({
          ...prev,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }))
      }, (err) => {
        console.warn("Could not get GPS:", err)
      })
    }
  }, [])

  // 5. REAL LOCAL AI DECISION ENGINE
  const runAIAnalysis = async (data: typeof decisionData) => {
    setIsCalculating(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: data,
          lang: lang
        })
      })
      
      const responseData = await response.json()
      
      if (responseData.status === 'success') {
        const result = responseData.result
        
        setAiResult({
          status: result.status as 'sell' | 'store' | 'process' | 'pool',
          action: result.action,
          why: result.why
        })
      } else {
        console.error("AI Error:", responseData.error)
        setAiResult({
          status: 'sell',
          action: 'ERROR',
          why: 'Failed to contact Local AI Engine. Please check backend.'
        })
      }
    } catch (err) {
      console.error("Network Error:", err)
      setAiResult({
        status: 'sell',
        action: 'NETWORK ERROR',
        why: 'Backend server is unreachable.'
      })
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className="grid items-start gap-6 xl:grid-cols-2 animate-in fade-in duration-500">
      <DecisionInputs 
        data={decisionData} 
        setData={setDecisionData} 
        onCalculate={() => runAIAnalysis(decisionData)}
        isCalculating={isCalculating}
      />
      
      {/* CRITICAL FIX: Passed data={decisionData} so the engine can do the live math! */}
      <DecisionEngine 
        data={decisionData}
        result={aiResult} 
        isCalculating={isCalculating} 
      />
    </div>
  )
}