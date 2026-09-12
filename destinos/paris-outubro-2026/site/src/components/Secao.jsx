// Blocos compartilhados pelos conteúdos de modal. Antes cada seção era uma
// faixa da página; agora é um bloco dentro do painel — o título vira h3
// (o modal já tem o h2), a descrição vira a linha de abertura, e a moldura
// segue a paleta do destino via tokens.

export function Secao({ titulo, descricao, acao, mostrar = true, children }) {
  if (!mostrar) return null
  return (
    <section className="mb-7 last:mb-0">
      {(titulo || acao) && (
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          {titulo && <h3 className="!mt-0">{titulo}</h3>}
          {acao && <div className="nao-imprimir">{acao}</div>}
        </div>
      )}
      {descricao && <p className="lead">{descricao}</p>}
      {children}
    </section>
  )
}

export function Card({ className = '', children, ...resto }) {
  return (
    <div className={`rounded-xl border border-linha bg-superficie-2/50 p-4 ${className}`} {...resto}>
      {children}
    </div>
  )
}

export function Chip({ children, tom = 'neutro' }) {
  const tons = {
    neutro: 'border-linha text-tinta-2',
    acento: 'border-acento/60 text-acento',
    bom: 'border-bom/50 text-bom',
    atencao: 'border-atencao/50 text-atencao',
    critico: 'border-critico/50 text-critico',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tons[tom] || tons.neutro}`}>
      {children}
    </span>
  )
}

export function Rotulo({ children }) {
  return (
    <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-tinta-3">{children}</span>
  )
}

export function Aguardando({ children = 'Carregando…' }) {
  return <p className="text-sm text-tinta-3">{children}</p>
}
export function Falhou({ children = 'Não foi possível carregar agora.' }) {
  return <p className="text-sm text-tinta-3">{children}</p>
}

/** Botões de alternância no estilo do palco. */
export function Seg({ opcoes, valor, aoMudar, rotulo }) {
  return (
    <div className="seg" role="group" aria-label={rotulo}>
      {opcoes.map((o) => (
        <button key={o.v} aria-pressed={valor === o.v} onClick={() => aoMudar(o.v)}>{o.r}</button>
      ))}
    </div>
  )
}
