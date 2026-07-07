# RC2.3C — Redesign do Formulário de Criação/Edição de Questões

**Base:** `QUESTIONS_MODULE_PLAN_RC2.3.md` (submódulo 3), `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_SYSTEM.md`.
**Escopo:** conteúdo do `Dialog` de criação/edição em `QuestionsPage.tsx`. Validações, parser, alternativas, gabarito, queries e permissões não tocados.

---

**Achado 01 — Nenhum agrupamento visual por seção**
O formulário tem 6 grupos conceituais (Enunciado; Alternativas; Gabarito/Ano/Dificuldade; Taxonomia — 5 campos; Explicação; Metadados — legal/bibliografia/imagem), todos separados pelo mesmo `space-y-4`, sem diferenciação.
**Impacto:** o maior formulário do Admin não comunica onde uma seção termina e a próxima começa.
**Decisão:** `space-y-8` entre os 6 blocos (macro-seção, `UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 04) e um rótulo por bloco, mesma tipografia de título de seção já definida — sem alterar campo, ordem de submit ou validação.

**Achado 02 — Só "Alternativas" tem cabeçalho de seção (Label + botão "Adicionar")**
As outras 5 seções não têm nada equivalente.
**Impacto:** inconsistência interna do próprio formulário — a seção mais bem estruturada não foi generalizada às demais.
**Decisão:** aplicar o mesmo padrão de rótulo de seção às demais 5, reaproveitando o estilo já usado em Alternativas.

**Achado 03 — Cargo (`sm:col-span-2`) quebra o ritmo da grade de taxonomia**
Disciplina/Assunto e Banca/Concurso formam pares de 2 colunas; Cargo, sozinho, ocupa a linha seguinte em largura dupla.
**Impacto:** a última linha do grupo de taxonomia foge do padrão estabelecido pelas duas anteriores.
**Decisão:** mover Cargo para o início do grupo de taxonomia (antes dos dois pares), mantendo `sm:col-span-2` — mesma opção, só primeira posição em vez de última.

**Achado 04 — Cargo lista todas as posições de todos os cursos, sem filtro por curso**
Diferente do comportamento em cascata já usado no painel de Filtros da listagem (`RC2.3B`).
**Impacto:** lista potencialmente longa e sem contexto ao criar/editar uma questão.
**Decisão:** corrigir exigiria adicionar um seletor de curso e alterar a consulta de `formPositions` — fora do escopo autorizado ("não altera queries"). Registrado como pendência, sem correção nesta frente.

**Achado 05 — Botão de remover alternativa sem `aria-label`**
Diferente dos botões de ação da tabela (`Editar questão`/`Excluir questão`, que já têm), o botão de ícone dentro do formulário não tem.
**Impacto:** mesma classe de gap já registrada em `UXB-M1`, agora numa nova localização.
**Decisão:** adicionar `aria-label` (ex.: "Remover alternativa {letra}").

**Achado 06 — Alturas de `Textarea` diferentes entre Explicação (`rows=3`) e Bibliografia (`rows=2`)** *(revisado no Design Review — ver nota)*
**Impacto:** nenhum. Reavaliação: a diferença provavelmente reflete o tamanho real esperado de cada conteúdo (explicação tende a ser mais longa que uma citação bibliográfica) — igualar as alturas não tem ganho de UX demonstrado e poderia deixar um campo artificialmente grande ou o outro raso demais.
**Decisão:** manter as alturas atuais. Nenhuma mudança.

**Achado 07 — Estados de erro do formulário existem só via toast; não há erro inline por campo** *(revisado no Design Review — ver nota)*
**Impacto:** nenhum nesta fase. `UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 19 já define o padrão de erro inline (abaixo do campo, `text-xs text-destructive`) para quando ele existir — mas hoje o formulário não computa erro por campo, só validação nativa do HTML e erro de negócio via toast. Implementar erro inline exigiria criar estado de validação por campo que não existe hoje, o que é mudança de lógica, não só de apresentação — contraria "não altera validações".
**Decisão:** manter o padrão atual (validação nativa do HTML + toast). Nenhuma mudança nesta fase.

**Achado 08 — Loading do envio (`"Salvando..."`) já correto**
**Impacto:** nenhum.
**Decisão:** manter.

**Achado 09 — Largura do diálogo (`max-w-3xl`) já justificada**
`DESIGN_SYSTEM.md` §7 já prevê exceção de largura para "edição de questão com alternativas" especificamente.
**Impacto:** nenhum.
**Decisão:** manter.

**Achado 10 — Hierarquia dos botões do rodapé (Cancelar outline / Salvar primário) já correta**
**Impacto:** nenhum.
**Decisão:** manter.

---

## Execução do Design Review

Checklist aplicado antes do fechamento. Dois pontos foram revisados:

- **Achado 06** — decisão original ("igualar altura de Explicação e Bibliografia") não tinha ganho de UX demonstrado; revertida para manter o estado atual.
- **Achado 07** — decisão original ("adicionar erro inline por campo") exigiria criar estado de validação novo, violando "não altera validações"; revertida para manter o padrão atual (nativo + toast).

Achados 01, 02, 03, 05, 08, 09, 10 não violam nenhum bloco do checklist — nenhum altera parser, alternativas, gabarito, query ou permissão. Achado 04 já nasceu registrado como pendência, sem decisão a reverter.

---

## Aprovação

**Formulário de Criação/Edição de Questões aprovado para implementação**, com o achado 04 registrado como pendência fora desta fase.
