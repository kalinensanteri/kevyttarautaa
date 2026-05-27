import { macrocycle, strengthTargets } from '../data/program'
import type { AppState } from '../types'

type Props = { state: AppState }

function weeksToNumber(weeksStr: string): [number, number] {
  const parts = weeksStr.split('–')
  return [parseInt(parts[0]), parseInt(parts[1] ?? parts[0])]
}

export function Program({ state }: Props) {
  const currentGlobalWeek = state.currentWeek

  return (
    <div className="pb-24 px-4 pt-5 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">104-Week Program</h1>
        <p className="text-[11px] text-white/25 mt-0.5">OPERATOR CrossFit Performance · Ex-Military SOF</p>
      </div>

      {/* You are here */}
      <div className="glass p-4">
        <p className="text-[10px] uppercase tracking-widest text-white/35 mb-1">You are here</p>
        <p className="text-white font-bold text-lg">Block 1, Week {currentGlobalWeek}</p>
        <p className="text-sm text-white/40">General Prep / Base · Y1–M1</p>
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-[10px] text-white/25">
            <span>Week {currentGlobalWeek}</span>
            <span>of 104</span>
          </div>
          <div className="h-px bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${(currentGlobalWeek / 104) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Macrocycle phases */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-white/30">Macrocycle Overview</p>
        {macrocycle.map((phase) => {
          const [startW, endW] = weeksToNumber(phase.weeks)
          const isCurrent = currentGlobalWeek >= startW && currentGlobalWeek <= endW
          const isPast = currentGlobalWeek > endW
          return (
            <div
              key={phase.phase}
              className={`rounded-2xl border p-3 transition-all ${
                isCurrent
                  ? 'border-white/25 bg-white/8'
                  : isPast
                  ? 'border-white/6 bg-white/2 opacity-45'
                  : 'border-white/8 bg-white/3'
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-white/35 border border-white/10 rounded px-1.5 py-0.5 uppercase tracking-wider">
                      {phase.phase}
                    </span>
                    <span className="text-[10px] text-white/25">Wks {phase.weeks}</span>
                    {isCurrent && <span className="text-[10px] text-white font-bold">← now</span>}
                    {isPast && <span className="text-[10px] text-white/30">✓</span>}
                  </div>
                  <p className={`text-sm font-semibold ${isCurrent ? 'text-white' : isPast ? 'text-white/30' : 'text-white/65'}`}>
                    {phase.name}
                  </p>
                  <p className="text-[11px] text-white/25 mt-0.5 leading-relaxed">{phase.goals}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Strength targets */}
      <div className="glass p-4">
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Year-2 Strength Targets</p>
        <div className="space-y-2.5">
          {strengthTargets.map(t => (
            <div key={t.lift} className="flex items-center justify-between">
              <span className="text-sm text-white/50">{t.lift}</span>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-white/25 text-xs">{t.current}</span>
                <span className="text-white/20">→</span>
                <span className="text-white font-semibold text-xs">{t.year2Target}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mesocycle structure */}
      <div className="glass p-4">
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Mesocycle Structure</p>
        <div className="grid grid-cols-4 gap-2">
          {['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'].map((wk, i) => (
            <div
              key={wk}
              className={`border rounded-xl p-2.5 text-center ${
                i < 3
                  ? 'border-white/10 bg-white/4'
                  : 'border-white/15 bg-white/7'
              }`}
            >
              <p className="text-[11px] font-bold text-white/60">{wk}</p>
              <p className="text-[10px] text-white/30 mt-0.5">{i < 3 ? 'Load' : 'Deload'}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-white/20 mt-3 leading-relaxed">
          Deload: volume −40–50%, intensity maintained. No AMRAPs. Sleep 9 h mandatory.
        </p>
      </div>

      {/* Rhabdo warning */}
      <div className="border border-white/12 rounded-2xl p-4 bg-white/3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1.5">⚠ SOF Rhabdo Risk Window</p>
        <p className="text-[11px] text-white/30 leading-relaxed">
          Weeks 1–4 of each block are highest risk. Cap metcon RPE at 7 in Week 1 of every mesocycle.
          Cola-colored urine or disproportionate soreness → stop, hydrate, ER if suspected.
          MAF HR cap: 151 bpm.
        </p>
      </div>
    </div>
  )
}
