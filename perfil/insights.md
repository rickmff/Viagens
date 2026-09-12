# Log de insights

Append-only. Cada sessão de planejamento vira uma entrada no topo. Serve para
três coisas: rastrear de onde veio cada afirmação do `PERFIL.md`, permitir
desfazer uma inferência errada, e deixar visível o quanto o perfil está
amadurecendo.

Formato de cada entrada:

```md
## AAAA-MM-DD — <destino ou assunto>

**Prompt (resumo):** o que ele pediu, em uma linha.

**Sinais observados**
- O que ele disse ou escolheu, literalmente.

**Inferido**
- Afirmação nova ou promovida, com o nível de confiança resultante.

**Aplicado ao PERFIL.md**
- Seção → mudança feita.

**Perguntas que não precisei fazer** (porque o perfil já respondia)
- ...
```

---

## 2026-09-12 — Pivô: de site para planilha

**Prompt (resumo):** "isso de fazer os website não está sendo tão bom quanto
eu pensava; pivote o sistema para fazer planilhas de Excel estritamente
organizadas e úteis para fazer os cálculos precisos e me ajudar a comparar
orçamentos de viagens para os mesmos destinos" e, em seguida, "no Excel tem
que ter opções de upgrade e downgrade da maioria dos itens e links para
reservar e comprar cada item".

**Sinais observados**
- Rejeitou a entrega (site) depois de vê-la duas vezes, com uma frase — sem
  pedir ajuste no site. O problema era o formato, não o conteúdo.
- O que ele quer fazer com a entrega: calcular com precisão, comparar
  orçamentos, escolher upgrade/downgrade por item, e comprar pelo link.

**Inferido**
- Decide em planilha, item a item. (confirmado — dito)
- Compara alternativas antes de comprar; a comparação é a peça central.
  (provável)

**Aplicado ao PERFIL.md**
- Nova seção "Formato da entrega" substitui "Preferências sobre o site gerado".

**Aplicado ao repo**
- Skill `planilha-viagem` (gerador + comparador + recálculo como portão);
  `site-viagem` marcada opcional; `custo.opcoes` e `link` no contrato; CLAUDE.md,
  README e mapa de conhecimento repontados.

---

## 2026-09-12 — Paris no lugar da Itália

**Prompt (resumo):** "me ajude a planejar uma viagem pra França em outubro".

**Sinais observados**
- Uma rodada de perguntas bastou (o perfil respondeu companhia, saída,
  ritmo, interesses e faixa) — o briefing encurtou de quatro rodadas para uma.
- Escolheu Paris só, 4–5 dias, outubro de 2026 **no lugar** da Itália.
- Acrescentou "com estadia na Disney de 1 noite e 2 dias" numa frase solta,
  depois do pedido principal — o sinal mais revelador da sessão: parque
  temático entra nos interesses, e com peso (≈ €450 dos €2.000).

**Inferido**
- Troca destino sem apego antes de comprar; compromisso é com janela e teto.
  (hipótese)
- Viagem curta para cidade única. (hipótese)
- Parque temático / Disney como interesse real, não só "para acompanhar".
  (provável)

- Mandou um link de hotel do eDreams para comparar com as sugestões, e
  pediu que o site entrasse nas fontes de pesquisa. O link trazia 17→21/10
  (Toussaint, fora da janela 7→11/10) — devolvido como pergunta, não
  corrigido em silêncio.

**Aplicado ao PERFIL.md**
- Orçamento e Ritmo → as duas hipóteses acima; base fixa em viagem curta.
- Hospedagem → compara no eDreams (provável). Regras de uso do comparador
  foram para `pesquisa-destino/references/fontes.md`.
- Interesses → parque temático / Disney (provável).

**Perguntas que não precisei fazer**
- Companhia, saída, ritmo, interesses, teto, nacionalidade, moeda, fuso.

---

## 2026-09-12 — Itália 2027 (briefing) e uma correção de fundação

**Prompt (resumo):** "Quero planejar uma viagem pra Itália"; no briefing,
corrigiu: mora em Portugal e gasta em euro.

**Sinais observados**
- Escolheu datas flexíveis com pedido de comparação de épocas; 7 a 9 dias;
  recorte clássico Roma–Florença–Veneza; em casal.
- Ao ver valores em R$, interrompeu: "moro em Portugal e gasto em euro".

**Inferido**
- Mora em Portugal, moeda EUR, fuso Europe/Lisbon — (confirmado).
- Viaja em casal — (provável).
- Prefere ver alternativas comparadas antes de fixar data — (hipótese).

**Aplicado ao PERFIL.md**
- Contexto fixo → **derrubada** a entrada "Mora no Brasil, moeda BRL
  (confirmado)". Ela nunca foi dita: foi inferida do idioma e marcada como
  confirmada por engano. Lição para o próprio perfil: *confirmado* só quando
  ele disse, nunca por inferência de idioma ou de contexto.
- Contexto fixo → Portugal, EUR, Europe/Lisbon; companhia em casal.

**Segunda rodada (mesma sessão)**
- Escolheu "outubro de 2026" digitando o ano corrente numa opção que dizia
  2027: viaja logo, não daqui a um ano. Cinco semanas de antecedência.
- Manteve o teto de €2.000 quando ofereci subir; tirou Veneza; deixou Pompeia
  como opção B para decidir na hora. Padrão: cabe no dinheiro primeiro,
  ambição depois.
- Interesses escolhidos: história antiga, museus e arte, comer bem — os três
  de ingresso/reserva. Ritmo com folga.

**Terceira rodada (mesma sessão)**
- Nacionalidade dita com todas as letras: passaporte brasileiro, residência
  em Portugal → confirmado. Fecha a última lacuna do contexto fixo.

**Perguntas que não precisei fazer**
- Nenhuma ainda — perfil estava vazio. A partir daqui: companhia, moeda,
  fuso, aeroporto, ritmo, interesses e faixa de orçamento não se perguntam
  mais. O próximo briefing deve ter uma rodada, não quatro.

---
