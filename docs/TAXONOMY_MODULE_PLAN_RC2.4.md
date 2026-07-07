# RC2.4 — Plano de Redesign da Família Taxonomia

**Base:** `ADMIN_PRODUCT_ROADMAP_RC2.md` (Fase 4), `ADMIN_UX_AUDIT_RC2.1A.md`, `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_REVIEW_CHECKLIST.md`.
**Módulos:** Cursos, Bancas, Disciplinas, Assuntos, Cargos, Concursos.
**Natureza:** planejamento. Sem solução detalhada, sem código. Verificado diretamente no código-fonte antes de escrever este plano.

---

## Componentes compartilhados

Todos os 6 módulos usam: `Table`/`TableHeader`/`TableRow`/`TableCell`, `Dialog` com `<form onSubmit>`, `AlertDialog` de exclusão com bloqueio por dependência, `Select`/`Input`/`Label`.

De `src/components/admin/taxonomy/shared.tsx`: `TAXONOMY_PAGE_SIZE`, `formatTaxonomyError`, `formatDate`, `validateName`, `validateDescription`, `slugFromTaxonomyName`, `useDebouncedSearch`, `TaxonomySearch`, `TaxonomyPagination`, `DeleteDep`/`hasDeleteDeps` — **usados por Bancas, Cargos, Concursos, Disciplinas e Assuntos**, mas **não por Cursos** (ver "Diferenças" abaixo).

`AdminTableBody` (`src/components/admin/shared/AdminTableBody.tsx`) — usado por **Cursos e Bancas**, não pelos outros 4.

---

## Componentes específicos

Nenhum componente exclusivo de um único módulo foi encontrado — os 6 usam exatamente o mesmo vocabulário de componentes. As diferenças entre eles são de **quais utilitários compartilhados cada um importa**, não de componentes próprios.

---

## Fluxos comuns

Idênticos nos 6 módulos: buscar (debounce 300ms) → listar com paginação (10/página) → criar/editar via diálogo com `<form>` → excluir com verificação de dependência (bloqueia exclusão se houver vínculo) → auditoria via `logEvent`.

---

## Diferenças entre módulos

| Módulo | Usa `AdminTableBody` | Usa utilitários de `shared.tsx` | Dependência de dado (FK) | Observação própria |
|---|---|---|---|---|
| Cursos | Sim | **Não** — reimplementa busca/paginação/validação/erro próprios | Nenhuma (raiz) | Único módulo com implementação paralela às demais 5; visualmente é a referência, mas não compartilha código com o resto da família |
| Bancas | Sim | Sim (completo) | Nenhuma (raiz) | **Único módulo com os dois padrões ao mesmo tempo — referência arquitetural real da família** |
| Cargos | Não | Sim | Curso | Lacuna já registrada como `UXB-A4` |
| Concursos | Não | Sim | Banca | Lacuna já registrada como `UXB-A4` |
| Disciplinas | Não | Sim | Nenhuma (raiz) | Lacuna já registrada como `UXB-A4` |
| Assuntos | Não | Sim | Disciplina | Lacuna já registrada como `UXB-A4`; listagem sem filtro por disciplina (achado já citado em `ADMIN_UX_AUDIT_RC2.1A.md`) |

**Achado de planejamento:** o padrão-referência da família não é Cursos (como assumido em `ADMIN_PRODUCT_ROADMAP_RC2.md`), e sim **Bancas** — é o único módulo já alinhado tanto ao componente de estado compartilhado quanto aos utilitários de busca/paginação/validação. Cursos precisa do maior ajuste de fundo (adotar os utilitários de `shared.tsx`), apesar de parecer visualmente pronto.

---

## Ordem ideal de implementação

1. **Bancas** — validar o tratamento visual (`UI_PREMIUM_GUIDELINES_RC2.0.md`) no módulo que já é a referência arquitetural completa.
2. **Concursos** — par direto de Bancas (depende do mesmo dado); replica a mesma correção (adoção de `AdminTableBody`) logo em seguida.
3. **Disciplinas** — segundo módulo raiz da família, mesma correção.
4. **Assuntos** — par direto de Disciplinas; inclui também a lacuna própria do filtro por disciplina na listagem.
5. **Cargos** — par direto de Cursos (depende do mesmo dado); mesma correção de `AdminTableBody`.
6. **Cursos** — por último: apesar de já ter `AdminTableBody`, é o único que precisa de retrofit para os utilitários de `shared.tsx`, ajuste mais profundo que os demais 5.

---

## Execução do Design Review

Checklist aplicado antes do fechamento. Nenhuma violação — nenhuma decisão altera arquitetura de dados, permissão ou regra de negócio; a observação sobre Cursos usar utilitários próprios em vez de `shared.tsx` é um registro de diferença de implementação para a fase de execução, não uma solução detalhada proposta aqui.

---

## Ordem definitiva de implementação

Bancas → Concursos → Disciplinas → Assuntos → Cargos → Cursos.
