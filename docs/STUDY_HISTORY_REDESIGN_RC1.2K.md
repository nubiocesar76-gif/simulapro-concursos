# RC1.2K — Redesign da Tela de Histórico

**Escopo:** `StudyHistoryPage.tsx` (`/app/history`). Apenas UX/UI. Nenhuma query, rota, dado ou regra de negócio alterada.
**Referências:** `DESIGN_SYSTEM.md`, `UX_BACKLOG.md` (`UXB-C1`, `UXB-M3`), `DASHBOARD_REDESIGN_RC1.2H.md`, `STUDY_EXPERIENCE_REDESIGN_RC1.2I.md`, `SESSION_RESULTS_REDESIGN_RC1.2J.md`.

---

## 1. Auditoria

**Achado 01 — Resumo (4 stats) compete com a tarefa real da tela**
Layout idêntico ao `HistorySummaryStats`/`DashboardStats` (mesmo card, mesmo grid). Nesta tela o objetivo do aluno é *encontrar/filtrar uma sessão*, não ver totais — diferente do Dashboard, onde o resumo é o próprio conteúdo.
**Impacto:** resumo com o mesmo peso da tabela empurra Filtros/Lista para baixo, sem ganho real.
**Decisão:** manter os 4 cards e todos os dados, reduzir peso visual (menor, uma linha só, sem competir com Filtros/Lista).

**Achado 02 — 11 colunas sem prioridade em telas estreitas** (`UXB-M3`, ainda aberto)
Tabela já usa `overflow-x-auto` (correto), mas todas as colunas têm o mesmo peso — em mobile o aluno rola horizontalmente por 11 colunas para achar uma sessão.
**Impacto:** dificulta a varredura rápida, justo na tela cujo único propósito é localizar um registro.
**Decisão:** fixar 4 colunas prioritárias sempre visíveis (Data, Distribuição, Resultado, Ação); Curso, Pacote, Modo, Questões, Tempo, Status seguem disponíveis por rolagem, sem remover nenhuma.

**Achado 03 — Filtro e ação de "limpar" distantes do resultado**
Card "Filtros" e card "Sessões" são dois blocos separados por `space-y-6`; "Limpar filtros" fica no topo, longe da tabela que ele afeta.
**Impacto:** pequena fricção ao reconhecer o efeito do filtro aplicado.
**Decisão:** aproximar visualmente Filtros + Lista em um único agrupamento (mesmo `Card`, sem fusão de componentes).

**Achado 04 — Sidebar sem item "Histórico"** (`UXB-C1`, pré-requisito externo a esta tela)
Não é um problema desta página — é a navegação até ela. Mantido como está; citado aqui só para registrar que o redesign da tela não substitui essa correção.
**Decisão:** nenhuma ação neste documento; segue rastreado em `UXB-C1`.

**O que já está correto:** `overflow-x-auto` já presente, paginação e busca com debounce já no padrão, dropdown de ações já com rótulo acessível (`sr-only`). Nenhuma mudança necessária nesses pontos.

---

## 2. Nova hierarquia

1. Cabeçalho + "Voltar ao Dashboard" (inalterado)
2. Resumo (4 stats) — mesmo dado, card mais compacto/discreto
3. Filtros + Lista agrupados (mesma região visual)
4. Paginação (inalterado)

---

## 3. Wireframe ASCII

### Desktop
```
┌──────────────────────────────────────────────────────────────┐
│ Histórico de sessões                    [Voltar ao Dashboard] │
├──────────────────────────────────────────────────────────────┤
│ Sessões: 24  ·  Questões: 310  ·  Aprov.: 71%  ·  9h42        │ ← resumo compacto, 1 linha
├──────────────────────────────────────────────────────────────┤
│ Filtros: [Curso ▾][Distrib. ▾][Modo ▾][Período ▾][Status ▾]   │
│ 🔎 Buscar...                                  [Limpar filtros]│
│ ─────────────────────────────────────────────────────────────│
│ Data      Distribuição   Resultado    Status     Ação         │ ← prioritárias
│ 06/07     PF-Direito     9/12 (75%)   Finalizada [ ⋯ ]         │
│ 05/07     PF-Português   —            Em andam.  [ ⋯ ]         │
│ (Curso · Pacote · Modo · Questões · Tempo disponíveis via     │
│  rolagem horizontal, sem remoção)                              │
│ Página 1 de 3                                                  │
└──────────────────────────────────────────────────────────────┘
```

### Tablet
```
┌────────────────────────────────────┐
│ Histórico de sessões                 │
│ [Voltar ao Dashboard]                 │
├────────────────────────────────────┤
│ 24 sessões · 310 questões · 71%      │
├────────────────────────────────────┤
│ [Curso▾][Distrib.▾]                    │
│ [Modo▾][Período▾][Status▾]            │
│ 🔎 Buscar...       [Limpar filtros]   │
│ ── (tabela, rolagem horizontal) ──   │
│ Data  Distrib.  Resultado  Status  ⋯  │
│ Página 1 de 3                          │
└────────────────────────────────────┘
```

### Mobile
```
┌───────────────────────────┐
│ Histórico de sessões        │
│ [Voltar ao Dashboard]        │
├───────────────────────────┤
│ 24 sessões · 71% aprov.     │  ← resumo reduzido a 1–2 linhas
├───────────────────────────┤
│ [Filtros ▾]                  │  ← mesmo conteúdo, ainda mais compacto
│ 🔎 Buscar...                  │
├───────────────────────────┤
│ Data 06/07 · PF-Direito      │
│ 9/12 (75%) · Finalizada [⋯] │
│ (demais colunas por rolagem) │
├───────────────────────────┤
│ Página 1 de 3                │
└───────────────────────────┘
```

---

## 4. Fluxo de navegação

Sem mudança — mesmos destinos já existentes: linha → dropdown ("Ver resultado"/"Continuar sessão" → `/app/study/$sessionId`; "Refazer apenas erradas"/"Nova sessão" → cria sessão → `/app/study/$sessionId`). "Voltar ao Dashboard" → `/app`.

---

## 5. Checklist para implementação

- [ ] Reduzir `HistorySummaryStats` a uma faixa compacta (mesmos 4 dados, menor destaque)
- [ ] Reagrupar visualmente Card "Filtros" + Card "Sessões" em um único bloco
- [ ] Definir Data / Distribuição / Resultado / Status / Ação como colunas sempre visíveis; demais mantidas via `overflow-x-auto`
- [ ] Validar em `sm`/`md`/`lg`/`xl`

---

## 6. Componentes reutilizados (sem alteração)

`HistorySummaryStats`, `Table`/`TableHeader`/`TableRow`/`TableCell`, `Badge`, `DropdownMenu`, `Select`/`Input` (filtros), paginação, `EmptyState`, `PageErrorState`.

## 7. Componentes com ajuste visual apenas

- **`HistorySummaryStats`** — variante compacta (menor `p-5`→menor, mesma estrutura)
- **`StudyHistoryPage.tsx`** — reagrupamento de blocos e priorização de colunas na tabela (sem novas colunas, sem remoção)

---

*RC1.2K — aguardando aprovação antes de qualquer implementação.*
