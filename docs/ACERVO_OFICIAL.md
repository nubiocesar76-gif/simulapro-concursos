# Acervo Oficial — SimulaPro V1

**Última atualização:** 2026-07-14  
**Última validação:** 2026-07-14 — re-export `npm run export:questions` (1.000 questões)  
**Taxonomia de referência:** V1.2.1 (congelada — `docs/TAXONOMY_V1_FREEZE.md`)  
**Snapshot oficial:** `docs/seeds/questions.json` (espelho do banco)

---

## Status Geral

| Métrica | Valor | Fonte |
|---|---|---|
| **Questões oficiais no banco** | **1.000** | Supabase — validado |
| **Questões exportadas** | **1.000** | `npm run export:questions` — revalidado 2026-07-14 |
| **Questões do seed atual** | **1.000** | `docs/seeds/questions.json` — sincronizado |
| **Questões importadas nesta sessão** | **0** | Sprint de sincronização |
| **Meta da V1** | **1.500** | Fase 6 — Produção do Acervo Oficial |
| **Percentual concluído** | **66,7 %** | 1.000 ÷ 1.500 |

### Validação cruzada (2026-07-14)

| Camada | Questões | Concursos | Disciplinas | Assuntos | Status |
|---|---|---|---|---|---|
| Banco | 1.000 | 17 | 27 | 178 | ✅ |
| Export | 1.000 | 17 | 27 | 178 | ✅ |
| `questions.json` | 1.000 | 17 | 27 | 178 | ✅ |
| **Este documento** | **1.000** | **17** | **27** | **178** | ✅ |

> **banco = export = questions.json = ACERVO_OFICIAL.md**

---

## Relatório de causa raiz — divergência seed (2 × banco 1.000)

### Sintoma

Durante a sprint de Governança (2026-07-14), o seed continha **2 questões** enquanto o banco tinha **1.000**.

### Causa estrutural (raiz)

O arquivo `docs/seeds/questions.json` **nunca foi mantido como espelho do banco** após as importações de produção:

| Evento | Data | Efeito no seed |
|---|---|---|
| Commit inicial RC | 2026-07-08 (`e9c8125`) | **2 questões** de homologação (`prefeitura-municipal-de-homologacao`) — único estado **commitado** no Git |
| Commit `380ad4a` | 2026-07-09 | Seed permanece com **2 questões** |
| Importações produção (14+ concursos) | 2026-07-08 – 2026-07-13 | `seed:questions` gravou **~1.000 questões no banco**, mas **sem `export:questions` de volta** ao JSON |
| Sprint SESACRE 2022 | 2026-07-14 | `convert:questions` gerou **80 questões** no working tree — **não commitado** |
| Sprint Fase 6 SEMSA | 2026-07-14 | Merge local para **141 questões** — **não commitado** |
| Sprint Governança | 2026-07-14 | `export:questions` escreveu **1.000** no seed, seguido de **`git checkout -- docs/seeds/questions.json`**, revertendo para **2** |

**Conclusão:** a divergência não foi perda de dados no banco. Foi **desatualização crônica do seed** + **reversão acidental via `git checkout`** após export de validação.

### Comando que provocou a regressão imediata

```bash
git checkout -- docs/seeds/questions.json
```

Executado na sprint de Governança (2026-07-14), após `npm run export:questions` ter gravado corretamente 1.000 questões. O checkout restaurou a versão Git (2 questões RC), descartando o export e o estado local de 141 questões.

### Export incorreto?

**Não.** O `export:questions` funcionou corretamente (1.000 questões). O erro foi **reverter o arquivo exportado** em vez de commitá-lo.

### Substituição indevida?

**Sim — via `git checkout`**, não via pipeline/convert. O banco **não foi alterado**.

### Ação corretiva (esta sprint)

1. Backup do seed pré-sync: `docs/seeds/questions.json.pre-sync-backup-20260714.json` (2 questões RC).
2. `npm run export:questions` → snapshot oficial de **1.000 questões**.
3. Atualização deste documento com contagens reais do export.

---

## Bancas

Percentual = participação no acervo oficial (1.000 questões). Dados do export 2026-07-14.

| Banca | Slug (export) | Concursos | Questões | % |
|---|---|---|---|---|
| **FGV** | `fgv` | 6 | 346 | 34,6 % |
| **IBFC** | `ibfc` | 5 | 344 | 34,4 % |
| **AOCP** | `instituto-aocp` | 2 | 92 | 9,2 % |
| **VUNESP** | `fundacao-vunesp` | 1 | 50 | 5,0 % |
| **Consulplan** | `instituto-consulplan` | 1 | 47 | 4,7 % |
| **COSEAC** | `coseac` | 1 | 45 | 4,5 % |
| **Fundatec** | `fundatec` | 1 | 41 | 4,1 % |
| **NC/UFPR** | `ufpr-nc` | 1 | 35 | 3,5 % |
| FCC | — | 0 | 0 | 0 % |
| IDECAN | — | 0 | 0 | 0 % |
| IADES | — | 0 | 0 | 0 % |
| CESGRANRIO | — | 0 | 0 | 0 % |
| IBADE | — | 0 | 0 | 0 % |
| Cebraspe | — | 0 | 0 | 0 % |

**Total:** 1.000 questões · 17 concursos · 8 bancas com produção.

---

## Concursos

Contagens reais do banco/export (2026-07-14). Status operacional = questões presentes no acervo.

| Concurso | Banca | Ano | Status | Questões | Observações |
|---|---|---|---|---|---|
| Concurso SEMSA Manaus 002/2021 | FGV | 2021 | **CONCLUÍDO** | 108 | Acervo DB maior que README (61 doc.); hashes únicos |
| Concurso SES-DF Edital 14/2022 | IBFC | 2022 | **CONCLUÍDO** | 95 | 5 anuladas documentadas |
| Concurso Publico SESACRE Edital 01/2022 | IBFC | 2022 | **CONCLUÍDO** | 80 | Pipeline homologado |
| Concurso Abreu e Lima Edital 02/2024 | FGV | 2024 | **CONCLUÍDO** | 68 | |
| Concurso EBSERH 01/2019 Nacional | IBFC | 2019 | **CONCLUÍDO** | 60 | Presente no banco; README `ebserh-2020` desatualizado |
| Concurso SES-MT Edital 001/2024 | FGV | 2024 | **CONCLUÍDO** | 59 | |
| Concurso EBSERH 01/2023 Nacional | IBFC | 2023 | **CONCLUÍDO** | 59 | Presente no banco; README `ebserh-2023` desatualizado |
| Concurso João Pessoa Edital 02/2020 | AOCP | 2021 | **CONCLUÍDO** | 57 | |
| Concurso SUSAM Edital 01/2014 | FGV | 2014 | **CONCLUÍDO** | 56 | |
| Concurso Caraguatatuba Edital 03/2023 | FGV | 2023 | **CONCLUÍDO** | 55 | |
| Concurso Campinas Edital 01/2023 | VUNESP | 2023 | **CONCLUÍDO** | 50 | |
| Concurso EBSERH Nacional Edital 03/2013 | IBFC | 2013 | **CONCLUÍDO** | 50 | |
| Concurso SESPA Edital 01/2023 | Consulplan | 2023 | **CONCLUÍDO** | 47 | |
| Concurso FMS Niterói Edital 1/2019 | COSEAC | 2019 | **CONCLUÍDO** | 45 | |
| Concurso SES-RS Edital 01/2013 | Fundatec | 2013 | **CONCLUÍDO** | 41 | |
| Concurso SESAU Recife Edital 001/2019 | AOCP | 2019 | **CONCLUÍDO** | 35 | README marcava PARCIAL; banco tem 35 |
| Concurso Curitiba Edital 10/2022 | NC/UFPR | 2022 | **CONCLUÍDO** | 35 | |
| Concurso EBSERH 01/2024 Nacional | FGV | 2024 | **PAUSADO** | — | PDF local; não no banco |
| CNU 2ª Edição INTO | FGV | 2025 | **PAUSADO** | — | |
| Demais (10) | várias | — | **CANCELADO** | 0 | Ver pastas `docs/work/` |

> As 2 questões RC de homologação (`prefeitura-municipal-de-homologacao`) **não estão no banco** — apenas no backup pré-sync.

---

## Pipeline

| Indicador | Quantidade |
|---|---|
| **Provas no acervo (CONCLUÍDO)** | 17 |
| **Provas parciais (documentação)** | 0 no banco |
| **Provas canceladas** | 10 |
| **Provas pausadas** | 2+ |
| **Pastas `docs/work/`** | 29 |

---

## Próximas provas (prioridade)

1. **EBSERH 01/2024 Nacional** (FGV) — PDFs em `docs/work/ebserh-2025/`.
2. **Completar documentação README** — alinhar contagens (ex.: SEMSA 108 vs 61 doc.).
3. **CNU INTO 2025** (FGV) — validar cargo/prova.
4. **Meta 1.500** — faltam **500 questões** (33,3 %).

---

## Histórico

| Data | Sprint | Questões | Observações |
|---|---|---|---|
| 2026-07-14 | **Sincronização Oficial do Acervo** | 1.000 | Export banco → seed; causa raiz documentada |
| 2026-07-14 | Governança do Acervo | — | Identificada divergência seed (2) × banco (1.000) |
| 2026-07-14 | Fase 6 — SEMSA | 0 novas | Remapeamento taxonomia V1.2.1 |
| 2026-07-14 | Taxonomia V1.2.1 | 0 | Congelamento V1 |
| 2026-07-14 | Produção SESACRE 2022 | 80 | Pipeline homologado |
| 2026-07-08 – 2026-07-13 | Produção acervo lote 1 | ~1.000 | Importações diretas ao banco sem export de retorno |

---

*Documento de governança — snapshot gerado por `npm run export:questions`. Backup pré-sync: `docs/seeds/questions.json.pre-sync-backup-20260714.json`.*
