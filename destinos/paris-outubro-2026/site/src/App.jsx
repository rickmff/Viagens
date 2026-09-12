import { useCallback, useMemo, useRef, useState } from 'react'
import viagem from './data/trip.json'
import { aplicarDesign } from './lib/design'
import { PreferenciasProvider } from './lib/precos'
import { data } from './lib/formato'
import Ceu from './components/Ceu'
import Topo from './components/Topo'
import Bilhetes from './components/Bilhetes'
import Tiles, { definirTiles } from './components/Tiles'
import Modal from './components/Modal'
import DiaModal from './components/DiaModal'
import Reservas from './components/Reservas'
import Documentacao from './components/Documentacao'
import Logistica from './components/Logistica'
import Mapa from './components/Mapa'
import Clima from './components/Clima'
import Orcamento from './components/Orcamento'
import Cambio from './components/Cambio'
import Bagagem from './components/Bagagem'
import Gastronomia from './components/Gastronomia'
import Frases from './components/Frases'
import Links from './components/Links'

// O que cada tile mostra ao abrir. As seções decidem sozinhas se têm conteúdo,
// então agrupar duas num modal nunca deixa um bloco vazio no meio.
const CORPOS = {
  reservar:  (v) => <><Reservas viagem={v} /><Documentacao viagem={v} /></>,
  logistica: (v) => <Logistica viagem={v} />,
  mapa:      (v) => <Mapa viagem={v} />,
  orcamento: (v) => <><Orcamento viagem={v} /><Cambio viagem={v} /></>,
  mala:      (v) => <><Bagagem viagem={v} /><Frases viagem={v} /></>,
  guia:      (v) => <><Clima viagem={v} /><Gastronomia viagem={v} /><Links viagem={v} /></>,
}

export default function App() {
  const design = useMemo(() => aplicarDesign(viagem.design), [])
  const tiles = useMemo(() => definirTiles(viagem), [])
  const dias = viagem.dias || []

  // A ordem de navegação com ← → é bilhetes primeiro, tiles depois, circular.
  const ordem = useMemo(() => [
    ...dias.map((_, i) => ({ tipo: 'dia', i })),
    ...tiles.map((_, i) => ({ tipo: 'tile', i })),
  ], [dias, tiles])

  const [atual, setAtual] = useState(-1)
  const [origem, setOrigem] = useState(null)
  const [momentoAtivo, setMomentoAtivo] = useState(false)
  const temporizador = useRef(null)

  const abrir = useCallback((idx, el) => { setOrigem(el || null); setAtual(idx) }, [])
  const fechar = useCallback(() => setAtual(-1), [])
  const passo = useCallback((dir) => {
    setOrigem(null)
    setAtual((a) => (a + dir + ordem.length) % ordem.length)
  }, [ordem.length])

  // O momento: partículas por alguns segundos, uma vez na carga e a cada
  // clique no título ou no botão. Respeita quem pediu menos movimento.
  const momento = useCallback((ms = 5000) => {
    if (!design.momento || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setMomentoAtivo(true)
    clearTimeout(temporizador.current)
    temporizador.current = setTimeout(() => setMomentoAtivo(false), ms)
  }, [design.momento])
  useMemo(() => { setTimeout(() => momento(4200), 1100) }, [momento])

  const item = useMemo(() => {
    const o = ordem[atual]
    if (!o) return null
    if (o.tipo === 'dia') {
      const dia = dias[o.i]
      return {
        chave: `dia-${o.i}`, num: o.i + 1, titulo: dia.titulo || 'Dia livre',
        kicker: `${data(dia.data, { weekday: 'long', day: '2-digit', month: 'long' })} · dia ${o.i + 1} de ${dias.length}`,
        corpo: <DiaModal viagem={viagem} dia={dia} />,
      }
    }
    const t = tiles[o.i]
    return { chave: `tile-${t.id}`, titulo: t.t, kicker: t.kicker, corpo: CORPOS[t.id]?.(viagem) }
  }, [atual, ordem, dias, tiles])

  return (
    <PreferenciasProvider viagem={viagem}>
      <Ceu design={design} ativo={momentoAtivo} />
      <main className="palco">
        <Topo viagem={viagem} design={design} aoMomento={() => momento()} />
        <Bilhetes viagem={viagem} aoAbrir={(i, el) => abrir(i, el)} />
        <Tiles viagem={viagem} tiles={tiles} deslocamento={dias.length}
               aoAbrir={(i, el) => abrir(dias.length + i, el)} />
      </main>
      <Modal aberto={atual >= 0} item={item} origem={origem}
             aoFechar={fechar} aoAnterior={() => passo(-1)} aoProximo={() => passo(1)} />
    </PreferenciasProvider>
  )
}
