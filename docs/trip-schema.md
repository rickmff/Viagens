# Contrato `trip.json`

Todas as skills deste repo se comunicam por este arquivo. A pesquisa escreve
nele, o orçamento escreve nele, o site apenas lê. Se você está em dúvida sobre
onde guardar alguma informação de uma viagem, a resposta é aqui.

O arquivo vive em `destinos/<slug>/trip.json` e é sempre válido: campos que
você ainda não sabe ficam ausentes ou `null`, nunca com texto inventado. O site
esconde automaticamente as seções cujos dados estão vazios, então um `trip.json`
incompleto gera um site menor, não um site quebrado. Isso é proposital — é
melhor entregar cedo um site com 4 seções verdadeiras do que um com 12 seções
meio inventadas.

## Estrutura

```jsonc
{
  "schemaVersion": 1,
  "slug": "japao-outono-2026",        // igual ao nome da pasta, sem acento
  "titulo": "Japão — Outono 2026",
  "subtitulo": "Tóquio, Kyoto e Osaka em 14 dias",
  "atualizadoEm": "2026-09-11",       // ISO date, toda vez que a skill mexe
  "status": "planejando",             // planejando | confirmado | em-viagem | concluido

  "periodo": { "inicio": "2026-10-12", "fim": "2026-10-26" },
  "moedaBase": "BRL",
  "origem": { "cidade": "São Paulo", "iata": "GRU" },

  "viajantes": [
    { "id": "rick", "nome": "Rick" }
  ],

  // ── Destinos ──────────────────────────────────────────────────────────
  // Cada cidade/base da viagem. lat/lon são obrigatórios: o mapa, o clima e
  // o fuso horário do site dependem deles. Use Nominatim para obtê-los.
  "destinos": [
    {
      "id": "tokyo",
      "nome": "Tóquio",
      "pais": "Japão",
      "paisISO": "JP",
      "moeda": "JPY",
      "lat": 35.6762,
      "lon": 139.6503,
      "fuso": "Asia/Tokyo",
      "chegada": "2026-10-12",
      "saida": "2026-10-18",
      "resumo": "Uma ou duas frases sobre o papel desta cidade no roteiro.",
      "bairroBase": "Shinjuku"
    }
  ],

  // ── Documentação ──────────────────────────────────────────────────────
  // Primeira classe para viagem internacional. `verificadoEm` importa: regra
  // de visto muda, e o site mostra a data para o leitor saber se confia.
  "documentacao": {
    "verificadoEm": "2026-09-11",
    "visto": {
      "necessario": false,
      "detalhe": "Brasileiros têm isenção para turismo até 90 dias.",
      "fonte": "https://..."
    },
    "passaporte": { "validadeMinimaMeses": 6, "observacao": null },
    "vacinas": [{ "nome": "Febre amarela", "obrigatoria": false, "observacao": "..." }],
    "seguro": { "obrigatorio": false, "coberturaMinima": null, "observacao": "..." },
    "alfandega": ["Declarar mais de 1 milhão de ienes em espécie"],
    "checklist": [
      { "id": "doc-passaporte", "texto": "Passaporte válido até abr/2027", "prazo": "2026-09-30" }
    ]
  },

  // ── Logística ─────────────────────────────────────────────────────────
  "voos": [
    {
      "id": "ida",
      "tipo": "ida",                 // ida | volta | interno
      "de": "GRU", "para": "HND",
      "partida": "2026-10-11T23:55", // hora local do aeroporto de origem
      "chegada": "2026-10-13T05:30", // hora local do aeroporto de destino
      "cia": "Japan Airlines",
      "voo": "JL 8060",
      "escalas": ["DOH"],
      "duracaoTotalMin": 1655,
      "custo": { "valor": 5800, "moeda": "BRL", "por": "pessoa" },
      "localizador": null,
      "status": "cotado"             // cotado | reservado | emitido
    }
  ],
  "hospedagens": [
    {
      "id": "hosp-tokyo",
      "destinoId": "tokyo",
      "nome": "Hotel X",
      "checkin": "2026-10-13", "checkout": "2026-10-18",
      "lat": 35.69, "lon": 139.70,
      "custo": { "valor": 2400, "moeda": "BRL", "por": "total" },
      "link": "https://...",
      "porque": "A 4 min do metrô, bairro que fica vivo à noite.",
      "status": "cotado"
    }
  ],
  "transportes": [
    {
      "id": "jr-pass",
      "tipo": "passe",               // passe | trem | onibus | carro | ferry | transfer
      "nome": "JR Pass 7 dias",
      "custo": { "valor": 1900, "moeda": "BRL", "por": "pessoa" },
      "cobre": ["tokyo", "kyoto"],
      "observacao": "Só compensa se fizer Tóquio→Kyoto→Osaka ida e volta."
    }
  ],

  // ── Roteiro ───────────────────────────────────────────────────────────
  // Um objeto por dia do período, em ordem. O site desenha a timeline e o
  // mapa a partir daqui, então blocos com lat/lon viram pinos.
  "dias": [
    {
      "data": "2026-10-13",
      "destinoId": "tokyo",
      "titulo": "Chegada e Shibuya devagar",
      "notas": "Dia de jet lag: nada que exija acordar cedo.",
      "blocos": [
        {
          "id": "b1",
          "hora": "14:00",
          "duracaoMin": 120,
          "tipo": "atracao",          // atracao | refeicao | deslocamento | descanso | compras | evento | livre
          "titulo": "Cruzamento de Shibuya e Shibuya Sky",
          "lat": 35.6595, "lon": 139.7005,
          "custo": { "valor": 90, "moeda": "BRL", "por": "pessoa" },
          "reservaNecessaria": true,
          "link": "https://...",
          "notas": "Comprar ingresso do Sky com antecedência para o pôr do sol.",
          "alternativa": "Se chover, Meiji Jingu coberto pelas árvores."
        }
      ]
    }
  ],

  // ── Orçamento ─────────────────────────────────────────────────────────
  // Preenchido pela skill orcamento-viagem. Ver docs/orcamento.md.
  "orcamento": {
    "teto": { "valor": 25000, "moeda": "BRL" },
    "cambioReferencia": [{ "de": "JPY", "para": "BRL", "taxa": 0.038, "em": "2026-09-11" }],
    "categorias": [
      {
        "id": "voos", "nome": "Voos",
        "previsto": 11600, "real": null,
        "observacao": "Ida e volta para 2 pessoas."
      }
    ],
    "reserva": { "valor": 2000, "moeda": "BRL", "percentual": 8 }
  },

  // ── Utilidades ────────────────────────────────────────────────────────
  "bagagem": [
    { "categoria": "Documentos", "itens": ["Passaporte", "Seguro impresso"] }
  ],
  "gastronomia": [
    { "nome": "Tsukiji Outer Market", "destinoId": "tokyo", "tipo": "mercado",
      "lat": 35.665, "lon": 139.770, "faixaPreco": "$$", "porque": "..." }
  ],
  "frases": [
    { "pt": "Quanto custa?", "local": "いくらですか", "leitura": "ikura desu ka" }
  ],
  "links": [
    { "titulo": "Mapa do metrô de Tóquio", "url": "https://...", "categoria": "transporte" }
  ],
  "avisos": [
    { "nivel": "atencao", "texto": "Outubro é temporada de tufão; tenha plano B." }
  ]
}
```

## Convenções que evitam retrabalho

**Dinheiro sempre com moeda.** Nunca `"custo": 90` — sempre
`{ "valor": 90, "moeda": "BRL", "por": "pessoa" }`. O site converte e soma
sozinho, mas só se souber a moeda e se o valor é por pessoa ou total.

**Datas em ISO.** `YYYY-MM-DD` para datas, `YYYY-MM-DDTHH:mm` para horários
locais. Sem fuso na string — o fuso vem do destino.

**IDs estáveis e legíveis.** `tokyo`, `hosp-tokyo`, `b1`. O site usa IDs como
chave de `localStorage` para marcar blocos como feitos: se você renomear um ID
numa atualização, o usuário perde os checks. Ao atualizar um destino, preserve
os IDs existentes e só crie novos.

**Um bloco sem `lat`/`lon` não aparece no mapa.** Se a atividade tem lugar
físico, geocodifique. Se é "manhã livre", não force coordenada.

**`null` é honesto, texto inventado não é.** Preço que você não pesquisou é
`null`. O site mostra "a definir" e ninguém viaja confiando num número falso.
