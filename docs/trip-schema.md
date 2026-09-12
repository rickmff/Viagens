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

  // Alguns destinos cobram preços diferentes de residentes e visitantes
  // (França desde 2026, entre outros). Quando existir, o site ganha um botão
  // que alterna as duas colunas. `valor` é SEMPRE o que o brasileiro paga —
  // o preço de residente é o campo extra — para que esquecer o campo nunca
  // subestime o orçamento.
  "tarifaDupla": {
    "ativo": false,
    "rotulo": "Tarifa dos museus",
    "rotuloResidente": "Residentes UE",
    "rotuloVisitante": "Não residentes"
  },

  // ── Design ────────────────────────────────────────────────────────────
  // O site é imersivo e a identidade vem do destino, nunca de um padrão.
  // Uma viagem ao Japão no outono não pode parecer uma a Paris na primavera.
  // Como derivar cada campo: site-viagem/references/design.md.
  "design": {
    "paleta": {
      "noite":   "#141225",   // fundo profundo da página
      "cair":    "#221F3A",   // bilhetes e painel do modal
      "cair2":   "#2E2A4C",   // hover e superfície elevada
      "ouro":    "#E0A23A",   // numerais, horas, links, ícones
      "tinta":   "#D98C6B",   // preços e itálicos (um segundo acento)
      "creme":   "#F4EDE0",   // texto — contraste ≥ 7:1 sobre "noite"
      "ceuAlto": "#0C0B1B", "ceuMeio": "#181633", "ceuBaixo": "#2A2447",
      "horizonte": "#3B3060", "silhueta": "#1A1735"
    },
    "fontes": {
      "display": "\"Fraunces\", Georgia, serif",        // numerais e títulos, itálico no h1
      "ui": "\"Instrument Sans\", system-ui, sans-serif",
      "google": "family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Instrument+Sans:wght@400;500;600"
    },
    // Silhueta do lugar em viewBox 0 0 1440 120, um único path de baixa
    // opacidade. Skyline, litoral, montanha. Sem logotipo. `null` = só gradiente.
    "horizonte": "M0 120V92h60V78h50v14h70V70h40v22h80V60h30v32h70V84h60v8h60V66h30v26h50V82h40l40-44 8-30 8 30 40 44h60v10h60V72h50v20h40V62l40-24 40 24v30h60V86h40v6h70V70h40v22h80V80h50v12h50V60h30v32h70V78h50v14h60v28z",
    // O único momento de encantamento da página. `tipo` decide a partícula:
    // estrelas | folhas | petalas | neve | null. Sem momento óbvio, `null`.
    "momento": { "tipo": "folhas", "rotulo": "Ver as folhas caírem", "icone": "tree" }
  },

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
      "bairroBase": "Shinjuku",
      // Cobrada na hospedagem, por pessoa por noite. Escapa de quase todo
      // orçamento e em cidade cara vira centenas de reais.
      "taxaTurismo": { "valor": 6, "moeda": "EUR", "por": "pessoa-noite" }
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

  // ── Reservas com prazo ────────────────────────────────────────────────
  // O que precisa ser comprado antes, em ordem de urgência. Prazo sem data é
  // só ansiedade; prazo com data é uma tarefa. Ver a lista de urgências em
  // pesquisa-destino/references/verificacoes.md.
  "reservas": [
    {
      "id": "res-coliseu",
      "oQue": "Ingresso do Coliseu",
      "urgencia": "data-exata",   // imediato | data-exata | sorteio | um-mes | duas-semanas | ultima-semana
      "prazo": "2027-03-15",      // até quando dá para resolver
      // Quando o ingresso abre à venda num instante e esgota em minutos.
      // Grave a hora local do site E o equivalente no Brasil — se cair de
      // madrugada, é isso que o viajante precisa saber.
      "abreVendaEm": { "local": "2027-03-15T09:00", "fuso": "Europe/Rome", "noBrasil": "2027-03-15T05:00" },
      "onde": "https://ecm.coopculture.it/",
      "nominativo": "Passaporte — o nome do ingresso tem que bater exatamente",
      "observacao": "Esgota em minutos. Deixe a página aberta antes da hora."
    }
  ],

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
      "resumo": "monotrilho · ramen no beco",   // uma linha sob o título do bilhete
      // Os três momentos que aparecem no bilhete. Opcional: sem eles o site
      // usa os três primeiros blocos. Três, não dois nem cinco.
      "momentos": [["18h30", "Haneda → Shinjuku"], ["20h30", "Omoide Yokocho"], ["22h00", "dormir cedo"]],
      "icone": "plane",   // ver a lista em design.md; fallback pelo tipo do 1º bloco
      "notas": "Dia de jet lag: nada que exija acordar cedo.",
      // Marque os dias mais fáceis de sacrificar. Viagem encurta, e é melhor
      // a decisão já estar tomada do que ser improvisada na véspera.
      "cortavel": false,
      // Dia com duas versões válidas vira abas no modal. Opcional.
      "opcaoB": { "rotulo": "Bate-volta a Kamakura", "blocos": [ /* mesmo formato */ ] },
      "blocos": [
        {
          "id": "b1",
          "hora": "14:00",
          "duracaoMin": 120,
          "tipo": "atracao",          // atracao | refeicao | deslocamento | descanso | compras | evento | livre
          "titulo": "Cruzamento de Shibuya e Shibuya Sky",
          "lat": 35.6595, "lon": 139.7005,
          // `valor` é o que o brasileiro paga. `valorResidente` só existe
          // onde há tarifa dupla, e alimenta o botão do site.
          "custo": { "valor": 90, "moeda": "BRL", "por": "pessoa", "valorResidente": 62 },
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
    "tetoPor": "total",          // total | pessoa — diga qual você assumiu
    "cambioReferencia": [{ "de": "JPY", "para": "BRL", "taxa": 0.038, "em": "2026-09-11" }],
    "categorias": [
      {
        "id": "voos", "nome": "Voos",
        "previsto": 11600,       // o plano dele
        "economico": 9200,       // a mesma viagem, com a troca que dói menos
        "real": null,            // preenchido durante a viagem
        "observacao": "Ida e volta para 2 pessoas. Econômico = conexão longa em DOH.",
        // Gastos que são a razão de ser da viagem não entram na tesoura.
        "intocavel": false
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
