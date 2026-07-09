# 02 — Órgãos Prioritários

**Última revisão:** 2026-07-09
**Base:** `docs/catalog/enfermagem.csv` (27 órgãos distintos, 67 provas
planejadas).

## Critério de priorização

1. **Tier 0** — já iniciado (prova homologada e em processamento).
2. **Tier 1** — alcance nacional/múltiplos campi (maior reaproveitamento
   de taxonomia e maior volume potencial de usuários).
3. **Tier 2** — capitais e grandes secretarias estaduais de saúde.
4. **Tier 3** — hospitais universitários (público mais específico, prova
   tecnicamente mais rica).
5. **Tier 4** — forças armadas (público de nicho, formato Cebraspe exige
   adaptação do pipeline).

## Tier 0 — Já iniciado

| Órgão | Provas no catálogo | Status atual |
|---|---|---|
| **EBSERH** | 3 (2025, 2024, 2023) | `ebserh-2025` em `DOWNLOADED` (ver `03-status-processamento.md`) |

## Tier 1 — Alcance nacional

| Órgão | Provas no catálogo | Banca |
|---|---|---|
| EBSERH | 3 | FGV |

*(EBSERH é o único órgão de alcance nacional já mapeado; candidatos a
somar a este tier no backlog de expansão: concursos de residência/RJU
federais adicionais — a definir.)*

## Tier 2 — Secretarias estaduais de saúde e prefeituras de capitais

| Órgão | Provas | Banca |
|---|---|---|
| SES-SP | 3 | VUNESP |
| SES-RJ | 3 | FGV |
| SES-MG | 3 | FGV |
| SES-BA | 3 | IDIB |
| SES-PE | 3 | Instituto Consulplan |
| SES-PR | 3 | UFPR / NC |
| Prefeitura de São Paulo | 3 | VUNESP |
| Prefeitura do Rio de Janeiro | 3 | FGV |
| Prefeitura de Belo Horizonte | 2 | FGV |
| Prefeitura de Curitiba | 2 | UFPR / NC |
| Prefeitura de Salvador | 2 | IDIB |
| Prefeitura de Recife | 2 | IDIB |
| Prefeitura de Fortaleza | 2 | IDIB |
| Prefeitura de Goiânia | 2 | Quadrix |

**Subtotal Tier 2:** 36 provas / 14 órgãos.

## Tier 3 — Hospitais universitários

| Órgão | Provas | Banca |
|---|---|---|
| HC-FMUSP | 3 | FGV |
| HC-UFRJ | 2 | FGV |
| HU-UFMG | 2 | FGV |
| HCPA-UFRGS | 2 | FGV |
| HU-UFPE | 2 | IDIB |
| HU-Unifesp | 2 | VUNESP |
| HU-Unicamp | 2 | FGV |
| HU-UFBA | 2 | IDIB |
| HU-UFPR | 2 | UFPR / NC |

**Subtotal Tier 3:** 19 provas / 9 órgãos.

## Tier 4 — Forças Armadas

| Órgão | Provas | Banca |
|---|---|---|
| Marinha do Brasil | 3 | Cebraspe |
| Exército Brasileiro | 3 | Cebraspe |
| Força Aérea Brasileira | 3 | Cebraspe |

**Subtotal Tier 4:** 9 provas / 3 órgãos.

## Resumo

| Tier | Órgãos | Provas |
|---|---|---|
| Tier 0/1 | 1 | 3 |
| Tier 2 | 14 | 36 |
| Tier 3 | 9 | 19 |
| Tier 4 | 3 | 9 |
| **Total mapeado hoje** | **27** | **67** |

Faltam **33 provas** para completar as 100 do escopo desta fase — ver
proposta de expansão em `05-cronograma-producao.md`.

## Ordem de ataque recomendada

1. Concluir o pipeline completo da primeira prova (`ebserh-2025`, Tier 0)
   até `SEEDED`, validando o processo ponta a ponta antes de escalar.
2. Tier 2 (secretarias estaduais + capitais) — maior volume de usuários
   potenciais, concentra as bancas de maior prioridade (FGV, VUNESP, IDIB).
3. Tier 3 (hospitais universitários) — reaproveita taxonomia já calibrada
   nas mesmas bancas do Tier 2.
4. Tier 4 (Forças Armadas) — isolar por último porque exige adaptação do
   pipeline ao formato Certo/Errado do Cebraspe.
