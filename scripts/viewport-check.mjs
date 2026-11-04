/**
 * Readability check at 1280x800 and 1024x768 for sorting + inspection.
 */
import { chromium } from 'playwright'
import { createServer } from 'http'
import { readFileSync, existsSync, writeFileSync, statSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = join(__dirname, '..')
const dist = join(root, 'dist')
const out = join(root, 'docs', 'viewport-check.json')

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.ttf': 'font/ttf',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
}

function serve(port) {
  const server = createServer((req, res) => {
    let url = decodeURIComponent((req.url || '/').split('?')[0])
    if (url === '/') url = '/index.html'
    const file = join(dist, url.replace(/^\//, ''))
    if (!existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404)
      res.end('no')
      return
    }
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'text/plain' })
    res.end(readFileSync(file))
  })
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)))
}

async function measure(page) {
  return page.evaluate(() => {
    const docW = document.documentElement.clientWidth
    const docH = document.documentElement.clientHeight
    const scrollW = document.documentElement.scrollWidth
    const pile = document.querySelector('.pile-card, .omr-card, .tray-card')
    const readable = pile
      ? (() => {
          const r = pile.getBoundingClientRect()
          return r.width >= 100 && r.height >= 60
        })()
      : true
    const outside = (sel) =>
      [...document.querySelectorAll(sel)].filter((el) => {
        const r = el.getBoundingClientRect()
        return r.right > docW + 3 || r.left < -3 || r.bottom > docH + 3
      }).length
    return {
      overflowX: scrollW > docW + 4,
      scrollW,
      docW,
      docH,
      readable,
      cardsOut: outside('.pile-card'),
      slotsOut: outside('.tray-slot'),
      stage: document.querySelector('[data-stage]')?.getAttribute('data-stage') || null,
    }
  })
}

async function gotoFlow(page, seed = '20261104') {
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  await page.goto(`http://127.0.0.1:5188/?diff=easy&seed=${seed}`)
  await page.click('#tile-omr')
  await page.click('[data-diff="easy"]')
  await page.click('#btn-go')
  await page.waitForSelector('#hc-form')
  await page.fill('input[name="enrolled"]', '10')
  await page.fill('input[name="present"]', '9')
  await page.fill('input[name="absent"]', '1')
  await page.click('#hc-form button[type=submit]')
  await page.waitForSelector('[data-stage=sorting]')
  const sorting = await measure(page)
  await page.click('#btn-autosort')
  await page.click('#btn-done-sort')
  await page.waitForSelector('[data-stage=inspection]')
  const inspection = await measure(page)
  return { errors, sorting, inspection }
}

const server = await serve(5188)
const browser = await chromium.launch()
const report = {}
for (const vp of [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'tablet', width: 1024, height: 768 },
]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
  report[vp.name] = await gotoFlow(page)
  await page.close()
}
await browser.close()
server.close()
writeFileSync(out, JSON.stringify(report, null, 2))
const bad = []
for (const [k, v] of Object.entries(report)) {
  if (v.errors?.length) bad.push(`${k} console: ${v.errors.join('; ')}`)
  if (v.sorting?.overflowX) bad.push(`${k} sorting overflowX`)
  if (v.inspection?.overflowX) bad.push(`${k} inspection overflowX`)
  if (v.sorting && !v.sorting.readable) bad.push(`${k} sorting unreadable cards`)
  if (v.inspection && !v.inspection.readable) bad.push(`${k} inspection unreadable`)
  if (v.sorting?.cardsOut) bad.push(`${k} sorting cardsOut=${v.sorting.cardsOut}`)
  if (v.sorting?.slotsOut) bad.push(`${k} sorting slotsOut=${v.sorting.slotsOut}`)
}
if (bad.length) {
  console.error('VIEWPORT FAIL', bad)
  process.exit(1)
}
console.log('VIEWPORT OK')
