import type { Workout, SetPrescription } from '../types'

const SQUAT_TM = 117
const DEADLIFT_TM = 130
const PRESS_TM = 50

function r(kg: number): number {
  return Math.round(kg / 2.5) * 2.5
}

function wendlerSets(
  tm: number,
  week: 1 | 2 | 3 | 4,
  restNormal: string,
  restAmrap: string
): SetPrescription[] {
  const patterns: Record<number, { pct: number; reps: string; minReps: number; isAmrap?: boolean }[]> = {
    1: [
      { pct: 0.65, reps: '5', minReps: 5 },
      { pct: 0.75, reps: '5', minReps: 5 },
      { pct: 0.85, reps: '5+', minReps: 5, isAmrap: true },
    ],
    2: [
      { pct: 0.70, reps: '3', minReps: 3 },
      { pct: 0.80, reps: '3', minReps: 3 },
      { pct: 0.90, reps: '3+', minReps: 3, isAmrap: true },
    ],
    3: [
      { pct: 0.75, reps: '5', minReps: 5 },
      { pct: 0.85, reps: '3', minReps: 3 },
      { pct: 0.95, reps: '1+', minReps: 1, isAmrap: true },
    ],
    4: [
      { pct: 0.40, reps: '5', minReps: 5 },
      { pct: 0.50, reps: '5', minReps: 5 },
      { pct: 0.60, reps: '5', minReps: 5 },
    ],
  }
  return patterns[week].map((p, i) => ({
    setLabel: String(i + 1),
    load: `${r(tm * p.pct)} kg`,
    reps: p.reps,
    rest: i < 2 ? restNormal : (p.isAmrap ? restAmrap : restNormal),
    rpe: week === 4 ? '6' : i === 2 ? '8–9' : '7',
    isAmrap: p.isAmrap,
  }))
}

function buildWeek(weekNum: 1 | 2 | 3 | 4): Workout[] {
  const wendlerWeek = weekNum as 1 | 2 | 3 | 4
  const isDeload = weekNum === 4

  const ghd = weekNum === 1 ? '15' : weekNum === 2 ? '20' : weekNum === 3 ? '25' : '10'

  const mon: Workout = {
    id: `w${weekNum}d1`,
    week: weekNum,
    day: 1,
    weekday: 'MON',
    focus: 'Back Squat · Hang Power Snatch · Metcon',
    duration: isDeload ? 75 : 90,
    isDeload,
    sections: [
      {
        id: 'A',
        title: 'Burgener PVC Snatch Warm-up',
        type: 'warmup',
        duration: '10 min',
        description:
          '3 reps each: Down & Up → Elbows High & Outside → Muscle Snatch → Power Snatch Lands → Snatch Lands. ' +
          '5 reps each skill transfer: Snatch Push Press → OHS → Heaving Snatch Balance → Drop Snatch → Snatch Balance. ' +
          'All on PVC. Control every position — do not rush.',
        isDescriptionOnly: true,
      },
      {
        id: 'B',
        title: 'Back Squat — Wendler 5/3/1',
        type: 'strength',
        note: `TM = ${SQUAT_TM} kg. Log AMRAP reps${isDeload ? '. Deload — no AMRAP.' : '. Must beat minimum to progress TM.'}`,
        sets: wendlerSets(SQUAT_TM, wendlerWeek, '3 min', '4 min'),
        coachNote:
          'Brace before unracking. Belt optional from 80%+. On AMRAP: stop 1–2 reps before form breaks. Log the number.',
      },
      {
        id: 'C',
        title: 'Hang Power Snatch — Technique',
        type: 'technique',
        duration: '15 min',
        note: 'Keep loads light — this is skill work. Video at least 1 set.',
        sets: [
          { setLabel: '1', load: 'Empty bar', reps: '5', rest: '90 sec', rpe: '4' },
          { setLabel: '2', load: `~${r(DEADLIFT_TM * 0.30)} kg`, reps: '3', rest: '90 sec', rpe: '5' },
          { setLabel: '3', load: `~${r(DEADLIFT_TM * 0.33)} kg`, reps: '3', rest: '90 sec', rpe: '6' },
          { setLabel: '4', load: `~${r(DEADLIFT_TM * 0.33)} kg`, reps: '3', rest: '90 sec', rpe: '6' },
          { setLabel: '5', load: `~${r(DEADLIFT_TM * 0.36)} kg`, reps: '3', rest: '90 sec', rpe: '6–7' },
        ],
        coachNote:
          'High hang (hip crease). Push floor away, not bar up. Receive in quarter squat. Elbows punch through — not pull back. Reset feet each rep.',
      },
      {
        id: 'D',
        title: isDeload ? 'Metcon — Light Conditioning (cap 10 min)' : 'Metcon — Mini-Fran (8–10 min, RPE 8)',
        type: 'metcon',
        description: isDeload
          ? '3 rounds: 10 thrusters @ 20 kg + 5 strict pull-ups. Move consistently, RPE 6.'
          : '15-12-9: Thrusters @ 30 kg + Kipping pull-ups (or 15 kg DB thrusters + strict pull-ups if kipping not yet clean). Target sub-7 min. RPE 8.',
        isDescriptionOnly: true,
      },
      {
        id: 'E',
        title: 'Accessory',
        type: 'accessory',
        sets: [
          { setLabel: '1–3', load: '30 kg', reps: '10 each side', rest: '60 sec', notes: 'Single-arm DB row' },
          { setLabel: '1–3', load: 'Light band', reps: '15', rest: '60 sec', notes: 'Face pulls' },
          { setLabel: '1–3', load: 'Band', reps: '20', rest: '45 sec', notes: 'Band pull-aparts' },
        ],
        coachNote: 'Keep these easy — cool-down effort.',
      },
      {
        id: 'F',
        title: 'Cool-down',
        type: 'cooldown',
        duration: '5 min',
        description:
          '5 min easy row or bike at RPE 2. Foam roll: thoracic spine 60 sec, quads 60 sec each. Couch stretch: 60 sec each hip.',
        isDescriptionOnly: true,
      },
    ],
  }

  const tue: Workout = {
    id: `w${weekNum}d2`,
    week: weekNum,
    day: 2,
    weekday: 'TUE',
    focus: 'Aerobic Threshold · Gymnastics Strength',
    duration: isDeload ? 60 : 75,
    isDeload,
    sections: [
      {
        id: 'A',
        title: isDeload ? 'Zone 2 — Easy Aerobic (40 min)' : 'Conditioning — Hinshaw Hop Scotch (45–50 min, RPE 4–5)',
        type: 'conditioning',
        description: isDeload
          ? 'Row or run continuously at MAF HR cap (≤151 bpm) for 40 min. Log distance and avg HR.'
          : 'Continuous, non-stop. 5,900 m total: 200/400/600/800/1000/800/600/400/200 m easy + 100 m sprint after each block. ' +
            'Easy pace ~9:00/mi (RPE 3). Sprint = 97–98% max effort. Log total distance and avg HR.',
        isDescriptionOnly: true,
      },
      {
        id: 'B',
        title: 'Weighted Strict Pull-ups',
        type: 'strength',
        note: 'Baseline: 8 strict + 15 kg. Enter at weighted accumulation. Use belt or DB between legs.',
        sets: isDeload
          ? [
              { setLabel: '1', load: '10 kg added', reps: '5', rest: '2 min', rpe: '6' },
              { setLabel: '2', load: '10 kg added', reps: '5', rest: '2 min', rpe: '6' },
              { setLabel: '3', load: '12.5 kg added', reps: '4', rest: '2 min', rpe: '6–7' },
            ]
          : weekNum === 1
          ? [
              { setLabel: '1', load: '15 kg added', reps: '5', rest: '2 min', rpe: '7' },
              { setLabel: '2', load: '17.5 kg added', reps: '5', rest: '2 min', rpe: '7–8' },
              { setLabel: '3', load: '17.5 kg added', reps: '5', rest: '2 min', rpe: '8' },
              { setLabel: '4', load: '20 kg added', reps: '4', rest: '2 min', rpe: '8' },
              { setLabel: '5', load: '20 kg added', reps: '4', rest: '2 min', rpe: '8–9' },
            ]
          : weekNum === 2
          ? [
              { setLabel: '1', load: '17.5 kg added', reps: '5', rest: '2 min', rpe: '7' },
              { setLabel: '2', load: '20 kg added', reps: '5', rest: '2 min', rpe: '7–8' },
              { setLabel: '3', load: '20 kg added', reps: '5', rest: '2 min', rpe: '8' },
              { setLabel: '4', load: '22.5 kg added', reps: '4', rest: '2 min', rpe: '8' },
              { setLabel: '5', load: '22.5 kg added', reps: '4', rest: '2 min', rpe: '8–9' },
            ]
          : [
              { setLabel: '1', load: '17.5 kg added', reps: '5', rest: '2 min', rpe: '7' },
              { setLabel: '2', load: '20 kg added', reps: '4', rest: '2 min', rpe: '8' },
              { setLabel: '3', load: '22.5 kg added', reps: '3', rest: '2 min', rpe: '8' },
              { setLabel: '4', load: '22.5 kg added', reps: '3', rest: '2 min', rpe: '8–9' },
              { setLabel: '5', load: '25 kg added', reps: '2', rest: '2 min', rpe: '9' },
            ],
        coachNote:
          'Full dead hang each rep. No kipping. Chin OVER bar — not forehead. Control the descent (2 sec). If you can\'t control descent, drop the weight.',
      },
      {
        id: 'C',
        title: 'Dips',
        type: 'strength',
        sets: isDeload
          ? [
              { setLabel: '1', load: 'BW', reps: '6', rest: '90 sec', rpe: '5' },
              { setLabel: '2', load: 'BW', reps: '6', rest: '90 sec', rpe: '5' },
              { setLabel: '3', load: 'BW', reps: '6', rest: '90 sec', rpe: '5' },
            ]
          : [
              { setLabel: '1', load: 'BW', reps: '8', rest: '90 sec', rpe: '7' },
              { setLabel: '2', load: 'BW', reps: '8', rest: '90 sec', rpe: '7' },
              { setLabel: '3', load: 'BW', reps: '8', rest: '90 sec', rpe: '7' },
              { setLabel: '4', load: 'BW', reps: '8', rest: '90 sec', rpe: '7' },
            ],
        coachNote:
          'Elbows track back, not flared. Lean slightly forward for chest emphasis. Full lockout at top. No bouncing at bottom.',
      },
      {
        id: 'D',
        title: 'Gymnastics Foundations',
        type: 'gymnastics',
        duration: '20 min',
        sets: [
          { setLabel: '4×5', load: '', reps: '3-sec descent', rest: '90 sec', notes: 'Pike push-up on box → build to wall HSPU' },
          { setLabel: '3×3', load: '', reps: 'Hold 3 sec at top', rest: '90 sec', notes: 'Wall walk (nose to wall)' },
          { setLabel: '3×30s', load: '', reps: '30 sec', rest: '60 sec', notes: 'Hollow body hold' },
          { setLabel: '3×20s', load: '', reps: '20 sec', rest: '60 sec', notes: 'Arch hold (arms overhead, squeeze glutes)' },
        ],
        coachNote: 'Every position dialed before adding reps. These build your HSPU base.',
      },
      {
        id: 'E',
        title: 'Cool-down',
        type: 'cooldown',
        duration: '5 min',
        description: 'Lat stretch on rig: 60 sec each side. Banded shoulder distraction: 60 sec each. Wrist CARs: 10 circles each direction.',
        isDescriptionOnly: true,
      },
    ],
  }

  const wed: Workout = {
    id: `w${weekNum}d3`,
    week: weekNum,
    day: 3,
    weekday: 'WED',
    focus: 'Strict Press · DB Bench · Power Clean · Engine',
    duration: isDeload ? 75 : 90,
    isDeload,
    sections: [
      {
        id: 'A',
        title: 'Burgener Clean Warm-up',
        type: 'warmup',
        duration: '10 min',
        description:
          'Muscle clean ×5 → Tall clean ×5 → High hang power clean ×3 — all on PVC. ' +
          'Empty bar: High hang power clean ×3, Hang power clean ×3, Power clean from floor ×3. ' +
          'Build to warm-up weight (60% target): 2×3 power cleans.',
        isDescriptionOnly: true,
      },
      {
        id: 'B',
        title: 'Strict Press — Wendler 5/3/1',
        type: 'strength',
        note: `TM = ${PRESS_TM} kg. Log AMRAP set reps.${isDeload ? ' Deload week.' : ''}`,
        sets: wendlerSets(PRESS_TM, wendlerWeek, '2 min', '3 min'),
        coachNote:
          'Bar on front of shoulders (not neck). Full lockout — arms fully extended overhead. Do not lean back beyond natural lumbar arch. Squeeze glutes on every rep.',
      },
      {
        id: 'C',
        title: 'DB Bench Press — Primary Tracked Lift',
        type: 'strength',
        note: isDeload
          ? 'Deload: reduce load 10%, do not progress. Log normally.'
          : 'Double-progression: increase reps first (3×8 → 3×12), then add 2.5 kg/DB and reset. Week 1 target: 3×8 @ 40 kg/DB. LOG EVERY SET.',
        sets: isDeload
          ? [
              { setLabel: '1', load: '35 kg/DB', reps: '8', rest: '2 min', rpe: '6' },
              { setLabel: '2', load: '35 kg/DB', reps: '8', rest: '2 min', rpe: '6' },
              { setLabel: '3', load: '35 kg/DB', reps: '8', rest: '2 min', rpe: '6' },
            ]
          : [
              { setLabel: '1', load: '40 kg/DB', reps: '8', rest: '2 min', rpe: '7' },
              { setLabel: '2', load: '40 kg/DB', reps: '8', rest: '2 min', rpe: '7–8' },
              { setLabel: '3', load: '40 kg/DB', reps: '8', rest: '2 min', rpe: '8' },
            ],
        coachNote:
          'Feet flat on floor, arch maintained, scapulae retracted and depressed. Lower to mid-chest (not throat, not belly). Press straight up — slight arc inward at top. 2-sec controlled descent minimum.',
      },
      {
        id: 'D',
        title: 'DB Chest Fly — Hypertrophy',
        type: 'accessory',
        sets: [
          { setLabel: '1', load: '20 kg/DB', reps: '12', rest: '75 sec', rpe: '7' },
          { setLabel: '2', load: '20 kg/DB', reps: '12', rest: '75 sec', rpe: '7' },
          { setLabel: '3', load: '20 kg/DB', reps: '12', rest: '75 sec', rpe: '7' },
        ],
        coachNote:
          '3-sec eccentric (lowering phase). Slight bend in elbows throughout — never fully straight. Stop at shoulder height (not below). Squeeze at top, controlled stretch at bottom.',
      },
      {
        id: 'E',
        title: 'Power Clean — Technique & Accumulation',
        type: 'technique',
        sets: [
          { setLabel: '1', load: `~${r(DEADLIFT_TM * 0.40)} kg`, reps: '3', rest: '90 sec', rpe: '5', notes: 'Feel the positions' },
          { setLabel: '2', load: `~${r(DEADLIFT_TM * 0.44)} kg`, reps: '3', rest: '90 sec', rpe: '6' },
          { setLabel: '3', load: `~${r(DEADLIFT_TM * 0.46)} kg`, reps: '3', rest: '90 sec', rpe: '6–7' },
          { setLabel: '4', load: `~${r(DEADLIFT_TM * 0.48)} kg`, reps: '3', rest: '90 sec', rpe: '7' },
          { setLabel: '5', load: `~${r(DEADLIFT_TM * 0.48)} kg`, reps: '3', rest: '90 sec', rpe: '7' },
        ],
        coachNote:
          'C&J Year-1 target: 106 kg. Sweep bar in tight, triple extension before pull under. Land in full front-rack with elbows up — no "starfish" catch. Reset stance each rep.',
      },
      {
        id: 'F',
        title: 'Front Squat — Positional Strength',
        type: 'strength',
        sets: isDeload
          ? [
              { setLabel: '1', load: `${r(SQUAT_TM * 0.60)} kg`, reps: '5', rest: '90 sec', notes: '60% back squat' },
              { setLabel: '2', load: `${r(SQUAT_TM * 0.60)} kg`, reps: '5', rest: '90 sec' },
              { setLabel: '3', load: `${r(SQUAT_TM * 0.60)} kg`, reps: '5', rest: '90 sec' },
            ]
          : [
              { setLabel: '1', load: `${r(SQUAT_TM * 0.67)} kg`, reps: '6', rest: '2 min', notes: '~70% back squat' },
              { setLabel: '2', load: `${r(SQUAT_TM * 0.67)} kg`, reps: '6', rest: '2 min', rpe: '7' },
              { setLabel: '3', load: `${r(SQUAT_TM * 0.67)} kg`, reps: '6', rest: '2 min', rpe: '7' },
              { setLabel: '4', load: `${r(SQUAT_TM * 0.70)} kg`, reps: '6', rest: '2 min', rpe: '7–8' },
            ],
        coachNote:
          'Elbows up — rack position, not cross-arm. No forward lean at bottom. Knees track over toes. This builds the receiving position for your clean.',
      },
      {
        id: 'G',
        title: isDeload ? 'Conditioning — Light Engine (10 min cap)' : 'Metcon — 12 min AMRAP (RPE 7–8)',
        type: 'metcon',
        description: isDeload
          ? '3 rounds: 200 m run + 10 KB swings (20 kg) + 3 pull-ups. Move at RPE 5–6. Rest as needed between rounds.'
          : '12 min AMRAP: 200 m run + 10 KB swings (24 kg) + 5 weighted strict pull-ups @ 10 kg. RPE 7–8. Log total rounds + reps.',
        isDescriptionOnly: true,
      },
      {
        id: 'H',
        title: 'Cool-down',
        type: 'cooldown',
        duration: '5 min',
        description:
          'Thoracic extension over foam roller: 90 sec. Pec minor stretch on wall: 60 sec each. Wrist CARs after every clean/press session: 10 circles each direction.',
        isDescriptionOnly: true,
      },
    ],
  }

  const thu: Workout = {
    id: `w${weekNum}d4`,
    week: weekNum,
    day: 4,
    weekday: 'THU',
    focus: 'Lactate Threshold Run',
    duration: isDeload ? 45 : 60,
    isDeload,
    sections: [
      {
        id: 'A',
        title: 'Warm-up Run + Activation',
        type: 'warmup',
        duration: '10 min',
        description:
          '5 min easy jog at RPE 3 (conversational pace). Ankle dorsiflexion stretches: 3×60 sec each. Leg swings forward/lateral: 10 each direction. 50 m build-up strides ×2 (build from 60% → 80% effort).',
        isDescriptionOnly: true,
      },
      {
        id: 'B',
        title: isDeload ? 'Zone 2 Run — 30 min Easy' : 'Conditioning — Hinshaw Bombolini LT',
        type: 'conditioning',
        description: isDeload
          ? '30 min easy run at MAF HR cap (≤151 bpm). No intervals. This is active recovery. Log pace and avg HR.'
          : '3 sets of: 500 m fast run + 200 m recovery jog + 100 m sprint. Rest 5 min between sets.\n' +
            '500 m pace: between mile PR and 400 m PR (~2:00–2:05 min for 85 kg athlete at 7:00/mi PR).\n' +
            'Sprint = 400 m PR pace or faster (<40 sec/200 m).\n' +
            'Log: split times for each 500 m, sprint times.',
        isDescriptionOnly: true,
      },
      {
        id: 'C',
        title: 'Cool-down Mobility',
        type: 'cooldown',
        duration: '15 min',
        sets: [
          { setLabel: '×1', load: '', reps: '60 sec each', rest: '', notes: 'Couch stretch — hip flexor priority' },
          { setLabel: '×1', load: '', reps: '90 sec each', rest: '', notes: 'Pigeon pose — external hip rotation' },
          { setLabel: '3×', load: '', reps: '60 sec each', rest: '', notes: 'Ankle dorsiflexion against wall' },
          { setLabel: '×1', load: '', reps: '60 sec each', rest: '', notes: 'Calf stretch on box (gastroc + soleus)' },
          { setLabel: '×1', load: '', reps: '10 min', rest: '', notes: '10 min easy row, RPE 2 — flush legs' },
        ],
      },
    ],
  }

  const fri: Workout = {
    id: `w${weekNum}d5`,
    week: weekNum,
    day: 5,
    weekday: 'FRI',
    focus: 'Deadlift · Split Jerk · DB Bench Volume · Long Metcon',
    duration: isDeload ? 75 : 105,
    isDeload,
    sections: [
      {
        id: 'A',
        title: 'Burgener Jerk Warm-up',
        type: 'warmup',
        duration: '10 min',
        description:
          'Push press BN ×5 → Push jerk BN ×5 → Split jerk BN ×5 (footwork: heel-toe landing, same width each rep) → Split jerk from front rack ×5 @ empty bar. ' +
          '2×3 split jerk @ ~50% of target (~53 kg). Build to working weight.',
        isDescriptionOnly: true,
      },
      {
        id: 'B',
        title: 'Deadlift — Wendler 5/3/1',
        type: 'strength',
        note: `TM = ${DEADLIFT_TM} kg. Log AMRAP reps. Belt recommended from 80%+.${isDeload ? ' Deload week.' : ''}`,
        sets: wendlerSets(DEADLIFT_TM, wendlerWeek, '3 min', '4 min'),
        coachNote:
          'Brace hard before every rep. Bar over mid-foot. Lat engagement: "protect your armpits." Hinge, don\'t squat. Lock hips out fully at top — don\'t hyperextend. Reset each rep from dead stop.',
      },
      {
        id: 'C',
        title: 'Split Jerk — Technical Accumulation',
        type: 'technique',
        sets: isDeload
          ? [
              { setLabel: '1', load: `~${r(DEADLIFT_TM * 0.38)} kg`, reps: '2', rest: '2 min', notes: 'Technique focus' },
              { setLabel: '2', load: `~${r(DEADLIFT_TM * 0.38)} kg`, reps: '2', rest: '2 min' },
              { setLabel: '3', load: `~${r(DEADLIFT_TM * 0.40)} kg`, reps: '2', rest: '2 min' },
            ]
          : [
              { setLabel: '1', load: `~${r(DEADLIFT_TM * 0.42)} kg`, reps: '2', rest: '2 min', rpe: '5', notes: 'Feel the dip-drive' },
              { setLabel: '2', load: `~${r(DEADLIFT_TM * 0.46)} kg`, reps: '2', rest: '2 min', rpe: '6', notes: 'Footwork focus' },
              { setLabel: '3', load: `~${r(DEADLIFT_TM * 0.46)} kg`, reps: '2', rest: '2 min', rpe: '6–7' },
              { setLabel: '4', load: `~${r(DEADLIFT_TM * 0.48)} kg`, reps: '2', rest: '2 min', rpe: '7', notes: 'Overhead stability' },
              { setLabel: '5', load: `~${r(DEADLIFT_TM * 0.48)} kg`, reps: '2', rest: '2 min', rpe: '7' },
            ],
        coachNote:
          'Dip: vertical (no forward lean of torso). Drive: aggressive hip extension. Punch elbows through — don\'t muscle press. Front foot lands heel-toe, back foot ball of foot. Recover front foot first.',
      },
      {
        id: 'D',
        title: 'DB Bench — Volume (Secondary Session)',
        type: 'accessory',
        note: 'Volume/pump sets. Lighter than Wednesday. Hypertrophy reps — slow and controlled. Log but do NOT progress load here; progression happens on Wednesday.',
        sets: [
          { setLabel: '1', load: '32.5 kg/DB', reps: '12', rest: '75 sec', rpe: '6–7' },
          { setLabel: '2', load: '32.5 kg/DB', reps: '12', rest: '75 sec', rpe: '7' },
          { setLabel: '3', load: '32.5 kg/DB', reps: '15', rest: '75 sec', rpe: '7' },
        ],
      },
      {
        id: 'E',
        title: 'Accessory — Posterior Chain',
        type: 'accessory',
        sets: [
          { setLabel: '1–3', load: '80 kg', reps: '10', rest: '90 sec', notes: 'Romanian DL — 3-sec eccentric' },
          { setLabel: '1–3', load: 'BW', reps: ghd, rest: '90 sec', notes: `GHD sit-up — Week ${weekNum}: max ${ghd} reps` },
        ],
        coachNote: `⚠ GHD WARNING: SOF athletes elevated rhabdo risk on GHD. Week ${weekNum}: max ${ghd} reps regardless of how easy it feels. Add 5 reps/week. Do not exceed 20 in this block.`,
      },
      {
        id: 'F',
        title: isDeload ? 'Conditioning — Easy Steady State (15 min)' : 'Metcon — Helen Prep (18–22 min, RPE 8)',
        type: 'metcon',
        description: isDeload
          ? '3 rounds: 400 m walk/easy jog + 15 KB swings (16 kg) + 5 strict pull-ups. RPE 5. No rushing.'
          : '3 rounds for time:\n400 m run + 21 KB swings (24 kg) + 9 weighted strict pull-ups @ 5–10 kg.\nTarget: finish in 18–22 min. RPE 8. Scale KB if needed. Log split times per round.',
        isDescriptionOnly: true,
      },
      {
        id: 'G',
        title: 'Cool-down',
        type: 'cooldown',
        duration: '5 min',
        description:
          'Pigeon pose: 90 sec each hip. Hip flexor stretch: 60 sec each. Child\'s pose with lat reach: 60 sec each side. Foam roll hamstrings + glutes: 60 sec each.',
        isDescriptionOnly: true,
      },
    ],
  }

  const sat: Workout = {
    id: `w${weekNum}d6`,
    week: weekNum,
    day: 6,
    weekday: 'SAT',
    focus: 'Aerobic Base · Olympic Skill · Gymnastics Skill · Double-Unders',
    duration: isDeload ? 60 : 90,
    isDeload,
    sections: [
      {
        id: 'A',
        title: 'Zone 2 — MAF Aerobic Base',
        type: 'conditioning',
        duration: isDeload ? '30 min' : '45–60 min',
        description:
          'Row or run at MAF HR cap (≤151 bpm). HR monitor mandatory. If HR exceeds 151 bpm: slow down immediately.\n' +
          'Log: distance covered, average HR, average pace.\n' +
          (weekNum === 1
            ? 'NOTE Week 1 MAF test: record pace at 151 bpm carefully — this is your baseline. Same route each week to track aerobic development.'
            : `Week ${weekNum}: compare pace at 151 bpm to Week 1 baseline.`),
        isDescriptionOnly: true,
      },
      {
        id: 'B',
        title: 'Olympic Lifting Skill — Snatch',
        type: 'technique',
        duration: '10 min',
        description:
          'Burgener PVC warm-up (all 5 drills + 5 skill transfers). ' +
          'Empty bar: snatch balance ×3, drop snatch ×3, OHS ×5. ' +
          'Video one set from the side. Focus: bar path stays close, full overhead lockout.',
        isDescriptionOnly: true,
      },
      {
        id: 'C',
        title: 'Gymnastics Skill',
        type: 'gymnastics',
        duration: '10 min',
        sets: [
          { setLabel: '×5', load: '', reps: '3 sec hold at top', rest: '60 sec', notes: 'Wall walks — nose to wall' },
          { setLabel: '3×30s', load: '', reps: '30 sec', rest: '45 sec', notes: 'Handstand hold against wall' },
          { setLabel: '3×3', load: '', reps: '3-sec descent', rest: '60 sec', notes: 'Pike push-up on box' },
        ],
        coachNote: 'Low intensity — technique only, not max-rep sets. Deload applies to gymnastics too.',
      },
      {
        id: 'D',
        title: 'Double-Under Practice',
        type: 'technique',
        duration: '10 min',
        description:
          `Week ${weekNum}: ${weekNum === 1 ? 'Build from singles. 10 min practice — attempt DUs without forcing it. Target: first consistent DUs by Week 12.' : weekNum === 4 ? 'Light practice only. 5 min max. Focus on rhythm, not volume.' : 'Practice DU sets. Attempt: 10 unbroken. Log best unbroken set.'} ` +
          'Relaxed wrists, light jumps, consistent cadence.',
        isDescriptionOnly: true,
      },
      {
        id: 'E',
        title: 'Cool-down',
        type: 'cooldown',
        duration: '5 min',
        description:
          'Full body mobility: thoracic foam roll 90 sec, hip flexor stretch 60 sec each, lat stretch on rig 60 sec each. Hydration check.',
        isDescriptionOnly: true,
      },
    ],
  }

  return [mon, tue, wed, thu, fri, sat]
}

export const block1Workouts: Workout[] = [
  ...buildWeek(1),
  ...buildWeek(2),
  ...buildWeek(3),
  ...buildWeek(4),
]

export const block1Meta = {
  id: 1,
  name: 'Block 1: General Prep / Base',
  weeks: 4,
  startWeek: 1,
  phase: 'Y1–M1',
  goals: 'Aerobic base, Burgener PVC, strict gymnastics, linear strength, DB bench established',
}
