# 02 — Catálogo de Entidades Genéricas

Convenção de leitura: cada entidade lista apenas seus **atributos de
conteúdo** (o que a diferencia de outra entidade do mesmo tipo). Todo
atributo do bloco padrão de **metadados/versionamento/evidência/confiança**
(definido em `03-metadados-e-versionamento.md` e
`04-evidencias-confianca-evolucao.md`) é **implícito em todas elas** e não é
repetido aqui para não poluir a leitura.

## 1. Course (Curso)

Substitui o "curso hardcoded Enfermagem" por uma entidade de catálogo.

| Atributo | Descrição |
|---|---|
| id | Identificador do curso |
| nome | Ex.: Enfermagem, Medicina, Direito, Português, Matemática |
| slug | Identificador amigável |
| area | Agrupador macro (Saúde, Jurídica, Exatas, Linguagens, Gestão) — usado para sugerir módulos padrão na ativação |
| status | ATIVO / EM_CONSTRUCAO / DESCONTINUADO |

## 2. Position (Cargo)

Já era escopado por curso no V1 (`taxonomy.json`); em V2 formaliza-se como
entidade própria com metadados completos.

| Atributo | Descrição |
|---|---|
| id | Identificador do cargo |
| course_id | Curso ao qual pertence |
| nome | Ex.: Enfermeiro, Técnico de Enfermagem, Advogado, Analista Judiciário — Área Jurídica |
| nivel | SUPERIOR / MEDIO / FUNDAMENTAL — afeta profundidade esperada das regras |

## 3. EditorialModule (Módulo Editorial)

Catálogo fixo e pequeno, mantido pela própria Engine (não por curso).
Detalhado em `05-editorial-modules.md`.

| Atributo | Descrição |
|---|---|
| id | Identificador do módulo |
| nome | Ex.: Legislação, Protocolos, Programas, Medicamentos, Fórmulas, Jurisprudência, Normas Técnicas, Organismos, Terminologia |
| descricao | O que esse módulo representa editorialmente |
| schema_extra | Lista de campos adicionais que registros desse módulo podem ter (ver `EditorialReference.detalhes`) |

## 4. CourseModuleActivation (Ativação de Módulo por Curso)

Tabela de junção — é o mecanismo central do Princípio 4.

| Atributo | Descrição |
|---|---|
| course_id | Curso |
| module_id | Módulo ativado |
| obrigatorio | Se todo Discipline desse curso deve ao menos tentar linkar referências desse módulo |

## 5. Discipline (Disciplina)

| Atributo | Descrição |
|---|---|
| id | Identificador |
| nome | Nome canônico |
| descricao | Escopo da disciplina |
| escopo | `COURSE_SPECIFIC` (pertence só a um curso) ou `TRANSVERSAL` (compartilhável) |
| origin | Ver `04-evidencias-confianca-evolucao.md` |
| confidence | idem |
| evidenceCount | idem |
| createdFrom | idem — ex.: "dossiê editorial 02a", "prova ebserh-2025", "sugestão IA sessão X" |

### 5.1 CourseDiscipline (vínculo Curso ↔ Disciplina)

Necessário porque uma Disciplina `TRANSVERSAL` (Português, Raciocínio
Lógico, Informática, Atualidades, Direito Administrativo genérico) pode
estar ativa em N cursos ao mesmo tempo, cada um com seu próprio peso.

| Atributo | Descrição |
|---|---|
| course_id | Curso |
| discipline_id | Disciplina |
| frequencia_percentual | Peso **naquele curso especificamente** (o mesmo "Português" pode ter frequência diferente no edital de Enfermeiro vs. de Analista Judiciário) |
| prioridade | ALTA / MEDIA / BAIXA, também por curso |
| ordem | Ordem de exibição no currículo daquele curso |

## 6. Topic (Assunto)

| Atributo | Descrição |
|---|---|
| id | Identificador |
| discipline_id | Disciplina-mãe (nota: se a disciplina é transversal, o Topic também é compartilhado — não duplicar Topic por curso) |
| nome | Nome canônico |
| descricao | Escopo do tema |
| origin | Ver evidências/confiança |
| confidence | idem |
| evidenceCount | idem |

## 7. Subtopic (Subassunto)

| Atributo | Descrição |
|---|---|
| id | Identificador |
| topic_id | Assunto-mãe |
| nome | Nome canônico |
| descricao | Granularidade de cobrança direta em questão |
| slug | Para importação/URL |
| origin / confidence / evidenceCount | Mesmo padrão |

## 8. Keyword (Palavra-chave)

Sem mudança estrutural relevante do V1 — já era genérica.

| Atributo | Descrição |
|---|---|
| id | Identificador |
| subtopic_id | Subassunto associado |
| termo | A palavra/expressão |
| peso | Intensidade do sinal |
| tipo | PRINCIPAL / SECUNDARIA / FRACA |

## 9. Synonym (Sinônimo) e Acronym (Sigla)

Generalização importante: no V1 eram arquivos únicos assumindo o
vocabulário de Enfermagem. Em V2, ambos ganham escopo:

| Atributo | Descrição |
|---|---|
| id | Identificador |
| termo | Palavra/sigla canônica |
| variante | Sinônimo ou expansão da sigla |
| categoria | DISCIPLINA / ASSUNTO / TERMO_TECNICO / SIGLA_CLINICA / SIGLA_JURIDICA / SIGLA_CONTABIL / SIGLA_TECNICA... (categoria passa a ser um catálogo extensível, não um enum fechado de saúde) |
| course_id | **Nulo = sigla/sinônimo global (ex.: "PA" nunca colide fora da saúde); preenchido = escopado a um curso** (ex.: "CPC" só resolve para "Código de Processo Civil" dentro do curso Direito, e só resolve para "Comitê de Pronunciamentos Contábeis" dentro do curso Contabilidade) |
| ambiguo_entre_cursos | Booleano calculado: true quando a mesma sigla aparece com `course_id` diferentes e `variante` diferente — dispara para a fila de desambiguação por curso, não só por contexto textual |

## 10. EditorialReference (Referência Normativa Genérica)

**Esta é a generalização mais importante da Fase 3.** Substitui as 4
tabelas fixas do V1 (`legislacoes`, `portarias`, `protocolos`, `programas`)
por uma única entidade polimórfica, tipada pelo Módulo Editorial.

| Atributo | Descrição |
|---|---|
| id | Identificador |
| module_id | Qual Módulo Editorial este registro pertence (Legislação, Jurisprudência, Fórmulas...) |
| course_id | Curso ao qual a referência se aplica (pode ser nula se a referência for válida para múltiplos cursos — ex.: RDC ANVISA vale para Enfermagem, Medicina, Odontologia e Farmácia simultaneamente, então melhor modelada como N:N — ver `ReferenceCourse` abaixo) |
| nome | Nome/identificação da referência (ex.: "Lei nº 8.080/1990", "Súmula Vinculante nº 13", "Fórmula de Bhaskara", "NBR 5410") |
| subtipo | Dentro do módulo: ex. módulo Legislação → LEI / DECRETO / RESOLUCAO; módulo Jurisprudência → SUMULA / ACORDAO / REPERCUSSAO_GERAL; módulo Fórmulas → identifica área (Física, Financeira, Farmacológica) |
| orgao_ou_tribunal | Órgão emissor (Ministério da Saúde, STF, ABNT, CFC...) |
| ano | Ano de vigência/publicação, quando aplicável |
| detalhes | Bloco de campos específicos do módulo (ex.: Fórmulas guarda a expressão e as variáveis; Jurisprudência guarda número de processo e tribunal; Medicamentos guarda princípio ativo e classe) — estrutura descrita por `EditorialModule.schema_extra`, não um campo solto sem contrato |
| assuntos_relacionados | Ver `ReferenceTopic` abaixo |

### 10.1 ReferenceTopic (vínculo Referência ↔ Assunto, N:N)

| Atributo | Descrição |
|---|---|
| reference_id | Referência normativa |
| topic_id | Assunto relacionado |

### 10.2 ReferenceCourse (vínculo Referência ↔ Curso, N:N, para referências multi-curso)

| Atributo | Descrição |
|---|---|
| reference_id | Referência normativa |
| course_id | Curso em que essa referência é cobrada |

## 11. ClassificationRule (Regra de Classificação)

| Atributo | Descrição |
|---|---|
| id | Identificador |
| course_id | Curso ao qual a regra pertence (nula = regra transversal, ex.: regras de Português/Raciocínio Lógico valem para qualquer curso que ative essas disciplinas transversais) |
| se_encontrar | Lista de termos/padrões-gatilho |
| discipline_id / topic_id / subtopic_id | Destino da classificação |
| confidence | Ver sistema de confiança |
| evidenceCount | Ver sistema de evidências |
| sources | Ver sistema de evidências |
| lastValidated | Ver versionamento |
| engineVersion | Versão da Engine que validou/gerou a regra pela última vez |

## 12. AmbiguousCase (Caso Ambíguo)

| Atributo | Descrição |
|---|---|
| id | Identificador |
| termo_ou_par | O termo ou par de entidades em conflito |
| candidatos | Lista de possíveis destinos (discipline_id/topic_id), cada um podendo pertencer a cursos diferentes — permite modelar ambiguidade **entre cursos**, não só dentro de um curso (ex.: "CPC") |
| prioridade_default | Candidato vencedor na ausência de mais contexto |
| regra_de_desempate | Texto da regra de decisão |
| escopo | INTRA_CURSO / INTER_CURSO (novo em V2 — o V1 só previa ambiguidade dentro de Enfermagem) |

## 13. CoOccurrence (Matriz de Co-ocorrência)

Sem mudança estrutural — já era genérica (par de assuntos + frequência).
Ganha apenas `course_id` explícito porque um par de assuntos só faz sentido
co-ocorrer dentro do mesmo curso (não existe co-ocorrência entre um assunto
de Direito e um de Enfermagem).

## 14. ExamBoard (Banca)

Generalização: no V1, `perfil-bancas.json` misturava **identidade global da
banca** (formato Certo/Errado, estilo de comando) com **ênfase temática
específica de Enfermagem** (disciplinas predominantes). Isso está errado
porque o formato de prova de uma banca é constante entre cursos, mas a
ênfase temática não é.

| Atributo | Descrição |
|---|---|
| id | Identificador |
| nome | Ex.: FGV, Cebraspe, IBFC |
| formato_prova | MULTIPLA_ESCOLHA_4 / MULTIPLA_ESCOLHA_5 / CERTO_ERRADO / CERTO_ERRADO_ANULADO |
| estilo_geral | Características de redação/comando que independem de curso |

### 14.1 BoardCourseProfile (Perfil da Banca por Curso)

| Atributo | Descrição |
|---|---|
| board_id | Banca |
| course_id | Curso |
| disciplinas_predominantes | Específico deste curso |
| assuntos_predominantes | Específico deste curso |
| nivel_dificuldade | Pode variar por curso (a mesma banca pode ser mais rigorosa em Direito do que em Enfermagem) |

## 15. Resumo da hierarquia completa (V2)

```
Engine
 └─ EditorialModule (catálogo fixo, global)
 └─ ExamBoard (catálogo global) ──┐
                                   ├─ BoardCourseProfile (por curso)
 └─ Course ────────────────────────┘
     ├─ CourseModuleActivation (quais módulos este curso usa)
     ├─ Position (cargos do curso)
     ├─ CourseDiscipline (vínculo N:N para disciplinas transversais,
     │                     ou vínculo 1:1 de fato para disciplinas próprias)
     │    └─ Discipline (escopo COURSE_SPECIFIC | TRANSVERSAL)
     │         └─ Topic
     │              └─ Subtopic
     │                   └─ Keyword
     ├─ EditorialReference (tipada por Módulo, ligada a Topic via ReferenceTopic,
     │                       e a Course via ReferenceCourse quando multi-curso)
     ├─ ClassificationRule
     ├─ AmbiguousCase (com escopo INTRA_CURSO | INTER_CURSO)
     └─ CoOccurrence
 └─ Synonym / Acronym (globais ou escopados por course_id)
```
