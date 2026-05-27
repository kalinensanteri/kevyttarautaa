import { useState } from 'react'
import { Trophy, Plus, X } from 'lucide-react'
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
    return benchmarkResults.filter(r =>
      r.wodName.toLowerCase().includes(wodName.toLowerCase())
    ).sort((a, b) => a.date.localeCompare(b.date))
  }

  function submit() {
    if (!formWod || !formResult) return
    actions.addBenchmark({
      wodName: formWod,
      result: formResult,
      rx: formRx,
      notes: formNotes || undefined,
      date: new Date().toISOString().slice(0, 10),
    })
    setFormWod('')
    setFormResult('')
    setFormNotes('')
    setShowForm(false)
  }

  return (
    <div className="pb-24 px-4 pt-4 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Benchmarks</h1>
        <button
          onClick={() => setShowForm(f => !f)}
          className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium px-3 py-2 rounded-xl transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Log result'}
        </button>
      </div>

      {/* Log form */}
      {showForm && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-slate-300">Log a benchmark result</h2>
          <input
            placeholder="WOD name (e.g. Fran, Helen, Grace)"
            value={formWod}
            onChange={e => setFormWod(e.target.value)}
            className="w-full bg-slate-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <input
            placeholder="Result (e.g. 8:32, 12 rounds, 52.5 kg)"
            value={formResult}
            onChange={e => setFormResult(e.target.value)}
            className="w-full bg-slate-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={formRx}
                onChange={e => setFormRx(e.target.checked)}
                className="accent-orange-500"
              />
              Rx
            </label>
          </div>
          <input
            placeholder="Notes (optional)"
            value={formNotes}
            onChange={e => setFormNotes(e.target.value)}
            className="w-full bg-slate-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <button
            onClick={submit}
            className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            Save result
          </button>
        </div>
      )}

      {/* Scheduled benchmark tests */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-300">Benchmark Testing Schedule</h2>
        {benchmarkSchedule.map(b => {
          const isPast = currentWeek > b.week
          const isUpcoming = currentWeek <= b.week
          const weeksUntil = b.week - currentWeek
          const logged = b.wods.some(wod => getResultsFor(wod.split(' ')[0]).length > 0)

          return (
            <div
              key={b.week}
              className={`rounded-2xl border p-4 transition-all ${
                logged
                  ? 'border-green-500/40 bg-green-500/5'
                  : isPast
                  ? 'border-slate-700/50 bg-slate-900/50 opacity-60'
                  : 'border-slate-700 bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-400">Week {b.week}</span>
                    {logged && <span className="text-[10px] text-green-400 font-bold">✓ LOGGED</span>}
                    {!logged && isUpcoming && weeksUntil > 0 && (
                      <span className="text-[10px] text-orange-400">{weeksUntil} wks away</span>
                    )}
                    {!logged && isUpcoming && weeksUntil === 0 && (
                      <span className="text-[10px] text-orange-400 font-bold">THIS WEEK</span>
                    )}
                  </div>
                </div>
                {logged && <Trophy size={16} className="text-yellow-500 shrink-0" />}
              </div>

              <div className="space-y-1 mb-2">
                {b.wods.map((wod, j) => {
                  const results = getResultsFor(wod.split(' ')[0])
                  return (
                    <div key={j} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300 font-medium">{wod}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">target: {b.targets[j]}</span>
                        {results.length > 0 && (
                          <span className="text-[11px] text-orange-300 font-bold">{results[results.length - 1].result}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <p className="text-[11px] text-slate-500 italic">{b.notes}</p>
            </div>
          )
        })}
      </div>

      {/* All logged results */}
      {benchmarkResults.length > 0 && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">All Results</h2>
          <div className="space-y-2">
            {[...benchmarkResults].reverse().map((r, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white flex items-center gap-1.5">
                    {r.wodName}
                    {r.rx && <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded px-1">Rx</span>}
                  </p>
                  <p className="text-[11px] text-slate-500">{r.date}{r.notes ? ` · ${r.notes}` : ''}</p>
                </div>
                <p className="text-base font-bold text-white">{r.result}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
