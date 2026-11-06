import { createRng, shuffle, sampleUnique } from './rng'
import { makeDifferentName, makeSortedKoreanNames } from './names'
import {
  DIFFICULTIES,
  SUBJECT_CATALOG,
  IDENTITY_ERRORS,
  ANSWER_ERRORS,
  SUBJECT_REVIEW_ERRORS,
  type DifficultyId,
  type ErrorType,
  type GameConfig,
  type GameData,
  type InspectionMode,
  type MarkStyle,
  type OmrCard,
  type Student,
  type Disposition,
  type ClassSpec,
} from './types'

const ERROR_POOL: ErrorType[] = [
  'id_mark',
  'name_mismatch',
  'duplicate_mark',
  'missing_mark',
  'incomplete_mark',
  'missing_subject',
  'subject_name_mismatch',
  'missing_proctor',
  'proctor_misplaced',
  'correction_tape',
  'wrong_pen',
  'damaged',
]

/** 가상 감독 교사 도장용 2글자 (실명 아님) */
const PROCTOR_STAMP_NAMES = [
  '김민', '이서', '박준', '최윤', '정하', '강유', '조은', '윤재',
  '장도', '임수', '한예', '오현', '서진', '신아', '권태', '황린',
] as const

const MUST_COVER: ErrorType[] = [
  'missing_proctor',
  'proctor_misplaced',
  'damaged',
  'correction_tape',
  'incomplete_mark',
  'wrong_pen',
  'id_mark',
  'duplicate_mark',
  'subject_name_mismatch',
]


function pickProctorStamp(rng: () => number, cardIndex: number): string {
  const i = (Math.floor(rng() * PROCTOR_STAMP_NAMES.length) + cardIndex) % PROCTOR_STAMP_NAMES.length
  return PROCTOR_STAMP_NAMES[i]!
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function correctAnswers(rng: () => number, q: number) {
  return Array.from({ length: q }, () => {
    const roll = rng()
    // ~8% messy but recognizable (not an error)
    if (roll < 0.08) {
      return { choices: [1 + Math.floor(rng() * 5)], style: 'messy_ok' as MarkStyle }
    }
    return { choices: [1 + Math.floor(rng() * 5)], style: 'normal' as MarkStyle }
  })
}

function applyError(
  rng: () => number,
  card: OmrCard,
  student: Student,
  err: ErrorType,
  questionCount: number,
  allClassNos: number[],
): void {
  if (card.isAbsentBlank) return
  if (card.injectedErrors.includes(err)) return
  card.injectedErrors.push(err)

  switch (err) {
    case 'id_mark': {
      const roll = rng()
      if (roll < 0.25) {
        card.markedGrade = student.grade === 1 ? 2 : 1
      } else if (roll < 0.55) {
        const others = allClassNos.filter((c) => c !== student.classNo)
        if (others.length) {
          card.markedClass = others[Math.floor(rng() * others.length)]!
        } else {
          let c = student.classNo
          while (c === student.classNo) c = 1 + Math.floor(rng() * 8)
          card.markedClass = c
        }
      } else if (roll < 0.8) {
        let wrong = student.number
        while (wrong === student.number) wrong = 1 + Math.floor(rng() * 40)
        card.markedNumber = wrong
      } else {
        // handwritten class wrong vs roster (mixed-class confusion)
        const others = allClassNos.filter((c) => c !== student.classNo)
        if (others.length) {
          card.handwrittenClass = others[Math.floor(rng() * others.length)]!
        } else {
          card.markedNumber = student.number === 1 ? 2 : 1
        }
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
      card.answers[qi] = { choices: [a, b], style: 'normal' }
      break
    }
    case 'missing_mark': {
      const qi = Math.floor(rng() * questionCount)
      card.answers[qi] = { choices: [], style: 'normal' }
      break
    }
    case 'incomplete_mark': {
      const qi = Math.floor(rng() * questionCount)
      const choice = card.answers[qi]?.choices[0] ?? 1 + Math.floor(rng() * 5)
      const styles: MarkStyle[] = ['faint', 'line', 'partial']
      const style = styles[Math.floor(rng() * styles.length)]!
      card.answers[qi] = { choices: [choice], incomplete: true, style }
      break
    }
    case 'missing_subject':
      card.subjectCode = null
      break
    case 'subject_name_mismatch': {
      const others = SUBJECT_CATALOG.filter((s) => s.name !== card.subjectName)
      const pick = others[Math.floor(rng() * others.length)]
      card.handwrittenSubject = pick?.name ?? '기타과목'
      break
    }
    case 'missing_proctor':
      card.proctorSigned = false
      card.proctorStampName = null
      card.proctorStampMisplaced = false
      card.injectedErrors = card.injectedErrors.filter((e) => e !== 'proctor_misplaced')
      break
    case 'proctor_misplaced':
      if (card.injectedErrors.includes('missing_proctor') || !card.proctorSigned) {
        card.injectedErrors = card.injectedErrors.filter((e) => e !== 'proctor_misplaced')
        return
      }
      card.proctorSigned = true
      card.proctorStampMisplaced = true
      if (!card.proctorStampName) {
        card.proctorStampName = PROCTOR_STAMP_NAMES[Math.floor(rng() * PROCTOR_STAMP_NAMES.length)]!
      }
      break
    case 'correction_tape': {
      card.hasCorrectionTape = true
      card.correctionTapeBad = true
      card.correctionTapeQi = Math.floor(rng() * questionCount)
      break
    }
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

function buildClassRoster(
  rng: () => number,
  grade: number,
  classNo: number,
  count: number,
  absentCount: number,
  idPrefix: string,
): Student[] {
  const names = makeSortedKoreanNames(rng, count)
  const roster: Student[] = names.map((name, i) => {
    const number = i + 1
    return {
      id: `${idPrefix}-${pad2(number)}`,
      grade,
      classNo,
      number,
      name,
      examId: `${grade}${pad2(classNo)}${pad2(number)}`,
      absent: false,
    }
  })
  const notes = ['병결', '사고결', '기타결', '미응시']
  const absN = Math.min(absentCount, Math.max(0, roster.length - 1))
  const absentIdx = sampleUnique(rng, roster.length, absN)
  for (const i of absentIdx) {
    roster[i]!.absent = true
    roster[i]!.absentNote = notes[Math.floor(rng() * notes.length)]
  }
  return roster
}

function makePresentCard(
  rng: () => number,
  st: Student,
  config: GameConfig,
): OmrCard {
  return {
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
    subjectName: config.subjectName,
    handwrittenSubject: config.subjectName,
    answers: correctAnswers(rng, config.questionCount),
    proctorSigned: true,
    proctorStampName: pickProctorStamp(rng, st.number),
    proctorStampMisplaced: false,
    hasCorrectionTape: false,
    correctionTapeBad: false,
    correctionTapeQi: null,
    wrongPen: false,
    damaged: false,
    injectedErrors: [],
    faceDown: false,
    upsideDown: false,
    isAbsentBlank: false,
    absentMarked: false,
    absentReasonOnCard: null,
  }
}

function makeAbsentBlank(
  rng: () => number,
  st: Student,
  config: GameConfig,
  mismatch: boolean,
): OmrCard {
  const notes = ['병결', '사고결', '기타결', '미응시']
  let reason = st.absentNote ?? '병결'
  let absentMarked = true
  const injected: ErrorType[] = []
  if (mismatch) {
    injected.push('absent_mismatch')
    if (rng() < 0.5) {
      absentMarked = false
      reason = ''
    } else {
      const others = notes.filter((n) => n !== st.absentNote)
      reason = others[Math.floor(rng() * others.length)] ?? '기타결'
    }
  }
  return {
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
    subjectName: config.subjectName,
    handwrittenSubject: config.subjectName,
    answers: Array.from({ length: config.questionCount }, () => ({
      choices: [] as number[],
      style: 'normal' as MarkStyle,
    })),
    proctorSigned: true,
    proctorStampName: pickProctorStamp(rng, st.number + 17),
    proctorStampMisplaced: false,
    hasCorrectionTape: false,
    correctionTapeBad: false,
    correctionTapeQi: null,
    wrongPen: false,
    damaged: false,
    injectedErrors: injected.length ? injected : ['ok'],
    faceDown: false,
    upsideDown: false,
    isAbsentBlank: true,
    absentMarked,
    absentReasonOnCard: reason || null,
  }
}

function ensureErrorCoverage(
  rng: () => number,
  cards: OmrCard[],
  roster: Student[],
  questionCount: number,
  allClassNos: number[],
): void {
  const present = cards.filter((c) => !c.isAbsentBlank)
  for (const err of MUST_COVER) {
    if (present.some((c) => c.injectedErrors.includes(err))) continue
    const candidates = shuffle(
      rng,
      present.filter((c) => c.injectedErrors[0] === 'ok' || c.injectedErrors.length < 2),
    )
    const card = candidates[0]
    if (!card) continue
    if (card.injectedErrors[0] === 'ok') card.injectedErrors = []
    const student = roster.find((x) => x.id === card.studentId)!
    applyError(rng, card, student, err, questionCount, allClassNos)
  }
}

export function generateGame(
  difficulty: DifficultyId = 'easy',
  seed?: number,
  inspectionMode: InspectionMode = 'subject_review',
): GameData {
  const diff = DIFFICULTIES[difficulty]
  const s = seed ?? (Math.floor(Math.random() * 1e9) || 1)
  const rng = createRng(s)
  const subject = SUBJECT_CATALOG[Math.floor(rng() * SUBJECT_CATALOG.length)]!

  const classSpecs: ClassSpec[] = diff.multiClass
    ? (diff.classes ?? [{ grade: 2, classNo: 4, studentCount: diff.studentCount }])
    : [{ grade: 2, classNo: 4, studentCount: diff.studentCount }]

  const totalStudents = classSpecs.reduce((a, c) => a + c.studentCount, 0)
  // distribute absents across classes
  let absLeft = Math.min(diff.absentCount, totalStudents - classSpecs.length)
  const absPerClass = classSpecs.map((cs, i) => {
    const remainClasses = classSpecs.length - i
    const take = Math.min(cs.studentCount - 1, Math.max(0, Math.round(absLeft / remainClasses)))
    absLeft -= take
    return take
  })

  const config: GameConfig = {
    seed: s,
    difficulty,
    studentCount: totalStudents,
    questionCount: diff.questionCount,
    grade: classSpecs[0]!.grade,
    classNo: classSpecs[0]!.classNo,
    subjectCode: subject.code,
    subjectName: subject.name,
    errorCardCount: diff.errorCardCount,
    flippedBackCount: diff.flippedBackCount,
    upsideDownCount: diff.upsideDownCount,
    absentCount: absPerClass.reduce((a, b) => a + b, 0),
    timeLimitSec: inspectionMode === 'immediate' ? Math.min(600, diff.immediateLimitSec) : null,
    inspectionMode,
    multiClass: diff.multiClass,
    classes: classSpecs,
  }

  const roster: Student[] = []
  classSpecs.forEach((cs, idx) => {
    roster.push(
      ...buildClassRoster(rng, cs.grade, cs.classNo, cs.studentCount, absPerClass[idx]!, `s${cs.classNo}`),
    )
  })

  const allClassNos = [...new Set(roster.map((r) => r.classNo))]
  const present = roster.filter((st) => !st.absent)
  const absentees = roster.filter((st) => st.absent)

  const cards: OmrCard[] = present.map((st) => makePresentCard(rng, st, config))

  // absent blanks — at least one mismatch when absentees exist
  const mismatchIdx =
    absentees.length > 0 ? sampleUnique(rng, absentees.length, Math.min(1, absentees.length)) : []
  for (let i = 0; i < absentees.length; i++) {
    cards.push(makeAbsentBlank(rng, absentees[i]!, config, mismatchIdx.includes(i)))
  }

  const presentCards = cards.filter((c) => !c.isAbsentBlank)
  const errIdx = sampleUnique(
    rng,
    presentCards.length,
    Math.min(config.errorCardCount, presentCards.length),
  )
  for (const i of errIdx) {
    const card = presentCards[i]!
    const student = roster.find((x) => x.id === card.studentId)!
    const n = rng() < 0.4 ? 2 : 1
    const kinds = shuffle(rng, [...ERROR_POOL]).slice(0, n)
    for (const e of kinds) applyError(rng, card, student, e, config.questionCount, allClassNos)
  }

  ensureErrorCoverage(rng, cards, roster, config.questionCount, allClassNos)

  for (const card of cards) {
    if (card.injectedErrors.length === 0) card.injectedErrors = ['ok']
  }

  // orientation only on present cards (absent blanks stay upright for clarity)
  const orientable = cards.map((c, i) => (!c.isAbsentBlank ? i : -1)).filter((i) => i >= 0)
  const backIdx = shuffle(rng, orientable).slice(0, Math.min(config.flippedBackCount, orientable.length))
  for (const i of backIdx) cards[i]!.faceDown = true

  const uprightIdx = cards
    .map((c, i) => (!c.faceDown && !c.isAbsentBlank ? i : -1))
    .filter((i) => i >= 0)
  const upPick = shuffle(rng, uprightIdx).slice(0, Math.min(config.upsideDownCount, uprightIdx.length))
  for (const i of upPick) cards[i]!.upsideDown = true
  if (upPick.length < config.upsideDownCount) {
    const need = config.upsideDownCount - upPick.length
    const extra = shuffle(
      rng,
      cards.map((c, i) => (c.faceDown && !c.upsideDown && !c.isAbsentBlank ? i : -1)).filter((i) => i >= 0),
    ).slice(0, need)
    for (const i of extra) cards[i]!.upsideDown = true
  }

  return { config, roster, cards: shuffle(rng, cards) }
}

/** 반 → 번호순 (결시 빈 답안지 포함) */
export function expectedOrder(roster: Student[], cards: OmrCard[]): string[] {
  const byStudent = new Map(cards.map((c) => [c.studentId, c.id]))
  const sorted = [...roster].sort((a, b) => {
    if (a.grade !== b.grade) return a.grade - b.grade
    if (a.classNo !== b.classNo) return a.classNo - b.classNo
    return a.number - b.number
  })
  return sorted.map((s) => byStudent.get(s.id)!).filter(Boolean)
}

export function studentForCard(roster: Student[], card: OmrCard): Student {
  return roster.find((s) => s.id === card.studentId)!
}

export function expectedDisposition(
  card: OmrCard,
  mode: InspectionMode = 'subject_review',
): Disposition {
  const errs = card.injectedErrors.filter((e) => e !== 'ok')
  if (errs.length === 0) return 'ok'

  const hasIdentity = errs.some((e) => (IDENTITY_ERRORS as string[]).includes(e))
  const hasAnswer = errs.some((e) => (ANSWER_ERRORS as string[]).includes(e))
  const hasSubject = errs.some((e) => (SUBJECT_REVIEW_ERRORS as string[]).includes(e))

  // 기재 사항만 학생 호출. 답안 마킹은 절대 호출·수정 대상 아님.
  if (hasIdentity) return 'call_identity'
  if (mode === 'subject_review') {
    if (hasSubject) return 'to_subject'
    if (hasAnswer) return 'score_wrong'
    return 'to_subject'
  }
  // immediate
  if (hasAnswer && !hasSubject) return 'score_wrong'
  if (hasSubject && !hasAnswer) return 'to_subject'
  if (hasAnswer) return 'score_wrong'
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
  if (d === 'easy' || d === 'normal' || d === 'hard' || d === 'multi') return d
  return undefined
}

export function parseModeFromUrl(): InspectionMode | undefined {
  const m = new URLSearchParams(location.search).get('mode')
  if (m === 'immediate' || m === 'subject_review') return m
  return undefined
}

export function headcountTruth(roster: Student[]) {
  const enrolled = roster.length
  const absent = roster.filter((s) => s.absent).length
  const present = enrolled - absent
  return { enrolled, absent, present }
}

/** 결정적 테스트용: 주어진 시드에서 missing_proctor가 생기는지 */
export function seedHasMissingProctor(difficulty: DifficultyId, seed: number): boolean {
  const data = generateGame(difficulty, seed, 'subject_review')
  return data.cards.some(
    (c) => c.injectedErrors.includes('missing_proctor') && !c.proctorSigned && !c.proctorStampName,
  )
}

/** 결정적 테스트용: 도장 걸침/밖 오류 */
export function seedHasMisplacedProctor(difficulty: DifficultyId, seed: number): boolean {
  const data = generateGame(difficulty, seed, 'subject_review')
  return data.cards.some(
    (c) =>
      c.injectedErrors.includes('proctor_misplaced') &&
      c.proctorSigned &&
      c.proctorStampMisplaced &&
      !!c.proctorStampName,
  )
}

export function assertRosterNameOrder(roster: Student[]): boolean {
  const byClass = new Map<string, Student[]>()
  for (const s of roster) {
    const k = `${s.grade}-${s.classNo}`
    if (!byClass.has(k)) byClass.set(k, [])
    byClass.get(k)!.push(s)
  }
  for (const list of byClass.values()) {
    const sorted = [...list].sort((a, b) => a.number - b.number)
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i]!.number !== i + 1) return false
    }
    const names = sorted.map((s) => s.name)
    const locale = [...names].sort((a, b) => a.localeCompare(b, 'ko'))
    if (names.some((n, i) => n !== locale[i])) return false
  }
  return true
}
