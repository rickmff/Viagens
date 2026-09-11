import { Secao, Card } from './Secao'

export default function Frases({ viagem }) {
  const frases = viagem.frases || []
  return (
    <Secao
      id="frases"
      titulo="Frases que salvam"
      descricao="O suficiente para pedir, agradecer e sair de uma enrascada."
      mostrar={frases.length > 0}
    >
      <Card>
        <ul className="divide-y divide-linha">
          {frases.map((f) => (
            <li key={f.pt} className="grid gap-1 py-2.5 first:pt-0 last:pb-0 sm:grid-cols-2 sm:items-baseline sm:gap-4">
              <span className="text-sm text-tinta-2">{f.pt}</span>
              <span>
                <span className="font-medium">{f.local}</span>
                {f.leitura && <span className="ml-2 text-sm text-tinta-3">{f.leitura}</span>}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </Secao>
  )
}
