import { Secao, Card, Chip } from './Secao'
import { useMarcados } from '../hooks/usePersistido'
import { data, paraData } from '../lib/formato'

// Ordem de urgência, não ordem de digitação: o que esgota primeiro aparece
// primeiro. Ver pesquisa-destino/references/verificacoes.md.
const URGENCIAS = {
  'imediato':      { peso: 0, rotulo: 'Agora',            tom: 'critico' },
  'data-exata':    { peso: 1, rotulo: 'Hora marcada',     tom: 'critico' },
  'sorteio':       { peso: 2, rotulo: 'Sorteio',          tom: 'atencao' },
  'um-mes':        { peso: 3, rotulo: 'Um mês antes',     tom: 'neutro' },
  'duas-semanas':  { peso: 4, rotulo: '2 a 4 semanas',    tom: 'neutro' },
  'ultima-semana': { peso: 5, rotulo: 'Última semana',    tom: 'neutro' },
}

const diasAte = (iso) => {
  const d = paraData(iso)
  if (!d) return null
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
  return Math.round((d - hoje) / 86400000)
}

function Prazo({ reserva }) {
  const dias = diasAte(reserva.prazo)
  if (dias == null) return null
  if (dias < 0) return <Chip tom="critico">⚠ prazo venceu</Chip>
  if (dias === 0) return <Chip tom="critico">⚠ é hoje</Chip>
  if (dias <= 7) return <Chip tom="critico">⚠ faltam {dias} dias</Chip>
  if (dias <= 30) return <Chip tom="atencao">faltam {dias} dias</Chip>
  return <Chip>até {data(reserva.prazo, { day: '2-digit', month: 'short' })}</Chip>
}

function Venda({ venda }) {
  if (!venda?.noBrasil) return null
  const d = paraData(venda.noBrasil)
  const hora = d ? `${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')}` : null
  // Madrugada é a informação que decide se a pessoa põe despertador. Dizer só
  // "abre às 9h de Roma" faz ela perder o ingresso dormindo.
  const madrugada = d && d.getHours() < 7
  return (
    <p className="mt-1.5 text-sm">
      <span className="font-medium">Abre à venda</span>{' '}
      {data(venda.noBrasil, { day: '2-digit', month: 'long' })} às {hora} (horário de Brasília)
      {madrugada && <span className="ml-1.5 font-medium text-critico">— de madrugada, ponha despertador</span>}
      {venda.local && venda.fuso && (
        <span className="text-tinta-3"> · {venda.local.slice(11)} em {venda.fuso.split('/')[1]?.replace('_', ' ')}</span>
      )}
    </p>
  )
}

export default function Reservas({ viagem }) {
  const reservas = viagem.reservas || []
  const { marcados, alternar, total } = useMarcados(`viagem:${viagem.slug}:reservas`)

  // Ordenar pelo prazo real, e não pelo rótulo: uma venda que abre em três
  // dias vence um voo "imediato" que ainda tem duas semanas. Reserva sem data
  // cai para um prazo estimado a partir da urgência, para não afundar no fim.
  const ESTIMADO = { 'imediato': 0, 'data-exata': 0, 'sorteio': 14, 'um-mes': 30,
                     'duas-semanas': 21, 'ultima-semana': 60 }
  const prazoEfetivo = (r) => {
    if (r.prazo) return diasAte(r.prazo) ?? 999
    return ESTIMADO[r.urgencia] ?? 99
  }
  const ordenadas = reservas.slice().sort((a, b) => {
    const d = prazoEfetivo(a) - prazoEfetivo(b)
    if (d !== 0) return d
    return (URGENCIAS[a.urgencia]?.peso ?? 9) - (URGENCIAS[b.urgencia]?.peso ?? 9)
  })

  return (
    <Secao
      descricao="Em ordem de urgência. O que esgota primeiro está no topo — marque conforme for resolvendo."
      mostrar={reservas.length > 0}
      acao={<span className="text-sm text-tinta-2 tabular-nums">{total} de {reservas.length} feitas</span>}
    >
      <Card>
        <ul className="divide-y divide-linha">
          {ordenadas.map((r) => {
            const feito = marcados.has(r.id)
            const u = URGENCIAS[r.urgencia] || {}
            return (
              <li key={r.id} className={`flex items-start gap-3 py-3.5 first:pt-0 last:pb-0 ${feito ? 'opacity-55' : ''}`}>
                <input
                  type="checkbox" checked={feito} onChange={() => alternar(r.id)}
                  aria-label={`Marcar "${r.oQue}" como resolvido`}
                  className="mt-1 size-4 shrink-0 accent-[var(--ouro)]"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <span className={`font-medium ${feito ? 'line-through decoration-tinta-3' : ''}`}>
                      {r.oQue}
                    </span>
                    {u.rotulo && <Chip tom={u.tom}>{u.rotulo}</Chip>}
                    <Prazo reserva={r} />
                  </div>

                  <Venda venda={r.abreVendaEm} />

                  {/* Nome divergente na catraca perde a entrada, sem reembolso. */}
                  {r.nominativo && (
                    <p className="mt-1.5 text-sm text-critico">
                      <span className="font-medium">Ingresso nominativo:</span> {r.nominativo}
                    </p>
                  )}

                  {r.observacao && (
                    <p className="mt-1.5 text-sm text-tinta-2 text-pretty">{r.observacao}</p>
                  )}

                  {r.onde && (
                    <a href={r.onde} target="_blank" rel="noreferrer"
                       className="mt-1.5 inline-block text-sm text-acento underline decoration-borda underline-offset-4 hover:decoration-acento">
                      site oficial
                    </a>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </Card>
    </Secao>
  )
}
