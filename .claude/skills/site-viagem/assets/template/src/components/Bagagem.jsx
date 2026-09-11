import { Secao, Card, Rotulo } from './Secao'
import { useMarcados } from '../hooks/usePersistido'

export default function Bagagem({ viagem }) {
  const grupos = viagem.bagagem || []
  const { marcados, alternar, limpar, total } = useMarcados(`viagem:${viagem.slug}:bagagem`)
  const itensTotais = grupos.reduce((s, g) => s + (g.itens?.length || 0), 0)

  return (
    <Secao
      id="bagagem"
      titulo="Bagagem"
      descricao="Vá marcando enquanto arruma. Fica salvo neste aparelho, então dá para fechar a mala em duas sentadas."
      mostrar={grupos.length > 0}
      acao={
        <div className="flex items-center gap-3">
          <span className="text-sm text-tinta-2 tabular-nums">{total} de {itensTotais}</span>
          {total > 0 && (
            <button onClick={limpar}
                    className="rounded-lg border border-borda px-3 py-1.5 text-sm text-tinta-2 hover:bg-superficie-2">
              Limpar
            </button>
          )}
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {grupos.map((grupo) => (
          <Card key={grupo.categoria}>
            <Rotulo>{grupo.categoria}</Rotulo>
            <ul className="mt-2 space-y-0.5">
              {(grupo.itens || []).map((item) => {
                const id = `${grupo.categoria}:${item}`
                const feito = marcados.has(id)
                return (
                  <li key={id}>
                    <label className="flex cursor-pointer items-start gap-2.5 rounded-lg py-1 text-sm hover:bg-superficie-2">
                      <input type="checkbox" checked={feito} onChange={() => alternar(id)}
                             className="mt-0.5 size-4 shrink-0 accent-[var(--acento)]" />
                      <span className={feito ? 'text-tinta-3 line-through' : ''}>{item}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </Card>
        ))}
      </div>
    </Secao>
  )
}
