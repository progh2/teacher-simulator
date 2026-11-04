/**
 * End-to-end: hub → headcount → sort → flip → inspect → results
 * Runs easy + normal with fixed seeds. Asserts no console errors and
 * perfect scoring when answers come from window.__TS_E2E__.
 */
import { chromium } from 'playwright'
import { createServer } from 'http'
import { readFileSync, existsSync, mkdirSync, statSync, writeFileSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = join(__dirname, '..')
const dist = join(root, 'dist')
const shotDir = join(root, 'docs', 'screenshots')
mkdirSync(shotDir, { recursive: true })

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
}

function serve(port) {
  const server = createServer((req, res) => {
    let url = decodeURIComponent((req.url || '/').split('?')[0])
    if (url === '/') url = '/index.html'
    const file = join(dist, url)
    if (!file.startsWith(dist) || !existsSync(file) || statSync(file).isDirectory()) {
      res.writeHead(404)
      res.end('not found')
      return
    }
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' })
    res.end(readFileSync(file))
  })
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)))
}

async function bootDiff(page, base, diff, seed) {
  await page.goto(`${base}?diff=${diff}&seed=${seed}`, { waitUntil: 'networkidle' })
  if (await page.locator('[data-stage="hub"]').count()) {
    await page.click('#tile-omr')
    await page.waitForSelector('[data-stage="difficulty"]')
  }
  if (await page.locator('[data-stage="difficulty"]').count()) {
    await page.locator(`.diff-card[data-diff="${diff}"]`).click()
    await page.waitForSelector('[data-stage="howto"]')
  }
  if (await page.locator('[data-stage="howto"]').count()) {
    await page.click('#btn-go')
  }
  await page.waitForSelector('[data-stage="headcount"]')
}

async function passHeadcount(page) {
  const hc = await page.evaluate(() => window.__TS_E2E__.headcount)
  await page.fill('input[name="enrolled"]', String(hc.enrolled))
  await page.fill('input[name="present"]', String(hc.present))
  await page.fill('input[name="absent"]', String(hc.absent))
  await page.click('#hc-form button[type=submit]')
  await page.waitForSelector('[data-stage="sorting"]')
}

async function perfectSort(page) {
  // Flip/orient everything and place in expected roster order via evaluate + UI autosort fallback
  await page.evaluate(() => {
    // Prefer using UI button after we rewrite tray via click path; expose nothing — use autosort then reorder
  })
  await page.click('#btn-autosort')
  await page.waitForTimeout(200)
  // Reorder tray to expectedOrder if handwritten sort drifted (shouldn't)
  await page.evaluate(() => {
    const e2e = window.__TS_E2E__
    if (!e2e) return
    // autosort already flipped; force order by re-clicking done after ensuring tray length
  })
  // If any slot not ok, rebuild by moving all to pile then to tray in expected order — need game API.
  // Use DOM: click "더미로" for each tray card, then dblclick pile cards in expected order — hard.
  // Instead patch order through a synthetic confirm path: click autosort is enough if handwrittenNumber == roster.
  const bad = await page.locator('.tray-slot.slot-bad, .tray-slot.slot-warn').count()
  if (bad > 0) {
    throw new Error(`sort slots not perfect after autosort: ${bad} bad/warn`)
  }
}

async function judgePerfect(page) {
  const order = await page.evaluate(() => window.__TS_E2E__.expectedOrder)
  const cards = await page.evaluate(() => window.__TS_E2E__.cards)
  const byId = Object.fromEntries(cards.map((c) => [c.id, c]))

  for (let i = 0; i < order.length; i++) {
    await page.locator('#dot-nav .dot').nth(i).click()
    await page.waitForTimeout(40)
    const id = order[i]
    const info = byId[id]
    let selected = info.injectedErrors.filter((e) => e !== 'ok')
    if (!selected.length) selected = ['ok']
    const wantDisp = info.disposition

    for (const inp of await page.locator('#judge-form input[type=checkbox]').all()) {
      const val = await inp.getAttribute('value')
      const want = selected.includes(val)
      if (want !== (await inp.isChecked())) {
        await inp.click()
        await page.waitForTimeout(20)
      }
    }
    for (const inp of await page.locator('#disp-form input[type=radio]').all()) {
      const val = await inp.getAttribute('value')
      if (val === wantDisp && !(await inp.isChecked())) {
        await inp.click()
        await page.waitForTimeout(20)
      }
    }
    if (i < order.length - 1) {
      await page.click('#btn-submit')
      await page.waitForTimeout(50)
    }
  }
}

async function playRun(page, base, diff, seed, shotPrefix) {
  const errors = []
  const onConsole = (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`)
  }
  const onPage = (err) => errors.push(`page: ${err.message}`)
  page.on('console', onConsole)
  page.on('pageerror', onPage)
  page.on('dialog', async (d) => d.accept())

  await bootDiff(page, base, diff, seed)
  if (shotPrefix === 'easy') await page.screenshot({ path: join(shotDir, '04-headcount.png') })

  await passHeadcount(page)
  if (shotPrefix === 'easy') {
    
    await page.screenshot({ path: join(shotDir, '05-sorting-pile.png') })
    // deliberate wrong-order feedback shot
    {
      for (let k = 0; k < 2; k++) {
        const cards = page.locator('.pile-card')
        const n = await cards.count()
        if (n < 1) break
        await cards.nth(n - 1).click({ force: true })
        await page.waitForTimeout(80)
        await page.click('#btn-to-tray')
        await page.waitForTimeout(120)
      }
      const trayCount = await page.locator('.tray-slot:not(.empty-slot)').count()
      if (trayCount < 1) throw new Error('wrong-slot setup: tray empty')
      await page.locator('.tray-slot').first().scrollIntoViewIfNeeded()
      await page.waitForTimeout(100)
      await page.screenshot({ path: join(shotDir, '14-wrong-slot.png') })
      // return cards to pile
      while (await page.locator('.tray-tools [data-act="to-pile"]').count()) {
        await page.locator('.tray-tools [data-act="to-pile"]').first().click()
        await page.waitForTimeout(50)
      }
    }

    const pileCards = page.locator('.pile-card')
    const n = await pileCards.count()
    if (n > 0) {
      await pileCards.nth(n - 1).click({ force: true })
      await page.waitForTimeout(150)
      if (await page.locator('#btn-flip-sel').isEnabled()) {
        await page.click('#btn-flip-sel')
        await page.waitForTimeout(500)
      }
    }
    await page.screenshot({ path: join(shotDir, '06-flip.png') })
  }

  await perfectSort(page)
  if (shotPrefix === 'easy') {
    await page.screenshot({ path: join(shotDir, '07-sorting-tray.png') })
  }

  await page.click('#btn-done-sort')
  await page.waitForSelector('[data-stage="inspection"]', { timeout: 8000 })
  if (shotPrefix === 'easy') {
    await page.screenshot({ path: join(shotDir, '08-inspection.png') })
    await page.click('#z-in')
    await page.click('#z-in')
    // move mouse for magnifier (pointer events)
    const box = await page.locator('#zoom-viewport').boundingBox()
    if (box) {
      const mx = box.x + box.width * 0.28
      const my = box.y + box.height * 0.22
      await page.mouse.move(mx, my)
      await page.locator('#zoom-viewport').dispatchEvent('pointermove', {
        bubbles: true,
        clientX: mx,
        clientY: my,
      })
      await page.waitForTimeout(250)
      await page.evaluate(() => {
        const m = document.querySelector('#magnifier')
        if (m) m.hidden = false
      })
    }
    await page.screenshot({ path: join(shotDir, '09-inspection-zoom.png') })
    await page.click('#z-reset')
  }

  await judgePerfect(page)
  if (shotPrefix === 'easy') {
    await page.screenshot({ path: join(shotDir, '10-inspection-judged.png') })
  }
  await page.click('#btn-submit')
  await page.waitForSelector('[data-stage="results"]')
  if (shotPrefix === 'easy') {
    await page.screenshot({ path: join(shotDir, '11-results.png') })
  }

  const score = await page.evaluate(() => window.__TS_E2E__.finalScore)
  const cardCount = await page.evaluate(() => window.__TS_E2E__.expectedOrder.length)

  const expectMaxSansTime = 20 + 25 + 25 + cardCount * 8 // headcount+sort+inspection; time bonus variable
  if (!score.headcountOk) throw new Error(`${diff}: headcount not ok`)
  if (!score.sortOrderOk || !score.sortOrientationOk) throw new Error(`${diff}: sort not perfect`)
  if (score.inspectionPoints !== cardCount * 8) {
    throw new Error(`${diff}: inspection ${score.inspectionPoints} != ${cardCount * 8}`)
  }
  if (score.inspection.some((c) => !c.perfect)) {
    const bad = score.inspection.filter((c) => !c.perfect)
    throw new Error(`${diff}: imperfect cards ${JSON.stringify(bad)}`)
  }
  // total should be expectMaxSansTime + timeBonus
  const expectedTotal = expectMaxSansTime + score.timeBonus
  if (score.total !== expectedTotal) {
    throw new Error(`${diff}: total ${score.total} != ${expectedTotal} (maxTotal ${score.maxTotal})`)
  }

  page.off('console', onConsole)
  page.off('pageerror', onPage)
  return { diff, seed, score, errors, expectedTotal }
}

async function main() {
  const port = 4178
  const server = await serve(port)
  const browser = await chromium.launch()
  const base = `http://127.0.0.1:${port}/`
  const results = []

  // Hub + difficulty shots at 1280x800
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    page.on('dialog', async (d) => d.accept())
    await page.goto(base, { waitUntil: 'networkidle' })
    await page.waitForSelector('[data-stage="hub"]')
    await page.screenshot({ path: join(shotDir, '01-hub.png') })
    await page.click('#tile-omr')
    await page.waitForSelector('[data-stage="difficulty"]')
    await page.screenshot({ path: join(shotDir, '02-difficulty.png') })
    await page.locator('.diff-card[data-diff="easy"]').click()
    await page.waitForSelector('[data-stage="howto"]')
    await page.screenshot({ path: join(shotDir, '03-howto.png') })
    await page.close()
  }

  // Easy perfect run
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    const r = await playRun(page, base, 'easy', 20261104, 'easy')
    results.push(r)
    if (r.errors.length) throw new Error(`easy console errors: ${r.errors.join('; ')}`)
    await page.close()
  }

  // Normal perfect run
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    const r = await playRun(page, base, 'normal', 20261105, null)
    results.push(r)
    if (r.errors.length) throw new Error(`normal console errors: ${r.errors.join('; ')}`)
    await page.close()
  }

  // Tablet 1024x768 sorting + inspection readability
  {
    const page = await browser.newPage({ viewport: { width: 1024, height: 768 } })
    page.on('dialog', async (d) => d.accept())
    await bootDiff(page, base, 'easy', 20261104)
    await passHeadcount(page)
    await page.screenshot({ path: join(shotDir, '12-tablet-sorting.png') })
    await page.click('#btn-autosort')
    await page.click('#btn-done-sort')
    await page.waitForSelector('[data-stage="inspection"]')
    await page.screenshot({ path: join(shotDir, '13-tablet-inspection.png') })
    await page.close()
  }

  // Mobile leftover name compatibility
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
    page.on('dialog', async (d) => d.accept())
    await bootDiff(page, base, 'easy', 20261104)
    await passHeadcount(page)
    await page.screenshot({ path: join(shotDir, '12-mobile-sorting.png') })
    await page.close()
  }

  writeFileSync(
    join(root, 'docs', 'e2e-last.json'),
    JSON.stringify({ at: new Date().toISOString(), results: results.map(({ diff, seed, score, expectedTotal }) => ({ diff, seed, total: score.total, expectedTotal, maxTotal: score.maxTotal })) }, null, 2),
  )

  await browser.close()
  server.close()
  console.log('E2E OK', results.map((r) => `${r.diff}:${r.score.total}/${r.score.maxTotal}`).join(' '))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
