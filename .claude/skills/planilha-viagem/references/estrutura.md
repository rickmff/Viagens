# Estrutura da planilha

Referência coluna a coluna do que `gerar-planilha.py` produz. Serve para ler
uma planilha que o usuário devolveu editada, e para mudar o gerador sem
quebrar o que as outras abas esperam.

## Convenções

| Sinal | Significado |
|---|---|
| Texto **azul** | entrada: veio do `trip.json` ou é para o usuário editar |
| Texto **preto** | fórmula dentro da mesma aba |
| Texto **verde** | fórmula que lê outra aba (Parâmetros, Itens, Real) |
| Fundo **amarelo** | premissa que mais mexe no total (teto, pessoas, reserva, câmbio, fator) |
| Fundo **creme** | a coluna Opção ▼ — o único lugar que precisa mexer para montar um cenário |
| Fundo **rosa** | categoria intocável |
| Fundo **cinza** | subtotal |
| *Itálico* | linha de estimativa (categoria sem itens detalhados) |
| Fonte Arial 10 em tudo; moeda `€ #.##0,00`; zero aparece como `-` |

Fórmulas só de Excel 2007: `SUMIFS`, `INDEX`, `MATCH`, `IFERROR`, `COUNTIF`,
`TEXT`, `TODAY`. Nunca `XLOOKUP`, `FILTER`, `UNIQUE`, `LET`: o LibreOffice do
recálculo não avalia e o arquivo sai com `#NAME?`.

## Parâmetros

Célula fixa → todas as outras abas apontam para cá com `$`.

| Célula | O quê | Tipo |
|---|---|---|
| B3 | slug | entrada |
| B4 / B5 | início / fim | entrada (data) |
| B6 | noites `=B5-B4` | fórmula |
| B7 | dias `=B5-B4+1` | fórmula |
| B8 | pessoas | entrada, amarelo |
| B9 | moeda de casa | entrada |
| B10 | teto informado | entrada, amarelo |
| B11 | teto é por (`total` / `pessoa`) | lista, amarelo |
| B12 | teto do grupo | fórmula |
| B13 | reserva para imprevistos (%) | entrada, amarelo |
| B14 | margem do cartão fora do euro | entrada, amarelo |
| B15 | opção padrão dos itens | informativo |
| B16 | data da pesquisa | entrada |
| B17 | status | entrada |
| A22:E… | tabela de câmbio: moeda, EUR por 1, data, fonte | moeda de casa = 1; sem cotação = amarelo vazio |
| A…:E… | tabela de categorias: id, nome, fator econômico, intocável, origem do número | fator = `economico / previsto` do trip.json |

## Itens

Uma linha por custo. Cabeçalho na linha 1, painéis congelados em D2, filtro
automático ligado.

| Col | Papel | Tipo |
|---|---|---|
| A | ID (`voo:ida`, `hosp:<id>`, `taxa:<id>`, `transp:<id>`, `dia<n>:<bloco>`, `est:<categoria>`) | entrada |
| B | categoria (lista da tabela de categorias) | entrada |
| C | item | entrada |
| D | quando (data) | entrada |
| E | qtd | entrada |
| F | unidade: `pessoa` (× pessoas) · `total` (uma vez) · `noite` (qtd = noites) · `pessoa-noite` (× pessoas × qtd) | lista |
| G | moeda | entrada |
| **H** | **Opção ▼**: `econômico` · `plano` · `upgrade` | lista, creme |
| I | preço econômico — número azul se pesquisado, senão `=J*fator(categoria)` | entrada ou fórmula |
| J | preço plano | entrada |
| K | preço upgrade — número azul se pesquisado, senão `=J` | entrada ou fórmula |
| L | preço escolhido `=IF(H="econômico",I,IF(H="upgrade",K,J))` | fórmula |
| M | multiplicador `=E*IF(F em {pessoa, pessoa-noite}, pessoas, 1)` | fórmula (verde) |
| N | câmbio + margem `=INDEX(taxa)*(1+IF(moeda=casa,0,margem))` | fórmula (verde) |
| O / P / Q | total econômico / plano / upgrade em EUR `=M*preço*N` | fórmula |
| **R** | **total escolhido** `=M*L*N` | fórmula, negrito |
| S | intocável (da categoria) | fórmula (verde) |
| T | dia do roteiro (para o subtotal na aba Roteiro) | entrada |
| U | **link para reservar / comprar** (hiperlink, texto = domínio) | entrada |
| V | o que é o econômico | texto |
| W | o que é o upgrade | texto |
| X | fonte / observação | texto |

Os preços são **por unidade** (por pessoa, por noite ou total, conforme F).
Hospedagem `por: total` no trip.json chega aqui dividida pelas noites.

Para acrescentar um item na mão: copiar uma linha inteira (L a S vêm junto),
trocar A–K, T e U. A validação de lista vale até 200 linhas abaixo da última.

## Resumo

| Bloco | Conteúdo |
|---|---|
| Linhas 4–5 | período, pessoas, noites, dias (lê Parâmetros) |
| Tabela (linha 7 em diante) | por categoria: tudo econômico (O) · plano (P) · **escolhido ★** (R) · tudo upgrade (Q) · real (aba Real) · real − escolhido · intocável — tudo `SUMIFS` na aba Itens |
| Total previsto · reserva · total com reserva | por coluna |
| Por pessoa · por dia · por pessoa por dia | totais / Parâmetros |
| Gasto em solo · alimentação / gasto em solo | o alarme dos 15–20% |
| Teto · folga · uso do teto · veredito | texto "cabe, sobram X €" / "faltam X €" |
| Gráfico | barras por categoria, quatro séries |

## Roteiro

Uma linha por bloco, agrupadas por dia, com subtotal `SUM` por dia e total
`SUMIFS` dos blocos com custo. O custo de cada bloco lê a coluna R da linha
correspondente em Itens (opção escolhida). Blocos de deslocamento aparecem
sem custo quando a viagem tem `transportes[]`.

## Reservas

Ordenadas pelo prazo. D = dias restantes `=C-TODAY()`; E = status (lista:
`pendente` / `feita` / `não precisa`); F = valor pago em EUR (entrada, para
lançar depois no Real); G = link. B2 mostra "n de N feitas".

## Real

Data, categoria (lista), descrição, valor, moeda, ignorar (`sim` tira do
total), EUR (fórmula com câmbio e margem), pago por. A linha 5 é um exemplo
marcado com ignorar = `sim`: sobrescreva. Fórmulas prontas até a linha 205.

## Cortes

Uma linha por item, ordenada na geração pela economia estimada (escolhido −
econômico), intocáveis por último. F = economia `=MAX(0, D-E)`, G =
acumulado, I = "← aqui" na primeira linha em que o acumulado cobre o que
falta para o teto (D2, lido do Resumo). A ordem é fixa; os valores são vivos.

## Comparação (`comparar-viagens.py`)

Aba `Comparação` + `S_<slug>`, `P_<slug>`, `I_<slug>` por viagem (o slug é
encurtado a 20 caracteres para caber no limite de 31 do nome de aba). Linhas:
datas e pessoas; escolhido por categoria; total escolhido, reserva, total com
reserva; tudo econômico / plano / tudo upgrade com reserva; por pessoa, por
dia, **por pessoa por dia**, por noite de hospedagem, voos como % do total;
teto, folga, veredito; "mais barata no total" e "mais barata por pessoa por
dia" (`INDEX/MATCH` no mínimo). Coluna final = Δ última − primeira.

## Ler uma planilha editada

```python
from openpyxl import load_workbook
wb = load_workbook(caminho, data_only=True)      # valores calculados
it = wb["Itens"]
escolhas = {it[f"A{r}"].value: it[f"H{r}"].value for r in range(2, it.max_row + 1) if it[f"A{r}"].value}
real = [[c.value for c in row] for row in wb["Real"].iter_rows(min_row=5) if row[0].value and row[5].value != "sim"]
```

`data_only=True` só tem valores se a planilha foi recalculada (o gerador faz
isso; o Excel também, ao salvar). Nunca salve um workbook aberto com
`data_only=True`: as fórmulas somem.
