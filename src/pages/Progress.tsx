import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { ChevronUp, ChevronDown } from 'lucide-react'
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
  { key: 'squat',    label: 'Back Squat TM',    increment: 5   },
  { key: 'deadlift', label: 'Deadlift TM',       increment: 5   },
  { key: 'press',    label: 'Strict Press TM',   increment: 2.5 },
]

const tooltipStyle = {
  contentStyle: { background: '#111', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, fontSize: 12 },
  labelStyle: { color: 'rgba(255,255,255,0.4)' },
  itemStyle: { color: 'white' },
}

function Stepper({ value, onUp, onDown, unit = 'kg' }: { value: number; onUp: () => void; onDown: () => void; unit?: string }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onDown} className="p-1.5 glass-sm border border-white/8 text-white/50 hover:text-white transition-colors rounded-lg">
        <ChevronDown size={14} />
      </button>
      <span className="text-2xl font-bold text-white w-16 text-center tabular-nums">{value}</span>
      <button onClick={onUp} className="p-1.5 glass-sm border border-white/8 text-white/50 hover:text-white transition-colors rounded-lg">
        <ChevronUp size={14} />
      </button>
      <span className="text-sm text-white/35">{unit}</span>
    </div>
  )
}

export function Progress({ state, actions }: Props) {
  const [mafPaceInput, setMafPaceInput] = useState('')
  const [mafHrInput, setMafHrInput] = useState('')
  const [showMafForm, setShowMafForm] = useState(false)

  const { wendlerTMs, dbBench, mafLog, workoutLogs } = state

  const squatHistory = Object.values(workoutLogs)
    .filter(l => l.sections['B']?.sets)
    .flatMap(l =>
      Object.values(l.sections['B']?.sets ?? {})
        .map(s => ({ date: l.date.slice(5), value: s.load ?? 0 }))
        .filter(x => x.value > 0)
    )
    .slice(-12)

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
    <div className="pb-24 px-4 pt-5 space-y-4">
      <h1 className="text-xl font-bold text-white">Progress</h1>

      {/* Wendler TMs */}
      <div className="glass p-4">
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-4">Wendler Training Maxes</p>
        <div className="space-y-4">
          {LIFT_KEYS.map(({ key, label, increment }) => (
            <div key={key} className="flex items-center justify-between">
              <p className="text-sm text-white/50">{label}</p>
              <Stepper
                value={wendlerTMs[key]}
                onUp={() => actions.updateWendlerTMs({ [key]: wendlerTMs[key] + increment })}
                onDown={() => actions.updateWendlerTMs({ [key]: Math.max(20, wendlerTMs[key] - increment) })}
              />
            </div>
          ))}
        </div>
        <p className="text-[10px] text-white/20 mt-4 leading-relaxed">
          Increase after each 4-week cycle if AMRAP ≥ minimum. +5 kg lower / +2.5 kg upper.
        </p>
      </div>

      {/* DB Bench */}
      <div className="glass p-4">
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">DB Bench — Double Progression</p>
        <p className="text-[11px] text-white/25 mb-4">Phase 1 (Wks 1–12): 3×8 → 3×10 → 3×12, then +2.5 kg/DB</p>

        <div className="flex items-end gap-6 mb-5">
          <div>
            <p className="text-[11px] text-white/35 mb-1.5">Load</p>
            <Stepper
              value={dbBench.load}
              onUp={() => actions.updateDBBench(dbBench.load + 2.5, dbBench.currentReps, dbBench.targetReps)}
              onDown={() => actions.updateDBBench(Math.max(20, dbBench.load - 2.5), dbBench.currentReps, dbBench.targetReps)}
              unit="kg/DB"
            />
          </div>
          <div>
            <p className="text-[11px] text-white/35 mb-1.5">Target reps</p>
            <Stepper
              value={dbBench.targetReps}
              onUp={() => actions.updateDBBench(dbBench.load, dbBench.currentReps, Math.min(12, dbBench.targetReps + 1))}
              onDown={() => actions.updateDBBench(dbBench.load, dbBench.currentReps, Math.max(8, dbBench.targetReps - 1))}
              unit=""
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-white/30">
            <span>40 kg start</span>
            <span className="text-white font-medium">{dbBench.load} kg/DB</span>
            <span>65 kg target</span>
          </div>
          <div className="h-px bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${Math.max(1, dbBenchPct)}%` }}
            />
          </div>
          <p className="text-[10px] text-white/20 text-right">{dbBenchPct.toFixed(0)}% to Year-2 target</p>
        </div>

        <div className="mt-3 p-3 border border-white/8 rounded-xl text-[11px] text-white/35 leading-relaxed">
          All 3 sets hit target reps @ RPE ≤8 → increase reps by 1.
          Hit 3×12 → load +2.5 kg/DB, reset to 3×8.
        </div>
      </div>

      {/* Squat history chart */}
      {squatHistory.length > 1 && (
        <div className="glass p-4">
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-4">Back Squat — Logged Sets</p>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={squatHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} unit=" kg" width={45} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="value" stroke="white" strokeWidth={1.5} dot={{ fill: 'white', r: 2.5, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* MAF pace */}
      <div className="glass p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] uppercase tracking-widest text-white/30">MAF Pace (at 151 bpm)</p>
          <button
            onClick={() => setShowMafForm(f => !f)}
            className="text-[11px] text-white/40 hover:text-white/70 font-medium transition-colors border border-white/10 rounded-lg px-2 py-1"
          >
            + Log run
          </button>
        </div>
        <p className="text-[11px] text-white/20 mb-3">Goal: improve 60–90 sec/mile over 12 months</p>

        {showMafForm && (
          <div className="flex gap-2 mb-4">
            <input
              placeholder="Pace (m:ss)"
              value={mafPaceInput}
              onChange={e => setMafPaceInput(e.target.value)}
              className="glass-input flex-1"
              style={{ textAlign: 'left', padding: '8px 12px' }}
            />
            <input
              placeholder="HR"
              type="number"
              value={mafHrInput}
              onChange={e => setMafHrInput(e.target.value)}
              className="glass-input w-16"
            />
            <button
              onClick={addMaf}
              className="bg-white text-black font-bold px-3 py-2 rounded-xl text-sm transition-all hover:bg-white/90"
            >
              Save
            </button>
          </div>
        )}

        {mafLog.length > 1 ? (
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={mafLog.map(e => ({ date: e.date.slice(5), pace: e.paceSeconds }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                tickFormatter={v => formatPace(v as number)}
                reversed
                width={42}
              />
              <Tooltip {...tooltipStyle} formatter={(v) => [typeof v === 'number' ? formatPace(v) : v, 'Pace/mile']} />
              <Line type="monotone" dataKey="pace" stroke="white" strokeWidth={1.5} dot={{ fill: 'white', r: 2.5, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-[11px] text-white/20 text-center py-4">
            {mafLog.length === 1 ? 'Log more runs to see your trend.' : 'No MAF runs logged yet.'}
          </p>
        )}

        {mafLog.length > 0 && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-white/20">
                  <th className="text-left pb-1.5">Date</th>
                  <th className="text-right pb-1.5">Pace/mile</th>
                  <th className="text-right pb-1.5">Avg HR</th>
                </tr>
              </thead>
              <tbody>
                {[...mafLog].reverse().slice(0, 6).map((e, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="py-1.5 text-white/35">{e.date}</td>
                    <td className="py-1.5 text-right text-white font-mono">{formatPace(e.paceSeconds)}</td>
                    <td className="py-1.5 text-right text-white/35">{e.avgHr} bpm</td>
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
