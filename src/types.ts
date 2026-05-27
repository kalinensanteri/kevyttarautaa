export type SectionType =
  | 'warmup'
  | 'strength'
  | 'technique'
  | 'metcon'
  | 'accessory'
  | 'cooldown'
  | 'conditioning'
  | 'gymnastics'

export type SetPrescription = {
  setLabel: string
  load?: string
  reps: string
  rest?: string
  rpe?: string
  notes?: string
  isAmrap?: boolean
}

export type WorkoutSection = {
  id: string
  title: string
  type: SectionType
  duration?: string
  note?: string
  sets?: SetPrescription[]
  coachNote?: string
  isDescriptionOnly?: boolean
  description?: string
}

export type Workout = {
  id: string
  week: number
  day: number
  weekday: string
  focus: string
  duration: number
  isDeload?: boolean
  sections: WorkoutSection[]
}

export type SetLog = {
  load?: number
  reps?: number
  rpe?: number
}

export type SectionLog = {
  completed: boolean
  sets: Record<number, SetLog>
  notes?: string
}

export type WorkoutLog = {
  workoutId: string
  date: string
  startedAt?: string
  completedAt?: string
  sections: Record<string, SectionLog>
}

export type WendlerTMs = {
  squat: number
  deadlift: number
  press: number
}

export type DBBenchProgress = {
  load: number
  currentReps: number
  targetReps: number
}

export type BenchmarkResult = {
  wodName: string
  date: string
  result: string
  rx: boolean
  notes?: string
}

export type MafEntry = {
  date: string
  paceSeconds: number
  avgHr: number
  distanceM?: number
}

export type AppState = {
  currentWeek: number
  currentDay: number
  workoutLogs: Record<string, WorkoutLog>
  wendlerTMs: WendlerTMs
  dbBench: DBBenchProgress
  benchmarkResults: BenchmarkResult[]
  mafLog: MafEntry[]
  activeRestTimer: number | null
}
