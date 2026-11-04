/** 관찰된 이상(오류) 유형 — 마킹을 고치는 게 아니라 «발견»만 한다 */
export type ErrorType =
  | 'id_mark' // 학년·반·번호 마킹 오류
  | 'name_mismatch'
  | 'duplicate_mark' // 중복 표기
  | 'missing_mark'
  | 'incomplete_mark' // 불완전 표기
  | 'missing_subject'
  | 'missing_proctor' // 감독관 확인란
  | 'correction_tape' // 수정테이프 (우리 학교 규정 기준)
  | 'form_type' // 문형 홀·짝 미표기
  | 'wrong_pen'
  | 'damaged' // 접힘·얼룩·찢김
  | 'ok'

export const ERROR_LABELS: Record<ErrorType, string> = {
  id_mark: '학년·반·번호 마킹 오류',
  name_mismatch: '성명 불일치',
  duplicate_mark: '중복 표기',
  missing_mark: '답안 미표기',
  incomplete_mark: '불완전 표기',
  missing_subject: '과목코드 누락',
  missing_proctor: '감독관 확인란 누락',
  correction_tape: '수정테이프 이상 (우리 학교 규정)',
  form_type: '문형(홀·짝) 미표기',
  wrong_pen: '컴퓨터용 사인펜 아님',
  damaged: '접힘·얼룩·찢김',
  ok: '이상 없음',
}

export const ERROR_HINTS: Record<ErrorType, string> = {
  id_mark: '수기·명렬의 학년·반·번호와 자릿수 마킹이 다릅니다.',
  name_mismatch: 'OMR 수기 성명이 명렬표와 다릅니다.',
  duplicate_mark: '같은 문항에 두 개 이상 칠해져 있습니다. (구: 이중 마킹)',
  missing_mark: '답해야 할 문항이 비어 있습니다.',
  incomplete_mark: '마킹이 흐리거나 불완전해 인식이 어렵습니다. (구: 흐린 마킹)',
  missing_subject: '과목코드가 비어 있습니다.',
  missing_proctor: '감독관 확인란에 서명·도장이 없습니다.',
  correction_tape: '수정테이프가 들뜨거나 위에 다시 칠해져 있습니다. ※ 처리는 우리 학교 규정 기준.',
  form_type: '문형(홀수형/짝수형)이 표기되지 않았습니다.',
  wrong_pen: '컴퓨터용 수성 사인펜이 아닌 필기구 흔적입니다.',
  damaged: '카드가 접히거나 얼룩·찢김이 있습니다.',
  ok: '수기·마킹·명렬이 일치하고 물리적 이상도 없습니다.',
}

export const JUDGABLE_ERRORS: ErrorType[] = [
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
  'ok',
]

/** 시험 후 교사가 카드에 하는 조치 — 마킹을 대신 고치지 않음 */
export type Disposition = 'ok' | 'ask_student' | 'to_subject'

export const DISPOSITION_LABELS: Record<Disposition, string> = {
  ok: '정상',
  ask_student: '학생에게 수정 요청',
  to_subject: '교과 확인으로 넘김',
}

export const DISPOSITION_HINTS: Record<Disposition, string> = {
  ok: '이상 없음. 성적 처리로 넘깁니다.',
  ask_student: '시험 진행 중에만. 학생이 본인 카드를 고칩니다. 교사가 대신 칠하지 않습니다.',
  to_subject: '시험 종료 후. 현장에서 고치지 않고 교과·성적 처리로 넘깁니다.',
}

export type DifficultyId = 'easy' | 'normal' | 'hard'

export interface Difficulty {
  id: DifficultyId
  label: string
  studentCount: number
  questionCount: number
  errorCardCount: number
  flippedBackCount: number
  upsideDownCount: number
  absentCount: number
  timeLimitSec: number | null
}

export const DIFFICULTIES: Record<DifficultyId, Difficulty> = {
  easy: {
    id: 'easy',
    label: '쉬움',
    studentCount: 10,
    questionCount: 20,
    errorCardCount: 3,
    flippedBackCount: 2,
    upsideDownCount: 2,
    absentCount: 1,
    timeLimitSec: null,
  },
  normal: {
    id: 'normal',
    label: '보통',
    studentCount: 20,
    questionCount: 20,
    errorCardCount: 6,
    flippedBackCount: 4,
    upsideDownCount: 3,
    absentCount: 2,
    timeLimitSec: 600,
  },
  hard: {
    id: 'hard',
    label: '어려움',
    studentCount: 30,
    questionCount: 20,
    errorCardCount: 10,
    flippedBackCount: 6,
    upsideDownCount: 5,
    absentCount: 3,
    timeLimitSec: 480,
  },
}

export interface Student {
  id: string
  grade: number
  classNo: number
  number: number
  name: string
  examId: string
  absent: boolean
  absentNote?: string
}

export interface AnswerMark {
  choices: number[]
  incomplete?: boolean
}

export type FormType = 'odd' | 'even' | null

export interface OmrCard {
  id: string
  studentId: string
  handwrittenName: string
  handwrittenGrade: number
  handwrittenClass: number
  handwrittenNumber: number
  markedGrade: number | null
  markedClass: number | null
  /** 번호 — 자릿수 마킹 (null = 미표기) */
  markedNumber: number | null
  subjectCode: number | null
  formType: FormType
  answers: AnswerMark[]
  proctorSigned: boolean
  hasCorrectionTape: boolean
  correctionTapeBad: boolean
  wrongPen: boolean
  damaged: boolean
  damageKind?: 'fold' | 'stain' | 'tear'
  injectedErrors: ErrorType[]
  /** 뒷면이 위를 봄 */
  faceDown: boolean
  /** 위아래 180° 뒤집힘 (앞면이어도 글자가 거꾸로) */
  upsideDown: boolean
}

export interface GameConfig {
  seed: number
  difficulty: DifficultyId
  studentCount: number
  questionCount: number
  grade: number
  classNo: number
  subjectCode: number
  errorCardCount: number
  flippedBackCount: number
  upsideDownCount: number
  absentCount: number
  timeLimitSec: number | null
}

export interface GameData {
  config: GameConfig
  roster: Student[]
  /** 응시자 카드만 (결시 제외) */
  cards: OmrCard[]
}

export type Stage =
  | 'hub'
  | 'difficulty'
  | 'howto'
  | 'headcount'
  | 'sorting'
  | 'inspection'
  | 'results'

export interface HeadcountInput {
  present: number
  absent: number
  enrolled: number
}

export interface SortResult {
  orderCorrect: boolean
  orientationCorrect: boolean
  playerOrder: string[]
  expectedOrder: string[]
  badOrientation: string[]
}

export interface InspectionJudgment {
  cardId: string
  selected: ErrorType[]
  disposition: Disposition
}

export interface CardScore {
  cardId: string
  expected: ErrorType[]
  selected: ErrorType[]
  expectedDisposition: Disposition
  disposition: Disposition
  hit: ErrorType[]
  missed: ErrorType[]
  falsePositive: ErrorType[]
  dispositionOk: boolean
  perfect: boolean
}

export interface GameScore {
  headcountOk: boolean
  headcountPoints: number
  sortOrderOk: boolean
  sortOrientationOk: boolean
  sortPoints: number
  inspection: CardScore[]
  inspectionPoints: number
  timeSeconds: number
  timeBonus: number
  total: number
  maxTotal: number
  timedOut: boolean
}
