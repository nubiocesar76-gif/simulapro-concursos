# 08 — Motor de Aprendizado, Sprint 6.1 (IT-008)

**Fase:** Implementação Técnica
**Sprint:** IT-008 — Levantamento e Desenho do Motor de Aprendizado (Fase 6, Sprint 6.1)
**Arquitetura homologada em:** aprovação do plano da Sprint 6.1 (usuário), sessão de 2026-07-27, com 3 ajustes
**Escopo desta sprint:** implementação de código — extração de padrões dos relatórios de auditoria já existentes, levantamento de candidatos a regra permanente (sem limiar de recorrência), log de rastreabilidade das regras já promovidas. Sem tela, sem tabela nova, sem alteração do Validator, sem alteração da geração de questões, sem IA autônoma.

---

## 1. Objetivo

Formalizar o mecanismo que transforma achados recorrentes da Auditoria Editorial (Fase 5) em conhecimento permanente do Motor Editorial — hoje esse passo só tinha acontecido uma vez (Sprint 4.3) e de forma manual, dentro de uma conversa. Esta sprint entrega os 2 primeiros passos do modelo de 4 passos que a IA-009 já define (Seção 2): **observar** (extrair padrões) e **propor** (listar candidatos com evidência) — **decidir humanamente** (promover) continua manual, e **documentar** ganha um log formal (`regras-promovidas.md`).

---

## 2. Relação com o Motor de Aprendizado já reservado no código

Achado de investigação, registrado para não haver ambiguidade futura: já existe um "Motor de Aprendizado" citado em `src/lib/editorial-ai/content-selector.ts` (`EditorialIntelligentTargetRequest`, linhas 46-59) — reservado para decidir **o que gerar** (concurso, banca, métricas do aluno, plano de estudo). O Motor de Aprendizado desta Fase 6 é sobre **como calibrar a geração** a partir da auditoria de qualidade — escopo diferente, mesmo nome, mesma intenção de longo prazo de manter o Motor Editorial agnóstico sobre a origem da decisão. Esta sprint não abre nem toca o modo `"intelligent"` do content-selector.

---

## 3. Ajustes do usuário incorporados ao desenho (rastreabilidade, IA-009 §5)

1. **Sem limiar quantitativo de recorrência nesta sprint.** A primeira versão do plano previa "≥3 relatórios" ou "≥2 lotes" como critério de candidato. O usuário pediu para não fixar esses números agora — `candidate-rules.server.ts` só agrupa e apresenta evidência bruta (contagem, relatórios de origem, contextos), nunca decide se é "suficiente". Limiares ficam para depois da operação piloto.
2. **Diretório `docs/editorial-ai/learning/`** (não `knowledge/`), mantendo a organização `audit-reports/` (Fase 5) e `learning/` (Fase 6) como pastas irmãs dentro de `docs/editorial-ai/`, espelhando `src/lib/editorial-ai/audit/` e `src/lib/editorial-ai/learning/` no código.
3. **Rastreabilidade e reavaliação.** Toda regra promovida (`regras-promovidas.md`) mantém: texto exato, local no código, data, aprovador, origem/achado, e um campo `Status` (`ATIVA`/`EM_REAVALIACAO`/`REVOGADA`) com histórico — para que uma auditoria futura possa apontar perda de eficácia sem apagar o registro histórico. `candidate-rules.server.ts` já produz, para cada candidato futuro, a mesma rastreabilidade (lista de ocorrências com relatório + critério + contexto).

---

## 4. Arquivos criados

| Arquivo | Conteúdo |
|---|---|
| `src/lib/editorial-ai/learning/pattern-extraction.server.ts` | Parser único (regexes de cabeçalho de questão, linha de critério, linha de notas, tags) — movido de dentro de `scripts/editorial/audit-metrics.ts` para módulo compartilhado, mesmo comportamento, sem duplicação |
| `src/lib/editorial-ai/learning/candidate-rules.server.ts` | Agrupa ocorrências de tag por padrão, produz candidatos com contagem + relatórios de origem + critérios/bancas/disciplinas associados + lista bruta de ocorrências — **nenhum limiar aplicado** |
| `scripts/editorial/learning-candidates.ts` | CLI (`npm run editorial:learning:candidates`) — gera `docs/editorial-ai/learning/candidatos.md` |
| `docs/editorial-ai/learning/regras-promovidas.md` | Log histórico das 4 regras já ativas (3 promovidas na Sprint 4.3 em `EDITORIAL_CALIBRATION_RESTRICTIONS` + 1 em `buildBoardCalibrationNote`), documentadas retroativamente com origem/achado e campo `Status` |
| `docs/editorial-ai/learning/candidatos.md` | Gerado pelo script — estado atual: 2 candidatos (`#concentracao-tematica`, `#dado-nao-verificado`), 1 ocorrência cada, extraídos do único relatório de auditoria real existente até agora |

**Alterado (refactor comportamento-preservado, não é geração de questões nem Validator):**
- `scripts/editorial/audit-metrics.ts` — passou a importar o parser de `pattern-extraction.server.ts` em vez de tê-lo embutido. Validado: saída idêntica antes/depois do refactor (`diff` só acusou a linha de timestamp).
- `package.json` — novo script `editorial:learning:candidates`.

---

## 5. Validações executadas

- `npx tsc --noEmit`: zero erros no projeto inteiro.
- `npx eslint` nos arquivos novos/alterados: erros só de formatação, corrigidos via `--fix`; zero problemas depois.
- **Refactor de `audit-metrics.ts` comprovadamente sem regressão:** rodei `npm run editorial:audit:metrics` antes e depois de extrair o parser, comparei via `diff` — única diferença foi o timestamp de geração.
- **Execução real contra dados de produção:** `npm run editorial:learning:candidates` rodado contra o relatório de auditoria real da Fase 5 (`docs/editorial-ai/audit-reports/a8ff7611...md`, 3 das 10 questões já com vereditos preenchidos) — encontrou corretamente as 2 tags já registradas (`#concentracao-tematica`, `#dado-nao-verificado`), com rastreabilidade completa (arquivo de origem, critério, banca, disciplina, dificuldade).
- `grep` confirmando ausência de `updateCycleStatus`/`createEditorialAiDecision` nos arquivos novos: zero ocorrências.
- Confirmado que `editorial-validator.*`, `orchestrator.server.ts`, `prompt-composer.server.ts`, `response-parser.*`, `context-resolver.server.ts` não foram tocados nesta sprint.

---

## 6. O que fica fora desta sprint (explícito)

- Promoção automática ou semi-automática de qualquer candidato — toda promoção continua manual, documentada em `regras-promovidas.md` só quando um humano decidir.
- Qualquer limiar numérico de recorrência — proposital, aguardando operação piloto.
- Qualquer tabela nova, qualquer migration.
- Popular `editorial_ai_decisions` — a lacuna identificada na Sprint 6.1 (schema pronto desde IT-005, `orchestrator.server.ts::registerDecision()` existe mas nunca é chamado por nenhum fluxo real) continua sem solução nesta sprint — fora do pedido ("não alterar o fluxo").
- O modo `"intelligent"` de `content-selector.ts` (Motor de Aprendizado de seleção de conteúdo) — não tocado.

---

## 7. Confirmações

- `editorial-validator.server.ts`, `orchestrator.server.ts`, `prompt-composer.server.ts`, `context-resolver.server.ts`, `response-parser.server.ts`: **não tocados**.
- Nenhuma migration, nenhuma tabela nova.
- Nenhuma rota/tela do Portal do Aluno ou Admin.
- Nenhuma decisão editorial automatizada (`editorial_ai_cycles`/`editorial_ai_decisions` intocados por código novo).
- Nenhuma geração de questão executada nesta sprint.
