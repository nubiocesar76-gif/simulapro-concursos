# 06 — Controle das Provas

**Última revisão:** 2026-07-09
**Fonte de verdade:** `docs/catalog/enfermagem.csv`. Este documento **não
duplica** o catálogo — é a camada de controle (onda, responsável, data)
que o CSV não tem. Ao ler o status real de uma prova, sempre consultar o
CSV; ao planejar quem/quando processa, consultar esta tabela.

## Colunas do catálogo (referência)

`docs/catalog/enfermagem.csv` já traz: `id`, `status`, `organization`,
`contest`, `year`, `board`, `position`, `questions`, `pdf`, `answer_key`,
`imported`, `reviewed`, `approved`, `package`, `observations`, `verified`,
`pdf_available`, `answer_key_available`.

## Camada de controle (por prova)

Preencher `Onda` e `Responsável` conforme a prova é alocada (ver
`05-cronograma-producao.md`); preencher `Data alvo` e `Data conclusão`
conforme o trabalho avança. Este bloco deve ser atualizado junto com o
catálogo — nunca deixar as duas fontes divergirem por mais de um estágio.

### Onda 0 — Piloto

| workId | Órgão | Banca | Status catálogo | Onda | Responsável | Data alvo | Data conclusão |
|---|---|---|---|---|---|---|---|
| `ebserh-2025` | EBSERH | FGV | `DOWNLOADED` | 0 | — | — | — |

### Onda 1 — Tier 2 alta prioridade (FGV, VUNESP)

| workId | Órgão | Banca | Status catálogo | Onda | Responsável | Data alvo | Data conclusão |
|---|---|---|---|---|---|---|---|
| `ebserh-2024` | EBSERH | FGV | `PLANNED` | 1 | — | — | — |
| `ebserh-2023` | EBSERH | FGV | `PLANNED` | 1 | — | — | — |
| `ses-rj-2025` | SES-RJ | FGV | `PLANNED` | 1 | — | — | — |
| `ses-rj-2024` | SES-RJ | FGV | `PLANNED` | 1 | — | — | — |
| `ses-rj-2023` | SES-RJ | FGV | `PLANNED` | 1 | — | — | — |
| `ses-mg-2025` | SES-MG | FGV | `PLANNED` | 1 | — | — | — |
| `ses-mg-2024` | SES-MG | FGV | `PLANNED` | 1 | — | — | — |
| `ses-mg-2023` | SES-MG | FGV | `PLANNED` | 1 | — | — | — |
| `pref-rio-de-janeiro-2025` | Prefeitura RJ | FGV | `PLANNED` | 1 | — | — | — |
| `pref-rio-de-janeiro-2024` | Prefeitura RJ | FGV | `PLANNED` | 1 | — | — | — |
| `pref-rio-de-janeiro-2023` | Prefeitura RJ | FGV | `PLANNED` | 1 | — | — | — |
| `pref-belo-horizonte-2025` | Prefeitura BH | FGV | `PLANNED` | 1 | — | — | — |
| `pref-belo-horizonte-2024` | Prefeitura BH | FGV | `PLANNED` | 1 | — | — | — |
| `ses-sp-2025` | SES-SP | VUNESP | `PLANNED` | 1 | — | — | — |
| `ses-sp-2024` | SES-SP | VUNESP | `PLANNED` | 1 | — | — | — |
| `ses-sp-2023` | SES-SP | VUNESP | `PLANNED` | 1 | — | — | — |
| `pref-sao-paulo-2025` | Prefeitura SP | VUNESP | `PLANNED` | 1 | — | — | — |
| `pref-sao-paulo-2024` | Prefeitura SP | VUNESP | `PLANNED` | 1 | — | — | — |
| `pref-sao-paulo-2023` | Prefeitura SP | VUNESP | `PLANNED` | 1 | — | — | — |

### Onda 2 — Tier 2 restante (IDIB, UFPR/NC, Consulplan)

| workId | Órgão | Banca | Status catálogo | Onda | Responsável | Data alvo | Data conclusão |
|---|---|---|---|---|---|---|---|
| `ses-ba-2025` | SES-BA | IDIB | `PLANNED` | 2 | — | — | — |
| `ses-ba-2024` | SES-BA | IDIB | `PLANNED` | 2 | — | — | — |
| `ses-ba-2023` | SES-BA | IDIB | `PLANNED` | 2 | — | — | — |
| `pref-salvador-2025` | Prefeitura Salvador | IDIB | `PLANNED` | 2 | — | — | — |
| `pref-salvador-2024` | Prefeitura Salvador | IDIB | `PLANNED` | 2 | — | — | — |
| `pref-recife-2025` | Prefeitura Recife | IDIB | `PLANNED` | 2 | — | — | — |
| `pref-recife-2024` | Prefeitura Recife | IDIB | `PLANNED` | 2 | — | — | — |
| `pref-fortaleza-2025` | Prefeitura Fortaleza | IDIB | `PLANNED` | 2 | — | — | — |
| `pref-fortaleza-2024` | Prefeitura Fortaleza | IDIB | `PLANNED` | 2 | — | — | — |
| `ses-pe-2025` | SES-PE | Consulplan | `PLANNED` | 2 | — | — | — |
| `ses-pe-2024` | SES-PE | Consulplan | `PLANNED` | 2 | — | — | — |
| `ses-pe-2023` | SES-PE | Consulplan | `PLANNED` | 2 | — | — | — |
| `ses-pr-2025` | SES-PR | UFPR/NC | `PLANNED` | 2 | — | — | — |
| `ses-pr-2024` | SES-PR | UFPR/NC | `PLANNED` | 2 | — | — | — |
| `ses-pr-2023` | SES-PR | UFPR/NC | `PLANNED` | 2 | — | — | — |
| `pref-curitiba-2025` | Prefeitura Curitiba | UFPR/NC | `PLANNED` | 2 | — | — | — |
| `pref-curitiba-2024` | Prefeitura Curitiba | UFPR/NC | `PLANNED` | 2 | — | — | — |
| `pref-goiania-2025` | Prefeitura Goiânia | Quadrix | `PLANNED` | 2 | — | — | — |
| `pref-goiania-2024` | Prefeitura Goiânia | Quadrix | `PLANNED` | 2 | — | — | — |

### Onda 3 — Hospitais universitários

| workId | Órgão | Banca | Status catálogo | Onda | Responsável | Data alvo | Data conclusão |
|---|---|---|---|---|---|---|---|
| `hu-hc-fmusp-2025` | HC-FMUSP | FGV | `PLANNED` | 3 | — | — | — |
| `hu-hc-fmusp-2024` | HC-FMUSP | FGV | `PLANNED` | 3 | — | — | — |
| `hu-hc-fmusp-2023` | HC-FMUSP | FGV | `PLANNED` | 3 | — | — | — |
| `hu-hc-ufrj-2025` | HC-UFRJ | FGV | `PLANNED` | 3 | — | — | — |
| `hu-hc-ufrj-2024` | HC-UFRJ | FGV | `PLANNED` | 3 | — | — | — |
| `hu-hu-ufmg-2025` | HU-UFMG | FGV | `PLANNED` | 3 | — | — | — |
| `hu-hu-ufmg-2024` | HU-UFMG | FGV | `PLANNED` | 3 | — | — | — |
| `hu-hcpa-ufrgs-2025` | HCPA-UFRGS | FGV | `PLANNED` | 3 | — | — | — |
| `hu-hcpa-ufrgs-2024` | HCPA-UFRGS | FGV | `PLANNED` | 3 | — | — | — |
| `hu-hu-ufpe-2025` | HU-UFPE | IDIB | `PLANNED` | 3 | — | — | — |
| `hu-hu-ufpe-2024` | HU-UFPE | IDIB | `PLANNED` | 3 | — | — | — |
| `hu-hu-unifesp-2025` | HU-Unifesp | VUNESP | `PLANNED` | 3 | — | — | — |
| `hu-hu-unifesp-2024` | HU-Unifesp | VUNESP | `PLANNED` | 3 | — | — | — |
| `hu-hu-unicamp-2025` | HU-Unicamp | FGV | `PLANNED` | 3 | — | — | — |
| `hu-hu-unicamp-2024` | HU-Unicamp | FGV | `PLANNED` | 3 | — | — | — |
| `hu-hu-ufba-2025` | HU-UFBA | IDIB | `PLANNED` | 3 | — | — | — |
| `hu-hu-ufba-2024` | HU-UFBA | IDIB | `PLANNED` | 3 | — | — | — |
| `hu-hu-ufpr-2025` | HU-UFPR | UFPR/NC | `PLANNED` | 3 | — | — | — |
| `hu-hu-ufpr-2024` | HU-UFPR | UFPR/NC | `PLANNED` | 3 | — | — | — |

### Onda 4 — Forças Armadas

| workId | Órgão | Banca | Status catálogo | Onda | Responsável | Data alvo | Data conclusão |
|---|---|---|---|---|---|---|---|
| `fa-marinha-2025` | Marinha | Cebraspe | `PLANNED` | 4 | — | — | — |
| `fa-marinha-2024` | Marinha | Cebraspe | `PLANNED` | 4 | — | — | — |
| `fa-marinha-2023` | Marinha | Cebraspe | `PLANNED` | 4 | — | — | — |
| `fa-exercito-2025` | Exército | Cebraspe | `PLANNED` | 4 | — | — | — |
| `fa-exercito-2024` | Exército | Cebraspe | `PLANNED` | 4 | — | — | — |
| `fa-exercito-2023` | Exército | Cebraspe | `PLANNED` | 4 | — | — | — |
| `fa-aeronautica-2025` | Aeronáutica | Cebraspe | `PLANNED` | 4 | — | — | — |
| `fa-aeronautica-2024` | Aeronáutica | Cebraspe | `PLANNED` | 4 | — | — | — |
| `fa-aeronautica-2023` | Aeronáutica | Cebraspe | `PLANNED` | 4 | — | — | — |

### Onda 5 — Expansão do catálogo (33 provas, ainda não catalogadas)

Nenhuma linha ainda — depende de catalogação prévia em
`docs/catalog/enfermagem.csv` (ver regra de entrada em
`05-cronograma-producao.md`, Onda 5). Preencher esta seção somente depois
que a linha correspondente existir no CSV com `status=PLANNED`.

## Como manter esta tabela viva

1. Nunca marcar `Data conclusão` sem o `status.json` correspondente estar
   em `SEEDED` e o catálogo refletir isso.
2. Se uma prova muda de onda (reprioridade), mover a linha inteira — não
   duplicar.
3. Revisar esta tabela contra o CSV a cada fechamento de onda, antes de
   abrir a próxima.
