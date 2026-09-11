# Fontes e endpoints

Endpoints abaixo foram testados e funcionam sem chave de API. Os padrões de
busca são pontos de partida — o valor está em saber *o que* procurar, não em
copiar a query.

## Documentação e visto

Para brasileiros, a ordem de confiança é: site do consulado/embaixada do país
de destino no Brasil > órgão de imigração oficial do país > Itamaraty
(`gov.br/mre`, portal ConsularBR) > agregadores. Agregador serve para descobrir
que existe uma regra; a confirmação vem sempre da fonte oficial.

Padrões de busca que funcionam:

```
"visto brasileiros <país> turismo site:gov"
"<country> visa requirements Brazilian citizens tourist 2026"
"<country> immigration official visa exemption list"
"<país> vacina febre amarela certificado internacional exigência"
```

Cheque explicitamente, porque cada um já barrou alguém no portão:

- Isenção de visto e por quantos dias, e se cobre turismo (não só trânsito).
- Autorização eletrônica prévia mesmo com isenção — ETA, ESTA, K-ETA, ETIAS e
  equivalentes. É o pega mais comum: "não precisa de visto" não quer dizer
  "não precisa de nada".
- Validade mínima de passaporte após a data de retorno (6 meses é o padrão).
- Comprovante de passagem de saída, hospedagem e fundos.
- Certificado internacional de vacinação, e se o Brasil é considerado área de
  risco para febre amarela por aquele país.
- Seguro-viagem obrigatório (Schengen exige 30 mil euros).

Anote `documentacao.verificadoEm` com a data da consulta. Sem isso a informação
não é auditável e daqui a três meses ninguém sabe se ainda vale.

## Clima e sazonalidade

**Previsão (só até ~16 dias):**

```
https://api.open-meteo.com/v1/forecast
  ?latitude=35.6762&longitude=139.6503
  &daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max
  &timezone=auto&forecast_days=14
```

**Viagem daqui a meses? Use o histórico do mesmo período no ano passado** —
é a melhor aproximação gratuita de "como costuma ser em outubro":

```
https://archive-api.open-meteo.com/v1/archive
  ?latitude=35.6762&longitude=139.6503
  &start_date=2025-10-12&end_date=2025-10-26
  &daily=temperature_2m_max,temperature_2m_min,precipitation_sum
  &timezone=auto
```

O arquivo tem uns 5 dias de atraso, então nunca peça datas recentes demais.
Média de máximas, média de mínimas e quantos dias choveram já contam a
história toda — não despeje 15 dias de números no `PESQUISA.md`.

Além do número, procure o nome da estação: monções, temporada de tufão
(Ásia, jun–out), furacões (Caribe, jun–nov), wet/dry season, e alta temporada.
Uma frase de contexto vale mais que a tabela.

## Geocodificação

```
https://nominatim.openstreetmap.org/search?q=<lugar+cidade>&format=jsonv2&limit=1
```

Exige `User-Agent` identificando a aplicação e respeita **1 requisição por
segundo** — passar disso derruba seu acesso. Geocodifique em lote com um
`sleep 1` entre chamadas.

O `display_name` volta no idioma local (`渋谷駅前交差点`). Use-o só para
conferir que achou o lugar certo; no `trip.json` vá com o nome em português ou
no nome pelo qual o lugar é conhecido.

Inclua a cidade na query — "Central Station" sozinho acha a errada.

## Câmbio

```
https://open.er-api.com/v6/latest/BRL        → todas as moedas, atualiza diário
https://api.frankfurter.dev/v1/latest?base=BRL&symbols=JPY,EUR   → BCE, ~30 moedas
```

Use o primeiro como padrão (cobre moedas exóticas como VND, IDR, MAD) e o
segundo como fallback. Para orçamento, aplique uma margem sobre a taxa
comercial — ver `orcamento-viagem`, que explica por quê.

## Custos

Não existe API boa e gratuita de preço de viagem. O caminho é busca com
recorte temporal, sempre priorizando relato recente sobre artigo genérico:

```
"custo de vida <cidade> 2026 turista"
"<city> travel budget per day 2026 reddit"
"quanto custa viajar para <destino> 2026"
"<city> metro card tourist pass price"
```

Relato de viajante em fórum costuma ser mais preciso que blog de SEO, porque
blog de viagem recicla número de cinco anos atrás sem atualizar. Prefira
resultado com data visível e converta para BRL na hora, anotando a taxa usada.

Colete pelo menos: voo ida e volta do Brasil no período, diária de hospedagem
na faixa do perfil, refeição simples, refeição decente, transporte urbano
diário ou passe, e ingresso das três atrações principais.

## Transporte, bairros e roteiro

```
"<cidade> melhores bairros para se hospedar 2026"
"<city> where to stay neighborhood guide first time"
"<city> public transport pass tourist worth it"
"<atração> tempo de visita ingresso reserva antecipada"
```

Para atrações, o que muda o roteiro é: duração real da visita, se precisa
reserva com antecedência (e com quanta), dia de fechamento, e melhor horário.
Museu que fecha na segunda e ingresso que esgota com um mês são exatamente os
detalhes que destroem um roteiro bonito.

## Sobrevivência

```
"<país> aceita cartão ou precisa dinheiro vivo turista"
"<country> eSIM tourist data plan 2026"
"<país> tomada voltagem adaptador"
"<city> tourist scams to avoid"
"<país> etiqueta turista gorjeta costumes"
```

Vale também o aviso consular oficial do destino, que cobre segurança e
restrições locais de forma mais confiável que blog.

## Higiene de pesquisa

Toda afirmação com número, regra ou data leva link e data de consulta no
`PESQUISA.md`. O resto — impressão, recomendação, opinião — pode ir sem fonte,
desde que fique claro que é opinião.

Quando duas fontes discordarem em algo que importa (visto, principalmente),
diga isso explicitamente em vez de escolher uma no silêncio. "As fontes
divergem, confirme no consulado" é uma resposta legítima e honesta.
