# INVENTÁRIO GLOBAL DO MOTOR EDITORIAL — V1

## Objetivo e status

Mapa completo do domínio do SimulaPro: todas as disciplinas reais cadastradas, com inventário resumido e ranking de prioridade. **Não é Dossiê Mestre, não é Inteligência Editorial, não é Auditoria Normativa, não é Plano de Produção completo** — é apenas o mapa que vai governar em que ordem esses documentos serão construídos daqui para frente. **Atualizado na Fase 3.2** (fechamento do Motor Editorial): 4 disciplinas reais que não tinham nenhuma configuração foram cadastradas; o documento foi atualizado em vez de gerar uma V2, por ser um mapa vivo, não um registro histórico normativo.

## Fontes reais consultadas nesta sessão (paginação `.range()` em todas as consultas)

- `editorial_disciplines` (25 linhas após a Fase 3.2; 21 na Fase 3.1) — taxonomia própria do Motor Editorial: `frequency_percent`, `priority`, `status`, `slug`, `notes`.
- `docs/editorial/auditoria/V1.1-arquitetura-corrigida.md` — auditoria real e anterior a esta sessão, decisiva para a Fase 3.2: documenta as 5 fusões/exclusões que a Fase 3.1 havia lido erroneamente como "sem configuração".
- `editorial_topics` (107) / `editorial_subtopics` (433) — taxonomia grosseira de 2 níveis já semeada para as 21 disciplinas acima.
- `subjects` (30) / `topics` (240, acervo real) / `questions` (1266) — acervo real de provas, taxonomia própria (2 níveis: `subject`/`topic`), **fonte de verdade sobre o que existe de fato na plataforma**.
- `PLANO_PRODUCAO_PROCESSO_ENFERMAGEM_V1.md` e `PLANO_PRODUCAO_UTI_V1.md` — únicos 2 Planos de Produção reais (3 níveis: macrotema/assunto/subassunto), construídos nas fases anteriores.

## Achado estrutural nº 1 — três taxonomias diferentes coexistem

1. **Acervo real** (`subjects`/`topics`, 2 níveis) — o que os alunos realmente veem, **30 disciplinas**.
2. **Motor Editorial** (`editorial_disciplines`/`topics`/`subtopics`, 2 níveis, mais grosseiro) — usado para configurar geração por IA, **21 disciplinas configuradas**.
3. **Plano de Produção** (3 níveis: macrotema/assunto/subassunto, granularidade fina) — só existe de fato para **2 disciplinas** (SAE, UTI).

## Achado estrutural nº 2 — 9 disciplinas reais pareciam não ter configuração no Motor Editorial (CORRIGIDO na Fase 3.2, ver seção própria abaixo)

**Este achado da Fase 3.1 estava parcialmente incorreto e foi corrigido na Fase 3.2.** À primeira vista, 9 disciplinas do acervo real não tinham linha correspondente em `editorial_disciplines`: Saúde do Adulto (40 questões), Legislação Aplicada à EBSERH (39), Legislação Municipal e Institucional (27), Imunização (20), Conhecimentos Gerais sobre o Distrito Federal (19), Controle de Infecção Hospitalar (18), Conhecimentos Gerais Regionais (4), Anatomia e Fisiologia (2), Políticas Públicas de Saúde (1).

Ao investigar antes de criar qualquer cadastro novo (Fase 3.2), ficou constatado que **5 dessas 9 já estavam cobertas**, por uma decisão de arquitetura real, documentada e auditada antes desta sessão (`docs/editorial/auditoria/V1.1-arquitetura-corrigida.md`, arquitetura "Enfermagem — Enfermeiro" v1.1): Saúde do Adulto foi fundida em Enfermagem Médico-Cirúrgica; Controle de Infecção Hospitalar foi fundida em Biossegurança; Políticas Públicas de Saúde foi fundida em Legislação do SUS; Imunização teve seus assuntos reparentados para Saúde Coletiva; Anatomia e Fisiologia foi deliberadamente removida do currículo ativo (status `MATERIAL_DE_APOIO` — "nenhuma banca testa isolada"). Nenhuma dessas 5 precisava de cadastro novo — criar um teria gerado duplicidade. Só restaram **4 gaps genuínos**, fechados na Fase 3.2: Legislação Aplicada à EBSERH, Legislação Municipal e Institucional, Conhecimentos Gerais sobre o Distrito Federal, Conhecimentos Gerais Regionais.

## Achado estrutural nº 3 — a granularidade fina real (Plano de Produção) é muito maior que a semeada no Motor Editorial

SAE: `editorial_subtopics` = 16 (semeado) vs. **65 subassuntos reais** no Plano de Produção (~4×). UTI: 16 (semeado) vs. **35 reais** (~2,2×). Não existe um fator de conversão único e confiável — por isso, para as 19 disciplinas mapeadas sem Plano ainda, uso o número semeado como piso conhecido, não como estimativa final, e para as 9 sem nenhuma configuração, marco "assuntos" e "subassuntos" como **não estimado** em vez de inventar um número sem base.

## FASE 3.2 — Fechamento do Motor Editorial (cadastro mínimo real)

Executada uma vez, em `editorial_disciplines`, reaproveitando a arquitetura real já existente (`architecture_id = 1ac2dc5b-fb2c-48c6-aac3-2a497b0a15ed`, "Enfermagem — Enfermeiro"). Nenhuma migration, nenhuma coluna nova — só `INSERT` de 4 linhas usando colunas reais já existentes (`name`, `slug`, `architecture_id`, `priority`, `frequency_percent`, `status`, `sort_order`, `confidence`, `evidence_count`, `description`, `notes`).

| Campo | Como foi preenchido |
|---|---|
| Nome oficial | Nome real do `subjects` do acervo, sem alteração |
| Slug | Novo, kebab-case, verificado sem colisão (`legislacao-ebserh`, `legislacao-municipal-institucional`, `conhecimentos-gerais-df`, `conhecimentos-gerais-regionais`). Nenhum código `D27+` inventado — as 4 nunca fizeram parte do catálogo D01-D26 auditado, e usar um número desse intervalo sugeriria falsamente que passaram pela mesma auditoria H1/V1.1 |
| Área / Complexidade / Dependências | Sem coluna própria no schema real — registradas como texto estruturado em `notes`, não inventadas como coluna nova |
| Peso histórico (`priority`, `frequency_percent`) | **NULL** — não há auditoria equivalente à H1 para estas 4; `notes` registra explicitamente "EVIDÊNCIA INSUFICIENTE". `priority` é enum (`ALTA`/`MEDIA`/`BAIXA`); não é possível escrever texto livre nele, por isso NULL em vez de um valor chutado |
| Base normativa | Classificação categórica (Lei / Nenhuma específica), sem verificação normativa profunda — Auditoria Normativa está fora do escopo desta fase por instrução explícita |
| Status | `PROPOSTO` (enum real: `PROPOSTO`/`EM_REVISAO`/`APROVADO`/`PUBLICADO`/`DEPRECIADO`/`MESCLADO`) — as 21 disciplinas antigas estão `PUBLICADO` porque passaram pela auditoria H1/V1.1; estas 4 não passaram por nenhuma auditoria, então o estado real e honesto é o mais baixo da escala, não `PUBLICADO` |
| Ordem editorial (`sort_order`) | Sequência 21–24, continuando a numeração existente (máximo anterior: 20) |

### Validação (consulta real pós-insert)

- Total em `editorial_disciplines`: **25** (21 + 4).
- Nomes duplicados: **0**. Slugs duplicados: **0**.
- Status distintos presentes: `PUBLICADO`, `PROPOSTO` — ambos válidos no enum.
- Disciplinas órfãs (`architecture_id` inválido): **0**.
- Disciplinas reais do acervo sem correspondente (direto ou por fusão documentada): **0** — as 30 disciplinas reais agora têm, cada uma, ou uma linha própria em `editorial_disciplines`, ou uma fusão real e auditada apontando para a linha que as absorveu.

### Relatório final da Fase 3.2

- **Disciplinas configuradas (novas):** 4 — Legislação Aplicada à EBSERH, Legislação Municipal e Institucional, Conhecimentos Gerais sobre o Distrito Federal, Conhecimentos Gerais Regionais.
- **Disciplinas já existentes:** 21 (nenhuma alterada).
- **Total final em `editorial_disciplines`:** 25.
- **Inconsistência encontrada:** o achado da Fase 3.1 ("9 disciplinas sem configuração") estava incorreto em 5 dos 9 casos — eram fusões/exclusões já resolvidas na arquitetura V1.1, não lacunas.
- **Inconsistência corrigida:** achado nº 2 desta Fase 3.1 reescrito acima; nenhuma linha nova criada para as 5 disciplinas já cobertas (evitada duplicidade real).
- **Itens que dependem de pesquisa futura:** peso histórico real (auditoria estilo H1) e base normativa verificada das 4 novas disciplinas; decisão editorial sobre se Legislação Municipal e Institucional / Conhecimentos Gerais do DF / Conhecimentos Gerais Regionais devem permanecer `ATIVA`-equivalentes ou ser rebaixadas a material de apoio (mesmo padrão já aplicado a Anatomia e Fisiologia), dado que são estruturalmente não-portáveis entre bancas/editais — decisão não tomada aqui, fora do escopo desta fase.

## Critério de classificação usado (declarado para ser auditável)

- **Peso histórico**: parte do campo `priority` já autorado em `editorial_disciplines` (ALTA/MEDIA/BAIXA, usado durante toda a sessão) — subdividido usando `frequency_percent`: dentro de ALTA, `frequency_percent ≥ 70` vira **Muito Alta**, `< 70` permanece **Alta**. MEDIA e BAIXA mantidos como estão. Para as 9 disciplinas sem `frequency_percent`, classificação qualitativa declarada (sem número de origem), fundamentada em sobreposição de escopo com disciplinas já classificadas e em conhecimento consolidado de concursos de Enfermagem/EBSERH.
- **Complexidade editorial / Dependência clínica**: julgamento editorial qualitativo, mesmo padrão usado nos Dossiês de SAE/UTI (achado normativo recente = complexidade mais alta; decisão terapêutica/clínica direta = dependência mais alta).
- **Nível Editorial** (escala própria desta fase, discipline-level, distinta da escala de subassunto do `EDITORIAL_QUEUE_V1.md`):
  - **N0** — sem linha em `editorial_disciplines` (Motor Editorial não alcança a disciplina).
  - **N1** — mapeada no Motor Editorial, sem Plano de Produção, com **menos de 10** questões reais no acervo.
  - **N2** — mapeada, sem Plano de Produção, com **10 ou mais** questões reais.
  - **N3** — Plano de Produção real existe, cobertura de subassuntos ainda < 100%.
  - **N4** — Plano de Produção real existe, cobertura de subassuntos = 100% (SAE, UTI, ambas concluídas nas Fases 1–3 anteriores).

---

## TABELA ÚNICA — 30 disciplinas

| # | Disciplina | Área | Peso histórico | Macrotemas (aprox.) | Assuntos (aprox.) | Subassuntos testáveis (aprox.) | Base normativa principal | Complexidade editorial | Dependência clínica | Questões atuais (acervo real) | Nível Editorial |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Fundamentos de Enfermagem | Enfermagem Clínica/Assistencial | Muito Alta | 8 (semeado) | N/A (base 2 níveis) | 39 (semeado, piso) | COFEN / Manuais MS | Alta | Alta | 113 | N2 |
| 2 | Saúde Coletiva | Saúde Pública/Coletiva | Muito Alta | 8 | N/A | 30 | Portarias MS / PNAB | Média-Alta | Média | 49 | N2 |
| 3 | Urgência e Emergência | Enfermagem Clínica/Assistencial | Muito Alta | 4 | N/A | 24 | Protocolos MS/SAMU + ANVISA | Alta | Alta | 66 | N2 |
| 4 | Legislação do SUS | Legislação/Gestão | Muito Alta | 9 | N/A | 37 | Leis 8.080/8.142 + Portarias | Alta | Baixa | 181 | N2 |
| 5 | Português | Conhecimentos Gerais | Muito Alta | 3 | N/A | 12 | Nenhuma específica | Baixa | Nenhuma | 231 | N2 |
| 6 | Enfermagem Médico-Cirúrgica | Enfermagem Clínica/Assistencial | Alta | 9 | N/A | 30 | Literatura científica / protocolos clínicos | Alta | Alta | 15 | N2 |
| — | ~~Saúde do Adulto~~ | — | — | — | — | — | — | — | — | 40 | **Fundida em Enfermagem Médico-Cirúrgica (linha 6) — Res. V1.1, não é linha própria** |
| 7 | Ética e Legislação em Enfermagem | Legislação/Ética | Alta | 5 | N/A | 17 | Lei 7.498/1986 + COFEN | Alta | Baixa | 24 | N2 |
| 8 | Saúde Mental | Enfermagem Clínica/Assistencial | Alta | 5 | N/A | 23 | Lei 10.216/2001 + Portarias RAPS | Alta | Alta | 38 | N2 |
| 9 | Sistematização da Assistência de Enfermagem (SAE) | Metodologia Assistencial | Alta | **8 (real)** | **23 (real)** | **65 (real)** | COFEN (Res. 736/2024) | Muito Alta | Média | 8 | **N4** |
| 10 | Terapia Intensiva (UTI) | Enfermagem Clínica/Assistencial | Alta | **6 (real)** | **22 (real)** | **35 (real)** | RDC ANVISA 7/2010 + COFEN | Muito Alta | Alta | 0 | **N4** |
| 11 | Legislação Aplicada à EBSERH | Legislação/Gestão institucional | Evidência insuficiente | Não estimado | Não estimado | Não estimado | Lei (categórico — Lei 13.303/2016 + Estatuto EBSERH; não verificado em profundidade) | Média (qualitativo) | Nenhuma | 39 | N2 |
| 13 | Biossegurança | Segurança/Biossegurança | Média | 7 | N/A | 22 | NR-32 / ANVISA / rotinas CCIH | Média | Média | 22 | N2 |
| 14 | Centro Cirúrgico e CME | Enfermagem Clínica/Assistencial | Média | 5 | N/A | 18 | RDC ANVISA / SOBECC | Média | Alta | 19 | N2 |
| 15 | Farmacologia | Ciências Básicas Aplicadas | Média | 4 | N/A | 19 | Literatura científica / RDC ANVISA | Alta | Alta | 5 | N1 |
| 16 | Saúde da Criança e do Adolescente | Enfermagem Clínica/Assistencial | Média | 5 | N/A | 20 | ECA + Manuais MS | Média | Alta | 43 | N2 |
| 17 | Saúde da Mulher | Enfermagem Clínica/Assistencial | Média | 4 | N/A | 24 | PNAISM + Manuais MS | Média | Alta | 52 | N2 |
| 18 | Saúde do Idoso | Enfermagem Clínica/Assistencial | Média | 4 | N/A | 17 | Estatuto do Idoso + PNSPI | Média | Alta | 7 | N1 |
| 19 | Segurança do Paciente | Segurança/Biossegurança | Média | 3 | N/A | 14 | Portaria MS 529/2013 + RDC ANVISA 36/2013 | Alta | Média | 6 | N1 |
| — | ~~Controle de Infecção Hospitalar~~ | — | — | — | — | — | — | — | — | 18 | **Fundida em Biossegurança (linha 13) — Res. V1.1, não é linha própria** |
| — | ~~Imunização~~ | — | — | — | — | — | — | — | — | 20 | **Assuntos reparentados para Saúde Coletiva (linha 2) — Res. V1.1, não é linha própria** |
| — | ~~Políticas Públicas de Saúde~~ | — | — | — | — | — | — | — | — | 1 | **Fundida em Legislação do SUS (linha 4) — Res. V1.1, não é linha própria** |
| — | ~~Anatomia e Fisiologia~~ | — | — | — | — | — | — | — | — | 2 | **Removida do currículo ativo (`MATERIAL_DE_APOIO`) — Res. V1.1, não é linha própria** |
| 24 | Administração em Enfermagem | Gestão | Baixa | 5 | N/A | 16 | Literatura de gestão + COFEN | Média | Baixa | 37 | N2 |
| 25 | Enfermagem em Doenças Transmissíveis | Enfermagem Clínica/Assistencial | Baixa | 5 | N/A | 19 | Manuais MS (tuberculose, hanseníase etc.) | Média | Alta | 41 | N2 |
| 26 | Informática | Conhecimentos Gerais | Baixa | 4 | N/A | 10 | Nenhuma específica | Baixa | Nenhuma | 47 | N2 |
| 27 | Raciocínio Lógico | Conhecimentos Gerais | Baixa | 2 | N/A | 10 | Nenhuma específica | Baixa | Nenhuma | 92 | N2 |
| 28 | Legislação Municipal e Institucional | Legislação/Gestão | Evidência insuficiente | Não estimado | Não estimado | Não estimado | Nenhuma específica (varia por edital/município) | Baixa (qualitativo) | Nenhuma | 27 | N2 |
| 29 | Conhecimentos Gerais sobre o Distrito Federal | Conhecimentos Gerais (regional) | Evidência insuficiente | Não estimado | Não estimado | Não estimado | Nenhuma específica | Baixa (qualitativo) | Nenhuma | 19 | N2 |
| 30 | Conhecimentos Gerais Regionais | Conhecimentos Gerais (regional) | Evidência insuficiente | Não estimado | Não estimado | Não estimado | Nenhuma específica | Baixa (qualitativo) | Nenhuma | 4 | N1 |

**Observações importantes por linha, quando relevantes:**
- SAE/UTI: "Questões atuais" mostra o acervo real (8/0). As 84/52 questões produzidas nas Fases 1–3 desta sessão continuam no estágio "Aprovada", **não importadas** — não estão somadas aqui para não confundir real com produzido-em-chat.
- Enfermagem Médico-Cirúrgica: prioridade Alta com apenas 15 questões reais para um escopo de 30 tópicos + os 5 assuntos herdados de Saúde do Adulto — maior descompasso peso/cobertura entre as disciplinas já mapeadas no Motor Editorial.
- **Pós Fase 3.2: 0 disciplinas reais ficaram sem correspondente.** As 30 disciplinas do acervo real mapeiam para 25 linhas em `editorial_disciplines` — 21 já existentes + 4 novas (Fase 3.2) + 5 disciplinas reais cobertas por fusão/exclusão documentada em outra linha (marcadas `~~tachado~~` na tabela, sem linha própria).

---

## AGREGADOS (reexecutado após a Fase 3.2)

- **Quantidade total de disciplinas reais no acervo:** 30 (inalterado — a Fase 3.2 não criou nem removeu disciplina real, só cadastro editorial).
- **Quantidade de linhas em `editorial_disciplines`:** 25 (21 pré-existentes + 4 novas). As 5 restantes das 30 reais são cobertas por fusão/exclusão documentada, sem linha própria.
- **Quantidade total estimada de subassuntos:** 501 nas 23 disciplinas com granularidade semeada (401 nas 19 sem Plano de Produção + 100 reais de SAE/UTI). As 4 disciplinas novas da Fase 3.2 ficam de fora da soma — subassuntos "não estimado" (nenhuma taxonomia própria ainda).
- **Disciplinas sem nenhuma questão:** 1 (Terapia Intensiva/UTI — real 0; cobertura de 100% já existe apenas no estágio "Aprovada", não importado).
- **Disciplinas abaixo do Nível 1** (N0 — nem mapeadas no Motor Editorial): **0** (era 9 na Fase 3.1; corrigido — 5 eram fusões já resolvidas, as 4 restantes foram cadastradas na Fase 3.2).
- **Disciplinas abaixo do Nível 2** (N1 — mapeadas, sem Plano, com <10 questões reais): **4** — Farmacologia, Saúde do Idoso, Segurança do Paciente, Conhecimentos Gerais Regionais.
- **Disciplinas prontas para expansão imediata** (N2 — já mapeadas, com volume real ≥10, aptas a receber um Plano de Produção sem trabalho prévio de configuração): **19** (16 já identificadas na Fase 3.1 + Legislação Aplicada à EBSERH + Legislação Municipal e Institucional + Conhecimentos Gerais sobre o Distrito Federal).

---

## RANKING FINAL

Ordenado por: 1) peso histórico (Muito Alta → Baixa → Evidência insuficiente, esta última por último por não ter sido auditada, não por presumir baixa relevância); 2) dentro do mesmo peso, menor quantidade de questões reais primeiro (maior lacuna = maior urgência, mesmo critério já usado na Fase 3); 3) cobertura relativa (só distingue SAE/UTI, já em 100%); 4) complexidade editorial como desempate fino; 5) valor comercial (uso EBSERH como proxy, dado o volume de `docs/work/ebserh-*` já existente no projeto — dentro da própria faixa "Evidência insuficiente", Legislação Aplicada à EBSERH fica em último por volume, mas é a mais provável candidata a subir para Alta numa auditoria real futura).

## ROADMAP EDITORIAL GLOBAL (reexecutado após a Fase 3.2 — 25 sprints, 1 por linha real em `editorial_disciplines`)

As 5 disciplinas absorvidas por fusão (Saúde do Adulto, Controle de Infecção Hospitalar, Imunização, Políticas Públicas de Saúde) ou excluídas do currículo (Anatomia e Fisiologia) saíram do roadmap — produzir para elas hoje significa produzir para a linha que as absorveu (já presente na tabela). As 4 disciplinas novas da Fase 3.2 entram como uma faixa própria de peso "Evidência insuficiente", depois de Baixa, por não terem auditoria de frequência equivalente à H1 — não foram equiparadas a Baixa por decreto, ficam explicitamente não classificadas até uma auditoria real.

| Sprint | Disciplina | Peso | Questões atuais | Nível | Nota |
|---|---|---|---|---|---|
| 1 | Saúde Coletiva | Muito Alta | 49 | N2 | absorveu os 4 assuntos de Imunização |
| 2 | Urgência e Emergência | Muito Alta | 66 | N2 | |
| 3 | Fundamentos de Enfermagem | Muito Alta | 113 | N2 | |
| 4 | Legislação do SUS | Muito Alta | 181 | N2 | absorveu Políticas Públicas de Saúde |
| 5 | Português | Muito Alta | 231 | N2 | |
| 6 | Terapia Intensiva (UTI) | Alta | 0 | N4 | Plano já concluído (Fases 1–3) — próximo passo é importação real via `convergence.server.ts`, não novo lote |
| 7 | Sistematização da Assistência de Enfermagem (SAE) | Alta | 8 | N4 | idem |
| 8 | Enfermagem Médico-Cirúrgica | Alta | 15 | N2 | absorveu Saúde do Adulto (5 assuntos) — maior descompasso peso/cobertura do mapa |
| 9 | Ética e Legislação em Enfermagem | Alta | 24 | N2 | |
| 10 | Saúde Mental | Alta | 38 | N2 | |
| 11 | Farmacologia | Média | 5 | N1 | |
| 12 | Segurança do Paciente | Média | 6 | N1 | |
| 13 | Saúde do Idoso | Média | 7 | N1 | |
| 14 | Centro Cirúrgico e CME | Média | 19 | N2 | |
| 15 | Biossegurança | Média | 22 | N2 | absorveu Controle de Infecção Hospitalar (4 assuntos) |
| 16 | Saúde da Criança e do Adolescente | Média | 43 | N2 | |
| 17 | Saúde da Mulher | Média | 52 | N2 | |
| 18 | Administração em Enfermagem | Baixa | 37 | N2 | |
| 19 | Enfermagem em Doenças Transmissíveis | Baixa | 41 | N2 | |
| 20 | Informática | Baixa | 47 | N2 | |
| 21 | Raciocínio Lógico | Baixa | 92 | N2 | |
| 22 | Conhecimentos Gerais Regionais | Evidência insuficiente | 4 | N1 | cadastro mínimo da Fase 3.2; menor volume real do catálogo — candidata a rebaixamento numa auditoria futura |
| 23 | Conhecimentos Gerais sobre o Distrito Federal | Evidência insuficiente | 19 | N2 | cadastro mínimo da Fase 3.2 |
| 24 | Legislação Municipal e Institucional | Evidência insuficiente | 27 | N2 | cadastro mínimo da Fase 3.2 |
| 25 | Legislação Aplicada à EBSERH | Evidência insuficiente | 39 | N2 | cadastro mínimo da Fase 3.2; maior volume real entre as 4 novas — se uma auditoria futura confirmar peso Alta (plausível, dado o foco do SimulaPro em EBSERH), sobe de faixa |

## Encerramento

Nenhuma questão gerada em nenhuma das duas fases. Nenhuma metodologia alterada. A única escrita em banco desta Fase 3.2 foi o `INSERT` de 4 linhas em `editorial_disciplines`, usando colunas reais já existentes — sem migration, sem coluna nova, sem tocar nas 21 linhas anteriores. Nenhum documento metodológico anterior (Dossiês, Planos de Produção, Controller, Queue, Question Spec, Production Pipeline) foi alterado; apenas este próprio Inventário foi atualizado, por ser, por definição, um mapa vivo.

O gargalo estrutural que motivou a Fase 3.2 está fechado: **as 30 disciplinas reais do SimulaPro têm, hoje, 100% de correspondência no Motor Editorial** — 25 com linha própria (21 antigas + 4 novas), 5 cobertas por fusão/exclusão já documentada e auditada antes desta sessão. Zero disciplinas abaixo do Nível 1. A partir de agora, qualquer novo lote de 30 questões deve seguir rigorosamente o ranking acima, começando pelo Sprint 1 (Saúde Coletiva).
