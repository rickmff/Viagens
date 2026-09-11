// Derivações do trip.json. O arquivo de dados é declarativo e cru de
// propósito; toda soma, conversão e agrupamento acontece aqui, para que os
// componentes só desenhem.

import { diasEntre } from './formato'

const vazio = (v) => v === null || v === undefined || (Array.isArray(v) && v.length === 0)

/** Uma seção só aparece se tiver conteúdo de verdade. É isso que permite um
 *  trip.json incompleto gerar um site menor em vez de um site com buracos. */
export const temConteudo = (...valores) => valores.some((v) => !vazio(v))

/** Converte um custo do trip.json para a moeda base usando as taxas de
 *  referência gravadas no orçamento. Sem taxa conhecida devolve null em vez
 *  de chutar — número errado em orçamento é pior que número ausente. */
export function paraMoedaBase(custo, viagem, taxasAoVivo = null) {
  if (!custo || custo.valor == null) return null
  const base = viagem.moedaBase || 'BRL'
  if (!custo.moeda || custo.moeda === base) return custo.valor

  const aoVivo = taxasAoVivo?.[custo.moeda]
  if (aoVivo) return custo.valor / aoVivo

  const ref = (viagem.orcamento?.cambioReferencia || [])
    .find((t) => t.de === custo.moeda && t.para === base)
  return ref ? custo.valor * ref.taxa : null
}

/** Multiplica pelo número de viajantes quando o custo é por pessoa. */
export function custoTotal(custo, viagem, taxasAoVivo = null) {
  const emBase = paraMoedaBase(custo, viagem, taxasAoVivo)
  if (emBase == null) return null
  const pessoas = Math.max(1, viagem.viajantes?.length || 1)
  return custo.por === 'pessoa' ? emBase * pessoas : emBase
}

export function resumoViagem(viagem) {
  const { inicio, fim } = viagem.periodo || {}
  const noites = inicio && fim ? diasEntre(inicio, fim) : 0
  return {
    noites,
    dias: noites + 1,
    cidades: viagem.destinos?.length || 0,
    viajantes: viagem.viajantes?.length || 1,
    paises: [...new Set((viagem.destinos || []).map((d) => d.pais).filter(Boolean))],
  }
}

/** Dias até a partida. Negativo = viagem já começou. */
export function contagemRegressiva(viagem) {
  const inicio = viagem.periodo?.inicio
  if (!inicio) return null
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
  const [a, m, d] = inicio.split('-').map(Number)
  const partida = new Date(a, m - 1, d)
  const dias = Math.round((partida - hoje) / 86400000)
  const fim = viagem.periodo?.fim
  const [fa, fm, fd] = (fim || inicio).split('-').map(Number)
  const volta = new Date(fa, fm - 1, fd)
  return { dias, emViagem: dias <= 0 && hoje <= volta, terminou: hoje > volta }
}

/** Todos os pontos geolocalizados da viagem, prontos para virar pino. */
export function pontosDoMapa(viagem) {
  const pontos = []
  const diaIndex = new Map((viagem.dias || []).map((d, i) => [d.data, i]))

  for (const dia of viagem.dias || []) {
    for (const bloco of dia.blocos || []) {
      if (bloco.lat == null || bloco.lon == null) continue
      pontos.push({
        id: `${dia.data}-${bloco.id}`,
        lat: bloco.lat, lon: bloco.lon,
        titulo: bloco.titulo,
        categoria: 'roteiro',
        dia: dia.data,
        ordemDia: diaIndex.get(dia.data) ?? 0,
        detalhe: [bloco.hora, bloco.tipo].filter(Boolean).join(' · '),
      })
    }
  }
  for (const h of viagem.hospedagens || []) {
    if (h.lat == null || h.lon == null) continue
    pontos.push({ id: `hosp-${h.id}`, lat: h.lat, lon: h.lon, titulo: h.nome,
      categoria: 'hospedagem', detalhe: 'Hospedagem' })
  }
  for (const g of viagem.gastronomia || []) {
    if (g.lat == null || g.lon == null) continue
    pontos.push({ id: `gastro-${g.nome}`, lat: g.lat, lon: g.lon, titulo: g.nome,
      categoria: 'comida', detalhe: g.tipo || 'Comer' })
  }
  return pontos
}

export function centroDoMapa(pontos, destinos = []) {
  const base = pontos.length ? pontos : destinos.filter((d) => d.lat != null)
  if (!base.length) return { centro: [0, 0], zoom: 2 }
  const lats = base.map((p) => p.lat), lons = base.map((p) => p.lon)
  const centro = [
    (Math.min(...lats) + Math.max(...lats)) / 2,
    (Math.min(...lons) + Math.max(...lons)) / 2,
  ]
  const alcance = Math.max(Math.max(...lats) - Math.min(...lats),
                           Math.max(...lons) - Math.min(...lons))
  const zoom = alcance > 20 ? 3 : alcance > 5 ? 5 : alcance > 1 ? 9 : alcance > 0.2 ? 12 : 14
  return { centro, zoom }
}

/** Soma dos custos que aparecem no roteiro — serve de conferência contra o
 *  orçamento declarado, e é o que revela roteiro caro demais para o teto. */
export function custoDoRoteiro(viagem, taxas) {
  let soma = 0, semPreco = 0
  for (const dia of viagem.dias || []) {
    for (const bloco of dia.blocos || []) {
      if (!bloco.custo) continue
      const v = custoTotal(bloco.custo, viagem, taxas)
      if (v == null) semPreco += 1
      else soma += v
    }
  }
  return { soma, semPreco }
}

export function totaisOrcamento(viagem) {
  const cats = viagem.orcamento?.categorias || []
  const previsto = cats.reduce((s, c) => s + (c.previsto || 0), 0)
  const real = cats.reduce((s, c) => s + (c.real || 0), 0)
  // Categoria sem versão econômica cai para o previsto: a coluna econômica é
  // a mesma viagem com algumas trocas, não uma viagem incompleta.
  const economico = cats.reduce((s, c) => s + (c.economico ?? c.previsto ?? 0), 0)
  const temReal = cats.some((c) => c.real != null)
  const teto = viagem.orcamento?.teto?.valor ?? null
  const reserva = viagem.orcamento?.reserva?.valor ?? 0
  return {
    previsto, real, economico, temReal, teto, reserva,
    comprometido: previsto + reserva,
    folga: teto != null ? teto - previsto - reserva : null,
    estourou: teto != null && previsto + reserva > teto,
  }
}
