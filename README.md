# Viagens

Planejador de viagens pessoal. Um prompt curto vira um site de 1 página para
aquele destino — e cada rodada deixa o repo mais esperto, para o próximo prompt
ser ainda mais curto.

```
quero ir pra Lisboa em maio, uns 8 mil, quero museu e comer bem
```

→ pesquisa do destino → orçamento → `destinos/lisboa-maio-2027/site/`

## As skills

| Skill | O que faz |
|---|---|
| **planejar-viagem** | Entrada principal. Lê o pedido, decide se é destino novo ou atualização, e encadeia as outras. |
| **briefing-viagem** | Quando falta muita coisa: perguntas em opções, com sugestões pré-preenchidas pelo perfil — cada vez menos a cada viagem. |
| **perfil-viajante** | A memória. Lê `perfil/PERFIL.md` antes de perguntar e escreve nele depois de aprender. |
| **pesquisa-destino** | Ancora as datas em festivais e sazonalidade, verifica o que abre em cada dia da semana **antes** de fixar a ordem, e pesquisa visto, custos, bairros e voos → `PESQUISA.md` + `trip.json`. |
| **roteiro-viagem** | O ofício de montar dias que se cumprem: ordem pelo que abre, geografia antes de tema, meio dia nas pontas, plano B, dias cortáveis, passagem final. |
| **orcamento-viagem** | Orçamento de trás para frente a partir do teto, em duas colunas (seu plano / econômico), com câmbio, IOF, taxa de turismo e previsto vs real. |
| **site-viagem** | O palco imersivo, com identidade derivada do destino, mais o roteiro imprimível e o QA que bloqueia a entrega. |

Na prática você chama só a primeira; ela aciona as outras. Mas cada uma
funciona sozinha — dá para pedir só um orçamento, ou só atualizar o site.
De onde veio cada regra e em qual skill ela vive: `docs/mapa-de-conhecimento.md`.

## Como o aprendizado funciona

`perfil/PERFIL.md` guarda o que já se sabe sobre como você viaja, com um nível
de confiança em cada afirmação:

- **hipótese** — um sinal indireto; vira default, mas é sinalizado no resultado
- **provável** — dito claramente, ou repetido; usado sem perguntar
- **confirmado** — repetido em viagens diferentes; tratado como regra

Uma afirmação só entra se mudaria uma decisão em **outro** destino. "Gostou do
Museu do Prado" não entra; "prioriza museus de arte e aceita gastar meio dia
num só" entra. Contradição derruba a entrada antiga em vez de acumular ao lado
dela — memória ambígua não responde nada, e você volta a digitar prompt longo.

`perfil/insights.md` é o log de onde veio cada coisa, e serve para desfazer uma
inferência errada.

## Estrutura

```
perfil/            PERFIL.md (memória curada) e insights.md (log)
destinos/<slug>/   trip.json, PESQUISA.md, APRENDIZADOS.md, site/
docs/              contrato do trip.json
.claude/skills/    as cinco skills
```

`trip.json` é a fonte da verdade de cada viagem; o site é derivado dele. Para
mudar conteúdo, mude o `trip.json` e regenere — ver `docs/trip-schema.md`.

## O site gerado

Um palco de uma tela só, sem rolagem, com a identidade visual derivada do
destino — paleta, tipografia, silhueta no horizonte e um momento de
encantamento (folhas de momiji caindo no Japão de outono; estrelas em Paris),
escolhidos por viagem no `trip.json`. Bonito o bastante para guardar, prático
o bastante para usar às 8h numa estação de metrô.

- **Bilhetes de dia** com canhoto picotado: número, título, os três momentos
  do dia e o custo. Abrem em modal com a linha do tempo, plano B para chuva,
  opção B quando o dia tem duas versões, e marcar como feito
- **Tiles** — Reservar, Logística, Mapa, Orçamento, Mala, Guia — com o texto
  pequeno ao vivo ("3 de 6 feitas"); só existem os que têm conteúdo
- **Botão de moeda** que converte a página inteira entre a moeda local e o
  real, já com IOF e spread; toggle residente / visitante onde há tarifa dupla
- **Reservas** ordenadas pelo prazo real, com a hora exata em que o ingresso
  abre à venda convertida para Brasília
- **Orçamento** em três modos (seu plano, econômico, real), mapa escuro
  filtrável por dia, clima (previsão perto da data, média rotulada longe)
- No celular vira lista compacta com folha inferior; imprime como roteiro de
  bolso; degrada sozinho sem rede

React 19 + Vite + Tailwind v4, três dependências de runtime, nenhuma API com
chave. Movimento só na carga e em resposta a um clique.

```bash
cd destinos/<slug>/site
npm install && npm run dev     # ver localmente
npm run build                  # dist/ pronto para o VPS

# roteiro imprimível, do mesmo trip.json
node .claude/skills/site-viagem/scripts/gerar-roteiro.mjs <slug>

# portão de qualidade: build, erro de JS, rolagem lateral, links, seções
node .claude/skills/site-viagem/scripts/qa-site.mjs <slug>
```

Publicação no VPS (Caddy e nginx): `.claude/skills/site-viagem/references/deploy.md`.

## `destinos/japao-outono-2026`

Destino de exemplo, criado para validar o template de ponta a ponta. Os preços
e horários são plausíveis mas fabricados — serve como referência de um
`trip.json` completo e pode ser apagado quando você tiver viagens de verdade.
