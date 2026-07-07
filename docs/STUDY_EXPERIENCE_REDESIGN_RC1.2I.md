# RC1.2I — Redesign da Experiência de Resolução de Questões

**Versão do documento:** RC1.2I
**Data:** 2026-07-06
**Papel:** Proposta de Product Design para a tela de resolução de questões (`/app/study/$sessionId`, fase "active").
**Natureza:** Estratégico/visual. Não contém código, componentes React, Tailwind ou CSS.
**Lido antes de propor:** [`DESIGN_PRINCIPLES.md`](./DESIGN_PRINCIPLES.md) · [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) · [`PRODUCT_VISION_RC1.2F.md`](./PRODUCT_VISION_RC1.2F.md) · [`UX_BACKLOG.md`](./UX_BACKLOG.md) · [`DASHBOARD_REDESIGN_RC1.2H.md`](./DASHBOARD_REDESIGN_RC1.2H.md) · [`PRODUCT_BACKLOG.md`](./PRODUCT_BACKLOG.md)
**Regra de escopo:** nenhuma funcionalidade nova, nenhuma regra de negócio alterada. Progresso, enunciado, alternativas, gabarito, explicação, favoritar, revisar depois, navegação e finalizar sessão continuam existindo exatamente como hoje. O que muda é hierarquia, espaçamento, agrupamento e ênfase visual.

---

## Nota prévia sobre o "cronômetro" citado no briefing

O briefing lista "cronômetro" entre as funcionalidades já existentes a preservar. Pela leitura do código (`StudySessionPage.tsx`) e da visão de produto (`00-VISAO-GERAL.md`, "Fora do escopo do MVP": *"Meta diária, cronômetro, tempo estimado — simplificação intencional do fluxo de estudo"*), o que existe hoje é uma **medição silenciosa**: `responseTimeSeconds` é calculado e salvo a cada resposta, mas **nunca é exibido na tela** — não há relógio, contador ou cronômetro visível durante a resolução.

Isso muda a proposta deste documento em um ponto: **não é introduzido nenhum cronômetro visível/rodando na tela de resolução.** Um relógio correndo durante 2–4 horas de estudo contínuo é, na prática, uma fonte de pressão — o oposto de "foco, conforto, clareza" pedido para esta tela, e o oposto do que a própria visão de produto decidiu deliberadamente não ter. O dado que já existe (`responseTimeSeconds`) é tratado como parte do resultado da sessão (que já o exibe hoje em `SessionResultsView`, tempo por questão e tempo médio) — não como um elemento novo dentro da tela de resolução. Este documento propõe explicitamente **manter essa ausência**, e registra o motivo em vez de assumi-la como omissão a corrigir.

---

## 1. Problemas encontrados

### 1.1 Texto de leitura principal abaixo do padrão já oficializado para leitura longa

`QuestionCard.tsx` exibe o enunciado em `text-sm` (14px) e `QuestionOptions.tsx` exibe as alternativas também em `text-sm`. `DESIGN_SYSTEM.md` §3.2 já define `text-base` (16px) como o tamanho oficial para *"corpo de leitura longa — enunciado de questão, texto de alternativa"* — ou seja, a tela onde o aluno passa horas lendo está, hoje, um degrau abaixo da própria régua tipográfica que o produto já ratificou para ela.

### 1.2 Duas barras de progresso competindo pela mesma informação

Já registrado como `UXB-A2`: `StudySessionPage.tsx` renderiza `SessionProgress` duas vezes em sequência ("Questão X de Y" e "Respondidas X de Y"), quase sempre com números coincidentes. `DESIGN_SYSTEM.md` §14 já decidiu a correção ("um único indicador de progresso por tela") — este documento aplica essa decisão concretamente à tela.

### 1.3 Quatro botões de navegação com o mesmo peso visual, quando só um está realmente disponível a cada momento

A lógica atual já garante que, a qualquer instante, no máximo **um** dos três botões de avanço (`Responder`, `Próxima`, `Finalizar Sessão`) está habilitado — `canAnswer`, `canGoNext` e `canFinish` são mutuamente exclusivos por construção (`question.isAnswered`, `isLastQuestion`). Apesar disso, os três são renderizados lado a lado com a mesma altura, cor e peso, mudando apenas `disabled`. O aluno precisa procurar visualmente qual dos três está ativo a cada questão — centenas de vezes por sessão longa. Isso é atrito puramente de apresentação: a regra de negócio já resolve qual botão é "o certo"; a tela não comunica isso.

### 1.4 Ações secundárias (Favoritar / Revisar depois) competem com a navegação principal

`QuestionActions` usa os mesmos tamanhos de botão (`size="sm"`, mas largura e posição próximas) logo acima da barra de navegação principal — duas linhas de botões parecidas em sequência, sem hierarquia clara entre "isto ajuda a organizar seu estudo depois" (favoritar/revisar) e "isto avança sua sessão agora" (navegação).

### 1.5 Feedback de acerto usa cor fora do sistema de tokens, com risco de contraste

`QuestionCard.tsx` usa `border-green-500/50 bg-green-500/5 text-green-700` hardcoded para o feedback de acerto, em vez do token `--success` já oficializado. Já registrado como `UXB-C2`; nesta tela específica, o efeito prático é que o feedback mais frequente da sessão (acerto) usa uma cor que não está sob controle do Design System.

### 1.6 Cabeçalho de sessão e progresso ocupam blocos separados sem necessidade

`SessionHeader` (título, subtítulo, badge de modo) e `SessionProgress` são hoje dois blocos visuais distintos com espaçamento total entre si (`space-y-6`), quando poderiam formar uma única "faixa de status" compacta — reduzindo a altura total ocupada antes do conteúdo que realmente importa (o enunciado).

### 1.7 O que já está correto (não mexer)

Para não sugerir mudança onde não há problema: a largura da tela (`max-w-2xl`) já é exatamente a categoria "foco/leitura" oficializada em `DESIGN_SYSTEM.md` §4.2 — nenhuma mudança de largura é necessária aqui. O `RadioGroup` das alternativas já é acessível por teclado nativamente. Os estados de carregamento, erro e vazio (`Sessão não encontrada`, `Sessão sem questões`, skeletons) já seguem o padrão do produto.

---

## 2. Nova hierarquia

Ordem vertical proposta, do topo para a base — mesmos dados, mesmos componentes, nova ênfase:

| Ordem | Bloco | Peso visual | Mudança em relação a hoje |
|---|---|---|---|
| 1 | Faixa de status (título da distribuição + modo + posição "Questão X de Y" + contagem "Y respondidas") | Baixo — compacto, não compete com o conteúdo | Funde `SessionHeader` + as duas `SessionProgress` em uma única faixa curta |
| 2 | Enunciado (`QuestionCard`) | **Mais alto da tela** | Tipografia sobe para `text-base` (§1.1) |
| 3 | Feedback de acerto/erro (quando existe) | Alto, mas contido — aparece dentro do próprio card do enunciado, como já é hoje | Cor migra para o token `--success`/`--destructive` (§1.5) |
| 4 | Alternativas (`QuestionOptions`) | Alto — é a área de decisão do aluno | Tipografia sobe para `text-base`, padding de clique aumenta levemente |
| 5 | Ações secundárias (Favoritar / Revisar depois) | Baixo — deliberadamente discretas | Sobem de posição (para perto do enunciado) e diminuem de destaque, para não competir com a navegação |
| 6 | Navegação principal | Alto, mas **um único botão primário visível por vez** | `Responder`/`Próxima`/`Finalizar Sessão` passam a ocupar a mesma posição, um de cada vez, conforme o estado já calculado hoje. `Anterior` fica isolado, com peso secundário |

Princípio por trás da ordem: o enunciado e as alternativas — o "produto" em si (`DESIGN_PRINCIPLES.md` §10) — ocupam a maior parte da altura e do peso visual da tela. Tudo o que é meta-informação (status, progresso, organização pessoal) é comprimido ao mínimo necessário.

---

## 3. Wireframe ASCII

### 3.1 Desktop / Notebook (`lg:`/`xl:`)

```
┌──────────────────────────────────────────────────────────┐
│ ← Voltar                                                  │
├──────────────────────────────────────────────────────────┤
│ Direito Constitucional — CESPE 2024        [Modo: Estudo] │  ← faixa de status
│ Questão 7 de 20 ······●·············  ·  12 respondidas   │  ← 1 única barra
├──────────────────────────────────────────────────────────┤
│                                                            │
│  Enunciado                                                │
│  "Considerando a jurisprudência do STF sobre controle     │
│  de constitucionalidade, é correto afirmar que..."         │  ← text-base
│                                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │ ✓ Resposta correta                                   │  │  ← feedback (--success)
│  │ Gabarito: C · [explicação quando existir]            │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
├──────────────────────────────────────────────────────────┤
│  Alternativas                                             │
│  ( ) A) ...................................               │
│  (●) B) ...................................  ← selecionada│
│  ( ) C) ...................................               │
│  ( ) D) ...................................               │
├──────────────────────────────────────────────────────────┤
│  ★ Favoritar     📌 Revisar depois                        │  ← discreto, perto do topo do bloco de ações
├──────────────────────────────────────────────────────────┤
│  [ ← Anterior ]                        [   Próxima →   ]  │  ← 1 botão primário por vez
└──────────────────────────────────────────────────────────┘
```

### 3.2 Tablet (`sm:`/`md:`)

```
┌────────────────────────────────────────┐
│ ← Voltar                                │
├────────────────────────────────────────┤
│ Direito Constitucional        [Estudo]  │
│ Questão 7 de 20 ····●····  12 respond.  │
├────────────────────────────────────────┤
│ Enunciado                               │
│ "Considerando a jurisprudência..."      │
│ ┌──────────────────────────────────┐   │
│ │ ✓ Resposta correta                │   │
│ └──────────────────────────────────┘   │
├────────────────────────────────────────┤
│ ( ) A) ...                              │
│ (●) B) ...                              │
│ ( ) C) ...                              │
│ ( ) D) ...                              │
├────────────────────────────────────────┤
│ ★ Favoritar   📌 Revisar depois         │
├────────────────────────────────────────┤
│ [ ← Anterior ]      [   Próxima →   ]   │
└────────────────────────────────────────┘
```

### 3.3 Mobile (base)

```
┌───────────────────────────┐
│ ← Voltar                   │
├───────────────────────────┤
│ Direito Constitucional     │
│ [Estudo]                   │
│ Questão 7 de 20            │
│ ····●····  12 respondidas  │
├───────────────────────────┤
│ Enunciado                  │
│ "Considerando a            │
│ jurisprudência..."         │
│ ┌───────────────────────┐ │
│ │ ✓ Resposta correta     │ │
│ └───────────────────────┘ │
├───────────────────────────┤
│ ( ) A) ...                 │
│ (●) B) ...                 │
│ ( ) C) ...                 │
│ ( ) D) ...                 │
├───────────────────────────┤
│ ★ Favoritar                │
│ 📌 Revisar depois           │
├───────────────────────────┤
│ [      Próxima →       ]   │  ← primário, largura total
│ [     ← Anterior       ]   │  ← secundário, abaixo
└───────────────────────────┘
```

Em mobile, o botão primário fica em cima e em largura total (alvo de clique maior, alinhado a §6); "Anterior" desce para uma posição claramente secundária, sem dividir a atenção com o botão que o aluno vai usar a cada questão.

---

## 4. Fluxo de navegação

Nenhum destino ou transição de estado é criado — a máquina de estados (`preview` → `active` → `completed`, e dentro de `active`: responder → avançar/finalizar) permanece idêntica. O que muda é qual botão está **visualmente em primeiro plano** em cada momento, usando exatamente as flags que já existem:

| Estado da questão | Botão primário exibido (mesma posição) | Botão secundário sempre visível |
|---|---|---|
| Ainda não respondida (`canAnswer`) | **Responder** | Anterior (se `canGoPrevious`) |
| Respondida, não é a última (`canGoNext`) | **Próxima →** | Anterior |
| Respondida, é a última (`canFinish`) | **Finalizar Sessão** | Anterior |

"Anterior" nunca compete pelo lugar do botão primário — ele é a única ação que não faz parte do ciclo responder→avançar, então mantém posição fixa e peso secundário (`variant="outline"` ou `ghost`) em todos os três estados.

---

## 5. Microinterações

Nenhuma animação nova — apenas aplicação das regras já definidas em `DESIGN_SYSTEM.md` §11:

| Interação | Tratamento |
|---|---|
| Selecionar uma alternativa | Mudança imediata de borda (`border-primary/40`) — sem transição maior que 150ms, já é o padrão do `RadioGroup` |
| Exibir feedback após responder | Aparece imediatamente junto ao enunciado, sem fade de entrada — o aluno não deve esperar uma animação para ler o resultado |
| Troca de botão primário (Responder → Próxima → Finalizar) | Troca de rótulo/cor no mesmo espaço físico do botão, sem deslocamento de layout — `transition-colors` padrão, nada além disso |
| Estado de carregamento em botão | Texto de estado ("Salvando...", "Finalizando...") no lugar do rótulo, já é o padrão do produto — mantido sem alteração |
| Troca de questão (Próxima/Anterior) | Sem transição de página ou fade — o novo enunciado substitui o anterior imediatamente, priorizando velocidade sobre efeito |

**Proibido nesta tela, sem exceção:** qualquer animação de celebração ao acertar, qualquer transição acima de 200ms, qualquer efeito de destaque (brilho, pulso, confete) no feedback de acerto.

---

## 6. Acessibilidade

| Critério | Situação e regra aplicada |
|---|---|
| **Contraste do feedback de acerto** | Ao migrar de `green-500` hardcoded para o token `--success` (§1.5), aplicar a ressalva já registrada em `DESIGN_SYSTEM.md` §12.1: nunca texto branco sobre `--success` sólido (contraste insuficiente, 3.3:1) — usar o mesmo padrão de tinta clara + texto colorido que o próprio `QuestionCard` já usa para o alerta (`bg-success/5 text-success`, análogo ao `bg-green-500/5 text-green-700` atual, só migrando o token) |
| **Contraste do feedback de erro** | `--destructive` já usado via `variant="destructive"` do `Alert` — manter `text-sm` como piso mínimo, nunca `text-xs`, para respeitar o contraste calculado (4.3:1, que só é válido em texto ≥14px) |
| **Área de clique das alternativas** | Já correta hoje (label envolve todo o card da alternativa, `p-3` — considerar `p-4` para reforçar a área de toque em sessões longas, sem mudar a estrutura) |
| **Área de clique do botão primário** | Em mobile, botão primário em largura total (§3.3) — maior alvo de toque, menor chance de erro de clique após horas de uso |
| **Foco por teclado** | Mantém o padrão nativo do `RadioGroup` (setas), `Tab` percorre alternativas → ações secundárias → navegação, sem necessidade de mudança |
| **Rótulo de ícone** | `Favoritar`/`Revisar depois` já têm texto visível ao lado do ícone — manter texto, não converter para ícone-somente, mesmo ao reduzir destaque visual (§1.4) |
| **Leitura por leitor de tela do feedback** | O `Alert` do Shadcn já expõe papel semântico adequado — nenhuma mudança necessária, apenas a migração de cor |

---

## 7. Melhorias de UX

Resumo do ganho de cada mudança, todas sem alterar dado ou regra de negócio:

| Mudança | Ganho de UX | Impacto em sessão de 2–4h |
|---|---|---|
| Enunciado/alternativas em `text-base` | Menos esforço de leitura por questão | Em uma sessão de 50–100 questões, reduz fadiga ocular acumulada — é a mudança de maior impacto desta proposta |
| Uma única barra de progresso | Elimina a leitura duplicada de um número quase sempre igual | Menos uma decisão de interpretação por questão |
| Um único botão primário por estado | Zero busca visual por "qual botão está ativo agora" | Multiplicado por centenas de questões por sessão, é a segunda mudança de maior impacto |
| Ações secundárias reposicionadas e discretas | Separação clara entre "organizar meu estudo" e "avançar minha sessão" | Reduz ruído visual constante, sem esconder a função |
| Feedback de acerto tokenizado | Cor sob controle do sistema, sem risco de leitura difícil | Consistência percebida ao longo de toda a sessão |
| Faixa de status compacta | Mais altura de tela disponível para o conteúdo real | Menos rolagem, especialmente em notebook/tablet |
| Nenhum cronômetro visível introduzido | Preserva a ausência intencional de pressão de tempo | Sustenta "conforto" e "foco" ao longo de horas, em vez de introduzir ansiedade |

---

## 8. Checklist para implementação

Ajustes de apresentação apenas — nenhuma lógica, dado ou rota nova:

- [ ] Alterar `text-sm` → `text-base` no enunciado (`QuestionCard.tsx`) e nas alternativas (`QuestionOptions.tsx`)
- [ ] Consolidar as duas instâncias de `SessionProgress` em `StudySessionPage.tsx` em uma única barra ("Questão X de Y"), movendo a contagem de respondidas para um texto simples ao lado (reaproveitando o espaço hoje ocupado por `SessionHeader`)
- [ ] Unificar `SessionHeader` + barra de progresso única em uma faixa de status compacta (mesmos dados, menos espaço vertical entre eles)
- [ ] Reestruturar `QuestionNavigation` para exibir um único botão primário por estado (`Responder` → `Próxima` → `Finalizar Sessão`), sempre na mesma posição, usando as flags já existentes (`canAnswer`, `canGoNext`, `canFinish`) — sem alterar quando cada uma fica `true`
- [ ] Manter `Anterior` como botão secundário de posição fixa, independente do botão primário
- [ ] Reposicionar `QuestionActions` (Favoritar/Revisar depois) para perto do topo do bloco de conteúdo, com `size="sm"` e menor destaque relativo à navegação principal
- [ ] Migrar a cor de feedback de acerto em `QuestionCard.tsx` de `green-500`/`green-700` hardcoded para os tokens `--success` (aplicando a ressalva de contraste de `DESIGN_SYSTEM.md` §12.1)
- [ ] Ajustar padding das alternativas de `p-3` para `p-4` (opcional, reforço de área de clique)
- [ ] Confirmar que nenhum cronômetro visível foi introduzido — `responseTimeSeconds` continua sendo salvo silenciosamente, sem exibição durante a resolução
- [ ] Validar em `sm`/`md`/`lg`/`xl` que a troca de botão primário não desloca o layout entre estados

---

## 9. Componentes reutilizados (sem alteração)

- `SessionHeader` (conteúdo idêntico — apenas reagrupado com a barra de progresso)
- `SessionProgress` (mesmo componente, usado uma única vez em vez de duas)
- `QuestionCard` (estrutura idêntica — só tipografia e cor do feedback mudam)
- `QuestionOptions` (`RadioGroup`/`RadioGroupItem` — estrutura e comportamento idênticos)
- `QuestionActions` (mesmo componente, mesmos botões — apenas reposicionado e reduzido em destaque)
- `Button`, `Badge`, `Alert`, `Card`/`CardHeader`/`CardContent` (Design System já existente)
- `PageErrorState`, `Skeleton` (estados de carregamento/erro já existentes, sem mudança)

## 10. Componentes que precisam apenas de ajustes visuais

- **`QuestionCard.tsx`** — troca de `text-sm` para `text-base` no enunciado; troca da cor hardcoded do feedback de acerto pelo token `--success`
- **`QuestionOptions.tsx`** — troca de `text-sm` para `text-base` no texto das alternativas; padding de `p-3` para `p-4` (opcional)
- **`QuestionNavigation.tsx`** — reestruturação puramente de apresentação: renderizar um botão primário condicional (reaproveitando os três rótulos/ícones já existentes) em vez de três botões simultâneos; `Anterior` isolado com peso secundário
- **`QuestionActions.tsx`** — apenas classe de tamanho/posição; nenhuma mudança de props, ícones ou texto
- **`StudySessionPage.tsx`** — apenas reordenação/agrupamento dos blocos já existentes (`SessionHeader`, `SessionProgress` único, `QuestionCard`, `QuestionOptions`, `QuestionActions`, `QuestionNavigation`)

---

*Documento criado na Sprint RC1.2I — Redesign da Experiência de Resolução de Questões. Não altera código, componentes, dados, rotas ou regras de negócio — apenas hierarquia, espaçamento, tipografia e agrupamento visual do que já existe em produção.*
