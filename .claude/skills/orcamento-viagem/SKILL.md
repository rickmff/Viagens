---
name: orcamento-viagem
description: Monta o orçamento de uma viagem a partir de um teto em reais, em duas colunas — o plano que o usuário quer e uma versão econômica — distribuindo entre voos, hospedagem, alimentação, transporte, atrações, taxa de turismo, documentação e reserva, com câmbio, IOF, previsto vs real e alerta de estouro, gravando tudo em orcamento no trip.json. Use sempre que o usuário der um valor disponível para a viagem ("tenho 12 mil", "uns 8k"), perguntar se o dinheiro dá, pedir para cortar custo, perguntar se um passe compensa, quiser dividir despesa entre viajantes, registrar um gasto real durante a viagem, ou perguntar quanto já gastou. Também use quando o roteiro pesquisado precisar ser ajustado para caber no bolso.
---

# Orçamento de viagem

Orçamento de viagem quase sempre falha do mesmo jeito: soma-se voo mais
hospedagem, sobra um número grande, e a viagem estoura no dia a dia — comida,
transporte, entradas, a lembrancinha, o táxi na chuva. Esta skill trabalha ao
contrário, partindo do teto e reservando o dia a dia **antes** de gastar com o
que é visível.

## Primeiro: o teto é por pessoa ou no total?

"No máximo 8 mil" é ambíguo e a diferença muda tudo. Não pergunte por reflexo:
calcule a leitura mais provável pelo contexto (número de viajantes, destino,
duração), **diga qual você assumiu**, e ofereça a outra em uma linha. O usuário
corrige com uma palavra se você errou, o que é mais barato que uma rodada de
pergunta e resposta antes de qualquer entrega.

Se ele não deu teto nenhum, olhe a faixa típica em `perfil/PERFIL.md`. Se nem
lá tiver, essa é uma das poucas perguntas que vale fazer.

## O método: de trás para frente

**1. Tire a reserva primeiro.** 10% a 15% do teto, fora do orçamento, antes de
qualquer outra coisa. Não é sobra — é o que cobre voo remarcado, farmácia, mala
extraviada, e o dia em que chove e o programa vira restaurante caro. Quem
distribui 100% do teto vai estourar, e a diferença entre uma viagem tranquila e
uma tensa costuma ser exatamente esses 12%.

**2. Trave os custos fixos.** Voo, hospedagem, seguro, visto, passe de
transporte, aluguel de carro, **taxa de turismo**. São os únicos que você
conhece com precisão e os únicos que não dá para ajustar depois de comprados.

**3. Reserve o custo diário.** Do que sobrou, calcule por dia e por pessoa:
alimentação, transporte urbano, entradas, imprevisto pequeno. Use os números
reais da `PESQUISA.md`, não estimativa de cabeça. Este é o passo que as pessoas
pulam e é onde a viagem vaza.

**4. O que sobrar é o que dá para gastar com extras.** Passeios caros, compras,
aquele jantar. Se sobrou pouco, diga agora e proponha cortes concretos.

## Duas colunas, sempre

Todo orçamento sai em duas versões lado a lado:

- **Seu plano** — o que ele pediu, com as escolhas dele preservadas.
- **Econômico** — a mesma viagem com as trocas que doem menos.

Duas colunas fazem o custo de cada escolha ficar visível, o que uma coluna só
nunca consegue. E evitam a conversa chata de "corta alguma coisa" sem dizer o
quê: a coluna econômica já é a proposta.

A linha final leva **total do grupo e total por pessoa**, mais a contingência de
10%, mais a comparação com o teto.

## Onde apertar, e onde não

Identifique sempre os itens individuais mais caros e diga onde dá para apertar
sem perder o essencial.

Mas diga também **onde não apertar**. Há gastos que são a razão de ser da
viagem: se ele vai ao Japão pelo sushi ou à Itália pelos museus, cortar
justamente isso para caber no teto entrega uma viagem barata que ele não queria
fazer. Nomeie esses itens como intocáveis e corte em outro lugar.

Se o teto não fecha nem com a coluna econômica, **seja franco**. Não empurre
números para baixo até caber — apresente as saídas reais, que são poucas e
conhecidas: menos dias, época mais barata, hospedagem mais simples, destino
mais perto, ou mais orçamento. Um orçamento maquiado para caber é a forma mais
cara de mentir.

## Passe compensa?

A pergunta aparece toda viagem, e a resposta preguiçosa ("passes economizam!")
está errada com frequência.

Some o **avulso do que o roteiro realmente visita**, espalhado nos dias reais, e
compare com o preço do passe e o relógio dele. Passe de 48 ou 72 horas quase
nunca serve um roteiro espalhado, e passe semanal com janela fixa de segunda a
domingo não serve viagem que começa na quinta. Mostre a conta e responda
direto; o resultado costuma ser "não compensa".

## Câmbio e os custos que ninguém soma

Converter pela taxa comercial subestima o gasto em torno de 5%, e essa
diferença some dentro do erro do orçamento até virar problema na fatura.

- **IOF**: 3,5% sobre compras internacionais no cartão de crédito, débito e
  pré-pago (alíquota unificada, vigente em set/2026). Regra tributária muda —
  confirme antes de usar e anote a data.
- **Spread do emissor**: o cartão não usa a taxa comercial. Some 1% a 2%.
- Cartão com IOF zero muda essa conta; se o perfil disser que ele usa um,
  aplique só o spread.

Converta pela taxa do dia (`open.er-api.com/v6/latest/BRL`) e aplique margem de
**5%** por padrão. Registre taxa e data em `orcamento.cambioReferencia`: assim,
meses depois, dá para saber se o orçamento envelheceu por causa do câmbio ou do
roteiro. No site a taxa é editável, porque ela muda entre o planejamento e o
embarque.

Para dinheiro vivo, a casa de câmbio tem spread próprio, geralmente pior. Se o
destino roda a dinheiro (boa parte da Ásia e da América Latina), separe uma
linha.

## Categorias

Use estas, nesta ordem. Mais categorias não dá mais controle, dá mais campo
vazio:

`voos` · `hospedagem` · `taxa-turismo` · `alimentacao` · `transporte-local` ·
`atracoes` · `documentacao` (visto, seguro, vacina) · `conectividade` ·
`compras` · `extras`

Cada uma leva `previsto`, `economico`, `real` (começa `null`) e uma
`observacao` dizendo de onde veio o número. A observação é o que permite
revisar depois: "3 noites × R$ 400 (diária média da pesquisa, bairro central)"
pode ser contestado; "R$ 1.200" não pode.

Grave em `orcamento` no `trip.json` conforme `docs/trip-schema.md`.

## Previsto vs real

Durante a viagem ele lança gastos reais. Preencha `real` na categoria e deixe o
site comparar — ele já mostra barra de previsto contra real e destaca o que
passou.

Quando uma categoria estourar, não se limite a apontar: diga de onde tirar.
"Alimentação passou R$ 600; dá para absorver na reserva, ou cortar o passeio de
barco que ainda não foi pago" é útil. "Você estourou o orçamento" não é.

## Viagem em grupo

Com mais de um viajante, todo custo precisa dizer se é `por: "pessoa"` ou
`por: "total"` — misturar os dois é o erro que inutiliza o orçamento inteiro.
Voo é por pessoa, quarto de hotel é total, taxa de turismo é por pessoa por
noite, jantar depende. Na dúvida, escolha e deixe explícito na observação.

## Ao terminar

Três frases: quanto a viagem deve custar (grupo e por pessoa), quanto sobra ou
falta para o teto, e qual é a maior alavanca se ele quiser gastar menos.

Se ele já tinha números próprios, mostre lado a lado o que você manteve, o que
cortou e onde achou mais barato — a comparação com o plano dele é mais útil que
um orçamento novo apresentado do zero.

Depois registre em `perfil-viajante` o que a sessão revelou sobre como ele
prioriza dinheiro. Onde aceitou pagar mais e onde cortou é um dos sinais mais
estáveis e mais úteis que existem para as próximas viagens.
