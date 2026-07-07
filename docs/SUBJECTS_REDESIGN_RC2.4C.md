# RC2.4C — Redesign do Módulo Disciplinas

**Base:** `TAXONOMY_MODULE_PLAN_RC2.4.md`, `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_SYSTEM.md`.
**Escopo:** `SubjectsPage.tsx` completo. CRUD, validações, queries, banco e permissões não tocados.

---

**Achado 01 — Não usa `AdminTableBody`; loading/erro/vazio tratados manualmente, sem `role="alert"`/`role="status"`** (`UXB-A4`)
Mensagem de vazio já diferencia "sem cadastro" de "sem resultado de busca".
**Impacto:** sem aviso automático a leitor de tela em erro/vazio; sem `Skeleton`.
**Decisão:** migrar para `AdminTableBody`, preservando a distinção de mensagem já implementada.

**Achado 02 — Tabela sem `overflow-x-auto`**
Apenas 3 colunas (Nome, Criado em, Ações), risco real baixo.
**Impacto:** consistência da regra (`DESIGN_SYSTEM.md` §7), sem exceção por contagem de coluna.
**Decisão:** envolver em `overflow-x-auto`.

**Achado 03 — Cabeçalho usa `sm:items-start` entre título e botão de ação**
**Impacto:** mesma divergência de `UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 28 já encontrada nos demais módulos da família.
**Decisão:** `items-center`.

**Achado 04 — Demais itens do escopo já estão no padrão**
`aria-label` nos dois botões de ação, diálogo com `<form onSubmit>`, radius já `rounded-lg`, ícones em `h-4 w-4`, botão de exclusão com o padrão `destructive` já consistente.
**Impacto:** nenhum.
**Decisão:** nenhuma mudança nesses pontos.

---

## Execução do Design Review

Checklist aplicado antes do fechamento. Nenhuma decisão altera CRUD, validação, query ou permissão. Nenhuma revisão foi necessária.

---

## Aprovação

**Módulo Disciplinas aprovado para implementação.**
