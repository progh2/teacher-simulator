import { chromium } from 'playwright'
import { createServer } from 'http'
import { readFileSync, existsSync, mkdirSync, statSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = join(__dirname, '..')
const dist = join(root, 'dist')
const outDir = join(root, 'docs', 'screenshots')
mkdirSync(outDir, { recursive: true })

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

async function passHeadcount(page) {
  await page.waitForSelector('[data-stage="headcount"]')
  const counts = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.roster-sheet tbody tr')]
    let absent = 0
    let present = 0
    for (const r of rows) {
      if (r.classList.contains('absent') || r.querySelector('.abs-mark')) absent++
      else present++
    }
    return { enrolled: present + absent, present, absent }
  })
  await page.fill('input[name="enrolled"]', String(counts.enrolled))
  await page.fill('input[name="present"]', String(counts.present))
  await page.fill('input[name="absent"]', String(counts.absent))
  await page.click('#hc-form button[type=submit]')
  await page.waitForSelector('[data-stage="sorting"]')
}

async function judgeCurrent(page) {
  const selected = await page.evaluate(() => {
    const out = []
    const card = document.querySelector('.zoom-canvas .omr-card')
    if (!card) return ['ok']

    const handName = card.querySelector('.hand-line.name .handwrite')?.textContent?.trim()
    const rosterHint = card.querySelector('.roster-hint')?.textContent || ''
    const rosterName = rosterHint.replace(/^명렬 대조:\s*\d+\s*/, '').replace(/\s*\(결시\)/, '').trim()
    if (handName && rosterName && handName !== rosterName) out.push('name_mismatch')

    if (card.querySelector('.proctor.is-empty')) out.push('missing_proctor')
    if (card.querySelector('.proctor.is-misplaced, .name-stamp.is-misplaced')) out.push('proctor_misplaced')
    if (card.querySelector('.tape-trace.tape-bad')) out.push('correction_tape')
    if (card.querySelector('.bub.wrong-pen')) out.push('wrong_pen')
    if (card.classList.contains('dmg-fold') || card.classList.contains('dmg-stain') || card.classList.contains('dmg-tear')) {
      out.push('damaged')
    }

    // subject digit groups
    const subj = [...card.querySelectorAll('.digit-group')].find((g) =>
      (g.querySelector('.group-label')?.textContent || '').includes('과목'),
    )
    if (subj && subj.querySelectorAll('.bub.filled').length === 0) out.push('missing_subject')

    const ansRows = [...card.querySelectorAll('.ans-row')]
    if (ansRows.some((r) => r.querySelectorAll('.bub.filled').length >= 2)) out.push('duplicate_mark')
    if (ansRows.some((r) => r.querySelectorAll('.bub.filled').length === 0)) out.push('missing_mark')
    if (card.querySelectorAll('.bub.incomplete').length > 0) out.push('incomplete_mark')

    return out.length ? out : ['ok']
  })

  for (const inp of await page.locator('#judge-form input[type=checkbox]').all()) {
    const val = await inp.getAttribute('value')
    const want = selected.includes(val)
    if (want !== (await inp.isChecked())) {
      await inp.click()
      await page.waitForTimeout(40)
    }
  }

  // disposition from e2e expected when available
  const cardId = await page.evaluate(() => {
    const order = window.__TS_E2E__?.expectedOrder
    const idx = [...document.querySelectorAll('#dot-nav .dot')].findIndex((d) => d.classList.contains('current'))
    return order?.[idx]
  })
  const wantDisp = await page.evaluate((id) => {
    const c = window.__TS_E2E__?.cards?.find((x) => x.id === id)
    return c?.disposition || 'to_subject'
  }, cardId)
  for (const inp of await page.locator('#disp-form input[type=radio]').all()) {
    const val = await inp.getAttribute('value')
    if (val === wantDisp && !(await inp.isChecked())) {
      await inp.click()
      await page.waitForTimeout(40)
    }
  }
}

async function main() {
  const port = 4177
  const server = await serve(port)
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  page.on('dialog', async (d) => d.accept())
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))

  const base = `http://127.0.0.1:${port}/`

  // Hub
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.waitForSelector('[data-stage="hub"]')
  await page.screenshot({ path: join(outDir, '01-hub.png'), fullPage: true })

  // Difficulty
  await page.click('#tile-omr')
  await page.waitForSelector('[data-stage="difficulty"]')
  await page.screenshot({ path: join(outDir, '02-difficulty.png'), fullPage: true })

  // Start easy with fixed seed via URL after startRun — click easy then inject seed by reloading with query
  // Difficulty cards: click first .diff-card
  await page.click('.diff-card')
  await page.waitForSelector('[data-stage="mode"], [data-stage="howto"]')
  if (await page.locator('[data-stage="mode"]').count()) {
    await page.screenshot({ path: join(outDir, '02b-mode.png'), fullPage: true })
    await page.locator('.mode-card[data-mode="subject_review"]').click()
  }
  await page.waitForSelector('[data-stage="howto"]')
  await page.screenshot({ path: join(outDir, '03-howto.png'), fullPage: true })

  // Force seed for reproducibility
  await page.goto(`${base}?diff=easy&mode=subject_review&seed=20261104`, { waitUntil: 'networkidle' })
  if (await page.locator('[data-stage="hub"]').count()) {
    await page.click('#tile-omr')
    await page.waitForSelector('[data-stage="difficulty"]')
    const easy = page.locator('.diff-card').filter({ hasText: '쉬움' })
    if (await easy.count()) await easy.first().click()
    else await page.click('.diff-card')
    await page.waitForSelector('[data-stage="howto"]')
  }
  if (await page.locator('[data-stage="howto"]').count()) {
    await page.click('#btn-go')
  }
  await page.waitForSelector('[data-stage="headcount"]')
  await page.screenshot({ path: join(outDir, '04-headcount.png'), fullPage: true })

  await passHeadcount(page)
  await page.screenshot({ path: join(outDir, '05-sorting-pile.png'), fullPage: true })

  // Select topmost pile card (highest z-index = last in DOM) then flip
  const pileCards = page.locator('.pile-card')
  const nPile = await pileCards.count()
  if (nPile > 0) {
    await pileCards.nth(nPile - 1).click({ force: true })
    await page.waitForTimeout(200)
    const flipBtn = page.locator('#btn-flip-sel')
    if (await flipBtn.isEnabled()) {
      await flipBtn.click()
      await page.waitForTimeout(600)
    } else {
      // force-select via evaluate if buttons stayed disabled
      await page.evaluate(() => {
        const cards = [...document.querySelectorAll('.pile-card')]
        const top = cards[cards.length - 1]
        top?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      })
      await page.waitForTimeout(300)
      if (await page.locator('#btn-flip-sel').isEnabled()) {
        await page.click('#btn-flip-sel')
        await page.waitForTimeout(600)
      }
    }
  }
  await page.screenshot({ path: join(outDir, '06-flip.png'), fullPage: true })

  await page.click('#btn-autosort')
  await page.waitForTimeout(400)
  await page.screenshot({ path: join(outDir, '07-sorting-tray.png'), fullPage: true })

  await page.click('#btn-done-sort')
  await page.waitForSelector('[data-stage="inspection"]', { timeout: 8000 })
  await page.screenshot({ path: join(outDir, '08-inspection.png'), fullPage: true })

  // Zoom in for detail shot
  await page.click('#z-in')
  await page.click('#z-in')
  await page.waitForTimeout(200)
  await page.screenshot({ path: join(outDir, '09-inspection-zoom.png'), fullPage: true })
  await page.click('#z-reset')

  const n = await page.locator('#dot-nav .dot').count()
  for (let i = 0; i < n; i++) {
    await page.locator('#dot-nav .dot').nth(i).click()
    await page.waitForTimeout(60)
    await judgeCurrent(page)
    if (i < n - 1) {
      await page.click('#btn-submit')
      await page.waitForTimeout(80)
    }
  }
  await page.screenshot({ path: join(outDir, '10-inspection-judged.png'), fullPage: true })
  await page.click('#btn-submit')
  await page.waitForSelector('[data-stage="results"]')
  await page.screenshot({ path: join(outDir, '11-results.png'), fullPage: true })

  // Mobile sorting
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${base}?diff=easy&mode=subject_review&seed=20261104`, { waitUntil: 'networkidle' })
  if (await page.locator('[data-stage="hub"]').count()) {
    await page.click('#tile-omr')
    await page.waitForSelector('[data-stage="difficulty"]')
    const easy = page.locator('.diff-card').filter({ hasText: '쉬움' })
    if (await easy.count()) await easy.first().click()
    else await page.click('.diff-card')
  }
  if (await page.locator('[data-stage="mode"]').count()) {
    await page.locator('.mode-card[data-mode="subject_review"]').click()
  }
  if (await page.locator('[data-stage="howto"]').count()) await page.click('#btn-go')
  await passHeadcount(page)
  await page.screenshot({ path: join(outDir, '12-mobile-sorting.png'), fullPage: true })

  await browser.close()
  server.close()
  if (errors.length) {
    console.error('Console errors:', errors)
    process.exit(1)
  }
  console.log('OK →', outDir)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
