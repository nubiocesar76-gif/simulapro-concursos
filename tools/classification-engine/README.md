# Classification Engine V1

Motor **independente** de validação editorial. Não classifica, não usa IA, não modifica dados — apenas verifica se `classification.json` está correto.

## Objetivo

Validar classificações produzidas por humanos (ou, no futuro, por qualquer IA) contra:

- Taxonomia oficial (`tools/taxonomy-engine/taxonomy.index.json`)
- Regras editoriais (`docs/editorial/classification/`)
- Alinhamento com `questions.raw.json`

## Arquitetura

```
questions.raw.json ──────┐
classification.json ─────┼──► loader.ts
taxonomy.index.json ─────┤         │
docs/editorial/classification/ ───┤
                                  ▼
                            validator.ts ◄── rules.ts
                                  │
                                  ▼
                            report.ts
                                  │
                                  ▼
                      classification.report.json
```

## Fluxo

1. Carregar entradas (raw + classificação + taxonomia + regras).
2. Validar alinhamento questão-a-questão.
3. Para cada questão não anulada, verificar taxonomia e regras editoriais.
4. Acumular issues com código, severidade e sugestão.
5. Gerar `classification.report.json` — **sempre**, mesmo com erros fatais.

## Entradas

| Arquivo | Caminho padrão |
|---|---|
| `questions.raw.json` | `tools/question-pipeline/output/questions.raw.json` |
| `classification.json` | `tools/question-pipeline/output/classification.json` |
| `taxonomy.index.json` | `tools/taxonomy-engine/taxonomy.index.json` |
| Regras editoriais | `docs/editorial/classification/` |

## Saída

`tools/classification-engine/output/classification.report.json`:

```json
{
  "summary": {
    "questions": 80,
    "approved": 77,
    "warnings": 2,
    "errors": 1,
    "skippedAnuladas": 0
  },
  "issues": [
    {
      "question": 18,
      "severity": "ERROR",
      "code": "ASSUNTO_FORA_DA_DISCIPLINA",
      "message": "...",
      "suggestion": "..."
    }
  ]
}
```

## Códigos de validação

| Código | Severidade típica |
|---|---|
| `JSON_INVÁLIDO` | ERROR |
| `DISCIPLINA_INEXISTENTE` | ERROR |
| `ASSUNTO_INEXISTENTE` | ERROR |
| `ASSUNTO_FORA_DA_DISCIPLINA` | ERROR |
| `BANCA_INEXISTENTE` | ERROR |
| `CONCURSO_INEXISTENTE` | ERROR |
| `CARGO_INEXISTENTE` | ERROR |
| `ANO_INVALIDO` | ERROR |
| `KEYWORD_DUPLICADA` | ERROR |
| `KEYWORD_FORA_DO_PADRÃO` | ERROR |
| `DIFICULDADE_INVALIDA` | ERROR |
| `EXPLICAÇÃO_VAZIA` | ERROR |
| `REGRA_EDITORIAL_DESCUMPRIDA` | WARNING ou ERROR |
| `CLASSIFICACAO_AUSENTE` | ERROR |
| `QUESTAO_ORFA` | ERROR |

## Estrutura

```
tools/classification-engine/
├── README.md
├── output/
│   └── classification.report.json
├── src/
│   ├── types.ts
│   ├── loader.ts
│   ├── rules.ts
│   ├── validator.ts
│   ├── report.ts
│   └── run.ts
└── tests/
    └── classification-engine.test.ts
```

## Execução

```bash
npx tsx tools/classification-engine/src/run.ts
node --import tsx --test tools/classification-engine/tests/classification-engine.test.ts
```

## Integração futura com IA

1. IA (qualquer provedor) produz `classification.json`.
2. `Classification Engine` valida e gera relatório.
3. Humano corrige issues ou IA reitera com base nas sugestões.
4. Somente após `summary.errors === 0` (ou política definida), `pipeline:merge` pode prosseguir.

Este motor **não conhece** Claude, OpenAI, Gemini, DeepSeek ou qualquer provedor — recebe apenas JSON.

## Limitações V1

- Não valida coerência semântica profunda (ex.: se disciplina faz sentido para o enunciado).
- Regras editoriais R-009–R-052 não são inferidas automaticamente — apenas regras codificáveis.
- Sinônimos de taxonomia dependem do índice exportado.
- Não altera arquivos de entrada.
