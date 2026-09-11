import { Secao, Card, Rotulo } from './Secao'
import { moeda, numero } from '../lib/formato'
import { resumoViagem, totaisOrcamento } from '../lib/viagem'

const NOMES = {
  voos: 'Voos', hospedagem: 'Hospedagem', alimentacao: 'Alimentação',
  'transporte-local': 'Transporte local', atracoes: 'Atrações',
  documentacao: 'Documentação', conectividade: 'Conectividade',
  compras: 'Compras', extras: 'Extras',
}

/**
 * Uma linha por categoria. Antes da viagem existe só o previsto, e a barra
 * compara categorias entre si. Durante a viagem entra o real, e aí a barra
 * passa a comparar com a própria previsão — que é a pergunta que importa
 * quando o dinheiro está saindo.
 *
 * Estouro nunca é sinalizado só pela cor: vem com seta e o valor da diferença,
 * porque cor sozinha não chega a quem não distingue vermelho.
 */
function Linha({ categoria, escala, moedaBase, comparando }) {
  const previsto = categoria.previsto || 0
  const real = categoria.real
  const valor = comparando && real != null ? real : previsto
  const estourou = comparando && real != null && real > previsto
  const diferenca = comparando && real != null ? real - previsto : null

  const largura = (n) => `${Math.max(0, Math.min(100, (n / escala) * 100))}%`

  return (
    <div className="py-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium">{categoria.nome || NOMES[categoria.id] || categoria.id}</span>
        <span className="shrink-0 text-sm tabular-nums">
          {moeda(valor, moedaBase)}
          {diferenca != null && diferenca !== 0 && (
            <span className={`ml-2 text-xs font-medium ${estourou ? 'text-critico' : 'text-bom'}`}>
              {estourou ? '▲' : '▼'} {moeda(Math.abs(diferenca), moedaBase)}
            </span>
          )}
        </span>
      </div>

      <div className="relative mt-1.5 h-2.5 w-full overflow-hidden rounded bg-superficie-2"
           role="img"
           aria-label={`${categoria.nome || categoria.id}: ${moeda(valor, moedaBase)}${
             comparando && real != null ? ` de ${moeda(previsto, moedaBase)} previstos` : ''}`}>
        {/* Trilho: o previsto vira referência discreta quando há gasto real. */}
        {comparando && real != null && (
          <div className="absolute inset-y-0 left-0 rounded bg-linha" style={{ width: largura(previsto) }} />
        )}
        <div
          className={`absolute inset-y-0 left-0 rounded ${estourou ? 'bg-critico' : 'bg-acento'}`}
          style={{ width: largura(valor) }}
        />
      </div>

      {categoria.observacao && (
        <p className="mt-1.5 text-xs text-tinta-3 text-pretty">{categoria.observacao}</p>
      )}
    </div>
  )
}

export default function Orcamento({ viagem }) {
  const orc = viagem.orcamento
  const categorias = (orc?.categorias || []).filter((c) => c.previsto || c.real)
  const t = totaisOrcamento(viagem)
  const r = resumoViagem(viagem)
  const base = viagem.moedaBase || 'BRL'
  const comparando = t.temReal

  // A escala é o maior valor em jogo, para que a maior barra encoste na borda
  // e as proporções entre categorias fiquem legíveis.
  const escala = Math.max(
    1,
    ...categorias.map((c) => Math.max(c.previsto || 0, comparando ? (c.real || 0) : 0)),
  )

  const porDia = r.dias ? (comparando ? t.real : t.previsto) / r.dias : null
  const porPessoaDia = porDia && r.viajantes ? porDia / r.viajantes : null

  return (
    <Secao
      id="orcamento"
      titulo="Orçamento"
      descricao={comparando
        ? 'Previsto contra o que já foi gasto. A barra cinza marca a previsão de cada categoria.'
        : 'Como o dinheiro está distribuído. Ainda sem gastos lançados.'}
      mostrar={categorias.length > 0 || t.teto != null}
    >
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Card>
          <Rotulo>{comparando ? 'Gasto até agora' : 'Total previsto'}</Rotulo>
          <p className="mt-1 text-3xl font-semibold tracking-tight">
            {moeda(comparando ? t.real : t.previsto, base)}
          </p>
          {t.reserva > 0 && !comparando && (
            <p className="mt-1 text-xs text-tinta-3">+ {moeda(t.reserva, base)} de reserva</p>
          )}
        </Card>

        {t.teto != null && (
          <Card>
            <Rotulo>Teto definido</Rotulo>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{moeda(t.teto, base)}</p>
            <p className={`mt-1 text-xs font-medium ${t.estourou ? 'text-critico' : 'text-bom'}`}>
              {t.estourou
                ? `▲ ${moeda(Math.abs(t.folga), base)} acima do teto`
                : `▼ ${moeda(t.folga, base)} de folga`}
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
                <Linha key={c.id} categoria={c} escala={escala}
                       moedaBase={base} comparando={comparando} />
              ))}
          </div>

          {comparando && (
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-linha pt-3 text-sm text-tinta-2">
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="h-2.5 w-5 rounded bg-acento" /> Gasto real
              </span>
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="h-2.5 w-5 rounded bg-linha" /> Previsto
              </span>
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="h-2.5 w-5 rounded bg-critico" /> ▲ Estourou a previsão
              </span>
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
