---
name: planejar-viagem
description: Entrada principal do repo de viagens — pega um prompt solto com destino, orçamento e o que a pessoa quer fazer, e devolve a planilha Excel de orçamento daquele destino (e a comparação, quando há mais de uma viagem), criando do zero ou atualizando um que já existe. Encadeia perfil-viajante, briefing-viagem (quando faltar muita coisa), pesquisa-destino, roteiro-viagem, orcamento-viagem e planilha-viagem (site-viagem só sob pedido), e fecha gravando na memória o que aprendeu. Use SEMPRE que o usuário disser que quer viajar para algum lugar, jogar um pedido no formato "quero ir pra X em tal mês com tanto de orçamento", pedir um roteiro, pedir a planilha ou o Excel de uma viagem, pedir para comparar viagens, pedir para mudar ou incrementar uma viagem já planejada, ou perguntar se dá para fazer tal destino com tal dinheiro. É a skill que orquestra as outras — na dúvida entre ela e uma das específicas, comece por ela.
---

# Planejar viagem

Esta skill existe para que um prompt de uma linha vire uma planilha de
orçamento que decide a viagem. O usuário escreve algo como:

> quero ir pra Lisboa em maio, uns 8 mil, quero museu e comer bem

e o resultado esperado é um `.xlsx` pronto — não uma conversa de vinte
perguntas. Cada rodada também deixa o repo mais esperto, de modo que o prompt
da próxima viagem possa ser ainda mais curto.

## O ciclo

```
perfil (ler) → [briefing] → pesquisa → roteiro → orçamento → planilha → perfil (escrever)
                                                                  └→ site, só se pedir
```

As skills do meio fazem o trabalho; esta decide a ordem, o que pular e quando
parar para perguntar. O briefing entre colchetes só entra quando o pedido
chegou com mais de duas lacunas estruturais ou o perfil ainda está vazio — e
mesmo aí ele pergunta em opções, não em texto.

### 1. Ler a memória — sempre primeiro

Leia `perfil/PERFIL.md` (skill `perfil-viajante`, modo leitura) **antes** de
responder qualquer coisa. É o que separa este repo de um chat qualquer: o que
está lá como provável ou confirmado já está respondido e não se pergunta de
novo. Perguntar o que o perfil sabe é o principal modo de falha aqui.

### 2. Entender o pedido, sem interrogatório

Extraia do prompt o que der: destino, janela de datas, teto de orçamento,
desejos explícitos ("museu", "comer bem", "sem acordar cedo"), companhia.
O que faltar, complete pelo perfil.

**Não abra com uma bateria de perguntas.** Seis perguntas de uma vez matam a
conversa e fazem o usuário sentir que está preenchendo formulário em vez de
planejando viagem. Comece respondendo com substância real ao que ele trouxe —
um veredito sobre a época, uma faixa de preço, uma observação que ele não
sabia — e recolha o resto pelo caminho. Informação dada no meio de uma conversa
que já está rendendo vem mais completa e mais honesta que informação arrancada
antes de qualquer entrega.

Quando faltar mesmo algo estrutural, aplique o limite de **3 perguntas** e o
critério de materialidade: só o que muda o roteiro de verdade e o perfil não
responde. Data e orçamento normalmente valem. Ritmo, estilo de hospedagem e
interesses quase nunca — assuma pelo perfil, marque a suposição e deixe ele
corrigir de graça. Pergunta com opções é mais rápida de responder no celular
que pergunta aberta.

**Interesse mencionado de passagem é pedido.** "A gente é nerd", "ela adora
cerâmica", "queria ver um festival" — cada um desses merece pelo menos um bloco
no roteiro final. É o que separa um roteiro feito para estas pessoas de uma
lista de atrações que qualquer guia dá, e é a informação que o usuário nunca
percebe que deu.

### 3. Novo ou atualização?

Derive o slug (`lisboa-maio-2027`: destino + época, sem acento) e olhe
`destinos/`. Um slug parecido — mesmo destino, datas próximas — é o mesmo
destino: **atualize**, não crie um vizinho. Dois diretórios para a mesma viagem
é um estrago silencioso, porque metade das decisões fica num e metade no outro.

Na dúvida entre atualizar e criar, pergunte — é uma das poucas perguntas que
sempre vale a pena.

**Atualizando:** leia `trip.json`, `PESQUISA.md` e `APRENDIZADOS.md` do
destino. Pesquise só o que mudou ou falta, preserve reservas e IDs, e no fim
diga o que mudou em vez de reapresentar a viagem inteira.

### 4. Encadear

`pesquisa-destino` (fatos verificados e datados) → `roteiro-viagem` (os dias,
ordenados pelo que abre e construídos por geografia) → `orcamento-viagem` (os
números, com as três opções de cada item e o link de compra) →
`planilha-viagem` (o `.xlsx` com fórmulas vivas, e a comparação quando há mais
de uma viagem). Cada uma alimenta a seguinte pelo `trip.json`. A planilha sai
com o roteiro imprimível ao lado e só é entregue depois do recálculo passar e
de três números serem conferidos. `site-viagem` só entra se ele pedir o site.

Pesquisa e roteiro são skills separadas de propósito: uma coleta fatos, a
outra exerce um ofício. Misturar as duas é o que faz roteiro sair com preço
inventado e horário chutado.

Duas coisas valem interromper a cadeia e falar antes de seguir:

- **A janela é ruim.** Temporada de chuva, tufão, calor extremo, alta temporada
  com preço triplicado. Dizer isso antes de montar o roteiro vale mais que o
  roteiro, e é fácil demais enterrar num parágrafo no fim.
- **O dinheiro não fecha.** Se o destino não cabe no teto nem com roteiro
  enxuto, apresente as saídas reais — menos dias, época mais barata, hospedagem
  mais simples, destino mais perto, ou mais orçamento — em vez de espremer
  números até caber. Orçamento maquiado é a forma mais cara de mentir.

Fora esses dois casos, vá até o fim e entregue. Um roteiro entregue e corrigido
vale mais que um questionário respondido.

**Quando o plano ainda não assentou, entregue primeiro o roteiro em prosa e só
depois gere a planilha.** Destino indefinido, datas flexíveis, teto que ainda
vai mudar — nesses casos o texto na conversa é o formato que ele corrige mais
rápido. Com o pedido já concreto, vá direto à planilha: o `roteiro-<slug>.md`
sai junto e serve para a mesma leitura rápida.

**Duas viagens em jogo pedem a comparação.** "Itália ou Paris em outubro?",
"Paris em outubro ou em março?" — gere as duas e rode `comparar-viagens.py`.
A linha que decide é por pessoa por dia, não o total.

**Uma correção vale mais que uma sugestão.** Quando a pesquisa achar um conflito
real — o museu fecha no único dia livre, a janela de venda já passou, o passe
não compensa — destaque isso em vez de resolver em silêncio. É o trabalho mais
valioso que você faz e o mais fácil de tornar invisível.

### 5. Escrever na memória — sempre por último

Acione `perfil-viajante` no modo escrita. Traduza o que aconteceu em padrão
generalizável ("prefere bairro central e caminhável"), não em fato pontual
("escolheu o Hotel X"), e registre a entrada em `perfil/insights.md`.

Esta etapa é a que faz o repo aprender. Pular ela transforma o sistema num chat
comum, onde o próximo prompt precisa de novo do mesmo tamanho.

## O que entregar na resposta

O usuário quer decidir, não ler um relatório. Em prosa curta:

1. **O veredito da janela** — a época é boa, é aceitável, ou é ruim e por quê.
2. **O número** — quanto deve custar e como fica contra o teto dele.
3. **A forma do roteiro** — em duas ou três frases, não a lista dos dias; a
   lista está na planilha.
4. **O que exige ação agora** — visto, ingresso que esgota, voo que sobe.
5. **O arquivo** — caminho da planilha (e da comparação), os três números
   conferidos, e o que ficou sem opção ou sem link por falta de pesquisa.
6. **O que você assumiu** — as suposições que vieram do perfil, para ele
   corrigir com uma frase se estiverem erradas.

## Pedidos que não são "planeje do zero"

O mesmo ciclo atende variações menores, com as etapas que não fazem sentido
puladas:

- *"tira o museu do dia 3 e põe mais comida"* → editar `trip.json`, regenerar a planilha,
  e registrar o sinal no perfil (esse é justamente o tipo de correção que mais
  ensina).

**Não refaça o plano inteiro a cada ajuste.** Quando ele muda uma coisa, mostre
o que mudou e o efeito no total — não reapresente a viagem do zero. Reapresentar
tudo esconde a mudança no meio do texto e obriga ele a reler o que já tinha
aprovado.
- *"quanto ficou mesmo?"* → responder do `trip.json`, sem repesquisar nada.
- *"dá pra fazer Marrocos com 10 mil?"* → pesquisa e orçamento bastam; a
  planilha sai se ele decidir ir.
- *"quero o site"* → `site-viagem`, a partir do mesmo `trip.json`.
- *"o que você já sabe sobre como eu viajo?"* → só `perfil-viajante`.
- *"me ajuda a escolher pra onde ir"* / *"não sei por onde começar"* →
  `briefing-viagem`, que pergunta em opções e devolve o pedido pronto.

## Primeira vez

Com o perfil ainda vazio, a primeira viagem precisa de mais pergunta que as
seguintes — e tudo bem, desde que fique claro que é investimento: diga que a
partir da próxima ele escreve menos. Mesmo aqui, respeite as 3 perguntas e
assuma o resto; hipótese marcada e corrigida depois ensina mais que pergunta
feita no vazio.
