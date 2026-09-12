# Viagens — repositório de planejamento

Este repo é um planejador de viagens pessoal operado por skills. O fluxo é:
um prompt curto com destino, orçamento e desejos → uma planilha Excel de
orçamento daquele destino, com fórmulas vivas, três opções por item
(econômico / plano / upgrade) e link de compra em cada linha — mais uma
planilha de comparação quando há mais de uma viagem em jogo. A cada interação
o repositório **aprende**, para que o próximo prompt precise ser ainda mais
curto. O site imersivo de uma página continua disponível, mas só sai quando
for pedido.

## Estrutura

```
perfil/
  PERFIL.md          Memória curada: o que já se sabe sobre como o Rick viaja.
  insights.md        Log append-only de cada sessão e do que ela ensinou.
destinos/
  <slug>/
    BRIEFING.md         O pedido, quando veio pelo briefing guiado.
    trip.json           Fonte da verdade do destino (contrato compartilhado).
    PESQUISA.md         Pesquisa bruta com fontes e datas de consulta.
    APRENDIZADOS.md     Pós-viagem: o que funcionou, o que não funcionou.
    orcamento-<slug>.xlsx  A entrega: planilha com fórmulas vivas, gerada do trip.json.
    roteiro-<slug>.md   Roteiro imprimível, gerado do trip.json.
    site/               Opcional: palco imersivo React + Vite, só quando pedido.
comparacoes/
  <nome>.xlsx          Duas ou mais viagens lado a lado, por pessoa por dia.
docs/
  trip-schema.md         O contrato que liga as skills.
  mapa-de-conhecimento.md  De onde veio cada regra e em qual skill ela vive.
.claude/skills/      As oito skills que operam tudo isso.
```

## Regras que valem para qualquer trabalho neste repo

**Leia `perfil/PERFIL.md` antes de qualquer planejamento.** Ele existe
justamente para você não perguntar de novo o que já foi respondido. Perguntar
algo que está escrito lá é o principal modo de falha deste repo.

**Confirmado é só o que ele disse.** Nunca marque uma preferência como
*confirmada* por inferência de idioma, de contexto ou de estilo. A primeira
viagem deste repo começou com "mora no Brasil (confirmado)" inferido do
português — e ele mora em Portugal.

**Escreva de volta no perfil ao final.** Toda sessão que revelou algo sobre
preferências, orçamento ou ritmo termina atualizando `perfil/PERFIL.md` e
registrando a entrada em `perfil/insights.md`. Sem isso o repo não aprende e
o próximo prompt volta a ser longo.

**`trip.json` é a fonte da verdade; planilha e site são derivados.** Para
mudar conteúdo, mude o `trip.json` e regenere. Mexa no gerador
(`planilha-viagem/scripts/`) ou em `site/src/` apenas quando a mudança for de
estrutura ou visual, nunca de conteúdo. Se o usuário editou a planilha (opções
escolhidas, gastos reais), leia-a antes de regenerar e passe as escolhas para
o `trip.json`.

**Todo item comprável tem três opções e um link.** Voo, hotel, ingresso,
refeição e transporte levam `custo.opcoes.economico` e `custo.opcoes.upgrade`
com valor, descrição e link, mais o `link` de compra do plano. Item grande sem
opção pesquisada é orçamento pela metade: ele não consegue decidir onde
melhorar nem onde cortar.

**Verifique o que abre antes de fixar a ordem dos dias.** Fechamento semanal,
janela de venda de ingresso e feriado local mandam mais na ordem do roteiro que
qualquer preferência — e descobrir isso depois custa caro. Ver
`.claude/skills/pesquisa-destino/references/verificacoes.md`.

**O recálculo da planilha é portão, não sugestão.** `gerar-planilha.py` e
`comparar-viagens.py` rodam o LibreOffice ao final e falham com qualquer
`#REF!`/`#NAME?`. Depois, confira três números contra o `trip.json` (total
previsto, hospedagem, custo de um dia) antes de dizer que está pronta. Uma
linha *Ajuste* negativa na aba Itens é erro no `trip.json`, não na planilha.

**Se sair site, a identidade vem do destino e o QA é portão.** Paleta, fontes,
silhueta e momento no bloco `design` do `trip.json`
(`site-viagem/references/design.md`), e `qa-site.mjs <slug>` tem que passar.

**Uma correção vale mais que uma sugestão.** Quando achar um conflito real,
destaque-o em vez de resolver em silêncio — é o trabalho mais valioso aqui e o
mais fácil de tornar invisível.

**Nunca recrie um destino que já existe.** Se `destinos/<slug>/` existe, o
trabalho é de atualização incremental: preserve customizações, faça merge no
`trip.json`, e diga o que mudou.

**Casa é Portugal: moeda base EUR, fuso Europe/Lisbon.** Isso vem de
`perfil/PERFIL.md` e vai para o bloco `casa` de cada `trip.json` — nada no
repo assume país, moeda ou fuso fixos fora dele. Dentro da zona euro não há
câmbio; fora dela, câmbio, documentação e fuso são de primeira classe.
Nacionalidade (que decide visto fora do Schengen) fica no perfil, não é
inferida.

## Idioma

Todo conteúdo gerado — planilhas, sites, markdowns, commits — em português do
Brasil.
Nomes de arquivo e de código em inglês ou slug sem acento.

## Stack da planilha

Python 3 + `openpyxl`; recálculo e verificação com LibreOffice headless
(`planilha-viagem/scripts/recalc.py`). Fórmulas só de Excel 2007 (`SUMIFS`,
`INDEX`/`MATCH`, `IFERROR`) — nunca `XLOOKUP`/`FILTER`, que o LibreOffice não
avalia. Nenhum total digitado: tudo é fórmula. Azul = entrada, preto =
fórmula, verde = fórmula que lê outra aba, amarelo = premissa-chave.

## Stack do site (opcional)

React 19 + Vite + Tailwind v4, num palco de uma tela só (sem rolagem; dias e
tiles abrem em modal). Dependências de runtime: apenas `react`, `react-dom` e
`leaflet`. Dados ao vivo vêm de APIs sem chave (Open-Meteo, Nominatim,
exchangerate, tiles CARTO) chamadas direto do browser. Resista a adicionar
dependências: o template é de propósito magro para não apodrecer entre viagens.
Movimento só na carga e em resposta a um clique.
