import { Secao, Card, Chip } from './Secao'

export default function Gastronomia({ viagem }) {
  const lugares = viagem.gastronomia || []
  const destinos = new Map((viagem.destinos || []).map((d) => [d.id, d.nome]))

  return (
    <Secao
      id="comer"
      titulo="Onde comer"
      descricao="O que vale a viagem, não o que é conveniente."
      mostrar={lugares.length > 0}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lugares.map((l) => (
          <Card key={l.nome}>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-pretty">{l.nome}</h3>
              {l.faixaPreco && <Chip>{l.faixaPreco}</Chip>}
            </div>
            <p className="mt-1 text-xs text-tinta-3">
              {[l.tipo, destinos.get(l.destinoId)].filter(Boolean).join(' · ')}
            </p>
            {l.porque && <p className="mt-2 text-sm text-tinta-2 text-pretty">{l.porque}</p>}
            {l.lat != null && l.lon != null && (
              <a href={`https://www.openstreetmap.org/?mlat=${l.lat}&mlon=${l.lon}#map=17/${l.lat}/${l.lon}`}
                 target="_blank" rel="noreferrer"
                 className="mt-2 inline-block text-xs text-acento underline underline-offset-4">
                ver no mapa
              </a>
            )}
          </Card>
        ))}
      </div>
    </Secao>
  )
}
