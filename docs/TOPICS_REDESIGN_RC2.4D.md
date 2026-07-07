# RC2.4D — Redesign do Módulo Assuntos

**Base:** `TAXONOMY_MODULE_PLAN_RC2.4.md`, `ADMIN_UX_AUDIT_RC2.1A.md`, `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_SYSTEM.md`.
**Escopo:** `TopicsPage.tsx` completo. CRUD, validações, queries, banco e permissões não tocados.

---

**Achado 01 — Não usa `AdminTableBody`; loading/erro/vazio tratados manualmente, sem `role="alert"`/`role="status"`** (`UXB-A4`)
**Impacto:** sem aviso automático a leitor de tela em erro/vazio; sem `Skeleton`.
**Decisão:** migrar para `AdminTableBody`, preservando a distinção "sem cadastro" vs. "sem resultado de busca" já implementada.

**Achado 02 — Tabela sem `overflow-x-auto`**
4 colunas (Nome, Disciplina, Criado em, Ações).
**Impacto:** consistência da regra (`DESIGN_SYSTEM.md` §7).
**Decisão:** envolver em `overflow-x-auto`.

**Achado 03 — Cabeçalho usa `sm:items-start` entre título e botão de ação**
**Impacto:** mesma divergência de `UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 28.
**Decisão:** `items-center`.

**Achado 04 — Demais itens do escopo já estão no padrão**
`aria-label`, `<form onSubmit>`, radius `rounded-lg`, ícones `h-4 w-4`, botão de exclusão padrão `destructive`.
**Impacto:** nenhum.
**Decisão:** nenhuma mudança nesses pontos.

**Achado 05 — Listagem não permite filtrar por disciplina (só o formulário de criação/edição tem esse campo)** (já citado em `ADMIN_UX_AUDIT_RC2.1A.md`)
**Impacto:** em curso com muitas disciplinas, localizar assuntos de uma disciplina específica exige rolar a lista inteira.
**Decisão:** fora de escopo aqui — adicionar filtro na listagem seria "filtro novo", não autorizado nesta fase. Mantido como pendência já registrada, sem ação neste documento.

---

## Execução do Design Review

Checklist aplicado antes do fechamento. O achado 05 já nasceu registrado como pendência, sem decisão a reverter. Nenhuma das demais decisões altera CRUD, validação, query ou permissão. Nenhuma revisão foi necessária.

---

## Aprovação

**Módulo Assuntos aprovado para implementação**, com o achado 05 registrado como pendência fora desta fase.
