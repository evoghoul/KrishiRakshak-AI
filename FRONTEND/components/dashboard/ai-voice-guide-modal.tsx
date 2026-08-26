'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Camera,
  TrendingUp,
  Landmark,
  Calendar,
  Truck,
  ShieldCheck,
  Languages,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
  Send,
  Loader2,
  ArrowRight
} from 'lucide-react'
import { type DashboardTab } from '@/components/dashboard/sidebar'

interface AIVoiceGuideModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigateTab: (tab: DashboardTab, targetId?: string) => void
}

type SupportedVoiceLang = 'hi-IN' | 'te-IN' | 'en-IN' | 'ta-IN' | 'mr-IN' | 'pa-IN' | 'kn-IN'

interface LangOption {
  code: SupportedVoiceLang
  label: string
  nativeName: string
  samplePrompt: string
  sampleResponse: string
}

const LANGUAGES: LangOption[] = [
  {
    code: 'hi-IN',
    label: 'Hindi',
    nativeName: 'हिन्दी',
    samplePrompt: 'टमाटर का पौधा सूख रहा है स्कैन करो',
    sampleResponse: 'नमस्ते किसान भाई! मैं आपका कृषि रक्षक AI वॉयस गाइड हूँ। आप अपनी भाषा में कुछ भी बोलकर पूछ सकते हैं।'
  },
  {
    code: 'te-IN',
    label: 'Telugu',
    nativeName: 'తెలుగు',
    samplePrompt: 'గుంటూరు మిర్చి మార్కెట్ ధర ఎంత?',
    sampleResponse: 'నమస్కారం రైతు మిత్రమా! నేను మీ కృషి రక్షక్ వాయిస్ అసిస్టెంట్. మీరు ఏదైనా మాట్లాడవచ్చు.'
  },
  {
    code: 'en-IN',
    label: 'English',
    nativeName: 'English (India)',
    samplePrompt: 'Check chilli market prices in Guntur',
    sampleResponse: 'Hello farmer friend! I am your KrishiRakshak AI Voice Guide. Speak any query and I will help you.'
  },
  {
    code: 'mr-IN',
    label: 'Marathi',
    nativeName: 'मराठी',
    samplePrompt: 'पीक रोगाची तपासणी करा',
    sampleResponse: 'नमस्कार शेतकरी मित्र! मी तुमचा कृषी रक्षक सहाय्यक आहे. बोला मी मदत करतो.'
  },
  {
    code: 'ta-IN',
    label: 'Tamil',
    nativeName: 'தமிழ்',
    samplePrompt: 'பயிர் நோயை ஸ்கேன் செய்க',
    sampleResponse: 'வணக்கம் விவசாய தோழரே! நான் உங்கள் கிரிஷி ரக்ஷக் குரல் வழிகாட்டி.'
  },
  {
    code: 'kn-IN',
    label: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    samplePrompt: 'ಮಾರುಕಟ್ಟೆ ದರ ತಿಳಿಸಿ',
    sampleResponse: 'ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರರೇ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ರಕ್ಷಕ್ ವಾಯ್ಸ್ ಸಹಾಯಕ.'
  },
  {
    code: 'pa-IN',
    label: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    samplePrompt: 'ਮੰਡੀ ਦਾ ਭਾਅ ਦੱਸੋ',
    sampleResponse: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ ਤੁਹਾਡਾ ਕ੍ਰਿਸ਼ੀ ਰੱਖਿਅਕ ਵੌਇਸ ਸਹਾਇਕ ਹਾਂ।'
  }
]

interface Message {
  sender: 'user' | 'ai'
  text: string
  actionLabel?: string
  targetTab?: DashboardTab
  targetElementId?: string
}

export function AIVoiceGuideModal({ isOpen, onClose, onNavigateTab }: AIVoiceGuideModalProps) {
  const [selectedLang, setSelectedLang] = useState<SupportedVoiceLang>('hi-IN')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechMuted, setSpeechMuted] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [aiStatus, setAiStatus] = useState<string>('Listening for your voice...')
  const [messages, setMessages] = useState<Message[]>([])
  const [textInput, setTextInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [navCountdown, setNavCountdown] = useState<{ tab: DashboardTab; elementId?: string; count: number } | null>(null)

  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize Speech Recognition on language change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition()
          recognition.continuous = false
          recognition.interimResults = true
          recognition.lang = selectedLang

          recognition.onstart = () => {
            setIsListening(true)
            setAiStatus('Listening... Speak now into your microphone')
          }

          recognition.onresult = (event: any) => {
            const current = event.resultIndex
            const text = event.results[current][0].transcript
            setTranscript(text)

            if (event.results[current].isFinal) {
              handleSendQuery(text)
            }
          }

          recognition.onerror = (event: any) => {
            console.warn('[Speech Recognition Event]:', event.error)
            setIsListening(false)
            setAiStatus('Tap the microphone button and speak your query.')
          }

          recognition.onend = () => {
            setIsListening(false)
          }

          recognitionRef.current = recognition
        } catch (e) {
          console.warn('Speech recognition init warning:', e)
        }
      }
    }
  }, [selectedLang])

  // Welcome greeting when modal opens
  useEffect(() => {
    if (isOpen) {
      const current = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0]
      const welcomeMsg: Message = {
        sender: 'ai',
        text: current.sampleResponse
      }
      setMessages([welcomeMsg])
      speakText(current.sampleResponse, current.code)
    } else {
      stopSpeaking()
      stopListening()
      if (navTimerRef.current) clearTimeout(navTimerRef.current)
      setNavCountdown(null)
    }
  }, [isOpen, selectedLang])

  // Auto scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isProcessing])

  // Text-To-Speech function
  const speakText = (text: string, langCode: string = selectedLang) => {
    if (speechMuted || typeof window === 'undefined' || !window.speechSynthesis) return

    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = langCode
      utterance.rate = 0.92
      utterance.pitch = 1.0

      const voices = window.speechSynthesis.getVoices()
      const langPrefix = langCode.split('-')[0]
      const matchingVoice = voices.find((v) => v.lang.startsWith(langPrefix))
      if (matchingVoice) {
        utterance.voice = matchingVoice
      }

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    } catch (e) {
      console.warn('Speech synthesis notice:', e)
    }
  }

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const startListening = () => {
    stopSpeaking()
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = selectedLang
        recognitionRef.current.start()
      } catch (err) {
        console.warn('Recognition start warning:', err)
      }
    } else {
      alert('Your browser does not support voice input. You can type in the box below!')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (err) {}
      setIsListening(false)
    }
  }

  // Core Gemini AI Multilingual Processing
  const handleSendQuery = async (queryText: string) => {
    const query = queryText.trim()
    if (!query) return

    setMessages((prev) => [...prev, { sender: 'user', text: query }])
    setTranscript('')
    setTextInput('')
    setIsProcessing(true)
    setAiStatus('Google Gemini AI is analyzing your voice command...')

    try {
      const res = await fetch('http://localhost:8000/api/voice-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language: selectedLang })
      })

      const result = await res.json()

      if (result.status === 'success' && result.data) {
        const { target_tab, target_element_id, action_label, spoken_response, language_code } =
          result.data

        const aiMsg: Message = {
          sender: 'ai',
          text: spoken_response || 'Ji kisan bhai, main aapko le ja raha hoon.',
          actionLabel: action_label || `Go to ${target_tab.toUpperCase()}`,
          targetTab: target_tab as DashboardTab,
          targetElementId: target_element_id
        }

        setMessages((prev) => [...prev, aiMsg])
        speakText(spoken_response, language_code || selectedLang)

        // Trigger auto navigation countdown
        if (target_tab) {
          const tabName = target_tab as DashboardTab
          setNavCountdown({ tab: tabName, elementId: target_element_id, count: 2 })

          if (navTimerRef.current) clearTimeout(navTimerRef.current)
          navTimerRef.current = setTimeout(() => {
            onNavigateTab(tabName, target_element_id)
            onClose()
            setNavCountdown(null)
          }, 2800)
        }
      } else {
        throw new Error(result.message || 'AI Voice Guide error')
      }
    } catch (error: any) {
      console.warn('Voice Guide API Fallback:', error)
      const fallbackReply = `Ji kisan bhai! Main aapke query "${query}" par kaam kar raha hoon.`
      setMessages((prev) => [...prev, { sender: 'ai', text: fallbackReply }])
      speakText(fallbackReply)
    } finally {
      setIsProcessing(false)
      setAiStatus('Tap microphone or speak again.')
    }
  }

  const handleCancelNav = () => {
    if (navTimerRef.current) clearTimeout(navTimerRef.current)
    setNavCountdown(null)
    stopSpeaking()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative flex h-[92vh] max-h-[720px] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-primary/40 bg-card shadow-2xl animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-border bg-primary/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="relative flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
              <Mic className="size-6" />
              {isListening && (
                <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                </span>
              )}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-foreground">AI Voice Guide</h3>
                <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[11px] font-extrabold text-primary">
                  Google Gemini Powered
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Speak in ANY language — Gemini understands your voice &amp; navigates!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Mute/Unmute */}
            <button
              onClick={() => {
                if (isSpeaking) stopSpeaking()
                setSpeechMuted(!speechMuted)
              }}
              title={speechMuted ? 'Unmute voice audio' : 'Mute voice audio'}
              className={`rounded-xl p-2.5 transition-colors ${
                speechMuted ? 'bg-destructive/20 text-destructive' : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {speechMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4 text-primary" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="rounded-xl p-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Language Selection Ribbon */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border bg-secondary/30 px-4 py-2 text-xs scrollbar-none">
          <Languages className="size-3.5 text-primary shrink-0 mr-1" />
          <span className="text-[11px] font-bold text-muted-foreground shrink-0">Your Language:</span>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setSelectedLang(lang.code)
                stopSpeaking()
              }}
              className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                selectedLang === lang.code
                  ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                  : 'bg-background border border-border text-foreground/80 hover:bg-secondary'
              }`}
            >
              {lang.nativeName} ({lang.label})
            </button>
          ))}
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm font-medium shadow-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-secondary/70 border border-border text-foreground rounded-bl-none'
                }`}
              >
                <p>{m.text}</p>

                {m.targetTab && (
                  <button
                    onClick={() => {
                      if (m.targetTab) onNavigateTab(m.targetTab, m.targetElementId)
                      onClose()
                    }}
                    className="mt-3 flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-extrabold text-primary-foreground hover:bg-primary/90 transition-all shadow"
                  >
                    <span>{m.actionLabel || 'Navigate Now'}</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 text-xs font-bold text-primary animate-pulse pl-2">
              <Loader2 className="size-4 animate-spin" />
              <span>Gemini AI is thinking &amp; generating your voice response...</span>
            </div>
          )}

          {isSpeaking && !isProcessing && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 animate-pulse pl-2">
              <Volume2 className="size-4" />
              <span>AI Speaking...</span>
            </div>
          )}

          {navCountdown && (
            <div className="rounded-2xl border border-primary/40 bg-primary/10 p-3.5 flex items-center justify-between animate-in zoom-in">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary animate-spin" />
                <span className="text-xs font-bold text-foreground">
                  Navigating to <strong>{navCountdown.tab.toUpperCase()}</strong> page...
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onNavigateTab(navCountdown.tab, navCountdown.elementId)
                    onClose()
                  }}
                  className="rounded-lg bg-primary px-2.5 py-1 text-[11px] font-extrabold text-primary-foreground"
                >
                  Go Now
                </button>
                <button
                  onClick={handleCancelNav}
                  className="rounded-lg bg-secondary border border-border px-2.5 py-1 text-[11px] font-bold text-muted-foreground hover:text-foreground"
                >
                  Stay Here
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Live Speech Recognition Wave & Mic Center */}
        <div className="border-t border-border bg-background p-4 sm:p-5 flex flex-col items-center justify-center gap-3">
          {/* Audio Waveform Animation */}
          {isListening && (
            <div className="flex items-center gap-1.5 h-6">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="size-3 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="size-4 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="size-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '450ms' }} />
              <span className="size-1 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '600ms' }} />
            </div>
          )}

          {/* Real-Time Live Transcript Preview */}
          <div className="text-center min-h-[22px]">
            {transcript ? (
              <p className="text-sm font-extrabold text-primary italic">
                &quot;{transcript}&quot;
              </p>
            ) : (
              <p className="text-xs font-semibold text-muted-foreground">{aiStatus}</p>
            )}
          </div>

          {/* Central Mega Mic Button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`group relative flex size-16 sm:size-20 items-center justify-center rounded-full shadow-xl transition-all duration-300 active:scale-95 ${
                isListening
                  ? 'bg-emerald-500 text-white ring-8 ring-emerald-500/30'
                  : 'bg-primary text-primary-foreground hover:scale-105 ring-4 ring-primary/20'
              }`}
            >
              {isListening ? (
                <Mic className="size-8 sm:size-9 animate-pulse" />
              ) : (
                <Mic className="size-8 sm:size-9" />
              )}
            </button>
          </div>
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            {isListening ? 'Listening... Tap to Stop' : 'Tap & Speak in your language'}
          </span>

          {/* Fallback Text Input Bar (If mic blocked or typing preferred) */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendQuery(textInput)
            }}
            className="flex w-full items-center gap-2 rounded-xl border border-border bg-secondary/30 px-3 py-1.5 focus-within:border-primary transition-colors"
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Or type your query in Hindi, Telugu, English, etc..."
              className="w-full bg-transparent text-xs font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || isProcessing}
              className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40 transition-all hover:bg-primary/90"
            >
              <Send className="size-3.5" />
            </button>
          </form>

          {/* Quick Voice Command Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
            <span className="text-[10px] font-bold text-muted-foreground">Quick test:</span>
            <button
              onClick={() => handleSendQuery('टमाटर का पौधा पीला पड़ रहा है स्कैन करना है')}
              className="rounded-full bg-secondary/80 hover:bg-primary hover:text-primary-foreground border border-border px-2.5 py-1 text-[11px] font-bold transition-colors"
            >
              📷 &quot;टमाटर पौधा स्कैन करो&quot;
            </button>
            <button
              onClick={() => handleSendQuery('गुंटूर मंडी में लाल मिर्च का भाव बताओ')}
              className="rounded-full bg-secondary/80 hover:bg-primary hover:text-primary-foreground border border-border px-2.5 py-1 text-[11px] font-bold transition-colors"
            >
              📈 &quot;मिर्च मंडी भाव&quot;
            </button>
            <button
              onClick={() => handleSendQuery('PM Kisan aur subsidy ki sarkari yojana dikhao')}
              className="rounded-full bg-secondary/80 hover:bg-primary hover:text-primary-foreground border border-border px-2.5 py-1 text-[11px] font-bold transition-colors"
            >
              🏛️ &quot;सरकारी योजनाएं&quot;
            </button>
            <button
              onClick={() => handleSendQuery('ట్రాక్టర్ లేదా బండి రవాణా బుక్ చేయాలి')}
              className="rounded-full bg-secondary/80 hover:bg-primary hover:text-primary-foreground border border-border px-2.5 py-1 text-[11px] font-bold transition-colors"
            >
              🚚 &quot;రవాణా బుకింగ్&quot;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

