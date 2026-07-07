# RC2.2A — Redesign do Módulo de Importação

**Base:** `ADMIN_UX_AUDIT_RC2.1A.md`, `ADMIN_PRODUCT_ROADMAP_RC2.md` (Fase 2), `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_SYSTEM.md`.
**Escopo:** `src/components/admin/import/ImportPage.tsx` (`ImportPage`, `ImportReportSection`, `PreviewSection`, `BatchReportDialog`, `Stat`). Nenhuma regra de negócio, parser, banco ou fluxo de importação alterado.

---

**Achado 01 — Wizard é só textual, numerado em labels/botões espalhados por duas regiões diferentes da tela**
"1. Curso" a "7. Salvar lote" ficam no card de validação; "8. Aplicar" é um botão dentro da linha da tabela de histórico, numa seção separada da página.
**Impacto:** não existe indicador estrutural de progresso no fluxo mais crítico do Admin — a numeração textual sugere uma sequência única que na prática está partida em dois lugares.
**Decisão:** indicador de etapas estrutural cobrindo as etapas 1–7, composto com o mesmo primitivo `Progress` (`src/components/ui/progress.tsx`, já usado pelo Portal do Aluno) + texto "Etapa X de Y" — reaproveita o primitivo genérico, não o componente `SessionProgress` do Aluno em si, para não acoplar Admin a um componente de outro portal. "Aplicar" deixa de ser numerado como parte da mesma sequência — pertence a um momento distinto (revisão de um lote já salvo).

**Achado 02 — Nenhuma divulgação progressiva: seleção, arquivo, botões, relatório e preview sempre no mesmo card**
**Impacto:** o card cresce bastante assim que o relatório aparece, misturando etapa de entrada com etapa de revisão de dado.
**Decisão:** blocos visualmente distintos por etapa, com `space-y-8` entre eles (`UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 04); Relatório/Preview só aparecem depois de existir um `report`, como já ocorre hoje — muda só o agrupamento visual.

**Achado 03 — Card principal usa `max-w-4xl`, fora das duas larguras oficiais**
**Impacto:** mistura um fluxo de tarefa curto com uma tabela de dados na mesma largura, sem seguir nenhuma das duas categorias de `DESIGN_SYSTEM.md` §4.2.
**Decisão:** enquadrar como "dados/painel" (sem `max-w`) — a maior parte do conteúdo (relatório, preview, histórico) é tabular.

**Achado 04 — Componente `Stat` local é um quarto estilo de card de estatística no produto**
`rounded-lg border bg-background p-3`, sem tile de ícone, valor `text-xl` — distinto do padrão único (`rounded-xl`/`bg-card`/`p-5`/`text-2xl`) usado em Dashboard, Aluno e Histórico.
**Impacto:** mesma informação com quarta aparência diferente no produto.
**Decisão:** migrar para o card de estatística padrão, com `tracking-tight`/`tabular-nums` (`RC2.0` Decisões 01/02).

**Achado 05 — O mesmo `Stat` é usado de forma diferente dentro da própria tela**
Com ícone e 6 colunas no relatório de validação; sem ícone e 5 colunas (sem "Tempo") no diálogo de lote salvo.
**Impacto:** inconsistência interna ao próprio módulo, não só entre módulos.
**Decisão:** mesma composição (ícone + colunas) nas duas ocorrências.

**Achado 06 — Bloco "Detalhes (erros, duplicatas, avisos)" usa rolagem vertical fixa (`max-h-80 overflow-auto`)** *(revisado — decisão original revertida)*
**Impacto:** nenhum. Reavaliação: este bloco é um relatório de leitura única (revisar tudo que está errado num arquivo recém-validado para decidir corrigir e reenviar), não uma lista persistente e revisitável como Questões ou Histórico — paginar fragmentaria essa varredura contínua em cliques extras, contra "rapidez" (`DESIGN_PRINCIPLES.md` §3), sem ganho real de UX. Rolagem interna com altura máxima é um padrão comum e justificado para painéis de revisão de erro (ex.: log de validação), diferente das listas primárias do produto.
**Decisão:** manter rolagem interna. Nenhuma mudança de componente neste ponto.

**Achado 07 — Badge "Aviso" com cor hardcoded, duplicada em dois lugares**
`bg-amber-500/15 text-amber-700`, idêntico em `ImportReportSection` e `BatchReportDialog`.
**Impacto:** mesma classe de achado já fechada em outras telas (`UXB-C2`), ainda aberta aqui, e em dobro.
**Decisão:** migrar para o token `--warning` (`RC2.0` Decisão 22) nas duas ocorrências.

**Achado 08 — Lógica de erros/duplicatas/avisos duplicada entre `ImportReportSection` e `BatchReportDialog`**
**Impacto:** os achados 05 e 07 já são consequência dessa duplicação — qualquer ajuste futuro tende a divergir entre as duas cópias.
**Decisão:** mesma composição reaproveitada nos dois lugares, sem criar componente novo — eliminar a segunda implementação paralela.

**Achado 09 — Confirmação de aplicação usa `AlertDialog` com uma tabela de preview embutida** *(revisado — decisão original revertida)*
**Impacto:** nenhum. Reavaliação: `AlertDialog` não fecha por clique fora/Esc por padrão (diferente de `Dialog`), o que protege melhor uma ação que insere dados permanentemente no banco — é exatamente o comportamento desejado para essa etapa, não um desalinhamento. Embutir a tabela de preview via `AlertDialogDescription asChild` é um uso válido do componente, sem violar nenhuma regra de `DESIGN_SYSTEM.md`. Migrar para `Dialog` tornaria esta a **única** confirmação do Admin fora do padrão já usado em toda exclusão e na publicação de versões — trocaria uma consistência real por uma preferência estética sem defeito concreto por trás.
**Decisão:** manter `AlertDialog`. Nenhuma mudança de componente neste ponto.

**Achado 10 — Histórico de importações: 11 colunas sem `overflow-x-auto`** (`UXB-A5`)
**Impacto:** risco de quebra de layout em tablet/mobile.
**Decisão:** envolver a tabela em `overflow-x-auto`, padrão já usado no restante do produto.

**Achado 11 — Estado vazio do histórico é texto solto ("Nenhum lote")**
**Impacto:** inconsistente com `EmptyState` já usado em outras partes do produto.
**Decisão:** substituir por `EmptyState`.

**Achado 12 — Consulta do histórico não trata loading; durante o carregamento a tela mostra "Nenhum lote"** (`RC1_AUDIT.md` A09, causa confirmada no código)
`data` é `undefined` até resolver a consulta; o valor padrão (`= []`) faz o carregamento parecer lista vazia real.
**Impacto:** Admin pode concluir "não há lotes" enquanto a consulta ainda está em andamento.
**Decisão:** expor `isLoading`/`isError` já retornados pela consulta; `Skeleton` durante carregamento, `PageErrorState` em falha — `EmptyState` (achado 11) só quando de fato não há dados.

**Achado 13 — Selects em cascata (curso/pacote/versão) não tratam erro de consulta** (`RC1_AUDIT.md` B12)
**Impacto:** falha de rede vira lista vazia silenciosa, indistinguível de "não há registro cadastrado".
**Decisão:** mesmo tratamento de erro visível já definido para o Dashboard Admin (`RC2.1B` achados 05/06).

**Achado 14 — Ícones de ação da tabela de histórico usam `h-3.5 w-3.5` (14px)**
**Impacto:** abaixo do tamanho padrão oficial de ícone inline (16px, `DESIGN_SYSTEM.md` §9).
**Decisão:** padronizar para `h-4 w-4`.

**Achado 15 — Responsividade dos campos de seleção/arquivo**
**Impacto:** nenhum — já stackam corretamente em 1 coluna no mobile.
**Decisão:** nenhuma ação; item de verificação fechado.

---

## Aprovação

Todos os achados são de apresentação (agrupamento, componente, token, estado de carregamento/erro) — nenhum exige nova query, parser ou regra de negócio. O achado 09 não altera mais nenhum componente (revisado — `AlertDialog` mantido por ser o padrão já usado em toda confirmação de ação consequente no Admin).

**Módulo de Importação aprovado para implementação.**
