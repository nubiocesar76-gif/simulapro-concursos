# 07 — Estruturas Prontas para PostgreSQL, Supabase, IA e Motor Editorial

Conceitual — sem DDL, sem migration, sem JSON definitivo. O objetivo é
descrever a forma que cada estrutura deve assumir quando for
implementada, e onde ela se encaixa no que **já existe** no projeto
(`supabase/migrations/20260708090000_exam_catalog.sql` já tem `boards` e
`positions` como tabelas referenciadas por `exam_catalog` — ou seja, parte
do modelo genérico já existe na prática e a Fase 3 formaliza o resto ao
redor dela).

## 1. Estrutura pronta para PostgreSQL

### 1.1 Famílias de tabelas (grupos lógicos, não DDL)

| Grupo | Tabelas | Papel |
|---|---|---|
| Catálogo da Engine | `editorial_modules`, `engine_versions` | Estático, mantido pelo time do produto, não pelo curador de conteúdo |
| Identidade de curso | `courses`, `positions`, `course_module_activation` | Define "quem" está usando a Engine |
| Taxonomia | `disciplines`, `course_disciplines`, `topics`, `subtopics`, `keywords` | O esqueleto de conteúdo, já testado em Enfermagem |
| Vocabulário | `synonyms`, `acronyms` | Escopados por `course_id` nulável |
| Referência normativa | `editorial_references`, `reference_topics`, `reference_courses` | Substitui as 4 tabelas fixas do V1 |
| Motor de classificação | `classification_rules`, `ambiguous_cases`, `co_occurrence` | Consumido pelo classificador |
| Bancas | `exam_boards` (~ já existe como `public.boards`), `board_course_profiles` | Perfil global + perfil por curso |
| Evidência e confiança | `evidences`, `entity_confidence_snapshots` | Alimenta o recálculo de `confidence` |
| Versionamento | `entity_changelog`, `entity_versions` | Histórico append-only |
| Pipeline de ingestão (já existe) | `exam_catalog`, `exam_files` | Não muda; passa a alimentar `evidences` |

### 1.2 Relacionamentos-chave (cardinalidade)

- `courses (1) → (N) positions`
- `courses (N) ↔ (N) disciplines` via `course_disciplines` (permite
  disciplina `TRANSVERSAL` compartilhada)
- `disciplines (1) → (N) topics (1) → (N) subtopics (1) → (N) keywords`
- `editorial_modules (1) → (N) editorial_references`
- `editorial_references (N) ↔ (N) topics` via `reference_topics`
- `editorial_references (N) ↔ (N) courses` via `reference_courses` (só
  preenchido quando a referência vale para mais de um curso)
- `exam_boards (1) → (N) board_course_profiles (N) → (1) courses`
- Toda entidade de conteúdo (`disciplines`, `topics`, `subtopics`,
  `classification_rules`) tem `(1) → (N) evidences` e `(1) → (N)
  entity_changelog`

### 1.3 Uso de tipagem polimórfica com disciplina (JSONB) em vez de tabelas por módulo

`editorial_references.detalhes` é o único ponto do modelo que usa um campo
semiestruturado (JSONB), porque cada módulo precisa de um subconjunto de
campos diferente (Fórmulas precisa de `expressao`/`variaveis`;
Jurisprudência precisa de `tribunal`/`numero_processo`). Isso é uma
decisão deliberada: criar uma tabela física por módulo (ex.:
`referencias_farmacologicas`, `referencias_juridicas`) reintroduziria o
mesmo problema do V1 (schema acoplado a domínio). O contrato de quais
chaves são esperadas dentro do JSONB por módulo vive em
`editorial_modules.schema_extra` (metadado, validado na camada de
aplicação/Motor Editorial, não no schema do banco).

### 1.4 Enums que passam a ser catálogos (tabelas), não `ENUM` do Postgres

No V1, categorias como `categoria_sigla` ou `tipo_legislacao` eram `ENUM`
fechados (bom para Enfermagem sozinha, ruim para extensibilidade). Em V2,
viram tabelas de catálogo (`acronym_categories`, `reference_subtypes`)
para que um curso novo possa propor uma categoria nova (ex.: Direito
propõe `SIGLA_PROCESSUAL`) sem exigir uma migration de `ALTER TYPE`.
Exceção: enums realmente universais e estáveis (`prioridade`:
ALTA/MEDIA/BAIXA; `status` do ciclo de vida da seção 4 do arquivo 03)
continuam como `ENUM` nativo — não há benefício em generalizar o que já é
universal.

## 2. Estrutura pronta para Supabase

### 2.1 Alinhamento com o que já existe

O projeto já usa o padrão Supabase de `has_role(auth.uid(), 'admin')` para
políticas de RLS (visto em `exam_catalog`/`exam_files`). O mesmo padrão se
estende a todas as tabelas novas: apenas `admin` escreve taxonomia/regras;
leitura pode ser liberada por curso para usuários autenticados que têm
aquele curso habilitado no plano (mesma lógica de acesso por assinatura já
usada no restante do produto).

### 2.2 Multi-tenancy por curso via RLS, não por schema separado

Em vez de criar um schema Postgres por curso (o que quebraria a promessa
de "uma Engine só"), o isolamento é feito por `course_id` como coluna +
política de RLS que filtra por curso habilitado na assinatura do usuário
(quando a leitura for exposta a não-admins, ex. um painel de transparência
editorial por curso).

### 2.3 Realtime e trigger de auditoria

Reaproveita o padrão já existente (`trg_exam_catalog_updated` com
`update_updated_at_column()`): toda tabela de conteúdo genérico ganha o
mesmo trigger de `updated_at`, e adicionalmente um trigger de
`entity_changelog` (grava um diff antes de aceitar o `UPDATE`) — mesma
filosofia dos triggers já presentes na migration de exam_catalog, só
estendida para gravar o changelog em vez de só o timestamp.

### 2.4 Storage

Nenhuma mudança necessária: `exam_files`/storage_path já é genérico
(qualquer prova, de qualquer curso, usa o mesmo bucket com
`storage_folder` por `exam_catalog.slug`). A Fase 3 não introduz nenhum
novo tipo de arquivo binário.

### 2.5 Funções RPC sugeridas (nome + propósito, não implementação)

| Função | Propósito |
|---|---|
| `classify_question(text, course_id)` | Roda as regras de classificação ativas do curso e devolve candidatos com confiança |
| `recalculate_confidence(entity_type, entity_id)` | Recalcula `confidence`/`evidenceCount` a partir da tabela `evidences` |
| `suggest_merge_candidates(course_id)` | Roda a rotina de detecção de duplicidade (arquivo 04, §3.3) e devolve pares candidatos a merge |
| `activate_module(course_id, module_id)` | Insere/atualiza `course_module_activation` com validação de pré-requisitos do módulo |

## 3. Estrutura pronta para IA

### 3.1 Onde a IA entra no ciclo (papéis, não implementação)

| Papel da IA | Insumo | Saída | Como afeta o modelo |
|---|---|---|---|
| Classificador de questões novas | Texto da questão + `keywords`/`classification_rules` do curso | Sugestão de `discipline_id`/`topic_id`/`subtopic_id` + confiança do próprio modelo | Vira `Evidence` tipo `SUGESTAO_IA`, nunca escreve direto em `PUBLICADO` |
| Extrator de taxonomia a partir de edital/prova nova | PDF de edital/prova | Propostas de `Discipline`/`Topic`/`Subtopic` novos | Entram como `origin = AI_SUGGESTED`, `status = PROPOSTO` |
| Detector de duplicidade/ambiguidade | Conjunto de registros de um curso | Pares candidatos a `AmbiguousCase` ou merge | Alimenta o Sistema de Evolução (arquivo 04, §3) |
| Gerador de questões inéditas no estilo de uma banca | `BoardCourseProfile` + dossiê de assunto | Questão + gabarito propostos | Consumidor da taxonomia, não produtor — não escreve na taxonomia |

### 3.2 Por que os campos de metadados/confiança já são "prontos para IA"

O desenho de `origin`, `confidence`, `evidenceCount` e `sources` (arquivo
04) foi feito justamente para que uma sugestão de IA e uma curadoria
humana sejam **cidadãs de primeira classe do mesmo jeito**, diferenciadas
apenas pelo valor desses campos — não é necessário nenhum campo adicional
"é_de_ia" ad-hoc; `sources[].tipo = 'SUGESTAO_IA'` já resolve isso.

### 3.3 Superfície para embeddings/busca semântica (quando adotado)

Os campos textuais mais estáveis para geração de embedding, por entidade:
`Subtopic.nome + descricao`, `Keyword.termo`, `EditorialReference.nome +
detalhes`. Recomenda-se guardar o vetor em uma tabela satélite
(`entity_embeddings: entity_type, entity_id, embedding, model_version`) —
satélite, não coluna embutida, para poder trocar de modelo de embedding
sem migrar as tabelas de conteúdo.

## 4. Estrutura pronta para Motor Editorial (pipeline operacional)

### 4.1 Fluxo ponta-a-ponta generalizado

```
1. Edital/prova nova entra em exam_catalog (status PLANNED)
2. Arquivos chegam (PROVA, GABARITO, EDITAL) → exam_files
3. Pipeline de extração gera questions.raw.json (status PROCESSING)
4. Classificador (regra + IA) atribui discipline/topic/subtopic a cada questão,
   respeitando course_module_activation do curso da prova
5. Revisor humano confirma/corrige em review.json (status REVIEW → APPROVED)
6. Cada confirmação vira Evidence → recalcula confidence/evidenceCount das
   entidades tocadas
7. Questões aprovadas são IMPORTED e depois PUBLISHED
8. Rotina periódica de Evolução roda: decaimento de confiança,
   detecção de duplicidade, reabertura de EM_REVISAO quando necessário
```

### 4.2 O que muda no pipeline existente vs. o que só se conecta a ele

- **Não muda**: extração de PDF, formato de `review.json`,
  `exam_catalog_status`, `exam_file_type` — tudo isso já é agnóstico de
  curso.
- **Conecta-se**: o passo 4 (classificação) passa a consultar
  `course_module_activation` e `classification_rules` filtradas por
  `course_id` da prova (hoje implícito porque só existe Enfermagem; em V2
  é uma condição explícita de query).
- **Novo**: passo 6 (Evidence) e passo 8 (Evolução) não existiam como
  processo formal no V1 — são a diferença operacional central da Fase 3.

### 4.3 Critério de "curso pronto para produção" na Engine V2

Um curso novo (ex.: Direito) é considerado operacional quando:
1. Tem ao menos 1 `Position` cadastrado;
2. Tem `course_module_activation` definido (mesmo que seja só
   Legislação + Jurisprudência + Terminologia);
3. Tem ao menos as disciplinas transversais (Português, Raciocínio
   Lógico) vinculadas via `course_disciplines`, reaproveitando o que já
   existe — **zero retrabalho de conteúdo para essas 3 disciplinas**;
4. Tem ao menos um dossiê de curadoria inicial (`origin = EDITORIAL_PRIOR`)
   para suas disciplinas próprias, no mesmo formato usado para Enfermagem
   nas Fases 1–2 (isto é: o *processo* de pesquisa e escrita das Fases 1–2
   é reutilizável tal como está — o que muda é só onde o resultado final é
   armazenado).
