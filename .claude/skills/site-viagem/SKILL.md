---
name: site-viagem
description: OPCIONAL — só quando o usuário pedir explicitamente o site, a página ou o "one pager"; a entrega padrão do repo é a planilha (planilha-viagem). Gera ou atualiza o site imersivo de um destino a partir do trip.json — um palco de uma tela só, com identidade visual derivada do destino (paleta, tipografia, silhueta no horizonte e um momento de encantamento), bilhetes de dia que abrem em modal, tiles de reservas, logística, mapa, orçamento com câmbio ao vivo, mala e guia — mais o roteiro imprimível em markdown e um QA que bloqueia a entrega. Use sempre que o usuário pedir o site, a página, o "one pager" ou o roteiro montado de uma viagem, quiser mudar o visual ou uma seção do site, pedir para atualizar um destino existente, pedir para publicar no VPS, ou quando pesquisa, roteiro e orçamento já estão no trip.json e falta a entrega.
---

# Site da viagem

**Esta skill é opcional.** A entrega padrão do repo é a planilha
(`planilha-viagem`); o site só sai quando o usuário pedir explicitamente. Quando
sair, o site é uma tela só, que abre no celular no meio da rua e
dá para mandar para quem vai junto. Ele precisa ser duas coisas ao mesmo
tempo — bonito o bastante para ser guardado, e prático o bastante para ser
usado às 8h numa estação de metrô. Os sites premiados são justamente os que
sabem onde gastar a ousadia: uma abertura memorável e o resto disciplinado.

O site é **derivado** do `trip.json`. O template já sabe desenhar tudo que o
contrato descreve; o seu trabalho quase nunca é escrever componente. É ter
dados bons e **escolher a identidade visual do destino**.

## Fluxo

```bash
# 1. cria ou atualiza destinos/<slug>/site/
bash .claude/skills/site-viagem/scripts/criar-site.sh <slug>

# 2. instala (só na primeira vez) e vê localmente
cd destinos/<slug>/site && npm install && npm run dev

# 3. roteiro imprimível, do mesmo trip.json
node .claude/skills/site-viagem/scripts/gerar-roteiro.mjs <slug>

# 4. portão de qualidade — tem que passar, e as capturas têm que ser olhadas
node .claude/skills/site-viagem/scripts/qa-site.mjs <slug>
```

O script trata `src/data/trip.json` como link para
`destinos/<slug>/trip.json`: editar os dados já reflete no site, sem ninguém
precisar sincronizar duas cópias.

## O palco

Uma tela, sem rolagem, em três faixas:

- **Topo** — título em itálico que se revela, subtítulo, botão do momento,
  contagem regressiva (dias para embarcar → "dia 3 de 9" durante a viagem →
  "viagem feita"), e os botões de moeda e tarifa.
- **Bilhetes de dia** — um por dia, com número grande, dia da semana e
  cidade, título, resumo de uma linha, os três momentos do dia, e no canhoto
  picotado o custo do dia e um ícone. Clicar abre o modal do dia: linha do
  tempo com hora, custo, link de reserva, plano B, marcar como feito, e abas
  quando o dia tem opção B.
- **Tiles** — Reservar · Logística · Mapa · Orçamento · Mala · Guia. Só existem
  os que têm conteúdo; o texto pequeno de cada um é ao vivo ("3 de 6 feitas",
  "€4.815 de €5.200").

Atrás de tudo, o céu: gradiente de quatro paradas, a silhueta do destino em
baixa opacidade, e as partículas do momento — que caem ou piscam por alguns
segundos na carga e a cada clique no título.

No celular o palco vira lista compacta de dias e chips de tiles; o modal sobe
como folha inferior. Continua sem rolagem — o QA confere.

## Destino novo

1. Confirme que `destinos/<slug>/trip.json` existe e tem `dias`. Se não tem,
   o passo anterior é `roteiro-viagem`, não este.
2. **Escolha o design.** Leia `references/design.md` e preencha `design` no
   `trip.json`: paleta de 12 tokens derivada do lugar e da estação, duas
   fontes, a silhueta, o momento. Entregar com a paleta padrão do template é
   entregar sem fazer o trabalho de design — e é o primeiro sinal de site
   genérico.
3. Preencha nos dias o que o bilhete mostra: `resumo`, `momentos` (três) e
   `icone`. Sem eles o site improvisa com os primeiros blocos, mas improviso
   raramente é o melhor resumo do dia.
4. Rode o script, `npm install`, gere o roteiro em markdown, rode o QA.
5. **Olhe as capturas** em `site/.qa/`. O QA pega o mecânico — rolagem, modal
   que não abre, erro de JS. Título estourando o bilhete, tile vazio, selo em
   cima de texto e cor que sumiu no fundo, só o olho pega.
6. Diga o que a página mostra, uma linha sobre a paleta e por quê, e o que
   ficou de fora por falta de dado.

## Destino existente

É o caminho mais comum depois da primeira viagem, e é onde dá para causar
estrago. **Nunca recrie do zero**: pode haver reserva confirmada, ajuste
manual, ou uma paleta que ele já aprovou.

1. Leia o `trip.json` atual antes de qualquer coisa.
2. Faça merge do que mudou, preservando **os IDs existentes** — o site usa IDs
   como chave de `localStorage` para lembrar o que já foi marcado; renomear
   apaga os checks no meio da viagem.
3. Rode o script de novo. Ele repõe o que falta e **preserva arquivos que
   divergem do template**, listando quais. Arquivo na lista foi customizado:
   leia antes de decidir. `--forcar` repõe tudo e descarta a customização.
4. QA, e diga em uma linha o que mudou.

## O que o template já resolve

Não reimplemente nada disto — leia o componente antes de escrever código
novo, porque quase sempre o que falta é dado, não interface:

| Peça | Arquivo | Vem de |
|---|---|---|
| Identidade visual (paleta, fontes, silhueta, momento) | `lib/design.js`, `Ceu.jsx` | `design` |
| Topo, contagem, botões de moeda e tarifa | `Topo.jsx`, `lib/precos.jsx` | `periodo`, `destinos`, `tarifaDupla` |
| Bilhetes de dia | `Bilhetes.jsx` | `dias[]` (`resumo`, `momentos`, `icone`, `cortavel`) |
| Modal e navegação ←/→/Esc, foco preso | `Modal.jsx` | — |
| Linha do tempo do dia, plano B, opção B, marcar feito | `DiaModal.jsx` | `dias[].blocos`, `opcaoB` |
| Tiles e seus textos ao vivo | `Tiles.jsx` | contagens do trip.json |
| Reservas por prazo real, hora de venda no fuso de casa | `Reservas.jsx` | `reservas` |
| Documentos e providências | `Documentacao.jsx` | `documentacao` |
| Voos, hospedagem, passes | `Logistica.jsx` | `voos`, `hospedagens`, `transportes` |
| Mapa escuro, filtrável por dia | `Mapa.jsx` | tudo com `lat`/`lon` |
| Orçamento: seu plano / econômico / real | `Orcamento.jsx` | `orcamento` |
| Câmbio ao vivo com a taxa do cartão (só fora do euro) | `Cambio.jsx`, `lib/cambio.js` | `destinos[].moeda` |
| Clima (previsão perto, média rotulada longe) | `Clima.jsx`, `lib/clima.js` | `destinos[].lat/lon` |
| Mala, frases, onde comer, avisos e links | homônimos | homônimos |
| Ícones de traço | `Icones.jsx` | `dias[].icone`, `design.momento.icone` |

Comportamentos que valem conhecer antes de mexer: todo preço passa por
`usePrecos().fmt(custo)` — dinheiro formatado direto num componente novo fica
fora do botão de moeda; `custo.valor` é sempre o que ele paga e
`valorResidente` é o extra; a ordem das reservas é pelo prazo real, não pelo
rótulo; e o site é de um tema só, o do destino — não existe modo claro, de
propósito.

Duas coerências que o código não força: categoria `intocavel` tem
`economico` igual a `previsto`, e `orcamento.tetoPor` diz se o teto era por
pessoa ou do grupo.

## Quando mexer no código

Só quando a mudança for de **comportamento ou visual do template**, nunca de
conteúdo nem de identidade (essas vão no `trip.json`). Nesse caso:

- Mexa no componente específico, não no `App.jsx`.
- Use os tokens (`bg-superficie`, `text-tinta-2`, `text-acento`, `text-preco`,
  ou as variáveis `--ouro`, `--creme`…) em vez de cor literal. Cor fixa num
  componente é o que faz a próxima viagem nascer com um pedaço da paleta
  errada.
- Movimento só na carga e em resposta a um clique. Nada pulsa sozinho.
- Não adicione dependência. Três (`react`, `react-dom`, `leaflet`) de
  propósito: um site que fica seis meses parado entre viagens não pode
  depender de um ecossistema que envelhece.
- Se serve para toda viagem, aplique também em `assets/template/`.

Para publicar no VPS: `references/deploy.md`. Um `trip.json` completo,
exercitando todos os campos, em `references/exemplo-trip.json`.

## Ao terminar

Caminho do site, do `roteiro-<slug>.md`, resultado do QA, uma linha sobre a
paleta, e o que ficou vazio por falta de dado. Depois `perfil-viajante` no
modo escrita: qual atmosfera ele escolheu, que tile abre primeiro e o que
mandou tirar são preferências que encurtam a próxima viagem.
