# Produção do Acervo Oficial — Enfermeiro

**Fase:** Produção editorial (pós-homologação da Arquitetura Editorial V1.1)
**Documento:** operacional — organiza a produção, não altera arquitetura,
banco, código ou cria módulos novos.
**Última revisão:** 2026-07-09

Para o detalhamento prova a prova (painel de controle completo, uma linha
por `workId`), ver `docs/producao-acervo/06-controle-provas.md`. Este
documento é a visão executiva única; aquele diretório é o detalhamento.

---

## 1. Meta

| Item | Valor |
|---|---|
| **Cargo** | Enfermeiro |
| **Volume alvo** | 100 provas oficiais |
| **Janela histórica** | 2016–2026 |
| **Fonte de verdade dos dados** | `docs/catalog/enfermagem.csv` |
| **Pipeline de processamento** | `docs/work/README.md` (inalterado) |
| **Taxonomia de classificação** | `docs/editorial/` (inalterada) |

**Gap identificado:** o catálogo atual mapeia 67 provas, mas apenas nos
anos **2023–2025** (3 anos). A meta 2016–2026 exige ampliar a janela
histórica para 11 anos — tanto adicionando anos anteriores para os órgãos
já mapeados quanto eventualmente novos órgãos. Nenhuma prova entra no
pipeline sem antes existir como linha em `docs/catalog/enfermagem.csv` com
edital/concurso confirmado — não catalogar por suposição.

---

## 2. Bancas prioritárias

Ordem por volume já mapeado no catálogo atual (efeito multiplicador: uma
banca dominada serve vários órgãos).

| # | Banca | Provas no catálogo | Formato | Observação |
|---|---|---|---|---|
| 1 | **FGV** | 25 | Múltipla escolha, 5 alt. | Maior volume do acervo; estudo de caso clínico longo; conferir gabarito com atenção (banca tende a manter gabarito contestável) |
| 2 | **IDIB** | 13 | Múltipla escolha | Sem perfil qualitativo documentado ainda — retroalimentar `docs/editorial/06-diferencas-entre-bancas.md` na primeira prova processada |
| 3 | **Cebraspe (CESPE)** | 9 | Certo/Errado | Forças Armadas; formato estrutural diferente, exige checklist específica |
| 4 | **VUNESP** | 8 | Múltipla escolha, 5 alt. | Cita literalmente manuais/portarias do MS |
| 5 | **UFPR / NC** | 7 | Múltipla escolha, 5 alt. | Perfil acadêmico, cobre Anatomia/Fisiologia aplicada com mais profundidade |
| 6 | **Instituto Consulplan** | 3 | Múltipla escolha, 5 alt. | Apenas SES-PE no catálogo atual |
| 7 | **Quadrix** | 2 | Certo/Errado/Anulado (3 alt.) | Formato próprio, mesmo cuidado de extração que Cebraspe |

Bancas com perfil já documentado (`docs/editorial/normalized/14-perfil-bancas.json`)
mas sem prova catalogada ainda — candidatas à expansão da janela 2016–2026:
IBFC, IDECAN, AOCP, FUNDEP, Avalia, FAFIPA, IADES, FCC, Cesgranrio.

Detalhamento completo: `docs/producao-acervo/01-bancas-prioritarias.md`.

---

## 3. Órgãos prioritários

| Tier | Órgãos | Provas hoje | Critério |
|---|---|---|---|
| **0/1** | EBSERH | 3 | Já iniciado; alcance nacional |
| **2** | SES-SP, SES-RJ, SES-MG, SES-BA, SES-PE, SES-PR + 8 prefeituras de capitais | 36 | Maior volume de usuários potenciais |
| **3** | 9 hospitais universitários (HC-FMUSP, HC-UFRJ, HU-UFMG, HCPA-UFRGS, HU-UFPE, HU-Unifesp, HU-Unicamp, HU-UFBA, HU-UFPR) | 19 | Reaproveita bancas/taxonomia do Tier 2 |
| **4** | Marinha, Exército, Aeronáutica | 9 | Formato Cebraspe isolado por último |

**Total mapeado hoje:** 27 órgãos, 67 provas. Detalhamento completo:
`docs/producao-acervo/02-orgaos-prioritarios.md`.

---

## 4. Ordem de processamento

1. **Piloto** — concluir `ebserh-2025` ponta a ponta (`DOWNLOADED` →
   `SEEDED`) antes de escalar para lote. Valida o pipeline inteiro numa
   única prova.
2. **Tier 2 alta prioridade** — FGV e VUNESP (maior volume combinado).
3. **Tier 2 restante** — IDIB, UFPR/NC, Instituto Consulplan.
4. **Tier 3** — hospitais universitários, mesmas bancas já calibradas.
5. **Tier 4** — Forças Armadas (Cebraspe), isolado por exigir caminho
   alternativo de extração (itens Certo/Errado).
6. **Expansão da janela histórica** — ampliar anos (2016–2022) para os
   órgãos já catalogados e, se necessário, novos órgãos até fechar 100.

Cronograma completo por onda: `docs/producao-acervo/05-cronograma-producao.md`.

---

## 5. Checklist de cada prova (resumo)

Checklist completa por estágio: `docs/producao-acervo/04-checklist-producao.md`.
Resumo por estágio do pipeline (`docs/work/README.md`):

- [ ] **Registro** — PDF + gabarito em `docs/imports/pdfs/`, `pipeline:init`
      executado, pasta `docs/work/<workId>/` criada → `DOWNLOADED`
- [ ] **Extração de texto** — `raw.md` gerado e conferido (sem páginas
      faltando/corrompidas) → `TEXT_EXTRACTED`
- [ ] **Estruturação e revisão** — `questions.raw.json` estruturado,
      classificação por disciplina/assunto conforme `docs/editorial/`,
      casos ambíguos resolvidos, `review.json` preenchido → `REVIEW`
- [ ] **Aprovação** — gabarito conferido contra `gabarito.pdf`, sem
      duplicatas no acervo, classificação validada em segunda leitura →
      `APPROVED`
- [ ] **Conversão e seed** — exportado para `docs/seeds/questions.json`,
      `npm run seed:questions` executado, contagem confere →
      `CONVERTED` → `SEEDED`
- [ ] **Fechamento** — `docs/catalog/enfermagem.csv` e
      `docs/producao-acervo/03-status-processamento.md` atualizados

---

## 6. Status da produção

**Fonte de verdade:** `docs/catalog/enfermagem.csv` (coluna `status`) e
`docs/work/<workId>/status.json`. Snapshot detalhado e regras de
atualização: `docs/producao-acervo/03-status-processamento.md`.

| Estágio | Qtd. | Provas |
|---|---|---|
| `SEEDED` | 0 | — |
| `APPROVED` / `REVIEW` / `EXTRACTING` / `TEXT_EXTRACTED` | 0 | — |
| `DOWNLOADED` | 1 | `ebserh-2025` |
| `PLANNED` | 66 | ver catálogo |
| **Catalogado hoje** | **67** | de uma meta de **100** |
| **Gap (janela 2016–2026)** | **33 provas** | ainda a catalogar |

---

## 7. Cronograma de execução

| Onda | Escopo | Provas | Critério de saída |
|---|---|---|---|
| 0 | Piloto (`ebserh-2025`) | 1 | `SEEDED` no acervo, checklist 100% |
| 1 | Tier 2 alta prioridade (FGV, VUNESP) | 19 | Todas em `SEEDED` |
| 2 | Tier 2 restante (IDIB, UFPR/NC, Consulplan) | 19 | Perfil IDIB documentado + todas `SEEDED` |
| 3 | Hospitais universitários | 19 | Todas em `SEEDED` |
| 4 | Forças Armadas (Cebraspe) | 9 | Caminho Certo/Errado validado + todas `SEEDED` |
| 5 | Expansão 2016–2022 / novos órgãos | 33 | Catalogadas em `enfermagem.csv` e processadas |
| **Total** | | **100** | |

Cada onda só inicia quando a anterior fecha — sem paralelizar Tier 4 com
as demais (formato Cebraspe exige validação isolada). Detalhamento e
racional de cada onda: `docs/producao-acervo/05-cronograma-producao.md`.

---

## Regras desta fase

1. Nenhuma alteração de arquitetura, banco, migration ou código a partir
   deste documento ou de `docs/producao-acervo/` — qualquer necessidade
   estrutural identificada durante a produção é registrada como pendência
   e escalada separadamente.
2. `docs/catalog/enfermagem.csv` e `docs/work/<workId>/status.json`
   continuam sendo a origem dos dados; este documento e
   `docs/producao-acervo/` são a camada de controle, não substituem o dado
   operacional.
3. Achados editoriais novos (assunto, sinônimo, sigla, perfil de banca)
   encontrados durante a produção são retroalimentados em
   `docs/editorial/` antes de aprovar a prova — conforme já estabelecido
   em `docs/editorial/README.md`.
