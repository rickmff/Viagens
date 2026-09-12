#!/usr/bin/env python3
"""
Compara o orçamento de duas ou mais viagens lado a lado, com fórmulas vivas.

    python3 .claude/skills/planilha-viagem/scripts/comparar-viagens.py <nome> <slug1> <slug2> [...]

Escreve comparacoes/<nome>.xlsx. Cada viagem entra com as próprias abas de
Parâmetros e Itens (nomeadas P_<slug> e I_<slug>), e a aba Comparação lê
delas — mudar um preço numa viagem refaz a comparação. Serve tanto para o
mesmo destino em épocas diferentes quanto para dois destinos disputando a
mesma janela.
"""
import json
import subprocess
import sys
from pathlib import Path

from openpyxl import Workbook
from openpyxl.chart import BarChart, Reference
from openpyxl.styles import Font

sys.path.insert(0, str(Path(__file__).parent))
from planilha_lib import (  # noqa: E402
    CINZA, COL, FMT_EUR, FMT_EUR0, FMT_PCT, FONTE, SUBTOTAL, VERDE, Abas, CATEGORIAS_PADRAO,
    cabecalho, curto, formula, itens_com_restante, ler_trip, montar_viagem, q, rotulo, titulo,
)

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) < 3:
        print("uso: comparar-viagens.py <nome> <slug1> <slug2> [...]", file=sys.stderr)
        sys.exit(1)
    nome, slugs = args[0], args[1:]
    wb = Workbook()
    ws_cmp = wb.active
    ws_cmp.title = "Comparação"

    viagens = []
    for s in slugs:
        v = ler_trip(RAIZ, s)
        c = curto(s)
        abas = Abas(params=f"P_{c}", itens=f"I_{c}", real=f"R_{c}", resumo=f"S_{c}")
        abas, itens, cats, linhas = montar_viagem(wb, v, abas, com_extras=False)
        viagens.append(dict(slug=s, v=v, abas=abas, cats=cats, linhas=linhas))

    # ── aba Comparação ──
    titulo(ws_cmp, f"Comparação: {nome}", "Colunas = viagens. Tudo lê das abas P_/I_/S_ de cada viagem; mude um preço ou uma opção lá e a comparação refaz.")
    ws_cmp.column_dimensions["A"].width = 34
    n = len(viagens)
    for i in range(n):
        ws_cmp.column_dimensions[chr(66 + i)].width = 24
    ws_cmp.column_dimensions[chr(66 + n)].width = 26

    r = 4
    cabecalho(ws_cmp, r, ["Viagem"] + [x["v"].get("titulo", x["slug"]) for x in viagens] + ["Δ última − primeira"])
    r += 1

    def linha(rot, fs, fmt=FMT_EUR, negrito=False, delta=True, fill=None):
        nonlocal r
        rotulo(ws_cmp.cell(row=r, column=1), rot, negrito=negrito)
        for i, f in enumerate(fs):
            formula(ws_cmp.cell(row=r, column=2 + i), f, fmt, VERDE, negrito)
        if delta and n >= 2:
            a, b = chr(66), chr(66 + n - 1)
            formula(ws_cmp.cell(row=r, column=2 + n), f"={b}{r}-{a}{r}", fmt, negrito=negrito)
        if fill:
            for col in range(1, 3 + n):
                ws_cmp.cell(row=r, column=col).fill = fill
        r += 1
        return r - 1

    P = [x["abas"].P for x in viagens]
    S = [q(x["abas"].resumo) for x in viagens]
    linha("Início", [f"={p}!B4" for p in P], "DD/MM/YYYY", delta=False)
    linha("Fim", [f"={p}!B5" for p in P], "DD/MM/YYYY", delta=False)
    linha("Noites", [f"={p}!B6" for p in P], "0")
    linha("Dias", [f"={p}!B7" for p in P], "0")
    linha("Pessoas", [f"={p}!B8" for p in P], "0")
    r += 1

    rotulo(ws_cmp.cell(row=r, column=1), "Escolhido ★, por categoria (opção marcada em cada item)", negrito=True)
    r += 1
    cat_ids = []
    for x in viagens:
        for c in x["cats"]:
            if c["id"] not in cat_ids:
                cat_ids.append(c["id"])
    ordem = [c for c, _ in CATEGORIAS_PADRAO]
    cat_ids.sort(key=lambda c: ordem.index(c) if c in ordem else 99)
    nomes = dict(CATEGORIAS_PADRAO)
    r_cat0 = r
    for cid in cat_ids:
        linha(nomes.get(cid, cid), [f'=SUMIFS({x["abas"].I}!${COL["t_esc"]}:${COL["t_esc"]},{x["abas"].I}!$B:$B,"{cid}")' for x in viagens])
    r_cat1 = r - 1
    tot = linha("Total escolhido", [f"=SUM({chr(66 + i)}{r_cat0}:{chr(66 + i)}{r_cat1})" for i in range(n)], negrito=True, fill=SUBTOTAL)
    linha("Reserva para imprevistos", [f"={chr(66 + i)}{tot}*{P[i]}!$B$13" for i in range(n)])
    totr = linha("Total com reserva", [f"={chr(66 + i)}{tot}+{chr(66 + i)}{tot + 1}" for i in range(n)], negrito=True, fill=SUBTOTAL)
    linha("Tudo econômico (com reserva)", [f"={s}!B{x['linhas']['total_reserva']}" for s, x in zip(S, viagens)])
    linha("Plano (com reserva)", [f"={s}!C{x['linhas']['total_reserva']}" for s, x in zip(S, viagens)])
    linha("Tudo upgrade (com reserva)", [f"={s}!E{x['linhas']['total_reserva']}" for s, x in zip(S, viagens)])
    r += 1
    rotulo(ws_cmp.cell(row=r, column=1), "Para comparar viagens de tamanhos diferentes", negrito=True)
    r += 1
    linha("Por pessoa", [f"={chr(66 + i)}{tot}/{P[i]}!$B$8" for i in range(n)])
    linha("Por dia (grupo)", [f"={chr(66 + i)}{tot}/{P[i]}!$B$7" for i in range(n)])
    linha("Por pessoa por dia", [f"={chr(66 + i)}{tot}/{P[i]}!$B$8/{P[i]}!$B$7" for i in range(n)], negrito=True)
    linha("Por noite de hospedagem", [f'=IF({P[i]}!$B$6=0,0,SUMIFS({viagens[i]["abas"].I}!${COL["t_esc"]}:${COL["t_esc"]},{viagens[i]["abas"].I}!$B:$B,"hospedagem")/{P[i]}!$B$6)' for i in range(n)])
    linha("Voos como % do total", [f"=IF({chr(66 + i)}{tot}=0,0,{chr(66 + i)}{r_cat0 + cat_ids.index('voos') if 'voos' in cat_ids else r_cat0}/{chr(66 + i)}{tot})" for i in range(n)], FMT_PCT)
    r += 1
    linha("Teto do grupo", [f"={p}!$B$12" for p in P], FMT_EUR0, negrito=True)
    teto = r - 1
    linha("Folga contra o teto", [f"={chr(66 + i)}{teto}-{chr(66 + i)}{totr}" for i in range(n)], negrito=True)
    folga = r - 1
    rotulo(ws_cmp.cell(row=r, column=1), "Veredito", negrito=True)
    for i in range(n):
        col = chr(66 + i)
        formula(ws_cmp.cell(row=r, column=2 + i),
                f'=IF({col}{folga}>=0,"cabe, sobram "&TEXT({col}{folga},"#,##0")&" €","faltam "&TEXT(-{col}{folga},"#,##0")&" €")',
                None, negrito=True)
    r += 2
    rotulo(ws_cmp.cell(row=r, column=1), "Mais barata no total:", negrito=True)
    formula(ws_cmp.cell(row=r, column=2), f"=INDEX($B$4:${chr(66 + n - 1)}$4,MATCH(MIN($B${totr}:${chr(66 + n - 1)}${totr}),$B${totr}:${chr(66 + n - 1)}${totr},0))", None, negrito=True)
    r += 1
    rotulo(ws_cmp.cell(row=r, column=1), "Mais barata por pessoa por dia:", negrito=True)
    ppd = totr + 6
    formula(ws_cmp.cell(row=r, column=2), f"=INDEX($B$4:${chr(66 + n - 1)}$4,MATCH(MIN($B${ppd}:${chr(66 + n - 1)}${ppd}),$B${ppd}:${chr(66 + n - 1)}${ppd},0))", None, negrito=True)
    r += 2
    for tx in [
        "Por pessoa por dia é a linha justa quando as viagens têm durações diferentes: uma viagem curta e cara pode custar menos no total e mais por dia.",
        "Δ compara a última coluna com a primeira. Com três ou mais viagens, leia as colunas lado a lado.",
        "Para testar uma hipótese (outro hotel, upgrade num ingresso), troque a coluna Opção ▼ na aba I_ da viagem: a linha Escolhido refaz.",
    ]:
        rotulo(ws_cmp.cell(row=r, column=1), tx, cor=CINZA)
        r += 1

    ch = BarChart()
    ch.type = "col"
    ch.grouping = "stacked"
    ch.overlap = 100
    ch.title = "Escolhido por categoria"
    ch.y_axis.numFmt = "#,##0"
    dados = Reference(ws_cmp, min_col=2, min_row=4, max_col=1 + n, max_row=r_cat1)
    ch.add_data(dados, titles_from_data=True)
    ch.set_categories(Reference(ws_cmp, min_col=1, min_row=r_cat0, max_row=r_cat1))
    ch.height, ch.width = 9, 18
    ws_cmp.add_chart(ch, f"{chr(68 + n)}4")
    ws_cmp.freeze_panes = "B5"

    for ws in wb.worksheets:
        for row in ws.iter_rows():
            for c in row:
                if c.value is not None and c.font.name != FONTE:
                    c.font = Font(name=FONTE, bold=c.font.bold, italic=c.font.italic, color=c.font.color, size=c.font.size)

    saida = RAIZ / "comparacoes" / f"{nome}.xlsx"
    saida.parent.mkdir(exist_ok=True)
    wb.save(saida)
    print(f"comparação escrita em {saida} ({n} viagens)")
    if "--sem-recalc" in sys.argv:
        return
    rr = subprocess.run([sys.executable, str(AQUI / "recalc.py"), str(saida), "90"], capture_output=True, text=True)
    try:
        j = json.loads(rr.stdout[rr.stdout.index('{'):])
    except Exception:
        print(rr.stdout, rr.stderr, file=sys.stderr)
        sys.exit("recalc não respondeu em JSON")
    print(f"recalc: {j.get('status')} · {j.get('total_formulas')} fórmulas · {j.get('total_errors')} erros")
    if j.get("status") != "success":
        print(json.dumps(j.get("error_summary"), ensure_ascii=False, indent=1), file=sys.stderr)
        sys.exit("FALHOU: a comparação tem fórmulas com erro")


if __name__ == "__main__":
    main()
