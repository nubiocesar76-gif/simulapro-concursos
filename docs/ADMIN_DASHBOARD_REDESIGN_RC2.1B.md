# RC2.1B — Redesign do Dashboard Administrativo

**Base:** `ADMIN_UX_AUDIT_RC2.1A.md`, `ADMIN_PRODUCT_ROADMAP_RC2.md` (Fase 1), `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_SYSTEM.md`.
**Escopo:** `src/routes/_authenticated/admin/index.tsx` (`AdminDashboard`, `CountCard`, `StatCard`). Nenhuma query, permissão, regra de negócio ou métrica alterada — os mesmos 10 números continuam existindo.

---

**Achado 01 — 10 blocos com o mesmo peso, nenhum clicável** (`UXB-A6`)
**Impacto:** primeira tela do portal não aponta próximo passo.
**Decisão:** cada bloco vira link para o módulo correspondente, reaproveitando rotas já existentes — nenhuma rota nova:

| Bloco | Destino |
|---|---|
| Cursos | `/admin/courses` |
| Pacotes | `/admin/packages` |
| Versões | `/admin/versions` |
| Questões cadastradas | `/admin/questions` |
| Usuários | `/admin/users` |
| Assinaturas (ativas) | `/admin/subscriptions` |
| Questões publicadas | `/admin/versions` |
| Questões em revisão | `/admin/import` |
| Última importação | `/admin/import` |
| Última publicação | `/admin/versions` |

**Achado 02 — Nenhuma distinção entre métrica de conteúdo, de pipeline e de gestão**
**Impacto:** Admin não escaneia rapidamente "o que precisa de atenção" vs. "contagem de referência".
**Decisão:** reorganizar os 10 blocos em 3 grupos visuais, mesmos dados: **Conteúdo** (Cursos, Pacotes, Versões, Questões cadastradas), **Pipeline** (Questões publicadas, Questões em revisão, Última importação, Última publicação), **Gestão** (Usuários, Assinaturas ativas).

**Achado 03 — Sinais de pendência (Em revisão, Última importação) têm o mesmo peso que contagens estáveis (Cursos)**
**Impacto:** o número que mais merece atenção não se destaca de um número que quase nunca muda.
**Decisão:** dentro do grupo Pipeline, aplicar destaque de borda (mesmo tom de `--primary`/`--warning` já usado em atalhos do Aluno) quando o valor for maior que zero — sem cor nova além dos tokens existentes.

**Achado 04 — Ausência total de skeleton; loading indicado só por "…" dentro do valor**
**Impacto:** sensação de travamento a cada carregamento, inconsistente com o resto do produto (Aluno, Cursos, Bancas, Pacotes, Usuários já usam `Skeleton`).
**Decisão:** aplicar `Skeleton` (mesmo formato do card) nos 10 blocos enquanto carregam — reaproveita componente já existente.

**Achado 05 — Queries secundárias (Publicadas, Em revisão, Última importação, Última publicação) tratam falha como zero/traço** (`RC1_AUDIT.md` A11)
**Impacto:** Admin pode interpretar uma falha de rede como "não há nada pendente".
**Decisão:** os 4 blocos passam a exibir estado de erro visível (mesmo ícone/tom de `PageErrorState`) quando a consulta falha, em vez de "0"/"—" — sem alterar a query, só a leitura do estado de erro que ela já retorna.

**Achado 06 — `CountCard` pode renderizar literalmente a palavra "undefined" em caso de falha**
**Impacto:** pior caso do achado 05 — bug visível na primeira tela do portal.
**Decisão:** mesmo tratamento do achado 05.

**Achado 07 — Responsividade atual não acompanha o agrupamento proposto (achado 02)**
**Impacto:** ao agrupar os blocos, a grade responsiva herdada pode voltar a misturar os grupos em telas menores.
**Decisão:** cada grupo tem sua própria grade interna, usando só os breakpoints já oficiais (`DESIGN_SYSTEM.md` §10.1) — sem breakpoint novo.

**Achado 08 — Estado vazio: não aplicável**
**Impacto:** nenhum — item de verificação fechado.
**Decisão:** manter exibição numérica direta (incluindo "0") como o próprio estado vazio deste tipo de tela; nenhum `EmptyState` a introduzir aqui.

**Achado 09 — Tabelas: não aplicável**
**Impacto:** nenhum — o Dashboard Admin não contém tabela hoje.
**Decisão:** nenhuma tabela criada; item fechado sem alteração, para não introduzir funcionalidade nova (ex.: lista de atividade recente).

**Achado 10 — Valor do card é `text-xl` no Admin, mas `text-2xl` no Aluno, para o mesmo componente conceitual; sem `tracking-tight`/`tabular-nums`**
**Impacto:** mesma informação com tamanho diferente entre portais, contrariando "mesmos padrões em Admin e Aluno" (`DESIGN_PRINCIPLES.md` §5).
**Decisão:** alinhar para `text-2xl`, igual ao Aluno; aplicar `tracking-tight`/`tabular-nums` (`UI_PREMIUM_GUIDELINES_RC2.0.md` Decisões 01/02).

---

## Aprovação

Nenhum achado exige nova query, permissão ou regra de negócio — todos são leitura/apresentação de dado já retornado. O único ponto que exigia decisão de produto (destino de cada card, sinalizado como risco na Fase 1 do roadmap) foi resolvido no achado 01.

**Dashboard Admin aprovado para implementação.**
