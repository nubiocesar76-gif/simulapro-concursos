# 07 — Auditoria Editorial (Sprint IT-007)

**Fase:** Implementação Técnica
**Sprint:** IT-007 — Implementação do Auditor Editorial
**Arquitetura homologada em:** aprovação do plano da Fase 5 (usuário), sessão de 2026-07-27
**Escopo desta sprint:** implementação de código — amostragem, leitura de sinais já gravados pelo Validator, checagem de sobreposição temática e relatório em Markdown. Sem tela, sem workflow operacional, sem tabela nova, sem alteração do Validator, sem alteração do fluxo IA → Validator → Editor Humano → Publicação, sem produção em escala.

---

## 1. Objetivo

Formalizar, como ferramenta repetível, o processo de auditoria de qualidade que até esta sprint só existia manualmente dentro de sessões de chat (Sprints 4.2 e 4.3: leitura questão a questão, julgamento de 7-10 critérios, comparação entre lotes). O Auditor Editorial produz, por lote, um relatório estruturado para revisão humana e, depois de vários relatórios preenchidos, um painel de métricas agregadas por banca/disciplina/dificuldade.

---

## 2. Correspondência com a documentação normativa (IA-001…IA-009)

Esta sprint não cria um conceito novo — implementa tecnicamente dois documentos já homologados e congelados:

| Documento normativo | O que já definia | O que esta sprint acrescenta |
|---|---|---|
| **IA-006** (Revisão Editorial) | A Etapa 12 ("Auditoria editorial", humana, apoiada pelos apontamentos de IA-005) e a Etapa 13 (Homologação) — mas nunca definiu um artefato técnico para essa auditoria | O relatório Markdown estruturado é esse artefato — o mesmo pacote de leitura (enunciado, alternativas, gabarito, explicação, referência, apontamentos do Validator) que eu montava manualmente na Sprint 4.2, agora gerado |
| **IA-009** (Otimização Contínua), Seção 4 | As "fontes legítimas de aprendizado": padrões recorrentes nos apontamentos de IA-005, padrões recorrentes nas decisões de IA-006 | O painel de métricas consolidadas (`audit-metrics.ts`) é a implementação técnica dessa observação — só contagens, nunca uma conclusão automática |

**Garantias herdadas e preservadas, sem exceção:**
- IA-006 §6: "em nenhuma circunstância a IA aprova, reprova ou homologa" — o Auditor nunca chama `updateCycleStatus` nem `createEditorialAiDecision` (confirmado por grep nos 6 arquivos novos, zero ocorrências).
- IA-008: um lote não tem existência editorial própria — o Auditor não atribui nenhum "estado" a um lote, só um painel de contagens.
- IA-009 §3: toda observação é insumo para reflexão humana, nunca conclusão automática — por isso não existe limiar oficial de aprovação/reprovação de lote nesta sprint (ver Seção 5).

---

## 3. Padrão real reutilizado

Mesmo padrão de par `.ts`/`.server.ts` já usado em todo `src/lib/editorial-ai/` (ex.: `board-loader.ts`/`.server.ts`) e o mesmo padrão de CLI de `scripts/editorial/run-generation.ts` (parse manual de `argv`, `loadEnv` + import dinâmico do módulo pesado, relatório final em `console.log`). Nenhuma abstração nova.

**Ajuste de desenho decidido explicitamente pelo usuário durante o planejamento** (documentado aqui para rastreabilidade, IA-009 §5): a primeira versão do plano previa recalcular os 3 critérios 100% mecânicos do Validator (`PLAUSIBILIDADE_DISTRATORES`, `DEFENSIBILIDADE_GABARITO`, `COERENCIA_METADADOS`) diretamente de `editorial_ai_contents`. O usuário pediu para eliminar essa duplicação: o Auditor **lê** `editorial_ai_annotations` (já gravada pelo Validator no momento da geração) em vez de recalcular — `validator-signals.server.ts` classifica cada anotação já existente em `OK_MECANICO`/`FALHA_MECANICA`/`PENDENTE_HUMANO` por uma checagem textual mínima (presença da palavra "reprovou", que é a própria fraseologia que o Validator já usa para marcar reprovação mecânica), nunca reimplementando a lógica de checagem.

---

## 4. Arquivos criados

| Arquivo | Conteúdo |
|---|---|
| `src/lib/editorial-ai/audit/sampling.server.ts` | Amostragem estratificada (banca × dificuldade) a partir de `batchIds`, juntando `editorial_ai_cycles` + `editorial_ai_inputs` + `boards`/`editorial_topics`/`editorial_subtopics`/`editorial_disciplines` |
| `src/lib/editorial-ai/audit/validator-signals.server.ts` | Leitura (não recálculo) de `editorial_ai_annotations`, classificação textual em 3 status |
| `src/lib/editorial-ai/audit/thematic-overlap.server.ts` | Busca de candidatos de sobreposição no acervo (`questions`, `ILIKE` por `board_id` + termo do assunto/subassunto) — mesma limitação já documentada no Validator (`AUSENCIA_INDICIO_COPIA`): literal/temática, não prova nem descarta paráfrase |
| `src/lib/editorial-ai/audit/report.server.ts` | Monta o relatório Markdown por lote: cabeçalho, um bloco por questão amostrada (critérios do Validator lidos + 5 critérios exclusivos do Auditor, todos com linha `Notas:` para o revisor, incluindo convenção de tags livres tipo `#referencia-forcada`), painel de contagens objetivas sem veredito de lote |
| `scripts/editorial/audit-batch.ts` | CLI (`npm run editorial:audit -- --batch-id <uuid> [--batch-id ...] [--sample-size N]`) — grava o relatório em `docs/editorial-ai/audit-reports/` |
| `scripts/editorial/audit-metrics.ts` | CLI (`npm run editorial:audit:metrics`) — relê todos os relatórios já preenchidos por humano, agrega contagens por banca/disciplina/dificuldade/critério e frequência de tags, grava `docs/editorial-ai/audit-reports/METRICAS_CONSOLIDADAS.md` |

**Critérios exclusivos do Auditor** (não existem em `EditorialAiAnnotationCriterion`, cobrem o que o Validator não avalia porque exige olhar o conteúdo em detalhe ou comparar entre ciclos): `QUALIDADE_DISTRATORES`, `QUALIDADE_EXPLICACAO`, `ADEQUACAO_REFERENCIA`, `REPETICAO_TEMATICA`, `CONSISTENCIA_DIFICULDADE`. Todos ficam `[PENDENTE]` até um revisor humano preencher — o Auditor nunca inventa um veredito para eles.

---

## 5. Decisão explícita do usuário: sem persistência definitiva nesta fase

Duas decisões tomadas durante o planejamento, ambas registradas aqui por exigência do princípio de rastreabilidade (IA-009 §3/§6):

1. **Nenhuma tabela nova.** Os vereditos humanos por critério ficam só nos arquivos de relatório (`docs/editorial-ai/audit-reports/*.md`). Métricas agregadas são recalculadas relendo esses arquivos (`audit-metrics.ts`), não consultadas via SQL. Uma migration aditiva específica só será considerada depois de validar o processo e comprovar necessidade real de consulta histórica em escala — fora de escopo desta sprint.
2. **Sem limiar oficial de aprovação/reprovação de lote.** O relatório e o consolidado apresentam só contagens objetivas (`[OK]`/`[AJUSTE]`/`[REPROVADO]`/`[PENDENTE]` por critério, banca, disciplina, dificuldade). Qualquer leitura de "isto é suficiente para prosseguir" continua sendo decisão humana ao ler o relatório — igual ao que já vinha sendo feito manualmente. Limiares numéricos oficiais ficam para uma fase futura, depois que um lote piloto mostrar quais métricas realmente importam.

---

## 6. Validações executadas

- `npx tsc --noEmit`: zero erros no projeto inteiro após os 6 arquivos novos + `package.json`.
- `npx eslint` nos 6 arquivos: 14 problemas de formatação, todos corrigidos via `--fix`; 0 problemas depois.
- **Execução real contra dados de produção** (não simulado): `npm run editorial:audit` rodado contra os 10 lotes reais da Sprint 4.3 (20 ciclos totais entre Sprints 4.1/4.3 já no banco) — gerou um relatório de 10 questões, cada uma com 15 critérios (10 do Validator lidos corretamente + 5 exclusivos do Auditor), enunciado/alternativas/gabarito/explicação/referência completos e candidatos de sobreposição temática reais (ex.: achou a mesma questão de "sinais vitais/jornada de plantão" e as 2 questões de "Sign In" já encontradas manualmente na Sprint 4.2).
- Preenchimento manual de 3 das 10 questões (reaproveitando os pareceres já dados nas Sprints 4.2/4.3, incluindo as 2 tags `#concentracao-tematica` e `#dado-nao-verificado` levantadas naquelas sessões) e execução de `npm run editorial:audit:metrics` — o consolidado gerado bateu exatamente com o esperado: 10/10 `OK MECÂNICO` em todos os 7 critérios mecânicos/parcial-mecânicos (zero falha, consistente com só ciclos bem-sucedidos chegarem a `editorial_ai_contents` completo), contagens corretas por banca/disciplina/dificuldade, as 2 tags contadas corretamente.
- `grep` confirmando ausência de `updateCycleStatus`/`createEditorialAiDecision` nos 6 arquivos novos: zero ocorrências.

---

## 7. Limitações conhecidas desta versão

- A amostragem por estrato (`sampleSizePerStratum`) nunca foi exercitada com lotes grandes o suficiente para reduzir a amostra de verdade — os lotes reais disponíveis (10 ciclos cada) são pequenos o bastante para a amostra ser sempre a população inteira. Validação de verdade só acontece quando houver produção em maior volume — explicitamente fora de escopo desta fase.
- A checagem de sobreposição temática usa um único termo de busca (nome do assunto/subassunto) — mais simples que a lista de palavras-chave que eu usava manualmente na Sprint 4.2; pode gerar menos candidatos em alguns casos. Ajuste possível numa iteração futura, não feito agora para não expandir escopo sem necessidade comprovada.
- O vocabulário de tags (`#referencia-forcada` etc.) é livre, não fechado — `audit-metrics.ts` conta qualquer string que comece com `#`, incluindo erros de digitação como tags distintas. Aceitável nesta fase de validação do processo.

---

## 8. Confirmações

- `editorial-validator.server.ts`, `orchestrator.server.ts`, `prompt-composer.server.ts`, `response-parser.server.ts`, `context-resolver.server.ts`: **não tocados**.
- Nenhuma migration, nenhuma tabela nova, nenhuma alteração de schema.
- Nenhuma rota/tela do Portal do Aluno ou Admin criada ou alterada.
- Nenhuma chamada a `updateCycleStatus` ou `createEditorialAiDecision` em código novo.
- Nenhuma produção em escala executada — só leitura/auditoria dos ciclos já existentes das Sprints 4.1/4.3.
