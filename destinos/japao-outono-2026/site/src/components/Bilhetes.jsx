import { data } from '../lib/formato'
import { usePrecos } from '../lib/precos'
import { Icone, iconePorTipo } from './Icones'
import { estadoDaViagem } from './Topo'

/** Os três momentos do bilhete: os que o roteiro escolheu, ou os três
 *  primeiros blocos com hora. */
export function momentosDo(dia) {
  if (dia.momentos?.length) return dia.momentos.slice(0, 3)
  return (dia.blocos || []).filter((b) => b.hora).slice(0, 3)
    .map((b) => [b.hora.replace(':', 'h'), b.titulo])
}

export default function Bilhetes({ viagem, aoAbrir }) {
  const dias = viagem.dias || []
  const { somaCustos } = usePrecos()
  const { diaAtual } = estadoDaViagem(viagem)
  const destinos = new Map((viagem.destinos || []).map((d) => [d.id, d.nome]))

  return (
    <section className={`bilhetes ${dias.length <= 5 ? 'poucos' : ''}`}
             style={{ '--ndias': dias.length }}>
      {dias.map((dia, i) => {
        const custo = somaCustos((dia.blocos || []).map((b) => b.custo))
        const icone = dia.icone || iconePorTipo[dia.blocos?.[0]?.tipo] || 'star'
        const hoje = diaAtual === i + 1
        return (
          <button key={dia.data || i} className={`bilhete ${hoje ? 'hoje' : ''} ${hoje || dia.cortavel ? 'com-selo' : ''}`}
                  style={{ '--i': i }} data-tile="dia" data-i={i}
                  aria-haspopup="dialog" onClick={(e) => aoAbrir(i, e.currentTarget)}>
            {hoje && <span className="selo">hoje</span>}
            {!hoje && dia.cortavel && <span className="selo cortavel">cortável</span>}
            <div className="cabeca">
              <div className="dow">{data(dia.data, { weekday: 'short' }).replace('.', '')}{destinos.get(dia.destinoId) ? ` · ${destinos.get(dia.destinoId)}` : ''}</div>
              <div className="num">{i + 1}</div>
              <div className="titulo">{dia.titulo || 'Dia livre'}</div>
              {dia.resumo && <div className="resumo">{dia.resumo}</div>}
              {momentosDo(dia).length > 0 && (
                <ul className="momentos">
                  {momentosDo(dia).map(([h, t], j) => <li key={j}><b>{h}</b>{t}</li>)}
                </ul>
              )}
            </div>
            <div className="canhoto">
              <span className="custo">{custo ? `≈ ${custo}` : 'sem custo'}</span>
              <Icone nome={icone} />
            </div>
          </button>
        )
      })}
    </section>
  )
}
