# SimulaPro Concursos — Status do Projeto

Documento vivo com o estado atual do repositório, bloqueios conhecidos e próximos passos. Atualizar sempre que uma fase for concluída.

Para visão de produto, ver [`00-VISAO-GERAL.md`](./00-VISAO-GERAL.md). Para arquitetura, ver [`01-ARQUITETURA.md`](./01-ARQUITETURA.md). Para regras de trabalho, ver [`CURSOR_RULES.md`](./CURSOR_RULES.md).

---

## Resumo

| Item | Estado |
|------|--------|
| **Fase atual** | RC2 — Design System e redesign visual (Admin + Aluno) concluídos em documentação; implementação pendente |
| **MVP estrutural** | Implementado (portais Admin e Aluno navegáveis) |
| **Backend** | Supabase / Lovable Cloud |
| **Project ID Supabase** | `snbhstgvsfjfyfbwxdae` |
| **CLI Supabase** | `config.toml` corrigido; `db push` pendente de execução manual |

---

## Sprints — Fundação (Auth + RLS)

| Sprint | Escopo | Status |
|--------|--------|--------|
| **1A** | Validação da causa raiz (SQL de diagnóstico, sem alterações) | ✅ Concluída |
| **1B** | Correção da fundação: `GRANT EXECUTE` em `has_role`, bootstrap do primeiro admin | ✅ Concluída (migration criada; push manual pendente) |
| **1C** | Reativar gate de auth no frontend (`_authenticated`, `AppShell`, `useAuth`, `auth`) | ✅ Concluída |

### Sprint 1B — entregas

| Entrega | Status |
|---------|--------|
| Migration `20260704161000_grant_has_role_execute.sql` | ✅ Criada (pendente `db push`) |
| Procedimento do primeiro admin | ✅ `docs/BOOTSTRAP-PRIMEIRO-ADMIN.md` |

### Sprint 1C — entregas

| Entrega | Status |
|---------|--------|
| Gate de sessão em `/_authenticated` | ✅ |
| Verificação de role admin em `AppShell` | ✅ |
| Loading unificado e tratamento de erro em `useAuth` | ✅ |
| Redirect por role em `/auth` | ✅ |

---

## Sprints — Módulos Admin

| Sprint | Escopo | Status |
|--------|--------|--------|
| **2** | Módulo Cursos (`/admin/courses`) | ✅ Concluída |
| **2B** | Hardening Cursos (unicidade CI + bloqueio de exclusão) | ✅ Concluída |
| **3** | Domínio Taxonomia (5 módulos) | ✅ Concluída |
| **4** | Módulo Questões (`/admin/questions`) | ✅ Concluída |
| **5A** | Módulo Importação (`/admin/import`) | ✅ Concluída |
| **5B-1** | CRUD Pacotes (`/admin/packages`) | ✅ Concluída |
| **5B-2** | CRUD Versões (`/admin/versions`) | ✅ Concluída |
| **5B-3** | Pipeline de Publicação (Fase A) | ✅ Concluída |
| **5B-4** | Distribuição de Conteúdo (`/admin/distributions`) | ✅ Concluída |
| **6A** | Assinaturas (`/admin/subscriptions`) | ✅ Concluída |

## Sprints — Portal do Aluno

| Sprint | Escopo | Status |
|--------|--------|--------|
| **7A** | Infraestrutura de Sessões de Estudo (`/app/study`) | ✅ Concluída |
| **7B** | Preparação do motor de resolução (`/app/study/$sessionId`) | ✅ Concluída |
| **7C** | Resolução de questões (fluxo completo da sessão) | ✅ Concluída |
| **7D** | Dashboard do Aluno (`/app`) | ✅ Concluída |
| **7E** | Filtros de estudo (Favoritos, Revisar, Erradas) | ✅ Concluída |
| **7F** | Polimento geral do MVP | ✅ Concluída |
| **RC1** | Validação final do MVP (auditoria + correções) | ✅ Concluída |

### Sprint 2 — entregas

| Funcionalidade | Status |
|----------------|--------|
| CRUD completo (criar, editar, excluir, listar) | ✅ |
| Validação de nome e descrição | ✅ |
| Busca por nome/descrição | ✅ |
| Paginação server-side (10 por página) | ✅ |
| Loading e estados vazios/erro | ✅ |
| Toasts de sucesso e erro (incl. RLS) | ✅ |
| Confirmação de exclusão com impacto em vínculos | ✅ |
| Auditoria via `logEvent` | ✅ |
| Página dedicada (sem `CrudPage` genérico) | ✅ |

### Sprint 2B — entregas

| Funcionalidade | Status |
|----------------|--------|
| Índice único `lower(trim(name))` em `courses` | ✅ Migration criada |
| Bloqueio de exclusão com cargos vinculados | ✅ UI + validação na mutation |
| Bloqueio de exclusão com assinaturas vinculadas | ✅ UI + validação na mutation |
| Bloqueio de exclusão com pacotes vinculados | ✅ UI + validação na mutation |
| FKs / ON DELETE inalterados | ✅ Conforme escopo |

### Sprint 3 — Domínio Taxonomia

| Módulo | Rota | Status |
|--------|------|--------|
| Cargos | `/admin/positions` | ✅ |
| Bancas | `/admin/boards` | ✅ |
| Concursos | `/admin/exams` | ✅ |
| Disciplinas | `/admin/subjects` | ✅ |
| Assuntos | `/admin/topics` | ✅ |

| Funcionalidade (todos os módulos) | Status |
|-----------------------------------|--------|
| CRUD completo + TanStack Query | ✅ |
| Paginação e busca server-side | ✅ |
| Loading, toasts, erros, validações | ✅ |
| Dialogs criar/editar/excluir | ✅ |
| Bloqueio de exclusão com vínculos | ✅ |
| Auditoria `logEvent` | ✅ |
| Utilitários compartilhados (`taxonomy/shared.tsx`) | ✅ |
| Índices únicos CI (`harden_taxonomy_unique_names`) | ✅ Migration criada |

### Sprint 4 — Módulo Questões

| Funcionalidade | Status |
|----------------|--------|
| CRUD completo (criar, editar, excluir, listar) | ✅ |
| Paginação server-side | ✅ |
| Busca por enunciado | ✅ |
| Filtros (curso, cargo, banca, concurso, disciplina, assunto, ano, dificuldade) | ✅ |
| Alternativas dinâmicas | ✅ |
| Gabarito, explicação, metadados (legal, bibliografia, imagem) | ✅ |
| Bloqueio de exclusão (tentativas/favoritos) | ✅ |
| Auditoria `logEvent` | ✅ |
| Utilitários `src/lib/questions.ts` (reuso futuro com Importação) | ✅ |

### Sprint 5A — Módulo Importação

| Funcionalidade | Status |
|----------------|--------|
| Fluxo completo: Curso → Pacote → Versão → Arquivo → Validar → Relatório → Salvar → Aplicar | ✅ |
| Leitura CSV, XLSX e JSON | ✅ |
| Validação de colunas obrigatórias | ✅ |
| Validação de alternativas e gabarito (letra vs alternativas) | ✅ |
| Validação de taxonomia (avisos de criação automática) | ✅ |
| Detecção de duplicatas (arquivo + banco) | ✅ |
| Relatório detalhado: erros, duplicatas, avisos, contadores | ✅ |
| Preview das linhas válidas antes de salvar/aplicar | ✅ |
| Confirmação antes de aplicar lote | ✅ |
| Aplicação com rollback compensatório em falha | ✅ |
| Resolução de taxonomia case-insensitive (`ilike`) | ✅ |
| Auditoria `logEvent` (validate, save, apply, cancel) | ✅ |
| Utilitários `src/lib/import.ts` | ✅ |
| Página dedicada `ImportPage.tsx` | ✅ |

### Sprint 5B Etapa 1 — CRUD Pacotes

| Funcionalidade | Status |
|----------------|--------|
| CRUD completo (criar, editar, excluir, listar) | ✅ |
| Paginação server-side (10 por página) | ✅ |
| Busca por nome, slug e descrição | ✅ |
| Filtros por curso e status | ✅ |
| Ordenação por nome | ✅ |
| Validação: nome e curso obrigatórios | ✅ |
| Unicidade CI do nome por curso | ✅ Migration + validação UI |
| Slug gerado automaticamente | ✅ |
| Status ACTIVE / INACTIVE / ARCHIVED | ✅ |
| Bloqueio de exclusão com vínculos (versões, questões, assinaturas, lotes) | ✅ |
| Auditoria `logEvent` + `created_by` / `updated_by` | ✅ |
| Utilitários `src/lib/packages.ts` | ✅ |
| Página dedicada `PackagesPage.tsx` (sem `CrudPage`) | ✅ |

### Sprint 5B Etapa 2 — CRUD Versões

| Funcionalidade | Status |
|----------------|--------|
| CRUD completo (criar, editar, excluir, listar) | ✅ |
| Paginação server-side (10 por página) | ✅ |
| Busca por nome e número da versão | ✅ |
| Filtros por curso (via pacote), pacote e status | ✅ |
| Ordenação por número da versão | ✅ |
| Validação semântica (1.0, 1.1, 2026.1) | ✅ |
| Unicidade CI do número por pacote | ✅ Migration + validação UI |
| Status DRAFT e READY (criação/edição) | ✅ |
| Status PUBLISHED/ARCHIVED somente leitura (legado) | ✅ |
| Bloqueio de exclusão com questões e lotes vinculados | ✅ |
| Bloqueio de exclusão de versões publicadas | ✅ |
| Compatibilidade com colunas legadas (`version`, `notes`, `published`) | ✅ Trigger |
| Estrutura pronta para vínculo de questões (`package_version_id`) | ✅ Sem alterar `questions` |
| Sem publicação nesta etapa | ✅ |
| Auditoria `logEvent` + `created_by` / `updated_by` | ✅ |
| Utilitários `src/lib/versions.ts` | ✅ |
| Página dedicada `VersionsPage.tsx` | ✅ |

### Sprint 5B Etapa 3 — Pipeline de Publicação (Fase A)

| Funcionalidade | Status |
|----------------|--------|
| Publicação administrativa de versões READY | ✅ |
| Validação: existe, READY, não publicada | ✅ |
| `status = PUBLISHED`, `published_at`, `published_by` | ✅ |
| Bloqueio de republicação | ✅ |
| Utilitário centralizado `src/lib/publish.ts` | ✅ |
| Ação Publicar + AlertDialog de confirmação | ✅ |
| Colunas Publicado em / Publicado por na listagem | ✅ |
| Auditoria `logEvent` (publish, invalid, fail) | ✅ |
| Sem despublicação, sem Portal Aluno, sem assinaturas | ✅ |

### Sprint 5B Etapa 4 — Distribuição de Conteúdo

| Funcionalidade | Status |
|----------------|--------|
| Tabela `content_distributions` | ✅ Migration criada |
| CRUD administrativo (criar, editar, excluir, listar) | ✅ |
| Ativar / desativar distribuição | ✅ |
| Somente versões PUBLISHED vinculáveis | ✅ Validação UI + trigger DB |
| Múltiplas distribuições por versão | ✅ |
| Filtros: curso, pacote, versão, status, busca | ✅ |
| Paginação, ordenação, loading, toasts | ✅ |
| Datas opcionais com validação | ✅ |
| Status ACTIVE / INACTIVE (SCHEDULED/EXPIRED preparados) | ✅ |
| RLS padrão administrativo | ✅ |
| Auditoria `logEvent` (create, update, delete, activate, deactivate) | ✅ |
| Página `/admin/distributions` + menu lateral | ✅ |
| Utilitários `src/lib/distributions.ts` | ✅ |
| Sem assinaturas, sem consumo aluno | ✅ |

### Sprint 6A — Assinaturas

| Funcionalidade | Status |
|----------------|--------|
| Evolução `subscriptions` com `distribution_id` | ✅ Migration criada |
| Status ACTIVE / INACTIVE | ✅ |
| Unicidade usuário + distribuição | ✅ Índice + validação UI |
| CRUD administrativo completo | ✅ |
| Ativar / desativar assinatura | ✅ |
| Filtros: usuário, distribuição, status, busca | ✅ |
| Validação de datas (expires_at > starts_at) | ✅ |
| Compatibilidade legada (`active`, `course_id`, `package_id`) | ✅ Trigger |
| Auditoria `logEvent` (create, update, delete, activate, deactivate) | ✅ |
| Página dedicada `SubscriptionsPage.tsx` | ✅ |
| Utilitários `src/lib/subscriptions.ts` | ✅ |
| Sem Portal do Aluno, pagamentos ou renovação | ✅ |

### Sprint 7A — Motor de Sessões de Estudo

| Funcionalidade | Status |
|----------------|--------|
| Tabelas `study_sessions` e `study_session_questions` | ✅ Migration criada |
| Enums `study_mode` (5 modos) e `study_session_status` | ✅ |
| RLS: aluno vê apenas suas sessões; admin conforme padrão | ✅ |
| Utilitário `createStudySession` (sem carregar questões) | ✅ |
| Validação: auth, assinatura ativa, distribuição ativa | ✅ |
| Listagem de distribuições liberadas por assinatura | ✅ |
| UI de configuração: modo, quantidade, ordem, mostrar respostas | ✅ |
| Modo Prova força respostas apenas no final | ✅ |
| Auditoria `study.session.create` via `logEvent` | ✅ |
| Resolução de questões, cronômetro, estatísticas | ❌ Fora do escopo |

#### Sprint 7A — arquivos criados

| Arquivo |
|---------|
| `supabase/migrations/20260705010000_study_sessions.sql` |
| `src/lib/study-session.ts` |
| `src/components/app/study/StudyPage.tsx` |

#### Sprint 7A — arquivos alterados

| Arquivo |
|---------|
| `src/routes/_authenticated/app/study.tsx` |
| `src/integrations/supabase/types.ts` |
| `docs/PROJECT_STATUS.md` |

### Sprint 7B — Preparação do motor de resolução

| Funcionalidade | Status |
|----------------|--------|
| Utilitário `src/lib/study-engine.ts` | ✅ |
| `getStudySession` — carregar sessão e validar permissões | ✅ |
| `getSessionQuestions` — localizar versão publicada e questões elegíveis | ✅ |
| `buildQuestionSequence` — ordem aleatória/sequencial e quantidade | ✅ |
| `getNextQuestion` — próxima questão da sequência (reutilizável) | ✅ |
| `openStudySession` — orquestração + auditoria `study.session.open` | ✅ |
| Página `/app/study/$sessionId` com estados estruturais | ✅ |
| Componentes `SessionHeader` e `SessionProgress` | ✅ |
| Botão "Iniciar resolução" (sem ação — Sprint 7C) | ✅ |
| Responder questões, resultado, estatísticas | ❌ Fora do escopo |

#### Sprint 7B — arquivos criados

| Arquivo |
|---------|
| `src/lib/study-engine.ts` |
| `src/components/app/study/SessionHeader.tsx` |
| `src/components/app/study/SessionProgress.tsx` |
| `src/components/app/study/StudySessionPage.tsx` |
| `src/routes/_authenticated/app/study.$sessionId.tsx` |

#### Sprint 7B — arquivos alterados

| Arquivo |
|---------|
| `docs/PROJECT_STATUS.md` |
| `src/routeTree.gen.ts` (gerado automaticamente pelo router) |

### Sprint 7C — Motor de resolução de questões

| Funcionalidade | Status |
|----------------|--------|
| `startStudySession()` — cria `study_session_questions` uma única vez | ✅ |
| `loadQuestion()` — carrega enunciado e alternativas | ✅ |
| `saveAnswer()` — salva resposta, tempo e `is_correct` | ✅ |
| `goToNextQuestion()` / `goToPreviousQuestion()` — navegação com validação | ✅ |
| `finishStudySession()` — status FINISHED, `finished_at`, `duration_seconds` | ✅ |
| Modo Estudo: feedback imediato + explicação/bibliografia/referência legal | ✅ |
| Modo Prova: salva sem exibir resultado | ✅ |
| UI: enunciado, alternativas, Responder, Anterior, Próxima, Finalizar | ✅ |
| Componentes `QuestionCard`, `QuestionOptions`, `QuestionNavigation` | ✅ |
| Auditoria: `study.session.start`, `study.question.answer`, `study.session.finish` | ✅ |
| Relatório final, estatísticas, favoritos, revisão | ❌ Fora do escopo (Sprint 7D+) |

#### Sprint 7C — arquivos criados

| Arquivo |
|---------|
| `src/components/app/study/QuestionCard.tsx` |
| `src/components/app/study/QuestionOptions.tsx` |
| `src/components/app/study/QuestionNavigation.tsx` |

#### Sprint 7C — arquivos alterados

| Arquivo |
|---------|
| `src/lib/study-engine.ts` |
| `src/components/app/study/StudySessionPage.tsx` |
| `src/components/app/study/SessionProgress.tsx` |
| `docs/PROJECT_STATUS.md` |

### Sprint 7D — Dashboard do Aluno

| Funcionalidade | Status |
|----------------|--------|
| Home `/app` com resumo inteligente do aluno | ✅ |
| Cards: questões respondidas, aproveitamento, sessões concluídas, tempo total | ✅ |
| Card "Continuar última sessão" (IN_PROGRESS) | ✅ |
| Minhas distribuições com questões, última atividade e botão Estudar | ✅ |
| Últimas 5 sessões com acertos, tempo e Ver resultado | ✅ |
| Tabela de desempenho por disciplina (menor → maior %) | ✅ |
| Utilitário `src/lib/student-dashboard.ts` | ✅ |
| Auditoria `student.dashboard.view` via `logEvent` | ✅ |
| Gráficos, IA, favoritos, revisão, ranking, gamificação | ❌ Fora do escopo |

#### Sprint 7D — arquivos criados

| Arquivo |
|---------|
| `src/lib/student-dashboard.ts` |
| `src/components/app/dashboard/StudentDashboardPage.tsx` |
| `src/components/app/dashboard/DashboardStats.tsx` |
| `src/components/app/dashboard/ContinueStudyCard.tsx` |
| `src/components/app/dashboard/DistributionCard.tsx` |
| `src/components/app/dashboard/RecentSessions.tsx` |
| `src/components/app/dashboard/SubjectPerformanceTable.tsx` |

#### Sprint 7D — arquivos alterados

| Arquivo |
|---------|
| `src/routes/_authenticated/app/index.tsx` |
| `docs/PROJECT_STATUS.md` |

### Sprint 7E — Filtros de estudo

| Funcionalidade | Status |
|----------------|--------|
| Favoritar / remover favorito durante resolução (`favorite`) | ✅ |
| Marcar / remover revisar depois (`review_later`) | ✅ |
| Modos REVIEW, FAVORITES, WRONG_ONLY na criação de sessão | ✅ |
| Validação: não criar sessão vazia para modos filtrados | ✅ |
| Filtro de questões no motor (`getSessionQuestions`) | ✅ |
| Indicadores no dashboard: favoritas, revisar, pendentes | ✅ |
| Componente `QuestionActions` | ✅ |
| Auditoria: favorite, unfavorite, review, session.review.create | ✅ |
| IA, ranking, gamificação | ❌ Fora do escopo |

#### Sprint 7E — arquivos criados

| Arquivo |
|---------|
| `src/components/app/study/QuestionActions.tsx` |
| `src/components/app/dashboard/StudyFilterIndicators.tsx` |

#### Sprint 7E — arquivos alterados

| Arquivo |
|---------|
| `src/lib/study-session.ts` |
| `src/lib/study-engine.ts` |
| `src/lib/student-dashboard.ts` |
| `src/components/app/study/StudyPage.tsx` |
| `src/components/app/study/StudySessionPage.tsx` |
| `src/components/app/dashboard/StudentDashboardPage.tsx` |
| `docs/PROJECT_STATUS.md` |

### Sprint 7F — Polimento geral do MVP

| Melhoria | Status |
|----------|--------|
| Componentes compartilhados: `EmptyState`, `PageErrorState`, `AdminTableBody` | ✅ |
| Utilitário `formatAdminError` para mensagens consistentes | ✅ |
| Skeletons em tabelas admin (Bancas, Cursos, Pacotes, Usuários) | ✅ |
| Portal Aluno: skeletons, empty states, erros com retry | ✅ |
| Fluxo pós-criação de sessão → link direto para resolução | ✅ |
| Correção contagem assinaturas no dashboard admin (`status = ACTIVE`) | ✅ |
| Botões com labels de carregamento (export, import, favoritos) | ✅ |
| Remoção de código morto (`CrudPage.tsx`) | ✅ |
| Padronização `space-y-6` no dashboard do aluno | ✅ |

#### Sprint 7F — arquivos criados

| Arquivo |
|---------|
| `src/lib/admin-ui.ts` |
| `src/components/shared/EmptyState.tsx` |
| `src/components/shared/PageErrorState.tsx` |
| `src/components/admin/shared/AdminTableBody.tsx` |

#### Sprint 7F — arquivos alterados

| Arquivo |
|---------|
| `src/components/admin/taxonomy/BoardsPage.tsx` |
| `src/components/admin/courses/CoursesPage.tsx` |
| `src/components/admin/packages/PackagesPage.tsx` |
| `src/components/admin/import/ImportPage.tsx` |
| `src/routes/_authenticated/admin/users.tsx` |
| `src/routes/_authenticated/admin/index.tsx` |
| `src/routes/_authenticated/admin/export.tsx` |
| `src/components/app/dashboard/StudentDashboardPage.tsx` |
| `src/components/app/dashboard/RecentSessions.tsx` |
| `src/components/app/dashboard/SubjectPerformanceTable.tsx` |
| `src/components/app/study/StudyPage.tsx` |
| `src/components/app/study/StudySessionPage.tsx` |
| `src/components/app/study/QuestionActions.tsx` |
| `docs/PROJECT_STATUS.md` |

#### Sprint 7F — arquivos removidos

| Arquivo |
|---------|
| `src/components/admin/CrudPage.tsx` |

### RC1 — Validação final do MVP

| Entrega | Status |
|---------|--------|
| Auditoria TypeScript (`tsc --noEmit`) | ✅ Sem erros |
| Build de produção (`npm run build`) | ✅ |
| Correção `shared.ts` → `shared.tsx` (JSX) | ✅ |
| Correção join publicador em Versões | ✅ |
| Correção tipagem `import.ts` / `student-dashboard.ts` | ✅ |
| Documento `docs/RC1_CHECKLIST.md` | ✅ |
| Testes manuais E2E | ⚠️ Pendente (requer `db push`) |

#### RC1 — arquivos criados

| Arquivo |
|---------|
| `docs/RC1_CHECKLIST.md` |
| `src/components/admin/taxonomy/shared.tsx` |

#### RC1 — arquivos alterados

| Arquivo |
|---------|
| `src/components/admin/versions/VersionsPage.tsx` |
| `src/lib/import.ts` |
| `src/lib/student-dashboard.ts` |
| `src/routes/_authenticated/admin/index.tsx` |
| `docs/PROJECT_STATUS.md` |

#### RC1 — arquivos removidos

| Arquivo |
|---------|
| `src/components/admin/taxonomy/shared.ts` |

---

## RC2 — Design System e Redesign Visual (Admin + Aluno)

**Objetivo:** consolidar um Design System oficial e redesenhar, em documentação de Product Design, o Portal do Aluno e o Portal Administrativo por completo — sem alterar código, arquitetura, regras de negócio, queries ou dados em nenhuma etapa.

| Etapa | Escopo | Status |
|-------|--------|--------|
| RC1.2D | Auditoria de UX/UI (Admin + Aluno) | ✅ Concluída |
| RC1.2F | Visão de produto e estratégia de UX | ✅ Concluída |
| RC1.2G | Design System oficial (`DESIGN_SYSTEM.md`) | ✅ Concluída |
| RC1.2H–K | Redesign do Portal do Aluno (Dashboard, Estudo, Resultado, Histórico) | ✅ Concluída |
| RC1.2L | Revisão de consistência do Portal do Aluno | ✅ Concluída |
| RC2.0 | Guia visual premium (`UI_PREMIUM_GUIDELINES_RC2.0.md`, 35 decisões) | ✅ Concluída |
| — | Auditoria final do Portal do Aluno | ✅ Aprovado com pequenos ajustes |
| RC2.1 | Dashboard Admin | ✅ Concluída |
| RC2.2 | Importação e Histórico de Importações | ✅ Concluída |
| RC2.3 | Questões (Lista, Filtros, Formulário) | ✅ Concluída — aprovado com pequenos ajustes |
| RC2.4 | Taxonomia — Bancas, Concursos, Disciplinas, Assuntos, Cargos, Cursos | ✅ Concluída |
| RC2.5 | Pacotes e Versões | ✅ Concluída |
| RC2.6 | Distribuições e Assinaturas | ✅ Concluída |
| — | Auditoria final de todo o pacote RC2 (`RC2_FINAL_AUDIT.md`) | ✅ **RC2 aprovada com pequenos ajustes** — 14 itens registrados, 0 bloqueantes |

**Entregas:** ~28 documentos de Product Design em `docs/`, cobrindo os dois portais por completo (`DESIGN_REVIEW_CHECKLIST.md` executado em cada um). Nenhuma implementação de código realizada nesta fase — todo o trabalho é especificação, pronta para a sprint de implementação no Cursor.

**Pendente:** implementação em código das decisões registradas; os 14 itens de `RC2_FINAL_AUDIT.md` (nenhum bloqueante) devem ser incorporados durante essa implementação.

---

## Documentação

| Arquivo | Status |
|---------|--------|
| `docs/CURSOR_RULES.md` | ✅ Constituição oficial |
| `docs/00-VISAO-GERAL.md` | ✅ Visão de produto e MVP |
| `docs/01-ARQUITETURA.md` | ✅ Arquitetura técnica |
| `docs/PROJECT_STATUS.md` | ✅ Este documento |
| `docs/BOOTSTRAP-PRIMEIRO-ADMIN.md` | ✅ Procedimento do primeiro admin |
| `docs/RC1_CHECKLIST.md` | ✅ Checklist validação RC1 |
| `docs/02-BANCO-DE-DADOS.md` | ❌ Pendente |
| `docs/examples/questions-demo.csv` | ✅ Exemplo para importação |

---

## Stack e infraestrutura

| Camada | Tecnologia | Status |
|--------|------------|--------|
| Frontend | TanStack Start + React 19 | ✅ |
| UI | Shadcn UI + Tailwind CSS v4 | ✅ |
| Estado | TanStack Query | ✅ |
| Backend | Supabase (Auth, PostgreSQL, RLS) | ✅ conectado via Lovable Cloud |
| Build | Vite 8 + Nitro | ✅ |

---

## Migrations (banco de dados)

| Arquivo | Conteúdo | Aplicação no remoto |
|---------|----------|---------------------|
| `20260702152648_*.sql` | Schema completo, RLS inicial, roles, triggers | ⚠️ Confirmar no Dashboard |
| `20260702152657_*.sql` | Revoga `EXECUTE` de funções sensíveis | ⚠️ Confirmar no Dashboard |
| `20260702161516_*.sql` | `packages.course_id`, FKs em `questions`, trigger de versão publicada | ⚠️ Confirmar no Dashboard |
| `20260703143321_fix_taxonomy_rls.sql` | Policies RLS das 6 tabelas de taxonomia (duplicatas da migration inicial) | ⚠️ Opcional — não corrige EXECUTE |
| `20260704161000_grant_has_role_execute.sql` | Restaura `GRANT EXECUTE` em `has_role` para `authenticated` | ⚠️ Pendente de `db push` ou SQL Editor |
| `20260704182000_harden_courses_unique_name.sql` | Índice único CI em `courses.name` | ⚠️ Pendente de `db push` ou SQL Editor |
| `20260704190000_harden_taxonomy_unique_names.sql` | Índices únicos CI em positions, boards, exams, subjects, topics | ⚠️ Pendente de `db push` ou SQL Editor |
| `20260704200000_harden_packages_crud.sql` | Enum `package_status`, slug, auditoria, `course_id` NOT NULL, índices únicos CI | ⚠️ Pendente de `db push` ou SQL Editor |
| `20260704210000_harden_package_versions_crud.sql` | Enum `package_version_status`, version_number, name, auditoria, índice único CI | ⚠️ Pendente de `db push` ou SQL Editor |
| `20260704220000_package_versions_publication.sql` | Campos `published_at` e `published_by` | ⚠️ Pendente de `db push` ou SQL Editor |
| `20260704230000_content_distributions.sql` | Tabela `content_distributions`, enum, RLS, trigger | ⚠️ Pendente de `db push` ou SQL Editor |
| `20260705000000_subscriptions_distribution.sql` | `distribution_id`, status, expires_at, auditoria, trigger legado | ⚠️ Pendente de `db push` ou SQL Editor |
| `20260705010000_study_sessions.sql` | Tabelas `study_sessions`, `study_session_questions`, enums, RLS | ⚠️ Pendente de `db push` ou SQL Editor |

---

## Funcionalidades implementadas

### Portal Admin (`/admin`)

| Módulo | Rota | Status |
|--------|------|--------|
| Dashboard | `/admin` | ✅ |
| Taxonomia (CRUD) | `/admin/courses`, `positions`, `boards`, `exams`, `subjects`, `topics` | ✅ Completo (padrão Cursos) |
| Questões (listar/editar) | `/admin/questions` | ✅ CRUD completo (Sprint 4) |
| Importação | `/admin/import` | ✅ Completo (Sprint 5A) |
| Exportação | `/admin/export` | ✅ |
| Pacotes | `/admin/packages` | ✅ CRUD completo (Sprint 5B-1) |
| Versões + publicação | `/admin/versions` | ✅ CRUD + publicação (Sprint 5B-2/3) |
| Distribuições | `/admin/distributions` | ✅ Completo (Sprint 5B-4) |
| Usuários (leitura) | `/admin/users` | ✅ |
| Assinaturas | `/admin/subscriptions` | ✅ Completo (Sprint 6A) |

### Portal Aluno (`/app`)

| Módulo | Rota | Status |
|--------|------|--------|
| Dashboard | `/app` | ✅ Sprint 7D |
| Sessões de estudo (infraestrutura) | `/app/study` | ✅ Sprint 7A |
| Sessão de estudo (preparação) | `/app/study/$sessionId` | ✅ Sprint 7B/7C |

### Público

| Módulo | Rota | Status |
|--------|------|--------|
| Landing | `/` | ✅ |
| Login / cadastro | `/auth` | ✅ |

---

## Funcionalidades incompletas ou ausentes

| Área | Status | Observação |
|------|--------|------------|
| Gate de autenticação nos portais | ✅ Reativado (Sprint 1C) | `_authenticated/route.tsx`, `AppShell.tsx` |
| Histórico do aluno | ❌ | Schema `question_attempts` pronto; sem rota |
| Favoritos do aluno | ❌ | Tabela `favorites` pronta; sem rota |
| Estatísticas do aluno | ❌ | Tabela `statistics` pronta; sem rota e sem atualização no estudo |
| Logs admin (leitura) | ❌ | Apenas escrita via `logEvent` |
| Configurações admin | ❌ | Rota não criada |
| Promover usuário a admin (UI) | ❌ | Somente via SQL manual |
| Testes automatizados | ❌ | Nenhum arquivo de teste |
| Camada `services/` | ❌ | Lógica Supabase inline nas rotas |

---

## Bloqueios conhecidos

### 1. RLS na taxonomia (correção em andamento — Sprint 1B)

**Erro:** `new row violates row-level security policy for table "courses"`

**Tabelas afetadas:** `courses`, `positions`, `boards`, `exams`, `subjects`, `topics`

**Causa raiz confirmada (Sprint 1A):**

1. **P1** — `REVOKE EXECUTE` em `has_role` para `authenticated` (migration `20260702152657`) sem `GRANT` de volta → policies RLS não avaliam corretamente
2. **P3** — usuário operador sem role `admin` em `user_roles` (signup cria apenas `student`)

**Correções entregues no repositório:**

- Migration `20260704161000_grant_has_role_execute.sql`
- Procedimento em `docs/BOOTSTRAP-PRIMEIRO-ADMIN.md`

**Ação pendente (manual, após merge):**

```bash
npx supabase link --project-ref snbhstgvsfjfyfbwxdae
npx supabase db push
```

Em seguida, promover o operador conforme `docs/BOOTSTRAP-PRIMEIRO-ADMIN.md`.

> A migration `fix_taxonomy_rls.sql` **não** resolve o bloqueio — apenas duplica policies já existentes na migration inicial.

### 2. Supabase CLI

| Item | Antes | Agora |
|------|-------|-------|
| `supabase/config.toml` → `project_id` | `frmlgashowxerddfessd` (incorreto) | `snbhstgvsfjfyfbwxdae` ✅ |

Vinculação e push de migrations ainda dependem de execução manual com credenciais.

---

## Ordem oficial de trabalho

Conforme `CURSOR_RULES.md`:

1. ~~Documentação~~ — em andamento
2. ~~Auditoria fundação (Sprint 1A)~~ — concluída
3. ~~Correções fundação (Sprint 1B)~~ — concluída (migration + bootstrap admin)
4. ~~Correções frontend auth (Sprint 1C)~~ — concluída
5. **Testes** — em andamento (RC1: build/tsc OK; E2E manual pendente)
6. Novas funcionalidades
7. Deploy

---

## Próximos passos recomendados

| # | Ação | Responsável |
|---|------|-------------|
| 1 | Aplicar migrations pendentes (auth + cursos + taxonomia) | Manual |
| 2 | Promover operador a admin (`docs/BOOTSTRAP-PRIMEIRO-ADMIN.md`) | Manual |
| 3 | Testar fluxos de auth (ver Sprint 1C abaixo) | Manual |
| 4 | Testar cadastro em `/admin/courses` após push + promoção | Manual |
| 5 | Testar módulo Questões (ver Sprint 4 abaixo) | Manual |
| 6 | Testar módulo Importação (ver Sprint 5A abaixo) | Manual |
| 7 | Testar CRUD Pacotes (ver Sprint 5B-1 abaixo) | Manual |
| 8 | Testar CRUD Versões (ver Sprint 5B-2 abaixo) | Manual |
| 9 | Testar publicação de versões (ver Sprint 5B-3 abaixo) | Manual |
| 10 | Testar distribuições (ver Sprint 5B-4 abaixo) | Manual |
| 11 | Testar assinaturas (ver Sprint 6A abaixo) | Manual |
| 12 | Testar sessões de estudo (ver Sprint 7A abaixo) | Manual |
| 13 | Testar motor de resolução (ver Sprint 7B abaixo) | Manual |
| 14 | Testar resolução de questões (ver Sprint 7C abaixo) | Manual |
| 15 | Testar dashboard do aluno (ver Sprint 7D abaixo) | Manual |
| 16 | Testar filtros de estudo (ver Sprint 7E abaixo) | Manual |
| 17 | Testar polimento geral (ver Sprint 7F abaixo) | Manual |
| 18 | Criar `docs/02-BANCO-DE-DADOS.md` | Pendente |

### Testes Sprint 7F — Polimento geral

| Cenário | Resultado esperado |
|---------|-------------------|
| Admin: abrir Cursos, Bancas, Pacotes, Usuários | Skeletons durante carregamento; empty states padronizados |
| Admin: dashboard | Contagem de assinaturas ativas correta |
| Admin: exportação | Botão exibe "Exportando..." durante operação |
| Admin: importação | Botões exibem "Validando..." / "Salvando..." |
| Aluno: `/app` | Erro com botão "Tentar novamente"; empty states com ícone |
| Aluno: `/app/study` | Skeleton, erro com retry, empty state padronizado |
| Aluno: criar sessão | Botão "Iniciar sessão" navega para `/app/study/{id}` |
| Aluno: sessão ativa | Erro ao carregar questão não fica em skeleton infinito |
| Responsividade | Layouts funcionam em mobile e desktop |

### Testes Sprint 7E — Filtros de estudo

| Cenário | Resultado esperado |
|---------|-------------------|
| Durante resolução, clicar Favoritar | `favorite=true` em `study_session_questions`; log `study.question.favorite` |
| Clicar Remover favorito | `favorite=false`; log `study.question.unfavorite` |
| Clicar Revisar depois | `review_later=true`; log `study.question.review` |
| `/app/study` → modo Favoritos sem favoritas | Toast amigável; sessão não criada |
| Modo Revisão sem questões marcadas | Toast amigável; sessão não criada |
| Modo Apenas erradas sem erros | Toast amigável; sessão não criada |
| Criar sessão Favoritos com favoritas existentes | Sessão criada; log `study.session.review.create` |
| Iniciar e resolver sessão filtrada | Apenas questões filtradas na sequência |
| Dashboard `/app` | Indicadores de favoritas, revisar depois e pendentes visíveis |

### Testes Sprint 7D — Dashboard do Aluno

| Cenário | Resultado esperado |
|---------|-------------------|
| Login como aluno → `/app` | Dashboard carrega com saudação e cards superiores |
| Sem sessões respondidas | Cards zerados; estados vazios nas seções |
| Após responder questões em sessões | Cards atualizam: respondidas, aproveitamento, tempo |
| Sessão IN_PROGRESS existente | Card "Continuar última sessão" visível com progresso |
| Sem sessão em andamento | Card de continuar oculto |
| Assinatura com distribuições ativas | Seção "Minhas distribuições" lista cards com botão Estudar |
| Histórico de sessões | Últimas 5 sessões com data, modo, acertos e tempo |
| Clicar Ver resultado | Navega para `/app/study/{sessionId}` |
| Desempenho por disciplina | Tabela ordenada do menor ao maior percentual |
| Verificar auditoria | Evento `student.dashboard.view` em `logs` |

### Testes Sprint 7C — Resolução de questões

| Cenário | Resultado esperado |
|---------|-------------------|
| Criar sessão e abrir `/app/study/{sessionId}` | Tela de preview com botão Iniciar resolução |
| Clicar Iniciar resolução | Registros criados em `study_session_questions`; log `study.session.start` |
| Visualizar questão | Enunciado e alternativas exibidos; "Questão X de Y" |
| Responder sem selecionar alternativa | Botão Responder desabilitado |
| Responder questão (modo Estudo) | Feedback correto/incorreto; explicação quando existir |
| Responder questão (modo Prova) | Salva resposta; sem feedback visual |
| Tentar Próxima sem responder | Erro: responda antes de avançar |
| Responder e avançar | Próxima questão carregada |
| Voltar para questão anterior | Alternativa previamente marcada exibida |
| Finalizar na última questão | `study_sessions.status = FINISHED`; mensagem de sucesso |
| Verificar `study_session_questions` | `selected_answer`, `answered_at`, `response_time_seconds`, `is_correct` preenchidos |
| Verificar auditoria | Eventos `study.question.answer` e `study.session.finish` em `logs` |

### Testes Sprint 7B — Motor de resolução

| Cenário | Resultado esperado |
|---------|-------------------|
| Criar sessão em `/app/study` (Sprint 7A) | Registro em `study_sessions` |
| Acessar `/app/study/{sessionId}` | Página carrega com Skeleton → dados da sessão |
| Sessão válida com questões na versão | Título, modo, quantidade, progresso `0 de X`, botão desabilitado |
| Sessão inexistente ou de outro usuário | Estado "Sessão não encontrada" |
| Sessão com `status = FINISHED` | Estado "Sessão finalizada" |
| Versão sem questões | Estado "Sessão sem questões" |
| Configuração quantidade 10 | Progresso total = min(10, questões elegíveis) |
| Configuração "Todas" | Progresso total = todas as questões da versão |
| Verificar auditoria | Evento `study.session.open` em `logs` |

### Testes Sprint 7A — Sessões de Estudo

| Cenário | Resultado esperado |
|---------|-------------------|
| Aplicar migration `20260705010000` | Tabelas e enums criados; RLS ativo |
| Login como aluno sem assinatura ativa | `/app/study` exibe estado vazio |
| Admin: criar curso → pacote → versão → publicar → distribuição ativa | Pipeline admin OK |
| Admin: assinatura ACTIVE vinculada ao aluno + distribuição | Assinatura vigente |
| Acessar `/app/study` como aluno | Lista apenas distribuições liberadas |
| Selecionar distribuição | Tela de configuração: modo, quantidade, ordem, mostrar respostas |
| Modo Prova | Opção "Durante" desabilitada; forçado "Apenas no final" |
| Clicar "Criar sessão" | Toast sucesso; registro em `study_sessions` (sem questões em `study_session_questions`) |
| Verificar auditoria | Evento `study.session.create` em logs |
| Assinatura inativa ou distribuição inativa | Criação bloqueada com mensagem de erro |

### Testes Sprint 6A — Assinaturas

| Cenário | Resultado esperado |
|---------|-------------------|
| Aplicar migration `20260705000000` | Colunas distribution_id, status, expires_at criadas |
| Acessar `/admin/subscriptions` | Página dedicada carrega |
| Criar assinatura usuário + distribuição ativa | Sucesso; status Ativa |
| Duplicar mesma combinação | Toast: já existe assinatura |
| Assinaturas diferentes para mesmo usuário | Sucesso |
| Expiração antes do início | Toast de validação |
| Desativar / ativar | Status alterna + logs |
| Buscar por e-mail do usuário | Filtra resultados |
| Excluir assinatura | Confirmação → sucesso |

### Testes Sprint 5B Etapa 4 — Distribuições

| Cenário | Resultado esperado |
|---------|-------------------|
| Aplicar migration `20260704230000` | Tabela `content_distributions` criada |
| Acessar `/admin/distributions` | Menu e página carregam |
| Criar distribuição sem versão publicada | Select vazio ou erro ao salvar |
| Publicar versão → criar distribuição | Sucesso com status Ativa |
| Criar segunda distribuição na mesma versão | Sucesso |
| Filtrar por curso/pacote/versão/status | Lista reduzida |
| Desativar distribuição | Status Inativa + log deactivate |
| Reativar distribuição | Status Ativa + log activate |
| Data final antes da inicial | Toast de validação |
| Excluir distribuição | Confirmação → sucesso |

### Testes Sprint 5B Etapa 3 — Publicação

| Cenário | Resultado esperado |
|---------|-------------------|
| Aplicar migration `20260704220000` | Colunas published_at e published_by criadas |
| Versão DRAFT → botão Publicar ausente | Sem ação de publicação |
| Versão READY → Publicar | AlertDialog de confirmação |
| Confirmar publicação | status PUBLISHED; toast sucesso; colunas preenchidas |
| Tentar publicar novamente | Toast: já publicada |
| Versão ARCHIVED | Sem botão Publicar |
| Trigger single-published | Apenas uma `published=true` por pacote (legado) |

### Testes Sprint 5B Etapa 2 — Versões

| Cenário | Resultado esperado |
|---------|-------------------|
| Aplicar migration `20260704210000` | Colunas version_number, name, status, auditoria criadas |
| Listar versões em `/admin/versions` | Tabela com número, nome, pacote, curso, status |
| Criar versão 1.0 no pacote PF-Português | Sucesso; status DRAFT |
| Criar versão 1.0 no mesmo pacote | Toast: número duplicado |
| Criar versão 1.0 em outro pacote | Sucesso |
| Número inválido (ex.: "v1") | Toast de validação semântica |
| Filtrar por curso, pacote e status | Lista reduzida |
| Editar nome e marcar READY | Toast "Versão atualizada" |
| Excluir com questões vinculadas | Dialog bloqueado |
| Excluir versão publicada (legado) | Botão desabilitado / bloqueio |
| Importação continua listando versões | Campo `version` sincronizado via trigger |

### Testes Sprint 5B Etapa 1 — Pacotes

| Cenário | Resultado esperado |
|---------|-------------------|
| Aplicar migration `20260704200000` | Colunas slug, status, created_by, updated_by criadas |
| Listar pacotes em `/admin/packages` | Tabela com nome, curso, slug, status |
| Criar pacote sem nome | Toast "Nome é obrigatório" |
| Criar pacote sem curso | Toast "Curso é obrigatório" |
| Criar "PF - Português" no curso PF | Sucesso; slug gerado automaticamente |
| Criar "pf - português" no mesmo curso | Toast: já existe (CI) |
| Criar "PF - Português" em outro curso | Sucesso (nome único por curso) |
| Filtrar por curso e status | Lista reduzida |
| Buscar por nome/slug | Filtra resultados |
| Editar status para INACTIVE | Toast "Pacote atualizado" |
| Excluir com versões/questões vinculadas | Dialog bloqueado |
| Excluir sem vínculos | Exclusão com sucesso |

### Testes Sprint 5A — Importação

| Cenário | Resultado esperado |
|---------|-------------------|
| Validar sem curso/pacote/versão | Toast: selecione antes de validar |
| Upload `docs/examples/questions-demo.csv` | Relatório com contadores |
| Arquivo sem coluna `subject` | Erro de colunas obrigatórias ausentes |
| Gabarito inexistente nas alternativas | Linha marcada como inválida |
| Disciplina nova no arquivo | Aviso "será criada na aplicação" |
| Enunciado duplicado no arquivo | Duplicata no relatório |
| Enunciado já existente no banco | Duplicata "Já existe no banco" |
| Salvar lote com linhas válidas | Lote `pending` no histórico |
| Aplicar lote | Dialog de confirmação + preview; questões inseridas |
| Cancelar lote pendente | Status `cancelled` |
| Falha na aplicação (ex.: RLS) | Rollback das questões já inseridas |

### Testes Sprint 4 — Questões

| Cenário | Resultado esperado |
|---------|-------------------|
| Criar questão com enunciado + 4 alternativas + gabarito | Toast "Questão criada" |
| Criar sem gabarito ou com &lt;2 alternativas | Toast de validação |
| Editar explicação e metadados | Toast "Questão atualizada" |
| Buscar por trecho do enunciado | Filtra resultados |
| Filtrar por disciplina + ano + dificuldade | Lista reduzida |
| Paginar (&gt;10 questões) | Navegação funciona |
| Excluir com tentativas de aluno | Dialog bloqueado |
| Excluir sem vínculos | Exclusão com sucesso |

### Testes Sprint 3 — Taxonomia

| Módulo | Criar | Editar | Buscar | Paginar | Excluir bloqueado | Excluir livre |
|--------|-------|--------|--------|---------|-------------------|---------------|
| Cargos | Nome + curso obrigatórios | Alterar descrição | Por nome | >10 itens | Com questões | Sem vínculos |
| Bancas | Nome obrigatório | Alterar sigla | Por nome/sigla | >10 itens | Com concursos/questões | Sem vínculos |
| Concursos | Nome + banca | Alterar ano | Por nome | >10 itens | Com questões | Sem vínculos |
| Disciplinas | Nome obrigatório | Alterar descrição | Por nome | >10 itens | Com assuntos/questões | Sem vínculos |
| Assuntos | Nome + disciplina | Alterar descrição | Por nome | >10 itens | Com questões | Sem vínculos |

### Testes Sprint 2B — Hardening Cursos

| Cenário | Resultado esperado |
|---------|-------------------|
| Criar curso "Polícia Federal" | Sucesso |
| Criar curso "polícia federal" | Toast: já existe (índice CI após migration) |
| Excluir curso com cargos | Dialog "Exclusão bloqueada"; sem botão Excluir |
| Excluir curso com assinaturas | Dialog bloqueado |
| Excluir curso com pacotes | Dialog bloqueado |
| Excluir curso sem vínculos | Confirmação → exclusão com sucesso |
| Migration com duplicatas CI no banco | Falha com mensagem orientando resolução manual |

### Testes Sprint 2 — Cursos

| Cenário | Resultado esperado |
|---------|-------------------|
| Listar cursos logado como admin | Tabela com nome, descrição, data |
| Criar curso sem nome | Toast de erro "Nome é obrigatório" |
| Criar curso com nome duplicado | Toast "Já existe um curso com este nome" |
| Editar curso | Dialog preenchido; toast "Curso atualizado" |
| Buscar por nome | Filtra resultados (debounce 300ms) |
| Paginar (>10 cursos) | Navegação anterior/próxima |
| Excluir curso sem vínculos | AlertDialog → confirma → toast sucesso |
| Excluir curso com cargos/assinaturas | AlertDialog lista impacto |
| Usuário sem admin (RLS) | Toast com mensagem de permissão |

### Testes Sprint 1C — auth

| Cenário | Resultado esperado |
|---------|-------------------|
| Acessar `/admin` sem login | Redirect para `/auth` |
| Acessar `/app` sem login | Redirect para `/auth` |
| Login como `student` | Redirect para `/app` |
| Login como `admin` | Redirect para `/admin` |
| `student` acessa `/admin` | Redirect para `/app` |
| `admin` acessa `/app` | Permite acesso |
| Logout | Redirect para `/auth`, cache limpo |

---

## Referências rápidas

| Recurso | Local |
|---------|-------|
| Frase guia | Admin produz e publica. Aluno apenas estuda o comprado. |
| Fluxo sagrado de importação | Arquivo → Validação → Staging → Revisão → Aplicação → Banco |
| Tipos do banco | `src/integrations/supabase/types.ts` |
| Migrations | `supabase/migrations/` |
| Exemplo de importação | `docs/examples/questions-demo.csv` |

---

*Última atualização: julho/2026 — RC2: Design System e redesign visual (Admin + Aluno) encerrados em documentação; implementação pendente.*
