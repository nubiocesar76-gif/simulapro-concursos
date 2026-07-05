# RC1 — Checklist de Validação Final do MVP

Release Candidate 1 — auditoria técnica, correções de estabilidade e preparação para produção.

**Data:** julho/2026  
**Escopo:** validação e correções. Sem novas funcionalidades, telas, módulos ou migrations (salvo crítico).

---

## Resumo executivo

| Item | Resultado |
|------|-----------|
| `npx tsc --noEmit` | ✅ Sem erros |
| `npm run build` | ✅ Build concluído |
| `console.log` / `debugger` / `TODO` / `FIXME` em `src/` | ✅ Não encontrados |
| `@ts-ignore` desnecessários | ✅ Não encontrados |
| Código morto (`CrudPage.tsx`) | ✅ Removido (Sprint 7F) |
| Migrations novas nesta RC | ❌ Nenhuma |

---

## Fluxo 1 — Administrador

Validação por revisão de código, compilação e build. Testes manuais end-to-end **pendentes** (requerem `db push` + credenciais).

| Etapa | Rota / módulo | Código | Teste manual |
|-------|---------------|--------|--------------|
| Login | `/auth` → `/admin` | ✅ Gate auth + role admin | ⚠️ Pendente |
| Cursos | `/admin/courses` | ✅ CRUD + AdminTableBody | ⚠️ Pendente |
| Cargos | `/admin/positions` | ✅ CRUD | ⚠️ Pendente |
| Bancas | `/admin/boards` | ✅ CRUD + AdminTableBody | ⚠️ Pendente |
| Concursos | `/admin/exams` | ✅ CRUD | ⚠️ Pendente |
| Disciplinas | `/admin/subjects` | ✅ CRUD | ⚠️ Pendente |
| Assuntos | `/admin/topics` | ✅ CRUD | ⚠️ Pendente |
| Questões | `/admin/questions` | ✅ CRUD completo | ⚠️ Pendente |
| Importação | `/admin/import` | ✅ Pipeline completo | ⚠️ Pendente |
| Pacotes | `/admin/packages` | ✅ CRUD + AdminTableBody | ⚠️ Pendente |
| Versões | `/admin/versions` | ✅ CRUD + publicação | ⚠️ Pendente |
| Publicação | Ação em Versões | ✅ `publishPackageVersion` | ⚠️ Pendente |
| Distribuição | `/admin/distributions` | ✅ CRUD + ativar/desativar | ⚠️ Pendente |
| Assinaturas | `/admin/subscriptions` | ✅ CRUD + ativar/desativar | ⚠️ Pendente |

**Itens aprovados (código):** todos os módulos admin implementados; mensagens de erro padronizadas em páginas polidas (7F); dashboard admin com contagem de assinaturas `status = ACTIVE`.

---

## Fluxo 2 — Aluno

| Etapa | Rota | Código | Teste manual |
|-------|------|--------|--------------|
| Login | `/auth` → `/app` | ✅ Gate auth + role student | ⚠️ Pendente |
| Dashboard | `/app` | ✅ Stats, distribuições, sessões | ⚠️ Pendente |
| Distribuições | `/app/study` | ✅ Lista por assinatura ativa | ⚠️ Pendente |
| Criar sessão | `/app/study` | ✅ Modos, quantidade, ordem | ⚠️ Pendente |
| Resolver questões | `/app/study/$sessionId` | ✅ Motor completo (7B/7C) | ⚠️ Pendente |
| Favoritar | Durante resolução | ✅ `QuestionActions` | ⚠️ Pendente |
| Revisar depois | Durante resolução | ✅ `QuestionActions` | ⚠️ Pendente |
| Finalizar | Sessão | ✅ `finishStudySession` | ⚠️ Pendente |
| Resultado | Pós-finalização | ✅ Estado FINISHED + dashboard | ⚠️ Pendente |
| Nova sessão | `/app/study` | ✅ Criação repetível | ⚠️ Pendente |

**Itens aprovados (código):** motor de estudo, filtros (Favoritos/Revisar/Erradas), empty states e retry no portal aluno.

---

## Auditoria de código

| Verificação | Resultado |
|-------------|-----------|
| `console.log` | ✅ Ausente em `src/` |
| `debugger` | ✅ Ausente |
| `TODO` / `FIXME` | ✅ Ausente |
| `@ts-ignore` | ✅ Ausente |
| Imports não utilizados | ✅ Sem bloqueios no build |
| Componentes mortos | ✅ `CrudPage.tsx` removido (7F) |
| `as any` desnecessários | ⚠️ Mantidos em `admin/index.tsx` (CountCard genérico) e `routeTree.gen.ts` (gerado) |

---

## TypeScript

| Verificação | Resultado |
|-------------|-----------|
| `npx tsc --noEmit` | ✅ Passou após correções RC1 |
| `any` desnecessários | ⚠️ Parcial — ver acima |
| Null/undefined | ✅ Corrigidos em `student-dashboard.ts`, `import.ts` |

---

## TanStack Query

| Verificação | Resultado |
|-------------|-----------|
| Query keys por módulo | ✅ Padrão consistente (`["entity", filters...]`) |
| Invalidação pós-mutation | ✅ `invalidateQueries` nas mutations admin |
| Loading / erro | ✅ AdminTableBody + PageErrorState no aluno |
| Consultas duplicadas | ✅ Sem duplicatas críticas identificadas |

---

## RLS

Validação por revisão de migrations e policies. **Teste runtime pendente** (depende de `db push`).

| Área | Policies | Status revisão |
|------|----------|----------------|
| Taxonomia (6 tabelas) | Admin via `has_role` | ✅ Migrations existentes |
| Questões, pacotes, versões | Admin | ✅ |
| Distribuições, assinaturas | Admin | ✅ |
| `study_sessions` | Aluno: próprio `user_id`; admin: padrão | ✅ Migration 7A |
| `study_session_questions` | Via sessão do usuário | ✅ Migration 7A |
| Tabelas admin expostas ao aluno | — | ✅ Sem rotas aluno para CRUD admin |

**Bloqueio conhecido:** `GRANT EXECUTE` em `has_role` — migration `20260704161000` pendente de aplicação.

---

## Performance

| Verificação | Resultado |
|-------------|-----------|
| Paginação server-side | ✅ Taxonomia, questões, pacotes, versões, etc. |
| N+1 em versões (publicador) | ✅ Corrigido — batch fetch de `profiles` |
| Re-renders | ✅ Sem problemas comprovados |

---

## UX

| Verificação | Resultado |
|-------------|-----------|
| Mensagens de erro | ✅ `formatAdminError`, `formatTaxonomyError`, toasts |
| Loading | ✅ Skeletons (7F) em páginas polidas |
| Empty states | ✅ `EmptyState` no portal aluno |
| Confirmação de exclusão | ✅ AlertDialog nos CRUDs |
| Navegação pós-criar sessão | ✅ Link para `/app/study/{id}` |

**Observação:** páginas admin sem `AdminTableBody` (positions, exams, subjects, topics, questions, distributions, subscriptions, versions) mantêm padrão anterior — não bloqueante.

---

## Responsividade

| Breakpoint | Resultado |
|------------|-----------|
| Desktop | ✅ Layouts com grid responsivo |
| Tablet | ✅ `sm:` / `lg:` breakpoints |
| Mobile | ✅ Sidebars e tabelas com overflow |

Correções cosméticas não aplicadas — sem problemas reais comprovados no código.

---

## Bugs encontrados

| # | Severidade | Descrição |
|---|------------|-----------|
| B1 | **Crítico** | `taxonomy/shared.ts` continha JSX — quebrava `tsc` e build |
| B2 | **Alto** | `VersionsPage`: join `publisher:profiles!published_by` inválido nos tipos Supabase (FK ausente) |
| B3 | **Médio** | `import.ts`: campo `year` com tipo `{} \| null` incompatível |
| B4 | **Médio** | `student-dashboard.ts`: `package_version_id` null não tratado |
| B5 | **Baixo** | `admin/index.tsx`: `lastPublish` tipado com `as any` |
| B6 | **Infra** | Migrations acumuladas não aplicadas no remoto (`db push` manual) |
| B7 | **Infra** | RLS taxonomia bloqueada sem `GRANT EXECUTE` em `has_role` (Sprint 1B) |

---

## Bugs corrigidos

| # | Correção |
|---|----------|
| B1 | Renomeado para `shared.tsx` |
| B2 | Removido join inválido; fetch em batch de `profiles` por `published_by` |
| B3 | Coerção explícita de `year` para `string \| number \| null` |
| B4 | Skip de linhas com `package_version_id` null |
| B5 | Tipagem explícita de `lastPublish` sem `as any` |

**Já corrigido em Sprint 7F (fora do diff RC1):** contagem de assinaturas ativas no dashboard admin (`ACTIVE` vs `active`).

---

## Pendências restantes

| # | Item | Responsável |
|---|------|-------------|
| P1 | Aplicar todas as migrations (`npx supabase db push`) | Manual |
| P2 | Promover primeiro admin (`docs/BOOTSTRAP-PRIMEIRO-ADMIN.md`) | Manual |
| P3 | Testes manuais end-to-end — Fluxo Admin | Manual |
| P4 | Testes manuais end-to-end — Fluxo Aluno | Manual |
| P5 | Validar RLS em runtime após push | Manual |
| P6 | Criar `docs/02-BANCO-DE-DADOS.md` | Futuro |
| P7 | Testes automatizados | Futuro |
| P8 | Estender `AdminTableBody` às demais páginas admin | Opcional pós-RC1 |

**Fora do escopo RC1 (não implementar):** IA, gamificação, ranking, notificações, novos módulos/telas.

---

## Itens aprovados para RC1

- [x] Compilação TypeScript sem erros
- [x] Build de produção (`npm run build`)
- [x] Ausência de `console.log`, `debugger`, `TODO`, `FIXME` em `src/`
- [x] Motor de sessões de estudo (criar → resolver → finalizar)
- [x] Filtros Favoritos / Revisar / Erradas
- [x] Dashboard do aluno
- [x] Pipeline admin completo (código)
- [x] Polimento UX portal aluno (7F)
- [x] Documentação RC1 atualizada

---

## Como testar

### Pré-requisitos

```bash
npx supabase link --project-ref snbhstgvsfjfyfbwxdae
npx supabase db push
```

Promover operador conforme `docs/BOOTSTRAP-PRIMEIRO-ADMIN.md`.

### Verificação técnica (local)

```bash
npm install
npx tsc --noEmit
npm run build
npm run dev
```

### Fluxo Admin (manual)

1. Login como admin → `/admin`
2. Criar curso → cargo → banca → concurso → disciplina → assunto
3. Criar questão ou importar via `/admin/import`
4. Criar pacote → versão → marcar READY → Publicar
5. Criar distribuição ativa → assinatura ACTIVE para aluno de teste

### Fluxo Aluno (manual)

1. Login como aluno → `/app` (dashboard)
2. `/app/study` → selecionar distribuição → configurar sessão → Iniciar
3. Resolver questões → favoritar / revisar depois
4. Finalizar → verificar dashboard (stats, sessões recentes)
5. Nova sessão com modos Favoritos / Revisão / Erradas

### Referência detalhada

Cenários de teste por sprint em `docs/PROJECT_STATUS.md` (seções "Testes Sprint X").

---

*RC1 concluída em julho/2026 — foco em estabilidade e preparação para produção.*
