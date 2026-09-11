import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import { Secao } from './Secao'
import { dataCurta } from '../lib/formato'
import { centroDoMapa, pontosDoMapa } from '../lib/viagem'

// Cor identifica *o que é* o pino, não em que dia ele cai — três categorias
// cabem numa paleta que continua distinguível para daltônicos, enquanto uma
// cor por dia viraria arco-íris ilegível numa viagem de duas semanas. O dia
// vai no número dentro do pino e no filtro acima do mapa.
const CATEGORIAS = {
  roteiro:    { rotulo: 'Roteiro',    claro: '#2a78d6', escuro: '#3987e5' },
  hospedagem: { rotulo: 'Hospedagem', claro: '#eb6834', escuro: '#d95926' },
  comida:     { rotulo: 'Comer',      claro: '#1baf7a', escuro: '#199e70' },
}

const estaEscuro = () => {
  const stamp = document.documentElement.getAttribute('data-tema')
  if (stamp) return stamp === 'escuro'
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

function criarIcone(ponto, escuro) {
  const cat = CATEGORIAS[ponto.categoria] || CATEGORIAS.roteiro
  const cor = escuro ? cat.escuro : cat.claro
  const texto = ponto.categoria === 'roteiro' ? String(ponto.ordemDia + 1)
    : ponto.categoria === 'hospedagem' ? '🛏' : '🍽'
  // O anel na cor da superfície é o espaçador de 2px que impede pinos
  // sobrepostos de virarem uma mancha só.
  return L.divIcon({
    className: '',
    html: `<span style="
      display:grid;place-items:center;width:26px;height:26px;border-radius:999px;
      background:${cor};color:#fff;font:600 12px/1 system-ui,sans-serif;
      box-shadow:0 0 0 2px ${escuro ? '#1a1a19' : '#fcfcfb'},0 1px 3px rgba(0,0,0,.35);
    ">${texto}</span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14],
  })
}

export default function Mapa({ viagem }) {
  const elemento = useRef(null)
  const mapa = useRef(null)
  const camada = useRef(null)
  const [diaFiltro, setDiaFiltro] = useState('todos')
  const [escuro, setEscuro] = useState(estaEscuro)

  const pontos = useMemo(() => pontosDoMapa(viagem), [viagem])
  const dias = viagem.dias || []

  const visiveis = useMemo(() => (
    diaFiltro === 'todos' ? pontos : pontos.filter((p) => !p.dia || p.dia === diaFiltro)
  ), [pontos, diaFiltro])

  // O tema pode mudar por preferência do sistema ou pelo botão do cabeçalho;
  // os pinos são HTML com cor embutida, então precisam ser redesenhados.
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    const atualizar = () => setEscuro(estaEscuro())
    mq?.addEventListener('change', atualizar)
    const observador = new MutationObserver(atualizar)
    observador.observe(document.documentElement, { attributes: true, attributeFilter: ['data-tema'] })
    return () => { mq?.removeEventListener('change', atualizar); observador.disconnect() }
  }, [])

  useEffect(() => {
    if (!elemento.current || mapa.current) return
    const { centro, zoom } = centroDoMapa(pontos, viagem.destinos || [])
    mapa.current = L.map(elemento.current, { scrollWheelZoom: false }).setView(centro, zoom)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapa.current)
    camada.current = L.layerGroup().addTo(mapa.current)
    return () => { mapa.current?.remove(); mapa.current = null }
  }, [])

  useEffect(() => {
    if (!mapa.current || !camada.current) return
    camada.current.clearLayers()
    for (const p of visiveis) {
      L.marker([p.lat, p.lon], { icon: criarIcone(p, escuro), title: p.titulo })
        .bindPopup(`<strong>${p.titulo}</strong>${p.detalhe ? `<br><span style="opacity:.7">${p.detalhe}</span>` : ''}`)
        .addTo(camada.current)
    }
    if (visiveis.length) {
      mapa.current.fitBounds(L.latLngBounds(visiveis.map((p) => [p.lat, p.lon])).pad(0.25), {
        maxZoom: 15, animate: false,
      })
    }
  }, [visiveis, escuro])

  return (
    <Secao
      id="mapa"
      titulo="Mapa"
      descricao="Tudo que tem endereço, num lugar só. Filtre por dia para ver se o roteiro daquele dia fecha geograficamente."
      mostrar={pontos.length > 0}
    >
      {dias.length > 0 && (
        <div className="nao-imprimir mb-3 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[{ v: 'todos', r: 'Todos' },
            ...dias.map((d, i) => ({ v: d.data, r: `${i + 1}. ${dataCurta(d.data)}` }))
          ].map(({ v, r }) => (
            <button key={v} onClick={() => setDiaFiltro(v)}
              aria-pressed={diaFiltro === v}
              className={`shrink-0 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                diaFiltro === v
                  ? 'border-transparent bg-acento text-white'
                  : 'border-borda text-tinta-2 hover:bg-superficie-2'
              }`}>
              {r}
            </button>
          ))}
        </div>
      )}

      <div ref={elemento}
           className="h-[22rem] w-full overflow-hidden rounded-xl border border-borda sm:h-[30rem]"
           role="img"
           aria-label={`Mapa com ${visiveis.length} pontos da viagem`} />

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-tinta-2">
        {Object.entries(CATEGORIAS).map(([chave, cat]) => (
          <span key={chave} className="inline-flex items-center gap-2">
            <span aria-hidden className="size-3 rounded-full"
                  style={{ background: escuro ? cat.escuro : cat.claro }} />
            {cat.rotulo}
          </span>
        ))}
        <span className="text-tinta-3">Número do pino = dia do roteiro</span>
      </div>
    </Secao>
  )
}
