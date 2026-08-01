# DOSSIÊ MESTRE — SAÚDE COLETIVA — INTELIGÊNCIA EDITORIAL V1

## Objetivo

Este documento **complementa** — e não substitui, reescreve ou resume — o `DOSSIE_MESTRE_SAUDE_COLETIVA_V1.md`. Seu único consumidor pretendido é o Motor Editorial: incidência histórica por subassunto, perfil de banca, pegadinhas conhecidas, matriz de cobertura, relações entre assuntos e checklist de aprovação. Nenhuma questão, alternativa ou simulado é produzido aqui. Estrutura idêntica à já homologada em `DOSSIE_MESTRE_SAE_INTELIGENCIA_EDITORIAL_V1.md` e `DOSSIE_MESTRE_UTI_INTELIGENCIA_EDITORIAL_V1.md`: 6 partes, nenhuma removida, nenhuma acrescentada.

## Nota metodológica desta pesquisa

Toda a Parte 1 e a Parte 2 foram construídas a partir de **dados reais do banco de produção do SimulaPro** (tabela `questions`, disciplina "Saúde Coletiva" — **49 questões reais** examinadas diretamente, enunciado, alternativas e gabarito completos, com paginação `.range()` para garantir leitura de 100% do conjunto, não amostra). Onde a evidência é insuficiente para uma banca ou um subassunto, isso é declarado explicitamente — nenhuma característica foi inventada.

**Granularidade da Parte 1 — decisão desta fase, registrada por transparência.** As duas Inteligências Editoriais anteriores (SAE, UTI) construíram a Parte 1 no nível de **assunto** (8-9 linhas), porque na época em que foram escritas ainda não existia, para aquelas disciplinas, uma matriz de subassuntos publicada no próprio Dossiê Mestre. Para Saúde Coletiva, o `DOSSIE_MESTRE_SAUDE_COLETIVA_V1.md` já organiza 16 capítulos sobre os 30 subassuntos reais da taxonomia normalizada (`docs/editorial/normalized/03-subassuntos.json`). A instrução desta fase pede explicitamente análise por subassunto; a Parte 1 abaixo é construída nesse nível — mesmas 3 colunas do modelo homologado (Subassunto/Classificação/Justificativa, renomeando apenas o rótulo da primeira coluna de "Assunto" para "Subassunto" para refletir o grão pedido — nenhuma coluna nova foi criada), sem alterar a estrutura de 6 partes do documento nem os campos de nenhuma das outras 5 partes.

**Achado de granularidade do acervo real.** O acervo real do SimulaPro tagueia questões por **tópico** (2 níveis: `subject`/`topic`), não por subassunto (3 níveis: macrotema/assunto/subassunto). Os 12 tópicos reais hoje existentes sob "Saúde Coletiva" não correspondem 1:1 aos 30 subassuntos do Dossiê Mestre — em vários casos um único tópico real (ex.: "Epidemiologia Básica e Bioestatística", 22 questões) agrega evidência que, tecnicamente, se distribui entre 3-5 subassuntos finos do Dossiê. Nesses casos, a Parte 1 declara a evidência agregada e faz uma leitura direta dos enunciados reais para estimar a concentração por subassunto — nunca infere um número que não foi contado.

---

# PARTE 1 — INCIDÊNCIA EM CONCURSOS (POR SUBASSUNTO)

## Achados de cobertura real fora do Dossiê Mestre (registrados aqui, Dossiê não alterado)

5 dos 12 tópicos reais do acervo sob "Saúde Coletiva" **não correspondem a nenhum subassunto do Dossiê Mestre V1**: Suplementação de Ferro e Anemia Ferropriva (2 questões reais), Identificação e Notificação de Violência (1), Regulação do Acesso à Assistência em Saúde (1), Multiprofissionalidade e Trabalho em Equipe (1), Integração Ensino-Serviço (1) — 6 das 49 questões reais (12,2%) tratam de conteúdo sem subassunto correspondente. Isso não é corrigido nesta fase (alteraria o Dossiê Mestre, fora de escopo) — é um achado editorial acionável para uma futura revisão do Dossiê, registrado exatamente como o achado da Resolução COFEN nº 736/2024 foi registrado na Inteligência Editorial de Processo de Enfermagem, sem alterar o documento de origem.

## Tabela de incidência

| Subassunto | Classificação | Justificativa |
|---|---|---|
| **1.1 Indicadores de Saúde** | **Alta** | Evidência real: parte dos 22 questões do tópico agregado "Epidemiologia Básica e Bioestatística" — leitura direta identifica ao menos 2 questões FGV (2022) tratando de indicadores/medidas de tendência central diretamente. Perfil: conceitual/cálculo. Erros frequentes: confundir tipo de indicador (ver Parte 3). Integração: alta com 1.2 (mesmo tópico agregado real). Risco normativo: nenhum (metodologia técnico-científica, não normativa). Prioridade editorial: alta, maior volume de evidência real de toda a disciplina. |
| **1.2 Coeficientes e Taxas Epidemiológicas** | **Muito Alta** | Evidência real direta e repetida: FGV 2024 ("taxa de letalidade de 1,8%..."), FGV 2022 ("medida... obtida da relação entre casos fatais..." — 2 ocorrências quase idênticas, anos diferentes), FGV 2022 (cálculo incidência × prevalência com dois municípios), FGV 2022 (interpretação de painel Covid-19 com múltiplos indicadores). Perfil: aplicado/cálculo, não memorização pura. Erros frequentes: confundir letalidade com mortalidade, incidência com prevalência (ver Parte 3, achado real e recorrente). Integração: com 1.4 (vigilância usa estes coeficientes). Risco normativo: nenhum. Prioridade editorial: **a mais alta da disciplina** — é o subassunto com maior volume de evidência real direta e repetida de todo o Dossiê. |
| **1.3 Transição Demográfica e Epidemiológica** | Média | Evidência real indireta: Instituto AOCP 2020 ("maior proporção de causas de óbito... doenças do aparelho circulatório", série histórica 2006-2017) tangencia o conceito de transição epidemiológica sem nomeá-la. Perfil: aplicado, leitura de dado. Erros frequentes: EVIDÊNCIA INSUFICIENTE (nenhuma ocorrência real testa o conceito diretamente). Integração: com 2.1 (Determinantes Sociais). Risco normativo: nenhum. Prioridade editorial: média — relevância estrutural do Dossiê Mestre, sem evidência direta robusta. |
| **1.4 Cadeia Epidemiológica** | Baixa | EVIDÊNCIA INSUFICIENTE — nenhuma questão real do acervo testa o modelo (agente/reservatório/porta de saída/transmissão/porta de entrada/hospedeiro) diretamente. Prioridade editorial: baixa por ausência de evidência, apesar de relevância estrutural no Dossiê Mestre (Capítulo 1.3). |
| **1.5 Níveis de Prevenção** | Média | Evidência real indireta: Instituto AOCP 2020 ("aplicação de exames... em pessoas sadias... garantia de benefícios relevantes frente aos riscos") descreve rastreamento, tema de prevenção secundária, sem nomear os 4 níveis diretamente. Erros frequentes: EVIDÊNCIA INSUFICIENTE quanto a erro recorrente específico. Integração: com 1.3. Risco normativo: nenhum. Prioridade editorial: média. |
| **1.6 Vigilância Epidemiológica** | **Muito Alta** | Evidência real direta: Instituto Consulplan 2023 (2 questões sobre SINAN/SIM), IBFC 2013 (SINAN), FGV 2014 (Lista de Notificação Compulsória em Unidades Sentinelas), Centro de Seleção UFG 2022 ("sistema de vigilância epidemiológica... eficiente... aferido por medidas quantitativas e qualitativas"). Perfil: misto normativo/conceitual. Erros frequentes: confundir alimentação do SINAN só por casos confirmados com also-suspeitos (achado real, Parte 3). Integração: alta com 1.2 (coeficientes) e 4.2 (EAPV também é objeto de notificação). Risco normativo: médio (Portaria de Consolidação nº 4/2017, Portaria GM/MS nº 204/2016 — conteúdo específico sujeito a atualização, ver Dossiê Mestre Cap. 1.4). Prioridade editorial: muito alta — segundo maior volume de evidência real direta. |
| **1.6b Notificação Compulsória** *(mesmo capítulo 1.4 do Dossiê Mestre)* | **Alta** | Evidência real direta: FGV 2014 (Lista de Notificação Compulsória em Unidades Sentinelas — exceção de leishmaniose visceral), Instituto Consulplan 2023 (notificação negativa, alimentação obrigatória sob risco de suspensão do PAB). Erros frequentes: confundir lista nacional geral com lista de unidades sentinela (achado real, Parte 3). Integração: com 1.6. Risco normativo: médio (lista sujeita a atualização periódica — Dossiê Mestre já sinaliza EVIDÊNCIA INSUFICIENTE quanto à versão vigente). Prioridade editorial: alta. |
| **1.6c Sistemas de Informação em Saúde** *(mesmo capítulo 1.4)* | **Alta** | Evidência real direta: Instituto Consulplan 2023 (SIM, responsabilidade pela emissão da declaração de óbito), demais ocorrências de SINAN já citadas em 1.6. Erros frequentes: confundir titularidade/responsabilidade entre esferas de gestão (achado real — questão testa se emissão é exclusiva do MS, das Secretarias, ou de ambos; gabarito real: exclusiva do Ministério da Saúde). Integração: alta com 1.6/1.6b. Risco normativo: baixo (estrutura de responsabilidade é estável). Prioridade editorial: alta. |
| **1.7 Vigilância Sanitária** | Baixa | EVIDÊNCIA INSUFICIENTE — nenhuma das 49 questões reais examinadas trata de vigilância sanitária de produtos/serviços diretamente. Prioridade editorial: baixa por ausência de evidência. |
| **1.8 Vigilância Ambiental em Saúde** | Baixa | EVIDÊNCIA INSUFICIENTE — nenhuma questão real examinada. Prioridade editorial: baixa. |
| **1.9 Vigilância em Saúde do Trabalhador** | **Muito Alta** | Evidência real direta e volumosa: 8 questões reais sob o tópico correspondente do acervo — IBFC 2019 (doenças do trabalho: silicose, asbestose, LER/DORT, cromagem — comando negativo "assinale a incorreta"), IBFC 2022 (2 questões, investigação epidemiológica e notificação de agravos do trabalho), Fundação VUNESP 2023 (febre maculosa como acidente de trabalho equiparado, CAT), Centro de Seleção UFG 2022 (Portaria MTP sobre Covid-19 em ambiente de trabalho). Perfil: misto conceitual/aplicado, com forte presença de caso clínico-trabalhista (VUNESP). Erros frequentes: confundir doença do trabalho com doença profissional, e acidente equiparado com doença ocupacional (achado real, Parte 3). Integração: com 1.6 (notificação de agravos do trabalho via SINAN). Risco normativo: médio. Prioridade editorial: muito alta — terceiro maior volume de evidência real da disciplina. |
| **2.1 Determinantes Sociais da Saúde (DSS)** | Baixa | EVIDÊNCIA INSUFICIENTE — nenhuma das 49 questões reais examinadas cita DSS diretamente. Prioridade editorial: baixa por ausência de evidência, apesar de relevância estrutural no Dossiê Mestre. |
| **2.2 Promoção da Saúde (Carta de Ottawa)** | Baixa | EVIDÊNCIA INSUFICIENTE — nenhuma questão real examinada. |
| **2.2b Educação em Saúde** *(mesmo capítulo 2.2 do Dossiê Mestre)* | Baixa | EVIDÊNCIA INSUFICIENTE — nenhuma questão real examinada. |
| **2.3 Saúde da Família e Comunidade** | Baixa | EVIDÊNCIA INSUFICIENTE — nenhuma questão real examinada diretamente; nota-se evidência real adjacente não coberta pelo Dossiê (tópico real "Multiprofissionalidade e Trabalho em Equipe", 1 questão UFG 2022) — ver achado de cobertura acima. |
| **2.4 Planejamento Estratégico Situacional (PES)** | Baixa | EVIDÊNCIA INSUFICIENTE — nenhuma questão real examinada. |
| **2.4b Diagnóstico de Saúde da Comunidade** *(mesmo capítulo 2.4 do Dossiê Mestre)* | Baixa | EVIDÊNCIA INSUFICIENTE — nenhuma questão real examinada. |
| **3.1 PNI: Histórico e Objetivos** | Média | Evidência real indireta: Centro de Seleção UFG 2022 ("PNI tem contribuído para a redução da morbimortalidade por doenças imunopreviníveis"). Erros frequentes: EVIDÊNCIA INSUFICIENTE. Risco normativo: baixo (objetivo do programa é conceito estável). Prioridade editorial: média. |
| **3.1b Calendário Nacional de Vacinação** *(mesmo capítulo 3.1)* | **Alta** | Evidência real direta: Centro de Seleção UFG 2022 (2 questões — esquema vacinal e vacinação de gestante contra hepatite B em caso clínico com ferimento), Fundação VUNESP-equivalente FGV 2025 ("Ministério da Saúde disponibiliza ampla ca[lendário]..."), CEBRASPE 2018 (dose única × múltiplas doses conforme tipo de imunobiológico). Perfil: aplicado/caso clínico. Erros frequentes: aplicar regra geral sem checar situação especial da gestante/ferida (achado real). Integração: alta com 4.1/4.2. Risco normativo: alto — Dossiê Mestre já declara EVIDÊNCIA INSUFICIENTE quanto à composição vigente exata do calendário (Capítulo 3.1), e a evidência real confirma que bancas cobram calendário vigente na data da prova, não um calendário fixo. Prioridade editorial: alta. |
| **3.2 SI-PNI** | Baixa | EVIDÊNCIA INSUFICIENTE — nenhuma questão real nomeia o SI-PNI diretamente; nota-se tópico real adjacente "Avaliação da Cobertura Vacinal" existente na taxonomia do acervo sem questão registrada (0 questões) e sem subassunto correspondente exato no Dossiê Mestre (mapeado por proximidade conceitual ao Capítulo 3.2). Prioridade editorial: baixa. |
| **3.3 Cadeia de Frio / Rede de Frio** | Baixa | EVIDÊNCIA INSUFICIENTE — nenhuma das 49 questões reais trata de cadeia de frio como tema central. Prioridade editorial: baixa por ausência de evidência, apesar de ser pré-requisito operacional descrito no Dossiê Mestre (Capítulo 3.3). |
| **3.3b Armazenamento e Conservação de Imunobiológicos** *(mesmo capítulo 3.3)* | Baixa | EVIDÊNCIA INSUFICIENTE — nenhuma questão real examinada. |
| **3.3c Sala de Vacinação** *(mesmo capítulo 3.3)* | Média | Evidência real direta: CEBRASPE 2018 (responsabilidade da equipe de enfermagem pelas atividades da sala de vacinação, após treinamento/capacitação). Erros frequentes: EVIDÊNCIA INSUFICIENTE quanto a erro específico recorrente. Prioridade editorial: média. |
| **4.1 Vias de Administração de Vacinas** | Média | Evidência real indireta: CEBRASPE 2018 (responsabilidade da sala de vacinação pela equipe de enfermagem, já citada em 3.3). Erros frequentes: EVIDÊNCIA INSUFICIENTE quanto a erro específico de via de administração. Prioridade editorial: média. |
| **4.1b Aprazamento e Esquemas Vacinais** *(mesmo capítulo 4.1)* | Alta | Evidência real: CEBRASPE 2018 (número de doses conforme tipo de imunobiológico, já citada em 3.1b) — aprazamento depende diretamente dessa distinção. Integração: alta com 3.1b. Prioridade editorial: alta. |
| **4.2 Contraindicações e Falsas Contraindicações** | **Alta** | Evidência real direta: CEBRASPE 2018 ("temperatura acima de 38,5°C... constitui contraindicação à aplicação de dose subsequente" — item a julgar Certo/Errado). Esta é evidência real e direta de exatamente o tipo de pegadinha que o Dossiê Mestre já antecipava conceitualmente (falsa contraindicação) — **achado editorial prioritário desta parte**, ver observação abaixo da tabela. Erros frequentes: tratar febre/reação local leve como contraindicação verdadeira. Risco normativo: médio (rol de contraindicações é objeto de manual técnico atualizável). Prioridade editorial: alta. |
| **4.2b Eventos Adversos Pós-Vacinação (EAPV)** *(mesmo capítulo 4.2)* | **Alta** | Evidência real direta: CEBRASPE 2018 (reação anafilática, mecanismo de mastócitos, janela de até 2 horas). Perfil: conceitual/técnico com precisão clínica (mecanismo, tempo, sinais). Integração: com 1.6 (notificação de EAPV via sistema de vigilância). Risco normativo: baixo (fisiopatologia é conceito estável). Prioridade editorial: alta. |
| **4.3 Vacinas do Calendário Básico** | Média | Evidência real indireta, via 3.1b (calendário). EVIDÊNCIA INSUFICIENTE quanto a questão que trate especificamente de uma vacina nomeada do calendário básico isolada do contexto de esquema/aprazamento. Prioridade editorial: média. |
| **4.3b Imunobiológicos Especiais (CRIE)** *(mesmo capítulo 4.3)* | Baixa | EVIDÊNCIA INSUFICIENTE — nenhuma questão real cita CRIE diretamente. Prioridade editorial: baixa. |
| **4.4 Soros e Imunoglobulinas (Imunização Passiva)** | Média | Evidência real direta: CEBRASPE 2018 (reação anafilática a "componentes dos imunobiológicos" — mapeada também em 4.2b; tópico real do acervo "Resposta Imune Humoral e Imunoglobulinas" tem 1 questão própria, de conteúdo mais imunológico-básico que administrativo). Risco normativo: baixo. Prioridade editorial: média. |

**Observação sobre subdivisões dentro de um mesmo capítulo do Dossiê Mestre.** Onde o Dossiê Mestre agrupa 2 subassuntos reais num único capítulo (ex.: Capítulo 1.4 cobre Vigilância Epidemiológica + Notificação Compulsória + Sistemas de Informação), a tabela acima usa sufixo "b"/"c" para preservar a granularidade real dos 30 subassuntos de `03-subassuntos.json`, sem criar subassunto novo — apenas explicita, na Parte 1, o que o capítulo do Dossiê já agrega.

**Achado editorial prioritário desta parte:** a questão real CEBRASPE 2018 sobre temperatura pós-vacinal (subassunto 4.2) é evidência direta e real de que bancas testam exatamente a distinção entre contraindicação verdadeira e falsa contraindicação já antecipada no Dossiê Mestre (Capítulo 4.2) — recomenda-se priorização deste subassunto em produção futura, por ser simultaneamente de alto risco de pegadinha e de evidência real confirmada, combinação rara nesta disciplina (a maioria dos subassuntos de alta prioridade estrutural no Dossiê Mestre — Macrotema 2 inteiro — tem hoje **zero evidência real** no acervo).

---

# PARTE 2 — PERFIL DAS BANCAS

Para cada banca solicitada: evidência real observada nesta disciplina e, quando aplicável, referência cruzada aos Dossiês de Banca já congelados (`DOSSIE_FGV_V1.md`, `DOSSIE_IBFC_V1.md`) para traços gerais não específicos desta disciplina. Uma banca real adicional, sem solicitação explícita mas com evidência real relevante nesta disciplina (mesmo padrão já seguido na Inteligência Editorial de SAE), é incluída: Centro de Seleção da Universidade Federal de Goiás.

### FGV
- **Evidência real nesta disciplina:** a banca com maior volume observado — 19 questões (2014, 2022, 2024, 2025).
- **Assuntos preferidos:** fortíssima concentração em Epidemiologia Básica e Bioestatística/coeficientes (cálculo de incidência, prevalência, letalidade — 12 das 19 questões), com presença secundária em Calendário de Vacinação, Suplementação de Ferro e Saúde do Trabalhador.
- **Estilo de cobrança:** predominantemente situação hipotética com dado numérico ("no mês de junho o município X registrou 80 casos novos...") seguida de interpretação/cálculo, ou completar frase técnica direta; uma ocorrência usa julgamento de afirmativas numeradas (I, II, III) sobre medidas de tendência central.
- **Nível médio de dificuldade:** não preenchido no acervo (`difficulty` nulo em todas as 19 ocorrências) — evidência insuficiente para classificação numérica; qualitativamente, a exigência de cálculo/interpretação de dado (não memorização) sugere padrão de aplicação, não de recordação simples.
- **Predominância conceitual/prática/clínica:** aplicada/quantitativa — a FGV, nesta disciplina, testa capacidade de cálculo e interpretação epidemiológica, mais que definição memorizada.
- **Erros recorrentes explorados:** confusão incidência × prevalência, letalidade × mortalidade (ver Parte 3) — é a banca com maior volume de evidência real desse tipo específico de pegadinha.
- **Diferenças em relação às demais:** única banca, na amostra observada nesta disciplina, com múltiplas questões de cálculo epidemiológico direto (não apenas conceito).

### IBFC
- **Evidência real nesta disciplina:** 9 questões (2013, 2019, 2022).
- **Assuntos preferidos:** Saúde do Trabalhador (5 das 9 questões) e Epidemiologia/Vigilância (SINAN, vacinas, violência).
- **Estilo de cobrança:** predominância de julgamento de afirmativas compostas (I, II, III, com V/F) e comando negativo ("assinale a alternativa incorreta"), padrão já registrado de forma geral no `DOSSIE_IBFC_V1.md` e já observado na Inteligência Editorial de SAE para a mesma banca.
- **Nível médio de dificuldade:** não preenchido no acervo — evidência insuficiente.
- **Predominância conceitual/prática/clínica:** conceitual/descritiva, com uma ocorrência de alta densidade técnica (doenças ocupacionais específicas: silicose, asbestose, LER/DORT, cromagem).
- **Erros recorrentes explorados:** comando negativo como armadilha de leitura (mesmo padrão já documentado para IBFC na Inteligência Editorial de SAE — achado consistente entre disciplinas, não coincidência pontual).
- **Diferenças em relação às demais:** maior concentração relativa em Saúde do Trabalhador entre as bancas observadas nesta disciplina.

### CEBRASPE
- **Evidência real nesta disciplina:** 4 questões, todas de 2018, mesmo concurso.
- **Assuntos preferidos:** Imunização aplicada — contraindicações/falsas contraindicações, EAPV, tipos de imunobiológico (dose única × múltipla), responsabilidade da sala de vacinação.
- **Estilo de cobrança:** item julgável isolado (Certo/Errado), formato institucionalmente conhecido da banca — mesmo padrão já documentado na Inteligência Editorial de SAE para a mesma banca, confirmado agora em uma segunda disciplina.
- **Nível médio de dificuldade:** não preenchido no acervo — evidência insuficiente.
- **Predominância conceitual/prática/clínica:** técnico-conceitual de alta precisão (mecanismo fisiopatológico, janela de tempo, distinção contraindicação verdadeira × falsa).
- **Erros recorrentes explorados:** afirmação plausível mas tecnicamente incorreta por generalização indevida (febre = contraindicação) — mesmo padrão de pegadinha por inversão já observado no CEBRASPE na disciplina de SAE (afirmar isolamento entre NANDA/NIC/NOC).
- **Diferenças em relação às demais:** único formato Certo/Errado entre as bancas com evidência real nesta disciplina; único cluster temático 100% concentrado em imunização entre as bancas observadas aqui.

### Instituto AOCP
- **Evidência real nesta disciplina:** 4 questões, todas de 2020.
- **Assuntos preferidos:** Epidemiologia aplicada a dado real de município (série histórica de mortalidade, rastreamento em pessoas assintomáticas, pandemia de influenza 2009).
- **Estilo de cobrança:** situação com dado real/hipotético seguida de pergunta objetiva direta, sem julgamento de afirmativas compostas nas ocorrências observadas.
- **Nível médio de dificuldade:** não preenchido no acervo — evidência insuficiente.
- **Predominância conceitual/prática/clínica:** aplicada/interpretativa.
- **Erros recorrentes explorados:** EVIDÊNCIA INSUFICIENTE quanto a padrão de erro específico recorrente (amostra pequena, sem repetição de estrutura observável).
- **Diferenças em relação às demais:** é a única, na amostra observada nesta disciplina, com questão sobre rastreamento em população assintomática (prevenção secundária) como tema central.

### Instituto Consulplan
- **Evidência real nesta disciplina:** 4 questões, todas de 2023.
- **Assuntos preferidos:** Sistemas de Informação em Saúde (SIM, SINAN — 2 das 4 questões) e Epidemiologia básica.
- **Estilo de cobrança:** afirmação técnica seguida de comando "assinale a INCORRETA" (maiúsculas no enunciado real) ou pergunta direta de responsabilidade/titularidade.
- **Nível médio de dificuldade:** não preenchido no acervo — evidência insuficiente.
- **Predominância conceitual/prática/clínica:** normativo-operacional (regras de funcionamento de sistema de informação, responsabilidade de emissão de documento).
- **Erros recorrentes explorados:** afirmar que o SINAN é "alimentado unicamente por casos confirmados", quando a regra real inclui também notificação de suspeitos/negativa — pegadinha real, direta (ver Parte 3).
- **Diferenças em relação às demais:** única banca, na amostra observada, cujas questões giram em torno de regras operacionais de sistema de informação (quem alimenta, quem é responsável, o que ocorre em caso de não alimentação) em vez de conteúdo clínico/epidemiológico.

### Fundação VUNESP
- **Evidência real nesta disciplina:** 1 questão (2023).
- **Assuntos preferidos:** Saúde do Trabalhador, especificamente equiparação de doença infecciosa adquirida em serviço a acidente de trabalho.
- **Estilo de cobrança:** caso concreto nomeado (paciente identificado por iniciais, função, contexto de terceirização) seguido de exigência de qualificação jurídico-trabalhista da situação.
- **Nível médio de dificuldade:** evidência insuficiente (n=1, `difficulty` nulo); qualitativamente, exige articulação entre conhecimento clínico (febre maculosa) e conceito jurídico-trabalhista (acidente equiparado × doença profissional) — indício de dificuldade mais alta que item puramente conceitual, não confirmável com uma única observação.
- **Predominância conceitual/prática/clínica:** aplicada, com componente jurídico-trabalhista incomum entre as demais bancas observadas nesta disciplina.
- **Erros recorrentes explorados:** confundir acidente de trabalho equiparado (doença adquirida no exercício da função) com doença profissional/ocupacional típica — distinção técnica-jurídica real, observada nesta única questão.
- **Diferenças em relação às demais:** única banca, na amostra observada, a exigir qualificação jurídico-trabalhista formal (CAT, doença × acidente equiparado) em vez de conteúdo epidemiológico/clínico puro.

### Centro de Seleção da Universidade Federal de Goiás
- **Evidência real nesta disciplina:** 8 questões (2022) — banca adicional, sem solicitação explícita nesta fase, incluída por evidência real relevante (mesmo critério já usado na Inteligência Editorial de SAE).
- **Assuntos preferidos:** Calendário de Vacinação (3 questões, incluindo 2 casos clínicos), Saúde do Trabalhador (Covid-19 ocupacional), e temas sem subassunto correspondente no Dossiê Mestre (Regulação do Acesso, Multiprofissionalidade, Integração Ensino-Serviço — ver achado de cobertura no início da Parte 1).
- **Estilo de cobrança:** mistura de caso clínico nomeado (paciente com iniciais, idade, situação) e pergunta técnico-normativa direta (citação de portaria).
- **Nível médio de dificuldade:** não preenchido no acervo — evidência insuficiente.
- **Predominância conceitual/prática/clínica:** mista — é a única banca observada, nesta disciplina, com evidência real tanto em conteúdo clínico-vacinal quanto em temas de gestão/organização do trabalho em saúde (regulação, multiprofissionalidade, ensino-serviço).
- **Erros recorrentes explorados:** EVIDÊNCIA INSUFICIENTE quanto a padrão específico recorrente.
- **Diferenças em relação às demais:** é a única banca, na amostra observada, com evidência real nos 5 tópicos sem subassunto correspondente no Dossiê Mestre — sinal de que a lacuna de cobertura identificada nesta fase é concentrada nesta banca especificamente.

### IDECAN, FUNDEP, AVÁLIA, FAFIPA
**Evidência insuficiente — declaração explícita.** Nenhuma questão desta disciplina está registrada no acervo real do SimulaPro para nenhuma destas quatro bancas. Mesmo achado já registrado na Inteligência Editorial de SAE quanto à ausência de registro de "FUNDEP" e "AVÁLIA" como bancas cadastradas sob esses nomes exatos, e quanto à ausência total de IDECAN e Fundação FAFIPA em qualquer disciplina do acervo. **Nenhuma característica de estilo é atribuída a estas quatro bancas nesta disciplina.**

---

# PARTE 3 — PEGADINHAS

### Conceitos frequentemente confundidos
- **Incidência × Prevalência** — evidência real direta e repetida (FGV 2022, 2 ocorrências quase idênticas: dois municípios com número de casos novos/antigos diferentes, testando se o candidato calcula incidência (casos novos/população em risco) sem confundir com prevalência (casos totais no momento)).
- **Letalidade × Mortalidade** — evidência real direta (FGV 2022, questão sobre Painel Covid-19 Amazonas: candidato deve distinguir "3,4 morreram a cada 100 que adoeceram" — letalidade — de "451 morreram a cada 100 mil habitantes" — mortalidade — usando os mesmos dados brutos).
- **Doença do trabalho × Doença profissional × Acidente de trabalho equiparado** — evidência real direta (Fundação VUNESP 2023, febre maculosa: gabarito real classifica como acidente de trabalho equiparado, não doença profissional/ocupacional típica, distinção técnico-jurídica fina).
- **Contraindicação verdadeira × Falsa contraindicação vacinal** — evidência real direta (CEBRASPE 2018: febre acima de 38,5°C após dose anterior, item a julgar — tema clássico de falsa contraindicação já antecipado conceitualmente no Dossiê Mestre, Capítulo 4.2).
- **Alimentação do SINAN por casos confirmados × também suspeitos/notificação negativa** — evidência real direta (Instituto Consulplan 2023: alternativa gabaritada como incorreta afirma que o SINAN é alimentado "unicamente" por casos confirmados da lista nacional).
- **Vacina de agente inativado (múltiplas doses) × agente atenuado (dose única, em regra)** — evidência real direta (CEBRASPE 2018).

### Inversões e trocas
- Lista de Notificação Compulsória em Unidades Sentinelas (LNCS) × Lista Nacional de Notificação Compulsória geral — evidência real (FGV 2014: pede a exceção dentro da lista de unidades sentinela, exigindo que o candidato não confunda com a lista geral, mais ampla).
- Responsabilidade pela emissão de declaração de óbito (exclusiva do Ministério da Saúde, segundo o gabarito real observado) × presunção de responsabilidade compartilhada ou municipal/estadual — evidência real direta (Instituto Consulplan 2023, 4 das 5 alternativas descrevem combinações de responsabilidade compartilhada, todas incorretas segundo o gabarito real).

### Terminologias semelhantes
- **"Vigilância epidemiológica"** × **"vigilância em saúde"** (termo mais amplo, que inclui epidemiológica, sanitária, ambiental e do trabalhador — Dossiê Mestre, Capítulo 1.5) — ambiguidade de escopo já registrada no Dossiê Mestre.
- **"Doença do trabalho"** × **"doença profissional"** — mesma raiz temática do achado real de VUNESP (acima), mas como confusão terminológica geral, não só no caso específico observado.
- **"Imunização ativa" (vacina)** × **"imunização passiva" (soro/imunoglobulina)** — proximidade lexical e mecanismo confundível, já registrada no Dossiê Mestre (Capítulo 4.4); evidência real do acervo (CEBRASPE 2018, reação a "componentes dos imunobiológicos") não distingue nominalmente os dois no enunciado, o que reforça o risco de o candidato confundir os mecanismos.

### Erros clássicos de interpretação
- Ler "assinale a alternativa incorreta"/"assinale a afirmativa INCORRETA" como se fosse pedido da alternativa correta — padrão real observado em IBFC e Instituto Consulplan nesta disciplina (mesmo tipo de armadilha já documentado para IBFC na Inteligência Editorial de SAE).
- Presumir que um dado epidemiológico (ex.: percentual, coeficiente) já apresentado no enunciado pode ser lido diretamente como resposta, sem aplicar a fórmula/definição correta ao dado (achado real recorrente em FGV, ver Parte 1, subassunto 1.2).

### Alternativas incorretas frequentemente utilizadas pelas bancas (padrões observados)
- Trocar o numerador/denominador ou a base de cálculo (por 100, por mil, por 100 mil) de um coeficiente dentro de uma alternativa plausível (padrão real observado em FGV).
- Atribuir uma regra de "unicamente"/"exclusivamente" a um processo que, na realidade normativa, é mais amplo ou compartilhado (padrão real observado em Instituto Consulplan, 2 ocorrências distintas: SINAN e declaração de óbito).
- Descrever uma situação clínica/ocupacional real usando a categoria jurídica vizinha, porém tecnicamente errada (padrão real observado em Fundação VUNESP).

---

# PARTE 4 — MATRIZ DE COBERTURA

Prioridade e peso relativo derivados diretamente da classificação de incidência da Parte 1, agregada por macrotema. Quantidade inicial sugerida segue o mesmo padrão de lote já validado operacionalmente neste projeto (lotes de 10 questões).

| Macrotema | Subassuntos de maior prioridade | Prioridade | Qtd. inicial sugerida | Peso relativo |
|---|---|---|---|---|
| 1. Epidemiologia e Vigilância em Saúde | 1.2 (Coeficientes), 1.6 (Vigilância Epidemiológica), 1.9 (Saúde do Trabalhador) | **Muito Alta** | 12 | 30% |
| 1. Epidemiologia e Vigilância em Saúde | 1.1, 1.6b, 1.6c (Indicadores, Notificação, Sistemas de Informação) | Alta | 8 | 20% |
| 1. Epidemiologia e Vigilância em Saúde | 1.3, 1.5 (Transição, Níveis de Prevenção) | Média | 3 | 7,5% |
| 1. Epidemiologia e Vigilância em Saúde | 1.4, 1.7, 1.8 (Cadeia Epidemiológica, Vig. Sanitária, Vig. Ambiental) | Baixa | 2 | 5% |
| 3. PNI: Estrutura e Logística | 3.1b (Calendário Nacional de Vacinação) | Alta | 5 | 12,5% |
| 4. Administração de Imunobiológicos | 4.2, 4.2b (Contraindicações/Falsas Contraindicações, EAPV) | Alta | 5 | 12,5% |
| 3./4. (demais) | 3.1, 3.2, 3.3, 4.1, 4.1b, 4.3, 4.3b, 4.4 | Média/Baixa | 3 | 7,5% |
| 2. Determinantes, Promoção e Planejamento | todos os 6 subassuntos (2.1-2.6) | Baixa (sem evidência real) | 2 | 5% |
| **Total** | | | **40** | **100%** |

Nota: a soma (40) não é um lote único — é a base de cobertura completa recomendada para a disciplina ao longo de múltiplos ciclos do Motor Editorial, não uma meta de um único batch. O Macrotema 2 inteiro recebe a menor alocação apesar de ocupar 20% da estrutura real da disciplina (6 de 30 subassuntos), por ter **zero evidência real** no acervo — decisão consistente com a regra geral do Motor Editorial de nunca inferir frequência sem evidência.

---

# PARTE 5 — RELAÇÕES ENTRE ASSUNTOS

Cadeia estrutural principal (mesma lógica do Dossiê Mestre, mapeada para uso editorial):

```
Indicadores e Coeficientes (1.1, 1.2)
        ↓
Cadeia Epidemiológica e Níveis de Prevenção (1.3, 1.4, 1.5)
        ↓
Vigilância Epidemiológica + Notificação Compulsória + Sistemas de Informação (1.6, 1.6b, 1.6c)
        ↓
Vigilância Sanitária / Ambiental / do Trabalhador (1.7, 1.8, 1.9)
        ↓
Determinantes Sociais → Promoção da Saúde → Educação em Saúde (2.1, 2.2, 2.3)
        ↓
Saúde da Família e Comunidade (2.4)
        ↓
Planejamento em Saúde → Diagnóstico Comunitário (2.5, 2.6)

PNI: Histórico/Objetivos → Calendário Nacional (3.1, 3.1b) → SI-PNI (3.2)
        ↓
Rede de Frio / Sala de Vacinação (3.3)
        ↓
Vias de Administração / Aprazamento (4.1, 4.1b)
        ↓
Contraindicações / Falsas Contraindicações / EAPV (4.2, 4.2b)
        ↓
Calendário Básico / CRIE (4.3, 4.3b)  ·  Soros e Imunoglobulinas (4.4)
```

**Subassuntos que costumam aparecer juntos na mesma questão (evidência real observada):**
- **Coeficientes epidemiológicos + dado numérico de cenário hipotético/real**, quase sempre juntos — padrão observado em praticamente toda a evidência real da FGV nesta disciplina (Parte 2).
- **Notificação Compulsória + Sistemas de Informação (SINAN/SIM)**, tratados como um bloco único, não isoladamente — padrão observado em Instituto Consulplan, IBFC e FGV.
- **Calendário de Vacinação + caso clínico com situação especial** (gestante, ferimento) — padrão observado em Centro de Seleção UFG.
- **Contraindicação vacinal + evento adverso pós-vacinação**, tratados como bloco temático único (imunização aplicada) — padrão observado em CEBRASPE.

**Relações mapeadas por dedução estrutural do Dossiê Mestre, sem evidência direta ainda no acervo** (registradas para uso futuro, não para tratamento como padrão confirmado):
- Determinantes Sociais + Transição Epidemiológica (2.1 + 1.3) — ambos ausentes de evidência real direta, relação apenas estrutural.
- Planejamento em Saúde + Indicadores (2.5 + 1.1) — diagnóstico comunitário usa indicadores como insumo, sem evidência real de questão que integre os dois.
- Saúde da Família e Comunidade + os 5 tópicos reais sem subassunto correspondente (Regulação do Acesso, Multiprofissionalidade, Integração Ensino-Serviço) — relação plausível por proximidade temática de gestão do cuidado, não confirmada.

**Relações com outras disciplinas (interfaces mapeadas, sem sobreposição de conteúdo — ver também "Fronteira de duplicidade" no Dossiê Mestre):**
- **Legislação do SUS:** Lei nº 8.080/1990 citada por remissão em 1.6/1.9; nenhuma questão real observada nesta disciplina testa a lei diretamente, apenas sua aplicação em vigilância — risco de sobreposição controlado.
- **Enfermagem Médico-Cirúrgica:** nenhuma interface direta identificada na evidência real examinada; fronteira estrutural (clínica individual × saúde coletiva) já suficiente para evitar sobreposição.
- **Doenças Transmissíveis:** interface conceitual real (achado do Dossiê Mestre: "frequentemente absorvida por Saúde Coletiva como vigilância epidemiológica das doenças transmissíveis") permanece sem evidência real de questão que efetivamente misture as duas nesta amostra — risco monitorado, não confirmado.
- **Biossegurança:** nenhuma interface real identificada na evidência examinada (Vigilância em Saúde do Trabalhador, subassunto 1.9, é sobre agravos na população trabalhadora em geral, não sobre EPI/proteção individual do profissional de enfermagem, escopo de Biossegurança).
- **Segurança do Paciente:** nenhuma interface real identificada na evidência examinada.
- **Processo de Enfermagem:** nenhuma interface real identificada na evidência examinada nesta disciplina; nenhuma das 49 questões cita SAE, diagnóstico de enfermagem ou taxonomia NANDA/NIC/NOC.

---

# PARTE 6 — CHECKLIST EDITORIAL

Checklist a ser aplicado antes da aprovação definitiva (homologação humana) de qualquer questão produzida para esta disciplina. Não substitui o Validator nem o Auditor Editorial já existentes no Motor Editorial — é um checklist de conteúdo específico da disciplina, complementar aos critérios mecânicos e editoriais já em produção.

1. **Precisão de cálculo epidemiológico** — se a questão envolve coeficiente/taxa (incidência, prevalência, letalidade, mortalidade), a fórmula e a base de cálculo (por 100, mil, cem mil) estão corretas e claramente identificadas no enunciado, evitando a ambiguidade que a Parte 3 documenta como pegadinha real recorrente?
2. **Atualidade de dado sujeito a atualização periódica** — se a questão cita calendário vacinal, lista de notificação compulsória ou rol de contraindicações, a versão usada foi confirmada em fonte oficial vigente no momento da produção, e não citada de memória (Dossiê Mestre já sinaliza EVIDÊNCIA INSUFICIENTE nesses pontos especificamente por este motivo)?
3. **Coerência técnica** — a questão respeita a distinção entre conceitos frequentemente confundidos já catalogados na Parte 3 (incidência × prevalência, letalidade × mortalidade, doença do trabalho × doença profissional, contraindicação verdadeira × falsa)?
4. **Aderência às referências oficiais** — toda afirmação normativa citada (lei, decreto, portaria) corresponde exatamente ao que consta no Dossiê Mestre ou foi verificada diretamente na fonte primária quando não coberta pelo Dossiê Mestre?
5. **Existência de apenas uma alternativa correta** — todas as demais alternativas são objetivamente incorretas, sem ambiguidade nem sobreposição parcial de correção?
6. **Compatibilidade com o perfil da banca-alvo** — o formato (A-E, Certo/Errado, julgamento de afirmativas, caso concreto nomeado) e o estilo (cálculo/interpretativo × normativo-operacional × jurídico-trabalhista) são compatíveis com o perfil real da banca descrito na Parte 2? Se a banca não tem perfil suficiente estabelecido (IDECAN, FUNDEP, AVÁLIA, FAFIPA), isso foi levado em conta com maior cautela editorial?
7. **Clareza textual** — o enunciado é compreensível numa única leitura, sem duplo sentido não intencional?
8. **Ausência de ambiguidades terminológicas** — nenhum termo técnico (ex.: "vigilância", "imunização", "notificação") é usado de forma que possa ser lido em mais de um sentido válido dentro da disciplina (ver Parte 3, terminologias semelhantes)?
9. **Nível de dificuldade adequado** — o nível declarado (Fácil/Média/Difícil) corresponde de fato à exigência cognitiva real da questão (recordação × cálculo/aplicação × julgamento composto)?
10. **Verificação de pegadinha intencional vs. erro editorial não intencional** — se a questão usa uma inversão, comando negativo ou confusão terminológica proposital (Parte 3), isso está claramente sustentado por uma diferença técnica real — não por ambiguidade genuína do próprio enunciado?

---

## Encerramento desta fase

Este documento cobre as 6 partes do padrão homologado, fundamentadas em 49 questões reais do acervo do SimulaPro (100% do conjunto real, não amostra), com declaração explícita de evidência insuficiente para 4 das 10 bancas solicitadas e para todo o Macrotema 2 do Dossiê Mestre (Determinantes, Promoção e Planejamento em Saúde). O achado sobre 5 tópicos reais do acervo sem subassunto correspondente no Dossiê Mestre, e o achado sobre a distinção contraindicação verdadeira × falsa contraindicação (subassunto 4.2, evidência real direta) são os pontos de atenção prioritários para qualquer produção editorial futura desta disciplina. Nenhuma questão, Auditoria Normativa, Plano de Produção ou alteração de taxonomia foi produzida. Nenhum documento metodológico anterior foi alterado.
