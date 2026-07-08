# Editorial Engine V2 — Arquitetura Genérica (Fase 3)

Este diretório generaliza tudo o que foi construído em `docs/editorial/` e
`docs/editorial/normalized/` (Fases 1–2, específicas de Enfermagem) para uma
**Engine agnóstica de curso**. Enfermagem passa a ser a primeira Course
Configuration carregada nessa Engine, não mais o objeto do schema.

| Arquivo | Conteúdo |
|---|---|
| `01-arquitetura-v2-visao-geral.md` | Princípios da Engine genérica, mudança de enquadramento Engine vs. Course Configuration |
| `02-entidades-genericas.md` | Catálogo completo de entidades (Course, Position, EditorialModule, Discipline, Topic, Subtopic, Keyword, Synonym/Acronym, EditorialReference, ClassificationRule, AmbiguousCase, CoOccurrence, ExamBoard/BoardCourseProfile) |
| `03-metadados-e-versionamento.md` | Envelope de metadados por dataset, três camadas de versionamento, ciclo de vida (status) |
| `04-evidencias-confianca-evolucao.md` | Sistema de Evidências, Sistema de Confiança (fórmula conceitual e limiares), Sistema de Evolução (merge/duplicidade, gatilhos) |
| `05-editorial-modules.md` | Catálogo de Módulos Editoriais + matriz de ativação por curso (Enfermagem, Medicina, Direito, Matemática, Contabilidade etc.) |
| `06-diferencas-v1-v2-justificativas.md` | Tabela de diferenças ponto a ponto + o que foi preservado deliberadamente |
| `07-postgresql-supabase-ia-motor-editorial.md` | As 4 estruturas de destino: PostgreSQL, Supabase, IA, Motor Editorial — conceituais, sem DDL/JSON/código |

## Regra de não-regressão

Nada do conteúdo de Enfermagem produzido nas Fases 1–2 é descartado. Esta
fase é uma **camada de generalização em torno** desse conteúdo: os 26
dossiês, o dicionário editorial, as regras e a matriz de co-ocorrência
continuam válidos como a primeira Course Configuration completa da Engine
V2, agora com `course_id = Enfermagem` explícito e metadados de
proveniência (`origin = EDITORIAL_PRIOR`) em vez de implícitos.
