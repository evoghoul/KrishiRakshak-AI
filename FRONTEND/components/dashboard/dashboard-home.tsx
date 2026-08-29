'use client'

import { useState, useEffect } from 'react'
import {
  Sun, CloudRain, Wind, Droplets, AlertTriangle, Bug, CloudLightning, Cloud,
  ChevronRight, Sprout, X, ShieldAlert, CheckCircle2, Calendar, Search, TrendingUp, Banknote
} from 'lucide-react'
import { useLanguage, type SupportedLang } from '@/lib/language-context'
import { db } from '@/lib/firebase'
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore'

type CropItem = {
  id: string
  name: string
  variety: string
  plantDate: string
  health: 'Healthy' | 'Needs attention'
}

type AlertItem = {
  id: string
  targetCrop: string
  title: string
  subtitle: string
  urgency: 'urgent' | 'warning' | 'info'
  icon: typeof Bug | typeof CloudLightning
  treatment: string
  chemicals: string
  preventive: string
}

const HOME_TRANSLATIONS: Record<string, any> = {
  en: {
    vadlamudi: 'Vadlamudi, Andhra Pradesh', humidity: 'Humidity', rainChance: 'Rain chance', wind: 'Wind',
    now: 'Now', am: 'AM', pm: 'PM',
    urgentAlerts: 'Urgent Alerts', activeWarnings: 'active warnings', noWarnings: 'No active warnings. Your fields are safe.',
    urgentBadge: 'URGENT',
    myCrops: 'My Active Crops', viewAll: 'View all',
    healthy: 'Healthy', needsAttention: 'Needs attention', flowering: 'Flowering', moisture: 'Moisture', optimal: 'Optimal', seasonProgress: 'Season progress',
    tillering: 'Tillering', monitor: 'Monitor',
    alertDetails: 'Advisory & Action Plan', recommendedTreatment: 'Recommended Action', medicinesDosage: 'Suggested Spray / Remedy', preventionStep: 'Preventive Measures', closeBtn: 'Close', markResolved: 'Mark as Handled',
    noCropsTitle: 'Welcome to KrishiRakshak', 
    noCropsSub: 'Select an option below to start managing your farm, tracking weather, and getting real-time market insights.',
    addMyCrop: 'Add My Crop',
    sellSmarter: 'Sell Smarter',
    govSchemes: 'Govt Schemes'
  },
  te: {
    vadlamudi: 'వడ్లమూడి, ఆంధ్రప్రదేశ్', humidity: 'తేమ', rainChance: 'వర్షం అవకాశం', wind: 'గాలి వేగం',
    now: 'ఇప్పుడు', am: 'ఉదయం', pm: 'సాయంత్రం',
    urgentAlerts: 'అత్యవసర హెచ్చరికలు', activeWarnings: 'యాక్టివ్ హెచ్చరికలు', noWarnings: 'హెచ్చరికలు లేవు. మీ పొలాలు సురక్షితం.',
    urgentBadge: 'అత్యవసరం',
    myCrops: 'నా ప్రస్తుత పంటలు', viewAll: 'అన్నీ చూడండి',
    healthy: 'ఆరోగ్యకరం', needsAttention: 'శ్రద్ధ అవసరం', flowering: 'పూత దశ', moisture: 'తేమ', optimal: 'సరిపడా ఉంది', seasonProgress: 'సీజన్ పురోగతి',
    tillering: 'పిలకల దశ', monitor: 'గమనించండి',
    alertDetails: 'సలహా & కార్యాచరణ ప్రణాళిక', recommendedTreatment: 'సిఫార్సు చేసిన చర్య', medicinesDosage: 'సూచించిన స్ప్రే / మందులు', preventionStep: 'నివారణ చర్యలు', closeBtn: 'మూసివేయి', markResolved: 'పూర్తయినట్లు గుర్తించండి',
    noCropsTitle: 'కృషి రక్షక్‌కు స్వాగతం', 
    noCropsSub: 'మీ పొలాన్ని నిర్వహించడం ప్రారంభించడానికి, వాతావరణాన్ని ట్రాక్ చేయడానికి ఎంపికను ఎంచుకోండి.',
    addMyCrop: 'నా పంటను జోడించండి',
    sellSmarter: 'స్మార్ట్‌గా అమ్మండి',
    govSchemes: 'ప్రభుత్వ పథకాలు'
  },
  hi: {
    vadlamudi: 'वडलामूडी, आंध्र प्रदेश', humidity: 'नमी', rainChance: 'बारिश की संभावना', wind: 'हवा की गति',
    now: 'अभी', am: 'पूर्वाह्न', pm: 'अपराह्न',
    urgentAlerts: 'तत्काल अलर्ट', activeWarnings: 'सक्रिय चेतावनियां', noWarnings: 'कोई सक्रिय चेतावनी नहीं। आपके खेत सुरक्षित हैं।',
    urgentBadge: 'तत्काल',
    myCrops: 'मेरी सक्रिय फसलें', viewAll: 'सभी देखें',
    healthy: 'स्वस्थ', needsAttention: 'ध्यान दें', flowering: 'फूल आने की अवस्था', moisture: 'नमी', optimal: 'उत्तम', seasonProgress: 'सीजन की प्रगति',
    tillering: 'कल्ले फूटने की अवस्था', monitor: 'निगरानी रखें',
    alertDetails: 'सलाह और कार्य योजना', recommendedTreatment: 'अनुशंसित कदम', medicinesDosage: 'सुझाया गया स्प्रे / उपचार', preventionStep: 'रोकथाम के उपाय', closeBtn: 'बंद करें', markResolved: 'निपटारा चिह्नित करें',
    noCropsTitle: 'कृषि रक्षक में आपका स्वागत है', 
    noCropsSub: 'अपने खेत का प्रबंधन शुरू करने, मौसम को ट्रैक करने के लिए नीचे एक विकल्प चुनें।',
    addMyCrop: 'मेरी फसल जोड़ें',
    sellSmarter: 'बेहतर बेचें',
    govSchemes: 'सरकारी योजनाएं'
  }
}

const WEATHER_CONDITIONS: Record<string, Record<string, string>> = {
  en: { 'Clear': 'Mostly clear', 'Clouds': 'Partly cloudy', 'Rain': 'Rainy', 'Thunderstorm': 'Thunderstorms' },
  te: { 'Clear': 'ప్రధానంగా మేఘాల్లేవు', 'Clouds': 'పాక్షికంగా మేఘావృతం', 'Rain': 'వర్షం', 'Thunderstorm': 'ఉరుములతో కూడిన వర్షం' },
  hi: { 'Clear': 'मुख्यतः साफ', 'Clouds': 'आंशिक रूप से बादल', 'Rain': 'बारिश', 'Thunderstorm': 'गरज के साथ बारिश' }
}

export function DashboardHome({ onNavigate }: { onNavigate?: (tab: any) => void }) {
  const { lang } = useLanguage()
  const t = HOME_TRANSLATIONS[lang] || HOME_TRANSLATIONS.en
  const wMap = WEATHER_CONDITIONS[lang] || WEATHER_CONDITIONS.en

  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null)
  const [crops, setCrops] = useState<CropItem[]>([])

  const [weather, setWeather] = useState({
    location: t.vadlamudi, temp: 31, condition: 'Clear', description: wMap['Clear'] || 'Clear', humidity: 62, rain_chance: 0, wind_kmh: 19,
    hourly: [
      { time: t.now, temp: 31 }, { time: `11 ${t.am}`, temp: 32 }, { time: `12 ${t.pm}`, temp: 33 },
      { time: `1 ${t.pm}`, temp: 34 }, { time: `2 ${t.pm}`, temp: 34 }, { time: `3 ${t.pm}`, temp: 33 }
    ],
  })

  const [masterAlerts, setMasterAlerts] = useState<AlertItem[]>([])

  // Fetch Crops
  useEffect(() => {
    const session = localStorage.getItem('krishi_session')
    if (!session) return
    const user = JSON.parse(session)
    const userId = user.phoneOrEmail || 'anonymous'

    const unsubscribe = onSnapshot(collection(db, 'users', userId, 'crops'), (snapshot) => {
      const loadedCrops = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CropItem[]
      setCrops(loadedCrops)
    })

    return () => unsubscribe()
  }, [])

  // Fetch Alerts
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'alerts'), (snapshot) => {
      const loadedAlerts = snapshot.docs.map(doc => {
        const data = doc.data()
        // Map string icon names to Lucide components if needed
        const iconComponent = data.icon === 'Bug' ? Bug : CloudLightning
        return { 
          id: doc.id, 
          ...data,
          icon: iconComponent 
        } as AlertItem
      })
      setMasterAlerts(loadedAlerts)
    })

    return () => unsubscribe()
  }, [])

  const activeAlerts = masterAlerts.filter(alert => 
    alert.targetCrop === 'ALL' || crops.some(c => c.name.toLowerCase().includes(alert.targetCrop.toLowerCase()))
  )

  useEffect(() => {
    fetch(`/api/weather`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success' || data.status === 'fallback') {
          const localizedDesc = wMap ? wMap[data.condition] || data.description : data.description
          setWeather({
            location: data.location || t.vadlamudi, temp: data.temp, condition: data.condition,
            description: localizedDesc, humidity: data.humidity, rain_chance: data.rain_chance, 
            wind_kmh: data.wind_kmh, hourly: data.hourly || weather.hourly,
          })
        }
      })
      .catch(() => console.log("Weather fallback active"))
  }, [lang, t.vadlamudi, wMap])

  const WeatherIcon = weather.condition === 'Rain' ? CloudRain : weather.condition === 'Clouds' ? Cloud : weather.condition === 'Thunderstorm' ? CloudLightning : Sun;

  const handleRemoveCrop = async (id: string) => {
    const session = localStorage.getItem('krishi_session')
    if (!session) return
    const user = JSON.parse(session)
    const userId = user.phoneOrEmail || 'anonymous'
    try {
      await deleteDoc(doc(db, 'users', userId, 'crops', id))
    } catch (e) {
      console.error("Error deleting crop", e)
    }
  }

  // MAGIC SCROLL ENGINE FOR GOVT SCHEMES
  const handleGovSchemesClick = () => {
    if (onNavigate) {
      onNavigate('grow')
      setTimeout(() => {
        const el = document.getElementById('gov-schemes-section')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
          })
        }
      }, 200)
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Real Live Weather Widget */}
        <div className="lg:col-span-2 flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                <WeatherIcon className="size-8" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{weather.location}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-foreground">{weather.temp}°C</span>
                  <span className="text-sm font-medium text-muted-foreground">{weather.description}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center rounded-2xl bg-secondary/50 px-4 py-2">
                <Droplets className="size-4 text-primary mb-1" />
                <span className="text-sm font-bold text-foreground">{weather.humidity}%</span>
                <span className="text-[10px] text-muted-foreground">{t.humidity}</span>
              </div>
              <div className="flex flex-col items-center rounded-2xl bg-secondary/50 px-4 py-2">
                <CloudRain className="size-4 text-blue-500 mb-1" />
                <span className="text-sm font-bold text-foreground">{weather.rain_chance}%</span>
                <span className="text-[10px] text-muted-foreground">{t.rainChance}</span>
              </div>
              <div className="flex flex-col items-center rounded-2xl bg-secondary/50 px-4 py-2">
                <Wind className="size-4 text-teal-500 mb-1" />
                <span className="text-sm font-bold text-foreground">{weather.wind_kmh} km/h</span>
                <span className="text-[10px] text-muted-foreground">{t.wind}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            {weather.hourly.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-1 text-center">
                <span className="text-xs text-muted-foreground">{h.time}</span>
                <Sun className="size-4 text-amber-500 my-0.5" />
                <span className="text-xs font-bold text-foreground">{h.temp}°</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic AI Alerts Widget */}
        <div className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="size-5 text-destructive shrink-0" />
            <div>
              <h3 className="text-base font-bold text-foreground">{t.urgentAlerts}</h3>
              {crops.length > 0 ? (
                <p className="text-xs text-muted-foreground">{activeAlerts.length} {t.activeWarnings}</p>
              ) : (
                <p className="text-xs text-primary font-medium">{t.noWarnings}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {crops.length > 0 && activeAlerts.map((alert) => {
              const Icon = alert.icon
              return (
                <button
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background p-3 text-left transition-all hover:border-primary hover:bg-secondary/40 group w-full"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${alert.urgency === 'urgent' ? 'bg-destructive/10 text-destructive' : alert.urgency === 'warning' ? 'bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-xs font-bold text-foreground">{alert.title}</span>
                        {alert.urgency === 'urgent' && <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-destructive shrink-0">{t.urgentBadge}</span>}
                      </div>
                      <p className="truncate text-[11px] text-muted-foreground">{alert.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Crops Section */}
      <div className="flex flex-col gap-4">
        {crops.length > 0 && (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">{t.myCrops}</h3>
            <button className="text-xs font-bold text-primary hover:underline hidden sm:block">{t.viewAll} &gt;</button>
          </div>
        )}

        {crops.length === 0 ? (
          // BEAUTIFUL NEW APP HIGHLIGHTS
          <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card/40 p-8 sm:p-12 text-center animate-in zoom-in duration-300 shadow-sm mt-4">
            <h4 className="text-xl sm:text-2xl font-bold text-foreground mb-3">{t.noCropsTitle}</h4>
            <p className="text-sm text-muted-foreground mb-10 max-w-md leading-relaxed">{t.noCropsSub}</p>
            
            <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
              {/* Add Crop Button */}
              <button onClick={() => onNavigate && onNavigate('grow')} className="flex flex-col items-center gap-3 group outline-none">
                <span className="flex size-16 sm:size-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Sprout className="size-8 sm:size-10" />
                </span>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">{t.addMyCrop}</span>
              </button>

              {/* Sell Smarter Button */}
              <button onClick={() => onNavigate && onNavigate('sell')} className="flex flex-col items-center gap-3 group outline-none">
                <span className="flex size-16 sm:size-20 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 shadow-sm group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                  <TrendingUp className="size-8 sm:size-10" />
                </span>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-amber-500 transition-colors">{t.sellSmarter}</span>
              </button>

              {/* Govt Schemes Button with Slide-Down Magic! */}
              <button onClick={handleGovSchemesClick} className="flex flex-col items-center gap-3 group outline-none">
                <span className="flex size-16 sm:size-20 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 shadow-sm group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  <Banknote className="size-8 sm:size-10" />
                </span>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-blue-500 transition-colors">{t.govSchemes}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {crops.map((crop) => (
              <div key={crop.id} className={`relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm hover:border-primary transition-colors cursor-pointer ${crop.health === 'Needs attention' ? 'hover:border-destructive' : ''}`}>
                <button onClick={(e) => { e.stopPropagation(); handleRemoveCrop(crop.id) }} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"><X className="size-4" /></button>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`flex size-12 items-center justify-center rounded-2xl ${crop.health === 'Healthy' ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-600'}`}>
                      <Sprout className="size-6" />
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-foreground capitalize">{crop.name}</h4>
                      <p className="text-xs text-muted-foreground">{crop.variety}</p>
                    </div>
                  </div>
                  <span className={`mt-10 sm:mt-0 rounded-full px-3 py-1 text-xs font-bold ${crop.health === 'Healthy' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                    {crop.health === 'Healthy' ? t.healthy : t.needsAttention}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Calendar className="size-3.5 text-primary" /> Planted: {crop.plantDate}</span>
                  <span>•</span><span>{t.moisture}: <strong className="text-foreground">{t.optimal}</strong></span>
                </div>
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground"><span>{t.seasonProgress}</span><span className="text-foreground">Growing</span></div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary"><div className={`h-full rounded-full transition-all w-2/3 ${crop.health === 'Healthy' ? 'bg-primary' : 'bg-amber-500'}`} /></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Action Plan Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive"><ShieldAlert className="size-5" /></span>
                <div>
                  <h3 className="text-base font-bold text-foreground">{selectedAlert.title}</h3>
                  <p className="text-xs text-muted-foreground">{t.alertDetails}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAlert(null)} className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><X className="size-5" /></button>
            </div>
            <div className="mt-4 space-y-4 text-sm">
              <div className="rounded-2xl bg-secondary/50 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wide text-primary">{t.recommendedTreatment}</h4>
                <p className="mt-1 text-xs leading-relaxed text-foreground font-medium">{selectedAlert.treatment}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-4">
                <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">{t.medicinesDosage}</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{selectedAlert.chemicals}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-4">
                <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">{t.preventionStep}</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{selectedAlert.preventive}</p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setSelectedAlert(null)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-md transition-all">
                <CheckCircle2 className="size-4" /> {t.markResolved}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}