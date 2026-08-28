'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type CropItem = {
  id: string
  name: string
  variety: string
  plantDate: string
  health: 'Healthy' | 'Needs attention'
  durationDays: number // Authentic duration
}

type AuthenticCrop = {
  id: string
  enName: string
  aliases: string[]
  defaultVariety: string
  durationDays: number
}

// Authentic Indian Agricultural Database
export const AUTHENTIC_CROPS_DB: AuthenticCrop[] = [
  { id: 'tomato', enName: 'Tomato', aliases: ['tomato', 'టమోటా', 'टमाटर'], defaultVariety: 'Arka Rakshak', durationDays: 140 },
  { id: 'paddy', enName: 'Paddy', aliases: ['paddy', 'rice', 'వరి', 'धान'], defaultVariety: 'BPT-5204', durationDays: 150 },
  { id: 'cotton', enName: 'Cotton', aliases: ['cotton', 'పత్తి', 'कपास'], defaultVariety: 'Bt Cotton (Mallika)', durationDays: 160 },
  { id: 'chilli', enName: 'Chilli', aliases: ['chilli', 'mirchi', 'మిరప', 'मिर्च'], defaultVariety: 'Guntur Sannam', durationDays: 150 },
  { id: 'wheat', enName: 'Wheat', aliases: ['wheat', 'గోధుమ', 'गेहूं'], defaultVariety: 'HD 2967', durationDays: 120 },
  { id: 'maize', enName: 'Maize', aliases: ['maize', 'corn', 'మొక్కజొన్న', 'मक्का'], defaultVariety: 'Kargil 900M', durationDays: 110 },
  { id: 'sugarcane', enName: 'Sugarcane', aliases: ['sugarcane', 'చెరకు', 'गन्ना'], defaultVariety: 'Co 0238', durationDays: 360 },
]

interface CropContextType {
  crops: CropItem[]
  addCrop: (name: string, variety: string, date: string) => { success: boolean; error?: string }
  removeCrop: (id: string) => void
}

const CropContext = createContext<CropContextType | undefined>(undefined)

export function CropProvider({ children }: { children: React.ReactNode }) {
  const [crops, setCrops] = useState<CropItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('krishi_user_crops')
    if (saved) setCrops(JSON.parse(saved))
    setIsLoaded(true)
  }, [])

  const addCrop = (name: string, variety: string, date: string) => {
    const query = name.toLowerCase().trim()
    const authenticMatch = AUTHENTIC_CROPS_DB.find(c => 
      c.aliases.includes(query) || c.enName.toLowerCase() === query
    )

    // Validation: Reject if it's not a real agricultural crop
    if (!authenticMatch) {
      return { success: false, error: 'invalid_crop' }
    }

    const newCrop: CropItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: authenticMatch.enName,
      variety: variety.trim() || authenticMatch.defaultVariety, // Auto-fill authentic variety if left blank
      plantDate: date || new Date().toISOString().split('T')[0],
      health: 'Healthy',
      durationDays: authenticMatch.durationDays
    }

    const updated = [...crops, newCrop]
    setCrops(updated)
    localStorage.setItem('krishi_user_crops', JSON.stringify(updated))
    return { success: true }
  }

  const removeCrop = (id: string) => {
    const updated = crops.filter(c => c.id !== id)
    setCrops(updated)
    localStorage.setItem('krishi_user_crops', JSON.stringify(updated))
  }

  if (!isLoaded) return <div className="min-h-screen bg-background" />

  return (
    <CropContext.Provider value={{ crops, addCrop, removeCrop }}>
      {children}
    </CropContext.Provider>
  )
}

export function useCrop() {
  const context = useContext(CropContext)
  if (!context) throw new Error('useCrop must be used within a CropProvider')
  return context
}