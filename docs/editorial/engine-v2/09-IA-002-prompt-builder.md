# 09 — Prompt Builder (Sprint IA-002)

**Fase:** IA Editorial
**Sprint:** IA-002 — Prompt Builder
**Escopo desta sprint:** especificação funcional de como o Blueprint Editorial (IA-001) é transformado em um prompt padronizado. Sem prompts prontos, sem templates completos, sem código, sem classes/funções/interfaces, sem modelo de IA, sem API, sem formato de resposta da IA, sem integração ou execução.

---

## 1. Objetivo do Prompt Builder

O **Prompt Builder** é a camada conceitual responsável por **compor** — a partir dos insumos definidos no Blueprint Editorial (IA-001) — um único pacote de instrução textual, organizado e completo, que expressa para uma IA generativa **o que produzir e sob quais limites**, sem jamais decidir **como** essa IA será chamada.

Ele não gera conteúdo editorial, não decide qual Conceito será abordado e não avalia a saída. Sua única responsabilidade é **traduzir insumos já declarados** (Seção 4 do IA-001) em uma **estrutura de instrução coerente e completa**, pronta para ser entregue à sprint de integração (IA-003).

---

## 2. Relação com o Blueprint Editorial (IA-001)

O Prompt Builder é **subordinado** ao Blueprint Editorial: não introduz nenhuma regra, insumo ou saída que o IA-001 não tenha previsto.

| Relação | Descrição |
|---|---|
| **Entrada normativa** | Os Insumos I-01 a I-12 (IA-001, Seção 4) são a única fonte de conteúdo que o Prompt Builder pode utilizar. |
| **Saída de referência** | Os Elementos E-01 a E-10 (IA-001, Seção 5.1) são o que o prompt deve **solicitar** da IA — não o que o Prompt Builder produz diretamente. |
| **Papel herdado** | O Prompt Builder implementa, em nível de composição, o papel "Gerador de questões inéditas" descrito no IA-001, Seção 7.1 — sem alterar suas restrições. |
| **Fluxo canônico** | O Prompt Builder atua **antes** das Etapas 6–11 do fluxo de 13 etapas (IA-001, Seção 6): ele prepara a instrução que viabiliza essas etapas, não as executa. |
| **Regra de não contradição** | Nenhuma estrutura definida aqui pode contradizer o Método Editorial V1 ou o Blueprint. Em caso de conflito aparente, o Blueprint prevalece. |

O Prompt Builder **não substitui** nem **antecipa** nenhuma decisão já reservada a sprints futuras (integração — IA-003; parse de resposta — IA-004; validação — IA-005).

---

## 3. Entradas esperadas

O Prompt Builder consome exclusivamente os insumos já catalogados pelo IA-001 (Seção 4), assumidos como **já resolvidos e validados** antes de chegarem a esta camada — a resolução de cada insumo (ex.: qual Conceito, qual Banca) é responsabilidade do ciclo editorial que invoca o Prompt Builder, não desta sprint.

| Grupo de insumo | Insumos (IA-001) | Papel na composição do prompt |
|---|---|---|
| Conhecimento | I-01, I-02, I-03 | Definem **sobre o que** a questão versa |
| Estilo | I-04, I-05, I-06 | Definem **como a banca de referência se expressa** |
| Decisão editorial do ciclo | I-07, I-08, I-09 | Definem **a intenção pedagógica** desta questão específica |
| Contexto operacional | I-10, I-11, I-12 | Enriquecem a composição quando aplicável (classificação, dicionário, ambiguidade) |

**Regra de completude:** o Prompt Builder não compõe um prompt caso falte um insumo marcado como obrigatório na tabela do IA-001 (Seção 4). A ausência de um insumo obrigatório interrompe a composição — o mesmo princípio de bloqueio já estabelecido no Blueprint, aplicado agora à camada de composição.

---

## 4. Processamento conceitual

O processamento do Prompt Builder é descrito aqui em nível de **função editorial**, não de algoritmo ou implementação:

1. **Verificação de completude** — confirma que todos os insumos obrigatórios para o ciclo (conforme IA-001, Seção 4) estão presentes antes de prosseguir.
2. **Resolução de dependências entre insumos** — reconhece que alguns insumos só fazem sentido em função de outros já declarados (ex.: o Dossiê da banca, I-05, só se aplica depois que a Banca, I-04, foi definida).
3. **Organização em blocos lógicos** — distribui os insumos validados nos blocos descritos na Seção 5 deste documento, preservando a proveniência de cada um.
4. **Aplicação de precedência editorial** — quando dois insumos poderiam sugerir direções conflitantes (ex.: estilo da banca versus estratégia do ciclo), a hierarquia do Método Editorial V1 prevalece sobre preferências pontuais do ciclo.
5. **Composição final** — reúne os blocos organizados em um único pacote de instrução, sem fragmentação, pronto para ser entregue à sprint de integração.
6. **Registro de proveniência** — associa ao pacote composto a identificação de quais insumos (e qual versão de cada um) foram utilizados, para rastreabilidade — alinhado ao Sistema de Evidências já descrito em `04-evidencias-confianca-evolucao.md`.

Nenhuma etapa acima define *como* essas verificações são implementadas (não há pseudocódigo, função ou classe associada nesta sprint).

---

## 5. Estrutura lógica do prompt

O prompt é entendido, nesta sprint, como uma composição de **blocos lógicos nomeados** — cada um com uma finalidade e uma origem de insumo claras. Não se define aqui o texto, a redação ou a ordem sintática final de cada bloco; apenas **o que cada bloco deve conter conceitualmente** e **de onde vem** seu conteúdo.

| Bloco lógico | Finalidade | Insumo(s) de origem |
|---|---|---|
| **Missão e princípios** | Estabelece o compromisso inviolável de originalidade e rigor (Método Editorial, Cap. 1) | Herdado do Blueprint — não variável por ciclo |
| **Conceito** | Delimita o assunto exato a ser abordado | I-01, I-02, I-03 |
| **Banca e estilo** | Comunica o padrão de forma e exigência da banca de referência | I-04, I-05, I-06 |
| **Decisão editorial do ciclo** | Comunica a intenção pedagógica específica desta questão | I-07, I-08, I-09 |
| **Contexto operacional** | Enriquece com classificação, dicionário editorial e casos ambíguos, quando aplicável | I-10, I-11, I-12 |
| **Elementos exigidos na saída** | Enumera **quais** elementos editoriais (E-01 a E-10) devem estar presentes na resposta | IA-001, Seção 5.1 |
| **Restrições** | Reforça a lista fechada do que a IA nunca faz | IA-001, Seção 7.2 |

**Distinção importante:** o bloco "Elementos exigidos na saída" comunica **quais elementos** devem existir (ex.: enunciado, alternativas, gabarito, justificativa) — não define **em que formato técnico** (schema, JSON, delimitadores) essa saída deve ser estruturada. Formato de resposta é escopo de IA-004.

A ordem relativa entre blocos, a redação de cada um e qualquer técnica de composição (ex.: few-shot, exemplos guiados) são decisões de implementação e permanecem fora desta sprint.

---

## 6. Saída esperada

A saída do Prompt Builder é o **próprio pacote de instrução composto** — não uma questão, não uma resposta de IA, não um payload de API.

| Característica da saída | Descrição |
|---|---|
| **Natureza** | Um pacote de instrução textual único, organizado segundo os blocos da Seção 5 |
| **Completude** | Contém todos os insumos obrigatórios do ciclo, sem lacunas |
| **Proveniência** | Acompanhado do registro de quais insumos (e versões) originaram o pacote |
| **Destino** | Entregue à sprint de integração (IA-003) para envio a um provedor de IA — o Prompt Builder não envia, não chama API, não recebe resposta |
| **Estado do conteúdo editorial resultante** | Qualquer questão eventualmente gerada a partir deste pacote nasce, no máximo, como `RASCUNHO_IA` (IA-001, Seção 5.2) — o Prompt Builder não altera esse estado |

Não é escopo desta sprint definir o formato técnico de serialização desse pacote (texto puro, estrutura de mensagens, delimitadores) — isso é decisão de implementação de IA-003.

---

## 7. Responsabilidades desta sprint

- Definir a lógica de composição: quais blocos existem, qual sua finalidade e qual insumo do IA-001 alimenta cada um.
- Definir as regras de completude e precedência que governam a composição (Seção 4).
- Preservar rastreabilidade entre o pacote composto e os insumos que o originaram.
- Garantir que a especificação seja **independente de provedor de IA, modelo ou técnica de prompting** — a lógica de composição deve valer igualmente para qualquer IA-003 futura.

---

## 8. Limites da sprint

- Não define a redação final de nenhum bloco (nenhum texto de prompt pronto).
- Não define técnica de prompting (few-shot, chain-of-thought, exemplos guiados ou qualquer variante).
- Não define provedor, modelo ou parâmetros de geração (temperatura, tamanho máximo, etc.).
- Não define formato de serialização do pacote de instrução (texto simples, estrutura de mensagens, JSON).
- Não define como o pacote é entregue à próxima sprint (chamada, fila, arquivo).

---

## 9. O que permanece fora de escopo

Herdado integralmente do IA-001 (Seção 11), aplicável também a esta sprint:

- Código em `src/`.
- Migrations / DDL / alteração de schema Supabase.
- Chamadas a API de provedor de IA (OpenAI, Anthropic, etc.).
- Telas Admin ou Portal.
- Prompts concretos, few-shot examples, JSON Schema de resposta.
- Mapeamento técnico E-01…E-10 → colunas da tabela `questions`.
- Definição de classes, funções ou interfaces.
- Alteração de `docs/metodologia/*` (documentos congelados).
- Alteração de `ROADMAP.md`, `PRODUCT_BACKLOG.md`, `PROJECT_STATUS.md`.
- Qualquer atividade pertencente a IA-003 (integração, execução, chamada real a uma IA).

---

## 10. Próxima sprint (não iniciada)

**IA-003 — Integração com IA:** consumirá o pacote de instrução composto por este documento para efetivamente chamar um provedor de IA (autenticação, retry, custo). Não iniciada nesta sprint.

Aguardar revisão e homologação deste documento antes de iniciar IA-003.
