import { useState } from 'react'
import { ChevronDown, ChevronUp, CheckCircle2, Circle, ChevronRight, Info } from 'lucide-react'
import type { WorkoutSection, SectionLog, SetLog } from '../types'

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

  return (
    <div className={`glass transition-all ${isCompleted ? 'opacity-55' : ''}`}>
      {/* Header */}
      <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setOpen(o => !o)}>
        <span className="text-base font-bold text-white/25 w-6 shrink-0 font-mono">{section.id}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35 border border-white/10 rounded-full px-2 py-0.5">
              {TYPE_LABELS[section.type]}
            </span>
            {section.duration && (
              <span className="text-[10px] text-white/25">{section.duration}</span>
            )}
          </div>
          <p className={`text-sm font-medium leading-snug ${isCompleted ? 'text-white/30 line-through' : 'text-white'}`}>
            {section.title}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isCompleted && <CheckCircle2 size={16} className="text-white/50" />}
          {open
            ? <ChevronUp size={16} className="text-white/25" />
            : <ChevronDown size={16} className="text-white/25" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4">
          {/* Note */}
          {section.note && (
            <p className="text-[11px] text-white/60 bg-white/5 border border-white/8 rounded-xl px-3 py-2 leading-relaxed">
              {section.note}
            </p>
          )}

          {/* Description only */}
          {section.isDescriptionOnly && section.description && (
            <p className="text-sm text-white/65 leading-relaxed whitespace-pre-line">
              {section.description}
            </p>
          )}

          {/* Set table */}
          {section.sets && section.sets.length > 0 && (
            <div className="space-y-1.5">
              {/* Headers */}
              <div className="grid grid-cols-12 gap-1 px-1">
                <span className="col-span-1 text-[9px] text-white/20 uppercase tracking-wider">Set</span>
                <span className="col-span-3 text-[9px] text-white/20 uppercase tracking-wider">Load</span>
                <span className="col-span-2 text-[9px] text-white/20 uppercase tracking-wider">Reps</span>
                <span className="col-span-2 text-[9px] text-white/20 uppercase tracking-wider">kg</span>
                <span className="col-span-2 text-[9px] text-white/20 uppercase tracking-wider">Reps</span>
                <span className="col-span-2 text-[9px] text-white/20 uppercase tracking-wider">RPE</span>
              </div>

              {section.sets.map((set, i) => {
                const logged = sectionLog?.sets[i]
                const restSec = parseRestSeconds(set.rest)
                return (
                  <div key={i} className="space-y-1">
                    {set.notes && (
                      <p className="text-[11px] text-white/30 pl-1 italic">{set.notes}</p>
                    )}
                    <div className={`grid grid-cols-12 gap-1 items-center rounded-xl px-2 py-2 ${
                      set.isAmrap
                        ? 'bg-white/10 border border-white/18'
                        : 'glass-sm'
                    }`}>
                      <span className="col-span-1 text-[11px] text-white/35 font-mono">{set.setLabel}</span>
                      <div className="col-span-3 flex items-center gap-1">
                        <span className="text-xs text-white/80 font-medium leading-tight">{set.load ?? '—'}</span>
                        {set.isAmrap && (
                          <span className="text-[9px] text-white font-bold bg-white/15 rounded px-1">MAX</span>
                        )}
                      </div>
                      <div className="col-span-2">
                        <span className={`text-xs font-mono ${set.isAmrap ? 'text-white font-bold' : 'text-white/70'}`}>
                          {set.reps}
                        </span>
                        {set.rpe && (
                          <span className="text-[9px] text-white/25 ml-0.5">@{set.rpe}</span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder={set.load?.replace(' kg', '').replace('/DB', '') ?? ''}
                        defaultValue={logged?.load ?? ''}
                        className="glass-input col-span-2"
                        onBlur={e => {
                          const val = parseFloat(e.target.value)
                          if (!isNaN(val)) onLogSet(i, { ...logged, load: val })
                        }}
                      />
                      <input
                        type="number"
                        placeholder={set.reps.replace('+', '')}
                        defaultValue={logged?.reps ?? ''}
                        className="glass-input col-span-2"
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
                        placeholder="—"
                        defaultValue={logged?.rpe ?? ''}
                        min="1" max="10"
                        className="glass-input col-span-2"
                        onBlur={e => {
                          const val = parseFloat(e.target.value)
                          if (!isNaN(val)) onLogSet(i, { ...logged, rpe: val })
                        }}
                      />
                    </div>
                    {set.rest && restSec > 0 && (
                      <button
                        className="flex items-center gap-1 text-[11px] text-white/25 hover:text-white/60 transition-colors pl-1"
                        onClick={() => onStartTimer(restSec)}
                      >
                        <span>⏱ {set.rest}</span>
                        <ChevronRight size={11} />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Coach note */}
          {section.coachNote && (
            <div>
              <button
                className="flex items-center gap-1.5 text-[11px] text-white/25 hover:text-white/50 transition-colors"
                onClick={() => setShowCoach(s => !s)}
              >
                <Info size={12} />
                <span>Coach note</span>
                {showCoach ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </button>
              {showCoach && (
                <p className="mt-2 text-[12px] text-white/50 bg-white/4 border border-white/8 rounded-xl px-3 py-2.5 leading-relaxed">
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
                ? 'bg-white text-black'
                : 'border border-white/12 text-white/40 hover:border-white/25 hover:text-white/70'
            }`}
          >
            {isCompleted
              ? <><CheckCircle2 size={15} /> Done</>
              : <><Circle size={15} /> Mark complete</>}
          </button>
        </div>
      )}
    </div>
  )
}
