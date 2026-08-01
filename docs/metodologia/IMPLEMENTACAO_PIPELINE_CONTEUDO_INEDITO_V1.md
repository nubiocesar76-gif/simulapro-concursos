# IMPLEMENTAÇÃO — PIPELINE DE CONTEÚDO EDITORIAL INÉDITO — V1

## Objetivo e status

Implementação mínima para eliminar o bloqueio identificado na Sprint 6.6 e diagnosticado na Sprint 6.7 (Alternativa A, deliberadamente escolhida em vez da Alternativa B recomendada, por instrução explícita desta sprint: sem migration, sem coluna nova no banco). Nenhuma refatoração, limpeza, otimização ou melhoria paralela foi feita — só o necessário para o objetivo declarado.

## O que foi implementado

Um novo valor opcional de coluna no CSV, `origin=inedito`, reconhecido **somente** pelo conversor (`scripts/seed/questions/convert`). Quando presente, dispensa `contest`/`year` linha a linha; quando ausente (comportamento de toda prova real já existente), a validação permanece **idêntica** à anterior — nenhuma condição nova, nenhum caminho alternativo para provas reais.

### 1. [scripts/seed/questions/convert/columns.ts](scripts/seed/questions/convert/columns.ts)
Adicionada 1 entrada a `OPTIONAL_COLUMNS`: `"origin"`. Motivo: dar ao CSV um jeito de sinalizar "isto é conteúdo editorial inédito" sem exigir nenhuma coluna nova no banco — o valor não é gravado em lugar nenhum, é consumido e descartado só durante a validação (ver item 3).

### 2. [scripts/seed/questions/convert/validate.ts](scripts/seed/questions/convert/validate.ts)
Adicionada 1 constante por linha (`isEditorialInedito = (row.origin ?? "").trim().toLowerCase() === "inedito"`) e 2 condicionais (`if (!isEditorialInedito)`) envolvendo exatamente os 2 `issues.push(...)` de "Concurso é obrigatório"/"Ano é obrigatório" que causavam o bloqueio da Sprint 6.6. Nenhuma outra validação foi tocada — `topic`/`subject`/`board`/`position`/`package`/`package_version`/`statement`/`alternatives`/`correct_answer`/`explanation` continuam exatamente como antes, para inédito e para prova real igualmente.

### 3. [scripts/seed/questions/convert/convert.ts](scripts/seed/questions/convert/convert.ts)
Em `toSeedItem()`, `contest`/`year` deixaram de ser incluídos incondicionalmente no objeto de saída (`contest: row.contest`, sempre presente mesmo como string vazia) e passaram a seguir o mesmo padrão condicional já usado para `source`/`package`/`packageVersion` (`...(row.contest ? { contest: row.contest } : {})`). Motivo: sem essa mudança, a linha 1 do relatório (validate.ts) passava, mas `questions.json` falhava na checagem final de schema (`questionSeedItemSchema`, que já aceitava `contest`/`year` como `.optional()`, mas não aceitava string vazia/`null` — só a ausência da chave). Descoberto empiricamente ao rodar o pipeline de ponta a ponta (ver Validação abaixo) — não foi assumido.

**Nenhum outro arquivo foi alterado.** Nenhuma migration criada. Nenhuma coluna nova no banco. Nenhuma UI, componente, SIA ou taxonomia tocados.

## Correção do CSV (mesmo arquivo, sem criar novo)

[docs/imports/urgencia-emergencia-piloto-n1.csv](docs/imports/urgencia-emergencia-piloto-n1.csv) — mesmo arquivo da Sprint 6.6, editado in-place, sem criar cópia nova:
- Adicionada coluna `origin=inedito` às 10 linhas (nenhum outro campo de conteúdo tocado — enunciado, alternativas, gabarito, justificativa e referência permanecem idênticos).
- Corrigido `topic` de Q9/Q10 de `escala-de-coma-de-glasgow` (valor de teste da Sprint 6.6, que expunha deliberadamente o gap então percebido) para `atendimento-ao-politraumatizado`, conforme a conclusão da Sprint 6.7 (mesmo tópico já usado nas 7 questões reais equivalentes do acervo).

## Validação real — execução do pipeline

Comando: `npx tsx scripts/seed/convert-questions.ts docs/imports/urgencia-emergencia-piloto-n1.csv <saída temporária>` (nunca `docs/seeds/questions.json` real).

```
Conversão concluída: <saída temporária>
Questões convertidas: 10
```

**10/10 aprovadas, 0 erros.** Conferido no JSON gerado: todas as 10 sem `contest`/`year` (ausentes, não vazias/nulas), `package`/`packageVersion` presentes (`banco-de-questoes-enfermagem`/`1.0`), `topic` de Q9/Q10 corrigido para `atendimento-ao-politraumatizado`.

## Teste de regressão — prova real

Mesmo comando contra o arquivo real de produção, `docs/imports/questions.csv` (204 linhas, todas provas reais, nenhuma com `origin` preenchido):

```
Conversão concluída: <saída temporária>
Questões convertidas: 204
```

**204/204 convertidas, 0 erros — nenhuma regressão.** Prova estrutural (não só empírica): como nenhuma linha real tem `origin=inedito`, `isEditorialInedito` é sempre `false` para elas, preservando as validações de `contest`/`year` exatamente como antes desta sprint. A mudança em `convert.ts` (condicional em vez de atribuição direta) também não altera nenhuma linha real: `row.contest`/`row.year` só são omitidos quando falsy/`null`, e nas 204 linhas reais ambos são sempre preenchidos e válidos (é justamente o que a validação de `contest`/`year` obrigatórios garante) — a condição é sempre verdadeira para prova real, produzindo saída idêntica à anterior.

`npx tsc --noEmit` — limpo, sem erros de tipo introduzidos.

## Encerramento desta fase

Implementação concluída e revalidada. Nenhuma importação foi executada. Nenhuma alteração no banco, migration, UI, componente, SIA ou taxonomia. Encerrando imediatamente, conforme instrução explícita da Sprint 6.8.
