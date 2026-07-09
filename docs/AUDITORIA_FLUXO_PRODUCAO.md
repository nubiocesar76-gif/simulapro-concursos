# Auditoria do Fluxo de Produção — Acervo Oficial de Enfermeiro

**Objetivo:** confirmar que, quando a primeira prova oficial chegar, o fluxo completo (Acervo → Editorial Engine → Importador → `questions.json` → Seed → Banco → Pacotes → Distribuições → Portal do Aluno) processa sem exigir alteração estrutural.
**Método:** leitura completa das 18 migrations, do código de cada domínio, `npx tsc --noEmit`, `npm run build`, consulta somente-leitura ao banco remoto vinculado (`ddgpkijytvagmabtttor`) e verificação no preview do navegador. Sem alteração de arquitetura, sem novos módulos, sem refatoração, sem PDF, sem IA — apenas correção de bugs que bloqueavam o fluxo.
**Data:** 2026-07-09

---

## Checklist por etapa

| # | Etapa | Status | Resumo |
|---|-------|--------|--------|
| 1 | **Acervo** (`exam_catalog`/`exam_files`) | ✅ **OK** | Schema, RLS e componente admin consistentes entre si. Importador CSV→catálogo (`catalog-import.server.ts`) bate 1:1 com a migration. `ebserh-2025` já está catalogada (`DOWNLOADED`, `verified=YES`). Único gap é a extração de PDF/geração de questões — **fora de escopo por instrução explícita** ("não implementar PDF/IA"), não é bug. |
| 2 | **Editorial Engine V2 Lite** | ✅ **OK** | As 6 tabelas (`editorial_architectures/disciplines/topics/keywords/rules/evidence`) têm CRUD admin funcional e usam exatamente as colunas da migration. Nenhuma tabela órfã. |
| 3 | **Importador** | ⚠️ **Ajuste necessário** | Existem **dois importadores independentes**: (a) Importação Editorial (`docs/editorial/` → `editorial_*`), usado pela Arquitetura Editorial V1.1; (b) Importador legado de questões (`/admin/import`, CSV/XLSX/JSON → `questions`). Nenhum bug encontrado em nenhum dos dois isoladamente, mas **é o (b) que efetivamente vincula `package_version_id`** — ver Bloqueador #1. Os arquivos opcionais do pacote editorial (sinônimos, siglas, legislações, perfil de bancas etc.) são lidos mas nunca persistidos em tabela — comportamento correto conforme `manifest.json` os marca como `optional_files`, não é bug. |
| 4 | **`questions.json`** | ⚠️ **Ajuste necessário** | Contrato (`schema.ts`) exige mínimo de 2 alternativas, mas o conversor CSV/XLSX (`convert/validate.ts`) e o estágio `questions.raw.json` do pipeline PDF (`pdf/schema.ts`) **exigem exatamente 5**. Não bloqueia a prova piloto (EBSERH/FGV usa 5 alternativas), mas **vai bloquear bancas de 4 alternativas já previstas no roadmap** (IBFC, Avalia, FAFIPA — ver `docs/producao-acervo/01-bancas-prioritarias.md`). Registrar como pendência antes da Onda 2/5 do cronograma. |
| 5 | **Seed** (`seed:questions`) | 🔴 **Corrigido parcialmente / Bloqueador residual** | Bug de tipo real corrigido (ver Arquivos alterados). Confirmado por consulta ao banco: **as 2 questões atualmente semeadas (Enfermeiro/CEBRASPE) estão com `package_version_id = NULL`** porque o contrato `questions.json`/`seed.ts` nunca grava esse campo — ver Bloqueador #1 abaixo. |
| 6 | **Banco** | ✅ **OK** (após correção) | `npx supabase migration list --linked` confirma as **18 migrations aplicadas no remoto**, sem gap de ordem. Estado final do `GRANT/REVOKE` de `has_role` está correto (EXECUTE concedido a `authenticated`). Bootstrap do primeiro admin já feito (1 admin ativo). O bug real era `src/integrations/supabase/types.ts` **desatualizado** em relação ao schema real (faltava `slug` em `subjects`/`topics`) — corrigido regenerando o arquivo a partir do banco linkado. |
| 7 | **Pacotes e Versões** | 🔴 **Bloqueador** | Fluxo de Pacotes/Versões/Publicação funciona corretamente sozinho, e já existe uma versão `PUBLISHED` (“Edição Inicial RC1”, v1.0). **O elo quebrado é a ponte Seed → Pacote/Versão**: `scripts/seed/questions/seed.ts` não aceita nem grava `package_version_id`. Ver Bloqueador #1. |
| 8 | **Distribuições** | ✅ **OK** | Regra "só versão `PUBLISHED` pode ser distribuída" é validada em dois lugares (UI e trigger `enforce_distribution_published_version` no banco) — robusta mesmo contra escrita direta via API. |
| 9 | **Portal do Aluno** | ✅ **OK** (condicionado ao #7) | `getSessionQuestions()` funciona corretamente e busca questões por igualdade exata de `package_version_id`. A cadeia Importação (`/admin/import`) → Pacote → Versão → Publicar → Distribuição → Assinatura → Sessão **funciona ponta a ponta sem quebra** quando a questão entra pelo importador legado. Só falha quando a questão vem do Seed sem vínculo — mesmo Bloqueador #1. |

---

## Bloqueadores restantes antes do lançamento

### ✅ Bloqueador #1 — RESOLVIDO em 2026-07-09 (ver `docs/CORRECAO_SEED_PACKAGE_VERSION.md`)

Seed passou a resolver `package_version_id` a partir de `package`/`packageVersion` (slugs) no `questions.json`, no mesmo momento em que resolve `subject_id`/`board_id`/etc. As 2 questões órfãs de produção foram reprocessadas e confirmadas aparecendo na sessão de estudo real. Detalhe completo da causa raiz, arquivos alterados e validação: `docs/CORRECAO_SEED_PACKAGE_VERSION.md`.

<details>
<summary>Registro original do bloqueador (antes da correção)</summary>

### 🔴 Bloqueador #1 — Seed não vincula questões a Pacote/Versão (confirmado em produção)

**O quê:** `scripts/seed/questions/schema.ts` (contrato de `docs/seeds/questions.json`) e `scripts/seed/questions/seed.ts` (insert em `questions`) não têm nenhum campo de pacote/versão. Toda questão semeada via `npm run seed:questions` fica com `package_id`/`package_version_id = NULL`.

**Impacto confirmado agora, em produção (consulta somente-leitura ao banco `ddgpkijytvagmabtttor`):**
- 7 questões na tabela `questions`; **2 delas** (Enfermeiro / CEBRASPE, do seed atual) estão com `package_version_id = NULL`.
- `getSessionQuestions()` filtra por `.eq("package_version_id", session.package_version_id)` — `NULL` nunca satisfaz esse filtro. Essas 2 questões **nunca aparecerão para nenhum aluno**, mesmo com Distribuição e Assinatura ativas.
- Já existe versão `PUBLISHED` disponível (“Edição Inicial RC1”, v1.0) para onde essas questões poderiam apontar.
- Isso já era conhecido parcialmente: `docs/RC1_CHECKLIST.md` (bug B4) registrou o mesmo sintoma no dashboard do aluno e o time optou por **filtrar** as questões órfãs em vez de corrigir o vínculo.

**Por que não corrigi agora:** exige decidir *como* o alvo de pacote/versão é informado no momento do seed (parâmetro de linha de comando? variável de ambiente? novo campo no `questions.json`?) — é uma decisão de produto sobre o contrato do pipeline, não um bug de uma linha. Corrigir às cegas seria "criar funcionalidade", fora do escopo desta auditoria.

**Two caminhos possíveis para decisão do time (não implementados):**
1. Migrar a "primeira prova oficial" para o importador legado (`/admin/import`, que já vincula corretamente) em vez do caminho `docs/work/` → `questions.json` → `seed:questions`.
2. Estender o contrato do seed para aceitar um identificador de pacote/versão (ex.: `SEED_PACKAGE_VERSION_ID`) e propagá-lo até o `insert`.

**Ação imediata recomendada (não executada — é escrita em dado de produção, fora do escopo pedido):** um `UPDATE questions SET package_version_id = '940ad0d6-1147-4ba1-be1a-0b07c34cb76b' WHERE package_version_id IS NULL AND position_id = '<enfermeiro>'` resolveria as 2 questões já existentes, mas não evita que o próximo `npm run seed:questions` gere o mesmo problema.

</details>

### 🟡 Bloqueador secundário — cardinalidade de alternativas inconsistente (não afeta a prova piloto)

`questionSeedItemSchema` aceita 2+ alternativas, mas `convert/validate.ts` e `pdf/schema.ts` exigem exatamente 5. Bancas de 4 alternativas já previstas no cronograma (IBFC, Avalia, FAFIPA) vão falhar na conversão CSV/XLSX até isso ser resolvido. Não bloqueia a prova EBSERH/FGV (5 alternativas), por isso não é bloqueador imediato — registrar para antes da Onda 2/5 de `docs/producao-acervo/05-cronograma-producao.md`.

### 🟢 Sem bloqueador — `docs/PROJECT_STATUS.md` está desatualizado em dois pontos

Não é um bloqueador de fluxo, mas vale nota para não gerar alarme falso: a seção "Bloqueios conhecidos" do `PROJECT_STATUS.md` ainda descreve o RLS/`has_role` e o `db push` como pendentes — **isso já não é verdade**, as 18 migrations estão aplicadas e o `GRANT EXECUTE` está correto no estado final. Não atualizei esse documento porque a tarefa desta vez pediu explicitamente para não fazer "nenhuma outra alteração" além dos itens solicitados.

---

## Arquivos alterados

| Arquivo | Mudança | Motivo |
|---|---|---|
| `src/integrations/supabase/types.ts` | Regenerado via `npx supabase gen types typescript --linked` a partir do banco remoto real (não editado à mão) | Estava desatualizado desde a migration `20260706060000` — faltava `slug` em `subjects`/`topics`, quebrando o typecheck de Admin Taxonomia, Seed e Importador Editorial |
| `scripts/seed/questions/seed.ts` | Cast explícito de `metadata` para o tipo `Json` gerado, no ponto de montagem do insert | `Record<string, unknown>` não é estruturalmente aceito pelo tipo `Json` do Postgrest — erro de tipo, sem risco de execução (dado serializa igual), mas bloqueava `tsc --noEmit` |
| `src/components/admin/acervo/AcervoCatalogPage.tsx` | Removida prop `pageCount` (inexistente em `TaxonomyPaginationProps`) e a variável correspondente, agora não usada | Mismatch de API do componente `TaxonomyPagination` — a paginação real já era calculada internamente a partir de `total`; a prop extra só gerava erro de tipo, sem efeito em runtime (React ignora props desconhecidas) |
| `src/routes/auth.tsx` | `toast.error(roleError.message)` → `toast.error(roleError)` | `fetchRole()` já retorna `error: string \| null`; chamar `.message` numa string retornava `"undefined"` no toast em vez da mensagem real de erro, quando a busca de role falha após login bem-sucedido |

**Não alterados (documentados como achado, não como bug de fluxo):**
- `src/lib/editorial/import/executor.ts` / `preview.ts` — funções genéricas (`loadByCode`, `deprecateMissing`) tipam `table` como `string` solto, o que faz o TypeScript checar `.from(table)` contra a união de **todas** as tabelas do banco (incluindo `boards`, que não tem `code`), gerando erros de tipo. Confirmado por leitura completa que em runtime essas funções só são chamadas com as 5 tabelas `editorial_*` que de fato têm `code`/`architecture_id` — não é bug funcional. Corrigir exigiria mudar assinatura de função (risco de refatoração fora do escopo).
- `src/components/admin/editorial/EvidencesSection.tsx` — o enum `editorial_entity_type` ganhou `SUBTOPIC` na migration do Importador, mas o `useState` de `entityType` e o `switch` de opções da UI não cobrem esse caso. Se existir (ou vier a existir) uma evidência ligada a um subassunto, o formulário de edição mostra o seletor de entidade vazio. Não corrigi porque a correção real (nova query de subassuntos + novo `case` na UI) é funcionalidade nova, não bug de uma linha.
- `src/components/admin/subscriptions/SubscriptionsPage.tsx` e `src/lib/asaas-webhook.server.ts` — o `types.ts` agora exige `course_id` no insert de `subscriptions` (não tinha essa exigência no arquivo antigo). Confirmado lendo a migration `20260705000000_subscriptions_distribution.sql`: existe um trigger `BEFORE INSERT` (`sync_subscription_legacy_fields`) que preenche `course_id` a partir de `distribution_id` antes da checagem `NOT NULL` — **falso positivo de tipo, sem risco de execução**.

---

## Verificação executada

- `npx tsc --noEmit`: 42 → 22 erros (todos os 22 restantes documentados acima como falso-positivo ou gap de escopo, nenhum bloqueia `npm run build` nem `tsx`).
- `npm run build`: sucesso antes e depois das correções.
- `npx supabase migration list --linked`: 18/18 migrations aplicadas no remoto.
- Consulta somente-leitura ao banco: 1 admin ativo, catálogo com `ebserh-2025` em `DOWNLOADED`, 7 questões no banco (2 órfãs de pacote/versão).
- Preview no navegador: `/auth` renderiza sem erro de console; login com credencial inválida exibe toast correto ("Invalid login credentials"), confirmando que a correção em `auth.tsx` não introduziu regressão no caminho já funcional.
