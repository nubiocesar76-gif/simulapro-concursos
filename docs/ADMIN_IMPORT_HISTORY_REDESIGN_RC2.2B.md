# RC2.2B — Redesign do Histórico de Importações

**Base:** `ADMIN_UX_AUDIT_RC2.1A.md`, `ADMIN_PRODUCT_ROADMAP_RC2.md` (Fase 2), `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_SYSTEM.md`.
**Escopo:** tabela de lotes e `BatchReportDialog` dentro de `src/components/admin/import/ImportPage.tsx`. Nenhuma query, banco, parser, permissão ou regra de negócio alterada — inclusive onde isso limita a correção possível (ver achados 05/06).

---

**Achado 01 — Tabela de 11 colunas sem `overflow-x-auto`** (já registrado como `ADMIN_IMPORT_REDESIGN_RC2.2A.md` achado 10)
**Impacto:** risco de quebra em tablet/mobile.
**Decisão:** envolver em `overflow-x-auto`, mesma correção já aprovada.

**Achado 02 — Estado vazio é texto solto ("Nenhum lote")** (`RC2.2A` achado 11)
**Impacto:** inconsistente com `EmptyState` do resto do produto.
**Decisão:** substituir por `EmptyState`, mesma correção já aprovada.

**Achado 03 — Loading ausente; tela mostra "Nenhum lote" durante o carregamento real** (`RC2.2A` achado 12)
**Impacto:** Admin pode interpretar carregamento como ausência real de dado.
**Decisão:** expor `isLoading`/`isError` já retornados pela consulta; `Skeleton`/`PageErrorState` antes do `EmptyState`, mesma correção já aprovada.

**Achado 04 — Ícones de ação em `h-3.5 w-3.5` (14px)** (`RC2.2A` achado 14)
**Impacto:** abaixo do padrão oficial (16px).
**Decisão:** `h-4 w-4`, mesma correção já aprovada.

**Achado 05 — `.limit(30)` sem paginação; lotes além do 30º somem sem aviso** (`RC1_AUDIT.md` M16) *(decisão ajustada no Design Review — ver nota)*
**Impacto:** truncamento silencioso — Admin pode achar que viu o histórico completo.
**Decisão:** paginação real exigiria alterar a consulta (`.range`/contagem), fora do escopo autorizado nesta fase ("não altera queries"). Correção possível sem tocar a query: exibir um aviso textual explícito quando houver exatamente 30 lotes retornados (ex.: "Mostrando os 30 lotes mais recentes"), tornando o corte visível em vez de silencioso. Paginação real fica registrada como pendência para uma fase que autorize mudança de consulta.

**Achado 06 — Nenhuma busca ou filtro na lista de lotes, diferente de todo outro módulo do Admin** *(decisão ajustada no Design Review — ver nota)*
**Impacto:** único módulo administrativo sem busca/filtro básico.
**Decisão:** filtrar de verdade (por status, curso ou pacote) exigiria consulta com parâmetros novos ou traria resultado incompleto se aplicado só sobre os 30 registros já truncados (achado 05) — nas duas hipóteses, viola o escopo desta fase ou entrega uma busca que mente sobre cobrir todo o histórico. Sem correção nesta fase; registrado como pendência a tratar junto da paginação real (achado 05), quando uma fase autorizar mudança de consulta.

**Achado 07 — Coluna "Administrador" sem truncamento explícito**
Exibe `full_name ?? email`, que pode ser um e-mail longo.
**Impacto:** possível quebra de linha indesejada numa coluna estreita.
**Decisão:** `truncate` (uma linha), conforme padrão de truncamento do produto (`UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 30).

**Achado 08 — Detalhes do lote (`BatchReportDialog`): conteúdo em rolagem interna (`max-h-[70vh] overflow-auto`)**
**Impacto:** nenhum — é a revisão de um relatório já concluído, mesma natureza do relatório de validação ao vivo (`RC2.2A` achado 06, já reavaliado como padrão apropriado para esse tipo de conteúdo).
**Decisão:** manter. Nenhuma mudança.

**Achado 09 — Largura do diálogo de relatório (`max-w-3xl`)**
**Impacto:** nenhum — conteúdo é genuinamente tabular (estatísticas + preview + tabela de erros), enquadrando-se na exceção já prevista em `DESIGN_SYSTEM.md` §7 para diálogos com conteúdo tabular.
**Decisão:** manter. Nenhuma mudança.

---

## Execução do Design Review

Checklist (`DESIGN_REVIEW_CHECKLIST.md`) aplicado antes do fechamento. Duas decisões foram revisadas por violarem o bloco "Regras de negócio" (não altera queries):

- **Achado 05** — decisão original ("adicionar paginação") alterava a consulta; substituída por um aviso textual sobre o corte de 30 registros, sem tocar a query.
- **Achado 06** — decisão original ("adicionar busca/filtro") também exigia consulta nova ou entregaria filtro incompleto; substituída por registro de pendência, sem implementação nesta fase.

Achados 01–04, 07–09 passaram no checklist sem ajuste.

---

## Aprovação

**Histórico de Importações aprovado para implementação.** Achados 05 e 06 ficam registrados como pendência para uma fase futura que autorize alteração de consulta — não bloqueiam a implementação dos demais achados desta fase.
