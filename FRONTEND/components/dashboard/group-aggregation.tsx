'use client'

import { useState, useEffect } from 'react'
import { Users, Gift, TrendingUp, X, CheckCircle2, Plus, Sparkles, ShieldCheck, Loader2 } from 'lucide-react'
import { db } from '@/lib/firebase'
import { collection, onSnapshot, addDoc, doc, updateDoc } from 'firebase/firestore'

type Pool = {
  id: string
  crop: string
  village: string
  locked: number
  target: number
  unit: string
  bonus: string
  members: number
  bonusPercent: number
}

export function GroupAggregation() {
  const [pools, setPools] = useState<Pool[]>([])
  const [lockModalPool, setLockModalPool] = useState<Pool | null>(null)
  const [newPoolModalOpen, setNewPoolModalOpen] = useState(false)
  const [lockedAmount, setLockedAmount] = useState('2.5')
  const [lockSuccess, setLockSuccess] = useState(false)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pools'), (snapshot) => {
      const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Pool))
      setPools(loaded)
    })
    return () => unsubscribe()
  }, [])

  // New pool form state
  const [newCrop, setNewCrop] = useState('Tomato')
  const [newVillage, setNewVillage] = useState('Vadlamudi')
  const [newTarget, setNewTarget] = useState('30')
  const [newBonus, setNewBonus] = useState('10')
  const [isSearching, setIsSearching] = useState(false)

  const handleAiSearch = async () => {
    setIsSearching(true)
    try {
      const res = await fetch('http://localhost:8000/api/ai-pools?location=Vadlamudi')
      const data = await res.json()
      if (data.status === 'success' || data.status === 'fallback') {
        const newPools = data.data
        for (const p of newPools) {
          await addDoc(collection(db, 'pools'), p)
        }
      }
    } catch (err) {
      console.error("AI Search Failed", err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleConfirmLock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lockModalPool) return

    const amountNum = parseFloat(lockedAmount) || 1
    const updatedLocked = Math.min(lockModalPool.target, lockModalPool.locked + amountNum)
    
    try {
      const poolRef = doc(db, 'pools', lockModalPool.id)
      await updateDoc(poolRef, {
        locked: parseFloat(updatedLocked.toFixed(1)),
        members: lockModalPool.members + 1
      })
      
      setLockSuccess(true)
      setTimeout(() => {
        setLockModalPool(null)
        setLockSuccess(false)
      }, 1800)
    } catch (error) {
      console.error("Error updating pool:", error)
    }
  }

  const handleCreatePool = async (e: React.FormEvent) => {
    e.preventDefault()
    const created = {
      crop: newCrop,
      village: newVillage,
      locked: 1.5,
      target: parseFloat(newTarget) || 20,
      unit: 'Tons',
      bonus: `${newBonus}%`,
      bonusPercent: parseFloat(newBonus) || 10,
      members: 1
    }

    try {
      await addDoc(collection(db, 'pools'), created)
      setNewPoolModalOpen(false)
    } catch (error) {
      console.error("Error creating pool:", error)
    }
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-5 lg:p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Users className="size-5" aria-hidden="true" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">Farmer-Group Aggregation</h2>
              <button 
                onClick={handleAiSearch} 
                disabled={isSearching}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 text-[10px] font-extrabold text-white shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
                {isSearching ? "Searching AI..." : "AI Search Live"}
              </button>
            </div>
            <p className="text-sm text-muted-foreground">Pool your harvest to unlock bulk price bonuses (+7% to +15%)</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setNewPoolModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-xs font-extrabold text-primary transition-all hover:bg-primary hover:text-primary-foreground shadow-sm active:scale-95"
        >
          <Plus className="size-4" /> Start a new pool
        </button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {pools.map((pool) => {
          const pct = Math.min(100, Math.round((pool.locked / pool.target) * 100))
          const remaining = Math.max(0, parseFloat((pool.target - pool.locked).toFixed(1)))
          return (
            <article key={pool.id} className="rounded-2xl border border-border bg-background p-4 hover:border-primary/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-foreground">{pool.crop} Community Pool</h3>
                    <p className="text-xs text-muted-foreground">{pool.village} village</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs font-extrabold text-primary">
                    <Gift className="size-3.5" aria-hidden="true" />
                    {pool.bonus} bonus
                  </span>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <span className="text-2xl font-black text-foreground">
                    {pool.locked}
                    <span className="text-sm font-medium text-muted-foreground">/{pool.target} {pool.unit}</span>
                  </span>
                  <span className="text-sm font-extrabold text-primary">{pct}%</span>
                </div>

                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-semibold">
                    <TrendingUp className="size-3.5 text-primary" aria-hidden="true" />
                    {remaining > 0 ? `${remaining} ${pool.unit} to unlock` : 'Target Achieved!'}
                  </span>
                  <span className="font-bold text-foreground">{pool.members} farmers</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setLockModalPool(pool)
                  setLockSuccess(false)
                }}
                className="mt-4 w-full rounded-xl bg-primary py-2.5 text-xs font-extrabold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] shadow-sm flex items-center justify-center gap-1.5"
              >
                <Sparkles className="size-3.5" /> Lock my harvest
              </button>
            </article>
          )
        })}
      </div>

      {/* Lock Harvest in Pool Modal */}
      {lockModalPool && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setLockModalPool(null)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border bg-secondary/40 p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Users className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-foreground">Lock Harvest in {lockModalPool.crop} Pool</h3>
                  <p className="text-xs text-muted-foreground">{lockModalPool.village} Community Collective</p>
                </div>
              </div>
              <button
                onClick={() => setLockModalPool(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {lockSuccess ? (
                <div className="flex flex-col items-center justify-center gap-2 py-6 text-primary animate-in zoom-in">
                  <CheckCircle2 className="size-12 text-primary" />
                  <p className="text-base font-black">Harvest Locked in Pool!</p>
                  <p className="text-xs text-muted-foreground text-center">
                    {lockedAmount} Tons successfully added to {lockModalPool.crop} Pool. You have secured the {lockModalPool.bonus} bulk bonus!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConfirmLock} className="space-y-4">
                  <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-muted-foreground">Community Pool Target:</span>
                      <span className="text-foreground">{lockModalPool.locked} / {lockModalPool.target} Tons</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-muted-foreground">Guaranteed Bulk Bonus:</span>
                      <span className="text-primary font-black text-sm">{lockModalPool.bonus} Extra Revenue</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-foreground block mb-1.5">
                      How many Tons do you want to lock?
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="20"
                        value={lockedAmount}
                        onChange={(e) => setLockedAmount(e.target.value)}
                        required
                        className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-2.5 text-sm font-bold text-foreground outline-none focus:border-primary"
                      />
                      <span className="font-bold text-xs text-muted-foreground">Tons</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-background p-4 text-xs space-y-1.5">
                    <div className="flex justify-between font-semibold text-muted-foreground">
                      <span>Standard Mandi Value:</span>
                      <span>₹{((parseFloat(lockedAmount) || 0) * 10 * 2400).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-primary">
                      <span>+ {lockModalPool.bonus} Collective Bonus:</span>
                      <span>+ ₹{((parseFloat(lockedAmount) || 0) * 10 * 2400 * (lockModalPool.bonusPercent / 100)).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t border-border pt-1.5 flex justify-between font-black text-sm text-foreground">
                      <span>Total Guaranteed Payout:</span>
                      <span className="text-primary">₹{((parseFloat(lockedAmount) || 0) * 10 * 2400 * (1 + lockModalPool.bonusPercent / 100)).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-extrabold text-primary-foreground shadow-md hover:bg-primary/90 transition-all active:scale-[0.98]"
                  >
                    <CheckCircle2 className="size-4" /> Confirm &amp; Lock Harvest
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Start New Pool Modal */}
      {newPoolModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setNewPoolModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border bg-secondary/40 p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Plus className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-foreground">Start a New Community Pool</h3>
                  <p className="text-xs text-muted-foreground">Gather neighbors to unlock wholesale exporter bonuses</p>
                </div>
              </div>
              <button
                onClick={() => setNewPoolModalOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePool} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Crop to Aggregate</label>
                <select
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-xs font-bold text-foreground outline-none focus:border-primary"
                >
                  <option value="Tomato">Tomato</option>
                  <option value="Chilli">Chilli (Red)</option>
                  <option value="Turmeric">Turmeric</option>
                  <option value="Paddy">Paddy (Rice)</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Maize">Maize (Corn)</option>
                  <option value="Onion">Onion</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Village / Cluster Name</label>
                <input
                  type="text"
                  value={newVillage}
                  onChange={(e) => setNewVillage(e.target.value)}
                  required
                  placeholder="e.g. Vadlamudi / Chebrolu"
                  className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs font-bold text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">Target Pool Size</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={newTarget}
                      onChange={(e) => setNewTarget(e.target.value)}
                      min="5"
                      required
                      className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs font-bold text-foreground outline-none focus:border-primary"
                    />
                    <span className="text-xs font-bold text-muted-foreground">Tons</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">Target Bonus</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={newBonus}
                      onChange={(e) => setNewBonus(e.target.value)}
                      min="5"
                      max="25"
                      required
                      className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs font-bold text-foreground outline-none focus:border-primary"
                    />
                    <span className="text-xs font-bold text-muted-foreground">%</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-extrabold text-primary-foreground shadow-md hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                <CheckCircle2 className="size-4" /> Create &amp; Launch Community Pool
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

