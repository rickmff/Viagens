---
name: briefing-viagem
description: Conduz o usuário por um briefing guiado antes de planejar uma viagem — sempre em perguntas de múltipla escolha com sugestões concretas (destinos pela época e pelo perfil, faixas de orçamento, ritmos, interesses, direção visual do site), pré-preenchidas com o que o perfil já sabe, e cada vez mais curtas conforme o perfil amadurece. Use quando o usuário pedir para ser guiado, disser que não sabe por onde começar, pedir sugestões de destino, quiser "montar o pedido" de uma viagem, quando o perfil ainda está vazio ou quando planejar-viagem encontrar mais de duas lacunas estruturais. Cada resposta vira aprendizado no perfil.
---

# Briefing guiado

Existem dois jeitos de começar uma viagem neste repo. O rápido é uma linha
solta para `planejar-viagem`. O guiado é este: uma conversa curta de escolhas
tocáveis, para quem ainda não decidiu — ou para a primeira viagem, quando o
perfil não sabe nada.

A regra que faz este briefing valer a pena: **cada pergunta vem com opções
prontas, e as opções vêm do perfil**. A primeira viagem faz quatro rodadas; a
quinta viagem faz uma, porque o perfil já responde o resto. Se o briefing
continua longo depois de várias viagens, o perfil não está sendo escrito.

## Como perguntar

Use a ferramenta de perguntas com opções (`AskUserQuestion`), nunca uma lista
de perguntas em texto. Opção tocável se responde no celular em dois toques;
pergunta aberta pede parágrafo, e parágrafo é o que este repo existe para
eliminar.

Em cada pergunta:

- **2 a 4 opções concretas**, com uma linha de consequência em cada ("mais
  barato, mas o museu principal fecha nessa época"). Opção sem consequência é
  chute.
- **A sugestão do perfil vem primeiro**, marcada `(pelo perfil)`. Se o perfil
  tem a resposta como *confirmado*, nem pergunte — mostre como assumido no
  resumo final e siga.
- **Múltipla escolha** (`multiSelect`) para interesses e antipreferências, que
  nunca são um só.
- No máximo **4 perguntas por rodada** e **4 rodadas** — e só as rodadas que
  ainda faltam. A ferramenta já oferece "outra resposta" sozinha; não crie
  uma opção "outro".

As rodadas e o banco de perguntas com suas opções estão em
`references/rodadas.md`. Leia antes de perguntar; é lá que está o cuidado de
não perguntar o que já se sabe.

## As quatro rodadas

1. **Para onde e quando** — destino (se não veio: 3 ou 4 sugestões pela época
   e pelos interesses do perfil), mês ou janela, quantos dias, datas fixas ou
   flexíveis.
2. **Quem e quanto** — companhia, teto de orçamento em faixas, se é por pessoa
   ou no total, aeroporto de saída.
3. **Como você viaja** — interesses (o que essa viagem tem que ter), ritmo,
   antipreferências, hospedagem, comida.
4. **O site** — direção visual (três atmosferas descritas em uma linha cada,
   derivadas do destino e da estação), o momento de encantamento, o que quer
   ver primeiro ao abrir.

Pule a rodada inteira quando o perfil e o prompt já a respondem. Uma viagem
que chegou como "Lisboa em maio, 8 mil, museu e comida" já pulou a 1 e metade
da 2.

## O que sai

`destinos/<slug>/BRIEFING.md` com as respostas e as suposições, em prosa curta
— é o pedido, e é o que `planejar-viagem` consome em seguida. Nada de tabela
de formulário: escreva como quem entendeu a viagem.

E o mais importante: acione `perfil-viajante` no modo escrita **com cada
resposta**. O briefing é o momento de maior densidade de sinal que este repo
tem — a pessoa acabou de dizer, em opções claras, como gosta de viajar. Uma
resposta escolhida entre quatro é um sinal mais limpo que qualquer inferência
de comportamento. Anote como *provável*; quando repetir em outra viagem,
promova.

## Ao terminar

Resuma o pedido em três ou quatro frases, liste o que assumiu pelo perfil (para
ele corrigir de graça), e passe o bastão para `planejar-viagem`. Não comece a
pesquisar aqui — briefing que vira pesquisa antes de o pedido estar fechado
pesquisa a viagem errada.
