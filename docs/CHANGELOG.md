# SimulaPro — Changelog

Todas as entregas relevantes do projeto, em ordem cronológica.  
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [Não lançado]

### Pendente (RC1.2)

- Exportação profissional: XLSX real, filtros e grandes volumes (`ADM-019`)
- Correção `show_answers: final` durante resolução (`PA-014`)
- Correções de qualidade da auditoria RC1.2A (console, toasts, performance)
- Padronização `AdminTableBody` nos módulos admin restantes

---

## [RC1.2E] — 2026-07-06

### Documentação

- `docs/PRODUCT_BACKLOG.md` — backlog oficial por domínio
- `docs/ROADMAP.md` — roadmap por versão
- `docs/CHANGELOG.md` — este arquivo

---

## [RC2.0] — 2026-07-06

### Documentação

- `docs/DESIGN_PRINCIPLES.md` — referência oficial de UX/UI (13 seções + definição oficial)

---

## [RC1.2D] — 2026-07-06

### Documentação

- `docs/UX_AUDIT_RC1.2D.md` — auditoria de UX/UI (Portal Admin e Aluno), referenciando `DESIGN_PRINCIPLES.md`

---

## [RC1.2C] — 2026-07-06

### Portal do Aluno

- Página **Histórico completo** em `/app/history`
- Tabela paginada (10 por página) com filtros: curso, distribuição, modo, período, status
- Pesquisa por curso, pacote e distribuição
- Resumo superior: total de sessões, questões respondidas, aproveitamento, tempo total
- Ações por sessão: ver resultado, refazer erradas, nova sessão
- Link **"Ver histórico completo →"** no card Últimas sessões do dashboard

### Plataforma

- `src/lib/study-history.ts` — query paginada reutilizada por dashboard (5 sessões) e histórico completo
- `fetchStudentSessionStats` — agregação compartilhada entre dashboard e histórico

---

## [RC1.2B] — 2026-07-06

### Portal do Aluno

- **Resultado detalhado da sessão** após finalização
- Resumo: total, respondidas, acertos, erros, %, tempo total e médio
- Informações da sessão: curso, pacote, versão, distribuição, data/hora
- Lista paginada de questões respondidas com revisão expandível
- Botões: voltar ao dashboard, ver corretas/erradas, refazer erradas (`WRONG_ONLY`), nova sessão

### Plataforma

- Extensão de `openStudySession` com `results` (batch de `questions` por página de resultado)
- Componente `SessionResultsView.tsx`

---

## [RC1.2A] — 2026-07-06

### Documentação

- `docs/RC1_AUDIT.md` — auditoria funcional completa (33 módulos, 54 achados)
- Checklists por módulo: CRUD, filtros, paginação, toasts, estados vazios, responsividade, console, erros

---

## [RC1.1] — 2026-07-06

### Plataforma

- Configuração Supabase 100% RC1 (`ddgpkijytvagmabtttor`)
- Remoção de fallback legado em `client.ts` e alinhamento de variáveis `.env`
- Correção redirect admin em `AppShell` (role `null` não redireciona mais para `/app`)
- Migration `slug` em `courses`, `subjects`, `topics`, `positions`

### Portal Administrativo

- Fix histórico de importação (embed inválido `profiles:created_by`)
- Fix listagem de assinaturas (relacionamento `subscriptions` ↔ `profiles`)
- Exemplos oficiais de importação em `docs/import-examples/`

### Portal do Aluno

- Fix rota `/app/study/$sessionId` (layout com `<Outlet />`)
- Atalhos de filtro padronizados no dashboard (`startFilterSession` única)
- Mensagens vazias padronizadas para Favoritas, Revisar depois e Erradas

---

## [v1.0.0-rc1-complete] — 2026-07

### Marco

- MVP homologado e tagueado no GitHub
- Release Candidate 1 — validação final do MVP

### Portal Administrativo

- Dashboard admin com contadores e última importação/publicação
- CRUD Cursos (com hardening de unicidade e bloqueio de exclusão)
- CRUD Taxonomia: Cargos, Bancas, Concursos, Disciplinas, Assuntos
- CRUD Questões com filtros avançados e alternativas dinâmicas
- Importação completa: CSV, XLSX, JSON — validar, salvar lote, aplicar, cancelar
- CRUD Pacotes (slug, status, unicidade por curso)
- CRUD Versões (numeração semântica, DRAFT → READY → PUBLISHED)
- Pipeline de publicação de versões
- CRUD Distribuições de conteúdo (ativar/desativar)
- CRUD Assinaturas (usuário + distribuição)
- Exportação básica por tabela
- Listagem de usuários (leitura)

### Portal do Aluno

- Dashboard: estatísticas, continuar estudo, distribuições, últimas 5 sessões, desempenho por disciplina
- Criação de sessão: modos Estudo, Prova, Favoritos, Revisão, Apenas erradas
- Resolução: iniciar, responder, navegar, favoritar, revisar depois, finalizar
- Feedback em modo Estudo; modo Prova sem feedback imediato

### Plataforma

- Autenticação login/cadastro com redirect por role
- Gate `_authenticated` e `AppShell` com sidebar
- Tabelas `study_sessions` e `study_session_questions` com RLS
- Motor `study-session.ts` e `study-engine.ts`
- Componentes compartilhados: `EmptyState`, `PageErrorState`, `AdminTableBody`
- Polimento Sprint 7F: skeletons, toasts, empty states, fluxo pós-criação de sessão
- Build e TypeScript sem erros (`RC1_CHECKLIST.md`)

### Documentação (RC1)

- `docs/RC1_CHECKLIST.md`
- `docs/PROJECT_STATUS.md`
- `docs/BOOTSTRAP-PRIMEIRO-ADMIN.md`
- `docs/CURSOR_RULES.md`
- `docs/00-VISAO-GERAL.md`
- `docs/01-ARQUITETURA.md`

---

## Sprints de fundação (pré-RC1)

### Sprint 1 — Auth + RLS

- Diagnóstico RLS taxonomia (Sprint 1A)
- Migration `GRANT EXECUTE` em `has_role` (Sprint 1B)
- Gate de auth no frontend (Sprint 1C)
- Procedimento bootstrap primeiro admin

### Sprints 2–6 — Módulos Admin

- Sprint 2: Cursos
- Sprint 2B: Hardening Cursos
- Sprint 3: Taxonomia (5 módulos)
- Sprint 4: Questões
- Sprint 5A: Importação
- Sprint 5B: Pacotes, Versões, Publicação, Distribuições
- Sprint 6A: Assinaturas

### Sprints 7 — Portal do Aluno

- Sprint 7A: Infraestrutura de sessões
- Sprint 7B: Preparação motor de resolução
- Sprint 7C: Resolução de questões
- Sprint 7D: Dashboard do aluno
- Sprint 7E: Filtros de estudo
- Sprint 7F: Polimento geral do MVP

---

## Convenções deste changelog

| Tipo | Uso |
|------|-----|
| **Adicionado** | Funcionalidade nova entregue no código |
| **Corrigido** | Bug ou regressão resolvida |
| **Documentação** | Arquivos em `docs/` sem alteração de código |
| **Marco** | Tag, release ou homologação formal |

Entradas futuras devem seguir o padrão de versão do [`ROADMAP.md`](./ROADMAP.md) e referenciar IDs do [`PRODUCT_BACKLOG.md`](./PRODUCT_BACKLOG.md) quando aplicável.

---

*Changelog iniciado na RC1. Não lista funcionalidades não entregues — ver seção "Não lançado" e backlog.*
