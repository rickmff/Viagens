// Câmbio sem chave de API. open.er-api.com cobre moedas exóticas (VND, IDR,
// MAD) que o BCE não publica; frankfurter entra como rede de segurança se o
// primeiro estiver fora do ar. Dentro da zona euro nada disto roda: o site só
// busca cotação quando algum destino tem moeda diferente da de casa.

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

/** Taxas a partir da moeda de casa: taxas['JPY'] = quantos ienes vale 1 euro. */
export async function buscarTaxas(base = 'EUR') {
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
 * Custo real de gastar fora da zona euro. A taxa comercial subestima: o
 * cartão cobra uma margem que depende do banco — perto de zero num Revolut ou
 * Wise, 1% a 3% num banco tradicional. O valor certo mora no perfil e chega
 * pelo trip.json (`orcamento.margemCartao`); este é só o padrão quando ele
 * não foi informado.
 */
export const MARGEM_PADRAO = 0.02

export function converter(valor, taxa, { margem = MARGEM_PADRAO } = {}) {
  if (valor == null || !taxa) return null
  return (valor / taxa) * (1 + margem)
}
