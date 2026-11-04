import type {
  CardScore,
  ErrorType,
  GameScore,
  InspectionJudgment,
  OmrCard,
  SortResult,
} from './types'

const SORT_ORDER = 30
const SORT_FLIP = 20
const PER_CARD = 10
const TIME_SOFT_CAP = 240 // seconds — soft target

function normalize(selected: ErrorType[]): ErrorType[] {
  const set = new Set(selected)
  if (set.has('ok') && set.size > 1) {
    set.delete('ok')
  }
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

  const stillFaceDown = playerOrder.filter((id) => cardsById.get(id)?.faceDown)
  const flipsCorrect = stillFaceDown.length === 0

  return {
    orderCorrect,
    flipsCorrect,
    playerOrder,
    expectedOrder: expected,
    stillFaceDown,
  }
}

export function scoreInspection(
  cards: OmrCard[],
  judgments: InspectionJudgment[],
): CardScore[] {
  const byId = new Map(judgments.map((j) => [j.cardId, normalize(j.selected)]))
  return cards.map((card) => {
    // if only ok was injected
    const exp =
      card.injectedErrors.length === 1 && card.injectedErrors[0] === 'ok'
        ? (['ok'] as ErrorType[])
        : card.injectedErrors.filter((e) => e !== 'ok')

    const selected = byId.get(card.id) ?? []
    const expSet = new Set(exp)
    const selSet = new Set(selected)

    const hit = [...selSet].filter((e) => expSet.has(e))
    const missed = [...expSet].filter((e) => !selSet.has(e))
    const falsePositive = [...selSet].filter((e) => !expSet.has(e))
    const perfect = missed.length === 0 && falsePositive.length === 0 && hit.length === expSet.size

    return {
      cardId: card.id,
      expected: exp,
      selected,
      hit,
      missed,
      falsePositive,
      perfect,
    }
  })
}

export function computeScore(
  sort: SortResult,
  inspection: CardScore[],
  timeSeconds: number,
  cardCount: number,
): GameScore {
  const sortPoints =
    (sort.orderCorrect ? SORT_ORDER : 0) + (sort.flipsCorrect ? SORT_FLIP : 0)

  let inspectionPoints = 0
  for (const c of inspection) {
    if (c.perfect) {
      inspectionPoints += PER_CARD
    } else {
      // partial: +2 per hit, -2 miss, -1 false positive
      inspectionPoints += c.hit.length * 2 - c.missed.length * 2 - c.falsePositive.length
    }
  }
  inspectionPoints = Math.max(0, inspectionPoints)

  const maxInspection = cardCount * PER_CARD
  const maxTotal = SORT_ORDER + SORT_FLIP + maxInspection + 10

  // time bonus up to 10 if under soft cap
  const timeBonus =
    timeSeconds <= 0
      ? 0
      : Math.max(0, Math.min(10, Math.round(10 * (1 - timeSeconds / TIME_SOFT_CAP))))

  const total = sortPoints + inspectionPoints + timeBonus

  return {
    sortOrderOk: sort.orderCorrect,
    sortFlipOk: sort.flipsCorrect,
    sortPoints,
    inspection,
    inspectionPoints,
    timeSeconds,
    timeBonus,
    total,
    maxTotal,
  }
}
