# G7.6A — Análise de Impacto: Suporte a Questões Certo/Errado (CEBRASPE)

**Tipo:** Relatório técnico de impacto. **Nenhum código, schema, migration ou pipeline foi alterado nesta sprint.**
**Método:** 4 agentes de exploração somente-leitura, cobrindo banco de dados/migrations, pipeline de seed/conversão + ferramenta de extração de PDF, portal administrativo e portal do aluno.

---

## Achado principal (resumo executivo)

A premissa do problema — "o sistema assume implicitamente 4–5 alternativas em todo lugar" — **só é verdadeira em duas camadas isoladas de importação em massa**. O banco de dados, o schema JSON do seed, a aplicação web (admin e portal do aluno) já são agnósticos a contagem de alternativas, com piso mínimo de 2 já aceito e testado no código atual.

| Camada | Assume 4–5 alternativas? | Precisa mudar? |
|---|---|---|
| Banco de dados (`questions`, `question_attempts`, `study_session_questions`) | **Não** — `alternatives` é `JSONB` livre, `correct_answer` é `TEXT` sem CHECK/ENUM | Não |
| RLS / views / functions / triggers | **Não** — nenhuma política ou função referencia colunas de alternativa | Não |
| Tipos gerados do Supabase (`src/integrations/supabase/types.ts`) | **Não** — `Json` e `string \| null`, já máximo permissivo | Não |
| Schema JSON do seed (`scripts/seed/questions/schema.ts`) | **Não** — já exige `min(2)` alternativas; letras `A–E` já cobrem `C`/`E` | Não |
| Hash de dedup (`scripts/seed/questions/hash.ts`) | **Não** — hash é sobre o array como veio, sem indexar posições fixas | Não |
| `seed.ts`, `export.ts`, `entities.ts` | **Não** — mapeiam o array genericamente | Não |
| Portal do aluno (render, resposta, correção, revisão, histórico, estatísticas) | **Não** — tudo itera sobre o array; regex de resposta é `/^[A-Z]$/`, não `/^[A-E]$/` | Não (cosmético em 1 arquivo) |
| Portal admin (criar/editar/importar via `src/lib/import.ts`) | **Não** — já permite reduzir para 2 alternativas hoje, inclusive pela UI | Não (cosmético em 1 arquivo) |
| **`scripts/seed/questions/convert/columns.ts` + `validate.ts`** (conversor CSV→JSON, usado por `npm run convert:questions`) | **SIM** — `alternative_a`–`d` obrigatórias sempre | **SIM — único bloqueio real do core** |
| **`tools/question-pipeline/*`** (ferramenta separada de extração de PDF) | **SIM** — heurísticas e checagem `<4` hardcoded | **SIM, mas é ferramenta opcional/paralela** |

**Conclusão mais importante para a produção editorial:** hoje, sem nenhuma alteração de código, é possível cadastrar as 89 questões Certo/Errado da EBSERH 2018 (Cargo 6) **manualmente pela UI do portal admin** (`src/components/admin/questions/QuestionsPage.tsx` já permite reduzir de 4 para 2 alternativas). O bloqueio da G7.5B foi encontrado especificamente na rota de **importação em lote via CSV** (`convert:questions`), não no sistema como um todo.

---

## Inventário arquivo por arquivo

### 1. Banco de dados

| Arquivo | Motivo do impacto | Tipo de alteração | Risco |
|---|---|---|---|
| `supabase/migrations/20260702152648_47f8254c-....sql` (`CREATE TABLE questions`, linhas 109–125) | `alternatives JSONB NOT NULL DEFAULT '[]'::jsonb` (sem CHECK de tamanho), `correct_answer TEXT` nullable, sem CHECK/ENUM restringindo a A–E | Nenhuma obrigatória. Opcional: `ADD COLUMN IF NOT EXISTS question_format TEXT NOT NULL DEFAULT 'MULTIPLE_CHOICE'` (aditiva) | BAIXO |
| `supabase/migrations/20260702152648_...sql` (`CREATE TABLE question_attempts`, linhas 180–187) | `chosen_answer TEXT` nullable, sem CHECK | Nenhuma | BAIXO |
| `supabase/migrations/20260705010000_study_sessions.sql` (`study_session_questions`, linhas 28–41) | `selected_answer`/`correct_answer TEXT` nullable, sem CHECK; único UNIQUE é `(study_session_id, question_id)`, não relacionado | Nenhuma | BAIXO |
| RLS (`read_all_questions`, `admin_write_questions`, `own_attempts`, `own_study_session_questions`) | Políticas são por linha/role (`has_role`, `user_id`), nenhuma referencia colunas de alternativa | Nenhuma | BAIXO |
| Views/functions/triggers em `supabase/migrations/` | Nenhum `CREATE VIEW` existe no projeto; funções (`has_role`, `update_updated_at_column`, `handle_new_user`, sync de packages/subscriptions) não tocam `alternatives`/`correct_answer` | Nenhuma | N/A |
| `src/integrations/supabase/types.ts` (linhas 1177–1286, 1322–1351) | `alternatives: Json`, `correct_answer: string \| null` — já sem union literal restringindo a A–E | Regenerar tipos apenas se uma coluna nova for adicionada | BAIXO |

**Achado colateral (fora do escopo pedido, mas relevante):** `read_all_questions` expõe `correct_answer` por completo a qualquer usuário autenticado via SELECT direto — não há mascaramento de gabarito em nível de RLS/view hoje, para nenhum tipo de questão. Isso não muda com Certo/Errado, mas mostra que "esconder o gabarito até a submissão" já não é garantido no banco para nenhuma questão existente.

---

### 2. Seed / pipeline central (`scripts/seed/questions/`)

| Arquivo | Motivo do impacto | Tipo de alteração | Risco |
|---|---|---|---|
| `scripts/seed/questions/schema.ts` | `alternatives: z.array(...).min(2, ...)` já aceita 2; `letter`/`correctAnswer` regex `^[A-E]$` já cobre `C`/`E` como letras | Nenhuma | BAIXO |
| `scripts/seed/questions/hash.ts` (`computeContentHash`) | `JSON.stringify` sobre o array recebido via `.map`, sem indexar posições fixas nem checar tamanho | Nenhuma | BAIXO |
| `scripts/seed/questions/seed.ts` | Insere `item.alternatives` como veio, sem checar tamanho | Nenhuma | BAIXO |
| `scripts/seed/questions/export.ts`, `entities.ts` | Mapeiam o array genericamente (`formatAlternativesForDb`/`parseAlternativesForSeed`) | Nenhuma | BAIXO |
| **`scripts/seed/questions/convert/columns.ts`** | `REQUIRED_COLUMNS` inclui `alternative_a`–`d`; `REQUIRED_ALTERNATIVE_LETTERS = ["A","B","C","D"]` — sempre obrigatórias, sem exceção por tipo de questão | Introduzir um discriminador (ex.: coluna `question_type`, ou inferir de `correct_answer` = `CERTO`/`ERRADO`) e tornar C/D condicionalmente obrigatórias | **ALTO** — módulo compartilhado, também importado por `tools/question-pipeline/src/merge.ts` |
| **`scripts/seed/questions/convert/validate.ts`** (`validateRows`) | Loop força presença de A–D incondicionalmente; `correct_answer` já aceitaria `A`/`B`/`C`/`E` sem mudança (regex `^[A-E]$` já cobre), mas o loop de alternativas rejeitaria qualquer linha de 2 alternativas hoje | Branch condicional no loop de alternativas por tipo de questão; preservar 100% do comportamento para linhas de múltipla escolha | **ALTO** — é o gate exato que hoje rejeita 100% das linhas Certo/Errado; risco de regressão nas ~1020 questões existentes se a condição do branch for mal desenhada |
| `scripts/seed/questions/convert/parse.ts` (`detectMissingColumns`) | Só checa cabeçalhos contra `REQUIRED_COLUMNS`; herda o problema de `columns.ts`, não é hardcoding independente | Nenhuma mudança própria além do que `columns.ts` exigir | BAIXO |
| `scripts/seed/questions/convert/convert.ts` | Orquestra as funções acima; não hardcoda nada por si só | Nenhuma (só precisa de teste de integração após mudar 1–2 acima) | BAIXO |
| `scripts/seed/questions/convert/generate-xlsx-example.ts` / `docs/imports/questions.csv` (template) | Gera exemplo a partir do template de 5 colunas de alternativa | Opcional: documentar/exemplificar uma linha Certo/Errado no template | BAIXO |

---

### 3. Contrato CSV — resumo

O contrato do CSV **hoje** obriga `alternative_a`–`d` preenchidas e `correct_answer` uma letra A–E que corresponda a uma alternativa informada. Esse é precisamente o ponto onde a importação da EBSERH 2018 foi bloqueada na G7.5B. A validação de `correct_answer` em si (regex `^[A-E]$`) **não precisa mudar** — o problema é exclusivamente a exigência incondicional de `alternative_c`/`alternative_d`.

---

### 4. Ferramenta separada de extração de PDF (`tools/question-pipeline/`)

Não faz parte do fluxo mínimo necessário (CSV pode ser preenchido manualmente), mas foi mapeada porque a Sprint pediu cobertura completa.

| Arquivo | Motivo do impacto | Tipo de alteração | Risco |
|---|---|---|---|
| `tools/question-pipeline/src/types.ts` | `alternatives: Partial<Record<"A"\|"B"\|"C"\|"D"\|"E", string>>` — tipo já compatível com um subconjunto de 2 chaves | Nenhuma | BAIXO |
| `tools/question-pipeline/src/parse-prova.ts` | `altCount < 2` só gera aviso; `altCount !== 4 && !== 5` marca `REVIEW_REQUIRED` mesmo sendo válido. Mais fundamental: o detector de alternativas procura marcadores `a)`/`(B)` no texto — **provas CEBRASPE Certo/Errado não têm esses marcadores no PDF**, então a extração tende a não encontrar nenhuma alternativa, não duas | Novo modo de extração dedicado (detectar gabarito C/E por número de item, sem procurar marcadores de alternativa) — redesenho, não ajuste pontual | **ALTO** — maior esforço de todo o relatório |
| `tools/question-pipeline/src/validate.ts` | `Object.keys(q.alternatives).length < 4` bloqueia com `process.exit(1)` qualquer questão `VALID` com menos de 4 alternativas | Branch por tipo de questão, ou afrouxar para `< 2` | **ALTO** — bloqueio duro, não apenas aviso |
| `tools/question-pipeline/src/merge.ts` | Reimporta `REQUIRED_ALTERNATIVE_LETTERS` de `columns.ts` e reforça a mesma exigência A–D | Acompanhar mecanicamente qualquer mudança em `columns.ts` (fix duplo, fácil de esquecer) | MÉDIO |
| `tools/question-pipeline/src/export-csv.ts`, `alternative-markers.ts`, `parse-gabarito.ts` | Escrevem colunas `alternative_c`/`d`/`e` vazias (inofensivo); `ANSWER_TOKEN` regex `^(\*|ANULAD[AO]|[A-Ea-e])$` não distingue gabarito Certo/Errado ("C"/"E") de letras de alternativa ("C"/"E") — risco de má-interpretação silenciosa se a ferramenta for usada em um PDF CEBRASPE sem o modo dedicado do item acima | Ajuste de regex/heurística acoplado ao redesenho do `parse-prova.ts` | MÉDIO (risco de misparse silencioso, contido a esta ferramenta opcional) |

---

### 5. Tipos TypeScript

Já cobertos acima por camada. Resumo: **nenhum tipo do domínio de aplicação usa union literal `"A"|"B"|"C"|"D"|"E"`** nem interface com campos fixos `alternativeA..E`. O único lugar com union restrita é o Zod schema do seed (`schema.ts`, `^[A-E]$`), que já aceita 2 alternativas.

---

### 6. Portal Administrativo

| Arquivo | Motivo do impacto | Tipo de alteração | Risco |
|---|---|---|---|
| `src/lib/questions.ts` (`validateQuestionInput`, `parseAlternativesFromDb`) | Já exige só `formatted.length >= 2`; `correctAnswer` regex `^[A-Z]$` (qualquer letra, não só A–E) | Nenhuma | BAIXO |
| `src/components/admin/questions/QuestionsPage.tsx` | Template padrão de nova questão cria 4 alternativas vazias, mas `addAlternative`/`removeAlternative` já permitem ir até o piso de 2 — **um admin já consegue salvar uma questão Certo/Errado hoje, manualmente** | Nenhuma obrigatória. Opcional (UX): permitir letra customizada em vez de sempre `A,B,C,D` sequencial; botão de template rápido "Certo/Errado" | BAIXO funcional / MÉDIO se quiserem boa UX dedicada |
| `src/routes/_authenticated/admin/questions.tsx` | Wrapper de rota, sem lógica própria | Nenhuma | BAIXO |
| `src/lib/import.ts` (importação avulsa pela UI admin, diferente do `convert:questions` CLI) | `REQUIRED_COLUMNS` usa 1 coluna `alternatives`/`alternativas` (não `alternative_a..e`); exige só `length >= 2` | Nenhuma — já aceita 2 alternativas hoje | BAIXO |
| `src/components/admin/import/ImportPage.tsx` | Preview mostra `# / Enunciado / Gabarito / Disciplina`, não lista alternativas — agnóstico à contagem | Nenhuma | BAIXO |
| `src/routes/_authenticated/admin/export.tsx` | `select("*")` genérico, exporta o que existir | Nenhuma | BAIXO |

---

### 7. Portal do Aluno

| Arquivo | Motivo do impacto | Tipo de alteração | Risco |
|---|---|---|---|
| `src/components/app/study/QuestionOptions.tsx` | Renderiza via `alternatives.map(...)`, sem contagem fixa nem slots A–E | Nenhuma obrigatória. Cosmético: rótulo "Alternativas" (plural genérico) e caixas com `min-h` dimensionadas para texto longo ficam com espaço vazio para "Certo"/"Errado" curtos | BAIXO |
| `src/lib/study-engine.ts` (`saveAnswer`) | `selectedAnswer` validado com `/^[A-Z]$/`; comparação direta com `correct_answer`, sem checar se a letra pertence de fato às alternativas da questão | Nenhuma | BAIXO |
| `src/components/app/study/QuestionFeedbackPanel.tsx` | Texto fixo `"Alternativa {letter}"` no feedback — soa estranho para Certo/Errado (ex. "Alternativa C" em vez de "Gabarito: Certo") | Cosmético: mapear rótulo por tipo de questão, ou mostrar o texto completo da alternativa em vez de só a letra | **MÉDIO** — funciona, mas a cópia fica incorreta/confusa sem esse ajuste |
| `QuestionCard.tsx`, `QuestionActions.tsx`, `SessionResultsView.tsx`, `SessionResultsSummaryCards.tsx`, `SessionResultsPerformanceTable.tsx`, `SessionSummaryPanel.tsx`, `SessionProgress.tsx`, tabelas de histórico | Operam sobre `isCorrect`/contagens/datas — nenhuma inspeciona letra ou contagem de alternativa | Nenhuma | BAIXO |
| `src/routes/api/` | Único route handler é o webhook do Asaas; toda a lógica de resposta/correção roda client-side contra o Supabase (sem endpoint server-side de correção a atualizar) | Nenhuma | BAIXO |
| `supabase/migrations/20260705010000_study_sessions.sql` | Já coberto na seção de banco | — | BAIXO |

**Gap identificado (não é bloqueio, é ausência de funcionalidade):** não existe hoje nenhum campo "tipo de questão" no banco nem nos tipos TypeScript. A UI infere tudo por `alternatives.length`. Isso significa que uma questão de 2 alternativas já renderiza e corrige certo hoje, mas não há como a UI saber "isto é Certo/Errado, use rótulo e estilo diferentes" — ela trataria como uma múltipla escolha de 2 opções genérica. Só é relevante se quiserem tratamento visual dedicado (badges verde/vermelho "Certo"/"Errado" em vez de letras).

---

## Respostas às 4 perguntas finais

### 1. É possível adicionar suporte a TRUE_FALSE preservando 100% da compatibilidade com as questões atuais?

**Sim**, com alta confiança, sustentada por evidência independente em 4 frentes (banco, seed/schema, admin, aluno): nenhuma delas tem uma trava que precise ser afrouxada às custas de comportamento existente. O piso de 2 alternativas já é aceito em todo o sistema de aplicação (`schema.ts`, `src/lib/questions.ts`, `src/lib/import.ts`) — só a rota específica de importação em lote via CSV (`convert:questions`) e a ferramenta separada de extração de PDF hardcodam 4–5. Uma mudança bem escopada nessas duas rotas de entrada, feita como branch condicional (não substituição), preserva 100% do caminho atual para questões de múltipla escolha.

### 2. Quais arquivos realmente precisam ser alterados?

**Para desbloquear import em lote via CSV** (o caminho oficial do fluxo G7.5B):
- `scripts/seed/questions/convert/columns.ts` — discriminador de tipo + tornar C/D condicionais.
- `scripts/seed/questions/convert/validate.ts` — branch condicional no loop de alternativas.

**Nenhum outro arquivo do core precisa mudar** — DB, RLS, `schema.ts`, `hash.ts`, `seed.ts`, `export.ts`, `entities.ts`, `src/lib/questions.ts`, `src/lib/study-engine.ts`, `src/lib/import.ts`, `QuestionOptions.tsx`, admin import/export UI já funcionam sem alteração.

**Opcionais (UX, não bloqueiam funcionalidade):**
- `src/components/app/study/QuestionFeedbackPanel.tsx` — copy do gabarito.
- `src/components/admin/questions/QuestionsPage.tsx` — letra customizável / template rápido.
- Nova coluna `question_format` (migration aditiva) + regenerar `types.ts` — só se quiserem diferenciação visual futura.

**Escopo maior e separado, só se quiserem extração automática de PDF CEBRASPE:**
- `tools/question-pipeline/src/parse-prova.ts`, `validate.ts`, `merge.ts`, `parse-gabarito.ts`, `alternative-markers.ts`.

### 3. Existe alguma migração obrigatória?

**Não.** Nenhuma migração de banco é necessária para armazenar, cadastrar (admin), responder, corrigir, revisar ou contabilizar estatísticas de uma questão Certo/Errado — o schema atual (`alternatives JSONB`, `correct_answer TEXT`, ambos sem CHECK/ENUM) já comporta isso. Uma migração aditiva (`ADD COLUMN IF NOT EXISTS question_format TEXT NOT NULL DEFAULT 'MULTIPLE_CHOICE'`) é **opcional**, só relevante se quiserem tratamento visual/textual diferenciado (item 2 dos opcionais) — nada no schema atual bloqueia essa adição futura (sem NOT NULL conflitante, sem CHECK, sem ENUM, sem view/function dependente).

### 4. Qual a estratégia de menor risco?

Faseada, do menor para o maior risco/esforço:

- **Fase 0 — risco zero, disponível hoje, sem tocar em código:** cadastrar as 89 questões da EBSERH 2018 Cargo 6 manualmente pela UI do portal admin (`QuestionsPage.tsx`), reduzindo para 2 alternativas por questão. Já funciona com o código atual. Desbloqueia a G7.5B imediatamente, ao custo de digitação manual (89 questões) em vez de importação em lote.
- **Fase 1 — risco BAIXO/MÉDIO, se quiserem importação em lote via CSV no futuro:** alterar só `columns.ts` + `validate.ts` com branch condicional por tipo de questão; testar exaustivamente contra o acervo atual (1.020 questões) para garantir zero regressão antes de aplicar.
- **Fase 2 — opcional, escopo separado:** coluna `question_format` aditiva + ajustes de copy/UX (`QuestionFeedbackPanel`, rótulos, badges) para diferenciação visual "Certo/Errado" em vez de reaproveitar letras A/B.
- **Fase 3 — opcional, maior esforço, escopo separado:** suporte a extração automática via `tools/question-pipeline` — não bloqueia nenhuma fase anterior; por ser ferramenta auxiliar, pode ficar de fora indefinidamente sem impedir produção via CSV manual ou UI admin.

**Recomendação de menor risco para desbloquear especificamente a G7.5B agora:** Fase 0.

---

Nenhum arquivo de código, schema, migration ou pipeline foi alterado nesta sprint. Relatório entregue para aprovação. Parado.
