import { Secao, Card, Chip, Rotulo } from './Secao'
import { data, dataCurta, duracao, paraData } from '../lib/formato'
import { usePrecos } from '../lib/precos'
import { temConteudo } from '../lib/viagem'

const TOM_STATUS = { cotado: 'neutro', reservado: 'acento', emitido: 'bom' }

function Voo({ voo }) {
  const { fmt } = usePrecos()
  const p = paraData(voo.partida), c = paraData(voo.chegada)
  const hora = (d) => d ? `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` : '—'
  // Chegar num dia diferente do embarque é regra em voo longo, e é o detalhe
  // que faz alguém reservar hotel para a noite errada.
  const virouODia = p && c && (c.toDateString() !== p.toDateString())

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <Rotulo>{voo.tipo === 'volta' ? 'Volta' : voo.tipo === 'interno' ? 'Trecho interno' : 'Ida'}</Rotulo>
        {voo.status && <Chip tom={TOM_STATUS[voo.status]}>{voo.status}</Chip>}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div>
          <p className="text-2xl font-semibold tabular-nums">{hora(p)}</p>
          <p className="text-sm font-medium">{voo.de}</p>
          <p className="text-xs text-tinta-3">{dataCurta(voo.partida)}</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-xs text-tinta-3">
            {voo.duracaoTotalMin ? duracao(voo.duracaoTotalMin) : ''}
          </p>
          <div className="my-1 h-px bg-linha" />
          <p className="text-xs text-tinta-3">
            {voo.escalas?.length ? `via ${voo.escalas.join(', ')}` : 'direto'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold tabular-nums">
            {hora(c)}
            {virouODia && <sup className="ml-0.5 text-xs text-acento">+1</sup>}
          </p>
          <p className="text-sm font-medium">{voo.para}</p>
          <p className="text-xs text-tinta-3">{dataCurta(voo.chegada)}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-linha pt-3">
        {voo.cia && <Chip>{voo.cia}</Chip>}
        {voo.voo && <Chip>{voo.voo}</Chip>}
        {voo.localizador && <Chip tom="acento">{voo.localizador}</Chip>}
        {voo.custo?.valor != null && <Chip>{fmt(voo.custo)}</Chip>}
      </div>
    </Card>
  )
}

export default function Logistica({ viagem }) {
  const { fmt } = usePrecos()
  const { voos = [], hospedagens = [], transportes = [] } = viagem
  if (!temConteudo(voos, hospedagens, transportes)) return null

  return (
    <Secao
      descricao="Voos, onde dormir e como circular. É o que já está pago ou cotado."
    >
      {voos.length > 0 && (
        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          {voos.map((v) => <Voo key={v.id} voo={v} />)}
        </div>
      )}

      {hospedagens.length > 0 && (
        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          {hospedagens.map((h) => (
            <Card key={h.id}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium">
                  {h.link
                    ? <a href={h.link} target="_blank" rel="noreferrer"
                         className="underline decoration-borda underline-offset-4 hover:decoration-acento">{h.nome}</a>
                    : h.nome}
                </h3>
                {h.status && <Chip tom={TOM_STATUS[h.status]}>{h.status}</Chip>}
              </div>
              <p className="mt-1.5 text-sm text-tinta-2">
                {data(h.checkin, { day: '2-digit', month: 'short' })} → {data(h.checkout, { day: '2-digit', month: 'short' })}
              </p>
              {h.porque && <p className="mt-2 text-sm text-tinta-2 text-pretty">{h.porque}</p>}
              {h.custo?.valor != null && (
                <p className="mt-2 text-sm font-medium">
                  {fmt(h.custo, { sufixo: false })}
                  <span className="text-tinta-3"> {h.custo.por === 'pessoa' ? '/ pessoa' : 'no total'}</span>
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      {transportes.length > 0 && (
        <Card>
          <Rotulo>Transporte e passes</Rotulo>
          <ul className="mt-2 divide-y divide-linha">
            {transportes.map((t) => (
              <li key={t.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="font-medium">{t.nome}</p>
                  {t.observacao && <p className="text-sm text-tinta-2 text-pretty">{t.observacao}</p>}
                </div>
                {t.custo?.valor != null && (
                  <span className="shrink-0 text-sm tabular-nums">{fmt(t.custo)}</span>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </Secao>
  )
}
