# 15 — Produção em Escala (Sprint IA-008)

**Fase:** IA Editorial
**Sprint:** IA-008 — Produção em Escala (Lotes)
**Escopo desta sprint:** especificação funcional de como o fluxo editorial unitário (IA-001…IA-007) pode ser aplicado a múltiplas questões organizadas em lote, sem redução de nenhuma garantia metodológica. Sem processamento paralelo, sem filas, sem workers, sem concorrência, sem banco, sem API, sem SDK, sem código, sem classes/funções/interfaces, sem pseudocódigo, sem telas, sem workflow operacional, sem automação de revisão/homologação/publicação, sem métricas de desempenho.

**Princípios inegociáveis desta sprint:** um lote é apenas um agrupamento operacional. Cada questão percorre integralmente o fluxo IA-001 → IA-007. Nenhuma validação, revisão, homologação ou publicação é eliminada por existir um lote. Toda decisão é registrada por questão. A rastreabilidade permanece individual. Uma falha em uma questão não invalida automaticamente as demais. A produção em escala **organiza a execução** do Método Editorial — nunca o altera.

---

## 1. Objetivo da Produção em Escala

O objetivo da IA-008 é permitir que o ciclo editorial unitário — já inteiramente definido por IA-001 a IA-007 — seja **aplicado repetidamente**, a múltiplos Conceitos e questões, de forma organizada. Este objetivo é **puramente organizacional**: nenhuma nova etapa editorial é criada, nenhuma etapa existente é reduzida, e nenhuma decisão humana passa a ser coletiva.

Produzir "em escala" significa, neste blueprint, **executar o mesmo ciclo completo mais vezes** — nunca executar um ciclo diferente, mais rápido ou menos rigoroso.

---

## 2. Posição da IA-008 dentro do Método Editorial

| Aspecto | Descrição |
|---|---|
| Relação com o fluxo de 13 etapas (IA-001, Seção 6) | Nenhuma etapa nova é adicionada; nenhuma etapa existente é removida ou reordenada. As 13 etapas continuam valendo, integralmente, para cada questão. |
| Relação com os estados editoriais (IA-001, Seção 5.2) | `RASCUNHO_IA`, `EM_REVISAO`, `APROVADO_EDITORIAL` e `REPROVADO` continuam sendo atribuídos **por questão** — não existe um estado "de lote". |
| Relação com IA-006 e IA-007 | Auditoria (Etapa 12), homologação (Etapa 13) e decisão de publicação continuam sendo atos humanos individuais, por questão, mesmo quando várias questões são produzidas na mesma iniciativa. |
| O que a IA-008 acrescenta | Apenas o **conceito de agrupamento operacional** (lote), descrito na Seção 3 — nada além disso. |

---

## 3. Conceito de lote editorial

Um **lote editorial** é um agrupamento operacional de múltiplos ciclos individuais (cada ciclo correspondendo a uma questão), reunidos por conveniência de produção — por exemplo, questões planejadas para o mesmo curso, cargo, banca ou disciplina, produzidas em uma mesma iniciativa.

| O que um lote **é** | O que um lote **não é** |
|---|---|
| Um agrupamento organizacional de ciclos independentes | Uma nova etapa do processo canônico |
| Uma referência de conveniência para planejamento e rastreio coletivo | Uma unidade de homologação ou publicação |
| Um conjunto onde cada questão mantém seu próprio estado editorial | Um estado editorial em si — não existe `APROVADO_EDITORIAL` "do lote" |
| Compatível com falhas parciais (algumas questões avançam, outras não) | Um compromisso de tudo-ou-nada |

O lote **não tem existência editorial própria** — apenas as questões que o compõem têm.

---

## 4. Pré-condições para iniciar um lote

- Cada ciclo individual dentro do lote deve satisfazer, isoladamente, as mesmas pré-condições já exigidas pelo fluxo unitário (Insumos I-01…I-12 completos, conforme IA-001, Seção 4) — nenhuma pré-condição é relaxada por existir agrupamento.
- A composição do lote (quantidade de questões, Conceitos ou escopo envolvidos) é uma decisão humana prévia à execução — sua definição operacional (como é declarada, por quem) não é objeto desta sprint.
- Nenhuma pré-condição "de lote" substitui ou dispensa qualquer pré-condição individual já definida em IA-001.

---

## 5. Entradas esperadas

| Entrada | Descrição |
|---|---|
| Conjunto de declarações de ciclo | Um lote é, do ponto de vista de entrada, apenas a soma de múltiplas declarações de ciclo individuais — cada uma com seus próprios Insumos I-01…I-12 completos (IA-001, Seção 4) |
| Referência de agrupamento | Uma identificação de que estes ciclos específicos pertencem à mesma iniciativa de produção — usada apenas para rastreio coletivo (Seção 8), nunca como insumo editorial |

Não existe nenhum insumo "de lote" além da soma das entradas individuais — a IA-008 não introduz nenhum Insumo novo em relação a I-01…I-12.

---

## 6. Saídas esperadas

| Saída | Descrição |
|---|---|
| Conjunto de resultados individuais | Cada questão do lote chega ao seu próprio estado editorial (`RASCUNHO_IA`, `EM_REVISAO`, `APROVADO_EDITORIAL` ou `REPROVADO`), de forma completamente independente das demais |
| Registro de composição do lote | Identificação de quais ciclos individuais compuseram esta iniciativa de produção — apenas para fins de rastreio coletivo, sem implicar decisão coletiva |

Não há, em nenhuma hipótese, uma saída agregada do tipo "lote aprovado" ou "lote publicado" — apenas questões aprovadas ou publicadas, individualmente.

---

## 7. Responsabilidades humanas durante a produção em escala

- Realizar integralmente a auditoria independente (Etapa 12) e a homologação (Etapa 13, IA-006) de **cada questão do lote**, individualmente — nenhuma etapa é eliminada, resumida ou substituída por uma aprovação coletiva.
- Decidir a publicação (IA-007) **por questão** — nunca existe uma decisão única de "publicar o lote inteiro"; cada questão é reconhecida como apta ao acervo separadamente.
- Reconhecer e isolar falhas: quando uma questão do lote falha em qualquer etapa (geração, integração, tratamento da resposta, validação, revisão), essa falha é tratada como pertencente **somente àquela questão** — o revisor humano continua responsável por examinar e decidir cada questão do lote de forma independente.

---

## 8. Preservação da rastreabilidade individual de cada questão

- Cada questão do lote mantém sua própria cadeia de proveniência completa — Conceito, banca, Insumos, apontamentos de IA-005, decisão humana de IA-006, decisão de publicação de IA-007 — **independentemente** das demais questões do mesmo lote.
- A referência de agrupamento (Seção 5) pode ser consultada como contexto organizacional ("estas N questões foram produzidas na mesma iniciativa"), mas **nunca substitui** a rastreabilidade individual de cada questão.
- Não existe, neste blueprint, nenhum estado editorial atribuído ao lote como um todo — apenas aos ciclos individuais que o compõem.

---

## 9. Limites da sprint

- Não define processamento paralelo, filas, workers, concorrência ou filas de mensagens.
- Não define banco de dados, API, SDK, código, classes, interfaces, funções ou pseudocódigo.
- Não define tela, workflow operacional, permissões ou notificações.
- Não automatiza revisão, homologação ou publicação — todas continuam decisões humanas individuais, por questão (Seção 7).
- Não define métricas de desempenho nem otimizações técnicas — isso é escopo de IA-009.

---

## 10. Dependências para a IA-009

| Dependência | Descrição |
|---|---|
| Modelo de produção em escala homologado | IA-009 (Otimização) depende de IA-008 já estar homologada como a forma organizacional válida de produzir múltiplas questões |
| Preservação integral dos princípios desta sprint | Qualquer refinamento futuro (métricas, custo, latência, prompts) deve continuar respeitando: agrupamento apenas organizacional, cada questão seguindo IA-001→IA-007 integralmente, e rastreabilidade individual preservada |
| Ausência de automação editorial | IA-009 não herda, desta sprint, nenhuma abertura para automatizar revisão, homologação ou publicação — essas permanecem humanas em qualquer escala |

---

## 11. Próxima sprint (não iniciada)

**IA-009 — Otimização:** observará métricas, refinará prompts e otimizará custo/latência sobre o modelo de produção em escala definido nesta sprint, sem alterar nenhuma das garantias metodológicas aqui reafirmadas. Não iniciada nesta sprint.

Aguardar revisão e homologação deste documento antes de iniciar IA-009.
