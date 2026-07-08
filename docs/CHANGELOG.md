# SimulaPro — Changelog

Todas as entregas relevantes do projeto, em ordem cronológica.  
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [Não lançado]

### Pendente (RC1.2)

- Exportação profissional: XLSX real, filtros e grandes volumes (`ADM-019`)
- Correção `show_answers: final` durante resolução (`PA-014`)
- Correções de qualidade da auditoria RC1.2A (console, toasts, performance)
- Padronização `AdminTableBody` nos módulos admin restantes — especificada nos documentos de redesign da RC2, implementação em código pendente

### Pendente (RC2 — implementação)

- Implementação em código de todos os documentos de redesign da RC2 (Portal do Aluno e Portal Administrativo) — nenhuma alteração de código foi feita durante a RC2, apenas especificação
- Os 14 itens registrados em `docs/RC2_FINAL_AUDIT.md` (nenhum bloqueante) devem ser incorporados durante essa implementação

---

## [Sprint 11.2] — 2026-07-08

### Marco

- **Arquitetura Editorial V1.1 homologada** — Curso de Enfermagem, cargo Enfermeiro. Arquitetura congelada.

### Plataforma — Editorial Engine / Acervo

- Migrations aplicadas no Supabase Produção (`ddgpkijytvagmabtttor`): Editorial Engine V2 Lite (Sprint 11.0) e Importador (Sprint 11.1)
- `exam_catalog` e `exam_files` disponíveis e operantes
- Acervo (`/admin/acervo`) funcionando novamente
- Catálogo oficial importado: **67 provas** em `exam_catalog`
- Correção de dados na taxonomia: banca **IDIB** cadastrada; nomes de banca corrigidos no catálogo (**Instituto Consulplan**, **UFPR / NC**)
- Pipeline **CSV/XLSX → questions.json → Seed → Banco** validado, usando a infraestrutura já existente
- Pipeline **PDF → raw.md → questions.raw.json** permanece não implementado — decisão mantida para fase posterior

### Decisão de arquitetura

- **Arquitetura congelada.** Próximos agentes devem trabalhar sobre a infraestrutura existente, sem alterar arquitetura e sem gravar diretamente no banco.

### Próxima fase

1. Primeira prova real
2. `questions.json`
3. Seed
4. Primeiro pacote comercial
5. Teste ponta a ponta
6. Beta
7. Lançamento

---

## [RC2] — 2026-07-07

### Marco

- **Encerramento da RC2** — pacote completo de Product Design para os dois portais, aprovado com pequenos ajustes (`docs/RC2_FINAL_AUDIT.md`: 14 itens registrados, 0 bloqueantes). Nenhuma implementação de código realizada; próxima etapa é a sprint de implementação no Cursor a partir destes documentos.

### Documentação — Design System

- `docs/DESIGN_SYSTEM.md` — Design System oficial (paleta, tipografia, grid, radius, sombras, componentes, estados, ícones, responsividade, microinterações, acessibilidade, consistência, checklist de homologação)
- `docs/UI_PREMIUM_GUIDELINES_RC2.0.md` — guia visual premium (35 decisões de refinamento)
- `docs/DESIGN_REVIEW_CHECKLIST.md` — checklist oficial de revisão de Product Design
- `docs/PRODUCT_VISION_RC1.2F.md` — visão de produto e estratégia de UX

### Documentação — Redesign do Portal do Aluno

- `docs/DASHBOARD_REDESIGN_RC1.2H.md`, `docs/STUDY_EXPERIENCE_REDESIGN_RC1.2I.md`, `docs/SESSION_RESULTS_REDESIGN_RC1.2J.md`, `docs/STUDY_HISTORY_REDESIGN_RC1.2K.md`
- `docs/PRODUCT_CONSISTENCY_REVIEW_RC1.2L.md`
- `docs/PORTAL_ALUNO_FINAL_AUDIT_RC2.md` — aprovado com pequenos ajustes

### Documentação — Redesign do Portal Administrativo

- `docs/ADMIN_UX_AUDIT_RC2.1A.md`, `docs/ADMIN_PRODUCT_ROADMAP_RC2.md`, `docs/ADMIN_DASHBOARD_REDESIGN_RC2.1B.md`
- `docs/ADMIN_IMPORT_REDESIGN_RC2.2A.md`, `docs/ADMIN_IMPORT_HISTORY_REDESIGN_RC2.2B.md`
- `docs/QUESTIONS_MODULE_PLAN_RC2.3.md`, `docs/QUESTIONS_LIST_REDESIGN_RC2.3A.md`, `docs/QUESTIONS_FILTERS_REDESIGN_RC2.3B.md`, `docs/QUESTIONS_FORM_REDESIGN_RC2.3C.md`, `docs/QUESTIONS_MODULE_FINAL_AUDIT_RC2.3.md`
- `docs/TAXONOMY_MODULE_PLAN_RC2.4.md`, `docs/BOARDS_REDESIGN_RC2.4A.md`, `docs/CONTESTS_REDESIGN_RC2.4B.md`, `docs/SUBJECTS_REDESIGN_RC2.4C.md`, `docs/TOPICS_REDESIGN_RC2.4D.md`, `docs/JOBS_REDESIGN_RC2.4E.md`, `docs/COURSES_REDESIGN_RC2.4F.md`
- `docs/PACKAGES_REDESIGN_RC2.5A.md`, `docs/VERSIONS_REDESIGN_RC2.5B.md`
- `docs/DISTRIBUTIONS_REDESIGN_RC2.6A.md`, `docs/SUBSCRIPTIONS_REDESIGN_RC2.6B.md`
- `docs/RC2_FINAL_AUDIT.md` — auditoria final de todo o pacote

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
