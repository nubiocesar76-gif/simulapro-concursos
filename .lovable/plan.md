# SimulaPro — Estrutura Completa (Etapa 1)

Construir toda a estrutura navegável dos dois portais (Admin e Aluno), com layout premium, integração ao Supabase (Lovable Cloud) e schema completo. Sem lógica pesada, sem IA, sem cadastro manual de questões.

## 1. Backend (Lovable Cloud / Supabase)

Ativar Lovable Cloud e criar migração única com todas as tabelas em inglês:

- `courses` (cursos)
- `positions` (cargos, FK → courses)
- `boards` (bancas)
- `exams` (concursos, FK → boards)
- `subjects` (disciplinas)
- `topics` (assuntos, FK → subjects)
- `questions` (importadas; FK → subject, topic, board, exam, year)
- `packages` (pacotes)
- `package_versions` (FK → packages)
- `subscriptions` (FK → user, course, package)
- `question_attempts` (histórico do aluno)
- `statistics` (agregados por aluno)
- `favorites` (favoritos do aluno)
- `import_batches` (staging de importação, status: pending/validated/published)
- `profiles` (perfil vinculado a auth.users)
- `user_roles` + enum `app_role` ('admin','student') + função `has_role` (padrão seguro)
- `logs` (auditoria admin)

Todas com GRANTs corretos, RLS habilitado e políticas mínimas (admin full, aluno leitura do próprio conteúdo/assinatura). Enum de roles apenas `admin` e `student` — sem professor/revisor.

## 2. Autenticação

- Tela `/auth` (login + cadastro, email/senha).
- Trigger `handle_new_user` cria `profiles` + role `student` por padrão.
- Layout `_authenticated/route.tsx` gerenciado (gate padrão).
- Redirecionamento pós-login por role: admin → `/admin`, aluno → `/app`.

## 3. Portal Administrativo (`/admin/*`)

Sidebar Shadcn com todos os itens, cada um como rota própria:

```
/admin              Dashboard (cards de contagem)
/admin/courses      CRUD
/admin/positions    CRUD (com select de course)
/admin/boards       CRUD
/admin/exams        CRUD (com select de board)
/admin/subjects     CRUD
/admin/topics       CRUD (com select de subject)
/admin/questions    Somente listar/pesquisar/filtrar (sem "Nova Questão")
/admin/import       Wizard: pacote → versão → arquivo (CSV/XLSX/JSON) → validar → relatório → salvar
/admin/export       Exportar CSV/Excel/JSON
/admin/packages     CRUD
/admin/versions     CRUD (vinculado a package)
/admin/users        Lista admin/aluno
/admin/subscriptions Vincular aluno ↔ curso ↔ pacote
/admin/settings     Preferências
/admin/logs         Lista de logs
```

Cada CRUD é uma página padrão: tabela Shadcn + Dialog de formulário (create/edit) + confirm delete. Estrutura pronta; validações complexas ficam para depois.

## 4. Portal do Aluno (`/app/*`)

Sidebar/menu próprio:

```
/app             Dashboard: card do curso adquirido + botão "Iniciar Estudo"
/app/study       Seleção de disciplina → carrega questões daquela disciplina
/app/history     Tentativas anteriores
/app/favorites   Questões favoritas
/app/stats       Estatísticas
/app/profile     Perfil
/app/settings    Configurações
```

Dashboard sem meta diária, sem cronômetro, sem tempo estimado. Estudo sem criação de simulado nem escolha de quantidade — só seleção de disciplina.

## 5. Design

- Tema premium (tokens em `src/styles.css`, oklch), tipografia moderna, cantos suaves, sombras sutis.
- Componentes Shadcn (Sidebar, Card, Table, Dialog, Form, Tabs, Badge).
- 100% responsivo.
- Sem hardcode de cores nos componentes; tudo via tokens semânticos.

## 6. Fora de escopo desta etapa

- Nenhuma IA generativa.
- Sem parser real dos arquivos de importação (só UI + tabela de staging).
- Sem motor de correção/pontuação de questões (só schema + telas).
- Sem pagamento.

## Detalhes técnicos

- Rotas TanStack file-based; admin sob `/_authenticated/admin/*` gated por `has_role('admin')` no client; aluno sob `/_authenticated/app/*`.
- Server functions com `requireSupabaseAuth` para writes admin; reads via TanStack Query.
- Nomes de tabela/coluna em inglês, snake_case.
- Um único migration inicial cria tudo.
