export const DAILY_MACROS = {
  kcal: 3300,
  protein: 200,
  carbs: 400,
  fat: 95,
  surplus: '~300–400 kcal above maintenance',
  proteinPerKg: '2.35 g/kg',
}

export const NUTRIENT_TIMING = [
  {
    when: 'Pre-morning session',
    window: '30–45 min before',
    what: '20–30 g easily digested carbs',
    detail: "Banana + rice cake. Don't train fasted at this volume — it blunts session quality.",
    emoji: '🌅',
  },
  {
    when: 'Post-long run',
    window: 'Within 45 min',
    what: '60–80 g carbs + 40 g protein',
    detail: 'This window matters more than any other. Glycogen replenishment is the priority.',
    emoji: '🏃',
  },
  {
    when: 'Pre-strength session',
    window: '1.5–2 h before',
    what: 'Full mixed meal',
    detail: "Flexible on macro split — don't lift heavy on a fasted stomach.",
    emoji: '🏋️',
  },
  {
    when: 'Before bed',
    window: 'Nightly',
    what: '30–40 g casein protein',
    detail: 'Supports overnight muscle protein synthesis at this training volume.',
    emoji: '🌙',
  },
]

export const PHASE_NUTRITION = [
  {
    phase: 'Phase 1 (Mass)',
    strategy: 'Surplus',
    detail: '+300–400 kcal above maintenance. Support muscle growth and load progression.',
  },
  {
    phase: 'Phase 2 (Conditioning)',
    strategy: 'Maintenance',
    detail: 'Match calories to output. Strength maintained, body recomposes.',
  },
  {
    phase: 'Phase 3 (Ultra)',
    strategy: 'Mild deficit',
    detail: 'Target 82–84 kg race weight. Lighter = better running economy.',
  },
]

export const RACE_NUTRITION = {
  rule: 'Practice race nutrition on every long run.',
  detail: 'Gels or real food — gut training matters. Stomach issues on race day are a training failure, not bad luck.',
  targets: [
    '60–90 g carbs/hour during ultra efforts',
    '500–750 ml fluid/hour depending on heat',
    'Sodium 500–1000 mg/hour in heat',
  ],
}
