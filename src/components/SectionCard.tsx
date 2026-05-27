import { useState } from 'react'
import { ChevronDown, ChevronUp, CheckCircle2, Circle, ChevronRight, Info } from 'lucide-react'
import type { WorkoutSection, SectionLog, SetLog } from '../types'

const TYPE_COLORS: Record<string, string> = {
  warmup:      'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  strength:    'bg-blue-500/15 text-blue-400 border-blue-500/30',
  technique:   'bg-purple-500/15 text-purple-400 border-purple-500/30',
  metcon:      'bg-red-500/15 text-red-400 border-red-500/30',
  accessory:   'bg-slate-500/15 text-slate-400 border-slate-500/30',
  cooldown:    'bg-teal-500/15 text-teal-400 border-teal-500/30',
  conditioning:'bg-green-500/15 text-green-400 border-green-500/30',
  gymnastics:  'bg-pink-500/15 text-pink-400 border-pink-500/30',
}

const TYPE_LABELS: Record<string, string> = {
  warmup: 'Warm-up', strength: 'Strength', technique: 'Technique',
  metcon: 'Metcon', accessory: 'Accessory', cooldown: 'Cool-down',
  conditioning: 'Conditioning', gymnastics: 'Gymnastics',
}

function parseRestSeconds(rest?: string): number {
  if (!rest) return 0
  const min = rest.match(/(\d+)\s*min/)
  const sec = rest.match(/(\d+)\s*sec/)
  return (min ? parseInt(min[1]) * 60 : 0) + (sec ? parseInt(sec[1]) : 0)
}

type Props = {
  section: WorkoutSection
  sectionLog?: SectionLog
  onComplete: () => void
  onLogSet: (setIndex: number, log: SetLog) => void
  onStartTimer: (seconds: number) => void
  defaultOpen?: boolean
}

export function SectionCard({ section, sectionLog, onComplete, onLogSet, onStartTimer, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const [showCoach, setShowCoach] = useState(false)

  const isCompleted = sectionLog?.completed ?? false
  const tagClass = TYPE_COLORS[section.type] ?? TYPE_COLORS.accessory

  return (
    <div className={`rounded-2xl border transition-all ${isCompleted ? 'border-slate-700/50 opacity-75' : 'border-slate-700'} bg-slate-900`}>
      {/* Header */}
      <button
        className="w-full flex items-center gap-3 p-4 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-xl font-bold text-slate-500 w-6 shrink-0">{section.id}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tagClass}`}>
              {TYPE_LABELS[section.type]}
            </span>
            {section.duration && (
              <span className="text-[10px] text-slate-500">{section.duration}</span>
            )}
          </div>
          <p className={`text-sm font-medium leading-snug ${isCompleted ? 'text-slate-500 line-through' : 'text-white'}`}>
            {section.title}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isCompleted && <CheckCircle2 size={18} className="text-green-500" />}
          {open ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4">
          {/* Note */}
          {section.note && (
            <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
              {section.note}
            </p>
          )}

          {/* Description-only section */}
          {section.isDescriptionOnly && section.description && (
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {section.description}
            </p>
          )}

          {/* Set table */}
          {section.sets && section.sets.length > 0 && (
            <div className="space-y-2">
              {/* Column headers */}
              <div className="grid grid-cols-12 gap-1 px-1">
                <span className="col-span-1 text-[10px] text-slate-600 uppercase">Set</span>
                <span className="col-span-3 text-[10px] text-slate-600 uppercase">Load</span>
                <span className="col-span-2 text-[10px] text-slate-600 uppercase">Reps</span>
                <span className="col-span-2 text-[10px] text-slate-600 uppercase">Actual kg</span>
                <span className="col-span-2 text-[10px] text-slate-600 uppercase">Reps</span>
                <span className="col-span-2 text-[10px] text-slate-600 uppercase">RPE</span>
              </div>

              {section.sets.map((set, i) => {
                const logged = sectionLog?.sets[i]
                const restSec = parseRestSeconds(set.rest)
                return (
                  <div key={i} className="space-y-1">
                    {set.notes && (
                      <p className="text-[11px] text-slate-500 pl-1 italic">{set.notes}</p>
                    )}
                    <div className={`grid grid-cols-12 gap-1 items-center rounded-lg px-2 py-2 ${set.isAmrap ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-slate-800'}`}>
                      <span className="col-span-1 text-xs text-slate-400 font-mono">{set.setLabel}</span>
                      <div className="col-span-3">
                        <span className="text-xs text-slate-300 font-medium">{set.load ?? '—'}</span>
                        {set.isAmrap && <span className="ml-1 text-[10px] text-orange-400 font-bold">AMRAP</span>}
                      </div>
                      <div className="col-span-2">
                        <span className={`text-xs font-mono ${set.isAmrap ? 'text-orange-300' : 'text-slate-300'}`}>{set.reps}</span>
                        {set.rpe && <span className="text-[10px] text-slate-500 ml-1">@{set.rpe}</span>}
                      </div>
                      <input
                        type="number"
                        placeholder={set.load?.replace(' kg', '').replace('/DB', '') ?? '—'}
                        defaultValue={logged?.load ?? ''}
                        className="col-span-2 bg-slate-700 rounded-md text-center text-xs text-white py-1.5 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        onBlur={e => {
                          const val = parseFloat(e.target.value)
                          if (!isNaN(val)) onLogSet(i, { ...logged, load: val })
                        }}
                      />
                      <input
                        type="number"
                        placeholder={set.reps.replace('+', '') ?? '—'}
                        defaultValue={logged?.reps ?? ''}
                        className="col-span-2 bg-slate-700 rounded-md text-center text-xs text-white py-1.5 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        onBlur={e => {
                          const val = parseInt(e.target.value)
                          if (!isNaN(val)) {
                            onLogSet(i, { ...logged, reps: val })
                            if (restSec > 0) onStartTimer(restSec)
                          }
                        }}
                      />
                      <input
                        type="number"
                        placeholder="RPE"
                        defaultValue={logged?.rpe ?? ''}
                        min="1" max="10"
                        className="col-span-2 bg-slate-700 rounded-md text-center text-xs text-white py-1.5 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        onBlur={e => {
                          const val = parseFloat(e.target.value)
                          if (!isNaN(val)) onLogSet(i, { ...logged, rpe: val })
                        }}
                      />
                    </div>
                    {set.rest && (
                      <button
                        className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-orange-400 transition-colors pl-1"
                        onClick={() => restSec > 0 && onStartTimer(restSec)}
                      >
                        <span>⏱ Rest: {set.rest}</span>
                        {restSec > 0 && <ChevronRight size={12} />}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Coach note toggle */}
          {section.coachNote && (
            <div>
              <button
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                onClick={() => setShowCoach(s => !s)}
              >
                <Info size={13} />
                <span>Coach note</span>
                {showCoach ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
              {showCoach && (
                <p className="mt-2 text-xs text-slate-400 bg-slate-800 rounded-lg px-3 py-2 leading-relaxed">
                  {section.coachNote}
                </p>
              )}
            </div>
          )}

          {/* Complete button */}
          <button
            onClick={onComplete}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              isCompleted
                ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600'
            }`}
          >
            {isCompleted ? (
              <><CheckCircle2 size={16} /> Done</>
            ) : (
              <><Circle size={16} /> Mark complete</>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
