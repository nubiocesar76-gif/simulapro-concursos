# 13 — Revisão Editorial (Sprint IA-006)

**Fase:** IA Editorial
**Sprint:** IA-006 — Revisão Editorial
**Escopo desta sprint:** especificação funcional do processo humano de revisão que examina o conteúdo organizado por IA-004 e os apontamentos assistivos de IA-005, e decide seu destino editorial. Sem interface, sem telas, sem permissões, sem notificações, sem workflow operacional, sem código, sem classes/funções/interfaces, sem pseudocódigo, sem banco, sem API, sem SDK, sem modelo de IA, sem regras de publicação.

**Papel desta sprint:** a IA **apenas auxilia**. O **revisor humano decide**. A **homologação continua sendo responsabilidade humana**, sem exceção.

---

## 1. Objetivo da Revisão Editorial

A **Revisão Editorial** é o processo humano obrigatório que corresponde às Etapas 12 ("Auditoria editorial") e 13 ("Homologação") do processo canônico (IA-001, Seção 6) — as duas únicas etapas do fluxo de 13 etapas em que o papel da IA é, respectivamente, apenas preliminar-assistivo ou **nenhum**.

Seu objetivo é examinar, de forma humana e independente, o conteúdo já organizado por IA-004 (Elementos E-01…E-10) — apoiado, mas não substituído, pelos apontamentos preliminares de IA-005 — e decidir se esse conteúdo passa a existir como uma questão editorialmente válida no SimulaPro.

---

## 2. Posição da IA-006 dentro do fluxo editorial

| Etapa | Sprint | O que já foi feito antes de chegar aqui | Papel da IA-006 |
|---|---|---|---|
| 1–4 | IA-001 → IA-004 | Blueprint declarado, prompt composto, resposta obtida e organizada em E-01…E-10, estado `RASCUNHO_IA` | — |
| 5 | IA-005 (Validação) | Checklist conceitual preliminar produzido, exclusivamente assistivo | — |
| 6 | **IA-006 (esta sprint)** | Revisor humano audita de forma independente e homologa | Decisória — 100% humana |
| 7 | (futuro — IA-007) | Integra ao acervo/pacote apenas o que já foi homologado | Fora desta sprint |

A IA-006 é a **única** etapa do fluxo, desde IA-001, em que nenhuma parte da decisão é assistida por IA — todas as sprints anteriores prepararam insumos ou apontamentos; esta sprint é onde um ser humano efetivamente decide.

---

## 3. Entradas esperadas

| Entrada | Origem | Observação |
|---|---|---|
| Conteúdo organizado por Elemento (E-01…E-10) | IA-004 | Objeto central da revisão |
| Conjunto de apontamentos preliminares | IA-005 | Apoio opcional à auditoria humana — nunca vinculante |
| Rastreabilidade do ciclo | IA-002/IA-003/IA-004/IA-005 | Permite ao revisor reconstituir Conceito, banca, decisão editorial e critérios já observados |
| Referências normativas | `docs/metodologia/METODO_EDITORIAL_DE_PRODUCAO_DE_QUESTOES_V1.md`, `docs/metodologia/DOSSIE_<BANCA>_V1.md` | Base de julgamento do revisor — consultadas, não alteradas |
| Estado `RASCUNHO_IA` | IA-004/IA-005 | Pré-condição de entrada; conteúdo em outro estado não retorna a esta revisão |

---

## 4. Saídas esperadas

| Saída | Descrição | O que **não** é |
|---|---|---|
| Decisão humana de homologação | Registro conceitual de que o conteúdo foi examinado e decidido por um revisor | Não é decisão automática, não é herdada dos apontamentos de IA-005 |
| Novo estado editorial | `APROVADO_EDITORIAL` (aprovado) ou `REPROVADO` (falhou em critério editorial) | Nenhum dos dois pode ser atribuído por IA — apenas por humano |
| Indicação da etapa corretiva (quando `REPROVADO`) | Referência conceitual a qual etapa do processo canônico (IA-001, Seção 6) o ciclo deve retornar | Não é um mecanismo técnico de reabertura, não é workflow |

Nenhuma saída desta sprint constitui publicação. `APROVADO_EDITORIAL` é o teto desta sprint — a integração ao acervo é IA-007.

---

## 5. Responsabilidades do revisor humano

- Examinar o conteúdo de forma **independente** — os apontamentos de IA-005 são apoio, nunca substituto da própria leitura crítica do revisor.
- Confirmar que o conteúdo cumpre integralmente o Método Editorial V1 (missão do Cap. 1, anatomia do Cap. 2, exigências de estilo do Dossiê da banca envolvida).
- Decidir, e apenas o revisor pode decidir, entre aprovar (`APROVADO_EDITORIAL`), reprovar (`REPROVADO`) ou apontar necessidade de correção antes de nova submissão.
- Responsabilizar-se integralmente pela originalidade e pela ausência de qualquer indício de cópia ou paráfrase de questão real (IA-001, Seção 7.2) — essa é uma responsabilidade humana, não delegável.
- Homologar (Etapa 13) apenas o que já passou pela auditoria independente (Etapa 12) — as duas decisões são humanas e sequenciais, nunca simultâneas ou automáticas.

---

## 6. Relação entre validação assistida e decisão humana

- Os apontamentos de IA-005 são **insumo de apoio opcional** — o revisor não é obrigado a concordar com nenhum deles.
- O revisor pode homologar um conteúdo mesmo que IA-005 tenha apontado algum ponto de atenção, desde que examine e julgue esse ponto por si mesmo.
- O revisor pode reprovar um conteúdo mesmo que nenhum apontamento de IA-005 tenha sinalizado problema — a ausência de apontamento não é garantia de qualidade editorial.
- Em nenhuma circunstância a IA aprova, reprova ou homologa. Esses três verbos, neste blueprint, têm sujeito exclusivamente humano.

---

## 7. Transições conceituais de estado previstas pelo Método Editorial

| De | Para | Quem decide | Observação |
|---|---|---|---|
| `RASCUNHO_IA` | `EM_REVISAO` | Revisor humano | Início da auditoria independente (Etapa 12) |
| `EM_REVISAO` | `APROVADO_EDITORIAL` | Homologador | Etapa 13 — só após auditoria (Etapa 12) concluída |
| `EM_REVISAO` | `REPROVADO` | Produtor/revisor | Falha em critério editorial; retorna à etapa corretiva indicada (Seção 4) |
| `REPROVADO` | `RASCUNHO_IA` (novo ciclo) | Produtor/revisor | Reabertura conceitual do ciclo — mecanismo de reabertura não definido nesta sprint |

Estas transições são as mesmas já declaradas em IA-001, Seção 5.2 — a IA-006 não cria novos estados, apenas define quem, dentro do processo humano, opera cada transição.

---

## 8. Limites da sprint

- Não define nenhuma tela, componente de interface ou interação visual de revisão.
- Não define permissões (quem, por cargo ou papel, pode revisar ou homologar).
- Não define notificações (como o revisor é avisado de um ciclo pendente).
- Não define workflow operacional (fila de revisão, prazos, distribuição de trabalho entre revisores).
- Não define regras de publicação — isso é IA-007.
- Não define mecanismo técnico de registro da decisão (banco, schema, API).
- Não define classes, funções, interfaces ou pseudocódigo.

---

## 9. Dependências para a IA-007

| Dependência | Descrição |
|---|---|
| Conteúdo em `APROVADO_EDITORIAL` | Único estado elegível para IA-007 — nenhum outro estado é publicável |
| Rastreabilidade completa do ciclo | Conceito, banca, insumos, apontamentos de IA-005 e decisão humana de homologação, preservados até a publicação |
| Ausência de conteúdo `REPROVADO` no fluxo de publicação | IA-007 nunca recebe conteúdo que não tenha sido homologado |

---

## 10. Próxima sprint (não iniciada)

**IA-007 — Publicação:** integrará ao acervo/pacote apenas o conteúdo já homologado (`APROVADO_EDITORIAL`) por esta sprint. Não iniciada nesta sprint.

Aguardar revisão e homologação deste documento antes de iniciar IA-007.
