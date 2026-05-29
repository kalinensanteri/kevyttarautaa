import type { Phase } from '../types'

export type PhaseInfo = {
  num: Phase
  name: string
  months: string
  goal: string
  details: string
  lifting: string
  running: string
  metcon: string
  longRun: string
  calories: string
  targetWeight: string
}

export const PHASES: PhaseInfo[] = [
  {
    num: 1,
    name: 'Mass & Strength',
    months: 'Months 1–5',
    goal: 'Build the structural capacity. Surplus fuels strength and lean mass.',
    details: 'Target +4–5 kg bodyweight. Prioritise the big lifts. Running keeps the aerobic base alive.',
    lifting: '4×/week',
    running: '3×/week',
    metcon: '2×/week',
    longRun: '90 min',
    calories: '+300–400 kcal surplus',
    targetWeight: '88–93 kg',
  },
  {
    num: 2,
    name: 'Conditioning Emphasis',
    months: 'Months 6–8',
    goal: 'Reduce lift volume, increase MetCon intensity and run frequency. Aerobic ceiling rises sharply.',
    details: 'Strength maintained, not built. Body recomposes. Shift to maintenance calories.',
    lifting: '3×/week',
    running: '4×/week',
    metcon: '3×/week',
    longRun: '2.5–3 h',
    calories: 'Maintenance',
    targetWeight: '85–88 kg',
  },
  {
    num: 3,
    name: 'Ultra Prep',
    months: 'Months 9–12',
    goal: 'Race-specific preparation. Lighter body improves running economy.',
    details: 'Lifting drops to maintenance frequency. Running dominates. Long run extends to race-relevant durations.',
    lifting: '2×/week',
    running: '5×/week',
    metcon: '1×/week',
    longRun: '3–4 h+',
    calories: 'Maintenance / mild deficit',
    targetWeight: '82–84 kg',
  },
]

export const SLEEP_PROTOCOL = {
  targetHours: 8.5,
  lightsOut: '21:30',
  wakeTime: '06:00',
  trainingCutoff: '20:00',
  middayRest: '20 min horizontal',
  schedule: [
    { time: '05:45', event: 'Wake',                 note: 'Morning session starts by 06:00–06:15' },
    { time: '06:00', event: 'Morning session',      note: 'Zone 2 run or intervals. 45 min max.' },
    { time: '12:00', event: 'Midday rest',          note: '20 min horizontal. Measurably reduces cortisol between double days.' },
    { time: '18:00', event: 'Evening session',      note: 'Finish by 20:00 latest.' },
    { time: '20:30', event: 'Final meal + casein',  note: '30–40 g casein protein. Wind-down begins.' },
    { time: '21:30', event: 'In bed',               note: 'Cold room 16–18°C. Total darkness. Consistent 7 days/week.' },
  ],
}
