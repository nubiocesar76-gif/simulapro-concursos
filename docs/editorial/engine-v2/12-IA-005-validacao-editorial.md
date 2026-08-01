# 12 — Validação Editorial (Sprint IA-005)

**Fase:** IA Editorial
**Sprint:** IA-005 — Validação Editorial
**Escopo desta sprint:** especificação funcional de um checklist conceitual preliminar sobre o conteúdo já organizado por IA-004 (Elementos E-01…E-10, estado `RASCUNHO_IA`). Sem algoritmo, sem regra automática, sem pontuação, sem parser, sem código, sem classes/funções/interfaces, sem pseudocódigo, sem JSON, sem schema, sem banco, sem API, sem SDK, sem modelo de IA, sem persistência, sem interface de usuário, sem fluxo de aprovação em tela.

**Papel desta sprint:** exclusivamente **assistivo**. Nenhum critério aqui descrito produz, por si só, aprovação ou reprovação de uma questão. A decisão final permanece, em todos os casos, **humana**.

---

## 1. Objetivo da Validação Editorial

A **Validação Editorial** é o checklist conceitual preliminar que **aponta**, para revisão humana, onde o conteúdo organizado por IA-004 (E-01…E-10) parece atender ou não parece atender às exigências do Método Editorial V1 e do Blueprint (IA-001) — sem, em nenhuma hipótese, substituir essa revisão.

Seu objetivo é **reduzir o esforço de auditoria humana**, sinalizando pontos de atenção prováveis, nunca **decidir** se uma questão é editorialmente válida. Essa decisão pertence, sem exceção, à Etapa 12 ("Auditar de forma independente") e à Etapa 13 ("Homologação") do processo canônico (IA-001, Seção 6), ambas de responsabilidade humana obrigatória.

---

## 2. Posição da IA-005 dentro do fluxo editorial

| Etapa | Sprint | O que já foi feito antes de chegar aqui | Papel da IA-005 |
|---|---|---|---|
| 1 | IA-001 (Blueprint) | Definiu os Elementos E-01…E-10 e a Etapa 12 do fluxo canônico como "checklist automatizado preliminar (IA-005)" | — |
| 2–3 | IA-002 / IA-003 | Compuseram o pacote de instrução e obtiveram a resposta bruta | — |
| 4 | IA-004 (Tratamento da Resposta) | Reconheceu e organizou a resposta segundo E-01…E-10, em estado `RASCUNHO_IA` | — |
| 5 | **IA-005 (esta sprint)** | Aplica o checklist conceitual preliminar sobre o conteúdo já organizado | Assistivo — aponta, não decide |
| 6 | (futuro — IA-006) | Conduz a revisão editorial humana propriamente dita | Fora desta sprint |

A IA-005 atua **somente** sobre conteúdo que IA-004 já considerou interpretável e organizado. Conteúdo sinalizado por IA-004 como não interpretável não chega à IA-005 — esse ciclo já foi encerrado antes.

O conteúdo permanece em estado `RASCUNHO_IA` (IA-001, Seção 5.2) durante e após a atuação da IA-005. Nenhuma sinalização desta sprint promove, por si, o conteúdo a `EM_REVISAO`, `APROVADO_EDITORIAL` ou `REPROVADO` — essas transições dependem da revisão humana (IA-006) e da homologação (Etapa 13).

---

## 3. Entradas esperadas

| Entrada | Origem | Observação |
|---|---|---|
| Conteúdo organizado por Elemento (E-01…E-10) | IA-004 | Único objeto sobre o qual a IA-005 atua |
| Estado `RASCUNHO_IA` | IA-004 | Pré-condição de entrada; conteúdo em outro estado não é reprocessado |
| Referência ao Método Editorial V1 e ao Dossiê da banca envolvida | `docs/metodologia/*` (somente leitura) | Base conceitual contra a qual os critérios da Seção 5 são observados |
| Proveniência do ciclo | Preservada desde IA-002/IA-003/IA-004 | Permite rastrear qual Conceito, banca e decisão editorial originaram o conteúdo |

A IA-005 não recebe diretamente os Insumos I-01…I-12 nem a resposta bruta original — seu ponto de partida é sempre o conteúdo já organizado por IA-004.

---

## 4. Saídas esperadas

| Saída | Descrição | O que **não** é |
|---|---|---|
| Conjunto de apontamentos preliminares | Indicações, organizadas por critério (Seção 5), de pontos que parecem merecer atenção humana | Não é aprovação, não é reprovação, não é pontuação, não é veredito |
| Conteúdo ainda em `RASCUNHO_IA` | O conteúdo avaliado permanece neste estado ao final da sprint | Não avança sozinho para `EM_REVISAO` ou além |
| Rastro do que foi observado | Registro de quais critérios foram considerados e o que foi apontado em cada um | Não é um relatório técnico estruturado, não é schema, não é registro em banco |

Toda saída desta sprint é **informativa para humanos** — nenhuma delas autoriza, bloqueia ou altera automaticamente o destino de uma questão.

---

## 5. Critérios conceituais de avaliação editorial

Os critérios abaixo são **dimensões de observação**, não regras automáticas nem fórmulas de pontuação. Cada um descreve **o que se observa**, não **como se calcula um resultado**:

| Critério | O que se observa | Fonte normativa |
|---|---|---|
| Fidelidade ao Conceito | Se o enunciado (E-03) e a justificativa (E-08) permanecem dentro da definição canônica do Conceito, sem extrapolar | I-01, I-02 (IA-001) |
| Clareza e univocidade do enunciado | Se o enunciado (E-03) admite uma única interpretação razoável | Método Editorial, Cap. 2 |
| Coerência do Contexto | Se o Contexto (E-04), quando presente, é compatível com o objetivo cognitivo declarado (I-07) | Método Editorial, Cap. 2.4 |
| Plausibilidade dos distratores | Se cada alternativa incorreta (E-06) representa um erro plausível, não um absurdo evidente | Método Editorial, Cap. 2 |
| Defensibilidade do gabarito | Se a alternativa correta (E-07) é identificável de forma inequívoca, sem ambiguidade com outra alternativa | Método Editorial, Cap. 2 |
| Consistência da justificativa técnica | Se a justificativa (E-08) sustenta, de fato, por que a alternativa correta está certa e as demais erradas | Método Editorial, Cap. 2 |
| Verificabilidade da referência | Se a referência bibliográfica (E-09) é identificável e externa, não inventada | Método Editorial, Cap. 2 |
| Aderência ao estilo da banca | Se forma, densidade de contexto e tom (E-03…E-06) condizem com o Dossiê da banca envolvida | I-04, I-05, I-06 (IA-001) |
| Ausência de indício de cópia | Se não há indício de que o conteúdo deriva, copia ou parafraseia uma questão real identificável | IA-001, Seção 7.2, item 3 (proibição fechada) |
| Coerência dos metadados editoriais | Se os metadados (E-10) refletem o ciclo que de fato originou o conteúdo | Proveniência do ciclo |

**Regra de ouro desta sprint:** nenhum critério acima gera, isoladamente ou em conjunto, uma decisão automática de aprovação ou reprovação. Todos os apontamentos são insumos para a auditoria humana (Etapa 12) e a homologação (Etapa 13) — nunca um substituto para elas.

---

## 6. Responsabilidades da IA-005

- Definir as dimensões de observação (Seção 5) sobre as quais o checklist preliminar se debruça.
- Garantir que cada apontamento seja rastreável a um critério específico e a uma fonte normativa (Método Editorial, Dossiê, Blueprint).
- Preservar o estado `RASCUNHO_IA` do conteúdo avaliado, sem promovê-lo a nenhum outro estado.
- Deixar inequívoco, em qualquer apontamento produzido, que se trata de uma sinalização assistiva — nunca de uma decisão.

---

## 7. Limites da sprint

- Não define algoritmo, regra automática ou fórmula de pontuação para nenhum critério.
- Não define como um apontamento é tecnicamente gerado (parser, comparação, heurística).
- Não define estrutura de dados, schema, JSON ou persistência para os apontamentos.
- Não define tela, fluxo de aprovação ou qualquer interação de revisor humano com os apontamentos — isso é IA-006.
- Não define modelo de IA, provedor, API ou SDK — herdado como fora de escopo desde IA-003.
- Não decide, em nenhuma hipótese, aprovação ou reprovação de uma questão.

---

## 8. Dependências para a IA-006

| Dependência | Descrição |
|---|---|
| Conjunto de apontamentos preliminares | IA-006 recebe os apontamentos desta sprint como ponto de partida da revisão editorial humana |
| Conteúdo em `RASCUNHO_IA` | IA-006 é quem primeiro pode promover o conteúdo a `EM_REVISAO` e, eventualmente, a `APROVADO_EDITORIAL` ou `REPROVADO` |
| Rastreabilidade de critérios | IA-006 herda a associação entre cada apontamento e o critério/fonte normativa que o originou, sem precisar reconstruí-la |

---

## 9. Próxima sprint (não iniciada)

**IA-006 — Revisão Editorial:** consumirá os apontamentos preliminares desta sprint para conduzir a revisão editorial humana propriamente dita (fluxo e artefatos de revisão). Não iniciada nesta sprint.

Aguardar revisão e homologação deste documento antes de iniciar IA-006.
