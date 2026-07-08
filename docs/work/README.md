# Pastas de trabalho — Pipeline de Produção de Questões

Cada prova oficial possui uma pasta própria de processamento.

## Estrutura por prova

```
docs/work/<workId>/
├── metadata.json       # Identificação da prova e contexto
├── source.pdf          # Cópia do PDF original
├── raw.md              # Texto bruto da prova (antes da IA)
├── questions.raw.json  # Rascunho estruturado (futuro: saída da IA)
├── review.json         # Controle de revisão humana
├── status.json         # Estágio atual do pipeline
└── gabarito.pdf        # Gabarito oficial (quando disponível)
```

## Estágios do pipeline (`status.json`)

| Estágio | Descrição |
|---------|-----------|
| `REGISTERED` | PDF recebido, pasta criada |
| `DOWNLOADED` | Prova homologada, arquivos validados |
| `TEXT_EXTRACTED` | Texto bruto disponível em `raw.md` |
| `EXTRACTING` | IA estruturando questões (futuro) |
| `REVIEW` | Revisão humana |
| `APPROVED` | Questões aprovadas |
| `CONVERTED` | Exportado para `questions.json` |
| `SEEDED` | Importado no banco via `seed:questions` |

## Fluxo oficial

```
source.pdf
    ↓
raw.md
    ↓
questions.raw.json
    ↓
review.json
    ↓
docs/seeds/questions.json
    ↓
npm run seed:questions
```

## Exemplo

Ver `docs/work/ebserh-2025/` para referência dos contratos.
