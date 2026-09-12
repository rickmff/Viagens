import { Secao, Card, Rotulo } from './Secao'
import { data } from '../lib/formato'

export default function Links({ viagem }) {
  const links = viagem.links || []
  const avisos = viagem.avisos || []
  if (!links.length && !avisos.length) return null

  const porCategoria = links.reduce((acc, l) => {
    const c = l.categoria || 'geral'
    ;(acc[c] ||= []).push(l)
    return acc
  }, {})

  const TOM = { critico: 'border-critico', atencao: 'border-atencao', info: 'border-linha' }

  return (
    <Secao id="util" titulo="Links e avisos" descricao="O que vale ter à mão no celular.">
      {avisos.length > 0 && (
        <div className="mb-3 space-y-2">
          {avisos.map((a, i) => (
            <p key={i}
               className={`rounded-lg border-l-4 bg-superficie px-4 py-2.5 text-sm text-pretty ${TOM[a.nivel] || TOM.info}`}>
              <span className="font-medium capitalize">{a.nivel || 'nota'}: </span>{a.texto}
            </p>
          ))}
        </div>
      )}

      {links.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(porCategoria).map(([categoria, itens]) => (
            <Card key={categoria}>
              <Rotulo>{categoria}</Rotulo>
              <ul className="mt-2 space-y-1.5">
                {itens.map((l) => (
                  <li key={l.url}>
                    <a href={l.url} target="_blank" rel="noreferrer"
                       className="text-sm text-acento underline decoration-borda underline-offset-4 hover:decoration-acento">
                      {l.titulo}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      <p className="mt-6 border-t border-linha pt-4 text-xs text-tinta-3">
        Gerado a partir de <code>trip.json</code>
        {viagem.atualizadoEm && ` · atualizado em ${data(viagem.atualizadoEm)}`}.
        Para mudar conteúdo, edite o <code>trip.json</code> e regenere — não edite esta página à mão.
      </p>
    </Secao>
  )
}
