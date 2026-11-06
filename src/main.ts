import './style.css'
import {
  expectedDisposition,
  expectedOrder,
  generateGame,
  headcountTruth,
  parseDifficultyFromUrl,
  parseModeFromUrl,
  parseSeedFromUrl,
  studentForCard,
} from './game/generator'
import { computeScore, scoreInspection, scoreSort } from './game/scoring'
import { renderDeskThumb, renderOmrFront, renderRosterSheet } from './game/omrRender'
import { loadBest, saveBest } from './game/storage'
import {
  DIFFICULTIES,
  DISPOSITION_HINTS,
  DISPOSITION_LABELS,
  ERROR_HINTS,
  ERROR_LABELS,
  INSPECTION_MODE_HINTS,
  INSPECTION_MODE_LABELS,
  JUDGABLE_ERRORS,
  type DifficultyId,
  type Disposition,
  type ErrorType,
  type GameData,
  type GameScore,
  type InspectionJudgment,
  type InspectionMode,
  type OmrCard,
  type SortResult,
  type Stage,
} from './game/types'

const app = document.querySelector<HTMLDivElement>('#app')!

let stage: Stage = 'hub'
let _difficulty: DifficultyId = parseDifficultyFromUrl() ?? 'easy'
let _inspectionMode: InspectionMode = parseModeFromUrl() ?? 'subject_review'
let data: GameData | null = null
let cardsById = new Map<string, OmrCard>()
/** unsorted pile (messy) */
let pile: string[] = []
/** sorted tray order */
let tray: string[] = []
let selectedPileId: string | null = null
let judgments = new Map<string, { selected: ErrorType[]; disposition: Disposition }>()

declare global {
  interface Window {
    __TS_E2E__?: {
      stage: Stage
      seed: number
      difficulty: DifficultyId
      inspectionMode: InspectionMode
      expectedOrder: string[]
      cards: Array<{ id: string; injectedErrors: ErrorType[]; disposition: Disposition; isAbsentBlank: boolean }>
      headcount: { enrolled: number; present: number; absent: number }
      subject: { code: number; name: string }
      finalScore: GameScore | null
    }
  }
}

function syncE2e() {
  if (!data) {
    window.__TS_E2E__ = undefined
    return
  }
  window.__TS_E2E__ = {
    stage,
    seed: data.config.seed,
    difficulty: data.config.difficulty,
    inspectionMode: data.config.inspectionMode,
    expectedOrder: expectedOrder(data.roster, data.cards),
    cards: data.cards.map((c) => ({
      id: c.id,
      injectedErrors: [...c.injectedErrors],
      disposition: expectedDisposition(c, data!.config.inspectionMode),
      isAbsentBlank: c.isAbsentBlank,
    })),
    headcount: headcountTruth(data.roster),
    subject: { code: data.config.subjectCode, name: data.config.subjectName },
    finalScore,
  }
}

let inspectIndex = 0
let startedAt = 0
let headcountOk = false
let sortResult: SortResult | null = null
let finalScore: GameScore | null = null
let timedOut = false
let zoom = 1
let panX = 0
let panY = 0
let timerId: number | null = null

function clearTimer() {
  if (timerId != null) {
    clearInterval(timerId)
    timerId = null
  }
}

function elapsed(): number {
  if (!startedAt) return 0
  return Math.floor((Date.now() - startedAt) / 1000)
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

function startClock() {
  clearTimer()
  timerId = window.setInterval(() => {
    const el = app.querySelector('#timer')
    if (el) el.textContent = fmtTime(elapsed())
    const lim = data?.config.timeLimitSec
    if (lim != null && elapsed() >= lim && stage !== 'results') {
      timedOut = true
      finishGame()
    }
  }, 500)
}

function bootHub() {
  clearTimer()
  stage = 'hub'
  data = null
  render()
}

function resetRunState(seed?: number) {
  data = generateGame(_difficulty, seed ?? parseSeedFromUrl(), _inspectionMode)
  cardsById = new Map(data.cards.map((c) => [c.id, c]))
  pile = data.cards.map((c) => c.id)
  tray = []
  selectedPileId = null
  judgments = new Map()
  inspectIndex = 0
  startedAt = 0
  headcountOk = false
  sortResult = null
  finalScore = null
  timedOut = false
  zoom = 1
  panX = 0
  panY = 0
  history.replaceState(
    null,
    '',
    `?diff=${_difficulty}&mode=${_inspectionMode}&seed=${data.config.seed}`,
  )
}

function startRun(diff: DifficultyId, seed?: number) {
  _difficulty = diff
  // seed reserved for retry; mode screen comes next unless URL already chose mode for e2e
  const urlMode = parseModeFromUrl()
  if (urlMode) {
    _inspectionMode = urlMode
    resetRunState(seed)
    stage = 'howto'
  } else {
    // stash seed via generate later
    ;(window as unknown as { __TS_SEED__?: number }).__TS_SEED__ = seed
    stage = 'mode'
  }
  render()
}

function confirmMode(mode: InspectionMode) {
  _inspectionMode = mode
  const seed = (window as unknown as { __TS_SEED__?: number }).__TS_SEED__
  ;(window as unknown as { __TS_SEED__?: number }).__TS_SEED__ = undefined
  resetRunState(seed)
  stage = 'howto'
  render()
}

function go(next: Stage) {
  stage = next
  if ((next === 'headcount' || next === 'sorting') && !startedAt) {
    startedAt = Date.now()
    startClock()
  }
  render()
}

function render() {
  switch (stage) {
    case 'hub':
      renderHub()
      break
    case 'difficulty':
      renderDifficulty()
      break
    case 'mode':
      renderMode()
      break
    case 'howto':
      renderHowto()
      break
    case 'headcount':
      renderHeadcount()
      break
    case 'sorting':
      renderSorting()
      break
    case 'inspection':
      renderInspection()
      break
    case 'results':
      renderResults()
      break
  }
  syncE2e()
}

function shell(body: string, opts?: { top?: string; desk?: boolean; stageClass?: string }) {
  app.innerHTML = `
<div class="app-root ${opts?.desk ? 'has-desk' : ''} ${opts?.stageClass ?? ''}">
  ${opts?.desk ? '<div class="desk-bg" aria-hidden="true"></div>' : '<div class="hub-bg" aria-hidden="true"></div>'}
  <header class="topbar">
    <button type="button" class="brand-btn" id="btn-hub" title="허브로">
      <span class="logo">✎</span>
      <div><strong>교사 시뮬레이터</strong><small>잡무 연습 모음</small></div>
    </button>
    ${opts?.top ?? ''}
  </header>
  <main class="stage">${body}</main>
</div>`
  app.querySelector('#btn-hub')?.addEventListener('click', () => {
    if (stage === 'hub' || confirm('허브로 돌아갈까요? 진행 중이면 저장되지 않습니다.')) bootHub()
  })
}

function renderHub() {
  const best = loadBest()
  const played = [best.easy, best.normal, best.hard, best.multi].filter(Boolean).length
  shell(
    `
<section class="panel hub-panel" data-stage="hub">
  <div class="hub-banner" aria-hidden="true">
    <svg viewBox="0 0 960 280" class="hub-scene" role="img">
      <defs>
        <linearGradient id="win" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fef3c7"/><stop offset="100%" stop-color="#fdba74"/>
        </linearGradient>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f8efe3"/><stop offset="100%" stop-color="#e7d5c0"/>
        </linearGradient>
        <linearGradient id="desk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#5a3424"/><stop offset="50%" stop-color="#7a4a32"/><stop offset="100%" stop-color="#4a2a1c"/>
        </linearGradient>
      </defs>
      <rect width="960" height="280" fill="url(#wall)"/>
      <rect x="0" y="200" width="960" height="80" fill="#d6c0a8"/>
      <rect x="36" y="22" width="170" height="100" rx="4" fill="url(#win)" stroke="#b45309" stroke-width="4"/>
      <line x1="121" y1="22" x2="121" y2="122" stroke="#b45309" stroke-width="3"/>
      <line x1="36" y1="72" x2="206" y2="72" stroke="#b45309" stroke-width="3"/>
      <rect x="230" y="40" width="110" height="100" fill="#0f766e"/>
      <ellipse cx="300" cy="230" rx="18" ry="10" fill="#166534"/>
      <rect x="294" y="200" width="12" height="30" fill="#365314"/>
      <circle cx="300" cy="192" r="22" fill="#22c55e"/>
      <circle cx="285" cy="200" r="14" fill="#4ade80"/>
      <circle cx="316" cy="198" r="12" fill="#86efac"/>
      <rect x="245" y="52" width="80" height="10" fill="#99f6e4"/>
      <rect x="245" y="70" width="62" height="8" fill="#ccfbf1"/>
      <rect x="245" y="88" width="50" height="8" fill="#99f6e4"/>
      <rect x="320" y="150" width="600" height="90" fill="url(#desk)"/>
      <rect x="360" y="118" width="86" height="54" fill="#fffef8" stroke="#c23b55" stroke-width="2" transform="rotate(-8 403 145)"/>
      <rect x="460" y="128" width="86" height="54" fill="#fffef8" stroke="#c23b55" stroke-width="2" transform="rotate(5 503 155)"/>
      <rect x="560" y="124" width="86" height="54" fill="#be123c" transform="rotate(-3 603 151)"/>
      <text x="578" y="158" font-size="14" fill="#fff" font-weight="700">답안</text>
      <rect x="680" y="136" width="56" height="38" fill="#faf6ef" stroke="#78716c" stroke-width="1.5"/>
      <circle cx="840" cy="90" r="30" fill="#fef3c7" stroke="#ca8a04" stroke-width="3"/>
      <text x="826" y="100" font-size="26">☕</text>
      <text x="40" y="250" font-size="16" fill="#44403c">교무실 책상 · 창가 햇살 · 잡무는 여기서 연습</text>
    </svg>
  </div>
  <div class="hub-hero">
    <p class="eyebrow">Teacher Simulator</p>
    <h1>교사의 잡무,<br/>미니게임으로 손에 익히기</h1>
    <p class="lead">예비교사·실습생·학생을 위한 현장 잡무 연습. 서류는 진짜처럼, 실수는 여기서.</p>
    <div class="hub-summary">
      <span>클리어한 난이도 <b>${played}/3</b></span>
      <span>OMR 최고 <b>${Math.max(best.easy?.score ?? 0, best.normal?.score ?? 0, best.hard?.score ?? 0) || '—'}</b></span>
    </div>
    <div class="hub-progress" aria-label="난이도별 진행">
      <span class="hp-chip ${best.easy ? 'done' : ''}">쉬움 ${best.easy ? best.easy.score + '점' : '미클리어'}</span>
      <span class="hp-chip ${best.normal ? 'done' : ''}">보통 ${best.normal ? best.normal.score + '점' : '미클리어'}</span>
      <span class="hp-chip ${best.hard ? 'done' : ''}">어려움 ${best.hard ? best.hard.score + '점' : '미클리어'}</span>
      <span class="hp-chip ${best.multi ? 'done' : ''}">여러 반 ${best.multi ? best.multi.score + '점' : '미클리어'}</span>
    </div>
  </div>
  <div class="game-grid">
    <button type="button" class="game-tile open" id="tile-omr">
      <span class="tile-icon" aria-hidden="true"><svg class="tile-svg" viewBox="0 0 32 32" fill="none"><rect x="4" y="3" width="24" height="26" rx="2" stroke="currentColor" stroke-width="2"/><circle cx="10" cy="10" r="2" fill="currentColor"/><circle cx="16" cy="10" r="2" fill="currentColor"/><circle cx="22" cy="10" r="2" fill="currentColor"/><circle cx="10" cy="16" r="2" fill="currentColor"/><circle cx="16" cy="16" r="2" fill="currentColor"/><rect x="8" y="22" width="16" height="2" fill="currentColor"/></svg></span>
      <span class="tile-badge">플레이 가능</span>
      <h2>OMR 카드 검사</h2>
      <p>인원 확인 → 정렬·뒤집기 → 이상 발견 · 시험 직후/교과 확인</p>
      <ul class="best-line">
        <li>쉬움 ${best.easy?.score ?? '—'}점</li>
        <li>보통 ${best.normal?.score ?? '—'}점</li>
        <li>어려움 ${best.hard?.score ?? '—'}점</li>
        <li>여러 반 ${best.multi?.score ?? '—'}점</li>
      </ul>
    </button>
    <div class="game-tile locked"><span class="tile-icon" aria-hidden="true"><svg class="tile-svg" viewBox="0 0 32 32" fill="none"><rect x="6" y="4" width="20" height="24" rx="2" stroke="currentColor" stroke-width="2"/><path d="M10 12h12M10 17h12M10 22h8" stroke="currentColor" stroke-width="2"/></svg></span><span class="lock">잠김</span><h2>출결 정리</h2><p>전자·종이 출석부 대조</p></div>
    <div class="game-tile locked"><span class="tile-icon" aria-hidden="true"><svg class="tile-svg" viewBox="0 0 32 32" fill="none"><path d="M8 26V8l8-3 8 3v18l-8-3-8 3z" stroke="currentColor" stroke-width="2"/><path d="M12 14h8M12 18h6" stroke="currentColor" stroke-width="2"/></svg></span><span class="lock">잠김</span><h2>생기부 검토</h2><p>금지 표현·맞춤법</p></div>
    <div class="game-tile locked"><span class="tile-icon" aria-hidden="true"><svg class="tile-svg" viewBox="0 0 32 32" fill="none"><rect x="4" y="8" width="24" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M4 10l12 8 12-8" stroke="currentColor" stroke-width="2"/></svg></span><span class="lock">잠김</span><h2>가정통신문 교정</h2><p>날짜·금액·오탈자</p></div>
  </div>
  <footer class="hub-foot">
    <p>데모 미니게임 1종 · 나머지 타일은 로드맵 · 시드 고정 연습 가능 (?diff=&amp;seed=)</p>
  </footer>
</section>`,
    { stageClass: 'stage-hub' },
  )
  app.querySelector('#tile-omr')!.addEventListener('click', () => {
    stage = 'difficulty'
    render()
  })
}

function renderDifficulty() {
  const best = loadBest()
  const cards = (Object.keys(DIFFICULTIES) as DifficultyId[])
    .map((id) => {
      const d = DIFFICULTIES[id]
      const lim = `시험 직후 최대 ${Math.floor(d.immediateLimitSec / 60)}분`
      const ico = id === 'easy' ? '🌱' : id === 'normal' ? '📘' : id === 'hard' ? '🔥' : '🏫'
      const bestScore = best[id]?.score
      const clsNote = d.multiClass
        ? d.classes!.map((c) => `${c.grade}-${c.classNo}반 ${c.studentCount}명`).join(' · ')
        : '단일 반'
      return `
<button type="button" class="diff-card" data-diff="${id}">
  <span class="diff-ico" aria-hidden="true">${ico}</span>
  <h2>${d.label}</h2>
  <ul class="diff-meta">
    <li><b>${d.studentCount}</b>명</li>
    <li>문항 ${d.questionCount}</li>
    <li>결시 ${d.absentCount}</li>
  </ul>
  <p class="diff-lim">${lim}</p>
  <p class="diff-lim">${clsNote}</p>
  <p class="diff-best ${bestScore != null ? 'has' : ''}">최고 ${bestScore ?? '—'}점</p>
</button>`
    })
    .join('')
  shell(
    `
<section class="panel" data-stage="difficulty">
  <h1>OMR 카드 검사 · 난이도</h1>
  <p class="lead">재적·반 구성에 따라 책상 위 카드 더미가 달라집니다. 다음 화면에서 검사 시점을 고릅니다.</p>
  <div class="diff-grid">${cards}</div>
  <div class="actions"><button class="btn ghost" id="btn-back" type="button">허브</button></div>
</section>`,
  )
  app.querySelector('#btn-back')!.addEventListener('click', bootHub)
  app.querySelectorAll<HTMLButtonElement>('[data-diff]').forEach((b) => {
    b.addEventListener('click', () => startRun(b.dataset.diff as DifficultyId))
  })
}

function renderMode() {
  const d = DIFFICULTIES[_difficulty]
  shell(
    `
<section class="panel" data-stage="mode">
  <h1>검사 시점 · ${d.label}</h1>
  <p class="lead">시험 직후는 짧은 시간 안에 회수·검사합니다. 교과 확인은 시간 제한이 없습니다.</p>
  <div class="mode-grid">
    <button type="button" class="mode-card" data-mode="immediate">
      <h2>${INSPECTION_MODE_LABELS.immediate}</h2>
      <p class="mode-lim">최대 ${Math.floor(d.immediateLimitSec / 60)}분 (10분 이내)</p>
      <p>${INSPECTION_MODE_HINTS.immediate}</p>
    </button>
    <button type="button" class="mode-card" data-mode="subject_review">
      <h2>${INSPECTION_MODE_LABELS.subject_review}</h2>
      <p class="mode-lim">시간 제한 없음</p>
      <p>${INSPECTION_MODE_HINTS.subject_review}</p>
    </button>
  </div>
  <div class="actions"><button class="btn ghost" id="btn-back" type="button">난이도</button></div>
</section>`,
  )
  app.querySelector('#btn-back')!.addEventListener('click', () => {
    stage = 'difficulty'
    render()
  })
  app.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach((b) => {
    b.addEventListener('click', () => confirmMode(b.dataset.mode as InspectionMode))
  })
}

function renderHowto() {
  const d = data!
  const mode = d.config.inspectionMode
  const lim =
    d.config.timeLimitSec != null
      ? `시험 직후 · ${Math.floor(d.config.timeLimitSec / 60)}분 제한`
      : '교과 확인 · 시간 제한 없음'
  shell(
    `
<section class="panel howto-panel" data-stage="howto">
  <h1>하는 방법 · ${DIFFICULTIES[d.config.difficulty].label}</h1>
  <p class="lead">${INSPECTION_MODE_LABELS[mode]} · ${lim} · 과목 <b>${d.config.subjectName}(${String(d.config.subjectCode).padStart(2,'0')})</b></p>
  <ol class="howto-steps">
    <li><span class="howto-ico" aria-hidden="true">①</span><div><b>응시 인원 확인</b><p>응시자 + 결시자 = 재적. 결시생은 빈 답안지를 꺼내 결시·사유를 명렬과 대조합니다.</p></div></li>
    <li><span class="howto-ico" aria-hidden="true">②</span><div><b>정렬·방향</b><p>${d.config.multiClass ? '반별로 묶고 각 반 안에서는 번호(가나다)순' : '번호순'}으로 트레이에 올립니다. 뒷면·위아래(180°)를 바로잡습니다. F/R/Enter.</p></div></li>
    <li><span class="howto-ico" aria-hidden="true">③</span><div><b>이상 발견</b><p>${INSPECTION_MODE_HINTS[mode]} 카드의 문제 부위를 클릭하면 이상이 선택됩니다. 교사가 답안을 고치지 않습니다.</p></div></li>
    <li><span class="howto-ico" aria-hidden="true">④</span><div><b>조치</b><p>기재 오류(학번·이름·과목)만 «학생 호출하여 기재 사항 확인». 답안 마킹 이상은 «학생 호출 없이 오답 처리». 판독이 어려우면 교과 확인.</p></div></li>
  </ol>
  <aside class="field-rules" aria-label="현장 규칙">
    <b>현장 규칙 요약</b>
    <ul>
      <li><strong>인원</strong> 응시 + 결시 = 재적 · 결시 빈 답안지</li>
      <li><strong>조치</strong> 정상 · 기재 확인 호출 · 오답 처리 · 교과 확인</li>
      <li><strong>마킹</strong> 교사가 대신 고치지 않음 · 답안 수정 호출 없음</li>
    </ul>
  </aside>
  <p class="howto-seed">시드 <b>${d.config.seed}</b> · 재적 <b>${d.config.studentCount}</b> · 카드 <b>${d.cards.length}</b>${d.config.multiClass ? ' · 여러 반' : ''}</p>
  <div class="actions">
    <button class="btn primary" id="btn-go" type="button">인원 확인 시작</button>
    <button class="btn ghost" id="btn-back" type="button">검사 시점</button>
  </div>
</section>`,
  )
  app.querySelector('#btn-go')!.addEventListener('click', () => go('headcount'))
  app.querySelector('#btn-back')!.addEventListener('click', () => {
    stage = 'mode'
    render()
  })
}

function renderHeadcount() {
  const d = data!
  const truth = headcountTruth(d.roster)
  const top = `<div class="progress"><span class="pill">인원 확인</span><span class="timer" id="timer">${fmtTime(elapsed())}</span></div>`
  shell(
    `
<section class="panel headcount-panel" data-stage="headcount">
  <h1>응시 인원 확인</h1>
  <p class="lead">명렬표를 보고 <b>응시자 + 결시자 = 재적</b>인지 확인하세요. 결시생은 <b>빈 답안지</b>를 꺼내 결시·사유를 대조합니다.</p>
  <div class="hc-layout">
    ${renderRosterSheet(d.roster, d.config.grade, d.config.classNo, { multiClass: d.config.multiClass, subjectLabel: `${d.config.subjectName}(${String(d.config.subjectCode).padStart(2,'0')})` })}
    <form id="hc-form" class="hc-form">
      <label>재적 <input name="enrolled" type="number" min="0" required /></label>
      <label>응시자 <input name="present" type="number" min="0" required /></label>
      <label>결시자 <input name="absent" type="number" min="0" required /></label>
      <p class="hc-formula" aria-hidden="true">응시 + 결시 = 재적</p>
      <p class="side-note hc-hint">힌트: 명렬 «결시» 행을 세요. (정답은 제출 후)</p>
      <button class="btn primary" type="submit">확인 · 정렬로</button>
    </form>
  </div>
  <div class="toast" id="toast" hidden></div>
</section>`,
    { top, desk: true, stageClass: 'stage-headcount' },
  )
  startClock()
  app.querySelector('#hc-form')!.addEventListener('submit', (e) => {
    e.preventDefault()
    const fd = new FormData(e.target as HTMLFormElement)
    const enrolled = Number(fd.get('enrolled'))
    const present = Number(fd.get('present'))
    const absent = Number(fd.get('absent'))
    const sumOk = present + absent === enrolled
    const match =
      enrolled === truth.enrolled && present === truth.present && absent === truth.absent && sumOk
    headcountOk = match
    if (!match) {
      showToast(
        sumOk
          ? `숫자가 명렬과 다릅니다. (정답 재적 ${truth.enrolled} · 응시 ${truth.present} · 결시 ${truth.absent})`
          : '응시자 + 결시자 = 재적이 되지 않습니다.',
      )
      // still allow proceed after seeing feedback? Field realism: must get right. Allow retry only.
      return
    }
    go('sorting')
  })
}

function showToast(msg: string) {
  const t = app.querySelector<HTMLDivElement>('#toast')
  if (!t) return
  t.hidden = false
  t.textContent = msg
  window.setTimeout(() => {
    t.hidden = true
  }, 3200)
}

function renderSorting() {
  const d = data!
  const present = [...d.roster].sort((a, b) => {
    if (a.grade !== b.grade) return a.grade - b.grade
    if (a.classNo !== b.classNo) return a.classNo - b.classNo
    return a.number - b.number
  })
  const expected = expectedOrder(d.roster, d.cards)
  const bad = [...pile, ...tray].filter((id) => {
    const c = cardsById.get(id)!
    return c.faceDown || c.upsideDown
  }).length
  const top = `<div class="progress"><span class="pill">정렬</span><span class="timer" id="timer">${fmtTime(elapsed())}</span><span class="hint-pill">방향 이상 ${bad}장 · 트레이 ${tray.length}/${d.cards.length}</span></div>`

  const pileHtml = pile
    .map((id, i) => {
      const card = cardsById.get(id)!
      const n = Math.max(1, pile.length)
      const t = n === 1 ? 0 : i / (n - 1) // 0..1
      const rot = -4 + t * 8 + ((i % 3) - 1) * 1.2
      const lift = (i % 5) * 4 + (card.upsideDown || card.faceDown ? 8 : 0)
      const z = (card.upsideDown || card.faceDown ? 40 : 0) + i + 1
      const chips = [
        card.faceDown ? '<span class="pile-chip back">뒷면</span>' : '',
        card.upsideDown ? '<span class="pile-chip warn">위아래</span>' : '',
      ].join('')
      return `
<div class="desk-card pile-card ${selectedPileId === id ? 'selected' : ''} ${card.upsideDown ? 'has-orient' : ''} ${card.faceDown ? 'has-back' : ''}" data-id="${id}" draggable="true"
  style="--r:${rot}deg; --lift:${lift}px; --tilt:${1 + (i % 2)}deg; z-index:${z}">
  ${chips}
  ${renderDeskThumb(card)}
</div>`
    })
    .join('')

  const trayHtml = present
    .map((stu, i) => {
      const id = tray[i]
      const expId = expected[i]
      if (!id) {
        return `
<div class="tray-slot empty-slot" data-slot="${i}" data-class="${stu.grade}-${stu.classNo}">
  <span class="slot-label">슬롯 ${i + 1} · ${stu.grade}-${stu.classNo}반 ${String(stu.number).padStart(2, '0')}${stu.absent ? ' · 결시' : ''}</span>
  <div class="slot-ghost">${stu.grade}-${stu.classNo} ${String(stu.number).padStart(2, '0')} ${stu.name}${stu.absent ? ' (결시)' : ''}</div>
</div>`
      }
      const card = cardsById.get(id)!
      const ok = id === expId && !card.faceDown && !card.upsideDown
      const orderOk = id === expId
      const cls = orderOk && !card.faceDown && !card.upsideDown ? 'slot-ok' : orderOk ? 'slot-warn' : 'slot-bad'
      return `
<div class="tray-slot ${cls}" data-slot="${i}" data-id="${id}">
  <span class="slot-label">슬롯 ${i + 1} · ${stu.grade}-${stu.classNo}반 ${String(stu.number).padStart(2, '0')}${stu.absent ? ' · 결시' : ''}
    <em>${ok ? '✓' : orderOk ? '방향!' : '순서✗'}</em>
  </span>
  <div class="desk-card tray-card tray-fan" data-id="${id}" data-tray-index="${i}" draggable="true"
    style="--fan:${((i % 5) - 2) * 1.6}deg">
    ${renderDeskThumb(card)}
  </div>
  <div class="tray-tools">
    <button type="button" class="btn tiny" data-act="left" data-i="${i}" ${i === 0 ? 'disabled' : ''}>←</button>
    <button type="button" class="btn tiny" data-act="right" data-i="${i}" ${i >= tray.length - 1 ? 'disabled' : ''}>→</button>
    <button type="button" class="btn tiny accent" data-act="flip" data-i="${i}">뒷면</button>
    <button type="button" class="btn tiny accent" data-act="spin" data-i="${i}">위아래</button>
    <button type="button" class="btn tiny" data-act="to-pile" data-i="${i}">더미로</button>
  </div>
</div>`
    })
    .join('')

  shell(
    `
<section class="sorting-desk" data-stage="sorting">
  <div class="desk-table">
    <div class="desk-window" aria-hidden="true"></div>
    <div class="desk-props" aria-hidden="true">
      <svg class="prop-pen" viewBox="0 0 120 24" width="110" height="22">
        <rect x="4" y="8" width="88" height="8" rx="2" fill="#1e293b"/>
        <polygon points="92,8 112,12 92,16" fill="#fbbf24"/>
        <rect x="0" y="7" width="10" height="10" rx="2" fill="#0f766e"/>
      </svg>
      <svg class="prop-mug" viewBox="0 0 48 48" width="44" height="44">
        <ellipse cx="20" cy="40" rx="14" ry="4" fill="rgba(0,0,0,0.25)"/>
        <rect x="8" y="12" width="24" height="26" rx="3" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
        <path d="M32 18h6a6 6 0 010 12h-6" fill="none" stroke="#b45309" stroke-width="2"/>
        <path d="M14 8c2-4 6-4 8 0M22 8c2-4 6-4 8 0" stroke="#94a3b8" stroke-width="1.5" fill="none"/>
      </svg>
      <svg class="prop-clip" viewBox="0 0 40 50" width="36" height="44">
        <rect x="6" y="10" width="28" height="36" rx="2" fill="#fffef8" stroke="#78716c"/>
        <rect x="10" y="4" width="20" height="12" rx="2" fill="#a8a29e"/>
        <line x1="12" y1="22" x2="28" y2="22" stroke="#d6d3d1"/>
        <line x1="12" y1="28" x2="28" y2="28" stroke="#d6d3d1"/>
        <line x1="12" y1="34" x2="24" y2="34" stroke="#d6d3d1"/>
      </svg>
    </div>
    <aside class="desk-roster paper-object">
      ${renderRosterSheet(d.roster, d.config.grade, d.config.classNo, { multiClass: d.config.multiClass, subjectLabel: `${d.config.subjectName}(${String(d.config.subjectCode).padStart(2,'0')})` })}
      <p class="side-note">${d.config.multiClass ? '반 → 번호(가나다)순. ' : ''}결시생은 빈 답안지를 같은 슬롯에 둡니다.</p>
      <aside class="desk-sticky" aria-hidden="true">
        <b>메모</b>
        <p>뒷면·위아래 먼저 바로잡고 트레이로.</p>
        <p class="kbd-row"><kbd>F</kbd> 뒤집기 <kbd>R</kbd> 위아래 <kbd>Enter</kbd> 트레이</p>
      </aside>
    </aside>
    <div class="desk-work ${pile.length ? 'has-pile' : 'no-pile'}">
      <div class="pile-zone ${pile.length ? '' : 'is-empty'}" id="pile-zone">
        <header class="zone-head">
          <h2>흐트러진 더미 <small class="pile-count">${pile.length}장</small></h2>
          <div class="pile-actions toolbar">
            <button type="button" class="btn tiny" id="btn-flip-sel" ${selectedPileId ? '' : 'disabled'} title="F">선택 뒤집기 <kbd>F</kbd></button>
            <button type="button" class="btn tiny" id="btn-spin-sel" ${selectedPileId ? '' : 'disabled'} title="R">위아래 <kbd>R</kbd></button>
            <button type="button" class="btn tiny primary" id="btn-to-tray" ${selectedPileId ? '' : 'disabled'} title="Enter">트레이 <kbd>⏎</kbd></button>
          </div>
        </header>
        <div class="pile-area" id="pile-area">${pileHtml || '<p class="empty">더미가 비었습니다 — 아래 트레이를 확인하세요</p>'}</div>
      </div>
      <div class="tray-zone ${pile.length ? '' : 'is-expanded'}" id="tray-zone">
        <header class="zone-head">
          <h2>정렬 트레이 <small>${d.config.multiClass ? '반→번호순' : '번호순'} · 초록=맞음 · F/R/Enter</small></h2>
          <div class="pile-actions toolbar">
            <button class="btn tiny" id="btn-autosort" type="button">${d.config.multiClass ? '반·번호순' : '수기번호순'}</button>
            <button class="btn tiny primary" id="btn-done-sort" type="button">정렬 완료 · 검사</button>
          </div>
        </header>
        <div class="tray-rail" id="tray-rail">${trayHtml}</div>
      </div>
    </div>
  </div>
  <div class="toast" id="toast" hidden></div>
</section>`,
    { top, desk: true, stageClass: 'stage-sorting' },
  )
  startClock()
  bindSorting()
}

function bindSorting() {
  app.querySelector('#btn-autosort')?.addEventListener('click', () => {
    const all = [...pile, ...tray]
    for (const id of all) {
      const c = cardsById.get(id)!
      c.faceDown = false
      c.upsideDown = false
    }
    tray = all.sort((a, b) => {
      const ca = cardsById.get(a)!
      const cb = cardsById.get(b)!
      if (ca.handwrittenGrade !== cb.handwrittenGrade) return ca.handwrittenGrade - cb.handwrittenGrade
      if (ca.handwrittenClass !== cb.handwrittenClass) return ca.handwrittenClass - cb.handwrittenClass
      return ca.handwrittenNumber - cb.handwrittenNumber
    })
    pile = []
    selectedPileId = null
    renderSorting()
  })

  app.querySelector('#btn-done-sort')?.addEventListener('click', () => {
    if (pile.length) {
      showToast('더미에 카드가 남아 있습니다.')
      return
    }
    const bad = tray.filter((id) => {
      const c = cardsById.get(id)!
      return c.faceDown || c.upsideDown
    })
    if (bad.length) {
      showToast(`방향이 잘못된 카드가 ${bad.length}장 있습니다.`)
      return
    }
    const exp = expectedOrder(data!.roster, [...cardsById.values()])
    sortResult = scoreSort(tray, exp, cardsById)
    if (!sortResult.orderCorrect) {
      if (!confirm('번호 순서가 명렬과 다릅니다. 그래도 검사로 갈까요?')) return
    }
    inspectIndex = 0
    go('inspection')
  })

  const selectPile = (id: string) => {
    selectedPileId = id
    renderSorting()
  }

  app.querySelectorAll<HTMLElement>('.pile-card').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation()
      selectPile(el.dataset.id!)
    })
    el.addEventListener('dblclick', () => moveToTray(el.dataset.id!))
    el.addEventListener('dragstart', (e: DragEvent) => {
      e.dataTransfer?.setData('text/plain', el.dataset.id!)
      selectedPileId = el.dataset.id!
      el.classList.add('dragging')
    })
    el.addEventListener('dragend', () => el.classList.remove('dragging'))
  })

  const trayZone = app.querySelector('#tray-zone')
  const trayRail = app.querySelector('#tray-rail')
  trayZone?.addEventListener('dragover', (e) => {
    e.preventDefault()
    trayRail?.classList.add('drag-over')
  })
  trayZone?.addEventListener('dragleave', () => trayRail?.classList.remove('drag-over'))
  trayZone?.addEventListener('drop', (e) => {
    e.preventDefault()
    trayRail?.classList.remove('drag-over')
    const de = e as DragEvent
    const id = de.dataTransfer?.getData('text/plain')
    if (id) moveToTray(id)
  })

  app.querySelector('#btn-to-tray')?.addEventListener('click', () => {
    if (selectedPileId) moveToTray(selectedPileId)
  })
  app.querySelector('#btn-flip-sel')?.addEventListener('click', () => {
    if (!selectedPileId) return
    const c = cardsById.get(selectedPileId)!
    c.faceDown = !c.faceDown
    renderSorting()
  })
  app.querySelector('#btn-spin-sel')?.addEventListener('click', () => {
    if (!selectedPileId) return
    const c = cardsById.get(selectedPileId)!
    c.upsideDown = !c.upsideDown
    renderSorting()
  })

  app.querySelectorAll<HTMLButtonElement>('.tray-tools [data-act]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.i)
      const act = btn.dataset.act
      const id = tray[i]
      if (!id) return
      const c = cardsById.get(id)!
      if (act === 'flip') c.faceDown = !c.faceDown
      if (act === 'spin') c.upsideDown = !c.upsideDown
      if (act === 'to-pile') {
        tray = tray.filter((x) => x !== id)
        pile.push(id)
      }
      if (act === 'left' && i > 0) {
        ;[tray[i - 1], tray[i]] = [tray[i]!, tray[i - 1]!]
      }
      if (act === 'right' && i < tray.length - 1) {
        ;[tray[i + 1], tray[i]] = [tray[i]!, tray[i + 1]!]
      }
      renderSorting()
    })
  })

  // tap card body in tray to flip back / spin with modifiers? single click flip back
  app.querySelectorAll<HTMLElement>('.tray-card .desk-thumb, .tray-card .card-3d').forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.dataset.cardId!
      const c = cardsById.get(id)!
      if (c.faceDown) c.faceDown = false
      else if (c.upsideDown) c.upsideDown = false
      else c.faceDown = true
      renderSorting()
    })
  })
}

function onGlobalSortKeys(e: KeyboardEvent) {
  if (stage !== 'sorting') return
  const tag = (e.target as HTMLElement)?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA') return
  if (e.key === 'f' || e.key === 'F') {
    if (!selectedPileId) return
    e.preventDefault()
    const c = cardsById.get(selectedPileId)!
    c.faceDown = !c.faceDown
    renderSorting()
  } else if (e.key === 'r' || e.key === 'R') {
    if (!selectedPileId) return
    e.preventDefault()
    const c = cardsById.get(selectedPileId)!
    c.upsideDown = !c.upsideDown
    renderSorting()
  } else if (e.key === 'Enter' && selectedPileId) {
    e.preventDefault()
    moveToTray(selectedPileId)
  }
}
window.addEventListener('keydown', onGlobalSortKeys)

function moveToTray(id: string) {
  if (!pile.includes(id)) return
  pile = pile.filter((x) => x !== id)
  tray.push(id)
  selectedPileId = null
  renderSorting()
}

function renderInspection() {
  const d = data!
  const order = tray.length ? tray : expectedOrder(d.roster, d.cards)
  const card = cardsById.get(order[inspectIndex]!)!
  const student = studentForCard(d.roster, card)
  const j = judgments.get(card.id) ?? { selected: [], disposition: 'ok' as Disposition }
  const selected = new Set(j.selected)
  const lim = d.config.timeLimitSec
  const timeLabel =
    lim != null ? `${fmtTime(elapsed())} / ${fmtTime(lim)}` : fmtTime(elapsed())

  const top = `<div class="progress"><span class="pill">검사 · ${INSPECTION_MODE_LABELS[d.config.inspectionMode]}</span><span class="timer" id="timer">${timeLabel}</span><span class="hint-pill">${inspectIndex + 1}/${order.length} · ${d.config.subjectName}</span></div>`

  const checks = JUDGABLE_ERRORS.map((e) => {
    const on = selected.has(e)
    return `<label class="check check-${e} ${on ? 'on' : ''} ${e === 'ok' ? 'ok' : ''}" data-err="${e}">
      <input type="checkbox" value="${e}" ${on ? 'checked' : ''}/>
      <span class="check-body"><strong>${ERROR_LABELS[e]}</strong><small>${ERROR_HINTS[e]}</small></span>
    </label>`
  }).join('')

  const dispositions = (['ok', 'call_identity', 'score_wrong', 'to_subject'] as Disposition[])
    .map(
      (disp) => `
<label class="disp disp-${disp} ${j.disposition === disp ? 'on' : ''}" data-disp="${disp}">
  <input type="radio" name="disp" value="${disp}" ${j.disposition === disp ? 'checked' : ''}/>
  <span><strong>${DISPOSITION_LABELS[disp]}</strong><small>${DISPOSITION_HINTS[disp]}</small></span>
</label>`,
    )
    .join('')

  const modeHelp =
    d.config.inspectionMode === 'immediate'
      ? '인적사항 기재·마킹을 먼저 확인합니다. 답안 마킹은 수정시키지 않습니다. 오답으로 판정한 답안은 학생을 부르지 않고 그대로 채점합니다.'
      : '교과 교사가 기재 오류 여부와 답안 인식을 확인하고, 필요하면 학교 성적처리 절차로 넘깁니다.'

  shell(
    `
<section class="panel inspection-panel" data-stage="inspection">
  <div class="inspect-layout">
    <aside class="inspect-roster">
      <h2>명렬 한 줄</h2>
      <dl class="student-card">
        <div><dt>학년·반·번호</dt><dd>${student.grade}-${student.classNo}-${String(student.number).padStart(2,'0')}</dd></div>
        <div><dt>성명</dt><dd>${student.name}</dd></div>
        <div><dt>수험번호</dt><dd>${student.examId}</dd></div>
        <div><dt>과목</dt><dd>${d.config.subjectName} (${String(d.config.subjectCode).padStart(2,'0')})</dd></div>
        <div><dt>응시</dt><dd>${student.absent ? `결시 · ${student.absentNote ?? ''}` : '응시'}</dd></div>
      </dl>
      <p class="warn-note">⚠ 교사가 답안 마킹을 대신 고치지 않습니다.<br/>학생 호출 없이 오답 처리 · 기재 오류만 호출</p>
      <p class="side-note mode-help">${modeHelp}</p>
      <div class="dot-nav" id="dot-nav">
        ${order
          .map((id, i) => {
            const done = judgments.has(id)
            const c = cardsById.get(id)!
            return `<button type="button" class="dot ${i === inspectIndex ? 'current' : ''} ${done ? 'done' : ''} ${c.isAbsentBlank ? 'abs' : ''}" data-i="${i}" aria-label="${i + 1}번">${i + 1}</button>`
          })
          .join('')}
      </div>
    </aside>
    <div class="inspect-card-pane">
      <div class="zoom-toolbar">
        <button type="button" class="btn tiny" id="z-out">−</button>
        <button type="button" class="btn tiny" id="z-reset">배율 리셋</button>
        <button type="button" class="btn tiny" id="z-in">+</button>
        <span class="side-note">문제 부위를 클릭하면 이상이 선택됩니다</span>
      </div>
      <div class="zoom-viewport" id="zoom-viewport">
        <div class="zoom-canvas" id="zoom-canvas" style="transform:translate(${panX}px,${panY}px) scale(${zoom})">
          ${renderOmrFront(card, { student, showRosterHint: false })}
        </div>
      </div>
    </div>
    <aside class="inspect-judge inspect-actions">
      <h2>발견한 이상</h2>
      <form id="judge-form" class="judge-form judge-2col">${checks}</form>
      <h2>조치</h2>
      <form id="disp-form" class="disp-form">${dispositions}</form>
      <div class="actions inspect-actions">
        <button class="btn ghost" id="btn-prev" type="button" ${inspectIndex === 0 ? 'disabled' : ''}>←</button>
        <button class="btn primary" id="btn-submit" type="button">${inspectIndex < order.length - 1 ? '저장 후 다음' : '제출 · 결과'}</button>
      </div>
    </aside>
  </div>
  <div class="toast" id="toast" hidden></div>
</section>`,
    { top, desk: true, stageClass: 'stage-inspection' },
  )
  startClock()
  bindInspection(card, order)
  requestAnimationFrame(fitOmrToViewport)
}

function fitOmrToViewport() {
  const vp = app.querySelector<HTMLElement>('#zoom-viewport')
  const canvas = app.querySelector<HTMLElement>('#zoom-canvas')
  const cardEl = canvas?.querySelector<HTMLElement>('.omr-card')
  if (!vp || !canvas || !cardEl || zoom !== 1) return
  const avail = vp.clientWidth - 24
  const need = cardEl.scrollWidth || cardEl.offsetWidth
  if (need > 0 && avail > 0) {
    const s = Math.min(1.35, Math.max(0.9, avail / need))
    if (Math.abs(s - 1) > 0.02 && panX === 0 && panY === 0) {
      zoom = s
      canvas.style.transform = `translate(0px,0px) scale(${zoom})`
    }
  }
}

function bindInspection(card: OmrCard, order: string[]) {
  const saveSel = (sel: ErrorType[], disp: Disposition) => {
    judgments.set(card.id, { selected: sel, disposition: disp })
  }

  const toggleError = (val: ErrorType, force?: boolean) => {
    const cur = judgments.get(card.id) ?? { selected: [] as ErrorType[], disposition: 'ok' as Disposition }
    let set = new Set(cur.selected)
    const on = force ?? !set.has(val)
    if (on) {
      if (val === 'ok') set = new Set(['ok'])
      else {
        set.delete('ok')
        set.add(val)
      }
    } else set.delete(val)
    // suggest disposition
    let disp = cur.disposition
    const errs = [...set].filter((e) => e !== 'ok')
    if (set.has('ok') && set.size === 1) disp = 'ok'
    else if (errs.some((e) => e === 'id_mark' || e === 'name_mismatch' || e === 'missing_subject'))
      disp = 'call_identity'
    else if (errs.some((e) => e === 'duplicate_mark' || e === 'missing_mark' || e === 'incomplete_mark'))
      disp = 'score_wrong'
    else disp = 'to_subject'
    saveSel([...set], disp)
    renderInspection()
  }

  app.querySelectorAll<HTMLInputElement>('#judge-form input').forEach((inp) => {
    inp.addEventListener('change', () => {
      toggleError(inp.value as ErrorType, inp.checked)
    })
  })

  app.querySelectorAll<HTMLInputElement>('#disp-form input').forEach((inp) => {
    inp.addEventListener('change', () => {
      const cur = judgments.get(card.id) ?? { selected: [] as ErrorType[], disposition: 'ok' as Disposition }
      saveSel(cur.selected, inp.value as Disposition)
      renderInspection()
    })
  })

  // Direct click on erroneous OMR regions
  const canvas = app.querySelector<HTMLElement>('#zoom-canvas')
  canvas?.querySelectorAll<HTMLElement>('[data-region]').forEach((el) => {
    el.style.cursor = 'pointer'
    let sx = 0
    let sy = 0
    el.addEventListener('pointerdown', (e) => {
      sx = e.clientX
      sy = e.clientY
      e.stopPropagation()
    })
    el.addEventListener('pointerup', (e) => {
      if (Math.hypot(e.clientX - sx, e.clientY - sy) > 6) return
      const region = el.getAttribute('data-region') as ErrorType | null
      if (!region) return
      e.stopPropagation()
      toggleError(region)
    })
  })

  app.querySelector('#btn-prev')?.addEventListener('click', () => {
    inspectIndex = Math.max(0, inspectIndex - 1)
    zoom = 1
    panX = 0
    panY = 0
    renderInspection()
  })

  app.querySelector('#btn-submit')?.addEventListener('click', () => {
    const cur = judgments.get(card.id)
    if (!cur || cur.selected.length === 0) {
      showToast('발견한 이상을 고르세요. 없으면 «이상 없음».')
      return
    }
    if (inspectIndex < order.length - 1) {
      inspectIndex++
      zoom = 1
      panX = 0
      panY = 0
      renderInspection()
      return
    }
    for (let i = 0; i < order.length; i++) {
      if (!judgments.has(order[i]!)) {
        inspectIndex = i
        renderInspection()
        showToast(`${i + 1}번 카드 판정이 비어 있습니다.`)
        return
      }
    }
    finishGame()
  })

  app.querySelectorAll<HTMLButtonElement>('#dot-nav .dot').forEach((d) => {
    d.addEventListener('click', () => {
      inspectIndex = Number(d.dataset.i)
      zoom = 1
      panX = 0
      panY = 0
      renderInspection()
    })
  })

  app.querySelector('#z-in')?.addEventListener('click', () => {
    zoom = Math.min(2.5, zoom + 0.25)
    renderInspection()
  })
  app.querySelector('#z-out')?.addEventListener('click', () => {
    zoom = Math.max(0.75, zoom - 0.25)
    renderInspection()
  })
  app.querySelector('#z-reset')?.addEventListener('click', () => {
    zoom = 1
    panX = 0
    panY = 0
    renderInspection()
  })

  const vp = app.querySelector<HTMLElement>('#zoom-viewport')
  let dragging = false
  let lx = 0
  let ly = 0
  vp?.addEventListener('pointerdown', (e) => {
    if ((e.target as HTMLElement).closest('[data-region]')) return
    dragging = true
    lx = e.clientX
    ly = e.clientY
    vp.setPointerCapture(e.pointerId)
  })
  vp?.addEventListener('pointermove', (e) => {
    if (!dragging) return
    panX += e.clientX - lx
    panY += e.clientY - ly
    lx = e.clientX
    ly = e.clientY
    const cnv = app.querySelector<HTMLElement>('#zoom-canvas')
    if (cnv) cnv.style.transform = `translate(${panX}px,${panY}px) scale(${zoom})`
  })
  vp?.addEventListener('pointerup', () => {
    dragging = false
  })
}

function finishGame() {
  clearTimer()
  const d = data!
  const order = tray.length ? tray : expectedOrder(d.roster, d.cards)
  const exp = expectedOrder(d.roster, [...cardsById.values()])
  if (!sortResult) sortResult = scoreSort(order, exp, cardsById)
  const ordered = order.map((id) => cardsById.get(id)!)
  const jList: InspectionJudgment[] = order.map((id) => {
    const j = judgments.get(id) ?? { selected: ['ok'] as ErrorType[], disposition: 'ok' as Disposition }
    return { cardId: id, selected: j.selected, disposition: j.disposition }
  })
  const insp = scoreInspection(ordered, jList, d.config.inspectionMode)
  finalScore = computeScore({
    headcountOk,
    sort: sortResult,
    inspection: insp,
    timeSeconds: elapsed(),
    cardCount: order.length,
    timedOut,
    inspectionMode: d.config.inspectionMode,
  })
  saveBest(d.config.difficulty, finalScore.total)
  go('results')
}

function renderResults() {
  const s = finalScore!
  const d = data!
  const ratio = s.maxTotal ? s.total / s.maxTotal : 0
  const grade = ratio >= 0.95 ? 'A+' : ratio >= 0.85 ? 'A' : ratio >= 0.7 ? 'B' : ratio >= 0.55 ? 'C' : 'D'

  const grouped = new Map<string, typeof s.inspection>()
  for (const cs of s.inspection) {
    const card = cardsById.get(cs.cardId)!
    const st = studentForCard(d.roster, card)
    const key = `${st.grade}-${st.classNo}`
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(cs)
  }
  const rows = [...grouped.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, list]) => {
      const articles = list
        .map((cs) => {
          const card = cardsById.get(cs.cardId)!
          const st = studentForCard(d.roster, card)
          const hl = [...cs.missed, ...cs.hit.filter((e) => e !== 'ok')]
          return `
<article class="result-card ${cs.perfect ? 'ok' : 'ng'} ${card.isAbsentBlank ? 'abs' : ''}">
  <header><b>${st.grade}-${st.classNo} ${String(st.number).padStart(2, '0')} ${st.name}${card.isAbsentBlank ? ' · 결시 빈장' : ''}</b>
    <span class="tag ${cs.perfect ? 'good' : 'bad'}">${cs.perfect ? '정확' : '미흡'}</span>
  </header>
  <div class="result-mini">${renderOmrFront(card, { student: st, highlight: hl, compact: true })}</div>
  <div class="explain hit">맞춤: ${cs.hit.map((e) => ERROR_LABELS[e]).join(', ') || '—'}</div>
  ${cs.missed.length ? `<div class="explain miss">놓침: ${cs.missed.map((e) => `${ERROR_LABELS[e]} — ${ERROR_HINTS[e]}`).join(' / ')}</div>` : ''}
  ${cs.falsePositive.length ? `<div class="explain fp">잘못 선택: ${cs.falsePositive.map((e) => ERROR_LABELS[e]).join(', ')}</div>` : ''}
  <div class="explain ${cs.dispositionOk ? 'hit' : 'miss'}">조치: ${DISPOSITION_LABELS[cs.disposition]}
    ${cs.dispositionOk ? '' : `(정답: ${DISPOSITION_LABELS[cs.expectedDisposition]})`}
    ${cs.disposition === 'score_wrong' ? ' · <em>학생 호출 없이 오답 처리</em>' : ''}
  </div>
</article>`
        })
        .join('')
      return `<div class="result-class-group"><h3>${key.replace('-', '학년 ')}반</h3>${articles}</div>`
    })
    .join('')

  shell(
    `
<section class="panel results-panel" data-stage="results">
  <div class="score-hero">
    <p class="eyebrow">결과 · ${DIFFICULTIES[d.config.difficulty].label} · ${INSPECTION_MODE_LABELS[s.inspectionMode]}${s.timedOut ? ' · 시간초과' : ''} · ${d.config.subjectName}</p>
    <div class="grade-badge" data-grade="${grade}">${grade}</div>
    <h1><span class="score-num">${s.total}</span> <small>/ ${s.maxTotal}</small></h1>
    <div class="score-bar" aria-hidden="true"><i style="width:${Math.round(ratio*100)}%"></i></div>
    <p class="lead">소요 ${fmtTime(s.timeSeconds)} · 보너스 +${s.timeBonus} · 시드 ${d.config.seed}</p>
  </div>
  <div class="result-grid">
    <div class="result-box">
      <h2>인원</h2>
      <p>${s.headcountOk ? '✅' : '❌'} +${s.headcountPoints}/20</p>
      <div class="meter" aria-hidden="true"><i style="width:${(s.headcountPoints/20)*100}%"></i></div>
    </div>
    <div class="result-box">
      <h2>정렬</h2>
      <p>${s.sortOrderOk ? '✅' : '❌'} 순서 · ${s.sortOrientationOk ? '✅' : '❌'} 방향 · +${s.sortPoints}/50</p>
      <div class="meter" aria-hidden="true"><i style="width:${(s.sortPoints/50)*100}%"></i></div>
    </div>
    <div class="result-box">
      <h2>검사</h2>
      <p>+${s.inspectionPoints} · 완벽 ${s.inspection.filter((c) => c.perfect).length}/${s.inspection.length}</p>
      <div class="meter" aria-hidden="true"><i style="width:${s.inspection.length ? (s.inspection.filter((c)=>c.perfect).length/s.inspection.length)*100 : 0}%"></i></div>
    </div>
  </div>
  <div class="result-list"><h2>카드별 해설</h2>${rows}</div>
  <div class="actions">
    <button class="btn primary" id="btn-retry" type="button">같은 시드</button>
    <button class="btn ghost" id="btn-new" type="button">새 시드</button>
    <button class="btn ghost" id="btn-hub2" type="button">허브</button>
  </div>
</section>`,
  )
  app.querySelector('#btn-retry')!.addEventListener('click', () => {
    _inspectionMode = d.config.inspectionMode
    history.replaceState(null, '', `?diff=${d.config.difficulty}&mode=${d.config.inspectionMode}&seed=${d.config.seed}`)
    startRun(d.config.difficulty, d.config.seed)
  })
  app.querySelector('#btn-new')!.addEventListener('click', () => {
    _inspectionMode = d.config.inspectionMode
    startRun(d.config.difficulty)
  })
  app.querySelector('#btn-hub2')!.addEventListener('click', bootHub)
}

bootHub()

// silence unused in tree-shaking edge
