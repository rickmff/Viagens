import { useEffect, useState } from 'react'
import { Secao, Card, Aguardando, Falhou, Chip } from './Secao'
import { buscarClima, descricaoWMO, resumirClima } from '../lib/clima'
import { dataCurta } from '../lib/formato'

export default function Clima({ viagem }) {
  const destinos = (viagem.destinos || []).filter((d) => d.lat != null && d.lon != null)
  const [ativo, setAtivo] = useState(0)
  const [estado, setEstado] = useState({ carregando: true })

  const destino = destinos[ativo]

  useEffect(() => {
    if (!destino) return
    let cancelado = false
    setEstado({ carregando: true })
    buscarClima({
      lat: destino.lat, lon: destino.lon,
      inicio: destino.chegada || viagem.periodo?.inicio,
      fim: destino.saida || viagem.periodo?.fim,
    })
      .then((r) => { if (!cancelado) setEstado({ dados: r }) })
      .catch((e) => { if (!cancelado) setEstado({ erro: e.message }) })
    return () => { cancelado = true }
  }, [destino?.id])

  if (!destinos.length) return null

  const resumo = estado.dados ? resumirClima(estado.dados.dias) : null
  const historico = estado.dados?.tipo === 'historico'

  return (
    <Secao
      id="clima"
      titulo="Clima"
      descricao="O que esperar do tempo — é isso que decide a mala e o plano B dos dias ao ar livre."
      acao={destinos.length > 1 && (
        <div className="flex gap-1.5">
          {destinos.map((d, i) => (
            <button key={d.id} onClick={() => setAtivo(i)} aria-pressed={i === ativo}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                i === ativo ? 'border-transparent bg-acento text-white'
                            : 'border-borda text-tinta-2 hover:bg-superficie-2'}`}>
              {d.nome}
            </button>
          ))}
        </div>
      )}
    >
      <Card>
        {estado.carregando && <Aguardando>Consultando o clima de {destino.nome}…</Aguardando>}
        {estado.erro && <Falhou>Clima indisponível agora ({estado.erro}). O resto da página segue valendo.</Falhou>}

        {estado.dados && (
          <>
            <div className="mb-4 flex flex-wrap items-baseline gap-x-5 gap-y-2">
              {resumo && (
                <>
                  <p className="text-3xl font-semibold tracking-tight tabular-nums">
                    {resumo.minMedia}° – {resumo.maxMedia}°
                  </p>
                  <p className="text-sm text-tinta-2">
                    média de mínimas e máximas
                    {resumo.diasChuvosos > 0 &&
                      ` · ${resumo.diasChuvosos} de ${resumo.total} dias com chuva`}
                  </p>
                </>
              )}
              {/* Histórico não é previsão, e confundir os dois faz alguém
                  deixar o casaco em casa. O rótulo é obrigatório. */}
              {historico && (
                <Chip tom="atencao">
                  ↺ média de {estado.dados.referencia}, não previsão
                </Chip>
              )}
            </div>

            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {estado.dados.dias.map((d) => {
                const [texto, emoji] = descricaoWMO(d.codigo)
                return (
                  <div key={d.data} title={texto}
                       className="min-w-[4.5rem] shrink-0 rounded-lg bg-superficie-2 px-2.5 py-2.5 text-center">
                    <p className="text-xs text-tinta-3">{dataCurta(d.data)}</p>
                    <p className="my-1 text-xl" aria-hidden>{emoji}</p>
                    <p className="text-sm tabular-nums">
                      <strong>{Math.round(d.max)}°</strong>
                      <span className="text-tinta-3"> {Math.round(d.min)}°</span>
                    </p>
                    {d.chuvaProb != null && d.chuvaProb >= 30 && (
                      <p className="mt-0.5 text-[0.6875rem] text-acento tabular-nums">{d.chuvaProb}%</p>
                    )}
                  </div>
                )
              })}
            </div>

            <p className="mt-3 text-xs text-tinta-3">
              Dados de Open-Meteo. {historico
                ? 'Viagem distante demais para previsão — mostrando o mesmo período do ano anterior.'
                : 'Previsão para os próximos dias.'}
            </p>
          </>
        )}
      </Card>
    </Secao>
  )
}
