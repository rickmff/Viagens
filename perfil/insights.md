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

_Nenhuma sessão registrada ainda._
