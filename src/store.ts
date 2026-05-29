import { useState, useCallback } from 'react'
import type {
  AppState, Phase, SetLog, ExerciseLog, SessionLog, DayLog,
  BodyWeightEntry, RunEntry, MetconEntry,
} from './types'

const today = new Date().toISOString().slice(0, 10)

const DEFAULT_STATE: AppState = {
  currentPhase: 1,
  programStartDate: today,
  viewDate: today,
  dayLogs: {},
  bodyWeightLog: [],
  runLog: [],
  metconLog: [],
  restTimerEndsAt: null,
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem('unit-tracker-state')
    if (!raw) return { ...DEFAULT_STATE }
    const saved = JSON.parse(raw)
    return {
      ...DEFAULT_STATE,
      ...saved,
      viewDate: today,        // always start on today
      restTimerEndsAt: null,  // don't restore timer
    }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

function saveState(state: AppState) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { viewDate: _v, restTimerEndsAt: _r, ...toSave } = state
    localStorage.setItem('unit-tracker-state', JSON.stringify(toSave))
  } catch {}
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(loadState)

  const update = useCallback((updater: (prev: AppState) => AppState) => {
    setState(prev => {
      const next = updater(prev)
      saveState(next)
      return next
    })
  }, [])

  // ── Navigation ────────────────────────────────────────────────
  function setViewDate(date: string) {
    setState(prev => ({ ...prev, viewDate: date }))
  }

  function setPhase(phase: Phase) {
    update(s => ({ ...s, currentPhase: phase }))
  }

  function setProgramStartDate(date: string) {
    update(s => ({ ...s, programStartDate: date }))
  }

  // ── Session & exercise logging ────────────────────────────────
  function getOrCreateDayLog(logs: AppState['dayLogs'], date: string): DayLog {
    return logs[date] ?? { sessions: {} }
  }

  function getOrCreateSessionLog(dayLog: DayLog, sessionId: string): SessionLog {
    return dayLog.sessions[sessionId] ?? { completed: false, exercises: {} }
  }

  function completeSession(date: string, sessionId: string) {
    update(s => {
      const day = getOrCreateDayLog(s.dayLogs, date)
      const session = getOrCreateSessionLog(day, sessionId)
      return {
        ...s,
        dayLogs: {
          ...s.dayLogs,
          [date]: {
            ...day,
            sessions: {
              ...day.sessions,
              [sessionId]: { ...session, completed: !session.completed },
            },
          },
        },
      }
    })
  }

  function logExerciseSet(
    date: string,
    sessionId: string,
    exerciseName: string,
    setIdx: number,
    setLog: SetLog,
  ) {
    update(s => {
      const day = getOrCreateDayLog(s.dayLogs, date)
      const session = getOrCreateSessionLog(day, sessionId)
      const exLog: ExerciseLog = session.exercises[exerciseName] ?? { sets: [] }
      const newSets = [...exLog.sets]
      newSets[setIdx] = setLog
      return {
        ...s,
        dayLogs: {
          ...s.dayLogs,
          [date]: {
            ...day,
            sessions: {
              ...day.sessions,
              [sessionId]: {
                ...session,
                exercises: {
                  ...session.exercises,
                  [exerciseName]: { sets: newSets },
                },
              },
            },
          },
        },
      }
    })
  }

  function logSessionRun(
    date: string,
    sessionId: string,
    data: { min?: number; km?: number; hr?: number },
  ) {
    update(s => {
      const day = getOrCreateDayLog(s.dayLogs, date)
      const session = getOrCreateSessionLog(day, sessionId)
      return {
        ...s,
        dayLogs: {
          ...s.dayLogs,
          [date]: {
            ...day,
            sessions: {
              ...day.sessions,
              [sessionId]: {
                ...session,
                runMin: data.min ?? session.runMin,
                runKm: data.km ?? session.runKm,
                runHr: data.hr ?? session.runHr,
              },
            },
          },
        },
      }
    })
  }

  function logMetconResult(date: string, sessionId: string, result: string) {
    update(s => {
      const day = getOrCreateDayLog(s.dayLogs, date)
      const session = getOrCreateSessionLog(day, sessionId)
      return {
        ...s,
        dayLogs: {
          ...s.dayLogs,
          [date]: {
            ...day,
            sessions: {
              ...day.sessions,
              [sessionId]: { ...session, metconResult: result },
            },
          },
        },
      }
    })
  }

  // ── Body weight ───────────────────────────────────────────────
  function addBodyWeight(kg: number) {
    const entry: BodyWeightEntry = { date: today, kg }
    update(s => ({
      ...s,
      bodyWeightLog: [...s.bodyWeightLog.filter(e => e.date !== today), entry]
        .sort((a, b) => a.date.localeCompare(b.date)),
    }))
  }

  // ── Run log ───────────────────────────────────────────────────
  function addRunEntry(entry: Omit<RunEntry, 'date'>) {
    update(s => ({
      ...s,
      runLog: [...s.runLog, { ...entry, date: today }]
        .sort((a, b) => a.date.localeCompare(b.date)),
    }))
  }

  // ── MetCon log ────────────────────────────────────────────────
  function addMetconEntry(entry: Omit<MetconEntry, 'date'>) {
    update(s => ({
      ...s,
      metconLog: [...s.metconLog, { ...entry, date: today }],
    }))
  }

  // ── Rest timer ────────────────────────────────────────────────
  function startRestTimer(seconds: number) {
    setState(prev => ({ ...prev, restTimerEndsAt: Date.now() + seconds * 1000 }))
  }

  function clearRestTimer() {
    setState(prev => ({ ...prev, restTimerEndsAt: null }))
  }

  return {
    state,
    actions: {
      setViewDate,
      setPhase,
      setProgramStartDate,
      completeSession,
      logExerciseSet,
      logSessionRun,
      logMetconResult,
      addBodyWeight,
      addRunEntry,
      addMetconEntry,
      startRestTimer,
      clearRestTimer,
    },
  }
}
