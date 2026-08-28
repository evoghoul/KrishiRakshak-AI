'use client'

import { useState, useEffect } from 'react'
import { CalendarClock, CheckCircle2, Circle, Droplets, ShieldAlert, Sparkles, Leaf, X } from 'lucide-react'
import { auth, db } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

export function SchedulePlanner({ rainDelayActive = false, scanData }: { rainDelayActive?: boolean, scanData?: any }) {
  const [completed, setCompleted] = useState<string[]>([])
  const [tasks, setTasks] = useState<any[]>([])

  const toggleTask = async (id: string) => {
    const isNowDone = !completed.includes(id)
    setCompleted(prev => isNowDone ? [...prev, id] : prev.filter(t => t !== id))
    
    const session = localStorage.getItem('krishi_session')
    const userSession = session ? JSON.parse(session) : null
    const userId = userSession?.phoneOrEmail || auth.currentUser?.uid
    if (userId) {
      try {
        await updateDoc(doc(db, 'users', userId, 'scans', id), {
          completed: isNowDone
        })
      } catch (e) {
        console.error("Failed to update task", e)
      }
    }
  }

  const handleDeleteTask = async (id: string) => {
    const session = localStorage.getItem('krishi_session')
    const userSession = session ? JSON.parse(session) : null
    const userId = userSession?.phoneOrEmail || auth.currentUser?.uid
    if (userId) {
      try {
        await deleteDoc(doc(db, 'users', userId, 'scans', id))
      } catch (e) {
        console.error("Failed to delete task", e)
      }
    }
  }

  // Real-time listener for all historical AI prescribed tasks
  useEffect(() => {
    const session = localStorage.getItem('krishi_session')
    const userSession = session ? JSON.parse(session) : null
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      const userId = userSession?.phoneOrEmail || user?.uid
      if (userId) {
        const q = query(collection(db, 'users', userId, 'scans'), orderBy('timestamp', 'desc'))
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const loadedTasks = snapshot.docs.map(doc => {
            const data = doc.data()
            return {
              id: doc.id,
              title: data.task || 'Monitor crop health',
              crop: data.crop || 'Unknown Crop',
              icon: Sparkles,
              color: 'text-primary',
              bg: 'bg-primary/10',
              date: 'AI Prescribed',
              affectedByRain: false,
              completed: !!data.completed
            }
          })
          setTasks(loadedTasks)
          setCompleted(loadedTasks.filter(t => t.completed).map(t => t.id))
        })
        return () => unsubscribeSnapshot()
      } else {
        setTasks([])
        setCompleted([])
      }
    })
    return () => unsubscribeAuth()
  }, [])

  return (
    <section className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-secondary">
          <CalendarClock className="size-5 text-primary" />
        </span>
        <div>
          <h2 className="text-base font-bold text-foreground">Smart Schedule Planner</h2>
          <p className="text-xs text-muted-foreground">Upcoming tasks & field milestones</p>
        </div>
      </div>
      
      {tasks.length > 0 ? (
        <ul className="flex flex-col gap-3 mt-2">
          {tasks.map(task => {
            const isDone = completed.includes(task.id)
            const Icon = task.icon
            return (
              <li key={task.id} className={`group relative flex items-center gap-4 rounded-2xl border p-4 transition-all ${isDone ? 'border-border bg-secondary/20 opacity-60' : 'border-border bg-secondary/40 hover:border-primary'}`}>
                <button onClick={() => toggleTask(task.id)} className="shrink-0 transition-transform hover:scale-110">
                  {isDone ? <CheckCircle2 className="size-6 text-primary" /> : <Circle className="size-6 text-muted-foreground" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`truncate text-sm font-bold ${isDone ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{task.title}</p>
                  <p className="truncate text-xs text-muted-foreground mt-0.5">{task.crop}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${task.affectedByRain && rainDelayActive ? 'bg-amber-500/10 text-amber-600' : task.bg + ' ' + task.color}`}>
                    {task.date}
                  </span>
                </div>
                {/* Delete button appears on hover */}
                <button 
                  onClick={() => handleDeleteTask(task.id)} 
                  className="absolute -top-2 -right-2 hidden size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:flex group-hover:opacity-100 transition-opacity shadow-sm"
                  title="Remove Task"
                >
                  <X className="size-3" />
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/20 p-8 text-center mt-2">
          <Leaf className="size-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-bold text-foreground">No tasks scheduled</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
            Scan a crop leaf above to get AI-prescribed agricultural tasks and treatment schedules.
          </p>
        </div>
      )}
    </section>
  )
}