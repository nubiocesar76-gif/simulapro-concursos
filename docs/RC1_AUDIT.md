# RC1.2A — Auditoria Funcional Completa

**Projeto:** SimulaPro Core  
**Data:** 2026-07-06  
**Escopo:** Auditoria estática de código + análise de padrões UX (sem implementação, sem refatoração)  
**Ambiente referência:** Supabase RC1 (`ddgpkijytvagmabtttor`), app React + TanStack Router  

---

## 1. Metodologia

Para cada módulo foi avaliado o seguinte checklist:

| Critério | Descrição |
|----------|-----------|
| **Criar** | Formulário/dialog de criação funcional |
| **Editar** | Edição de registro existente |
| **Excluir** | Exclusão com confirmação e bloqueio por dependências |
| **Pesquisar** | Campo de busca (debounce ou imediato) |
| **Filtrar** | Filtros adicionais além da busca |
| **Paginar** | Paginação de listagens |
| **Toasts** | Feedback de sucesso/erro via Sonner |
| **Estados vazios** | Mensagem quando não há dados |
| **Responsividade** | Padrões mobile/tablet/desktop no código |
| **Console** | `console.log` / warnings desnecessários |
| **Erros** | Tratamento de falhas de rede/RLS/validação |

**Legenda:** ✅ Implementado · ⚠️ Parcial/inconsistente · ❌ Ausente · N/A Não aplicável

**Gravidade dos problemas:**

| Nível | Significado |
|-------|-------------|
| **Crítica** | Bloqueia fluxo principal ou risco de integridade de dados |
| **Alta** | Funcionalidade importante incompleta ou enganosa |
| **Média** | UX degradada; workaround possível |
| **Baixa** | Polimento, consistência ou edge case raro |

---

## 2. Resumo executivo

| Área | Módulos auditados | Problemas |
|------|-------------------|-----------|
| Autenticação | 1 | 2 |
| Shell / Navegação | 2 | 3 |
| Admin — Dashboard | 1 | 2 |
| Admin — Taxonomia (6) | 6 | 8 |
| Admin — Conteúdo (4) | 4 | 9 |
| Admin — Dados (2) | 2 | 6 |
| Admin — Gestão (2) | 2 | 4 |
| Portal do Aluno — Dashboard | 7 | 9 |
| Portal do Aluno — Estudo | 8 | 11 |
| **Total** | **33** | **54** |

**Principais achados:**

1. **Resultado de sessão inexistente** — botão "Ver resultado" e tela de conclusão não exibem acertos, erros, percentual nem revisão.
2. **Configuração `show_answers: "final"` ignorada** — feedback aparece durante a sessão mesmo quando configurado para o final.
3. **Exportação sem limite** — `select("*")` em tabela inteira pode travar o browser em datasets grandes.
4. **Verificação de dependências na exclusão** — erros de contagem tratados como zero, permitindo exclusão indevida.
5. **Inconsistências transversais** — `AdminTableBody` adotado em ~4 de 12 módulos; navegação ativa por match exato de URL.

---

## 3. Módulos transversais

### 3.1 Autenticação — `/auth`

**Arquivo:** `src/routes/auth.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| ✅ Signup | N/A | N/A | N/A | N/A | N/A | ✅ | N/A | ✅ | ❌ | ✅ |

**Observações:** Login e signup com formulários, redirecionamento por role, loading state.

---

### 3.2 AppShell — Navegação Admin e Aluno

**Arquivo:** `src/components/AppShell.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | ✅ | ✅ | ⚠️ |

**Observações:** Sidebar colapsável, guard `requireRole="admin"` para admin, logout limpa React Query. Portal aluno **não** define `requireRole="student"`.

---

### 3.3 Componente compartilhado — `AdminTableBody`

**Arquivo:** `src/components/admin/shared/AdminTableBody.tsx`

Skeleton, erro com `role="alert"`, distinção vazio vs filtro vazio. Usado em: Cursos, Bancas, Pacotes, Usuários. Demais módulos duplicam lógica inline.

---

### 3.4 Componente compartilhado — `EmptyState`

**Arquivo:** `src/components/shared/EmptyState.tsx`

Usado no portal aluno (dashboard, sessões, desempenho, estudo). Admin usa mensagens inline na maioria das tabelas.

---

## 4. Portal Administrativo

### 4.1 Dashboard Admin — `/admin`

**Arquivo:** `src/routes/_authenticated/admin/index.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| N/A | N/A | N/A | N/A | N/A | N/A | N/A | ⚠️ | ✅ | ✅ | ⚠️ |

**Observações:** Cards de contagem via React Query; cards de publicação/importação. Sem toasts (somente leitura).

---

### 4.2 Cursos — `/admin/courses`

**Arquivo:** `src/components/admin/courses/CoursesPage.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| ✅ | ✅ | ✅ | ✅ | N/A | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ |

**Pontos fortes:** CRUD completo, `AdminTableBody`, exclusão bloqueada por dependências (cargos, assinaturas, pacotes), busca debounced em nome+descrição.

---

### 4.3 Disciplinas — `/admin/subjects`

**Arquivo:** `src/components/admin/taxonomy/SubjectsPage.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| ✅ | ✅ | ✅ | ✅ | N/A | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ |

---

### 4.4 Assuntos — `/admin/topics`

**Arquivo:** `src/components/admin/taxonomy/TopicsPage.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| ✅ | ✅ | ✅ | ✅ | N/A | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ |

**Observações:** Filtro por disciplina apenas no formulário de criação/edição, não na listagem.

---

### 4.5 Bancas — `/admin/boards`

**Arquivo:** `src/components/admin/taxonomy/BoardsPage.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| ✅ | ✅ | ✅ | ✅ | N/A | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ |

---

### 4.6 Concursos — `/admin/exams`

**Arquivo:** `src/components/admin/taxonomy/ExamsPage.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| ✅ | ✅ | ✅ | ✅ | N/A | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ |

---

### 4.7 Cargos — `/admin/positions`

**Arquivo:** `src/components/admin/taxonomy/PositionsPage.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| ✅ | ✅ | ✅ | ✅ | N/A | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ |

---

### 4.8 Questões — `/admin/questions`

**Arquivo:** `src/components/admin/questions/QuestionsPage.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ |

**Pontos fortes:** Painel de filtros mais completo (curso, pacote, versão, disciplina, assunto, banca, concurso, cargo, ano, status). Exclusão bloqueada por tentativas/favoritos.

---

### 4.9 Pacotes — `/admin/packages`

**Arquivo:** `src/components/admin/packages/PackagesPage.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ |

**Observações:** Filtros por curso e status. Dialog sem `<form>` — Enter não submete.

---

### 4.10 Versões — `/admin/versions`

**Arquivo:** `src/components/admin/versions/VersionsPage.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ⚠️ |

**Observações:** Fluxo extra de publicação; versões publicadas bloqueadas para edição/exclusão.

---

### 4.11 Importação — `/admin/import`

**Arquivo:** `src/components/admin/import/ImportPage.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| ✅ Lote | N/A | ⚠️ Cancelar | N/A | ⚠️ Curso/pacote/versão | ❌ | ✅ | ⚠️ | ⚠️ | ✅ | ⚠️ |

**Observações:** Fluxo validar → salvar → aplicar/cancelar. Histórico limitado a 30 lotes sem paginação.

---

### 4.12 Distribuições — `/admin/distributions`

**Arquivo:** `src/components/admin/distributions/DistributionsPage.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ⚠️ |

**Observações:** Ativar/desativar distribuição; apenas versões publicadas selecionáveis.

---

### 4.13 Exportação — `/admin/export`

**Arquivo:** `src/routes/_authenticated/admin/export.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| N/A | N/A | N/A | N/A | ⚠️ Tabela | ❌ | ✅ | N/A | ✅ | ✅ | ⚠️ |

**Observações:** 9 tabelas fixas; download CSV/JSON/"Excel" (CSV renomeado). Sem filtros de conteúdo.

---

### 4.14 Assinaturas — `/admin/subscriptions`

**Arquivo:** `src/components/admin/subscriptions/SubscriptionsPage.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ⚠️ |

**Observações:** Listagem exclui assinaturas legadas sem `distribution_id`.

---

### 4.15 Usuários — `/admin/users`

**Arquivo:** `src/routes/_authenticated/admin/users.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ⚠️ | ✅ | ✅ |

**Observações:** Somente leitura — lista perfis com badges de role. Escopo intencional para RC1.

---

## 5. Portal do Aluno

### 5.1 Dashboard — `/app`

**Arquivo:** `src/components/app/dashboard/StudentDashboardPage.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| ⚠️ Atalhos | N/A | N/A | N/A | ⚠️ | N/A | ✅ | ✅ | ✅ | ✅ | ✅ |

**Observações:** Orquestra stats, atalhos de filtro, continuar estudo, distribuições, sessões recentes, desempenho por disciplina. Skeleton + `PageErrorState` com retry.

---

### 5.2 Estatísticas — `DashboardStats`

**Arquivo:** `src/components/app/dashboard/DashboardStats.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | ✅ | ✅ | N/A |

---

### 5.3 Atalhos de filtro — `StudyFilterIndicators`

**Arquivo:** `src/components/app/dashboard/StudyFilterIndicators.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| ⚠️ Sessão | N/A | N/A | N/A | ⚠️ | N/A | ⚠️ | N/A | ✅ | ✅ | ⚠️ |

**Modos:** Favoritas (`FAVORITES`), Revisar depois (`REVIEW`), Pendentes de revisão (`WRONG_ONLY`).

---

### 5.4 Continuar estudo — `ContinueStudyCard`

**Arquivo:** `src/components/app/dashboard/ContinueStudyCard.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | ✅ | ✅ | N/A |

---

### 5.5 Card de distribuição — `DistributionCard`

**Arquivo:** `src/components/app/dashboard/DistributionCard.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| ⚠️ Link | N/A | N/A | N/A | N/A | N/A | N/A | N/A | ✅ | ✅ | N/A |

---

### 5.6 Últimas sessões — `RecentSessions`

**Arquivo:** `src/components/app/dashboard/RecentSessions.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| N/A | N/A | N/A | N/A | N/A | ❌ | N/A | ✅ | ❌ | ✅ | N/A |

**Observações:** Limite hardcoded de 5 sessões em `student-dashboard.ts`. Sem coluna de status.

---

### 5.7 Desempenho por disciplina — `SubjectPerformanceTable`

**Arquivo:** `src/components/app/dashboard/SubjectPerformanceTable.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| N/A | N/A | N/A | N/A | N/A | ❌ | N/A | ✅ | ❌ | ✅ | N/A |

---

### 5.8 Estudo — lista e criação — `/app/study`

**Arquivo:** `src/components/app/study/StudyPage.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| ✅ Sessão | N/A | N/A | N/A | ⚠️ Modo | N/A | ✅ | ✅ | ✅ | ✅ | ✅ |

**Observações:** Wizard em 3 passos (lista → configurar → criada). Modos STUDY, EXAM, FAVORITES, REVIEW, WRONG_ONLY.

---

### 5.9 Resolução de sessão — `/app/study/$sessionId`

**Arquivo:** `src/components/app/study/StudySessionPage.tsx`

| Criar | Editar | Excluir | Pesquisar | Filtrar | Paginar | Toasts | Vazios | Responsivo | Console | Erros |
|-------|--------|---------|-----------|---------|---------|--------|--------|------------|---------|-------|
| ⚠️ Iniciar | ⚠️ Responder | N/A | N/A | N/A | N/A | ✅ | ✅ | ✅ | ✅ | ⚠️ |

**Fases:** preview → active → completed. Subcomponentes: `QuestionCard`, `QuestionOptions`, `QuestionActions`, `QuestionNavigation`, `SessionHeader`, `SessionProgress`.

---

### 5.10 Bibliotecas de domínio

| Arquivo | Papel |
|---------|-------|
| `src/lib/student-dashboard.ts` | Agregações do dashboard, limite de sessões |
| `src/lib/study-session.ts` | Criação de sessão, validação de acesso |
| `src/lib/study-engine.ts` | Abrir, iniciar, responder, navegar, finalizar |

---

## 6. Registro de problemas

### 6.1 Críticos (5)

| ID | Módulo | Gravidade | Reprodução | Causa provável | Sugestão mínima |
|----|--------|-----------|------------|----------------|-----------------|
| **C01** | Portal Aluno — Sessão concluída | Crítica | 1) Concluir sessão de estudo. 2) Observar tela "Sessão concluída com sucesso" sem score. 3) No dashboard, clicar "Ver resultado" na mesma sessão. | Fase `completed` em `StudySessionPage.tsx` renderiza apenas cabeçalho e botão voltar; não há componente de resultados. | Adicionar painel de resultados: acertos, erros, percentual, tempo total e link para revisão questão a questão. |
| **C02** | Motor de estudo | Crítica | 1) Criar sessão modo STUDY. 2) Configurar "Mostrar respostas: Apenas no final". 3) Responder questão. 4) Feedback (gabarito/explicação) aparece imediatamente. | `buildQuestionFeedback()` em `study-engine.ts` não consulta `session.settings.show_answers`. | Retornar `null` quando `show_answers === "final"` e sessão não está `FINISHED`; exibir feedback na tela de resultados. |
| **C03** | Admin — Exclusão (taxonomia e conteúdo) | Crítica | 1) Simular falha na query de contagem de dependências (RLS/rede). 2) Abrir dialog de exclusão. 3) Contadores aparecem como 0. 4) Exclusão é permitida indevidamente. | Funções `fetch*Deps` usam `count ?? 0` sem verificar `.error` (ex.: `CoursesPage.tsx` L82–91). | Após cada head count, verificar `error`; em falha, bloquear exclusão e exibir mensagem. |
| **C04** | Admin — Exportação | Crítica | 1) Admin → Exportação. 2) Selecionar tabela `questions`. 3) Exportar com milhares de registros. | `select("*")` sem limite carrega tudo em memória (`export.tsx` L38–44). | Adicionar aviso de limite, paginação server-side ou exportação em chunks/stream. |
| **C05** | Admin — Importação | Crítica | 1) Preparar arquivo com 500+ questões. 2) Validar e aplicar. 3) Observar tempo de resposta e possível timeout/memória no browser. | Validação e preview processam arquivo inteiro no cliente (`src/lib/import.ts`). | Testar em staging; documentar limite RC1; para RC1.2C considerar processamento server-side. |

---

### 6.2 Altos (12)

| ID | Módulo | Gravidade | Reprodução | Causa provável | Sugestão mínima |
|----|--------|-----------|------------|----------------|-----------------|
| **A01** | Portal Aluno — Últimas sessões | Alta | 1) Ter sessão `IN_PROGRESS`. 2) Dashboard → "Ver resultado". 3) Abre preview de início, não resultados. | Botão e rótulo iguais para todos os status; `fetchRecentSessions` inclui qualquer status. | Exibir badge de status; rótulo "Continuar" para `IN_PROGRESS`, "Ver resultado" para `FINISHED`. |
| **A02** | Portal Aluno — Modo EXAM | Alta | 1) Criar sessão modo EXAM. 2) Responder e finalizar. 3) Não há gabarito nem explicações. | Engine exclui feedback em EXAM; tela de conclusão não compensa. | Tela pós-prova com resultados respeitando `show_answers: "final"`. |
| **A03** | Portal Aluno — Atalhos de filtro | Alta | 1) Ter favoritas em distribuição sem assinatura ativa. 2) Card mostra contagem > 0. 3) Clicar → toast "Você ainda não possui questões favoritas." | `fetchStudyFilterIndicators` conta globalmente; `startFilterSession` itera só distribuições ativas. | Alinhar contagem às distribuições disponíveis ou exibir contagem por distribuição. |
| **A04** | Portal Aluno — Estudo (sessão criada) | Alta | 1) Criar sessão em modo FAVORITES/REVIEW/WRONG_ONLY. 2) Tela "Sessão criada" mostra "Questões: 10" (valor do estado local). | Step `created` usa `quantity` local; modos filtro usam `"all"` na mutation. | Exibir configuração real retornada pela API ou rótulo "Todas (filtradas)". |
| **A05** | Shell — Navegação | Alta | 1) Navegar para `/app/study/{uuid}`. 2) Item "Estudo" na sidebar não fica ativo. | `pathname === it.url` em `AppShell.tsx` L82 — match exato. | Usar `pathname.startsWith(it.url)` ou matching de rota. |
| **A06** | Admin — Exportação | Alta | 1) Exportação → formato "Excel". 2) Abrir arquivo no Excel. 3) Conteúdo é CSV, extensão `.xls`. | `toCsv()` com MIME `application/vnd.ms-excel` (`export.tsx` L44). | Usar biblioteca XLSX real ou renomear para "CSV (compatível com Excel)". |
| **A07** | Admin — Versões | Alta | 1) Filtro de listagem = "Todos os cursos". 2) Abrir dialog criar versão. 3) Dropdown de pacote pode estar incompleto. | Dialog usa `packages` filtrados pelo `courseFilter` da listagem. | Query separada de pacotes sem filtro de listagem para o dialog. |
| **A08** | Admin — Taxonomia (editar) | Alta | 1) Editar curso/disciplina/assunto/cargo mantendo nome que gera slug existente. 2) Salvar → erro de chave duplicada. | Edição sempre regenera slug (`validateCourse` etc.). | Manter slug original na edição se nome não mudou. |
| **A09** | Admin — Importação | Alta | 1) Abrir Importação com query `import_batches` lenta ou falhando. 2) Tabela vazia sem indicador de loading/erro. | `useQuery` de batches não expõe `isLoading`/`isError` na UI (L100–125). | Mostrar skeleton na tabela e linha de erro com retry. |
| **A10** | Admin — Questões (filtros) | Alta | 1) Simular falha nas queries de opções de filtro. 2) Filtros aparecem vazios silenciosamente. | Padrão `(await supabase...).data ?? []` sem checar `.error`. | Verificar `.error` e toast ou estado de erro no painel. |
| **A11** | Admin — Dashboard | Alta | 1) Cards "Questões publicadas" e "Questões em revisão" — queries secundárias ignoram erro. 2) Valor exibe 0 em falha. | `publishedCount` e `reviewCount` usam `.data` sem throw (L20–36). | Propagar erro ou exibir "—" / estado de falha. |
| **A12** | Admin — Importação (versão) | Alta | 1) Abrir Importação. 2) Selecionar versão no dropdown. 3) Label pode não corresponder ao CRUD de versões. | Query usa coluna `version` (L98) enquanto CRUD usa `version_number`. | Padronizar coluna em selects e exibição. |

---

### 6.3 Médios (22)

| ID | Módulo | Gravidade | Reprodução | Causa provável | Sugestão mínima |
|----|--------|-----------|------------|----------------|-----------------|
| **M01** | Admin — Tabelas largas | Média | Redimensionar para mobile; abrir Questões, Importação, Versões, Distribuições. | Tabelas 8–11 colunas sem `overflow-x-auto` no container. | Envolver `<Table>` em `<div className="overflow-x-auto">`. |
| **M02** | Admin — Múltiplos CRUDs | Média | Comparar Cursos (usa `AdminTableBody`) com Disciplinas, Assuntos, Versões, etc. | Lógica loading/erro/vazio duplicada inline. | Migrar para `AdminTableBody` com mensagens filtradas. |
| **M03** | Admin — Versões, Distribuições, Assinaturas | Média | Provocar erro de carregamento na listagem. | Mensagem raw `(error as Error)?.message` sem formatador de domínio. | Usar `formatVersionError`, `formatDistributionError`, etc. |
| **M04** | Admin — Versões, Distribuições, Assinaturas, Import | Média | Aplicar filtro que zera resultados com dados no banco. | Mensagem única de vazio, sem distinção filtrado vs vazio real. | Adicionar `filteredEmptyMessage` como em Cursos. |
| **M05** | Admin — AlertDialog exclusão | Média | Clicar excluir em Pacotes, Versões, Distribuições, Assinaturas. | Alguns `AlertDialogAction` sem `e.preventDefault()`. | Padronizar handler com `preventDefault` antes da mutation. |
| **M06** | Admin — Importação | Média | Clicar "Cancelar" em lote pendente. | Cancelamento imediato sem confirmação (`ImportPage.tsx`). | Adicionar `AlertDialog` de confirmação. |
| **M07** | Admin — Questões | Média | 1) Editar questão. 2) Remover alternativa do meio. 3) Salvar. | Letras das alternativas não são reindexadas; gabarito pode ficar inválido. | Re-letrar alternativas ao remover; resetar gabarito se inválido. |
| **M08** | Admin — Usuários | Média | Ambiente com muitos usuários cadastrados. | Lista completa sem busca nem paginação. | Adicionar busca por nome/email e paginação (se escopo RC1.2C). |
| **M09** | Admin — Pacotes, Versões, etc. | Média | Navegação por leitor de tela nos botões de ação. | Botões ícone sem `aria-label` em alguns módulos. | Adicionar `aria-label` descritivo (padrão já usado em taxonomia). |
| **M10** | Admin — Tipos TypeScript | Média | Compilar projeto após migration de `slug`. | `types.ts` pode não incluir coluna `slug` em courses/subjects/topics/positions. | Regenerar tipos Supabase pós-migration `20260706060000`. |
| **M11** | Admin — Exportação | Média | Exportar tabela com campos JSON aninhados. | `toCsv` só achata chaves de primeiro nível. | Documentar limitação ou serializar campos aninhados. |
| **M12** | Admin — Exportação | Média | Exportar tabela vazia. | Download de arquivo vazio com toast de sucesso. | Desabilitar botão ou toast informativo quando `rows.length === 0`. |
| **M13** | Admin — Assuntos / Concursos | Média | Criar registro sem disciplina/banca cadastrada. | Select vazio; erro só via toast na submissão. | Desabilitar submit ou hint inline quando opções vazias. |
| **M14** | Admin — Pacotes | Média | Pressionar Enter no campo nome do dialog. | Dialog sem wrapper `<form>`. | Envolver campos em `<form onSubmit>`. |
| **M15** | Admin — Assinaturas | Média | Existirem assinaturas legadas sem `distribution_id`. | Filtro `.not("distribution_id", "is", null)` oculta registros. | Documentar ou criar view de legado. |
| **M16** | Admin — Importação (histórico) | Média | Mais de 30 lotes importados. | `.limit(30)` sem paginação. | Adicionar paginação ou "carregar mais". |
| **M17** | Portal Aluno — Tabelas | Média | Viewport mobile em Últimas sessões e Desempenho. | Tabelas 5–6 colunas sem scroll horizontal. | Wrapper `overflow-x-auto`. |
| **M18** | Portal Aluno — Atalhos | Média | Clicar atalho com contagem 0. | Botão não desabilitado; toast de erro após clique. | `disabled={value === 0 \|\| isLoading}`. |
| **M19** | Portal Aluno — Atalhos (rótulos) | Média | Comparar "Revisar depois" vs "Pendentes de revisão". | Nomenclatura confunde `review_later` com `WRONG_ONLY`. | Renomear ex.: "Questões erradas" para `pendingReviewCount`. |
| **M20** | Portal Aluno — DistributionCard | Média | Dashboard → "Estudar" em card de distribuição. | Link genérico `/app/study` sem pré-seleção. | Passar `distributionId` via search param. |
| **M21** | Portal Aluno — Sessão inválida | Média | Acessar `/app/study/uuid-invalido`. | Mensagem estática sem botão retry. | Usar `PageErrorState` com refetch. |
| **M22** | Portal Aluno — QuestionActions | Média | Alternar favorito durante salvamento. | Ambos botões mostram "Salvando..." (`isUpdating` compartilhado). | Estados de pending separados por ação. |

---

### 6.4 Baixos (15)

| ID | Módulo | Gravidade | Reprodução | Causa provável | Sugestão mínima |
|----|--------|-----------|------------|----------------|-----------------|
| **B01** | Autenticação | Baixa | Criar conta (signup). | `console.log` de debug em `auth.tsx` L67–70. | Remover log antes de produção. |
| **B02** | Shell — Navegação Admin | Baixa | Estar em `/admin/courses`; item Dashboard não ativo. | Match exato de pathname. | `startsWith` para item dashboard ou agrupamento. |
| **B03** | Admin — Dashboard | Baixa | Última publicação exibe versão incorreta. | Select usa coluna `version` (L49) vs `version_number` no CRUD. | Alinhar coluna no select. |
| **B04** | Admin — Questões (filtro ano) | Baixa | Digitar texto não numérico no filtro de ano. | Sem validação client-side antes da query. | Validar número antes de aplicar filtro. |
| **B05** | Admin — Versões (publicar) | Baixa | Duplo clique em "Confirmar publicação". | Sem estado loading no botão do dialog. | Desabilitar botão durante mutation. |
| **B06** | Portal Aluno — Dashboard | Baixa | Falha silenciosa ao carregar nome do perfil. | Query de profile separada; fallback "estudante". | Aceitável; opcional aviso sutil. |
| **B07** | Portal Aluno — QuestionActions | Baixa | Marcar favorito com sucesso. | Apenas toasts de erro na sessão. | Feedback visual otimista ou toast opcional. |
| **B08** | Portal Aluno — Sessão | Baixa | Status `PAUSED` existe no schema. | Nunca usado na UI. | Remover do escopo ou implementar pausa. |
| **B09** | Shell — Portal Aluno | Baixa | Admin acessa `/app` manualmente. | `app/route.tsx` sem `requireRole="student"`. | Aceitável se intencional; documentar. |
| **B10** | Portal Aluno — Sessão ativa | Baixa | Durante resolução, duas barras de progresso visíveis. | `SessionProgress` duplicado (questão vs respondidas). | Unificar ou clarificar rótulos. |
| **B11** | Admin — Exportação | Baixa | Lista de tabelas incompleta. | Faltam `content_distributions`, `subscriptions`, `import_batches`. | Adicionar tabelas ou documentar exclusão. |
| **B12** | Admin — Importação | Baixa | Queries de cursos/pacotes/versões sem tratamento de erro explícito. | Padrão `.data ?? []` (L86–98). | Checar `.error` nas queries auxiliares. |
| **B13** | Portal Aluno — QuestionOptions | Baixa | Questão sem alternativas (dado corrompido). | Sem empty state específico no componente. | Mensagem de fallback na UI. |
| **B14** | Integrações Supabase | Baixa | Erro de configuração de env. | `console.error` em `client.ts` — esperado. | Manter; não é debug noise. |
| **B15** | Root error boundary | Baixa | Erro não tratado em rota. | `console.error` em `__root.tsx` L40 — esperado. | Manter para diagnóstico. |

---

## 7. Matriz de conformidade por módulo

Resumo visual — quantos critérios ✅ por módulo (máx. 11):

| Módulo | C | E | X | P | F | Pag | T | V | R | Con | Err | Total ✅ |
|--------|---|---|---|---|---|-----|---|---|---|-----|-----|----------|
| Auth | 1 | - | - | - | - | - | 1 | - | 1 | 0 | 1 | 4/7 |
| AppShell | - | - | - | - | - | - | - | - | 1 | 1 | 0 | 2/4 |
| Admin Dashboard | - | - | - | - | - | - | - | 0 | 1 | 1 | 0 | 2/5 |
| Cursos | 1 | 1 | 1 | 1 | - | 1 | 1 | 1 | 0 | 1 | 0 | 8/10 |
| Disciplinas | 1 | 1 | 1 | 1 | - | 1 | 1 | 1 | 0 | 1 | 0 | 8/10 |
| Assuntos | 1 | 1 | 1 | 1 | - | 1 | 1 | 1 | 0 | 1 | 0 | 8/10 |
| Bancas | 1 | 1 | 1 | 1 | - | 1 | 1 | 1 | 0 | 1 | 0 | 8/10 |
| Concursos | 1 | 1 | 1 | 1 | - | 1 | 1 | 1 | 0 | 1 | 0 | 8/10 |
| Cargos | 1 | 1 | 1 | 1 | - | 1 | 1 | 1 | 0 | 1 | 0 | 8/10 |
| Questões | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 1 | 0 | 9/10 |
| Pacotes | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 1 | 0 | 9/10 |
| Versões | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1 | 0 | 8/10 |
| Importação | 1 | - | 0 | - | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 3/8 |
| Distribuições | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1 | 0 | 8/10 |
| Exportação | - | - | - | - | 0 | 0 | 1 | - | 1 | 1 | 0 | 3/6 |
| Assinaturas | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1 | 0 | 8/10 |
| Usuários | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 1 | 1 | 3/11 |
| Dashboard Aluno | 0 | - | - | - | 0 | - | 1 | 1 | 1 | 1 | 1 | 5/8 |
| Atalhos filtro | 0 | - | - | - | 0 | - | 0 | - | 1 | 1 | 0 | 2/5 |
| Últimas sessões | - | - | - | - | - | 0 | - | 1 | 0 | 1 | - | 2/5 |
| Desempenho | - | - | - | - | - | 0 | - | 1 | 0 | 1 | - | 2/5 |
| Estudo (criar) | 1 | - | - | - | 0 | - | 1 | 1 | 1 | 1 | 1 | 6/8 |
| Sessão (resolver) | 0 | 0 | - | - | - | - | 1 | 1 | 1 | 1 | 0 | 4/7 |

*C=Criar, E=Editar, X=Excluir, P=Pesquisar, F=Filtrar, Pag=Paginar, T=Toasts, V=Vazios, R=Responsivo, Con=Console limpo, Err=Erros*

---

## 8. Ordem sugerida de correção (pós-auditoria)

Prioridade alinhada ao roadmap RC1.2:

| Ordem | Sprint | IDs relacionados | Justificativa |
|-------|--------|------------------|---------------|
| 1 | RC1.2B | C01, C02, A01, A02, A04, M17–M22 | Portal aluno — histórico e resultado detalhado |
| 2 | RC1.2C | C04, C05, A06, A09, A12, M06, M16 | Admin — exportação e importação em escala |
| 3 | RC1.2A | A05, M01–M05, M18, B01–B02 | UX transversal — navegação, tabelas, toasts |
| 4 | RC1.2D | C03, A10, A11, B01, M10 | Qualidade — erros, console, tipos |
| 5 | Backlog | Demais M e B | Polimento e acessibilidade |

---

## 9. Testes manuais recomendados (homologação)

Checklist para validação em browser com credenciais admin + aluno:

### Admin
- [ ] Pipeline: Curso → Cargo → Pacote → Versão (READY → publicar) → Distribuição → Assinatura
- [ ] CRUD em cada item de taxonomia com busca e paginação
- [ ] Questões: criar, editar, filtrar, excluir com dependências
- [ ] Importação: validar → salvar → aplicar; cancelar lote; histórico após reload
- [ ] Exportação: CSV, JSON, "Excel" em tabela pequena e grande
- [ ] Exclusão bloqueada quando há dependências
- [ ] Mobile: scroll horizontal em tabelas largas

### Aluno
- [ ] Dashboard: stats, atalhos (favoritas/revisar/erradas), continuar estudo
- [ ] Estudo: wizard completo em cada modo (STUDY, EXAM, FAVORITES, REVIEW, WRONG_ONLY)
- [ ] Sessão: iniciar, responder, favoritar, revisar depois, navegar, finalizar
- [ ] **Resultado pós-sessão** e botão "Ver resultado"
- [ ] Configuração "Apenas no final" durante resolução
- [ ] Sessão em andamento vs concluída no dashboard
- [ ] Mobile: sidebar, navegação de questões, tabelas

### Transversal
- [ ] Login/logout admin e aluno
- [ ] Console sem `console.log` em fluxos normais
- [ ] Toasts de sucesso e erro padronizados
- [ ] Estados vazios em listas sem dados

---

## 10. Arquivos de referência

| Área | Caminhos principais |
|------|---------------------|
| Auth | `src/routes/auth.tsx` |
| Shell | `src/components/AppShell.tsx` |
| Admin CRUD | `src/components/admin/**` |
| Admin rotas | `src/routes/_authenticated/admin/**` |
| Portal aluno | `src/components/app/**` |
| Lógica estudo | `src/lib/study-engine.ts`, `study-session.ts`, `student-dashboard.ts` |
| Importação | `src/lib/import.ts`, `ImportPage.tsx` |
| Shared UI | `src/components/admin/shared/AdminTableBody.tsx`, `src/components/shared/EmptyState.tsx` |

---

## 11. Declaração de escopo

- **Nenhuma alteração de código** foi realizada nesta etapa.
- Auditoria baseada em **revisão estática** do repositório; testes em browser com credenciais reais ficam para homologação manual.
- Itens marcados ✅ no checklist do usuário (RC1.1) foram **confirmados no código** salvo onde problemas acima indicam regressão ou gap residual.
- Itens ⬜ do checklist original (**Exportação**, **Histórico detalhado**, **Resultado detalhado**) correspondem aos problemas **C01, C04, A01, A02** e limitações documentadas neste relatório.

---

*Relatório gerado na Sprint RC1.2A — Auditoria Funcional Completa.*
