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
    <div className="p-6 text-center text-white/30">
      <p>No workout for Week {currentWeek}, Day {currentDay}.</p>
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
      {/* Sticky header */}
      <div className="sticky top-0 z-30 glass-nav px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-xl border border-white/10 text-white/40 hover:text-white/70 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <p className="text-[11px] text-white/30 uppercase tracking-widest">
              Week {currentWeek} · Block 1{workout.isDeload ? ' · Deload' : ''}
            </p>
            <p className="text-base font-semibold text-white">{DAY_NAMES[currentDay - 1]}</p>
          </div>
          <button onClick={() => navigate(1)} className="p-1.5 rounded-xl border border-white/10 text-white/40 hover:text-white/70 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day pills */}
        <div className="flex gap-1.5">
          {WEEKDAYS.map((wd, i) => {
            const d = i + 1
            const isToday = d === currentDay
            const isDone = !!state.workoutLogs[`w${currentWeek}d${d}`]?.completedAt
            return (
              <button
                key={wd}
                onClick={() => actions.setCurrentWorkout(currentWeek, d)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  isToday
                    ? 'bg-white text-black'
                    : isDone
                    ? 'border border-white/20 text-white/50'
                    : 'border border-white/8 text-white/25 hover:border-white/20 hover:text-white/50'
                }`}
              >
                {wd}
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Workout header card */}
        <div className="glass p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1">
              {workout.isDeload && (
                <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-white/40 border border-white/12 rounded-full px-2 py-0.5 mb-2">
                  Deload
                </span>
              )}
              <h2 className="text-white font-bold text-base leading-snug">{workout.focus}</h2>
            </div>
            <div className="flex items-center gap-1.5 text-white/30 shrink-0 mt-0.5">
              <Clock size={13} />
              <span className="text-sm">{workout.duration} min</span>
            </div>
          </div>

          {isStarted && (
            <div className="mb-3">
              <div className="flex justify-between text-[11px] text-white/30 mb-1.5">
                <span>{completedSections}/{totalSections} sections</span>
                {isFinished && (
                  <span className="text-white/60 flex items-center gap-1">
                    <CheckCircle2 size={11} /> Complete
                  </span>
                )}
              </div>
              <div className="h-px bg-white/8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {!isStarted && (
            <button
              onClick={() => actions.startWorkout(workout.id)}
              className="w-full py-2.5 bg-white text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all hover:bg-white/90 active:scale-[0.98]"
            >
              <Zap size={15} /> Start workout
            </button>
          )}

          {isStarted && !isFinished && completedSections === totalSections && (
            <button
              onClick={() => actions.finishWorkout(workout.id)}
              className="w-full mt-1 py-2.5 bg-white text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all hover:bg-white/90"
            >
              <CheckCircle2 size={15} /> Finish workout
            </button>
          )}

          {isFinished && (
            <button
              onClick={() => actions.startWorkout(workout.id)}
              className="flex items-center gap-1 text-[11px] text-white/25 hover:text-white/50 transition-colors mt-1"
            >
              <RotateCcw size={11} /> Re-open
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
