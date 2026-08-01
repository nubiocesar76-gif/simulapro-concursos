# 05 — Primeira Migration SQL da Engine Editorial IA (Sprint IT-005)

**Fase:** Implementação Técnica  
**Sprint:** IT-005 — Criação da primeira migration SQL da Engine Editorial IA  
**Fonte normativa:** `docs/editorial/engine-v2/08` a `16` (IA-001…IA-009) + IT-001…IT-004 (homologados)  
**Escopo desta sprint:** migration SQL aditiva do núcleo da Engine Editorial IA. Sem aplicação no banco, sem código de aplicação, sem deploy.

---

## 1. Arquivo criado

| Item | Valor |
|---|---|
| Caminho | `supabase/migrations/20260717020000_editorial_ai_engine_core.sql` |
| Timestamp | `20260717020000` (próximo após `20260717010000_subscriptions_unique_constraint_fix.sql`) |
| Natureza | Totalmente aditiva — nenhum `ALTER` em tabela existente |

---

## 2. Objetos criados

### 2.1 Enum

| Tipo | Valores |
|---|---|
| `public.editorial_ai_cycle_status` | `RASCUNHO_IA`, `EM_REVISAO`, `APROVADO_EDITORIAL`, `REPROVADO` |

Enum dedicado — **não** reutiliza `editorial_record_status` (conforme IT-001 §10).

### 2.2 Tabelas (9)

| Tabela | `updated_at` | Observações |
|---|---|---|
| `editorial_ai_batches` | Sim | FK `architecture_id` SET NULL; `created_by` RESTRICT; CHECK nome não vazio |
| `editorial_ai_cycles` | Sim | FK `architecture_id`/`batch_id` SET NULL; status enum |
| `editorial_ai_inputs` | Não | `cycle_id` UNIQUE; XOR concept_subtopic/topic; `remaining_inputs` NOT NULL |
| `editorial_ai_requests` | Não | `cycle_id` UNIQUE; CHECK composed_instruction não vazio |
| `editorial_ai_responses` | Não | `cycle_id` UNIQUE; CHECK raw_response não vazio |
| `editorial_ai_contents` | Não | UNIQUE(cycle_id, version); CHECK version > 0 |
| `editorial_ai_annotations` | Não | CHECK 10 critérios IA-005; sem `content_id` |
| `editorial_ai_decisions` | Não | CHECK decision_type; justification obrigatória em REPROVACAO |
| `editorial_ai_publications` | Não | sem UNIQUE(cycle_id); `question_id` singular |

### 2.3 FKs para objetos existentes

| Coluna | Referência |
|---|---|
| `architecture_id` (batches, cycles) | `editorial_architectures(id)` ON DELETE SET NULL |
| `created_by` (batches) | `auth.users(id)` ON DELETE RESTRICT |
| `concept_subtopic_id` | `editorial_subtopics(id)` ON DELETE SET NULL |
| `concept_topic_id` | `editorial_topics(id)` ON DELETE SET NULL |
| `board_id` | `boards(id)` ON DELETE SET NULL |
| `course_id` | `courses(id)` ON DELETE SET NULL |
| `position_id` | `positions(id)` ON DELETE SET NULL |
| `question_id` | `questions(id)` ON DELETE SET NULL |
| `actor_user_id` | `auth.users(id)` ON DELETE RESTRICT |

### 2.4 Critérios de anotação — contrato normativo vs. representação física

**Decisão homologada (IT-003 + IT-005A):** persistir **identificadores físicos canônicos** em snake_case UPPER na coluna `criterion`. O CHECK da migration **não foi alterado** nesta revisão.

**Camadas distintas, sem contradição:**

| Camada | Documento | O que define |
|---|---|---|
| Normativa (conceitual) | IA-005 §5 | Dimensões de observação editorial em linguagem humana — explicitamente **sem schema, sem banco, sem persistência** (IA-005 §7) |
| Física (persistência) | IT-003 (homologada) | Identificadores canônicos estáveis para a coluna `editorial_ai_annotations.criterion` |

IA-005 descreve **o quê** se observa; o banco persiste **como** referenciar cada critério de forma inequívoca e imutável. A tabela abaixo é o mapeamento oficial entre as duas camadas:

| Critério normativo (IA-005 §5) | Identificador físico canônico (CHECK) |
|---|---|
| Fidelidade ao Conceito | `FIDELIDADE_AO_CONCEITO` |
| Clareza e univocidade do enunciado | `CLAREZA_ENUNCIADO` |
| Coerência do Contexto | `COERENCIA_CONTEXTO` |
| Plausibilidade dos distratores | `PLAUSIBILIDADE_DISTRATORES` |
| Defensibilidade do gabarito | `DEFENSIBILIDADE_GABARITO` |
| Consistência da justificativa técnica | `CONSISTENCIA_JUSTIFICATIVA` |
| Verificabilidade da referência | `VERIFICABILIDADE_REFERENCIA` |
| Aderência ao estilo da banca | `ADERENCIA_ESTILO_BANCA` |
| Ausência de indício de cópia | `AUSENCIA_INDICIO_COPIA` |
| Coerência dos metadados editoriais | `COERENCIA_METADADOS` |

---

## 3. Índices

| Índice | Tabela | Coluna(s) |
|---|---|---|
| `editorial_ai_cycles_architecture_id_idx` | `editorial_ai_cycles` | `architecture_id` |
| `editorial_ai_cycles_batch_id_idx` | `editorial_ai_cycles` | `batch_id` |
| `editorial_ai_cycles_status_idx` | `editorial_ai_cycles` | `status` |
| `editorial_ai_annotations_cycle_id_idx` | `editorial_ai_annotations` | `cycle_id` |
| `editorial_ai_decisions_cycle_id_idx` | `editorial_ai_decisions` | `cycle_id` |
| `editorial_ai_publications_cycle_id_idx` | `editorial_ai_publications` | `cycle_id` |
| `editorial_ai_publications_question_id_idx` | `editorial_ai_publications` | `question_id` |

**Não criados** (cobertos por UNIQUE inline):  
`editorial_ai_inputs.cycle_id`, `editorial_ai_requests.cycle_id`, `editorial_ai_responses.cycle_id`, `editorial_ai_contents(cycle_id, version)`.

---

## 4. Triggers

| Trigger | Tabela | Função |
|---|---|---|
| `trg_editorial_ai_batches_updated` | `editorial_ai_batches` | `update_updated_at_column()` |
| `trg_editorial_ai_cycles_updated` | `editorial_ai_cycles` | `update_updated_at_column()` |

Append-only: sem triggers de `updated_at`.

---

## 5. Matriz RLS / Policies

RLS habilitado nas 9 tabelas. Políticas **separadas por comando** (sem `FOR ALL`). Papel: `authenticated` + `public.has_role(auth.uid(), 'admin')`.

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `editorial_ai_batches` | admin | admin | admin | — |
| `editorial_ai_cycles` | admin | admin | admin | — |
| `editorial_ai_inputs` | admin | admin | — | — |
| `editorial_ai_requests` | admin | — | — | — |
| `editorial_ai_responses` | admin | — | — | — |
| `editorial_ai_contents` | admin | admin | — | — |
| `editorial_ai_annotations` | admin | — | — | — |
| `editorial_ai_decisions` | admin | admin¹ | — | — |
| `editorial_ai_publications` | admin | — | — | — |

¹ INSERT exige `actor_user_id = auth.uid()` no `WITH CHECK`.

Nenhuma policy DELETE para `authenticated`.

---

## 6. Grants

### `authenticated`

| Tabela | Privilégios |
|---|---|
| `editorial_ai_batches` | SELECT, INSERT, UPDATE |
| `editorial_ai_cycles` | SELECT, INSERT, UPDATE |
| `editorial_ai_inputs` | SELECT, INSERT |
| `editorial_ai_requests` | SELECT |
| `editorial_ai_responses` | SELECT |
| `editorial_ai_contents` | SELECT, INSERT |
| `editorial_ai_annotations` | SELECT |
| `editorial_ai_decisions` | SELECT, INSERT |
| `editorial_ai_publications` | SELECT |

Sem DELETE. Sem UPDATE em tabelas append-only.

### `service_role`

`GRANT ALL` nas 9 tabelas.

**Nota:** IDs são UUID (`gen_random_uuid()`); não há sequences próprias. O projeto não concede `GRANT USAGE ON SCHEMA public` em migrations individuais — padrão mantido.

---

## 7. PostgREST

`NOTIFY pgrst, 'reload schema';` ao final da migration.

---

## 8. Validações realizadas (estáticas, sem banco)

| Verificação | Resultado |
|---|---|
| Ausência de `ALTER TABLE` em tabelas existentes | OK |
| FKs apontam para tabelas existentes nas migrations anteriores | OK |
| Nomes de tabelas/colunas conforme spec IT-005 | OK |
| Índices não duplicam UNIQUE/PK | OK |
| Tabelas append-only sem `updated_at` | OK |
| Policies sem `FOR ALL` | OK |
| `authenticated` sem DELETE | OK |
| `service_role` com ALL nas 9 tabelas | OK |
| `question_id` no singular | OK |
| `annotations` sem `content_id` | OK |
| `cycles.architecture_id` nullable + SET NULL | OK |
| `inputs.remaining_inputs` NOT NULL | OK |
| `contents.version` CHECK > 0 | OK |
| `actor_user_id` protegido na policy INSERT | OK |
| Busca textual por `ALTER`/`DROP TABLE` na migration | OK (nenhum) |

**Não executado:** `supabase db push`, `migration up`, reset, deploy ou lint contra banco remoto.

---

## 9. Riscos e divergências

| Item | Descrição |
|---|---|
| Docs IT-002/IT-003/IT-004 ausentes no repositório | Arquivos referenciados no escopo não estão em `docs/editorial/engine-v2/implementacao/` — apenas IT-001 e este IT-005. A migration seguiu a spec homologada do sprint IT-005 e IT-001. |
| Policies separadas vs. padrão legado | Migrations editoriais anteriores usam `FOR ALL`; IT-005 exige policies por comando — adotado conforme spec desta sprint. |

---

## 11. Revisão IT-005A — ajustes pós-auditoria

### 11.1 Critérios `editorial_ai_annotations.criterion` (AJUSTE 1)

**Análise:** IA-005 §5 lista critérios conceituais em português e declara explicitamente ausência de schema/persistência (§7). IT-003 (homologada) reserva a representação física. A sprint IT-005 original especificou CHECK com identificadores físicos canônicos.

**Decisão:** manter os 10 valores do CHECK inalterados; documentar o mapeamento normativo→físico em §2.4 (acima). Não há divergência funcional — são camadas distintas do contrato.

**SQL alterado:** nenhuma linha do CHECK.

### 11.2 Idempotência (AJUSTE 2)

**Análise do padrão real do projeto:**

| Objeto | Padrão observado nas migrations recentes | Decisão IT-005A |
|---|---|---|
| Enum | `DO $$ … IF NOT EXISTS … CREATE TYPE` (desde `20260704200000`) | Manter — já conforme |
| `CREATE INDEX` | `CREATE INDEX IF NOT EXISTS` em `20260708100000`, `20260708110000`, `20260708090000`, `20260705010000` | Adicionar `IF NOT EXISTS` |
| `CREATE POLICY` | `CREATE POLICY` direto, sem `IF NOT EXISTS`/`DROP POLICY` em todas as 20 migrations | Manter — execução única via runner Supabase |
| `CREATE TRIGGER` | `DROP TRIGGER IF EXISTS` + `CREATE TRIGGER` em migrations editoriais, mas desnecessário quando tabela nasce na mesma migration | Remover DROP (ver §11.3) |

**Conclusão:** o projeto **assume execução única** via `supabase migration` (registro em `schema_migrations`). Idempotência parcial existe apenas onde o histórico do projeto a adota: enums (`IF NOT EXISTS`) e índices (`IF NOT EXISTS`). Policies nunca são idempotentes.

### 11.3 Triggers — `DROP TRIGGER IF EXISTS` (AJUSTE 3)

**Análise:** `editorial_ai_batches` e `editorial_ai_cycles` são criadas na mesma migration, imediatamente antes dos triggers. Não existe trigger prévio a remover.

**Decisão:** remover `DROP TRIGGER IF EXISTS` (linhas 188 e 193 originais). O padrão defensivo com DROP aparece em outras migrations do projeto (ex.: `20260708100000`) como hábito de re-execução manual, mas aqui é tecnicamente redundante e a auditoria solicitou remoção quando desnecessário.

### 11.4 Enum — `DO $$ IF NOT EXISTS` (AJUSTE 4)

**Análise:** a migration inicial (`20260702152648`) usa `CREATE TYPE` direto; todas as migrations de feature posteriores a `20260704200000` usam bloco `DO $$ IF NOT EXISTS` para enums novos (`editorial_engine_v2_lite`, `exam_catalog`, `study_sessions`, `content_distributions`, etc.).

**Decisão:** manter o bloco `DO $$ IF NOT EXISTS` — alinhado ao padrão das migrations editoriais mais próximas e semanticamente equivalentes.

### 11.5 Validação pós-ajuste

| Verificação | Resultado |
|---|---|
| Nenhuma tabela mudou | OK |
| Nenhuma coluna mudou | OK |
| Nenhuma FK mudou | OK |
| Nenhuma policy mudou de escopo | OK |
| Nenhuma trigger extra surgiu | OK (2 triggers, mesmas tabelas) |
| Nenhuma alteração funcional | OK |

---

## 10. Confirmação de não-aplicação

- **Migration NÃO aplicada** no banco local ou remoto.
- **Banco NÃO alterado.**
- **Nenhum deploy** realizado.
- **Nenhum `supabase db push`** executado.

Aguardar autorização explícita para aplicar a migration.
