# Fontes e endpoints

Endpoints abaixo foram testados e funcionam sem chave de API. Os padrões de
busca são pontos de partida — o valor está em saber *o que* procurar, não em
copiar a query.

## Documentação e visto

A regra é da nacionalidade, não da residência. Ordem de confiança: site do
consulado/embaixada do país de destino em Portugal > órgão de imigração
oficial do país > portal consular do país do passaporte > agregadores.
Agregador serve para descobrir que existe uma regra; a confirmação vem sempre
da fonte oficial. Dentro do Schengen, para residente em Portugal, esta seção
se resume a "leve passaporte e título de residência".

Padrões de busca que funcionam:

```
"visto <nacionalidade> <país> turismo site:gov"
"<country> visa requirements <nationality> citizens tourist 2026"
"<country> entry requirements EU residence permit non-EU citizen"
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
- Certificado internacional de vacinação, conforme o país de origem do
  passaporte e a residência.
- Seguro-viagem obrigatório (Schengen exige 30 mil euros).

Anote `documentacao.verificadoEm` com a data da consulta. Sem isso a informação
não é auditável e daqui a três meses ninguém sabe se ainda vale.

## Calendário: festivais, sazonalidade e aberturas

Isto vem antes de preço. Padrões de busca:

```
"festivais <cidade> <mês> <ano>"
"<city> events calendar <month> <year>"
"<país> feriados <ano>"                      # feriados nacionais
"vacances scolaires <ano> zones"             # França; cada país tem o seu
"<fenômeno> previsão <ano>"                  # folhas de outono, floração, neve
"<atração> horário de funcionamento dia de fecho"
"<attraction> opening hours closed day"
```

**Fenômeno sazonal pede a previsão daquele ano, não a média histórica.** Datas
de floração e de folhagem se deslocam com o clima do ano, e recomendar a média
faz a pessoa chegar uma semana cedo demais no exato motivo da viagem.

**Janela de venda de ingresso** é fato que molda o plano:

```
"<atração> quando abrem as vendas antecedência"
"<attraction> tickets release date how far in advance"
```

Coliseu abre 30 dias antes às 9h de Roma; Torre Eiffel, 60 dias. Converta para
o fuso de casa (Europe/Lisbon) e escreva a data e a hora exatas no checklist.

Ferramenta de busca de locais devolve horário por dia da semana — use isso e
confira cada parada contra o dia em que ela vai cair.

## Voos

```
"voos Lisboa <destino> <mês> <ano> mais barato"
"voos Porto <destino> <mês> <ano>"
"<city A> to <city B> multi-city open jaw"
"<companhia> site oficial"
"aeroportos próximos de <cidade>"
```

Compare no agregador, compre no site da companhia. Cheque sempre se
multidestino (entra por uma cidade, sai por outra) não sai igual ou mais
barato — costuma economizar um dia inteiro de trem. Saindo de Portugal, TAP,
Ryanair e easyJet cobrem quase toda a Europa em voo direto de 2 a 4 horas; a
diferença entre Lisboa e Porto às vezes paga o trem entre as duas.


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
https://open.er-api.com/v6/latest/EUR        → todas as moedas, atualiza diário
https://api.frankfurter.dev/v1/latest?base=EUR&symbols=JPY,GBP   → BCE, ~30 moedas

Dentro da zona euro não há câmbio nenhum — pule esta seção inteira.
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
resultado com data visível e converta para EUR na hora quando não for euro, anotando a taxa usada.

Colete pelo menos: voo ida e volta de Portugal no período, diária de hospedagem
na faixa do perfil, refeição simples, refeição decente, transporte urbano
diário ou passe, e ingresso das três atrações principais.

Dois itens que quase sempre escapam e mudam o total:

```
"<cidade> taxa de turismo por noite <ano>"     # Roma cobra ~€6 pp/noite
"<país> tarifa residente não residente museu"  # França desde 2026; residente na UE costuma pagar menos
"<serviço de aeroporto> <ano>"                 # pega serviço extinto
```

Taxa de turismo é linha de orçamento, cobrada na hospedagem e por pessoa por
noite. Tarifa dupla residente/visitante vira duas colunas no `trip.json` e um
botão no site. E busca com o ano no fim é o que revela que aquele ônibus de
aeroporto recomendado pelo blog foi desativado há três anos.

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
