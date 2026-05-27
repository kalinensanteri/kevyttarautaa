import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

type Props = {
  seconds: number
  onDone: () => void
  onDismiss: () => void
}

export function RestTimer({ seconds, onDone, onDismiss }: Props) {
  const [remaining, setRemaining] = useState(seconds)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setRemaining(seconds)
  }, [seconds])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(intervalRef.current!)
          onDone()
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current!)
  }, [seconds, onDone])

  const pct = ((seconds - remaining) / seconds) * 100
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[440px] z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
        <div className="relative w-14 h-14 shrink-0">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" fill="none" stroke="#1e293b" strokeWidth="4" />
            <circle
              cx="28" cy="28" r="24"
              fill="none"
              stroke="#f97316"
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 24}`}
              strokeDashoffset={`${2 * Math.PI * 24 * (1 - pct / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
            {mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : secs}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400 mb-0.5">Rest timer</p>
          <p className="text-white font-medium">
            {remaining === 0 ? 'Time to go!' : `${mins > 0 ? `${mins}m ` : ''}${secs}s remaining`}
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-500 hover:text-slate-300 transition-colors p-1"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
