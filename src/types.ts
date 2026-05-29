export type Phase = 1 | 2 | 3

export type SessionType = 'strength' | 'run' | 'intervals' | 'metcon' | 'gymnastics' | 'rest'

export type Exercise = {
  name: string
  prescription: string   // "5×3–5", "40 min", "10×1/1 min"
  notes: string
  rest?: string          // "3 min", "90 sec"
  trackLoad?: boolean
  trackReps?: boolean
}

export type WorkoutSession = {
  id: string             // 'am' | 'pm' | 'long' | 'rest'
  time: string           // 'Morning' | 'Evening' | 'All day'
  label: string
  type: SessionType
  description?: string
  exercises: Exercise[]
}

export type DayPlan = {
  dayNum: number         // 1=Mon … 7=Sun
  name: string
  subtitle: string
  emphasis: string       // 'Evening only' | 'AM + PM' | 'Long effort' | 'Rest'
  sessions: WorkoutSession[]
}

export type SetLog = { load?: number; reps?: number; done?: boolean }
export type ExerciseLog = { sets: (SetLog | undefined)[] }

export type SessionLog = {
  completed: boolean
  exercises: Record<string, ExerciseLog>
  metconResult?: string
  runMin?: number
  runKm?: number
  runHr?: number
}

export type DayLog = {
  sessions: Record<string, SessionLog>
}

export type BodyWeightEntry = { date: string; kg: number }
export type RunEntry = {
  date: string
  durationMin: number
  distanceKm?: number
  avgHr?: number
  type: 'zone2' | 'long' | 'intervals'
}
export type MetconEntry = {
  date: string
  name: string
  result: string
  rx: boolean
  notes?: string
}

export type AppState = {
  currentPhase: Phase
  programStartDate: string
  viewDate: string
  dayLogs: Record<string, DayLog>
  bodyWeightLog: BodyWeightEntry[]
  runLog: RunEntry[]
  metconLog: MetconEntry[]
  restTimerEndsAt: number | null
}
