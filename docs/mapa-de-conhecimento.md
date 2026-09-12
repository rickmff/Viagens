# Mapa de conhecimento

Tudo que entrou neste repo veio de quatro fontes: a primeira versão destas
skills, e três skills enviadas que já tinham planejado viagem de verdade
(Paris + Disneyland e Roma na `travel-itinerary`; Japão na
`planeamento-de-viagem`; a síntese em `planeador-de-viagens`). Este mapa
classifica cada tema por origem e diz **em qual skill ele vive agora** — para
ninguém procurar no lugar errado, e para o próximo aprendizado ter onde entrar.

## As sete skills e o que cada uma é dona de

| Skill | Dona de | Produz |
|---|---|---|
| `planejar-viagem` | a ordem das coisas, o que pular, quando perguntar | a viagem inteira, de um prompt |
| `briefing-viagem` | perguntar em opções, cada vez menos | `BRIEFING.md` + sinais para o perfil |
| `perfil-viajante` | a memória: o que já se sabe e com que confiança | `perfil/PERFIL.md`, `perfil/insights.md` |
| `pesquisa-destino` | fatos verificados e datados | `PESQUISA.md` + destinos, documentação, candidatos |
| `roteiro-viagem` | o ofício de montar dias que se cumprem | `dias[]`, `reservas[]` |
| `orcamento-viagem` | dinheiro em duas colunas, com franqueza | `orcamento` |
| `site-viagem` | o palco imersivo e a identidade do destino | site + `roteiro-<slug>.md` + QA |

Contrato entre todas: `docs/trip-schema.md`.

## Classificação por tema

Legenda das origens: **v1** = primeira versão deste repo · **TI** =
travel-itinerary · **PdV** = planeamento-de-viagem · **PlV** =
planeador-de-viagens.

### Memória e aprendizado

| Tema | Origem | Vive em |
|---|---|---|
| Perfil com níveis de confiança (hipótese / provável / confirmado), promoção por repetição, contradição derruba | v1 | `perfil-viajante` |
| Critério de entrada: só o que mudaria uma decisão em outro destino | v1 | `perfil-viajante` |
| Interesse dito de passagem é pedido e é o sinal mais revelador | PdV, PlV | `perfil-viajante`, `roteiro-viagem`, `planejar-viagem` |
| Enquadrar sem interrogatório: substância antes de perguntar, colher pelo caminho | PdV | `planejar-viagem` |
| Perguntar em opções tocáveis, não em lista de texto | PdV, PlV | `briefing-viagem` |
| Teto de 3 perguntas por sessão; suposição marcada > pergunta feita | v1 | `planejar-viagem`, `perfil-viajante` |
| Não refazer o plano inteiro a cada ajuste | PdV | `planejar-viagem` |

### Calendário e verificações

| Tema | Origem | Vive em |
|---|---|---|
| Calendário antes de preço: férias escolares do destino, feriados, alta temporada | TI, PdV, PlV | `pesquisa-destino` |
| Festivais e eventos de data fixa como âncoras | PdV, PlV | `pesquisa-destino`, `roteiro-viagem` |
| Fenômeno sazonal: previsão daquele ano, não média histórica | PdV, PlV | `pesquisa-destino`, `fontes.md` |
| Tabela comparativa de épocas quando as datas são flexíveis | PlV | `pesquisa-destino` |
| Fechamento semanal por tipo de lugar; verificar contra o dia da semana, não "está aberto" | TI, PdV, PlV | `verificacoes.md` |
| Horário de última entrada ≠ horário de fechar | PlV | `verificacoes.md` |
| Parque temático em dia útil, nunca domingo | PlV | `verificacoes.md` |
| Janela de venda de ingresso com hora exata, convertida para o fuso de casa | TI, PdV | `verificacoes.md`, `roteiro-viagem`, site (`Reservas.jsx`) |
| Ingresso nominativo exige o nome do documento | TI | `verificacoes.md`, contrato |
| Reservas por urgência com data-limite | TI, PdV, PlV | `verificacoes.md`, contrato (`reservas[]`) |
| Riscos: clima, evento adiado, bilhete separado, frio, bagagem em trânsito | PdV | `verificacoes.md` |
| Serviço extinto em fonte velha: busca com o ano | TI | `fontes.md`, `verificacoes.md` |
| Passagem final dia a dia depois do roteiro montado | PdV, PlV | `verificacoes.md`, `roteiro-viagem` |

### Pesquisa e fontes

| Tema | Origem | Vive em |
|---|---|---|
| Documentação pela nacionalidade e residência (casa = Portugal); autorização eletrônica mesmo com isenção | v1, corrigido | `pesquisa-destino`, `fontes.md` |
| Transcrever o que o usuário deu antes de pesquisar; seus números viram a coluna "seu plano" | TI | `orcamento-viagem` |
| Só bilheteria oficial; URL que apareceu em busca, nunca de memória | TI, PdV | `fontes.md`, `roteiro-viagem` |
| Tarifa dupla residente / visitante | TI | contrato (`tarifaDupla`), site (`precos.jsx`) |
| Endpoints sem chave (Open-Meteo, Nominatim, exchangerate) testados | v1 | `fontes.md`, site |
| Voos: comprar na companhia, aeroportos vizinhos, multidestino, bilhete separado, visto de trânsito | PdV, PlV | `pesquisa-destino` |
| Sobrevivência: pagamento, eSIM, tomada, golpes, etiqueta, emergência | v1, TI | `pesquisa-destino`, `fontes.md` |
| Apps úteis por destino | TI | `pesquisa-destino` (sobrevivência), `links[]` |

### Roteiro

| Tema | Origem | Vive em |
|---|---|---|
| Construção geográfica, não temática; parada no trajeto custa horas, ida e volta custa um dia | PdV, PlV | `roteiro-viagem` |
| Um dia, uma zona; quatro cidades em cinco dias não é viagem | PlV | `roteiro-viagem` |
| Chegada e partida valem meio dia; dia sem plano acima de dez dias | PlV | `roteiro-viagem` |
| A hora do dia muda a experiência | PlV | `roteiro-viagem` |
| Notas de quem já esteve lá: fila, lado do trem, fila virtual | PdV | `roteiro-viagem` |
| Plano B para dia de chuva | v1 | contrato (`alternativa`), site |
| Dias cortáveis se a viagem encurtar | PdV | contrato (`cortavel`), site |
| Opção A / opção B para um dia | TI | contrato (`opcaoB`), site (`DiaModal.jsx`) |
| Três momentos por dia no bilhete | TI | contrato (`momentos`), site (`Bilhetes.jsx`) |
| Não encher dia leve com enchimento | TI | `roteiro-viagem` |

### Orçamento

| Tema | Origem | Vive em |
|---|---|---|
| De trás para frente: reserva primeiro, fixos, diário, extras | v1 | `orcamento-viagem` |
| Duas colunas: seu plano vs econômico + contingência | TI, PlV | `orcamento-viagem`, contrato (`economico`), site |
| Teto por pessoa ou total: assumir, dizer, oferecer a outra leitura | PdV, PlV | `orcamento-viagem`, contrato (`tetoPor`) |
| Comida é o item mais esquecido; orçar cada refeição; 15–20% do gasto em solo | PlV (corrigido aqui) | `orcamento-viagem` |
| Ligação ao aeroporto, hospedagem noite a noite, teto de compras | PlV | `orcamento-viagem` |
| Taxa de turismo como linha | TI, PlV | `orcamento-viagem`, contrato (`taxaTurismo`) |
| Custos que escapam: taxa no check-in, bagagem em low-cost, armário, gorjeta | PlV | `orcamento-viagem` |
| Passe vs avulso: somar o que o roteiro visita; o relógio de 48h | TI | `orcamento-viagem` |
| Custo real do cartão fora do euro (margem vem do perfil); câmbio com data | v1, corrigido | `orcamento-viagem`, site (`cambio.js`) |
| Onde não cortar: a razão de ser da viagem; cortes ordenados do que menos dói | PdV, PlV | `orcamento-viagem`, contrato (`intocavel`) |
| Franqueza quando não cabe, na primeira resposta em que ficar claro | PdV, PlV | `orcamento-viagem`, `planejar-viagem` |
| Cenários A/B/C de hospedagem e o que o prêmio compra | TI | `pesquisa-destino` (geografia prática) |
| Planilha xlsx com fórmulas vivas e upgrades ligáveis | PdV, PlV | **não adotado** — o orçamento do site cobre o caso sem `openpyxl` |

### Site

| Tema | Origem | Vive em |
|---|---|---|
| Palco de uma tela sem rolagem: topo, bilhetes, tiles | TI | `index.css`, `App.jsx` |
| Identidade derivada do destino: paleta, fontes, silhueta, momento | TI, PdV | `design.md`, contrato (`design`), `design.js`, `Ceu.jsx` |
| Uma abertura ousada, o resto disciplinado; movimento só na carga e no clique | TI, PdV | `design.md` |
| Bilhete de dia com canhoto picotado, numeral em serifa itálica | TI | `Bilhetes.jsx`, `index.css` |
| Tiles → modal com foco preso, ←/→/Esc, origem da escala no elemento clicado | TI | `Modal.jsx` |
| Contagem regressiva com "dia X de N" durante a viagem | TI | `Topo.jsx` |
| Botão de moeda que converte a página inteira | PdV | `precos.jsx` |
| Toggle residente / visitante | TI | `precos.jsx` |
| Mapa, clima, câmbio ao vivo; degradação sem rede | v1 | `Mapa.jsx`, `Clima.jsx`, `Cambio.jsx` |
| Checklists e blocos marcados persistem no aparelho | v1 | `usePersistido.js` |
| Celular: lista compacta, chips 3×2, folha inferior; viagem curta mostra os momentos | TI | `index.css` |
| Roteiro imprimível gerado do mesmo trip.json | TI, PdV | `gerar-roteiro.mjs` |
| QA como portão: erro de JS, rolagem, todo tile abre, links absolutos, capturas | TI | `qa-site.mjs` |
| Bugs prevenidos: link dentro de label, `animation-fill-mode` congelando hover, `close()` escondendo modal reaberto | TI | `Modal.jsx`, `DiaModal.jsx`, `index.css` |
| Formato tiles em arquivo HTML único | TI, PdV | **não adotado** — o stack é React + Vite; o modelo foi portado |
| Caminhos `/mnt/user-data/outputs`, `present_files` | TI, PdV | **não adotado** — ambiente Claude.ai, não este repo |

## O que ficou de fora, e por quê

- **Planilha xlsx** (`criar_planilha.py`, 436 linhas): forte, mas o orçamento
  do site já compara cenários, e uma dependência de `openpyxl` num repo com
  três dependências de propósito é uma decisão. Se o usuário orça no Excel,
  vale portar como script à parte.
- **HTML único**: o modelo imersivo foi portado para React + Vite, o stack
  escolhido. O que importava — a régua de design, o palco, a interação — está
  inteiro; o formato de arquivo era detalhe.
- **Português europeu**: as duas skills mais fortes eram em pt-PT. O texto
  ficou em pt-BR por consistência com o que já existia — mas o viajante mora em
  Portugal, então nada no repo assume Brasil como casa.

## Uma correção de fundação

A primeira versão deste repo assumiu "mora no Brasil, moeda BRL" e marcou como
*confirmado* — inferido do idioma, nunca dito. O usuário mora em Portugal e
gasta em euro. Tudo que dependia disso (IOF, "horário de Brasília",
"documentação para brasileiros", GRU) foi generalizado para um bloco `casa`
que vem do perfil. A lição foi para o CLAUDE.md: *confirmado* é só o que ele
disse.

## Como usar este mapa

Quando aparecer um aprendizado novo — um erro que custou tempo, uma regra
que salvou uma viagem — procure a linha mais próxima aqui e coloque o
aprendizado na skill que ela aponta. Se não houver linha, o tema é novo:
acrescente a linha, decida a skill, e escreva lá. Aprendizado sem endereço
vira parágrafo solto que ninguém relê.
