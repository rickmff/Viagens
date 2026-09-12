import { useState } from 'react'
import { useMarcados } from '../hooks/usePersistido'
import { usePrecos } from '../lib/precos'
import { duracao } from '../lib/formato'

function Linha({ bloco, j, chave, marcados, alternar }) {
  const { fmt } = usePrecos()
  const feito = marcados.has(chave)
  return (
    <li style={{ '--j': j }} className={feito ? 'feito' : ''}>
      <button className="check" aria-pressed={feito} onClick={() => alternar(chave)}
              aria-label={feito ? `Desmarcar ${bloco.titulo}` : `Marcar ${bloco.titulo} como feito`}>
        {feito ? '✓' : ''}
      </button>
      <span className="h">{(bloco.hora || '—').replace(':', 'h')}</span>
      <span className="x">
        {bloco.titulo}
        {bloco.link && <a className="ir" href={bloco.link} target="_blank" rel="noreferrer">{bloco.reservaNecessaria ? 'reservar' : 'ver'}</a>}
        {bloco.reservaNecessaria && !bloco.link && <span className="block text-xs font-medium text-critico">⚠ reservar antes</span>}
        {(bloco.duracaoMin || bloco.notas) && (
          <span className="block text-sm text-tinta-2">
            {bloco.duracaoMin ? duracao(bloco.duracaoMin) : ''}{bloco.duracaoMin && bloco.notas ? ' · ' : ''}{bloco.notas}
          </span>
        )}
        {bloco.alternativa && <span className="block text-sm text-tinta-3">Plano B: {bloco.alternativa}</span>}
      </span>
      <span className="c">{bloco.custo?.valor != null ? fmt(bloco.custo, { sufixo: false }) : ''}</span>
    </li>
  )
}

function LinhaDoTempo({ dia, blocos, prefixo, marcados, alternar }) {
  const { somaCustos } = usePrecos()
  const total = somaCustos(blocos.map((b) => b.custo))
  const dicas = blocos.filter((b) => b.alternativa).length ? null : null
  return (
    <>
      {blocos.length === 0
        ? <p className="lead">Dia livre — nada marcado, de propósito.</p>
        : (
          <ul className="tl">
            {blocos.map((b, j) => (
              <Linha key={b.id || j} bloco={b} j={j} chave={`${prefixo}-${b.id || j}`}
                     marcados={marcados} alternar={alternar} />
            ))}
          </ul>
        )}
      {dicas}
      {total && (
        <div className="total-dia"><span>Custo do dia</span><b>≈ {total}</b></div>
      )}
    </>
  )
}

export default function DiaModal({ viagem, dia }) {
  const { marcados, alternar } = useMarcados(`viagem:${viagem.slug}:roteiro`)
  const [aba, setAba] = useState('a')
  const blocosA = dia.blocos || []
  const opcaoB = dia.opcaoB

  return (
    <>
      {dia.notas && <p className="lead">{dia.notas}</p>}
      {opcaoB && (
        <div className="abas" role="tablist">
          <button role="tab" aria-selected={aba === 'a'} onClick={() => setAba('a')}>{dia.opcaoA || 'Opção A'}</button>
          <button role="tab" aria-selected={aba === 'b'} onClick={() => setAba('b')}>{opcaoB.rotulo || 'Opção B'}</button>
        </div>
      )}
      {aba === 'a' || !opcaoB
        ? <LinhaDoTempo dia={dia} blocos={blocosA} prefixo={dia.data} marcados={marcados} alternar={alternar} />
        : <LinhaDoTempo dia={dia} blocos={opcaoB.blocos || []} prefixo={`${dia.data}-b`} marcados={marcados} alternar={alternar} />}
      {dia.cortavel && (
        <div className="dicas"><p>Este é um dos dias mais fáceis de cortar se a viagem encurtar.</p></div>
      )}
    </>
  )
}
