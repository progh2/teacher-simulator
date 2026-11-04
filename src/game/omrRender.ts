import type { OmrCard, Student } from './types'

function digitCol(label: string, value: number | null, maxDigit = 9): string {
  const cells = Array.from({ length: maxDigit + 1 }, (_, d) => {
    const filled = value !== null && value === d
    return `<span class="bub ${filled ? 'filled' : ''}" data-d="${d}"><i>${d}</i></span>`
  }).join('')
  return `<div class="digit-col"><span class="digit-cap">${label}</span><div class="digit-bubs">${cells}</div></div>`
}

function twoDigitMark(label: string, value: number | null): string {
  const tens = value === null ? null : Math.floor(value / 10)
  const ones = value === null ? null : value % 10
  return `<div class="digit-group"><span class="group-label">${label}</span><div class="digit-cols">${digitCol('십', tens)}${digitCol('일', ones)}</div></div>`
}

function oneDigitMark(label: string, value: number | null, max = 9): string {
  return `<div class="digit-group"><span class="group-label">${label}</span><div class="digit-cols">${digitCol('', value, max)}</div></div>`
}

function answerBlock(card: OmrCard, from: number, to: number): string {
  const rows = []
  for (let qi = from; qi < to; qi++) {
    const ans = card.answers[qi]
    if (!ans) continue
    const q = qi + 1
    const cells = [1, 2, 3, 4, 5]
      .map((c) => {
        const on = ans.choices.includes(c)
        const inc = on && ans.incomplete
        const wrongPen = on && card.wrongPen
        const cls = [
          'bub',
          'ans',
          on ? 'filled' : '',
          inc ? 'incomplete' : '',
          wrongPen ? 'wrong-pen' : '',
        ]
          .filter(Boolean)
          .join(' ')
        return `<span class="${cls}"><i>${c}</i></span>`
      })
      .join('')
    rows.push(
      `<div class="ans-row" data-q="${q}"><span class="qno">${String(q).padStart(2, '0')}</span>${cells}</div>`,
    )
  }
  return `<div class="ans-block">${rows.join('')}</div>`
}

export interface RenderOpts {
  student?: Student
  showRosterHint?: boolean
  compact?: boolean
  highlight?: string[] // css selectors / error keys for results
}

export function renderOmrFront(card: OmrCard, opts: RenderOpts = {}): string {
  const { student, showRosterHint = false, compact = false, highlight = [] } = opts
  const hl = (key: string) => (highlight.includes(key) ? 'hl-err' : '')

  const formOdd = card.formType === 'odd'
  const formEven = card.formType === 'even'

  const damageCls = card.damaged ? `dmg-${card.damageKind ?? 'fold'}` : ''
  const tape =
    card.hasCorrectionTape
      ? `<div class="tape-trace ${card.correctionTapeBad ? 'tape-bad' : ''} ${hl('correction_tape')}" title="수정테이프"></div>`
      : ''

  const answers = compact
    ? ''
    : `<section class="omr-answers ${hl('duplicate_mark')} ${hl('missing_mark')} ${hl('incomplete_mark')}">
        <div class="ans-legend"><span>문항</span><span>①</span><span>②</span><span>③</span><span>④</span><span>⑤</span></div>
        <div class="ans-two">
          ${answerBlock(card, 0, 10)}
          ${answerBlock(card, 10, 20)}
        </div>
      </section>`

  return `
<article class="omr-card front ${compact ? 'is-compact' : ''} ${damageCls} ${card.wrongPen ? 'pen-wrong' : ''}" data-card-id="${card.id}">
  <div class="timing-marks left" aria-hidden="true"></div>
  <div class="timing-marks right" aria-hidden="true"></div>
  ${tape}
  <header class="omr-head">
    <div class="omr-brand">
      <strong>전국연합학력평가</strong>
      <span>답안지 (OMR) · 데모</span>
    </div>
    <div class="form-type ${hl('form_type')}">
      <span class="ft-label">문형</span>
      <span class="bub form ${formOdd ? 'filled' : ''}"><i>홀</i></span>
      <span class="bub form ${formEven ? 'filled' : ''}"><i>짝</i></span>
    </div>
  </header>
  <section class="omr-id">
    <div class="hand-block ${hl('name_mismatch')}">
      <div class="hand-line"><span>학년</span><b class="handwrite">${card.handwrittenGrade}</b></div>
      <div class="hand-line"><span>반</span><b class="handwrite">${card.handwrittenClass}</b></div>
      <div class="hand-line"><span>번호</span><b class="handwrite">${String(card.handwrittenNumber).padStart(2, '0')}</b></div>
      <div class="hand-line name"><span>성명</span><b class="handwrite">${card.handwrittenName}</b></div>
      ${
        showRosterHint && student
          ? `<div class="roster-hint">명렬 대조: ${String(student.number).padStart(2, '0')} ${student.name}${student.absent ? ' (결시)' : ''}</div>`
          : ''
      }
    </div>
    <div class="mark-block ${hl('id_mark')} ${hl('missing_subject')}">
      ${oneDigitMark('학년', card.markedGrade, 3)}
      ${twoDigitMark('반', card.markedClass)}
      ${twoDigitMark('번호', card.markedNumber)}
      ${twoDigitMark('과목', card.subjectCode)}
    </div>
  </section>
  ${answers}
  <footer class="omr-foot">
    <div class="proctor ${card.proctorSigned ? 'signed' : 'missing'} ${hl('missing_proctor')}">
      <span>감독관 확인</span>
      ${card.proctorSigned ? '<em class="stamp">確</em>' : '<em class="blank">미확인</em>'}
    </div>
    <span class="foot-note">※ 컴퓨터용 수성 사인펜 · 수정테이프는 우리 학교 규정 기준</span>
  </footer>
</article>`
}

export function renderOmrBack(card: OmrCard): string {
  return `
<article class="omr-card back" data-card-id="${card.id}">
  <div class="back-pattern"></div>
  <div class="back-label">
    <span>답안지 뒷면</span>
    <small>탭하여 앞면으로</small>
  </div>
</article>`
}

/** 책상용 카드 셸 — faceDown / upsideDown 지원 */
export function renderCardShell(card: OmrCard, opts: RenderOpts = {}): string {
  const compact = opts.compact ?? false
  const ori = [
    card.faceDown ? 'is-back' : '',
    card.upsideDown ? 'is-upsidedown' : '',
    compact ? 'compact' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return `
<div class="card-3d ${ori}" data-card-id="${card.id}" tabindex="0" role="button"
  aria-label="OMR ${card.handwrittenNumber}번 ${card.faceDown ? '뒷면' : ''} ${card.upsideDown ? '위아래뒤집힘' : ''}">
  <div class="card-3d-inner">
    <div class="card-face face-front">${renderOmrFront(card, { ...opts, compact })}</div>
    <div class="card-face face-back">${renderOmrBack(card)}</div>
  </div>
</div>`
}

export function renderRosterSheet(
  roster: import('./types').Student[],
  grade: number,
  classNo: number,
): string {
  const rows = roster
    .map((s) => {
      const abs = s.absent
      return `<tr class="${abs ? 'absent' : ''}">
        <td>${String(s.number).padStart(2, '0')}</td>
        <td>${s.name}</td>
        <td>${s.examId}</td>
        <td>${abs ? `<span class="abs-mark">결시</span> ${s.absentNote ?? ''}` : '응시'}</td>
      </tr>`
    })
    .join('')
  return `
<div class="roster-sheet">
  <div class="roster-sheet-head">
    <strong>${grade}학년 ${classNo}반 학생 명렬표</strong>
    <span>전국연합학력평가 · 응시 확인용</span>
  </div>
  <table>
    <thead><tr><th>번호</th><th>성명</th><th>수험번호</th><th>응시</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</div>`
}
