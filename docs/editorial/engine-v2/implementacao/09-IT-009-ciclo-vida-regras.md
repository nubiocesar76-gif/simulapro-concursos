# 09 — Gestão do Ciclo de Vida das Regras, Sprint 6.2 (IT-009)

**Fase:** Implementação Técnica
**Sprint:** IT-009 — Gestão do Ciclo de Vida das Regras (Fase 6, Sprint 6.2)
**Arquitetura homologada em:** aprovação do plano da Sprint 6.2 (usuário), sessão de 2026-07-28, com 2 ajustes
**Escopo desta sprint:** implementação de código — identificador permanente por regra, relatório de eficácia com 3 classificações explícitas, fechamento do laço entre candidatos e regras já promovidas. Sem tabela nova, sem alteração do Validator, sem alteração do Motor Editorial, sem alteração da geração de questões, sem promoção/remoção automatizada de regra.

---

## 1. Objetivo

Fechar o ciclo de vida iniciado na Sprint 6.1: uma regra promovida agora pode ser rastreada ao longo do tempo (eficácia observada, reavaliação, versionamento de texto), sempre por evidência apresentada para leitura humana — nunca por decisão automática.

---

## 2. Ajustes do usuário incorporados ao desenho

1. **Identificador permanente por regra (`RULE-NNN`).** As 4 regras já ativas (Sprint 4.3) foram retrofitadas em `regras-promovidas.md` com `RULE-001`…`RULE-004`, independentes do texto ou das tags — toda referência cruzada (candidatos excluídos, relatório de eficácia, reavaliação futura) usa o ID.
2. **Relatório de eficácia com 3 classificações explícitas**, nunca uma quarta "eficaz automático": `MELHORA_OBSERVADA`, `PIORA_OBSERVADA`, `SEM_OPORTUNIDADE_DE_TESTE` — a terceira existe especificamente para impedir que ausência de ocorrência seja lida como prova de eficácia sem denominador (`efficacy-tracking.server.ts` sempre calcula o denominador — ciclos auditados no mesmo contexto após a promoção — antes de classificar).

---

## 3. Arquivos criados

| Arquivo | Conteúdo |
|---|---|
| `src/lib/editorial-ai/learning/rule-registry.server.ts` | Parser de `regras-promovidas.md` — extrai `id` (`RULE-NNN`), `status`, `tags associadas`, `data de promoção` de cada regra, por regex de linha fixa |
| `src/lib/editorial-ai/learning/efficacy-tracking.server.ts` | Cruza regras `ATIVA` + ocorrências de tag + questões auditadas + data de criação do ciclo (`editorialAiCycleService.getCycle`, já existente) → classifica cada (regra, tag) nas 3 situações do ajuste 2, com nota legível e rastreabilidade bruta completa |
| `scripts/editorial/learning-efficacy.ts` | CLI (`npm run editorial:learning:efficacy`) — gera `docs/editorial-ai/learning/eficacia.md` |

**Alterados:**
- `docs/editorial-ai/learning/regras-promovidas.md` — cada uma das 4 regras ganhou `**Status:**`, `**Tags associadas:**`, `**Data de promoção:**` (campos de linha única, parseáveis), seção `### Versões do texto` e `### Histórico de reavaliação` (estrutura pronta, vazia — nenhuma reavaliação aconteceu ainda).
- `src/lib/editorial-ai/learning/pattern-extraction.server.ts` — passou a capturar `cycle_id` de cada bloco de questão e a emitir `auditedQuestions` (todas as questões auditadas, com ou sem tag — o denominador que o relatório de eficácia precisa). Comportamento anterior (contagens, `tagOccurrences`) preservado; `audit-metrics.ts` e `learning-candidates.ts` revalidados sem regressão.
- `src/lib/editorial-ai/learning/candidate-rules.server.ts` — ganhou parâmetro opcional `alreadyPromotedTags`, excluindo da lista de candidatos as tags que já têm regra `ATIVA` (fecha o laço: mesma tag não aparece simultaneamente como "achado novo" em `candidatos.md` e como regra rastreada em `eficacia.md`).
- `scripts/editorial/learning-candidates.ts` — passou a ler `regras-promovidas.md` (via `rule-registry.server.ts`) e repassar as tags já promovidas para o filtro acima; relatório agora declara explicitamente quais tags foram excluídas e por quê.
- `package.json` — novo script `editorial:learning:efficacy`.

---

## 4. Validações executadas

- `npx tsc --noEmit`: zero erros no projeto inteiro, em cada etapa da implementação (extensão do parser, novo registry, novo efficacy-tracking, fechamento do laço).
- `npx eslint`: erros só de formatação, corrigidos via `--fix`.
- **`rule-registry.server.ts` testado isoladamente contra o arquivo real** `regras-promovidas.md` — extraiu corretamente as 4 regras, incluindo a única com tag real (`RULE-004` → `#concentracao-tematica`) e as 3 sem tag rastreada.
- **`audit-metrics.ts` e `learning-candidates.ts` revalidados após estender `pattern-extraction.server.ts`** (novo campo `auditedQuestions` no retorno) — ambos continuam rodando sem erro, mesmo comportamento de antes.
- **`learning-efficacy.ts` executado contra dados reais**: classificou `RULE-004`/`#concentracao-tematica` corretamente como `SEM_OPORTUNIDADE_DE_TESTE` — a única ocorrência existente foi gerada no mesmo dia calendário da promoção da regra (limitação de precisão temporal já documentada em `regras-promovidas.md`), corretamente excluída da classificação por ambiguidade em vez de contada como "antes" ou "depois" às cegas; `RULE-001`/`002`/`003` corretamente reportadas como "sem avaliação" por não terem tag rastreada.
- **Laço fechado, validado contra dados reais**: antes do fechamento, `candidatos.md` listava `#concentracao-tematica` e `#dado-nao-verificado`; depois, `#concentracao-tematica` (agora coberta por `RULE-004` `ATIVA`) desaparece de `candidatos.md` e só `#dado-nao-verificado` (sem regra ainda) permanece — comportamento exatamente como desenhado.
- `grep` confirmando ausência de `updateCycleStatus`/`createEditorialAiDecision` em todos os arquivos de `src/lib/editorial-ai/learning/` e nos 3 scripts CLI: zero ocorrências.
- Confirmado (via `git status`) que `editorial-validator.*`, `orchestrator.server.ts`, `prompt-composer.server.ts`, `context-resolver.server.ts`, `response-parser.*` não aparecem como alterados nesta sprint.

---

## 5. Limitação conhecida, documentada e não escondida

A única regra com tag real rastreada (`RULE-004`) ainda não tem nenhuma medição útil de eficácia: a única ocorrência existente e a promoção da regra aconteceram no mesmo dia calendário, sem precisão de horário suficiente para separar "antes"/"depois" com confiança — o mecanismo trata isso corretamente como ambíguo (não classifica às cegas), mas o resultado prático é `SEM_OPORTUNIDADE_DE_TESTE`, não uma medição real ainda. A primeira medição útil de eficácia só será possível depois que novos ciclos forem gerados e auditados numa sessão futura, distinta desta.

---

## 6. O que fica fora desta sprint (explícito)

- Qualquer promoção, reavaliação ou revogação automática de regra — os campos `Status` e `### Histórico de reavaliação` continuam editados manualmente por humano.
- Qualquer tabela nova, qualquer migration.
- Popular `editorial_ai_decisions` — gap já identificado na Sprint 6.1, continua sem solução, fora do pedido desta sprint.
- Medição de eficácia para `RULE-001`/`002`/`003` (sem tag rastreada) e `RULE-003` (achado de estilo, não de tag) — permanecem fora do alcance do mecanismo baseado em tags até uma extensão futura decidida por humano.

---

## 7. Confirmações

- `editorial-validator.server.ts`, `orchestrator.server.ts`, `prompt-composer.server.ts`, `context-resolver.server.ts`, `response-parser.server.ts`: **não tocados**.
- Nenhuma migration, nenhuma tabela nova.
- Nenhuma rota/tela do Portal do Aluno ou Admin.
- Nenhuma decisão editorial automatizada (`editorial_ai_cycles`/`editorial_ai_decisions` intocados por código novo).
- Nenhuma promoção, reavaliação ou remoção de regra decidida por código — todas continuam com sujeito exclusivamente humano.
