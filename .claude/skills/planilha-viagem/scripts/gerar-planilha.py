#!/usr/bin/env python3
"""
Gera destinos/<slug>/orcamento-<slug>.xlsx a partir do trip.json.

    python3 .claude/skills/planilha-viagem/scripts/gerar-planilha.py <slug> [--sem-recalc]

Abas: Resumo · Parâmetros · Itens · Roteiro · Reservas · Real · Cortes.
Tudo que é derivado é fórmula. Depois de gerar, o script roda o recalc
(LibreOffice) e falha se qualquer fórmula der erro — planilha com #REF! não é
entregue.
"""
import json
import subprocess
import sys
from pathlib import Path

from openpyxl import Workbook

sys.path.insert(0, str(Path(__file__).parent))
from planilha_lib import ler_trip, montar_viagem  # noqa: E402

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        print("uso: gerar-planilha.py <slug> [--sem-recalc]", file=sys.stderr)
        sys.exit(1)
    slug = args[0]
    v = ler_trip(RAIZ, slug)
    wb = Workbook()
    wb.remove(wb.active)
    abas, itens, cats, _ = montar_viagem(wb, v)
    wb.active = 0
    saida = RAIZ / "destinos" / slug / f"orcamento-{slug}.xlsx"
    wb.save(saida)
    print(f"planilha escrita em {saida} ({len(itens)} itens, {len(cats)} categorias)")

    if "--sem-recalc" in sys.argv:
        return
    r = subprocess.run([sys.executable, str(AQUI / "recalc.py"), str(saida), "60"], capture_output=True, text=True)
    try:
        j = json.loads(r.stdout[r.stdout.index('{'):])
    except Exception:
        print(r.stdout, r.stderr, file=sys.stderr)
        sys.exit("recalc não respondeu em JSON")
    print(f"recalc: {j.get('status')} · {j.get('total_formulas')} fórmulas · {j.get('total_errors')} erros")
    if j.get("status") != "success":
        print(json.dumps(j.get("error_summary"), ensure_ascii=False, indent=1), file=sys.stderr)
        sys.exit("FALHOU: a planilha tem fórmulas com erro")


if __name__ == "__main__":
    main()
