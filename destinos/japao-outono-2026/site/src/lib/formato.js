// Formatação — tudo em pt-BR. Centralizado aqui porque data e dinheiro
// aparecem em quase todo componente e divergir no formato deixa o site
// com cara de remendo.

const naoTem = (v) => v === null || v === undefined || v === ''

export function moeda(valor, codigo = 'EUR', { compacto = false } = {}) {
  if (naoTem(valor) || Number.isNaN(Number(valor))) return 'a definir'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: codigo,
    // Centavos só quando existem: uma coluna com "R$ 600,00" ao lado de
    // "R$ 12.400" fica difícil de comparar de relance.
    maximumFractionDigits: Number.isInteger(valor) || compacto || Math.abs(valor) >= 1000 ? 0 : 2,
    notation: compacto && Math.abs(valor) >= 10000 ? 'compact' : 'standard',
  }).format(valor)
}

export function numero(valor, casas = 0) {
  if (naoTem(valor)) return '—'
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  }).format(valor)
}

// Datas do trip.json são locais ("2026-10-12"), não instantes UTC. Passar
// direto para new Date() pode fazer o dia voltar um conforme o fuso, então
// construímos a data em horário local de propósito.
export function paraData(iso) {
  if (naoTem(iso)) return null
  const [dataParte, horaParte] = String(iso).split('T')
  const [a, m, d] = dataParte.split('-').map(Number)
  if (!a || !m || !d) return null
  const [h = 0, min = 0] = (horaParte || '').split(':').map(Number)
  return new Date(a, m - 1, d, h || 0, min || 0)
}

export function data(iso, opcoes = { day: '2-digit', month: 'long', year: 'numeric' }) {
  const d = paraData(iso)
  return d ? new Intl.DateTimeFormat('pt-BR', opcoes).format(d) : '—'
}

export const dataCurta = (iso) => data(iso, { day: '2-digit', month: 'short' })

// "terça-feira" → "Terça-feira". CSS capitalize maiusculizaria as duas
// palavras ("Terça-Feira"), que está errado em português.
export function diaDaSemana(iso) {
  const d = data(iso, { weekday: 'long' })
  return d.charAt(0).toUpperCase() + d.slice(1)
}

export function periodo(inicio, fim) {
  if (!inicio || !fim) return '—'
  const a = paraData(inicio), b = paraData(fim)
  const mesmoAno = a?.getFullYear() === b?.getFullYear()
  const esq = data(inicio, mesmoAno
    ? { day: '2-digit', month: 'short' }
    : { day: '2-digit', month: 'short', year: 'numeric' })
  return `${esq} – ${data(fim, { day: '2-digit', month: 'short', year: 'numeric' })}`
}

export function duracao(minutos) {
  if (naoTem(minutos)) return null
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  if (h && m) return `${h}h${String(m).padStart(2, '0')}`
  if (h) return `${h}h`
  return `${m}min`
}

export function diasEntre(inicio, fim) {
  const a = paraData(inicio), b = paraData(fim)
  if (!a || !b) return 0
  return Math.round((b - a) / 86400000)
}

export function horaNoFuso(fuso) {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit', minute: '2-digit', timeZone: fuso,
    }).format(new Date())
  } catch {
    return null
  }
}
