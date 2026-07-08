# 06 — Diferenças V1 → V2 e Justificativas

| # | V1 (Fases 1–2) | V2 (Fase 3) | Justificativa |
|---|---|---|---|
| 1 | `disciplinas` era uma lista fixa de 26 linhas, implicitamente "as disciplinas de Enfermagem" | `Discipline` é uma entidade vazia de schema; o conjunto de 26 é dado carregado sob `course_id = Enfermagem` | Sem isso, adicionar Direito exigiria decidir "crio uma segunda tabela `disciplinas_direito`?" — o schema precisa ser o mesmo para todo curso |
| 2 | Português, Raciocínio Lógico e Informática apareciam como disciplinas exclusivas de Enfermagem | Viram Disciplinas `TRANSVERSAL`, vinculadas N:N a qualquer curso via `CourseDiscipline` | Essas 3 disciplinas se repetem literalmente em quase todo concurso público, independente da área — duplicar o conteúdo delas por curso multiplicaria manutenção sem necessidade |
| 3 | 4 tabelas fixas: Leis, Portarias, Protocolos, Programas | 1 tabela genérica `EditorialReference` tipada por `EditorialModule` | Direito precisa de Jurisprudência, Matemática precisa de Fórmulas — tabelas fixas por domínio de saúde não generalizam; um discriminador de módulo sim |
| 4 | `perfil-bancas.json` misturava estilo global da banca com ênfase temática de Enfermagem no mesmo registro | Separado em `ExamBoard` (global) + `BoardCourseProfile` (por curso) | O formato Certo/Errado da Cebraspe não muda entre cursos; a ênfase temática muda completamente |
| 5 | Dicionário de sinônimos/siglas era um arquivo único, implicitamente sobre vocabulário de saúde | `Synonym`/`Acronym` com `course_id` opcional (nulo = global, preenchido = escopado) | Siglas colidem entre áreas (CPC, PA, IG, RAM já eram ambíguas dentro da própria Enfermagem; entre cursos a colisão é ainda mais comum) |
| 6 | Nenhum registro tinha metadados de proveniência | Todo registro de conteúdo carrega `origin`, `confidence`, `evidenceCount`, `createdFrom` | Um motor que vai rodar por anos e receber contribuição de humanos + IA + extração de provas reais precisa saber, a qualquer momento, o quão confiável é cada pedaço de dado |
| 7 | Regras de classificação tinham `confianca_percentual` fixo, atribuído uma vez | `confidence` é recalculado a partir de evidência real, com decaimento por tempo | Um número de confiança que nunca se atualiza é uma opinião congelada, não uma medida — a Fase 2 já tinha a intuição certa (números), mas faltava o mecanismo de recálculo |
| 8 | Nenhum versionamento — editar significava sobrescrever o arquivo | Três camadas de versão (`engineVersion`, `course.version`, `record.version` + changelog + `supersededBy`) | Sem isso, uma questão classificada em 2026 com uma regra que muda em 2027 perde completamente o contexto de por que foi classificada assim |
| 9 | A duplicidade de "SAE" (topic dentro de Fundamentos + subject isolado) foi um achado manual de auditoria pontual | Vira uma rotina formal do Sistema de Evolução (detecção de similaridade + sugestão de merge com `supersededBy`) | Esse tipo de duplicidade vai se repetir em qualquer curso que cresça organicamente; precisa de mecanismo, não de sorte na revisão manual |
| 10 | Casos ambíguos só previam conflito dentro da mesma disciplina/curso | `AmbiguousCase.escopo` inclui `INTER_CURSO` | Termos como "CPC" só fazem sentido como ambíguos quando se olha para mais de um curso ao mesmo tempo — a Fase 2 não tinha curso concorrente para revelar esse tipo de caso |
| 11 | Nenhum arquivo tinha envelope de metadados de lote (quando/quem/de onde) | Envelope padrão (`metadata`, `engineVersion`, `course`, `position`, `createdAt`, `updatedAt`, `createdBy`, `source`) obrigatório em todo dataset exportado | Rastreabilidade de dataset é pré-requisito para auditoria e para diagnosticar regressões quando um curso novo for carregado e algo quebrar |
| 12 | O conceito de "curso" e "engine" eram a mesma coisa na prática (o documento inteiro *era* sobre Enfermagem) | Curso é uma configuração de dados carregada dentro de uma Engine agnóstica | É a mudança estrutural central da Fase 3 — sem ela, nenhuma das outras 11 diferenças teria onde se apoiar |

## O que foi preservado deliberadamente (não é "diferença", é continuidade)

- A hierarquia **Disciplina → Assunto → Subassunto → Palavra-chave**: já
  era genérica por natureza, não precisou mudar de forma, só de escopo
  (`course_id` explícito).
- O padrão de **regra SE/ENTÃO + confiança**: o mecanismo de match por
  palavras-chave e a estrutura de regra continuam os mesmos; o que ganhou
  foi o entorno (evidência, versionamento), não a lógica central.
- O **pipeline de ingestão de provas reais** (`docs/work/<prova>/...` e a
  migration `exam_catalog`/`exam_files`): já nasceu agnóstico de curso —
  processa PDF/gabarito de qualquer prova, de qualquer cargo, de qualquer
  curso, sem alteração necessária na Fase 3.
- A ideia de **matriz de co-ocorrência** e **casos ambíguos com regra de
  desempate**: universais a qualquer prova de concurso, só ganharam
  `course_id` e (no caso de ambíguos) o novo escopo inter-curso.
