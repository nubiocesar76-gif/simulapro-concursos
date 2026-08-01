# Indicadores de Produção — SimulaPro Concursos

Métricas acumuladas da Operação Enfermagem, por prova processada, conforme Seção 7 do `TEMPLATE_OFICIAL_DE_PRODUCAO_SIMULAPRO_V1.md`.

## Reconciliação catálogo × banco (2026-07-24)

O banco de produção (`docs/seeds/questions.json`, via `export:questions`) é a
**única fonte de verdade**. `docs/catalog/pesquisa-50-provas-enfermeiro.csv` foi
atualizado para refletir exatamente esse estado: 21 provas têm `status=CONCLUIDA`
(uma linha por combinação banca/concurso realmente presente no banco), 2 têm
`status=INVALIDA` (INCA 2025, INTO 2025) e 37 permanecem `status=PLANNED`
(nenhuma questão no banco). 10 dessas 21 provas concluídas não tinham NENHUMA
linha no catálogo original — foram adicionadas. Motivo: um gap de processo em
sessões anteriores, onde provas eram seedadas diretamente no banco sem
atualizar `docs/work/`, `docs/imports/questions.csv` nem este catálogo (ver
`docs/BUGS.md` BUG-006 para o caso que disparou esta auditoria).

### Provas concluídas (21) — banco = fonte de verdade

| Prova (`docs/work/`) | Banca | Contest (banco) | Questões | Catálogo original? |
|---|---|---|---|---|
| ebserh-2016 | Instituto AOCP | concurso-publico-ebserh-nacional-edital-03-2015-area-assistencial | 50 | sim |
| ebserh-2018 | CEBRASPE | concurso-publico-ebserh-assistencial-edital-3-2018 | 89 | sim |
| ebserh-2013 | IBFC | concurso-publico-ebserh-nacional-edital-3-2013 | 50 | **não** (adicionada) |
| ebserh-2020 | IBFC | concurso-publico-01-2019-ebserh-nacional | 60 | sim |
| ebserh-2023 | IBFC | concurso-publico-01-2023-ebserh-nacional | 79 | sim |
| ebserh-2025 | FGV | concurso-publico-ebserh-assistencial-edital-3-2024 | 59 | sim |
| pref-goiania-2022 | Centro de Seleção UFG | concurso-publico-prefeitura-municipal-de-goiania-edital-001-2020 | 48 | sim |
| sespa-pa-2023 (canônica; `sespa-2023/` é duplicata consolidada) | Instituto Consulplan | concurso-publico-sespa-edital-01-2023 | 47 | sim |
| semsa-manaus-2022 | FGV | concurso-semsa-manaus-002-2021 | 108 (2 lotes: 67+41) | sim |
| ses-df-2022 | IBFC | concurso-ses-df-edital-14-2022 | 95 | sim |
| curitiba-2022 (catálogo: pref-curitiba-2022) | NC/UFPR | concurso-publico-prefeitura-de-curitiba-edital-10-2022 | 35 | sim |
| sesau-recife-2019 (catálogo: sesau-recife-2020) | Instituto AOCP | concurso-publico-secretaria-de-saude-do-recife-edital-1-2019 | 35 | sim |
| joao-pessoa-2021 | Instituto AOCP | concurso-publico-prefeitura-de-joao-pessoa-edital-02-2020 | 57 | **não** (adicionada; diferente do catálogo `pref-joao-pessoa-2018`, edital 001/2018, ainda PLANNED) |
| fms-niteroi-2021 | COSEAC | concurso-publico-fundacao-municipal-de-saude-de-niteroi-edital-1-2019 | 45 | **não** (adicionada) |
| abreu-e-lima-2024 | FGV | concurso-publico-prefeitura-municipal-de-abreu-e-lima-edital-2-2024 | 68 | **não** (adicionada) |
| caraguatatuba-2023 | FGV | concurso-publico-prefeitura-municipal-de-caraguatatuba-edital-3-2023 | 55 | **não** (adicionada) |
| ses-mt-2024 | FGV | concurso-publico-secretaria-de-estado-de-saude-de-mato-grosso-edital-1-2024 | 59 | **não** (adicionada) |
| susam-ses-am-2014 | FGV | concurso-publico-secretaria-de-estado-de-saude-do-amazonas-edital-1-2014 | 56 | **não** (adicionada) |
| campinas-2023 | Fundação VUNESP | concurso-publico-prefeitura-de-campinas-edital-01-2023 | 50 | **não** (adicionada) |
| ses-rs-2013 | Fundatec | concurso-publico-secretaria-da-saude-do-estado-do-rio-grande-do-sul-edital-1-2013 | 41 | **não** (adicionada; diferente do catálogo `ses-rs-2022`, ainda PLANNED) |
| sesacre-2022 | IBFC | concurso-publico-sesacre-edital-01-2022 | 80 | **não** (adicionada) |

**Total: 1266 questões, 21 provas, todas cargo Enfermeiro.**

### Provas em produção

Nenhuma no momento (INTO 2025 avançou até validação institucional mas foi
marcada INVÁLIDA por conteúdo antes de iniciar extração).

### Provas inválidas (2)

| Prova | Motivo |
|---|---|
| inca-2025 | Confirmado oficialmente (Anexo I + planilha MGI): não existe cargo Enfermeiro vinculado ao INCA no CNU 2ª edição. |
| into-2025 | Cargo Enfermeiro confirmado oficialmente (INTO, código B1-07-L), mas a prova do Bloco 1 do CNU é a mesma para todos os cargos do bloco, sem nenhum conteúdo técnico de enfermagem — decisão do usuário de não produzir. |

### Provas pendentes (37, catálogo `status=PLANNED`, sem nenhuma questão no banco)

Ver `docs/catalog/pesquisa-50-provas-enfermeiro.csv` — inclui, entre outras,
`pref-joao-pessoa-2018` e `ses-rs-2022` (distintas das editais homônimas já
concluídas acima), `sesau-al-2021` (PDFs já baixados em `docs/work/`, nunca
seedada), `pref-poa-2019`/`pref-poa-2023`, `hcpa-2016/2022/2023/2024`, provas
de Marinha/Exército/Aeronáutica, entre outras.

## Histórico por prova (detalhe de descarte)

| Prova | Banca | Ano | Questões processadas | Aprovadas | Descartadas | Nível de Validação | Status |
|---|---|---|---|---|---|---|---|
| EBSERH 2025 — Enfermeiro | FGV | 2025 | 60 | 59 | 1 (anulada) | — | PUBLICADA |
| EBSERH 2016 — Enfermeiro Saúde Mental | Instituto AOCP | 2016 | 50 | 50 | 0 | B | CONCLUÍDA |
| Prefeitura de Goiânia 2022 — Especialista em Saúde, Enfermeiro Geral | Centro de Seleção UFG | 2022 | 50 | 48 | 2 (anuladas: Q08, Q26) | A | CONCLUÍDA |
| SESPA-PA 2023 — Enfermeiro | Instituto Consulplan | 2023 | 50 | 47 | 3 (anuladas: 22, 23, 24) | A | CONCLUÍDA (seedada em 2026-07-10, documentada retroativamente em 2026-07-24 — ver `docs/BUGS.md` BUG-006) |

As demais 17 provas concluídas (ver tabela de reconciliação acima) foram
seedadas por sessões anteriores sem registro de anuladas/descarte neste
formato — não reconstruído nesta sessão (fora de escopo; ver `docs/BUGS.md`
BUG-006 para o que foi e não foi investigado).

## Indicadores agregados

- **Acervo total no banco:** 1266 questões, 21 provas (todas cargo Enfermeiro) — confirmado via reconciliação catálogo × banco de 2026-07-24.
- **Questões descartadas (documentado, 4 provas desta operação):** EBSERH 2016: 0 · Goiânia 2022: 2 · SESPA-PA 2023: 3 · EBSERH 2018: 11 (formato Certo/Errado)
- **Taxa de retrabalho:** 0% nas provas do template oficial; 37 questões criadas e removidas na mesma sessão durante a reconciliação do SESPA-PA (não chegaram a ser publicadas).
- **Tempo médio por prova/bloco/questão:** não cronometrado ainda de forma sistemática.

## Observações

- EBSERH 2016 e Prefeitura de Goiânia 2022 são as duas primeiras provas processadas sob o TEMPLATE OFICIAL DE PRODUÇÃO V1.
- Bug de integração descoberto e corrigido durante a produção de Goiânia 2022: o slug de banca cadastrado em `taxonomy.json` deve corresponder exatamente ao slug derivado automaticamente do campo `name` da tabela `boards` (função `generatePackageSlug`), não a um slug arbitrário escolhido livremente — caso contrário `seed:questions` falha com "Banca não encontrada" mesmo após `convert:questions` e `seed:taxonomy` terem sido bem-sucedidos.
- INCA 2025 revalidado definitivamente em 2026-07-24 a partir do Anexo I, Bloco 1 (CNU 2ª edição, 8ª retificação, fonte oficial FGV Conhecimento): confirmado que não existe cargo Enfermeiro vinculado ao INCA. Ver `docs/work/inca-2025/README.md`.
- INTO 2025 validado institucionalmente em 2026-07-24 (planilha "Cargos e Salários CPNU2" do MGI): código B1-07-L pertence ao INTO. Apesar disso, marcada INVÁLIDA por decisão do usuário — a prova do Bloco 1 é genérica, compartilhada entre todos os cargos do bloco, sem conteúdo técnico de enfermagem. Ver `docs/work/into-2025/README.md`.
- SESPA-PA 2023 revelou uma prova já seedada por sessão anterior sem documentação (BUG-006). A auditoria completa do catálogo × banco, disparada por esse achado, revelou o mesmo padrão em EBSERH 2018, EBSERH 2020, EBSERH 2023 e mais 10 provas sem nenhuma linha no catálogo original. Todas reconciliadas e documentadas nesta sessão (ver tabela de reconciliação acima e `docs/BUGS.md` BUG-006).
- Duas pastas duplicadas para a mesma prova foram encontradas e consolidadas: `sespa-2023/` e `sespa-pa-2023/` (mesma prova SESPA-PA 2023) — `sespa-pa-2023/` é a canônica.
