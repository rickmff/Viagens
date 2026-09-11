---
name: perfil-viajante
description: Lê e atualiza a memória de preferências de viagem em perfil/PERFIL.md e perfil/insights.md, para que cada novo pedido de roteiro exija menos prompt. Use SEMPRE no início de qualquer planejamento de viagem (antes de perguntar qualquer coisa ao usuário) e SEMPRE no fim (para registrar o que a sessão ensinou) — inclusive quando o usuário só mencionou um destino de passagem, deu feedback sobre um roteiro, reclamou de uma sugestão, aceitou ou recusou uma ideia, ou perguntou "o que você já sabe sobre como eu viajo". Também use quando pedirem para esquecer, corrigir ou revisar uma preferência.
---

# Perfil do viajante

Este repo tem uma aposta: planejar viagem é repetitivo, e a maior parte do
prompt que o usuário digita toda vez é informação que ele **já deu antes**.
Esta skill é a memória que quebra esse ciclo. Ela roda duas vezes por sessão —
uma antes de tudo, para não perguntar o que já se sabe, e uma no fim, para
saber mais da próxima vez.

Arquivos: `perfil/PERFIL.md` (memória curada) e `perfil/insights.md`
(log append-only de onde veio cada coisa).

## Modo leitura — antes de planejar

Leia `perfil/PERFIL.md` inteiro. Depois, antes de abrir a boca para perguntar
algo, faça o exercício explícito de responder do perfil:

- Qual o ritmo dele? Quantas atividades por dia?
- O que ele gosta e, principalmente, o que ele já disse que odeia?
- Qual a faixa de orçamento e onde ele aceita gastar mais?
- Que tipo de hospedagem e bairro?
- Viaja com quem?

O que o perfil responde com **(provável)** ou **(confirmado)**, você usa direto,
sem perguntar e sem pedir confirmação — pedir confirmação de algo já confirmado
gasta o mesmo tempo do usuário que perguntar do zero, e é exatamente o atrito
que este repo existe para eliminar.

O que está como **(hipótese)** você usa como default mas sinaliza no resultado:
"assumi X porque parece o seu padrão — me corrija se não for". Assim ele
corrige de graça, sem ter que responder um questionário antes.

**Limite-se a 3 perguntas por sessão**, e só sobre o que muda materialmente o
roteiro e o perfil não responde. Data e destino você provavelmente já tem;
orçamento, se não veio no prompt e o perfil não tem faixa, vale perguntar.
Preferência de travesseiro, não. Na dúvida entre perguntar e assumir, assuma e
marque a suposição — um roteiro entregue e corrigido vale mais que um
questionário respondido.

## Modo escrita — depois de planejar

Aqui está o trabalho de verdade, e ele é mais sutil do que "anotar o que
aconteceu". A diferença entre um perfil que fica útil e um que vira lixo é o
critério de entrada.

### O que merece entrar

Uma afirmação só entra no perfil se ela **mudaria uma decisão futura em outro
destino**. Esse é o teste. "Gostou do Museu do Prado" não entra — não ajuda a
planejar Bangkok. "Prioriza museus de arte e aceita gastar meio dia num só"
entra, porque muda o roteiro de qualquer cidade.

Traduza sempre o fato específico para o padrão generalizável:

| Ele disse / fez | Não anote isso | Anote isso |
|---|---|---|
| "corta esse dia, tá corrido demais" | "achou o dia 4 corrido" | Prefere no máximo ~3 blocos por dia (provável) |
| escolheu o hotel mais caro, mais central | "escolheu o Hotel X" | Paga mais por localização central e caminhável (provável) |
| "de novo museu não" | "não quis o museu" | Satura de museu depois de ~1 por viagem (hipótese) |
| "quero um dia livre no fim" | "pediu dia livre" | Sempre reserva o último dia sem nada marcado (hipótese) |

### Níveis de confiança e como promover

O nível não é decoração — é o que decide se você pergunta ou assume.

- Primeira vez que um sinal aparece, indireto: **(hipótese)**.
- Ele disse com todas as letras, ou o sinal se repetiu numa segunda viagem:
  **(provável)**.
- Repetiu em viagens diferentes, ou ele reafirmou depois de você ter aplicado:
  **(confirmado)**.

Ao promover, some as evidências na própria linha, porque o rastro é o que
permite duvidar depois:

```md
- Paga mais por bairro central e caminhável — (confirmado: Lisboa 2026, Tóquio 2026)
```

### Contradição derruba, não acumula

Se ele contradisser algo que está no perfil, a entrada antiga **sai** e a nova
entra já como (provável) — a fala mais recente ganha. Não deixe as duas
convivendo com um "às vezes prefere": isso destrói o valor do arquivo, porque
uma memória ambígua não responde nada e você volta a perguntar.

Registre a queda em `perfil/insights.md` com o motivo. Se o padrão antigo
reaparecer depois, o log permite reconstruí-lo como "depende de X", que aí sim
é um insight real e não indecisão.

### Poda

O `PERFIL.md` precisa caber na cabeça — mire em algo que se lê em dois minutos.
Quando uma seção passar de ~10 linhas, consolide: três hipóteses parecidas
viram uma afirmação melhor. Hipótese que nunca se confirmou depois de três
viagens sai. Um perfil longo é um perfil que ninguém lê, e um perfil que
ninguém lê não economiza prompt nenhum.

## Registro no insights.md

Adicione a entrada **no topo** do log (mais recente primeiro), no formato que o
próprio arquivo documenta. A seção "Perguntas que não precisei fazer" não é
enfeite: é o placar desta skill. Se ela está vazia sessão após sessão, o perfil
não está sendo usado na leitura e alguma coisa está errada no fluxo.

## Quando ele pedir para esquecer ou corrigir

Apague de verdade a linha do `PERFIL.md` e registre a remoção no log. Não
mantenha a preferência antiga escondida "por precaução" — ele pediu para
esquecer, e um perfil que não obedece é um perfil em que ele para de confiar.

## Uso avulso

Se ele perguntar "o que você já sabe sobre mim?", responda com um resumo em
prosa do perfil, separando o que é confirmado do que ainda é chute, e diga o
que você mais gostaria de descobrir na próxima viagem. Isso convida a
correção — que é a forma mais barata de o perfil melhorar.
