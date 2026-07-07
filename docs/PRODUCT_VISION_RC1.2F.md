# RC1.2F — Visão de Produto & Estratégia de UX

**Projeto:** SimulaPro Core
**Data:** 2026-07-06
**Autor:** Head of Product Design (revisão assistida)
**Natureza deste documento:** Estratégico. Não contém código, wireframes ou especificação de tela.
**Lido antes de escrever:** [`DESIGN_PRINCIPLES.md`](./DESIGN_PRINCIPLES.md) · [`UX_AUDIT_RC1.2D.md`](./UX_AUDIT_RC1.2D.md) · [`PRODUCT_BACKLOG.md`](./PRODUCT_BACKLOG.md) · [`ROADMAP.md`](./ROADMAP.md) · [`CHANGELOG.md`](./CHANGELOG.md)

---

## 1. Propósito

Este documento não repete o que já foi levantado em `RC1_AUDIT.md` e `UX_AUDIT_RC1.2D.md`, nem reformula o que `ROADMAP.md` e `PRODUCT_BACKLOG.md` já planejam. Seu papel é outro: **cruzar os cinco documentos entre si** e responder a uma pergunta que nenhum deles responde sozinho — *a auditoria de UX está, de fato, virando produto, ou ficou arquivada?*

A resposta curta, sustentada na seção 3, é: **parcialmente não**. E isso muda a estratégia recomendada para RC1.2F.

---

## 2. Onde o produto está, de fato

Sem repetir números já documentados, três fatos merecem destaque por não estarem ditos explicitamente em nenhum dos cinco documentos, apenas implícitos na leitura cruzada:

1. **O MVP não tem mais dívida de escopo — tem dívida de coerência.** `PRODUCT_BACKLOG.md` mostra 52 itens concluídos contra 11 pendentes e 18 planejados. O produto já faz o que precisa fazer (`Admin produz → Aluno estuda`, ciclo completo, dois portais funcionais). O que falta majoritariamente não é *funcionalidade* — é a certeza de que a mesma funcionalidade é **a mesma experiência** em qualquer tela onde aparece. Isso muda o tipo de trabalho que RC1.2F deve priorizar: menos "construir", mais "unificar".

2. **A auditoria de UX foi concluída como documento, mas não foi absorvida como plano de trabalho.** Ver seção 3 — este é o achado central deste relatório.

3. **O roadmap já assume a sequência certa, mas o gate entre fases está sem critério verificável.** `ROADMAP.md` define: *"v1.1 → v2.0: Design system aplicado; backlog v2.0 priorizado com base em uso real."* Isso é a decisão estratégica correta — mas hoje não existe uma lista fechada do que significa "aplicado". Sem essa lista, o gate não é um critério, é uma intenção.

---

## 3. O risco estratégico central: a auditoria fechou o círculo pela metade

`ROADMAP.md` marca **PLT-011 (Auditoria UX RC1.2D) como ✅ Concluído**, e o único rastro dela no planejamento futuro é uma linha genérica em v1.1:

> "Padronização visual pós-auditoria UX — `PLT-011` — Média"

Uma linha não pode carregar 22 achados com naturezas, causas e soluções diferentes. Cruzando achado a achado com `PRODUCT_BACKLOG.md`:

| Achado da auditoria UX | Gravidade na auditoria | Item correspondente no backlog | Situação |
|---|---|---|---|
| UX-C1 — Histórico ausente da navegação lateral | 🔴 Crítico | *nenhum* | **Sem rastreamento** |
| UX-C2 — Tokens de cor semântica mortos (`--success`/`--warning`) | 🔴 Crítico | *nenhum* | **Sem rastreamento** |
| UX-A1 — Nav ativa não reconhece sub-rotas | 🟠 Alto | PA-016 | Rastreado, **rebaixado para Média** |
| UX-A2 — Duas barras de progresso redundantes | 🟠 Alto | *nenhum* | **Sem rastreamento** |
| UX-A3 — Largura inconsistente no fluxo de estudo | 🟠 Alto | *nenhum* | **Sem rastreamento** |
| UX-A4 — `AdminTableBody` em só ~4/14 módulos | 🟠 Alto | ADM-024 | Rastreado, **rebaixado para Baixa** |
| UX-A5 — Tabelas admin sem rolagem horizontal | 🟠 Alto | *nenhum* | **Sem rastreamento** |
| UX-A6 — Dashboard admin sem métricas acionáveis | 🟠 Alto | *nenhum* | **Sem rastreamento** |
| UX-A7 — Raio/padding fora de régua única | 🟠 Alto | *nenhum* | **Sem rastreamento** |
| M1–M9, B1–B4 (13 achados médios/baixos) | 🟡/⚪ | *nenhum específico* | **Sem rastreamento** |

**Leitura honesta:** dos 22 achados, **2 viraram item de backlog — e os dois foram rebaixados de prioridade em relação ao que a própria auditoria (baseada em regras explícitas do `DESIGN_PRINCIPLES.md`) apontou.** Os dois achados classificados como Crítico não têm *nenhum* item correspondente. Isso não é uma falha de execução — é um sintoma comum e previsível: **auditorias documentam problemas, mas só o backlog os transforma em trabalho.** Marcar `PLT-011` como "Concluído" quando na verdade só o *diagnóstico* foi concluído cria uma falsa sensação de fechamento.

**Implicação estratégica:** se a RC1.2F seguir para v2.0 sem primeiro fechar esse círculo, o produto vai empilhar funcionalidades novas (calendário, streak, estatísticas avançadas, simulados com cronômetro — todas em `ROADMAP.md`/v2.0) em cima de uma base que a própria organização já sabe, por escrito, que está inconsistente. Cada tela nova herda os mesmos problemas de cor, raio, largura e navegação — e o custo de corrigir depois cresce com o número de superfícies que replicam o padrão quebrado.

---

## 4. Visão de produto reafirmada: o que "premium" significa nesta fase

`DESIGN_PRINCIPLES.md` já define a visão (§1, §13): confiança, foco, organização, eficiência. Essa visão não muda. O que muda é **o que essa visão exige do produto na fase em que ele está agora**, e isso vale a pena dizer com todas as letras porque não está escrito em nenhum dos cinco documentos:

> Na fase do MVP (v1.0 → RC1.2), "premium" significava **entregar o ciclo completo sem atalho** — Admin produz, Aluno estuda, sem gamificação, sem ruído. Essa fase está, no essencial, cumprida.
>
> Na fase que se abre agora (RC1.2F → v1.1 → v2.0), "premium" passa a significar outra coisa: **que o produto pareça ter sido desenhado por uma única equipe, em uma única sessão** — não construído módulo a módulo ao longo de 7+ sprints, cada um resolvendo seu próprio problema de estado vazio, sua própria cor de sucesso, seu próprio raio de borda.

Esse é exatamente o padrão que os produtos citados como inspiração no §4 (Linear, Notion, Stripe, Raycast) entregam: não têm mais funcionalidades que o necessário, têm **menos variações do que o esperado** para a quantidade de telas que possuem. É essa a régua que falta hoje — e é o que a auditoria de UX mediu, achado por achado.

---

## 5. Estratégia de UX: três pilares para RC1.2F

Em vez de tratar os 22 achados da auditoria como uma lista plana, proponho agrupá-los em três frentes estratégicas, ordenadas pelo critério que o próprio `DESIGN_PRINCIPLES.md` já define como prioritário — os **quatro fluxos críticos: estudar, revisar, ver resultado, histórico** (§6).

### Pilar 1 — Fechar a navegação dos fluxos críticos

Cobre UX-C1 e UX-A1. Histórico é um dos quatro fluxos nomeados como crítico no guia oficial, e hoje está fora do menu; o item de menu que existe não reconhece onde o aluno está durante o fluxo mais repetido do produto (resolver questões). **Isso não é polimento — é a auditoria apontando que dois dos quatro fluxos críticos do produto têm problema de localização/descoberta.** Deveria ser a primeira coisa endereçada em RC1.2F, à frente de qualquer item de v1.1.

### Pilar 2 — Um sistema de cor e superfície, não dois

Cobre UX-C2, A7, M5. Três achados diferentes apontam para a mesma causa raiz: o produto tem tokens de tema definidos (`--success`, `--warning`, paleta dark completa) que **não são usados de forma consistente ou não são usados de forma alguma**. Resolver isso não é "arrumar uma cor" — é decidir, de uma vez, qual é a fonte da verdade de cor e raio do produto e obrigar todo componente novo (inclusive os de v2.0) a herdar dali. Se esse pilar não for resolvido antes de v2.0, cada nova tela (calendário, gráficos de evolução, streak) vai introduzir sua própria variação de verde/âmbar/raio, multiplicando o problema em vez de resolvê-lo.

### Pilar 3 — Um padrão de estado para os dois portais

Cobre UX-A4, A5, A6, M6. O Admin e o Aluno divergem em como comunicam carregando/vazio/erro, em como tratam tabelas largas, e em se uma métrica leva a uma ação. O guia exige explicitamente "mesmos padrões em Admin e Portal do Aluno" (§5) — hoje o Aluno está mais maduro nisso (`EmptyState`, `PageErrorState`) do que o Admin (`AdminTableBody` em só ~30% dos módulos). Nivelar por cima é mais barato agora (14 módulos admin) do que depois de v2.0 adicionar mais telas ao Admin.

---

## 6. Sequenciamento recomendado

Não é uma lista de tarefas de implementação — é uma ordem de decisão, para orientar como RC1.2F, v1.1 e v2.0 devem se relacionar:

| Fase | O que deve acontecer | Por quê nessa ordem |
|------|------------------------|----------------------|
| **RC1.2F (agora)** | Transformar os 20 achados sem rastreamento (seção 3) em itens reais de backlog, com prioridade **recalibrada pela gravidade da auditoria**, não recriada do zero | Sem isso, o trabalho de UX continua invisível para quem planeja sprints |
| **RC1.2F → v1.1** | Executar os Pilares 1 e 2 (navegação dos fluxos críticos + sistema único de cor/superfície) | São os únicos achados classificados como Crítico/Alto que tocam os quatro fluxos nomeados no guia |
| **v1.1** | Executar o Pilar 3 (padrão de estado Admin ⇄ Aluno) junto com os itens de qualidade já planejados (`PLT-013`, `PLT-014`, `PLT-016`) | Mesma natureza de trabalho — consistência estrutural, não feature nova |
| **Gate v1.1 → v2.0** | Validar o critério já escrito em `ROADMAP.md` ("Design system aplicado") contra uma lista fechada e verificável — não uma impressão geral | Hoje o critério existe em texto, mas não em checklist auditável |
| **v2.0** | Só então priorizar as features novas do Portal do Aluno (`PA-017`–`PA-023`) sobre uma base consolidada | Toda feature nova em v2.0 é mais uma superfície herdando o padrão vigente — o momento de consolidar é antes de multiplicar, não depois |

---

## 7. O que este documento explicitamente não decide

Como Head de Product Design eu escalaria as seguintes decisões para o time/stakeholders antes de qualquer especificação de tela:

1. **Tema escuro: comprometer ou remover.** A paleta `.dark` existe inteira em `styles.css` sem nenhum controle de UI. Ou vira um compromisso real de produto (com sua própria checklist de contraste/tokens) ou é removida para não ser dívida silenciosa. Hoje está em um meio-termo que não serve a ninguém.
2. **O que "design system aplicado" significa, em uma lista fechada.** O gate v1.1 → v2.0 em `ROADMAP.md` precisa de critérios de aceite explícitos (ex.: "0 cores hardcoded fora dos tokens", "100% dos módulos admin em `AdminTableBody`"), não uma frase de intenção.
3. **Prioridade relativa entre Pilar 1/2/3 e os itens funcionais já pendentes de RC1.2** (`PA-014`, `ADM-019`, `ADM-020`, `ADM-025`). Este documento argumenta que consistência antecede escala, mas a decisão final de sequenciamento de sprint é do time, não deste relatório.

---

## 8. Não-escopo desta RC

Reforçando o que já está bem estabelecido e não deve ser reaberto:

- Nenhuma tela foi desenhada e nenhum código foi alterado neste documento.
- Gamificação (XP, medalhas, moedas, ranking mundial, avatar, loja) continua fora de escopo em qualquer versão — já é consenso em `DESIGN_PRINCIPLES.md` §11 e `ROADMAP.md` "Fora do roadmap".
- IA e Comercial (pagamentos) permanecem pós-v2.0, sem mudança de posição neste documento.

---

*Documento produzido na Sprint RC1.2F — Visão de Produto & Estratégia de UX. Não substitui `PRODUCT_BACKLOG.md` nem `ROADMAP.md`; propõe como eles devem incorporar o que `UX_AUDIT_RC1.2D.md` já levantou.*
