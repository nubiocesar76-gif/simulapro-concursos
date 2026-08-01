# ANÁLISE DO ACERVO — ENFERMAGEM EM DOENÇAS TRANSMISSÍVEIS — V1 (Sprint de Complementação)

## Fase 1 — Auditoria (estado real confirmado no banco)

Reconfirmado diretamente no banco: **41 questões reais** (exatamente conforme esperado pelo usuário). Meta: 50 − 41 = **9 questões novas**. Único `topic` real: "Prevenção e Controle de Doenças Transmissíveis" (catch-all, sem subdivisão por doença na taxonomia) — todas as 41 questões estão nele; nenhum tópico novo necessário, a produção nova segue no mesmo tópico único, mantendo a convenção real já estabelecida para esta disciplina.

`package_version_id`: 41/41 com a versão publicada principal — nenhuma anomalia.

## Fase 2 — Análise de conteúdo por doença (a partir da leitura integral dos 41 enunciados)

Como o `topic` é único, a análise de cobertura foi feita por **doença/tema clínico**, extraído do conteúdo de cada enunciado:

| Doença/tema | Questões reais (aprox.) | Situação |
|---|---|---|
| Tuberculose | 9 | **Fortemente concentrado** — não produzir mais |
| Dengue | 7 | **Fortemente concentrado** — não produzir mais |
| Febre maculosa | 4 (cluster de caso clínico único, mesma banca) | Coberto — não produzir mais |
| Malária | 2 (quase idênticas entre si) | Coberto — não produzir mais |
| Hanseníase | 2 | Cobertura leve, suficiente |
| Raiva/Soro Antirrábico | 2 | Cobertura leve, suficiente |
| Sífilis / IST | 2-3 | Cobertura leve, suficiente |
| Hepatites Virais | 1 | Lacuna leve |
| Chikungunya | 1 (compartilhada com teste rápido) | **Lacuna** |
| Influenza | 1 | Lacuna leve |
| COVID-19 | 1 (fase aguda/manejo emergencial) | **Lacuna** (ângulo de vigilância/situação vigente ausente) |
| Meningite | 1 | Lacuna leve |
| Febre amarela | 1 | Lacuna leve |
| **HIV/AIDS** | **0** | **Lacuna total** |
| **Leptospirose** | **0** | **Lacuna total** |
| **Doenças exantemáticas (sarampo/rubéola)** | **0** | **Lacuna total** |
| **Zika (conteúdo dedicado à doença, não apenas ao teste rápido)** | **0** | **Lacuna total** |
| Notificação compulsória, vigilância epidemiológica (como conceito geral) | 0 | **Não é lacuna real desta disciplina** — ver achado abaixo |

## Achado — sobreposição real relevante com Saúde Coletiva (Fase 4)

A checagem cruzada obrigatória revelou que a disciplina **Saúde Coletiva já possui cobertura real e substancial** de "Notificação Compulsória"/SINAN — 4 questões reais no tópico "Sistemas de Informação em Saúde (SINAN/SIM)" tratando especificamente da Lista Nacional de Notificação Compulsória (Portaria de Consolidação GM/MS, Anexo V), além de conteúdo real sobre COVID-19 (dado epidemiológico agregado) e Influenza (contexto de pandemia 2009) no tópico "Epidemiologia Básica e Bioestatística". Por essa razão, **"Notificação compulsória" e "Vigilância epidemiológica" como temas gerais e autônomos não foram tratados como lacuna desta sprint** — permaneceriam como duplicidade real (não apenas sobreposição temática legítima) se produzidos aqui com o mesmo enquadramento (lista de doenças/sistema de informação). A produção nova desta sprint, quando toca COVID-19, mantém o foco na dimensão clínica/epidemiológica da doença em si (situação vigente da doença, não o sistema de notificação), consistente com o escopo de Doenças Transmissíveis (a doença) em oposição a Saúde Coletiva (o método/sistema).

Também verificado: `Biossegurança` já cobre HIV apenas sob o ângulo de profilaxia pós-exposição ocupacional (2 questões reais) — a produção nova de HIV/AIDS desta sprint usa ângulos clínicos distintos (janela imunológica, transmissão vertical), não repetindo PEP ocupacional. `Controle de Infecção Hospitalar` cobre "precauções" apenas em nível institucional/genérico, sem tocar nenhuma das doenças específicas priorizadas nesta sprint. `Imunização` cobre vacina contra gripe/COVID/sarampo, mas nunca a doença em si (clínica/epidemiologia) — distinção aplicada rigorosamente na produção nova. `Políticas Públicas de Saúde`: 0 resultados relevantes.

Nenhuma inconsistência de classificação (diferente de duplicidade legítima por ângulo) foi encontrada para registrar em `docs/editorial/auditoria/AUDITORIA_RECLASSIFICACAO_ACERVO.md` nesta sprint — toda sobreposição identificada é temática e tratada por diferenciação de ângulo, já documentada aqui.

## Distribuição das 9 questões novas (exclusivamente lacunas)

| Tema | Novas |
|---|---|
| HIV/AIDS (janela imunológica; transmissão vertical) | 2 |
| Leptospirose (transmissão/reservatório; quadro clínico grave) | 2 |
| Doenças exantemáticas (sarampo — características; diagnóstico diferencial sarampo × rubéola) | 2 |
| Zika (manifestações clínicas/vetor no adulto — ângulo ainda não coberto nesta disciplina) | 1 |
| COVID-19 (situação epidemiológica vigente/classificação atual — ângulo distinto do já coberto) | 1 |
| Chikungunya (fase crônica/artralgia persistente — ângulo ainda não coberto) | 1 |
| **Total** | **9** |

Verificação aritmética: 2+2+2+1+1+1=9; 41+9=50. Confere.

## Distribuição cognitiva

Não solicitada explicitamente nesta sprint. Classificação aplicada: 5 aplicação clínica, 3 julgamento clínico, 1 integração normativa.
