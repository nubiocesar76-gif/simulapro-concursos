# RC2.4E — Redesign do Módulo Cargos

**Base:** `TAXONOMY_MODULE_PLAN_RC2.4.md`, `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_SYSTEM.md`.
**Escopo:** `PositionsPage.tsx` completo. CRUD, validações, queries, banco e permissões não tocados.

---

**Achado 01 — Não usa `AdminTableBody`; loading/erro/vazio tratados manualmente, sem `role="alert"`/`role="status"`** (`UXB-A4`)
**Impacto:** sem aviso automático a leitor de tela em erro/vazio; sem `Skeleton`.
**Decisão:** migrar para `AdminTableBody`, preservando a distinção "sem cadastro" vs. "sem resultado de busca" já implementada.

**Achado 02 — Tabela sem `overflow-x-auto`**
5 colunas (Nome, Curso, Descrição, Criado em, Ações).
**Impacto:** consistência da regra (`DESIGN_SYSTEM.md` §7).
**Decisão:** envolver em `overflow-x-auto`.

**Achado 03 — Cabeçalho usa `sm:items-start` entre título e botão de ação**
**Impacto:** mesma divergência de `UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 28.
**Decisão:** `items-center`.

**Achado 04 — Demais itens do escopo já estão no padrão**
`aria-label`, `<form onSubmit>`, radius `rounded-lg`, ícones `h-4 w-4`, coluna "Descrição" já com truncamento de uma linha (`max-w-md truncate`, conforme `RC2.0` Decisão 30), botão de exclusão padrão `destructive`.
**Impacto:** nenhum.
**Decisão:** nenhuma mudança nesses pontos.

---

## Execução do Design Review

Checklist aplicado antes do fechamento. Nenhuma decisão altera CRUD, validação, query ou permissão. Nenhuma revisão foi necessária.

---

## Aprovação

**Módulo Cargos aprovado para implementação.**
