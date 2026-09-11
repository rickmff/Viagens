import { useEffect, useState } from 'react'
import { periodo } from '../lib/formato'
import { contagemRegressiva, resumoViagem } from '../lib/viagem'

function Tema() {
  const [tema, setTema] = useState(() => {
    try { return localStorage.getItem('viagem:tema') || 'auto' } catch { return 'auto' }
  })

  useEffect(() => {
    const raiz = document.documentElement
    if (tema === 'auto') raiz.removeAttribute('data-tema')
    else raiz.setAttribute('data-tema', tema)
    try { localStorage.setItem('viagem:tema', tema) } catch { /* sem persistência */ }
  }, [tema])

  const proximo = { auto: 'claro', claro: 'escuro', escuro: 'auto' }
  const icone = { auto: '◐', claro: '☀', escuro: '☾' }

  return (
    <button
      onClick={() => setTema(proximo[tema])}
      aria-label={`Tema: ${tema}. Clique para alternar.`}
      title={`Tema: ${tema}`}
      className="rounded-lg border border-borda px-2.5 py-1.5 text-sm text-tinta-2 transition-colors hover:bg-superficie-2"
    >
      {icone[tema]}
    </button>
  )
}

function Contagem({ viagem }) {
  const c = contagemRegressiva(viagem)
  if (!c) return null
  if (c.terminou) return <span className="text-tinta-2">Viagem concluída</span>
  if (c.emViagem) return <span className="font-medium text-bom">Em viagem agora</span>
  if (c.dias === 0) return <span className="font-medium text-bom">É hoje</span>
  return (
    <span>
      <strong className="text-2xl font-semibold tabular-nums">{c.dias}</strong>
      <span className="ml-1.5 text-tinta-2">{c.dias === 1 ? 'dia para embarcar' : 'dias para embarcar'}</span>
    </span>
  )
}

export default function Cabecalho({ viagem, secoes }) {
  const r = resumoViagem(viagem)
  const partes = [
    `${r.dias} ${r.dias === 1 ? 'dia' : 'dias'}`,
    r.cidades > 1 ? `${r.cidades} cidades` : viagem.destinos?.[0]?.nome,
    r.viajantes > 1 ? `${r.viajantes} viajantes` : null,
  ].filter(Boolean)

  return (
    <>
      <nav className="nao-imprimir sticky top-0 z-50 border-b border-borda bg-plano/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5 sm:px-6">
          <a href="#topo" className="shrink-0 text-sm font-semibold tracking-tight">
            {viagem.destinos?.[0]?.nome || 'Viagem'}
          </a>
          {/* Rolagem horizontal em vez de menu sanfonado: no celular, deslizar
              a régua de seções é mais rápido que abrir e fechar um menu. */}
          <div className="flex flex-1 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {secoes.map((s) => (
              <a key={s.id} href={`#${s.id}`}
                 className="shrink-0 rounded-lg px-2.5 py-1.5 text-sm text-tinta-2 transition-colors hover:bg-superficie-2 hover:text-tinta">
                {s.rotulo}
              </a>
            ))}
          </div>
          <Tema />
        </div>
      </nav>

      <header id="topo" className="border-b border-borda bg-superficie">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
          <p className="text-sm font-medium text-acento">{periodo(viagem.periodo?.inicio, viagem.periodo?.fim)}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            {viagem.titulo}
          </h1>
          {viagem.subtitulo && (
            <p className="mt-3 max-w-2xl text-lg text-tinta-2 text-pretty">{viagem.subtitulo}</p>
          )}
          <div className="mt-7 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
            <Contagem viagem={viagem} />
            <span className="text-tinta-2">{partes.join(' · ')}</span>
          </div>
        </div>
      </header>
    </>
  )
}
