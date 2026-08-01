# Engine Editorial IA — Arquitetura Técnica (Implementação)

Este diretório contém a documentação **técnica** que descreve como o método
normativo definido em `docs/editorial/engine-v2/08` a `16` (Sprints
IA-001…IA-009, congeladas) poderá ser implementado no SimulaPro.

**Diferença de natureza em relação a `docs/editorial/engine-v2/08-16`:**

| | `08-16` (IA-001…IA-009) | `implementacao/` (IT-001…) |
|---|---|---|
| Conteúdo | Método editorial, normativo | Arquitetura técnica que implementa esse método |
| Status | Congelado, encerrado | Evolutivo, revisado conforme a implementação avança |
| Pode ser alterado? | Não, salvo nova sprint de método explicitamente autorizada | Sim, dentro do próprio ciclo de arquitetura (IT-002, IT-003…) |
| Relação | Fonte normativa (o quê) | Consumidor normativo (como) — nunca reinterpreta `08-16` |

| Arquivo | Conteúdo |
|---|---|
| `01-IT-001-arquitetura-tecnica.md` | **Sprint IT-001** — Visão geral da arquitetura técnica, fronteiras, módulos, reuso de componentes existentes, resolução do conflito entre estados editoriais, fronteira de convergência com o pipeline real |
| `05-IT-005-primeira-migration-sql.md` | **Sprint IT-005** — Relatório da primeira migration SQL aditiva do núcleo da Engine Editorial IA (`20260717020000_editorial_ai_engine_core.sql`); migration criada, **não aplicada** |
| `06-IT-006-camada-persistencia.md` | **Sprint IT-006** — Camada de persistência (`src/lib/editorial-ai/`): 2 repositórios formais (batch, cycle) + funções para as 7 satélites; `types.ts` provisório até a migration ser aplicada e os tipos regenerados |
| `07-IT-007-auditoria-editorial.md` | **Sprint IT-007** — Auditor Editorial (`src/lib/editorial-ai/audit/`): amostragem estratificada, leitura (não recálculo) dos sinais já gravados pelo Validator, checagem de sobreposição temática e relatório Markdown por lote, implementando tecnicamente IA-006 (artefato de auditoria) e IA-009 (métricas/padrões), sem tabela nova e sem limiar oficial de lote nesta fase |
| `08-IT-008-motor-aprendizado.md` | **Sprint IT-008** — Motor de Aprendizado, Sprint 6.1 (`src/lib/editorial-ai/learning/`): extração de padrões dos relatórios de auditoria, levantamento de candidatos a regra permanente sem limiar de recorrência, log de rastreabilidade/reavaliação das regras já promovidas — sem promoção automática, sem tabela nova |
| `09-IT-009-ciclo-vida-regras.md` | **Sprint IT-009** — Gestão do Ciclo de Vida das Regras, Sprint 6.2: identificador permanente por regra (`RULE-NNN`), relatório de eficácia com 3 classificações explícitas (`MELHORA_OBSERVADA`/`PIORA_OBSERVADA`/`SEM_OPORTUNIDADE_DE_TESTE`), fechamento do laço entre candidatos e regras já promovidas — sem promoção/reavaliação automática, sem tabela nova |

## Regra de não-contradição

Nenhum documento desta subtrilha pode reinterpretar, reduzir ou substituir o que está definido em `docs/editorial/engine-v2/08` a `16`. Toda responsabilidade arquitetural aqui definida aponta explicitamente para sua fonte normativa correspondente.
