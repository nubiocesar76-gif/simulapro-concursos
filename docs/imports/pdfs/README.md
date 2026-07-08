# Provas oficiais (PDF)

Coloque aqui os PDFs das provas que serão processadas pelo pipeline de produção de questões.

## Uso

```bash
npm run pipeline:init -- docs/imports/pdfs/ebserh-2025.pdf
```

Isso cria a pasta de trabalho em `docs/work/ebserh-2025/` com todos os artefatos do pipeline.

## Metadados opcionais

Variáveis de ambiente no momento do `pipeline:init`:

| Variável | Exemplo |
|----------|---------|
| `PIPELINE_ORGANIZATION` | `EBSERH` |
| `PIPELINE_CONTEST` | `ebserh` |
| `PIPELINE_BOARD` | `fgv` |
| `PIPELINE_POSITION` | `enfermeiro` |
| `PIPELINE_YEAR` | `2025` |

## Fluxo futuro

```
PDF → IA → questions.raw.json → Revisão → questions.json → seed:questions
```

Nesta sprint apenas o registro e a estrutura de trabalho estão implementados.
