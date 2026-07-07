# RC2.4B — Redesign do Módulo Concursos

**Base:** `TAXONOMY_MODULE_PLAN_RC2.4.md`, `BOARDS_REDESIGN_RC2.4A.md` (par direto — mesma dependência de dado), `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_SYSTEM.md`.
**Escopo:** `ExamsPage.tsx` completo. CRUD, validações, queries, banco e permissões não tocados.

---

**Achado 01 — Não usa `AdminTableBody`; loading/erro/vazio tratados manualmente, sem `role="alert"`/`role="status"`** (`UXB-A4`)
Mensagem de vazio já diferencia "sem cadastro" de "sem resultado de busca" — só falta a semântica de acessibilidade e o `Skeleton`.
**Impacto:** leitor de tela não é avisado automaticamente em erro/vazio; sem `Skeleton`, diferente de Bancas.
**Decisão:** migrar para `AdminTableBody`, preservando a mesma distinção de mensagem já implementada (`debouncedSearch ? "Nenhum concurso encontrado." : "Nenhum concurso cadastrado."`).

**Achado 02 — Tabela sem `overflow-x-auto`**
5 colunas (Nome, Banca, Ano, Criado em, Ações).
**Impacto:** consistência da regra (`DESIGN_SYSTEM.md` §7), risco real baixo nesta contagem de colunas.
**Decisão:** envolver em `overflow-x-auto`.

**Achado 03 — Cabeçalho usa `sm:items-start` entre título e botão de ação**
**Impacto:** mesma divergência de `UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 28 já encontrada em Questões e Bancas.
**Decisão:** `items-center`.

**Achado 04 — Coluna "Ano" (numérica) sem `tabular-nums`**
**Impacto:** mesma inconsistência já registrada em Questões (`RC2.3A` achado 09), frente à regra de `RC2.0` Decisão 02.
**Decisão:** aplicar `tabular-nums`.

**Achado 05 — Demais itens do escopo já estão no padrão**
Ícones em `h-4 w-4`, `aria-label` nos dois botões de ação, diálogo com `<form onSubmit>`, radius já `rounded-lg`, botão de exclusão com o mesmo padrão `destructive` do resto do Admin.
**Impacto:** nenhum.
**Decisão:** nenhuma mudança nesses pontos.

---

## Execução do Design Review

Checklist aplicado antes do fechamento. Um ponto foi considerado e descartado: adicionar um filtro de Curso em cascata sobre Banca (espelhando o padrão Cargo↔Curso) — violaria "não cria filtros novos"; a tela permanece só com a busca por nome já existente. Nenhuma decisão registrada violou o checklist. Nenhuma revisão foi necessária.

---

## Aprovação

**Módulo Concursos aprovado para implementação.**
