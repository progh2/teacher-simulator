import type { OmrCard, Student } from './types'

function bubblesRow(
  label: string,
  value: number | null,
  values: number[],
): string {
  const cells = values.map((n) => {
    const filled = value !== null && value === n
    return `<span class="bub ${filled ? 'filled' : ''}" data-n="${n}"><i>${n}</i></span>`
  })
  return `<div class="bub-row"><span class="bub-label">${label}</span><div class="bubs">${cells.join('')}</div></div>`
}

function answerGrid(card: OmrCard): string {
  const rows = card.answers.map((ans, qi) => {
    const q = qi + 1
    const cells = [1, 2, 3, 4, 5]
      .map((c) => {
        const on = ans.choices.includes(c)
        const faint = on && ans.faint
        const cls = on ? (faint ? 'filled faint' : 'filled') : ''
        return `<span class="bub ans ${cls}"><i>${c}</i></span>`
      })
      .join('')
    return `<div class="ans-row"><span class="qno">${String(q).padStart(2, '0')}</span>${cells}</div>`
  })
  return `<div class="ans-grid">${rows.join('')}</div>`
}

function subjectBlock(card: OmrCard): string {
  const digits =
    card.subjectCode === null
      ? [null, null]
      : [Math.floor(card.subjectCode / 10), card.subjectCode % 10]
  const digitRow = (which: 0 | 1, label: string) =>
    `<div class="subj-digit"><span class="subj-cap">${label}</span>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      .map(
        (d) =>
          `<span class="bub ${digits[which] === d ? 'filled' : ''}"><i>${d}</i></span>`,
      )
      .join('')}</div>`
  return `<div class="bub-row subject">
    <span class="bub-label">과목</span>
    <div class="subj-wrap">
      ${digitRow(0, '십')}
      ${digitRow(1, '일')}
    </div>
  </div>`
}

export interface RenderOpts {
  student?: Student
  showRosterHint?: boolean
  compact?: boolean
}

/** OMR 카드 앞면 */
export function renderOmrFront(card: OmrCard, opts: RenderOpts = {}): string {
  const { student, showRosterHint = false, compact = false } = opts
  const numValues = Array.from({ length: compact ? 10 : 20 }, (_, i) => i + 1)

  return `
<article class="omr-card front ${compact ? 'is-compact' : ''}" data-card-id="${card.id}">
  <header class="omr-head">
    <div class="omr-brand">
      <strong>전국연합학력평가</strong>
      <span>답안지 (OMR)</span>
    </div>
    <div class="omr-meta">응시 번호 · 마킹란</div>
  </header>
  <section class="omr-id">
    <div class="hand-block">
      <div class="hand-line"><span>학년</span><b class="handwrite">${card.handwrittenGrade}</b></div>
      <div class="hand-line"><span>반</span><b class="handwrite">${card.handwrittenClass}</b></div>
      <div class="hand-line"><span>번호</span><b class="handwrite">${String(card.handwrittenNumber).padStart(2, '0')}</b></div>
      <div class="hand-line name"><span>성명</span><b class="handwrite">${card.handwrittenName}</b></div>
      ${
        showRosterHint && student
          ? `<div class="roster-hint">명렬 대조: ${String(student.number).padStart(2, '0')} ${student.name}</div>`
          : ''
      }
    </div>
    <div class="mark-block">
      ${bubblesRow('학년', card.markedGrade, [1, 2, 3])}
      ${bubblesRow('반', card.markedClass, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])}
      ${bubblesRow('번호', card.markedNumber, numValues)}
      ${subjectBlock(card)}
    </div>
  </section>
  ${
    compact
      ? ''
      : `<section class="omr-answers">
    <div class="ans-legend"><span>문항</span><span>①</span><span>②</span><span>③</span><span>④</span><span>⑤</span></div>
    ${answerGrid(card)}
  </section>
  <footer class="omr-foot">※ 컴퓨터용 수성 사인펜으로 정확히 칠하시오</footer>`
  }
</article>`
}

export function renderOmrBack(card: OmrCard): string {
  return `
<article class="omr-card back" data-card-id="${card.id}">
  <div class="back-pattern"></div>
  <div class="back-label">
    <span>답안지 뒷면</span>
    <small>클릭하여 뒤집기</small>
  </div>
</article>`
}

export function renderCardShell(card: OmrCard, opts: RenderOpts = {}): string {
  const compact = opts.compact ?? false
  return `
<div class="card-3d ${card.faceDown ? 'is-flipped' : ''} ${compact ? 'compact' : ''}" data-card-id="${card.id}" tabindex="0" role="button" aria-label="OMR 카드 수기 ${card.handwrittenNumber}번">
  <div class="card-3d-inner">
    <div class="card-face face-front">${renderOmrFront(card, { ...opts, compact })}</div>
    <div class="card-face face-back">${renderOmrBack(card)}</div>
  </div>
</div>`
}
