import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import * as g from './_game.bundle.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function perfectRun(diff, seed, mode = 'subject_review') {
  const data = g.generateGame(diff, seed, mode)
  if (!g.assertRosterNameOrder(data.roster)) {
    throw new Error(`roster name order broken: ${diff}/${seed}`)
  }
  const byId = new Map(data.cards.map((c) => [c.id, { ...c, faceDown: false, upsideDown: false }]))
  const order = g.expectedOrder(data.roster, data.cards)
  const sort = g.scoreSort(order, order, byId)
  const judgments = order.map((id) => {
    const card = byId.get(id)
    const errs = card.injectedErrors.filter((e) => e !== 'ok')
    return {
      cardId: id,
      selected: errs.length ? errs : ['ok'],
      disposition: g.expectedDisposition(card, mode),
    }
  })
  const ordered = order.map((id) => byId.get(id))
  const insp = g.scoreInspection(ordered, judgments, mode)
  const score = g.computeScore({
    headcountOk: true,
    sort,
    inspection: insp,
    timeSeconds: 30,
    cardCount: order.length,
    timedOut: false,
    inspectionMode: mode,
  })
  return { diff, seed, mode, score, imperfect: insp.filter((c) => !c.perfect).length, cards: data.cards.length, subject: data.config.subjectName }
}

const results = [
  perfectRun('easy', 20261104, 'subject_review'),
  perfectRun('easy', 20261104, 'immediate'),
  perfectRun('normal', 20261105, 'subject_review'),
  perfectRun('hard', 20261106, 'subject_review'),
  perfectRun('multi', 20261107, 'subject_review'),
]

// stamp coverage across seeds
let stampHits = 0
let misplacedHits = 0
for (let seed = 1; seed <= 80; seed++) {
  if (g.seedHasMissingProctor('easy', seed)) stampHits++
  if (g.seedHasMissingProctor('normal', seed)) stampHits++
  if (g.seedHasMissingProctor('multi', seed)) stampHits++
  if (g.seedHasMisplacedProctor('easy', seed)) misplacedHits++
  if (g.seedHasMisplacedProctor('normal', seed)) misplacedHits++
  if (g.seedHasMisplacedProctor('multi', seed)) misplacedHits++
}
if (stampHits < 3) {
  console.error('FAIL missing_proctor coverage too low', stampHits)
  process.exit(1)
}
if (misplacedHits < 3) {
  console.error('FAIL proctor_misplaced coverage too low', misplacedHits)
  process.exit(1)
}
console.log('missing_proctor seeds hit', stampHits)
console.log('proctor_misplaced seeds hit', misplacedHits)

for (const r of results) {
  const maxSansTime = 20 + 25 + 25 + r.score.inspection.length * 8
  const expect = maxSansTime + r.score.timeBonus
  if (r.imperfect || r.score.total !== expect) {
    console.error('FAIL', r.diff, r.mode, r.score, 'expect', expect, 'imperfect', r.imperfect)
    process.exit(1)
  }
  console.log(r.diff, r.mode, `${r.score.total}/${r.score.maxTotal}`, 'cards', r.cards, r.subject, 'ok')
}
writeFileSync(
  join(root, 'docs', 'score-smoke.json'),
  JSON.stringify(
    {
      stampHits,
      misplacedHits,
      runs: results.map((r) => ({
        diff: r.diff,
        mode: r.mode,
        total: r.score.total,
        max: r.score.maxTotal,
        cards: r.cards,
      })),
    },
    null,
    2,
  ),
)
