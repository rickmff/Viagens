#!/usr/bin/env node
/**
 * Gera destinos/<slug>/roteiro-<slug>.md a partir do trip.json.
 *
 *   node .claude/skills/site-viagem/scripts/gerar-roteiro.mjs <slug>
 *
 * O site é para consultar no celular; este markdown é para imprimir, mandar
 * por WhatsApp e revisar sem subir servidor nenhum. Como sai do mesmo
 * trip.json, os números nunca divergem do site — que é exatamente o problema
 * de manter o roteiro escrito à mão em paralelo.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const RAIZ = path.resolve(AQUI, '../../../..')
const slug = process.argv[2]
if (!slug) { console.error('uso: gerar-roteiro.mjs <slug>'); process.exit(1) }

const TRIP = path.join(RAIZ, 'destinos', slug, 'trip.json')
const SAIDA = path.join(RAIZ, 'destinos', slug, `roteiro-${slug}.md`)
const v = JSON.parse(readFileSync(TRIP, 'utf8'))

const base = v.moedaBase || 'BRL'
const pessoas = Math.max(1, v.viajantes?.length || 1)

const dinheiro = (n, m = base) => n == null ? 'a definir'
  : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: m,
      maximumFractionDigits: Number.isInteger(n) ? 0 : 2 }).format(n)

const custo = (c) => !c || c.valor == null ? '—'
  : dinheiro(c.valor, c.moeda || base) + (c.por === 'pessoa' ? ' pp' : '')

const dt = (iso, o = { day: '2-digit', month: 'long', year: 'numeric' }) => {
  if (!iso) return '—'
  const [d] = String(iso).split('T')
  const [a, m, x] = d.split('-').map(Number)
  return new Intl.DateTimeFormat('pt-BR', o).format(new Date(a, m - 1, x))
}
const semana = (iso) => {
  const s = dt(iso, { weekday: 'long' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const L = []
const w = (...linhas) => L.push(...linhas)
const secao = (titulo, conteudo) => { if (conteudo?.length) { w('', `## ${titulo}`, '', ...conteudo) } }

// ── Cabeçalho ──────────────────────────────────────────────────────────────
w(`# ${v.titulo}`, '')
if (v.subtitulo) w(v.subtitulo, '')
const dias = v.dias?.length || 0
w(`**${dt(v.periodo?.inicio)} a ${dt(v.periodo?.fim)} · ${pessoas} ${pessoas === 1 ? 'pessoa' : 'pessoas'}` +
  `${dias ? ` · ${dias} dias de roteiro` : ''}**`, '')
w(`> Preços em ${base} salvo indicação. "pp" = por pessoa. ` +
  `Pesquisa de ${dt(v.atualizadoEm)}; confirme o que for crítico antes de comprar.`)

// ── Reservar antes ─────────────────────────────────────────────────────────
const URG = { 'imediato': 'Agora', 'data-exata': 'Hora marcada', 'sorteio': 'Sorteio',
              'um-mes': 'Um mês antes', 'duas-semanas': '2 a 4 semanas',
              'ultima-semana': 'Última semana' }
secao('Reservar antes', (v.reservas || [])
  .slice()
  .sort((a, b) => (a.prazo || '9999').localeCompare(b.prazo || '9999'))
  .map((r, i) => {
    const partes = [`${i + 1}. **${r.oQue}** — ${URG[r.urgencia] || r.urgencia}`]
    if (r.prazo) partes.push(`até ${dt(r.prazo, { day: '2-digit', month: 'short' })}`)
    let linha = partes.join(' · ')
    if (r.abreVendaEm?.noBrasil) {
      linha += `\n   Abre à venda ${dt(r.abreVendaEm.noBrasil)} às ` +
        `${r.abreVendaEm.noBrasil.slice(11, 16).replace(':', 'h')} (Brasília).`
    }
    if (r.nominativo) linha += `\n   Ingresso nominativo: ${r.nominativo}`
    if (r.observacao) linha += `\n   ${r.observacao}`
    if (r.onde) linha += `\n   ${r.onde}`
    return linha
  }))

// ── Documentação ───────────────────────────────────────────────────────────
const d = v.documentacao
if (d) {
  const linhas = []
  if (d.visto) linhas.push(`- **Visto:** ${d.visto.necessario ? 'necessário' : 'isento'} — ${d.visto.detalhe}`)
  if (d.passaporte?.validadeMinimaMeses) linhas.push(`- **Passaporte:** válido por ${d.passaporte.validadeMinimaMeses} meses após o retorno.`)
  if (d.seguro) linhas.push(`- **Seguro:** ${d.seguro.obrigatorio ? 'obrigatório' : 'recomendado'}${d.seguro.observacao ? ` — ${d.seguro.observacao}` : ''}`)
  for (const vac of d.vacinas || []) linhas.push(`- **${vac.nome}:** ${vac.obrigatoria ? 'obrigatória' : 'recomendada'}${vac.observacao ? ` — ${vac.observacao}` : ''}`)
  for (const a of d.alfandega || []) linhas.push(`- **Alfândega:** ${a}`)
  if (d.verificadoEm) linhas.push('', `_Regras verificadas em ${dt(d.verificadoEm)}. Reconfirme perto da viagem._`)
  secao('Documentação', linhas)
}

// ── Logística ──────────────────────────────────────────────────────────────
const log = []
if (v.voos?.length) {
  log.push('### Voos', '', '| Trecho | Saída | Chegada | Companhia | Custo |', '|---|---|---|---|---|')
  for (const f of v.voos) {
    log.push(`| ${f.de} → ${f.para} | ${dt(f.partida, { day: '2-digit', month: 'short' })} ` +
      `${f.partida?.slice(11, 16) || ''} | ${dt(f.chegada, { day: '2-digit', month: 'short' })} ` +
      `${f.chegada?.slice(11, 16) || ''} | ${f.cia || '—'}${f.escalas?.length ? ` (via ${f.escalas.join(', ')})` : ''} | ${custo(f.custo)} |`)
  }
  log.push('')
}
if (v.hospedagens?.length) {
  log.push('### Hospedagem', '', '| Onde | Entrada | Saída | Custo | Por quê |', '|---|---|---|---|---|')
  for (const h of v.hospedagens) {
    log.push(`| ${h.nome} | ${dt(h.checkin, { day: '2-digit', month: 'short' })} | ` +
      `${dt(h.checkout, { day: '2-digit', month: 'short' })} | ${custo(h.custo)} | ${h.porque || '—'} |`)
  }
  log.push('')
}
if (v.transportes?.length) {
  log.push('### Transporte', '', '| O quê | Custo | Observação |', '|---|---|---|')
  for (const t of v.transportes) log.push(`| ${t.nome} | ${custo(t.custo)} | ${t.observacao || '—'} |`)
}
secao('Logística', log)

// ── Roteiro ────────────────────────────────────────────────────────────────
const destinos = new Map((v.destinos || []).map((x) => [x.id, x.nome]))
const rot = []
for (const [i, dia] of (v.dias || []).entries()) {
  rot.push(`### Dia ${i + 1} · ${semana(dia.data)}, ${dt(dia.data, { day: '2-digit', month: 'long' })}` +
    ` — ${dia.titulo || destinos.get(dia.destinoId) || ''}`)
  if (dia.cortavel) rot.push('', '_Este é um dos dias mais fáceis de cortar se a viagem encurtar._')
  if (dia.notas) rot.push('', `_${dia.notas}_`)
  if (!dia.blocos?.length) { rot.push('', 'Dia livre.', ''); continue }
  rot.push('', '| Hora | O quê | Custo |', '|---|---|---|')
  for (const b of dia.blocos) {
    let o = b.titulo
    if (b.reservaNecessaria) o += ' **(reservar antes)**'
    if (b.notas) o += `<br>${b.notas}`
    if (b.alternativa) o += `<br>_Plano B: ${b.alternativa}_`
    rot.push(`| ${b.hora || '—'} | ${o} | ${custo(b.custo)} |`)
  }
  rot.push('')
}
secao('Roteiro dia a dia', rot)

// ── Orçamento ──────────────────────────────────────────────────────────────
const o = v.orcamento
if (o?.categorias?.length) {
  const temEco = o.categorias.some((c) => c.economico != null)
  const orc = ['| Item | Seu plano |' + (temEco ? ' Econômico |' : ''),
               '|---|---:|' + (temEco ? '---:|' : '')]
  let tp = 0, te = 0
  for (const c of o.categorias) {
    tp += c.previsto || 0
    te += c.economico ?? c.previsto ?? 0
    orc.push(`| ${c.nome || c.id}${c.intocavel ? ' _(intocável)_' : ''} | ${dinheiro(c.previsto)} |` +
      (temEco ? ` ${dinheiro(c.economico ?? c.previsto)} |` : ''))
  }
  orc.push(`| **Total** | **${dinheiro(tp)}** |` + (temEco ? ` **${dinheiro(te)}** |` : ''))
  if (o.reserva?.valor) orc.push(`| Reserva para imprevistos | ${dinheiro(o.reserva.valor)} |` + (temEco ? ` ${dinheiro(o.reserva.valor)} |` : ''))
  orc.push('')
  orc.push(`Por pessoa: **${dinheiro(tp / pessoas)}**${temEco ? ` · econômico **${dinheiro(te / pessoas)}**` : ''}.`)
  if (o.teto?.valor != null) {
    const teto = o.tetoPor === 'pessoa' ? o.teto.valor * pessoas : o.teto.valor
    const folga = teto - tp - (o.reserva?.valor || 0)
    orc.push('', `Teto de ${dinheiro(teto)} (lido como ${o.tetoPor === 'pessoa' ? 'por pessoa' : 'total do grupo'}): ` +
      (folga >= 0 ? `sobram ${dinheiro(folga)}.` : `**faltam ${dinheiro(-folga)}**.`))
  }
  if (o.cambioReferencia?.length) {
    orc.push('', '_Câmbio de referência: ' + o.cambioReferencia.map((c) =>
      `1 ${c.de} = ${c.taxa} ${c.para} (${c.em})`).join(' · ') +
      '. Compras no cartão saem acima disso por causa de IOF e spread._')
  }
  secao('Orçamento', orc)
}

// ── Utilidades ─────────────────────────────────────────────────────────────
secao('Bagagem', (v.bagagem || []).flatMap((g) =>
  [`**${g.categoria}**`, ...(g.itens || []).map((i) => `- [ ] ${i}`), '']))

secao('Onde comer', (v.gastronomia || []).map((g) =>
  `- **${g.nome}**${g.faixaPreco ? ` (${g.faixaPreco})` : ''} — ${g.porque || g.tipo || ''}`))

secao('Frases', (v.frases || []).map((f) =>
  `- ${f.pt} — **${f.local}**${f.leitura ? ` (${f.leitura})` : ''}`))

secao('Avisos', (v.avisos || []).map((a) => `- **${a.nivel}:** ${a.texto}`))

secao('Links', (v.links || []).map((l) => `- [${l.titulo}](${l.url})`))

w('', '---', '', `_Gerado de \`trip.json\` em ${dt(new Date().toISOString().slice(0, 10))}. ` +
  'Para mudar qualquer coisa aqui, mude o trip.json e gere de novo._')

writeFileSync(SAIDA, L.join('\n') + '\n')
console.log(`roteiro escrito em ${SAIDA} (${L.length} linhas)`)
