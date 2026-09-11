import viagem from './data/trip.json'
import Cabecalho from './components/Cabecalho'
import Documentacao from './components/Documentacao'
import Logistica from './components/Logistica'
import Roteiro from './components/Roteiro'
import Mapa from './components/Mapa'
import Clima from './components/Clima'
import Cambio from './components/Cambio'
import Orcamento from './components/Orcamento'
import Bagagem from './components/Bagagem'
import Gastronomia from './components/Gastronomia'
import Frases from './components/Frases'
import Links from './components/Links'
import { pontosDoMapa } from './lib/viagem'

// A navegação lista só o que a página realmente tem. Seção vazia não vira
// item de menu que leva a lugar nenhum — e é isso que permite um trip.json
// incompleto gerar um site menor e coerente em vez de um site furado.
function secoesVisiveis(v) {
  const temCambio = (v.destinos || []).some((d) => d.moeda && d.moeda !== (v.moedaBase || 'BRL'))
  const temClima = (v.destinos || []).some((d) => d.lat != null && d.lon != null)
  const d = v.documentacao

  return [
    { id: 'documentacao', rotulo: 'Documentos', tem: !!(d?.visto || d?.vacinas?.length || d?.seguro || d?.checklist?.length) },
    { id: 'logistica',    rotulo: 'Logística',  tem: !!(v.voos?.length || v.hospedagens?.length || v.transportes?.length) },
    { id: 'roteiro',      rotulo: 'Roteiro',    tem: !!v.dias?.length },
    { id: 'mapa',         rotulo: 'Mapa',       tem: pontosDoMapa(v).length > 0 },
    { id: 'clima',        rotulo: 'Clima',      tem: temClima },
    { id: 'orcamento',    rotulo: 'Orçamento',  tem: !!(v.orcamento?.categorias?.length || v.orcamento?.teto) },
    { id: 'cambio',       rotulo: 'Câmbio',     tem: temCambio },
    { id: 'comer',        rotulo: 'Comer',      tem: !!v.gastronomia?.length },
    { id: 'bagagem',      rotulo: 'Bagagem',    tem: !!v.bagagem?.length },
    { id: 'frases',       rotulo: 'Frases',     tem: !!v.frases?.length },
    { id: 'util',         rotulo: 'Útil',       tem: !!(v.links?.length || v.avisos?.length) },
  ].filter((s) => s.tem)
}

export default function App() {
  return (
    <div className="min-h-dvh">
      <Cabecalho viagem={viagem} secoes={secoesVisiveis(viagem)} />
      <main className="divide-y divide-linha">
        <Documentacao viagem={viagem} />
        <Logistica viagem={viagem} />
        <Roteiro viagem={viagem} />
        <Mapa viagem={viagem} />
        <Clima viagem={viagem} />
        <Orcamento viagem={viagem} />
        <Cambio viagem={viagem} />
        <Gastronomia viagem={viagem} />
        <Bagagem viagem={viagem} />
        <Frases viagem={viagem} />
        <Links viagem={viagem} />
      </main>
    </div>
  )
}
