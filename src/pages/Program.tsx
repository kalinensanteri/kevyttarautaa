import { macrocycle, strengthTargets } from '../data/program'
import type { AppState } from '../types'

type Props = { state: AppState }

const PHASE_COLORS = [
  'bg-blue-500/15 border-blue-500/30 text-blue-300',
  'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
  'bg-purple-500/15 border-purple-500/30 text-purple-300',
  'bg-orange-500/15 border-orange-500/30 text-orange-300',
  'bg-yellow-500/15 border-yellow-500/30 text-yellow-300',
  'bg-green-500/15 border-green-500/30 text-green-300',
  'bg-teal-500/15 border-teal-500/30 text-teal-300',
  'bg-red-500/15 border-red-500/30 text-red-300',
  'bg-pink-500/15 border-pink-500/30 text-pink-300',
]

function weeksToNumber(weeksStr: string): [number, number] {
  const parts = weeksStr.split('–')
  return [parseInt(parts[0]), parseInt(parts[1] ?? parts[0])]
}

export function Program({ state }: Props) {
  const currentGlobalWeek = state.currentWeek
  const totalWeeks = 104

  return (
    <div className="pb-24 px-4 pt-4 space-y-5">
      <h1 className="text-xl font-bold text-white">104-Week Program</h1>
      <p className="text-xs text-slate-500 -mt-3">OPERATOR CrossFit Performance · Ex-Military SOF</p>

      {/* You are here */}
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4">
        <p className="text-xs text-orange-400 font-semibold mb-1">YOU ARE HERE</p>
        <p className="text-white font-bold">Block 1, Week {currentGlobalWeek}</p>
        <p className="text-sm text-slate-400">General Prep / Base · Y1–M1</p>
        <div className="mt-3">
          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
            <span>Week {currentGlobalWeek}</span>
            <span>of {totalWeeks}</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full"
              style={{ width: `${(currentGlobalWeek / totalWeeks) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Macrocycle phases */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-300">Macrocycle Overview</h2>
        {macrocycle.map((phase, i) => {
          const [startW, endW] = weeksToNumber(phase.weeks)
          const isCurrent = currentGlobalWeek >= startW && currentGlobalWeek <= endW
          const isPast = currentGlobalWeek > endW
          return (
            <div
              key={phase.phase}
              className={`rounded-xl border p-3 transition-all ${
                isCurrent
                  ? 'border-orange-500/50 bg-orange-500/10'
                  : isPast
                  ? 'border-slate-700/50 bg-slate-900/50 opacity-60'
                  : `border ${PHASE_COLORS[i]?.split(' ')[1] ?? 'border-slate-700'} bg-slate-900`
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${PHASE_COLORS[i] ?? ''}`}>
                      {phase.phase}
                    </span>
                    <span className="text-[11px] text-slate-500">Wks {phase.weeks}</span>
                    {isCurrent && <span className="text-[10px] text-orange-400 font-bold">← NOW</span>}
                    {isPast && <span className="text-[10px] text-green-400">✓</span>}
                  </div>
                  <p className={`text-sm font-semibold ${isCurrent ? 'text-orange-300' : isPast ? 'text-slate-500' : 'text-slate-200'}`}>
                    {phase.name}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{phase.goals}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Strength targets */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">Year-2 Strength Targets</h2>
        <div className="space-y-2.5">
          {strengthTargets.map(t => (
            <div key={t.lift} className="flex items-center justify-between text-sm">
              <span className="text-slate-400 font-medium">{t.lift}</span>
              <div className="flex items-center gap-3 text-right">
                <span className="text-slate-500 text-xs">{t.current}</span>
                <span className="text-slate-600">→</span>
                <span className="text-white font-semibold text-xs">{t.year2Target}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mesocycle structure */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">Mesocycle Structure</h2>
        <div className="grid grid-cols-4 gap-2">
          {[
            { week: 'Wk 1', label: 'Loading', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
            { week: 'Wk 2', label: 'Loading', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
            { week: 'Wk 3', label: 'Loading', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
            { week: 'Wk 4', label: 'Deload', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
          ].map(w => (
            <div key={w.week} className={`border rounded-xl p-2.5 text-center ${w.color}`}>
              <p className="text-xs font-bold">{w.week}</p>
              <p className="text-[10px] mt-0.5">{w.label}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-600 mt-3">Deload = volume −40–50%, intensity maintained. No AMRAPs to failure. Sleep 9 h mandatory.</p>
      </div>

      {/* SOF Warning */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
        <p className="text-xs font-bold text-red-400 mb-1">⚠ SOF Rhabdo Risk Window</p>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Weeks 1–4 of each block are highest risk. Cap metcon RPE at 7 in Week 1 of every mesocycle.
          Watch for: cola-colored urine, disproportionate muscle pain → stop, hydrate, ER if suspected.
          MAF HR cap: 151 bpm.
        </p>
      </div>
    </div>
  )
}
