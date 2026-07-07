# RC2.6B — Redesign do Módulo Assinaturas

**Base:** `ADMIN_PRODUCT_ROADMAP_RC2.md` (Fase 8), `DISTRIBUTIONS_REDESIGN_RC2.6A.md` (mesma família "pipeline"), `ADMIN_UX_AUDIT_RC2.1A.md`, `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_SYSTEM.md`.
**Escopo:** `SubscriptionsPage.tsx` completo. CRUD, validações, queries, banco e permissões não tocados — inclusive onde a causa raiz de um achado é uma consulta (achado 07).

---

**Achado 01 — Não usa `AdminTableBody`; erro exibido é a mensagem crua da exceção, sem `formatSubscriptionError`**
**Impacto:** mesmo problema já identificado em Versões e Distribuições.
**Decisão:** migrar para `AdminTableBody`, com `formatError={formatSubscriptionError}`.

**Achado 02 — Mensagem de vazio não diferencia "sem cadastro" de "filtro sem resultado"** (`RC1_AUDIT.md` M04)
Sempre "Nenhuma assinatura encontrada."
**Impacto:** menos preciso que o padrão dos módulos já revisados.
**Decisão:** resolvido junto do achado 01, reaproveitando os filtros já em estado (`debouncedSearch`, `userFilter`, `distributionFilter`, `statusFilter`) — sem consulta nova.

**Achado 03 — Ícones de ação sem `aria-label`, em `h-3.5 w-3.5` (14px)** (`UXB-M1`)
Três botões por linha (Editar, Ativar/Desativar, Excluir).
**Impacto:** mesmo padrão já encontrado em Pacotes, Versões, Distribuições e Importação.
**Decisão:** `aria-label` + `h-4 w-4`.

**Achado 04 — Cabeçalho usa `sm:items-start` entre título e botão de ação**
**Impacto:** mesma divergência de `UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 28.
**Decisão:** `items-center`.

**Achado 05 — Tabela com 7 colunas, sem `overflow-x-auto`, acima do limiar de 6 que já aciona colunas prioritárias**
Usuário, Distribuição, Curso/Pacote, Status, Início, Expira em, Ações.
**Impacto:** risco de quebra em tablet/mobile.
**Decisão:** `overflow-x-auto` + colunas prioritárias (`UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 16): Usuário, Distribuição, Status e Ações sempre visíveis; Curso/Pacote, Início e Expira em via rolagem.

**Achado 06 — Botão "Cancelar" do diálogo usa `variant="secondary"`**
Mesmo achado já registrado em Pacotes, Versões e Distribuições — quarto e último módulo "pipeline" com o mesmo desvio.
**Impacto:** peso visual indevido do "Cancelar" frente a qualquer outro diálogo já revisado.
**Decisão:** `outline`.

**Achado 07 — Assinaturas legadas sem `distribution_id` ficam ocultas da listagem, sem aviso** (`RC1_AUDIT.md` M15, confirmado no código: `.not("distribution_id", "is", null)`)
**Impacto:** o Admin pode subestimar o total real de assinaturas sem saber que registros estão sendo filtrados silenciosamente.
**Decisão:** corrigir exigiria alterar a consulta (remover o filtro ou tratar o caso legado de outra forma) — fora do escopo autorizado ("não altera queries"). Registrado como pendência, sem correção nesta frente.

---

## Execução do Design Review

Checklist aplicado antes do fechamento. Achado 07 já nasceu registrado como pendência, sem decisão a reverter. Os achados 01–06 não alteram CRUD, validação, query ou permissão. Nenhuma revisão foi necessária.

---

## Aprovação

**Módulo Assinaturas aprovado para implementação**, com o achado 07 registrado como pendência fora desta fase.
