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

  // De onde a viagem parte e para onde os números convergem. Vem do perfil.
  // Nada no site ou nas skills assume país, moeda ou fuso fora daqui.
  "casa": { "pais": "PT", "cidade": "Porto", "iata": "OPO", "fuso": "Europe/Lisbon", "moeda": "EUR" },
  "moedaBase": "EUR",       // igual a casa.moeda; mantido por compatibilidade

  "viajantes": [
    { "id": "rick", "nome": "Rick" }
  ],

  // Alguns destinos cobram preços diferentes de residentes e visitantes
  // (França desde 2026, entre outros). Quando existir, o site ganha um botão
  // que alterna as duas colunas. `valor` é SEMPRE o que ele paga —
  // o preço de residente é o campo extra — para que esquecer o campo nunca
  // subestime o orçamento.
  // Residente em Portugal costuma ter direito à tarifa de residente da UE
  // (França, Itália em alguns museus): confira o que a nacionalidade e a
  // residência dão, e grave o que ele paga em `valor`.
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
      // orçamento e em cidade cara vira centenas de euros.
      "taxaTurismo": { "valor": 6, "moeda": "EUR", "por": "pessoa-noite" }
    }
  ],

  // ── Documentação ──────────────────────────────────────────────────────
  // Depende da nacionalidade (no perfil), não da residência. Dentro do
  // Schengen, residente em Portugal circula livre; fora, cada passaporte tem
  // a sua regra. `verificadoEm` importa: regra de visto muda, e o site mostra
  // a data para o leitor saber se confia.
  "documentacao": {
    "verificadoEm": "2026-09-11",
    "visto": {
      "necessario": false,
      "detalhe": "Isenção para turismo até 90 dias com o passaporte X.",
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
      // Grave a hora local do site E o equivalente no fuso de casa — se cair
      // de madrugada, é isso que o viajante precisa saber.
      "abreVendaEm": { "local": "2027-03-15T09:00", "fuso": "Europe/Rome", "emCasa": "2027-03-15T08:00" },
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
      "de": "LIS", "para": "HND",
      "partida": "2026-10-11T23:55", // hora local do aeroporto de origem
      "chegada": "2026-10-13T05:30", // hora local do aeroporto de destino
      "cia": "Japan Airlines",
      "voo": "JL 8060",
      "escalas": ["IST"],
      "duracaoTotalMin": 1655,
      "custo": { "valor": 950, "moeda": "EUR", "por": "pessoa" },
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
      "custo": { "valor": 420, "moeda": "EUR", "por": "total" },
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
      "custo": { "valor": 320, "moeda": "EUR", "por": "pessoa" },
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
          // `valor` é o que ele paga. `valorResidente` só existe onde há
          // tarifa dupla e ele não é residente; alimenta o botão do site.
          "custo": { "valor": 15, "moeda": "EUR", "por": "pessoa", "valorResidente": 10 },
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
    "teto": { "valor": 4000, "moeda": "EUR" },
    "tetoPor": "total",          // total | pessoa — diga qual você assumiu
    // Só existe fora da zona euro. Taxa do dia e data, para o orçamento
    // envelhecer de forma auditável.
    "cambioReferencia": [{ "de": "JPY", "para": "EUR", "taxa": 0.0059, "em": "2026-09-11" }],
    // O que o cartão dele cobra acima da taxa comercial fora do euro. Vem do
    // perfil (banco, Revolut, Wise…). Dentro do euro é 0 e o campo não importa.
    "margemCartao": 0.02,
    "categorias": [
      {
        "id": "voos", "nome": "Voos",
        "previsto": 1900,        // o plano dele
        "economico": 1500,       // a mesma viagem, com a troca que dói menos
        "real": null,            // preenchido durante a viagem
        "observacao": "Ida e volta para 2 pessoas. Econômico = conexão longa em DOH.",
        // Gastos que são a razão de ser da viagem não entram na tesoura.
        "intocavel": false
      }
    ],
    "reserva": { "valor": 350, "moeda": "EUR", "percentual": 8 }
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

**Dinheiro sempre com moeda.** Nunca `"custo": 15` — sempre
`{ "valor": 15, "moeda": "EUR", "por": "pessoa" }`. Planilha e site convertem
e somam sozinhos, mas só se souberem a moeda e se o valor é por pessoa ou total.

**Todo item comprável tem três opções e um link.** O `custo` de voo,
hospedagem, transporte e bloco aceita:

```jsonc
"custo": {
  "valor": 130, "moeda": "EUR", "por": "noite",
  "link": "https://...",                       // onde comprar o plano
  "opcao": "plano",                            // econômico | plano | upgrade — a escolhida
  "opcoes": {
    "economico": { "valor": 105, "descricao": "ibis budget no 12º", "link": "https://..." },
    "upgrade":   { "valor": 175, "descricao": "4★ no Marais",        "link": "https://..." }
  }
}
```

`link` também pode ficar no próprio voo, hospedagem, transporte ou bloco.
Sem `opcoes`, a planilha usa o fator da categoria
(`categorias[].economico / previsto`) como econômico e não oferece upgrade.
O econômico tem que ser uma alternativa real (outro hotel, outro aeroporto),
não "o mesmo mais barato".

**Hospedagem com `noites` quando as datas enganam.** `checkin`/`checkout`
contam noites; se uma noite do intervalo é noutro lugar (a noite da Disney no
meio de três em Paris), grave `"noites": 3` explicitamente.

**Bloco de deslocamento com custo só conta quando não há `transportes[]`.**
Se a viagem lista passes e bilhetes em `transportes`, o custo do bloco é
informativo e a planilha não o soma de novo.

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
