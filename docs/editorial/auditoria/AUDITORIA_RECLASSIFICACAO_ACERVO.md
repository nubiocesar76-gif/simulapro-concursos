# AUDITORIA DE RECLASSIFICAÇÃO DO ACERVO

Documento de registro contínuo de inconsistências de classificação (disciplina/tópico) encontradas no acervo real de questões durante as sprints de produção editorial do SimulaPro. **Este documento apenas registra — nenhuma correção de acervo real já homologado é executada a partir dele sem instrução explícita e específica do usuário.**

---

## 1. Sobreposição de tópicos entre Biossegurança e Controle de Infecção Hospitalar (Sprint 7 — Biossegurança)

**Achado:** 3 dos 6 `topics` reais de Biossegurança ("Precauções e Isolamento", "CCIH e Prevenção de Infecção Hospitalar", "Reprocessamento de Produtos para Saúde") são, com os mesmos nomes, também `topics` reais da disciplina "Controle de Infecção Hospitalar" (linhas distintas, `subject_id` diferente). A taxonomia-sombra (`docs/editorial/02a-fundamentos-biosseguranca-seguranca-paciente.md`, ERRATA V1.1) registra que Biossegurança "absorveu" Controle de Infecção Hospitalar — mas a tabela real `subjects` nunca aplicou essa fusão; as duas disciplinas continuam ativas e independentes, cada uma com produção própria nesses mesmos 3 tópicos (32 questões produzidas em Controle de Infecção Hospitalar, sprint anterior desta fase; produção adicional leve em Biossegurança nesta sprint, deliberadamente sob ângulo distinto — proteção do trabalhador, não vigilância epidemiológica).

**Origem:** taxonomia-sombra `editorial_disciplines`, decisão registrada em `docs/editorial/auditoria/V1.1-arquitetura-corrigida.md`, nunca aplicada à arquitetura real de dados.

**Recomendação (não executada nesta sprint):** decisão editorial explícita do usuário sobre se a arquitetura real deve seguir a fusão da taxonomia-sombra (unificando as duas disciplinas reais) ou se ambas devem permanecer independentes de forma permanente e documentada (cada uma com seu recorte próprio, como praticado até aqui nesta sessão).

---

## 2. Sobreposição de tópicos entre Centro Cirúrgico e CME e Controle de Infecção Hospitalar/Biossegurança (Sprint 7 — Centro Cirúrgico e CME)

**Achado:** o `topic` "Reprocessamento de Produtos para Saúde" existe, com o mesmo nome, em Controle de Infecção Hospitalar e em Biossegurança; conteúdo técnico de esterilização/reprocessamento também é núcleo de Centro Cirúrgico e CME. Tratado, nas 3 disciplinas, sob ângulos deliberadamente distintos (CME: técnica de reprocessamento em si; Controle de Infecção Hospitalar: vigilância epidemiológica de falhas; Biossegurança: proteção do trabalhador durante o manuseio) — sobreposição temática legítima, sem duplicidade real de enunciado encontrada nas produções desta sessão.

**Origem:** mesma taxonomia-sombra referenciada no item 1.

**Recomendação:** nenhuma ação necessária além da manutenção da regra de desambiguação por ângulo, já aplicada consistentemente nesta sessão.

---

## 3. Questões sobre o Acre classificadas como Distrito Federal (Sprint 7 — Conhecimentos Gerais sobre o DF)

**Achado:** aproximadamente 10 das 19 questões reais pré-existentes da disciplina "Conhecimentos Gerais sobre o Distrito Federal", classificadas sob o tópico "Geografia, Cultura e Economia do DF", são, pelo conteúdo do próprio enunciado, sobre o estado do Acre (geografia, história, população, economia do Acre), não sobre o Distrito Federal. Provável erro de importação/classificação anterior a esta sessão.

**Origem:** desconhecida — não há registro de quando ou como essas questões foram importadas; não há author/origem rastreável nos metadados consultados nesta sessão.

**Recomendação (não executada):** auditoria dedicada de reclassificação — identificar se essas ~10 questões pertencem a uma disciplina real "Geografia/Conhecimentos Gerais Regionais" (inexistente no catálogo atual) ou se devem ser movidas para uma disciplina do Acre a ser criada, ou simplesmente removidas do acervo de Conhecimentos Gerais do DF. Decisão de produto, fora do escopo de uma sprint de produção de conteúdo.

---

## 4. Mandato real sobreposto entre Saúde do Adulto e Enfermagem Médico-Cirúrgica (Sprint — Saúde do Adulto, complementação)

**Achado:** a checagem cruzada obrigatória da Fase 4 revelou que Enfermagem Médico-Cirúrgica possui, com nomes quase idênticos ao mandato nominal de "Saúde do Adulto", tópicos reais que já cobrem: "Doenças Cardiovasculares" (Insuficiência Cardíaca, Síndrome Coronariana Aguda/angina), "Doenças Respiratórias Crônicas" (DPOC, Asma), "Doenças Renais e Neurológicas Crônicas" (AVC em fase de reabilitação crônica), "Emergências Clínicas" (suspeita de TEP/tromboembolismo) e "Oncologia" (cuidados paliativos oncológicos), além de tópico próprio "Estomas e Feridas Complexas". Isso significa que, na prática, Enfermagem Médico-Cirúrgica já assumiu o papel de "clínica médica hospitalar por sistema/doença do adulto" que o nome "Saúde do Adulto" sugeriria pertencer a esta última. As duas disciplinas reais permanecem independentes e ativas, cada uma com produção própria, sem fusão aplicada na arquitetura real (mesmo padrão de divergência já registrado nos itens 1 e 2 deste documento, mas aqui entre disciplinas sem qualquer relação na taxonomia-sombra conhecida).

**Origem:** desconhecida — não há registro de uma decisão editorial explícita definindo a fronteira de escopo entre "Saúde do Adulto" (linha de cuidado longitudinal/atenção à saúde do adulto) e "Enfermagem Médico-Cirúrgica" (assistência hospitalar por sistema/doença); ambas evoluíram cobrindo, em parte, o mesmo território clínico.

**Tratamento aplicado nesta sprint (não é correção de acervo, é decisão de escopo de produção):** os temas com sobreposição real confirmada (Insuficiência Cardíaca, Síndrome Coronariana Aguda, AVC, DPOC, Asma, Tromboembolismo Venoso, Cuidados Paliativos oncológicos, Feridas/Estomias) foram deliberadamente excluídos da produção desta sprint em Saúde do Adulto, direcionando as 10 questões novas exclusivamente a lacunas sem risco de duplicidade real (Insuficiência Renal Aguda, Distúrbios Hidroeletrolíticos, Dor Crônica não-oncológica, Segurança Medicamentosa no Adulto, e aprofundamento pontual de HAS/DRC com ângulos ainda não testados). Ver `ANALISE_ACERVO_SAUDE_ADULTO_V1.md`.

**Recomendação (não executada):** decisão editorial explícita do usuário sobre a fronteira formal de escopo entre as duas disciplinas — se devem permanecer com mandatos deliberadamente distintos (ex.: Saúde do Adulto focada em atenção primária/linha de cuidado crônico ambulatorial; Enfermagem Médico-Cirúrgica focada em assistência hospitalar aguda) ou se uma delas deveria ser redelimitada/fundida. Decisão de produto, fora do escopo de uma sprint de produção de conteúdo.

---

## Metodologia deste documento

Cada entrada é adicionada no momento em que uma sprint de produção identifica, durante a checagem cruzada de duplicidade (Fase 4 do fluxo homologado) ou durante a Auditoria (Fase 1), uma inconsistência de classificação que não é uma duplicidade simples de conteúdo, mas um problema estrutural de "que disciplina/tópico este conteúdo deveria realmente pertencer". Entradas não são removidas por sprints futuras — apenas anotadas como resolvidas, se e quando uma correção for explicitamente instruída e executada.
