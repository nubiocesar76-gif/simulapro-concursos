# ANÁLISE DO ACERVO — SAÚDE DO ADULTO — V1 (Sprint de Complementação)

## Fase 1 — Auditoria (estado real confirmado no banco)

O usuário informou "39 questões" como referência; reconfirmado no banco: **40 questões reais** (divergência de +1). Meta recalculada automaticamente: 50 − 40 = **10 questões novas** (não as 11 esperadas para o cenário de 39). `subject_id`: `0b77827c-b742-4ad9-b37d-7edbba37b4a8`. 11 `topics` reais. `package_version_id`: 39/40 com a versão publicada principal — 1 questão em distribuição demo, mesmo padrão já caracterizado e confirmado como legítimo em sprints anteriores desta sessão (não reinvestigado aqui).

| Tópico real | Questões |
|---|---|
| Pé Diabético e Doenças Crônicas | 9 |
| Oncologia: Assistência de Enfermagem | 5 |
| Doação e Transplante de Órgãos | 5 |
| Emergências Clínicas | 4 |
| Oncologia: Modalidades Terapêuticas | 4 |
| Assistência de Enfermagem ao Paciente com HIV/Aids | 4 |
| Hipertensão Arterial Sistêmica | 4 |
| Doença Renal Crônica (DRC) | 2 |
| Métodos Dialíticos | 2 |
| Rastreamento de Doenças Cardiovasculares | 1 |
| Dermatite de Contato e Reações Cutâneas | 0 |

## Fase 2 — Análise de lacunas nos temas candidatos do usuário

| Tema candidato | Situação real em Saúde do Adulto |
|---|---|
| Diabetes Mellitus | Coberto — concentrado em "Pé Diabético e Doenças Crônicas" (9) |
| Hipertensão Arterial Sistêmica | Coberto (4) — ângulo de crise hipertensiva ainda ausente |
| Doença Renal Crônica | Cobertura leve (2) — complicações específicas ainda não testadas |
| Cuidados ao paciente oncológico | Bem coberto (9 entre os 2 tópicos de Oncologia) |
| Insuficiência Cardíaca | **0** — lacuna total nesta disciplina |
| Síndrome Coronariana Aguda | **0** — lacuna total nesta disciplina |
| AVC | **0** — lacuna total nesta disciplina |
| DPOC | **0** — lacuna total nesta disciplina |
| Asma | **0** — lacuna total nesta disciplina |
| Insuficiência Renal Aguda | **0** — lacuna total |
| Tromboembolismo Venoso | **0** nesta disciplina |
| Cuidados paliativos | **0** nesta disciplina (mas ver achado abaixo) |
| Dor crônica | **0** — lacuna total |
| Feridas e estomias | **0** nesta disciplina (mas ver achado abaixo) |
| Distúrbios hidroeletrolíticos | **0** — lacuna total |
| Segurança medicamentosa no adulto | **0** — lacuna total |

## Achado — Fase 4 (checagem cruzada obrigatória) — decisão de escopo desta sprint

Consultados os `topics` e feita busca por palavra-chave nas 5 disciplinas indicadas: **Enfermagem Médico-Cirúrgica** (`879c94da-079c-47a6-8920-890d51638446`), **Terapia Intensiva/UTI** (`9fecb48c-89bf-4c4c-8707-71c484febb10`), **Saúde do Idoso** (`3b89d695-3d69-42ca-a184-a9e8797bb61f`), **Segurança do Paciente** (`fb4f6568-12bc-401e-b268-f5098e297007`), **Farmacologia** (`6946a663-58eb-4ba6-bc3c-abefe72b2a8c`).

**Achado crítico:** Enfermagem Médico-Cirúrgica possui tópicos reais que cobrem, com nome quase idêntico ao mandato desta disciplina, exatamente vários dos temas "em lacuna" acima: "Doenças Cardiovasculares" (já testa Insuficiência Cardíaca e Síndrome Coronariana Aguda/angina), "Doenças Respiratórias Crônicas" (já testa DPOC e Asma), "Doenças Renais e Neurológicas Crônicas" (já testa AVC em fase crônica de reabilitação), "Emergências Clínicas" (já testa suspeita de TEP/tromboembolismo), "Oncologia" (já testa cuidados paliativos oncológicos), e possui tópico próprio "Estomas e Feridas Complexas". Isso caracteriza risco de **duplicidade real**, não apenas sobreposição temática, caso esses exatos temas fossem produzidos aqui com o mesmo enquadramento genérico de linha de cuidado.

**Decisão de escopo (tratamento por exclusão deliberada, mesmo critério já usado na sprint de Doenças Transmissíveis com Notificação Compulsória):** Insuficiência Cardíaca, Síndrome Coronariana Aguda, AVC, DPOC, Asma, Tromboembolismo Venoso, Cuidados Paliativos (ângulo oncológico) e Feridas/Estomias **não foram produzidos nesta sprint**, para não competir diretamente com o conteúdo já real e específico de Enfermagem Médico-Cirúrgica. Esse achado é registrado em `docs/editorial/auditoria/AUDITORIA_RECLASSIFICACAO_ACERVO.md` como divergência arquitetural entre o mandato nominal de "Saúde do Adulto" (linha de cuidado do adulto/atenção à saúde) e o mandato real, na prática, já assumido por Enfermagem Médico-Cirúrgica (clínica médica hospitalar por sistema/doença) — não corrigido nesta sprint, apenas registrado.

**Achados de adjacência leve (não bloqueiam produção, exigem apenas diferenciação de ângulo):**
- EMC tem 1 questão citando "crise hipertensiva" — mas no contexto de um paciente já estabilizado em avaliação para diálise (tópico "Métodos Dialíticos"), não a classificação emergência × urgência hipertensiva em si. A questão nova desta sprint (Q9) testa exatamente essa classificação, ângulo ainda não coberto.
- EMC tem 1 questão sobre DRC em "estágio avançado, ainda sem indicação de terapia renal substitutiva" — a questão nova desta sprint (Q10) testa uma complicação específica (anemia por deficiência de eritropoietina), ângulo distinto.
- Nenhum resultado para: insuficiência renal aguda/lesão renal aguda, hiponatremia, hipernatremia, hipocalemia, dor crônica, escada analgésica, polifarmácia, balanço hídrico rigoroso, taxa de filtração — confirma lacuna total real nesses temas, sem risco de duplicidade.

## Distribuição das 10 questões novas (exclusivamente lacunas reais, sem risco de duplicidade)

| Tema | Tópico de destino | Novas |
|---|---|---|
| Insuficiência Renal Aguda (classificação/causas; monitorização) | **Novo tópico**: "Insuficiência Renal Aguda e Distúrbios Hidroeletrolíticos" | 2 |
| Distúrbios hidroeletrolíticos (hipercalemia; hiponatremia) | mesmo novo tópico | 2 |
| Dor crônica não-oncológica (escada analgésica; nociceptiva × neuropática) | **Novo tópico**: "Dor Crônica no Adulto" | 2 |
| Segurança medicamentosa no adulto (polifarmácia em doença crônica) | **Novo tópico**: "Segurança Medicamentosa no Adulto com Doença Crônica" | 2 |
| Hipertensão Arterial Sistêmica — crise hipertensiva (ângulo novo) | Tópico real existente: "Hipertensão Arterial Sistêmica" | 1 |
| Doença Renal Crônica — complicação (anemia por deficiência de EPO) | Tópico real existente: "Doença Renal Crônica (DRC)" | 1 |
| **Total** | | **10** |

Verificação aritmética: 2+2+2+2+1+1=10; 40+10=50. Confere.

Justificativa para 3 novos tópicos (mínimo indispensável): IRA/distúrbios hidroeletrolíticos formam núcleo fisiopatológico coerente sem tópico real correspondente; Dor Crônica no Adulto precisa de tópico próprio para não ser confundida com "Cuidados Paliativos" (já testado em EMC sob ângulo oncológico/fim de vida); Segurança Medicamentosa no Adulto com Doença Crônica precisa de tópico próprio para não ser confundida com a "Cultura de Segurança do Paciente (PNSP)" institucional já testada na disciplina Segurança do Paciente — o ângulo aqui é estritamente clínico-farmacológico (polifarmácia em multimorbidade), não institucional.

## Distribuição cognitiva

Disciplina clínica — aplicada a distribuição homologada 70/20/10 (aplicação clínica / julgamento clínico / integração normativa), detalhamento na Produção.
