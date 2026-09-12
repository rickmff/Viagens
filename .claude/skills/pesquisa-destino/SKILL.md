---
name: pesquisa-destino
description: Pesquisa um destino de viagem na web, com fontes datadas, e grava os fatos em destinos/<slug>/PESQUISA.md e no trip.json — documentação para brasileiros, festivais e sazonalidade com previsão do ano, o que abre e fecha em cada dia da semana, horário de última entrada, custos reais, taxa de turismo, tarifa dupla, voos, bairros, transporte, segurança e a lista de atrações candidatas filtrada pelo perfil. Use sempre que o usuário mencionar querer viajar para algum lugar, pedir sugestões de roteiro, perguntar "vale a pena ir para X em tal mês", perguntar qual a melhor época para visitar um país, quiser saber quanto custa uma viagem, precisar de informação de visto, ou pedir para atualizar a pesquisa de um destino que já existe no repo. É o passo que antecede a geração do site.
---

# Pesquisa de destino

O objetivo não é produzir um guia turístico — é produzir **dados confiáveis o
bastante para virar roteiro e orçamento**. Tudo que você pesquisar acaba virando
um número no orçamento ou um pino no mapa. Se não dá para usar numa decisão,
não pesquise.

Um roteiro só vale alguma coisa se a pessoa conseguir cumprir. Os bonitos
falham por motivos chatos: o museu fecha na terça, o ingresso abriu à venda num
único instante, o mercado não abre domingo, o festival era na outra semana.
Esta skill existe para pegar isso **antes** da ordem dos dias estar fixada.

## Antes de começar

Leia `perfil/PERFIL.md` (skill `perfil-viajante`). Ele decide o recorte da
pesquisa inteira: quem satura de museu e prioriza comida de rua precisa de uma
pesquisa diferente de quem quer arte. Pesquisar genericamente e filtrar depois
desperdiça a maior parte do trabalho.

Depois verifique se `destinos/<slug>/` já existe. Se existir, isto é uma
**atualização**: leia `PESQUISA.md` e `trip.json`, pesquise só o que está
desatualizado ou faltando, preserve o que já foi decidido. Nunca sobrescreva um
destino existente do zero — pode haver reserva confirmada ali.

## A ordem importa

As três primeiras etapas podem matar ou salvar a viagem, e nenhuma delas é
sobre preço. Fazer preço antes de calendário é o erro mais caro aqui, porque
pesquisar o custo de um museu que fecha no único dia livre é trabalho jogado
fora.

### 1. Documentação para brasileiros

Visto (necessário? e-visa? na chegada?), autorização eletrônica prévia mesmo
com isenção (ETA, ESTA, K-ETA, ETIAS — "não precisa de visto" não quer dizer
"não precisa de nada"), validade mínima de passaporte, vacinas, seguro
obrigatório, prova de saída, comprovante de fundos.

É o único item da lista que impede o embarque. Fonte oficial, e anote a data da
consulta em `documentacao.verificadoEm`.

### 2. Ancorar as datas

Ache primeiro o que **não** se move, e construa o resto em volta:

- **Festivais e eventos de data fixa.** Procure sempre. Muitos destinos têm um
  evento por semana e o viajante não sabe que existe — um festival transforma
  uma viagem, e descobri-lo depois de comprar a passagem é frustrante.
- **Fenômenos sazonais** (folhas de outono, floração, neve, temporada de
  marisco). Procure a **previsão daquele ano**, não a média histórica: as datas
  se deslocam, e uma previsão desatualizada estraga justamente o motivo da
  viagem.
- **Feriados locais e férias escolares do país de destino.** Enchem hotel e
  trem, e mudam preço. Um fim de semana que inicia um feriado é o pico da
  viagem — e, em bilhete multi-dias precificado pelo primeiro dia, faz a
  sexta-feira anterior ser o começo mais barato.
- **Alta e baixa temporada**, para a pessoa entender o custo da escolha.
- **Pôr do sol** no meio da viagem e mudança de horário de verão.

Se a janela que ele quer não entrega o que ele quer, **diga isso antes de
montar roteiro**. É a informação mais valiosa que você pode dar e a mais fácil
de enterrar num parágrafo no fim.

**Datas flexíveis pedem uma tabela, não uma sugestão.** Compare as épocas
candidatas numa tabela curta — preço do voo, diária média, clima, multidão, e o
que cada época faz com a lista de desejos dele — e recomende uma, com o motivo.

Explicite o compromisso em vez de escondê-lo: a época mais barata raramente é a
melhor para a lista de desejos, e a mais bonita é quase sempre a mais cara.
Quem escolhe é ele, mas só consegue escolher se o custo da escolha estiver na
mesa.

### 3. Verificar o que abre

Leia `references/verificacoes.md` inteiro antes de decidir a ordem dos dias.
Fechamento semanal, reservas com data-limite, riscos que merecem aviso, e a
passagem final dia a dia que pega o que escapou.

Quando achar um conflito, **reorganize a ordem e explique por quê**. Corrigir
em silêncio desperdiça a melhor parte do seu trabalho: o viajante precisa saber
que aquilo foi verificado, senão vai reconferir tudo por conta.

### 4. Custo real

Voo Brasil→destino no período, diária na faixa do perfil, refeição típica,
transporte urbano, ingresso das atrações principais, **taxa de turismo por
pessoa por noite** onde existir (Roma cobra, Paris cobra — é linha de
orçamento, não rodapé).

Números de fontes recentes, com a moeda local explícita e a data da consulta.
Não estime de cabeça: orçamento sobre preço inventado é pior que nenhum.

Onde houver **tarifa dupla residente/visitante** (França desde 2026, entre
outros), registre as duas colunas — o site tem um botão que alterna entre elas.

Passe de transporte e city pass merecem a conta explícita: some o avulso do que
o roteiro realmente visita, espalhado nos dias reais, e compare. Passe semanal
com janela fixa segunda a domingo quase nunca serve viagem que começa na
quinta. A resposta honesta costuma ser "não compensa" — dê a matemática, não o
veredito sozinho.

### 5. Voos

Compare o que os agregadores mostram, mas **compre no site da companhia** — a
diferença é pequena e o atendimento quando algo dá errado não se compara.

Sempre considere:

- **Aeroportos vizinhos** e voos separados até lá. Se o bilhete for separado,
  avise que ninguém reembolsa conexão perdida, e sugira chegar na véspera.
- **Multidestino**, entrando por uma cidade e saindo por outra. Economiza dias
  inteiros de trem e quase nunca custa mais. É a otimização mais subaproveitada
  em roteiro de várias cidades.
- **Escalas longas**: pergunte se querem parar alguns dias. Se for trânsito
  puro, confirme que não precisam de visto de trânsito; se saírem do aeroporto,
  verifique os requisitos de entrada.

### 6. Geografia prática

Quais bairros servem de base e por quê (linha direta para o aeroporto, para a
atração principal, mais barato que o centro), quanto tempo se perde entre as
regiões, se dá para fazer a pé.

É isso que determina se o roteiro é realista ou uma lista de desejos que ignora
deslocamento.

### 7. Sobrevivência e comida

Pagamento (cartão passa? precisa dinheiro vivo?), eSIM, tomada, água, gorjeta,
golpes comuns, bairros a evitar à noite, número de emergência, etiqueta.
Pratos e mercados que valem a viagem, com as restrições do perfil respeitadas.

Endpoints, padrões de busca e onde achar cada coisa: `references/fontes.md`.

## O que produzir

### `destinos/<slug>/PESQUISA.md`

O material bruto com as fontes, organizado nas etapas acima. Existe para você
conferir de onde veio um número seis meses depois, e para a próxima atualização
saber o que já foi pesquisado. Toda afirmação com número, regra ou data leva
link e data de consulta; opinião pode ir sem fonte, desde que fique claro que é
opinião.

Escreva com opinião. "Kyoto em abril é lindo e é um inferno de multidão; se a
data for flexível, maio entrega 80% das flores com metade da gente" vale mais
que três parágrafos neutros.

### `destinos/<slug>/trip.json`

Siga `docs/trip-schema.md`. Preencha `destinos` (com `lat`/`lon`, moeda e
fuso), `documentacao`, `gastronomia`, `frases`, `links` e `avisos`. Deixe
`dias` e `reservas` para `roteiro-viagem`, e `voos`, `hospedagens` e
`orcamento` para as etapas seguintes.

O que a pesquisa entrega para o roteiro é a **lista de candidatos**: cada
atração e experiência filtrada pelo perfil, com duração real, dia de
fechamento, horário de última entrada, se precisa reserva e com quanta
antecedência, custo com moeda, e coordenadas. Grave isso na `PESQUISA.md` numa
tabela — é dela que `roteiro-viagem` monta os dias sem precisar pesquisar de
novo.

Campo que você não pesquisou fica `null`. O site esconde seção vazia, então um
`trip.json` honesto gera um site menor e verdadeiro; um inventado gera um site
bonito que faz alguém perder o voo.

## Geocodificação

Todo lugar que vira pino precisa de `lat`/`lon`. Use Nominatim
(`references/fontes.md` traz o endpoint e o limite de 1 req/s). Geocodifique em
lote no fim, não um a um no meio da pesquisa.

## Ao terminar

Resuma em prosa: a janela é boa, quanto deve custar mais ou menos, o que exige
ação imediata, e uma recomendação clara. Destaque o que a pesquisa derrubou —
uma época ruim, um lugar fechado no período, um passe que não compensa — porque
uma correção vale mais que uma sugestão. Depois: `roteiro-viagem` para virar
dias, e `perfil-viajante` no modo escrita.
