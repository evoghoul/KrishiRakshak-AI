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
}

const LANGUAGES: LangOption[] = [
  { code: 'hi-IN', label: 'Hindi', nativeName: 'हिन्दी', samplePrompt: 'टमाटर का पौधा सूख रहा है स्कैन करो' },
  { code: 'te-IN', label: 'Telugu', nativeName: 'తెలుగు', samplePrompt: 'గుంటూరు మిర్చి మార్కెట్ ధర ఎంత?' },
  { code: 'en-IN', label: 'English', nativeName: 'English (India)', samplePrompt: 'Check chilli market prices in Guntur' },
  { code: 'mr-IN', label: 'Marathi', nativeName: 'मराठी', samplePrompt: 'पीक रोगाची तपासणी करा' },
  { code: 'ta-IN', label: 'Tamil', nativeName: 'தமிழ்', samplePrompt: 'பயிர் நோயை ஸ்கேன் செய்க' },
  { code: 'kn-IN', label: 'Kannada', nativeName: 'ಕನ್ನಡ', samplePrompt: 'ಮಾರುಕಟ್ಟೆ ದರ ತಿಳಿಸಿ' },
  { code: 'pa-IN', label: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', samplePrompt: 'ਮੰਡੀ ਦਾ ਭਾਅ ਦੱਸੋ' }
]

const getWelcomeMessage = (code: string, name: string) => {
  switch (code) {
    case 'hi-IN': return `नमस्ते ${name}! बताइये, मैं आपकी कैसे मदद कर सकता हूँ?`
    case 'te-IN': return `నమస్కారం ${name}! నేను మీకు ఎలా సహాయపడగలను?`
    case 'en-IN': return `Hello ${name}! How can I help you today?`
    case 'mr-IN': return `नमस्कार ${name}! मी तुम्हाला कशी मदत करू शकतो?`
    case 'ta-IN': return `வணக்கம் ${name}! நான் உங்களுக்கு எப்படி உதவ முடியும்?`
    case 'kn-IN': return `ನಮಸ್ಕಾರ ${name}! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?`
    case 'pa-IN': return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${name}! ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?`
    default: return `Hello ${name}! How can I help you today?`
  }
}

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
  const [userName, setUserName] = useState<string>('Farmer')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<BlobPart[]>([])
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    try {
      const session = localStorage.getItem('krishi_session')
      if (session) {
        const data = JSON.parse(session)
        if (data.name) {
          setUserName(data.name.split(' ')[0])
        }
      }
    } catch (e) {}
  }, [])

  // Initialize MediaRecorder
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream)
          mediaRecorderRef.current = mediaRecorder

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data)
            }
          }

          mediaRecorder.onstop = () => {
            setIsListening(false)
            setAiStatus('Processing audio...')
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
            audioChunksRef.current = []
            sendAudioQuery(audioBlob)
          }
        })
        .catch(err => {
          console.warn('Microphone access error:', err)
          setAiStatus('Microphone access denied. Please allow permissions.')
        })
    }
  }, [])

  // Welcome greeting when modal opens
  useEffect(() => {
    if (isOpen) {
      const current = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0]
      
      // Fetch the high-quality Sarvam TTS greeting from backend
      fetch(`/api/welcome-greeting?language=${selectedLang}&user_name=${encodeURIComponent(userName)}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            const welcomeMsg: Message = {
              sender: 'ai',
              text: data.data.text
            }
            setMessages([welcomeMsg])
            
            speakText(data.data.audio_base64, data.data.text, current.code, () => {
              setTimeout(() => startListening(), 500)
            })
          }
        })
        .catch(err => {
          console.error("Welcome greeting fetch error:", err)
          // Fallback to local hardcoded text if backend is completely down
          const welcomeText = getWelcomeMessage(selectedLang, userName)
          setMessages([{ sender: 'ai', text: welcomeText }])
          speakText(undefined, welcomeText, current.code, () => {
            setTimeout(() => startListening(), 500)
          })
        })
    } else {
      stopSpeaking()
      stopListening()
      if (navTimerRef.current) clearTimeout(navTimerRef.current)
      setNavCountdown(null)
    }
  }, [isOpen, selectedLang, userName])

  // Auto scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isProcessing])

  // Text-To-Speech function (Offline TTS playback + native fallback)
  const speakText = (base64Audio?: string, fallbackText?: string, langCode: string = selectedLang, onComplete?: () => void) => {
    if (speechMuted) {
      onComplete?.()
      return
    }

    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
      }
      
      if (base64Audio) {
        const audioUrl = `data:audio/wav;base64,${base64Audio}`
        const audio = new Audio(audioUrl)
        currentAudioRef.current = audio
        
        audio.onplay = () => setIsSpeaking(true)
        audio.onended = () => { setIsSpeaking(false); onComplete?.() }
        audio.onerror = () => { setIsSpeaking(false); onComplete?.() }
        
        audio.play().catch((e) => {
          console.warn('Audio play error:', e)
          setIsSpeaking(false)
          onComplete?.()
        })
      } else if (fallbackText && typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(fallbackText)
        utterance.lang = langCode
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => { setIsSpeaking(false); onComplete?.() }
        utterance.onerror = () => { setIsSpeaking(false); onComplete?.() }
        window.speechSynthesis.speak(utterance)
      } else {
        onComplete?.()
      }
    } catch (e) {
      console.warn('Audio playback error:', e)
      onComplete?.()
    }
  }

  const stopSpeaking = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      setIsSpeaking(false)
    }
  }

  const startListening = () => {
    stopSpeaking()
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      try {
        audioChunksRef.current = []
        mediaRecorderRef.current.start()
        setIsListening(true)
        setAiStatus('Listening... Speak now into your microphone')
      } catch (err) {
        console.warn('MediaRecorder start warning:', err)
      }
    } else {
      setAiStatus('Please allow microphone permissions to use voice input.')
    }
  }

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop()
      } catch (err) {}
    }
  }

  const sendAudioQuery = async (audioBlob: Blob) => {
    setIsProcessing(true)
    setAiStatus('KrishiRakshak AI is transcribing and analyzing your voice command...')
    
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      formData.append('language', selectedLang)
      formData.append('user_name', userName)

      const res = await fetch('/api/voice-guide-offline', {
        method: 'POST',
        body: formData
      })

      const result = await res.json()

      if (result.status === 'success' && result.data) {
        const { target_tab, target_element_id, action_label, audio_base64, transcription, spoken_response } =
          result.data

        if (transcription) {
          setMessages((prev) => [...prev, { sender: 'user', text: transcription }])
        }

        const clean_target_tab = (target_tab && target_tab !== 'null') ? target_tab.toLowerCase() : null
        
        const aiMsg: Message = {
          sender: 'ai',
          text: spoken_response || 'Local AI has processed your request.',
          actionLabel: action_label || (clean_target_tab ? `Go to ${clean_target_tab.toUpperCase()}` : undefined),
          targetTab: clean_target_tab as DashboardTab,
          targetElementId: target_element_id
        }

        setMessages((prev) => [...prev, aiMsg])
        
        // We removed auto-navigation countdown based on user feedback.
        // User can now click the manual navigation button in the chat interface.
        
        if (audio_base64) {
          speakText(audio_base64, undefined, selectedLang, () => {})
        } else {
          speakText(undefined, spoken_response || 'Done', selectedLang, () => {})
        }
      } else {
        throw new Error(result.message || 'AI Voice Guide error')
      }
    } catch (error: any) {
      console.warn('Offline Voice Guide API Fallback:', error)
      setIsProcessing(false)
      setAiStatus('Error processing offline audio. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Core KrishiRakshak AI Multilingual Processing (For Typed Text)
  const handleSendQuery = async (queryText: string) => {
    const query = queryText.trim()
    if (!query) return

    setMessages((prev) => [...prev, { sender: 'user', text: query }])
    setTranscript('')
    setTextInput('')
    setIsProcessing(true)
    setAiStatus('KrishiRakshak AI is analyzing your voice command...')

    try {
      const res = await fetch('/api/voice-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language: selectedLang, user_name: userName })
      })

      const result = await res.json()

      if (result.status === 'success' && result.data) {
        const { target_tab, target_element_id, action_label, spoken_response, language_code } =
          result.data

        const clean_target_tab = (target_tab && target_tab !== 'null') ? target_tab.toLowerCase() : null
        
        const aiMsg: Message = {
          sender: 'ai',
          text: spoken_response || 'Let me help you with that.',
          actionLabel: action_label || (clean_target_tab ? `Go to ${clean_target_tab.toUpperCase()}` : undefined),
          targetTab: clean_target_tab as DashboardTab,
          targetElementId: target_element_id
        }

        setMessages((prev) => [...prev, aiMsg])
        
        // We removed auto-navigation countdown. User will use the button.
        
        const startNavCountdown = () => {}

        // Use backend TTS if available, fallback to native browser TTS
        if (result.data.audio_base64) {
          speakText(result.data.audio_base64, spoken_response, language_code || selectedLang, startNavCountdown)
        } else {
          speakText(undefined, spoken_response, language_code || selectedLang, startNavCountdown)
        }
      } else {
        throw new Error(result.message || 'AI Voice Guide error')
      }
    } catch (error: any) {
      console.warn('Voice Guide API Fallback:', error)
      const fallbackReply = getWelcomeMessage(selectedLang, userName)
      setMessages((prev) => [...prev, { sender: 'ai', text: fallbackReply }])
      speakText(undefined, fallbackReply, selectedLang)
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
                <span className="bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                KrishiRakshak AI
              </span>
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                <p className="text-gray-500 text-xs mt-1">Speak in ANY language — KrishiRakshak AI understands your voice & navigates!</p>
              </div>
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
              <span>KrishiRakshak AI is thinking & generating your voice response...</span>
            </div>
          )}

          {isSpeaking && !isProcessing && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 animate-pulse pl-2">
              <Volume2 className="size-4" />
              <span>AI Speaking...</span>
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

