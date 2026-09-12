#!/usr/bin/env node
/**
 * Portão de qualidade do site de um destino. Roda o build, sobe o preview e
 * checa no browser real o que quebra com mais frequência num palco de uma
 * tela só.
 *
 *   node .claude/skills/site-viagem/scripts/qa-site.mjs <slug>
 *
 * Sai com código 1 quando algo falha, para poder bloquear a entrega. Um site
 * anunciado como pronto e que não abre é o pior desfecho possível aqui — mais
 * caro que não ter entregado, porque o viajante só descobre no aeroporto.
 *
 * Checa, em 1440×900 e 390×844:
 *   - nenhum erro de JS
 *   - o palco cabe na tela: sem rolagem vertical nem horizontal
 *   - todo bilhete e todo tile abre um modal, e Esc fecha
 *   - todo link é absoluto (nada inventado de memória com caminho relativo)
 * e grava capturas em destinos/<slug>/site/.qa/ para você olhar — o script
 * checa o que é mecânico; título estourando e tile vazio, só o olho pega.
 *
 * Precisa do Playwright, que não é dependência do site (o site tem três, de
 * propósito). Instale uma vez, onde preferir:
 *   npm i -g playwright && npx playwright install chromium
 */
import { spawn, spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const RAIZ = path.resolve(AQUI, '../../../..')
const slug = process.argv[2]
if (!slug) { console.error('uso: qa-site.mjs <slug>'); process.exit(1) }

const SITE = path.join(RAIZ, 'destinos', slug, 'site')
const SAIDA = path.join(SITE, '.qa')
if (!existsSync(SITE)) { console.error(`erro: ${SITE} não existe`); process.exit(1) }

const require = createRequire(import.meta.url)
let chromium
const CANDIDATOS = [process.env.QA_PLAYWRIGHT_DIR, SITE, RAIZ, process.cwd(),
                    '/usr/lib/node_modules', '/usr/local/lib/node_modules'].filter(Boolean)
for (const onde of CANDIDATOS) {
  try { chromium = require(require.resolve('playwright', { paths: [onde] })).chromium; break } catch { /* próximo */ }
}
if (!chromium) {
  console.error('Playwright não encontrado. Instale uma vez:\n  npm i -g playwright && npx playwright install chromium\n' +
                '(ou aponte QA_PLAYWRIGHT_DIR para uma pasta que já o tenha)')
  process.exit(2)
}
const executablePath = process.env.PLAYWRIGHT_CHROMIUM || undefined

console.log('→ build')
const build = spawnSync('npm', ['run', 'build'], { cwd: SITE, encoding: 'utf8' })
if (build.status !== 0) { console.error('FALHOU: o build não passou\n' + (build.stderr || build.stdout)); process.exit(1) }

const PORTA = 4290 + (slug.length % 50)
console.log(`→ preview em :${PORTA}`)
const preview = spawn('npx', ['vite', 'preview', '--port', String(PORTA), '--host', '127.0.0.1'],
  { cwd: SITE, stdio: 'ignore', detached: true })
const encerrar = () => { try { process.kill(-preview.pid) } catch { /* já morreu */ } }
process.on('exit', encerrar)

const esperar = async () => {
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(`http://127.0.0.1:${PORTA}/`)).ok) return true } catch { /* subindo */ }
    await new Promise((r) => setTimeout(r, 250))
  }
  return false
}
if (!await esperar()) { console.error('FALHOU: o preview não respondeu'); process.exit(1) }

const falhas = []
mkdirSync(SAIDA, { recursive: true })
const navegador = await chromium.launch({ executablePath })

for (const [nome, viewport] of [['desktop', { width: 1440, height: 900 }], ['celular', { width: 390, height: 844 }]]) {
  const ctx = await navegador.newContext({ viewport, locale: 'pt-BR' })
  const pg = await ctx.newPage()
  const erros = []
  pg.on('pageerror', (e) => erros.push(String(e)))
  pg.on('console', (m) => {
    // Recurso externo bloqueado (tile, fonte, API de clima) não é defeito do
    // site: ele degrada sozinho. Erro de JS é.
    if (m.type() === 'error' && !/Failed to load resource|ERR_|net::/.test(m.text())) erros.push(m.text())
  })

  await pg.goto(`http://127.0.0.1:${PORTA}/`, { waitUntil: 'domcontentloaded' })
  await pg.waitForTimeout(2500)
  await pg.screenshot({ path: path.join(SAIDA, `${nome}.png`) })

  const r = await pg.evaluate(() => ({
    sh: document.documentElement.scrollHeight, ih: innerHeight,
    sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
    h1: document.querySelector('h1')?.textContent?.trim() || '',
    dias: document.querySelectorAll('[data-tile="dia"]').length,
    tiles: document.querySelectorAll('[data-tile="info"]').length,
  }))

  // O palco é uma tela só. Se rola, o desenho quebrou — cabe menos conteúdo
  // ou a altura de alguma linha estourou.
  if (r.sh > r.ih + 2) falhas.push(`${nome}: a página rola verticalmente (${r.sh}px > ${r.ih}px)`)
  if (r.sw > r.cw + 2) falhas.push(`${nome}: a página rola de lado (${r.sw}px > ${r.cw}px)`)
  if (!r.h1) falhas.push(`${nome}: sem título`)
  if (r.dias === 0) falhas.push(`${nome}: nenhum bilhete de dia renderizou`)

  const hrefs = new Set()
  for (const [tipo, n] of [['dia', r.dias], ['info', r.tiles]]) {
    for (let i = 0; i < n; i++) {
      await pg.click(`[data-tile="${tipo}"][data-i="${i}"]`)
      await pg.waitForTimeout(520)
      if (!await pg.locator('.veu.aberto').count()) falhas.push(`${nome}: ${tipo} ${i} não abriu modal`)
      for (const h of await pg.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')))) hrefs.add(h)
      if (i === 0) await pg.screenshot({ path: path.join(SAIDA, `${nome}-${tipo}.png`) })
      await pg.keyboard.press('Escape')
      await pg.waitForTimeout(450)
      if (await pg.locator('.veu.aberto').count()) falhas.push(`${nome}: Esc não fechou o modal de ${tipo} ${i}`)
    }
  }
  const relativos = [...hrefs].filter((h) => !/^(https?:)?\/\//.test(h) && !h.startsWith('#') && !h.startsWith('mailto:'))
  if (relativos.length) falhas.push(`${nome}: link não absoluto: ${relativos.slice(0, 5).join(', ')}`)
  if (erros.length) falhas.push(`${nome}: erro de JS: ${erros.slice(0, 3).join(' | ')}`)

  console.log(`  ${nome}: ${r.dias} dias, ${r.tiles} tiles, ${hrefs.size} links, ${r.sh}/${r.ih}px de altura`)
  await ctx.close()
}

await navegador.close()
encerrar()
console.log(`\ncapturas em ${SAIDA} — olhe antes de entregar`)
if (falhas.length) { console.log('\nFALHOU'); for (const f of falhas) console.log(' -', f); process.exit(1) }
console.log('\nPASSOU')
