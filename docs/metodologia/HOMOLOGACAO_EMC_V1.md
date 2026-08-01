# HOMOLOGAÇÃO — ENFERMAGEM MÉDICO-CIRÚRGICA — V1

## Etapa 1 — Auditoria (estado real confirmado antes da produção)

Consulta direta ao banco de produção: 15 questões reais pré-existentes, **20 `topics` reais já cadastrados** (nenhum precisou ser criado nesta sprint). Nenhum documento em `docs/metodologia` para esta disciplina antes desta sprint — Dossiê Mestre, Inteligência Editorial, Auditoria Normativa e Plano Editorial produzidos do zero (Etapa 2), reaproveitando `docs/editorial/02e-saude-adulto-idoso-medico-cirurgica.md` (seção 3, `D07`) como fonte real de conteúdo/taxonomia, incluindo o achado ERRATA V1.1 (absorção de "Saúde do Adulto" por esta disciplina).

## Pipeline executado (real, ponta a ponta)

1-2. **Auditoria + Documentação** — `DOSSIE_MESTRE_ENFERMAGEM_MEDICO_CIRURGICA_V1.md`, `INTELIGENCIA_EDITORIAL_ENFERMAGEM_MEDICO_CIRURGICA_V1.md`, `AUDITORIA_NORMATIVA_ENFERMAGEM_MEDICO_CIRURGICA_V1.md`, `PLANO_PRODUCAO_ENFERMAGEM_MEDICO_CIRURGICA_V1.md` — criados nesta sprint, seguindo o padrão homologado.
3. **Produção** — `PRODUCAO_EMC_LOTE1_Q1-18_V1.md` e `LOTE2_Q19-35_V1.md`, 35 questões inéditas, cobrindo os 20 tópicos reais do Plano.
4. **Gate Editorial** — `GATE_EDITORIAL_EMC_V1.md`, 35/35 APROVADAS.
5. **Conversão** — `docs/imports/emc-lote-completo.csv` → `docs/seeds/emc-lote-completo.seed.json`, **35/35 convertidas sem erros** pelo `convert:questions` oficial.
6. **Importação** — `seed:questions`: **35 criadas, 0 ignoradas, 0 erros**. Nenhum tópico precisou ser criado (todos os 20 já existiam).
7. **Homologação** — este documento.

## Verificação real pós-importação (consulta direta ao banco)

- Quantidade produzida: 35. Quantidade convertida: 35. Quantidade importada: 35. Quantidade ignorada: 0. Quantidade com erro: 0.
- Quantidade final da disciplina: **50** (15 pré-existentes + 35 novas).
- Cobertura dos assuntos: **20/20 tópicos reais** cobertos (cada um com 2 a 6 questões no total, nenhum tópico zerado).
- 50/50 questões com `package_version_id` correto (`940ad0d6-1147-4ba1-be1a-0b07c34cb76b`, "Edição Inicial RC1", `PUBLISHED`). `subject_id` e `topic_id` corretos em 100% das linhas (confirmado via join `topics(name)`). `exam_id` nulo nas 35 novas (esperado — inédito, sem concurso/ano real de origem). 0 gabaritos inválidos.
- `bibliography`: presente nas 35 novas; ausente nas 15 pré-existentes (dado legado, não alterado nesta sprint — mesma situação já observada nas disciplinas anteriores).
- Distribuição por banca (50 questões, incluindo as 15 pré-existentes): CEBRASPE (15), FGV (10), IBFC (5), Fundação VUNESP (5), Instituto AOCP (5), Instituto Consulplan (4), IDECAN (4), Centro de Seleção da Universidade Federal de Goiás (2, pré-existente) — priorizando as bancas com evidência real nesta disciplina (CEBRASPE, FGV).
- **Total geral da plataforma após esta sprint: 1.525 questões** (1.490 antes desta sprint + 35 novas).

## Cobertura dos assuntos e subassuntos

Os 20 `topics` reais (tratados como a lista oficial de assuntos desta disciplina, mais granular que a descrição textual de `02e`) foram integralmente cobertos: Cuidado Perioperatório (2), Enfermagem em Especialidades Cirúrgicas (2), Estomas e Feridas Complexas (2), Oncologia (2), Doenças Cardiovasculares (3), Doenças Endócrino-metabólicas (6), Doenças Respiratórias Crônicas (2), Doenças Renais e Neurológicas Crônicas (2), Cuidado Crônico e Linha de Cuidado (5), Emergências Clínicas (3), Doação e Transplante de Órgãos (2), Oncologia: Modalidades Terapêuticas (2), Oncologia: Assistência de Enfermagem (2), Pé Diabético e Doenças Crônicas (2), Assistência de Enfermagem ao Paciente com HIV/Aids (2), Dermatite de Contato e Reações Cutâneas (2), Hipertensão Arterial Sistêmica (3), Rastreamento de Doenças Cardiovasculares (2), Doença Renal Crônica — DRC (2), Métodos Dialíticos (2).

## Problemas encontrados e correções realizadas

- Nenhum bloqueio técnico real impediu a continuidade do Sprint.
- Nenhum tópico precisou ser criado (situação diferente das disciplinas anteriores desta fase) — os 20 já existiam no banco, mais granulares que a fonte editorial textual (`02e`), achado registrado explicitamente no Dossiê Mestre.
- Distribuição cognitiva 70/20/10 apresentou o maior desvio desta fase: resultado real 65,7% aplicação clínica / 25,7% julgamento clínico / 8,6% integração normativa, por causa da forte tradição real de caso clínico nesta disciplina (padrão FGV/CEBRASPE já observado nas 15 questões reais), favorecendo questões de julgamento clínico. Desvio documentado por transparência no Gate Editorial, não corrigido artificialmente às custas de reduzir o rigor clínico das questões.

## Resultado

Disciplina Enfermagem Médico-Cirúrgica homologada com 35 questões inéditas produzidas e importadas com sucesso, cobrindo a totalidade dos 20 tópicos reais, com Gate Editorial 35/35 aprovado, e total da disciplina no banco em 50 questões.
