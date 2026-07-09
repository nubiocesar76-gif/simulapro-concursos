# Correção — Seed não vinculava questões a Pacote/Versão

**Status:** ✅ Resolvido em 2026-07-09.
**Referência:** Bloqueador #1 de `docs/AUDITORIA_FLUXO_PRODUCAO.md`.
**Escopo respeitado:** nenhuma arquitetura nova, nenhum módulo novo, fluxo inalterado (Curso → Pacote → Versão → Publicar → Distribuição → Assinatura → Sessão de estudo continua exatamente o mesmo) — apenas o contrato `docs/seeds/questions.json` foi completado com os dois campos que já faltavam para fechar esse fluxo.

---

## Causa

O Portal do Aluno só entrega uma questão a um aluno se `questions.package_version_id` bater exatamente com o `package_version_id` da distribuição assinada (`getSessionQuestions()`, `src/lib/study-engine.ts:421-424`, filtro `.eq("package_version_id", session.package_version_id)`).

O caminho legado de importação (`/admin/import` → `src/lib/import.ts`) sempre preencheu esse campo, porque o admin escolhe Pacote e Versão na tela antes de importar. O caminho oficial do Acervo (`docs/work/<prova>` → `docs/seeds/questions.json` → `npm run seed:questions`) nunca teve essa informação: o contrato `questionSeedItemSchema` (`scripts/seed/questions/schema.ts`) resolvia `position`, `board`, `contest`, `subject` e `topic` por slug, mas não tinha nenhum campo equivalente para pacote/versão, e `scripts/seed/questions/seed.ts` simplesmente não escrevia essas colunas — ficavam `NULL` por omissão, não por decisão.

Confirmado em produção antes da correção: das 7 questões existentes em `questions`, as 2 que vieram do seed (Enfermeiro/CEBRASPE) estavam com `package_version_id = NULL`, mesmo já existindo uma versão publicada (**"Edição Inicial RC1", v1.0**) e uma distribuição ativa para elas apontarem.

### Por que a resolução acontece nesse ponto exato do Seed

`resolveQuestionTaxonomyIds()` já resolve, por item, `position_id → subject_id → topic_id → board_id → exam_id`, cada um dependendo do anterior via slug + cache em `Map` (carregado uma vez por `loadTaxonomyMaps()`, estendido sob demanda em cache-miss). Pacote é escopado por **curso**, e o único jeito de saber o curso de uma questão é através do `course_id` do `position_id` já resolvido — por isso `package_version_id` só pode ser resolvido **depois** de `position_id`, na mesma função, seguindo exatamente o mesmo padrão usado por `topic` (exige `subject`) e `contest` (exige `board`). Resolver antes (não há curso ainda) ou depois do insert (exigiria um `UPDATE` por linha, dobrando escritas e deixando uma janela de dado órfão) quebraria o invariante existente de "uma linha, uma escrita, totalmente formada".

---

## Correção aplicada

Extensão simétrica do contrato já existente — mesmo padrão slug + cache já usado por `board`/`contest`/`subject`/`topic`, nada novo:

1. **`docs/seeds/questions.json` ganha dois campos opcionais**, `package` (slug do pacote) e `packageVersion` (número da versão, ex. `"1.0"`) — omitidos, o comportamento é idêntico ao de antes (`package_version_id = NULL`), preservando compatibilidade total com arquivos antigos.
2. **Resolução por slug** de `package`/`packageVersion`, escopada ao `course_id` do `position_id` já resolvido, com cache em `Map` — mesmo padrão de `resolveBoard`/`resolveContest`. **Não cria** pacote/versão se não existir (mesmo comportamento de "achar ou falhar" que já existia para banca/cargo/disciplina) — lança erro claro se a versão não existir, nunca escreve dado inconsistente.
3. **Exportação simétrica** (`export:questions`) também passou a emitir `package`/`packageVersion` a partir de `questions.package_version_id`, para que o round-trip Banco → JSON → Banco não perca a informação.

## Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `scripts/seed/questions/schema.ts` | Novos campos opcionais `package` (slug) e `packageVersion` (regex semântico `\d+\.\d+(\.\d+)?`, mesmo padrão de `validateVersionNumber` em `src/lib/versions.ts`) em `questionSeedItemBaseSchema` |
| `scripts/seed/taxonomy/entities.ts` | Nova função `resolvePackageVersion(db, courseId, packageSlug, versionNumber)` — resolve `packages` por `(course_id, slug)` e depois `package_versions` por `(package_id, version_number)`; retorna `null` se não encontrar (não cria) |
| `scripts/seed/questions/entities.ts` | `TaxonomyMaps` ganha `positionSlugToCourseId` e `packageVersionKeyToId`; `loadTaxonomyMaps()` passa a carregar `course_id` de `positions`; `resolveQuestionTaxonomyIds()` resolve `package_version_id` logo após `position_id`, exigindo `package`+`packageVersion` juntos e `position` presente (erros claros se faltar uma peça) |
| `scripts/seed/questions/seed.ts` | `InsertRow` ganha `package_version_id: string \| null` — o valor já flui automaticamente pelo `...taxonomyIds` existente no `insert`, sem tocar a lógica de batch/flush |
| `scripts/seed/questions/export.ts` | `ExportRow`/`rowToSeedItem`/query `select()` passam a trazer `package_versions(version_number, packages(slug))` e emitir `package`/`packageVersion` no JSON exportado |
| `docs/seeds/questions.json` | As 2 questões existentes ganharam `"package": "banco-de-questoes-enfermagem"` e `"packageVersion": "1.0"` |
| `docs/AUDITORIA_FLUXO_PRODUCAO.md` | Bloqueador #1 marcado como resolvido, com link para este documento |

**Dado de produção corrigido:** as 2 questões órfãs (`f03799d8...`, `0b78d00d...`, `package_version_id = NULL`) foram apagadas e recriadas via `npm run seed:questions` já com o contrato corrigido — não haveria outro jeito de fazer o seed reprocessá-las, já que a deduplicação por `contentHash` ignora silenciosamente linhas já existentes. IDs novos: `c9b13506...` e `a7ad0ad4...`, ambas agora com `package_version_id = 940ad0d6-1147-4ba1-be1a-0b07c34cb76b` ("Edição Inicial RC1", v1.0, `PUBLISHED`).

---

## Validação — questão aparecendo no Portal do Aluno

Consulta somente-leitura confirmou **0 questões** com `package_version_id NULL` no banco após a correção (eram 2 antes).

Validação de ponta a ponta na UI real, autenticado como o usuário de produção já assinante da distribuição correspondente (`nubiocesar76@gmail.com`, sessão obtida via magic-link administrativo — sem alterar senha nem criar usuário novo):

1. `/app/study` → distribuição **"Distribuição RC1 - Enfermagem"** listada (Enfermagem · Banco de Questões - Enfermagem · v1.0).
2. Configurar sessão (modo Estudo, 10 questões, ordem aleatória) → **"Sessão criada"**.
3. Abrir a sessão → **"Progresso: 0 de 7"** — as 7 questões hoje vinculadas a essa versão (incluindo as 2 que antes eram órfãs) foram encontradas por `getSessionQuestions()`.
4. Iniciar resolução → **Questão 1 de 7** renderizada:

   > "Qual é a frequência cardíaca considerada normal em um adulto saudável em repouso, segundo fundamentos de enfermagem?"
   > A) 40 a 50 bpm · B) 60 a 100 bpm · C) 110 a 130 bpm · D) 140 a 160 bpm (E oculta pelo scroll do snapshot)

Essa é exatamente uma das duas questões que, antes da correção, tinha `package_version_id = NULL` e nunca apareceria para nenhum aluno. Confirmado renderizada, com alternativas, dentro de uma sessão de estudo real, para uma assinatura real.

`npx tsc --noEmit` e `npm run build` seguem passando sem regressão (mesmos 22 erros pré-existentes e já documentados em `docs/AUDITORIA_FLUXO_PRODUCAO.md`, nenhum novo).
