# RC2 — Roadmap de Execução do Portal Administrativo

**Base:** `ADMIN_UX_AUDIT_RC2.1A.md` (32 achados), `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_SYSTEM.md`.
**Natureza:** plano de execução. Sem solução detalhada, sem Product Design, sem código.

---

# Fase 1 — Dashboard Admin

**Objetivo:** aplicar ao Dashboard Admin o mesmo tratamento de hierarquia/ação já aprovado para o Dashboard do Aluno (`RC1.2H`), adaptado às métricas administrativas.
**Componentes reutilizáveis:** padrão de stat-card clicável definido em `RC1.2H`; tokens de hover/borda de `DESIGN_SYSTEM.md` §6/§8.
**Risco:** decidir o destino de cada card (para onde cada métrica leva) é decisão de produto ainda em aberto — não travada nesta fase.
**Complexidade:** Baixa.

---

# Fase 2 — Importação / Histórico de Importações

**Objetivo:** unificar o estilo de card de estatística do relatório com o padrão único do produto; migrar badge de aviso para token; resolver a divergência "rolar vs. paginar"; adicionar estados de loading/erro ausentes no histórico de lotes.
**Componentes reutilizáveis:** stat-card padrão (mesmo da Fase 1/Dashboard Aluno), `Badge` com token `--warning`, `AdminTableBody`, paginação já usada em Cursos/Questões.
**Risco:** é o fluxo central da missão do Admin (`00-VISAO-GERAL.md`) e a tela com mais estados do portal — maior superfície de regressão visual.
**Complexidade:** Alta.

---

# Fase 3 — Questões

**Objetivo:** adotar `AdminTableBody`, envolver a tabela em `overflow-x-auto`, agrupar/hierarquizar o painel de 10 filtros, separar visualmente dados da questão e alternativas no diálogo de edição.
**Componentes reutilizáveis:** `AdminTableBody`, wrapper `overflow-x-auto` já padronizado, padrão de card "Filtros" de `DESIGN_SYSTEM.md`.
**Risco:** maior volume de uso diário do portal; diálogo de edição é o mais complexo do Admin (alternativas dinâmicas) — reorganizar layout sem tocar a lógica exige cuidado.
**Complexidade:** Alta.

---

# Fase 4 — Taxonomia

- Cursos
- Bancas
- Disciplinas
- Assuntos
- Cargos
- Concursos

**Objetivo:** levar Cargos, Concursos, Disciplinas e Assuntos ao mesmo padrão já usado em Cursos/Bancas (`AdminTableBody`); resolver a ausência de filtro por disciplina na listagem de Assuntos.
**Componentes reutilizáveis:** `AdminTableBody`, `TaxonomySearch`/`TaxonomyPagination` (`shared.tsx`, já existente), diálogo+`<form>` de Cursos como gabarito único para os 6.
**Risco:** os 6 módulos já compartilham a mesma estrutura — principal risco é aplicar a correção 6 vezes sem introduzir pequenas divergências entre elas (o mesmo problema que originou a auditoria).
**Complexidade:** Baixa.

---

# Fase 5 — Pacotes

**Objetivo:** adicionar `<form>` ao diálogo (Enter submete) e `aria-label` aos botões de ícone.
**Componentes reutilizáveis:** padrão de diálogo com `<form>` e de `aria-label` já usados em Cursos/Taxonomia/Questões.
**Risco:** baixo — ajustes pontuais, sem mudança estrutural.
**Complexidade:** Baixa.

---

# Fase 6 — Versões

**Objetivo:** adotar `AdminTableBody`, `overflow-x-auto`, `aria-label`; resolver a aparência de campo incompleto no dropdown de pacote do diálogo de criação.
**Componentes reutilizáveis:** mesmos padrões da Fase 4/5.
**Risco:** a correção do dropdown de pacote tem componente de consulta de dado, não só visual — pode exigir decisão de Product Design antes da implementação.
**Complexidade:** Média.

---

# Fase 7 — Distribuições

**Objetivo:** adotar `AdminTableBody`, `overflow-x-auto`, distinguir mensagem de "sem dados" de "filtro sem resultado".
**Componentes reutilizáveis:** `AdminTableBody` (já suporta essa distinção, ver uso em Cursos), `overflow-x-auto`.
**Risco:** baixo.
**Complexidade:** Baixa.

---

# Fase 8 — Assinaturas

**Objetivo:** adotar `AdminTableBody`, `overflow-x-auto`; decidir como comunicar assinaturas legadas hoje ocultas da listagem.
**Componentes reutilizáveis:** mesmos padrões das fases 4–7.
**Risco:** a visibilidade de registros legados tem componente de dado (filtro de query), não resolvido só com layout — pode exigir decisão de produto.
**Complexidade:** Baixa a Média.

---

## Ordem definitiva de implementação

1. Dashboard Admin
2. Importação / Histórico de Importações
3. Questões
4. Taxonomia (Cursos, Bancas, Disciplinas, Assuntos, Cargos, Concursos)
5. Pacotes
6. Versões
7. Distribuições
8. Assinaturas

Critério: maior impacto/menor esforço primeiro (Fase 1), fluxo mais crítico e mais divergente do padrão em seguida (Fase 2), tela de maior uso e densidade depois (Fase 3), correção replicável em lote (Fase 4), e então os quatro módulos "pipeline" restantes, do mais simples ao que carrega decisão de dado pendente (Fases 5–8).

## Estimativa de reaproveitamento entre módulos

| Fase | Reaproveitamento estimado | Origem |
|---|---|---|
| 1 — Dashboard | ~80% | Padrão já aprovado no Dashboard do Aluno (`RC1.2H`) |
| 2 — Importação | ~45% | Componentes existentes (stat-card, `AdminTableBody`, `Badge`); resto é estrutural, específico da tela |
| 3 — Questões | ~50% | `AdminTableBody` e `overflow-x-auto` já usados em outros módulos; hierarquia de filtros e diálogo são trabalho próprio |
| 4 — Taxonomia | ~95% | Mesma correção (`AdminTableBody`) replicada 6 vezes a partir do gabarito Cursos/Bancas |
| 5 — Pacotes | ~90% | Ajustes pontuais usando padrões já existentes em Cursos/Taxonomia |
| 6 — Versões | ~70% | Mesmos padrões de 4/5; parte do dropdown exige investigação própria |
| 7 — Distribuições | ~90% | Mesmo padrão de 4/5, sem particularidade adicional |
| 8 — Assinaturas | ~80% | Mesmo padrão de 4/5; parte da visibilidade de dado legado exige decisão própria |

## Módulos que devem compartilhar os mesmos componentes

- **Todos os 14 módulos:** `AdminTableBody`, wrapper `overflow-x-auto`, `aria-label` em botão de ícone.
- **Cursos, Bancas, Cargos, Concursos, Disciplinas, Assuntos:** `TaxonomySearch`/`TaxonomyPagination` e o mesmo diálogo+`<form>` — nenhuma variação de estrutura entre os 6.
- **Pacotes, Versões, Distribuições, Assinaturas:** mesma composição "card de filtros + tabela + paginação" — devem convergir para uma única implementação de referência, não quatro parecidas.
- **Dashboard Admin e Dashboard do Aluno:** mesmo stat-card clicável.
- **Importação:** deve abandonar seu estilo de card próprio e adotar o mesmo stat-card do Dashboard.

---

*RC2 — Roadmap de execução. Sem código, sem Product Design detalhado.*
