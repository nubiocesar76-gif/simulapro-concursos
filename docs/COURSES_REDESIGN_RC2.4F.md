# RC2.4F — Redesign do Módulo Cursos

**Base:** `TAXONOMY_MODULE_PLAN_RC2.4.md` (Cursos identificado como o módulo que precisa do ajuste mais profundo da família), `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_SYSTEM.md`.
**Escopo:** `CoursesPage.tsx` completo. CRUD, validações, queries, banco e permissões não tocados — inclusive onde a decisão é apenas trocar qual implementação produz o mesmo resultado (achado 01).

---

**Achado 01 — Não usa os utilitários de `shared.tsx`; reimplementa busca com debounce, paginação, validação de nome/descrição, formatação de erro e verificação de dependência por conta própria**
Comparado linha a linha com `shared.tsx`: `validateCourse` (nome ≥2/≤200 caracteres, descrição ≤2000) é idêntico a `validateName`+`validateDescription`; `formatError` é idêntico a `formatTaxonomyError`; a paginação e a busca com debounce inline reproduzem exatamente `TaxonomyPagination`/`useDebouncedSearch`/`TaxonomySearch`.
**Impacto:** duplicação de código sem nenhuma diferença de comportamento — é o principal débito técnico da família (`TAXONOMY_MODULE_PLAN_RC2.4`), tornando Cursos o único módulo fora do padrão de implementação dos outros 5.
**Decisão:** adotar `useDebouncedSearch`, `TaxonomySearch`, `TaxonomyPagination`, `validateName`+`validateDescription`, `formatTaxonomyError`, `DeleteDep`/`hasDeleteDeps` no lugar da implementação própria — mesma validação, mesmo comportamento, já verificados como equivalentes acima.

**Achado 02 — Cabeçalho usa `sm:items-start` entre título e botão de ação**
**Impacto:** mesma divergência de `UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 28 já encontrada em toda a família.
**Decisão:** `items-center`.

**Achado 03 — Tabela sem `overflow-x-auto`**
4 colunas (Nome, Descrição, Criado em, Ações).
**Impacto:** consistência da regra (`DESIGN_SYSTEM.md` §7).
**Decisão:** envolver em `overflow-x-auto`.

**Achado 04 — Demais itens do escopo já estão no padrão**
`AdminTableBody` (já presente, com distinção "sem cadastro" vs. "sem resultado de busca"), `aria-label`, `<form onSubmit>`, radius `rounded-lg`, ícones `h-4 w-4`, coluna "Descrição" já truncada em uma linha, botão de exclusão padrão `destructive`.
**Impacto:** nenhum.
**Decisão:** nenhuma mudança nesses pontos.

---

## Execução do Design Review

Checklist aplicado antes do fechamento, com atenção especial ao achado 01 por tocar diretamente validação e formatação de erro (blocos "Regras de negócio" e "Design System" do checklist). Verificação campo a campo confirmou que `validateName`/`validateDescription`/`formatTaxonomyError` produzem exatamente os mesmos limites e mensagens que a implementação própria de Cursos — nenhuma regra de validação muda de comportamento. Nenhuma decisão violou o checklist. Nenhuma revisão foi necessária.

---

## Aprovação

**Módulo Cursos aprovado para implementação.**
