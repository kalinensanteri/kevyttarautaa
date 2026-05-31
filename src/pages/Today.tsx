import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getDayPlan, getWeekDates, addDays } from '../data/schedule'
import { SessionCard } from '../components/SessionCard'
import { RestTimer } from '../components/RestTimer'
import type { AppState, SetLog } from '../types'

type Props = {
  state: AppState
  actions: {
    setViewDate: (d: string) => void
    completeSession: (date: string, sessionId: string) => void
    logExerciseSet: (date: string, sessionId: string, ex: string, i: number, log: SetLog) => void
    logSessionRun: (date: string, sessionId: string, data: { min?: number; km?: number; hr?: number }) => void
    logMetconResult: (date: string, sessionId: string, result: string) => void
    startRestTimer: (s: number) => void
    clearRestTimer: () => void
  }
}

const DAY_ABBR = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

function fmtDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function Today({ state, actions }: Props) {
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null)
  const { viewDate, dayLogs } = state
  const plan = getDayPlan(viewDate)
  const weekDates = getWeekDates(viewDate)
  const dayLog = dayLogs[viewDate]

  const activeSessions = plan.sessions.filter(s => s.type !== 'rest')
  const completedCount = activeSessions.filter(s => dayLog?.sessions[s.id]?.completed).length

  return (
    <div className="pb-24">
      {/* ── Sticky header ─────────────────────────────── */}
      <div className="sticky top-0 z-30 glass-nav px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => actions.setViewDate(addDays(viewDate, -1))}
            className="p-1.5 rounded-xl border border-white/10 text-white/40 hover:text-white/70 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <p className="text-[10px] text-white/30 uppercase tracking-widest">
              Phase {state.currentPhase} · {plan.emphasis}
            </p>
            <p className="text-base font-semibold text-white">{fmtDate(viewDate)}</p>
          </div>
          <button
            onClick={() => actions.setViewDate(addDays(viewDate, 1))}
            className="p-1.5 rounded-xl border border-white/10 text-white/40 hover:text-white/70 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Week pills */}
        <div className="flex gap-1.5">
          {weekDates.map((d, i) => {
            const isSelected = d === viewDate
            const isNow = d === todayStr()
            const allDone = !!dayLogs[d] &&
              Object.values(dayLogs[d].sessions).length > 0 &&
              Object.values(dayLogs[d].sessions).every(s => s.completed)
            return (
              <button
                key={d}
                onClick={() => actions.setViewDate(d)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  isSelected
                    ? 'bg-white text-black'
                    : allDone
                    ? 'border border-white/20 text-white/50'
                    : isNow
                    ? 'border border-white/30 text-white/60'
                    : 'border border-white/8 text-white/25 hover:border-white/20 hover:text-white/50'
                }`}
              >
                {DAY_ABBR[i]}
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Day header */}
        <div className="glass p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-0.5">{plan.name}</p>
              <h2 className="text-white font-bold text-lg">{plan.subtitle}</h2>
            </div>
            {activeSessions.length > 0 && (
              <div className="text-right">
                <p className="text-2xl font-bold text-white tabular-nums">
                  {completedCount}
                  <span className="text-white/25 text-sm font-normal">/{activeSessions.length}</span>
                </p>
                <p className="text-[10px] text-white/25 mt-0.5">sessions</p>
              </div>
            )}
          </div>
          {activeSessions.length > 0 && (
            <div className="mt-3 h-px bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / activeSessions.length) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Session cards */}
        {plan.sessions.map((session, i) => (
          <SessionCard
            key={session.id}
            session={session}
            sessionLog={dayLog?.sessions[session.id]}
            date={viewDate}
            onComplete={() => actions.completeSession(viewDate, session.id)}
            onLogSet={(ex, idx, log) => actions.logExerciseSet(viewDate, session.id, ex, idx, log)}
            onLogRun={data => actions.logSessionRun(viewDate, session.id, data)}
            onLogMetcon={result => actions.logMetconResult(viewDate, session.id, result)}
            onStartTimer={s => { setTimerSeconds(s); actions.startRestTimer(s) }}
            defaultOpen={i === 0 && plan.sessions[0].type !== 'rest'}
          />
        ))}
      </div>

      {timerSeconds !== null && (
        <RestTimer
          seconds={timerSeconds}
          onDone={() => setTimerSeconds(null)}
          onDismiss={() => setTimerSeconds(null)}
        />
      )}
    </div>
  )
}
