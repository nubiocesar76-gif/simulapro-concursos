# Sprint 7.1 — Geração Contínua (Fase 7)

**Objetivo:** primeira execução ponta a ponta do pipeline já homologado
(Fases 4-6) para produção de conteúdo comercial via Motor Editorial.
Nenhuma funcionalidade nova, nenhuma alteração de arquitetura — usa
exclusivamente `npm run editorial:generate` / `editorial:audit` /
`editorial:audit:metrics` / `editorial:learning:candidates` /
`editorial:learning:efficacy`, já homologados.

## Alvo escolhido ("P1" desta rodada)

Não existe hoje uma fila formal de prioridades para o Motor Editorial (isso
é distinto da fila `prioridade_producao` do catálogo de provas reais,
`docs/catalog/pesquisa-50-provas-enfermeiro.csv`, que é outro pipeline). O
alvo abaixo foi escolhido por levantamento direto de cobertura: disciplina
**PUBLICADO** na Engine V2 e **nunca usada** em nenhum lote do Motor
Editorial até agora (Sprints 4.1/4.3 cobriram 8 disciplinas; 13
permaneciam sem nenhuma questão gerada).

**Disciplina escolhida: Urgência e Emergência** — alto peso em concursos de
Enfermagem, cobre 4 tópicos publicados (Suporte de Vida; Classificação de
Risco e Organização do Serviço; Emergências Traumáticas; Emergências
Clínicas), com boa diversidade de subassuntos para os 10 alvos abaixo.

## Composição do lote (10 alvos, mesma estrutura balanceada da Sprint 4.1)

| # | Banca | Dificuldade | Tópico | Subtópico |
|---|---|---|---|---|
| 1 | IBFC | Fácil | Suporte de Vida | Suporte Básico de Vida (SBV) |
| 2 | IBFC | Fácil | Classificação de Risco e Organização do Serviço | Protocolo de Manchester |
| 3 | IBFC | Média | Emergências Clínicas | Dor Torácica e Síndrome Coronariana Aguda |
| 4 | IBFC | Média | Emergências Traumáticas | Escala de Coma de Glasgow |
| 5 | IBFC | Difícil | Emergências Clínicas | Sepse e Choque Séptico |
| 6 | FGV | Fácil | Suporte de Vida | Suporte Avançado de Vida (SAV/ACLS) |
| 7 | FGV | Média | Emergências Clínicas | AVC Agudo / Código AVC |
| 8 | FGV | Média | Emergências Traumáticas | Choque: Classificação |
| 9 | FGV | Difícil | Emergências Clínicas | Anafilaxia |
| 10 | FGV | Difícil | Classificação de Risco e Organização do Serviço | SAMU 192 |

## Pipeline executado

1. Preparação da pasta de trabalho (este documento).
2. Geração — `npm run editorial:generate` × 10 (registrado abaixo).
3. Validação — automática, dentro de cada ciclo de geração (Validator, IA-005).
4. Auditoria — `npm run editorial:audit` sobre os 10 lotes gerados.
5. Aprendizado — `npm run editorial:audit:metrics` / `editorial:learning:candidates` / `editorial:learning:efficacy`.
6. Homologação humana — apresentada ao usuário para decisão (IA-006 §6: nunca automatizada).
7. Publicação — **não executável nesta sprint**: `editorial_ai_publications`/`registerPublication()` existem como contrato desde a Fase 4, mas nenhum fluxo real jamais os exercitou. Implementá-los agora seria funcionalidade nova, fora do escopo desta fase.
8. Registro de métricas do lote — relatórios gerados no passo 5.

## Registro de execução

10/10 gerações concluídas com sucesso, 0 falhas, todas abaixo do teto de
8192 tokens (ANTHROPIC_MAX_TOKENS).

| # | Batch | Cycle | Tokens saída |
|---|---|---|---|
| 1 | 70351c6b-4191-4820-8b24-d40dbf4af2c7 | 7d2074f5-4cb4-429e-a139-6a679450ce34 | 1860 |
| 2 | 318e98ee-1d83-4a8f-ae61-efc4e9c2cb9a | 970cb677-078a-4628-b411-0df1d8c47ce3 | 752 |
| 3 | 76dd209e-7d38-4406-92b9-3d0cfc713297 | f67cf2ee-5f49-48cf-abbe-2bb35e0d9bc3 | 3681 |
| 4 | 52572359-588b-4e29-8a61-08e6408ea9ac | e5aeb6b8-c151-4cc2-9704-ef56b8dc0529 | 2990 |
| 5 | ccc4dd24-a421-48e4-8445-9ba2098781a8 | a4b91303-cdbd-4828-a0d8-3db0c3a6483e | 4005 |
| 6 | 9ab1d20c-0cb4-4351-8c1e-b18e48800561 | 0abbf9d0-2c51-4f6d-81ee-b2cee863848c | 1641 |
| 7 | 7da590e2-e25d-4209-8d6a-d986692870af | cb67628e-5be2-4e47-9e32-db9f69ffc08c | 4545 |
| 8 | ee223db6-5aba-49b7-846e-9cb3e411c5e5 | 035ba449-5f8f-4881-918a-f50e04b07c0e | 5676 |
| 9 | 42c0c80a-0ae6-44d8-b795-6aef7b9de6c5 | 5c33a89a-0674-4dd9-b6fb-be759c761980 | 5222 |
| 10 | 61947f01-4f8b-41cf-bfc7-c831877a1977 | 79e669c0-8f98-48dd-8392-8308804477a9 | 4356 |

## Auditoria (revisão humana equivalente, mesmo processo da Sprint 4.2)

Relatório: `docs/editorial-ai/audit-reports/70351c6b-4191-4820-8b24-d40dbf4af2c7__2026-07-28T08-00-44-887Z.md`.

- 0/10 falhas mecânicas (Validator) — 80/80 checagens mecânicas OK.
- 9/10 questões aprovadas sem ajuste.
- 1/10 (Q4, Escala de Glasgow, IBFC/Média) aprovada com ajuste — concentração
  temática real com o acervo (5 candidatos encontrados; 2 muito próximos em
  tema, ângulo diferente, não é cópia) — marcado `#concentracao-tematica`.
- 0/10 reprovadas.

## Aprendizado

- `editorial:audit:metrics` — painel consolidado atualizado (2 relatórios lidos).
- `editorial:learning:candidates` — `#dado-nao-verificado` segue como único
  candidato sem regra (1 ocorrência, inalterado); `#concentracao-tematica`
  corretamente excluído (já coberto por RULE-004).
- `editorial:learning:efficacy` — **achado real**: RULE-004 (diversidade
  temática) classificada como `PIORA_OBSERVADA` — a tag associada reapareceu
  em conteúdo gerado depois da promoção da regra. Primeira medição de
  eficácia útil deste projeto (a da Sprint 6.2 tinha caído em
  `SEM_OPORTUNIDADE_DE_TESTE` por ambiguidade de mesmo dia). Ver ressalva
  nas lições aprendidas sobre granularidade de contexto.

## Homologação humana

**Concluída.** Usuário decidiu homologar as 10 questões, incluindo a Q4 com
ressalva registrada (concentração temática). Registrado via as funções já
existentes desde o IT-006 (`createEditorialAiDecision` +
`editorialAiCycleService.updateCycleStatus`) — primeira vez que
`editorial_ai_decisions` é populada neste projeto (lacuna identificada na
Sprint 6.1, fechada nesta sprint pelo primeiro uso real, não por código
novo). Cada ciclo recebeu 2 decisões, replicando as Etapas 12-13 do
processo canônico (IA-006 §7):
1. `AUDITORIA_INDEPENDENTE` — `RASCUNHO_IA` → `EM_REVISAO`.
2. `HOMOLOGACAO` — `EM_REVISAO` → `APROVADO_EDITORIAL`.

Os 10 ciclos estão agora em `APROVADO_EDITORIAL`.

## Publicação (Sprint 7.1A)

**Executada em 2026-07-28.** Auditoria prévia confirmou que toda a
infraestrutura necessária (`editorial_ai_publications`,
`editorial_ai_decisions.decision_type = 'DECISAO_PUBLICACAO'`,
`registerPublication()`/`createEditorialAiPublication()`) já existia desde a
Fase 4 e nunca havia sido exercitada. Implementada função mínima de
convergência (`src/lib/editorial-ai/publish/convergence.server.ts` +
`taxonomy-resolution.server.ts`) e CLI
(`npm run editorial:publish -- --cycle-id <uuid>... --package-id <uuid>
--package-version-id <uuid> --actor-user-id <uuid>`), sem tabela nova, sem
pipeline novo, sem alteração no Motor Editorial/Validator/Auditor/Motor de
Aprendizado.

Alvo: package `Banco de Questões - Enfermagem`
(`cf27b22c-023d-4c97-9bb1-3ac00b6395f3`), versão
`940ad0d6-1147-4ba1-be1a-0b07c34cb76b` (`PUBLISHED`).

**Resultado real (10/10 ciclos processados):**
- **Convergidas: 0.**
- **Bloqueadas: 10** — todas por ambiguidade de taxonomia (regra 4/5:
  publicar só quando a resolução é inequívoca).
- Em todos os 10 casos, a disciplina resolveu sem ambiguidade
  (`"Urgência e Emergência" -> subjects.id=c75609bd-898c-4188-bbf4-a733ea07c068`,
  1 candidato), mas o assunto não encontrou nenhuma correspondência
  (`NO_MATCH`) na tabela real `topics` escopada a esse `subject_id`. Os 4
  nomes de tópico usados pelo Motor Editorial (taxonomia própria,
  `editorial_topics`) — "Suporte de Vida", "Classificação de Risco e
  Organização do Serviço", "Emergências Traumáticas", "Emergências
  Clínicas" — não têm equivalente textual exato entre os 10 tópicos reais
  já cadastrados em `topics` para esse `subject_id` (ex.: "Emergências
  Cardiovasculares", "Parada Cardiorrespiratória e RCP", "Acidente Vascular
  Cerebral (AVC)" etc. — nomenclatura mais granular/diferente, não os mesmos
  rótulos).
- Nenhum registro novo em `questions` (esperado, dado 0 convergências).
- `editorial_ai_publications`: 10 linhas gravadas (todas
  `outcome = BLOCKED_INCOMPLETE_CONTRACT`, `question_id = null`).
- `editorial_ai_decisions`: 10 linhas gravadas
  (`decision_type = 'DECISAO_PUBLICACAO'`, `APROVADO_EDITORIAL ->
  APROVADO_EDITORIAL`, com a justificativa completa por ciclo).
- Os 10 ciclos permanecem em `APROVADO_EDITORIAL` — nada foi perdido; a
  publicação pode ser retentada a qualquer momento após a taxonomia real
  ganhar tópicos correspondentes (decisão editorial humana, fora do escopo
  desta função).
- Consequência para o Portal do Aluno: nenhuma questão nova ficou
  disponível nesta rodada — o bloqueio impediu exatamente o que a regra 4/5
  foi desenhada para impedir (nunca inventar/mapear taxonomia
  automaticamente).
