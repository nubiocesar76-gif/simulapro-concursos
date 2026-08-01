# ANÁLISE ARQUITETURAL — ADEQUAÇÃO DO PIPELINE PARA CONTEÚDO EDITORIAL INÉDITO — V1

## Objetivo e status

Análise técnica pura, sem nenhuma alteração de arquivo, código, schema ou migration. Investiga a causa raiz do achado da Sprint 6.6 (`HOMOLOGACAO_IMPORTACAO_URGENCIA_EMERGENCIA_V1.md`) e propõe a menor alteração arquitetural possível. Todas as afirmações abaixo foram confirmadas por leitura direta de código-fonte ou consulta de leitura ao banco de produção — nenhuma foi assumida.

---

# 1. `contest` — por que é obrigatório, onde é usado, quem depende dele

**Obrigatoriedade:** existe em exatamente um lugar — [scripts/seed/questions/convert/validate.ts:170-177](scripts/seed/questions/convert/validate.ts#L170-L177) (bloco `if (!contest) issues.push(...)`). É uma regra de validação de **aplicação**, dentro do conversor CSV, não uma restrição de banco.

**No banco:** `contest` não existe como coluna de `questions`. O que existe é `questions.exam_id` (FK opcional para `exams`), confirmado nulo por padrão em [src/integrations/supabase/types.ts:1585](src/integrations/supabase/types.ts#L1585) (`exam_id: string | null`) e sem nenhuma constraint `NOT NULL` em nenhuma migration (`grep` em `supabase/migrations/*.sql` não encontrou nenhuma). A tabela `exams` (`types.ts:1218-1252`) também tem `year: number | null` — nula por padrão.

**Quem realmente depende dele (usos confirmados por leitura de código):**
- [scripts/seed/questions/convert/validate.ts:172](scripts/seed/questions/convert/validate.ts#L172) — `hasContest(sets, board, contest)`, valida contra `docs/seeds/taxonomy.json`. Só existem concursos reais catalogados ali (confirmado: as 204 linhas de `docs/imports/questions.csv` e as 14 combinações banca/concurso do `taxonomy.json` são 100% provas reais, nenhuma "conteúdo inédito").
- [src/components/admin/questions/QuestionsPage.tsx:333-343](src/components/admin/questions/QuestionsPage.tsx#L333-L343) — filtro admin "Concurso" (`filters.exam`), aplicado só quando um valor específico é escolhido; com `ALL` (padrão), não filtra nada.
- [src/components/admin/questions/QuestionsPage.tsx:204](src/components/admin/questions/QuestionsPage.tsx#L204) — formulário manual de criação de questão: `exam_id: form.examId || null` — **já é opcional aqui**, com opção explícita `"__none__"` no `<Select>` ([linha 837](src/components/admin/questions/QuestionsPage.tsx#L837)).
- [src/lib/import.ts:421-422](src/lib/import.ts#L421-L422) — importador em massa (admin, `applyImportBatch`): `exam_id = r.exam && board_id ? await resolveByName(...) : null` — **também já opcional**, `exam_id` fica `null` se a coluna vier vazia.

**Quem NÃO depende dele:** o filtro de sessão do aluno (`study-builder.ts`), a Central de Revisão (`review-center.ts`) e o card de questão exibido ao aluno (`QuestionMetadataBadges.tsx`) não leem `exam_id`/`contest` em nenhum momento — só `board_id`/`board_name`. Não há badge "Concurso" na experiência do aluno.

**Conclusão do item 1:** `contest` só é obrigatório dentro de `scripts/seed/questions/convert/validate.ts`. Em todo o resto do sistema (banco, formulário manual, importador em massa admin, experiência do aluno) já é opcional.

---

# 2. `year` — por que é obrigatório, onde é usado, quem depende dele

**Obrigatoriedade:** também isolada em [scripts/seed/questions/convert/validate.ts:190-207](scripts/seed/questions/convert/validate.ts#L190-L207) (bloco do `yearRaw`).

**No banco:** `questions.year: number | null` ([types.ts:1596](src/integrations/supabase/types.ts#L1596)), nulo por padrão, sem constraint.

**Quem realmente depende dele (mais espalhado que `contest`, mas sempre de forma null-tolerante):**
- [src/lib/study-builder.ts:98](src/lib/study-builder.ts#L98) — filtro de ano na sessão do aluno: só filtra se `filters.year !== ALL_FILTER`; sem filtro, questões com `year: null` aparecem normalmente.
- [src/lib/study-builder.ts:170](src/lib/study-builder.ts#L170) — `buildYearOptions`: `if (question.year == null) continue;` — questão sem ano simplesmente não aparece na lista de anos disponíveis, não quebra nada.
- [src/components/app/study/QuestionMetadataBadges.tsx:13](src/components/app/study/QuestionMetadataBadges.tsx#L13) — badge "Ano" ao aluno: `context.year ? {...} : null` — condicional, mesmo padrão já usado para os blocos opcionais do SIA.
- [src/lib/review-center.ts:97,131,139,273,384,429](src/lib/review-center.ts) — Central de Revisão também filtra e exibe `year`, com o mesmo padrão de filtro condicional de `study-builder.ts`.
- [src/lib/questions.ts:151-157](src/lib/questions.ts#L151-L157) (`validateQuestionInput`, usado pelo formulário manual admin): `let year: number | null = null; if (normalizeText(input.year)) { ... }` — **já opcional**, só valida faixa (1900-2100) se preenchido.
- [src/components/admin/questions/QuestionsPage.tsx:713-719](src/components/admin/questions/QuestionsPage.tsx#L713-L719) — campo "Ano" do formulário **não tem atributo `required`** (diferente de "Enunciado"/"Gabarito", que têm, linhas 659 e 709).
- [src/lib/import.ts:441](src/lib/import.ts#L441) — importador em massa admin: `year: r.year ? Number(r.year) || null : null` — opcional.

**Conclusão do item 2:** exatamente o mesmo padrão de `contest` — obrigatório só dentro do conversor CSV; em todo o resto do sistema já é opcional e já é tratado como tal, de ponta a ponta, sem nenhum ponto de quebra encontrado (nenhum `.year!`, `.year.toString()` sem guarda, ou aritmética direta sobre `year` foi encontrado em todo `src/`).

---

# 3. Como questões reais são diferenciadas hoje

**Não são.** Não existe nenhuma coluna `origin`/`source`/`content_type` em `questions` (confirmado no schema completo, `types.ts:1578-1687`). O único sinal indireto hoje é:
- `exam_id: null` — usado por `convergence.server.ts` para marcar "não pertence a nenhum concurso real" (comentário explícito, linha 206), mas **nada impede** que uma questão real tenha `exam_id: null` só porque o admin esqueceu de preencher no formulário manual (`examId` é opcional lá também) — ou seja, `exam_id: null` hoje **não é uma prova de proveniência**, é apenas "não informado".
- `metadata.editorial_ai_cycle_id` — presente **só** em questões que passaram pelo Motor Editorial de IA via `convergence.server.ts` ([linha 212-213](src/lib/editorial-ai/publish/convergence.server.ts#L212-L213)). Não é um campo tipado em `QuestionMetadataFields` ([src/lib/questions.ts:8-28](src/lib/questions.ts#L8-L28)) — é escrito ad-hoc, fora de `buildQuestionMetadata()`.

**Conclusão do item 3:** hoje não há como distinguir de forma confiável e consultável (1) prova real com concurso identificado, (2) conteúdo gerado pelo Motor Editorial de IA, e (3) conteúdo inédito escrito pela trilha metodológica (Dossiê → Plano → Lote, como as 10 questões desta disciplina) — as três categorias colapsam no mesmo estado `exam_id: null` sem metadado tipado que as diferencie. Isso é relevante para a Alternativa B abaixo.

---

# 4. Como `convergence.server.ts` trata conteúdo editorial

Já lido integralmente em sprint anterior; resumo com linhas exatas:
- [linha 206](src/lib/editorial-ai/publish/convergence.server.ts#L206): `exam_id: null, // conteúdo inédito por IA — não pertence a nenhum concurso real (IA-001 §7.2)`.
- Não define `year` no payload de inserção (linhas 199-214) — fica `null` por omissão, o schema aceita.
- Resolve `subject_id`/`topic_id` por **nome exato** contra as tabelas reais (`resolveSubjectByName`/`resolveTopicByName`, [taxonomy-resolution.server.ts](src/lib/editorial-ai/publish/taxonomy-resolution.server.ts)), nunca cria taxonomia nova, e só publica quando a resolução é inequívoca (regra 4/5 do IA-007, comentário linha 20-27).
- Exige `packageId`/`packageVersionId` explícitos como parâmetro da função ([linha 110-114](src/lib/editorial-ai/publish/convergence.server.ts#L110-L114)), não como coluna de um CSV.
- **Mas exige um `cycleId` real** ([linha 116-117](src/lib/editorial-ai/publish/convergence.server.ts#L116-L117): `editorialAiCycleService.getCycle(input.cycleId)`), isto é, depende de linhas já existentes em `editorial_ai_cycles`/`editorial_ai_contents`/`editorial_ai_inputs`. Não aceita um payload avulso — não é um "conversor de arquivo", é um "publicador de ciclo já gerado pelo orquestrador de IA".

**Conclusão do item 4:** `convergence.server.ts` já resolve o problema de proveniência de forma correta e elegante (`exam_id: null`, sem `year`, resolução de taxonomia por nome) — mas está acoplado ao pipeline de IA (`editorial_ai_cycles`), não a conteúdo redigido manualmente pela trilha metodológica. É a prova viva de que o modelo de dados já suporta este caso de uso; falta um caminho de entrada equivalente para quem não passou pelo orquestrador de IA.

---

# 5. Quais tabelas realmente precisam de `contest`/`year`

Apenas `exams` precisa de `year` para ter sentido semântico (um concurso real tem um ano). Nenhuma outra tabela tem `contest` como conceito — `questions` só tem `exam_id` (opcional) e `year` (opcional, e semanticamente redundante com `exams.year` quando `exam_id` está preenchido, mas independente quando não está — o que já é o padrão atual: `year` em `questions` existe mesmo para linhas sem `exam_id`, ver `types.ts:1585,1596`, ambos `| null` e sem relação de obrigatoriedade cruzada). Nenhuma tabela teria uma linha órfã ou uma FK quebrada se `contest`/`year` ficassem vazios para uma questão — a FK `questions_exam_id_fkey` ([types.ts:1645-1650](src/integrations/supabase/types.ts#L1645-L1650)) simplesmente não é exercida quando `exam_id` é `null`.

---

# 6. Quais componentes exibem essas informações

| Componente | Exibe `exam`/`contest`? | Exibe `year`? |
|---|---|---|
| `QuestionMetadataBadges.tsx` (aluno, card da questão) | Não | Sim, condicional (linha 13) |
| `StudyBuilderFiltersPanel.tsx` / `StudyBuilderSummary.tsx` (aluno, montar sessão) | Não | Sim (filtro + resumo) |
| `QuestionsPage.tsx` (admin, lista/formulário) | Sim (coluna "Concurso" + filtro + campo do formulário, opcional) | Sim (campo do formulário, opcional) |
| `ExamsPage.tsx` (admin, taxonomia) | Sim (é a tela de CRUD da entidade `exams` em si) | Sim (campo `year` do concurso) |
| `SessionResultsView.tsx` / Central de Revisão | Não `exam` | Sim, `year` (mesmo padrão condicional) |

**Conclusão do item 6:** nenhum componente do lado do aluno depende de `exam_id`. `year` é exibido em 3 lugares, sempre com renderização condicional já pronta para `null`.

---

# 7. Quais filtros dependem desses campos

- `study-builder.ts` (sessão do aluno): filtra por `board_id`, `subject_id`, `topic_id`, `year` — **não filtra por `exam_id`**.
- `review-center.ts` (Central de Revisão): mesmo padrão, filtra por `year`, não por `exam_id`.
- `QuestionsPage.tsx` (admin): único lugar do sistema que filtra por `exam_id` (`filters.exam`, linha 343) — filtro opcional, `ALL` por padrão.

**Conclusão do item 7:** nenhum filtro do lado do aluno depende de `exam_id`; o filtro de `year` do aluno já tolera `null` (exclui a questão só da lista de opções de ano, nunca do resultado quando "Todos os anos" está selecionado).

---

# 8. Quais APIs dependem desses campos

- `getQuestionForStudy` ([src/lib/study-question-detail.functions.ts:155,182](src/lib/study-question-detail.functions.ts#L155)) — seleciona e repassa `year: question.year` (`number | null`, já tipado nulo) — não seleciona `exam_id`/`exams(...)` em nenhum ponto da query.
- `fetchStudyBuilderCatalog` ([src/lib/study-builder.ts:229-244](src/lib/study-builder.ts#L229-L244)) — mesma coisa, seleciona `year, board_id, subject_id, topic_id` e os joins `boards/subjects/topics` — **não seleciona `exam_id`**.
- `applyImportBatch` ([src/lib/import.ts:391-491](src/lib/import.ts#L391-L491)) — única API que resolve `exam_id`, e já opcionalmente (linha 421-422).

**Conclusão do item 8:** nenhuma API server-side do lado do aluno lê ou depende de `exam_id`. `year` é lido em 2 APIs, ambas já tipadas como `number | null`.

---

# DIAGNÓSTICO CONSOLIDADO

A obrigatoriedade de `contest`/`year` **não é uma decisão arquitetural do sistema como um todo** — é uma regra de validação isolada dentro de um único arquivo (`scripts/seed/questions/convert/validate.ts`), escrita para um único caso de uso (conversão de planilhas de provas reais extraídas de PDF, confirmado pelo comentário do próprio `convert-questions.ts`: "Fluxo oficial: CSV/XLSX → questions.json → npm run seed:questions" e por 100% do histórico real de uso desse arquivo). Em todas as outras 6 camadas investigadas (schema, formulário manual admin, importador em massa admin, filtros do aluno, componentes do aluno, `convergence.server.ts`), `exam_id`/`year` nulos já são o comportamento suportado, testado pelo próprio uso real do sistema (`convergence.server.ts` já roda em produção com `exam_id: null`).

---

# ALTERNATIVAS

## A) Permitir `contest`/`year` nulos para conteúdo editorial

**Como:** em `validate.ts`, tornar `contest` opcional quando uma nova coluna/flag explícita indicar "conteúdo inédito" (ex.: `origin=inedito` ou simplesmente `contest` vazio **e** `package` presente, já que `package`/`package_version` não têm equivalente em prova real avulsa nesta plataforma — toda prova real já usa o pacote `banco-de-questoes-enfermagem` também, então isso sozinho não diferencia; precisaria de um sinal explícito).

**Prós:** menor alteração possível — 1 arquivo (`validate.ts`), lógica já provada seguindo o padrão de `convergence.server.ts` e do formulário manual admin. Nenhuma migration. Nenhuma tabela nova.

**Contras:** sem um sinal explícito de "isto é inédito", a ausência de `contest`/`year` fica ambígua — um erro real de preenchimento (analista esqueceu de preencher o concurso de uma prova real) passaria a ser aceito silenciosamente, perdendo a proteção que a regra atual oferece para o caso de uso original (provas reais). Precisa de uma segunda coluna/sinal para não enfraquecer a validação existente.

## B) Criar um novo tipo de origem (`question_origin`)

**Como:** nova coluna em `questions` (ex.: `origin: 'REAL_EXAM' | 'EDITORIAL_AI' | 'EDITORIAL_MANUAL'`), preenchida por todos os caminhos de inserção (`applyImportBatch`, `convergence.server.ts`, formulário manual, e o novo caminho de CSV editorial). `validate.ts` passaria a exigir `contest`/`year` **apenas quando `origin=REAL_EXAM`**.

**Prós:** resolve de uma vez o Achado Técnico 3 já registrado na Sprint 6.6 (ausência de qualquer sinal confiável de proveniência, item 3 desta análise) — não é só uma gambiarra de validação, é a modelagem correta do problema real (hoje inexistente). Explícito, consultável, não ambíguo.

**Contras:** exige 1 migration (`ALTER TABLE questions ADD COLUMN origin ...`), e alterar todos os pontos de inserção já mapeados (`applyImportBatch`, `convergence.server.ts`, `QuestionsPage.tsx` buildPayload, o novo conversor CSV) para preencherem o campo — mais arquivos tocados que a Alternativa A, mas ainda contido (schema aditivo, sem quebrar nada existente, coluna nova sempre com default).

## C) Criar tabela específica para conteúdo editorial

**Como:** uma tabela paralela (`editorial_questions` ou similar) para conteúdo inédito, convergindo para `questions` só na publicação (padrão parecido com `editorial_ai_cycles`/`editorial_ai_contents` → `convergence.server.ts`, mas para a trilha manual).

**Prós:** isolamento total do caso de uso "prova real" — nunca haveria risco de um dado de conteúdo inédito contaminar a lógica de provas reais.

**Contras:** replica uma solução que **já existe** (o par `editorial_ai_cycles`/`convergence.server.ts`) para um caso de uso que é conceitualmente o mesmo (conteúdo sem concurso real de origem) — criaria duas tabelas/dois pipelines de convergência fazendo a mesma coisa por caminhos de autoria diferentes (IA vs. manual). Maior superfície de manutenção, maior risco de os dois pipelines divergirem com o tempo. Desproporcional ao problema real (2 campos obrigatórios sem valor honesto).

## D) Outra alternativa encontrada durante a análise — reaproveitar `convergence.server.ts`/`editorial_ai_cycles` como via de entrada também para conteúdo manual

**Como:** ao invés de criar um pipeline novo (Alternativas A/B) ou uma tabela nova (C), inserir as 10 questões manuais diretamente como registros de `editorial_ai_cycles`/`editorial_ai_contents`/`editorial_ai_inputs` já em estado `APROVADO_EDITORIAL` (pulando as etapas de geração/auditoria de IA, que não se aplicam a conteúdo já escrito e já aprovado pelo Gate desta trilha), e então usar `convergence.server.ts`/`publish-cycle.ts` como já existem, sem nenhuma alteração de código.

**Prós:** zero alteração de código ou schema — usa 100% do que já existe e já está testado em produção (Sprints 7.1/7.1A).

**Contras:** semanticamente estranho — `editorial_ai_cycles` tem colunas específicas do fluxo de IA (prompt, resposta bruta do modelo, métricas do orquestrador) que não fariam sentido para conteúdo redigido manualmente; "forjar" um ciclo de IA para conteúdo que nunca passou por IA mistura dois conceitos que deveriam ser distintos, e viola o espírito de "não devemos contornar o problema, devemos identificar a solução arquitetural correta" desta própria sprint. Registrado aqui pela obrigação de citar alternativas encontradas, não como recomendação.

## Comparação e recomendação

| Critério | A | B | C | D |
|---|---|---|---|---|
| Menor alteração | ✓✓ (1 arquivo) | ✓ (1 migration + ~4 arquivos) | ✗ (tabela + pipeline novos) | ✓✓ (0 arquivos, mas semanticamente incorreto) |
| Resolve a causa raiz (item 3, ausência de proveniência) | ✗ (só sintoma) | ✓✓ | ✓ | ✗ |
| Risco de enfraquecer validação de provas reais | Alto, sem sinal extra | Baixo (`origin` explícito) | Nenhum (isolado) | N/A |
| Consistência com o que já existe (`convergence.server.ts`) | Parcial | ✓✓ (mesmo espírito, `origin` generaliza o `exam_id: null` já usado) | Duplica | Reaproveita indevidamente |

**Recomendação: Alternativa B**, com uma ressalva de escopo mínimo: a coluna `origin` não precisa ser um enum elaborado nem migrar dados históricos — pode nascer com um `DEFAULT` que preserva o comportamento atual (todas as ~1349 questões existentes continuam implicitamente "prova real", já que hoje é a única categoria que o sistema garante) e passar a ser preenchida explicitamente só pelos caminhos de inserção que já existem. Isso resolve ao mesmo tempo o achado da Sprint 6.6 (`contest`/`year` obrigatórios sem valor honesto) e o achado do item 3 desta análise (ausência de qualquer sinal de proveniência), sem duplicar o que `convergence.server.ts` já faz bem.

---

# TAXONOMIA — Escala de Coma de Glasgow

**Pergunta:** deveria existir como tópico oficial (`topics`), ou permanecer como conteúdo de outro tópico?

**Resposta: deve permanecer como conteúdo do tópico existente `atendimento-ao-politraumatizado` — não deve virar um `topics` novo.** Esta resposta **corrige** o tratamento dado ao tema na Sprint 6.6, que classificou a ausência de um tópico "Glasgow" como um bloqueio de importação — a investigação mais profunda desta sprint mostra que não é um gap a ser preenchido, é o comportamento correto do sistema, já em uso.

**Evidência 1 — banco atual (a mais forte):** consulta real ao Supabase de produção encontrou **7 questões reais** com "Glasgow" no enunciado, dentro da disciplina Urgência e Emergência, e **as 7 já estão classificadas sob o tópico `Atendimento ao Politraumatizado`** — 0 exceções. O próprio acervo real, construído antes desta sprint e sem nenhuma influência dela, já resolveu esta pergunta na prática.

**Evidência 2 — granularidade da tabela `topics`:** os 10 tópicos reais da disciplina não têm correspondência 1:1 com os 26 capítulos do Dossiê Mestre — são mais próximos do grão "assunto"/macrotema. Prova: o Macrotema 3 (Suporte de Vida) tem 5 capítulos no Dossiê (3.1-3.5) e só 1 tópico real (`parada-cardiorrespiratoria-e-rcp`); o Macrotema 5 (Emergências Traumáticas) tem 6 capítulos (5.1-5.6) e também só 1 tópico real (`atendimento-ao-politraumatizado`). Criar um tópico exclusivo para o capítulo 5.2 quebraria essa convenção já estabelecida em toda a disciplina — o mesmo problema existiria para Choque (5.3), Queimaduras (5.4), Afogamento (5.5) e Trauma Raquimedular (5.6), nenhum dos quais tem tópico próprio hoje.

**Evidência 3 — Dossiê Mestre e Inteligência Editorial:** o Dossiê trata Glasgow como capítulo (subassunto) dentro do Macrotema 5, nunca como macrotema/assunto independente. A Inteligência Editorial já registrou evidência real recorrente para Glasgow (FGV 2014/2024, IBFC 2023) e uma pegadinha catalogada — mas frequência real alta justifica **prioridade de produção** (já refletido no Plano, capítulo 5.2 em Muito Alta Prioridade), não necessariamente uma entidade de taxonomia própria. O mesmo padrão (subassunto de alta frequência sem `topics` dedicado) já existe para outros capítulos em outras disciplinas homologadas nesta trilha.

**Encaminhamento consistente com `QUESTION_SPEC_V1.md` (Seção 9):** subassunto não tem coluna dedicada em nenhuma disciplina do sistema hoje — o fallback já documentado é `metadata`/`editorial_metadata`. Glasgow deve seguir esse mesmo padrão (capturado em metadata como subassunto do tópico "Atendimento ao Politraumatizado"), não abrir uma exceção estrutural só para esta disciplina.

**Correção explícita ao achado da Sprint 6.6:** Q9 e Q10 (as duas questões de Glasgow do lote piloto) **não estão de fato bloqueadas por um gap de taxonomia real** — o bloqueio identificado na Sprint 6.6 foi causado por eu ter usado `escala-de-coma-de-glasgow` como valor de teste no CSV para expor deliberadamente a situação, não pela inexistência de um lugar honesto para essas questões. O valor correto de `topic` para Q9/Q10, seguindo o padrão real já em produção, é `atendimento-ao-politraumatizado` — o mesmo already usado nas 7 questões reais equivalentes. Isso deve ser corrigido na próxima execução prática do lote (fora do escopo desta sprint, que é só análise).

---

# ENTREGA

## 1. Diagnóstico do problema
A obrigatoriedade de `contest`/`year` é uma regra de validação local de um único arquivo (`scripts/seed/questions/convert/validate.ts`), desenhada exclusivamente para o caso de uso "planilha de prova real extraída de PDF" — nunca para conteúdo inédito. Em todas as demais 6 camadas do sistema investigadas, `exam_id`/`year` nulos já são suportados e já estão em uso real (`convergence.server.ts` em produção). O problema não é estrutural ao sistema — é uma lacuna pontual em um validador que nunca precisou lidar com este caso de uso até agora.

## 2. Arquivos envolvidos
- `scripts/seed/questions/convert/validate.ts` (linhas 170-177 e 190-207) — origem da obrigatoriedade.
- `scripts/seed/questions/convert/columns.ts` — contrato de colunas, sem campo de proveniência.
- `src/integrations/supabase/types.ts` (linhas 1578-1687, 1218-1252) — schema real, já nulo-tolerante.
- `src/lib/editorial-ai/publish/convergence.server.ts` (linha 206) — precedente real de `exam_id: null`.
- `src/lib/questions.ts` (linhas 8-28, 129-160) — `QuestionMetadataFields` e `validateQuestionInput`, sem campo de proveniência, `year` já opcional.
- `src/lib/import.ts` (linhas 391-491) — importador em massa admin, já opcional.
- `src/lib/study-builder.ts`, `src/lib/review-center.ts`, `src/lib/study-question-detail.functions.ts` — consumidores, já nulo-tolerantes.
- `src/components/admin/questions/QuestionsPage.tsx` — único ponto com filtro/exibição de `exam`, já opcional.

## 3. Impacto
Hoje: nenhuma questão inédita da trilha metodológica pode ser convertida pelo pipeline CSV oficial sem falsificar `contest`/`year`. Isso já bloqueou 10/10 questões do piloto de Urgência e Emergência (Sprint 6.6) e bloquearia qualquer disciplina futura pela mesma trilha (Saúde Coletiva, Processo de Enfermagem, UTI incluídas, caso usem este mesmo pipeline no futuro). Não há impacto em provas reais já importadas nem em nenhuma funcionalidade do aluno.

## 4. Melhor solução arquitetural
**Alternativa B — nova coluna `questions.origin`** (`REAL_EXAM` por padrão / `EDITORIAL_INEDITO` ou equivalente), com `contest`/`year` passando a ser exigidos por `validate.ts` apenas quando a linha do CSV representa conteúdo com `origin=REAL_EXAM` (inferido, por exemplo, pela ausência de uma nova coluna opcional `origin` no CSV, mantendo REAL_EXAM como padrão retrocompatível). Resolve tanto o sintoma (Sprint 6.6) quanto a causa raiz (item 3 desta análise — ausência de qualquer sinal de proveniência hoje).

## 5. Riscos
- Migrar `origin` com `DEFAULT 'REAL_EXAM'` é seguro para as ~1.349 questões existentes (nenhuma teria seu comportamento alterado), mas exige decidir esse valor-padrão conscientemente — não é neutro, é uma afirmação implícita ("tudo que já existe é prova real"), que é verdadeira hoje mas precisa ser declarada, não assumida.
- Todo ponto de inserção (`applyImportBatch`, `convergence.server.ts`, `QuestionsPage.tsx`, o conversor CSV) precisaria ser atualizado para preencher `origin` corretamente — risco de um caminho ser esquecido e continuar gravando o default errado silenciosamente.
- Nenhum risco de regressão em provas reais já importadas ou em funcionalidades do aluno, dado que nenhuma delas lê `exam_id`/`contest` (item 6/7 acima).

## 6. Arquivos que precisariam ser alterados (implementação futura, fora desta sprint)
- 1 migration nova (`ALTER TABLE questions ADD COLUMN origin ...`).
- `src/integrations/supabase/types.ts` (adicionar `origin` a `questions` Row/Insert/Update, mesmo padrão manual já usado para `boards.style_summary`).
- `scripts/seed/questions/convert/columns.ts` (nova coluna opcional `origin` ou similar).
- `scripts/seed/questions/convert/validate.ts` (tornar `contest`/`year` condicionais ao valor de origem).
- `src/lib/import.ts`, `src/lib/editorial-ai/publish/convergence.server.ts`, `src/components/admin/questions/QuestionsPage.tsx::buildPayload` (preencher `origin` explicitamente em cada caminho de inserção).

## 7. Estratégia de migração
Aditiva e não-destrutiva: coluna nova com default, sem backfill obrigatório de dado histórico (o default já representa corretamente o estado atual), sem quebra de nenhum contrato existente (`contest`/`year` continuam funcionando exatamente como hoje para prova real). Pode ser aplicada e testada isoladamente antes de qualquer alteração em `validate.ts`, permitindo rollback trivial (basta não usar a coluna) se algo se mostrar errado.

## 8. Resposta sobre Glasgow
Não deve virar tópico oficial. Deve permanecer como subassunto do tópico existente `atendimento-ao-politraumatizado`, exatamente como as 7 questões reais já cadastradas no acervo já fazem hoje (0 exceções). Criar um tópico próprio quebraria a convenção de granularidade já estabelecida em toda a disciplina (nenhum dos outros 5 capítulos do Macrotema 5, nem os outros 4 capítulos do Macrotema 3, têm tópico dedicado). O bloqueio de Q9/Q10 registrado na Sprint 6.6 foi um efeito do valor de teste usado no CSV daquela sprint, não de uma lacuna real de taxonomia — corrigido explicitamente aqui.

## 9. Plano de implementação (para autorização futura, não executado nesta sprint)
1. Migration aditiva: `questions.origin` com default retrocompatível.
2. Atualizar `types.ts` manualmente (mesmo padrão já usado para `style_summary`).
3. Atualizar os 3 caminhos de inserção reais (`applyImportBatch`, `convergence.server.ts`, `QuestionsPage.tsx`) para preencherem `origin` explicitamente.
4. Estender `columns.ts`/`validate.ts` do conversor CSV: nova coluna opcional de origem; `contest`/`year` condicionais.
5. Reexecutar a conversão do lote piloto de Urgência e Emergência (`docs/imports/urgencia-emergencia-piloto-n1.csv`, já existente) com `topic=atendimento-ao-politraumatizado` para Q9/Q10 (correção já identificada nesta análise) e `origin` preenchido — validação real esperada: 10/10 aprovadas.
6. Só então, com autorização explícita, executar a importação real.

## Encerramento desta fase

Análise concluída. Nenhum arquivo foi alterado, nenhum código modificado, nenhuma migration criada. Encerrando na análise arquitetural, conforme instrução explícita da Sprint 6.7.
