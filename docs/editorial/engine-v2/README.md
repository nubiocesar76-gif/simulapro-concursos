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
| `08-IA-001-blueprint-editorial.md` | **Sprint IA-001** — Blueprint Editorial: contrato de insumos/saída, fluxo de 13 etapas, papéis da IA e fronteiras das sprints IA-002…IA-010 |
| `09-IA-002-prompt-builder.md` | **Sprint IA-002** — Prompt Builder: especificação funcional da composição do prompt a partir dos insumos I-01…I-12, sem templates, código ou integração |
| `10-IA-003-integracao-ia.md` | **Sprint IA-003** — Camada de Integração com IA: fronteira conceitual entre o pacote composto por IA-002 e uma capacidade externa de geração, sem provedor, SDK, API ou implementação |
| `11-IA-004-tratamento-resposta.md` | **Sprint IA-004** — Tratamento da Resposta: reconhecimento e organização estrutural da resposta bruta (IA-003) segundo os Elementos E-01…E-10 (IA-001), sem parser, schema ou validação editorial |
| `12-IA-005-validacao-editorial.md` | **Sprint IA-005** — Validação Editorial: checklist conceitual preliminar e exclusivamente assistivo sobre o conteúdo organizado por IA-004; decisão final permanece humana (Etapa 12/13) |
| `13-IA-006-revisao-editorial.md` | **Sprint IA-006** — Revisão Editorial: processo humano de auditoria independente e homologação (Etapas 12–13); IA apenas auxilia, revisor decide, homologação é responsabilidade humana |
| `14-IA-007-publicacao-editorial.md` | **Sprint IA-007** — Publicação Editorial: convergência entre o caminho IA (após `APROVADO_EDITORIAL`) e o pipeline já existente; publicação reconhece aptidão para o acervo, não implica distribuição ao aluno |
| `15-IA-008-producao-em-escala.md` | **Sprint IA-008** — Produção em Escala: lote como agrupamento puramente operacional; cada questão continua seguindo IA-001→IA-007 integralmente, com rastreabilidade e decisões humanas individuais |
| `16-IA-009-otimizacao-continua.md` | **Sprint IA-009** — Otimização Contínua: princípios de evolução incremental e controlada do ciclo assistido, sempre sob decisão humana; **encerra formalmente a documentação principal da Engine Editorial IA (IA-001…IA-009)** |

## Arquitetura técnica (implementação)

A partir da Sprint IT-001, a arquitetura técnica que implementa o método normativo acima (IA-001…IA-009) é documentada separadamente em [`implementacao/`](implementacao/README.md) — trilha evolutiva, distinta desta documentação congelada.

## Regra de não-regressão

Nada do conteúdo de Enfermagem produzido nas Fases 1–2 é descartado. Esta
fase é uma **camada de generalização em torno** desse conteúdo: os 26
dossiês, o dicionário editorial, as regras e a matriz de co-ocorrência
continuam válidos como a primeira Course Configuration completa da Engine
V2, agora com `course_id = Enfermagem` explícito e metadados de
proveniência (`origin = EDITORIAL_PRIOR`) em vez de implícitos.
