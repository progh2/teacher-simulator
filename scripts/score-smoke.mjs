import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import * as g from './_game.bundle.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function perfectRun(diff, seed) {
  const data = g.generateGame(diff, seed)
  const byId = new Map(data.cards.map((c) => [c.id, { ...c, faceDown: false, upsideDown: false }]))
  const order = g.expectedOrder(data.roster, data.cards)
  const sort = g.scoreSort(order, order, byId)
  const judgments = order.map((id) => {
    const card = byId.get(id)
    const errs = card.injectedErrors.filter((e) => e !== 'ok')
    return {
      cardId: id,
      selected: errs.length ? errs : ['ok'],
      disposition: g.expectedDisposition(card),
    }
  })
  const ordered = order.map((id) => byId.get(id))
  const insp = g.scoreInspection(ordered, judgments)
  const score = g.computeScore({
    headcountOk: true,
    sort,
    inspection: insp,
    timeSeconds: 30,
    cardCount: order.length,
    timedOut: false,
  })
  return { diff, seed, score, imperfect: insp.filter((c) => !c.perfect).length }
}

const results = [perfectRun('easy', 20261104), perfectRun('normal', 20261105), perfectRun('hard', 20261106)]
for (const r of results) {
  const maxSansTime = 20 + 25 + 25 + r.score.inspection.length * 8
  const expect = maxSansTime + r.score.timeBonus
  if (r.imperfect || r.score.total !== expect) {
    console.error('FAIL', r.diff, r.score, 'expect', expect, 'imperfect', r.imperfect)
    process.exit(1)
  }
  console.log(r.diff, `${r.score.total}/${r.score.maxTotal}`, 'ok')
}
writeFileSync(join(root, 'docs', 'score-smoke.json'), JSON.stringify(results.map((r) => ({ diff: r.diff, total: r.score.total, max: r.score.maxTotal })), null, 2))
