import { createRng, shuffle, sampleUnique } from './rng'
import { makeKoreanName, makeDifferentName } from './names'
import {
  DIFFICULTIES,
  type DifficultyId,
  type ErrorType,
  type GameConfig,
  type GameData,
  type OmrCard,
  type Student,
} from './types'

const ERROR_POOL: ErrorType[] = [
  'id_mark',
  'name_mismatch',
  'duplicate_mark',
  'missing_mark',
  'incomplete_mark',
  'missing_subject',
  'missing_proctor',
  'correction_tape',
  'form_type',
  'wrong_pen',
  'damaged',
]

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function correctAnswers(rng: () => number, q: number) {
  return Array.from({ length: q }, () => ({
    choices: [1 + Math.floor(rng() * 5)],
  }))
}

function applyError(
  rng: () => number,
  card: OmrCard,
  student: Student,
  err: ErrorType,
  questionCount: number,
): void {
  if (card.injectedErrors.includes(err)) return
  card.injectedErrors.push(err)

  switch (err) {
    case 'id_mark': {
      const roll = rng()
      if (roll < 0.34) {
        card.markedGrade = student.grade === 1 ? 2 : 1
      } else if (roll < 0.67) {
        let c = student.classNo
        while (c === student.classNo) c = 1 + Math.floor(rng() * 8)
        card.markedClass = c
      } else {
        let wrong = student.number
        while (wrong === student.number) wrong = 1 + Math.floor(rng() * 40)
        card.markedNumber = wrong
      }
      break
    }
    case 'name_mismatch':
      card.handwrittenName = makeDifferentName(rng, student.name)
      break
    case 'duplicate_mark': {
      const qi = Math.floor(rng() * questionCount)
      const a = 1 + Math.floor(rng() * 5)
      let b = a
      while (b === a) b = 1 + Math.floor(rng() * 5)
      card.answers[qi] = { choices: [a, b] }
      break
    }
    case 'missing_mark': {
      const qi = Math.floor(rng() * questionCount)
      card.answers[qi] = { choices: [] }
      break
    }
    case 'incomplete_mark': {
      const qi = Math.floor(rng() * questionCount)
      const choice = card.answers[qi]?.choices[0] ?? 1 + Math.floor(rng() * 5)
      card.answers[qi] = { choices: [choice], incomplete: true }
      break
    }
    case 'missing_subject':
      card.subjectCode = null
      break
    case 'missing_proctor':
      card.proctorSigned = false
      break
    case 'correction_tape':
      card.hasCorrectionTape = true
      card.correctionTapeBad = true
      break
    case 'form_type':
      card.formType = null
      break
    case 'wrong_pen':
      card.wrongPen = true
      break
    case 'damaged': {
      card.damaged = true
      card.damageKind = shuffle(rng, ['fold', 'stain', 'tear'] as const)[0]
      break
    }
    default:
      break
  }
}

export function generateGame(
  difficulty: DifficultyId = 'easy',
  seed?: number,
): GameData {
  const diff = DIFFICULTIES[difficulty]
  const s = seed ?? (Math.floor(Math.random() * 1e9) || 1)
  const config: GameConfig = {
    seed: s,
    difficulty,
    studentCount: diff.studentCount,
    questionCount: diff.questionCount,
    grade: 2,
    classNo: 4,
    subjectCode: 17,
    errorCardCount: diff.errorCardCount,
    flippedBackCount: diff.flippedBackCount,
    upsideDownCount: diff.upsideDownCount,
    absentCount: diff.absentCount,
    timeLimitSec: diff.timeLimitSec,
  }
  const rng = createRng(config.seed)

  const roster: Student[] = Array.from({ length: config.studentCount }, (_, i) => {
    const number = i + 1
    return {
      id: `s-${pad2(number)}`,
      grade: config.grade,
      classNo: config.classNo,
      number,
      name: makeKoreanName(rng),
      examId: `${config.grade}${pad2(config.classNo)}${pad2(number)}`,
      absent: false,
    }
  })

  const absentIdx = sampleUnique(rng, roster.length, Math.min(config.absentCount, roster.length - 1))
  const notes = ['병결', '사고결', '기타결', '미응시']
  for (const i of absentIdx) {
    roster[i]!.absent = true
    roster[i]!.absentNote = notes[Math.floor(rng() * notes.length)]
  }

  const present = roster.filter((st) => !st.absent)
  const cards: OmrCard[] = present.map((st) => ({
    id: `c-${st.id}`,
    studentId: st.id,
    handwrittenName: st.name,
    handwrittenGrade: st.grade,
    handwrittenClass: st.classNo,
    handwrittenNumber: st.number,
    markedGrade: st.grade,
    markedClass: st.classNo,
    markedNumber: st.number,
    subjectCode: config.subjectCode,
    formType: (rng() < 0.5 ? 'odd' : 'even') as 'odd' | 'even',
    answers: correctAnswers(rng, config.questionCount),
    proctorSigned: true,
    hasCorrectionTape: false,
    correctionTapeBad: false,
    wrongPen: false,
    damaged: false,
    injectedErrors: [],
    faceDown: false,
    upsideDown: false,
  }))

  const errIdx = sampleUnique(rng, cards.length, Math.min(config.errorCardCount, cards.length))
  for (const i of errIdx) {
    const card = cards[i]!
    const student = roster.find((x) => x.id === card.studentId)!
    const n = rng() < 0.4 ? 2 : 1
    const kinds = shuffle(rng, [...ERROR_POOL]).slice(0, n)
    for (const e of kinds) applyError(rng, card, student, e, config.questionCount)
  }

  for (const card of cards) {
    if (card.injectedErrors.length === 0) card.injectedErrors = ['ok']
  }

  const backIdx = sampleUnique(rng, cards.length, Math.min(config.flippedBackCount, cards.length))
  for (const i of backIdx) cards[i]!.faceDown = true

  // upside-down among non-faceDown preferably
  const uprightIdx = cards.map((c, i) => (!c.faceDown ? i : -1)).filter((i) => i >= 0)
  const upPick = shuffle(rng, uprightIdx).slice(0, Math.min(config.upsideDownCount, uprightIdx.length))
  for (const i of upPick) cards[i]!.upsideDown = true
  // if need more, also mark some faceDown as upsideDown for when flipped
  if (upPick.length < config.upsideDownCount) {
    const need = config.upsideDownCount - upPick.length
    const extra = shuffle(
      rng,
      cards.map((c, i) => (c.faceDown && !c.upsideDown ? i : -1)).filter((i) => i >= 0),
    ).slice(0, need)
    for (const i of extra) cards[i]!.upsideDown = true
  }

  return { config, roster, cards: shuffle(rng, cards) }
}

export function expectedOrder(roster: Student[], cards: OmrCard[]): string[] {
  const byStudent = new Map(cards.map((c) => [c.studentId, c.id]))
  return roster.filter((s) => !s.absent).map((s) => byStudent.get(s.id)!)
}

export function studentForCard(roster: Student[], card: OmrCard): Student {
  return roster.find((s) => s.id === card.studentId)!
}

export function expectedDisposition(card: OmrCard): import('./types').Disposition {
  if (card.injectedErrors.length === 1 && card.injectedErrors[0] === 'ok') return 'ok'
  // 시험 종료 후 기본: 교과 확인. (데모는 시험 후 상황)
  return 'to_subject'
}

export function parseSeedFromUrl(): number | undefined {
  const q = new URLSearchParams(location.search)
  const s = q.get('seed')
  if (!s) return undefined
  const n = Number(s)
  return Number.isFinite(n) ? n >>> 0 : undefined
}

export function parseDifficultyFromUrl(): DifficultyId | undefined {
  const d = new URLSearchParams(location.search).get('diff')
  if (d === 'easy' || d === 'normal' || d === 'hard') return d
  return undefined
}

export function headcountTruth(roster: Student[]) {
  const enrolled = roster.length
  const absent = roster.filter((s) => s.absent).length
  const present = enrolled - absent
  return { enrolled, absent, present }
}
