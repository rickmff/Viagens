import { useState } from 'react'
import { Secao, Card, Aguardando, Falhou, Rotulo } from './Secao'
import { converter, MARGEM_PADRAO } from '../lib/cambio'
import { usePrecos } from '../lib/precos'
import { moeda, numero } from '../lib/formato'

// Valores que a pessoa realmente converte de cabeça na rua, olhando um preço
// numa vitrine. Uma tabelinha assim resolve mais que uma calculadora.
const REFERENCIAS = [10, 50, 100, 500, 1000]

export default function Cambio({ viagem }) {
  const { base, taxas, erroTaxas, moedasLocais: moedas } = usePrecos()
  const [ativa, setAtiva] = useState(moedas[0])
  const [valor, setValor] = useState(100)

  if (!moedas.length) return null

  const estado = taxas ? { dados: taxas } : erroTaxas ? { erro: erroTaxas } : { carregando: true }
  const taxa = taxas?.taxas?.[ativa]

  return (
    <Secao

      titulo="Câmbio"
      descricao={`Quanto custa de verdade em ${base}, já contando IOF e spread do cartão.`}
      acao={moedas.length > 1 && (
        <div className="flex gap-1.5">
          {moedas.map((m) => (
            <button key={m} onClick={() => setAtiva(m)} aria-pressed={m === ativa}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                m === ativa ? 'border-transparent bg-acento text-plano'
                            : 'border-borda text-tinta-2 hover:bg-superficie-2'}`}>
              {m}
            </button>
          ))}
        </div>
      )}
    >
      <Card>
        {estado.carregando && <Aguardando>Buscando a cotação…</Aguardando>}
        {estado.erro && (
          <Falhou>
            Cotação indisponível agora. A referência gravada no orçamento continua valendo.
          </Falhou>
        )}

        {taxa && (
          <>
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
              <div>
                <Rotulo>Converter de {ativa} para {base}</Rotulo>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number" inputMode="decimal" min="0" value={valor}
                    onChange={(e) => setValor(Number(e.target.value))}
                    aria-label={`Valor em ${ativa}`}
                    className="w-36 rounded-lg border border-borda bg-superficie-2 px-3 py-2 text-lg tabular-nums outline-none focus:border-acento"
                  />
                  <span className="text-tinta-2">{ativa}</span>
                  <span className="text-tinta-3">=</span>
                  <strong className="text-2xl font-semibold tabular-nums">
                    {moeda(converter(valor, taxa), base)}
                  </strong>
                </div>
                <p className="mt-1.5 text-xs text-tinta-3">
                  Na taxa comercial limpa daria {moeda(valor / taxa, base)} — a diferença é a
                  margem de {Math.round(MARGEM_PADRAO * 100)}% de IOF e spread.
                </p>
              </div>

              <div className="sm:border-l sm:border-linha sm:pl-4">
                <Rotulo>De cabeça</Rotulo>
                <ul className="mt-2 space-y-1 text-sm tabular-nums">
                  {REFERENCIAS.map((n) => (
                    <li key={n} className="flex justify-between gap-4">
                      <span className="text-tinta-2">{numero(n)} {ativa}</span>
                      <span className="font-medium">{moeda(converter(n, taxa), base)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-4 border-t border-linha pt-3 text-xs text-tinta-3">
              1 {base} = {numero(taxa, 4)} {ativa} · cotação de {estado.dados.em} via {estado.dados.fonte}.
              Cartão com IOF zero sai mais barato que o mostrado aqui.
            </p>
          </>
        )}
      </Card>
    </Secao>
  )
}
