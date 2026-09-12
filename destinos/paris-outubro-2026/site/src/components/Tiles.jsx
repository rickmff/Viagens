// Os tiles de informação. Cada um só existe se tiver conteúdo — é isso que
// permite um trip.json incompleto gerar um palco menor, não um palco furado.
// O texto pequeno (`k`) é um componente porque parte dele é ao vivo:
// "3 de 6 feitas" muda quando a pessoa marca uma reserva.
import { useMarcados } from '../hooks/usePersistido'
import { usePrecos } from '../lib/precos'
import { moeda } from '../lib/formato'
import { pontosDoMapa, totaisOrcamento, resumoViagem } from '../lib/viagem'

function KReservas({ viagem }) {
  const { total } = useMarcados(`viagem:${viagem.slug}:reservas`)
  const n = viagem.reservas?.length || 0
  const docs = viagem.documentacao?.checklist?.length || 0
  return total ? `${total} de ${n} feitas` : `${n + docs} itens com prazo`
}
function KOrcamento({ viagem }) {
  const t = totaisOrcamento(viagem)
  const base = viagem.moedaBase || viagem.casa?.moeda || 'EUR'
  if (t.temReal) return `${moeda(t.real, base)} gastos`
  return t.teto != null ? `${moeda(t.previsto, base)} de ${moeda(t.teto, base)}` : moeda(t.previsto, base)
}
function KMala({ viagem }) {
  const { total } = useMarcados(`viagem:${viagem.slug}:bagagem`)
  const n = (viagem.bagagem || []).reduce((s, g) => s + (g.itens?.length || 0), 0)
  return total ? `${total} de ${n} na mala` : `${n} itens · ${viagem.frases?.length || 0} frases`
}

export function definirTiles(viagem) {
  const v = viagem
  const d = v.documentacao
  const moedas = [...new Set((v.destinos || []).map((x) => x.moeda).filter((m) => m && m !== (v.moedaBase || v.casa?.moeda || 'EUR')))]
  const r = resumoViagem(v)
  return [
    { id: 'reservar', t: 'Reservar', kicker: 'em ordem de urgência, com prazos',
      tem: !!(v.reservas?.length || d?.visto || d?.checklist?.length),
      K: KReservas },
    { id: 'logistica', t: 'Logística', kicker: 'voos, onde dormir, como circular',
      tem: !!(v.voos?.length || v.hospedagens?.length || v.transportes?.length),
      K: () => [v.voos?.length ? `${v.voos.length} voos` : null, v.hospedagens?.length ? `${v.hospedagens.length} hospedagens` : null].filter(Boolean).join(' · ') },
    { id: 'mapa', t: 'Mapa', kicker: 'tudo que tem endereço, filtrável por dia',
      tem: pontosDoMapa(v).length > 0,
      K: () => `${pontosDoMapa(v).length} pinos · ${r.cidades} ${r.cidades === 1 ? 'cidade' : 'cidades'}` },
    { id: 'orcamento', t: 'Orçamento', kicker: moedas.length ? `com câmbio ao vivo ${moedas.join(', ')} → ${v.moedaBase || 'EUR'}` : 'seu plano, econômico e real',
      tem: !!(v.orcamento?.categorias?.length || v.orcamento?.teto || moedas.length),
      K: KOrcamento },
    { id: 'mala', t: 'Mala', kicker: 'o que levar e o que dizer',
      tem: !!(v.bagagem?.length || v.frases?.length),
      K: KMala },
    { id: 'guia', t: 'Guia', kicker: 'clima, onde comer, avisos e links',
      tem: !!(v.gastronomia?.length || v.links?.length || v.avisos?.length || (v.destinos || []).some((x) => x.lat != null)),
      K: () => [v.gastronomia?.length ? `${v.gastronomia.length} lugares para comer` : null, v.avisos?.length ? `${v.avisos.length} avisos` : null].filter(Boolean).join(' · ') || 'clima e dicas' },
  ].filter((t) => t.tem)
}

export default function Tiles({ viagem, tiles, deslocamento, aoAbrir }) {
  return (
    <section className="tiles" style={{ '--ntiles': tiles.length }}>
      {tiles.map((tile, i) => (
        <button key={tile.id} className="tile" style={{ '--i': i + deslocamento }}
                data-tile="info" data-i={i} aria-haspopup="dialog"
                onClick={(e) => aoAbrir(i, e.currentTarget)}>
          <div className="t">{tile.t}</div>
          <div className="k"><tile.K viagem={viagem} /></div>
        </button>
      ))}
    </section>
  )
}
