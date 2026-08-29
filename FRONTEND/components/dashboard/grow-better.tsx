'use client'

import { useState, useEffect } from 'react'
import { CloudLightning, CheckCircle2, RefreshCw, CalendarClock, Sun, Cloud } from 'lucide-react'
import { ScanCrop } from '@/components/dashboard/scan-crop'
import { CropDiagnostics } from '@/components/dashboard/crop-diagnostics'
import { SchedulePlanner } from '@/components/dashboard/schedule-planner'
import { GovSchemes } from '@/components/dashboard/gov-schemes'
import { useLanguage } from '@/lib/language-context'
import { auth, db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const GROW_TRANSLATIONS: Record<string, any> = {
  en: {
    alertTitle: "Weather Alert: Rain Expected",
    alertDesc: "Your area is expecting rainfall. Please delay pesticide applications.",
    adjustBtn: "Adjust Schedule",
    adjustedTitle: "Schedule Adjusted for Rainfall",
    adjustedDesc: "Foliar sprays and fertilizer tasks have been automatically postponed by 3 days.",
    resetBtn: "Reset Timing"
  },
  te: {
    alertTitle: "వాతావరణ హెచ్చరిక: వర్షం",
    alertDesc: "మీ ప్రాంతంలో వర్షం పడే అవకాశం ఉంది. పురుగుమందుల పిచికారీని వాయిదా వేయండి.",
    adjustBtn: "షెడ్యూల్ మార్చండి",
    adjustedTitle: "షెడ్యూల్ మార్చబడింది",
    adjustedDesc: "పనులు 3 రోజులు వాయిదా వేయబడ్డాయి.",
    resetBtn: "యథావిధిగా ఉంచు"
  },
  hi: {
    alertTitle: "मौसम चेतावनी: बारिश",
    alertDesc: "आपके क्षेत्र में बारिश की उम्मीद है। कृपया कीटनाशक छिड़काव में देरी करें।",
    adjustBtn: "शेड्यूल बदलें",
    adjustedTitle: "शेड्यूल समायोजित किया गया",
    adjustedDesc: "कार्य 3 दिनों के लिए आगे बढ़ा दिए गए हैं।",
    resetBtn: "रीसेट करें"
  }
} as any

export function GrowBetter() {
  const { lang } = useLanguage()
  const t = GROW_TRANSLATIONS[lang] || GROW_TRANSLATIONS.en
  
  const [isScheduleAdjusted, setIsScheduleAdjusted] = useState(false)
  const [scanData, setScanData] = useState<any>(null)
  const [weatherData, setWeatherData] = useState<any>(null)

  // Fetch the most recent scan from Firestore to persist state across reloads
  useEffect(() => {
    const fetchLatestScan = async (userId: string) => {
      try {
        const q = query(collection(db, 'users', userId, 'scans'), orderBy('timestamp', 'desc'), limit(1))
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          setScanData((prev: any) => prev || querySnapshot.docs[0].data())
        }
      } catch (e) {
        console.error("Error fetching latest scan:", e)
      }
    }

    const session = localStorage.getItem('krishi_session')
    let localUserId = null
    if (session) {
      try {
        const user = JSON.parse(session)
        localUserId = user.phoneOrEmail
      } catch (e) {}
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const activeUserId = localUserId || user?.uid
      if (activeUserId) {
        await fetchLatestScan(activeUserId)
      }
    })
    
    // Also try immediately in case auth state takes time
    if (localUserId) {
      fetchLatestScan(localUserId)
    }

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    fetch(`/api/weather?location=Vadlamudi`)
      .then(res => res.json())
      .then(data => setWeatherData(data))
      .catch(console.error)
  }, [])

  const isRaining = weatherData?.condition?.toLowerCase().includes('rain') || (weatherData?.rain_chance > 50)
  const isCloudy = weatherData?.condition?.toLowerCase().includes('cloud')
  const temp = weatherData?.temp || '--'

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Dynamic Weather Banner */}
      {isRaining ? (
        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-3xl border p-5 shadow-sm transition-all duration-300 ${
          isScheduleAdjusted ? 'bg-primary/10 border-primary/30 text-foreground' : 'bg-amber-500/10 border-amber-500/20 text-amber-950'
        }`}>
          <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ${isScheduleAdjusted ? 'bg-primary text-primary-foreground' : 'bg-amber-500/20 text-amber-600'}`}>
            {isScheduleAdjusted ? <CheckCircle2 className="size-6" /> : <CloudLightning className="size-6" />}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`text-base font-bold ${isScheduleAdjusted ? 'text-primary' : 'text-amber-700'}`}>{isScheduleAdjusted ? t.adjustedTitle : t.alertTitle}</h3>
              {isScheduleAdjusted && <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-primary"><CalendarClock className="size-3" /> +3 Days</span>}
            </div>
            <p className="text-sm mt-0.5 text-muted-foreground leading-relaxed">{isScheduleAdjusted ? t.adjustedDesc : t.alertDesc}</p>
          </div>
          <button onClick={() => setIsScheduleAdjusted(!isScheduleAdjusted)} className={`w-full sm:w-auto mt-2 sm:mt-0 text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${isScheduleAdjusted ? 'bg-secondary text-foreground hover:bg-secondary/80 border border-border' : 'bg-amber-500 text-white hover:bg-amber-600'}`}>
            {isScheduleAdjusted ? <><RefreshCw className="size-4" /> {t.resetBtn}</> : t.adjustBtn}
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-3xl border p-5 shadow-sm transition-all duration-300 bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-50">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-sm bg-emerald-500/20 text-emerald-600">
            {isCloudy ? <Cloud className="size-6" /> : <Sun className="size-6" />}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-emerald-700 dark:text-emerald-400">Weather Conditions Favorable</h3>
            </div>
            <p className="text-sm mt-0.5 text-emerald-800/70 dark:text-emerald-200/70 leading-relaxed">
              Currently {temp}°C and {weatherData?.description || 'Clear'}. Good conditions for field work and foliar applications.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Pass the setter to the scanner */}
        <ScanCrop onScanComplete={setScanData} />
        {/* Pass the data to the diagnostics */}
        <CropDiagnostics scanData={scanData} />
      </div>
     
      {/* Pass the data to the planner */}
      <SchedulePlanner rainDelayActive={isScheduleAdjusted} scanData={scanData} />
      <GovSchemes />
    </div>
  )
}