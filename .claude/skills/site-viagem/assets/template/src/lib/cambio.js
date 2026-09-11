// Câmbio sem chave de API. open.er-api.com cobre moedas exóticas (VND, IDR,
// MAD) que o BCE não publica; frankfurter entra como rede de segurança se o
// primeiro estiver fora do ar.

const FONTES = [
  {
    nome: 'exchangerate-api',
    url: (base) => `https://open.er-api.com/v6/latest/${base}`,
    ler: (j) => (j.result === 'success' ? { taxas: j.rates, em: j.time_last_update_utc } : null),
  },
  {
    nome: 'frankfurter',
    url: (base) => `https://api.frankfurter.dev/v1/latest?base=${base}`,
    ler: (j) => (j.rates ? { taxas: j.rates, em: j.date } : null),
  },
]

/** Taxas a partir da moeda base: taxas['JPY'] = quantos ienes valem 1 real. */
export async function buscarTaxas(base = 'BRL') {
  let ultimoErro
  for (const fonte of FONTES) {
    try {
      const r = await fetch(fonte.url(base))
      if (!r.ok) throw new Error(`${fonte.nome} respondeu ${r.status}`)
      const lido = fonte.ler(await r.json())
      if (lido?.taxas) return { ...lido, fonte: fonte.nome }
      throw new Error(`${fonte.nome} respondeu em formato inesperado`)
    } catch (e) {
      ultimoErro = e
    }
  }
  throw ultimoErro || new Error('nenhuma fonte de câmbio respondeu')
}

/**
 * Custo real de gastar no exterior com cartão brasileiro. A taxa comercial
 * subestima em torno de 5%: IOF (3,5% sobre compras internacionais em set/2026)
 * mais o spread do emissor. Quem orça pela taxa comercial leva um susto na
 * fatura, então o padrão aqui é a taxa com a margem — e a taxa limpa aparece
 * ao lado, para a conta ficar auditável.
 */
export const MARGEM_PADRAO = 0.05

export function converter(valor, taxa, { margem = MARGEM_PADRAO } = {}) {
  if (valor == null || !taxa) return null
  return (valor / taxa) * (1 + margem)
}
