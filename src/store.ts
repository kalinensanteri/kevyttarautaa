import { useState, useCallback } from 'react'
import type { AppState, WorkoutLog, SectionLog, SetLog, BenchmarkResult, MafEntry, WendlerTMs } from './types'

const DEFAULT_STATE: AppState = {
  currentWeek: 1,
  currentDay: 1,
  workoutLogs: {},
  wendlerTMs: { squat: 117, deadlift: 130, press: 50 },
  dbBench: { load: 40, currentReps: 8, targetReps: 8 },
  benchmarkResults: [],
  mafLog: [],
  activeRestTimer: null,
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem('cf-tracker-state')
    if (!raw) return DEFAULT_STATE
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_STATE
  }
}

function saveState(state: AppState) {
  try {
    const { activeRestTimer: _, ...toSave } = state
    localStorage.setItem('cf-tracker-state', JSON.stringify(toSave))
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

  function getLog(workoutId: string): WorkoutLog | undefined {
    return state.workoutLogs[workoutId]
  }

  function startWorkout(workoutId: string) {
    update(s => {
      if (s.workoutLogs[workoutId]?.startedAt) return s
      return {
        ...s,
        workoutLogs: {
          ...s.workoutLogs,
          [workoutId]: {
            workoutId,
            date: new Date().toISOString().slice(0, 10),
            startedAt: new Date().toISOString(),
            sections: {},
          },
        },
      }
    })
  }

  function completeSection(workoutId: string, sectionId: string) {
    update(s => {
      const log = s.workoutLogs[workoutId] ?? {
        workoutId,
        date: new Date().toISOString().slice(0, 10),
        startedAt: new Date().toISOString(),
        sections: {},
      }
      return {
        ...s,
        workoutLogs: {
          ...s.workoutLogs,
          [workoutId]: {
            ...log,
            sections: {
              ...log.sections,
              [sectionId]: {
                ...(log.sections[sectionId] ?? { sets: {} }),
                completed: true,
              },
            },
          },
        },
      }
    })
  }

  function logSet(workoutId: string, sectionId: string, setIndex: number, setLog: SetLog) {
    update(s => {
      const log = s.workoutLogs[workoutId] ?? {
        workoutId,
        date: new Date().toISOString().slice(0, 10),
        startedAt: new Date().toISOString(),
        sections: {},
      }
      const section: SectionLog = log.sections[sectionId] ?? { completed: false, sets: {} }
      return {
        ...s,
        workoutLogs: {
          ...s.workoutLogs,
          [workoutId]: {
            ...log,
            sections: {
              ...log.sections,
              [sectionId]: {
                ...section,
                sets: {
                  ...section.sets,
                  [setIndex]: setLog,
                },
              },
            },
          },
        },
      }
    })
  }

  function finishWorkout(workoutId: string) {
    update(s => {
      const log = s.workoutLogs[workoutId]
      if (!log) return s
      return {
        ...s,
        workoutLogs: {
          ...s.workoutLogs,
          [workoutId]: { ...log, completedAt: new Date().toISOString() },
        },
      }
    })
  }

  function setCurrentWorkout(week: number, day: number) {
    update(s => ({ ...s, currentWeek: week, currentDay: day }))
  }

  function updateWendlerTMs(tms: Partial<WendlerTMs>) {
    update(s => ({ ...s, wendlerTMs: { ...s.wendlerTMs, ...tms } }))
  }

  function updateDBBench(load: number, currentReps: number, targetReps: number) {
    update(s => ({ ...s, dbBench: { load, currentReps, targetReps } }))
  }

  function addBenchmark(result: BenchmarkResult) {
    update(s => ({ ...s, benchmarkResults: [...s.benchmarkResults, result] }))
  }

  function addMafEntry(entry: MafEntry) {
    update(s => ({ ...s, mafLog: [...s.mafLog, entry] }))
  }

  function startRestTimer(seconds: number) {
    update(s => ({ ...s, activeRestTimer: seconds }))
  }

  function clearRestTimer() {
    update(s => ({ ...s, activeRestTimer: null }))
  }

  return {
    state,
    getLog,
    startWorkout,
    completeSection,
    logSet,
    finishWorkout,
    setCurrentWorkout,
    updateWendlerTMs,
    updateDBBench,
    addBenchmark,
    addMafEntry,
    startRestTimer,
    clearRestTimer,
  }
}
