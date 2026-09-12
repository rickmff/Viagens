import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// Um único modal para dias e tiles. Abre a partir do elemento clicado (a
// origem da escala é o centro do bilhete, então o painel "sai" dele), prende
// o foco enquanto está aberto, e responde a ←/→/Esc. Ao fechar, devolve o
// foco para onde estava — quem navega por teclado nota quando isso falta.
export default function Modal({ aberto, item, origem, aoFechar, aoAnterior, aoProximo }) {
  const veu = useRef(null), painel = useRef(null), fechar = useRef(null)
  const [visivel, setVisivel] = useState(false)   // classe .aberto (transição)
  const [montado, setMontado] = useState(false)   // existe no DOM
  const ultimoFoco = useRef(null)

  useLayoutEffect(() => {
    if (aberto) {
      ultimoFoco.current = origem || document.activeElement
      setMontado(true)
      if (origem && painel.current) {
        const r = origem.getBoundingClientRect(), p = painel.current.getBoundingClientRect()
        painel.current.style.transformOrigin = `${r.left + r.width / 2 - p.left}px ${r.top + r.height / 2 - p.top}px`
      }
      const id = requestAnimationFrame(() => requestAnimationFrame(() => { setVisivel(true); fechar.current?.focus() }))
      return () => cancelAnimationFrame(id)
    }
    setVisivel(false)
    // Só some do DOM depois da transição — e não some se reabriu no meio dela.
    const t = setTimeout(() => { if (!aberto) { setMontado(false); ultimoFoco.current?.focus?.() } }, 350)
    return () => clearTimeout(t)
  }, [aberto, origem])

  useEffect(() => { if (painel.current) painel.current.scrollTop = 0 }, [item])

  useEffect(() => {
    if (!aberto) return
    const tecla = (e) => {
      if (e.key === 'Escape') aoFechar()
      else if (e.key === 'ArrowRight') aoProximo()
      else if (e.key === 'ArrowLeft') aoAnterior()
      else if (e.key === 'Tab' && painel.current) {
        const f = painel.current.querySelectorAll('button,input,a[href],select,textarea,[tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const primeiro = f[0], ultimo = f[f.length - 1]
        if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus() }
        else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus() }
      }
    }
    document.addEventListener('keydown', tecla)
    return () => document.removeEventListener('keydown', tecla)
  }, [aberto, aoFechar, aoProximo, aoAnterior])

  if (!montado || !item) return null

  return (
    <div ref={veu} className={`veu ${visivel ? 'aberto' : ''}`} id="veu"
         onClick={(e) => { if (e.target === veu.current) aoFechar() }}>
      <div ref={painel} className="painel" role="dialog" aria-modal="true" aria-labelledby="m-titulo" tabIndex={-1}>
        <header>
          <div>
            {item.kicker && <div className="m-kicker">{item.kicker}</div>}
            <h2 className="m-titulo" id="m-titulo">
              {item.num != null && <span className="num">{item.num}</span>}
              <span>{item.titulo}</span>
            </h2>
          </div>
          <div className="m-nav">
            <button onClick={aoAnterior} aria-label="Anterior"><svg viewBox="0 0 24 24"><path d="m15 5-7 7 7 7"/></svg></button>
            <button onClick={aoProximo} aria-label="Próximo"><svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg></button>
            <button ref={fechar} onClick={aoFechar} aria-label="Fechar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
          </div>
        </header>
        <div className="m-corpo" key={item.chave}>{item.corpo}</div>
      </div>
    </div>
  )
}
