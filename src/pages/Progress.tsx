import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Plus, X } from 'lucide-react'
import type { AppState, RunEntry, MetconEntry } from '../types'

type Props = {
  state: AppState
  actions: {
    addBodyWeight: (kg: number) => void
    addRunEntry: (entry: Omit<RunEntry, 'date'>) => void
    addMetconEntry: (entry: Omit<MetconEntry, 'date'>) => void
  }
}

const ttStyle = {
  contentStyle: { background: '#111', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, fontSize: 12 },
  labelStyle: { color: 'rgba(255,255,255,0.35)' },
  itemStyle: { color: 'white' },
}

export function Progress({ state, actions }: Props) {
  const [bwInput, setBwInput] = useState('')
  const [showBwForm, setShowBwForm] = useState(false)
  const [runMin, setRunMin] = useState('')
  const [runKm, setRunKm] = useState('')
  const [runHr, setRunHr] = useState('')
  const [runType, setRunType] = useState<'zone2' | 'long' | 'intervals'>('zone2')
  const [showRunForm, setShowRunForm] = useState(false)
  const [mcName, setMcName] = useState('')
  const [mcResult, setMcResult] = useState('')
  const [mcRx, setMcRx] = useState(true)
  const [showMcForm, setShowMcForm] = useState(false)

  const { bodyWeightLog, runLog, metconLog } = state
  const latestBw = bodyWeightLog.at(-1)
  const bwData = bodyWeightLog.slice(-20).map(e => ({ date: e.date.slice(5), kg: e.kg }))
  const runData = runLog.filter(r => r.type !== 'intervals').slice(-16)
    .map(r => ({ date: r.date.slice(5), min: r.durationMin }))

  function saveBw() {
    const v = parseFloat(bwInput)
    if (isNaN(v) || v < 30 || v > 200) return
    actions.addBodyWeight(v)
    setBwInput(''); setShowBwForm(false)
  }

  function saveRun() {
    const min = parseFloat(runMin)
    if (isNaN(min) || min <= 0) return
    actions.addRunEntry({
      durationMin: min,
      distanceKm: runKm ? parseFloat(runKm) : undefined,
      avgHr: runHr ? parseInt(runHr) : undefined,
      type: runType,
    })
    setRunMin(''); setRunKm(''); setRunHr(''); setShowRunForm(false)
  }

  function saveMc() {
    if (!mcName || !mcResult) return
    actions.addMetconEntry({ name: mcName, result: mcResult, rx: mcRx })
    setMcName(''); setMcResult(''); setShowMcForm(false)
  }

  return (
    <div className="pb-24 px-4 pt-5 space-y-4">
      <h1 className="text-xl font-bold text-white">Progress</h1>

      {/* ── Body weight ──────────────────────────────── */}
      <div className="glass p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] uppercase tracking-widest text-white/30">Body Weight</p>
          <button
            onClick={() => setShowBwForm(f => !f)}
            className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white/70 font-medium border border-white/10 rounded-lg px-2 py-1 transition-colors"
          >
            {showBwForm ? <><X size={11} /> Cancel</> : <><Plus size={11} /> Log</>}
          </button>
        </div>

        {latestBw && (
          <p className="text-3xl font-bold text-white tabular-nums mb-0.5">
            {latestBw.kg} <span className="text-base font-normal text-white/30">kg</span>
          </p>
        )}
        <p className="text-[11px] text-white/20 mb-3">Target: 88–93 kg (Phase 1) → 82–84 kg (Phase 3)</p>

        {showBwForm && (
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              placeholder="kg"
              value={bwInput}
              onChange={e => setBwInput(e.target.value)}
              className="glass-input flex-1"
              style={{ textAlign: 'left', padding: '8px 12px' }}
            />
            <button onClick={saveBw} className="bg-white text-black font-bold px-4 py-2 rounded-xl text-sm hover:bg-white/90 transition-all">
              Save
            </button>
          </div>
        )}

        {bwData.length > 1 ? (
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={bwData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} unit=" kg" width={42} domain={['auto', 'auto']} />
              <Tooltip {...ttStyle} formatter={(v: unknown) => [`${v} kg`, 'Weight']} />
              <Line type="monotone" dataKey="kg" stroke="white" strokeWidth={1.5} dot={{ fill: 'white', r: 2.5, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-[11px] text-white/20 text-center py-3">
            {bwData.length === 1 ? 'Log more entries to see trend.' : 'No entries yet.'}
          </p>
        )}
      </div>

      {/* ── Run log ──────────────────────────────────── */}
      <div className="glass p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] uppercase tracking-widest text-white/30">Zone 2 & Long Run Log</p>
          <button
            onClick={() => setShowRunForm(f => !f)}
            className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white/70 font-medium border border-white/10 rounded-lg px-2 py-1 transition-colors"
          >
            {showRunForm ? <><X size={11} /> Cancel</> : <><Plus size={11} /> Log run</>}
          </button>
        </div>
        <p className="text-[11px] text-white/20 mb-3">HR 130–145 · Build long run 10–15 min every 2 weeks</p>

        {showRunForm && (
          <div className="space-y-2 mb-4">
            <div className="flex gap-1.5">
              {(['zone2', 'long', 'intervals'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setRunType(t)}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                    runType === t ? 'bg-white text-black' : 'border border-white/10 text-white/40'
                  }`}
                >
                  {t === 'zone2' ? 'Zone 2' : t === 'long' ? 'Long' : 'Intervals'}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Duration', ph: 'min', val: runMin, set: setRunMin },
                { label: 'Distance', ph: 'km',  val: runKm,  set: setRunKm  },
                { label: 'Avg HR',   ph: 'bpm', val: runHr,  set: setRunHr  },
              ].map(({ label, ph, val, set }) => (
                <div key={label}>
                  <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">{label}</p>
                  <input
                    type="number" placeholder={ph} value={val}
                    onChange={e => set(e.target.value)}
                    className="glass-input w-full"
                    style={{ textAlign: 'center', padding: '8px 4px' }}
                  />
                </div>
              ))}
            </div>
            <button onClick={saveRun} className="w-full bg-white text-black font-bold py-2 rounded-xl text-sm hover:bg-white/90 transition-all">
              Save run
            </button>
          </div>
        )}

        {runData.length > 1 ? (
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={runData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} unit=" m" width={40} />
              <Tooltip {...ttStyle} formatter={(v: unknown) => [`${v} min`, 'Duration']} />
              <Line type="monotone" dataKey="min" stroke="white" strokeWidth={1.5} dot={{ fill: 'white', r: 2.5, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-[11px] text-white/20 text-center py-3">
            {runData.length === 1 ? 'Log more runs to see trend.' : 'No runs logged yet.'}
          </p>
        )}

        {runLog.length > 0 && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-white/20">
                  <th className="text-left pb-1.5">Date</th>
                  <th className="text-left pb-1.5">Type</th>
                  <th className="text-right pb-1.5">Min</th>
                  <th className="text-right pb-1.5">HR</th>
                </tr>
              </thead>
              <tbody>
                {[...runLog].reverse().slice(0, 8).map((r, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="py-1.5 text-white/35">{r.date}</td>
                    <td className="py-1.5 text-white/35 capitalize">{r.type}</td>
                    <td className="py-1.5 text-right text-white font-mono">{r.durationMin}</td>
                    <td className="py-1.5 text-right text-white/35">{r.avgHr ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MetCon log ───────────────────────────────── */}
      <div className="glass p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-widest text-white/30">MetCon Log</p>
          <button
            onClick={() => setShowMcForm(f => !f)}
            className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white/70 font-medium border border-white/10 rounded-lg px-2 py-1 transition-colors"
          >
            {showMcForm ? <><X size={11} /> Cancel</> : <><Plus size={11} /> Log</>}
          </button>
        </div>

        {showMcForm && (
          <div className="space-y-2 mb-4">
            {[
              { ph: 'WOD name (e.g. Fran, Helen, custom)', val: mcName, set: setMcName },
              { ph: 'Result (e.g. 24:31 / 8 rounds+5)',    val: mcResult, set: setMcResult },
            ].map(({ ph, val, set }) => (
              <input
                key={ph} placeholder={ph} value={val}
                onChange={e => set(e.target.value)}
                className="glass-input w-full"
                style={{ textAlign: 'left', padding: '10px 12px' }}
              />
            ))}
            <label className="flex items-center gap-2 text-sm text-white/40 cursor-pointer">
              <input type="checkbox" checked={mcRx} onChange={e => setMcRx(e.target.checked)} className="accent-white" />
              Rx
            </label>
            <button onClick={saveMc} className="w-full bg-white text-black font-bold py-2 rounded-xl text-sm hover:bg-white/90 transition-all">
              Save
            </button>
          </div>
        )}

        {metconLog.length > 0 ? (
          <div>
            {[...metconLog].reverse().slice(0, 10).map((m, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white flex items-center gap-1.5">
                    {m.name}
                    {m.rx && <span className="text-[10px] border border-white/15 text-white/40 rounded px-1 font-normal">Rx</span>}
                  </p>
                  <p className="text-[11px] text-white/25">{m.date}</p>
                </div>
                <p className="text-base font-bold text-white tabular-nums">{m.result}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-white/20 text-center py-3">No MetCons logged yet.</p>
        )}
      </div>
    </div>
  )
}
