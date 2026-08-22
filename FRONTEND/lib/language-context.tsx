'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type SupportedLang =
  | 'en' // English
  | 'te' // Telugu (తెలుగు)
  | 'hi' // Hindi (हिन्दी)
  | 'ta' // Tamil (தமிழ்)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'ml' // Malayalam (മലയാളം)
  | 'mr' // Marathi (मराठी)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'bn' // Bengali (বাংলা)
  | 'pa' // Punjabi (ਪੰਜਾਬੀ)
  | 'or' // Odia (ଓଡ଼ିଆ)
  | 'as' // Assamese (অসমীয়া)
  | 'ur' // Urdu (اردو)
  | 'sa' // Sanskrit (संस्कृतम्)
  | 'ne' // Nepali (नेपाली)
  | 'kok' // Konkani (कोंकणी)
  | 'mai' // Maithili (मैथिली)
  | 'doi' // Dogri (डोगरी)
  | 'ks' // Kashmiri (कॉशुर)
  | 'mni' // Manipuri / Meitei (মৈতৈলোন্)
  | 'sat' // Santali (ᱥᱟᱱᱛᱟᱲᱤ)
  | 'sd' // Sindhi (سنڌي)
  | 'brx' // Bodo (बर')

export const LANGUAGE_OPTIONS: { code: SupportedLang; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', label: 'Assamese', native: 'অসমীয়া' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
  { code: 'sa', label: 'Sanskrit', native: 'संस्कृतम्' },
  { code: 'ne', label: 'Nepali', native: 'नेपाली' },
  { code: 'kok', label: 'Konkani', native: 'कोंकणी' },
  { code: 'mai', label: 'Maithili', native: 'मैथिली' },
  { code: 'doi', label: 'Dogri', native: 'डोगरी' },
  { code: 'ks', label: 'Kashmiri', native: 'कॉशुर' },
  { code: 'mni', label: 'Manipuri', native: 'মৈতৈলোন্' },
  { code: 'sat', label: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'sd', label: 'Sindhi', native: 'سنڌي' },
  { code: 'brx', label: 'Bodo', native: 'बर\'' },
]

const REGION_LANGUAGE_MAP: Record<string, SupportedLang> = {
  // Andhra Pradesh & Telangana -> Telugu
  'Andhra Pradesh': 'te',
  'Telangana': 'te',

  // Tamil Nadu & Puducherry -> Tamil
  'Tamil Nadu': 'ta',
  'Puducherry': 'ta',

  // Karnataka -> Kannada
  'Karnataka': 'kn',

  // Kerala & Lakshadweep -> Malayalam
  'Kerala': 'ml',
  'Lakshadweep': 'ml',

  // Maharashtra -> Marathi
  'Maharashtra': 'mr',

  // Gujarat & Daman/Diu -> Gujarati
  'Gujarat': 'gu',
  'Dadra and Nagar Haveli and Daman and Diu': 'gu',

  // West Bengal & Tripura -> Bengali
  'West Bengal': 'bn',
  'Tripura': 'bn',

  // Punjab & Chandigarh -> Punjabi
  'Punjab': 'pa',
  'Chandigarh': 'pa',

  // Odisha -> Odia
  'Odisha': 'or',

  // Assam -> Assamese
  'Assam': 'as',

  // Goa -> Konkani
  'Goa': 'kok',

  // Jammu & Kashmir -> Kashmiri / Dogri
  'Jammu and Kashmir': 'ks',
  'Ladakh': 'ur',

  // Manipur -> Manipuri
  'Manipur': 'mni',

  // Sikkim -> Nepali
  'Sikkim': 'ne',

  // Hindi Belt (Northern & Central India)
  'Uttar Pradesh': 'hi',
  'Madhya Pradesh': 'hi',
  'Bihar': 'hi',
  'Rajasthan': 'hi',
  'Haryana': 'hi',
  'Himachal Pradesh': 'hi',
  'Uttarakhand': 'hi',
  'Chhattisgarh': 'hi',
  'Jharkhand': 'hi',
  'Delhi': 'hi',
  'National Capital Territory of Delhi': 'hi',
  'Andaman and Nicobar Islands': 'hi',
}

interface LanguageContextType {
  lang: SupportedLang
  setLang: (lang: SupportedLang) => void
  detectedRegion: string | null
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<SupportedLang>('en')
  const [detectedRegion, setDetectedRegion] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initLanguage = async () => {
      const savedLang = localStorage.getItem('krishi_lang') as SupportedLang

      // 1. If user previously manually selected a language, respect their choice
      if (savedLang && LANGUAGE_OPTIONS.some((l) => l.code === savedLang)) {
        setLangState(savedLang)
        setIsInitialized(true)
        return
      }

      // 2. Otherwise, auto-detect location via IP Geolocation
      try {
        const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' })
        const data = await res.json()
        const region = data.region || data.region_name || ''
        setDetectedRegion(region)

        const matchedLang = REGION_LANGUAGE_MAP[region]
        if (matchedLang) {
          setLangState(matchedLang)
          localStorage.setItem('krishi_lang', matchedLang)
          setIsInitialized(true)
          return
        }
      } catch {
        // Fallback geo-service if primary is rate-limited
        try {
          const res2 = await fetch('https://get.geojs.io/v1/ip/geo.json')
          const data2 = await res2.json()
          const region2 = data2.region || ''
          setDetectedRegion(region2)

          const matchedLang2 = REGION_LANGUAGE_MAP[region2]
          if (matchedLang2) {
            setLangState(matchedLang2)
            localStorage.setItem('krishi_lang', matchedLang2)
            setIsInitialized(true)
            return
          }
        } catch (e) {
          console.warn('Geo-detection unavailable, falling back to browser locale:', e)
        }
      }

      // 3. Fallback to browser locale
      const browserLang = navigator.language?.split('-')[0] as SupportedLang
      const isSupported = LANGUAGE_OPTIONS.some((l) => l.code === browserLang)
      const finalLang = isSupported ? browserLang : 'en'

      setLangState(finalLang)
      localStorage.setItem('krishi_lang', finalLang)
      setIsInitialized(true)
    }

    initLanguage()
  }, [])

  const setLang = (newLang: SupportedLang) => {
    setLangState(newLang)
    localStorage.setItem('krishi_lang', newLang)
  }

  if (!isInitialized) return <div className="min-h-screen bg-background" />

  return (
    <LanguageContext.Provider value={{ lang, setLang, detectedRegion }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}