---
name: pesquisa-destino
description: Pesquisa um destino de viagem na web e transforma o resultado em destinos/<slug>/PESQUISA.md e num trip.json válido — cobrindo visto e documentação para brasileiros, clima e sazonalidade, custos reais, bairros, transporte, segurança, conectividade e roteiro sugerido. Use sempre que o usuário mencionar querer viajar para algum lugar, pedir sugestões de roteiro, perguntar "vale a pena ir para X em tal mês", quiser saber quanto custa uma viagem, precisar de informação de visto ou documentação, ou pedir para atualizar a pesquisa de um destino que já existe no repo. É o passo que antecede a geração do site.
---

# Pesquisa de destino

O objetivo aqui não é produzir um guia turístico — é produzir **dados
confiáveis o bastante para virar roteiro e orçamento**. Tudo que você pesquisar
acaba virando um número no orçamento ou um pino no mapa, então a régua é:
se não dá para usar numa decisão, não pesquise.

## Antes de começar

Leia `perfil/PERFIL.md` (skill `perfil-viajante`). Ele decide o recorte da
pesquisa inteira: uma pessoa que satura de museu e prioriza comida de rua
precisa de uma pesquisa diferente de quem quer arte. Pesquisar genericamente e
filtrar depois desperdiça a maior parte do trabalho.

Depois verifique se `destinos/<slug>/` já existe. Se existir, isto é uma
**atualização**: leia o `PESQUISA.md` e o `trip.json` atuais, pesquise só o que
está desatualizado ou faltando, e preserve o que já foi decidido. Nunca
sobrescreva um destino existente do zero — pode haver reserva confirmada ali.

## O que pesquisar

A ordem importa: as primeiras três podem matar a viagem, as últimas só a
melhoram. Se o tempo ou o contexto apertar, garanta as três primeiras.

**1. Documentação para brasileiros.** Visto (necessário? e-visa? na chegada?),
validade mínima de passaporte, vacinas exigidas, seguro obrigatório, prova de
saída, comprovante de fundos. Regra de visto muda e é o único item da lista que
impede o embarque — pesquise em fonte oficial e **anote a data da consulta** no
campo `documentacao.verificadoEm`.

**2. Janela de viagem.** O período que ele quer é boa ideia? Temporada de
chuva, tufão, furacão, calor extremo, alta temporada com preço triplicado,
feriado local que fecha tudo, ou evento que lota a cidade. Se a janela for
ruim, diga isso **antes** de montar roteiro — é a informação mais valiosa que
você pode dar, e a mais fácil de enterrar num parágrafo no fim.

**3. Custo real.** Voo Brasil→destino no período, diária de hospedagem na faixa
dele, refeição típica, transporte urbano, ingresso das atrações principais.
Números de fontes recentes, com a moeda local explícita. Não estime "de
cabeça": um orçamento construído sobre preço inventado é pior que nenhum.

**4. Geografia prática.** Quais bairros servem de base e por quê, quanto tempo
se perde entre as regiões, se dá para fazer a pé, se vale passe de transporte.
É isso que determina se o roteiro é realista ou se é uma lista de desejos que
ignora deslocamento.

**5. Roteiro candidato.** Atrações e experiências filtradas pelos interesses do
perfil, com duração estimada, se precisa reserva antecipada, e o custo. Marque
o que é imperdível e o que é descartável — o orçamento vai cortar de algum
lugar, e é melhor você dizer de onde.

**6. Sobrevivência.** Pagamento (cartão passa? precisa dinheiro vivo?), eSIM e
internet, tomada, água, gorjeta, golpes comuns, bairros a evitar à noite,
número de emergência, etiqueta que evita constrangimento.

**7. Comida.** Pratos e mercados que valem a viagem, faixa de preço,
restrições do perfil respeitadas.

Para endpoints, padrões de busca e onde encontrar cada coisa, veja
`references/fontes.md`.

## Geocodificação

Todo lugar que vai virar pino precisa de `lat`/`lon`. Use Nominatim
(`references/fontes.md` traz o endpoint e o limite de 1 req/s). Geocodifique em
lote no fim da pesquisa, não um por um no meio — é mais rápido e evita estourar
o rate limit.

## O que produzir

### `destinos/<slug>/PESQUISA.md`

O material bruto com as fontes. Ele existe para duas coisas: você conferir de
onde veio um número seis meses depois, e a próxima atualização saber o que já
foi pesquisado. Cada afirmação que envolve número, regra ou data leva link e
data de consulta. Organize nas sete seções acima.

Escreva com opinião. "Kyoto em abril é lindo e é um inferno de multidão; se a
data for flexível, maio entrega 80% das flores com metade da gente" vale mais
que três parágrafos neutros. Ele pediu ajuda para decidir, não um resumo da
Wikipédia.

### `destinos/<slug>/trip.json`

Siga `docs/trip-schema.md`. Preencha `destinos`, `documentacao`, `dias`,
`gastronomia`, `frases`, `links` e `avisos`. Deixe `voos`, `hospedagens` e
`orcamento` para as etapas seguintes, mas já registre os custos que você
descobriu nos blocos do roteiro — é deles que o orçamento vai partir.

Campo que você não pesquisou fica `null`. O site esconde seção vazia, então um
`trip.json` honesto gera um site menor e verdadeiro; um `trip.json` inventado
gera um site bonito que faz alguém perder o voo.

## Montando os dias

Distribua as atividades respeitando o ritmo do perfil e a geografia: agrupe por
região para não atravessar a cidade duas vezes no mesmo dia, e conte o
deslocamento como tempo real. Um dia com quatro atrações em quatro bairros não
é um dia cheio, é um dia impossível.

Reserve o primeiro dia para chegada e fuso, e coloque `alternativa` nos blocos
ao ar livre quando o clima do período for instável — é o campo que salva a
viagem no dia de chuva.

## Ao terminar

Resuma em prosa: a janela é boa, quanto vai custar mais ou menos, o que exige
ação imediata (visto, ingresso que esgota, voo que sobe de preço), e uma
recomendação clara. Depois acione `perfil-viajante` no modo escrita.
