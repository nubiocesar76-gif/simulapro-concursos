# 06 — Camada de Persistência (Sprint IT-006)

**Fase:** Implementação Técnica
**Sprint:** IT-006 — Implementação da Camada de Persistência
**Arquitetura homologada em:** IT-006A (revisão da arquitetura da camada de persistência)
**Escopo desta sprint:** implementação de código — persistência apenas. Sem regras de negócio, sem workflow, sem integração com IA, sem composição de prompt, sem interface gráfica, sem `createServerFn`.

---

## 1. Objetivo

Implementar a camada de persistência da Engine Editorial IA para as nove tabelas homologadas em IT-005 (`20260717020000_editorial_ai_engine_core.sql`), seguindo exatamente a arquitetura revisada e homologada em IT-006A: dois repositórios formais para as entidades-raiz (`editorial_ai_batches`, `editorial_ai_cycles`) e funções simples para as sete entidades satélite, todas ancoradas em `cycle_id`.

---

## 2. Padrão real reutilizado

Identificado em `src/lib/acervo/repository.ts` + `src/lib/acervo/supabase-catalog.repository.server.ts` — único par "repository" já existente no projeto:

- Interface (`.ts`) + implementação Supabase-backed (`.server.ts`), usando `supabaseAdmin` de `@/integrations/supabase/client.server`.
- Toda chamada verifica `error` explicitamente e lança `new Error(...)` com mensagem contextual em português.
- Singleton exportado ao final de cada classe.
- Entidade-raiz (`exam_catalog`) recebe interface formal; entidade-satélite (`exam_files`) é tratada como funções soltas no mesmo arquivo, não como uma segunda classe — este é exatamente o precedente aplicado, em escala maior, às sete satélites da Engine IA.

Nenhuma abstração nova foi introduzida: sem `BaseRepository`, sem `GenericRepository`, sem factory, sem injeção de dependência nova.

---

## 3. Arquivos criados

| Arquivo | Conteúdo |
|---|---|
| `src/lib/editorial-ai/types.ts` | Tipos de linha provisórios das 9 tabelas + tipos `Insert`/`Update` onde necessário + literais dos vocabulários fechados (`EditorialAiCycleStatus`, `EditorialAiAnnotationCriterion`, `EditorialAiDecisionType`, `EditorialAiPublicationOutcome`) |
| `src/lib/editorial-ai/repository.ts` | Duas interfaces: `EditorialAiBatchRepository`, `EditorialAiCycleRepository` |
| `src/lib/editorial-ai/repository.server.ts` | `SupabaseEditorialAiBatchRepository`, `SupabaseEditorialAiCycleRepository` + singletons |
| `src/lib/editorial-ai/satellites.server.ts` | Funções para as 7 entidades satélite (`inputs`, `requests`, `responses`, `contents`, `annotations`, `decisions`, `publications`) |

---

## 4. APIs implementadas

**`batch`** (`EditorialAiBatchRepository` / `supabaseEditorialAiBatchRepository`): `create`, `get`, `list(filters?: { architectureId })`, `update` (somente `name`/`description`).

**`cycle`** (`EditorialAiCycleRepository` / `supabaseEditorialAiCycleRepository`): `create`, `get`, `list(filters?: { batchId, architectureId, status })`, `updateStatus` (persiste o status informado, sem validar transição).

**Satélites** (`satellites.server.ts`, funções soltas, todas ancoradas em `cycle_id`):
- `createEditorialAiInput` / `getEditorialAiInputByCycleId`
- `createEditorialAiRequest` / `getEditorialAiRequestByCycleId`
- `createEditorialAiResponse` / `getEditorialAiResponseByCycleId`
- `createEditorialAiContent` / `listEditorialAiContentsByCycleId` / `getLatestEditorialAiContentByCycleId` (ordena por `version DESC`, `limit(1)`, `maybeSingle()` — sem cálculo de `MAX` em memória)
- `createEditorialAiAnnotation` / `listEditorialAiAnnotationsByCycleId`
- `createEditorialAiDecision` / `listEditorialAiDecisionsByCycleId`
- `createEditorialAiPublication` / `listEditorialAiPublicationsByCycleId`

Nenhuma satélite tem `update` ou `delete` — a ausência é deliberada, reflexo direto do caráter append-only já homologado e da RLS já escrita na migration (IT-005).

---

## 5. Caráter provisório de `types.ts`

As nove formas de linha (e os tipos `Insert`/`Update`) são manuscritas, não geradas — `Tables<"editorial_ai_batches">` etc. ainda não existem nos tipos do Supabase porque a migration não foi aplicada. O arquivo traz um cabeçalho `PROVISÓRIO` explícito com a condição exata de substituição (aplicação autorizada da migration + regeneração oficial dos tipos).

Consequência técnica necessária: como o cliente Supabase é tipado (`SupabaseClient<Database>`), as chamadas `.from("editorial_ai_...")` não compilariam sem um `as any` no nome da tabela — presente e comentado em `repository.server.ts` e `satellites.server.ts`, com supressão pontual de `@typescript-eslint/no-explicit-any` (não desligada globalmente) e comentário explicando a mesma condição de remoção. Os retornos usam `as unknown as <Tipo>` (não `as <Tipo>` direto) porque o Supabase tipa o resultado de uma relação desconhecida como `SelectQueryError`, que não tem sobreposição estrutural suficiente com os tipos provisórios para um cast direto.

---

## 6. Separação entre Repository e regras de negócio

Nenhum arquivo desta sprint contém: validação de transição de estado, decisão de aprovação/homologação, composição de prompt, processamento de resposta, validação editorial, convergência para `questions`, chamada a provedor de IA, autorização duplicada em TypeScript (a autorização é só a RLS já escrita na migration), parse de conteúdo JSONB (`remaining_inputs`, `alternatives`, `editorial_metadata` são tratados como `Json` opaco), retries, logs estruturados, métricas, cache ou paginação complexa. `updateStatus` apenas persiste o valor recebido — não valida se a transição é permitida, não consulta outras tabelas.

---

## 7. Validações executadas

- `npx tsc --noEmit`: **zero erros** atribuíveis aos quatro arquivos desta sprint. Erros pré-existentes em outros arquivos (`src/lib/editorial/import/*.ts`, `asaas-webhook.server.ts`, `free-subscription.functions.ts`, `review-center.ts`, `SubscriptionsPage.tsx`, `EvidencesSection.tsx`) foram identificados como dívida técnica anterior, não relacionada, e **não foram tocados**, conforme escopo desta sprint.
- `npx eslint` nos 4 arquivos: inicialmente 23 problemas (14 de formatação, corrigidos via `--fix`; 9 de `no-explicit-any`, correspondentes exatamente aos 9 casts de nome de tabela já documentados como provisórios). Após supressão pontual e comentada: **0 problemas**.
- Nenhuma consulta real foi executada contra o banco — as tabelas não existem no ambiente real ainda.

---

## 8. Limitações por a migration ainda não estar aplicada

- `types.ts` é uma ponte manuscrita, não os tipos oficiais — sujeita a divergência não intencional até ser substituída.
- Os `as any` no nome de tabela permanecem no código até a regeneração dos tipos — não são uma escolha definitiva de estilo, são uma necessidade temporária documentada.
- Nenhum teste de escrita/leitura real foi (ou poderia ser) executado — validação limitada a TypeScript e lint estáticos.
- Nenhum consumidor (server function, orquestração, UI) foi criado — a camada existe, mas não é chamada por nada ainda; isso é esperado e correto para o escopo desta sprint.

---

## 9. Confirmações

- Migration **não aplicada**.
- Banco **não alterado**.
- Tipos Supabase **não regenerados**.
- Nenhum deploy realizado.
- IT-007 **não iniciada**.
