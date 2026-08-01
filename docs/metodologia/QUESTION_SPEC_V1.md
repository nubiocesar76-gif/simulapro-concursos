# QUESTION SPEC V1

## Objetivo e status

Contrato oficial que toda questão produzida pelo SimulaPro — em qualquer disciplina, por qualquer autor (humano ou Motor Editorial) — deve obedecer a partir desta fase. Não gera nenhuma questão, não altera o Editorial Controller nem o Editorial Queue, não modifica nenhum documento existente. É consumido por ambos: o **Controller** decide o quê produzir (Estados, Metas); o **Queue** decide a ordem (Prioridades); este documento define **a forma exata** de cada questão individual, para que Controller e Queue sempre encontrem os mesmos campos, não importa a disciplina.

Diferente dos documentos anteriores desta série, este contrato foi **verificado diretamente contra os arquivos reais do sistema** (`docs/imports/questions.csv`, `docs/seeds/questions.json`, `scripts/seed/questions/convert/columns.ts` e `validate.ts`, o schema real da tabela `questions` no Supabase, e a tabela `editorial_ai_contents` já usada pelo Motor Editorial) — não apenas definido em abstrato. A Seção 9 documenta essa verificação, incluindo duas lacunas estruturais reais encontradas e já corrigidas no próprio texto deste contrato (não são pendências).

---

# SEÇÃO 1 — IDENTIDADE DA QUESTÃO

Toda questão deve possuir, obrigatoriamente:

| Campo | Descrição |
|---|---|
| **ID único** | Formato já definido no Editorial Controller, Seção 9: `<CÓDIGO_DISCIPLINA>-<subassunto>-<sequencial 3 dígitos>`. Nunca reutilizado. |
| **Disciplina** | Nome completo da disciplina (não apenas o código do ID). |
| **Macrotema** | Conforme o Plano de Produção daquela disciplina. |
| **Assunto** | Conforme o Plano de Produção daquela disciplina. |
| **Subassunto** | Conforme o Plano de Produção daquela disciplina — mesma numeração usada no ID. |
| **Versão** | Inteiro, começando em 1; incrementa a cada reescrita (nunca uma edição in-place — reescrever gera uma nova versão, a anterior é preservada como Substituída, conforme Seção 8). |
| **Data de criação** | Timestamp da primeira redação (estado Rascunho). |
| **Status** | Um dos seis estados da Seção 8. |
| **Autor da geração** | "Motor Editorial" (quando gerada por IA via pipeline já existente) ou identificação do autor humano, quando produzida manualmente (como todas as 30 questões dos Lotes 1-3 desta série). |
| **Última revisão** | Timestamp da última mudança de estado (Seção 8), não apenas da última edição de texto. |

---

# SEÇÃO 2 — ESTRUTURA PEDAGÓGICA

| Campo | Descrição |
|---|---|
| **Objetivo pedagógico** | O que a questão pretende verificar que o candidato sabe fazer (não apenas "saber", mas a ação cognitiva esperada). |
| **Competência avaliada** | Competência do domínio profissional/técnico da disciplina (ex.: "aplicar corretamente a distribuição de competências privativas do Enfermeiro"). |
| **Habilidade exigida** | Habilidade cognitiva específica (ex.: "distinguir", "classificar", "aplicar a um cenário", "julgar a validade de uma afirmação"). |
| **Nível cognitivo** | Reconhecimento/memorização, aplicação, análise/julgamento, ou síntese — escala qualitativa livre por disciplina, desde que declarada. |
| **Aplicação prática** | Se a questão exige transposição do conceito para um cenário real (mesmo quando não é formalmente um "caso clínico" — ex.: uma questão de legislação aplicada a uma situação hipotética de fiscalização). |
| **Perfil da banca** | A banca cujo estilo real observado (formato, verbo de comando, nível de detalhe normativo) a questão reproduz — nunca uma banca aleatória; deve haver justificativa rastreável (evidência real observada, ou, na ausência dela, declaração explícita de estilo genérico, conforme já praticado desde a Fase 3.1). |

---

# SEÇÃO 3 — ESTRUTURA DA QUESTÃO

| Campo | Obrigatoriedade |
|---|---|
| **Enunciado** | Obrigatório. Mínimo de 10 caracteres (piso já validado pelo importador real, `validate.ts`). |
| **Alternativas A-E** | A e B obrigatórias sempre; C, D e E obrigatórias exceto em formatos de 2-3 alternativas legitimamente autorizados pelo perfil de banca (ex.: CEBRASPE Certo/Errado, A=Certo/B=Errado) — mesma regra já aplicada pelo importador real (`MINIMUM_ALTERNATIVE_LETTERS`). |
| **Resposta correta** | Obrigatória; deve corresponder exatamente a uma letra entre as alternativas efetivamente informadas. |
| **Justificativa técnica** | Obrigatória; explica por que a alternativa correta está certa e, preferencialmente, por que as demais estão erradas. |
| **Referência normativa** | Obrigatória sempre que a disciplina tiver base normativa (a maioria) — norma vigente, nunca revogada como fundamento (mesma regra do Editorial Controller). |
| **Referência bibliográfica** | Obrigatória apenas quando aplicável (disciplinas ou assuntos apoiados em literatura técnica não normativa, ex.: taxonomias internacionais como NANDA-I/NIC/NOC). |

---

# SEÇÃO 4 — CLASSIFICAÇÕES

**Tipo** (exatamente um por questão, controlado para diversidade pelo Editorial Queue, Seção 4):
Conceitual · Caso Clínico · Normativa · Interpretação · Raciocínio Clínico · Integração · Outro (com justificativa obrigatória de por que nenhuma das seis categorias se aplica).

**Dificuldade** (exatamente um por questão):
Fácil · Média · Difícil.

---

# SEÇÃO 5 — DISTRATORES

Cada questão deve informar o tipo de distrator usado em **cada** alternativa incorreta (não apenas um tipo geral para a questão inteira, já que uma questão de 5 alternativas costuma combinar mais de um tipo):

Erro de conceito · Erro de sequência · Erro de competência · Erro de interpretação · Erro normativo · Confusão entre classificações · Erro clínico · Outro (com justificativa).

**Regra de não repetição:** dentro do mesmo subassunto, o **mesmo tipo de distrator aplicado à mesma dupla conceito-A/conceito-B** não pode se repetir — ex.: se uma questão já usa "erro de sequência" trocando a etapa 1 pela etapa 5, uma segunda questão do mesmo subassunto pode usar "erro de sequência" novamente, mas trocando um par diferente de conceitos, nunca o mesmo par. Esta regra formaliza, em nível de distrator individual, o controle de duplicidade já definido no Editorial Controller (Seção 8) e no Editorial Queue (Seção 6).

---

# SEÇÃO 6 — QUALIDADE

Toda questão deve ser validada nas sete dimensões abaixo antes de avançar de Rascunho para Em revisão (Seção 8):

Clareza · Objetividade · Aderência normativa · Aderência ao Dossiê Mestre da disciplina · Aderência ao perfil da banca declarado (Seção 2) · Ausência de ambiguidade · Originalidade (nunca reprodução de questão real de concurso nem de outra questão já produzida pelo SimulaPro).

---

# SEÇÃO 7 — ÍNDICE DE CONFIANÇA

Mesma classificação já fixada no Editorial Controller, Seção 7 — não redefinida aqui, apenas referenciada para que este contrato não divirja daquele:

95-100% Aprovada · 90-94% Revisão obrigatória · < 90% Reescrever (gera nova Versão, Seção 1; a versão anterior vira Substituída, Seção 8).

---

# SEÇÃO 8 — CICLO DE VIDA

| Estado | Equivalência no Editorial Controller (que rastreia por subassunto, não por questão individual) |
|---|---|
| **Rascunho** | Contribui para o subassunto estar em EM PRODUÇÃO. |
| **Em revisão** | Contribui para o subassunto estar em EM REVISÃO. |
| **Aprovada** | Índice ≥ 95%; contribui para VALIDADO quando todas as questões do subassunto atingem esse patamar. |
| **Importada** | Questão efetivamente no acervo real; contribui para CONSOLIDADO e para a contagem de "questões CONSOLIDADAS" usada pelo Editorial Queue (Seção 1 daquele documento) para calcular o nível de prioridade do subassunto. |
| **Arquivada** | Já esteve Importada, removida por obsolescência posterior (ex.: norma revogada depois da aprovação) — mesma definição do Editorial Queue, Seção 5; decrementa a contagem de cobertura do subassunto. |
| **Substituída** | Versão anterior de uma questão reescrita (Seção 1); nunca apagada, nunca conta para cobertura. |

**Nota de reconciliação:** o estado de um **subassunto** (Editorial Controller, Seção 3) é sempre uma **função agregada** dos estados de suas questões individuais (esta seção) — nunca um campo independente que possa divergir. Um subassunto está VALIDADO se, e somente se, todas as suas questões Aprovadas ou Importadas estiverem, coletivamente, em Índice ≥ 95%; nenhuma inconsistência entre os dois níveis é permitida por design.

---

# SEÇÃO 9 — COMPATIBILIDADE (verificada contra os arquivos reais)

Cada campo deste contrato foi checado contra o schema real do SimulaPro. Tabela de mapeamento:

| Campo do contrato | `editorial_ai_contents` (Motor Editorial, intermediário) | `questions.csv` / `questions.json` (importador real) | `questions` (Supabase, final) |
|---|---|---|---|
| ID único | não existe hoje (campo novo) | não existe (usa `id` gerado) | `id` (uuid gerado) |
| Disciplina | indireto, via ciclo → `editorial_topics`/`editorial_disciplines` | `subject` (slug) | `subject_id` (FK) |
| Macrotema | **sem coluna dedicada** — ver correção abaixo | **sem coluna dedicada** — ver correção abaixo | **sem coluna dedicada** — ver correção abaixo |
| Assunto | aproximação via `editorial_topics` | `subject` (slug) | `subject_id` (FK) |
| Subassunto | aproximação via `editorial_topics`/`editorial_subtopics` (divergência de granularidade já documentada na Auditoria de Taxonomia da série do Motor Editorial) | `topic` (slug) | `topic_id` (FK) |
| Versão | `version` (coluna já existe) | não mapeado | não mapeado |
| Data de criação | `created_at` (já existe) | não mapeado diretamente | `created_at` (já existe) |
| Status (Seção 8) | não é o mesmo enum de `editorial_ai_cycles.status` — não confundir | `status` (`ACTIVE`/`INACTIVE`, já existe) | implícito via `package_versions.status` |
| Autor da geração | Motor Editorial é sempre o autor quando via pipeline de IA | não mapeado | não mapeado |
| Enunciado | `statement` | `statement` (CSV) / `statement` (JSON) | `statement` |
| Alternativas | `alternatives` (formato `(A) texto`) | `alternative_a`..`alternative_e` (CSV) / `alternatives[]` (JSON), formato `A) texto` — conversão de formato já resolvida pelo pipeline existente (`formatAlternativesForDb`) | `alternatives` (jsonb) |
| Resposta correta | `correct_answer` | `correct_answer` | `correct_answer` |
| Justificativa técnica | `explanation` | `explanation` | `explanation` |
| Referência normativa / bibliográfica | `bibliographic_reference` | `references` (coluna opcional já existe, aceita múltiplas referências separadas por `\|` ou `;`) | dentro de `explanation` ou `metadata` |
| Nível cognitivo / Competência (Seção 2) | `cognitive_objective` (já existe) | não mapeado diretamente | não mapeado (cabe em `metadata`) |
| Dificuldade | **sem coluna dedicada** — ver correção abaixo | **sem coluna dedicada** — ver correção abaixo | `difficulty` (coluna já existe) |
| Tipo, Distrator, Índice de Confiança (Seções 4, 5, 7) | `editorial_metadata` (jsonb, já usada hoje para `parserWarnings`) | não mapeado diretamente | `metadata` (jsonb, já existe) |

## Lacunas estruturais encontradas — e já corrigidas neste contrato

**Lacuna 1 — "Macrotema" não tem coluna em nenhuma das três camadas reais.** Correção: Macrotema é informação **exclusivamente editorial/de planejamento** (existe no Plano de Produção de cada disciplina), não precisa de coluna própria no acervo — deve ser registrado dentro do campo `metadata`/`editorial_metadata` já existente (ex.: `{"macrotema": "2. Etapas do Processo de Enfermagem"}`), nunca exigir migração de banco. Nenhuma adaptação de código é necessária para isso: o campo já é JSON livre.

**Lacuna 2 — "Dificuldade" tem coluna real no Supabase (`questions.difficulty`), mas o importador CSV/JSON atual (`REQUIRED_COLUMNS`/`OPTIONAL_COLUMNS` de `columns.ts`) não lê nenhuma coluna de dificuldade — uma questão importada hoje pelo pipeline real fica sempre com `difficulty = null`.** Esta é uma lacuna real do pipeline existente, não deste contrato, e sua correção definitiva (adicionar uma coluna `difficulty` ao CSV/JSON e ao validador) é uma mudança de código fora do escopo desta fase, que é exclusivamente documental. Correção **ao nível do contrato**, aplicável imediatamente sem tocar em código: toda questão deve registrar sua Dificuldade (Seção 4) também dentro de `keywords` (coluna opcional já existente e já lida pelo importador, ex.: incluir `dificuldade:facil` como uma das keywords) — garantindo que a informação nunca se perca, mesmo antes de o importador ganhar suporte nativo à coluna dedicada. Esta lacuna deve ser registrada como pendência técnica real para uma fase futura de implementação (fora do escopo aqui).

## Nota sobre atribuição de pacote/versão (`package`/`package_version`)

O importador real trata `package` e `package_version` como **obrigatórios sem exceção** — uma questão sem os dois campos entra órfã no banco (`package_version_id` nulo), fora de qualquer distribuição publicada (a própria documentação do validador real registra isso como "causa raiz do incidente SESACRE"). Este contrato **não define** como package/versão são atribuídos — essa atribuição acontece na etapa de publicação/convergência, já implementada em `src/lib/editorial-ai/publish/convergence.server.ts` (Sprint 7.1A), posterior à redação e aprovação da questão. Nenhuma questão em estado Rascunho, Em revisão ou Aprovada (Seção 8) precisa ter package/versão definidos — apenas ao chegar em Importada.

---

# SEÇÃO 10 — REGRAS GERAIS

Nenhuma questão pode ser importada sem, simultaneamente:

✓ ID único atribuído (Seção 1) · ✓ Referência normativa (ou bibliográfica, quando aplicável) preenchida (Seção 3) · ✓ Justificativa técnica preenchida (Seção 3) · ✓ Índice de Confiança calculado e ≥ 95% (Seção 7) · ✓ Status = Aprovada (Seção 8) · ✓ Sem duplicidade (Seção 5 deste documento e Editorial Controller, Seção 8).

Idêntico, em espírito e em critérios, à Fila de Importação já definida no Editorial Queue, Seção 6 — este documento define os campos verificados; aquele define o fluxo que os verifica.

---

# SEÇÃO 11 — VALIDAÇÃO FINAL

Teste de representação para combinações de disciplina/banca/nível/tipo de concurso:

- **Disciplina com forte base normativa (ex.: Processo de Enfermagem, Legislação do SUS):** Seção 3 (Referência normativa) e Seção 6 (Aderência normativa) cobrem plenamente; nenhum campo extra necessário.
- **Disciplina sem base normativa forte (ex.: Português, Raciocínio Lógico):** "Referência normativa" (Seção 3) simplesmente fica não aplicável para essas questões, e "Referência bibliográfica" assume o papel principal — o contrato já prevê essa alternância ("quando aplicável"), sem exigir campo condicional adicional.
- **Banca com formato binário (CEBRASPE, Certo/Errado):** já coberto pela regra de alternativas mínimas (Seção 3, A e B obrigatórias, C-E dispensáveis) — testado empiricamente nos Lotes 2 e 3 desta série, adaptado para A-E por exigência daquelas fases, mas o contrato aceita nativamente o formato binário puro também.
- **Questão de integração entre múltiplos assuntos** (já produzida na Fase 3.2, Questão 10): coberta pelo Tipo "Integração" (Seção 4); o campo Subassunto (Seção 1) registra o subassunto primário, e a Justificativa técnica (Seção 3) declara os subassuntos secundários envolvidos — sem necessidade de um campo estruturado adicional, já que a integração é, por natureza, o caso menos frequente e mais textual dos sete tipos.
- **Questão gerada pelo Motor Editorial (IA) vs. produzida manualmente:** "Autor da geração" (Seção 1) diferencia os dois casos; todos os demais campos do contrato são idênticos para ambos — o contrato não distingue questão por origem além desse único campo, propositalmente, para que Controller e Queue tratem as duas origens de forma unificada.
- **Escala (10 disciplinas, 500 assuntos, 5.000 subassuntos, 50.000 questões, conforme já validado no Editorial Queue, Seção 10):** nenhum campo deste contrato depende do tamanho total do acervo — cada questão carrega sua própria identidade e classificação de forma autocontida, sem necessidade de consulta cruzada além do próprio subassunto (mesma lógica de escala já comprovada sem gargalo no Queue).

**Nenhuma lacuna estrutural adicional identificada** além das duas já registradas e corrigidas na Seção 9. O contrato representa qualquer questão produzida pelo SimulaPro, independentemente de disciplina, banca, nível ou tipo de concurso.

## Encerramento

Arquivo criado: `docs/metodologia/QUESTION_SPEC_V1.md`. Nenhum documento anterior alterado, incluindo Editorial Controller e Editorial Queue. Nenhuma questão gerada. Parando aqui, conforme solicitado.
