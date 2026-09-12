# Design do site: a identidade vem do destino

O palco é sempre o mesmo — título, contagem, bilhetes de dia, tiles, modal. O
que muda de viagem para viagem é a **atmosfera**: cor, tipo, silhueta no
horizonte e um único momento de encantamento. Um site do Japão no outono não
pode parecer um de Lisboa em maio, e nenhum dos dois pode parecer o padrão do
template. Se você entregou o site com a paleta que já vinha no
`DESIGN_PADRAO`, o trabalho de design não foi feito.

Tudo isso é dado, não código: preencha `design` no `trip.json` conforme
`docs/trip-schema.md`. O CSS lê e aplica.

## A régua

Um site digno de prêmio e um site prático não são opostos — os premiados são
os que sabem onde gastar a ousadia. A régua aqui:

1. **Uma abertura memorável, o resto disciplinado.** O título em itálico
   revelando-se, a silhueta no horizonte e o momento são a ousadia. Depois
   disso, tudo é hierarquia limpa, contraste alto e zero enfeite.
2. **Movimento só na carga (uma vez) e em resposta a um clique.** Nada pulsa,
   nada flutua, nada roda sozinho. O momento é a única exceção, e dura segundos.
3. **Contraste de leitura ao sol.** `creme` sobre `noite` ≥ 7:1. Confira antes
   de gravar a paleta — o site vai ser lido numa rua com o celular no brilho
   máximo.
4. **Duas fontes, no máximo.** Uma de display com personalidade (numerais e
   títulos), uma de interface quieta. Nunca Playfair, nunca Inter por reflexo.
5. **Nada externo que possa faltar.** Ícones e silhueta em SVG escrito no
   arquivo. A única exceção são as fontes, que caem no fallback local se a
   rede sumir.
6. **Prático antes de bonito.** Se um efeito atrapalha ler o horário do trem
   às 8h da manhã numa estação, ele sai.

## Paleta — 12 tokens

Derive dos materiais, têxteis, arquitetura e paisagem do destino **na estação
da viagem**. Pense no que a pessoa vai ver, não no que o cartão-postal mostra.

| Token | Papel | Como escolher |
|---|---|---|
| `noite` | fundo da página | o escuro do lugar: sumi do Japão, azul-hora de Paris, basalto de Lisboa |
| `cair` | bilhetes e painel do modal | `noite` um passo mais claro |
| `cair2` | hover e superfície elevada | mais um passo |
| `ouro` | numerais, horas, links, ícones | o metal ou a luz do lugar: ouro de Eiffel, âmbar de lanterna, cobre de azulejo |
| `ouro2` | brilho do ouro | pode omitir; o site deriva clareando |
| `tinta` | preços e itálicos | o segundo acento, quente ou frio em oposição ao ouro: vermelhão de torii, roxo de tinta, terracota |
| `creme` | texto | o claro do lugar: washi, calcário, cal |
| `ceuAlto` → `ceuBaixo` → `horizonte` | gradiente do céu | quatro paradas, do mais escuro no topo ao mais aceso na linha do horizonte |
| `silhueta` | a silhueta | entre `noite` e `cair`, para ficar sugerida e não desenhada |

Exemplos que funcionam:

- **Japão, outono** — sumi `#12101C`, ouro de lanterna `#D9A441`, vermelhão de
  momiji `#E0704A`, washi `#F5EEDF`.
- **Paris, outubro** — índigo de hora azul `#17163A`, ouro de Eiffel `#F2B84B`,
  roxo de caneta `#B9A4FF`, creme `#F6EFDD`.
- **Lisboa, maio** — azul de azulejo profundo `#10233A`, cobre `#D8A25A`,
  terracota `#D9694A`, calcário `#F3EEE4`.
- **Roma, abril** — pinho noturno `#14201A`, travertino `#E3C48D`, ocre
  `#C9743A`, mármore `#F2EDE3`.
- **Marrocos, inverno** — azul de Chefchaouen `#152B44`, latão `#D9A54B`,
  açafrão `#E08A3C`, gesso `#F4EEE2`.

Não repita a paleta de outra viagem. Se dois destinos ficaram parecidos, um
deles está genérico.

## Fontes

Uma de display com opsz e itálico de verdade (o h1 é itálico) — Fraunces,
Cormorant, Shippori Mincho, Newsreader, Instrument Serif, Bodoni Moda — e uma
de UI que não chame atenção — Instrument Sans, IBM Plex Sans, Work Sans,
Manrope. Escolha pelo lugar: Mincho para o Japão, uma didone para Paris, uma
garalda para Roma.

Grave em `fontes.google` só o query string do Google Fonts (`family=…`) e em
`display`/`ui` a pilha completa com fallback local, porque offline o site tem
que continuar em pé.

## Silhueta

Um único `path` em `viewBox 0 0 1440 120`, preenchido com `silhueta`, ancorado
na base. Skyline, litoral, cordilheira, telhados — o que a pessoa vai ver da
janela. Marco público é bem-vindo (torre, portão, cúpula, monte); logotipo e
personagem, nunca.

Como desenhar: comece em `M0 120`, suba para a linha base (`V96`), e vá para a
direita alternando `h` (largura) e `V`/`v` (altura). Picos com `l` diagonais.
Termine em `h…z` de volta ao canto. Mantenha entre 40 e 80 comandos — mais
que isso vira ilustração, e a silhueta é atmosfera, não ilustração.

Sem ideia boa, `null`: gradiente limpo é melhor que silhueta ruim.

## O momento

O único gesto de encantamento da página: clicar no título ou no botão faz o
céu responder por alguns segundos. Ele também roda uma vez na carga.

| `tipo` | O que faz | Quando usar |
|---|---|---|
| `estrelas` | pontos de ouro piscando no alto | céu noturno, deserto, torre que cintila |
| `folhas` | folhas na cor `tinta` caindo e girando | outono, floresta, jardim |
| `petalas` | pétalas leves caindo | primavera, cerejeira, jacarandá |
| `neve` | flocos brancos descendo devagar | inverno, montanha |
| `null` | nada | quando o destino não tem um momento óbvio |

Se o destino não sugere um, `null`. Momento forçado é decoração, e decoração
é o que a régua proíbe.

## Ícones dos bilhetes

Um por dia, do conjunto em `components/Icones.jsx`: `plane train suitcase
castle museum pyramid eiffel dome torii temple boat beach mountain food market
onsen ticket camera tree leaf wine snow sun star coin column fountain bed map
bag compass`. Escolha pelo que define o dia, não pelo primeiro bloco. Sem
escolha, o site cai para o tipo do primeiro bloco.

Precisa de um que não existe? Acrescente um path de traço 24×24 ao conjunto
— e aplique também em `assets/template/`, senão a próxima viagem nasce sem ele.

## Antes de entregar

Rode o QA e **olhe as capturas** em `site/.qa/`. O script pega o mecânico —
rolagem, modal que não abre, erro de JS. O que só o olho pega: título
estourando o bilhete, tile com texto vazio, cabeçalho apertado no celular,
selo em cima de texto, cor que sumiu no fundo. Corrija e rode de novo.

Na resposta, uma linha sobre a paleta e por quê — o usuário precisa saber que
foi uma escolha, não um sorteio.
