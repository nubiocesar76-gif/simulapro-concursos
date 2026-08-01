# ANÁLISE DO ACERVO — LEGISLAÇÃO APLICADA À EBSERH — V1 (Sprint de Complementação)

## Fase 1 — Auditoria (estado real confirmado no banco)

Reconfirmado diretamente no banco: **39 questões reais** (exatamente conforme esperado pelo usuário — nenhuma divergência). Meta: 50 − 39 = **11 questões novas**, exatamente conforme esperado. `subject_id`: `00c52d42-8ed2-42d7-9396-7ce2c53a1ed1`. `package_version_id`: 39/39 com a versão publicada principal — nenhuma anomalia.

7 `topics` reais, todos organizados por instrumento normativo (não por tema transversal):

| Tópico real | Questões |
|---|---|
| Estatuto da EBSERH | 10 |
| Regimento Interno da Administração Central | 9 |
| Lei nº 12.550/2011 | 7 |
| Código de Ética e Conduta da EBSERH | 5 |
| Regulamento de Pessoal da EBSERH | 3 |
| Regulamento de Licitações e Contratos da EBSERH | 3 |
| Norma Operacional de Controle Disciplinar | 2 |

## Fase 2 — Análise de lacunas nos 15 temas prioritários do usuário

A partir da leitura integral dos 39 enunciados reais, mapeamento contra os 15 temas priorizados:

| Tema prioritário | Situação real |
|---|---|
| Lei nº 12.550/2011 | Coberto (7) — não produzir mais |
| Estatuto Social da EBSERH | Coberto (10) — não produzir mais, exceto ângulo específico abaixo |
| Regimento Interno | Coberto (9) — não produzir mais, exceto ângulo específico abaixo |
| Código de Ética e Conduta | Coberto (5) — não produzir mais |
| Competências da Diretoria Executiva | Coberta apenas quanto à existência/composição do órgão (1 questão real); **lacuna de ângulo** — nunca testadas as competências específicas (lista de atribuições) |
| Competências do Conselho de Administração | Idem — coberta quanto à existência/composição (2 questões reais: CA e Conselho Fiscal); **lacuna de ângulo** — competências específicas nunca testadas |
| Ouvidoria | 1 questão real, mas só sobre o dever de dar ciência ao denunciado; **lacuna de ângulo** — competências/estrutura da Ouvidoria-Geral nunca testadas |
| Governança Corporativa (como conceito estruturante) | **Lacuna total** — nenhuma questão trata o tema como princípio de governança pública (Decreto nº 9.203/2017) |
| Estrutura Organizacional | Parcialmente coberta de forma difusa via Regimento Interno; sem questão dedicada aos princípios de estruturação |
| Transparência e Integridade | **Lacuna total** |
| Compliance | **Lacuna total** |
| Gestão de Riscos | **Lacuna total** |
| Programa de Integridade | **Lacuna total** |
| LGPD aplicada à EBSERH | **Lacuna total** |
| Humanização e Política de Gestão | **Lacuna total** (ver achado de Fase 4 abaixo — exige ângulo institucional, não genérico) |

## Achado — Fase 4 (checagem cruzada obrigatória)

Consultados os `topics` e feita busca por palavra-chave (`ilike`) nos enunciados das 5 disciplinas indicadas: **Legislação Municipal e Institucional** (`db8e0767-b685-481e-8aac-beb93c1280ec`), **Ética e Legislação em Enfermagem** (`dc9160de-7e58-4cef-b288-d9b262fa4138`), **Administração em Enfermagem** (`b96506cb-b563-4bad-88df-675fd569486f`), **Políticas Públicas de Saúde** (`628cfd92-79a2-4aba-a36d-5987ba22acf4`), **Conhecimentos Gerais sobre o Distrito Federal** (`4b722b95-80dd-4cd2-9744-03285b16617a`).

- **Políticas Públicas de Saúde já cobre extensivamente a Política Nacional de Humanização (PNH) do SUS** — 5 questões reais no tópico "Política Nacional de Humanização (PNH)", tratando do método da tríplice inclusão, ambiência, clínica ampliada e compartilhada, cogestão e histórico da PNH. **Por isso, o tema "Humanização" desta sprint não pode ser tratado com o enquadramento genérico da PNH** (que caracterizaria duplicidade real), apenas sob o ângulo estritamente institucional da EBSERH (gestão de pessoas e humanização da assistência nos hospitais universitários federais geridos pela empresa), sem repetir as diretrizes/método da PNH nacional.
- **Legislação Municipal e Institucional** possui questões sobre Lei Anticorrupção (Lei nº 12.846/2013), Lei de Improbidade Administrativa (Lei nº 8.429/1992) e "Direitos Fundamentais" (sigilo/confidencialidade de servidor) — são leis federais gerais de aplicação ampla, não específicas da EBSERH; **sobreposição temática legítima** (área de integridade/anticorrupção em sentido amplo), não duplicidade real, pois o conteúdo novo desta sprint trata do arcabouço de governança/integridade **interno e específico da EBSERH** (Decreto nº 9.203/2017 aplicado à empresa, Programa de Integridade institucional), nunca essas leis gerais em si.
- **Ética e Legislação em Enfermagem** e **Administração em Enfermagem**: nenhuma sobreposição relevante encontrada (buscas por "risco", "humaniza" retornaram apenas conteúdo genérico de bioética/tecnologias em saúde, sem relação com governança/compliance institucional).
- **Nenhum resultado** para "LGPD", "protecao de dados", "ouvidoria", "governan[ça]" (fora do já citado), "compliance" em nenhuma das 5 disciplinas — confirma lacuna total real, sem risco de duplicidade.
- Nenhuma inconsistência de classificação (diferente de sobreposição temática legítima já tratada por diferenciação de ângulo) para registrar em `docs/editorial/auditoria/AUDITORIA_RECLASSIFICACAO_ACERVO.md` nesta sprint.

## Distribuição das 11 questões novas (exclusivamente lacunas)

| Tema | Tópico de destino | Novas |
|---|---|---|
| Governança Corporativa, Compliance, Gestão de Riscos, Programa de Integridade, Transparência | **Novo tópico**: "Governança Corporativa e Integridade da EBSERH" | 5 |
| LGPD aplicada à EBSERH | **Novo tópico**: "LGPD Aplicada à EBSERH" | 2 |
| Humanização e Gestão de Pessoas (ângulo institucional EBSERH, não PNH genérica) | **Novo tópico**: "Humanização e Gestão de Pessoas na EBSERH" | 2 |
| Competências do Conselho de Administração (ângulo de atribuições, não composição) | Tópico real existente: "Estatuto da EBSERH" | 1 |
| Ouvidoria (ângulo de competências/estrutura, não apenas dever de ciência) | Tópico real existente: "Regimento Interno da Administração Central" | 1 |
| **Total** | | **11** |

Verificação aritmética: 5+2+2+1+1=11; 39+11=50. Confere.

Justificativa para 3 novos tópicos (mínimo indispensável): os 5 temas de governança/integridade formam um núcleo normativo coerente (mesma base: Decreto nº 9.203/2017 + Programa de Integridade institucional da EBSERH) e não cabem em nenhum tópico real existente, todos organizados por instrumento normativo específico. LGPD tem base legal totalmente distinta (Lei nº 13.709/2018) e não pode ser fundida ao tópico de governança sem confundir a base normativa. Humanização precisa de tópico próprio justamente para não ser confundida com a "Política Nacional de Humanização (PNH)" já coberta em Políticas Públicas de Saúde — mantê-la fundida a qualquer outro tópico aumentaria esse risco de confusão editorial.

## Distribuição cognitiva

Reaplicada a classificação já usada nas disciplinas normativas desta sessão (aplicação clínica não se aplica a esta disciplina; usa-se): **aplicação/interpretação normativa direta, julgamento institucional, integração entre normas**. Detalhamento na Produção.
