import { Secao, Card, Chip, Rotulo } from './Secao'
import { useMarcados } from '../hooks/usePersistido'
import { data } from '../lib/formato'
import { temConteudo } from '../lib/viagem'

export default function Documentacao({ viagem }) {
  const d = viagem.documentacao
  const { marcados, alternar } = useMarcados(`viagem:${viagem.slug}:docs`)
  const itens = d?.checklist || []

  const mostrar = temConteudo(d?.visto, d?.vacinas, d?.seguro, d?.passaporte, itens, d?.alfandega)
  if (!mostrar) return null

  return (
    <Secao
      id="documentacao"
      titulo="Documentação"
      descricao="O único bloco da página que impede o embarque se estiver errado. Confirme no consulado antes de comprar passagem."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {d.visto && (
          <Card>
            <div className="flex items-start justify-between gap-3">
              <Rotulo>Visto</Rotulo>
              <Chip tom={d.visto.necessario ? 'critico' : 'bom'}>
                {d.visto.necessario ? '⚠ necessário' : '✓ isento'}
              </Chip>
            </div>
            <p className="mt-2 text-sm text-pretty">{d.visto.detalhe}</p>
            {d.visto.fonte && (
              <a href={d.visto.fonte} target="_blank" rel="noreferrer"
                 className="mt-2 inline-block text-xs text-acento underline underline-offset-4">
                fonte oficial
              </a>
            )}
          </Card>
        )}

        {d.passaporte && (
          <Card>
            <Rotulo>Passaporte</Rotulo>
            <p className="mt-2 text-sm text-pretty">
              {d.passaporte.validadeMinimaMeses
                ? `Precisa estar válido por pelo menos ${d.passaporte.validadeMinimaMeses} meses após a data de retorno.`
                : 'Sem exigência específica de validade registrada.'}
            </p>
            {d.passaporte.observacao && (
              <p className="mt-1.5 text-sm text-tinta-2 text-pretty">{d.passaporte.observacao}</p>
            )}
          </Card>
        )}

        {d.seguro && (
          <Card>
            <div className="flex items-start justify-between gap-3">
              <Rotulo>Seguro viagem</Rotulo>
              <Chip tom={d.seguro.obrigatorio ? 'critico' : 'neutro'}>
                {d.seguro.obrigatorio ? '⚠ obrigatório' : 'recomendado'}
              </Chip>
            </div>
            {d.seguro.coberturaMinima && (
              <p className="mt-2 text-sm">Cobertura mínima: {d.seguro.coberturaMinima}</p>
            )}
            {d.seguro.observacao && (
              <p className="mt-1.5 text-sm text-tinta-2 text-pretty">{d.seguro.observacao}</p>
            )}
          </Card>
        )}

        {d.vacinas?.length > 0 && (
          <Card>
            <Rotulo>Vacinas</Rotulo>
            <ul className="mt-2 space-y-1.5 text-sm">
              {d.vacinas.map((v) => (
                <li key={v.nome} className="flex flex-wrap items-baseline gap-2">
                  <span>{v.nome}</span>
                  <Chip tom={v.obrigatoria ? 'critico' : 'neutro'}>
                    {v.obrigatoria ? 'obrigatória' : 'recomendada'}
                  </Chip>
                  {v.observacao && <span className="w-full text-tinta-2">{v.observacao}</span>}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {d.alfandega?.length > 0 && (
          <Card>
            <Rotulo>Alfândega</Rotulo>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-tinta-2">
              {d.alfandega.map((a, i) => <li key={i} className="text-pretty">{a}</li>)}
            </ul>
          </Card>
        )}

        {itens.length > 0 && (
          <Card className="sm:col-span-2">
            <Rotulo>Providências</Rotulo>
            <ul className="mt-2 space-y-1">
              {itens.map((item) => {
                const feito = marcados.has(item.id)
                return (
                  <li key={item.id}>
                    <label className="flex cursor-pointer items-start gap-2.5 rounded-lg py-1.5 text-sm hover:bg-superficie-2">
                      <input type="checkbox" checked={feito} onChange={() => alternar(item.id)}
                             className="mt-0.5 size-4 shrink-0 accent-[var(--acento)]" />
                      <span className={feito ? 'text-tinta-3 line-through' : ''}>
                        {item.texto}
                        {item.prazo && (
                          <span className="ml-2 text-xs text-tinta-3">até {data(item.prazo, { day: '2-digit', month: 'short' })}</span>
                        )}
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </Card>
        )}
      </div>

      {d.verificadoEm && (
        <p className="mt-3 text-xs text-tinta-3">
          Regras verificadas em {data(d.verificadoEm)}. Exigência de visto muda sem aviso —
          reconfirme perto da viagem.
        </p>
      )}
    </Secao>
  )
}
