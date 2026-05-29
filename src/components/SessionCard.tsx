import { useState } from 'react'
import {
  ChevronDown, ChevronUp, CheckCircle2, Circle,
  Timer, Footprints, Zap, Dumbbell, ChevronRight,
} from 'lucide-react'
import type { WorkoutSession, SessionLog, SetLog } from '../types'
import { parseSetCount, parseRestSecs } from '../data/schedule'

const TYPE_STYLE: Record<string, string> = {
  strength:   'text-white/50 border-white/15',
  run:        'text-green-300/70 border-green-400/20',
  intervals:  'text-orange-300/70 border-orange-400/20',
  metcon:     'text-red-300/70 border-red-400/20',
  gymnastics: 'text-blue-300/70 border-blue-400/20',
  rest:       'text-white/25 border-white/8',
}

const TYPE_LABEL: Record<string, string> = {
  strength: 'STRENGTH', run: 'RUN', intervals: 'INTERVALS',
  metcon: 'METCON', gymnastics: 'OLY / GYMNASTICS', rest: 'REST',
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  strength:   <Dumbbell size={13} />,
  run:        <Footprints size={13} />,
  intervals:  <Zap size={13} />,
  metcon:     <Zap size={13} />,
  gymnastics: <Dumbbell size={13} />,
  rest:       null,
}

type Props = {
  session: WorkoutSession
  sessionLog?: SessionLog
  date: string
  onComplete: () => void
  onLogSet: (exerciseName: string, setIdx: number, log: SetLog) => void
  onLogRun: (data: { min?: number; km?: number; hr?: number }) => void
  onLogMetcon: (result: string) => void
  onStartTimer: (seconds: number) => void
  defaultOpen?: boolean
}

export function SessionCard({
  session, sessionLog, date: _date, onComplete, onLogSet, onLogRun,
  onLogMetcon, onStartTimer, defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const [runMin, setRunMin] = useState('')
  const [runKm, setRunKm] = useState('')
  const [runHr, setRunHr] = useState('')
  const [metconResult, setMetconResult] = useState(sessionLog?.metconResult ?? '')

  const isCompleted = sessionLog?.completed ?? false
  const isRest = session.type === 'rest'

  function handleSaveRun() {
    const data: { min?: number; km?: number; hr?: number } = {}
    if (runMin) data.min = parseFloat(runMin)
    if (runKm) data.km = parseFloat(runKm)
    if (runHr) data.hr = parseFloat(runHr)
    if (Object.keys(data).length) onLogRun(data)
    onComplete()
  }

  return (
    <div className={`glass transition-all ${isCompleted ? 'opacity-55' : ''}`}>
      {/* Header */}
      <button
        className="w-full flex items-center gap-3 p-4 text-left"
        onClick={() => !isRest && setOpen(o => !o)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[9px] font-bold uppercase tracking-widest border rounded-full px-2 py-0.5 flex items-center gap-1 ${TYPE_STYLE[session.type]}`}>
              {TYPE_ICON[session.type]}
              {TYPE_LABEL[session.type]}
            </span>
            <span className="text-[10px] text-white/30">{session.time}</span>
          </div>
          <p className={`text-sm font-semibold leading-snug ${isCompleted ? 'text-white/30 line-through' : 'text-white'}`}>
            {session.label}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isCompleted && <CheckCircle2 size={15} className="text-white/50" />}
          {!isRest && (open
            ? <ChevronUp size={15} className="text-white/25" />
            : <ChevronDown size={15} className="text-white/25" />)}
        </div>
      </button>

      {/* Rest day — just a complete toggle */}
      {isRest && (
        <div className="px-4 pb-4">
          {session.description && (
            <p className="text-[11px] text-white/35 leading-relaxed mb-3">{session.description}</p>
          )}
          <button
            onClick={onComplete}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              isCompleted ? 'bg-white text-black' : 'border border-white/12 text-white/40 hover:border-white/25 hover:text-white/70'
            }`}
          >
            {isCompleted ? <><CheckCircle2 size={14} /> Day complete</> : <><Circle size={14} /> Mark rest day done</>}
          </button>
        </div>
      )}

      {/* Expanded body */}
      {open && !isRest && (
        <div className="px-4 pb-4 space-y-4">
          {/* Description */}
          {session.description && (
            <p className="text-[11px] text-white/50 bg-white/4 border border-white/8 rounded-xl px-3 py-2.5 leading-relaxed">
              {session.description}
            </p>
          )}

          {/* ── RUN SESSION ─────────────────── */}
          {(session.type === 'run') && (
            <div className="space-y-3">
              {session.exercises.map(ex => (
                <div key={ex.name}>
                  <p className="text-sm font-medium text-white">{ex.prescription !== '' ? ex.prescription : ex.name}</p>
                  {ex.notes && <p className="text-[11px] text-white/35 mt-0.5">{ex.notes}</p>}
                </div>
              ))}
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { label: 'Duration', placeholder: 'min', value: runMin, set: setRunMin, saved: sessionLog?.runMin },
                  { label: 'Distance', placeholder: 'km',  value: runKm,  set: setRunKm,  saved: sessionLog?.runKm  },
                  { label: 'Avg HR',   placeholder: 'bpm', value: runHr,  set: setRunHr,  saved: sessionLog?.runHr  },
                ].map(({ label, placeholder, value, set, saved }) => (
                  <div key={label}>
                    <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">{label}</p>
                    <input
                      type="number"
                      placeholder={saved != null ? String(saved) : placeholder}
                      value={value}
                      onChange={e => set(e.target.value)}
                      className="glass-input w-full"
                      style={{ textAlign: 'center', padding: '8px 4px' }}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleSaveRun}
                className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-white/12 text-white/40 hover:border-white/25 hover:text-white/70 transition-all"
              >
                <CheckCircle2 size={14} /> Log & complete
              </button>
            </div>
          )}

          {/* ── INTERVALS SESSION ────────────── */}
          {session.type === 'intervals' && (
            <div className="space-y-2">
              {session.exercises.map(ex => (
                <div key={ex.name} className="glass-sm rounded-xl px-3 py-3">
                  <p className="text-sm font-semibold text-white">{ex.prescription}</p>
                  <p className="text-[11px] text-white/40 mt-0.5">{ex.notes}</p>
                </div>
              ))}
              <button
                onClick={onComplete}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all mt-2 ${
                  isCompleted ? 'bg-white text-black' : 'border border-white/12 text-white/40 hover:border-white/25 hover:text-white/70'
                }`}
              >
                {isCompleted ? <><CheckCircle2 size={14} /> Done</> : <><Circle size={14} /> Mark complete</>}
              </button>
            </div>
          )}

          {/* ── METCON SESSION ───────────────── */}
          {session.type === 'metcon' && (
            <div className="space-y-3">
              <div className="space-y-1">
                {session.exercises.map((ex, i) => (
                  <div key={i} className={`flex items-center justify-between py-1.5 ${i > 0 ? 'border-t border-white/5' : ''}`}>
                    <span className={`text-sm ${ex.prescription === '' ? 'font-semibold text-white/70 text-[12px] uppercase tracking-wide' : 'text-white/70'}`}>
                      {ex.name}
                    </span>
                    <div className="text-right">
                      {ex.prescription && <span className="text-[11px] text-white font-mono">{ex.prescription}</span>}
                      {ex.notes && <p className="text-[10px] text-white/30">{ex.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1.5">Result (time / score)</p>
                <input
                  type="text"
                  placeholder={sessionLog?.metconResult ?? 'e.g. 24:31 / 5+12'}
                  value={metconResult}
                  onChange={e => setMetconResult(e.target.value)}
                  className="glass-input w-full"
                  style={{ textAlign: 'left', padding: '10px 12px' }}
                />
              </div>
              <button
                onClick={() => { onLogMetcon(metconResult); onComplete() }}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  isCompleted ? 'bg-white text-black' : 'border border-white/12 text-white/40 hover:border-white/25 hover:text-white/70'
                }`}
              >
                {isCompleted ? <><CheckCircle2 size={14} /> Done</> : <><Circle size={14} /> Log & complete</>}
              </button>
            </div>
          )}

          {/* ── STRENGTH / GYMNASTICS ────────── */}
          {(session.type === 'strength' || session.type === 'gymnastics') && (
            <div className="space-y-4">
              {session.exercises.map(ex => {
                const setCount = parseSetCount(ex.prescription)
                const restSec = parseRestSecs(ex.rest)
                const showInputs = (ex.trackLoad || ex.trackReps) && setCount > 0
                const exLog = sessionLog?.exercises[ex.name]

                return (
                  <div key={ex.name} className="space-y-2">
                    {/* Exercise header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{ex.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-white/50 font-mono">{ex.prescription}</span>
                          {ex.rest && (
                            <button
                              className="flex items-center gap-1 text-[10px] text-white/25 hover:text-white/60 transition-colors"
                              onClick={() => onStartTimer(restSec)}
                            >
                              <Timer size={10} />
                              <span>{ex.rest}</span>
                              <ChevronRight size={9} />
                            </button>
                          )}
                        </div>
                        {ex.notes && (
                          <p className="text-[10px] text-white/30 mt-0.5 italic">{ex.notes}</p>
                        )}
                      </div>
                    </div>

                    {/* Set inputs */}
                    {showInputs && (
                      <div className="space-y-1">
                        {/* Column headers */}
                        <div className="grid grid-cols-12 gap-1 px-1">
                          <span className="col-span-2 text-[9px] text-white/20 uppercase tracking-wider">Set</span>
                          {ex.trackLoad && <span className="col-span-5 text-[9px] text-white/20 uppercase tracking-wider">Load (kg)</span>}
                          {ex.trackReps && <span className="col-span-5 text-[9px] text-white/20 uppercase tracking-wider">Reps</span>}
                        </div>
                        {Array.from({ length: setCount }, (_, i) => {
                          const logged = exLog?.sets[i]
                          return (
                            <div key={i} className="grid grid-cols-12 gap-1 items-center glass-sm rounded-xl px-2 py-2">
                              <span className="col-span-2 text-[11px] text-white/35 font-mono">{i + 1}</span>
                              {ex.trackLoad && (
                                <input
                                  type="number"
                                  placeholder={logged?.load != null ? String(logged.load) : '—'}
                                  defaultValue={logged?.load ?? ''}
                                  className="glass-input col-span-5"
                                  onBlur={e => {
                                    const v = parseFloat(e.target.value)
                                    if (!isNaN(v)) onLogSet(ex.name, i, { ...logged, load: v })
                                  }}
                                />
                              )}
                              {ex.trackReps && (
                                <input
                                  type="number"
                                  placeholder={logged?.reps != null ? String(logged.reps) : '—'}
                                  defaultValue={logged?.reps ?? ''}
                                  className="glass-input col-span-5"
                                  onBlur={e => {
                                    const v = parseInt(e.target.value)
                                    if (!isNaN(v)) {
                                      onLogSet(ex.name, i, { ...logged, reps: v })
                                      if (restSec > 0) onStartTimer(restSec)
                                    }
                                  }}
                                />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Complete button */}
              <button
                onClick={onComplete}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  isCompleted ? 'bg-white text-black' : 'border border-white/12 text-white/40 hover:border-white/25 hover:text-white/70'
                }`}
              >
                {isCompleted ? <><CheckCircle2 size={14} /> Done</> : <><Circle size={14} /> Mark complete</>}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
