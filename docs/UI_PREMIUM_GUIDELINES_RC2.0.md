# RC2.0 — Guia Visual Premium do SimulaPro

**Papel:** camada de refinamento visual sobre `DESIGN_SYSTEM.md`. Não substitui tokens de cor, radius, sombra ou breakpoints já definidos ali — cada decisão abaixo pressupõe esses valores e não os repete. Referência obrigatória para toda implementação visual a partir desta data.
**Escopo:** apenas especificação visual. Nenhuma mudança de UX, regra de negócio, arquitetura ou componente de negócio.
**Inspiração:** Apple HIG, Linear, Stripe Dashboard, Notion, Arc, Raycast, Vercel — qualidade de acabamento, não layout copiado.
**Revisão:** documento auto-revisado uma vez após a primeira versão — 6 decisões corrigidas (risco de retrabalho ou conflito com `DESIGN_SYSTEM.md`) e 6 adicionadas (lacunas frente ao nível de acabamento de produtos SaaS de referência). Marcadas abaixo onde relevante.

---

## 1. Escala tipográfica

**Decisão 01 — `tracking-tight` em todo `text-2xl`+**
Justificativa: espaçamento padrão do navegador deixa títulos e números grandes com aparência solta; referências de qualidade usam tracking mais fechado nesses tamanhos.
Impacto: refina títulos de página e números-âncora (ex.: aproveitamento em `SESSION_RESULTS_REDESIGN_RC1.2J.md`) sem alterar a hierarquia já definida.

**Decisão 02 — `tabular-nums` em toda célula ou card cujo conteúdo é um número**
Justificativa: dígitos de largura fixa evitam "tremor" visual ao trocar de página ou aplicar filtro. Aplica-se apenas à célula/valor numérico, nunca à linha ou card inteiro.
Impacto: tabelas e grades de estatística ganham estabilidade visual sem mudar o dado exibido.

**Decisão 03 — Nenhum terceiro peso de fonte**
Justificativa: `DESIGN_SYSTEM.md` §3.3 já fixa `medium`/`semibold`; introduzir `bold` ou `light` fora da exceção já prevista (landing) é o tipo de deriva que motivou este guia.
Impacto: fecha a régua tipográfica sem exceção adicional.

---

## 2. Espaçamentos

**Decisão 04 — Segundo nível de ritmo vertical: `space-y-8` entre macro-seções** *(corrigida — critério explícito adicionado)*
Definição de "macro-seção": cada bloco nomeado nos wireframes já aprovados (ex.: em `SESSION_RESULTS_REDESIGN_RC1.2J.md` — Resumo, Ações, Metadados, Lista; em `DASHBOARD_REDESIGN_RC1.2H.md` — Zona 1, Zona 2). Dentro de um bloco nomeado, o espaçamento entre seus elementos permanece `space-y-6`.
Justificativa original: hoje tudo usa `space-y-6`, achatando a diferença entre "respiro dentro de uma seção" e "respiro entre seções distintas".
Impacto: critério objetivo evita que cada desenvolvedor decida por conta própria onde aplicar `space-y-8`, o que geraria inconsistência entre módulos.

**Decisão 05 — Teto de largura em telas ≥1536px (`2xl`)** *(corrigida — reformulada para não conflitar com `DESIGN_SYSTEM.md` §4.2)*
`max-w-[1600px]` centralizado (`mx-auto`), aplicado só a partir de `2xl:`. Isto **não é uma terceira categoria de largura de conteúdo** — as duas larguras de `DESIGN_SYSTEM.md` §4.2 (`max-w-2xl` ou nenhuma) continuam sendo a única escolha por tipo de tela. Este teto age só como proteção de viewport em monitores ultrawide, um nível acima da decisão de largura por tela.
Justificativa: tabelas e grids "sem `max-w`" esticados além de 1600px ficam difíceis de escanear horizontalmente.
Impacto: resolve um caso extremo não coberto, sem reabrir a discussão de larguras já fechada em RC1.2G.

**Decisão 06 — Padding do `<main>` cresce para `p-8` em `xl:`+**
Justificativa: em telas grandes, `p-6` fixo deixa o conteúdo colado à borda da viewport.
Impacto: um valor a mais, aplicado só no breakpoint `xl:` já oficial — sem novo breakpoint.

---

## 3. Cards

**Decisão 07 — Altura de cards de estatística igualada por `grid` (`items-stretch`), não por valor fixo** *(corrigida — magic number substituído por mecanismo)*
Justificativa: um `min-h` fixo em pixels (ex.: 104px) é um número adivinhado que se desalinha assim que um rótulo novo e mais longo for adicionado (ex.: "Tempo total de estudo" quebra em duas linhas onde "Acertos" não quebra) — exige retrabalho manual a cada mudança de texto. `items-stretch`, comportamento padrão de `grid`, iguala a altura de todos os cards da linha automaticamente ao maior conteúdo, sem número fixo.
Impacto: grades de estatística (Dashboard, Histórico, Resultado) ficam alinhadas mesmo se o texto de um rótulo mudar no futuro.

**Decisão 08 — Hover de card clicável muda só a borda, nunca a sombra ou a posição**
Justificativa: elevar sombra ou deslocar o card no hover é padrão de app de consumo; referências de qualidade sinalizam interatividade só por cor de borda/fundo.
Impacto: fecha uma lacuna que `DESIGN_SYSTEM.md` §6 deixava implícita — hover nunca sobe de nível de sombra.

**Decisão 09 — Card nunca combina borda de repouso com anel de foco fora de foco de teclado real**
Justificativa: card não é elemento de formulário; um "ring" decorativo fora do foco por teclado confunde com estado selecionado.
Impacto: evita falso sinal de seleção.

---

## 4. Botões

**Decisão 10 — `ghost` nunca ganha borda, nem no hover**
Justificativa: borda no hover aproxima `ghost` de `outline`, borrando a diferença de peso entre as duas variantes.
Impacto: mantém três pesos de botão claramente distintos.

**Decisão 11 — `destructive` nunca usa `size="lg"`**
Justificativa: uma ação irreversível não deveria ser o elemento mais convidativo da tela.
Impacto: fecha uma combinação hoje tecnicamente possível, mas nunca desejável.

**Decisão 12 — Botões numa mesma linha compartilham sempre a mesma altura, com ou sem ícone**
Justificativa: ícone com `mr-2`/`ml-2` já é dimensionado para `h-9`; qualquer variação é erro de implementação, não de design.
Impacto: linha de botões sempre nivelada.

---

## 5. Tabelas

**Decisão 13 — Cabeçalho de tabela em `text-xs font-medium text-muted-foreground tracking-wide`** *(corrigida — `uppercase` removido)*
Justificativa: caixa alta/tracking aberto é o detalhe mais recorrente em tabelas de referência para separar cabeçalho de conteúdo sem depender de cor — mas `uppercase` alarga palavras longas ("APROVEITAMENTO"), agravando exatamente o problema de tabelas com muitas colunas já registrado em `UXB-A5`/`RC1_AUDIT.md` M01 (Questões, Distribuições, Histórico). A distinção fica só em cor/peso/tracking, sem custo de largura.
Impacto: separa cabeçalho de conteúdo sem piorar a densidade das tabelas mais largas do produto.

**Decisão 14 — `hover:bg-muted/50` em toda linha, clicável ou não**
Justificativa: ajuda a não "perder a linha" em tabelas largas (Questões, Histórico, Resultado — todas com 6+ colunas), mesmo quando a linha não tem ação própria.
Impacto: ganho de legibilidade nas tabelas mais densas do produto, sem novo dado ou coluna.

**Decisão 15 — Densidade única de linha: `min-h-12` (mínimo, não fixo) em toda tabela** *(corrigida — de altura fixa para altura mínima)*
Justificativa: `h-12` fixo quebraria o preview de duas linhas (`line-clamp-2`) já usado no enunciado em `SESSION_RESULTS_REDESIGN_RC1.2J.md` — conteúdo maior que 48px seria cortado ou vazaria do limite. `min-h-12` garante a mesma densidade mínima sem conflitar com células de conteúdo mais alto.
Impacto: fecha a possibilidade de um módulo futuro criar densidade própria sem quebrar o único caso de conteúdo multilinha já aprovado.

**Decisão 16 — Toda tabela com mais de 6 colunas declara suas colunas prioritárias (sempre visíveis) mesmo com `overflow-x-auto`** *(nova)*
Justificativa: hoje essa regra só existe dentro do caso específico do Histórico (`STUDY_HISTORY_REDESIGN_RC1.2K.md`); generalizada aqui para qualquer tabela futura com a mesma densidade (ex.: Questões, Distribuições no Admin).
Impacto: evita que cada nova tabela larga precise "redescobrir" a mesma solução de hierarquia de coluna.

**Decisão 17 — Responsividade de tabela permanece `overflow-x-auto` sempre (`DESIGN_SYSTEM.md` §7/§10), sem exceção nova**
Justificativa: reafirmação necessária — este guia não abre uma segunda forma de tratar tabela larga.
Impacto: nenhuma mudança adicional além das decisões acima.

---

## 6. Formulários

**Decisão 18 — Label sempre acima do campo, nunca ao lado**
Justificativa: label ao lado exige alinhamento horizontal constante entre rótulo e campo, mais lento de escanear em formulários com muitos campos (Questões, Importação).
Impacto: fecha uma variação que nenhum módulo usa hoje, mas que poderia surgir em telas largas "para aproveitar espaço".

**Decisão 19 — Erro de campo aparece abaixo do campo, em `text-xs text-destructive`; label nunca muda de cor**
Justificativa: label deve permanecer sempre reconhecível como rótulo; o erro precisa de um lugar fixo e previsível.
Impacto: define o único formato válido de erro de campo inline no produto.

**Decisão 20 — `Input`/`Select` compartilham `h-9` e `text-sm`, sem exceção por destaque**
Justificativa: já é o padrão hoje; fechado aqui para não admitir um "campo maior" por ênfase futura.
Impacto: régua de formulário sem exceção.

**Decisão 21 — `Textarea` mantém borda/radius/fonte dos demais campos, variando só `min-h-24`**
Justificativa: cobre o único tipo de campo hoje sem tratamento explícito (ex.: explicação de questão).
Impacto: fecha a régua de formulário para o caso de texto longo.

---

## 7. Feedback visual

**Decisão 22 — Sucesso/erro/aviso/informação seguem sempre o mesmo molde: ícone (16px) + texto + fundo em tinta 5–10% do token, nunca fundo sólido**
Justificativa: já resolvido pontualmente para sucesso em `STUDY_EXPERIENCE_REDESIGN_RC1.2I.md`/`SESSION_RESULTS_REDESIGN_RC1.2J.md`; aviso e informação (`--warning`, `--accent`) ainda usam classe hardcoded (`bg-amber-500/15`) e não foram tocados nessas sprints.
Impacto: fecha o restante de `UXB-C2` — nenhum dos quatro estados usa cor literal em qualquer tela do produto.

**Decisão 23 — Os quatro estados nunca dependem só de cor: sempre ícone distinto + palavra que nomeia o estado**
Justificativa: usuários com daltonismo não distinguem verde/vermelho/âmbar só pela cor.
Impacto: generaliza para aviso/informação um padrão que já existe para sucesso/erro.

---

## 8. Estados

**Decisão 24 — Skeleton usa só `animate-pulse`; nunca efeito de brilho deslizante ("shimmer")**
Justificativa: shimmer é mais chamativo que pulsação; numa ferramenta usada por horas, o efeito mais discreto cansa menos.
Impacto: fecha uma tentação comum de "deixar o loading mais bonito" que contraria microinterações discretas.

**Decisão 25 — Nenhum atraso artificial de skeleton**
Justificativa: skeleton deve durar exatamente o tempo real da resposta — atraso artificial contraria "rapidez" (`DESIGN_PRINCIPLES.md` §3).
Impacto: proíbe uma prática comum de "polimento" que aqui seria o oposto de premium para este produto.

**Decisão 26 — Número de placeholders de skeleton reflete o número típico de itens da tela** *(nova)*
Justificativa: hoje o número de esqueletos por tela é ad hoc (4 stats, 5 linhas de histórico, 2 cards de estudo) sem regra — um número de esqueletos muito diferente da quantidade real de itens que vai aparecer causa um "salto" perceptível quando o conteúdo real chega.
Impacto: reduz o deslocamento de layout entre skeleton e conteúdo real, sem mudar a paginação existente.

**Decisão 27 — Erro sempre em tom `--destructive`, vazio sempre em `--muted-foreground` — nunca o mesmo tom para os dois**
Justificativa: já é o padrão hoje via `PageErrorState`/`EmptyState`; fechado como regra fixa também para qualquer estado construído fora desses dois componentes.
Impacto: reforça o fechamento dos Achados 01/02 de `PRODUCT_CONSISTENCY_REVIEW_RC1.2L.md`.

---

## 9. Layout

**Decisão 28 — Bloco de título e bloco de ação de um cabeçalho de página usam `items-center` entre si** *(corrigida — "linha de base" trocado por regra de alinhamento explícita)*
Justificativa: "mesma linha de base" era uma referência imprecisa; `items-center` no contêiner flex do cabeçalho é a regra concreta que qualquer desenvolvedor aplica sem interpretar.
Impacto: elimina o desalinhamento vertical sutil entre título e botão de ação (ex.: cabeçalhos de listagem no Admin, cabeçalho de `StudyHistoryPage`).

**Decisão 29 — Nenhuma seção começa com divisor (`<hr>`/`border-t`); separação é só espaço**
Justificativa: divisor é substituto "barato" de hierarquia de espaço — se o espaçamento (§2) já comunica separação, uma linha adicional é redundante e mais pesada.
Impacto: fecha uma tentação comum ao portar padrões de outros produtos.

**Decisão 30 — Truncamento de texto: `truncate` (uma linha) é o padrão em toda célula/label; `line-clamp-2` é exclusivo do preview de enunciado de questão** *(nova)*
Justificativa: o produto já usa os dois padrões (`truncate` em nomes/slugs, `line-clamp-2` no enunciado de `SESSION_RESULTS_REDESIGN_RC1.2J.md`) sem uma regra que diga quando usar qual — risco de um desenvolvedor aplicar `line-clamp-2` a uma célula de tabela comum, quebrando a Decisão 16 (densidade de coluna).
Impacto: fecha a única exceção válida de texto em duas linhas, mantendo todo o resto do produto em uma linha.

---

## 10. Microinterações

**Decisão 31 — Toda transição usa `transition-colors`; nunca `transition-all`**
Justificativa: `transition-all` anima propriedades que não deveriam mudar (sombra, transform) sempre que qualquer classe muda, criando microinterações não desenhadas.
Impacto: estende o padrão já correto de `Button.tsx` para todo elemento interativo do produto (cards clicáveis, linhas de tabela, itens de menu).

**Decisão 32 — Foco por teclado mantém sempre a mesma aparência do anel, esteja o cursor em hover ou não** *(corrigida — regra tornada verificável)*
Justificativa: a versão anterior ("hover e focus nunca se somam") não era testável objetivamente. A regra concreta é: o estilo de `focus-visible:ring` nunca muda de espessura, cor ou opacidade dependendo de o mouse estar sobre o elemento ao mesmo tempo.
Impacto: evita um segundo nível de ênfase acidental quando os dois estados coincidem.

**Decisão 33 — Navegação entre rotas não tem transição de entrada nem saída** *(nova)*
Justificativa: `DESIGN_SYSTEM.md` §11 cobre microinterações de componente, mas não a troca de página em si; um fade ou slide de rota, mesmo curto, é o tipo de efeito que produtos de referência (Linear, Vercel) evitam para não atrasar a percepção de velocidade.
Impacto: o conteúdo da nova rota aparece imediatamente, sem transição — reforça "rapidez" (`DESIGN_PRINCIPLES.md` §3) no nível de navegação, não só de componente.

**Decisão 34 — Formatação de número e duração sempre reaproveita a função já existente da tela de origem, nunca reimplementada** *(nova)*
Justificativa: `formatStudyDuration`, percentuais e contagens já têm implementação única no código; qualquer tela nova que "reformate" o mesmo tipo de dado com lógica própria corre o risco de exibir o mesmo conceito com precisão ou formato diferente entre telas (ex.: "18min 40s" numa tela e "18:40" em outra).
Impacto: garante que o mesmo dado pareça exatamente igual em qualquer lugar do produto onde aparecer.

**Decisão 35 — Nenhuma decisão deste guia introduz uma constante nova sem justificativa rastreável a um problema real já registrado**
Justificativa: registrado por disciplina do próprio processo de revisão — evita que uma futura atualização deste documento adicione "polimento" sem motivo verificável, repetindo o problema que motivou `UX_AUDIT_RC1.2D.md` originalmente.
Impacto: qualquer decisão futura adicionada aqui deve citar o achado, backlog ou comparação de produto que a justifica — como todas as 34 acima já fazem.

---

*RC2.0 — Guia Visual Premium. Referência obrigatória junto com `DESIGN_SYSTEM.md` para toda implementação visual futura.*
