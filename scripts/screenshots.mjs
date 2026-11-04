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

async function flipAll(page) {
  for (let guard = 0; guard < 30; guard++) {
    const down = page.locator('.sort-item.is-down button[data-act="flip"]')
    if ((await down.count()) === 0) break
    await down.first().click()
    await page.waitForTimeout(200)
  }
}

async function main() {
  const port = 4177
  const server = await serve(port)
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 860 } })
  page.on('dialog', async (d) => d.accept())
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))

  const base = `http://127.0.0.1:${port}/?seed=20261104`

  await page.goto(base, { waitUntil: 'networkidle' })
  await page.waitForSelector('[data-stage="title"]')
  await page.screenshot({ path: join(outDir, '01-title.png'), fullPage: true })

  await page.click('#btn-howto')
  await page.waitForSelector('[data-stage="howto"]')
  await page.screenshot({ path: join(outDir, '02-howto.png'), fullPage: true })

  await page.click('#btn-go')
  await page.waitForSelector('[data-stage="sorting"]')
  await page.screenshot({ path: join(outDir, '03-sorting.png'), fullPage: true })

  // Flip one face-down for flip shot
  const down = page.locator('.sort-item.is-down button[data-act="flip"]')
  if (await down.count()) {
    await down.first().click()
    await page.waitForTimeout(700)
  }
  await page.screenshot({ path: join(outDir, '04-flip.png'), fullPage: true })

  await flipAll(page)
  await page.click('#btn-autosort')
  await page.waitForTimeout(400)
  await page.screenshot({ path: join(outDir, '03b-sorting-ordered.png'), fullPage: true })

  await page.click('#btn-to-inspect')
  await page.waitForSelector('[data-stage="inspection"]', { timeout: 5000 })
  await page.screenshot({ path: join(outDir, '05-inspection.png'), fullPage: true })

  const n = await page.locator('#dot-nav .dot').count()
  for (let i = 0; i < n; i++) {
    await page.locator('#dot-nav .dot').nth(i).click()
    await page.waitForTimeout(80)
    const selected = []
    const rosterName = (await page.locator('.student-card dd').nth(1).textContent())?.trim()
    const handName = (await page.locator('.hand-line.name .handwrite').textContent())?.trim()
    if (rosterName && handName && rosterName !== handName) selected.push('name_mismatch')

    const subjFilled = await page.locator('.subj-wrap .bub.filled').count()
    if (subjFilled === 0) selected.push('missing_subject')

    const doubleRows = await page.locator('.ans-row').evaluateAll((rows) =>
      rows.some((r) => r.querySelectorAll('.bub.filled').length >= 2),
    )
    if (doubleRows) selected.push('double_mark')

    const missing = await page.locator('.ans-row').evaluateAll((rows) =>
      rows.some((r) => r.querySelectorAll('.bub.filled').length === 0),
    )
    if (missing) selected.push('missing_mark')

    if ((await page.locator('.bub.filled.faint').count()) > 0) selected.push('faint_mark')

    const rosterNo = Number((await page.locator('.student-card dd').nth(0).textContent())?.trim())
    const markedNo = await page
      .locator('.mark-block .bub-row')
      .nth(2)
      .locator('.bub.filled')
      .first()
      .getAttribute('data-n')
    if (markedNo && Number(markedNo) !== rosterNo) selected.push('wrong_number')

    const gradeClass = (await page.locator('.student-card dd').nth(2).textContent()) || ''
    const g = Number(gradeClass.match(/(\d+)학년/)?.[1])
    const c = Number(gradeClass.match(/(\d+)반/)?.[1])
    const mg = await page
      .locator('.mark-block .bub-row')
      .nth(0)
      .locator('.bub.filled')
      .first()
      .getAttribute('data-n')
    const mc = await page
      .locator('.mark-block .bub-row')
      .nth(1)
      .locator('.bub.filled')
      .first()
      .getAttribute('data-n')
    if ((mg && Number(mg) !== g) || (mc && Number(mc) !== c)) selected.push('wrong_grade_class')

    if (selected.length === 0) selected.push('ok')

    for (const inp of await page.locator('#judge-form input[type=checkbox]').all()) {
      const val = await inp.getAttribute('value')
      const want = selected.includes(val)
      if (want !== (await inp.isChecked())) {
        await inp.click()
        await page.waitForTimeout(50)
      }
    }

    if (i < n - 1) {
      await page.click('#btn-submit')
      await page.waitForTimeout(100)
    }
  }
  await page.screenshot({ path: join(outDir, '05b-inspection-judged.png'), fullPage: true })
  await page.click('#btn-submit')
  await page.waitForSelector('[data-stage="results"]')
  await page.screenshot({ path: join(outDir, '06-results.png'), fullPage: true })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.click('#btn-start')
  await page.waitForSelector('[data-stage="sorting"]')
  await page.screenshot({ path: join(outDir, '07-mobile-sorting.png'), fullPage: true })

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
