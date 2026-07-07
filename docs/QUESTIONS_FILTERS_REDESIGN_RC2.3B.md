# RC2.3B — Redesign de Busca e Filtros da Lista de Questões

**Base:** `QUESTIONS_MODULE_PLAN_RC2.3.md` (submódulo 2), `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_SYSTEM.md`.
**Escopo:** card de busca/filtros de `QuestionsPage.tsx` (`TaxonomySearch` + 8 campos). Lógica de filtro, debounce, queries e permissões não tocados.

---

**Achado 01 — Nenhum indicador de filtros ativos nem botão "Limpar filtros"** *(decisão ajustada no Design Review — ver nota)*
**Impacto:** com 8 campos + busca, resetar exige tocar em cada controle individualmente; outras telas do produto (ex.: Histórico do Aluno) já resolvem isso.
**Decisão:** não implementar nesta fase. Embora o padrão já exista em outra tela, introduzir aqui uma ação nova (reset em lote) que hoje não existe neste componente é uma capacidade de UI nova para este módulo, fora do que esta fase autoriza ("não criar funcionalidades novas"). Registrado como pendência para uma fase que autorize essa adição.

**Achado 02 — Card de filtros usa `rounded-xl`, tabela ao lado usa `rounded-lg`**
**Impacto:** dois radius diferentes na mesma tela, contrariando o padrão único (`DESIGN_SYSTEM.md` §5).
**Decisão:** `rounded-lg`.

**Achado 03 — Padding do card é `p-4`; a régua do produto define `p-6` para card de conteúdo/formulário/listagem**
**Impacto:** densidade maior que o padrão do produto para este tipo de card (`DESIGN_SYSTEM.md` §7).
**Decisão:** `p-6`.

**Achado 04 — Card de filtros não tem título de seção**
Diferente do padrão já usado em outras telas (ex.: "Filtros" como `CardTitle` no Histórico do Aluno).
**Impacto:** a seção não se anuncia visualmente antes do conteúdo.
**Decisão:** adicionar rótulo de seção ("Filtros"), mesmo tratamento tipográfico já usado em outros pontos — sem alterar campo ou lógica.

**Achado 05 — Em `md:grid-cols-3`, o par Banca/Concurso fica dividido entre duas linhas**
Os pares de dependência (Curso/Cargo, Banca/Concurso, Disciplina/Assunto) já estão na ordem certa no código; o problema é só o breakpoint de 3 colunas quebrando um dos pares.
**Impacto:** em tablet, a relação Banca→Concurso fica menos clara que em desktop (`lg:grid-cols-4`, onde os pares já ficam intactos).
**Decisão:** `md:grid-cols-2 lg:grid-cols-4` — múltiplo de 2 preserva os três pares em qualquer breakpoint, mesmos 8 campos, mesma ordem.

**Achado 06 — Busca (`TaxonomySearch`) já é componente compartilhado, com debounce próprio**
**Impacto:** nenhum.
**Decisão:** manter — debounce e lógica não tocados.

**Achado 07 — Empilhamento em mobile já correto**
Grid já cai para 1 coluna na largura base.
**Impacto:** nenhum.
**Decisão:** manter.

---

## Execução do Design Review

Checklist aplicado antes do fechamento. Um ponto foi revisado:

- **Achado 01** — a decisão original ("adicionar botão Limpar filtros") foi identificada como introdução de uma ação nova neste componente, violando "não cria funcionalidades novas" apesar de o padrão já existir em outra tela do produto. Revertida para registro de pendência, sem implementação nesta fase.

Demais achados (02–07) não violam nenhum bloco do checklist — todos são radius, padding, rótulo de seção e breakpoint, sem tocar lógica de filtro, query ou permissão.

---

## Aprovação

**Busca e Filtros da Lista de Questões aprovado para implementação**, com o achado 01 registrado como pendência fora desta fase.
