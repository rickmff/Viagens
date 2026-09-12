import { useMemo } from 'react'

// O céu é fixo atrás do palco: gradiente de quatro paradas e, por cima, a
// silhueta do destino em baixa opacidade. As partículas ficam paradas até o
// "momento" ser acionado — movimento só em resposta a um clique, e uma vez
// na carga, para a página não virar uma feira.
export default function Ceu({ design, ativo }) {
  const tipo = design.momento?.tipo
  const particulas = useMemo(() => {
    if (!tipo) return []
    const n = tipo === 'estrelas' ? 48 : 28
    return Array.from({ length: n }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: tipo === 'estrelas' ? `${Math.random() * 34}%` : '-4vh',
      '--d': `${(Math.random() * (tipo === 'estrelas' ? 1.1 : 6)).toFixed(2)}s`,
      '--t': `${(5 + Math.random() * 5).toFixed(1)}s`,
      '--x': `${(Math.random() * 16 - 8).toFixed(0)}vw`,
      width: tipo === 'estrelas' ? `${(2 + Math.random() * 2.5).toFixed(1)}px` : undefined,
      height: tipo === 'estrelas' ? `${(2 + Math.random() * 2.5).toFixed(1)}px` : undefined,
    }))
  }, [tipo])

  return (
    <div className={`ceu ${ativo ? 'ativo' : ''}`} aria-hidden="true">
      {design.horizonte && (
        <svg viewBox="0 0 1440 120" preserveAspectRatio="xMidYMax slice">
          <path fill="var(--silhueta)" d={design.horizonte} />
        </svg>
      )}
      {tipo && (
        <div className={`particulas ${tipo}`}>
          {particulas.map(({ id, ...estilo }) => <i key={id} style={estilo} />)}
        </div>
      )}
    </div>
  )
}
