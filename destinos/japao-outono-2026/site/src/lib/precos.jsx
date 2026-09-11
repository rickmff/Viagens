import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { usePersistido } from '../hooks/usePersistido'
import { buscarTaxas, converter, MARGEM_PADRAO } from './cambio'
import { moeda } from './formato'

// Todo preço da página passa por aqui. Duas preferências mudam o que se lê:
//
//  • Moeda — ver em ienes (o número da etiqueta na vitrine) ou em reais (o que
//    sai do bolso). Alternar isso é o que mais se usa durante a viagem, então
//    é um botão do cabeçalho e não uma calculadora escondida numa seção.
//  • Tarifa — onde o destino cobra preços diferentes de residente e visitante.
//
// Centralizar também resolve um problema chato: as cotações são buscadas uma
// vez só, no topo, em vez de cada componente disparar o próprio fetch.

const Ctx = createContext(null)

export const usePrecos = () => useContext(Ctx)

export function PreferenciasProvider({ viagem, children }) {
  const base = viagem.moedaBase || 'BRL'
  const tarifaDupla = viagem.tarifaDupla?.ativo ? viagem.tarifaDupla : null

  const [emBase, setEmBase] = usePersistido(`viagem:${viagem.slug}:moeda-base`, true)
  const [residente, setResidente] = usePersistido(`viagem:${viagem.slug}:residente`, false)
  const [taxas, setTaxas] = useState(null)
  const [erroTaxas, setErroTaxas] = useState(null)

  useEffect(() => {
    let cancelado = false
    buscarTaxas(base)
      .then((r) => { if (!cancelado) setTaxas(r) })
      .catch((e) => { if (!cancelado) setErroTaxas(e.message) })
    return () => { cancelado = true }
  }, [base])

  const valor = useMemo(() => (custo) => {
    if (!custo) return null
    // Sem tarifa dupla, ou sem preço de residente cadastrado, `valor` vale.
    // `valor` é sempre o que o brasileiro paga, então esquecer o campo extra
    // nunca subestima o orçamento — no máximo deixa de mostrar um desconto.
    return residente && tarifaDupla && custo.valorResidente != null
      ? custo.valorResidente
      : custo.valor
  }, [residente, tarifaDupla])

  /** Número na moeda base, para somas. `null` quando não há taxa conhecida —
   *  nunca um chute, porque número errado em orçamento é pior que ausente. */
  const emMoedaBase = useMemo(() => (custo) => {
    const v = valor(custo)
    if (v == null) return null
    if (!custo.moeda || custo.moeda === base) return v
    const aoVivo = taxas?.taxas?.[custo.moeda]
    if (aoVivo) return converter(v, aoVivo)
    const ref = (viagem.orcamento?.cambioReferencia || [])
      .find((t) => t.de === custo.moeda && t.para === base)
    return ref ? v * ref.taxa * (1 + MARGEM_PADRAO) : null
  }, [valor, taxas, base, viagem])

  /** String pronta para a tela, respeitando a moeda escolhida. */
  const fmt = useMemo(() => (custo, { sufixo = true } = {}) => {
    const v = valor(custo)
    if (v == null) return 'a definir'
    const porPessoa = sufixo && custo.por === 'pessoa' ? ' / pessoa' : ''
    if (!emBase || !custo.moeda || custo.moeda === base) {
      return moeda(v, custo.moeda || base) + porPessoa
    }
    const convertido = emMoedaBase(custo)
    return convertido == null
      ? moeda(v, custo.moeda) + porPessoa
      : moeda(convertido, base) + porPessoa
  }, [valor, emBase, base, emMoedaBase])

  const moedasLocais = useMemo(() => (
    [...new Set((viagem.destinos || []).map((d) => d.moeda).filter((m) => m && m !== base))]
  ), [viagem, base])

  const contexto = {
    base, taxas, erroTaxas, emBase, setEmBase,
    tarifaDupla, residente, setResidente,
    moedasLocais, fmt, emMoedaBase, valor,
  }

  return <Ctx.Provider value={contexto}>{children}</Ctx.Provider>
}

/** Os dois botões do cabeçalho. Só aparecem quando fazem sentido: sem moeda
 *  estrangeira no roteiro não há o que converter, e sem tarifa dupla o segundo
 *  botão seria um enfeite que confunde. */
export function ControlesDePreco() {
  const p = usePrecos()
  if (!p) return null
  const { moedasLocais, emBase, setEmBase, base, tarifaDupla, residente, setResidente } = p
  if (!moedasLocais.length && !tarifaDupla) return null

  const Botao = ({ ativo, onClick, children, titulo }) => (
    <button onClick={onClick} aria-pressed={ativo} title={titulo}
      className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
        ativo ? 'bg-acento text-white' : 'text-tinta-2 hover:bg-superficie-2'}`}>
      {children}
    </button>
  )

  return (
    <div className="flex items-center gap-1.5">
      {moedasLocais.length > 0 && (
        <div className="flex rounded-lg border border-borda p-0.5"
             role="group" aria-label="Moeda dos preços">
          <Botao ativo={!emBase} onClick={() => setEmBase(false)}
                 titulo="Preços na moeda local">{moedasLocais[0]}</Botao>
          <Botao ativo={emBase} onClick={() => setEmBase(true)}
                 titulo={`Preços convertidos para ${base}, já com IOF e spread`}>{base}</Botao>
        </div>
      )}
      {tarifaDupla && (
        <div className="flex rounded-lg border border-borda p-0.5"
             role="group" aria-label={tarifaDupla.rotulo || 'Tarifa'}>
          <Botao ativo={residente} onClick={() => setResidente(true)}>
            {tarifaDupla.rotuloResidente || 'Residente'}
          </Botao>
          <Botao ativo={!residente} onClick={() => setResidente(false)}>
            {tarifaDupla.rotuloVisitante || 'Visitante'}
          </Botao>
        </div>
      )}
    </div>
  )
}
