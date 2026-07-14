# Base Editorial de Classificação — Editorial Engine V1

Este diretório é a **fonte oficial de conhecimento** para classificação de questões
de concursos de Enfermagem (cargo **Enfermeiro**) no SimulaPro. Não contém código,
não executa inferência e **não substitui** a revisão humana nesta versão.

## Propósito

Definir regras estáveis, auditáveis e mensuráveis para preencher os campos
semânticos de cada questão:

| Campo | Documento de referência |
|---|---|
| `board` | `01-boards.md` |
| `subject` (disciplina) | `02-subjects.md` |
| `topic` (assunto) | `03-topics.md` |
| `keywords` | `04-keywords.md` |
| `difficulty` | `05-difficulty.md` |
| `explanation` | `06-explanation.md` |
| Regras transversais | `07-rules.md` |
| Exemplos completos | `08-examples.md` |
| Revisão humana | `09-quality-checklist.md` |

## Arquitetura editorial

```
Questão extraída (pipeline)
        │
        ▼
classification.template.json   ← humano ou IA futura preenche aqui
        │
        │  consulta obrigatoriamente:
        ▼
docs/editorial/classification/   ← ESTE DIRETÓRIO (fonte de verdade das regras)
        │
        ▼
questions.csv → convert → seed → banco
```

### Relação com outros documentos

| Camada | Caminho | Função |
|---|---|---|
| **Regras de classificação (V1)** | `docs/editorial/classification/` | Como classificar — regras oficiais para humanos e IA |
| Taxonomia editorial V1.1 | `docs/editorial/normalized/` | Dados estruturados (disciplinas, assuntos, subassuntos, perfis de banca) |
| Dossiês por área | `docs/editorial/02a`–`02l` | Profundidade clínica e casos ambíguos detalhados |
| Seed operacional | `docs/seeds/taxonomy.json` | Slugs usados hoje por `convert:questions` e banco |
| Pipeline | `tools/question-pipeline/` | Extração mecânica + template + merge (sem IA) |

**Regra de precedência:** quando houver conflito entre seed legado e editorial V1.1,
as regras deste diretório seguem a **arquitetura V1.1** (`docs/editorial/auditoria/V1.1-arquitetura-corrigida.md`).
O seed será alinhado em sprint futura — não inventar disciplinas fora desta base.

## Como a IA futura utilizará esta base

1. **Leitura obrigatória antes de classificar:** IA recebe enunciado + alternativas + gabarito e consulta este diretório como system prompt / RAG.
2. **Saída restrita:** IA preenche **somente** `classification.template.json` — nunca altera extração, CSV, convert ou seed.
3. **Validação determinística:** `pipeline:merge` rejeita classificação fora da taxonomia ou com campos vazios.
4. **Confiança:** IA deve citar regra aplicada (ex.: R-CL-03) e assunto escolhido (ex.: D10-A02); baixa confiança → marcar para revisão humana.
5. **Sem opinião:** dificuldade e explicação seguem critérios objetivos de `05-difficulty.md` e `06-explanation.md`.

## Escopo

- **Curso:** Enfermagem
- **Cargo principal:** Enfermeiro (nível superior, COFEN/COREN)
- **Bancas:** 22 cadastradas em `docs/seeds/taxonomy.json`
- **Disciplinas ativas:** 21 (modelo editorial V1.1)
- **Assuntos:** 107 (modelo editorial V1.1)

## Governança

1. Nova disciplina ou assunto exige PR editorial **antes** de entrar no seed.
2. Alteração de norma (lei/portaria) exige data de vigência — provas antigas mantêm redação da época.
3. Toda ambiguidade nova identificada em `docs/work/<prova>/review.json` deve virar regra em `07-rules.md`.
4. Este diretório é versionado em git — é a auditoria permanente das decisões editoriais.

## Índice dos arquivos

| Arquivo | Conteúdo |
|---|---|
| `01-boards.md` | 22 bancas: nome oficial, slug, observações |
| `02-subjects.md` | 21 disciplinas ativas + legado/exceções |
| `03-topics.md` | 107 assuntos por disciplina |
| `04-keywords.md` | Regras de palavras-chave |
| `05-difficulty.md` | Critérios objetivos de dificuldade |
| `06-explanation.md` | Padrão de redação de explicações |
| `07-rules.md` | Regras editoriais numeradas |
| `08-examples.md` | Exemplos completos de classificação |
| `09-quality-checklist.md` | Checklist de revisão humana |
