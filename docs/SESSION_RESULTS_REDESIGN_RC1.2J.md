# RC1.2J — Redesign da Experiência de Resultado da Sessão

**Versão do documento:** RC1.2J
**Data:** 2026-07-06
**Papel:** Proposta de Product Design para a tela de resultado da sessão (`SessionResultsView`, exibida em `/app/study/$sessionId` quando `status = FINISHED`).
**Natureza:** Estratégico/visual. Não contém código, componentes React, TypeScript, Tailwind, CSS ou alteração de consultas/rotas/banco.
**Lido antes de propor:** [`DESIGN_PRINCIPLES.md`](./DESIGN_PRINCIPLES.md) · [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) · [`PRODUCT_VISION_RC1.2F.md`](./PRODUCT_VISION_RC1.2F.md) · [`UX_BACKLOG.md`](./UX_BACKLOG.md) · [`STUDY_EXPERIENCE_REDESIGN_RC1.2I.md`](./STUDY_EXPERIENCE_REDESIGN_RC1.2I.md) · [`DASHBOARD_REDESIGN_RC1.2H.md`](./DASHBOARD_REDESIGN_RC1.2H.md) · [`PRODUCT_BACKLOG.md`](./PRODUCT_BACKLOG.md)
**Regra de escopo:** total de questões, acertos, erros, percentual, tempo total, tempo médio, lista de questões, explicação, filtros, refazer erradas, nova sessão e voltar ao dashboard continuam existindo exatamente como hoje. Nada é removido, nenhuma consulta, rota ou regra de negócio muda — apenas hierarquia, agrupamento, posição e ênfase visual.

---

## 1. Problemas encontrados

### 1.1 Sete números com o mesmo peso visual diluem o único número que importa no momento "concluí"

A grade de resumo hoje mostra **Total de questões, Respondidas, Acertos, Erros, Aproveitamento, Tempo total e Tempo médio** em sete cards idênticos, mesma grade, mesmo tamanho de fonte. Não há hierarquia entre eles — o aproveitamento (%), que é o dado que responde à pergunta emocional "como eu fui?", tem o mesmo destaque visual que "tempo médio por questão", um dado de curiosidade, não de decisão.

### 1.2 "Total de questões" e "Respondidas" são, na prática, o mesmo número

Pela regra de navegação já existente (só se avança para a próxima questão depois de responder a atual), uma sessão finalizada pelo fluxo normal chega ao fim com `Respondidas = Total` na quase totalidade dos casos. Exibir os dois como cards separados é a mesma classe de redundância já proibida em `DESIGN_SYSTEM.md` §15 ("informação duplicada").

### 1.3 Os botões de "próxima ação" e os filtros da lista estão misturados na mesma fileira

A fileira de botões abaixo do resumo mistura duas intenções diferentes sob a mesma aparência (`variant="outline"` para quatro dos cinco):

- **Filtrar o que já está na tela** — "Ver questões corretas", "Ver questões erradas" (mudam `listFilter`, afetam só a lista abaixo)
- **Decidir o próximo passo** — "Voltar ao Dashboard", "Refazer apenas erradas", "Nova sessão" (saem da tela/criam algo novo)

Hoje os dois grupos são visualmente idênticos e ficam longe do conteúdo que afetam: os botões de filtro da lista estão no topo da página, e a lista que eles filtram está muito mais abaixo, depois de um card inteiro de metadados da sessão.

### 1.4 Filtro duplicado em dois lugares da tela

Além dos botões de filtro no topo, o card da lista já tem seu próprio controle — "Mostrar todas" aparece quando `listFilter !== "all"`, dentro do mesmo card da tabela. Ou seja, **dois controles em duas regiões diferentes da tela manipulam o mesmo estado** (`listFilter`). Isso é confuso e é encontrado com facilidade: aplicar o filtro pelo botão de baixo e o de cima levam ao mesmo resultado, mas nada na tela sugere que eles são a mesma coisa.

### 1.5 Card de metadados da sessão (curso/pacote/versão/distribuição/modo/data) ocupa uma posição mais alta que a ação

Esse card é referência (útil, mas não decisório) e hoje aparece **antes** dos botões de ação — ou seja, entre "quanto eu acertei" e "o que eu faço agora" existe um bloco inteiro de metadados administrativos que não ajuda a decidir nada.

### 1.6 Revisar uma questão específica abre o conteúdo longe de onde o aluno clicou

Ao clicar em "Revisar questão" numa linha da tabela, a página rola para uma lista separada de `Collapsible`s **abaixo de toda a tabela e da paginação** — não abre em contexto, junto à linha clicada. Em uma lista de 25 itens por página, isso pode significar rolar por uma tabela inteira para chegar ao conteúdo que o clique deveria ter trazido para perto.

### 1.7 Questão expandida não tem um controle visível para fechar

O `CollapsibleTrigger` que controla abrir/fechar existe no código, mas está marcado `sr-only` — não há nenhum elemento visível e clicável para um usuário de mouse fechar a questão expandida. Na prática, a única forma de "fechar" uma é abrir outra (o estado `expandedId` é único). Leitores de tela recebem o rótulo; usuários de mouse, não recebem um controle visual equivalente.

### 1.8 Badge "Correta" usa cor fora do sistema de tokens

`<Badge className="bg-green-600 hover:bg-green-600">Correta</Badge>` é a mesma classe de problema já registrada em `UXB-C2` e endereçada na tela de resolução (`STUDY_EXPERIENCE_REDESIGN_RC1.2I.md`, §1.5). Esta é a terceira e última ocorrência dentro da jornada de estudo (dashboard → resolução → resultado) — fechar aqui completa a migração para o token `--success` em toda a jornada.

### 1.9 O que já está correto (não mexer)

Vale registrar, porque nem tudo é problema: esta é uma das únicas telas do produto que já envolve sua tabela em `overflow-x-auto` (junto com `StudyHistoryPage`) — não precisa de correção de responsividade de tabela. A paginação (25 itens/página) e o resumo textual ("Página X de Y") já seguem o padrão do produto. A explicação (gabarito, explicação, bibliografia, referência legal) dentro do `QuestionCard` reaproveitado já está completa e não precisa de nenhum dado novo.

---

## 2. Nova hierarquia

| Ordem | Bloco | O que muda |
|---|---|---|
| 1 | Cabeçalho ("Resultado da sessão" + subtítulo) | Sem mudança |
| 2 | **Resumo em destaque** — Aproveitamento como número principal, Acertos/Erros como apoio imediato, Respondidas/Total unificados em uma legenda, Tempo total/médio como dado terciário | Substitui a grade plana de 7 cards iguais (§1.1, §1.2) |
| 3 | **Próximas ações** — Nova sessão (primário), Refazer apenas erradas (secundário forte), Voltar ao Dashboard (terciário/discreto) | Sobe de posição — logo após o resumo, antes dos metadados (§1.5); perde os dois botões de filtro, que descem para o bloco 5 |
| 4 | Card de metadados da sessão (curso/pacote/versão/distribuição/modo/data) | Desce de posição, mantém todos os campos, visualmente mais discreto (referência, não decisão) |
| 5 | **Questões respondidas** — agora com os filtros (Todas/Corretas/Erradas) reunidos num único lugar, dentro deste mesmo bloco | Consolida o controle duplicado (§1.3, §1.4); revisão de questão expande em contexto, próxima à linha clicada, com um controle visível de fechar (§1.6, §1.7) |

Justificativa da ordem: o objetivo desta tela, segundo o briefing, é que o aluno sinta **"concluí"** e **"sempre sei o que fazer agora"** — as duas frases, lidas juntas, pedem que resumo e próxima ação apareçam em sequência imediata, antes de qualquer metadado ou detalhe granular. Isso é uma leitura ligeiramente diferente de "resumo → detalhe → ação" (`DESIGN_PRINCIPLES.md` §6.4) na ordem literal, mas fiel ao mesmo princípio: aqui, a "ação" que o guia manda priorizar É o resumo emocional da experiência — decidir o que fazer a seguir é psicologicameante inseparável de ver o resultado, então os dois ficam colados no topo, e o detalhe (metadados, lista completa) vem depois, para quem quiser se aprofundar.

---

## 3. Wireframe ASCII

### 3.1 Desktop / Notebook (`lg:`/`xl:`)

```
┌────────────────────────────────────────────────────────────────────┐
│ Resultado da sessão                                                 │
│ Confira seu desempenho e revise as questões respondidas.            │
├────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────┐  ┌───────────┐  ┌───────────┐    │
│  │                                │  │  Acertos   │  │   Erros    │  │
│  │        74%                     │  │    9       │  │    3       │  │
│  │   Aproveitamento                │  │            │  │            │  │
│  │   12 de 12 respondidas          │  └───────────┘  └───────────┘  │
│  └──────────────────────────────┘                                   │
│  Tempo total: 18min 40s  ·  Tempo médio/questão: 1min 33s   ← discreto│
├────────────────────────────────────────────────────────────────────┤
│  [   Nova sessão   ]   [ Refazer apenas erradas ]   Voltar ao Dashboard │
│      (primário)              (secundário)              (discreto)   │
├────────────────────────────────────────────────────────────────────┤
│  Direito Constitucional — CESPE 2024                     [Estudo]    │
│  Curso: PF · Pacote: PF-Direito · Versão: 1.2 · Data: 06/07 14:32   │
├────────────────────────────────────────────────────────────────────┤
│  Questões respondidas              [Todas] [Corretas] [Erradas]      │
│  Exibindo todas as questões (12 de 12)                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ #  Enunciado          Sua resp.  Gabarito  Resultado   Ação    │  │
│  │ 1  "Considerando..."      B         B      ✓ Correta  [Revisar]│  │
│  │ 2  "É correto..."         A         C      ✕ Incorreta[Revisar]│  │
│  │    ┌──────────────────────────────────────────────────────┐  │  │
│  │    │ Enunciado completo + ✕ Resposta incorreta             │  │  │
│  │    │ Gabarito: C · Explicação · Bibliografia    [Fechar ✕] │  │  │  ← expande em contexto
│  │    └──────────────────────────────────────────────────────┘  │  │
│  │ 3  "Analise as..."        D         D      ✓ Correta  [Revisar]│  │
│  └──────────────────────────────────────────────────────────────┘  │
│  Página 1 de 1                                                       │
└────────────────────────────────────────────────────────────────────┘
```

### 3.2 Tablet (`sm:`/`md:`)

```
┌──────────────────────────────────────┐
│ Resultado da sessão                   │
├──────────────────────────────────────┤
│ ┌───────────────┐ ┌────────┐┌───────┐│
│ │     74%        │ │Acertos ││ Erros ││
│ │ Aproveitamento  │ │   9    ││   3   ││
│ │ 12 de 12 resp.  │ └────────┘└───────┘│
│ └───────────────┘                     │
│ Tempo total 18min · médio 1min33s     │
├──────────────────────────────────────┤
│ [ Nova sessão ] [Refazer erradas]     │
│ Voltar ao Dashboard                    │
├──────────────────────────────────────┤
│ Direito Constitucional      [Estudo]  │
│ PF · PF-Direito · v1.2 · 06/07        │
├──────────────────────────────────────┤
│ Questões respondidas                  │
│ [Todas] [Corretas] [Erradas]           │
│ ┌────────────────────────────────┐   │
│ │ (tabela com rolagem horizontal) │   │
│ └────────────────────────────────┘   │
│ Página 1 de 1                          │
└──────────────────────────────────────┘
```

### 3.3 Mobile (base)

```
┌───────────────────────────┐
│ Resultado da sessão         │
├───────────────────────────┤
│ ┌───────────────────────┐ │
│ │        74%              │ │
│ │   Aproveitamento         │ │
│ │   12 de 12 respondidas   │ │
│ └───────────────────────┘ │
│ ┌───────────┐┌───────────┐│
│ │ Acertos: 9 ││ Erros: 3  ││
│ └───────────┘└───────────┘│
│ Tempo total 18min40s        │
│ Tempo médio 1min33s          │
├───────────────────────────┤
│ [      Nova sessão       ] │  ← primário, largura total
│ [ Refazer apenas erradas ] │
│  Voltar ao Dashboard         │  ← link discreto, não botão
├───────────────────────────┤
│ Direito Constitucional      │
│ [Estudo]                    │
│ PF · PF-Direito · v1.2      │
├───────────────────────────┤
│ Questões respondidas         │
│ [Todas][Corretas][Erradas]  │
│ (rolagem horizontal →)      │
│ Página 1 de 1                │
└───────────────────────────┘
```

Em mobile, "Voltar ao Dashboard" deixa de ser um botão com a mesma largura dos demais e passa a link de texto discreto — presente, sempre acessível, mas sem competir com as duas ações de continuidade.

---

## 4. Fluxo de navegação

Nenhum destino novo — os mesmos cinco já existentes, reagrupados por intenção:

| Ação | Destino/efeito | Grupo |
|---|---|---|
| Nova sessão | `/app/study` | Próxima ação (primário) |
| Refazer apenas erradas | Cria sessão `WRONG_ONLY` → `/app/study/$sessionId` | Próxima ação (secundário) |
| Voltar ao Dashboard | `/app` | Próxima ação (discreto) |
| Ver questões corretas / erradas / Todas | Filtra a tabela abaixo (`listFilter`) | Filtro da lista — agora um único controle, junto ao bloco "Questões respondidas" |
| Revisar questão | Expande o conteúdo completo **na posição da própria linha**, com um controle visível de fechar | Detalhe em contexto, dentro da lista |

Nenhuma dessas ações muda de comportamento — só de posição e de agrupamento visual.

---

## 5. Microinterações

Nenhuma animação nova — aplicação das regras já definidas em `DESIGN_SYSTEM.md` §11:

| Interação | Tratamento |
|---|---|
| Expandir "Revisar questão" | Conteúdo aparece imediatamente abaixo da linha clicada, sem fade — o scroll necessário passa a ser mínimo (a linha já está visível) em vez de rolar até uma lista distante |
| Fechar questão expandida | Mesmo controle (`Collapsible`) já existente, agora com um botão visível ("Fechar", `variant="ghost"`, `size="sm"`) no lugar do `CollapsibleTrigger` hoje `sr-only` |
| Troca de filtro (Todas/Corretas/Erradas) | Troca imediata do conteúdo da tabela, sem transição de página — mesmo padrão já usado hoje |
| Botão "Nova sessão" (primário) | Sem alteração — mesmo hover/estado já padronizado pelo Design System |

**Proibido nesta tela:** qualquer animação de celebração baseada no percentual de acerto, qualquer confete, qualquer comparação visual "melhor/pior que antes" — o briefing pede continuidade, não avaliação emocional amplificada.

---

## 6. Melhorias de UX

| Mudança | Ganho de UX | Por que serve a "concluí" + "sei o que fazer agora" |
|---|---|---|
| Aproveitamento como número-âncora, Acertos/Erros de apoio | Uma leitura, um número, uma sensação — não sete | É a resposta mais direta a "como eu fui" |
| Total/Respondidas unificados em legenda | Remove uma redundância que hoje ocupa um card inteiro | Menos números para escanear no momento de fechamento |
| Ações de próximo passo logo após o resumo | Zero rolagem entre "vi meu resultado" e "decidi o que fazer" | Resposta direta a "sempre sei o que fazer agora" |
| Filtros da lista consolidados em um único controle | Elimina o controle duplicado (topo + dentro do card) | Menos ambiguidade sobre "qual botão eu uso" |
| Revisão de questão expande em contexto, com botão de fechar visível | Elimina o salto de rolagem até uma lista distante e a ausência de controle de fechar para usuários de mouse | Leitura prolongada da lista fica previsível — o aluno nunca perde a posição onde estava |
| Badge de acerto migrado para o token `--success` | Cor sob controle do sistema, sem risco de contraste insuficiente | Fecha, nesta última tela da jornada, a mesma correção já aplicada ao dashboard e à resolução |
| Metadados da sessão rebaixados visualmente | Informação de referência não compete com a decisão | Sustenta "nunca ansiedade" — nada de administrativo se impõe entre o resultado e a próxima ação |

---

## 7. Checklist para implementação

Ajustes de apresentação apenas — nenhuma consulta, rota, dado ou regra de negócio nova:

- [ ] Reagrupar os 7 stats de `buildSummaryStats` em uma composição hierárquica: Aproveitamento em destaque, Acertos/Erros como apoio imediato, Respondidas/Total unificados em uma legenda de texto, Tempo total/médio como linha discreta — reaproveitando o mesmo padrão visual de card já usado, apenas em tamanhos diferentes
- [ ] Mover "Ver questões corretas" e "Ver questões erradas" da fileira de ações do topo para dentro do bloco "Questões respondidas", junto ao controle "Mostrar todas" já existente ali — unificando os dois controles de `listFilter` em um só
- [ ] Reordenar a fileira de ações restante: "Nova sessão" (primário) → "Refazer apenas erradas" (secundário) → "Voltar ao Dashboard" (discreto/link em mobile)
- [ ] Mover o card de metadados da sessão (curso/pacote/versão/distribuição/modo/data) para depois do bloco de ações
- [ ] Ajustar `handleReviewQuestion` para expandir o conteúdo imediatamente abaixo da linha clicada em vez de rolar até a lista de `Collapsible`s ao final do card (mesmo mecanismo de estado `expandedId`, apenas mudança de onde o conteúdo é renderizado)
- [ ] Tornar visível o controle de fechar a questão expandida (substituir o `CollapsibleTrigger` `sr-only` por um botão visível "Fechar", reaproveitando o `Button` já existente)
- [ ] Migrar `<Badge className="bg-green-600 ...">Correta</Badge>` para o token `--success`, seguindo a mesma ressalva de contraste já aplicada em `STUDY_EXPERIENCE_REDESIGN_RC1.2I.md`
- [ ] Validar em `sm`/`md`/`lg`/`xl` que a nova composição do resumo não quebra a grade responsiva existente

---

## 8. Componentes reutilizados (sem alteração)

- `QuestionCard` (usado na revisão em contexto — mesmo componente, mesma prop `feedback`)
- `Table` / `TableHeader` / `TableRow` / `TableCell` (estrutura da lista, inalterada)
- `Collapsible` / `CollapsibleContent` (mecanismo de expandir/fechar, mesmo estado `expandedId`)
- `Badge` (variantes `outline`/`destructive` para "Não respondida"/"Incorreta" — sem alteração)
- `Button` (todas as variantes já usadas — `default`, `outline`, `ghost`)
- `Card` / `CardHeader` / `CardContent` / `CardTitle` / `CardDescription`
- `SessionHeader` (cabeçalho do card de metadados, sem alteração)
- Paginação (mesmo padrão de "Página X de Y" + Anterior/Próxima)

## 9. Componentes que precisam apenas de ajustes visuais

- **`SessionResultsView.tsx`** — reorganização de blocos (resumo → ações → metadados → lista); consolidação dos controles de filtro em um único local; composição hierárquica dos stats (tamanhos diferentes para o mesmo tipo de card, não um componente novo)
- **Badge "Correta"** — troca de `bg-green-600` hardcoded pelo token `--success` (mesma correção já especificada em `STUDY_EXPERIENCE_REDESIGN_RC1.2I.md`)
- **`CollapsibleTrigger`** (dentro do bloco de revisão) — troca do rótulo `sr-only` por um botão visível "Fechar", reaproveitando `Button` (`variant="ghost"`, `size="sm"`) — nenhuma mudança de mecanismo, apenas de apresentação

---

*Documento criado na Sprint RC1.2J — Redesign da Experiência de Resultado da Sessão. Não altera código, componentes, dados, consultas, rotas ou regras de negócio — apenas hierarquia, agrupamento e ênfase visual do que já existe em produção.*
