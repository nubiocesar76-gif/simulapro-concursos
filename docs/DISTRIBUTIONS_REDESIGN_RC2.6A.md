# RC2.6A — Redesign do Módulo Distribuições

**Base:** `ADMIN_PRODUCT_ROADMAP_RC2.md` (Fase 7), `PACKAGES_REDESIGN_RC2.5A.md`/`VERSIONS_REDESIGN_RC2.5B.md` (mesma família "pipeline"), `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_SYSTEM.md`.
**Escopo:** `DistributionsPage.tsx` completo. CRUD, validações, queries, banco e permissões não tocados.

---

**Achado 01 — Não usa `AdminTableBody`; erro exibido é a mensagem crua da exceção, sem `formatDistributionError`**
O módulo já importa e usa `formatDistributionError` em `save`/`toggleStatus`/`remove`, mas não na leitura da listagem.
**Impacto:** mesmo problema já identificado em Versões (`RC2.5B` achado 01) — texto técnico pode aparecer direto para o Admin.
**Decisão:** migrar para `AdminTableBody`, com `formatError={formatDistributionError}`.

**Achado 02 — Mensagem de vazio não diferencia "sem cadastro" de "filtro sem resultado"** (`RC1_AUDIT.md` M04)
Sempre "Nenhuma distribuição encontrada."
**Impacto:** menos preciso que o padrão dos módulos já revisados.
**Decisão:** resolvido junto do achado 01, reaproveitando os filtros já em estado (`debouncedSearch`, `courseFilter`, `packageFilter`, `versionFilter`, `statusFilter`) — sem consulta nova.

**Achado 03 — Ícones de ação sem `aria-label`, em `h-3.5 w-3.5` (14px)** (`UXB-M1`)
Três botões por linha (Editar, Ativar/Desativar, Excluir).
**Impacto:** mesmo padrão já encontrado em Pacotes, Versões e Importação.
**Decisão:** `aria-label` (`Editar {nome}`, `Ativar {nome}`/`Desativar {nome}`, `Excluir {nome}`) + `h-4 w-4`.

**Achado 04 — Cabeçalho usa `sm:items-start` entre título e botão de ação**
**Impacto:** mesma divergência de `UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 28.
**Decisão:** `items-center`.

**Achado 05 — Tabela com 8 colunas, sem `overflow-x-auto`, acima do limiar de 6 que já aciona colunas prioritárias**
Nome, Versão, Pacote, Curso, Status, Disponível de, Disponível até, Ações.
**Impacto:** risco de quebra em tablet/mobile na segunda tabela mais densa revisada até aqui (depois de Versões).
**Decisão:** `overflow-x-auto` + colunas prioritárias (`UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 16): Nome, Status e Ações sempre visíveis; Versão, Pacote, Curso, Disponível de e Disponível até via rolagem.

**Achado 06 — Botão "Cancelar" do diálogo usa `variant="secondary"`**
Mesmo achado já registrado em Pacotes e Versões — confirma que os três módulos "pipeline" compartilham esse desvio frente ao `outline` usado no resto do produto.
**Impacto:** peso visual indevido do "Cancelar" frente a qualquer outro diálogo já revisado.
**Decisão:** `outline`.

---

## Execução do Design Review

Checklist aplicado antes do fechamento. Nenhuma decisão altera CRUD, validação, query ou permissão. Nenhuma revisão foi necessária.

---

## Aprovação

**Módulo Distribuições aprovado para implementação.**
