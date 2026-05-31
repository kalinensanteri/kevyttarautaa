import type { DayPlan } from '../types'

export const WEEKLY_SCHEDULE: DayPlan[] = [
  {
    dayNum: 1,
    name: 'Monday',
    subtitle: 'Upper Strength',
    emphasis: 'Evening only',
    sessions: [
      {
        id: 'pm',
        time: 'Evening',
        label: 'Upper body strength',
        type: 'strength',
        description: 'Push/pull compounds in 3–6 rep strength range. 3–4 min rest between sets. Prioritise load quality over fatigue.',
        exercises: [
          { name: 'Weighted pull-up',    prescription: '5×3–5',  notes: 'Add load progressively each week', rest: '3 min',  trackLoad: true,  trackReps: true },
          { name: 'Barbell bench press', prescription: '4×4–6',  notes: 'Controlled descent, full ROM',       rest: '3 min',  trackLoad: true,  trackReps: true },
          { name: 'Pendlay row',         prescription: '4×4–6',  notes: 'Dead stop each rep, strict form',    rest: '3 min',  trackLoad: true,  trackReps: true },
          { name: 'Overhead press',      prescription: '3×5',    notes: 'Standing, brace hard',               rest: '2 min',  trackLoad: true,  trackReps: true },
          { name: 'Face pull',           prescription: '3×15',   notes: "Shoulder health — don't skip",       rest: '90 sec', trackLoad: false, trackReps: true  },
          { name: 'Farmer carry',        prescription: '3×30m',  notes: 'Heaviest you can hold',              rest: '2 min',  trackLoad: true,  trackReps: false },
        ],
      },
    ],
  },
  {
    dayNum: 2,
    name: 'Tuesday',
    subtitle: 'Zone 2 + Lower',
    emphasis: 'AM + PM',
    sessions: [
      {
        id: 'am',
        time: 'Morning',
        label: 'Zone 2 run — 40 min',
        type: 'run',
        description: 'Easy enough to hold a full conversation. Max HR 145. Zone 2 at this intensity does not compromise the evening lift.',
        exercises: [
          { name: 'Zone 2 run', prescription: '40 min', notes: 'HR 130–145, conversational pace' },
        ],
      },
      {
        id: 'pm',
        time: 'Evening',
        label: 'Lower body strength',
        type: 'strength',
        description: 'Full depth on squats. Hamstring-focused posterior chain work.',
        exercises: [
          { name: 'Back squat',            prescription: '5×3–5',      notes: 'Full depth, controlled',    rest: '3 min',  trackLoad: true, trackReps: true },
          { name: 'Romanian deadlift',     prescription: '4×5',        notes: 'Feel the hamstring load',   rest: '2 min',  trackLoad: true, trackReps: true },
          { name: 'Bulgarian split squat', prescription: '3×8 each',   notes: 'Rear foot elevated',        rest: '2 min',  trackLoad: true, trackReps: true },
          { name: 'Calf raise',            prescription: '4×15',       notes: 'Loaded — injury prevention', rest: '90 sec', trackLoad: true, trackReps: true },
        ],
      },
    ],
  },
  {
    dayNum: 3,
    name: 'Wednesday',
    subtitle: 'Intervals + Oly / Gymnastics',
    emphasis: 'AM + PM',
    sessions: [
      {
        id: 'am',
        time: 'Morning',
        label: 'Assault bike intervals',
        type: 'intervals',
        description: 'Builds VO₂ max ceiling. RPE 9 on work intervals — if you\'re comfortable, go harder.',
        exercises: [
          { name: 'Assault bike intervals', prescription: '10×1 min on / 1 off', notes: 'RPE 9 on work intervals' },
        ],
      },
      {
        id: 'pm',
        time: 'Evening',
        label: 'Olympic lifting + Gymnastics',
        type: 'gymnastics',
        description: 'Technical investment — these compound over months. Chase perfect positions. Not a conditioning session.',
        exercises: [
          { name: 'Hang power clean',              prescription: '5×3',     notes: 'Technical focus, not load',  rest: '2 min', trackLoad: true,  trackReps: true },
          { name: 'Push jerk',                     prescription: '4×3',     notes: 'Full lockout overhead',      rest: '2 min', trackLoad: true,  trackReps: true },
          { name: 'Muscle-up progressions',        prescription: '4×3–5',   notes: 'Ring or bar',                rest: '2 min', trackLoad: false, trackReps: true },
          { name: 'Handstand hold / HSPU negatives', prescription: '3×30 sec', notes: 'Strict gymnastics',       rest: '2 min', trackLoad: false, trackReps: false },
        ],
      },
    ],
  },
  {
    dayNum: 4,
    name: 'Thursday',
    subtitle: 'Zone 2 + Full Body Volume',
    emphasis: 'AM + PM',
    sessions: [
      {
        id: 'am',
        time: 'Morning',
        label: 'Zone 2 run — 40 min',
        type: 'run',
        description: 'Same as Tuesday. Aerobic base accumulation — the most important long-term adaptation in the program.',
        exercises: [
          { name: 'Zone 2 run', prescription: '40 min', notes: 'HR 130–145, conversational pace' },
        ],
      },
      {
        id: 'pm',
        time: 'Evening',
        label: 'Full body volume',
        type: 'strength',
        description: '8–12 rep range — more metabolic stress, less CNS load. Keeps muscle protein synthesis elevated mid-week.',
        exercises: [
          { name: 'Trap bar deadlift', prescription: '4×8',       notes: 'Moderate load',                    rest: '2 min',  trackLoad: true,  trackReps: true },
          { name: 'Dumbbell press',    prescription: '3×10',      notes: '',                                 rest: '90 sec', trackLoad: true,  trackReps: true },
          { name: 'Cable row',         prescription: '3×12',      notes: 'Full scapular retraction',         rest: '90 sec', trackLoad: true,  trackReps: true },
          { name: 'Goblet squat',      prescription: '3×12',      notes: 'Pause at bottom',                  rest: '90 sec', trackLoad: true,  trackReps: true },
          { name: 'Suitcase carry',    prescription: '3×20m each',notes: 'Single arm, anti-lateral flexion', rest: '90 sec', trackLoad: true,  trackReps: false },
        ],
      },
    ],
  },
  {
    dayNum: 5,
    name: 'Friday',
    subtitle: 'Long MetCon',
    emphasis: 'Evening only',
    sessions: [
      {
        id: 'pm',
        time: 'Evening',
        label: 'Long MetCon — 45–60 min',
        type: 'metcon',
        description: 'High-intensity mixed modality. Rotate format monthly: classic CF benchmarks, EMOMs, chipper formats.',
        exercises: [
          { name: '3 rounds for time', prescription: '',       notes: 'Change the WOD monthly' },
          { name: 'Row',               prescription: '500m',   notes: 'Hard effort' },
          { name: 'KB swing',          prescription: '21 reps',notes: '32 kg target' },
          { name: 'Burpee box jump',   prescription: '12 reps',notes: '24" box' },
          { name: 'Pull-up / C2B',     prescription: '15 reps',notes: 'Chest-to-bar when able' },
          { name: 'Run',               prescription: '400m',   notes: 'Hard' },
        ],
      },
    ],
  },
  {
    dayNum: 6,
    name: 'Saturday',
    subtitle: 'Long Run',
    emphasis: 'Long effort',
    sessions: [
      {
        id: 'long',
        time: 'Morning',
        label: 'Long Zone 2 run',
        type: 'run',
        description: 'Cornerstone of the ultra goal. Pace must feel embarrassingly easy — Zone 2, HR 130–145. Trail terrain preferred. Practice race nutrition every session.',
        exercises: [
          {
            name: 'Long run',
            prescription: 'Phase 1: 90 min → Phase 2: 2.5–3 h → Phase 3: 3–4 h+',
            notes: 'HR 130–145, conversational. Build 10–15 min every 2 weeks',
          },
        ],
      },
    ],
  },
  {
    dayNum: 7,
    name: 'Sunday',
    subtitle: 'Rest',
    emphasis: 'Complete rest',
    sessions: [
      {
        id: 'rest',
        time: 'All day',
        label: 'Complete rest',
        type: 'rest',
        description: 'Non-negotiable. CNS recovery, hormonal reset, tissue repair. Walk 20–30 min if needed. Do not compress this day.',
        exercises: [],
      },
    ],
  },
]

export function getDayPlan(date: string): DayPlan {
  // Training week starts on Sunday: Sun=dayNum1(Mon workout), Mon=2, …, Sat=7(Rest)
  const dow = new Date(date).getDay() // 0=Sun … 6=Sat
  const dayNum = dow + 1              // Sun→1, Mon→2, …, Sat→7
  return WEEKLY_SCHEDULE.find(d => d.dayNum === dayNum) ?? WEEKLY_SCHEDULE[6]
}

export function getWeekDates(date: string): string[] {
  // Week runs Sun → Sat to match the training cycle
  const d = new Date(date)
  const sunday = new Date(d)
  sunday.setDate(d.getDate() - d.getDay()) // rewind to Sun
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(sunday)
    day.setDate(sunday.getDate() + i)
    return day.toISOString().slice(0, 10)
  })
}

export function addDays(date: string, n: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export function parseSetCount(prescription: string): number {
  const m = prescription.match(/^(\d+)[×x]/)
  return m ? parseInt(m[1]) : 0
}

export function parseRestSecs(rest?: string): number {
  if (!rest) return 0
  const min = rest.match(/(\d+)\s*min/)
  const sec = rest.match(/(\d+)\s*sec/)
  return (min ? parseInt(min[1]) * 60 : 0) + (sec ? parseInt(sec[1]) : 0)
}
