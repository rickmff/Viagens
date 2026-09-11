// Blocos visuais compartilhados. Concentrar o espaçamento e a moldura aqui é
// o que mantém o site coeso mesmo quando o trip.json esconde metade das
// seções — sem isso, cada componente inventa a própria margem e o ritmo da
// página se perde.

export function Secao({ id, titulo, descricao, acao, mostrar = true, children }) {
  if (!mostrar) return null
  return (
    <section id={id} className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{titulo}</h2>
          {descricao && (
            <p className="mt-1.5 max-w-2xl text-sm text-tinta-2">{descricao}</p>
          )}
        </div>
        {acao && <div className="nao-imprimir">{acao}</div>}
      </header>
      {children}
    </section>
  )
}

export function Card({ className = '', children, ...resto }) {
  return (
    <div
      className={`rounded-xl border border-borda bg-superficie p-4 sm:p-5 ${className}`}
      {...resto}
    >
      {children}
    </div>
  )
}

export function Chip({ children, tom = 'neutro' }) {
  const tons = {
    neutro: 'bg-superficie-2 text-tinta-2',
    acento: 'bg-acento-suave text-tinta',
    bom: 'bg-superficie-2 text-bom',
    atencao: 'bg-superficie-2 text-tinta',
    critico: 'bg-superficie-2 text-critico',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tons[tom] || tons.neutro}`}>
      {children}
    </span>
  )
}

export function Rotulo({ children }) {
  return (
    <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-tinta-3">
      {children}
    </span>
  )
}

/** Estado de carregamento e de falha de rede. Os dados ao vivo do site podem
 *  simplesmente não chegar — no avião, no roaming ruim, na API fora do ar — e
 *  a página inteira continua útil sem eles. Dizer o que falhou é mais honesto
 *  que sumir com o bloco. */
export function Aguardando({ children = 'Carregando…' }) {
  return <p className="text-sm text-tinta-3">{children}</p>
}

export function Falhou({ children = 'Não foi possível carregar agora.' }) {
  return <p className="text-sm text-tinta-3">{children}</p>
}
