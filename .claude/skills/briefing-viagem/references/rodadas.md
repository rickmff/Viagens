# Banco de perguntas por rodada

Cada pergunta abaixo tem: quando pular, de onde tirar as opções, e um exemplo
de opções. Os exemplos são formato, não conteúdo — as opções reais vêm do
perfil e do destino.

Notação: `[perfil]` = pule se o perfil responder como *provável* ou
*confirmado*; mostre como assumido no fim. `[prompt]` = pule se veio no pedido.

---

## Rodada 1 — Para onde e quando

### Destino `[prompt]`

Sem destino, sugira 3 ou 4 pela **época** que ele tem e pelos **interesses do
perfil**. Cada opção diz o que a época entrega e o que custa:

```
header: "Destino"
question: "Para onde, nesse período?"
options:
  - label: "Kyoto e Tóquio (pelo perfil)"
    description: "Folhagem de outono em novembro; alta temporada, voo ~R$ 6 mil pp"
  - label: "Lisboa e Porto"
    description: "Outono ameno, baixa temporada, voo ~R$ 4 mil pp, comida barata"
  - label: "Cidade do México e Oaxaca"
    description: "Dia dos Mortos no início de novembro; precisa reservar hotel já"
  - label: "Marrocos"
    description: "Clima ideal, sem visto; deserto exige 2 dias só de deslocamento"
```

Ordene pela aderência ao perfil. Sem perfil, ordene pela época.

### Quando `[prompt]`

```
header: "Quando"
question: "Em que janela?"
options:
  - label: "Segunda quinzena de novembro (pelo perfil)"
    description: "Você já viajou em novembro duas vezes; pico da folhagem em Kyoto"
  - label: "Primeira quinzena de dezembro"
    description: "Mais frio, menos gente, hotel 30% mais barato"
  - label: "Datas flexíveis — me mostre a comparação"
    description: "Monto uma tabela de épocas com preço, clima e lotação"
```

A terceira opção existe sempre que a data não for fixa: `pesquisa-destino` faz
a tabela comparativa de épocas.

### Duração `[prompt]` `[perfil]`

```
header: "Duração"
question: "Quantos dias?"
options:
  - label: "10 a 12 dias (pelo perfil)"
    description: "Seu padrão em viagem longa; dá para duas cidades com calma"
  - label: "7 a 9 dias"
    description: "Uma cidade bem feita, ou duas correndo"
  - label: "14 dias ou mais"
    description: "Três bases; pede um dia sem plano no meio"
```

---

## Rodada 2 — Quem e quanto

### Companhia `[perfil]`

```
header: "Companhia"
question: "Quem vai?"
options:
  - label: "Em casal (pelo perfil)"
  - label: "Sozinho"
  - label: "Com família, incluindo criança"
    description: "Muda ritmo, hospedagem e o que entra no roteiro"
  - label: "Grupo de amigos"
    description: "Orçamento vira divisão de despesas"
```

### Teto `[prompt]`

Faixas, não campo aberto. E a pergunta que sempre confunde vai junto:

```
header: "Orçamento"
question: "Quanto dá para gastar, tudo incluído?"
options:
  - label: "Até R$ 8 mil por pessoa"
  - label: "R$ 8 a 15 mil por pessoa (pelo perfil)"
    description: "Sua faixa nas últimas viagens"
  - label: "R$ 15 a 25 mil por pessoa"
  - label: "Acima disso — conforto primeiro"
```

Se ele deu um número sem dizer por pessoa ou total, **não pergunte**: calcule a
leitura mais provável, mostre como assumido, ofereça a outra.

### Saída `[perfil]`

Aeroporto de origem e se aceita sair de um vizinho. Depois da primeira viagem,
o perfil responde e a pergunta some.

---

## Rodada 3 — Como você viaja

### O que essa viagem tem que ter (`multiSelect`) `[prompt parcial]`

Interesses do perfil primeiro; depois o que o destino tem de forte. Nunca
menos de quatro opções — é a pergunta que mais ensina o perfil:

```
header: "Tem que ter"
question: "O que não pode faltar? (marque o que quiser)"
multiSelect: true
options:
  - label: "Comida de rua e mercado (pelo perfil)"
  - label: "Museus e arte"
  - label: "Templos, jardins e caminhadas longas"
  - label: "Bairro noturno e música"
```

### Ritmo `[perfil]`

```
header: "Ritmo"
question: "Que ritmo de dia?"
options:
  - label: "Dois ou três blocos, com folga (pelo perfil)"
    description: "Sobra tempo para o que aparece no caminho"
  - label: "Cheio — aproveitar cada hora"
    description: "Quatro ou cinco blocos; cansa no dia 5"
  - label: "Acordo cedo, termino cedo"
    description: "Mirantes e templos vazios; jantar às 19h"
```

### O que evitar (`multiSelect`) `[perfil]`

Tão importante quanto o que ele quer, e o que mais economiza rodada de
sugestão descartada. Opções vindas das antipreferências do perfil + as
armadilhas típicas do destino.

### Hospedagem e comida `[perfil]`

Tipo e bairro; restrições alimentares. Somem cedo do briefing — são das
primeiras coisas que o perfil confirma.

---

## Rodada 4 — O site

### Atmosfera

Três direções derivadas do destino e da estação, uma linha cada, com a paleta
descrita em palavras (a régua está em `site-viagem/references/design.md`):

```
header: "Atmosfera"
question: "Que clima o site deve ter?"
options:
  - label: "Noite de lanternas"
    description: "Sumi escuro, ouro de lanterna, vermelhão de momiji; folhas caem ao clicar no título"
  - label: "Manhã de templo"
    description: "Cinza-azulado de névoa, verde de musgo, branco de cascalho; sem partículas"
  - label: "Neon de Shinjuku"
    description: "Preto profundo, magenta e ciano elétricos; estrelas piscando"
```

### O que abrir primeiro

```
header: "Primeiro"
question: "Ao abrir o site no celular, o que você quer ver antes de tudo?"
options:
  - label: "O dia de hoje (pelo perfil)"
  - label: "O que ainda falta reservar"
  - label: "Quanto já gastei"
```

Define a ordem dos tiles e o que vem em destaque. Depois de duas viagens o
perfil sabe, e a pergunta some.

---

## Regras que atravessam as rodadas

- Interesse que ele digitou na opção "outra resposta" é o sinal mais valioso
  do briefing: ele se deu ao trabalho de escrever. Vai para o perfil como
  *provável* e vira bloco no roteiro.
- Não repita em uma rodada o que a anterior já respondeu por implicação. "Com
  criança de 4 anos" já respondeu ritmo.
- Quando o perfil responde tudo de uma rodada, diga em uma linha o que assumiu
  e passe para a próxima. Não peça confirmação do que está confirmado.
