---
name: planejar-viagem
description: Entrada principal do repo de viagens — pega um prompt solto com destino, orçamento e o que a pessoa quer fazer, e devolve o site de 1 página daquele destino, criando do zero ou atualizando um que já existe. Encadeia perfil-viajante, pesquisa-destino, orcamento-viagem e site-viagem, e fecha gravando na memória o que aprendeu. Use SEMPRE que o usuário disser que quer viajar para algum lugar, jogar um pedido no formato "quero ir pra X em tal mês com tanto de orçamento", pedir um roteiro, pedir o site de uma viagem, pedir para mudar ou incrementar uma viagem já planejada, ou perguntar se dá para fazer tal destino com tal dinheiro. É a skill que orquestra as outras — na dúvida entre ela e uma das específicas, comece por ela.
---

# Planejar viagem

Esta skill existe para que um prompt de uma linha vire um site. O usuário
escreve algo como:

> quero ir pra Lisboa em maio, uns 8 mil, quero museu e comer bem

e o resultado esperado é uma página pronta — não uma conversa de vinte
perguntas. Cada rodada também deixa o repo mais esperto, de modo que o prompt
da próxima viagem possa ser ainda mais curto.

## O ciclo

```
perfil (ler) → pesquisa → orçamento → site → perfil (escrever)
```

As quatro skills do meio fazem o trabalho; esta decide a ordem, o que pular e
quando parar para perguntar.

### 1. Ler a memória — sempre primeiro

Leia `perfil/PERFIL.md` (skill `perfil-viajante`, modo leitura) **antes** de
responder qualquer coisa. É o que separa este repo de um chat qualquer: o que
está lá como provável ou confirmado já está respondido e não se pergunta de
novo. Perguntar o que o perfil sabe é o principal modo de falha aqui.

### 2. Entender o pedido

Extraia do prompt o que der: destino, janela de datas, teto de orçamento,
desejos explícitos ("museu", "comer bem", "sem acordar cedo"), companhia.
O que faltar, complete pelo perfil.

Só então decida se ainda falta algo, aplicando o limite de **3 perguntas** e o
critério de materialidade: pergunte apenas o que muda o roteiro de verdade e o
perfil não responde. Data e orçamento normalmente valem a pergunta. Ritmo,
estilo de hospedagem e interesses quase nunca — assuma pelo perfil, marque a
suposição no resultado e deixe ele corrigir de graça.

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

Chame `pesquisa-destino`, depois `orcamento-viagem`, depois `site-viagem`, nessa
ordem — cada uma alimenta a seguinte pelo `trip.json`.

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
   lista está no site.
4. **O que exige ação agora** — visto, ingresso que esgota, voo que sobe.
5. **O link local** — caminho do site e o comando para abrir.
6. **O que você assumiu** — as suposições que vieram do perfil, para ele
   corrigir com uma frase se estiverem erradas.

## Pedidos que não são "planeje do zero"

O mesmo ciclo atende variações menores, com as etapas que não fazem sentido
puladas:

- *"tira o museu do dia 3 e põe mais comida"* → editar `trip.json`, rebuildar,
  e registrar o sinal no perfil (esse é justamente o tipo de correção que mais
  ensina).
- *"quanto ficou mesmo?"* → responder do `trip.json`, sem repesquisar nada.
- *"dá pra fazer Marrocos com 10 mil?"* → pesquisa e orçamento bastam; só monte
  site se ele decidir ir.
- *"o que você já sabe sobre como eu viajo?"* → só `perfil-viajante`.

## Primeira vez

Com o perfil ainda vazio, a primeira viagem precisa de mais pergunta que as
seguintes — e tudo bem, desde que fique claro que é investimento: diga que a
partir da próxima ele escreve menos. Mesmo aqui, respeite as 3 perguntas e
assuma o resto; hipótese marcada e corrigida depois ensina mais que pergunta
feita no vazio.
