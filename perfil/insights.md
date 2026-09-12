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

**Perguntas que não precisei fazer**
- Nenhuma ainda — perfil estava vazio. A partir daqui: companhia, moeda,
  fuso, aeroporto, ritmo, interesses e faixa de orçamento não se perguntam
  mais. O próximo briefing deve ter uma rodada, não quatro.

---
