# Viagens — repositório de planejamento

Este repo é um planejador de viagens pessoal operado por skills. O fluxo é:
um prompt curto com destino, orçamento e desejos → um site de 1 página para
aquele destino. A cada interação o repositório **aprende**, para que o próximo
prompt precise ser ainda mais curto.

## Estrutura

```
perfil/
  PERFIL.md          Memória curada: o que já se sabe sobre como o Rick viaja.
  insights.md        Log append-only de cada sessão e do que ela ensinou.
destinos/
  <slug>/
    trip.json        Fonte da verdade do destino (contrato compartilhado).
    PESQUISA.md      Pesquisa bruta com fontes e datas de consulta.
    APRENDIZADOS.md  Pós-viagem: o que funcionou, o que não funcionou.
    site/            App React + Vite gerado a partir do trip.json.
.claude/skills/      As skills que operam tudo isso.
```

## Regras que valem para qualquer trabalho neste repo

**Leia `perfil/PERFIL.md` antes de qualquer planejamento.** Ele existe
justamente para você não perguntar de novo o que já foi respondido. Perguntar
algo que está escrito lá é o principal modo de falha deste repo.

**Escreva de volta no perfil ao final.** Toda sessão que revelou algo sobre
preferências, orçamento ou ritmo termina atualizando `perfil/PERFIL.md` e
registrando a entrada em `perfil/insights.md`. Sem isso o repo não aprende e
o próximo prompt volta a ser longo.

**`trip.json` é a fonte da verdade, o site é derivado.** Para mudar conteúdo
do site, mude o `trip.json` e regenere. Edite arquivos em `site/src/` apenas
quando a mudança for de comportamento ou visual, nunca de conteúdo.

**Nunca recrie um destino que já existe.** Se `destinos/<slug>/` existe, o
trabalho é de atualização incremental: preserve customizações, faça merge no
`trip.json`, e diga o que mudou.

**Moeda base é BRL**, origem é o Brasil, e os destinos costumam ser
internacionais — então documentação, câmbio e fuso horário são de primeira
classe, não detalhes.

## Idioma

Todo conteúdo gerado — sites, markdowns, commits — em português do Brasil.
Nomes de arquivo e de código em inglês ou slug sem acento.

## Stack do site gerado

React 19 + Vite + Tailwind v4. Dependências de runtime: apenas `react`,
`react-dom` e `leaflet`. Dados ao vivo vêm de APIs sem chave (Open-Meteo,
Nominatim, exchangerate) chamadas direto do browser. Resista a adicionar
dependências: o template é de propósito magro para não apodrecer entre viagens.
