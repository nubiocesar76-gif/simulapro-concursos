# RC1.2L — Revisão de Consistência (Portal do Aluno)

**Escopo:** `DASHBOARD_REDESIGN_RC1.2H.md`, `STUDY_EXPERIENCE_REDESIGN_RC1.2I.md`, `SESSION_RESULTS_REDESIGN_RC1.2J.md`, `STUDY_HISTORY_REDESIGN_RC1.2K.md`. Apenas consistência entre os quatro. Nenhuma funcionalidade, regra de negócio, banco ou arquitetura alterada.

---

**Achado 01 — Estados de erro do fluxo de estudo não usam `EmptyState`/`PageErrorState`**
"Sessão não encontrada" e "Sessão sem questões" (`StudySessionPage.tsx`) usam `h1`+`p` soltos, não os componentes compartilhados já mandatados pelo Design System. Não foi pego em RC1.2I por estar fora do fluxo "active" analisado ali.
**Impacto:** mesmo conceito de "nada aqui" com dois acabamentos diferentes dentro do próprio Portal do Aluno.
**Decisão:** incluir no escopo de implementação de RC1.2I a troca desses dois estados para `EmptyState`/`PageErrorState`.

**Achado 02 — "Nenhuma questão neste filtro" (Resultado) também não usa `EmptyState`**
Mesmo padrão do Achado 01, agora em `SessionResultsView.tsx`.
**Impacto:** mesma inconsistência, segunda ocorrência na mesma jornada.
**Decisão:** incluir no escopo de implementação de RC1.2J.

**Achado 03 — Resultado da sessão ainda usa `max-w-4xl`, mas a regra já ratificada é "sem `max-w`"**
`DESIGN_SYSTEM.md` §4.2 define só duas larguras: `max-w-2xl` (foco/leitura) ou nenhuma (`dados/painel`). RC1.2J não corrigiu explicitamente a largura herdada do código atual.
**Impacto:** a única tela das quatro que ainda usa uma terceira largura, contrariando a própria régua já fechada em RC1.2G.
**Decisão:** remover `max-w-4xl` de `SessionResultsView`; tela segue a categoria "dados/painel" (largura total), igual a Dashboard e Histórico.

**Achado 04 — "Nova sessão" tem comportamento diferente conforme a tela de origem**
Em Resultado (RC1.2J), "Nova sessão" é um link para o configurador (`/app/study`). No Histórico (RC1.2K), o mesmo rótulo, no menu da linha, cria a sessão direto com configuração padrão, sem passar pelo configurador — comportamento já existente no código, não introduzido por nenhum dos dois documentos, mas nunca reconciliado entre eles.
**Impacto:** mesmo texto, duas promessas diferentes — risco de expectativa quebrada dependendo de onde o aluno clica.
**Decisão:** "Nova sessão" passa a significar sempre "abrir o configurador". A criação direta do Histórico é da mesma família de "Refazer apenas erradas" (atalho de repetição, não de nova configuração) e deve ser rotulada de forma distinta — texto exato a definir na sprint de implementação, não neste documento.

**Achado 05 — Três tratamentos diferentes para o mesmo padrão de "grade de estatísticas"**
Dashboard (RC1.2H): grid pleno, todos clicáveis. Resultado (RC1.2J): um número em destaque (Aproveitamento) + apoio. Histórico (RC1.2K): faixa compacta de uma linha. Os três partem do mesmo componente visual (`DashboardStats`/`HistorySummaryStats`/resumo inline do Resultado).
**Impacto:** divergência real, mas hoje só existe implicitamente espalhada em três documentos — sem uma regra explícita, parece inconsistência não intencional.
**Decisão:** registrar a regra: peso pleno quando a tela é sobre "meu progresso" (Dashboard); destaque de um número quando há uma decisão emocional única (Resultado); faixa compacta quando a tela é sobre localizar um registro (Histórico). Se os três componentes forem futuramente unificados tecnicamente, as três variantes devem ser preservadas, não fundidas visualmente.

**Achado 06 — Rótulo de "tempo total" varia entre telas**
"Tempo total de estudo" (Dashboard) · "Tempo total" (Resultado) · "Tempo total estudado" (Histórico) — mesmo conceito, três textos.
**Impacto:** pequena fricção de reconhecimento ao mesmo conceito em telas diferentes.
**Decisão:** padronizar para "Tempo total de estudo" nas três.

**Achado 07 — "Sessões concluídas" (Dashboard) e "Total de sessões" (Histórico) soam como a mesma métrica e podem não ser**
Dashboard conta sessões concluídas; Histórico, pelo nome, sugere contar todas (inclui `IN_PROGRESS`, que aparece na própria tabela do Histórico).
**Impacto:** se forem métricas diferentes, dois números "parecidos" no mesmo produto sem diferenciação de rótulo geram desconfiança nos dados.
**Decisão:** confirmar com a definição atual do dado; se divergentes, o rótulo do Histórico deve deixar isso explícito (ex.: indicar que inclui sessões em andamento). Nenhuma mudança de cálculo — só de texto.

**Achado 08 — "Voltar ao Dashboard" tem pesos visuais diferentes em Resultado e Histórico**
Rebaixado a link discreto em Resultado (RC1.2J); mantido botão `outline` no Histórico (RC1.2K).
**Impacto:** divergência real, mas com racional válido (Resultado é um momento de fechamento emocional, onde não se quer liderar com "sair"; Histórico é uma tela neutra de consulta). Sem registro, pode ser "corrigida" para uniformidade por engano.
**Decisão:** manter os dois tratamentos como estão; registrar aqui que a diferença é intencional, não pendência.

---

## Resumo

| Achado | Tipo | Bloqueia implementação? |
|---|---|---|
| 01, 02 | Componente compartilhado não usado | Não — ajuste pequeno, incluir no escopo já aprovado de RC1.2I/RC1.2J |
| 03 | Regra já ratificada não aplicada | Não — ajuste pequeno em RC1.2J |
| 04 | Comportamento divergente sob o mesmo rótulo | Não — decisão de nomenclatura a fechar na sprint de implementação |
| 05, 06, 07, 08 | Regra implícita não documentada / terminologia | Não — documentação, sem impacto em código |

Nenhum achado exige novo ciclo de aprovação de Product Design — todos são ajustes incorporáveis durante a implementação dos quatro documentos já aprovados.
