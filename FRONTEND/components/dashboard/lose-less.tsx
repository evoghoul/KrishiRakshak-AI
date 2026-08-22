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

  // 1. MASTER STATE: Holding all the complex variables
  const [decisionData, setDecisionData] = useState({
    crop: 'Tomato',
    volume: '5000', // kg
    harvestDate: 'Today',
    currentPrice: '24', // per kg
    expectedPrice: '30', // per kg
    tempHumidity: 'Loading...', // Will be filled by OpenWeather API
    storageAvailable: 'Yes',
    storageCost: '2', // per kg/day
    distance: '45', // km
    buyerDemand: 'High in Metro',
    spoilageProb: 'High (within 3 days)'
  })

  // 2. AI RESULT STATE: Action and the crucial "WHY?"
  const [aiResult, setAiResult] = useState<{action: string, why: string, status: 'sell' | 'store' | 'process' | 'pool'} | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // 3. FETCH LIVE PRICES FROM BACKEND (Agmarknet)
  useEffect(() => {
    fetch('http://localhost:8000/api/prices')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error && Array.isArray(data)) {
          const matchedCrop = data.find(c => c.crop.toLowerCase() === decisionData.crop.toLowerCase())
          if (matchedCrop) {
            const pricePerKg = Math.round(matchedCrop.price / 100).toString()
            setDecisionData(prev => ({
              ...prev,
              currentPrice: pricePerKg,
              expectedPrice: Math.round(parseInt(pricePerKg) * 1.15).toString()
            }))
          }
        }
      })
      .catch((err) => console.log("Price fetch failed", err))
  }, [decisionData.crop])

  // 4. FETCH LIVE WEATHER FROM BACKEND (OpenWeather)
  useEffect(() => {
    fetch('http://localhost:8000/api/weather')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success' || data.status === 'fallback') {
          setDecisionData(prev => ({
            ...prev,
            tempHumidity: `${data.temp}°C / ${data.humidity}%`,
            // Dynamically adjust spoilage probability based on real humidity!
            spoilageProb: data.humidity > 70 ? 'Extreme (Rot risk)' : 'High (within 3 days)'
          }))
        }
      })
      .catch((err) => console.log("Weather fetch failed", err))
  }, [])

  // 5. THE DECISION LOGIC ENGINE
  const runAIAnalysis = (data: typeof decisionData) => {
    setIsCalculating(true)
    
    setTimeout(() => {
      const curPrice = parseInt(data.currentPrice) || 0
      const expPrice = parseInt(data.expectedPrice) || 0
      const profitMargin = expPrice - curPrice

      // AI Determines the status mathematically
      let finalStatus: 'sell' | 'store' | 'process' | 'pool' = 'store'
      
      if (curPrice >= expPrice) {
        finalStatus = 'sell'
      } else if (data.storageAvailable === 'Yes' && profitMargin > parseInt(data.storageCost)) {
        finalStatus = 'store'
      } else if (parseInt(data.distance) > 40 && profitMargin > 0) {
        finalStatus = 'pool'
      } else {
        finalStatus = 'process'
      }

      // Generate the translated explanation
      let whyText = ''
      let actionTitle = ''
      
      if (finalStatus === 'sell') {
        whyText = t.whySell(data.currentPrice, data.storageCost, data.spoilageProb)
        actionTitle = t.sellNow
      } else if (finalStatus === 'store') {
        whyText = t.whyStore(data.expectedPrice, data.storageCost, profitMargin, data.distance)
        actionTitle = t.storePool
      } else if (finalStatus === 'pool') {
        whyText = t.whyStore(data.expectedPrice, data.storageCost, profitMargin, data.distance)
        actionTitle = t.storePool
      } else {
        whyText = t.whyProcess(data.spoilageProb, data.currentPrice, data.crop)
        actionTitle = t.processDry
      }

      setAiResult({
        status: finalStatus,
        action: actionTitle,
        why: whyText
      })
      
      setIsCalculating(false)
    }, 2500)
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