import { useState } from 'react'
import { Plus, X, Trophy } from 'lucide-react'
import { benchmarkSchedule } from '../data/program'
import type { AppState, BenchmarkResult } from '../types'

type Props = {
  state: AppState
  actions: { addBenchmark: (r: BenchmarkResult) => void }
}

export function Benchmarks({ state, actions }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [formWod, setFormWod] = useState('')
  const [formResult, setFormResult] = useState('')
  const [formRx, setFormRx] = useState(true)
  const [formNotes, setFormNotes] = useState('')

  const { benchmarkResults, currentWeek } = state

  function getResultsFor(wodName: string) {
    return benchmarkResults
      .filter(r => r.wodName.toLowerCase().includes(wodName.toLowerCase()))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  function submit() {
    if (!formWod || !formResult) return
    actions.addBenchmark({
      wodName: formWod, result: formResult, rx: formRx,
      notes: formNotes || undefined,
      date: new Date().toISOString().slice(0, 10),
    })
    setFormWod(''); setFormResult(''); setFormNotes(''); setShowForm(false)
  }

  return (
    <div className="pb-24 px-4 pt-5 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Benchmarks</h1>
        <button
          onClick={() => setShowForm(f => !f)}
          className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl transition-all ${
            showForm
              ? 'border border-white/15 text-white/50'
              : 'bg-white text-black hover:bg-white/90'
          }`}
        >
          {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Log result</>}
        </button>
      </div>

      {/* Log form */}
      {showForm && (
        <div className="glass p-4 space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-white/30">Log a result</p>
          {[
            { placeholder: 'WOD name (e.g. Fran, Helen, Grace)', value: formWod, set: setFormWod },
            { placeholder: 'Result (e.g. 8:32, 12 rounds)', value: formResult, set: setFormResult },
            { placeholder: 'Notes (optional)', value: formNotes, set: setFormNotes },
          ].map(({ placeholder, value, set }) => (
            <input
              key={placeholder}
              placeholder={placeholder}
              value={value}
              onChange={e => set(e.target.value)}
              className="glass-input w-full"
              style={{ textAlign: 'left', padding: '10px 12px' }}
            />
          ))}
          <label className="flex items-center gap-2 text-sm text-white/40 cursor-pointer">
            <input type="checkbox" checked={formRx} onChange={e => setFormRx(e.target.checked)} className="accent-white" />
            Rx
          </label>
          <button
            onClick={submit}
            className="w-full bg-white text-black font-bold py-2.5 rounded-xl text-sm hover:bg-white/90 transition-all"
          >
            Save result
          </button>
        </div>
      )}

      {/* Schedule */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-white/30">Testing Schedule</p>
        {benchmarkSchedule.map(b => {
          const isPast = currentWeek > b.week
          const weeksUntil = b.week - currentWeek
          const logged = b.wods.some(wod => getResultsFor(wod.split(' ')[0]).length > 0)

          return (
            <div
              key={b.week}
              className={`rounded-2xl border p-4 transition-all ${
                logged
                  ? 'border-white/20 bg-white/6'
                  : isPast
                  ? 'border-white/5 bg-white/1 opacity-45'
                  : 'border-white/8 bg-white/3'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-white/35 border border-white/10 rounded px-1.5 py-0.5">
                    Wk {b.week}
                  </span>
                  {logged && <span className="text-[10px] text-white/50 font-bold">✓ logged</span>}
                  {!logged && weeksUntil === 0 && <span className="text-[10px] text-white font-bold">this week</span>}
                  {!logged && weeksUntil > 0 && <span className="text-[10px] text-white/25">{weeksUntil}w away</span>}
                </div>
                {logged && <Trophy size={14} className="text-white/40 shrink-0" />}
              </div>

              <div className="space-y-1 mb-2">
                {b.wods.map((wod, j) => {
                  const results = getResultsFor(wod.split(' ')[0])
                  return (
                    <div key={j} className="flex items-center justify-between text-sm">
                      <span className="text-white/60 font-medium">{wod}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-white/20">{b.targets[j]}</span>
                        {results.length > 0 && (
                          <span className="text-[11px] text-white font-bold">{results[results.length - 1].result}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="text-[11px] text-white/20 italic">{b.notes}</p>
            </div>
          )
        })}
      </div>

      {/* All results */}
      {benchmarkResults.length > 0 && (
        <div className="glass p-4">
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">All Results</p>
          <div className="space-y-0">
            {[...benchmarkResults].reverse().map((r, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white flex items-center gap-1.5">
                    {r.wodName}
                    {r.rx && (
                      <span className="text-[10px] border border-white/15 text-white/40 rounded px-1 font-normal">Rx</span>
                    )}
                  </p>
                  <p className="text-[11px] text-white/25">{r.date}{r.notes ? ` · ${r.notes}` : ''}</p>
                </div>
                <p className="text-base font-bold text-white tabular-nums">{r.result}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
