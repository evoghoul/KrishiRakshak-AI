'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { collection, getDocs, addDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const INITIAL_POOLS = [
  { crop: 'Chilli', village: 'Vadlamudi', locked: 18, target: 25, unit: 'Tons', bonus: '12%', bonusPercent: 12, members: 14 },
  { crop: 'Turmeric', village: 'Duggirala', locked: 9, target: 20, unit: 'Tons', bonus: '9%', bonusPercent: 9, members: 8 },
  { crop: 'Paddy', village: 'Tenali', locked: 42, target: 50, unit: 'Tons', bonus: '7%', bonusPercent: 7, members: 23 },
]

const INITIAL_VEHICLES = [
  { name: 'Tata Ace (Chhota Hathi)', type: 'Mini Truck', capacity: '1 Ton (10 Quintals)', distanceKm: 2.1, freight: 900, rating: 4.7, available: true, driverName: 'Ramesh Rao', driverPhone: '+91 94408 11223', plateNumber: 'AP 07 TX 4829' },
  { name: 'Mahindra Bolero Maxi Truck', type: 'Mini Truck', capacity: '1.5 Tons (15 Quintals)', distanceKm: 3.5, freight: 1350, rating: 4.5, available: true, driverName: 'Suresh Kumar', driverPhone: '+91 98481 99887', plateNumber: 'AP 07 BK 9021' },
  { name: 'John Deere 5050D Tractor Trolley', type: 'Tractor', capacity: '3.5 Tons (35 Quintals)', distanceKm: 1.8, freight: 1600, rating: 4.8, available: true, driverName: 'Venkata Reddy', driverPhone: '+91 99592 33445', plateNumber: 'AP 07 TT 1102' },
  { name: 'Ashok Leyland Bada Dost', type: 'Truck', capacity: '2.5 Tons (25 Quintals)', distanceKm: 6.2, freight: 2100, rating: 4.4, available: true, driverName: 'Mohan Lal', driverPhone: '+91 97003 44556', plateNumber: 'AP 07 Z 6744' },
]

const BUYERS = [
  { name: 'Sri Lakshmi Traders', type: 'Wholesaler', distanceKm: 4.2, crop: 'Tomato', price: 2600, unit: 'quintal', verified: true, phone: '+91 98480 12345', licenseId: 'AP-GTR-APMC-8821', address: 'Shop 14, Guntur Main APMC Yard, Andhra Pradesh' },
  { name: 'AgroFresh Exports', type: 'Exporter', distanceKm: 9.8, crop: 'Chilli', price: 19200, unit: 'quintal', verified: true, phone: '+91 98492 67890', licenseId: 'AP-EXP-GTR-4102', address: 'Plot 8B, Auto Nagar Industrial Area, Guntur' },
  { name: 'Guntur Spice Mandi Aggregators', type: 'Aggregator', distanceKm: 12.5, crop: 'Turmeric', price: 14600, unit: 'quintal', verified: true, phone: '+91 94401 54321', licenseId: 'AP-SPICE-DUG-309', address: 'Duggirala Turmeric Terminal, Guntur District' },
  { name: 'Krishna Rice Processing Mills', type: 'Processor', distanceKm: 15.1, crop: 'Paddy', price: 2240, unit: 'quintal', verified: true, phone: '+91 98855 98765', licenseId: 'AP-MILL-TNL-1144', address: 'Tenali Highway Junction, Guntur' },
]

export default function SeedPage() {
  const [status, setStatus] = useState('Waiting for auth...')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setStatus('Checking pools...')
          const poolsSnap = await getDocs(collection(db, 'pools'))
          if (poolsSnap.empty) {
            setStatus('Seeding pools...')
            for (const p of INITIAL_POOLS) await addDoc(collection(db, 'pools'), p)
          }

          setStatus('Checking vehicles...')
          const vehiclesSnap = await getDocs(collection(db, 'vehicles'))
          if (vehiclesSnap.empty) {
            setStatus('Seeding vehicles...')
            for (const v of INITIAL_VEHICLES) await addDoc(collection(db, 'vehicles'), v)
          }

          setStatus('Checking buyers...')
          const buyersSnap = await getDocs(collection(db, 'buyers'))
          if (buyersSnap.empty) {
            setStatus('Seeding buyers...')
            for (const b of BUYERS) await addDoc(collection(db, 'buyers'), b)
          }

          setStatus('Seeding complete! You can return to the dashboard.')
        } catch (e: any) {
          setStatus('Error: ' + e.message)
        }
      } else {
        setStatus('Please log in first.')
      }
    })
    return () => unsub()
  }, [])

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="rounded-xl border border-border bg-card p-8 shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-4">Database Seeder</h1>
        <p className="text-lg text-muted-foreground">{status}</p>
      </div>
    </div>
  )
}
