import { DAILY_MACROS, NUTRIENT_TIMING, PHASE_NUTRITION, RACE_NUTRITION } from '../data/nutrition'

export function Nutrition() {
  return (
    <div className="pb-24 px-4 pt-5 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Fuel</h1>
        <p className="text-[11px] text-white/25 mt-0.5">Nutrition protocol — Phase 1 defaults shown</p>
      </div>

      {/* Daily macro targets */}
      <div className="glass p-4">
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Daily Macro Targets</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="border border-white/8 rounded-xl p-3">
            <p className="text-[9px] text-white/25 uppercase tracking-wider">Calories</p>
            <p className="text-2xl font-bold text-white tabular-nums mt-0.5">{DAILY_MACROS.kcal}</p>
            <p className="text-[10px] text-white/25">kcal / day</p>
          </div>
          <div className="border border-white/8 rounded-xl p-3">
            <p className="text-[9px] text-white/25 uppercase tracking-wider">Strategy</p>
            <p className="text-sm font-semibold text-white mt-0.5 leading-snug">{DAILY_MACROS.surplus}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Protein', value: DAILY_MACROS.protein, unit: 'g' },
            { label: 'Carbs',   value: DAILY_MACROS.carbs,   unit: 'g' },
            { label: 'Fat',     value: DAILY_MACROS.fat,     unit: 'g' },
          ].map(({ label, value, unit }) => (
            <div key={label} className="border border-white/8 rounded-xl p-2.5 text-center">
              <p className="text-[9px] text-white/25 uppercase tracking-wider">{label}</p>
              <p className="text-xl font-bold text-white tabular-nums mt-0.5">{value}</p>
              <p className="text-[10px] text-white/25">{unit}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-white/25 mt-3 text-center">
          {DAILY_MACROS.proteinPerKg} body weight · adjust as weight changes
        </p>
      </div>

      {/* Nutrient timing */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-white/30">Nutrient Timing</p>
        {NUTRIENT_TIMING.map((item, i) => (
          <div key={i} className="glass p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl leading-none mt-0.5">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-white">{item.when}</p>
                  <span className="text-[10px] text-white/30">{item.window}</span>
                </div>
                <p className="text-[11px] font-medium text-white/60 mb-1">{item.what}</p>
                <p className="text-[11px] text-white/30 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phase nutrition */}
      <div className="glass p-4">
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Phase Nutrition Strategy</p>
        <div className="space-y-3">
          {PHASE_NUTRITION.map((item, i) => (
            <div key={i} className={`pb-3 ${i < PHASE_NUTRITION.length - 1 ? 'border-b border-white/5' : ''}`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-white">{item.phase}</p>
                <span className="text-[10px] border border-white/15 text-white/40 rounded px-1.5 py-0.5">
                  {item.strategy}
                </span>
              </div>
              <p className="text-[11px] text-white/35 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Race nutrition */}
      <div className="glass p-4">
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Race Day Nutrition</p>
        <p className="text-[11px] font-medium text-white/70 mb-1">{RACE_NUTRITION.rule}</p>
        <p className="text-[11px] text-white/30 leading-relaxed mb-3">{RACE_NUTRITION.detail}</p>
        <div className="space-y-1.5">
          {RACE_NUTRITION.targets.map((t, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-white/20 mt-0.5">·</span>
              <p className="text-[11px] text-white/50">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
