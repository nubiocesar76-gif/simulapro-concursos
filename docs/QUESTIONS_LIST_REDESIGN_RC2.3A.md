# RC2.3A — Redesign da Lista de Questões

**Base:** `QUESTIONS_MODULE_PLAN_RC2.3.md` (submódulos 1 e 6), `ADMIN_UX_AUDIT_RC2.1A.md`, `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_SYSTEM.md`.
**Escopo:** tabela, colunas, cabeçalho e paginação de `QuestionsPage.tsx`. Filtros, queries, permissões e regras de negócio não tocados — inclusive a lógica de distinção "sem cadastro" vs. "filtro sem resultado", que é preservada, não recriada.

---

**Achado 01 — Tabela sem `overflow-x-auto`** (`UXB-A5`)
**Impacto:** risco de quebra em tablet/mobile.
**Decisão:** envolver em `overflow-x-auto`, padrão já usado no restante do produto.

**Achado 02 — Hierarquia de colunas já adequada**
Enunciado como âncora (`font-medium`), Disciplina/Assunto/Banca agrupadas, Ano/Dificuldade/Criado em como metadado.
**Impacto:** nenhum.
**Decisão:** manter ordem e pesos atuais — nenhuma mudança.

**Achado 03 — Ícones de ação já têm `aria-label`**
**Impacto:** nenhum — já em conformidade, diferente de Pacotes/Versões.
**Decisão:** manter.

**Achado 04 — Botão "Nova questão" já bem posicionado**
Ação primária única da tela, canto superior direito.
**Impacto:** nenhum.
**Decisão:** manter.

**Achado 05 — Loading/erro/vazio tratados manualmente, sem `Skeleton` nem `role="alert"`/`role="status"`**
A distinção "sem cadastro" vs. "filtro sem resultado" já é boa — melhor que a maioria dos módulos do Admin — mas falta a semântica de acessibilidade que `AdminTableBody` já oferece.
**Impacto:** leitor de tela não é avisado automaticamente quando a tabela entra em erro ou fica vazia; ausência de `Skeleton` diverge do padrão do produto.
**Decisão:** migrar para `AdminTableBody`, preservando a lógica de distinção vazio/filtro já implementada (`hasActiveFilters`) — fecha `UXB-A4` para este módulo sem perder o diferencial que ele já tem.

**Achado 06 — Tabela tem 8 colunas, acima do limiar de 6 que já aciona priorização de coluna** (`UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 16)
**Impacto:** sem priorização, localizar uma questão em mobile exige rolar por 8 colunas.
**Decisão:** Enunciado, Disciplina e Ações como colunas sempre visíveis (mínimo para identificar e agir sobre uma questão); Assunto, Banca, Ano, Dificuldade e Criado em disponíveis por rolagem.

**Achado 07 — Cabeçalho usa `sm:items-start` entre título e botão de ação**
**Impacto:** contraria `UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 28 (título e ação devem usar `items-center`).
**Decisão:** trocar para `items-center`.

**Achado 08 — Truncamento do Enunciado já correto**
`max-w-md truncate` (uma linha), conforme a regra de truncamento do produto (`RC2.0` Decisão 30 — `line-clamp-2` é exclusivo do preview de enunciado em sessão de estudo, não de célula de tabela).
**Impacto:** nenhum.
**Decisão:** manter.

**Achado 09 — Coluna "Ano" (numérica) sem `tabular-nums`**
**Impacto:** pequena inconsistência frente à regra já definida para todo número de tabela (`RC2.0` Decisão 02).
**Decisão:** aplicar `tabular-nums`.

---

## Execução do Design Review

Checklist aplicado antes do fechamento. Nenhuma decisão violou os blocos de Arquitetura, Regras de negócio ou UX — todas preservam filtros, queries e permissões; `AdminTableBody` (achado 05) é componente já existente, não criado; nenhum preview ou ação em lote foi introduzido. Nenhuma revisão foi necessária.

---

## Aprovação

**Lista de Questões aprovada para implementação.**
