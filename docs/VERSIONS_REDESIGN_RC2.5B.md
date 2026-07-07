# RC2.5B — Redesign do Módulo Versões

**Base:** `ADMIN_PRODUCT_ROADMAP_RC2.md` (Fase 6), `PACKAGES_REDESIGN_RC2.5A.md` (módulo irmão direto), `ADMIN_UX_AUDIT_RC2.1A.md`, `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_SYSTEM.md`.
**Escopo:** `VersionsPage.tsx` completo. CRUD, validações, queries, banco e permissões não tocados — inclusive onde a causa raiz de um achado é uma consulta (achado 07).

---

**Achado 01 — Não usa `AdminTableBody`; erro exibido é a mensagem crua da exceção, sem `formatVersionError`**
`{(error as Error)?.message ?? "Erro ao carregar versões."}` ignora a função de formatação de erro que o próprio módulo já importa e usa em outros pontos (`save`/`remove`/`publish`).
**Impacto:** único módulo revisado até aqui onde o texto de erro técnico pode aparecer diretamente para o Admin.
**Decisão:** migrar para `AdminTableBody`, com `formatError={formatVersionError}`.

**Achado 02 — Mensagem de vazio não diferencia "sem cadastro" de "filtro sem resultado"** (`RC1_AUDIT.md` M04)
Sempre "Nenhuma versão encontrada.", mesmo sem nenhum filtro aplicado.
**Impacto:** menos preciso que o padrão já usado nos demais módulos revisados.
**Decisão:** resolvido junto do achado 01 — `AdminTableBody` já aceita a distinção, usando os filtros já existentes em estado (`debouncedSearch`, `courseFilter`, `packageFilter`, `statusFilter`) sem nenhuma consulta nova.

**Achado 03 — Ícones de ação sem `aria-label`, em `h-3.5 w-3.5` (14px)** (`UXB-M1`)
**Impacto:** mesmo padrão já encontrado em Pacotes e Importação.
**Decisão:** `aria-label` + `h-4 w-4`.

**Achado 04 — Cabeçalho usa `sm:items-start` entre título e botão de ação**
**Impacto:** mesma divergência de `UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 28.
**Decisão:** `items-center`.

**Achado 05 — Tabela com 9 colunas, sem `overflow-x-auto`, acima do limiar de 6 que já aciona colunas prioritárias**
Versão, Nome, Pacote, Curso, Status, Publicado em, Publicado por, Criado em, Ações — a tabela mais densa da família revisada até aqui.
**Impacto:** sem tratamento, é a tabela com maior risco de quebra em tablet/mobile do conjunto Pacotes/Versões.
**Decisão:** `overflow-x-auto` + colunas prioritárias (`UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 16): Versão, Nome, Status e Ações sempre visíveis; Pacote, Curso, Publicado em, Publicado por e Criado em disponíveis por rolagem.

**Achado 06 — Botão "Cancelar" do diálogo usa `variant="secondary"`**
Mesmo achado de `PACKAGES_REDESIGN_RC2.5A.md` achado 03 — os dois módulos "pipeline" compartilham esse desvio frente ao `outline` usado no resto do produto.
**Impacto:** mesmo peso visual indevido do "Cancelar" em relação a qualquer outro diálogo.
**Decisão:** `outline`.

**Achado 07 — Dropdown de Pacote no diálogo de criação herda o filtro de curso da listagem** (`RC1_AUDIT.md` A07, confirmado no código: a mesma query `["packages", "options", courseFilter]` alimenta listagem e diálogo)
**Impacto:** se o Admin filtrou a listagem por um curso, o diálogo "Nova versão" mostra só os pacotes desse curso, sem indicação visual de que a lista está reduzida.
**Decisão:** corrigir exigiria uma consulta própria para o diálogo, independente do filtro da listagem — fora do escopo autorizado ("não altera queries"). Registrado como pendência, sem correção nesta frente.

---

## Execução do Design Review

Checklist aplicado antes do fechamento. Achado 07 já nasceu registrado como pendência, sem decisão a reverter. Os achados 01–06 não alteram CRUD, validação, query ou permissão — inclusive o achado 02, que reaproveita estado já existente em vez de criar lógica nova. Nenhuma revisão foi necessária.

---

## Aprovação

**Módulo Versões aprovado para implementação**, com o achado 07 registrado como pendência fora desta fase.
