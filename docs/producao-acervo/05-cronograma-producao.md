# 05 — Cronograma de Produção

**Última revisão:** 2026-07-09
**Escopo:** processar 100 provas oficiais de Enfermeiro. Catálogo atual
(`docs/catalog/enfermagem.csv`) já mapeia 67; faltam 33 a definir e
catalogar antes de entrarem no pipeline (ver Onda 5).

O cronograma é organizado em **ondas**, não em datas fixas de calendário —
cada onda só começa quando a anterior valida o pipeline naquele tipo de
prova. Isso segue a decisão já registrada em `docs/CHANGELOG.md`
(Sprint 11.2: "arquitetura congelada, próximos agentes trabalham sobre a
infraestrutura existente").

## Onda 0 — Prova-piloto (validação ponta a ponta)

**Escopo:** `ebserh-2025` (única prova hoje em `DOWNLOADED`).

**Objetivo:** validar o pipeline completo — `source.pdf` → `raw.md` →
`questions.raw.json` → `review.json` → `docs/seeds/questions.json` →
`npm run seed:questions` — numa única prova antes de escalar para lote.

**Critério de saída da onda:** `ebserh-2025` em `SEEDED`, questões
visíveis no Acervo (`/admin/acervo`), checklist de `04-checklist-producao.md`
100% concluída.

## Onda 1 — Tier 2 alta prioridade (bancas de maior volume)

**Escopo:** provas de FGV e VUNESP do Tier 2 (`02-orgaos-prioritarios.md`):
SES-RJ, SES-MG, Prefeitura do Rio de Janeiro, Prefeitura de Belo
Horizonte, SES-SP, Prefeitura de São Paulo.

**Volume:** 3+3+3+2+3+3 = 17 provas.

**Racional:** concentra as duas bancas de maior volume total (FGV e
VUNESP), maximiza reaproveitamento do perfil de banca já documentado.

## Onda 2 — Tier 2 restante (IDIB, UFPR/NC, Consulplan)

**Escopo:** SES-BA, SES-PE, SES-PR, Prefeitura de Salvador, Prefeitura de
Recife, Prefeitura de Fortaleza, Prefeitura de Curitiba, Prefeitura de
Goiânia.

**Volume:** 3+3+3+2+2+2+2+2 = 19 provas.

**Racional:** IDIB ainda não tem perfil qualitativo documentado — primeira
prova desta onda deve gerar a atualização de
`docs/editorial/06-diferencas-entre-bancas.md` antes das demais seguirem.

## Onda 3 — Hospitais universitários (Tier 3)

**Escopo:** HC-FMUSP, HC-UFRJ, HU-UFMG, HCPA-UFRGS, HU-UFPE, HU-Unifesp,
HU-Unicamp, HU-UFBA, HU-UFPR.

**Volume:** 19 provas.

**Racional:** mesmas bancas das Ondas 1–2 (FGV, VUNESP, IDIB, UFPR/NC) —
sem custo de calibração nova, apenas volume.

## Onda 4 — Forças Armadas (Tier 4, formato Cebraspe)

**Escopo:** Marinha, Exército, Aeronáutica.

**Volume:** 9 provas.

**Racional:** isolada por último porque exige o caminho alternativo do
pipeline para itens Certo/Errado (ver `04-checklist-producao.md`, seção
"Casos especiais"). Não deve ser paralelizada com as ondas anteriores até
esse caminho estar validado numa prova.

## Onda 5 — Expansão do catálogo (33 provas restantes até 100)

**Escopo:** ainda não catalogado em `docs/catalog/enfermagem.csv`.
Candidatos levantados a partir das bancas sem prova no catálogo atual
(`01-bancas-prioritarias.md`, seção "Bancas com perfil documentado mas sem
prova") e de órgãos do mesmo perfil dos Tiers 2/3 ainda não incluídos:

- Secretarias estaduais de saúde adicionais (ex.: SES-CE, SES-PA, SES-GO,
  SES-DF, SES-ES, SES-SC, SES-RS — a confirmar existência de concurso
  ativo/recente antes de catalogar)
- Prefeituras de capitais adicionais (ex.: Manaus, Porto Alegre, Brasília)
- Hospitais universitários adicionais (ex.: HU-UFC, HU-UFPB, HU-UFRN,
  HU-UFSC, HU-UnB)

**Esta onda não deve ser iniciada sem antes**: (1) confirmar que o
concurso/prova realmente existe e tem edital homologado, (2) adicionar a
linha correspondente em `docs/catalog/enfermagem.csv` com `status=PLANNED`,
(3) atualizar `02-orgaos-prioritarios.md` e este cronograma com o total
revisado. Nenhuma prova entra no pipeline sem estar catalogada primeiro.

## Resumo por onda

| Onda | Escopo | Provas | Bancas |
|---|---|---|---|
| 0 | Piloto | 1 | FGV |
| 1 | Tier 2 alta prioridade | 17 | FGV, VUNESP |
| 2 | Tier 2 restante | 19 | IDIB, UFPR/NC, Consulplan |
| 3 | Hospitais universitários | 19 | FGV, VUNESP, IDIB, UFPR/NC |
| 4 | Forças Armadas | 9 | Cebraspe |
| 5 | Expansão do catálogo | 33 | a definir |
| **Total** | | **98*** | |

\* 67 já catalogadas (Ondas 0–4) + 33 a catalogar (Onda 5) = 100. A soma de
1+17+19+19+9 = 65, não 67, porque `ebserh-2024`/`ebserh-2023` (Tier 0/1,
2 provas) ainda não foram alocadas a uma onda — entram na Onda 1 junto com
o restante do lote FGV quando o piloto (Onda 0) validar o pipeline.
