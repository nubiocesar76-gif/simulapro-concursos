# 03 — Status de Processamento

**Última revisão:** 2026-07-09
**Fonte de verdade:** `docs/catalog/enfermagem.csv` (coluna `status`) e
`docs/work/<workId>/status.json` (histórico detalhado por prova).
Este documento é um **snapshot manual** — deve ser atualizado sempre que o
status de uma ou mais provas mudar no catálogo, não é gerado
automaticamente.

## Estágios do pipeline (referência)

Definidos em `docs/work/README.md`:

| Estágio | Descrição |
|---|---|
| `REGISTERED` | PDF recebido, pasta criada |
| `DOWNLOADED` | Prova homologada, arquivos validados |
| `TEXT_EXTRACTED` | Texto bruto disponível em `raw.md` |
| `EXTRACTING` | IA estruturando questões (futuro) |
| `REVIEW` | Revisão humana |
| `APPROVED` | Questões aprovadas |
| `CONVERTED` | Exportado para `questions.json` |
| `SEEDED` | Importado no banco via `seed:questions` |

Além disso, o catálogo usa `PLANNED` para provas ainda não iniciadas
(nenhuma pasta em `docs/work/` criada).

## Snapshot atual (2026-07-09)

| Estágio | Qtd. de provas | IDs |
|---|---|---|
| `SEEDED` | 0 | — |
| `CONVERTED` | 0 | — |
| `APPROVED` | 0 | — |
| `REVIEW` | 0 | — |
| `EXTRACTING` | 0 | — |
| `TEXT_EXTRACTED` | 0 | — |
| `DOWNLOADED` | 1 | `ebserh-2025` |
| `REGISTERED` | 0 | — |
| `PLANNED` | 66 | ver `docs/catalog/enfermagem.csv` |
| **Total no catálogo atual** | **67** | |
| **Meta desta fase** | **100** | 33 provas ainda não catalogadas — ver `05-cronograma-producao.md` |

## Detalhe da prova em processamento

### `ebserh-2025`

- Estágio: `DOWNLOADED` (ver `docs/work/ebserh-2025/status.json`)
- Órgão: EBSERH · Banca: FGV · Cargo: Enfermeiro · Ano: 2025
- Próximo passo: `TEXT_EXTRACTED` — extrair texto bruto de `source.pdf`
  para `raw.md`
- Observação do catálogo: "Primeira prova homologada do acervo — pronta
  para extração"

## Como atualizar este documento

1. Consultar `docs/catalog/enfermagem.csv` e contar provas por valor da
   coluna `status`.
2. Para cada prova fora de `PLANNED`, confirmar o estágio real em
   `docs/work/<workId>/status.json` (o catálogo pode estar um passo atrás
   do `status.json`, que é o registro mais granular).
3. Atualizar a tabela acima e a data de "última revisão" no topo.
4. Não inferir estágio por suposição — se um `workId` não tem pasta em
   `docs/work/`, o status correto é `PLANNED`, independentemente do que
   outro documento diga.
