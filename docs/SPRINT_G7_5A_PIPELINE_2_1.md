# Sprint G7.5A — Mini Pipeline 2.1

**Fase:** 10-11, pós Go-Live (G7 — Auditoria e Plano Editorial)
**Objetivo:** implementar somente as melhorias de maior retorno e menor risco identificadas no projeto do Pipeline Editorial 2.0 (G7.4), sem reescrever nenhuma arquitetura.
**Status:** concluída. Pipeline Editorial **congelado** a partir deste ponto — só bugs justificam novas alterações de código nele.

---

## Melhoria 1 — Cópia automática do CSV para `docs/imports/`

**Problema:** `npm run pipeline:merge` (`tools/question-pipeline/src/merge.ts`) gerava `questions.csv` em `tools/question-pipeline/output/`, mas o operador precisava copiar esse arquivo manualmente para `docs/imports/questions.csv` antes de rodar `npm run convert:questions`.

**Implementação:** o mesmo conteúdo já validado é gravado também em `QUESTIONS_IMPORT_CSV_PATH` (constante já existente em `scripts/seed/core/io.ts`), sem alterar o formato do CSV.

**Achado durante o teste:** a cópia automática pode sobrescrever um lote de `docs/imports/questions.csv` mais recente com dados desatualizados, se `tools/question-pipeline/output/` ainda tiver uma extração antiga esquecida. Isso já era o comportamento da cópia manual — não é uma regressão — mas antes não havia nenhuma visibilidade sobre isso.

**Decisão tomada:** em vez de bloqueio, confirmação interativa ou `--force` (todos descartados deliberadamente, para não alterar o fluxo nem interromper uso não-interativo), foi adicionado um aviso informativo antes da substituição, mostrando:
- arquivo de origem (`questions.raw.json`, não `questions.csv` — é o `raw.json` que revela a idade real da extração, já que o CSV é reescrito a cada rodada);
- data/hora da origem;
- arquivo de destino e sua última modificação;
- aviso explícito de que o destino será substituído.

**Arquivo alterado:** `tools/question-pipeline/src/merge.ts` (único).

**Testes:** `npm run pipeline:merge` executado de verdade (dados reais do piloto SESACRE 2022, 80 questões) — CSV gerado, cópia confirmada, aviso de substituição exibido com as datas corretas. `npm run pipeline:test` — 26/26 OK. `tsc`/`eslint` sem erros novos. Arquivos de teste restaurados via `git checkout --` após cada execução.

---

## Melhoria 2 — `sync:questions` (seed + export em sequência)

**Problema:** rodar `npm run seed:questions` sem, em seguida, rodar `npm run export:questions` já causou divergência real entre o banco e `docs/seeds/questions.json` (incidente documentado em `docs/ACERVO_OFICIAL.md`: banco chegou a ~1.000 questões enquanto o arquivo versionado ficou parado em 2 por 5 dias).

**Implementação:** um script novo, `sync:questions`, que orquestra os dois comandos já existentes:
```json
"sync:questions": "npm run seed:questions && npm run export:questions"
```
`&&` garante que o export só roda se o seed terminar com exit code 0, e propaga o exit code correto em caso de falha. `seed:questions` e `export:questions` continuam existindo e inalterados.

**Nome escolhido:** `sync:questions`, seguindo o padrão `<verbo>:<assunto>` já usado em todos os outros scripts do projeto.

**Arquivo alterado:** `package.json` (uma linha).

**Testes:** caminho de falha comprovado isoladamente (seed apontado para um arquivo inexistente — o comando encadeado nunca rodou, exit code 1 propagado). Caminho de sucesso executado de verdade (`npm run sync:questions` real): seed rodou (0 questões novas, 1020 já existentes — confirma idempotência por hash), export rodou em seguida e regenerou `docs/seeds/questions.json`.

**Achado real do teste, revertido deliberadamente:** essa execução revelou que o banco (1020 questões) estava à frente do arquivo commitado — a mesma classe de problema do incidente em `docs/ACERVO_OFICIAL.md`. O resultado foi revertido via `git checkout --` porque não fazia parte do escopo desta sprint alterar `docs/seeds/questions.json` deliberadamente; fica registrado aqui como um sinal real de que uma sincronização formal (rodar `sync:questions` de propósito, sem reverter) é uma tarefa pendente e recomendada antes da G7.5B.

---

## Melhoria 3 — Validação antecipada de `package`/`package_version`

**Análise prévia (antes de implementar):** mapeamento completo mostrou que `position`/`board`/`contest`/`subject`/`topic` já eram validados antecipadamente (dentro de `convert:questions`, contra `docs/seeds/taxonomy.json`, com relatório agregado por linha) — a única lacuna real era `package`/`package_version`, que só tinham checagem de formato (regex), nunca de existência, e a existência só era descoberta tarde, dentro de `seed:questions`.

**Implementação:** `runConvertQuestions()` (o wrapper por trás de `npm run convert:questions`) passou a, depois que a validação por arquivo já tiver passado, checar se cada `package`/`package_version` referenciado no CSV existe de fato no banco — a única fonte real desse dado (`taxonomy.json` não tem espelho de pacotes, e a sprint proibiu explicitamente criar um). Reaproveita os resolvers já existentes:
- `loadTaxonomyMaps()` (`scripts/seed/questions/entities.ts`) — resolve `position → course_id`;
- `resolvePackageVersion()` (`scripts/seed/taxonomy/entities.ts`) — resolve pacote+versão dentro do curso;
- `printConvertReport()` (`scripts/seed/questions/convert/validate.ts`) — mesmo formato de relatório (`Linha | Campo | Erro`) já usado para os demais campos.

Nenhuma lógica de resolução nova foi escrita.

**Decisão de arquitetura:** a checagem precisa ser assíncrona (depende do banco). Como `convertQuestions()` é síncrona e é usada também por `tools/question-pipeline/src/merge.ts` e `export.ts` (que não podiam ser alterados nesta sprint), a nova checagem ficou isolada em `runConvertQuestions()` — só o caminho de `npm run convert:questions` a exercita. `convertQuestions()` permanece exatamente como estava.

**Arquivos alterados:** `scripts/seed/questions/convert/convert.ts` (lógica nova) e `scripts/seed/convert-questions.ts` (um `await` a mais, consequência mecânica inevitável de `runConvertQuestions` virar assíncrona — não estava na contagem inicial de arquivos, correção registrada durante a implementação).

**Decisão revisada no fechamento da sprint:** a primeira versão apagava (`unlinkSync`) o `questions.json` recém-escrito quando a checagem de package falhava. Revisão crítica no encerramento mostrou que isso não protegia de nada — o conteúdo anterior do arquivo (o acervo acumulado real) já tinha sido sobrescrito por `writeJsonFile()`, dentro da função inalterada `convertQuestions()`, antes mesmo da checagem nova rodar. Apagar o arquivo só piorava a situação do operador (fica sem nada para inspecionar, em vez de um arquivo sinalizado como inválido). A linha foi removida; o comando agora reporta a falha (exit code 1) e deixa claro, na mensagem de erro, que o arquivo escrito não deve ser usado em `seed:questions` até ser corrigido.

**Testes:** 3 cenários reais, com CSVs isolados no scratchpad (nunca contra `docs/imports/questions.csv`):
1. CSV válido (`package: banco-de-questoes-enfermagem`, `1.0`, referência real) → conversão concluída, exit 0.
2. `package` inexistente → relatório correto (linha, campo, erro), exit 1, arquivo permanece em disco com aviso claro.
3. `package` real com `package_version` inexistente → mesmo comportamento, mensagem distingue exatamente qual dos dois falhou.

`npm run pipeline:test` — 26/26 OK em todas as rodadas. `tsc`/`eslint` sem erros novos (confirmados por `git diff`, distinguindo linhas minhas de pré-existentes).

---

## Decisões tomadas nesta sprint (resumo)

- Nomeação de comandos novos segue estritamente `<verbo>:<assunto>` (`sync:questions`), o padrão já estabelecido — nenhum padrão novo foi inventado.
- Nenhuma melhoria criou tabela, arquivo-espelho, cache ou cópia paralela de dados do banco — a fonte oficial de `package`/`package_version` continua sendo exclusivamente o banco.
- Nenhuma melhoria tocou `tools/question-pipeline/src/merge.ts`/`export.ts` além do estritamente necessário para a Melhoria 1 — a Melhoria 3 foi deliberadamente desenhada para não precisar tocar neles.
- Apagar arquivo em caso de falha foi considerado e revertido — decisão final: nunca remover artefato gerado, sempre reportar e sinalizar claramente.

## Limitações conhecidas (não resolvidas nesta sprint, por decisão de escopo)

- **`docs/seeds/questions.json` pode estar desatualizado em relação ao banco agora mesmo** — a Melhoria 2 revelou isso, mas o teste foi revertido. Recomenda-se rodar `npm run sync:questions` de propósito antes da G7.5B.
- A checagem de `package`/`package_version` da Melhoria 3 depende de conexão com o banco — `convert:questions` deixa de ser 100% offline quando há linhas com `package` preenchido.
- Gargalos identificados na G7.3 que **não** foram atacados nesta sprint (deliberadamente fora de escopo): transcrição/classificação manual continuam 100% manuais; nenhuma comparação automática de gabarito foi implementada (essa era a Melhoria 4, não iniciada); nenhum classificador automático de disciplina/assunto existe.
- `docs/work/<prova>/` continua sendo um sistema de status paralelo, não confiável, não lido por nenhum script — não foi tocado nem descontinuado nesta sprint.

## Pipeline Editorial: congelado

A partir deste ponto, nenhuma nova alteração de código no pipeline (`tools/question-pipeline/`, `scripts/seed/`) deve ser feita a menos que seja para corrigir um bug real. O esforço da fase seguinte (G7.5B) é 100% produção de conteúdo — importar o Lote 1 definido na G7.2 — não mais ferramenta.

## Preparação para G7.5B — Importação em massa do Lote 1

Nenhuma ação de preparação foi executada nesta sprint (fechamento é só documentação). Pontos que a G7.5B deve considerar como ponto de partida, já levantados:
- As 10 provas do Lote 1 estão listadas e priorizadas em `docs/commercial/` (Sprint G7.2).
- O checklist de produção por prova está em `docs/FLUXO_PRODUCAO_PROVA.md` / G7.3.
- `docs/imports/questions.csv` deve ser tratado como *scratch* de uma prova por vez — a Melhoria 1 o sobrescreve a cada `pipeline:merge`, então cada prova deve ser convertida (`convert:questions`) e seedada antes de processar a próxima.
- Recomenda-se rodar `npm run sync:questions` uma vez, deliberadamente, antes de começar o Lote 1, para eliminar a divergência banco/arquivo já detectada.
