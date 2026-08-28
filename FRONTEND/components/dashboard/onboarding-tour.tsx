'use client'

import { useEffect, useRef } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { useLanguage, type SupportedLang } from '@/lib/language-context'

const TOUR_TRANSLATIONS: Partial<Record<SupportedLang, any>> = {
  en: {
    steps: [
      { element: '#tour-welcome', popover: { title: 'Welcome to KrishiRakshak AI', description: 'Your personal farm intelligence agent. Let me give you a quick tour to help you get started.' } },
      { element: '#tour-voice-btn', popover: { title: 'AI Voice Assistant', description: 'Tap this mic anytime to speak with me in your local language. I can answer farming questions or navigate the app for you.' } },
      { element: '#tour-grow', popover: { title: 'Grow Better', description: 'Monitor crop health, scan for diseases, and find government schemes you are eligible for here.' } },
      { element: '#tour-sell', popover: { title: 'Sell Smarter', description: 'Check live Mandi prices, find verified local buyers, and aggregate your crop with other farmers.' } },
      { element: '#tour-lose', popover: { title: 'Lose Less', description: 'Use the Smart AI Calculator to decide whether to sell, store, or process your crop based on live market data.' } },
      { element: '#tour-notifications', popover: { title: 'Live Alerts', description: 'I will send you urgent weather alerts and market price updates right here.' } },
    ],
    done: 'Done',
    next: 'Next',
    prev: 'Previous'
  },
  te: {
    steps: [
      { element: '#tour-welcome', popover: { title: 'KrishiRakshak AI కు స్వాగతం', description: 'మీ వ్యక్తిగత వ్యవసాయ ఇంటెలిజెన్స్ ఏజెంట్. మీకు ఒక చిన్న పరిచయం ఇస్తాను.' } },
      { element: '#tour-voice-btn', popover: { title: 'AI వాయిస్ అసిస్టెంట్', description: 'నాతో మాట్లాడటానికి ఎప్పుడైనా ఈ మైక్‌ను నొక్కండి.' } },
      { element: '#tour-grow', popover: { title: 'Grow Better', description: 'పంట ఆరోగ్యాన్ని పర్యవేక్షించండి మరియు వ్యాధులను స్కాన్ చేయండి.' } },
      { element: '#tour-sell', popover: { title: 'Sell Smarter', description: 'మండి ధరలను తనిఖీ చేయండి మరియు కొనుగోలుదారులను కనుగొనండి.' } },
      { element: '#tour-lose', popover: { title: 'Lose Less', description: 'పంటను అమ్మాలా లేదా నిల్వ చేయాలా అని నిర్ణయించడానికి AI క్యాలిక్యులేటర్‌ని వాడండి.' } },
      { element: '#tour-notifications', popover: { title: 'లైవ్ అలర్ట్స్', description: 'నేను ఇక్కడ వాతావరణ మరియు మార్కెట్ అప్‌డేట్‌లను పంపుతాను.' } },
    ],
    done: 'పూర్తయింది', next: 'తరువాత', prev: 'గత'
  },
  hi: {
    steps: [
      { element: '#tour-welcome', popover: { title: 'KrishiRakshak AI में आपका स्वागत है', description: 'आपका निजी कृषि एजेंट। आइए मैं आपको एक छोटा सा टूर दूं।' } },
      { element: '#tour-voice-btn', popover: { title: 'AI वॉयस असिस्टेंट', description: 'मुझसे बात करने के लिए कभी भी इस माइक को टैप करें।' } },
      { element: '#tour-grow', popover: { title: 'Grow Better', description: 'फसल के स्वास्थ्य की निगरानी करें और बीमारियों के लिए स्कैन करें।' } },
      { element: '#tour-sell', popover: { title: 'Sell Smarter', description: 'मंडी की लाइव कीमतें देखें और खरीदार खोजें।' } },
      { element: '#tour-lose', popover: { title: 'Lose Less', description: 'यह तय करने के लिए कि फसल बेचनी है या स्टोर करनी है, AI कैलकुलेटर का उपयोग करें।' } },
      { element: '#tour-notifications', popover: { title: 'लाइव अलर्ट', description: 'मैं यहाँ मौसम और बाज़ार के अपडेट भेजूंगा।' } },
    ],
    done: 'पूर्ण', next: 'अगला', prev: 'पिछला'
  }
}

export function OnboardingTour({ onComplete }: { onComplete: () => void }) {
  const { lang } = useLanguage()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return

    const t = TOUR_TRANSLATIONS[lang] || TOUR_TRANSLATIONS.en
    const steps = t.steps

    const fetchAndPlayAudio = async (text: string) => {
      try {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }
        
        // Map frontend lang to backend format
        const langMap: Record<string, string> = {
          hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN', kn: 'kn-IN', 
          ml: 'ml-IN', mr: 'mr-IN', gu: 'gu-IN', bn: 'bn-IN', 
          pa: 'pa-IN', or: 'or-IN', en: 'en-IN'
        }
        const apiLang = langMap[lang] || 'en-IN'
        
        const res = await fetch(`http://localhost:8000/api/tour-tts?text=${encodeURIComponent(text)}&language=${apiLang}`)
        const data = await res.json()
        if (data.status === 'success' && data.data.audio_base64) {
          const snd = new Audio(`data:audio/wav;base64,${data.data.audio_base64}`)
          audioRef.current = snd
          snd.play().catch(e => console.warn("Audio autoplay blocked:", e))
        } else {
          // Fallback to browser TTS if no backend key
          const utterance = new SpeechSynthesisUtterance(text)
          if (lang === 'hi') utterance.lang = 'hi-IN'
          else if (lang === 'te') utterance.lang = 'te-IN'
          else utterance.lang = 'en-IN'
          window.speechSynthesis.cancel()
          window.speechSynthesis.speak(utterance)
        }
      } catch (err) {
        console.warn("Failed to fetch tour TTS", err)
      }
    }

    const d = driver({
      showProgress: true,
      animate: true,
      doneBtnText: t.done,
      nextBtnText: t.next,
      prevBtnText: t.prev,
      onHighlightStarted: (element, step, options) => {
        // Trigger voice on step
        if (step.popover?.description) {
          fetchAndPlayAudio(step.popover.description)
        }
      },
      onDestroyStarted: () => {
        if (audioRef.current) audioRef.current.pause()
        window.speechSynthesis.cancel()
        d.destroy()
        onComplete()
      },
      steps: steps.map((s: any) => ({
        element: s.element,
        popover: s.popover
      }))
    })

    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      try {
        d.drive()
      } catch(e) {
        console.error("Driver error", e)
      }
    }, 500)

    return () => {
      clearTimeout(timer)
      try { d.destroy() } catch(e) {}
      if (audioRef.current) audioRef.current.pause()
      window.speechSynthesis.cancel()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once on mount

  return null // Invisible component that just runs logic
}
