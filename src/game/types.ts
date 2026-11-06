/** 관찰된 이상(오류) 유형 — 마킹을 고치는 게 아니라 «발견»만 한다 */
export type ErrorType =
  | 'id_mark' // 학년·반·번호 마킹 오류
  | 'name_mismatch'
  | 'duplicate_mark' // 중복 표기
  | 'missing_mark'
  | 'incomplete_mark' // 불완전 표기(흐림·한 줄·부분)
  | 'missing_subject' // 과목코드 누락
  | 'subject_name_mismatch' // 수기 과목명 불일치
  | 'missing_proctor' // 감독관 확인란
  | 'correction_tape' // 수정테이프 (우리 학교 규정 기준)
  | 'wrong_pen'
  | 'damaged' // 접힘·얼룩·찢김
  | 'absent_mismatch' // 결시 표기·사유가 명렬과 다름
  | 'ok'

export const ERROR_LABELS: Record<ErrorType, string> = {
  id_mark: '학년·반·번호 마킹 오류',
  name_mismatch: '성명 불일치',
  duplicate_mark: '중복 표기',
  missing_mark: '답안 미표기',
  incomplete_mark: '불완전 표기',
  missing_subject: '과목코드 누락',
  subject_name_mismatch: '과목명 불일치',
  missing_proctor: '감독관 확인란 누락',
  correction_tape: '수정테이프 이상 (우리 학교 규정)',
  wrong_pen: '컴퓨터용 사인펜 아님',
  damaged: '접힘·얼룩·찢김',
  absent_mismatch: '결시 표기·사유 불일치',
  ok: '이상 없음',
}

export const ERROR_HINTS: Record<ErrorType, string> = {
  id_mark: '수기·명렬의 학년·반·번호와 자릿수 마킹이 다릅니다.',
  name_mismatch: 'OMR 수기 성명이 명렬표와 다릅니다.',
  duplicate_mark: '같은 문항에 두 개 이상 칠해져 있습니다.',
  missing_mark: '답해야 할 문항이 비어 있습니다.',
  incomplete_mark: '흐리거나 한 줄(ㅡ)·부분만 그어 인식이 어렵습니다. (인식 가능하면 이상 없음)',
  missing_subject: '과목코드가 비어 있거나 시험 과목과 다릅니다.',
  subject_name_mismatch: '수기 과목명이 이번 시험 과목명과 다릅니다.',
  missing_proctor: '감독관 확인란에 서명·도장이 없습니다.',
  correction_tape: '수정테이프가 들뜨거나 위에 다시 칠해져 있습니다. ※ 처리는 우리 학교 규정 기준.',
  wrong_pen: '컴퓨터용 수성 사인펜이 아닌 필기구 흔적입니다.',
  damaged: '카드가 접히거나 얼룩·찢김이 있습니다.',
  absent_mismatch: '빈 답안지의 결시 표기·사유가 명렬과 다릅니다.',
  ok: '수기·마킹·명렬이 일치하고 물리적 이상도 없습니다.',
}

export const JUDGABLE_ERRORS: ErrorType[] = [
  'id_mark',
  'name_mismatch',
  'duplicate_mark',
  'missing_mark',
  'incomplete_mark',
  'missing_subject',
  'subject_name_mismatch',
  'missing_proctor',
  'correction_tape',
  'wrong_pen',
  'damaged',
  'absent_mismatch',
  'ok',
]

/** 신원·시험 정보 오류 — 학생 호출하여 기재 사항 확인 대상 */
export const IDENTITY_ERRORS: ErrorType[] = [
  'id_mark',
  'name_mismatch',
  'missing_subject',
  'subject_name_mismatch',
]

/** 답안 마킹 오류 — 학생 호출 없이 오답 처리 */
export const ANSWER_ERRORS: ErrorType[] = ['duplicate_mark', 'missing_mark', 'incomplete_mark']

/** 교과 확인·판독 보류 쪽 */
export const SUBJECT_REVIEW_ERRORS: ErrorType[] = [
  'correction_tape',
  'damaged',
  'missing_proctor',
  'wrong_pen',
  'absent_mismatch',
]

/**
 * 조치 — 교사가 답안을 대신 고치지 않음.
 * 학생 호출은 기재 사항(학번·이름·과목)만. 답안 마킹은 호출 없이 오답 처리.
 */
export type Disposition = 'ok' | 'call_identity' | 'score_wrong' | 'to_subject'

export const DISPOSITION_LABELS: Record<Disposition, string> = {
  ok: '정상',
  call_identity: '학생 호출하여 기재 사항 확인',
  score_wrong: '채점 반영(오답)',
  to_subject: '교과 확인·판독 보류',
}

export const DISPOSITION_HINTS: Record<Disposition, string> = {
  ok: '이상 없음. 성적 처리로 넘깁니다.',
  call_identity: '학번·이름·과목명(수기)·과목코드만. 답안 마킹을 학생에게 고치게 하지 않습니다.',
  score_wrong: '학생 호출 없이 오답 처리. 교사가 답안을 고치지 않습니다.',
  to_subject: '교과 교사가 기재 오류·답안 인식을 확인하고, 필요하면 학교 성적처리 절차로 넘깁니다.',
}

/** 검사 시점 */
export type InspectionMode = 'immediate' | 'subject_review'

export const INSPECTION_MODE_LABELS: Record<InspectionMode, string> = {
  immediate: '시험 직후',
  subject_review: '교과 확인',
}

export const INSPECTION_MODE_HINTS: Record<InspectionMode, string> = {
  immediate:
    '시험 종료 후 10분 이내, 답안지 회수·검사 구역에서. 인적사항 기재·마킹을 먼저 확인합니다. 답안 마킹은 수정시키지 않습니다. 오답으로 판정한 답안은 학생을 부르지 않고 그대로 채점합니다. (학생 호출 종료 이후에도 기재 오류만 호출)',
  subject_review:
    '시간 제한 없음. 교과 교사가 기재 오류 여부와 답안 인식을 확인하고, 필요하면 학교 성적처리 절차로 넘깁니다.',
}

export type DifficultyId = 'easy' | 'normal' | 'hard' | 'multi'

export interface ClassSpec {
  grade: number
  classNo: number
  studentCount: number
}

export interface Difficulty {
  id: DifficultyId
  label: string
  /** 단일 반일 때 사용. multi면 classes 사용 */
  studentCount: number
  questionCount: number
  errorCardCount: number
  flippedBackCount: number
  upsideDownCount: number
  absentCount: number
  /** 시험 직후 모드 시간(초). 교과 확인 모드는 null로 덮음. 최대 600 */
  immediateLimitSec: number
  multiClass: boolean
  classes?: ClassSpec[]
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
    immediateLimitSec: 300,
    multiClass: false,
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
    immediateLimitSec: 480,
    multiClass: false,
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
    immediateLimitSec: 600,
    multiClass: false,
  },
  multi: {
    id: 'multi',
    label: '여러 반',
    studentCount: 18,
    questionCount: 20,
    errorCardCount: 8,
    flippedBackCount: 4,
    upsideDownCount: 3,
    absentCount: 3,
    immediateLimitSec: 600,
    multiClass: true,
    classes: [
      { grade: 2, classNo: 3, studentCount: 9 },
      { grade: 2, classNo: 4, studentCount: 9 },
    ],
  },
}

export interface SubjectInfo {
  code: number
  name: string
}

export const SUBJECT_CATALOG: SubjectInfo[] = [
  { code: 11, name: '국어' },
  { code: 17, name: '수학' },
  { code: 21, name: '영어' },
  { code: 31, name: '한국사' },
  { code: 41, name: '사회탐구' },
  { code: 51, name: '과학탐구' },
]

/** 불완전·시각 스타일. messy_ok는 오류가 아님(인식 가능). */
export type MarkStyle = 'normal' | 'faint' | 'line' | 'partial' | 'messy_ok'

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
  style?: MarkStyle
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
  /** 카드에 인쇄·설정되는 정답 과목명(대조용). 수기란은 handwrittenSubject */
  subjectName: string
  /** 학생이 수기로 쓴 과목명 */
  handwrittenSubject: string
  answers: AnswerMark[]
  proctorSigned: boolean
  hasCorrectionTape: boolean
  correctionTapeBad: boolean
  /** 수정테이프가 덮인 문항(0-based). 확대 시에도 카드 좌표에 고정 */
  correctionTapeQi: number | null
  wrongPen: boolean
  damaged: boolean
  damageKind?: 'fold' | 'stain' | 'tear'
  injectedErrors: ErrorType[]
  faceDown: boolean
  upsideDown: boolean
  /** 결시생 빈 답안지 */
  isAbsentBlank: boolean
  /** 카드에 표기된 결시 여부 */
  absentMarked: boolean
  /** 카드에 표기된 결시 사유 */
  absentReasonOnCard: string | null
}

export interface GameConfig {
  seed: number
  difficulty: DifficultyId
  studentCount: number
  questionCount: number
  grade: number
  classNo: number
  subjectCode: number
  subjectName: string
  errorCardCount: number
  flippedBackCount: number
  upsideDownCount: number
  absentCount: number
  timeLimitSec: number | null
  inspectionMode: InspectionMode
  multiClass: boolean
  classes: ClassSpec[]
}

export interface GameData {
  config: GameConfig
  roster: Student[]
  /** 응시 카드 + 결시 빈 답안지 */
  cards: OmrCard[]
}

export type Stage =
  | 'hub'
  | 'difficulty'
  | 'mode'
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
  inspectionMode: InspectionMode
}
