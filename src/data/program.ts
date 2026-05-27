export const macrocycle = [
  { phase: 'Y1–M1', weeks: '1–12',   name: 'General Prep / Base',      goals: 'Aerobic base, Burgener PVC, strict gymnastics, linear strength, DB bench established' },
  { phase: 'Y1–M2', weeks: '13–24',  name: 'Strength Accumulation',    goals: 'Wendler 5/3/1 cycles 1–3, kipping intro, lactate threshold, DB bench +5 kg' },
  { phase: 'Y1–M3', weeks: '25–36',  name: 'Skill Transmutation',      goals: 'Full snatch/C&J, first strict HSPU & MU, threshold + tempo conditioning' },
  { phase: 'Y1–M4', weeks: '37–52',  name: 'Year-1 Realization',       goals: 'Max tests, first benchmark sweep, DB bench targeting 55 kg × 3 × 8' },
  { phase: 'Y2–M1', weeks: '53–60',  name: 'Hypertrophy Offseason 1',  goals: 'Upper/lower split, DB bench primary, build 2–4 kg lean mass, repair connective tissue' },
  { phase: 'Y2–M2', weeks: '61–72',  name: 'Competition Prep 1',       goals: 'Mock Open, heavy singles, barbell cycling, DB bench accessory' },
  { phase: 'Y2–M3', weeks: '73–80',  name: 'Hypertrophy Offseason 2',  goals: 'Second hypertrophy block, Zone 2 reset, DB bench target 65 kg × 3 × 8' },
  { phase: 'Y2–M4', weeks: '81–96',  name: 'Competition Peak',         goals: 'Polarized conditioning, VO2max blocks, comp-style chippers' },
  { phase: 'Y2–M5', weeks: '97–104', name: 'Peak & Test',              goals: 'Taper, full benchmark sweep, planned local competition' },
]

export const benchmarkSchedule = [
  { week: 4,   wods: ['Fran (scaled 30 kg + strict PU)', '1-mile run'],                        targets: ['~9:00', '~7:30'],          notes: 'Establish starting point. Video both.' },
  { week: 10,  wods: ['Helen (KB 24 kg, kipping PU)', 'Grace (40 kg)'],                       targets: ['12:00', '7:00'],           notes: 'First kipping pull-up WOD.' },
  { week: 16,  wods: ['Diane (scaled 100 kg DL, kipping HSPU)', 'Cindy'],                     targets: ['10:00', '12 rds'],         notes: 'First HSPU attempt in WOD context.' },
  { week: 22,  wods: ['Fran (35 kg, kipping PU)', 'Annie'],                                    targets: ['7:00', '10:00'],           notes: 'Fran pace check. Start double-unders in Annie.' },
  { week: 28,  wods: ['Helen Rx (KB 24 kg)', 'Isabel (40 kg snatch)'],                        targets: ['9:30', '5:00'],            notes: 'First snatch WOD — use power snatch if full not clean.' },
  { week: 34,  wods: ['Murph (vest optional)', 'Karen (150 wall balls)'],                     targets: ['48:00', '8:00'],           notes: 'Murph — partition 5+10+15 per round if needed.' },
  { week: 40,  wods: ['Grace Rx (60 kg)', 'Diane Rx-light'],                                   targets: ['5:00', '6:30'],            notes: 'Barbell-cycle benchmark. Aim unbroken sets in Grace.' },
  { week: 46,  wods: ['Fran Rx (43 kg)', 'DB Bench 3×8 max'],                                 targets: ['6:00', '52.5 kg/DB'],      notes: 'First full Fran Rx attempt.' },
  { week: 52,  wods: ['Fran', 'Helen', 'Grace', 'Murph', 'Cindy', 'DB Bench 3×8', '1RM Snatch', '1RM C&J'], targets: ['<5:30', '<10:00', '<4:30', '<50:00', '17 rds', 'PR', '~85 kg', '~106 kg'], notes: 'Full Year-1 retest. Compare to Week 4 baseline.' },
]

export const strengthTargets = [
  { lift: 'Back Squat',     current: '~130 kg',          year2Target: '~165 kg' },
  { lift: 'Deadlift',       current: '~145 kg (est.)',    year2Target: '~185 kg' },
  { lift: 'Barbell Bench',  current: '~110 kg',           year2Target: '~135 kg' },
  { lift: 'DB Bench',       current: '40 kg × 3 × 8',    year2Target: '65 kg × 3 × 8' },
  { lift: 'Strict Press',   current: '~55 kg (est.)',     year2Target: '~80 kg' },
  { lift: 'Weighted PU',    current: '+15 kg × 8',        year2Target: '+35 kg single' },
  { lift: 'Snatch',         current: 'Technique only',    year2Target: '~95 kg' },
  { lift: 'Clean & Jerk',   current: 'Technique only',    year2Target: '~115 kg' },
]
