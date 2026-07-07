# RC1.2H — Redesign do Dashboard do Aluno

**Versão do documento:** RC1.2H
**Data:** 2026-07-06
**Papel:** Proposta de Product Design para reorganização do Dashboard do Aluno (`/app`).
**Natureza:** Estratégico/visual. Não contém código, componentes React, Tailwind ou CSS.
**Lido antes de propor:** [`DESIGN_PRINCIPLES.md`](./DESIGN_PRINCIPLES.md) · [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) · [`PRODUCT_VISION_RC1.2F.md`](./PRODUCT_VISION_RC1.2F.md) · [`UX_BACKLOG.md`](./UX_BACKLOG.md) · [`PRODUCT_BACKLOG.md`](./PRODUCT_BACKLOG.md) · [`ROADMAP.md`](./ROADMAP.md) · [`CHANGELOG.md`](./CHANGELOG.md)
**Regra de escopo:** nenhum dado, tabela, campo ou funcionalidade nova. Tudo o que existe hoje (`DashboardStats`, `StudyFilterIndicatorsBar`, `ContinueStudyCard`, distribuições, `RecentSessions`, `SubjectPerformanceTable`) permanece — apenas reorganizado, com hierarquia, agrupamento e estados revisados.

---

## 1. Objetivos

1. Ao abrir `/app`, o aluno deve pensar **"sei exatamente onde clicar"** — não "o que eu faço com essa tela cheia de números".
2. A tela deve priorizar, nesta ordem, exatamente como definido para esta sprint:
   1. Continuar estudando
   2. Retomar sessão em andamento
   3. Escolher distribuição
   4. Visualizar evolução
3. Nenhuma funcionalidade nova. Nenhum gráfico novo. Nenhuma gamificação. O que muda é **onde** cada bloco existente aparece, **como** ele se agrupa com os demais, e **o que comunica** visualmente sobre sua própria importância.
4. A tela não pode parecer painel financeiro (números frios, sem direção) nem aplicativo gamificado (badges, cores competindo por atenção). Deve parecer o que `DESIGN_PRINCIPLES.md` define: uma ferramenta profissional que aponta o próximo passo.

---

## 2. Problemas encontrados

Problemas identificados na organização **atual** de `StudentDashboardPage.tsx`, todos resolvíveis por reorganização — nenhum exige dado ou componente novo.

### 2.1 A ação mais importante está na 3ª posição visual, não na 1ª

Ordem atual: Cabeçalho → `DashboardStats` (4 números passivos) → `StudyFilterIndicatorsBar` (atalhos) → `ContinueStudyCard` (retomar sessão) → Distribuições → `RecentSessions` → `SubjectPerformanceTable`.

A ação #1 e #2 da prioridade desta sprint ("continuar estudando", "retomar sessão") é exatamente o `ContinueStudyCard` — e ele está **depois** de dois blocos inteiros de métricas e atalhos. Um aluno que abre o app para continuar de onde parou precisa passar visualmente por 8 números antes de ver o card que resolve sua intenção. Isso contraria `DESIGN_PRINCIPLES.md` §6.4: *"os dados mais importantes sempre aparecem primeiro."*

### 2.2 `DashboardStats` ocupa a posição mais privilegiada da tela sem levar a nenhuma ação

Os 4 cards ("Questões respondidas", "Aproveitamento", "Sessões concluídas", "Tempo total") são hoje `<div>`s estáticas, sem `Link` nem `onClick` — mesmo padrão de dívida já identificado no Dashboard do Admin (`UXB-A6`) e já proibido por `DESIGN_SYSTEM.md` §14: *"Todo card de métrica deve ser clicável/navegável... métrica sem destino é proibida."* Hoje o bloco mais visível da tela é, paradoxalmente, o menos acionável.

### 2.3 Os atalhos de filtro parecem etiquetas informativas, não convites de ação

`StudyFilterIndicatorsBar` reimplementa seu próprio `<button>` com uma string de classe manual (`rounded-lg border bg-card px-3 py-2 text-sm...`), em vez de reaproveitar o componente `Button` já existente. Visualmente, o resultado se parece com um badge de contagem — não com um atalho clicável para iniciar uma sessão filtrada, que é exatamente o que ele é.

### 2.4 Duas tabelas do próprio dashboard não seguem a regra de rolagem horizontal

`RecentSessions` (6 colunas) e `SubjectPerformanceTable` (4 colunas) não têm o wrapper `overflow-x-auto` definido como obrigatório em `DESIGN_SYSTEM.md` §7 ("Tables"). É a mesma classe de problema já registrada para o Admin em `UXB-A5`, aqui encontrada em mais dois arquivos do próprio Portal do Aluno.

### 2.5 "Visualizar evolução" não tem, hoje, um dado de evolução real

A prioridade #4 pede "visualizar evolução", mas os dados existentes (`DashboardStats`, `SubjectPerformanceTable`) são **acumulados/atuais**, não uma série temporal — não existe gráfico de evolução no produto (isso é `PA-021`, planejado para v2.0, fora de escopo aqui). Este redesign **não inventa** um gráfico. Em vez disso, reconhece honestamente o que os dados atuais já respondem — "como estou indo no total" e "onde estou mais fraco agora" — e organiza esses dois blocos juntos, com um rótulo de seção que descreve o que eles de fato mostram, sem prometer uma evolução temporal que o produto ainda não tem.

### 2.6 Distribuição sem pré-seleção de contexto (já rastreado)

O botão "Estudar" de cada `DistributionCard` leva a `/app/study` de forma genérica, sem carregar a distribuição de origem. Já é `UXB-M7` em `UX_BACKLOG.md` — não é reproposto aqui como algo novo, apenas referenciado, porque a reorganização deste documento aumenta a exposição desse card (ele sobe de posição) e por isso reforça a urgência de fechar esse item.

---

## 3. Nova arquitetura da página

Duas zonas, nesta ordem — nada fora delas, nenhum bloco removido:

| Zona | Nome | Contém (componentes já existentes) | Responde à prioridade |
|---|---|---|---|
| **Zona 1 — Ação** | "O que fazer agora" | `ContinueStudyCard` (hero) → Distribuições (`DistributionCard`) → `StudyFilterIndicatorsBar` | Prioridades 1, 2 e 3 |
| **Zona 2 — Progresso** | "Como você está indo" | `DashboardStats` → `RecentSessions` → `SubjectPerformanceTable` | Prioridade 4 |

A Zona 1 responde à pergunta que o aluno faz ao abrir o app ("o que eu faço agora?"). A Zona 2 responde a uma pergunta diferente e deliberadamente secundária ("como estou indo?"). Separar as duas em blocos nomeados evita que os 4 números de `DashboardStats` "vazem" visualmente para cima e concorram com a ação.

---

## 4. Wireframe textual (ASCII)

### 4.1 Desktop / notebook (`lg:`/`xl:`, ≥1024px)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Olá, {nome}                                                              │
│  Seu resumo de estudos e ponto de entrada para continuar aprendendo.      │
└──────────────────────────────────────────────────────────────────────────┘

  ZONA 1 — O QUE FAZER AGORA
┌──────────────────────────────────────────────────────────────────────────┐
│  ▐ Continuar última sessão                                    [hero]     │
│  ▐ {distribution_name}                        [Modo]  Progresso: X de Y  │
│  ▐                                                    (▶ Continuar)      │
└──────────────────────────────────────────────────────────────────────────┘
        ↑ some inteiro se não houver sessão em andamento — ver §7.1

  Minhas distribuições
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│ 📖 {distribuição A}   │ │ 📖 {distribuição B}   │ │ 📖 {distribuição C}   │
│ curso · pacote        │ │ curso · pacote        │ │ curso · pacote        │
│ Questões: N   Últ.: d │ │ Questões: N   Últ.: d │ │ Questões: N   Últ.: d │
│ [       Estudar     ] │ │ [       Estudar     ] │ │ [       Estudar     ] │
└───────────────────────┘ └───────────────────────┘ └───────────────────────┘

  Atalhos de estudo
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│ ★ Favoritas       (4) │ │ 📌 Revisar depois (2) │ │ ✕ Pendentes       (7) │
└───────────────────────┘ └───────────────────────┘ └───────────────────────┘

┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

  ZONA 2 — COMO VOCÊ ESTÁ INDO
┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ Respondidas → │ │ Aproveita. →  │ │ Sessões    →  │ │ Tempo total → │
│ 128           │ │ 74%           │ │ 12            │ │ 6h 40min      │
└───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘
        ↑ os 4 cards agora levam a /app/history (ver §6)

┌──────────────────────────────────────────────────────────────────────────┐
│  Últimas sessões                              Ver histórico completo →   │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ Data   Distribuição   Modo    Acertos   Tempo         Ação         │  │
│  │ ...    ...            ...     ...       ...      [Ver resultado]  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  Desempenho por disciplina                                               │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ Disciplina        Respondidas   Acertos   Percentual                │  │
│  │ ...                ...          ...       ...                      │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Mobile (base, <640px)

```
┌───────────────────────────┐
│ Olá, {nome}                │
│ Seu resumo de estudos...   │
└───────────────────────────┘

 ZONA 1
┌───────────────────────────┐
│ ▐ Continuar última sessão │
│ ▐ {distribuição}           │
│ ▐ [ ▶ Continuar ]          │
└───────────────────────────┘

 Minhas distribuições
┌───────────────────────────┐
│ 📖 {distribuição A}        │
│ [       Estudar         ] │
└───────────────────────────┘
┌───────────────────────────┐
│ 📖 {distribuição B}        │
│ [       Estudar         ] │
└───────────────────────────┘

 Atalhos de estudo
┌───────────────────────────┐
│ ★ Favoritas          (4)  │
└───────────────────────────┘
┌───────────────────────────┐
│ 📌 Revisar depois    (2)  │
└───────────────────────────┘
┌───────────────────────────┐
│ ✕ Pendentes          (7)  │
└───────────────────────────┘

 ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

 ZONA 2
┌───────────────────────────┐
│ Respondidas →  128         │
└───────────────────────────┘
┌───────────────────────────┐
│ Aproveitamento →  74%      │
└───────────────────────────┘
┌───────────────────────────┐
│ Sessões →  12               │
└───────────────────────────┘
┌───────────────────────────┐
│ Tempo total →  6h 40min     │
└───────────────────────────┘

┌───────────────────────────┐
│ Últimas sessões             │
│ (rolagem horizontal →)      │
└───────────────────────────┘

┌───────────────────────────┐
│ Desempenho por disciplina  │
│ (rolagem horizontal →)      │
└───────────────────────────┘
```

---

## 5. Descrição detalhada de cada bloco

### 5.1 Cabeçalho (inalterado)

Mesmo conteúdo de hoje: `text-2xl font-bold` com saudação + `text-sm text-muted-foreground` com subtítulo. Nenhuma mudança — já está correto e alinhado ao Design System.

### 5.2 Hero — Continuar última sessão

**O que é:** o mesmo `ContinueStudyCard` de hoje, sem alteração de conteúdo ou dado.
**O que muda:** posição. Sobe de 4º para 1º bloco de conteúdo, imediatamente após o cabeçalho.
**Ganho de UX:** o aluno com sessão em andamento vê a ação que resolve sua intenção antes de qualquer número — zero rolagem, zero decisão.
**Impacto na produtividade:** remove 2 blocos inteiros (Stats + Atalhos) do caminho entre "abrir o app" e "retomar estudo" — economiza tempo justamente no atalho que `DESIGN_PRINCIPLES.md` §6 exige ("cada clique deve economizar tempo").

### 5.3 Minhas distribuições

**O que é:** o mesmo grid de `DistributionCard` de hoje, mesmos dados (nome, curso/pacote, questões, última atividade, botão Estudar).
**O que muda:** posição — sobe para 2º bloco (ou 1º, quando não há sessão em andamento — ver §7.1). Nenhuma mudança visual no card em si.
**Ganho de UX:** "escolher distribuição" é a prioridade #3 — hoje ela vem depois de métricas que não ajudam a decidir o que estudar; na nova ordem, aparece assim que o aluno termina de decidir se vai continuar ou começar algo novo.
**Impacto na produtividade:** menos rolagem entre abrir o app e iniciar uma sessão nova, quando não há sessão em andamento.

### 5.4 Atalhos de estudo (Favoritas / Revisar depois / Pendentes)

**O que é:** o mesmo `StudyFilterIndicatorsBar`, mesmos três atalhos e mesmas contagens.
**O que muda:**
- Posição: desce de 2º para 3º bloco da Zona 1 (depois das distribuições, não antes de tudo) — são um atalho complementar para "o que estudar", não a primeira decisão da tela.
- Visual: reaproveitar o componente `Button` (`variant="outline"`, já existente no Design System) no lugar da string de classe manual atual, com a contagem em `Badge` — sem criar nenhum componente novo, apenas trocando a implementação por peças que já existem em `src/components/ui`.
- Estado zero: quando a contagem é `0`, o atalho fica com `disabled` (prop que os componentes já suportam) em vez de permanecer clicável e devolver um toast de erro depois do clique — ajuste já sinalizado em `RC1_AUDIT.md` (M18).
**Ganho de UX:** o aluno reconhece o bloco como três botões de ação (mesma linguagem visual de botão usada no resto do produto), não como três estatísticas soltas.
**Impacto na produtividade:** elimina o clique "morto" em atalho vazio — reduz um toast de erro evitável por sessão de uso.

### 5.5 Estatísticas (Zona 2, abre "Como você está indo")

**O que é:** os mesmos 4 `DashboardStats` (Questões respondidas, Aproveitamento, Sessões concluídas, Tempo total), mesmos números.
**O que muda:** posição — desce da 2ª para a 5ª posição geral da tela (primeiro bloco da Zona 2). Visualmente, os 4 cards passam a ser clicáveis: cada um recebe um link para `/app/history` (rota já existente, sem nenhuma tela nova), com a seta "→" e o cursor de link, seguindo o mesmo tratamento de hover (`hover:border-primary/40`, já usado em `DistributionCard`/`StudyPage`) para indicar que é navegável.
**Ganho de UX:** a métrica deixa de ser um número frio e passa a ser uma porta de entrada para o detalhe — clicar em "Sessões concluídas" leva direto ao histórico filtrável, sem precisar procurar o link em outro lugar da tela.
**Impacto na produtividade:** fecha, para o Portal do Aluno, o mesmo problema já identificado no Admin (`UXB-A6`) — nenhuma métrica fica "presa" na tela sem caminho de ação.

### 5.6 Últimas sessões

**O que é:** o mesmo `RecentSessions` (tabela de 6 colunas + link "Ver histórico completo →"), mesmos dados.
**O que muda:** apenas o ajuste técnico-visual de envolver a tabela em `overflow-x-auto` (regra já obrigatória em `DESIGN_SYSTEM.md` §7), hoje ausente neste componente. Nenhuma coluna, nenhum dado novo.
**Ganho de UX:** em tablet/mobile, a tabela deixa de arriscar quebrar o layout e passa a rolar horizontalmente de forma previsível, como já acontece em `StudyHistoryPage`.
**Impacto na produtividade:** nenhum — é correção de robustez visual, não de fluxo.

### 5.7 Desempenho por disciplina

**O que é:** o mesmo `SubjectPerformanceTable`, mesmos dados (disciplina, respondidas, acertos, percentual, ordenado do menor para o maior).
**O que muda:** apenas o mesmo ajuste de `overflow-x-auto`. Mantém-se como último bloco da tela — é, dos quatro pontos de prioridade da sprint, o item #4, e é honesto que ele feche a página.
**Ganho de UX:** nenhuma promessa de "evolução" que o dado não cumpre — o rótulo e a posição comunicam exatamente o que a tabela é: onde focar a próxima sessão de estudo, não um gráfico de progresso ao longo do tempo.
**Impacto na produtividade:** o aluno que quer saber "no que estou pior" continua encontrando a resposta no mesmo lugar, sem competir por atenção com o topo da tela.

---

## 6. Fluxo de navegação

Nenhum destino novo é criado — apenas destinos já existentes, alguns hoje sem link a partir do dashboard:

| Origem (clique) | Destino | Situação |
|---|---|---|
| `ContinueStudyCard` → "Continuar" | `/app/study/$sessionId` | Já existe |
| `DistributionCard` → "Estudar" | `/app/study` (genérico, sem pré-seleção) | Já existe — pré-seleção de contexto é `UXB-M7`, não tratada aqui |
| Atalho "Favoritas"/"Revisar depois"/"Pendentes" | Cria sessão filtrada → `/app/study/$sessionId` | Já existe |
| **Qualquer card de `DashboardStats`** | `/app/history` | **Novo link para rota já existente** — hoje os 4 cards não têm destino algum |
| `RecentSessions` → "Ver histórico completo →" | `/app/history` | Já existe |
| Linha de `RecentSessions` → "Ver resultado" | `/app/study/$sessionId` | Já existe |

**Observação sobre a sidebar:** este redesign aumenta o número de caminhos que levam a `/app/history` (agora também a partir dos 4 cards de estatística). Isso reforça — não substitui — a urgência de `UXB-C1` (Histórico ausente do menu lateral): quanto mais entradas contextuais apontam para essa página, mais estranho fica ela não ter um item fixo de navegação.

---

## 7. Estados vazios

Nenhum estado novo é criado — os mesmos componentes de vazio já existentes (`EmptyState`) continuam sendo usados; o que muda é onde cada estado aparece na nova hierarquia.

### 7.1 Sem sessão em andamento (não há `continueStudy`)

A Zona 1 perde seu primeiro bloco (`ContinueStudyCard` não renderiza, exatamente como hoje). O hero da tela passa a ser diretamente "Minhas distribuições" — nenhum espaço vazio ou placeholder no lugar do card ausente. Este já é o comportamento atual (`{data.continueStudy && <ContinueStudyCard .../>}`); a reorganização apenas garante que, na ausência do hero, o próximo bloco assume o topo sem deixar um vão.

### 7.2 Sem distribuição ativa (aluno sem assinatura)

Mantém o `EmptyState` já existente ("Nenhuma distribuição liberada" / "Fale com o administrador para ativar sua assinatura"). Como a Zona 1 agora é a primeira coisa vista na tela, este estado vazio passa a ser, para um aluno novo sem assinatura, o **primeiro conteúdo relevante da página** — o que é correto: é exatamente a informação mais importante para esse aluno específico.

### 7.3 Sem sessões recentes

Mantém o `EmptyState` já existente em `RecentSessions` ("Nenhuma sessão registrada" / "Suas sessões de estudo aparecerão aqui após você começar a estudar"). Nenhuma mudança de conteúdo.

### 7.4 Sem desempenho por disciplina

Mantém o `EmptyState` já existente em `SubjectPerformanceTable` ("Sem desempenho por disciplina"). Nenhuma mudança de conteúdo.

### 7.5 Atalho de filtro com contagem zero

Como descrito em §5.4: o atalho passa a usar o estado `disabled` já suportado pelo componente, em vez de permanecer clicável e falhar com um toast depois do clique.

---

## 8. Responsividade

Nenhum breakpoint novo — os já oficializados em `DESIGN_SYSTEM.md` §10.1 (`sm`/`md`/`lg`/`xl`), aplicados à nova ordem:

| Faixa | Comportamento |
|---|---|
| **Desktop/Notebook** (`lg:`/`xl:`) | Zona 1: hero em largura total; distribuições em até 3 colunas (`xl:grid-cols-3`, já existente); atalhos em linha (`flex-wrap`, já existente). Zona 2: estatísticas em 4 colunas (`lg:grid-cols-4`, já existente); tabelas em largura total. |
| **Tablet** (`sm:`/`md:`) | Distribuições em 2 colunas (`md:grid-cols-2`, já existente); estatísticas em 2 colunas (`sm:grid-cols-2`, já existente); tabelas com `overflow-x-auto` ativo (§2.4/§5.6/§5.7). |
| **Mobile** (base) | Tudo em coluna única, na mesma ordem vertical do wireframe §4.2 — hero primeiro, distribuições empilhadas, atalhos empilhados, depois a Zona 2 completa. Nenhuma seção é ocultada em mobile; a ordem é que garante que o essencial (Zona 1) apareça sem rolagem longa. |

Nenhuma mudança de grid além de aplicar `overflow-x-auto` nas duas tabelas que hoje não têm (§2.4) — todos os demais breakpoints já existem e continuam os mesmos.

---

## 9. Checklist de implementação

Passos de reorganização — nenhum é criação de funcionalidade, apenas reposicionamento e ajuste visual do que já existe:

- [ ] Reordenar os blocos em `StudentDashboardPage.tsx` na sequência: `ContinueStudyCard` → Distribuições → `StudyFilterIndicatorsBar` → `DashboardStats` → `RecentSessions` → `SubjectPerformanceTable`
- [ ] Adicionar destino de navegação (`/app/history`) aos 4 cards de `DashboardStats`, reaproveitando o padrão de link/hover já usado em `DistributionCard`
- [ ] Envolver a tabela de `RecentSessions` em `overflow-x-auto` (padrão já usado em `StudyHistoryPage`/`SessionResultsView`)
- [ ] Envolver a tabela de `SubjectPerformanceTable` em `overflow-x-auto`
- [ ] Substituir o `<button>` customizado de `StudyFilterIndicatorsBar` pelo componente `Button` (`variant="outline"`) + `Badge` para a contagem
- [ ] Aplicar `disabled` no atalho de filtro quando a contagem correspondente for `0`
- [ ] Confirmar que a ausência de `ContinueStudyCard` não deixa vão visual antes do bloco de distribuições (comportamento condicional já existe, apenas validar após a reordenação)
- [ ] Validar em `sm`/`md`/`lg`/`xl` que a nova ordem não quebra nenhum grid existente
- [ ] Atualizar `UX_BACKLOG.md` para referenciar este redesign como o contexto de fechamento de `UXB-A6` (equivalente do Aluno) e reforçar a prioridade de `UXB-C1`

---

## 10. Componentes existentes reutilizados sem alteração

Nenhum destes precisa de qualquer ajuste — apenas mudam de posição na árvore da página:

- `ContinueStudyCard`
- `DistributionCard`
- `RecentSessions` (conteúdo e colunas)
- `SubjectPerformanceTable` (conteúdo e colunas)
- `EmptyState` (todos os usos atuais)
- `PageErrorState`
- `Card` / `CardHeader` / `CardContent` / `CardTitle` / `CardDescription`
- `Skeleton` (estados de carregamento já cobrem a mesma estrutura de blocos, só reordenados)

## 11. Componentes que precisam apenas de ajuste visual (sem criação de novo componente)

- **`DashboardStats`** — adicionar wrapper de link (`Link to="/app/history"`) e classe de hover já padronizada (`hover:border-primary/40 transition-colors`) a cada card existente
- **`StudyFilterIndicatorsBar`** — trocar o `<button>` com classe manual pelo componente `Button` (`variant="outline"`) já existente, mantendo os mesmos ícones (`Star`, `Pin`, `XCircle`, `Loader2`) e o mesmo dado de contagem, agora exibido em `Badge`; aplicar `disabled` quando a contagem for `0`
- **`RecentSessions`** — envolver a tabela existente em `<div className="overflow-x-auto rounded-md border">` (mesma classe já usada em `StudyHistoryPage`)
- **`SubjectPerformanceTable`** — mesmo ajuste de `overflow-x-auto`

---

*Documento criado na Sprint RC1.2H — Redesign do Dashboard do Aluno. Não altera código, componentes, dados ou funcionalidades — apenas propõe nova ordem, agrupamento e estados para o que já existe em produção.*
