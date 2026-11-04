import './style.css'
import {
  expectedOrder,
  generateGame,
  parseSeedFromUrl,
  studentForCard,
} from './game/generator'
import { computeScore, scoreInspection, scoreSort } from './game/scoring'
import { renderCardShell, renderOmrFront } from './game/omrRender'
import {
  ERROR_HINTS,
  ERROR_LABELS,
  JUDGABLE_ERRORS,
  type ErrorType,
  type GameData,
  type GameScore,
  type InspectionJudgment,
  type OmrCard,
  type SortResult,
  type Stage,
} from './game/types'

const app = document.querySelector<HTMLDivElement>('#app')!

let data: GameData
let stage: Stage = 'title'
let order: string[] = []
let cardsById = new Map<string, OmrCard>()
let judgments = new Map<string, ErrorType[]>()
let inspectIndex = 0
let startedAt = 0
let sortResult: SortResult | null = null
let finalScore: GameScore | null = null
let dragFrom: number | null = null

function boot(seed?: number) {
  data = generateGame({ seed: seed ?? parseSeedFromUrl() })
  cardsById = new Map(data.cards.map((c) => [c.id, c]))
  order = data.cards.map((c) => c.id)
  judgments = new Map()
  inspectIndex = 0
  sortResult = null
  finalScore = null
  startedAt = 0
  stage = 'title'
  render()
}

function elapsed(): number {
  if (!startedAt) return 0
  return Math.floor((Date.now() - startedAt) / 1000)
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

function go(next: Stage) {
  stage = next
  if (next === 'sorting' && !startedAt) startedAt = Date.now()
  render()
}

function render() {
  switch (stage) {
    case 'title':
      renderTitle()
      break
    case 'howto':
      renderHowto()
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
}

function shell(body: string, opts?: { stageClass?: string; top?: string }) {
  app.innerHTML = `
<div class="desk ${opts?.stageClass ?? ''}">
  <div class="desk-wood"></div>
  <header class="topbar">
    <div class="brand">
      <span class="logo">✎</span>
      <div>
        <strong>교사 시뮬레이터</strong>
        <small>잡무 연습 · OMR 카드 검사</small>
      </div>
    </div>
    ${opts?.top ?? ''}
  </header>
  <main class="stage">${body}</main>
</div>`
}

function renderTitle() {
  shell(
    `
<section class="panel title-panel" data-stage="title">
  <div class="title-hero">
    <div class="stack-preview" aria-hidden="true">
      <div class="preview-card c1"></div>
      <div class="preview-card c2"></div>
      <div class="preview-card c3"></div>
    </div>
    <div class="title-copy">
      <p class="eyebrow">미니게임 01</p>
      <h1>OMR 카드 검사</h1>
      <p class="lead">
        시험이 끝나면 책상 위에 OMR이 산더미처럼 쌓입니다.
        뒤집힌 장을 바로 세우고, 명렬표 순서로 맞춘 뒤,
        수기·마킹·명렬이 어긋난 장을 찾아내세요.
      </p>
      <ul class="title-stats">
        <li><b>${data.config.studentCount}</b>명 명렬</li>
        <li><b>${data.config.questionCount}</b>문항</li>
        <li>시드 <b>${data.config.seed}</b></li>
      </ul>
      <div class="actions">
        <button class="btn primary" id="btn-start" type="button">연습 시작</button>
        <button class="btn ghost" id="btn-howto" type="button">하는 방법</button>
        <button class="btn ghost" id="btn-reseed" type="button">다른 시드</button>
      </div>
    </div>
  </div>
</section>`,
    { stageClass: 'stage-title' },
  )

  app.querySelector('#btn-start')!.addEventListener('click', () => go('sorting'))
  app.querySelector('#btn-howto')!.addEventListener('click', () => go('howto'))
  app.querySelector('#btn-reseed')!.addEventListener('click', () => {
    const next = Math.floor(Math.random() * 1e9) || 1
    history.replaceState(null, '', `?seed=${next}`)
    boot(next)
  })
}

function renderHowto() {
  shell(
    `
<section class="panel howto-panel" data-stage="howto">
  <h1>하는 방법</h1>
  <ol class="howto-steps">
    <li>
      <b>1. 정렬</b>
      <p>왼쪽 명렬표를 보고 오른쪽 OMR을 <em>번호 오름차순</em>으로 맞춥니다.
      카드는 드래그하거나 ↑↓ 버튼으로 옮깁니다.</p>
    </li>
    <li>
      <b>2. 뒤집기</b>
      <p>뒷면만 보이는 카드는 클릭(또는 «뒤집기»)해서 앞면으로 만듭니다.
      모든 카드가 앞면을 봐야 다음 단계로 갈 수 있습니다.</p>
    </li>
    <li>
      <b>3. 검사</b>
      <p>카드마다 수기 성명·학년·반·번호와 마킹, 과목코드, 답안 마킹을 명렬표와 비교합니다.
      발견한 오류를 모두 고르거나, 문제없으면 «정상»을 고릅니다.</p>
    </li>
    <li>
      <b>4. 채점</b>
      <p>놓친 오류와 잘못 찍은 항목을 설명해 줍니다. 같은 시드로 다시 연습할 수 있습니다.</p>
    </li>
  </ol>
  <div class="actions">
    <button class="btn primary" id="btn-go" type="button">알겠어요, 시작!</button>
    <button class="btn ghost" id="btn-back" type="button">돌아가기</button>
  </div>
</section>`,
    { stageClass: 'stage-howto' },
  )
  app.querySelector('#btn-go')!.addEventListener('click', () => go('sorting'))
  app.querySelector('#btn-back')!.addEventListener('click', () => go('title'))
}

function renderSorting() {
  const stillDown = order.filter((id) => cardsById.get(id)?.faceDown).length
  const top = `
<div class="progress">
  <span class="pill">1 / 2 · 정렬</span>
  <span class="timer" id="timer">${fmtTime(elapsed())}</span>
  <span class="hint-pill">${stillDown ? `뒤집힌 카드 ${stillDown}장` : '모두 앞면'}</span>
</div>`

  const rosterHtml = `
<table class="roster">
  <caption>학생 명렬표 · ${data.config.grade}학년 ${data.config.classNo}반</caption>
  <thead><tr><th>번호</th><th>성명</th><th>수험번호</th></tr></thead>
  <tbody>
    ${data.roster
      .map(
        (s) =>
          `<tr><td>${String(s.number).padStart(2, '0')}</td><td>${s.name}</td><td>${s.examId}</td></tr>`,
      )
      .join('')}
  </tbody>
</table>`

  const cardsHtml = order
    .map((id, idx) => {
      const card = cardsById.get(id)!
      const badge = card.faceDown
        ? '?'
        : String(card.handwrittenNumber).padStart(2, '0')
      return `
<li class="sort-item ${card.faceDown ? 'is-down' : ''}" draggable="true" data-index="${idx}" data-card-id="${id}">
  <div class="sort-handle" title="드래그하여 순서 변경">
    <span class="slot">${idx + 1}</span>
    <span class="num-badge" title="수기 번호">${badge}</span>
  </div>
  <div class="sort-card-wrap">
    ${renderCardShell(card, { compact: true, showRosterHint: false })}
  </div>
  <div class="sort-tools">
    <button type="button" class="btn tiny" data-act="up" data-index="${idx}" ${idx === 0 ? 'disabled' : ''}>↑</button>
    <button type="button" class="btn tiny" data-act="down" data-index="${idx}" ${idx === order.length - 1 ? 'disabled' : ''}>↓</button>
    <button type="button" class="btn tiny accent" data-act="flip" data-index="${idx}">뒤집기</button>
  </div>
</li>`
    })
    .join('')

  shell(
    `
<section class="panel sorting-panel" data-stage="sorting">
  <div class="sorting-layout">
    <aside class="roster-pane">
      ${rosterHtml}
      <p class="side-note">명렬표 번호 순서(01→…)로 OMR을 맞춰 주세요. 뒤집힌 장은 모두 앞면으로.</p>
    </aside>
    <div class="cards-pane">
      <div class="pane-head">
        <h2>OMR 더미 <small>${order.length}장</small></h2>
        <p>왼쪽 뱃지 수기번호 = 명렬 번호로 맞추세요 · 드래그/↑↓ · 카드 클릭=뒤집기</p>
      </div>
      <ul class="sort-list" id="sort-list">${cardsHtml}</ul>
    </div>
  </div>
  <div class="actions sticky-actions">
    <button class="btn ghost" id="btn-title" type="button">처음으로</button>
    <button class="btn ghost" id="btn-autosort" type="button" title="연습용: 수기 번호 오름차순">수기번호순 맞추기</button>
    <button class="btn primary" id="btn-to-inspect" type="button">정렬 완료 · 검사하기</button>
  </div>
  <div class="toast" id="toast" hidden></div>
</section>`,
    { stageClass: 'stage-sorting', top },
  )

  bindSorting()
  startTimerTick()
}

function showToast(msg: string) {
  const t = app.querySelector<HTMLDivElement>('#toast')
  if (!t) return
  t.hidden = false
  t.textContent = msg
  window.setTimeout(() => {
    t.hidden = true
  }, 2600)
}

function startTimerTick() {
  const el = app.querySelector('#timer')
  if (!el) return
  const id = window.setInterval(() => {
    if (stage !== 'sorting' && stage !== 'inspection') {
      clearInterval(id)
      return
    }
    const timer = app.querySelector('#timer')
    if (timer) timer.textContent = fmtTime(elapsed())
  }, 1000)
}

function bindSorting() {
  app.querySelector('#btn-title')?.addEventListener('click', () => {
    if (confirm('진행 중인데 처음 화면으로 갈까요?')) boot(data.config.seed)
  })

  app.querySelector('#btn-to-inspect')?.addEventListener('click', () => {
    const still = order.filter((id) => cardsById.get(id)?.faceDown)
    if (still.length) {
      showToast(`아직 뒤집힌 카드가 ${still.length}장 있어요. 모두 앞면으로 만들어 주세요.`)
      return
    }
    const exp = expectedOrder(data.roster, [...cardsById.values()])
    sortResult = scoreSort(order, exp, cardsById)
    if (!sortResult.orderCorrect) {
      const ok = confirm(
        '명렬표 순서와 아직 다릅니다.\n그래도 검사 단계로 넘어갈까요?\n(정렬 점수는 결과가 반영됩니다)',
      )
      if (!ok) return
    }
    inspectIndex = 0
    go('inspection')
  })

  app.querySelector('#btn-autosort')?.addEventListener('click', () => {
    // practice assist: sort by handwritten number (still need flips)
    const still = order.filter((id) => cardsById.get(id)?.faceDown)
    if (still.length) {
      showToast('먼저 뒤집힌 카드를 모두 앞면으로 만들어 주세요.')
      return
    }
    order = [...order].sort((a, b) => {
      const ca = cardsById.get(a)!
      const cb = cardsById.get(b)!
      return ca.handwrittenNumber - cb.handwrittenNumber
    })
    showToast('수기 번호 순으로 맞춰 두었어요. 한 번 더 확인하세요.')
    renderSorting()
  })

  app.querySelectorAll<HTMLButtonElement>('[data-act]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const act = btn.dataset.act
      const idx = Number(btn.dataset.index)
      if (act === 'up') moveItem(idx, idx - 1)
      if (act === 'down') moveItem(idx, idx + 1)
      if (act === 'flip') flipAt(idx)
    })
  })

  app.querySelectorAll<HTMLElement>('.card-3d').forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.dataset.cardId!
      const idx = order.indexOf(id)
      if (idx >= 0) flipAt(idx)
    })
  })

  const list = app.querySelector('#sort-list')!
  list.querySelectorAll<HTMLElement>('.sort-item').forEach((item) => {
    item.addEventListener('dragstart', (e) => {
      dragFrom = Number(item.dataset.index)
      item.classList.add('dragging')
      e.dataTransfer?.setData('text/plain', String(dragFrom))
      if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
    })
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging')
      dragFrom = null
    })
    item.addEventListener('dragover', (e) => {
      e.preventDefault()
      item.classList.add('drag-over')
    })
    item.addEventListener('dragleave', () => item.classList.remove('drag-over'))
    item.addEventListener('drop', (e) => {
      e.preventDefault()
      item.classList.remove('drag-over')
      const to = Number(item.dataset.index)
      const from = dragFrom ?? Number(e.dataTransfer?.getData('text/plain'))
      if (Number.isFinite(from) && Number.isFinite(to)) moveItem(from, to)
    })
  })
}

function moveItem(from: number, to: number) {
  if (to < 0 || to >= order.length || from === to) return
  const next = [...order]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item!)
  order = next
  renderSorting()
}

function flipAt(idx: number) {
  const id = order[idx]
  if (!id) return
  const card = cardsById.get(id)
  if (!card) return
  card.faceDown = !card.faceDown
  renderSorting()
}

function renderInspection() {
  // inspection uses roster order of cards after player's sort
  const card = cardsById.get(order[inspectIndex]!)!
  const student = studentForCard(data.roster, card)
  const selected = new Set(judgments.get(card.id) ?? [])

  const top = `
<div class="progress">
  <span class="pill">2 / 2 · 검사</span>
  <span class="timer" id="timer">${fmtTime(elapsed())}</span>
  <span class="hint-pill">${inspectIndex + 1} / ${order.length}장</span>
</div>`

  const checks = JUDGABLE_ERRORS.map((e) => {
    const on = selected.has(e)
    return `
<label class="check ${on ? 'on' : ''} ${e === 'ok' ? 'ok' : ''}">
  <input type="checkbox" value="${e}" ${on ? 'checked' : ''} />
  <span class="check-body">
    <strong>${ERROR_LABELS[e]}</strong>
    <small>${ERROR_HINTS[e]}</small>
  </span>
</label>`
  }).join('')

  shell(
    `
<section class="panel inspection-panel" data-stage="inspection">
  <div class="inspect-layout">
    <aside class="inspect-roster">
      <h2>이 학생</h2>
      <dl class="student-card">
        <div><dt>번호</dt><dd>${String(student.number).padStart(2, '0')}</dd></div>
        <div><dt>성명</dt><dd>${student.name}</dd></div>
        <div><dt>학년·반</dt><dd>${student.grade}학년 ${student.classNo}반</dd></div>
        <div><dt>수험번호</dt><dd>${student.examId}</dd></div>
      </dl>
      <p class="side-note">수기란·마킹란·답안을 명렬과 비교하세요. 해당되는 오류를 모두 고르고, 없으면 «정상»만 고르세요.</p>
      <div class="dot-nav" id="dot-nav">
        ${order
          .map((id, i) => {
            const judged = judgments.has(id)
            return `<button type="button" class="dot ${i === inspectIndex ? 'current' : ''} ${judged ? 'done' : ''}" data-i="${i}" aria-label="${i + 1}번 카드"></button>`
          })
          .join('')}
      </div>
    </aside>
    <div class="inspect-card-pane">
      ${renderOmrFront(card, { student, showRosterHint: true, compact: false })}
    </div>
    <aside class="inspect-judge">
      <h2>판정</h2>
      <form id="judge-form" class="judge-form">${checks}</form>
    </aside>
  </div>
  <div class="actions sticky-actions">
    <button class="btn ghost" id="btn-prev" type="button" ${inspectIndex === 0 ? 'disabled' : ''}>← 이전</button>
    <button class="btn ghost" id="btn-next" type="button">${inspectIndex < order.length - 1 ? '다음 →' : '건너뛰기'}</button>
    <button class="btn primary" id="btn-submit" type="button">${inspectIndex < order.length - 1 ? '저장 후 다음' : '검사 제출 · 결과'}</button>
  </div>
  <div class="toast" id="toast" hidden></div>
</section>`,
    { stageClass: 'stage-inspection', top },
  )

  bindInspection(card)
  startTimerTick()
}

function bindInspection(card: OmrCard) {
  const form = app.querySelector<HTMLFormElement>('#judge-form')!

  form.querySelectorAll<HTMLInputElement>('input[type=checkbox]').forEach((inp) => {
    inp.addEventListener('change', () => {
      const val = inp.value as ErrorType
      let cur = new Set(judgments.get(card.id) ?? [])
      if (inp.checked) {
        if (val === 'ok') cur = new Set(['ok'])
        else {
          cur.delete('ok')
          cur.add(val)
        }
      } else {
        cur.delete(val)
      }
      judgments.set(card.id, [...cur])
      // refresh check styles without full rerender to keep focus — full rerender ok for demo
      renderInspection()
    })
  })

  app.querySelector('#btn-prev')?.addEventListener('click', () => {
    inspectIndex = Math.max(0, inspectIndex - 1)
    renderInspection()
  })

  const saveCurrent = (): boolean => {
    const sel = judgments.get(card.id) ?? []
    if (sel.length === 0) {
      showToast('판정을 하나 이상 골라 주세요. 문제없으면 «정상»을 선택하세요.')
      return false
    }
    return true
  }

  app.querySelector('#btn-next')?.addEventListener('click', () => {
    if (inspectIndex < order.length - 1) {
      inspectIndex++
      renderInspection()
    }
  })

  app.querySelector('#btn-submit')?.addEventListener('click', () => {
    if (!saveCurrent()) return
    if (inspectIndex < order.length - 1) {
      inspectIndex++
      renderInspection()
      return
    }
    // ensure all judged
    for (let i = 0; i < order.length; i++) {
      const id = order[i]!
      if (!judgments.has(id) || (judgments.get(id)?.length ?? 0) === 0) {
        inspectIndex = i
        renderInspection()
        showToast(`${i + 1}번 카드 판정이 비어 있어요.`)
        return
      }
    }
    finishGame()
  })

  app.querySelectorAll<HTMLButtonElement>('#dot-nav .dot').forEach((d) => {
    d.addEventListener('click', () => {
      inspectIndex = Number(d.dataset.i)
      renderInspection()
    })
  })
}

function finishGame() {
  const exp = expectedOrder(data.roster, [...cardsById.values()])
  if (!sortResult) {
    sortResult = scoreSort(order, exp, cardsById)
  }
  // score inspection in roster order of player's sorted cards
  const orderedCards = order.map((id) => cardsById.get(id)!)
  const jList: InspectionJudgment[] = order.map((id) => ({
    cardId: id,
    selected: judgments.get(id) ?? [],
  }))
  const insp = scoreInspection(orderedCards, jList)
  finalScore = computeScore(sortResult, insp, elapsed(), order.length)
  go('results')
}

function renderResults() {
  const s = finalScore!
  const sort = sortResult!

  const cardRows = s.inspection
    .map((cs) => {
      const card = cardsById.get(cs.cardId)!
      const st = studentForCard(data.roster, card)
      const status = cs.perfect
        ? '<span class="tag good">정확</span>'
        : '<span class="tag bad">미흡</span>'
      const miss =
        cs.missed.length > 0
          ? `<div class="explain miss">놓침: ${cs.missed.map((e) => ERROR_LABELS[e]).join(', ')} — ${cs.missed.map((e) => ERROR_HINTS[e]).join(' ')}</div>`
          : ''
      const fp =
        cs.falsePositive.length > 0
          ? `<div class="explain fp">잘못 선택: ${cs.falsePositive.map((e) => ERROR_LABELS[e]).join(', ')}</div>`
          : ''
      const hit =
        cs.hit.length > 0
          ? `<div class="explain hit">맞춤: ${cs.hit.map((e) => ERROR_LABELS[e]).join(', ')}</div>`
          : ''
      return `
<article class="result-card ${cs.perfect ? 'ok' : 'ng'}">
  <header><b>${String(st.number).padStart(2, '0')} ${st.name}</b> ${status}</header>
  ${hit}${miss}${fp}
</article>`
    })
    .join('')

  const ratio = s.maxTotal ? s.total / s.maxTotal : 0
  const grade =
    ratio >= 0.95 ? 'A+' : ratio >= 0.85 ? 'A' : ratio >= 0.7 ? 'B' : ratio >= 0.55 ? 'C' : 'D'
  const gradeMsg =
    ratio >= 0.85
      ? '채점관 선생님도 고개를 끄덕일 만해요.'
      : ratio >= 0.7
        ? '괜찮아요. 놓친 장만 다시 보면 더 빨라질 거예요.'
        : '잡무는 습관입니다. 같은 시드로 한 번 더 손을 풀어 보세요.'

  shell(
    `
<section class="panel results-panel" data-stage="results">
  <div class="score-hero">
    <p class="eyebrow">결과 · 등급 ${grade}</p>
    <h1><span class="score-num">${s.total}</span> <small>/ ${s.maxTotal}점</small></h1>
    <p class="lead">소요 ${fmtTime(s.timeSeconds)} · 시간 보너스 +${s.timeBonus}</p>
    <p class="grade-msg">${gradeMsg}</p>
    <p class="side-note" style="text-align:center">시드 ${data.config.seed} · ?seed= 로 같은 문제 공유</p>
  </div>
  <div class="result-grid">
    <div class="result-box">
      <h2>정렬</h2>
      <ul>
        <li>${sort.orderCorrect ? '✅' : '❌'} 명렬 순서 ${sort.orderCorrect ? '정확' : '틀림'} <small>(+${sort.orderCorrect ? 30 : 0}/30)</small></li>
        <li>${sort.flipsCorrect ? '✅' : '❌'} 뒤집기 ${sort.flipsCorrect ? '모두 앞면' : '미완'} <small>(+${sort.flipsCorrect ? 20 : 0}/20)</small></li>
      </ul>
      ${
        !sort.orderCorrect
          ? `<p class="side-note">정답 순서: ${sort.expectedOrder
              .map((id) => {
                const c = cardsById.get(id)!
                return String(studentForCard(data.roster, c).number).padStart(2, '0')
              })
              .join(' → ')}</p>`
          : ''
      }
    </div>
    <div class="result-box">
      <h2>검사</h2>
      <p>카드 점수 <b>${s.inspectionPoints}</b> · 완벽 ${s.inspection.filter((c) => c.perfect).length}/${s.inspection.length}장</p>
    </div>
  </div>
  <div class="result-list">
    <h2>카드별 해설</h2>
    ${cardRows}
  </div>
  <div class="actions">
    <button class="btn primary" id="btn-retry" type="button">같은 시드로 다시</button>
    <button class="btn ghost" id="btn-new" type="button">새 시드</button>
    <button class="btn ghost" id="btn-home" type="button">처음 화면</button>
  </div>
</section>`,
    { stageClass: 'stage-results' },
  )

  app.querySelector('#btn-retry')!.addEventListener('click', () => boot(data.config.seed))
  app.querySelector('#btn-new')!.addEventListener('click', () => {
    const next = Math.floor(Math.random() * 1e9) || 1
    history.replaceState(null, '', `?seed=${next}`)
    boot(next)
  })
  app.querySelector('#btn-home')!.addEventListener('click', () => {
    stage = 'title'
    render()
  })
}

boot()
