import { Secao, Chip } from './Secao'
import { useMarcados } from '../hooks/usePersistido'
import { data, diaDaSemana, duracao } from '../lib/formato'
import { usePrecos } from '../lib/precos'

const ICONE = {
  atracao: '📍', refeicao: '🍽️', deslocamento: '🚆', descanso: '🛏️',
  compras: '🛍️', evento: '🎫', livre: '🌤️',
}

function Bloco({ bloco, feito, aoMarcar }) {
  const { fmt } = usePrecos()
  return (
    <li className="relative flex gap-3 py-3.5 first:pt-0 last:pb-0">
      {/* Marcar como feito é para usar durante a viagem, com o celular na mão:
          o alvo de toque cobre o ícone inteiro, não só o quadradinho. */}
      <button
        onClick={aoMarcar}
        aria-pressed={feito}
        aria-label={feito ? `Desmarcar ${bloco.titulo}` : `Marcar ${bloco.titulo} como feito`}
        className={`nao-imprimir mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border text-base transition-colors ${
          feito ? 'border-transparent bg-acento-suave' : 'border-borda hover:bg-superficie-2'
        }`}
      >
        {feito ? '✓' : (ICONE[bloco.tipo] || '•')}
      </button>

      <div className={`min-w-0 flex-1 ${feito ? 'opacity-55' : ''}`}>
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          {bloco.hora && (
            <span className="text-sm font-semibold tabular-nums text-acento">{bloco.hora}</span>
          )}
          <h4 className={`font-medium ${feito ? 'line-through decoration-tinta-3' : ''}`}>
            {bloco.link
              ? <a href={bloco.link} target="_blank" rel="noreferrer"
                   className="underline decoration-borda underline-offset-4 hover:decoration-acento">
                  {bloco.titulo}
                </a>
              : bloco.titulo}
          </h4>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {bloco.duracaoMin && <Chip>{duracao(bloco.duracaoMin)}</Chip>}
          {bloco.custo?.valor != null && <Chip>{fmt(bloco.custo)}</Chip>}
          {/* Reserva antecipada é o detalhe que mais estraga roteiro bonito,
              então ganha destaque em vez de virar mais uma linha de nota. */}
          {bloco.reservaNecessaria && <Chip tom="critico">⚠ reservar antes</Chip>}
        </div>

        {bloco.notas && <p className="mt-2 text-sm text-tinta-2 text-pretty">{bloco.notas}</p>}
        {bloco.alternativa && (
          <p className="mt-1.5 text-sm text-tinta-3 text-pretty">
            <span className="font-medium">Plano B:</span> {bloco.alternativa}
          </p>
        )}
      </div>
    </li>
  )
}

function Dia({ dia, destino, indice, marcados, alternar, abertoPorPadrao }) {
  const blocos = dia.blocos || []
  const feitos = blocos.filter((b) => marcados.has(`${dia.data}-${b.id}`)).length

  return (
    <details open={abertoPorPadrao} className="group border-b border-borda last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center gap-3 py-4 [&::-webkit-details-marker]:hidden">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-superficie-2 text-sm font-semibold tabular-nums">
          {indice + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-medium">{dia.titulo || `Dia ${indice + 1}`}</span>
            {destino && <span className="text-sm text-tinta-3">{destino.nome}</span>}
            {dia.cortavel && <Chip>fácil de cortar</Chip>}
          </div>
          <p className="text-sm text-tinta-2">
            {diaDaSemana(dia.data)}, {data(dia.data, { day: '2-digit', month: 'long' })}
            {blocos.length > 0 && ` · ${blocos.length} ${blocos.length === 1 ? 'parada' : 'paradas'}`}
            {feitos > 0 && ` · ${feitos} ${feitos === 1 ? 'feita' : 'feitas'}`}
          </p>
        </div>
        <span className="nao-imprimir shrink-0 text-tinta-3 transition-transform group-open:rotate-180">▾</span>
      </summary>

      <div className="pb-5 pl-0 sm:pl-13">
        {dia.notas && (
          <p className="mb-3 rounded-lg bg-superficie-2 px-3 py-2 text-sm text-tinta-2 text-pretty">
            {dia.notas}
          </p>
        )}
        {blocos.length === 0
          ? (!dia.notas && <p className="text-sm text-tinta-3">Dia livre — sem nada marcado.</p>)
          : (
            <ul className="divide-y divide-linha">
              {blocos.map((bloco) => {
                const id = `${dia.data}-${bloco.id}`
                return (
                  <Bloco key={id} bloco={bloco}
                         feito={marcados.has(id)}
                         aoMarcar={() => alternar(id)} />
                )
              })}
            </ul>
          )}
      </div>
    </details>
  )
}

export default function Roteiro({ viagem }) {
  const dias = viagem.dias || []
  const { marcados, alternar, limpar, total } = useMarcados(`viagem:${viagem.slug}:roteiro`)
  const destinos = new Map((viagem.destinos || []).map((d) => [d.id, d]))
  const hoje = new Date().toISOString().slice(0, 10)
  const emAndamento = dias.some((d) => d.data === hoje)

  return (
    <Secao
      id="roteiro"
      titulo="Roteiro"
      descricao="Dia a dia com horários, custos e o que precisa de reserva. Marque o que já fez — fica salvo neste aparelho."
      mostrar={dias.length > 0}
      acao={total > 0 && (
        <button onClick={limpar}
                className="rounded-lg border border-borda px-3 py-1.5 text-sm text-tinta-2 hover:bg-superficie-2">
          Limpar {total} marcados
        </button>
      )}
    >
      <div className="rounded-xl border border-borda bg-superficie px-4 sm:px-5">
        {dias.map((dia, i) => (
          <Dia
            key={dia.data || i}
            dia={dia}
            indice={i}
            destino={destinos.get(dia.destinoId)}
            marcados={marcados}
            alternar={alternar}
            /* Durante a viagem só o dia de hoje abre; fora dela, tudo aberto,
               porque quem está planejando quer ver o conjunto de uma vez. */
            abertoPorPadrao={emAndamento ? dia.data === hoje : true}
          />
        ))}
      </div>
    </Secao>
  )
}
