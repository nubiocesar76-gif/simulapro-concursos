# UX Backlog Oficial — RC1.2F

**Projeto:** SimulaPro Core
**Data:** 2026-07-06
**Natureza:** Documentação apenas. Nenhum código, componente, rota ou schema foi alterado para produzir este documento.
**Fonte única dos achados:** [`UX_AUDIT_RC1.2D.md`](./UX_AUDIT_RC1.2D.md) — todos os 22 achados da auditoria foram convertidos em item de backlog abaixo; nenhum ficou apenas no relatório.
**Referências cruzadas:** [`DESIGN_PRINCIPLES.md`](./DESIGN_PRINCIPLES.md) · [`PRODUCT_BACKLOG.md`](./PRODUCT_BACKLOG.md) · [`ROADMAP.md`](./ROADMAP.md) · [`CHANGELOG.md`](./CHANGELOG.md) · [`PRODUCT_VISION_RC1.2F.md`](./PRODUCT_VISION_RC1.2F.md)

---

## Como este documento foi construído

`PRODUCT_VISION_RC1.2F.md` (seção 3) mostrou que dos 22 achados de `UX_AUDIT_RC1.2D.md`, apenas 2 tinham item correspondente em `PRODUCT_BACKLOG.md` — e ambos com prioridade rebaixada em relação à gravidade original da auditoria. Este documento fecha essa lacuna: **cada um dos 22 achados vira aqui um item de backlog com ID, dono de área, arquivo afetado, situação e sprint prevista**, mantendo a gravidade original atribuída na auditoria (não recalculada, não suavizada).

Nenhum item foi implementado. Todos começam com **Situação: Aberto**.

**Nota sobre "Responsável":** nenhum dos documentos do projeto nomeia indivíduos ou squads — apenas papéis (Admin/Aluno como perfis de produto, não de equipe). Por isso, o campo Responsável é preenchido com a função esperada (`Design/Front-end`), não um nome. Cabe ao time atribuir o dono real.

---

## Críticos

### UXB-C1 — Histórico de sessões ausente da navegação lateral do Aluno

| Campo | Valor |
|---|---|
| **Descrição** | A página `/app/history` existe, é funcional e completa (filtros, estatísticas, paginação, ações por sessão), mas não há item correspondente na sidebar do Aluno. O único acesso é um link de texto ("Ver histórico completo →") dentro do card "Últimas sessões" do dashboard. "Histórico" é um dos quatro fluxos nomeados como críticos em `DESIGN_PRINCIPLES.md` §6. |
| **Gravidade** | Crítica |
| **Área** | Aluno |
| **Arquivo(s) afetado(s)** | `src/routes/_authenticated/app/route.tsx` (definição dos grupos de menu), `src/components/app/dashboard/RecentSessions.tsx:30` (único link de acesso) |
| **Situação** | Aberto |
| **Sprint prevista** | RC1.2G |
| **Responsável** | A definir (Design/Front-end) |
| **Observações** | Item de maior prioridade deste backlog — corresponde a UX-C1 em `UX_AUDIT_RC1.2D.md`. Sem item correspondente em `PRODUCT_BACKLOG.md` até esta data. |

### UXB-C2 — Tokens de cor semântica (`--success`/`--warning`) definidos e nunca usados

| Campo | Valor |
|---|---|
| **Descrição** | `styles.css` define e mapeia `--color-success`/`--color-warning` como classes Tailwind utilizáveis, mas nenhuma ocorrência de `bg-success`, `text-warning` etc. existe em `src/`. Todo feedback de acerto/erro/aviso usa cores literais (`green-500`, `green-600`, `amber-500`), aplicadas de forma diferente em cada tela — inclusive um badge sem variante `dark:` na tela de "ver resultado" (outro dos quatro fluxos críticos do §6). |
| **Gravidade** | Crítica |
| **Área** | Compartilhado |
| **Arquivo(s) afetado(s)** | `src/styles.css:41-44`, `src/components/app/study/SessionResultsView.tsx:297`, `src/components/app/study/QuestionCard.tsx:23-24`, `src/components/admin/import/ImportPage.tsx:424,461,570` |
| **Situação** | Aberto |
| **Sprint prevista** | RC1.2G |
| **Responsável** | A definir (Design/Front-end) |
| **Observações** | Corresponde a UX-C2 em `UX_AUDIT_RC1.2D.md`. Pré-requisito do Pilar 2 ("Sistema de Design") descrito em `PRODUCT_VISION_RC1.2F.md` §5. Sem item correspondente em `PRODUCT_BACKLOG.md`. |

---

## Altos

### UXB-A1 — Item de menu ativo não reconhece rotas dinâmicas/aninhadas

| Campo | Valor |
|---|---|
| **Descrição** | `AppShell.tsx` marca um item de menu como ativo por igualdade exata de `pathname` (`pathname === it.url`). Em `/app/study/$sessionId` (tela mais repetida do produto) e em `/app/history`, nenhum item da sidebar fica destacado — perde-se a referência de localização durante o fluxo mais frequente do sistema. |
| **Gravidade** | Alta |
| **Área** | Compartilhado |
| **Arquivo(s) afetado(s)** | `src/components/AppShell.tsx:34,82` |
| **Situação** | Aberto |
| **Sprint prevista** | RC1.2H |
| **Responsável** | A definir (Front-end) |
| **Observações** | Corresponde a UX-A1. **Já existe em `PRODUCT_BACKLOG.md` como `PA-016`, mas classificado como prioridade Média — recomenda-se reclassificar para Alta**, alinhado à gravidade original da auditoria (ver seção "Relação com PRODUCT_BACKLOG"). |

### UXB-A2 — Duas barras de progresso redundantes na tela de resolução

| Campo | Valor |
|---|---|
| **Descrição** | `StudySessionPage.tsx` renderiza dois componentes `SessionProgress` em sequência ("Questão X de Y" e "Respondidas X de Y") na tela onde o aluno passa mais tempo. Os números quase sempre coincidem, gerando carga cognitiva sem ganho de informação, na tela que o guia pede para manter com "mínima carga cognitiva" (§10). |
| **Gravidade** | Alta |
| **Área** | Aluno |
| **Arquivo(s) afetado(s)** | `src/components/app/study/StudySessionPage.tsx:333-343`, `src/components/app/study/SessionProgress.tsx` |
| **Situação** | Aberto |
| **Sprint prevista** | RC1.2H |
| **Responsável** | A definir (Design/Front-end) |
| **Observações** | Corresponde a UX-A2. Sem item correspondente em `PRODUCT_BACKLOG.md`. |

### UXB-A3 — Largura máxima da página muda a cada etapa do fluxo de estudo

| Campo | Valor |
|---|---|
| **Descrição** | Dentro da mesma tarefa contínua (escolher → configurar → resolver → ver resultado), o contêiner de conteúdo alterna entre `max-w-3xl`, `max-w-lg`, `max-w-2xl` e `max-w-4xl`, além de telas sem `max-w` (largura total). Gera sensação de "pulo" de layout dentro de uma única tarefa. |
| **Gravidade** | Alta |
| **Área** | Aluno |
| **Arquivo(s) afetado(s)** | `src/components/app/study/StudyPage.tsx`, `src/components/app/study/StudySessionPage.tsx`, `src/components/app/study/SessionResultsView.tsx`, `src/components/app/dashboard/StudentDashboardPage.tsx`, `src/components/app/history/StudyHistoryPage.tsx` |
| **Situação** | Aberto |
| **Sprint prevista** | RC1.2H |
| **Responsável** | A definir (Design/Front-end) |
| **Observações** | Corresponde a UX-A3. Sem item correspondente em `PRODUCT_BACKLOG.md`. |

### UXB-A4 — Padrão de loading/vazio/erro (`AdminTableBody`) adotado em só ~4 de 14 módulos

| Campo | Valor |
|---|---|
| **Descrição** | `AdminTableBody` (com `role="alert"`/`role="status"` e visual padronizado) é usado só em Cursos, Bancas, Pacotes e Usuários. Os outros ~10 módulos administrativos (Cargos, Concursos, Disciplinas, Assuntos, Questões, Versões, Distribuições, Assinaturas, Importação) reimplementam a lógica inline, com risco de tratamento inconsistente — inclusive de acessibilidade (sem sinalização para leitor de tela). Viola diretamente `DESIGN_PRINCIPLES.md` §8: "Estados vazios, loaders e mensagens de erro seguem o mesmo padrão visual em todo o produto." |
| **Gravidade** | Alta |
| **Área** | Admin |
| **Arquivo(s) afetado(s)** | `src/components/admin/shared/AdminTableBody.tsx`, e os ~10 módulos listados em `src/components/admin/**` que não o utilizam |
| **Situação** | Aberto |
| **Sprint prevista** | RC1.2H |
| **Responsável** | A definir (Front-end) |
| **Observações** | Corresponde a UX-A4. **Já existe em `PRODUCT_BACKLOG.md` como `ADM-024`, mas classificado como prioridade Baixa — recomenda-se reclassificar para Alta**, alinhado à gravidade original da auditoria. |

### UXB-A5 — Tabelas administrativas densas sem rolagem horizontal

| Campo | Valor |
|---|---|
| **Descrição** | Busca por `overflow-x-auto` em `src/` retorna apenas 2 arquivos, ambos do Portal do Aluno. Módulos com 8–11 colunas (Questões, Distribuições, Versões, relatório de Importação) não têm wrapper de rolagem horizontal — risco real de quebra de layout em tablet/mobile, contrariando `DESIGN_PRINCIPLES.md` §12 ("Excelente responsividade"). |
| **Gravidade** | Alta |
| **Área** | Admin |
| **Arquivo(s) afetado(s)** | `src/components/admin/questions/QuestionsPage.tsx`, `src/components/admin/distributions/DistributionsPage.tsx`, `src/components/admin/versions/VersionsPage.tsx`, `src/components/admin/import/ImportPage.tsx` |
| **Situação** | Aberto |
| **Sprint prevista** | RC1.2H |
| **Responsável** | A definir (Front-end) |
| **Observações** | Corresponde a UX-A5. Sem item correspondente em `PRODUCT_BACKLOG.md` (relacionado, mas não idêntico, a M01 de `RC1_AUDIT.md`). |

### UXB-A6 — Dashboard do Admin: métricas sem nenhuma ação associada

| Campo | Valor |
|---|---|
| **Descrição** | Os 10 blocos do dashboard administrativo (`CountCard`, `StatCard`) não têm `Link` nem `onClick` — são divs estáticas. Contraria `DESIGN_PRINCIPLES.md` §9: "Toda informação exibida deve levar rapidamente a uma ação" e "Métricas sem ação associada não devem ocupar espaço privilegiado." |
| **Gravidade** | Alta |
| **Área** | Admin |
| **Arquivo(s) afetado(s)** | `src/routes/_authenticated/admin/index.tsx:58-79,84-110` |
| **Situação** | Aberto |
| **Sprint prevista** | RC1.2H |
| **Responsável** | A definir (Design/Front-end) |
| **Observações** | Corresponde a UX-A6. Sem item correspondente em `PRODUCT_BACKLOG.md`. |

### UXB-A7 — Raio de borda e padding fora de uma régua única

| Campo | Valor |
|---|---|
| **Descrição** | `Card` usa `rounded-xl`; `Button`, `Input` e `Badge` usam `rounded-md`; wrappers de tabela oscilam entre `rounded-lg` (maioria do Admin) e `rounded-md` (Aluno). Padding de card de estatística oscila entre `p-5` (dashboards) e `p-6` (`CardContent` padrão). Viola a regra explícita do §8: "Mesmo `border-radius` em cards, botões e inputs" / "Padding: escala consistente." |
| **Gravidade** | Alta |
| **Área** | Compartilhado |
| **Arquivo(s) afetado(s)** | `src/components/ui/card.tsx:9,43`, `src/components/ui/button.tsx:8`, `src/components/ui/input.tsx:11`, `src/components/ui/badge.tsx:7`, wrappers de tabela em `src/components/admin/**` e `src/components/app/**` |
| **Situação** | Aberto |
| **Sprint prevista** | RC1.2H |
| **Responsável** | A definir (Design) |
| **Observações** | Corresponde a UX-A7. Pré-requisito do Pilar 2 ("Sistema de Design") de `PRODUCT_VISION_RC1.2F.md`. Sem item correspondente em `PRODUCT_BACKLOG.md`. |

---

## Médios

### UXB-M1 — `aria-label` ausente em botões de ícone de parte dos módulos

| Campo | Valor |
|---|---|
| **Descrição** | Cursos, Taxonomia e Questões já aplicam `aria-label={\`Editar ${nome}\`}` nos botões de ícone. Pacotes e Versões não seguem o mesmo padrão (já registrado como M09 em `RC1_AUDIT.md`). |
| **Gravidade** | Média |
| **Área** | Admin |
| **Arquivo(s) afetado(s)** | `src/components/admin/packages/PackagesPage.tsx`, `src/components/admin/versions/VersionsPage.tsx` |
| **Situação** | Aberto |
| **Sprint prevista** | v1.1 |
| **Responsável** | A definir (Front-end) |
| **Observações** | Corresponde a M1 (`UX_AUDIT_RC1.2D.md`), que referencia `RC1_AUDIT.md` M09. |

### UXB-M2 — Marca (logotipo) com tamanho e raio diferentes em três lugares

| Campo | Valor |
|---|---|
| **Descrição** | O mesmo ícone de marca aparece com tratamentos distintos: Landing `h-9 w-9 rounded-lg`, Auth `h-10 w-10 rounded-lg`, Sidebar `h-8 w-8 rounded-md`. Mesma marca, três implementações. |
| **Gravidade** | Média |
| **Área** | Compartilhado |
| **Arquivo(s) afetado(s)** | `src/routes/index.tsx:14`, `src/routes/auth.tsx:84`, `src/components/AppShell.tsx:67` |
| **Situação** | Aberto |
| **Sprint prevista** | v1.1 |
| **Responsável** | A definir (Design) |
| **Observações** | Corresponde a M2. |

### UXB-M3 — Histórico expõe 11 colunas sem priorização em telas estreitas

| Campo | Valor |
|---|---|
| **Descrição** | `StudyHistoryPage.tsx` já usa `overflow-x-auto` (correto), mas nenhuma coluna é ocultada/priorizada em mobile — o guia pede *progressive disclosure* quando há excesso de informação (§6.3). |
| **Gravidade** | Média |
| **Área** | Aluno |
| **Arquivo(s) afetado(s)** | `src/components/app/history/StudyHistoryPage.tsx:325-335` |
| **Situação** | Aberto |
| **Sprint prevista** | v1.1 |
| **Responsável** | A definir (Design/Front-end) |
| **Observações** | Corresponde a M3. |

### UXB-M4 — Diálogos de criação/edição sem `<form>` em parte dos módulos

| Campo | Valor |
|---|---|
| **Descrição** | Módulos como Cursos e Taxonomia envolvem os campos em `<form onSubmit>`, permitindo submissão por Enter. Pacotes não segue o mesmo padrão (já registrado como M14 em `RC1_AUDIT.md`). |
| **Gravidade** | Média |
| **Área** | Admin |
| **Arquivo(s) afetado(s)** | `src/components/admin/packages/PackagesPage.tsx` |
| **Situação** | Aberto |
| **Sprint prevista** | v1.1 |
| **Responsável** | A definir (Front-end) |
| **Observações** | Corresponde a M4, que referencia `RC1_AUDIT.md` M14. |

### UXB-M5 — Paleta de tema escuro definida, porém sem nenhum controle de UI

| Campo | Valor |
|---|---|
| **Descrição** | `.dark { ... }` está 100% definido em `styles.css`, mas não há toggle ou detecção de `prefers-color-scheme` em nenhum lugar do produto. Risco de divergência silenciosa entre paletas (como já ocorre em UXB-C2). |
| **Gravidade** | Média |
| **Área** | Compartilhado |
| **Arquivo(s) afetado(s)** | `src/styles.css:94-122` |
| **Situação** | Aberto |
| **Sprint prevista** | v1.1 |
| **Responsável** | A definir (Design/Produto) |
| **Observações** | Corresponde a M5. Decisão de produto pendente (comprometer com toggle real ou remover a paleta) — listada como pergunta em aberto em `PRODUCT_VISION_RC1.2F.md` §7. |

### UXB-M6 — Estados vazios com acabamento diferente entre Admin e Aluno

| Campo | Valor |
|---|---|
| **Descrição** | Admin usa majoritariamente texto simples ("Nenhum curso cadastrado."); Aluno usa o componente `EmptyState` com ícone e moldura tracejada. Mesmo conceito, dois níveis de acabamento — contraria "Consistência: mesmos padrões em Admin e Portal do Aluno" (§5). |
| **Gravidade** | Média |
| **Área** | Compartilhado |
| **Arquivo(s) afetado(s)** | `src/components/shared/EmptyState.tsx`, módulos administrativos que usam mensagem inline |
| **Situação** | Aberto |
| **Sprint prevista** | v1.1 |
| **Responsável** | A definir (Front-end) |
| **Observações** | Corresponde a M6. Faz parte do Pilar 3 ("Padronização") de `PRODUCT_VISION_RC1.2F.md`. |

### UXB-M7 — Card "Estudar" não pré-seleciona a distribuição de origem

| Campo | Valor |
|---|---|
| **Descrição** | `DistributionCard.tsx` leva a um formulário de configuração genérico em `/app/study`, sem pré-selecionar a distribuição de onde o clique partiu — quebra a continuidade contextual esperada (já registrado como M20 em `RC1_AUDIT.md`). |
| **Gravidade** | Média |
| **Área** | Aluno |
| **Arquivo(s) afetado(s)** | `src/components/app/dashboard/DistributionCard.tsx` |
| **Situação** | Aberto |
| **Sprint prevista** | v1.1 |
| **Responsável** | A definir (Front-end) |
| **Observações** | Corresponde a M7, que referencia `RC1_AUDIT.md` M20. |

### UXB-M8 — Rótulos ambíguos entre atalhos "Revisar depois" e "Pendentes de revisão"

| Campo | Valor |
|---|---|
| **Descrição** | Dois filtros distintos (`review_later` e questões erradas) competem pelo mesmo verbo "revisar" na cabeça do aluno (já registrado como M19 em `RC1_AUDIT.md`). |
| **Gravidade** | Média |
| **Área** | Aluno |
| **Arquivo(s) afetado(s)** | `src/components/app/dashboard/StudyFilterIndicators.tsx` |
| **Situação** | Aberto |
| **Sprint prevista** | v1.1 |
| **Responsável** | A definir (Design/Conteúdo) |
| **Observações** | Corresponde a M8, que referencia `RC1_AUDIT.md` M19. |

### UXB-M9 — Uso de `font-mono` sem critério documentado

| Campo | Valor |
|---|---|
| **Descrição** | Versão, slug e nomes de campo usam `font-mono` em pontos isolados, sem regra escrita sobre quando um dado "parece código". Pequena quebra da "tipografia com escala fixa" (§8). |
| **Gravidade** | Média |
| **Área** | Admin |
| **Arquivo(s) afetado(s)** | `src/components/admin/distributions/DistributionsPage.tsx:367`, `src/components/admin/packages/PackagesPage.tsx:300`, `src/components/admin/import/ImportPage.tsx:454` |
| **Situação** | Aberto |
| **Sprint prevista** | v1.1 |
| **Responsável** | A definir (Design) |
| **Observações** | Corresponde a M9. |

---

## Baixos

### UXB-B1 — Badge "Em andamento" usa a mesma cor dos botões de ação

| Campo | Valor |
|---|---|
| **Descrição** | O card de sessão recém-criada usa `<Badge>` variante padrão (cor primária) para indicar status "Em andamento" — mesma cor usada em botões de ação, gerando ambiguidade sutil entre "isto é um status" e "isto é clicável". |
| **Gravidade** | Baixa |
| **Área** | Aluno |
| **Arquivo(s) afetado(s)** | `src/components/app/study/StudyPage.tsx:146` |
| **Situação** | Aberto |
| **Sprint prevista** | v1.1 |
| **Responsável** | A definir (Design) |
| **Observações** | Corresponde a B1. |

### UXB-B2 — Campo de busca com ícone reconstruído manualmente em cada tela

| Campo | Valor |
|---|---|
| **Descrição** | O padrão `relative` + `pl-9` + ícone de lupa é reimplementado em cada página em vez de existir como variante única do `Input`. Sem defeito visível hoje, mas qualquer ajuste futuro exige tocar múltiplos arquivos. |
| **Gravidade** | Baixa |
| **Área** | Compartilhado |
| **Arquivo(s) afetado(s)** | `src/components/admin/courses/CoursesPage.tsx`, `src/components/app/history/StudyHistoryPage.tsx:224-231`, entre outras |
| **Situação** | Aberto |
| **Sprint prevista** | v1.1 |
| **Responsável** | A definir (Front-end) |
| **Observações** | Corresponde a B2. |

### UXB-B3 — Rótulos de opção no configurador de sessão sem `htmlFor`/`id` explícitos

| Campo | Valor |
|---|---|
| **Descrição** | `StudyPage.tsx` usa `<label>` envolvendo `RadioGroupItem` sem `htmlFor`/`id` explícitos, diferente do padrão `Label htmlFor` usado nos formulários administrativos. Funciona (o wrap cobre a associação), mas quebra o padrão do restante do produto. |
| **Gravidade** | Baixa |
| **Área** | Aluno |
| **Arquivo(s) afetado(s)** | `src/components/app/study/StudyPage.tsx:182-186` |
| **Situação** | Aberto |
| **Sprint prevista** | v1.1 |
| **Responsável** | A definir (Front-end) |
| **Observações** | Corresponde a B3. |

### UXB-B4 — `console.log` de debug remanescente no fluxo de cadastro

| Campo | Valor |
|---|---|
| **Descrição** | `console.log` de debug ainda presente no fluxo de cadastro. Já registrado como B01 em `RC1_AUDIT.md`; citado aqui apenas pelo efeito de "polimento" percebido em produção. |
| **Gravidade** | Baixa |
| **Área** | Compartilhado |
| **Arquivo(s) afetado(s)** | `src/routes/auth.tsx:67-70` |
| **Situação** | Aberto |
| **Sprint prevista** | v1.1 |
| **Responsável** | A definir (Front-end) |
| **Observações** | Corresponde a B4, que referencia `RC1_AUDIT.md` B01. Também alinhado a `PLT-013` ("Eliminar warnings do console") já existente em `PRODUCT_BACKLOG.md`. |

---

# Ordem oficial de execução

Agrupamento temático (não substitui a prioridade por gravidade acima — define a sequência dentro de cada onda de trabalho):

### 1. Fluxos críticos — Navegação · Rotas · Sidebar · Histórico

`UXB-C1` · `UXB-A1` · `UXB-M8`

### 2. Sistema de Design — Tokens · Cores · Estados · Radius · Espaçamentos · Componentes

`UXB-C2` · `UXB-A7` · `UXB-A2` · `UXB-M2` · `UXB-M5` · `UXB-B1`

### 3. Padronização — Admin · Aluno · Tabelas · Cards · Inputs

`UXB-A3` · `UXB-A4` · `UXB-A6` · `UXB-M1` · `UXB-M4` · `UXB-M6` · `UXB-M7` · `UXB-M9` · `UXB-B2` · `UXB-B3`

### 4. Responsividade — Desktop · Tablet · Mobile

`UXB-A5` · `UXB-M3`

### 5. Performance — Loadings · Skeletons · Queries

`UXB-B4`

> **Nota:** a auditoria de UX (`UX_AUDIT_RC1.2D.md`) foi feita por revisão estática de código, sem medição de performance. Por isso a onda 5 tem apenas um item de origem UX. Achados de performance propriamente ditos (consultas pesadas em exportação/importação/dashboard) já estão cobertos por `PLT-015` em `PRODUCT_BACKLOG.md` e pelos achados C04/C05 de `RC1_AUDIT.md` — este backlog não os duplica, apenas referencia.

---

# Critério de aceite

O UX Backlog será considerado concluído apenas quando:

- [ ] Todos os itens **Críticos** (`UXB-C1`, `UXB-C2`) estiverem concluídos.
- [ ] Todos os itens **Altos** (`UXB-A1`–`UXB-A7`) estiverem concluídos.
- [ ] Não houver hardcodes de cores fora dos tokens oficiais (`--success`, `--warning`, `--destructive`, etc. — verificável por busca textual por `green-`, `red-`, `amber-`, `emerald-` literais em `src/`).
- [ ] Todo o Portal do Aluno seguir o Design System (raio, padding, tipografia e estados definidos em `DESIGN_PRINCIPLES.md` §8).
- [ ] Todo o Portal Administrativo seguir o mesmo Design System — incluindo adoção total de `AdminTableBody` (`UXB-A4`) e do padrão de estado vazio único (`UXB-M6`).
- [ ] A navegação estiver consistente em todas as rotas — item ativo reconhecendo sub-rotas (`UXB-A1`) e Histórico presente na sidebar (`UXB-C1`).

Itens Médios e Baixos não bloqueiam esta declaração de conclusão, mas devem permanecer rastreados até serem fechados.

---

# Relação com PRODUCT_BACKLOG

| Item deste backlog | Situação em `PRODUCT_BACKLOG.md` | Ação recomendada |
|---|---|---|
| `UXB-A1` | Já existe como `PA-016` ("Navegação ativa em sub-rotas"), prioridade **Média** | **Atualizar** prioridade para Alta, alinhado à gravidade da auditoria |
| `UXB-A4` | Já existe como `ADM-024` ("Padronizar AdminTableBody"), prioridade **Baixa** | **Atualizar** prioridade para Alta, alinhado à gravidade da auditoria |
| `UXB-B4` | Relacionado a `PLT-013` ("Eliminar warnings do console"), prioridade Média | Manter `PLT-013` como item guarda-chuva; `UXB-B4` é sua instância concreta |
| `UXB-C1`, `UXB-C2`, `UXB-A2`, `UXB-A3`, `UXB-A5`, `UXB-A6`, `UXB-A7` | **Não existem** em `PRODUCT_BACKLOG.md` | **Adicionar** como novos itens (sugestão de prefixo: `UX-001` a `UX-007`, mantendo rastreabilidade com os IDs `UXB-*` deste documento) |
| `UXB-M1`, `UXB-M2`, `UXB-M3`, `UXB-M4`, `UXB-M5`, `UXB-M6`, `UXB-M7`, `UXB-M8`, `UXB-M9` | **Não existem** em `PRODUCT_BACKLOG.md` | **Adicionar** como novos itens de prioridade Média |
| `UXB-B1`, `UXB-B2`, `UXB-B3` | **Não existem** em `PRODUCT_BACKLOG.md` | **Adicionar** como novos itens de prioridade Baixa, ou manter apenas neste backlog de UX até entrarem em sprint |

**Resumo:** 2 itens já rastreados (precisam de atualização de prioridade), 20 itens precisam ser adicionados como novos.

---

# Relação com ROADMAP

| Versão em `ROADMAP.md` | Itens deste backlog que devem entrar |
|---|---|
| **RC1.2 (atual, seção "Pendente")** | `UXB-C1`, `UXB-C2` — os dois Críticos devem ser tratados antes de qualquer fechamento formal de RC1.2, dado que tocam dois dos quatro fluxos críticos nomeados em `DESIGN_PRINCIPLES.md` §6 |
| **RC1.2 / abertura de RC1.2G-H (sub-sprints sugeridas)** | `UXB-A1` a `UXB-A7` — todos os Altos, correspondendo ao Pilar 1 (navegação) e Pilar 2 (sistema de design) de `PRODUCT_VISION_RC1.2F.md` |
| **v1.1 ("Melhorias operacionais")** | `UXB-M1` a `UXB-M9`, `UXB-B1` a `UXB-B4` — consistente com a entrada já existente "Padronização visual pós-auditoria UX" (`PLT-011`) em v1.1, agora detalhada item a item em vez de uma linha genérica |
| **Gate v1.1 → v2.0** | Nenhum item novo — mas a seção "Critério de aceite" acima deve ser usada como a lista fechada que falta hoje ao critério "Design system aplicado" já escrito em `ROADMAP.md` |
| **v2.0** | Nenhum item deste backlog — v2.0 deve herdar a base já consolidada, não competir por prioridade com ela |

---

*Documento criado na Sprint RC1.2F — UX Backlog Oficial. Não altera `PRODUCT_BACKLOG.md`, `ROADMAP.md` nem qualquer código — apenas propõe, com rastreabilidade item a item, como esses documentos devem incorporar `UX_AUDIT_RC1.2D.md`.*
