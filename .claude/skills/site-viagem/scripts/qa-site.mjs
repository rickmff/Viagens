#!/usr/bin/env node
/**
 * Portão de qualidade do site de um destino. Roda o build, sobe o preview e
 * checa no browser real o que quebra com mais frequência.
 *
 *   node .claude/skills/site-viagem/scripts/qa-site.mjs <slug>
 *
 * Sai com código 1 quando algo falha, para poder bloquear a entrega. Um site
 * anunciado como pronto e que não abre é o pior desfecho possível aqui — mais
 * caro que não ter entregado, porque o viajante só descobre no aeroporto.
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

// ── Playwright pode estar em vários lugares; tentamos todos antes de desistir
const require = createRequire(import.meta.url)
let chromium
const CANDIDATOS = [process.env.QA_PLAYWRIGHT_DIR, SITE, RAIZ, process.cwd(),
                    '/usr/lib/node_modules', '/usr/local/lib/node_modules'].filter(Boolean)
for (const onde of CANDIDATOS) {
  try {
    chromium = require(require.resolve('playwright', { paths: [onde] })).chromium
    break
  } catch { /* tenta o próximo */ }
}
if (!chromium) {
  console.error('Playwright não encontrado. Instale uma vez:\n  npm i -g playwright && npx playwright install chromium\n' +
                '(ou aponte QA_PLAYWRIGHT_DIR para uma pasta que já o tenha)')
  process.exit(2)
}

const executablePath = process.env.PLAYWRIGHT_CHROMIUM || undefined

console.log('→ build')
const build = spawnSync('npm', ['run', 'build'], { cwd: SITE, encoding: 'utf8' })
if (build.status !== 0) {
  console.error('FALHOU: o build não passou\n' + (build.stderr || build.stdout))
  process.exit(1)
}

const PORTA = 4290 + (slug.length % 50)
console.log(`→ preview em :${PORTA}`)
const preview = spawn('npx', ['vite', 'preview', '--port', String(PORTA), '--host', '127.0.0.1'],
  { cwd: SITE, stdio: 'ignore', detached: true })

const encerrar = () => { try { process.kill(-preview.pid) } catch { /* já morreu */ } }
process.on('exit', encerrar)

const esperar = async () => {
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(`http://127.0.0.1:${PORTA}/`)).ok) return true } catch { /* ainda subindo */ }
    await new Promise((r) => setTimeout(r, 250))
  }
  return false
}

const falhas = []
mkdirSync(SAIDA, { recursive: true })

if (!await esperar()) {
  console.error('FALHOU: o preview não respondeu')
  process.exit(1)
}

const navegador = await chromium.launch({ executablePath })

for (const [nome, viewport] of [
  ['desktop', { width: 1280, height: 900 }],
  ['celular', { width: 390, height: 844 }],
]) {
  const ctx = await navegador.newContext({ viewport, locale: 'pt-BR' })
  const pg = await ctx.newPage()
  const erros = []
  pg.on('pageerror', (e) => erros.push(String(e)))
  pg.on('console', (m) => {
    // Recurso externo bloqueado (tile de mapa, API de clima) não é defeito do
    // site: ele já degrada sozinho. Erro de JS é.
    if (m.type() === 'error' && !/Failed to load resource|ERR_|net::/.test(m.text())) {
      erros.push(m.text())
    }
  })

  await pg.goto(`http://127.0.0.1:${PORTA}/`, { waitUntil: 'domcontentloaded' })
  await pg.waitForTimeout(2500)
  await pg.screenshot({ path: path.join(SAIDA, `${nome}.png`), fullPage: true })

  const r = await pg.evaluate(() => {
    const nav = [...document.querySelectorAll('nav a[href^="#"]')].map((a) => a.getAttribute('href').slice(1))
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      secoesNav: nav,
      secoesOrfas: nav.filter((id) => id && !document.getElementById(id)),
      secoesRenderizadas: document.querySelectorAll('main section').length,
      h1: document.querySelector('h1')?.textContent?.trim() || '',
      externos: [...document.querySelectorAll('a[href]')]
        .map((a) => a.getAttribute('href'))
        .filter((h) => !h.startsWith('#')),
    }
  })

  // Rolagem lateral no celular é o defeito que mais aparece e o mais fácil de
  // não notar no desktop.
  if (r.overflow > 2) falhas.push(`${nome}: rola de lado ${r.overflow}px`)
  if (r.secoesOrfas.length) falhas.push(`${nome}: menu aponta para seção inexistente: ${r.secoesOrfas.join(', ')}`)
  if (r.secoesRenderizadas === 0) falhas.push(`${nome}: nenhuma seção renderizou`)
  if (!r.h1) falhas.push(`${nome}: sem título na página`)
  if (erros.length) falhas.push(`${nome}: erro de JS: ${erros.slice(0, 3).join(' | ')}`)

  const relativos = r.externos.filter((h) => !/^https?:\/\//.test(h))
  if (relativos.length) falhas.push(`${nome}: link não absoluto: ${relativos.slice(0, 5).join(', ')}`)

  // Cada seção do menu tem que abrir de fato ao clicar.
  for (const id of r.secoesNav.slice(0, 20)) {
    if (!await pg.locator(`#${id}`).count()) continue
    await pg.click(`nav a[href="#${id}"]`)
    await pg.waitForTimeout(220)
    if (!await pg.locator(`#${id}`).isVisible()) falhas.push(`${nome}: seção #${id} não ficou visível`)
  }

  console.log(`  ${nome}: ${r.secoesRenderizadas} seções, ${r.secoesNav.length} no menu, ` +
              `${r.externos.length} links, overflow ${r.overflow}px`)
  await ctx.close()
}

await navegador.close()
encerrar()

console.log(`\ncapturas em ${SAIDA}`)
if (falhas.length) {
  console.log('\nFALHOU')
  for (const f of falhas) console.log(' -', f)
  process.exit(1)
}
console.log('\nPASSOU')
