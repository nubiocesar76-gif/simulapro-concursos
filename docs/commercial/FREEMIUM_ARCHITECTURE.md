# FREEMIUM_ARCHITECTURE — Resolução do AUD-F01

**Fase:** 10.1 — Arquitetura da Demonstração
**Documento:** Comparação crítica de alternativas para representar a Experiência Gratuita sem quebrar a arquitetura existente
**Data:** 2026-07-15
**Escopo:** apenas documentação técnica. Nenhum código foi escrito, nenhum arquivo do sistema foi alterado, nenhum banco foi tocado, nenhuma implementação foi iniciada.

---

## 0. O problema exato a resolver

`FREEMIUM_AUDIT.md` (AUD-F01) identificou que `questions.package_version_id` é uma coluna única por questão — cada questão pertence a exatamente um `package_version`. As 20 questões escolhidas para a demo (EBSERH Nacional 2023/IBFC, `FREEMIUM_STRATEGY.md` §2) já pertencem ao `package_version` publicado do Acervo Enfermeiro. É preciso decidir como essas mesmas 20 questões (ou uma representação equivalente delas) ficam acessíveis a um usuário sem assinatura, sem contradizer esse modelo de dado nem exigir alterá-lo.

**Achado adicional desta análise, relevante para todas as alternativas:** a tabela `questions` já tem `board_id`, `subject_id`, `topic_id`, `position_id` diretamente na própria linha (não apenas via `package_version_id`) e um campo `metadata: Json | null` sem schema fixo. Isso significa que **duplicar uma questão não precisa duplicar taxonomia** — a cópia pode referenciar exatamente as mesmas entidades de banca/disciplina/assunto/cargo já existentes — e que **existe um campo já pronto para guardar metadado adicional sem alterar o schema do banco**. Essas duas características mudam a avaliação de mais de uma alternativa abaixo.

---

## 1. Alternativa A — Duplicar ~20 questões em um Package Demo próprio

Criar um `package` novo (ex.: "Demo — Acervo Enfermeiro"), com seu `package_version`, e inserir 20 novas linhas em `questions` com `package_version_id` apontando para essa versão — cada cópia referenciando os mesmos `board_id`/`subject_id`/`topic_id`/`position_id` das questões originais (nenhuma taxonomia nova).

| Critério | Avaliação |
|---|---|
| Complexidade | Baixa tecnicamente (inserir dado), média operacionalmente (decidir e manter processo de duplicação) |
| Impacto no banco | Dado novo apenas — 1 `package`, 1 `package_version`, 20 linhas de `questions`. Nenhuma mudança de schema |
| Impacto na arquitetura | Nenhum — usa o modelo package → version → questions exatamente como já existe |
| Impacto no Admin | Aparece como mais um pacote na lista existente — visível, editável, sem mudança de tela |
| Impacto no Portal do Aluno | Nenhum — distribuição/assinatura funcionam como qualquer outra |
| Impacto no Importador | As 20 questões não entram pelo pipeline de importação de provas novas — inserção pontual e manual, fora do fluxo normal |
| Impacto nas Publicações | Reaproveita o ciclo `DRAFT → READY → PUBLISHED` já existente, sem alteração |
| Impacto em Distribuições | Requer 1 `content_distribution` nova apontando para o `package_version` demo — sem mudança de schema |
| Impacto em Assinaturas | `subscriptions` aponta para essa distribuição como qualquer outra — sem mudança de schema |
| Impacto em manutenção | **Ponto fraco central:** se uma questão original for corrigida (erro de gabarito, texto), a cópia demo não é atualizada automaticamente — exige processo manual de sincronização |
| Escalabilidade | Boa, mas cada novo curso (ex.: Técnico de Enfermagem) exige repetir a duplicação manualmente |
| Risco de inconsistência | Alto, se não houver processo/rastreabilidade de que cópia veio de qual original |
| Duplicação de dados | Sim, literal (as questões, não a taxonomia) |
| Reaproveitamento | Alto — usa 100% do modelo package/version/distribution/subscription já existente |
| Expansão para Técnico de Enfermagem | Viável, mesmo esforço de curadoria e duplicação repetido |
| Expansão para outros cursos | Mesma lógica, escala linearmente com esforço manual |

**Risco escondido a explicar:** parece simples porque não mexe em nada além de dado — mas gera uma dívida técnica silenciosa: nada, hoje, liga a cópia demo de volta à questão original. Uma correção editorial feita no Acervo pago pode nunca chegar à demo, e ninguém seria avisado disso.

---

## 2. Alternativa B — Criar um Package Version Demo (dentro do mesmo Package do Acervo Enfermeiro)

Em vez de um `package` novo, criar apenas uma nova `package_version` (ex.: "Demo") dentro do package "Banco de Questões Enfermagem" já existente, com as 20 questões duplicadas apontando para essa versão.

| Critério | Avaliação |
|---|---|
| Complexidade | Similar à A, ligeiramente menor (não cria `package` novo) |
| Impacto no banco | 1 `package_version` + 20 linhas duplicadas — mesma natureza da A |
| Impacto na arquitetura | Nenhuma mudança estrutural, mas **usa o conceito de "versão" fora do sentido pretendido** — versões existem para representar evolução incremental do mesmo conteúdo (v1.0 → v1.1 com mais questões), não um subconjunto paralelo permanente |
| Impacto no Admin | A tela de "Package Versions" passaria a listar, lado a lado, versões reais de produção (v1.0) e uma versão "Demo" que nunca evolui — risco real de confusão operacional (alguém publicar/arquivar a versão errada) |
| Impacto no Portal do Aluno | Nenhum |
| Impacto no Importador | Mesmo caso da A — fora do pipeline natural |
| Impacto nas Publicações | Reaproveita o ciclo de publicação, mas o distorce semanticamente (uma "versão" que não é uma evolução) |
| Impacto em Distribuições/Assinaturas | Igual à A |
| Impacto em manutenção | Mesmo risco de divergência da A, **mais** o risco de confusão semântica administrativa |
| Escalabilidade | Pior que A no longo prazo — cada pacote pago acumularia uma "versão demo" própria, poluindo seu histórico real de versões |
| Risco de inconsistência | Alto (igual A) + risco de erro humano no Admin |
| Duplicação de dados | Sim, igual A |
| Reaproveitamento | Alto, mas à custa de forçar um uso não pretendido do conceito de versão |
| Expansão para Técnico de Enfermagem / outros cursos | Viável, mas cada curso pago ganharia sua própria versão "estranha" misturada ao histórico real |

**Risco escondido a explicar:** parece a alternativa "mais integrada" por não criar um pacote novo — mas essa integração é exatamente o problema: mistura, no mesmo espaço administrativo, algo que é promocional (a demo) com algo que é o produto de verdade (as versões reais do Acervo), aumentando a chance de erro operacional silencioso.

---

## 3. Alternativa C — Criar um Package Demo separado (independente do curso Enfermagem)

Um `package` (e possivelmente um `course` próprio) inteiramente à parte, não vinculado ao curso "Enfermagem" existente — um catálogo demo autônomo.

| Critério | Avaliação |
|---|---|
| Complexidade | Maior que A/B — exige decidir se a taxonomia (disciplina/assunto/banca/cargo) é reaproveitada ou recriada |
| Impacto no banco | 1 `package` + `package_version` + 20 questões duplicadas + risco de precisar duplicar também `subjects`/`topics`/`position` se não reaproveitar as entidades reais |
| Impacto na arquitetura | Risco de fragmentar a taxonomia unificada — se a demo referenciar disciplinas/assuntos "próprios" em vez dos reais, os filtros e relatórios de desempenho por disciplina divergem entre a demo e o produto pago |
| Impacto no Admin | Mais uma entrada de "Package" claramente separada — evita a confusão da B, mas com mais peso estrutural que A |
| Impacto no Portal do Aluno | Nenhum, desde que a distribuição/assinatura seja montada corretamente |
| Impacto no Importador | Mesmo caso de A/B |
| Impacto nas Publicações | Ciclo de publicação próprio e isolado — não polui o histórico do pacote real (vantagem sobre B) |
| Impacto em Distribuições/Assinaturas | Igual às demais |
| Impacto em manutenção | Mesmo risco de divergência de conteúdo de A, **mais** o risco de divergência de taxonomia se não reaproveitar `subject_id`/`topic_id`/`board_id`/`position_id` reais |
| Escalabilidade | Pior entre as quatro — cada novo curso exigiria repetir todo o aparato (package + possivelmente taxonomia) |
| Risco de inconsistência | Alto (conteúdo) e potencialmente alto (taxonomia), a depender da decisão de reaproveitamento |
| Duplicação de dados | Potencialmente maior que A/B, se a taxonomia também for duplicada |
| Reaproveitamento | O menor das quatro alternativas |
| Expansão para Técnico de Enfermagem / outros cursos | Pior — repete todo o aparato a cada curso, com risco de taxonomia divergente a cada repetição |

**Risco escondido a explicar:** parece a mais "limpa" por estar totalmente isolada — mas esse isolamento é ilusório se a intenção for continuar mostrando banca/disciplina/assunto reais na demo (o que a estratégia comercial exige, para a demo parecer genuína). Isolar demais gera exatamente o oposto de "reaproveitar a arquitetura existente".

---

## 4. Alternativa D — Criar uma Distribuição Demo (sem duplicar questões)

Não duplicar nada — criar apenas uma `content_distribution` nova apontando para o **mesmo** `package_version_id` já publicado do Acervo Enfermeiro, restringindo o acesso a um subconjunto de 20 questões apenas na camada de aplicação (uma lista de IDs mantida fora do banco, ex.: em um arquivo de configuração).

| Critério | Avaliação |
|---|---|
| Complexidade | A mais simples em termos de **dado** (zero duplicação, zero package/version novos) — mas desloca toda a complexidade para a **lógica de acesso** |
| Impacto no banco | Mínimo — só 1 `content_distribution` nova. Mas a lista de 20 IDs permitidos não tem onde morar no banco sem alterar schema — teria que viver em código (ex.: um array análogo a `COMMERCIAL_PLANS`) |
| Impacto na arquitetura | **O maior de todas as alternativas.** Hoje, uma distribuição = um `package_version_id` inteiro; todo aluno com assinatura ativa numa distribuição vê todas as questões daquele version. Esta alternativa introduz uma exceção a essa regra — uma distribuição "parcial" — dentro da mesma lógica (`getSessionQuestions`, `validateSessionAccess`) usada por **todo aluno pagante hoje** |
| Impacto no Admin | A restrição de 20 questões ficaria invisível no painel administrativo — nenhuma tela mostraria quais questões realmente compõem a demo, só o código saberia |
| Impacto no Portal do Aluno | A lógica de sessão de estudo precisaria de uma condicional a mais ("esta distribuição é a Demo? Se sim, restrinja a X questões") — tocando o caminho compartilhado com assinantes pagos |
| Impacto no Importador | Nenhum |
| Impacto nas Publicações | Nenhum — reaproveita a versão já publicada |
| Impacto em Distribuições | Introduz uma semântica nova ("distribuição parcial") que não existe hoje |
| Impacto em Assinaturas | Sem mudança de schema, mas a diferenciação "isso é demo" depende de uma comparação de ID em código, não de um dado explícito |
| Impacto em manutenção | Zero duplicação de conteúdo (ótimo), mas troca esse ganho por uma regra de negócio escondida em código e por uma lógica de acesso mais complexa e com mais superfície de bug |
| Escalabilidade | Boa em teoria (zero duplicação por curso novo), mas cada exceção nova aumenta a complexidade da lógica central de acesso |
| Risco de inconsistência | Baixo para o conteúdo (nunca diverge — é a mesma questão), **médio-alto para o comportamento** (uma mudança na lógica compartilhada de acesso é mais arriscada do que isolar dado em um pacote à parte) |
| Duplicação de dados | **Nenhuma — é o único ponto inequivocamente forte desta alternativa** |
| Reaproveitamento | Alto em dado, baixo em lógica — exige tocar código compartilhado com todos os assinantes pagantes |
| Expansão para Técnico de Enfermagem / outros cursos | Tecnicamente fácil (nova lista de IDs), mas cada expansão acumula mais exceções na lógica central |

**Risco escondido a explicar:** é a alternativa que mais parece "elegante" — zero duplicação de dado é um argumento genuinamente forte. Mas é exatamente aqui que a Fase 10.1 pediu cautela: "não alterar arquitetura" significa, sobretudo, não tocar na lógica de acesso que hoje é usada por todo aluno pagante. Introduzir uma exceção ali, para servir a um caso de uso promocional, é o tipo de mudança que **parece pequena no código e grande no risco** — qualquer bug de fronteira nessa lógica afeta clientes que já pagam, não só o visitante da demo.

---

## 5. Alternativa E — Alternativa A com rastreabilidade via `metadata` (proposta desta análise)

Mesma estrutura da Alternativa A (Package Demo próprio, 20 questões duplicadas, mesmas referências reais de `board_id`/`subject_id`/`topic_id`/`position_id`), **mais** um uso deliberado do campo `metadata: Json | null` — já existente em `questions`, sem exigir nenhuma alteração de schema — para gravar, em cada cópia demo, uma referência ao `id` da questão original (ex.: `{"demo_source_question_id": "<uuid da questão original>"}`).

| Critério | Avaliação |
|---|---|
| Complexidade | Igual à A — o campo `metadata` já existe, preenchê-lo é uma linha a mais no mesmo processo de inserção |
| Impacto no banco | Idêntico à A — nenhuma coluna nova, `metadata` já é `Json` livre |
| Impacto na arquitetura | Nenhum — mesma reutilização total do modelo já existente |
| Impacto no Admin | Idêntico à A, com um ganho silencioso: uma consulta futura (mesmo manual, via SQL) já consegue encontrar "todas as cópias demo e de qual questão vieram", sem precisar de nenhuma tela nova |
| Impacto no Portal do Aluno | Nenhum |
| Impacto no Importador | Mesmo caso da A |
| Impacto nas Publicações | Igual à A |
| Impacto em Distribuições/Assinaturas | Igual à A |
| Impacto em manutenção | **Resolve o ponto fraco central da A** — uma correção na questão original passa a ser localizável na cópia demo por uma consulta simples (`metadata->>'demo_source_question_id' = <id original>`), em vez de depender de memória humana |
| Escalabilidade | Igual à A, com o processo de duplicação futura (Técnico de Enfermagem, outros cursos) já nascendo rastreável desde o primeiro caso |
| Risco de inconsistência | Reduzido em relação à A — a divergência ainda pode acontecer (a sincronização continua manual), mas deixa de ser **invisível** |
| Duplicação de dados | Sim, mesma da A — esta alternativa não elimina a duplicação, apenas a torna administrável |
| Reaproveitamento | Máximo entre todas — reaproveita o modelo inteiro (A) e reaproveita também um campo já existente (`metadata`) em vez de propor qualquer coisa nova |
| Expansão para Técnico de Enfermagem | Igual à A, com rastreabilidade desde o início |
| Expansão para outros cursos | Igual à A, mesma vantagem |

**Por que não é "óbvia" e precisa ser dita explicitamente:** o ganho de E sobre A é pequeno em esforço e grande em consequência — sem essa rastreabilidade, o risco de inconsistência de A é permanente e cresce a cada correção editorial futura no Acervo pago; com ela, o mesmo risco vira um problema **detectável e corrigível sob demanda**, sem precisar de nenhuma nova funcionalidade, tela ou coluna.

---

## 6. Quadro comparativo resumido

| | A | B | C | D | E |
|---|---|---|---|---|---|
| Duplica conteúdo | Sim | Sim | Sim | Não | Sim |
| Duplica taxonomia | Não | Não | Risco de sim | Não | Não |
| Toca lógica de acesso compartilhada com pagantes | Não | Não | Não | **Sim** | Não |
| Confunde histórico de versões reais | Não | **Sim** | Não | Não | Não |
| Rastreabilidade de correção | Não | Não | Não | N/A (não duplica) | **Sim** |
| Reaproveitamento da arquitetura existente | Alto | Alto | Médio | Alto (dado) / Baixo (lógica) | **Máximo** |
| Risco de inconsistência silenciosa | Alto | Alto | Alto | Baixo (mas de comportamento) | **Baixo (torna visível)** |

---

## 7. Veredito

### Alternativa recomendada: **E — Package Demo próprio, reaproveitando taxonomia real, com rastreabilidade via `metadata`.**

### Por quê

É a única alternativa que resolve o ponto fraco real de todas as demais sem introduzir um risco novo em outro lugar. A comparação deixa claro que existem dois tipos de risco em jogo — **risco de dado duplicado** (A, B, C, E) e **risco de lógica compartilhada alterada** (D) — e que o segundo é estruturalmente mais perigoso neste projeto, porque afeta todo aluno pagante, não apenas quem usa a demo. Entre as alternativas que aceitam duplicar dado, E é superior às demais porque usa um campo que **já existe** (`metadata`) para eliminar o único argumento contrário real à duplicação: a divergência silenciosa entre a cópia demo e a questão original ao longo do tempo.

### Quais foram descartadas, e por quê

- **B** foi descartada por forçar um uso indevido do conceito de "versão" (que deveria representar evolução, não um subconjunto paralelo permanente), criando risco real de erro operacional no Admin.
- **C** foi descartada por ser a que menos reaproveita a arquitetura — na melhor hipótese repete o esforço de A sem ganho; na pior, fragmenta a taxonomia unificada do produto.
- **D** foi descartada apesar de ser a única sem duplicação de dado, precisamente porque exige alterar a lógica de acesso compartilhada com todos os clientes pagantes — o tipo de mudança que a Fase 10.1 pediu explicitamente para evitar ("não alterar arquitetura"). Zero duplicação de dado não compensa o aumento de risco em um caminho crítico de receita.
- **A pura** (sem rastreabilidade) não foi descartada, mas foi **superada** por E, que a inclui integralmente e corrige seu único ponto fraco real com uma adição trivial.

### Qual preserva melhor a arquitetura construída durante todo o projeto

**E**, por dois motivos que se reforçam: (1) não introduz nenhum conceito novo — pacote, versão, distribuição e assinatura continuam significando exatamente o que significam hoje para qualquer outro conteúdo do sistema; e (2) não toca a única peça de lógica que é verdadeiramente compartilhada com quem já paga (`getSessionQuestions`/`validateSessionAccess`), que é justamente a parte da arquitetura mais cara de errar.

---

*Fim da análise. Nenhum outro documento foi alterado. Nenhum código foi escrito. Nenhuma implementação foi iniciada.*
