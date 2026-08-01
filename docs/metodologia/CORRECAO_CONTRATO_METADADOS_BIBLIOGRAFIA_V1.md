# CORREÇÃO DO CONTRATO DE METADADOS — REFERÊNCIA BIBLIOGRÁFICA — V1

## Objetivo e status

Eliminar definitivamente a divergência `metadata.references` (array, gravado pelo pipeline de seed/CSV) vs `metadata.bibliography` (string, lido por toda a aplicação), encontrada na Sprint 6.9. Implementação real, restrita ao contrato de metadados — nenhuma questão nova, nenhuma alteração em SIA, pipeline editorial (Motor Editorial de IA), taxonomia ou UX.

## ETAPA 1 — Mapeamento completo (leitura, gravação, edição, importação, exportação, SIA, admin, aluno)

| Camada | Arquivo | Chave usada | Papel |
|---|---|---|---|
| Tipo/leitura de metadata | [src/lib/questions.ts:85](src/lib/questions.ts#L85) `parseMetadataFields` | `bibliography` (string) | Lê para SIA/admin |
| Gravação (admin manual) | [src/lib/questions.ts:106](src/lib/questions.ts#L106) `buildQuestionMetadata` | `bibliography` | Grava a partir do form admin |
| Edição (admin) | [src/components/admin/questions/QuestionsPage.tsx:888-892](src/components/admin/questions/QuestionsPage.tsx#L888-L892) | `bibliography` | `<Input>` "Referência bibliográfica" |
| Importação em massa (admin, CSV/JSON via UI) | [src/lib/import.ts:28,154,444](src/lib/import.ts#L28) | `bibliography` | Já usava a chave correta |
| SIA / sessão de estudo (servidor) | [src/lib/study-question-detail.functions.ts:60,281](src/lib/study-question-detail.functions.ts#L281) | `bibliography` | Lê e repassa ao front |
| SIA / sessão de estudo (client) | [src/lib/study-engine.ts:95,672](src/lib/study-engine.ts#L672) | `bibliography` | Tipo `QuestionFeedback.bibliography` |
| Aluno (exibição) | [src/components/app/study/QuestionFeedbackPanel.tsx:188-195](src/components/app/study/QuestionFeedbackPanel.tsx#L188-L195) | `bibliography` | Bloco "Referência bibliográfica" |
| Central de Revisão | [src/components/app/study/SessionResultsView.tsx:280](src/components/app/study/SessionResultsView.tsx#L280) | `bibliography` | Objeto neutro, mesma chave |
| Motor Editorial de IA | [src/lib/editorial-ai/publish/convergence.server.ts:212](src/lib/editorial-ai/publish/convergence.server.ts#L212) | `bibliography` | Já usava a chave correta |
| **Pipeline de seed/CSV — gravação** | [scripts/seed/questions/entities.ts:256-262](scripts/seed/questions/entities.ts#L256-L262) `buildSeedMetadata` (usado por `seed.ts`, importação real ao banco) | ~~`references`~~ | **Única divergência encontrada** |
| **Pipeline de seed/CSV — leitura** | [scripts/seed/questions/entities.ts:264-275](scripts/seed/questions/entities.ts#L264-L275) `readSeedMetadata` (usado por `export.ts`, banco → JSON) | ~~`references`~~ | **Mesma divergência, lado da exportação** |
| Coluna do CSV (arquivo, não metadata) | [scripts/seed/questions/convert/columns.ts](scripts/seed/questions/convert/columns.ts), [validate.ts](scripts/seed/questions/convert/validate.ts), [convert.ts](scripts/seed/questions/convert/convert.ts) | `references` (nome da coluna/campo do arquivo) | Formato do arquivo CSV/JSON de seed — não é a chave do banco, não precisa mudar |
| Ferramenta de extração de PDF (upstream) | `tools/question-pipeline/src/export-csv.ts`, `merge-questions.ts` | coluna `references` sempre vazia (placeholder) | Não lê/grava `questions.metadata`, só produz a coluna do CSV — nenhuma dependência do banco |
| Schema não utilizado | `scripts/seed/questions/pdf/schema.ts` | `references` | Sem nenhum importador em todo o repositório — código morto, fora de escopo |

**Conclusão do mapeamento:** 100% da aplicação viva (admin, SIA, aluno, importação em massa via UI, Motor Editorial de IA) já usava `metadata.bibliography`. A única divergência real estava isolada em 2 funções de um único arquivo (`scripts/seed/questions/entities.ts`), usado apenas pelo par `seed.ts` (gravação) / `export.ts` (leitura) do pipeline de linha de comando.

## ETAPA 2 — Contrato oficial adotado

**`metadata.bibliography` (string única).** Escolhido por já ser o contrato dominante e mais profundamente integrado (SIA, admin, aluno, importação em massa, Motor Editorial de IA) — alterar esses consumidores entraria em conflito direto com as restrições desta sprint ("não alterar SIA", "não alterar UX"). A coluna do arquivo CSV **continua se chamando `references`** e continua aceitando múltiplas citações separadas por `|`/`;` (nenhuma mudança no contrato externo do arquivo) — a tradução para uma única string acontece exatamente na fronteira entre o arquivo de seed e o banco, dentro de `buildSeedMetadata`/`readSeedMetadata`, o ponto que já existia especificamente para essa tradução.

## ETAPA 3 — Consumidores corrigidos

### 1. [scripts/seed/questions/entities.ts](scripts/seed/questions/entities.ts#L256-L280)
- `buildSeedMetadata`: `metadata.references = item.references` → `metadata.bibliography = item.references.join("; ")` (múltiplas citações do CSV, se houver, unidas em uma única string — mesmo padrão que o admin já usa: 1 campo, texto livre).
- `readSeedMetadata`: `references: Array.isArray(m.references) ? ... : []` → agora lê `m.bibliography` e devolve `references: bibliography ? [bibliography] : []`, preservando o formato de array do arquivo de seed sem reintroduzir a chave antiga no banco.

Nenhum outro arquivo precisou de alteração — todos os demais já liam/gravavam `bibliography`.

### 2. Backfill dos dados já gravados com a chave antiga (banco de produção)
Sem alteração de código, ambas as funções corrigidas só afetam gravações/leituras futuras — os registros já existentes continuavam com `metadata.references` até serem reescritos. Para não deixar "compatibilidade parcial" nos dados (exigência explícita desta sprint), corrigi diretamente os registros já afetados:
- **10 questões piloto** (Sprint 6.9): `metadata.references` → `metadata.bibliography`.
- **11 questões reais pré-existentes**, encontradas na mesma varredura completa do banco (EBSERH 2015, Enfermeiro – Saúde Mental, já importadas antes desta sprint pelo mesmo pipeline com o mesmo defeito, portanto silenciosamente sem referência visível ao aluno até agora): mesma correção aplicada.
- Varredura final confirma **0 questões com `metadata.references` remanescente** em toda a plataforma (1.293 questões escaneadas), **21 com `metadata.bibliography`** (10 + 11, exatamente as corrigidas — nenhuma outra alterada).

## Compatibilidade com questões antigas

Nenhuma das 1.293 questões teve qualquer outro campo alterado (`statement`, `alternatives`, `correct_answer`, `topic_id`, etc. intocados — só a chave de metadata das 21 que realmente tinham o defeito). As demais 1.272 questões (sem `references` nem `bibliography`, ou já com `bibliography` correto desde o início) não foram tocadas.

## ETAPA — Validação

- **`npx tsc --noEmit`**: limpo, sem erros de tipo.
- **Reconversão real do CSV piloto** (`urgencia-emergencia-piloto-n1.csv`) com o código corrigido: 10/10 convertidas, campo `references` do arquivo de seed preservado como array (formato do arquivo inalterado, só a gravação no banco muda).
- **Reconversão real do CSV de produção** (`docs/imports/questions.csv`, 204 linhas reais): 204/204 convertidas, sem erro — nenhuma regressão no pipeline.
- **Reabertura das 10 questões piloto** (consulta direta ao banco, pós-correção): todas as 10 agora com `metadata.bibliography` preenchido com o texto correto (ex.: `"AHA Guidelines 2025 - RCP de alta qualidade em adultos"`) e sem `references` residual — exatamente a chave que `QuestionFeedbackPanel.tsx` (aluno) e `QuestionsPage.tsx` (admin) já sabem ler, sem precisar de nenhuma alteração nesses componentes.
- **Varredura completa da plataforma** (1.293 questões, paginada): confirma 0 chaves `references` remanescentes e 21 com `bibliography` — as 10 piloto + as 11 reais legadas corrigidas.

## Encerramento desta fase

Contrato único (`metadata.bibliography`) aplicado de ponta a ponta — no código (pipeline de seed) e nos dados já gravados (21 questões corrigidas, 10 piloto + 11 reais legadas). Nenhuma questão nova produzida, nenhum SIA, pipeline editorial de IA, taxonomia ou UX alterados. Encerrando imediatamente, conforme instrução explícita.
