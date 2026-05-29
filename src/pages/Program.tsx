import { PHASES, SLEEP_PROTOCOL } from '../data/phases'
import { WEEKLY_SCHEDULE } from '../data/schedule'
import type { AppState, Phase } from '../types'

type Props = {
  state: AppState
  actions: {
    setPhase: (phase: Phase) => void
  }
}

const SESSION_COLOR: Record<string, string> = {
  strength:   'text-white/60 border-white/15',
  run:        'text-green-300/70 border-green-400/20',
  intervals:  'text-orange-300/70 border-orange-400/20',
  metcon:     'text-red-300/70 border-red-400/20',
  gymnastics: 'text-blue-300/70 border-blue-400/20',
  rest:       'text-white/20 border-white/8',
}

const SESSION_LABEL: Record<string, string> = {
  strength:   'Lift',
  run:        'Run',
  intervals:  'Intervals',
  metcon:     'MetCon',
  gymnastics: 'Oly/Gym',
  rest:       'Rest',
}

const DAY_NAMES = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

export function Program({ state, actions }: Props) {
  const { currentPhase } = state
  const currentPhaseInfo = PHASES.find(p => p.num === currentPhase)!

  return (
    <div className="pb-24 px-4 pt-5 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Program</h1>
        <p className="text-[11px] text-white/25 mt-0.5">12-Month · Unit → CF Athlete → Ultra</p>
      </div>

      {/* You are here */}
      <div className="glass p-4">
        <p className="text-[10px] uppercase tracking-widest text-white/35 mb-1">You are here</p>
        <p className="text-white font-bold text-2xl leading-tight">{currentPhaseInfo.name}</p>
        <p className="text-sm text-white/40 mb-2">{currentPhaseInfo.months}</p>
        <p className="text-[11px] text-white/40 leading-relaxed mb-3">{currentPhaseInfo.goal}</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-white/8 rounded-xl p-2.5">
            <p className="text-[9px] text-white/25 uppercase tracking-wider">Target weight</p>
            <p className="text-sm font-semibold text-white mt-0.5">{currentPhaseInfo.targetWeight}</p>
          </div>
          <div className="border border-white/8 rounded-xl p-2.5">
            <p className="text-[9px] text-white/25 uppercase tracking-wider">Long run</p>
            <p className="text-sm font-semibold text-white mt-0.5">{currentPhaseInfo.longRun}</p>
          </div>
          <div className="border border-white/8 rounded-xl p-2.5">
            <p className="text-[9px] text-white/25 uppercase tracking-wider">Calories</p>
            <p className="text-sm font-semibold text-white mt-0.5">{currentPhaseInfo.calories}</p>
          </div>
          <div className="border border-white/8 rounded-xl p-2.5">
            <p className="text-[9px] text-white/25 uppercase tracking-wider">MetCon freq</p>
            <p className="text-sm font-semibold text-white mt-0.5">{currentPhaseInfo.metcon}</p>
          </div>
        </div>
      </div>

      {/* Phase selector */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-white/30">Phases — tap to set current</p>
        {PHASES.map(phase => {
          const isActive = phase.num === currentPhase
          return (
            <button
              key={phase.num}
              onClick={() => actions.setPhase(phase.num)}
              className={`w-full text-left rounded-2xl border p-3 transition-all ${
                isActive
                  ? 'border-white/25 bg-white/8'
                  : 'border-white/8 bg-white/3 hover:border-white/15'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-white/35 border border-white/10 rounded px-1.5 py-0.5 uppercase tracking-wider">
                  Phase {phase.num}
                </span>
                <span className="text-[10px] text-white/25">{phase.months}</span>
                {isActive && <span className="text-[10px] text-white font-bold ml-auto">← now</span>}
              </div>
              <p className={`text-sm font-semibold mb-0.5 ${isActive ? 'text-white' : 'text-white/55'}`}>
                {phase.name}
              </p>
              <p className="text-[11px] text-white/30 leading-relaxed">{phase.details}</p>
              <div className="flex gap-3 mt-2">
                <span className="text-[10px] text-white/25">🏋️ {phase.lifting}</span>
                <span className="text-[10px] text-white/25">🏃 {phase.running}</span>
                <span className="text-[10px] text-white/25">⚡ {phase.metcon}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Weekly schedule */}
      <div className="glass p-4">
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Weekly Template</p>
        <div className="space-y-0">
          {WEEKLY_SCHEDULE.map((day, i) => {
            const activeSessions = day.sessions.filter(s => s.type !== 'rest')
            return (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <span className="text-[10px] font-bold text-white/25 w-7 shrink-0">{DAY_NAMES[i]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-white/70 truncate">{day.subtitle}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {activeSessions.length === 0 ? (
                    <span className="text-[9px] font-bold uppercase tracking-wider border rounded-full px-1.5 py-0.5 text-white/20 border-white/8">
                      Rest
                    </span>
                  ) : (
                    activeSessions.map((s, j) => (
                      <span
                        key={j}
                        className={`text-[9px] font-bold uppercase tracking-wider border rounded-full px-1.5 py-0.5 ${SESSION_COLOR[s.type]}`}
                      >
                        {SESSION_LABEL[s.type]}
                      </span>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sleep protocol */}
      <div className="glass p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-widest text-white/30">Sleep Protocol</p>
          <p className="text-2xl font-bold text-white tabular-nums">
            {SLEEP_PROTOCOL.targetHours}
            <span className="text-sm font-normal text-white/30"> h</span>
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="border border-white/8 rounded-xl p-2.5">
            <p className="text-[9px] text-white/25 uppercase tracking-wider">Lights out</p>
            <p className="text-sm font-semibold text-white mt-0.5">{SLEEP_PROTOCOL.lightsOut}</p>
          </div>
          <div className="border border-white/8 rounded-xl p-2.5">
            <p className="text-[9px] text-white/25 uppercase tracking-wider">Wake</p>
            <p className="text-sm font-semibold text-white mt-0.5">{SLEEP_PROTOCOL.wakeTime}</p>
          </div>
          <div className="border border-white/8 rounded-xl p-2.5">
            <p className="text-[9px] text-white/25 uppercase tracking-wider">Train cutoff</p>
            <p className="text-sm font-semibold text-white mt-0.5">{SLEEP_PROTOCOL.trainingCutoff}</p>
          </div>
        </div>
        <div className="space-y-2">
          {SLEEP_PROTOCOL.schedule.map((item, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-[11px] font-mono text-white/35 w-12 shrink-0 tabular-nums pt-px">{item.time}</span>
              <div>
                <p className="text-[11px] font-medium text-white/65">{item.event}</p>
                <p className="text-[10px] text-white/25 leading-relaxed">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-white/20 mt-3 border-t border-white/5 pt-3">
          Midday: {SLEEP_PROTOCOL.middayRest} — measurably reduces cortisol between double days.
        </p>
      </div>
    </div>
  )
}
