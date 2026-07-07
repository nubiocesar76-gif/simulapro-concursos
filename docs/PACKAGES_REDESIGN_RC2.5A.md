# RC2.5A — Redesign do Módulo Pacotes

**Base:** `ADMIN_PRODUCT_ROADMAP_RC2.md` (Fase 5), `ADMIN_UX_AUDIT_RC2.1A.md`, `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_SYSTEM.md`.
**Escopo:** `PackagesPage.tsx` completo. CRUD, validações, queries, banco e permissões não tocados.

---

**Achado 01 — Diálogo de criação/edição sem `<form onSubmit>`; Enter não submete** (`UXB-M4`)
Campos ficam soltos num `<div>`; o botão "Salvar"/"Criar" dispara `save.mutate()` via `onClick`.
**Impacto:** único módulo revisado até aqui sem esse comportamento — quebra a expectativa já criada por Cursos, Bancas, Concursos, Disciplinas, Assuntos, Cargos e Questões.
**Decisão:** envolver os campos em `<form onSubmit>`, botão de salvar como `type="submit"`.

**Achado 02 — Ícones de ação sem `aria-label`, em `h-3.5 w-3.5` (14px)** (`UXB-M1`)
**Impacto:** mesma classe de gap já registrada para outros módulos, e mesmo desvio de tamanho de ícone já encontrado em Importação.
**Decisão:** adicionar `aria-label` (`Editar {nome}`/`Excluir {nome}`), ícones em `h-4 w-4` (16px).

**Achado 03 — Botão "Cancelar" do diálogo usa `variant="secondary"`**
Todo o restante do produto (Cursos, Bancas, Concursos, Disciplinas, Assuntos, Cargos, Questões) usa `variant="outline"` para a mesma ação.
**Impacto:** `DESIGN_SYSTEM.md` §7 atribui papéis semânticos distintos a `outline` (ação secundária) e `secondary` (preenchimento neutro) — usar `secondary` aqui dá ao "Cancelar" um peso visual maior que o mesmo botão em qualquer outro diálogo do produto.
**Decisão:** `outline`.

**Achado 04 — Cabeçalho usa `sm:items-start` entre título e botão de ação**
**Impacto:** mesma divergência de `UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 28 já encontrada em toda a família Taxonomia.
**Decisão:** `items-center`.

**Achado 05 — Tabela sem `overflow-x-auto`**
6 colunas (Nome, Curso, Slug, Status, Criado em, Ações).
**Impacto:** consistência da regra (`DESIGN_SYSTEM.md` §7).
**Decisão:** envolver em `overflow-x-auto`.

**Achado 06 — Demais itens do escopo já estão no padrão**
`AdminTableBody` com distinção "sem cadastro" vs. "sem resultado" já correta, radius `rounded-lg`, filtros (Curso/Status) já bem posicionados junto da busca, slug em `font-mono text-xs`.
**Impacto:** nenhum.
**Decisão:** nenhuma mudança nesses pontos.

---

## Execução do Design Review

Checklist aplicado antes do fechamento. Nenhuma decisão altera CRUD, validação, query ou permissão — o achado 01 muda apenas o mecanismo de submissão (form vs. onClick), não o que é validado ou salvo. Nenhuma revisão foi necessária.

---

## Aprovação

**Módulo Pacotes aprovado para implementação.**
