import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, Zap, CheckCircle2, RotateCcw } from 'lucide-react'
import { block1Workouts } from '../data/block1'
import { SectionCard } from '../components/SectionCard'
import { RestTimer } from '../components/RestTimer'
import type { AppState } from '../types'

type Props = {
  state: AppState
  actions: {
    startWorkout: (id: string) => void
    completeSection: (workoutId: string, sectionId: string) => void
    logSet: (workoutId: string, sectionId: string, setIndex: number, log: { load?: number; reps?: number; rpe?: number }) => void
    finishWorkout: (id: string) => void
    setCurrentWorkout: (week: number, day: number) => void
    startRestTimer: (seconds: number) => void
    clearRestTimer: () => void
  }
}

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function Today({ state, actions }: Props) {
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null)

  const { currentWeek, currentDay } = state
  const workout = block1Workouts.find(w => w.week === currentWeek && w.day === currentDay)

  if (!workout) return (
    <div className="p-6 text-center text-slate-400">
      <p>No workout found for Week {currentWeek}, Day {currentDay}.</p>
    </div>
  )

  const log = state.workoutLogs[workout.id]
  const completedSections = Object.values(log?.sections ?? {}).filter(s => s.completed).length
  const totalSections = workout.sections.length
  const isStarted = !!log?.startedAt
  const isFinished = !!log?.completedAt
  const progressPct = totalSections > 0 ? (completedSections / totalSections) * 100 : 0

  function navigate(delta: number) {
    let d = currentDay + delta
    let w = currentWeek
    if (d < 1) { w = Math.max(1, w - 1); d = 6 }
    if (d > 6) { w = Math.min(4, w + 1); d = 1 }
    actions.setCurrentWorkout(w, d)
  }

  function handleStartTimer(seconds: number) {
    setTimerSeconds(seconds)
    actions.startRestTimer(seconds)
  }

  return (
    <div className="pb-24">
      {/* Week/day selector */}
      <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <p className="text-xs text-slate-500">
              Week {currentWeek} · Block 1{workout.isDeload ? ' · 🔄 DELOAD' : ''}
            </p>
            <p className="text-base font-semibold text-white">{DAY_NAMES[currentDay - 1]}</p>
          </div>
          <button onClick={() => navigate(1)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day pills */}
        <div className="flex gap-1.5">
          {WEEKDAYS.map((wd, i) => {
            const d = i + 1
            const isToday = d === currentDay
            const wLog = state.workoutLogs[`w${currentWeek}d${d}`]
            const isDone = !!wLog?.completedAt
            return (
              <button
                key={wd}
                onClick={() => actions.setCurrentWorkout(currentWeek, d)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  isToday
                    ? 'bg-orange-500 text-white'
                    : isDone
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {wd}
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Workout header card */}
        <div className={`rounded-2xl p-4 ${workout.isDeload ? 'bg-teal-900/30 border border-teal-500/30' : 'bg-slate-800/60 border border-slate-700'}`}>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              {workout.isDeload && (
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/15 border border-teal-500/30 rounded-full px-2 py-0.5 mb-2">
                  Deload Week
                </span>
              )}
              <h2 className="text-white font-bold text-base leading-snug">{workout.focus}</h2>
            </div>
            <div className="flex items-center gap-1 text-slate-400 shrink-0">
              <Clock size={14} />
              <span className="text-sm">{workout.duration} min</span>
            </div>
          </div>

          {/* Progress bar */}
          {isStarted && (
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{completedSections}/{totalSections} sections done</span>
                {isFinished && <span className="text-green-400 font-medium flex items-center gap-1"><CheckCircle2 size={12} /> Complete</span>}
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {!isStarted && (
            <button
              onClick={() => actions.startWorkout(workout.id)}
              className="w-full mt-1 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Zap size={16} /> Start workout
            </button>
          )}

          {isStarted && !isFinished && completedSections === totalSections && (
            <button
              onClick={() => actions.finishWorkout(workout.id)}
              className="w-full mt-3 py-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCircle2 size={16} /> Finish workout
            </button>
          )}

          {isFinished && (
            <button
              onClick={() => actions.startWorkout(workout.id)}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors mt-2"
            >
              <RotateCcw size={12} /> Re-open workout
            </button>
          )}
        </div>

        {/* Sections */}
        {workout.sections.map((section, i) => (
          <SectionCard
            key={section.id}
            section={section}
            sectionLog={log?.sections[section.id]}
            onComplete={() => {
              if (!isStarted) actions.startWorkout(workout.id)
              actions.completeSection(workout.id, section.id)
            }}
            onLogSet={(setIndex, setLog) => {
              if (!isStarted) actions.startWorkout(workout.id)
              actions.logSet(workout.id, section.id, setIndex, setLog)
            }}
            onStartTimer={handleStartTimer}
            defaultOpen={i === 0 && !isFinished}
          />
        ))}
      </div>

      {/* Rest timer */}
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
