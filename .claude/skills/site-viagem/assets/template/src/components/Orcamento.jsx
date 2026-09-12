import { useState } from 'react'
import { Secao, Card, Rotulo, Chip } from './Secao'
import { moeda, numero } from '../lib/formato'
import { resumoViagem, totaisOrcamento } from '../lib/viagem'

const NOMES = {
  voos: 'Voos', hospedagem: 'Hospedagem', 'taxa-turismo': 'Taxa de turismo',
  alimentacao: 'Alimentação', 'transporte-local': 'Transporte local',
  atracoes: 'Atrações', documentacao: 'Documentação',
  conectividade: 'Conectividade', compras: 'Compras', extras: 'Extras',
}

/**
 * Uma linha por categoria. Três modos, nesta ordem de prioridade:
 *  • em viagem  — barra do gasto real contra o trilho do previsto
 *  • econômico  — a mesma viagem com as trocas que doem menos
 *  • previsto   — como o dinheiro está distribuído
 *
 * Estouro nunca é sinalizado só pela cor: vem com seta e o valor da diferença,
 * porque cor sozinha não chega a quem não distingue vermelho.
 */
function Linha({ categoria, escala, moedaBase, modo }) {
  const previsto = categoria.previsto || 0
  const real = categoria.real
  const comparando = modo === 'real' && real != null

  const valor = modo === 'economico' ? (categoria.economico ?? previsto)
    : comparando ? real : previsto
  const estourou = comparando && real > previsto
  const diferenca = comparando ? real - previsto
    : modo === 'economico' && categoria.economico != null ? categoria.economico - previsto
    : null

  const largura = (n) => `${Math.max(0, Math.min(100, (n / escala) * 100))}%`

  return (
    <div className="py-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="flex items-baseline gap-2 text-sm font-medium">
          {categoria.nome || NOMES[categoria.id] || categoria.id}
          {/* O que é a razão de ser da viagem não entra na tesoura. */}
          {categoria.intocavel && <Chip>intocável</Chip>}
        </span>
        <span className="shrink-0 text-sm tabular-nums">
          {moeda(valor, moedaBase)}
          {diferenca != null && diferenca !== 0 && (
            <span className={`ml-2 text-xs font-medium ${diferenca > 0 ? 'text-critico' : 'text-bom'}`}>
              {diferenca > 0 ? '▲' : '▼'} {moeda(Math.abs(diferenca), moedaBase)}
            </span>
          )}
        </span>
      </div>

      <div className="relative mt-1.5 h-2.5 w-full overflow-hidden rounded bg-superficie-2"
           role="img"
           aria-label={`${categoria.nome || categoria.id}: ${moeda(valor, moedaBase)}${
             diferenca != null && diferenca !== 0 ? `, ${moeda(Math.abs(diferenca), moedaBase)} ${diferenca > 0 ? 'acima' : 'abaixo'} do previsto` : ''}`}>
        {diferenca != null && diferenca !== 0 && (
          <div className="absolute inset-y-0 left-0 rounded bg-linha" style={{ width: largura(previsto) }} />
        )}
        <div className={`absolute inset-y-0 left-0 rounded ${estourou ? 'bg-critico' : 'bg-acento'}`}
             style={{ width: largura(valor) }} />
      </div>

      {categoria.observacao && (
        <p className="mt-1.5 text-xs text-tinta-3 text-pretty">{categoria.observacao}</p>
      )}
    </div>
  )
}

export default function Orcamento({ viagem }) {
  const orc = viagem.orcamento
  const categorias = (orc?.categorias || []).filter((c) => c.previsto || c.real || c.economico)
  const t = totaisOrcamento(viagem)
  const r = resumoViagem(viagem)
  const base = viagem.moedaBase || 'BRL'

  const temEconomico = categorias.some((c) => c.economico != null)
  const [modo, setModo] = useState(t.temReal ? 'real' : 'previsto')

  const escala = Math.max(1, ...categorias.map((c) =>
    Math.max(c.previsto || 0, c.real || 0, c.economico || 0)))

  const totalDoModo = modo === 'economico' ? t.economico : modo === 'real' ? t.real : t.previsto
  const porDia = r.dias ? totalDoModo / r.dias : null
  const porPessoaDia = porDia && r.viajantes ? porDia / r.viajantes : null
  const porPessoa = r.viajantes ? totalDoModo / r.viajantes : null

  // O teto pode ter sido dado por pessoa ou no total, e a diferença muda tudo.
  // Comparamos sempre contra a leitura registrada no trip.json e dizemos qual é.
  const tetoTotal = t.teto == null ? null
    : orc?.tetoPor === 'pessoa' ? t.teto * r.viajantes : t.teto
  const folga = tetoTotal == null ? null : tetoTotal - totalDoModo - t.reserva
  const estourou = folga != null && folga < 0

  const DESCRICAO = {
    real: 'Previsto contra o que já foi gasto. A barra cinza marca a previsão de cada categoria.',
    economico: 'A mesma viagem com as trocas que doem menos. A barra cinza é o plano original.',
    previsto: 'Como o dinheiro está distribuído.',
  }

  const abas = [
    { v: 'previsto', r: 'Seu plano' },
    temEconomico && { v: 'economico', r: 'Econômico' },
    t.temReal && { v: 'real', r: 'Gasto real' },
  ].filter(Boolean)

  return (
    <Secao
      descricao={DESCRICAO[modo]}
      mostrar={categorias.length > 0 || t.teto != null}
      acao={abas.length > 1 && (
        <div className="flex rounded-lg border border-borda p-0.5">
          {abas.map((a) => (
            <button key={a.v} onClick={() => setModo(a.v)} aria-pressed={modo === a.v}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                modo === a.v ? 'bg-acento text-plano' : 'text-tinta-2 hover:bg-superficie-2'}`}>
              {a.r}
            </button>
          ))}
        </div>
      )}
    >
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Card>
          <Rotulo>{modo === 'real' ? 'Gasto até agora' : modo === 'economico' ? 'Versão econômica' : 'Total previsto'}</Rotulo>
          <p className="mt-1 text-3xl font-semibold tracking-tight">{moeda(totalDoModo, base)}</p>
          <p className="mt-1 text-xs text-tinta-3">
            {porPessoa != null && r.viajantes > 1 && `${moeda(porPessoa, base)} por pessoa`}
            {modo === 'previsto' && t.reserva > 0 && `${r.viajantes > 1 ? ' · ' : ''}+ ${moeda(t.reserva, base)} de reserva`}
            {modo === 'economico' && t.economico < t.previsto &&
              ` · economiza ${moeda(t.previsto - t.economico, base)}`}
          </p>
        </Card>

        {tetoTotal != null && (
          <Card>
            <Rotulo>Teto definido</Rotulo>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{moeda(tetoTotal, base)}</p>
            <p className={`mt-1 text-xs font-medium ${estourou ? 'text-critico' : 'text-bom'}`}>
              {estourou
                ? `▲ ${moeda(Math.abs(folga), base)} acima do teto`
                : `▼ ${moeda(folga, base)} de folga`}
              <span className="ml-1 font-normal text-tinta-3">
                (teto lido como {orc?.tetoPor === 'pessoa' ? 'por pessoa' : 'total do grupo'})
              </span>
            </p>
          </Card>
        )}

        {porPessoaDia != null && (
          <Card>
            <Rotulo>Por pessoa, por dia</Rotulo>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{moeda(porPessoaDia, base)}</p>
            <p className="mt-1 text-xs text-tinta-3">
              {r.dias} dias · {r.viajantes} {r.viajantes === 1 ? 'viajante' : 'viajantes'}
            </p>
          </Card>
        )}
      </div>

      {categorias.length > 0 && (
        <Card>
          <div className="divide-y divide-linha">
            {categorias
              .slice()
              .sort((a, b) => (b.previsto || 0) - (a.previsto || 0))
              .map((c) => (
                <Linha key={c.id} categoria={c} escala={escala} moedaBase={base} modo={modo} />
              ))}
          </div>

          {modo !== 'previsto' && (
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-linha pt-3 text-sm text-tinta-2">
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="h-2.5 w-5 rounded bg-acento" />
                {modo === 'real' ? 'Gasto real' : 'Versão econômica'}
              </span>
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="h-2.5 w-5 rounded bg-linha" /> Seu plano
              </span>
              {modo === 'real' && (
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden className="h-2.5 w-5 rounded bg-critico" /> ▲ Estourou a previsão
                </span>
              )}
            </div>
          )}
        </Card>
      )}

      {(orc?.cambioReferencia || []).length > 0 && (
        <p className="mt-3 text-xs text-tinta-3">
          Convertido a {orc.cambioReferencia.map((c) =>
            `1 ${c.de} = ${numero(c.taxa, 4)} ${c.para}`).join(' · ')}
          {orc.cambioReferencia[0]?.em && ` (referência de ${orc.cambioReferencia[0].em})`}.
          Compras no cartão saem acima disso por causa de IOF e spread.
        </p>
      )}
    </Secao>
  )
}
