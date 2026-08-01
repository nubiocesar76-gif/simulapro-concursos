# 14 — Publicação Editorial (Sprint IA-007)

**Fase:** IA Editorial
**Sprint:** IA-007 — Publicação Editorial
**Escopo desta sprint:** especificação funcional de quando e sob quais condições uma questão homologada (IA-006) passa a integrar o acervo editorial oficial do SimulaPro. Sem telas, sem workflow operacional, sem permissões, sem notificações, sem banco, sem API, sem SDK, sem código, sem classes/funções/interfaces, sem pseudocódigo, sem publicação automática, sem agendamento, sem versionamento técnico.

**Papel desta sprint:** apenas conteúdo em estado `APROVADO_EDITORIAL` pode seguir para publicação. A publicação depende, sempre, de decisão humana. A publicação editorial **apenas torna a questão apta a integrar o acervo oficial** — a disponibilização ao aluno permanece responsabilidade exclusiva do pipeline já existente (Pacote → Versão → Distribuição → Assinatura), que esta sprint **não redefine, não altera e não substitui**.

---

## 1. Objetivo da Publicação Editorial

A **Publicação Editorial** é o ponto em que o caminho paralelo da Fase IA Editorial (IA-001…IA-006) **converge** com o pipeline real de questões do SimulaPro (`exam_catalog → import → questions → pacote/versão → distribuição → aluno`, IA-001 Seção 9), depois — e somente depois — de uma questão ter sido homologada por um ser humano.

Seu objetivo é exclusivamente **reconhecer essa aptidão**: uma questão que passou por `APROVADO_EDITORIAL` (IA-006) está pronta, do ponto de vista editorial, para existir no mesmo acervo onde já vivem as questões reais importadas. A Publicação Editorial não distribui, não matricula, não torna nada visível a um aluno por si mesma.

---

## 2. Posição da IA-007 dentro do fluxo editorial

| Etapa | Sprint | O que já foi feito antes de chegar aqui | Papel da IA-007 |
|---|---|---|---|
| 1–5 | IA-001 → IA-005 | Blueprint, composição, integração, tratamento da resposta e checklist assistivo | — |
| 6 | IA-006 (Revisão Editorial) | Revisor humano auditou de forma independente e homologou (`APROVADO_EDITORIAL`) | — |
| 7 | **IA-007 (esta sprint)** | Reconhece a aptidão do conteúdo homologado para integrar o acervo oficial | Convergência — decisão humana de publicar |
| 8 | (futuro — IA-008) | Orquestra múltiplos ciclos completos em lote, sem alterar as pré-condições desta sprint | Fora desta sprint |

A IA-007 é o **único** ponto do Blueprint em que o caminho da Fase IA Editorial encontra o pipeline já existente. Antes dela, nada do que a Fase IA produz tem qualquer relação técnica com `exam_catalog`, `questions`, pacotes, versões, distribuições ou assinaturas — essas entidades são apenas referenciadas conceitualmente como destino, nunca como objeto de escrita das sprints anteriores.

---

## 3. Pré-condições para publicação

| Pré-condição | Descrição |
|---|---|
| Estado `APROVADO_EDITORIAL` | **Única condição habilitante.** Nenhum conteúdo em `RASCUNHO_IA`, `EM_REVISAO` ou `REPROVADO` pode seguir para esta etapa. |
| Rastreabilidade completa do ciclo | Conceito, banca, insumos (I-01…I-12), apontamentos de IA-005 e decisão humana de homologação (IA-006) devem estar preservados até aqui. |
| Ausência de conteúdo reprovado | Nenhuma questão `REPROVADO` chega, em nenhuma hipótese, a esta sprint — isso já foi garantido por IA-006. |

---

## 4. Entradas esperadas

| Entrada | Origem | Observação |
|---|---|---|
| Conteúdo homologado (E-01…E-10) | IA-006, estado `APROVADO_EDITORIAL` | Único conteúdo aceito por esta etapa |
| Rastreabilidade/proveniência do ciclo completo | IA-002 → IA-006 | Preservada, não recriada |
| Pipeline existente de Pacote/Versão/Distribuição/Assinatura | `docs/FLUXO_PRODUCAO_PROVA.md` (já existente, somente leitura) | Referenciado como destino conceitual eventual — não é objeto de definição desta sprint |

---

## 5. Saídas esperadas

| Saída | Descrição | O que **não** é |
|---|---|---|
| Reconhecimento de aptidão para o acervo | Confirmação humana de que o conteúdo homologado está pronto para integrar o acervo oficial | Não é a integração técnica em si (mapeamento para colunas, associação a pacote/versão) — isso é decisão de implementação, fora desta sprint |
| — | — | **Não é** disponibilização ao aluno, distribuição ou assinatura — esses passos continuam exclusivamente sob responsabilidade do pipeline já existente |

**Distinção central desta sprint:**

| Publicação Editorial (IA-007) | Disponibilização ao aluno (pipeline já existente) |
|---|---|
| Reconhece que uma questão homologada está apta a integrar o acervo | Torna a questão efetivamente acessível a um aluno |
| Decisão humana, pontual, por questão | Depende de Pacote → Versão `PUBLISHED` → Distribuição `ACTIVE` → Assinatura ativa |
| Definida por esta sprint | Já existe, já documentada, **não alterada por esta sprint** |

---

## 6. Responsabilidades humanas na publicação

- Confirmar, por ação humana explícita, que uma questão já homologada (`APROVADO_EDITORIAL`) deve de fato passar a integrar o acervo oficial — homologar (IA-006) e decidir publicar podem ou não ser o mesmo ato, mas ambos permanecem exclusivamente humanos.
- Decidir a qual Pacote e Versão o conteúdo se destina, **usando o pipeline já existente e já documentado** — não um mecanismo novo criado por esta sprint.
- Garantir que nenhuma questão fora do estado `APROVADO_EDITORIAL` seja submetida a esta etapa.
- Reconhecer explicitamente que a disponibilização efetiva ao aluno depende de passos adicionais (Versão publicada, Distribuição ativa, Assinatura ativa) inteiramente geridos pelos módulos já existentes da plataforma — não por esta sprint.

---

## 7. Limites da sprint

- Não redefine, não altera e não substitui o pipeline existente de Pacote → Versão → Distribuição → Assinatura.
- Não altera o importador legado (`/admin/import`), o comando de seed (`npm run seed:questions`) nem o fluxo de PDF/transcrição (`docs/work/`).
- Não define tela, permissão, notificação ou workflow operacional de publicação.
- Não define formato técnico de integração (colunas, schema, API, SDK).
- Não define nenhuma automação de publicação — publicar é sempre um ato humano confirmado, nunca decorrência automática da homologação.
- Não define agendamento nem versionamento técnico.
- Não define classes, funções, interfaces ou pseudocódigo.

---

## 8. Dependências para a IA-008

| Dependência | Descrição |
|---|---|
| Pré-condições desta sprint preservadas | IA-008 (Geração em Lote) pode orquestrar múltiplos ciclos completos, mas cada questão individual continua sujeita às mesmas pré-condições de publicação definidas aqui (Seção 3) |
| Decisão humana de publicação, mesmo em lote | Nenhuma automação de publicação em lote pode contornar a exigência de que cada questão seja individualmente reconhecida como apta e publicada por decisão humana |
| Separação de responsabilidades | IA-008 herda a mesma fronteira desta sprint em relação ao pipeline existente — orquestração de ciclos de geração, nunca do pipeline de distribuição |

---

## 9. Próxima sprint (não iniciada)

**IA-008 — Geração em Lote:** orquestrará múltiplos ciclos completos (IA-001…IA-007) com controle de qualidade, sem alterar nenhuma das pré-condições ou responsabilidades humanas definidas nesta sprint. Não iniciada nesta sprint.

Aguardar revisão e homologação deste documento antes de iniciar IA-008.
