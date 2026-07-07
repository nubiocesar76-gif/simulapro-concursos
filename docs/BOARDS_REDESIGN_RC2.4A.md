# RC2.4A — Redesign do Módulo Bancas

**Base:** `TAXONOMY_MODULE_PLAN_RC2.4.md` (referência arquitetural da família), `ADMIN_UX_AUDIT_RC2.1A.md`, `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_SYSTEM.md`.
**Escopo:** `BoardsPage.tsx` completo. CRUD, validações, queries, banco e permissões não tocados.

---

**Achado 01 — Cabeçalho usa `sm:items-start` entre título e botão de ação**
**Impacto:** contraria `UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 28 (mesma divergência já encontrada em Questões, `RC2.3A`).
**Decisão:** trocar para `items-center`.

**Achado 02 — Tabela sem `overflow-x-auto`**
Apenas 4 colunas (Nome, Sigla, Criado em, Ações) — risco de quebra em mobile é baixo, mas a regra do produto é sem exceção (`DESIGN_SYSTEM.md` §7).
**Impacto:** consistência da regra, não risco real imediato.
**Decisão:** envolver em `overflow-x-auto` mesmo assim, para não abrir uma exceção "porque a tabela é pequena".

**Achado 03 — Demais itens do escopo já estão no padrão**
`AdminTableBody` (com distinção "sem cadastro" vs. "filtro sem resultado" e `role` de acessibilidade), `aria-label` nos dois botões de ícone, diálogo com `<form onSubmit>`, radius já em `rounded-lg`, ícones em `h-4 w-4` (16px), botão de exclusão com o mesmo padrão `destructive` do resto do Admin.
**Impacto:** nenhum — é a confirmação de que Bancas já é a referência real da família (`RC2.4`).
**Decisão:** nenhuma mudança nesses pontos.

**Achado 04 — `space-y-8` (macro-seção) não se aplica a esta tela**
A página é um único fluxo coeso (cabeçalho → busca → tabela → paginação), não múltiplos blocos conceitualmente distintos como em Importação.
**Impacto:** nenhum.
**Decisão:** manter `space-y-6` uniforme; não introduzir uma segunda escala de espaçamento onde não há mais de uma seção real.

---

## Execução do Design Review

Checklist aplicado antes do fechamento. Um ponto foi considerado e descartado sem virar achado: aplicar `tabular-nums` à coluna "Criado em" — a coluna é uma data formatada, não uma contagem/percentual, fora do escopo literal da Decisão 02 de `UI_PREMIUM_GUIDELINES_RC2.0.md`; incluí-la seria estender a regra além do que ela cobre. Nenhuma decisão registrada violou o checklist. Nenhuma revisão foi necessária.

---

## Aprovação

**Módulo Bancas aprovado para implementação.**
