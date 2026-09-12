---
name: planilha-viagem
description: Gera a planilha Excel de uma viagem a partir do trip.json — orçamento com fórmulas vivas, cada item com três opções (econômico / plano / upgrade) que o usuário escolhe numa coluna, link para reservar ou comprar em cada linha, roteiro dia a dia, reservas com prazo, gastos reais durante a viagem e a lista de cortes na ordem que menos dói — e a planilha de comparação entre viagens (mesmo destino em épocas diferentes, ou dois destinos disputando a mesma janela) com custo por pessoa por dia. Use sempre que o usuário pedir a planilha, o Excel, o orçamento "em planilha", quiser comparar orçamentos de viagens, quiser testar um upgrade ou um corte, pedir para atualizar a planilha de um destino existente, ou quando pesquisa, roteiro e orçamento já estão no trip.json e falta a entrega. É a entrega padrão do repo.
---

# Planilha da viagem

A planilha é a entrega final: um `.xlsx` que abre no Excel, no Numbers e no
LibreOffice, que recalcula sozinho e que o usuário consegue mexer sem escrever
fórmula nenhuma. O site imersivo continua existindo (`site-viagem`), mas só
sai quando ele pedir. O que ele quer decidir é **quanto custa, o que dá para
melhorar, o que dá para cortar, e qual das viagens compensa** — e isso é
trabalho de planilha.

A planilha é **derivada** do `trip.json`. O gerador já sabe desenhar tudo que
o contrato descreve; o seu trabalho é ter dados bons: preços com fonte, as
opções de cada item pesquisadas, e o link de compra em cada linha.

## Fluxo

```bash
# 1. planilha da viagem → destinos/<slug>/orcamento-<slug>.xlsx
python3 .claude/skills/planilha-viagem/scripts/gerar-planilha.py <slug>

# 2. comparação entre viagens → comparacoes/<nome>.xlsx
python3 .claude/skills/planilha-viagem/scripts/comparar-viagens.py <nome> <slug1> <slug2> [...]

# 3. roteiro imprimível em markdown, do mesmo trip.json
node .claude/skills/site-viagem/scripts/gerar-roteiro.mjs <slug>
```

Os dois scripts rodam o recálculo no LibreOffice ao final e **falham se
qualquer fórmula der erro**. Planilha com `#REF!` ou `#NAME?` não é entregue.
Depois do recálculo, abra com `openpyxl` em `data_only=True` e confira três
números contra o `trip.json` — total previsto, total da hospedagem, custo de um
dia — antes de dizer que está pronta. Recálculo verde prova que as fórmulas
avaliam, não que estão certas.

## As abas

| Aba | O que tem | O que o usuário mexe |
|---|---|---|
| **Resumo** | por categoria: tudo econômico · plano · **escolhido ★** · tudo upgrade · real; totais, reserva, por pessoa, por dia, folga contra o teto, veredito, gráfico | nada — é tudo fórmula |
| **Parâmetros** | pessoas, datas, teto e se é por pessoa, reserva %, margem do cartão, tabela de câmbio, categorias com fator econômico e intocável | as células amarelas |
| **Itens** | uma linha por custo: qtd, unidade, moeda, **Opção ▼**, preço econômico / plano / upgrade, totais em EUR, **link para reservar/comprar**, o que é cada opção, fonte | a coluna Opção ▼ e os preços azuis |
| **Roteiro** | dia a dia com hora, bloco, custo da opção escolhida, reservar antes, feito, link, plano B | Feito |
| **Reservas** | por prazo, dias restantes, status, valor pago, link | Status e valor pago |
| **Real** | lançamentos durante a viagem, convertidos para EUR pela tabela de câmbio | tudo |
| **Cortes** | economia de trocar cada item para o econômico, do maior corte ao menor, acumulado, "← aqui" quando já cabe no teto | nada |

A comparação (`comparacoes/<nome>.xlsx`) traz as abas Parâmetros e Itens de
cada viagem (`P_<slug>`, `I_<slug>`) e uma aba **Comparação** com o escolhido
por categoria, totais com reserva nos três extremos, **por pessoa por dia**
(a linha justa para viagens de durações diferentes), folga contra o teto e
qual é a mais barata. Mudar uma opção na aba `I_` de uma viagem refaz a
comparação.

Detalhe de cada coluna, cores e convenções: `references/estrutura.md`.

## As três opções de cada item

É o que faz a planilha valer mais que o orçamento em prosa. Para **cada item
que aceita escolha** — voo, hotel, ingresso, refeição, transporte — o
`trip.json` leva `custo.opcoes.economico` e `custo.opcoes.upgrade`, cada um
com `valor`, `descricao` e, quando houver, `link`:

```jsonc
"custo": {
  "valor": 130, "moeda": "EUR", "por": "noite",
  "link": "https://all.accor.com/hotel/1399/index.en.shtml",
  "opcoes": {
    "economico": { "valor": 105, "descricao": "ibis budget no 12º", "link": "https://..." },
    "upgrade":   { "valor": 175, "descricao": "Villa Beaumarchais 4★ no Marais", "link": "https://..." }
  }
}
```

Regras:

- **O econômico tem que ser real**, não "o mesmo mais barato": é outro hotel,
  outro aeroporto, ver de fora em vez de entrar. A descrição diz o que se
  perde. O upgrade diz o que se ganha.
- Item sem `opcoes` cai no **fator da categoria** (econômico = plano × fator,
  vindo de `orcamento.categorias[].economico / previsto`) e sem upgrade. É o
  fallback, não o objetivo: os itens grandes — voo, hotel, o ingresso caro —
  sempre com opções pesquisadas.
- Refeição sem opção pesquisada ganha um par automático (padaria / bistrô)
  marcado como tal. Troque quando souber o nome do lugar.
- **Link em todo item comprável**: `link` no custo, no voo, na hospedagem, no
  transporte ou no bloco. Site oficial primeiro; comparador quando o usuário
  compra por ele (o perfil diz qual). Item sem link é item que ele vai ter
  que procurar de novo no dia da compra.

## Coerências que o gerador confere

- A soma dos itens de uma categoria fecha com `categorias[].previsto`: o que
  falta vira uma linha *Estimativa restante* (em itálico); o que sobra vira
  uma linha *Ajuste* negativa. **Ajuste negativo é erro no trip.json** — um
  preço por trecho gravado como ida e volta, um passe contado duas vezes.
  Corrija a fonte, não a planilha.
- Bloco de deslocamento com custo só entra quando a viagem não tem
  `transportes[]`; se tem, o passe já está lá e o bloco é informativo.
- Hospedagem com `noites` explícito quando as datas não contam (a noite da
  Disney no meio de três noites em Paris).
- Categoria intocável tem fator 1 e fica rosa no Resumo e nos Cortes.

## Destino existente

Nunca regenere por cima de uma planilha que ele já editou sem avisar. O
arquivo de saída é derivado: se ele lançou gastos reais ou trocou opções na
planilha, **leia a aba Real e a coluna Opção ▼ antes** (`openpyxl`,
`data_only=True`), passe as escolhas para o `trip.json` (`custo.opcao`,
`categorias[].real`) e só então regenere. Diga o que mudou.

## Quando mexer no gerador

Só quando a mudança for de estrutura — uma aba nova, uma coluna, uma regra de
coerência — nunca de conteúdo (isso vai no `trip.json`). Mantenha as
convenções de `references/estrutura.md`: fórmulas de 2007 (`SUMIFS`, `INDEX`,
`MATCH`, `IFERROR`), nunca `XLOOKUP`/`FILTER`; nada de total digitado; azul
para entrada, preto para fórmula, verde para fórmula que lê outra aba.

## Ao terminar

Caminho da planilha e da comparação, resultado do recálculo, os três números
conferidos, e o que ficou sem opção ou sem link por falta de pesquisa. Depois
`perfil-viajante` no modo escrita: qual opção ele escolheu onde (upgrade no
hotel, econômico no voo) é o sinal mais estável de como ele prioriza dinheiro.
