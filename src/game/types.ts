/** 오류 유형 — 검사 단계에서 플레이어가 고르는 라벨 */
export type ErrorType =
  | 'wrong_number'
  | 'wrong_grade_class'
  | 'name_mismatch'
  | 'double_mark'
  | 'missing_mark'
  | 'faint_mark'
  | 'missing_subject'
  | 'ok'

export const ERROR_LABELS: Record<ErrorType, string> = {
  wrong_number: '번호 마킹 오류',
  wrong_grade_class: '학년·반 마킹 오류',
  name_mismatch: '성명 불일치',
  double_mark: '답안 이중 마킹',
  missing_mark: '답안 미마킹',
  faint_mark: '흐린·불완전 마킹',
  missing_subject: '과목코드 누락',
  ok: '정상 (오류 없음)',
}

export const ERROR_HINTS: Record<ErrorType, string> = {
  wrong_number: '수기·명렬표의 번호와 마킹된 번호가 다릅니다.',
  wrong_grade_class: '학년 또는 반 마킹이 명렬표와 다릅니다.',
  name_mismatch: 'OMR에 적힌 성명이 명렬표와 다릅니다.',
  double_mark: '같은 문항에 두 개 이상의 선택이 칠해져 있습니다.',
  missing_mark: '답해야 할 문항에 마킹이 없습니다.',
  faint_mark: '마킹이 너무 흐리거나 불완전해 인식이 어렵습니다.',
  missing_subject: '과목코드가 비어 있거나 마킹되지 않았습니다.',
  ok: '수기·마킹·명렬표가 모두 일치합니다.',
}

export const JUDGABLE_ERRORS: ErrorType[] = [
  'wrong_number',
  'wrong_grade_class',
  'name_mismatch',
  'double_mark',
  'missing_mark',
  'faint_mark',
  'missing_subject',
  'ok',
]

export interface Student {
  id: string
  grade: number
  classNo: number
  number: number
  name: string
  examId: string
}

export interface AnswerMark {
  /** 빈 배열 = 미마킹, 길이 1 = 정상/흐림, 길이 2+ = 이중마킹 */
  choices: number[]
  faint?: boolean
}

export interface OmrCard {
  id: string
  studentId: string
  handwrittenName: string
  handwrittenGrade: number
  handwrittenClass: number
  handwrittenNumber: number
  markedGrade: number | null
  markedClass: number | null
  markedNumber: number | null
  subjectCode: number | null
  answers: AnswerMark[]
  injectedErrors: ErrorType[]
  faceDown: boolean
}

export interface GameConfig {
  seed: number
  studentCount: number
  questionCount: number
  grade: number
  classNo: number
  subjectCode: number
  errorCardCount: number
  flippedCount: number
}

export interface GameData {
  config: GameConfig
  roster: Student[]
  cards: OmrCard[]
}

export type Stage = 'title' | 'howto' | 'sorting' | 'inspection' | 'results'

export interface SortResult {
  orderCorrect: boolean
  flipsCorrect: boolean
  playerOrder: string[]
  expectedOrder: string[]
  stillFaceDown: string[]
}

export interface InspectionJudgment {
  cardId: string
  selected: ErrorType[]
}

export interface CardScore {
  cardId: string
  expected: ErrorType[]
  selected: ErrorType[]
  hit: ErrorType[]
  missed: ErrorType[]
  falsePositive: ErrorType[]
  perfect: boolean
}

export interface GameScore {
  sortOrderOk: boolean
  sortFlipOk: boolean
  sortPoints: number
  inspection: CardScore[]
  inspectionPoints: number
  timeSeconds: number
  timeBonus: number
  total: number
  maxTotal: number
}
