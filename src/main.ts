import './style.css'
import {
  expectedDisposition,
  expectedOrder,
  generateGame,
  headcountTruth,
  parseDifficultyFromUrl,
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
  JUDGABLE_ERRORS,
  type DifficultyId,
  type Disposition,
  type ErrorType,
  type GameData,
  type GameScore,
  type InspectionJudgment,
  type OmrCard,
  type SortResult,
  type Stage,
} from './game/types'

const app = document.querySelector<HTMLDivElement>('#app')!

let stage: Stage = 'hub'
let _difficulty: DifficultyId = parseDifficultyFromUrl() ?? 'easy'
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
      expectedOrder: string[]
      cards: Array<{ id: string; injectedErrors: ErrorType[]; disposition: Disposition }>
      headcount: { enrolled: number; present: number; absent: number }
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
    expectedOrder: expectedOrder(data.roster, data.cards),
    cards: data.cards.map((c) => ({
      id: c.id,
      injectedErrors: [...c.injectedErrors],
      disposition: expectedDisposition(c),
    })),
    headcount: headcountTruth(data.roster),
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

function startRun(diff: DifficultyId, seed?: number) {
  _difficulty = diff
  data = generateGame(diff, seed ?? parseSeedFromUrl())
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
  history.replaceState(null, '', `?diff=${_difficulty}&seed=${data.config.seed}`)
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
  const played = [best.easy, best.normal, best.hard].filter(Boolean).length
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
  </div>
  <div class="game-grid">
    <button type="button" class="game-tile open" id="tile-omr">
      <span class="tile-icon" aria-hidden="true"><svg class="tile-svg" viewBox="0 0 32 32" fill="none"><rect x="4" y="3" width="24" height="26" rx="2" stroke="currentColor" stroke-width="2"/><circle cx="10" cy="10" r="2" fill="currentColor"/><circle cx="16" cy="10" r="2" fill="currentColor"/><circle cx="22" cy="10" r="2" fill="currentColor"/><circle cx="10" cy="16" r="2" fill="currentColor"/><circle cx="16" cy="16" r="2" fill="currentColor"/><rect x="8" y="22" width="16" height="2" fill="currentColor"/></svg></span>
      <span class="tile-badge">플레이 가능</span>
      <h2>OMR 카드 검사</h2>
      <p>인원 확인 → 정렬·뒤집기 → 이상 발견 → 교과 확인</p>
      <ul class="best-line">
        <li>쉬움 ${best.easy?.score ?? '—'}점</li>
        <li>보통 ${best.normal?.score ?? '—'}점</li>
        <li>어려움 ${best.hard?.score ?? '—'}점</li>
      </ul>
    </button>
    <div class="game-tile locked"><span class="tile-icon" aria-hidden="true"><svg class="tile-svg" viewBox="0 0 32 32" fill="none"><rect x="6" y="4" width="20" height="24" rx="2" stroke="currentColor" stroke-width="2"/><path d="M10 12h12M10 17h12M10 22h8" stroke="currentColor" stroke-width="2"/></svg></span><span class="lock">잠김</span><h2>출결 정리</h2><p>전자·종이 출석부 대조</p></div>
    <div class="game-tile locked"><span class="tile-icon" aria-hidden="true"><svg class="tile-svg" viewBox="0 0 32 32" fill="none"><path d="M8 26V8l8-3 8 3v18l-8-3-8 3z" stroke="currentColor" stroke-width="2"/><path d="M12 14h8M12 18h6" stroke="currentColor" stroke-width="2"/></svg></span><span class="lock">잠김</span><h2>생기부 검토</h2><p>금지 표현·맞춤법</p></div>
    <div class="game-tile locked"><span class="tile-icon" aria-hidden="true"><svg class="tile-svg" viewBox="0 0 32 32" fill="none"><rect x="4" y="8" width="24" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M4 10l12 8 12-8" stroke="currentColor" stroke-width="2"/></svg></span><span class="lock">잠김</span><h2>가정통신문 교정</h2><p>날짜·금액·오탈자</p></div>
  </div>
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
      const lim = d.timeLimitSec ? `${Math.floor(d.timeLimitSec / 60)}분 제한` : '시간 제한 없음'
      return `
<button type="button" class="diff-card" data-diff="${id}">
  <h2>${d.label}</h2>
  <p><b>${d.studentCount}</b>명 · 문항 ${d.questionCount} · 결시 ${d.absentCount}</p>
  <p>${lim}</p>
  <p class="muted">최고 ${best[id]?.score ?? '—'}점</p>
</button>`
    })
    .join('')
  shell(
    `
<section class="panel" data-stage="difficulty">
  <h1>OMR 카드 검사 · 난이도</h1>
  <p class="lead">재적 인원에 따라 책상 위 카드 더미가 달라집니다.</p>
  <div class="diff-grid">${cards}</div>
  <div class="actions"><button class="btn ghost" id="btn-back" type="button">허브</button></div>
</section>`,
  )
  app.querySelector('#btn-back')!.addEventListener('click', bootHub)
  app.querySelectorAll<HTMLButtonElement>('[data-diff]').forEach((b) => {
    b.addEventListener('click', () => startRun(b.dataset.diff as DifficultyId))
  })
}

function renderHowto() {
  const d = data!
  shell(
    `
<section class="panel howto-panel" data-stage="howto">
  <h1>하는 방법 · ${DIFFICULTIES[d.config.difficulty].label}</h1>
  <ol class="howto-steps">
    <li><span class="howto-ico" aria-hidden="true">①</span><div><b>응시 인원 확인</b><p>응시자 + 결시자 = 재적. 결시는 빈칸이 아니라 명렬에 «결시»와 사유를 남깁니다.</p></div></li>
    <li><span class="howto-ico" aria-hidden="true">②</span><div><b>정렬·방향</b><p>책상 위 흐트러진 OMR을 번호순 트레이에 올립니다. 뒷면·위아래(180°) 뒤집힌 장을 바로잡습니다. 단축키 F/R/Enter.</p></div></li>
    <li><span class="howto-ico" aria-hidden="true">③</span><div><b>이상 발견</b><p>마킹을 대신 고치지 마세요. 시험 중이면 학생에게 수정을 요청하고, 종료 후면 교과 확인으로 넘깁니다. 돋보기로 마킹을 확대하세요.</p></div></li>
    <li><span class="howto-ico" aria-hidden="true">④</span><div><b>우리 학교 규정</b><p>수정테이프 허용 여부는 학교·시험마다 다릅니다. 이 데모는 <em>우리 학교 규정 기준</em>으로 «들뜸·덧칠»을 이상으로 봅니다.</p></div></li>
  </ol>
  <p class="side-note">시드 ${d.config.seed} · 재적 ${d.config.studentCount} · 응시 ${d.cards.length}</p>
  <div class="actions">
    <button class="btn primary" id="btn-go" type="button">인원 확인 시작</button>
    <button class="btn ghost" id="btn-back" type="button">난이도</button>
  </div>
</section>`,
  )
  app.querySelector('#btn-go')!.addEventListener('click', () => go('headcount'))
  app.querySelector('#btn-back')!.addEventListener('click', () => {
    stage = 'difficulty'
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
  <p class="lead">명렬표를 보고 <b>응시자 + 결시자 = 재적</b>인지 확인하세요. 결시생 카드는 더미에 없습니다.</p>
  <div class="hc-layout">
    ${renderRosterSheet(d.roster, d.config.grade, d.config.classNo)}
    <form id="hc-form" class="hc-form">
      <label>재적 <input name="enrolled" type="number" min="0" required /></label>
      <label>응시자 <input name="present" type="number" min="0" required /></label>
      <label>결시자 <input name="absent" type="number" min="0" required /></label>
      <p class="side-note">힌트: 명렬 «결시» 행을 세요. (정답은 제출 후)</p>
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
  const present = d.roster.filter((s) => !s.absent)
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
      const rot = -12 + t * 24 + ((i % 3) - 1) * 3
      const lift = (i % 5) * 5
      return `
<div class="desk-card pile-card ${selectedPileId === id ? 'selected' : ''}" data-id="${id}" draggable="true"
  style="--r:${rot}deg; --lift:${lift}px; --tilt:${2 + (i % 3)}deg; z-index:${i + 1}">
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
<div class="tray-slot empty-slot" data-slot="${i}">
  <span class="slot-label">슬롯 ${i + 1} · 예상 ${String(stu.number).padStart(2, '0')}</span>
  <div class="slot-ghost">${String(stu.number).padStart(2, '0')} ${stu.name}</div>
</div>`
      }
      const card = cardsById.get(id)!
      const ok = id === expId && !card.faceDown && !card.upsideDown
      const orderOk = id === expId
      const cls = orderOk && !card.faceDown && !card.upsideDown ? 'slot-ok' : orderOk ? 'slot-warn' : 'slot-bad'
      return `
<div class="tray-slot ${cls}" data-slot="${i}" data-id="${id}">
  <span class="slot-label">슬롯 ${i + 1} · 예상 ${String(stu.number).padStart(2, '0')}
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
      ${renderRosterSheet(d.roster, d.config.grade, d.config.classNo)}
      <p class="side-note">결시 행은 카드가 없습니다. 응시 카드만 번호순으로.</p>
    </aside>
    <div class="desk-work ${pile.length ? 'has-pile' : 'no-pile'}">
      <div class="pile-zone ${pile.length ? '' : 'is-empty'}" id="pile-zone">
        <header class="zone-head">
          <h2>흐트러진 더미 <small>${pile.length}</small></h2>
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
          <h2>정렬 트레이 <small>번호 오름차순 · 초록=맞음 · F/R/Enter</small></h2>
          <div class="pile-actions toolbar">
            <button class="btn tiny" id="btn-autosort" type="button">수기번호순</button>
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
    tray = all.sort(
      (a, b) => cardsById.get(a)!.handwrittenNumber - cardsById.get(b)!.handwrittenNumber,
    )
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
    })
  })

  app.querySelector('#tray-zone')?.addEventListener('dragover', (e) => e.preventDefault())
  app.querySelector('#tray-zone')?.addEventListener('drop', (e) => {
    e.preventDefault()
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

  const top = `<div class="progress"><span class="pill">검사</span><span class="timer" id="timer">${fmtTime(elapsed())}</span><span class="hint-pill">${inspectIndex + 1}/${order.length}</span></div>`

  const checks = JUDGABLE_ERRORS.map((e) => {
    const on = selected.has(e)
    return `<label class="check ${on ? 'on' : ''} ${e === 'ok' ? 'ok' : ''}">
      <input type="checkbox" value="${e}" ${on ? 'checked' : ''}/>
      <span class="check-body"><strong>${ERROR_LABELS[e]}</strong><small>${ERROR_HINTS[e]}</small></span>
    </label>`
  }).join('')

  const dispositions = (['ok', 'ask_student', 'to_subject'] as Disposition[])
    .map(
      (disp) => `
<label class="disp ${j.disposition === disp ? 'on' : ''}">
  <input type="radio" name="disp" value="${disp}" ${j.disposition === disp ? 'checked' : ''}/>
  <span><strong>${DISPOSITION_LABELS[disp]}</strong><small>${DISPOSITION_HINTS[disp]}</small></span>
</label>`,
    )
    .join('')

  shell(
    `
<section class="panel inspection-panel" data-stage="inspection">
  <div class="inspect-layout">
    <aside class="inspect-roster">
      <h2>명렬 한 줄</h2>
      <dl class="student-card">
        <div><dt>번호</dt><dd>${String(student.number).padStart(2, '0')}</dd></div>
        <div><dt>성명</dt><dd>${student.name}</dd></div>
        <div><dt>학년·반·번호</dt><dd>${student.grade}-${student.classNo}-${String(student.number).padStart(2,'0')}</dd></div>
        <div><dt>수험번호</dt><dd>${student.examId}</dd></div>
      </dl>
      <p class="warn-note">⚠ 교사가 마킹을 대신 고치지 않습니다.</p>
      <div class="dot-nav" id="dot-nav">
        ${order
          .map((id, i) => {
            const done = judgments.has(id)
            return `<button type="button" class="dot ${i === inspectIndex ? 'current' : ''} ${done ? 'done' : ''}" data-i="${i}"></button>`
          })
          .join('')}
      </div>
    </aside>
    <div class="inspect-card-pane">
      <div class="zoom-toolbar">
        <button type="button" class="btn tiny" id="z-out">−</button>
        <button type="button" class="btn tiny" id="z-reset">돋보기 리셋</button>
        <button type="button" class="btn tiny" id="z-in">+</button>
      </div>
      <div class="zoom-viewport" id="zoom-viewport">
        <div class="zoom-canvas" id="zoom-canvas" style="transform:translate(${panX}px,${panY}px) scale(${zoom})">
          ${renderOmrFront(card, { student, showRosterHint: true })}
        </div>
        <div class="magnifier" id="magnifier" hidden></div>
      </div>
      <p class="side-note mag-hint">마우스 위에 돋보기 렌즈 · 드래그로 이동 · +/− 로 확대</p>
    </div>
    <aside class="inspect-judge">
      <h2>발견한 이상</h2>
      <form id="judge-form" class="judge-form">${checks}</form>
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

  app.querySelectorAll<HTMLInputElement>('#judge-form input').forEach((inp) => {
    inp.addEventListener('change', () => {
      const cur = judgments.get(card.id) ?? { selected: [] as ErrorType[], disposition: 'ok' as Disposition }
      let set = new Set(cur.selected)
      const val = inp.value as ErrorType
      if (inp.checked) {
        if (val === 'ok') set = new Set(['ok'])
        else {
          set.delete('ok')
          set.add(val)
        }
      } else set.delete(val)
      saveSel([...set], cur.disposition)
      renderInspection()
    })
  })

  app.querySelectorAll<HTMLInputElement>('#disp-form input').forEach((inp) => {
    inp.addEventListener('change', () => {
      const cur = judgments.get(card.id) ?? { selected: [] as ErrorType[], disposition: 'ok' as Disposition }
      saveSel(cur.selected, inp.value as Disposition)
      renderInspection()
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
    // auto-suggest disposition: if ok -> ok, else to_subject (post-exam)
    if (cur.selected.includes('ok') && cur.selected.length === 1) {
      /* keep */
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
    const canvas = app.querySelector<HTMLElement>('#zoom-canvas')
    if (canvas) canvas.style.transform = `translate(${panX}px,${panY}px) scale(${zoom})`
  })
  vp?.addEventListener('pointerup', () => {
    dragging = false
  })

  const mag = app.querySelector<HTMLElement>('#magnifier')
  const canvas = app.querySelector<HTMLElement>('#zoom-canvas')
  if (vp && mag && canvas) {
    const syncMag = (e: PointerEvent) => {
      if (dragging) {
        mag.hidden = true
        return
      }
      const rect = vp.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const size = 180
      mag.hidden = false
      mag.style.width = `${size}px`
      mag.style.height = `${size}px`
      mag.style.left = `${Math.max(4, Math.min(rect.width - size - 4, x - size / 2))}px`
      mag.style.top = `${Math.max(4, Math.min(rect.height - size - 4, y - size / 2))}px`
      // Content coords under cursor (canvas transform: translate(pan) scale(zoom))
      const cx = (x - panX) / Math.max(0.01, zoom)
      const cy = (y - panY) / Math.max(0.01, zoom)
      const S = 2.6
      const ox = size / 2 - cx * S
      const oy = size / 2 - cy * S
      mag.innerHTML = `<div class="mag-inner" style="transform:translate(${ox}px,${oy}px) scale(${S}); transform-origin:0 0">${canvas.innerHTML}</div>`
    }
    vp.addEventListener('pointermove', (e) => {
      if (!dragging) syncMag(e)
    })
    vp.addEventListener('pointerleave', () => {
      mag.hidden = true
    })
  }
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
  const insp = scoreInspection(ordered, jList)
  finalScore = computeScore({
    headcountOk,
    sort: sortResult,
    inspection: insp,
    timeSeconds: elapsed(),
    cardCount: order.length,
    timedOut,
  })
  saveBest(d.config.difficulty, finalScore.total)
  go('results')
}

function renderResults() {
  const s = finalScore!
  const d = data!
  const ratio = s.maxTotal ? s.total / s.maxTotal : 0
  const grade = ratio >= 0.95 ? 'A+' : ratio >= 0.85 ? 'A' : ratio >= 0.7 ? 'B' : ratio >= 0.55 ? 'C' : 'D'

  const rows = s.inspection
    .map((cs) => {
      const card = cardsById.get(cs.cardId)!
      const st = studentForCard(d.roster, card)
      const hl = [...cs.missed, ...cs.hit.filter((e) => e !== 'ok')]
      return `
<article class="result-card ${cs.perfect ? 'ok' : 'ng'}">
  <header><b>${String(st.number).padStart(2, '0')} ${st.name}</b>
    <span class="tag ${cs.perfect ? 'good' : 'bad'}">${cs.perfect ? '정확' : '미흡'}</span>
  </header>
  <div class="result-mini">${renderOmrFront(card, { student: st, highlight: hl, compact: true })}</div>
  <div class="explain hit">맞춤: ${cs.hit.map((e) => ERROR_LABELS[e]).join(', ') || '—'}</div>
  ${cs.missed.length ? `<div class="explain miss">놓침: ${cs.missed.map((e) => `${ERROR_LABELS[e]} — ${ERROR_HINTS[e]}`).join(' / ')}</div>` : ''}
  ${cs.falsePositive.length ? `<div class="explain fp">잘못 선택: ${cs.falsePositive.map((e) => ERROR_LABELS[e]).join(', ')}</div>` : ''}
  <div class="explain ${cs.dispositionOk ? 'hit' : 'miss'}">조치: ${DISPOSITION_LABELS[cs.disposition]}
    ${cs.dispositionOk ? '' : `(정답: ${DISPOSITION_LABELS[cs.expectedDisposition]})`}</div>
</article>`
    })
    .join('')

  shell(
    `
<section class="panel results-panel" data-stage="results">
  <div class="score-hero">
    <p class="eyebrow">결과 · ${DIFFICULTIES[d.config.difficulty].label} · ${grade}${s.timedOut ? ' · 시간초과' : ''}</p>
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
  app.querySelector('#btn-retry')!.addEventListener('click', () => startRun(d.config.difficulty, d.config.seed))
  app.querySelector('#btn-new')!.addEventListener('click', () => startRun(d.config.difficulty))
  app.querySelector('#btn-hub2')!.addEventListener('click', bootHub)
}

bootHub()

// silence unused in tree-shaking edge
