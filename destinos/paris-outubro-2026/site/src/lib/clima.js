// Open-Meteo — sem chave de API, chamado direto do browser.
//
// Duas fontes, escolhidas pela distância até a viagem: previsão de verdade
// só existe até ~16 dias à frente. Para viagem daqui a meses, o histórico do
// mesmo período no ano anterior é a melhor aproximação gratuita de "como
// costuma ser nessa época" — e é honesto rotular assim na tela, porque
// apresentar histórico como previsão faria alguém deixar o casaco em casa.

const PREVISAO = 'https://api.open-meteo.com/v1/forecast'
const HISTORICO = 'https://archive-api.open-meteo.com/v1/archive'
const LIMITE_PREVISAO_DIAS = 16

export const descricaoWMO = (codigo) => {
  const t = {
    0: ['Céu limpo', '☀️'], 1: ['Predomínio de sol', '🌤️'], 2: ['Parcialmente nublado', '⛅'],
    3: ['Nublado', '☁️'], 45: ['Neblina', '🌫️'], 48: ['Neblina com geada', '🌫️'],
    51: ['Garoa fraca', '🌦️'], 53: ['Garoa', '🌦️'], 55: ['Garoa forte', '🌧️'],
    61: ['Chuva fraca', '🌦️'], 63: ['Chuva', '🌧️'], 65: ['Chuva forte', '🌧️'],
    66: ['Chuva congelante', '🌧️'], 67: ['Chuva congelante forte', '🌧️'],
    71: ['Neve fraca', '🌨️'], 73: ['Neve', '🌨️'], 75: ['Neve forte', '❄️'],
    77: ['Grãos de neve', '🌨️'], 80: ['Pancadas isoladas', '🌦️'],
    81: ['Pancadas', '🌧️'], 82: ['Pancadas fortes', '⛈️'],
    85: ['Pancadas de neve', '🌨️'], 86: ['Pancadas de neve fortes', '❄️'],
    95: ['Tempestade', '⛈️'], 96: ['Tempestade com granizo', '⛈️'],
    99: ['Tempestade com granizo', '⛈️'],
  }
  return t[codigo] || ['—', '·']
}

const diasAte = (iso) => {
  const [a, m, d] = iso.split('-').map(Number)
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
  return Math.round((new Date(a, m - 1, d) - hoje) / 86400000)
}

const menosUmAno = (iso) => {
  const [a, ...resto] = iso.split('-')
  return [Number(a) - 1, ...resto].join('-')
}

/**
 * @returns {{ tipo: 'previsao'|'historico', dias: Array, referencia?: string }}
 */
export async function buscarClima({ lat, lon, inicio, fim }) {
  if (lat == null || lon == null || !inicio) throw new Error('sem coordenada ou data')

  const distancia = diasAte(inicio)
  const usarPrevisao = distancia <= LIMITE_PREVISAO_DIAS

  const url = new URL(usarPrevisao ? PREVISAO : HISTORICO)
  url.searchParams.set('latitude', lat)
  url.searchParams.set('longitude', lon)
  url.searchParams.set('timezone', 'auto')

  if (usarPrevisao) {
    url.searchParams.set('daily',
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max')
    url.searchParams.set('forecast_days', String(Math.min(LIMITE_PREVISAO_DIAS, 16)))
  } else {
    url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum')
    url.searchParams.set('start_date', menosUmAno(inicio))
    url.searchParams.set('end_date', menosUmAno(fim || inicio))
  }

  const resposta = await fetch(url)
  if (!resposta.ok) throw new Error(`Open-Meteo respondeu ${resposta.status}`)
  const json = await resposta.json()
  const d = json.daily
  if (!d?.time?.length) throw new Error('Open-Meteo não retornou dados diários')

  const dias = d.time.map((data, i) => ({
    data,
    codigo: d.weather_code?.[i],
    max: d.temperature_2m_max?.[i],
    min: d.temperature_2m_min?.[i],
    chuvaProb: d.precipitation_probability_max?.[i] ?? null,
    chuvaMm: d.precipitation_sum?.[i] ?? null,
  }))

  return usarPrevisao
    ? { tipo: 'previsao', dias }
    : { tipo: 'historico', dias, referencia: menosUmAno(inicio).slice(0, 4) }
}

/** Resume uma série em três números — é o que cabe na cabeça de quem está
 *  decidindo o que colocar na mala. */
export function resumirClima(dias) {
  if (!dias?.length) return null
  const validos = dias.filter((d) => d.max != null && d.min != null)
  if (!validos.length) return null
  const media = (ns) => ns.reduce((s, n) => s + n, 0) / ns.length
  const chuvosos = dias.filter((d) =>
    (d.chuvaProb != null && d.chuvaProb >= 50) || (d.chuvaMm != null && d.chuvaMm >= 1)).length
  return {
    maxMedia: Math.round(media(validos.map((d) => d.max))),
    minMedia: Math.round(media(validos.map((d) => d.min))),
    diasChuvosos: chuvosos,
    total: dias.length,
  }
}
