# DOSSIÊ MESTRE — POLÍTICAS PÚBLICAS DE SAÚDE — V1

## Objetivo e status

Primeiro documento da Fase 7 (Escala Editorial) para a disciplina "Políticas Públicas de Saúde", meta de 50 questões (49 inéditas + 1 já existente). Segue o mesmo modelo homologado (Dossiê Mestre → Inteligência Editorial → Auditoria Normativa → Plano Editorial → Produção → Gate → Conversão → Importação → Homologação) usado em Processo de Enfermagem, UTI, Saúde Coletiva e Urgência e Emergência. **Nenhuma metodologia nova foi criada, nenhuma arquitetura/pipeline/banco/contrato/SIA foi alterado.**

---

# ETAPA 1 — INSPEÇÃO OBRIGATÓRIA (antes de propor qualquer capítulo)

## 1.1 Estado real no banco de produção (consultado ao vivo, não assumido)

- `subjects`: "Políticas Públicas de Saúde" existe como disciplina **real e independente** (`id = 628cfd92-79a2-4aba-a36d-5987ba22acf4`), com **1 tópico** (`Histórico da Previdência Social no Brasil`) e **exatamente 1 questão** (Instituto AOCP), confirmando o número informado no pedido.
- `subjects`: "Legislação do SUS" existe separadamente (`id = d480c4be-...`), com **23 tópicos** e **181 questões reais**.

## 1.2 ACHADO EDITORIAL CRÍTICO — tensão real entre dois documentos/dois sistemas já existentes nesta sessão

Antes de propor qualquer capítulo novo, encontrei uma divergência real que precisa ser registrada, não ignorada:

1. **`docs/editorial/auditoria/V1.1-arquitetura-corrigida.md`** (produzido nesta mesma sessão, Fase 3.2) registra que a disciplina D14 "Políticas Públicas de Saúde" foi **MESCLADA** em D13 "Legislação do SUS" — mas isso se refere exclusivamente à taxonomia sombra do Motor Editorial de IA (`editorial_disciplines`), usada só para os ciclos automáticos de IA, **não** à tabela real `subjects` consultada pelo aluno.
2. **`docs/editorial/02b-etica-legislacao-administracao-politicas.md`** (documento de referência já existente, não criado por mim) já tem uma seção 4 inteira dedicada a "Políticas Públicas de Saúde" com uma ERRATA idêntica, e a seção 3.6 registra a **regra de classificação oficial já documentada**: *"Legislação do SUS = a constituição do sistema (...); Políticas Públicas de Saúde = os programas e políticas específicas que operam dentro dessa estrutura (PNAB, PNH, PNI, Rede Cegonha, RAPS etc.)."*
3. **Mas a tabela real `topics`, sob `subject_id` de "Legislação do SUS", já contém, com questões reais, exatamente os tópicos que essa regra diz que deveriam estar em "Políticas Públicas de Saúde"**: Política Nacional de Humanização (PNH), Política Nacional de Atenção Básica (PNAB), Política Nacional de Práticas Integrativas e Complementares (PNPIC), Política Nacional de Saúde Integral da População Negra (PNSIPN), Política Nacional de Promoção da Saúde (PNaPS), Política Nacional de Educação Popular em Saúde (PNEPS-SUS) — 6 tópicos, com questões reais já publicadas sob "Legislação do SUS", não sob "Políticas Públicas de Saúde".

**Conclusão do achado:** a prática real de importação (histórica, anterior a esta sessão) já tratou essas 6 "Políticas Nacionais de..." como pertencentes a "Legislação do SUS", na prática confirmando o mesmo resultado do merge documentado — mesmo a regra escrita (02b, seção 3.6) dizendo o contrário. **Produzir questões novas sobre PNH, PNAB, PNPIC, PNSIPN, PNaPS ou PNEPS-SUS dentro de "Políticas Públicas de Saúde" duplicaria tema já coberto — 181 questões reais — em outra disciplina real**, violando diretamente a regra "inexistência de duplicidade" do Gate de Qualidade Editorial V1 (Nível 2), mesmo que a duplicidade seja entre disciplinas, não só entre tópicos da mesma disciplina.

**Não alterei taxonomia, banco, disciplinas ou tópicos para resolver isso** (fora do escopo e da autorização desta fase). Em vez disso, o escopo desta Dossiê (seção 3 abaixo) foi desenhado para **evitar ativamente** essa sobreposição, mantendo os 49 capítulos/subassuntos futuros dentro do que está genuinamente descoberto.

## 1.3 Outras sobreposições reais encontradas (busca textual no acervo inteiro, não restrita à disciplina)

| Termo pesquisado | Ocorrências reais | Disciplina(s) onde já está classificado |
|---|---|---|
| "rede cegonha" | 3 | Saúde da Mulher |
| "raps" | 2 | Saúde Mental |
| "rede de atenção" | 12 | Administração em Enfermagem, Urgência e Emergência, Legislação do SUS |
| "estratégia saúde da família" | 2 | Administração em Enfermagem, Legislação do SUS |
| "acolhimento" | 6 | Saúde da Mulher, Administração em Enfermagem, Saúde Mental, Legislação do SUS, Fundamentos de Enfermagem |
| "reforma sanitária" | 2 | Legislação do SUS |
| "conferência nacional de saúde" | 1 | Legislação Municipal e Institucional |
| "previdência social" | 1 (+ 1 já em Políticas Públicas) | Legislação do SUS |
| "saúde da pessoa idosa" | 1 | Saúde do Idoso |
| "alimentação e nutrição" | 2 | Legislação do SUS |
| inamps, "8ª conferência", "previne brasil", agente comunitário, pnaish, "saúde do homem" | 0 | **EVIDÊNCIA INSUFICIENTE** — nenhuma questão real no acervo inteiro |

**Regra aplicada nesta fase:** um subassunto só entra no escopo de produção se (a) não tiver acervo real relevante já classificado em outra disciplina, OU (b) o documento de referência 02b já prever explicitamente uma regra de desambiguação que o mantenha em Políticas Públicas mesmo havendo ocorrência residual em outro lugar (ex.: "cita o nome da política" vs. "descreve a assistência clínica").

---

# ETAPA 2 — FONTES REAIS CONSULTADAS

- `docs/editorial/02b-etica-legislacao-administracao-politicas.md`, seções 3 e 4 (documento de referência já existente, não duplicado — reaproveitado integralmente como base de evidência).
- `docs/editorial/auditoria/V1.1-arquitetura-corrigida.md` (achado do merge na taxonomia sombra).
- `docs/editorial/normalized/07-frequencia-cobranca-consolidada.md` (prior editorial pré-existente: Políticas Públicas de Saúde = Alta/Muito-Alta na maioria das bancas — IBFC A, FGV A, Consulplan A, IDECAN M, VUNESP A, Cebraspe A, AOCP M, FUNDEP M, Avalia M, FAFIPA M — explicitamente rotulado como *prior*, não dado real, conforme já registrado naquele arquivo).
- Consulta direta ao Supabase de produção (`subjects`, `topics`, `questions`) — real, não assumida.
- A única questão real já cadastrada em "Políticas Públicas de Saúde" (Instituto AOCP, sobre a Lei Elói Chaves e o embrião da Previdência Social) — evidência real e concreta de que o capítulo histórico pertence genuinamente a esta disciplina.

---

# ETAPA 3 — ESCOPO PROPOSTO (macrotemas e capítulos, já filtrados para evitar duplicidade)

## Macrotema 1 — Fundamentos Históricos e Institucionais

### Capítulo 1.1 — Da Previdência Social ao Movimento Sanitário
- **Objetivo:** história pré-SUS da saúde pública no Brasil, desde as Caixas de Aposentadorias e Pensões (Lei Eloy Chaves, 1923) até os Institutos de Aposentadoria e Pensões (IAPs) e o INAMPS.
- **Conceitos fundamentais:** Lei Eloy Chaves; CAPs → IAPs; modelo previdenciário-assistencialista (vínculo empregatício como pré-condição de acesso); exclusão da população rural/informal.
- **Definições oficiais:** EVIDÊNCIA INSUFICIENTE para INAMPS especificamente (0 ocorrências reais no acervo) — usar apenas o que a única questão real já demonstra (Lei Eloy Chaves).
- **Base legal:** Lei Eloy Chaves (Decreto nº 4.682/1923).
- **Relação com outros capítulos:** precede diretamente o capítulo 1.2 (Reforma Sanitária).
- **Observações importantes:** capítulo já validado por evidência real direta (1 questão já publicada na própria disciplina) — não é capítulo especulativo.
- **Referências:** Lei Eloy Chaves (1923); literatura consolidada de saúde coletiva sobre história das políticas de saúde no Brasil.

### Capítulo 1.2 — Reforma Sanitária Brasileira e a 8ª Conferência Nacional de Saúde
- **Objetivo:** movimento da Reforma Sanitária (déc. 1970-80) e a 8ª CNS (1986) como marco pré-constituinte do SUS.
- **Conceitos fundamentais:** Movimento da Reforma Sanitária; saúde como direito de cidadania (não mais vínculo previdenciário); relatório final da 8ª CNS como base do capítulo "Da Saúde" na CF/88.
- **Base legal:** Constituição Federal de 1988, arts. 196-200 (a base constitucional em si já pertence a "Legislação do SUS" — aqui o enfoque é o **processo político** que a originou, não o texto legal).
- **Evidência real:** "reforma sanitária" (2 ocorrências, hoje classificadas em Legislação do SUS) — **ACHADO**: mesmo padrão de sobreposição do item 1.2 acima; capítulo mantido no escopo por ser tema histórico-político genuíno de Políticas Públicas (não de gestão/estrutura do sistema), mas a produção deve evitar repetir o ângulo já coberto (texto constitucional) e focar no processo político/histórico do movimento.
- **Referências:** Relatório Final da 8ª Conferência Nacional de Saúde (1986); literatura consolidada.

## Macrotema 2 — Atenção Primária à Saúde: Políticas e Programas Operacionais

> Nota: a PNAB em si (Portaria nº 2.436/2017) já é tópico real de "Legislação do SUS" — os capítulos abaixo evitam deliberadamente repetir "o que é a PNAB" e focam nos programas/atores operacionais que a regra do 02b (seção 4.4) já reconhece como subassuntos próprios, ainda sem cobertura real em nenhuma disciplina.

### Capítulo 2.1 — Estratégia Saúde da Família (ESF)
- **Evidência real:** 2 ocorrências (Administração em Enfermagem, Legislação do SUS) — nenhuma em Políticas Públicas. **ACHADO EDITORIAL**: subassunto real, mas ainda sem tópico próprio nesta disciplina — produção deve focar no papel da ESF como *política/estratégia*, não na gestão operacional do serviço (evita sobreposição com Administração).
- **Conceitos fundamentais:** território, adscrição de clientela, vínculo, longitudinalidade, equipe mínima.
- **Base legal:** PNAB (citada apenas como referência cruzada, nunca como objeto central da questão).

### Capítulo 2.2 — Agente Comunitário de Saúde (Lei nº 11.350/2006)
- **Evidência real:** EVIDÊNCIA INSUFICIENTE (0 ocorrências). Subassunto mantido por ser exigência recorrente de edital (02b, seção 4.3) e ter base legal própria e estável.
- **Base legal:** Lei nº 11.350/2006.

### Capítulo 2.3 — Núcleo Ampliado de Saúde da Família / eMulti
- **Evidência real:** EVIDÊNCIA INSUFICIENTE (0 ocorrências para "nasf").
- **Observações importantes:** mudança nominal recente (NASF → eMulti) é o ponto de maior risco de desatualização — exige verificação normativa na Sprint 7.1C antes de produção.

### Capítulo 2.4 — Programa Saúde na Escola (PSE)
- **Evidência real:** EVIDÊNCIA INSUFICIENTE.

### Capítulo 2.5 — Programa Previne Brasil (financiamento da APS)
- **Evidência real:** EVIDÊNCIA INSUFICIENTE (0 ocorrências).
- **Observações importantes:** substituiu o antigo PAB (Piso de Atenção Básica) — ponto de possível pegadinha (banca cobrar modelo antigo como se vigente).

## Macrotema 3 — Acolhimento, Acesso e Qualidade

### Capítulo 3.1 — Programa Nacional de Melhoria do Acesso e da Qualidade (PMAQ)
- **Evidência real:** 1 ocorrência, hoje em Legislação do SUS — **ACHADO**: mesmo padrão de sobreposição; mantido por ter subassunto próprio e claro no 02b, produção deve buscar ângulo não repetido (avaliação/certificação, não o texto normativo genérico).

### Capítulo 3.2 — Acolhimento com Classificação de Risco (enfoque de política pública)
- **Evidência real:** 6 ocorrências, espalhadas por 5 disciplinas diferentes — **ACHADO EDITORIAL, maior risco de ambiguidade de todo este Dossiê**. Produção deste capítulo deve se restringir estritamente ao enfoque de política/organização de rede (não ao protocolo clínico específico, que já pertence a Urgência e Emergência/outras).

## Macrotema 4 — Redes Temáticas de Atenção à Saúde (enfoque político-normativo, nunca clínico)

> Regra de desambiguação já documentada no 02b (seção 4.6), reaproveitada aqui sem alteração: se a questão cita o nome da política/portaria → Políticas Públicas; se descreve a assistência clínica em si → a disciplina clínica correspondente (Saúde da Mulher, Saúde Mental, Urgência e Emergência).

### Capítulo 4.1 — Redes de Atenção à Saúde (RAS): marco conceitual
- **Base legal:** Portaria de Consolidação nº 3/2017, Anexo III (consolidou a antiga Portaria nº 4.279/2010) — mesma consolidação já identificada na Auditoria Normativa de Urgência e Emergência desta sessão, reaproveitada aqui como referência cruzada, não redigida de novo.
- **Evidência real:** "rede de atenção" tem 12 ocorrências reais, mas nenhuma no ângulo puramente conceitual (5 componentes da RAS) — EVIDÊNCIA INSUFICIENTE para o ângulo conceitual específico, apesar do termo genérico ser frequente.

### Capítulo 4.2 — Rede Cegonha (enfoque político-normativo)
- **Evidência real:** 3 ocorrências, todas em Saúde da Mulher (conteúdo assistencial). **ACHADO**: por regra já documentada no 02b, só entra aqui a variante que cita a política/portaria explicitamente — produção deve evitar qualquer questão sobre pré-natal/parto humanizado/método canguru (pertencem a Saúde da Mulher).
- **Base legal:** Portaria nº 1.459/2011.

### Capítulo 4.3 — Rede de Atenção Psicossocial (RAPS) — enfoque político-normativo
- **Evidência real:** 2 ocorrências, ambas em Saúde Mental (mesma lógica do capítulo 4.2).
- **Base legal:** Portaria nº 3.088/2011.

### Capítulo 4.4 — Rede de Atenção às Urgências e Emergências (RUE) — enfoque político-normativo
- **ACHADO EDITORIAL adicional:** esta mesma rede (RUE) já é referenciada no Dossiê Mestre de Urgência e Emergência (capítulo 2.2, homologado nesta sessão). Para não duplicar produção entre disciplinas homologadas, este capítulo deve se restringir estritamente à rede **como política pública** (objetivo, histórico, componentes da RUE), nunca ao atendimento clínico em si (que pertence integralmente a Urgência e Emergência).
- **Base legal:** Portaria de Consolidação nº 3/2017, Anexo III (idem 4.1).

## Macrotema 5 — Políticas por População e Agravo Específico

> Nota: PNH, PNAB, PNPIC, PNSIPN e PNaPS **foram excluídas** deste macrotema por já serem tópicos reais e ativos em "Legislação do SUS" (ver Achado Editorial Crítico, seção 1.2) — incluí-las aqui duplicaria 181 questões reais já publicadas. Restam os subassuntos do 02b que **não** têm tópico real em nenhuma outra disciplina.

### Capítulo 5.1 — Política Nacional de Atenção Integral à Saúde do Homem (PNAISH)
- **Evidência real:** EVIDÊNCIA INSUFICIENTE (0 ocorrências para "pnaish"/"saúde do homem").

### Capítulo 5.2 — Política Nacional de Alimentação e Nutrição (PNAN)
- **Evidência real:** 2 ocorrências, já classificadas em Legislação do SUS. **ACHADO**: mesmo padrão de sobreposição residual — mantido por não ter tópico dedicado lá (aparece dentro de um tópico mais genérico), produção deve verificar antes se colide.

### Capítulo 5.3 — Política Nacional de Saúde da Pessoa Idosa (enfoque de política, não clínico)
- **ACHADO EDITORIAL:** já existe disciplina real "Saúde do Idoso" com 1 ocorrência real. Regra aplicada (mesma lógica do 4.2/4.3): só entra aqui a variante que trata da política em si (histórico, base legal, diretrizes), nunca o conteúdo clínico-assistencial de saúde do idoso.
- **Base legal:** Lei nº 8.842/1994 (Política Nacional do Idoso) e Portaria nº 2.528/2006 (PNSPI).

---

# VALIDAÇÃO

✓ **Inspeção obrigatória real executada antes de qualquer proposta de capítulo** (consulta ao banco de produção, não assumida). ✓ **Nenhum documento duplicado** — reaproveitado integralmente `docs/editorial/02b-...md` como base de evidência, nenhuma nova pesquisa de sinônimos/siglas repetida do zero. ✓ **Achado editorial crítico registrado de forma explícita e rastreável**, com a divergência entre a regra documentada (02b) e o estado real dos dados (topics de Legislação do SUS) — não resolvido unilateralmente, não ignorado. ✓ **13 capítulos propostos**, todos com evidência real verificada (própria ou cruzada) ou EVIDÊNCIA INSUFICIENTE explicitamente marcada — nenhum dado inventado. ✓ **6 subassuntos do documento de referência 02b foram deliberadamente excluídos** (PNH, PNAB-como-portaria, PNPIC, PNSIPN, PNaPS + conteúdo clínico de Rede Cegonha/RAPS) para não duplicar acervo real já publicado em outras disciplinas. ✓ **Nenhuma alteração de taxonomia, banco, pipeline, contrato ou SIA.**

## Encerramento desta fase

Dossiê Mestre concluído com 5 macrotemas e 13 capítulos, todos rastreáveis a evidência real (própria, cruzada, ou explicitamente marcada como insuficiente). O achado editorial crítico sobre a sobreposição real entre "Políticas Públicas de Saúde" e "Legislação do SUS" precisa da sua ciência antes de prosseguir — ele molda diretamente o escopo do Plano Editorial (Sprint 7.1D) e a quantidade real de conteúdo genuinamente disponível para 49 questões inéditas sem duplicação. Aguardando aprovação antes de iniciar a Sprint 7.1B (Inteligência Editorial), conforme "Forma de Trabalho" explicitamente instruída.
