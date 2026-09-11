---
name: site-viagem
description: Gera ou atualiza o site de 1 página de um destino a partir do trip.json, mais o roteiro imprimível em markdown, usando o template React + Vite bundlado — com roteiro dia a dia, mapa Leaflet, clima Open-Meteo, botão que converte a página inteira entre moeda local e real, reservas por urgência com prazos, orçamento em duas colunas e checklists salvos no aparelho. Use sempre que o usuário pedir o site, a página ou o "one pager" de uma viagem, quiser ver o roteiro montado, pedir para atualizar um destino que já existe, mudar algo no site de uma viagem, ou quando uma pesquisa de destino acabou de produzir um trip.json e falta transformá-lo em página. Também use quando pedirem para publicar ou fazer deploy do site de uma viagem.
---

# Site da viagem

O site é a entrega final: o lugar onde a viagem inteira cabe numa tela, dá para
abrir no celular no meio da rua e mandar o link para quem vai junto. Ele é
**derivado** do `trip.json` — o template já sabe desenhar tudo que o contrato
descreve, então o seu trabalho quase nunca é escrever componente, é ter dados
bons.

## Fluxo

```bash
# 1. cria ou atualiza destinos/<slug>/site/
bash .claude/skills/site-viagem/scripts/criar-site.sh <slug>

# 2. instala (só na primeira vez) e vê localmente
cd destinos/<slug>/site && npm install && npm run dev

# 3. roteiro imprimível, do mesmo trip.json
node .claude/skills/site-viagem/scripts/gerar-roteiro.mjs <slug>

# 4. portão de qualidade — tem que passar antes de entregar
node .claude/skills/site-viagem/scripts/qa-site.mjs <slug>
```

O script trata `src/data/trip.json` como link para
`destinos/<slug>/trip.json`. Isso é de propósito: editar o `trip.json` do
destino já reflete no site, sem ninguém precisar lembrar de sincronizar duas
cópias — que é exatamente o tipo de esquecimento que faz um site mostrar o
horário de voo antigo.

## Destino novo

1. Confirme que `destinos/<slug>/trip.json` existe e é válido
   (`node -e "require('./destinos/<slug>/trip.json')"`). Se não existe, o passo
   anterior é `pesquisa-destino`, não este.
2. Rode o script.
3. `npm install`, depois gere o roteiro em markdown, depois rode o QA. **O QA é
   portão, não sugestão**: ele builda, sobe o preview e checa no browser real
   que não há erro de JS, que a página não rola de lado no celular, que toda
   seção do menu existe e abre, e que os links são absolutos. Anunciar um site
   que não abre é o pior desfecho possível aqui — mais caro que não ter
   entregado, porque o viajante só descobre no aeroporto.
4. Diga ao usuário o que a página mostra e o que ficou de fora por falta de
   dado, porque é isso que ele precisa saber para pedir a próxima rodada.

## Destino existente

Este é o caminho mais comum depois da primeira viagem, e é onde dá para causar
estrago. **Nunca recrie do zero**: pode haver reserva confirmada, preço
negociado ou ajuste manual ali dentro.

1. Leia o `trip.json` atual antes de qualquer coisa.
2. Faça merge do que mudou, preservando **os IDs existentes**. O site usa IDs
   como chave de `localStorage` para lembrar o que já foi marcado — renomear um
   ID apaga os checks do usuário no meio da viagem.
3. Rode o script de novo. Ele repõe o que falta e **preserva arquivos que
   divergem do template**, listando quais no final. Se um arquivo aparecer
   nessa lista, alguém customizou: leia antes de decidir. `--forcar` repõe
   tudo e descarta a customização — use só depois de conferir.
4. Rebuilde e diga em uma linha o que mudou.

## O que o template já resolve

Não reimplemente nada disto — leia os componentes antes de escrever código
novo, porque quase sempre o que falta é dado, não interface:

| Seção | Componente | Vem de |
|---|---|---|
| Cabeçalho, contagem, tema, botões de moeda e tarifa | `Cabecalho.jsx` + `lib/precos.jsx` | `titulo`, `periodo`, `destinos`, `tarifaDupla` |
| Documentos e providências | `Documentacao.jsx` | `documentacao` |
| Reservas por urgência, com prazo e hora de venda | `Reservas.jsx` | `reservas` |
| Voos, hospedagem, passes | `Logistica.jsx` | `voos`, `hospedagens`, `transportes` |
| Roteiro dia a dia, com "feito" | `Roteiro.jsx` | `dias[].blocos[]` |
| Mapa interativo com filtro por dia | `Mapa.jsx` | qualquer item com `lat`/`lon` |
| Clima do período | `Clima.jsx` | Open-Meteo, via `destinos[].lat/lon` |
| Orçamento: seu plano / econômico / gasto real | `Orcamento.jsx` | `orcamento` |
| Conversor de moeda ao vivo | `Cambio.jsx` | `destinos[].moeda` |
| Onde comer, bagagem, frases, links | componentes homônimos | campos homônimos |

**Seção sem dado não aparece** — nem na página, nem no menu. Então a forma de
"tirar uma seção" é esvaziar o campo no `trip.json`, não mexer no `App.jsx`.

Detalhes de comportamento que já estão resolvidos e vale conhecer antes de
mexer:

- **Botão de moeda no cabeçalho** converte a página inteira entre a moeda local
  (o número da etiqueta na vitrine) e o real (o que sai do bolso), já com IOF e
  spread. É o controle mais usado durante a viagem, por isso fica no topo e não
  escondido numa seção. Todo preço passa por `usePrecos().fmt(custo)` — se você
  formatar dinheiro direto num componente novo, ele fica de fora do botão.
- **Botão de tarifa** aparece só quando `tarifaDupla.ativo`. `custo.valor` é
  sempre o que o brasileiro paga; `custo.valorResidente` é o extra. Esquecer o
  campo extra nunca subestima o orçamento.
- **Ordem das reservas é pelo prazo real**, não pelo rótulo de urgência: uma
  venda que abre em três dias vence um voo "imediato" com duas semanas.
- Venda que abre de madrugada no horário de Brasília ganha aviso explícito — é
  o que decide se a pessoa põe despertador.
- Viagem daqui a meses mostra média histórica em vez de previsão, e diz isso.
- Checklists, blocos marcados, moeda e tema sobrevivem ao refresh via
  `localStorage`.
- Tema claro, escuro e automático; e a versão impressa vira roteiro de bolso.

Duas coerências que o código não força e você precisa manter no `trip.json`:
categoria marcada `intocavel` deve ter `economico` igual a `previsto` (o que é
a razão de ser da viagem não entra na tesoura), e `orcamento.tetoPor` precisa
dizer se o teto era por pessoa ou do grupo — o site mostra qual leitura está
usando, e a leitura errada muda o veredito inteiro.

## Quando mexer no código

Só quando a mudança for de **comportamento ou visual**, nunca de conteúdo.
Nesse caso:

- Mexa no componente específico, não no `App.jsx`.
- Use os tokens de `index.css` (`bg-superficie`, `text-tinta-2`, `border-linha`,
  `text-acento`) em vez de cor literal — é o que mantém o tema escuro
  funcionando. Cor fixa no componente quebra metade da página no escuro.
- Não adicione dependência. O template tem três (`react`, `react-dom`,
  `leaflet`) de propósito: um site que fica seis meses parado entre uma viagem
  e outra não pode depender de um ecossistema que envelhece.
- Se a mudança serve para toda viagem, aplique também em
  `assets/template/` — senão a próxima viagem nasce velha.

Para publicar no VPS, veja `references/deploy.md`. Um `trip.json` de exemplo
completo, exercitando todos os campos do contrato, está em
`references/exemplo-trip.json` — vale consultar quando estiver em dúvida sobre
como preencher alguma seção.

## Ao terminar

Mostre o caminho do site, o caminho do `roteiro-<slug>.md`, o comando para
rodar, o resultado do QA, e o que ficou vazio por falta de dado. Depois acione `perfil-viajante` para registrar o que a sessão revelou
sobre as preferências dele quanto ao site — quais seções ele usa e quais manda
tirar é informação que encurta a próxima viagem.
