# RC2.3 — Plano de Redesign do Módulo Questões

**Base:** `ADMIN_UX_AUDIT_RC2.1A.md`, `ADMIN_PRODUCT_ROADMAP_RC2.md` (Fase 3), `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_REVIEW_CHECKLIST.md`.
**Natureza:** planejamento. Sem solução detalhada, sem código. Verificado contra `src/components/admin/questions/QuestionsPage.tsx` antes de escrever este plano.

---

## 1. Lista de Questões

**Objetivo:** aplicar `overflow-x-auto` à tabela (8 colunas: Enunciado, Disciplina, Assunto, Banca, Ano, Dificuldade, Criado em, Ações); alinhar cabeçalho/hover/radius ao padrão único do produto.
**Complexidade:** Baixa — estrutura de dado e paginação já corretas, mudança é só de apresentação.
**Dependências:** nenhuma de outro submódulo.
**Componentes reutilizáveis:** `TaxonomyPagination` (já em uso), wrapper `overflow-x-auto`, tratamento de cabeçalho de `UI_PREMIUM_GUIDELINES_RC2.0.md`.
**Ordem recomendada:** 1º — é a fundação visual da tela.

---

## 2. Busca e Filtros

**Objetivo:** revisar a hierarquia dos 8 campos de filtro hoje com o mesmo peso (Curso, Cargo, Banca, Concurso, Disciplina, Assunto, Ano, Dificuldade), preservando as três relações em cascata já existentes (Cargo depende de Curso; Concurso depende de Banca; Assunto depende de Disciplina).
**Complexidade:** Média — a reorganização visual precisa manter visíveis essas dependências entre campos sem alterar o comportamento.
**Dependências:** nenhuma do submódulo 1; compartilha a mesma fonte de opções de taxonomia usada no submódulo 3 (consultas já separadas no código, sem acoplamento a resolver).
**Componentes reutilizáveis:** `TaxonomySearch`, `Select`, card "Filtros" já usado em outros módulos do Admin.
**Ordem recomendada:** 2º.

---

## 3. Criação/Edição

**Objetivo:** revisar a hierarquia do maior formulário do Admin (enunciado, alternativas dinâmicas, gabarito, ano, dificuldade, 5 campos de taxonomia, explicação, referência legal, bibliografia, imagem) dentro do diálogo com rolagem interna já existente.
**Complexidade:** Alta — maior formulário do portal.
**Dependências:** nenhuma dos submódulos 1/2. **Risco a documentar, não a resolver nesta frente:** a lista de alternativas não reindexa letras nem revalida o gabarito ao remover um item do meio (`RC1_AUDIT.md` M07) — é uma regra de negócio, fora do escopo de um redesign visual; deve ser registrado como pendência para uma fase que autorize mudança de lógica.
**Componentes reutilizáveis:** `Dialog`, `Textarea`, `Select`, `Input` — já usa `<form onSubmit>` corretamente (diferente de Pacotes).
**Ordem recomendada:** 4º — depois de Lista e Filtros estarem estabilizados, por ser o submódulo de maior complexidade e risco.

---

## 4. Visualização (Preview)

**Objetivo:** não existe hoje como funcionalidade própria — o diálogo de edição é também a única forma de ver uma questão por completo. Este plano não introduz um modo de visualização novo.
**Complexidade:** não aplicável.
**Dependências:** nenhuma.
**Componentes reutilizáveis:** nenhum — item fechado sem ação.
**Ordem recomendada:** fora da sequência de implementação desta fase.

---

## 5. Ações em lote

**Objetivo:** não existem hoje (sem seleção múltipla, sem barra de ação em lote). Mesmo tratamento do submódulo 4.
**Complexidade:** não aplicável.
**Dependências:** nenhuma.
**Componentes reutilizáveis:** nenhum — item fechado sem ação.
**Ordem recomendada:** fora da sequência de implementação desta fase.

---

## 6. Estados (loading, vazio, erro)

**Objetivo:** já diferenciam "sem cadastro" de "filtro sem resultado" — melhor que a maioria dos módulos do Admin. Objetivo é só alinhar aparência ao padrão visual único, sem alterar a lógica já correta.
**Complexidade:** Baixa.
**Dependências:** acompanha diretamente o submódulo 1 (mesma tabela).
**Componentes reutilizáveis:** `AdminTableBody` (se adotado) ou manutenção do padrão próprio já equivalente, só com ajuste de classe.
**Ordem recomendada:** junto do submódulo 1.

---

## Execução do Design Review

Checklist aplicado antes do fechamento — dois pontos de atenção verificados e confirmados sem violação, sem necessidade de revisão:

- **Tentação evitada:** descrever um plano de implementação para "Visualização (Preview)" e "Ações em lote" mesmo sem essas funcionalidades existirem hoje — violaria "não cria funcionalidades fora do backlog". Os dois submódulos foram registrados como inexistentes e fechados sem plano de ação.
- **Tentação evitada:** propor a correção da reindexação de alternativas (submódulo 3) — violaria "não altera regras de negócio". Registrado como risco/pendência, não como decisão de design.

Nenhuma revisão foi necessária — as duas tentações foram identificadas e descartadas durante a redação, não depois.

---

## Ordem aprovada de implementação

1. Lista de Questões (com Estados, submódulo 6, na mesma entrega)
2. Busca e Filtros
3. Criação/Edição

Visualização (Preview) e Ações em lote não entram nesta fase — não existem hoje e não estão no backlog.
