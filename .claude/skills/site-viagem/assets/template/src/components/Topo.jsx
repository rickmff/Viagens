import { periodo } from '../lib/formato'
import { resumoViagem } from '../lib/viagem'
import { ControlesDePreco } from '../lib/precos'
import { Icone } from './Icones'

/** Contagem regressiva com os estados que importam: dias para embarcar,
 *  amanhã, hoje, "dia X de N" durante a viagem, e concluída. */
export function estadoDaViagem(viagem) {
  const [sa, sm, sd] = (viagem.periodo?.inicio || '').split('-').map(Number)
  const [ea, em, ed] = (viagem.periodo?.fim || viagem.periodo?.inicio || '').split('-').map(Number)
  if (!sa) return { num: '—', rotulo: '', diaAtual: null }
  const inicio = new Date(sa, sm - 1, sd), fim = new Date(ea, em - 1, ed)
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
  const n = Math.round((fim - inicio) / 86400000) + 1
  const diff = Math.round((inicio - hoje) / 86400000)
  if (diff > 1) return { num: diff, rotulo: 'dias para embarcar', diaAtual: null }
  if (diff === 1) return { num: 1, rotulo: 'dia — é amanhã', diaAtual: null }
  if (diff === 0) return { num: 'hoje', rotulo: 'boa viagem', diaAtual: 1 }
  if (hoje <= fim) { const d = 1 - diff; return { num: d, rotulo: `de ${n} dias — hoje`, diaAtual: d } }
  return { num: '✓', rotulo: 'viagem feita', diaAtual: null }
}

export default function Topo({ viagem, design, aoMomento }) {
  const e = estadoDaViagem(viagem)
  const r = resumoViagem(viagem)
  const sub = viagem.subtitulo || [
    periodo(viagem.periodo?.inicio, viagem.periodo?.fim),
    r.viajantes > 1 ? `${r.viajantes} viajantes` : null,
    r.noites ? `${r.noites} ${r.noites === 1 ? 'noite' : 'noites'}` : null,
  ].filter(Boolean).join(' · ')

  return (
    <header className="topo">
      <div>
        {/* O título também aciona o momento: é o convite escondido à vista. */}
        <h1 onClick={aoMomento} title={design.momento?.rotulo}>{viagem.titulo}</h1>
        <p className="sub">{sub}</p>
      </div>
      <div className="topo-dir">
        {design.momento && (
          <button className="btn-momento" onClick={aoMomento}
                  aria-label={design.momento.rotulo} title={design.momento.rotulo}>
            <Icone nome={design.momento.icone || 'star'} className="" />
          </button>
        )}
        <div className="contagem"><strong>{e.num}</strong><span>{e.rotulo}</span></div>
        <ControlesDePreco />
      </div>
    </header>
  )
}
