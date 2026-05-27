import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { ChevronUp, ChevronDown, TrendingUp } from 'lucide-react'
import type { AppState, WendlerTMs } from '../types'

type Props = {
  state: AppState
  actions: {
    updateWendlerTMs: (tms: Partial<WendlerTMs>) => void
    updateDBBench: (load: number, currentReps: number, targetReps: number) => void
    addMafEntry: (entry: { date: string; paceSeconds: number; avgHr: number; distanceM?: number }) => void
  }
}

function formatPace(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const LIFT_KEYS: { key: keyof WendlerTMs; label: string; increment: number }[] = [
  { key: 'squat', label: 'Back Squat TM', increment: 5 },
  { key: 'deadlift', label: 'Deadlift TM', increment: 5 },
  { key: 'press', label: 'Strict Press TM', increment: 2.5 },
]

export function Progress({ state, actions }: Props) {
  const [mafPaceInput, setMafPaceInput] = useState('')
  const [mafHrInput, setMafHrInput] = useState('')
  const [showMafForm, setShowMafForm] = useState(false)

  const { wendlerTMs, dbBench, mafLog, workoutLogs } = state

  // Build per-workout lift history from logs
  const squatHistory = Object.values(workoutLogs)
    .filter(l => l.sections['B']?.sets)
    .flatMap(l => {
      const sets = Object.values(l.sections['B']?.sets ?? {})
      return sets.map(s => ({ date: l.date.slice(5), value: s.load ?? 0 })).filter(x => x.value > 0)
    })
    .slice(-12)

  // DB bench progression percent toward 65 kg target
  const dbBenchPct = Math.min(100, ((dbBench.load - 40) / (65 - 40)) * 100)

  function addMaf() {
    const parts = mafPaceInput.split(':')
    if (parts.length !== 2) return
    const secs = parseInt(parts[0]) * 60 + parseInt(parts[1])
    if (isNaN(secs) || secs <= 0) return
    const hr = parseInt(mafHrInput)
    if (isNaN(hr)) return
    actions.addMafEntry({ date: new Date().toISOString().slice(0, 10), paceSeconds: secs, avgHr: hr })
    setMafPaceInput('')
    setMafHrInput('')
    setShowMafForm(false)
  }

  return (
    <div className="pb-24 px-4 pt-4 space-y-5">
      <h1 className="text-xl font-bold text-white">Progress</h1>

      {/* Wendler TMs */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-400" /> Wendler Training Maxes
        </h2>
        <div className="space-y-3">
          {LIFT_KEYS.map(({ key, label, increment }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-xl font-bold text-white">{wendlerTMs[key]} kg</p>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => actions.updateWendlerTMs({ [key]: wendlerTMs[key] + increment })}
                  className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  onClick={() => actions.updateWendlerTMs({ [key]: Math.max(20, wendlerTMs[key] - increment) })}
                  className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-600 mt-3">
          Increase after each 4-week cycle if AMRAP ≥ minimum: +5 kg lower / +2.5 kg upper
        </p>
      </div>

      {/* DB Bench progression */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-slate-300 mb-1">DB Bench — Double Progression</h2>
        <p className="text-[11px] text-slate-500 mb-4">Phase 1 (Wks 1–12): 3×8 → 3×10 → 3×12, then +2.5 kg/DB</p>

        <div className="flex items-end gap-4 mb-4">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Current load</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => actions.updateDBBench(Math.max(20, dbBench.load - 2.5), dbBench.currentReps, dbBench.targetReps)}
                className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300"
              >
                <ChevronDown size={14} />
              </button>
              <span className="text-2xl font-bold text-white w-16 text-center">{dbBench.load}</span>
              <button
                onClick={() => actions.updateDBBench(dbBench.load + 2.5, dbBench.currentReps, dbBench.targetReps)}
                className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300"
              >
                <ChevronUp size={14} />
              </button>
              <span className="text-sm text-slate-400">kg/DB</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Target reps</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => actions.updateDBBench(dbBench.load, dbBench.currentReps, Math.max(8, dbBench.targetReps - 1))}
                className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300"
              >
                <ChevronDown size={14} />
              </button>
              <span className="text-2xl font-bold text-white w-8 text-center">{dbBench.targetReps}</span>
              <button
                onClick={() => actions.updateDBBench(dbBench.load, dbBench.currentReps, Math.min(12, dbBench.targetReps + 1))}
                className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300"
              >
                <ChevronUp size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Progress toward Y2 target: 65 kg */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">40 kg (start)</span>
            <span className="text-slate-400 font-medium">{dbBench.load} kg/DB</span>
            <span className="text-slate-500">65 kg (target)</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(2, dbBenchPct)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 text-right">{dbBenchPct.toFixed(0)}% to Year-2 target</p>
        </div>

        <div className="mt-3 p-3 bg-slate-800 rounded-xl text-xs text-slate-400">
          <p className="font-medium text-slate-300 mb-1">How to progress:</p>
          <p>When all 3 sets hit target reps at RPE ≤8 → increase reps by 1.</p>
          <p>When you hit 3×12 → increase load by +2.5 kg/DB and reset to 3×8.</p>
        </div>
      </div>

      {/* Lift history chart (from logs) */}
      {squatHistory.length > 1 && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Back Squat — Logged Sets</h2>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={squatHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} unit=" kg" width={45} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#f97316' }}
              />
              <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* MAF pace tracker */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-slate-300">MAF Pace (at 151 bpm)</h2>
          <button
            onClick={() => setShowMafForm(f => !f)}
            className="text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors"
          >
            + Log run
          </button>
        </div>
        <p className="text-[11px] text-slate-500 mb-3">Goal: pace improves 60–90 sec/mile over 12 months</p>

        {showMafForm && (
          <div className="flex gap-2 mb-4">
            <input
              placeholder="Pace (m:ss)"
              value={mafPaceInput}
              onChange={e => setMafPaceInput(e.target.value)}
              className="flex-1 bg-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <input
              placeholder="Avg HR"
              type="number"
              value={mafHrInput}
              onChange={e => setMafHrInput(e.target.value)}
              className="w-20 bg-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button
              onClick={addMaf}
              className="bg-orange-500 hover:bg-orange-400 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Save
            </button>
          </div>
        )}

        {mafLog.length > 1 ? (
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={mafLog.map(e => ({ date: e.date.slice(5), pace: e.paceSeconds }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickFormatter={v => formatPace(v)}
                reversed
                width={42}
              />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
                formatter={(v) => [typeof v === 'number' ? formatPace(v) : v, 'Pace/mile']}
              />
              <Line type="monotone" dataKey="pace" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : mafLog.length === 1 ? (
          <p className="text-xs text-slate-500 text-center py-4">Log more runs to see your pace trend.</p>
        ) : (
          <p className="text-xs text-slate-500 text-center py-4">No MAF runs logged yet.</p>
        )}

        {mafLog.length > 0 && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-600">
                  <th className="text-left pb-1">Date</th>
                  <th className="text-right pb-1">Pace/mile</th>
                  <th className="text-right pb-1">Avg HR</th>
                </tr>
              </thead>
              <tbody>
                {[...mafLog].reverse().slice(0, 6).map((e, i) => (
                  <tr key={i} className="border-t border-slate-800">
                    <td className="py-1.5 text-slate-400">{e.date}</td>
                    <td className="py-1.5 text-right text-white font-mono">{formatPace(e.paceSeconds)}</td>
                    <td className="py-1.5 text-right text-slate-400">{e.avgHr} bpm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
