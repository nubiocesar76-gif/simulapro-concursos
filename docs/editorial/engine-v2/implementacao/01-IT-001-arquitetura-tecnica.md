# 01 — Arquitetura Técnica da Engine Editorial IA (Sprint IT-001)

**Fase:** Implementação Técnica
**Sprint:** IT-001 — Arquitetura Técnica da Engine Editorial IA
**Fonte normativa:** `docs/editorial/engine-v2/08` a `16` (Sprints IA-001…IA-009, congeladas)
**Escopo desta sprint:** especificação arquitetural de como o método normativo será implementado no futuro. Sem migration, sem tabela, sem coluna, sem enum, sem política RLS, sem função SQL, sem API, sem server function, sem prompt, sem tela, sem componente React, sem provedor de IA, sem fila, sem worker, sem processamento paralelo, sem automação, sem alteração ao pipeline real de publicação e distribuição.

---

## 1. Visão geral da arquitetura técnica

A Engine Editorial IA é um **subsistema isolado** que implementa, tecnicamente, o ciclo unitário definido por IA-001…IA-007 e sua organização em escala (IA-008) e evolução controlada (IA-009). Ela não é uma reescrita de nada que já existe — é uma camada nova que **consome** taxonomia e insumos já existentes e **converge**, apenas no final do ciclo e apenas por decisão humana, com o pipeline real de questões já em produção.

A arquitetura aqui descrita não implementa nada por si — define **onde cada responsabilidade normativa deveria viver**, **o que já existe e pode ser reaproveitado**, **o que precisa ser criado**, e **quais decisões técnicas ainda estão em aberto**.

---

## 2. Posição da Engine Editorial IA dentro do SimulaPro

| Camada do SimulaPro já existente | Relação com a Engine Editorial IA |
|---|---|
| Taxonomia (`editorial_architectures/disciplines/topics/subtopics/keywords/rules`) | **Fonte de insumo**, consultada, nunca escrita pela Engine IA (IA-001 §4, nota de fechamento) |
| Acervo real (`exam_catalog/exam_files`) | Caminho paralelo e independente — a Engine IA não o utiliza; produz conteúdo **inédito**, não transcrito de prova real |
| Pipeline de questões (`questions → packages → package_versions → content_distributions → subscriptions`) | **Destino final**, apenas após homologação (IA-007) — nunca alterado por esta arquitetura |
| Painel Admin (React) | Fora de escopo desta sprint; qualquer tela é decisão de implementação futura |

A Engine Editorial IA ocupa uma posição **paralela e subordinada**: paralela porque não reaproveita o fluxo de importação de provas reais; subordinada porque toda saída sua só ganha existência no sistema real através de um único ponto de convergência, controlado por decisão humana.

---

## 3. Fronteiras entre o subsistema de IA e o sistema existente

| Fronteira | Descrição | Fonte normativa |
|---|---|---|
| Leitura de taxonomia | A Engine IA lê `editorial_disciplines/topics/subtopics/keywords` como Insumos I-01, I-02, I-11 — nunca escreve nelas | IA-001 §4, "a IA consome taxonomia... não cria Conceito" |
| Leitura de Dossiês | A Engine IA lê `docs/metodologia/DOSSIE_<BANCA>_V1.md` como Insumo I-05 — este acervo permanece congelado e fora de qualquer escrita | IA-001 §4.2 |
| Isolamento até homologação | Nenhum artefato produzido pela Engine IA é visível ao pipeline real antes de `APROVADO_EDITORIAL` | IA-006, IA-007 §1 |
| Convergência única | O único ponto de contato de escrita com o sistema existente é a fronteira de publicação (Seção 7) | IA-007 |
| Pipeline comercial | Pacotes, Versões, Distribuições e Assinaturas permanecem inteiramente fora do alcance da Engine IA | IA-007 §7 |

---

## 4–5. Módulos técnicos necessários e responsabilidades

A tabela abaixo cobre exatamente os módulos mínimos indicados para análise, sem definir classes, interfaces, serviços ou estruturas de banco — apenas a responsabilidade e sua fonte normativa.

| Módulo (conceitual) | Responsabilidade | Fonte normativa | Natureza |
|---|---|---|---|
| Preparação de Insumos | Reunir e declarar I-01…I-12 de um ciclo antes de qualquer composição | IA-001 §4 | Novo |
| Composição do Pedido | Organizar os insumos validados nos blocos lógicos do prompt | IA-002 | Novo |
| Fronteira de Transporte | Encaminhar o pedido composto a uma capacidade externa e devolver a resposta bruta, sem interpretar | IA-003 | Novo (hoje inexistente; nenhum provedor é definido) |
| Registro da Resposta Original | Preservar a resposta bruta tal como recebida, antes de qualquer reconhecimento estrutural | IA-003 §5, IA-004 §3 | Novo |
| Reconhecimento Estrutural | Identificar, dentro da resposta bruta, o que corresponde a cada Elemento esperado | IA-004 | Novo |
| Representação do Conteúdo Organizado (E-01…E-10) | Manter o conteúdo já reconhecido, organizado por Elemento, em estado `RASCUNHO_IA` | IA-001 §5.1, IA-004 §4 | Novo |
| Apontamentos Assistivos | Produzir sinalizações preliminares por critério, sem decidir nada | IA-005 | Novo, mas conceitualmente próximo de `editorial_evidence` (ver Seção 8) |
| Decisão Humana (Revisão e Homologação) | Registrar a auditoria independente e a homologação — sempre por ator humano | IA-006 | Novo, mas conceitualmente próximo de `editorial_changelog` (ver Seção 8) |
| Rastreabilidade do Ciclo | Amarrar, de ponta a ponta, Conceito, insumos, pacote composto, resposta, apontamentos e decisões de um mesmo ciclo | Transversal a IA-002…IA-007 | Novo |
| Agrupamento Operacional (Lote) | Referenciar quais ciclos individuais pertencem à mesma iniciativa de produção, sem estado editorial próprio | IA-008 | Novo, apenas metadado de referência |
| Convergência com o Acervo | Reconhecer que um ciclo homologado está apto e mapeá-lo ao contrato completo de `questions` | IA-007 | Fronteira/adaptador — ver Seção 7 |

---

## 6. Fluxo conceitual de comunicação entre módulos

```
Preparação de Insumos
        ↓ (insumos completos)
Composição do Pedido
        ↓ (pacote composto)
Fronteira de Transporte  ──(fora desta arquitetura: provedor externo)──→
        ↓ (resposta bruta)
Registro da Resposta Original
        ↓
Reconhecimento Estrutural
        ↓ (conteúdo em RASCUNHO_IA)
Representação do Conteúdo Organizado (E-01…E-10)
        ↓
Apontamentos Assistivos  ── (insumo de apoio, não vinculante) ──→
        ↓
Decisão Humana (Revisão e Homologação)
        ↓ (somente se APROVADO_EDITORIAL)
Convergência com o Acervo  ──→  pipeline real (questions/packages/...)
```

A **Rastreabilidade do Ciclo** e o **Agrupamento Operacional (Lote)** não aparecem nesta cadeia porque são **transversais**: acompanham todos os módulos acima sem alterar a ordem ou a direção do fluxo.

Nenhuma seta acima define protocolo, formato de dados ou mecanismo técnico de passagem entre módulos — apenas a ordem e a dependência conceitual, já fixadas por IA-001 §6 e reforçadas por cada sprint correspondente.

---

## 7. Pontos de integração com a arquitetura atual (fronteira de publicação)

A fronteira de publicação é o **único** ponto em que a Engine Editorial IA toca o sistema existente. Ela só é alcançável por conteúdo em `APROVADO_EDITORIAL` (IA-006), e sua responsabilidade **não se resume a preencher `questions.package_version_id`**.

O contrato real que já rege a entrada de qualquer questão no acervo (o mesmo usado hoje pelo pipeline de transcrição/seed, incluindo `scripts/seed/questions/convert/columns.ts`) exige a resolução de **todas** as relações obrigatórias de uma linha de `questions`, entre elas:

| Relação obrigatória do contrato real | Insumo/decisão do ciclo IA que a alimenta |
|---|---|
| Disciplina/Assunto (`subject_id`/`topic_id`) | I-01, I-02 (Conceito de origem) |
| Banca (`board_id`) | I-04 (Banca de referência) |
| Concurso/Exame (`exam_id`) | I-09 (Curso e cargo), decisão editorial do ciclo |
| Cargo/Posição (`position_id`) | I-09 |
| Pacote e Versão (`package_id`/`package_version_id`) | Decisão humana de publicação (IA-007 §6) |
| Enunciado, alternativas, gabarito, explicação | E-03, E-05, E-06, E-07, E-08 |
| Ano, referência bibliográfica | I-09 (ciclo), E-09 |

A responsabilidade arquitetural desta fronteira/adaptador é, portanto, **garantir que o conteúdo homologado consiga satisfazer integralmente esse contrato antes de convergir** — nunca gravar uma linha parcial esperando completá-la depois. Se qualquer relação obrigatória não puder ser resolvida a partir do ciclo (por exemplo, ambiguidade sobre qual `exam_id` usar para uma questão inédita), a convergência não deve ocorrer — essa situação é uma pendência arquitetural (Seção 11), não resolvida nesta sprint.

Esta sprint **não define** payload, função, endpoint ou operação de banco para essa fronteira — apenas sua responsabilidade e o contrato que ela deve respeitar.

**Confirmações explícitas exigidas pelo escopo:**

- A convergência **não redefine** o importador legado, o comando de seed, o fluxo de provas/gabaritos, Pacotes, Versões, Distribuições ou Assinaturas.
- A convergência **não disponibiliza automaticamente** conteúdo ao aluno — isso continua dependendo de Versão `PUBLISHED`, Distribuição `ACTIVE` e Assinatura ativa, exatamente como já documentado em `docs/FLUXO_PRODUCAO_PROVA.md` (não alterado por esta sprint).

---

## 8. Componentes existentes potencialmente reutilizáveis

Cada candidato foi avaliado individualmente — nenhuma reutilização é assumida por semelhança superficial de nome.

| Componente existente | Classificação | Justificativa |
|---|---|---|
| Padrão `.server.ts` + `.functions.ts` | **Reutilização direta** | É um padrão arquitetural do projeto (visto identicamente em `src/lib/acervo/` e `src/lib/editorial/`), não um dado ou schema específico de domínio — replicá-lo é exatamente o que qualquer novo domínio do projeto já faz |
| `createServerFn` (TanStack Start) | **Reutilização direta** | Mecanismo do framework já usado por todo o projeto; não carrega semântica editorial própria |
| `requireSupabaseAuth` | **Reutilização direta** | Middleware de autenticação já testado e usado por todo endpoint administrativo existente |
| RLS com `has_role(auth.uid(), 'admin')` | **Reutilização direta** | Mesmo padrão de autorização humana-admin já aplicado a toda tabela editorial; compatível com a exigência normativa de decisão humana (IA-006/IA-007) |
| `editorial_evidence` | **Reutilização com adaptação** | Já possui `evidence_type = 'SUGESTAO_IA'`, filosofia próxima aos apontamentos de IA-005 — mas seu `entity_type` é um enum fechado (`DISCIPLINE/TOPIC/KEYWORD/RULE/SUBTOPIC`) sobre entidades de **taxonomia**. Uma questão gerada não é nenhuma dessas — reutilizar exigiria estender esse enum, o que é decisão de schema fora desta sprint |
| `editorial_changelog` | **Reutilização com adaptação** | Mesma filosofia de histórico append-only (snapshots antes/depois) exigida pela rastreabilidade (IA-009). Diferente de `editorial_evidence`, seu `entity_type` já é `TEXT` livre, não um enum fechado — tecnicamente mais próximo de aceitar um novo tipo de entidade sem alteração de schema, mas ainda depende de uma decisão (qual identificador usar para um ciclo de geração) reservada para IT-002 |
| `editorial_import_logs` | **Apenas referência de padrão** | Fortemente acoplado ao conceito de importação de uma arquitetura editorial (`architecture_id` obrigatório, `package_path`, `engine_version`). Não é a mesma entidade que um "ciclo de geração de questão" — mas seu desenho (duração, contagem de registros, status de sucesso/falha) é uma referência de design válida para um futuro log de execução de ciclo |
| Taxonomia editorial (`editorial_disciplines/topics/subtopics/keywords/rules`) | **Reutilização direta**, como fonte de insumo | É exatamente o que IA-001 exige: a Engine IA consome esta taxonomia (I-01, I-02, I-11), nunca escreve nela |
| Pipeline de questões/pacotes/versões/distribuições | **Reutilização direta como destino** / **inadequado como container do ciclo** | Como destino final (Seção 7), é reutilizado sem alteração — é o mesmo contrato que precisa ser satisfeito. Como lugar para representar estados intermediários (`RASCUNHO_IA`, `EM_REVISAO` do ciclo de geração), é inadequado: essas tabelas não devem ganhar noção de "conteúdo ainda não homologado" — isso poluiria o pipeline real com estados que aluno/distribuição jamais deveriam enxergar |

---

## 9. Componentes inéditos necessários

Sem definir schema, código ou estrutura técnica — apenas reconhecendo que precisam existir:

- Uma representação própria para o **estado do ciclo de geração** (os quatro estados normativos do Blueprint), independente de qualquer enum de taxonomia já existente (ver resolução do conflito, Seção 10).
- Uma representação para o **pacote de instrução composto** (saída de IA-002) e para a **resposta bruta preservada** (saída de IA-003) — hoje sem qualquer equivalente no sistema.
- A **fronteira de transporte** em si (IA-003) — hoje não existe nenhum ponto de código que se comunique com um provedor de IA neste projeto.
- Um **registro de agrupamento em lote** (IA-008) — puramente uma referência de metadado, sem estado editorial próprio, sem relação com os status já existentes de `editorial_architectures` ou `editorial_record_status`.

---

## 10. Resolução do conflito entre estados editoriais

Este é o ponto de maior atenção arquitetural desta sprint. Os dois conjuntos de estado **não são o mesmo conceito aplicado duas vezes** — são estados de **ciclos distintos, sobre classes de entidade distintas**.

| | `editorial_record_status` (já existente) | Estados do Blueprint (IA-001 §5.2) |
|---|---|---|
| Valores | `PROPOSTO / EM_REVISAO / APROVADO / PUBLICADO / DEPRECIADO / MESCLADO` | `RASCUNHO_IA / EM_REVISAO / APROVADO_EDITORIAL / REPROVADO` |
| Governa a maturidade de | Uma **entidade de taxonomia** (disciplina, tópico, subtópico, palavra-chave, regra) dentro de uma `editorial_architecture` | Um **artefato de questão gerada**, produzido por um ciclo completo IA-001…IA-007 |
| Pergunta que responde | "Este nó de classificação já é confiável o suficiente para ser citado/usado?" | "Este conteúdo específico já pode existir como questão?" |
| Onde começa | Quando alguém propõe uma nova entidade de conhecimento | Quando um ciclo de geração produz conteúdo reconhecível (IA-004) |
| Onde termina | Quando publicada, depreciada ou mesclada a outra entidade | Quando homologada (`APROVADO_EDITORIAL`) ou reprovada (`REPROVADO`) |

**Relação entre os dois ciclos — precedência, não equivalência:** um ciclo de geração só pode começar (Etapa 1, "Seleção do Conceito", IA-001 §6) referenciando uma entidade de taxonomia que já esteja em um estado maduro de `editorial_record_status` (tipicamente `APROVADO` ou `PUBLICADO`). Essa é uma **pré-condição de leitura**, não uma transição de estado — o ciclo de geração **consulta** o estado da taxonomia como insumo (I-01/I-02) e **nunca escreve de volta** nela. Não existe, em nenhum sentido, uma "conversão" de um `APROVADO` de taxonomia em um `RASCUNHO_IA` de questão, ou vice-versa — são registros em modelos de dados diferentes, lidos uma única vez, na única direção taxonomia → ciclo de geração.

**Risco identificado e como evitá-lo:** o valor `EM_REVISAO` existe, coincidentemente, em ambos os vocabulários, com significados diferentes (maturidade de uma entidade de taxonomia vs. estágio de um ciclo de geração em auditoria humana). Essa coincidência de nome é um risco real de confusão em implementações futuras. A arquitetura determina que:

1. **Nenhuma tabela ou coluna futura pode reaproveitar o enum `editorial_record_status` para representar o estado de um ciclo de geração.**
2. Os quatro estados normativos (`RASCUNHO_IA`, `EM_REVISAO`, `APROVADO_EDITORIAL`, `REPROVADO`) devem ser preservados **literalmente**, sem sinônimos, abreviações ou fusão com o vocabulário de taxonomia.
3. Qualquer estrutura técnica futura que represente esse estado (tipo, enum, coluna) é uma decisão de schema **explicitamente reservada para uma sprint de implementação posterior** — não criada aqui.
4. A documentação técnica e, futuramente, o código devem sempre qualificar de qual dos dois vocabulários um valor "EM_REVISAO" pertence, nunca tratá-los como intercambiáveis.

Esta é a decisão arquitetural confirmada desta sprint sobre o tema — não uma pendência.

---

## 11. Princípios arquiteturais

- A Engine Editorial IA é um subsistema isolado até a homologação.
- Decisão editorial permanece exclusivamente humana em todas as etapas normativas que já exigem isso (IA-005 não decide, IA-006 decide, IA-007 decide publicar).
- Validação assistiva (IA-005) nunca produz aprovação automática — é insumo de apoio, não veredito.
- Cada questão possui ciclo e rastreabilidade próprios, independentes de qualquer outra questão do mesmo lote.
- Lote (IA-008) não possui estado editorial coletivo — apenas os ciclos individuais que o compõem têm estado.
- Somente conteúdo homologado (`APROVADO_EDITORIAL`) alcança o acervo real, através da fronteira única definida na Seção 7.
- O pipeline comercial atual (Pacotes, Versões, Distribuições, Assinaturas) permanece inteiramente inalterado por esta arquitetura.
- Qualquer integração com provedor externo de IA fica restrita à fronteira definida por IA-003 — nenhum provedor, SDK ou protocolo é definido nesta sprint.
- Nenhuma decisão técnica desta sprint modifica o Método Editorial V1 nem reinterpreta qualquer conceito de IA-001…IA-009.
- Componentes existentes só são considerados reutilizáveis quando há compatibilidade real de responsabilidade e semântica — nunca por semelhança superficial de nome (ver Seção 8).

---

## 12. Decisões e pendências arquiteturais — síntese

**1. Decisões arquiteturais confirmadas nesta sprint:**
- Os dois vocabulários de estado são ciclos distintos, em relação de precedência (taxonomia → insumo do ciclo de geração), nunca de equivalência (Seção 10).
- Os quatro estados normativos do Blueprint são preservados literalmente, sem reaproveitar `editorial_record_status` (Seção 10).
- A fronteira de publicação deve satisfazer o contrato completo de `questions` (todas as relações obrigatórias), não apenas `package_version_id` (Seção 7).
- A Engine IA é um subsistema paralelo e subordinado, sem tocar o pipeline comercial (Seção 2, 3, 11).
- O padrão `.server.ts`/`.functions.ts` + `createServerFn` + `requireSupabaseAuth` + RLS `has_role` é o padrão técnico de referência para qualquer futura fronteira de integração (Seção 8).

**2. Componentes atuais candidatos à reutilização (com classificação, Seção 8):**
`.server.ts`/`.functions.ts`, `createServerFn`, `requireSupabaseAuth`, RLS `has_role` (diretos); `editorial_evidence`, `editorial_changelog` (com adaptação); `editorial_import_logs` (apenas referência de padrão); taxonomia editorial (direto, como fonte); pipeline de questões (direto como destino, inadequado como container de ciclo).

**3. Componentes novos necessários (Seção 9):** representação do estado do ciclo de geração; representação do pacote composto e da resposta bruta; a fronteira de transporte em si; o registro de agrupamento em lote.

**4. Conflitos arquiteturais identificados e resolvidos:** o conflito de nomenclatura entre `editorial_record_status` e os estados do Blueprint (Seção 10) — resolvido conceitualmente nesta sprint, com a estrutura técnica ainda reservada para depois.

**5. Decisões reservadas para IT-002 (ou além):**
- Nome técnico, estrutura de armazenamento e tipo (enum/tabela) para o estado do ciclo de geração.
- Decisão sobre estender (ou não) `editorial_entity_type`/`editorial_evidence` para aceitar "questão gerada" como tipo de entidade.
- Formato técnico do registro de agrupamento em lote.
- Qual adaptador/mecanismo realiza de fato a convergência com `questions` (Seção 7).
- Qualquer decisão sobre provedor de IA, SDK, autenticação ou protocolo — permanece herdada como fora de escopo de IA-003, não tratada nesta nem em nenhuma sprint de arquitetura até ser explicitamente autorizada.

---

## 13. Dependências para a IT-002

| Dependência | Descrição |
|---|---|
| Resolução conceitual dos estados (Seção 10) | IT-002 pode propor a estrutura técnica (schema/enum) que representa os 4 estados do Blueprint, sem reabrir a discussão conceitual já fechada aqui |
| Classificação de reuso (Seção 8) | IT-002 parte desta classificação para detalhar exatamente como cada adaptação (ex.: extensão de `editorial_evidence`) seria estruturada |
| Fronteira de publicação (Seção 7) | IT-002 pode detalhar o adaptador de convergência, mantendo a exigência de contrato completo aqui estabelecida |
| Módulos e fluxo (Seções 4–6) | IT-002 detalha cada módulo tecnicamente, sem alterar sua responsabilidade ou ordem no fluxo |

---

Aguardar revisão e homologação deste documento antes de iniciar IT-002.
