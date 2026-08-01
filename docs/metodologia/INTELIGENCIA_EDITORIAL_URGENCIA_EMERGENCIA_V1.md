# DOSSIÊ MESTRE — URGÊNCIA E EMERGÊNCIA — INTELIGÊNCIA EDITORIAL V1

## Objetivo

Este documento **complementa** — e não substitui, reescreve ou resume — o `DOSSIE_MESTRE_URGENCIA_EMERGENCIA_V1.md`. Seu único consumidor pretendido é o Motor Editorial: incidência por subassunto, perfil de banca, pegadinhas conhecidas, matriz de cobertura, relações entre assuntos e checklist de aprovação. Nenhuma questão, alternativa ou simulado é produzido aqui. Estrutura idêntica à já homologada em SAE, UTI e Saúde Coletiva — 6 partes, nenhuma removida, nenhuma acrescentada.

## Nota metodológica desta pesquisa

Toda a Parte 1 e a Parte 2 foram construídas a partir de **dados reais do banco de produção do SimulaPro** (tabela `questions`, disciplina "Urgência e Emergência" — **66 linhas reais** examinadas diretamente, enunciado, alternativas e gabarito completos, com paginação `.range()` para garantir leitura de 100% do conjunto). Granularidade da Parte 1 no nível de capítulo/subassunto do Dossiê Mestre (26 unidades), mesma decisão já registrada e justificada na Inteligência Editorial de Saúde Coletiva.

## ACHADO EDITORIAL — 4 pares de questões reais duplicadas no acervo (66 → 62 únicas)

Verificação sistemática (comparação de enunciado exato, não amostral) encontrou **4 pares de questões com enunciado, alternativas e gabarito 100% idênticos**, todas IBFC 2023:

| Par de IDs | Subassunto | Enunciado (início) |
|---|---|---|
| `4c643964` / `1de3f951` | Escala de Coma de Glasgow (5.2) | "Através da escala de coma de Glasgow é possível mensurar..." |
| `9748e81c` / `1aa29338` | Atendimento Inicial ao Politraumatizado (5.1) | "Carlos Eduardo, obeso, 39 anos, foi atropelado..." |
| `027ddecf` / `8536a626` | Parada Cardiorrespiratória e RCP (3.3) | "Sobre compressões torácicas eficientes..." |
| `40754dfa` / `19d9a73b` | Emergências Respiratórias (4.9) | "Assinale a alternativa que não apresenta sinais e sintomas de pneumotórax hipertensivo." |

**Total real único da disciplina: 62 questões, não 66.** Isso não é corrigido nesta fase (excluir/mesclar linhas é alteração de banco, fora do escopo desta fase, que é somente documental) — registrado como **ACHADO EDITORIAL**, com recomendação de deduplicação em fase técnica futura. Todos os cálculos de incidência abaixo usam o denominador real de 66 linhas (não ajustado), com a ressalva explícita de que os subassuntos 3.3, 4.9 e 5.1 têm 1 questão real a menos do que a contagem bruta sugere.

## ACHADO EDITORIAL — divergência entre o prior qualitativo de bancas e a evidência real

`docs/editorial/07-frequencia-cobranca-consolidada.md` (documento pré-existente, rotulado como "priors editoriais... recalibrar com dados reais") classificava CEBRASPE como **MA (Muito Alta)** para esta disciplina, com nota explícita de que a coluna já refletia o perfil de bancas de Forças Armadas. **A evidência real do acervo não confirma isso: CEBRASPE tem 0 questões reais nesta disciplina.** As bancas com evidência real são, em ordem de volume: FGV (30), IBFC (25), Instituto AOCP (7), UFPR/NC (2), Instituto Consulplan (1), Fundação VUNESP (1). O prior qualitativo permanece registrado no documento de origem (não alterado), mas **não deve ser tratado como confirmado** — é substituído, para fins de produção, pela classificação real desta Parte 2.

---

# PARTE 1 — INCIDÊNCIA EM CONCURSOS (POR SUBASSUNTO)

| Subassunto (Dossiê Mestre) | Classificação | Justificativa |
|---|---|---|
| **1.1 Conceitos Fundamentais e Organização da Rede** | Alta | Evidência real: 6 questões (tópico agregado "Fundamentos da Urgência e Emergência" — IBFC 2019/2022, Instituto Consulplan 2023, UFPR/NC 2022). Perfil: conceitual/normativo (Portaria 1.600/2011, Portaria 2.048/2002 citadas literalmente — achado real, UFPR/NC 2022, gabarito testa exatamente a redação da Portaria 2.048/2002). Risco normativo: alto (verificação de vigência pendente na Auditoria). Prioridade editorial: alta. |
| **2.1 Protocolo de Manchester** | Baixa | EVIDÊNCIA INSUFICIENTE — nenhuma das 66 questões reais cita "Manchester" nominalmente; 1 questão real (IBFC 2022) testa a escala de cores do Ministério da Saúde sem nomear o protocolo. Prioridade editorial: baixa por ausência de evidência direta ao protocolo específico, apesar de relevância estrutural. |
| **2.1b Classificação de Risco por Cores (Ministério da Saúde)** *(mesmo capítulo 2.1 do Dossiê Mestre)* | Média | Evidência real direta: IBFC 2022 (41296054) testa a associação cor→prioridade, com pegadinha real confirmada (ver Parte 3). Prioridade editorial: média. |
| **2.2 Acolhimento com Classificação de Risco (ACCR) e RUE** | Média | Evidência real direta: Instituto Consulplan 2023 (componentes da RUE, questão de exceção). Perfil: normativo. Risco normativo: alto (Portaria 1.600/2011 e 2.395/2011, verificação pendente). Prioridade editorial: média. |
| **2.3 SAMU 192 e Atendimento Pré-Hospitalar** | Média | Evidência real direta: FGV 2014 (Unidades Móveis de Urgência, composição de equipe USB/USA/Aeromédico). Prioridade editorial: média — único subassunto com evidência restrita a um único ano/banca. |
| **2.4 UPA 24h** | Baixa | EVIDÊNCIA INSUFICIENTE — nenhuma questão real específica sobre UPA como estrutura isolada encontrada nas 66 examinadas. Prioridade editorial: baixa. |
| **3.1 Suporte Básico de Vida (SBV)** | Alta | Evidência real: integrada majoritariamente ao subassunto 3.3 (PCR/RCP), onde SBV é testado em conjunto — nenhuma questão isola SBV puro nesta amostra. Prioridade editorial: alta por relevância estrutural e proximidade de evidência com 3.3. |
| **3.2 Suporte Avançado de Vida (SAV/ACLS)** | Alta | Evidência real direta: FGV 2025 (fdf8378c, diretrizes AHA 2020, SBV+SAVC combinados). Prioridade editorial: alta. |
| **3.3 Parada Cardiorrespiratória e RCP** | **Muito Alta** | Evidência real robusta: 12 questões brutas (11 únicas após ajuste do achado de duplicidade) — IBFC (3), FGV (4), Instituto AOCP (2), Fundação VUNESP (1), IBFC 2013 (1). Maior volume real do Macrotema 3. Perfil: misto conceitual/caso clínico. Risco normativo: nenhum (diretrizes técnicas, não lei). Prioridade editorial: muito alta. |
| **3.4 Manejo de Via Aérea de Emergência** | Baixa | EVIDÊNCIA INSUFICIENTE — nenhuma questão real isola este subassunto; via aérea aparece embutida em 5.1 (ABCDE) e 4.9 (emergências respiratórias). Prioridade editorial: baixa por ausência de evidência direta isolada. |
| **3.5 Desfibrilação e Cardioversão** | Alta | Evidência real direta: FGV 2024 (0159bec2, ritmo chocável), Instituto AOCP 2021 (cf19dd10, tempo ideal de choque), Fundação VUNESP 2023 (2e6f1e0e, sequência de desfibrilação em caso clínico). Prioridade editorial: alta. |
| **4.1 Emergências Cardiovasculares** | **Muito Alta** | Evidência real robusta: 9 questões (tópico agregado) — FGV (5), IBFC 2013 (2), FGV 2025 (1 caso clínico de dor torácica). Prioridade editorial: muito alta — segundo maior volume do Macrotema 4. |
| **4.2 AVC Agudo / Código AVC** | Alta | Evidência real direta: FGV 2023 (2), FGV 2024 (1), IBFC 2022 (1) — 3 a 4 questões reais, todas testando contraindicações de trombólise com precisão numérica (dias/horas/valores pressóricos). Prioridade editorial: alta; risco de erro alto (ver Parte 3). |
| **4.3 Sepse e Choque Séptico** | Média | Evidência real direta: FGV 2023 (9ff508bc, alíquotas de fluido). Prioridade editorial: média. |
| **4.4 Emergências Neurológicas: Estado de Mal Epiléptico e Crise Convulsiva** | Baixa | Evidência real direta, porém mínima: UFPR/NC 2022 (5d5dcd2a, cuidado durante a crise). Prioridade editorial: baixa por volume, mas com achado de pegadinha real de alto valor (ver Parte 3). |
| **4.5 Emergências Hipertensivas** | Média | Evidência real direta: IBFC 2013 (e193da20, situações que caracterizam emergência hipertensiva). Prioridade editorial: média. |
| **4.6 Emergências Metabólicas** | Média | Evidência real direta: Instituto AOCP 2021 (65a063df, respiração de Kussmaul na cetoacidose). Prioridade editorial: média. |
| **4.7 Anafilaxia** | Baixa | EVIDÊNCIA INSUFICIENTE — nenhuma questão real desta disciplina especificamente sobre anafilaxia nas 66 examinadas (evidência real equivalente já existe no Dossiê de Saúde Coletiva, subassunto 4.2b, não duplicada aqui). Prioridade editorial: baixa. |
| **4.8 Intoxicações Exógenas** | Média | Evidência real direta: IBFC 2019 (60905c4b, epidemiologia de intoxicações), IBFC 2013 (d58f81df, acidente com água-viva), IBFC 2022 (04abba75, intoxicação por substância). Prioridade editorial: média. |
| **4.9 Emergências Respiratórias** *(achado editorial do Dossiê Mestre)* | Alta | Evidência real: 7 questões brutas (6 únicas após ajuste do achado de duplicidade) — Instituto AOCP 2021 (4), IBFC 2023 (2), FGV 2024 (1). Prioridade editorial: alta — volume real relevante, confirma a decisão do Dossiê Mestre de criar este capítulo apesar de não haver subassunto normalizado prévio. |
| **4.10 Distúrbios Hidroeletrolíticos e Ácido-Básicos** *(achado editorial do Dossiê Mestre)* | **Muito Alta** | Evidência real: 10 questões — FGV (8), IBFC 2023 (2). **Maior volume real de subassunto sem correspondência normalizada prévia em toda a disciplina** — confirma fortemente a decisão do Dossiê Mestre de criar este capítulo. Prioridade editorial: muito alta. |
| **5.1 Atendimento Inicial ao Politraumatizado (ABCDE)** | **Muito Alta** | Evidência real robusta: 13 questões brutas (12 únicas após ajuste do achado de duplicidade) — IBFC (7), FGV (2), Instituto AOCP (1). **Maior volume real de toda a disciplina.** Prioridade editorial: muito alta. |
| **5.2 Escala de Coma de Glasgow** | **Muito Alta** | Evidência real robusta, com forte recorrência: FGV 2014, FGV 2024, IBFC 2023 (2 questões, acervo duplicado — ver achado). Prioridade editorial: muito alta; risco de erro alto (ver Parte 3). |
| **5.3 Choque: Classificação** | Alta | Evidência real direta: FGV 2023 (65407b9a, mecanismos e fisiopatologia do choque, julgamento de afirmativas). Prioridade editorial: alta. |
| **5.4 Queimaduras** | Média | Evidência real direta: Instituto AOCP 2020 (fa28b5ad, cálculo pela Regra dos Nove). Prioridade editorial: média — único subassunto com evidência de cálculo isolado nesta disciplina. |
| **5.5 Afogamento** | Baixa | EVIDÊNCIA INSUFICIENTE — nenhuma questão real sobre afogamento encontrada nas 66 examinadas. Prioridade editorial: baixa. |
| **5.6 Trauma Raquimedular e Imobilização** | Baixa | EVIDÊNCIA INSUFICIENTE — nenhuma questão real isola este subassunto (aparece embutido em 5.1). Prioridade editorial: baixa. |

**Achado editorial prioritário desta parte:** os 3 subassuntos de maior volume real absoluto da disciplina são exatamente os 2 capítulos criados por achado editorial no Dossiê Mestre (4.10 Distúrbios Hidroeletrolíticos, com 10 questões) mais 5.1 (Atendimento ao Politraumatizado, 12-13) e 3.3 (PCR/RCP, 11-12) — ou seja, **o maior subassunto sem taxonomia normalizada prévia (4.10) tem mais evidência real do que a maioria dos subassuntos já normalizados**, reforçando que a criação desse capítulo no Dossiê Mestre foi tecnicamente necessária, não apenas uma hipótese.

---

# PARTE 2 — PERFIL DAS BANCAS

Para cada banca com evidência real: estilo observado diretamente. Bancas sem evidência real: declaração explícita, sem inferência.

### FGV
- **Evidência real nesta disciplina:** a banca com maior volume — 30 questões (2014, 2022, 2023, 2024, 2025).
- **Assuntos preferidos:** Distúrbios Hidroeletrolíticos e Ácido-Básicos (8 questões, maior concentração real de qualquer banca em qualquer subassunto desta disciplina), Parada Cardiorrespiratória/RCP (5), Emergências Cardiovasculares (5), AVC (3-4).
- **Estilo de cobrança:** predominância de comando direto ("assinale a opção que indica...") em formato de 4 ou 5 alternativas (achado real: várias questões FGV 2024 têm apenas 4 alternativas, não 5 — ver `0159bec2`, `a095392f`, `cbf159ba`, `17b9e8de`, `9ff508bc`); julgamento de afirmativas numeradas (I, II, III) também recorrente (`da0f7b5e`, `fdf8378c`, `65407b9a`); relação de itens numerados com efeitos/definições (`7ec62072`, `f40ea08c`).
- **Nível médio de dificuldade:** não preenchido no acervo (`difficulty` nulo em todas as ocorrências) — evidência insuficiente para classificação numérica; qualitativamente, exigência de precisão numérica (tempos, doses, prazos de contraindicação) é o padrão mais recorrente, sugerindo dificuldade média-alta.
- **Predominância conceitual/prática/clínica:** mista — casos clínicos com dado numérico a interpretar (dor torácica, ECG) convivem com cobrança direta de diretriz técnica (AHA, protocolo do MS para AVC).
- **Erros recorrentes explorados:** precisão de prazo/contraindicação (AVC), distinção sincronizado × não sincronizado implícita em ritmo chocável, cálculo ácido-básico.
- **Diferenças em relação às demais:** única banca observada citando ano específico de diretriz técnica ("diretrizes da AHA publicadas em 2020", `fdf8378c`) e protocolo nomeado do Ministério da Saúde para AVC (`cbf159ba`) — nível de atualização normativa mais fino que as demais bancas nesta disciplina.

### IBFC
- **Evidência real nesta disciplina:** 25 questões (2013, 2019, 2022, 2023) — inclui 4 das 8 linhas do achado de duplicidade (todas IBFC 2023).
- **Assuntos preferidos:** Atendimento ao Politraumatizado (7, incluindo o caso clínico multi-questão "P.L.S." de 2019), Emergências Cardiovasculares (2), Intoxicações Exógenas (2).
- **Estilo de cobrança:** caso clínico extenso com múltiplas questões derivadas do mesmo paciente (achado real: cluster "P.L.S." de 2019, 3 questões diferentes sobre o mesmo caso — via aérea/choque, distúrbio ácido-básico, Glasgow); comando negativo ("assinale a alternativa incorreta/não é...") recorrente (`8e60144b`, `4c643964`, `40754dfa`); julgamento de afirmativas com V/F (`027ddecf`).
- **Nível médio de dificuldade:** não preenchido — evidência insuficiente.
- **Predominância conceitual/prática/clínica:** mista, com forte componente de caso clínico complexo (2019) e questões conceituais diretas (2022/2023).
- **Erros recorrentes explorados:** comando negativo como armadilha de leitura (mesmo padrão já documentado para IBFC nas Inteligências Editoriais de SAE e Saúde Coletiva — achado consistente entre 3 disciplinas, não coincidência pontual).
- **Diferenças em relação às demais:** única banca observada com caso clínico multi-questão (mesmo paciente gerando 3+ itens distintos) nesta disciplina.

### Instituto AOCP
- **Evidência real nesta disciplina:** 7 questões (2020, 2021).
- **Assuntos preferidos:** Emergências Respiratórias (4 das 7 questões), Parada Cardiorrespiratória/RCP (2), Queimaduras (1).
- **Estilo de cobrança:** pergunta direta objetiva, sem julgamento de afirmativas compostas nas ocorrências observadas; uso de mnemônicos técnicos como eixo da questão (`9f6fce99`, "5H e 5T").
- **Nível médio de dificuldade:** não preenchido — evidência insuficiente.
- **Predominância conceitual/prática/clínica:** conceitual-técnica, com precisão terminológica (nomes de padrões respiratórios, posicionamento).
- **Erros recorrentes explorados:** inserir um item plausível, mas não pertencente ao mnemônico oficial (hipoglicemia no lugar de hipotermia/hidrogênio, no mnemônico de causas reversíveis de PCR).
- **Diferenças em relação às demais:** única banca, nesta amostra, com questão sobre manejo COVID-19/decúbito ventral e sobre farmacologia respiratória básica (broncodilatador × expectorante × antitussígeno).

### UFPR / NC
- **Evidência real nesta disciplina:** 2 questões (2022).
- **Assuntos preferidos:** Fundamentos/Portaria 2.048/2002 (regulamento dos Sistemas Estaduais de Urgência), Crise Convulsiva (cuidado durante a crise).
- **Estilo de cobrança:** afirmação direta a confirmar, com redação próxima da norma citada.
- **Nível médio de dificuldade:** evidência insuficiente (n=2, `difficulty` nulo).
- **Predominância conceitual/prática/clínica:** normativa (Portaria) e conceitual-prática (crise convulsiva).
- **Erros recorrentes explorados:** EVIDÊNCIA INSUFICIENTE quanto a padrão recorrente (amostra pequena).
- **Diferenças em relação às demais:** única banca, na amostra, a citar a Portaria MS/GM nº 2.048/2002 nominalmente no enunciado.

### Instituto Consulplan
- **Evidência real nesta disciplina:** 1 questão (2023).
- **Assuntos preferidos:** componentes da Rede de Atenção às Urgências (RUE).
- **Estilo de cobrança:** enumeração com comando de exceção ("EXCETO", em maiúsculas no enunciado real).
- **Nível médio de dificuldade:** evidência insuficiente (n=1).
- **Predominância conceitual/prática/clínica:** normativa.
- **Erros recorrentes explorados:** alternativa com nome de programa/serviço inexistente ou de outra política, plausível por semelhança lexical ("Serviço Nacional de Atenção Integral à Saúde do Trabalhador", que não é componente real da RUE).
- **Diferenças em relação às demais:** único registro real desta banca na disciplina; mesmo padrão de comando de exceção já observado no Dossiê de Saúde Coletiva para esta banca (achado consistente entre disciplinas).

### Fundação VUNESP
- **Evidência real nesta disciplina:** 1 questão (2023).
- **Assuntos preferidos:** sequência de RCP em ritmo chocável (fibrilação ventricular).
- **Estilo de cobrança:** caso clínico em UPA seguido de pergunta técnica sequencial detalhada (doses, ordem de intervenção).
- **Nível médio de dificuldade:** evidência insuficiente (n=1); qualitativamente, exige memorização precisa de algoritmo com doses, sugerindo dificuldade alta.
- **Predominância conceitual/prática/clínica:** aplicada/algorítmica.
- **Erros recorrentes explorados:** EVIDÊNCIA INSUFICIENTE (amostra de 1).
- **Diferenças em relação às demais:** única banca, na amostra, com alternativas que combinam dose farmacológica exata E sequência de procedimento no mesmo item.

### CEBRASPE, IDECAN, FUNDEP, Avalia, FAFIPA
**Evidência insuficiente — declaração explícita.** Nenhuma questão real desta disciplina está registrada no acervo do SimulaPro para nenhuma destas cinco bancas — **incluindo CEBRASPE, apesar do prior qualitativo pré-existente classificá-la como "Muito Alta" para esta disciplina** (ver achado no início deste documento). Nenhuma característica de estilo é atribuída a estas cinco bancas nesta disciplina.

---

# PARTE 3 — PEGADINHAS

### Conceitos frequentemente confundidos
- **Urgência × Emergência** (definição de gravidade) × **estrutura física** (UPA/pronto-socorro) — distinção já registrada no Dossiê Mestre, Capítulo 1.1.
- **Escala de Coma de Glasgow — os 3 domínios reais** (abertura ocular, resposta verbal, resposta motora) × domínios inexistentes na escala (achado real direto: `4c643964`/`1de3f951`, gabarito E, testa exatamente "resposta pupilar" e "resposta sensorial" como itens que NÃO fazem parte da escala).
- **Contraindicação absoluta × relativa para trombólise no AVC** — achado real direto (`cbf159ba`, `17b9e8de`): a banca testa valores numéricos específicos (pressão sistólica >170/diastólica >110 mmHg após tratamento; janela de tempo de cirurgia/hemorragia) que diferenciam as duas categorias — erro de tratar qualquer contraindicação como absoluta.
- **Mnemônico de causas reversíveis de PCR ("5H e 5T")** — achado real direto (`9f6fce99`): hipoglicemia é distrator plausível mas não pertence ao mnemônico oficial (as causas são Hipóxia, Hipovolemia, Hidrogênio/acidose, Hipo/hipercalemia, Hipotermia + Trombose coronária, Trombose pulmonar, pneumoTórax hipertensivo, Tamponamento cardíaco, Toxinas).
- **Choque distributivo/séptico ("choque quente")** × **choque hipovolêmico/cardiogênico ("choque frio")** — nem todo choque cursa com pele fria (Dossiê Mestre, Capítulo 5.3).

### Inversões e sequência
- **C-A-B-D como sequência correta do trauma** — achado real direto (`8e60144b`, gabarito B = alternativa incorreta): a banca testa exatamente se o candidato sabe que essa sequência (que prioriza "Circulação" antes de "Airway") está errada — o correto é ABCDE, via aérea primeiro.
- **Sincronizado (cardioversão) × não sincronizado (desfibrilação)** — Dossiê Mestre, Capítulo 3.5; nenhuma questão real observada testa isso nominalmente, mas a sequência de ritmo chocável (`0159bec2`) pressupõe a distinção.
- **Compressão-ventilação e retorno completo do tórax** — achado real direto (`027ddecf`): "evitar o completo retorno entre as compressões" é a afirmativa marcada como FALSA no gabarito — o correto é permitir o retorno completo do tórax entre compressões, não evitá-lo.

### Terminologias semelhantes
- **RUE (Rede de Atenção às Urgências)** × **RAU** (nome usado em uma questão real, Instituto Consulplan, como sinônimo) × **ACCR** (diretriz de humanização, não a rede em si) — três siglas próximas, já distinguidas no Dossiê Mestre, Capítulos 1.1/2.2.
- **Respiração de Kussmaul** (cetoacidose) × **Respiração de Cheyne-Stokes** × **Respiração de Biot** — achado real direto (`65a063df`): a banca oferece as três como distratoras da mesma questão, exigindo associação padrão-respiratório→causa específica.
- **Contusão** × **Estiramento** × **Entorse** × **Luxação** — achado real direto (`62fae38a`): terminologia de lesão de tecidos moles com definições próximas, exigindo reconhecimento textual preciso.

### Erros clássicos de interpretação
- Comando negativo ("assinale a alternativa incorreta"/"que não apresenta...") ignorado por leitura apressada — padrão real recorrente em IBFC nesta disciplina (`8e60144b`, `4c643964`, `40754dfa`), mesmo padrão já documentado para IBFC nas Inteligências Editoriais de SAE e Saúde Coletiva.
- Presumir que qualquer alteração hemodinâmica isolada (ex.: hipertensão) já caracteriza emergência hipertensiva, sem considerar lesão de órgão-alvo (Dossiê Mestre, Capítulo 4.5; achado real, `e193da20`).
- Presumir que um nome de programa/rede plausível ("Serviço Nacional de Atenção Integral à Saúde do Trabalhador") realmente integra a RUE — achado real direto (`cb37d04f`).

### Alternativas incorretas frequentemente utilizadas pelas bancas (padrões observados)
- Inserir um domínio/variável inexistente em uma escala real (Glasgow + "resposta pupilar"/"sensorial").
- Trocar o mnemônico oficial por um item foneticamente/semanticamente próximo (hipoglicemia no lugar de hipotermia/hidrogênio).
- Inverter a sequência de prioridade de atendimento (C-A-B-D em vez de A-B-C-D-E).
- Nomear um serviço/rede inexistente, mas plausível, dentro de uma lista real de componentes normativos.

---

# PARTE 4 — MATRIZ DE COBERTURA

Prioridade e peso relativo derivados diretamente da classificação de incidência da Parte 1, agregada por macrotema.

| Macrotema | Subassuntos de maior prioridade | Prioridade | Qtd. inicial sugerida | Peso relativo |
|---|---|---|---|---|
| 5. Emergências Traumáticas | 5.1 (Politraumatizado), 5.2 (Glasgow) | **Muito Alta** | 10 | 22% |
| 4. Emergências Clínicas | 4.1 (Cardiovasculares), 4.10 (Distúrbios Hidroeletrolíticos, achado editorial) | **Muito Alta** | 10 | 22% |
| 3. Suporte de Vida | 3.3 (PCR/RCP) | **Muito Alta** | 6 | 13% |
| 4. Emergências Clínicas | 4.2, 4.9 (achado editorial), 4.3, 4.5, 4.6, 4.8 | Alta/Média | 10 | 22% |
| 3. Suporte de Vida | 3.2, 3.5 | Alta | 4 | 9% |
| 1./2. Fundamentos/Classificação de Risco | 1.1, 2.1b, 2.2, 2.3 | Alta/Média | 4 | 9% |
| 5. Emergências Traumáticas | 5.3, 5.4 | Alta/Média | 2 | 4% |
| Demais (evidência insuficiente) | 2.1, 2.4, 3.1, 3.4, 4.4, 4.7, 5.5, 5.6 | Baixa | 0 (sem evidência real suficiente para priorizar volume agora) | — |
| **Total** | | | **46** | **100%*** |

*Percentuais aproximados por arredondamento. Nota: a soma (46) não é um lote único — é a base de cobertura completa recomendada ao longo de múltiplos ciclos, mesmo padrão já usado nas disciplinas anteriores.

---

# PARTE 5 — RELAÇÕES ENTRE ASSUNTOS

```
Fundamentos e Organização da Rede (1.1)
        ↓
Classificação de Risco (2.1/2.1b/2.2) → SAMU (2.3) → UPA (2.4)
        ↓
Suporte de Vida: SBV (3.1) → SAV (3.2) → PCR/RCP (3.3) → Via Aérea (3.4) → Desfibrilação (3.5)
        ↓
Emergências Clínicas — bloco "tempo é órgão": Cardiovasculares (4.1) + AVC (4.2) + Sepse (4.3)
        ↓
Emergências Clínicas — demais: Neurológicas (4.4), Hipertensivas (4.5), Metabólicas (4.6),
Anafilaxia (4.7), Intoxicações (4.8), Respiratórias (4.9), Hidroeletrolíticas (4.10)
        ↓
Emergências Traumáticas: ABCDE (5.1) → Glasgow (5.2) → Choque (5.3) → Queimaduras/Afogamento/
Trauma Raquimedular (5.4/5.5/5.6)
```

**Subassuntos que costumam aparecer juntos na mesma questão (evidência real observada):**
- **PCR + Desfibrilação + causas reversíveis**, tratados como bloco único (evidência real: `0159bec2`, `9f6fce99`, `2e6f1e0e`).
- **ABCDE + Glasgow + Choque**, no mesmo caso clínico extenso (evidência real: cluster "P.L.S.", IBFC 2019).
- **AVC + contraindicação de trombólise**, sempre com dado numérico específico (evidência real: `cbf159ba`, `17b9e8de`).
- **Distúrbios hidroeletrolíticos/ácido-básicos + caso clínico de politrauma/PCR** (evidência real: `2c548eb6`, `4927c1ed`) — confirma a relação já mapeada entre o Macrotema 4 (achado editorial 4.10) e os Macrotemas 3/5.

**Relações mapeadas por dedução estrutural do Dossiê Mestre, sem evidência direta ainda no acervo:**
- Emergências Metabólicas (4.6) + Distúrbios Hidroeletrolíticos (4.10) — sobreposição conceitual (cetoacidose é, tecnicamente, um distúrbio ácido-básico), sem questão real que integre os dois explicitamente nesta amostra.
- Trauma Raquimedular (5.6) + ABCDE (5.1) — relação estrutural (imobilização ocorre dentro do "A"), sem evidência real isolada de 5.6.

**Relações com outras disciplinas (interfaces mapeadas, sem sobreposição de conteúdo):**
- **Terapia Intensiva (UTI):** ventilação mecânica prolongada e monitorização avançada permanecem no Dossiê de UTI — regra mestra já registrada em `02g` e no Dossiê Mestre desta disciplina.
- **Saúde Coletiva:** anafilaxia/EAPV vacinal (Capítulo 4.2b daquele Dossiê) citada por remissão, não duplicada.
- **Processo de Enfermagem:** competências privativas do Enfermeiro citadas por remissão.

---

# PARTE 6 — CHECKLIST EDITORIAL

1. **Precisão numérica/algoritmo** — se a questão envolve tempo, dose, frequência ou valor de contraindicação (RCP, trombólise, choque), o dado corresponde à diretriz técnica vigente confirmada em fonte oficial (Auditoria Normativa), não citado de memória?
2. **Atualidade de diretriz técnica** — se a questão cita AHA/ACLS/ATLS, a edição usada foi confirmada como vigente no momento da produção (achado real: FGV já citou "2020" explicitamente, prova de que bancas podem exigir precisão de edição)?
3. **Coerência técnica** — a questão respeita a distinção entre conceitos frequentemente confundidos já catalogados na Parte 3 (Glasgow × outras escalas, contraindicação absoluta × relativa, choque quente × frio, mnemônico correto de causas reversíveis)?
4. **Aderência às referências oficiais** — toda afirmação normativa citada (Portaria 1.600/2011, 2.048/2002, 2.395/2011) corresponde ao que consta no Dossiê Mestre ou foi verificada em fonte primária?
5. **Existência de apenas uma alternativa correta** — sem ambiguidade nem sobreposição parcial de correção?
6. **Compatibilidade com o perfil da banca-alvo** — formato (4 ou 5 alternativas — achado real: FGV usa ambos), estilo (caso clínico extenso × comando direto) compatíveis com a Parte 2? Bancas sem perfil real (CEBRASPE incluída, apesar do prior desatualizado) tratadas com cautela redobrada?
7. **Clareza textual** — enunciado compreensível numa única leitura?
8. **Ausência de ambiguidades terminológicas** — termos próximos (RUE/RAU/ACCR; Kussmaul/Cheyne-Stokes/Biot; contusão/estiramento/entorse) usados sem duplo sentido?
9. **Nível de dificuldade adequado** — corresponde à exigência cognitiva real (memorização de algoritmo × interpretação de caso × cálculo)?
10. **Verificação de duplicidade contra o próprio acervo** — a questão nova não repete estrutura, caso clínico ou distrator de nenhuma das 66 (62 únicas) questões reais já existentes desta disciplina, incluindo atenção redobrada aos 4 subassuntos onde o achado de duplicidade já ocorreu (3.3, 4.9, 5.1, 5.2)?

---

## Encerramento desta fase

Este documento cobre as 6 partes do padrão homologado, fundamentadas em 66 questões reais do acervo (100% do conjunto, não amostra) — a maior evidência real de partida entre as 4 disciplinas já trabalhadas nesta metodologia. Dois achados editoriais centrais: **4 pares de questões duplicadas** (66→62 únicas, recomendação de deduplicação técnica futura) e **divergência entre o prior qualitativo de CEBRASPE (MA) e a evidência real (0 questões)**. Nenhuma questão gerada. Nenhum documento anterior alterado. Nenhuma taxonomia alterada.
