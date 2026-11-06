import type { OmrCard, Student } from './types'

function digitCol(label: string, value: number | null, maxDigit = 9, region?: string): string {
  const cells = Array.from({ length: maxDigit + 1 }, (_, d) => {
    const filled = value !== null && value === d
    return `<span class="bub ${filled ? 'filled' : ''}" data-d="${d}"><i>${d}</i></span>`
  }).join('')
  const reg = region ? ` data-region="${region}"` : ''
  return `<div class="digit-col"${reg}><span class="digit-cap">${label}</span><div class="digit-bubs">${cells}</div></div>`
}

function twoDigitMark(label: string, value: number | null, region?: string): string {
  const tens = value === null ? null : Math.floor(value / 10)
  const ones = value === null ? null : value % 10
  const reg = region ? ` data-region="${region}"` : ''
  return `<div class="digit-group"${reg}><span class="group-label">${label}</span><div class="digit-cols">${digitCol('십', tens)}${digitCol('일', ones)}</div></div>`
}

function oneDigitMark(label: string, value: number | null, max = 9, region?: string): string {
  const reg = region ? ` data-region="${region}"` : ''
  return `<div class="digit-group"${reg}><span class="group-label">${label}</span><div class="digit-cols">${digitCol('', value, max)}</div></div>`
}

function bubbleClass(opts: {
  on: boolean
  incomplete?: boolean
  wrongPen?: boolean
  style?: string
}): string {
  const { on, incomplete, wrongPen, style } = opts
  return [
    'bub',
    'ans',
    on ? 'filled' : '',
    incomplete ? 'incomplete' : '',
    wrongPen ? 'wrong-pen' : '',
    style && style !== 'normal' ? `style-${style}` : '',
  ]
    .filter(Boolean)
    .join(' ')
}

function answerBlock(card: OmrCard, from: number, to: number): string {
  const rows = []
  for (let qi = from; qi < to; qi++) {
    const ans = card.answers[qi]
    if (!ans) continue
    const q = qi + 1
    const dup = ans.choices.length > 1
    const miss = ans.choices.length === 0 && !card.isAbsentBlank
    const inc = !!ans.incomplete
    const region =
      dup ? 'duplicate_mark' : miss ? 'missing_mark' : inc ? 'incomplete_mark' : card.wrongPen && ans.choices.length ? 'wrong_pen' : ''
    const cells = [1, 2, 3, 4, 5]
      .map((c) => {
        const on = ans.choices.includes(c)
        const cls = bubbleClass({
          on,
          incomplete: on && ans.incomplete,
          wrongPen: on && card.wrongPen,
          style: on ? ans.style : undefined,
        })
        return `<span class="${cls}"><i>${c}</i></span>`
      })
      .join('')
    const regAttr = region ? ` data-region="${region}"` : ''
    rows.push(
      `<div class="ans-row"${regAttr} data-q="${q}"><span class="qno">${String(q).padStart(2, '0')}</span>${cells}</div>`,
    )
  }
  return `<div class="ans-block">${rows.join('')}</div>`
}

export interface RenderOpts {
  student?: Student
  showRosterHint?: boolean
  compact?: boolean
  highlight?: string[]
}

function damageOverlay(card: OmrCard): string {
  if (!card.damaged) return ''
  const kind = card.damageKind ?? 'fold'
  // 카드 위에는 오류 이름 글자를 쓰지 않음. 종이 형상만.
  if (kind === 'fold') {
    return `<div class="dmg-overlay dmg-fold-mark" data-region="damaged" aria-hidden="true">
      <span class="dmg-fold-corner"></span>
      <span class="dmg-fold-crease"></span>
    </div>`
  }
  if (kind === 'stain') {
    return `<div class="dmg-overlay dmg-stain-mark" data-region="damaged" aria-hidden="true">
      <span class="dmg-stain-blob"></span><span class="dmg-stain-blob b2"></span>
    </div>`
  }
  // tear: jagged missing edge (clip via SVG mask companion + torn flap)
  return `<div class="dmg-overlay dmg-tear-mark" data-region="damaged" aria-hidden="true">
    <svg class="dmg-tear-svg" viewBox="0 0 40 220" preserveAspectRatio="none" aria-hidden="true">
      <path d="M40 0 L28 12 L36 28 L22 44 L34 60 L18 78 L32 96 L20 114 L35 132 L16 150 L30 168 L14 186 L28 204 L40 220 Z" fill="#f3eee4"/>
      <path d="M28 12 L36 28 L22 44 L34 60 L18 78 L32 96 L20 114 L35 132 L16 150 L30 168 L14 186 L28 204"
        fill="none" stroke="#c4b5a5" stroke-width="1.2"/>
    </svg>
    <span class="dmg-tear-shadow"></span>
  </div>`
}

function proctorBlock(card: OmrCard, hl: (k: string) => string): string {
  const missing = !card.proctorSigned || card.injectedErrors.includes('missing_proctor')
  const misplaced = !missing && (card.proctorStampMisplaced || card.injectedErrors.includes('proctor_misplaced'))
  const region = missing ? 'missing_proctor' : misplaced ? 'proctor_misplaced' : ''
  const name = card.proctorStampName ?? ''
  const stamp = missing
    ? ''
    : `<em class="name-stamp ${misplaced ? 'is-misplaced' : 'is-ok'}" aria-hidden="true">${name}</em>`
  return `<div class="proctor ${missing ? 'is-empty' : 'is-signed'} ${misplaced ? 'is-misplaced' : ''} ${hl('missing_proctor')} ${hl('proctor_misplaced')}"
    ${region ? `data-region="${region}"` : ''}>
    <span class="proctor-label">감독관 확인</span>
    <div class="proctor-box">${stamp}</div>
  </div>`
}

function tapeOverlay(card: OmrCard): string {
  if (!card.hasCorrectionTape) return ''
  const qi = card.correctionTapeQi ?? 0
  const mid = Math.ceil(card.answers.length / 2)
  // Place tape over the answer area in card-local % so zoom/pan keep it aligned
  const col = qi < mid ? 0 : 1
  const rowInCol = qi < mid ? qi : qi - mid
  const rowsPerCol = Math.max(1, mid)
  const topPct = 48 + (rowInCol / rowsPerCol) * 38
  const leftPct = col === 0 ? 18 : 58
  return `<div class="tape-trace ${card.correctionTapeBad ? 'tape-bad' : ''}" data-region="correction_tape"
    style="top:${topPct}%;left:${leftPct}%" title="수정테이프"></div>`
}

function absentBlock(card: OmrCard): string {
  if (!card.isAbsentBlank) return ''
  const reasons = ['병결', '사고결', '기타결', '미응시']
  const chips = reasons
    .map((r) => {
      const on = card.absentReasonOnCard === r
      return `<span class="abs-reason ${on ? 'on' : ''}">${r}</span>`
    })
    .join('')
  const mismatch = card.injectedErrors.includes('absent_mismatch')
  return `<section class="absent-block ${mismatch ? 'is-bad' : ''}" data-region="${mismatch ? 'absent_mismatch' : ''}">
    <div class="absent-check">
      <span class="bub form ${card.absentMarked ? 'filled' : ''}"><i>✓</i></span>
      <strong>결시</strong>
      <small>응시하지 않음 · 빈 답안지</small>
    </div>
    <div class="absent-reasons"><span class="group-label">결시 사유</span>${chips}</div>
    <p class="absent-note">답안 마킹 없음 · 명렬의 결시·사유와 대조</p>
  </section>`
}

export function renderOmrFront(card: OmrCard, opts: RenderOpts = {}): string {
  const { compact = false, highlight = [] } = opts
  const hl = (key: string) => (highlight.includes(key) ? 'hl-err' : '')

  const idBad = card.injectedErrors.includes('id_mark')
  const nameBad = card.injectedErrors.includes('name_mismatch')
  const subjBad = card.injectedErrors.includes('missing_subject')
  const subjNameBad = card.injectedErrors.includes('subject_name_mismatch')
  const damageCls = card.damaged ? `dmg-${card.damageKind ?? 'fold'} has-damage` : ''
  const tape = tapeOverlay(card)
  const dmg = damageOverlay(card)

  const legend = `<div class="ans-legend"><span>문항</span><span>①</span><span>②</span><span>③</span><span>④</span><span>⑤</span></div>`
  const mid = Math.ceil(card.answers.length / 2)
  const answers =
    compact || card.isAbsentBlank
      ? card.isAbsentBlank
        ? absentBlock(card)
        : ''
      : `<section class="omr-answers ${hl('duplicate_mark')} ${hl('missing_mark')} ${hl('incomplete_mark')}">
        <div class="ans-two">
          <div class="ans-col">${legend}${answerBlock(card, 0, mid)}</div>
          <div class="ans-col">${legend}${answerBlock(card, mid, card.answers.length)}</div>
        </div>
      </section>`

  const codeLabel =
    card.subjectCode == null
      ? `<span class="subj-code subj-empty">——</span>`
      : `<span class="subj-code">${String(card.subjectCode).padStart(2, '0')}</span>`

  return `
<article class="omr-card front ${compact ? 'is-compact' : ''} ${damageCls} ${card.wrongPen ? 'pen-wrong' : ''} ${card.isAbsentBlank ? 'is-absent-blank' : ''}" data-card-id="${card.id}">
  <div class="timing-marks left" aria-hidden="true"></div>
  <div class="timing-marks right" aria-hidden="true"></div>
  ${tape}
  ${dmg}
  <header class="omr-head">
    <div class="omr-brand">
      <strong>학교 정기고사</strong>
      <span>답안지 (OMR) · 연습용</span>
    </div>
    <div class="omr-subject-chip ${hl('missing_subject')}" ${subjBad ? 'data-region="missing_subject"' : ''}>
      <span class="subj-cap">과목코드</span>
      ${codeLabel}
    </div>
  </header>
  <section class="omr-id">
    <div class="hand-block ${hl('name_mismatch')} ${hl('subject_name_mismatch')}">
      <div class="hand-line"><span>학년</span><b class="handwrite">${card.handwrittenGrade}</b></div>
      <div class="hand-line"><span>반</span><b class="handwrite">${card.handwrittenClass}</b></div>
      <div class="hand-line"><span>번호</span><b class="handwrite">${String(card.handwrittenNumber).padStart(2, '0')}</b></div>
      <div class="hand-line name" ${nameBad ? 'data-region="name_mismatch"' : ''}><span>성명</span><b class="handwrite">${card.handwrittenName}</b></div>
      <div class="hand-line subject" ${subjNameBad ? 'data-region="subject_name_mismatch"' : ''}><span>과목명</span><b class="handwrite">${card.handwrittenSubject}</b></div>
    </div>
    <div class="mark-block ${hl('id_mark')} ${hl('missing_subject')}">
      ${oneDigitMark('학년', card.markedGrade, 3, idBad ? 'id_mark' : undefined)}
      ${twoDigitMark('반', card.markedClass, idBad ? 'id_mark' : undefined)}
      ${twoDigitMark('번호', card.markedNumber, idBad ? 'id_mark' : undefined)}
      ${twoDigitMark('과목', card.subjectCode, subjBad ? 'missing_subject' : undefined)}
    </div>
  </section>
  ${answers}
  <footer class="omr-foot">
    ${proctorBlock(card, hl)}
    <span class="foot-note">※ 컴퓨터용 수성 사인펜 · 수정테이프는 우리 학교 규정 기준 · 교사가 답안을 고치지 않음</span>
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

export function renderDeskThumb(card: OmrCard): string {
  const no = String(card.handwrittenNumber).padStart(2, '0')
  const ori = [
    card.faceDown ? 'is-back' : '',
    card.upsideDown ? 'is-upsidedown' : '',
  ]
    .filter(Boolean)
    .join(' ')
  const front = `
<article class="desk-thumb-face front ${card.isAbsentBlank ? 'abs-thumb' : ''}">
  <div class="thumb-stripe" aria-hidden="true"></div>
  <div class="thumb-class">${card.handwrittenGrade}-${card.handwrittenClass}</div>
  <div class="thumb-no">${no}</div>
  <div class="thumb-name">${card.handwrittenName}</div>
  <div class="thumb-meta">
    <span class="thumb-subj">${card.subjectCode ?? '??'} ${card.handwrittenSubject}</span>
  </div>
  <div class="thumb-flags">
    ${card.isAbsentBlank ? '<i class="tf warn">결시 빈장</i>' : ''}
    ${card.upsideDown ? '<i class="tf warn thumb-badge-orient">위아래!</i>' : ''}
    ${card.proctorSigned ? '' : '<i class="tf">감독?</i>'}
    ${card.hasCorrectionTape ? '<i class="tf">테이프</i>' : ''}
    ${card.wrongPen ? '<i class="tf">펜</i>' : ''}
    ${card.damaged ? '<i class="tf">손상</i>' : ''}
  </div>
</article>`
  const back = `
<article class="desk-thumb-face back">
  <div class="thumb-back-label">답안지 뒷면</div>
  <div class="thumb-badge-orient back-badge">뒤집힘</div>
</article>`
  return `
<div class="desk-thumb card-3d ${ori}" data-card-id="${card.id}" tabindex="0"
  aria-label="OMR ${card.handwrittenGrade}-${card.handwrittenClass} ${no}번 ${card.handwrittenName}">
  <div class="card-3d-inner desk-thumb-inner">
    <div class="card-face face-front">${front}</div>
    <div class="card-face face-back">${back}</div>
  </div>
</div>`
}

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
  roster: Student[],
  grade: number,
  classNo: number,
  opts?: { multiClass?: boolean; subjectLabel?: string },
): string {
  if (opts?.multiClass) {
    const classes = [...new Set(roster.map((s) => `${s.grade}-${s.classNo}`))].sort()
    return classes
      .map((key) => {
        const [g, c] = key.split('-').map(Number)
        const sub = roster
          .filter((s) => s.grade === g && s.classNo === c)
          .sort((a, b) => a.number - b.number)
        return renderRosterSheet(sub, g!, c!, { subjectLabel: opts.subjectLabel })
      })
      .join('')
  }

  const rows = [...roster]
    .sort((a, b) => a.number - b.number)
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
  const subj = opts?.subjectLabel ? ` · ${opts.subjectLabel}` : ''
  return `
<div class="roster-sheet">
  <div class="roster-sheet-head">
    <strong>${grade}학년 ${classNo}반 학생 명렬표</strong>
    <span>학교 정기고사 · 응시 확인용${subj}</span>
  </div>
  <table>
    <thead><tr><th>번호</th><th>성명</th><th>수험번호</th><th>응시</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</div>`
}
