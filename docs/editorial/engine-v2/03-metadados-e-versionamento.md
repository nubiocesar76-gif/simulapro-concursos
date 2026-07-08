# 03 — Metadados e Versionamento

## 1. Envelope de metadados (nível arquivo/dataset)

Todo arquivo/dataset exportado pela Engine (uma tabela inteira, um snapshot,
um export para importação) é embrulhado por um envelope padrão. Isso é
distinto dos metadados por registro (seção 3) — este é o cabeçalho do
**lote**.

| Campo | Descrição |
|---|---|
| metadata.description | O que este dataset representa |
| metadata.generatedBy | Processo/pessoa que gerou o export (ex.: "SimulaPro Seed Engine", "revisão manual — Nubio", "classificador IA v2") |
| engineVersion | Versão da Editorial Engine que produziu este export (schema + regras de negócio vigentes no momento) — permite reprocessar dados antigos sabendo qual comportamento da Engine os gerou |
| course | Curso a que este export se refere (ou `TRANSVERSAL` quando o dataset cobre disciplinas compartilhadas entre cursos) |
| position | Cargo a que este export se refere, quando aplicável (nulo quando o dataset é curso-inteiro, não cargo-específico) |
| createdAt | Timestamp de criação do dataset |
| updatedAt | Timestamp da última atualização do dataset |
| createdBy | Identidade de quem/o-que criou (humano, pipeline, modelo de IA + versão) |
| source | Proveniência do dataset — ex.: "dossiê editorial manual", "importação de prova real (docs/work/ebserh-2025)", "sugestão de IA não revisada" |

Este envelope é o que estava faltando em todos os arquivos de
`docs/editorial/normalized/` na Fase 2 — lá cada arquivo era "nu" (só o
array de dados). Em V2, isso deixa de ser aceitável: nenhum dataset é
publicado sem seu envelope de metadados.

## 2. Metadados por registro (nível entidade)

Além do envelope do arquivo, **cada registro individual** dentro das
entidades de conteúdo (Discipline, Topic, Subtopic, ClassificationRule)
carrega seu próprio sub-bloco de proveniência — porque registros dentro do
mesmo arquivo podem ter nascido em momentos e fontes diferentes (ex.: 26
disciplinas curadas manualmente + 3 disciplinas novas sugeridas por IA numa
atualização posterior, todas no mesmo arquivo `disciplinas`).

Isso é detalhado em `04-evidencias-confianca-evolucao.md` (origin,
confidence, evidenceCount, createdFrom, sources, lastValidated).

## 3. Versionamento — três camadas independentes

V2 versiona em três granularidades que não devem ser confundidas:

### 3.1 Versão da Engine (`engineVersion`)

Muda quando o **schema** ou as **regras de negócio do motor** mudam (ex.:
adicionar o conceito de Editorial Module é um bump de engineVersion "major";
adicionar um novo enum de categoria de sigla é um bump "minor"). Segue
semver (`MAJOR.MINOR.PATCH`):
- **MAJOR**: mudança de schema que quebra compatibilidade (ex.: V1 → V2,
  porque `disciplinas` deixou de ser uma lista fixa por curso).
- **MINOR**: nova entidade ou novo campo opcional, retrocompatível (ex.:
  adicionar `EditorialModule` "Jurisprudência").
- **PATCH**: correção de bug de regra sem mudança de estrutura.

### 3.2 Versão do dataset por curso (`course.version`)

Cada Course Configuration (o conjunto de dados de um curso específico) tem
sua própria versão, independente da Engine. Enfermagem pode estar na
versão `1.3.0` do seu dataset enquanto a Engine está na `2.0.0` — o dataset
de Enfermagem só precisa subir de versão quando seu **conteúdo** muda
(nova disciplina, assunto reclassificado, etc.), não quando a Engine ganha
um módulo novo que Enfermagem nem usa.

### 3.3 Versão por registro (`record.version` + changelog)

Todo registro de conteúdo (Discipline, Topic, Subtopic, Rule,
EditorialReference) tem:

| Campo | Descrição |
|---|---|
| version | Inteiro incremental, sobe a cada mudança de conteúdo do próprio registro |
| supersededBy | Nulo, ou aponta para o `id` do registro que o substituiu (usado em merges — ex.: quando a duplicidade de "SAE" identificada na Fase 1/2 for resolvida, o registro removido não é deletado, é marcado `supersededBy` apontando para o registro canônico, preservando o histórico de toda questão já classificada com o id antigo) |
| changelog | Lista append-only de entradas `{ timestamp, autor, campoAlterado, valorAnterior, valorNovo, motivo }` |

**Regra de ouro**: nenhuma entidade de conteúdo é editada in-place sem
deixar rastro. Isso é o que separa um "documento de pesquisa" (V1) de um
"motor de produção" (V2): o motor precisa poder responder "por que essa
questão foi classificada assim em março, e por que a classificação mudou em
julho" três anos depois.

## 4. Ciclo de vida de um registro (status)

Complementa o versionamento com uma máquina de estados simples:

```
PROPOSTO → EM_REVISAO → APROVADO → PUBLICADO → (DEPRECIADO | MESCLADO)
```

- **PROPOSTO**: acabou de ser criado (por humano, pipeline ou IA), ainda não
  passou por nenhum crivo.
- **EM_REVISAO**: está na fila de revisão humana (normalmente por ter
  `confidence` abaixo do limiar — ver arquivo 04).
- **APROVADO**: revisado e confirmado, mas ainda não propagado para
  produção (útil para lotes/releases controlados).
- **PUBLICADO**: em uso ativo pela Engine para classificar questões novas.
- **DEPRECIADO**: não deve mais ser usado para novas classificações, mas
  preservado por compatibilidade histórica.
- **MESCLADO**: foi absorvido por outro registro (`supersededBy` preenchido).

## 5. Compatibilidade com o que já existe no projeto

Este versionamento não substitui o pipeline de arquivos já existente em
`docs/work/<prova>/status.json` — ele é complementar: `status.json`
versiona **o processamento de uma prova** (PLANNED → DOWNLOADED →
PROCESSING → REVIEW → APPROVED → IMPORTED → PUBLISHED, já definido em
`exam_catalog_status` na migration `20260708090000_exam_catalog.sql`); o
versionamento desta seção versiona **o conteúdo estrutural da taxonomia**
(disciplinas/assuntos/regras). Os dois ciclos de vida se cruzam no ponto em
que uma prova `APPROVED` gera evidência que incrementa `evidenceCount` e
pode mudar o `status` de uma regra de `EM_REVISAO` para `APROVADO`.
