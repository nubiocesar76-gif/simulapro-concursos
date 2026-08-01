# HOMOLOGAÇÃO — LEGISLAÇÃO APLICADA À EBSERH — COMPLEMENTAÇÃO — V1

## Fase 1 — Auditoria (estado real confirmado antes da produção)

Reconfirmado diretamente no banco: **39 questões reais** (exatamente conforme esperado pelo usuário — nenhuma divergência). Meta: 50 − 39 = **11 questões novas**, exatamente conforme esperado. 7 `topics` reais, todos organizados por instrumento normativo específico (Estatuto, Regimento Interno, Lei nº 12.550/2011, Código de Ética e Conduta, Regulamento de Pessoal, Regulamento de Licitações e Contratos, Norma Operacional de Controle Disciplinar).

## Fase 2 — Análise do acervo

Ver `ANALISE_ACERVO_LEGISLACAO_EBSERH_V1.md`: dos 15 temas priorizados pelo usuário, 4 já bem cobertos (Lei nº 12.550/2011, Estatuto, Regimento Interno, Código de Ética), 2 com cobertura apenas de composição/existência do órgão (Competências da Diretoria Executiva e do Conselho de Administração — lacuna de ângulo), 1 com cobertura rasa (Ouvidoria — lacuna de ângulo) e 6 em lacuna total (Governança Corporativa, Transparência e Integridade, Compliance, Gestão de Riscos, Programa de Integridade, LGPD, Humanização e Política de Gestão).

## Pipeline executado

3. **Produção** — `PRODUCAO_LEGISLACAO_EBSERH_Q1-11_V1.md`, 11 questões inéditas, todas direcionadas às lacunas identificadas.
4. **Fase 4 — Controle de duplicidade** (checagem cruzada obrigatória contra Legislação Municipal e Institucional, Ética e Legislação em Enfermagem, Administração em Enfermagem, Políticas Públicas de Saúde e Conhecimentos Gerais sobre o DF): **achado relevante** — Políticas Públicas de Saúde já cobre extensivamente a Política Nacional de Humanização (PNH) do SUS (5 questões reais: método, diretrizes, histórico). As 2 questões de humanização desta sprint foram tratadas com ângulo estritamente institucional (gestão de pessoas na EBSERH), sem repetir o método/diretrizes da PNH nacional. Legislação Municipal e Institucional cobre Lei Anticorrupção e Lei de Improbidade (leis gerais) — tratado como sobreposição temática legítima, já que o conteúdo novo desta sprint versa sobre o arcabouço de governança/integridade específico e interno da EBSERH. Nenhuma inconsistência de classificação para registrar em `docs/editorial/auditoria/AUDITORIA_RECLASSIFICACAO_ACERVO.md` nesta sprint — toda sobreposição identificada foi tratada por diferenciação de ângulo antes da produção, não após.
5. **Gate Editorial** — `GATE_EDITORIAL_LEGISLACAO_EBSERH_V1.md`, 11/11 APROVADAS.
6-7. **Conversão + Importação** — `docs/imports/legislacao-ebserh-complementacao.csv` → `docs/seeds/legislacao-ebserh-complementacao.seed.json`: **11/11 convertidas sem erros**; `seed:questions`: **11 criadas, 0 ignoradas, 0 erros**. **3 tópicos novos criados** (indispensáveis, justificativa completa na Análise do Acervo): "Governança Corporativa e Integridade da EBSERH", "LGPD Aplicada à EBSERH", "Humanização e Gestão de Pessoas na EBSERH". Taxonomia reexportada (`export-taxonomy.ts`) antes da conversão.
8. **Homologação** — este documento.

## Verificação real pós-importação (consulta direta ao banco)

- Quantidade inicial: 39. Quantidade produzida: 11. Quantidade convertida: 11. Quantidade importada: 11. Quantidade ignorada: 0. Erros: 0.
- Quantidade final da disciplina: **50** (39 pré-existentes + 11 novas).
- Cobertura dos assuntos: **10 tópicos reais** (7 pré-existentes + 3 novos), todos com questões. Distribuição: Estatuto da EBSERH (11), Regimento Interno da Administração Central (10), Lei nº 12.550/2011 (7), Código de Ética e Conduta da EBSERH (5), Governança Corporativa e Integridade da EBSERH (5, novo), Regulamento de Pessoal da EBSERH (3), Regulamento de Licitações e Contratos da EBSERH (3), Norma Operacional de Controle Disciplinar (2), LGPD Aplicada à EBSERH (2, novo), Humanização e Gestão de Pessoas na EBSERH (2, novo).
- `subject_id`/`topic_id` corretos em 100% das 50 linhas. `package_version_id`: **50/50 com a versão publicada principal** — nenhuma anomalia nesta sprint (diferente da maioria das demais disciplinas desta sessão, que apresentam 1 questão em distribuição demo; aqui não há nenhuma). `exam_id` nulo nas 11 novas (esperado — inédito). 0 gabaritos inválidos.
- `bibliography`: presente nas 11 novas (mais 5 pré-existentes que já possuíam o campo); ausente nas demais 34 pré-existentes (dado legado, não alterado).
- Distribuição por banca (50 questões, incluindo as 39 pré-existentes): IBFC (25), CEBRASPE (11), FGV (7), Instituto AOCP (7) — roster já consistente com o real desta disciplina, sem banca nova introduzida.

## Cobertura dos subassuntos

Temas priorizados pelo usuário diretamente endereçados pelas 11 novas: Governança Corporativa (princípios do Decreto nº 9.203/2017), Compliance, Gestão de Riscos (linhas de defesa), Programa de Integridade, Transparência e Integridade (5 questões no novo tópico); LGPD aplicada à EBSERH — aplicabilidade ao Poder Público e Encarregado/DPO (2 questões); Humanização e Política de Gestão — ângulo institucional de gestão de pessoas (2 questões); Competências do Conselho de Administração (1, no tópico Estatuto); Ouvidoria — competências específicas (1, no tópico Regimento Interno). Lei nº 12.550/2011, Estatuto Social (composição), Regimento Interno (estrutura geral) e Código de Ética já tinham cobertura real suficiente e não foram repetidos.

## Distribuição cognitiva

Não solicitada explicitamente com o rótulo clínico padrão (disciplina normativa, não clínica). Classificação aplicada: **7 interpretação normativa, 2 aplicação normativa, 2 julgamento institucional** (63,6/18,2/18,2%).

## Problemas encontrados e correções realizadas

- Nenhuma divergência entre a contagem esperada (39) e a real — confirmado exato.
- Achado de sobreposição real com Políticas Públicas de Saúde em "Política Nacional de Humanização (PNH)" — tratado por **diferenciação de ângulo desde a origem** (produção institucional, nunca a PNH genérica), evitando duplicidade real sem necessidade de exclusão do tema.
- 2 questões originalmente redigidas em formato CEBRASPE Certo/Errado (Q2, Q6) foram convertidas para o formato padrão de 5 alternativas antes da conversão para CSV, para manter consistência com o contrato real do banco (`correct_answer` de A a E) — ajuste de forma, sem alteração de conteúdo/gabarito.
- 3 tópicos novos criados, todos justificados como indispensáveis (nenhum tópico real existente comportava os temas sem confundir a base normativa).
- Nenhum bloqueio técnico, normativo ou metodológico real encontrado.

## Resultado

Disciplina Legislação Aplicada à EBSERH complementada com 11 questões inéditas, todas direcionadas a lacunas reais identificadas na análise do acervo, com Gate Editorial 11/11 aprovado, e total da disciplina no banco em 50 questões.

## Total geral da plataforma após esta sprint

**1.704 questões** (1.693 antes desta sprint + 11 novas).
