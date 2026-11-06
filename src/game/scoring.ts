import { expectedDisposition } from './generator'
import type {
  CardScore,
  Disposition,
  ErrorType,
  GameScore,
  InspectionJudgment,
  InspectionMode,
  OmrCard,
  SortResult,
} from './types'

const HC = 20
const SORT_ORDER = 25
const SORT_ORI = 25
const PER_CARD = 8
const TIME_SOFT = 300

function normalize(selected: ErrorType[]): ErrorType[] {
  const set = new Set(selected)
  if (set.has('ok') && set.size > 1) set.delete('ok')
  return [...set]
}

export function scoreSort(
  playerOrder: string[],
  expected: string[],
  cardsById: Map<string, OmrCard>,
): SortResult {
  const orderCorrect =
    playerOrder.length === expected.length &&
    playerOrder.every((id, i) => id === expected[i])

  const badOrientation = playerOrder.filter((id) => {
    const c = cardsById.get(id)
    return c && (c.faceDown || c.upsideDown)
  })

  return {
    orderCorrect,
    orientationCorrect: badOrientation.length === 0,
    playerOrder,
    expectedOrder: expected,
    badOrientation,
  }
}

export function scoreInspection(
  cards: OmrCard[],
  judgments: InspectionJudgment[],
  mode: InspectionMode = 'subject_review',
): CardScore[] {
  const byId = new Map(judgments.map((j) => [j.cardId, j]))
  return cards.map((card) => {
    const exp: ErrorType[] =
      card.injectedErrors.length === 1 && card.injectedErrors[0] === 'ok'
        ? ['ok']
        : card.injectedErrors.filter((e) => e !== 'ok')
    const j = byId.get(card.id)
    const selected = normalize(j?.selected ?? [])
    const disposition: Disposition = j?.disposition ?? 'ok'
    const expectedDisp = expectedDisposition(card, mode)

    const expSet = new Set(exp)
    const selSet = new Set(selected)
    const hit = [...selSet].filter((e) => expSet.has(e))
    const missed = [...expSet].filter((e) => !selSet.has(e))
    const falsePositive = [...selSet].filter((e) => !expSet.has(e))
    const dispositionOk = disposition === expectedDisp
    const perfect =
      missed.length === 0 && falsePositive.length === 0 && hit.length === expSet.size && dispositionOk

    return {
      cardId: card.id,
      expected: exp,
      selected,
      expectedDisposition: expectedDisp,
      disposition,
      hit,
      missed,
      falsePositive,
      dispositionOk,
      perfect,
    }
  })
}

export function computeScore(opts: {
  headcountOk: boolean
  sort: SortResult
  inspection: CardScore[]
  timeSeconds: number
  cardCount: number
  timedOut: boolean
  inspectionMode: InspectionMode
}): GameScore {
  const headcountPoints = opts.headcountOk ? HC : 0
  const sortPoints =
    (opts.sort.orderCorrect ? SORT_ORDER : 0) + (opts.sort.orientationCorrect ? SORT_ORI : 0)

  let inspectionPoints = 0
  for (const c of opts.inspection) {
    if (c.perfect) inspectionPoints += PER_CARD
    else {
      inspectionPoints +=
        c.hit.length * 2 - c.missed.length * 2 - c.falsePositive.length + (c.dispositionOk ? 2 : -2)
    }
  }
  inspectionPoints = Math.max(0, inspectionPoints)

  const maxInspection = opts.cardCount * PER_CARD
  const maxTotal = HC + SORT_ORDER + SORT_ORI + maxInspection + 10
  const timeBonus = opts.timedOut
    ? 0
    : Math.max(0, Math.min(10, Math.round(10 * (1 - opts.timeSeconds / TIME_SOFT))))

  return {
    headcountOk: opts.headcountOk,
    headcountPoints,
    sortOrderOk: opts.sort.orderCorrect,
    sortOrientationOk: opts.sort.orientationCorrect,
    sortPoints,
    inspection: opts.inspection,
    inspectionPoints,
    timeSeconds: opts.timeSeconds,
    timeBonus,
    total: headcountPoints + sortPoints + inspectionPoints + timeBonus,
    maxTotal,
    timedOut: opts.timedOut,
    inspectionMode: opts.inspectionMode,
  }
}
