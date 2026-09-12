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

  /** Soma uma lista de custos e devolve a string pronta, respeitando a moeda
   *  escolhida. Custos "por pessoa" são multiplicados pelos viajantes. Em
   *  moeda local só soma se todos os custos forem da mesma moeda; misturado,
   *  cai para a moeda base — somar iene com euro não tem resposta honesta. */
  const somaCustos = useMemo(() => (custos) => {
    const validos = (custos || []).filter((c) => c && c.valor != null)
    if (!validos.length) return null
    const pessoas = Math.max(1, viagem.viajantes?.length || 1)
    const mult = (c) => (c.por === 'pessoa' ? pessoas : 1)
    const moedas = new Set(validos.map((c) => c.moeda || base))
    if (!emBase && moedas.size === 1) {
      const m = [...moedas][0]
      return moeda(Math.round(validos.reduce((s, c) => s + valor(c) * mult(c), 0)), m)
    }
    let total = 0
    for (const c of validos) { const v = emMoedaBase(c); if (v == null) return null; total += v * mult(c) }
    return moeda(Math.round(total), base)
  }, [emBase, base, valor, emMoedaBase, viagem])

  const moedasLocais = useMemo(() => (
    [...new Set((viagem.destinos || []).map((d) => d.moeda).filter((m) => m && m !== base))]
  ), [viagem, base])

  const contexto = {
    base, taxas, erroTaxas, emBase, setEmBase,
    tarifaDupla, residente, setResidente,
    moedasLocais, fmt, emMoedaBase, valor, somaCustos,
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
  return (
    <>
      {moedasLocais.length > 0 && (
        <div className="seg" role="group" aria-label="Moeda dos preços">
          <button aria-pressed={!emBase} onClick={() => setEmBase(false)} title="Preços na moeda local">{moedasLocais[0]}</button>
          <button aria-pressed={emBase} onClick={() => setEmBase(true)} title={`Convertido para ${base}, já com IOF e spread`}>{base}</button>
        </div>
      )}
      {tarifaDupla && (
        <div className="seg" role="group" aria-label={tarifaDupla.rotulo || 'Tarifa'}>
          <button aria-pressed={residente} onClick={() => setResidente(true)}>{tarifaDupla.rotuloResidente || 'Residente'}</button>
          <button aria-pressed={!residente} onClick={() => setResidente(false)}>{tarifaDupla.rotuloVisitante || 'Visitante'}</button>
        </div>
      )}
    </>
  )
}
