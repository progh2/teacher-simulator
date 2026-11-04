import { createRng, shuffle, sampleUnique } from './rng'
import { makeKoreanName, makeDifferentName } from './names'
import type {
  AnswerMark,
  ErrorType,
  GameConfig,
  GameData,
  OmrCard,
  Student,
} from './types'

const DEFAULT: Omit<GameConfig, 'seed'> = {
  studentCount: 10,
  questionCount: 10,
  grade: 2,
  classNo: 4,
  subjectCode: 17,
  errorCardCount: 4,
  flippedCount: 3,
}

const ERROR_POOL: ErrorType[] = [
  'wrong_number',
  'wrong_grade_class',
  'name_mismatch',
  'double_mark',
  'missing_mark',
  'faint_mark',
  'missing_subject',
]

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function correctAnswers(rng: () => number, q: number): AnswerMark[] {
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
  defaultSubject: number,
): void {
  if (card.injectedErrors.includes(err)) return
  card.injectedErrors.push(err)

  switch (err) {
    case 'wrong_number': {
      let wrong = student.number
      while (wrong === student.number) wrong = 1 + Math.floor(rng() * 20)
      card.markedNumber = wrong
      break
    }
    case 'wrong_grade_class': {
      if (rng() < 0.5) {
        card.markedGrade = student.grade === 1 ? 2 : 1
      } else {
        let c = student.classNo
        while (c === student.classNo) c = 1 + Math.floor(rng() * 8)
        card.markedClass = c
      }
      break
    }
    case 'name_mismatch': {
      card.handwrittenName = makeDifferentName(rng, student.name)
      break
    }
    case 'double_mark': {
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
    case 'faint_mark': {
      const qi = Math.floor(rng() * questionCount)
      const choice = card.answers[qi]?.choices[0] ?? 1 + Math.floor(rng() * 5)
      card.answers[qi] = { choices: [choice], faint: true }
      break
    }
    case 'missing_subject': {
      card.subjectCode = null
      break
    }
    default:
      break
  }

  // keep handwritten fields consistent unless name_mismatch
  void defaultSubject
}

export function generateGame(partial?: Partial<GameConfig>): GameData {
  const seed = partial?.seed ?? (Math.floor(Math.random() * 1e9) || 1)
  const config: GameConfig = { ...DEFAULT, ...partial, seed }
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
    }
  })

  const cards: OmrCard[] = roster.map((st) => ({
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
    answers: correctAnswers(rng, config.questionCount),
    injectedErrors: [],
    faceDown: false,
  }))

  // inject errors onto distinct cards
  const errIdx = sampleUnique(rng, cards.length, Math.min(config.errorCardCount, cards.length))
  for (const i of errIdx) {
    const card = cards[i]!
    const student = roster.find((s) => s.id === card.studentId)!
    // 1~2 errors per bad card
    const n = rng() < 0.35 ? 2 : 1
    const kinds = shuffle(rng, [...ERROR_POOL]).slice(0, n)
    for (const e of kinds) {
      applyError(rng, card, student, e, config.questionCount, config.subjectCode)
    }
  }

  // mark clean cards as ok (for expected judgment)
  for (const card of cards) {
    if (card.injectedErrors.length === 0) {
      card.injectedErrors = ['ok']
    }
  }

  // flip some cards (face down) after shuffling order later in UI
  const flipIdx = sampleUnique(rng, cards.length, Math.min(config.flippedCount, cards.length))
  for (const i of flipIdx) {
    cards[i]!.faceDown = true
  }

  // shuffle deal order for sorting stage
  const dealt = shuffle(rng, cards)

  return { config, roster, cards: dealt }
}

export function expectedOrder(roster: Student[], cards: OmrCard[]): string[] {
  const byStudent = new Map(cards.map((c) => [c.studentId, c.id]))
  return roster.map((s) => byStudent.get(s.id)!)
}

export function studentForCard(roster: Student[], card: OmrCard): Student {
  return roster.find((s) => s.id === card.studentId)!
}

export function parseSeedFromUrl(): number | undefined {
  const q = new URLSearchParams(location.search)
  const s = q.get('seed')
  if (!s) return undefined
  const n = Number(s)
  return Number.isFinite(n) ? n >>> 0 : undefined
}

export function pickDemoSeed(rng = Math.random): number {
  return Math.floor(rng() * 1e9) || 42
}

