# 11 — Tratamento da Resposta (Sprint IA-004)

**Fase:** IA Editorial
**Sprint:** IA-004 — Tratamento da Resposta
**Escopo desta sprint:** especificação funcional de como a resposta bruta devolvida pela camada de integração (IA-003) é reconhecida e organizada segundo a anatomia editorial definida pelo Blueprint (IA-001). Sem parser, sem código, sem classes/funções/interfaces, sem pseudocódigo, sem JSON, sem schemas, sem banco, sem APIs, sem SDKs, sem modelo de IA, sem validação editorial, sem persistência, sem tratamento técnico de erros.

---

## 1. Objetivo do tratamento da resposta

O **Tratamento da Resposta** é a camada conceitual responsável por **reconhecer e organizar** o que a IA devolveu — recebido em estado bruto da camada de integração (IA-003) — segundo os Elementos E-01…E-10 definidos no Blueprint (IA-001, Seção 5.1).

Seu objetivo é exclusivamente **estrutural**: identificar, dentro da resposta bruta, o que corresponde a cada elemento esperado (enunciado, alternativas, gabarito, justificativa etc.), sem julgar se esse conteúdo está editorialmente correto, coerente ou bem escrito. Julgamento de mérito editorial é responsabilidade de sprints futuras (IA-005 em diante).

---

## 2. Posição da IA-004 dentro do fluxo definido nas IA-001, IA-002 e IA-003

| Etapa | Sprint | O que já foi feito antes de chegar aqui | O que a IA-004 recebe |
|---|---|---|---|
| 1 | IA-001 (Blueprint) | Declarou insumos (I-01…I-12) e definiu a anatomia de saída esperada (E-01…E-10) | — |
| 2 | IA-002 (Prompt Builder) | Compôs os insumos validados em um único pacote de instrução | — |
| 3 | IA-003 (Integração) | Encaminhou o pacote a uma capacidade externa de geração e devolveu a resposta em estado bruto, com um sinal conceitual de resultado | Resposta bruta + sinal conceitual de resultado |
| 4 | **IA-004 (esta sprint)** | Reconhece e organiza a resposta bruta segundo E-01…E-10 | — |
| 5 | (futuro — IA-005) | Aplica verificação editorial preliminar sobre o conteúdo já organizado | Fora desta sprint |

A IA-004 só atua quando o sinal conceitual de resultado da IA-003 indica que uma resposta foi de fato obtida. Quando esse sinal indica falha de integração (IA-003, Seção 7), não há resposta para tratar — esse cenário é encerrado antes de chegar à IA-004.

---

## 3. Entradas esperadas

| Entrada | Origem | Observação |
|---|---|---|
| Resposta bruta | Camada de integração (IA-003) | Conteúdo devolvido pela capacidade de geração, sem qualquer interpretação prévia |
| Sinal conceitual de resultado | Camada de integração (IA-003) | Indica que uma resposta foi obtida (não uma falha de integração) |
| Referência dos Elementos esperados | Blueprint (IA-001, Seção 5.1) | Lista E-01…E-10 contra a qual a resposta é reconhecida — consultada como referência, não reinterpretada |
| Proveniência do ciclo | Prompt Builder (IA-002) / Integração (IA-003) | Preservada para rastreabilidade; a IA-004 não recria nem valida os insumos originais |

A IA-004 não recebe nem reconsulta diretamente os Insumos I-01…I-12 — seu ponto de partida é sempre a resposta já obtida, não o pedido que a originou.

---

## 4. Saídas esperadas

| Saída | Descrição | O que **não** é |
|---|---|---|
| Conteúdo organizado por Elemento | A resposta reconhecida e distribuída conceitualmente entre E-01…E-10 | Não é um objeto técnico, não é JSON, não é uma linha de banco |
| Estado editorial `RASCUNHO_IA` | Toda saída organizada nasce neste estado (IA-001, Seção 5.2) | Não é `EM_REVISAO`, `APROVADO_EDITORIAL` nem `REPROVADO` — esses estados exigem revisão humana ou verificação posterior |
| Sinal de interpretabilidade | Reconhecimento de que a resposta pôde, ou não pôde, ser organizada segundo E-01…E-10 | Não é um código de erro técnico; é um reconhecimento conceitual, distinto do sinal de resultado da IA-003 |

Nenhuma saída desta sprint afirma que o conteúdo é editorialmente válido — apenas que ele **existe e foi localizado** na posição correspondente a cada Elemento esperado.

---

## 5. Verificações conceituais iniciais

Estas verificações são de **presença e correspondência estrutural**, não de mérito editorial:

- A resposta contém algo reconhecível para cada Elemento obrigatório (E-01…E-10), ou a ausência de um deles é constatada?
- A resposta corresponde ao que foi solicitado no pacote de instrução (mesmo ciclo, mesma proveniência), sem indício de ser resposta de outro pedido?
- Não há conflito estrutural evidente dentro da própria resposta (por exemplo, mais de um gabarito indicado para a mesma questão)?

**Distinção obrigatória:** estas verificações **não avaliam** se o enunciado é claro, se os distratores são plausíveis, se a justificativa está tecnicamente correta ou se o estilo condiz com a banca — isso é validação editorial, fora de escopo desta sprint e reservado à IA-005.

---

## 6. Responsabilidades desta sprint

- Definir o que significa, conceitualmente, "reconhecer" cada Elemento E-01…E-10 dentro de uma resposta bruta.
- Definir a lista de verificações iniciais de presença e correspondência estrutural (Seção 5).
- Definir que toda saída organizada nasce em estado `RASCUNHO_IA`, sem exceção.
- Preservar a proveniência do ciclo (ligação com o pacote de instrução e os insumos que o originaram) através da organização da resposta.
- Definir o sinal de interpretabilidade que orienta se um ciclo segue para IA-005 ou é encerrado por falta de correspondência estrutural.

---

## 7. Limites da sprint

- Não define nenhum mecanismo de reconhecimento (parser, expressão de busca, extração de texto).
- Não define estrutura técnica de armazenamento do conteúdo organizado (schema, JSON, colunas).
- Não define validação editorial (clareza, plausibilidade de distratores, correção técnica) — isso é IA-005.
- Não define persistência de nenhum resultado.
- Não define tratamento técnico de erro (exceções, retry, logging) — apenas reconhece, em nível conceitual, que uma resposta pode não ser interpretável (Seção 4 e 5).
- Não define modelo de IA, provedor, API ou SDK — herdado como fora de escopo de IA-003.

---

## 8. Dependências para a IA-005

| Dependência | Descrição |
|---|---|
| Conteúdo organizado por Elemento | IA-005 aplica sua verificação preliminar sobre o conteúdo já distribuído em E-01…E-10 por esta sprint |
| Estado `RASCUNHO_IA` | IA-005 só atua sobre conteúdo neste estado; não reavalia nada que já tenha avançado para `EM_REVISAO` ou além |
| Sinal de interpretabilidade | IA-005 só recebe ciclos cuja resposta foi considerada interpretável por esta sprint; ciclos não interpretáveis são encerrados antes de IA-005 |
| Proveniência preservada | IA-005 herda a rastreabilidade construída desde IA-002/IA-003, sem precisar reconstruí-la |

---

## 9. Próxima sprint (não iniciada)

**IA-005 — Validação:** consumirá o conteúdo organizado por esta sprint para aplicar um checklist automatizado preliminar, equivalente à Etapa 12 (assistida) do processo canônico (IA-001, Seção 6). Não iniciada nesta sprint.

Aguardar revisão e homologação deste documento antes de iniciar IA-005.
