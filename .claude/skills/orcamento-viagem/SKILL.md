---
name: orcamento-viagem
description: Monta o orçamento de uma viagem a partir de um teto em reais, distribuindo entre voos, hospedagem, alimentação, transporte, atrações, documentação e reserva — com câmbio, IOF, previsto vs real e alerta de estouro — e grava tudo em orcamento no trip.json. Use sempre que o usuário der um valor disponível para a viagem ("tenho 12 mil", "uns 8k"), perguntar se o dinheiro dá, pedir para cortar custo, quiser dividir despesa entre os viajantes, registrar um gasto real durante a viagem, ou perguntar quanto já gastou. Também use quando o roteiro pesquisado precisar ser ajustado para caber no bolso.
---

# Orçamento de viagem

Orçamento de viagem quase sempre falha do mesmo jeito: soma-se voo mais
hospedagem, sobra um número grande, e a viagem estoura no dia a dia — comida,
transporte, entradas, a lembrancinha, o táxi na chuva. Esta skill trabalha ao
contrário, partindo do teto e reservando o dia a dia **antes** de gastar com
o que é visível.

## O método: de trás para frente

Comece pelo teto que ele deu. Se ele não deu, olhe a faixa típica em
`perfil/PERFIL.md`; se nem lá tiver, essa é uma das poucas perguntas que vale
fazer, porque ela muda tudo.

**1. Tire a reserva primeiro.** 10% a 15% do teto, fora do orçamento, antes de
qualquer outra coisa. Não é sobra — é o que cobre voo remarcado, farmácia,
mala extraviada, e o dia em que chove e o programa vira restaurante caro. Quem
distribui 100% do teto vai estourar, e a diferença entre uma viagem tranquila e
uma tensa costuma ser exatamente esses 12%.

**2. Trave os custos fixos.** Voo, hospedagem, seguro, visto, passe de
transporte, aluguel de carro. São os únicos que você conhece com precisão e os
únicos que não dá para ajustar depois de comprados.

**3. Reserve o custo diário.** Do que sobrou, calcule por dia e por pessoa:
alimentação, transporte urbano, entradas, imprevisto pequeno. Use os números
reais da `PESQUISA.md`, não estimativa de cabeça. Este é o passo que as pessoas
pulam e é onde a viagem vaza.

**4. O que sobrar é o que dá para gastar com extras.** Passeios caros, compras,
aquele jantar. Se sobrou pouco, diga isso com todas as letras agora — e proponha
cortes concretos, não um aviso genérico.

Se o teto não fecha nem com o roteiro enxuto, não empurre números para baixo
até caber. Apresente as saídas reais, que são poucas e conhecidas: menos dias,
época mais barata, hospedagem mais simples, destino mais perto, ou mais
orçamento. Um orçamento maquiado para caber é a forma mais cara de mentir.

## Câmbio e os custos que ninguém soma

Converter pela taxa comercial subestima o gasto em aproximadamente 5%, e essa
diferença some dentro do erro do orçamento até virar problema na fatura.

- **IOF**: 3,5% sobre compras internacionais no cartão de crédito, débito e
  pré-pago (alíquota unificada, vigente em set/2026). Regra tributária muda —
  confirme antes de usar e anote a data.
- **Spread do emissor**: o cartão não usa a taxa comercial. Some ~1% a 2%.
- Cartões com IOF zero existem e mudam essa conta; se o perfil disser que ele
  usa um, aplique só o spread.

Na prática: converta pela taxa do dia (`open.er-api.com/v6/latest/BRL`) e
aplique uma margem de **5%** por padrão. Registre a taxa e a data em
`orcamento.cambioReferencia` — assim, meses depois, dá para saber se o
orçamento envelheceu por causa do câmbio ou por causa do roteiro.

Para dinheiro vivo, a casa de câmbio tem spread próprio, geralmente pior.
Se o destino é de economia à base de dinheiro (boa parte da Ásia e da América
Latina), separe uma linha para isso.

## Categorias

Use estas, nesta ordem, no `trip.json`. Mais categorias não dá mais controle,
dá mais campo vazio:

`voos` · `hospedagem` · `alimentacao` · `transporte-local` · `atracoes` ·
`documentacao` (visto, seguro, vacina) · `conectividade` (eSIM, chip) ·
`compras` · `extras`

Cada categoria leva `previsto`, `real` (começa `null`) e uma `observacao`
dizendo de onde veio o número. A observação é o que permite revisar depois:
"3 noites × R$ 400 (diária média da pesquisa, bairro central)" pode ser
contestado; "R$ 1.200" não pode.

Grave tudo em `orcamento` no `trip.json` conforme `docs/trip-schema.md`.

## Previsto vs real

Durante a viagem ele vai lançar gastos reais. Preencha `real` na categoria e
deixe o site fazer a comparação — ele já mostra barra de previsto contra real e
destaca o que passou.

Quando uma categoria estourar, não se limite a apontar: diga de onde tirar.
"Alimentação passou R$ 600; dá para absorver na reserva, ou cortar o passeio
de barco que ainda não foi pago" é útil. "Você estourou o orçamento" não é.

## Viagem em grupo

Com mais de um viajante, todo custo precisa dizer se é `por: "pessoa"` ou
`por: "total"` — misturar os dois é o erro que inutiliza o orçamento inteiro.
Voo é por pessoa, quarto de hotel é total, jantar depende. Na dúvida, escolha e
deixe explícito na observação.

## Ao terminar

Responda em três frases: quanto a viagem deve custar, quanto sobra ou falta
para o teto, e qual é a maior alavanca se ele quiser gastar menos. Depois
registre em `perfil-viajante` o que a sessão revelou sobre como ele prioriza
dinheiro — onde aceitou pagar mais e onde cortou é um dos sinais mais estáveis
e mais úteis que existem para as próximas viagens.
