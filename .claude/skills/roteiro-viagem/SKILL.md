---
name: roteiro-viagem
description: Monta o roteiro dia a dia de uma viagem a partir da pesquisa e do perfil — decide a ordem dos dias pelo que abre em cada dia da semana, constrói por geografia e não por tema, conta meio dia nas pontas, escolhe a hora certa de cada lugar, escreve plano B para dia de chuva, marca os dias cortáveis e faz a passagem final de verificação — gravando dias[] e reservas[] no trip.json. Use sempre que o usuário pedir um roteiro, itinerário, "o que fazer em X dias", quiser reordenar ou trocar um dia, pedir para encaixar uma atração ou um interesse específico, achar que um dia ficou corrido ou vazio, ou quando a pesquisa de um destino já existe e falta transformá-la em dias. É o passo entre pesquisa-destino e orcamento-viagem.
---

# Montar o roteiro

Um roteiro bonito não é uma lista de lugares bonitos. É uma sequência que
funciona: cada dia abre quando o lugar abre, os trajetos encaixam uns nos
outros, e o ritmo é o ritmo da pessoa que vai cumprir. A maior parte dos
roteiros falha por detalhes chatos e verificáveis — o parque fecha na quarta,
o mercado não abre domingo, o museu vende ingresso num único instante do mês.
Esta skill existe para pegar isso **antes** de a ordem dos dias estar fixada,
porque depois sai caro mudar.

A pesquisa (`pesquisa-destino`) entrega os fatos; esta skill entrega os dias.
Não pesquise aqui — se um fato faltar, volte à pesquisa. Misturar os dois é o
que faz um roteiro sair com preço inventado e horário chutado.

## Antes de ordenar qualquer dia

Leia `perfil/PERFIL.md`: ritmo, quantos blocos por dia, acorda cedo ou não,
tolerância a deslocamento, o que ele já disse que não quer. O roteiro certo
para uma pessoa é o roteiro errado para outra, e o perfil é a única coisa que
diferencia os dois.

Leia `destinos/<slug>/PESQUISA.md` inteiro, com atenção especial à seção de
aberturas e fechamentos. E leia
`../pesquisa-destino/references/verificacoes.md` — é a tabela de fechamento
semanal, as reservas com prazo e a passagem final que esta skill aplica.

## Ordem de construção

**1. Âncoras primeiro.** O que tem data fixa e não se move: festival, evento,
ingresso de sorteio já ganho, reserva já feita, o dia único em que aquele
templo abre o jardim. Fixe esses dias e construa o resto em volta.

**2. Fechamentos decidem a ordem.** Para cada lugar pago, o dia de fechamento
semanal e o horário de última entrada (a bilheteria fecha 30 a 60 min antes da
porta). Confira cada parada contra **o dia da semana em que ela vai cair**,
não contra "está aberto". Museu que fecha segunda empurra o dia de museus para
outro lugar; parque temático vai para dia útil, nunca domingo havendo
alternativa.

**3. Geografia, não tema.** Entre por uma ponta, saia pela outra, e encaixe
paradas intermediárias **nos trajetos que já iam ser feitos**. Um lugar no
meio do caminho entre duas cidades custa algumas horas; o mesmo lugar como ida
e volta custa um dia inteiro. Dentro de cada dia, **uma zona só** — atravessar a
cidade três vezes gasta o dia em transporte. Quatro cidades em cinco dias é
viagem de rodoviária com paradas turísticas.

**4. As pontas valem meio dia.** Chegada e partida não são dias inteiros: um
voo que pousa às 16h não rende tarde de museu depois de imigração, bagagem e
trajeto. Reserve o primeiro dia para chegada e fuso. Em viagem de mais de dez
dias, deixe um dia inteiro sem plano.

**5. A hora do dia é parte do lugar.** Mirante e lugar muito fotografado de
manhã cedo, mercado na hora do café, bairro de luzes ao anoitecer, templo às
6h30 quando os portões estão vazios e às 9h é fila. Escolher a hora certa vale
mais que escolher o lugar certo.

**6. Cada interesse dele vira pelo menos um bloco.** Inclusive os que ele
mencionou de passagem ("a gente é nerd", "ela adora cerâmica"). Se um item da
lista de desejos for impossível na época, diga isso já e proponha o mais
próximo — nunca deixe cair em silêncio.

## Cada dia

Um objeto em `dias[]` conforme `docs/trip-schema.md`, com:

- `titulo` curto e `resumo` de uma linha — o bilhete do site mostra os dois.
- `blocos` com hora, duração, tipo, custo (com moeda e por pessoa/total),
  `reservaNecessaria` quando for o caso, `lat`/`lon` para virar pino.
- `momentos`: os três instantes que resumem o dia no bilhete. Três — não dois,
  não cinco. Se omitir, o site usa os três primeiros blocos.
- `notas` com o que só quem já esteve lá sabe: a que horas chegar para não
  pegar fila, de que lado do trem sentar, qual fila virtual abrir assim que
  entrar no parque, qual dia da semana é o mais vazio. É isso que separa um
  roteiro de uma lista.
- `alternativa` nos blocos ao ar livre quando o clima do período for instável.
  É o campo que salva o dia de chuva.
- `cortavel: true` nos dias mais fáceis de sacrificar. Viagem encurta, e é
  melhor a decisão já estar tomada do que ser improvisada na véspera.
- `opcaoB` quando o dia tem duas versões legítimas (museus ou bate-volta).

Não encha dia leve com enchimento. Dia de chegada é dia de chegada; dizer isso
é mais útil que inventar uma atração para preencher a tarde.

## Reservas com prazo

Ao terminar os dias, percorra-os e liste em `reservas[]` tudo que precisa ser
comprado antes, com urgência e **data-limite** — prazo sem data é só
ansiedade. Onde a venda abre num instante específico, grave a hora local e a
hora em Brasília; se cair de madrugada, é isso que decide se a pessoa põe
despertador. Ingresso nominativo leva o nome do documento exato.

## Passagem final

Depois do roteiro montado, percorra-o dia a dia e confirme, para cada parada,
que o dia da semana em que ela caiu está aberto e dentro do horário de última
entrada. É rápido e é nesta passagem que aparecem os conflitos que
sobreviveram — porque a ordem mudou no meio do caminho e ninguém reconferiu.
Não pule.

Quando achar um conflito, **reorganize e diga por quê**. Uma correção dessas
vale mais para o viajante que três sugestões de restaurante, e resolver em
silêncio joga fora a melhor parte do trabalho.

## Ao terminar

Descreva a forma do roteiro em duas ou três frases — não a lista dos dias, que
está no arquivo. Destaque os conflitos que você corrigiu e o que ficou de fora
por ser impossível na época. Depois: `orcamento-viagem` para os números,
`site-viagem` para a entrega, e `perfil-viajante` no modo escrita — o que ele
aceitou e recusou aqui é o sinal mais direto de ritmo que existe.
