# 10 — Camada de Integração com IA (Sprint IA-003)

**Fase:** IA Editorial
**Sprint:** IA-003 — Integração com IA
**Escopo desta sprint:** especificação funcional da camada que recebe o pacote de instrução composto pelo Prompt Builder (IA-002) e o encaminha a uma capacidade externa de geração por IA. Sem provedor específico, sem SDK, sem API, sem autenticação, sem variáveis de ambiente, sem classes/funções/interfaces, sem pseudocódigo, sem formatos de requisição/resposta, sem JSON, sem banco, sem fila, sem cache, sem implementação.

---

## 1. Objetivo da camada de integração

A **camada de integração** é a **fronteira arquitetural** entre o que o SimulaPro decide (o quê pedir, com quais insumos, sob quais limites — IA-001 e IA-002) e o que uma capacidade externa de geração de texto por IA efetivamente devolve.

Sua única finalidade é **isolar** o restante do sistema de qualquer detalhe sobre *como* um pacote de instrução alcança uma IA e *como* uma resposta bruta volta de lá. Ela não decide, produz ou avalia conteúdo editorial — apenas transporta, através de uma fronteira, algo que já foi inteiramente composto por IA-002 e que será inteiramente interpretado por uma sprint futura (IA-004).

---

## 2. Responsabilidades

- Receber, como entrada única, o pacote de instrução já composto pelo Prompt Builder (IA-002).
- Ser o único ponto conceitual do sistema responsável por externalizar esse pacote para uma capacidade de geração de texto por IA.
- Devolver a resposta bruta obtida, sem qualquer interpretação, correção ou reformatação editorial.
- Isolar o Blueprint (IA-001), o Prompt Builder (IA-002) e as sprints seguintes (parse, validação, revisão) de qualquer conhecimento sobre qual provedor, protocolo ou mecanismo de comunicação existe por trás dessa fronteira.
- Reconhecer, em nível conceitual, quando uma tentativa de geração não foi bem-sucedida (Seção 7) — sem decidir como o sistema deve reagir a isso.

---

## 3. Limites

- Não decide qual provedor de IA será usado, nem quantos provedores existirão.
- Não decide qual modelo de IA será usado.
- Não define protocolo de comunicação, autenticação, credenciais ou variáveis de ambiente.
- Não define formato de requisição nem formato de resposta (texto, JSON ou qualquer outro).
- Não interpreta, corrige, resume ou reformata o conteúdo devolvido — isso pertence a IA-004.
- Não decide política de nova tentativa (retry), custo, limite de uso ou tempo de espera — apenas reconhece conceitualmente que esses fatores existirão em uma implementação futura.
- Não define classes, funções, interfaces ou pseudocódigo.
- Não persiste nada, não usa fila, não usa cache.
- Não altera banco, API ou telas existentes.

---

## 4. Entradas

| Entrada | Origem | Observação |
|---|---|---|
| Pacote de instrução composto | Prompt Builder (IA-002) | Única entrada aceita por esta camada; deve chegar completo, já validado quanto a insumos obrigatórios (IA-002, Seção 3) |
| Proveniência do pacote | Prompt Builder (IA-002) | Acompanha o pacote para fins de rastreabilidade; não é reinterpretada aqui |

Nenhum insumo bruto do Blueprint (IA-001, I-01…I-12) chega diretamente a esta camada — tudo deve ter passado antes pela composição de IA-002.

---

## 5. Saídas

| Saída | Descrição | O que **não** é |
|---|---|---|
| Resposta bruta | O conteúdo devolvido pela capacidade de geração de IA, em sua forma original, sem interpretação | Não é uma questão editorial estruturada; não é E-01…E-10 mapeados |
| Sinal conceitual de resultado | Reconhecimento de que a tentativa de geração completou ou não completou | Não é um código de erro técnico, não é um schema, não é um status de banco |

A extração e o mapeamento da resposta bruta para os Elementos E-01…E-10 (IA-001, Seção 5.1) são responsabilidade exclusiva de IA-004 — não ocorrem nesta camada.

---

## 6. Fluxo conceitual entre IA-001, IA-002 e a futura integração

| Etapa | Sprint responsável | O que acontece | O que explicitamente não acontece aqui |
|---|---|---|---|
| 1 | IA-001 (Blueprint) | Declara insumos (I-01…I-12), regras e limites do ciclo editorial | Não compõe prompt, não integra IA |
| 2 | IA-002 (Prompt Builder) | Compõe os insumos validados em um pacote de instrução único | Não envia, não chama nenhuma capacidade externa |
| 3 | IA-003 (esta sprint) | Recebe o pacote composto e representa a fronteira até uma capacidade externa de geração; devolve a resposta bruta | Não interpreta a resposta, não decide o provedor, não implementa a chamada |
| 4 | (futuro — IA-004) | Interpreta e mapeia a resposta bruta para os Elementos E-01…E-10 | Fora desta sprint |

A fronteira representada por IA-003 existe precisamente para que as sprints 1, 2 e 4 nunca precisem conhecer detalhes de *como* a geração externa ocorre — apenas que ela ocorre, através deste ponto único.

---

## 7. Tratamento conceitual de falhas

Esta camada reconhece, em nível arquitetural, três categorias conceituais de falha — sem definir mecanismo, política ou implementação para nenhuma delas:

| Categoria | Descrição conceitual |
|---|---|
| **Falha de disponibilidade** | A capacidade externa de geração não responde dentro do que seria esperado |
| **Falha de conteúdo** | A capacidade externa devolve algo incompatível com o que foi solicitado, ou se recusa a gerar |
| **Falha de limite** | A capacidade externa não pode ser acionada no momento (limite de uso, indisponibilidade prolongada) |

Em qualquer caso, a camada de integração **apenas sinaliza** a ocorrência de falha ao restante do sistema — não decide nova tentativa, não decide provedor alternativo, não decide como o ciclo editorial deve reagir. Essas decisões pertencem a sprints de implementação futuras.

**Distinção importante:** uma falha nesta camada é **anterior e distinta** dos estados editoriais definidos no Blueprint (`RASCUNHO_IA`, `EM_REVISAO`, `APROVADO_EDITORIAL`, `REPROVADO` — IA-001, Seção 5.2). Esses estados só se aplicam a conteúdo editorial que efetivamente foi gerado e chegou a ser avaliado; uma falha de integração significa que nenhum conteúdo editorial chegou a existir para esse ciclo.

---

## 8. Dependências das próximas sprints

| Sprint | Depende de IA-003 para | Observação |
|---|---|---|
| IA-004 — Tratamento da Resposta | Receber a resposta bruta e o sinal conceitual de resultado desta camada | Não iniciada nesta sprint |
| IA-005 — Validação | Indiretamente, depende de IA-004 já ter interpretado a resposta que IA-003 devolveu | Fora de escopo |
| IA-006 em diante | Dependem transitivamente da cadeia acima estar completa e homologada | Fora de escopo |

Esta própria sprint (IA-003) depende de IA-001 e IA-002 já homologadas — condição já satisfeita.

---

## 9. Próxima sprint (não iniciada)

**IA-004 — Tratamento da Resposta:** consumirá a resposta bruta e o sinal conceitual de resultado desta camada para interpretar, normalizar e mapear o conteúdo para os Elementos E-01…E-10. Não iniciada nesta sprint.

Aguardar revisão e homologação deste documento antes de iniciar IA-004.
