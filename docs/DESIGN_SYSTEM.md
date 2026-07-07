# SimulaPro — Design System Oficial

**Versão do documento:** RC1.2G
**Data:** 2026-07-06
**Papel:** Referência única e obrigatória para toda implementação visual futura do SimulaPro — Portal Admin e Portal do Aluno.
**Natureza:** Este documento define regras. Não contém telas, mockups, componentes React, Tailwind ou CSS novos.
**Fundamentação:** todo valor abaixo foi extraído do que já está implementado em `src/styles.css` e nos componentes Shadcn de `src/components/ui/**` — não foram inventados valores novos. Onde a implementação atual diverge ou está incompleta, este documento **decide** a regra oficial e marca a divergência para fechamento via [`UX_BACKLOG.md`](./UX_BACKLOG.md).
**Precede:** [`DESIGN_PRINCIPLES.md`](./DESIGN_PRINCIPLES.md) (filosofia/visão — não é substituído, é operacionalizado aqui) · [`UX_AUDIT_RC1.2D.md`](./UX_AUDIT_RC1.2D.md) · [`UX_BACKLOG.md`](./UX_BACKLOG.md) · [`PRODUCT_VISION_RC1.2F.md`](./PRODUCT_VISION_RC1.2F.md) · [`ROADMAP.md`](./ROADMAP.md) · [`PRODUCT_BACKLOG.md`](./PRODUCT_BACKLOG.md) · [`CHANGELOG.md`](./CHANGELOG.md)

---

## 1. Filosofia visual

Toda tela do SimulaPro — Admin ou Aluno — é construída seguindo esta ordem de decisão, nesta prioridade:

1. **Hierarquia antes de decoração.** A informação mais importante da tela aparece primeiro, maior e com mais contraste. Tudo o mais é secundário até prova em contrário.
2. **Remover antes de adicionar.** Antes de desenhar um elemento novo, pergunte se um elemento existente pode ser reaproveitado ou removido. Uma tela com menos elementos e mais espaço em branco está, por padrão, mais correta do que uma tela cheia.
3. **Um único sistema, duas superfícies.** Admin e Aluno são o mesmo produto visto por dois perfis. Nenhuma decisão visual pode ser exclusiva de um portal sem justificativa documentada — o padrão é o mesmo card, o mesmo botão, o mesmo estado vazio nos dois.
4. **Cor com intenção, nunca decoração.** Toda cor fora da escala de neutros (§2) precisa comunicar um estado (sucesso, erro, aviso, informação) ou uma ação primária. Se a cor não muda o significado da informação, ela não deveria estar ali.
5. **Consistência antes de originalidade.** Uma tela nova nunca deve inventar um padrão visual próprio quando este documento já resolve o caso. Originalidade é permitida apenas onde este documento é omisso — e, nesse caso, a decisão tomada deve ser proposta como atualização deste arquivo, não como exceção silenciosa.
6. **Sobriedade é a marca.** Sombra leve, borda discreta, animação curta. Nenhuma tela deve parecer um aplicativo de consumo, jogo ou rede social — deve parecer uma ferramenta profissional em que se passam horas estudando.

---

## 2. Paleta oficial

Todos os valores abaixo já existem como tokens CSS em `src/styles.css` (`:root`, tema claro — oficialmente o único tema ativo hoje, ver nota sobre modo escuro em §2.4). Os HEX abaixo são a conversão exata dos valores OKLCH já implementados — **nenhum valor novo foi criado**.

### 2.1 Cores de superfície e marca

| Papel | Token CSS | HEX | Quando usar |
|---|---|---|---|
| **Primary** | `--primary` | `#2062CE` | Ação principal da tela: botão primário, link ativo, item de navegação selecionado, foco de interesse (ex.: ícone de destaque em card de estatística). Só deve existir **uma** ação primária visível por tela. |
| **Secondary** | `--secondary` | `#EDF2F9` | Fundo neutro para ações e elementos de segundo plano (botão secundário, badge neutro). Não é uma segunda cor de marca — é um cinza-azulado de apoio. O SimulaPro tem uma única cor de marca (Primary); Secondary existe para dar peso sem competir com ela. |
| **Background** | `--background` | `#F8FAFD` | Fundo de página (`<body>`, área de conteúdo atrás da sidebar). Nunca usar em cards ou elementos elevados. |
| **Surface** | `--card` | `#FFFFFF` | Qualquer elemento elevado sobre o Background: cards, dialogs, popovers, dropdowns, tabelas. |
| **Surface Secondary** | `--muted` | `#EEF2F7` | Fundo recuado dentro de uma Surface — linha de tabela em hover, bloco de skeleton, área de código/preview, fundo de filtro. Mais escuro que Surface, mais claro que Border. |
| **Border** | `--border` | `#DADEE5` | Toda borda 1px de card, input, tabela, divisor. Único valor de borda neutra do produto — não criar variações de cinza para borda. |
| **Success** | `--success` | `#00A159` | Confirmação, acerto, conclusão, publicação bem-sucedida. **Hoje definido em CSS mas não usado no código** — ver `UXB-C2` em `UX_BACKLOG.md`; a partir deste documento é o único verde permitido no produto. |
| **Warning** | `--warning` | `#E89D00` | Aviso não bloqueante (ex.: linha de importação com aviso, prazo próximo do fim). Uso restrito — nunca decorativo. |
| **Error** | `--destructive` | `#E62B34` | Falha, resposta incorreta, ação destrutiva (excluir), erro de validação/rede. |
| **Info** | `--accent` / `--accent-foreground` | `#E1EBFF` / `#0E1E47` | Mensagem informativa neutra (não é erro, sucesso ou aviso) — ex.: nota contextual, badge "Novo", estado de destaque suave. O produto não tem um token `--info` dedicado; `accent` já cumpre esse papel hoje (usado no selo da landing page) e é oficializado aqui como o par de cor de Info. |

### 2.2 Texto

| Papel | Token CSS | HEX | Quando usar |
|---|---|---|---|
| **Text Primary** | `--foreground` | `#0A121F` | Títulos, corpo de texto principal, valores de dado (nome, enunciado de questão, número de estatística). |
| **Text Secondary** | `--muted-foreground` | `#5C646F` | Subtítulos e descrições de apoio, em `text-sm` — texto que explica o título acima dele (ex.: "Seu resumo de estudos..."). |
| **Text Muted** | `--muted-foreground` (mesmo token, `text-xs`) | `#5C646F` | Metadado de menor prioridade — timestamp, legenda, contagem auxiliar. **Não existe um terceiro tom de cinza no produto hoje.** Text Secondary e Text Muted usam o mesmo token e se diferenciam por tamanho (`text-sm` vs `text-xs`), não por cor. Não criar um token novo só para isso — resolve com hierarquia tipográfica (§3). |

### 2.3 Cores de superfície da Sidebar (namespace próprio)

A sidebar é a única superfície escura do produto por decisão de design (mesmo padrão de Linear/Notion citado em `DESIGN_PRINCIPLES.md` §4) — não é modo escuro, é uma superfície de navegação com paleta própria:

| Token CSS | HEX | Papel |
|---|---|---|
| `--sidebar` | `#111A2D` | Fundo da sidebar |
| `--sidebar-foreground` | `#EFF2F5` | Texto/ícone padrão na sidebar |
| `--sidebar-primary` | `#5888FC` | Item de navegação ativo/hover |
| `--sidebar-accent` | `#1D2842` | Fundo de item em hover/seleção |
| `--sidebar-border` | `#242D42` | Divisores dentro da sidebar |

### 2.4 Modo escuro — reservado, não ativado

`styles.css` já define uma paleta `.dark` completa. **Este documento não a declara oficial para uso em produção enquanto não houver: (a) um controle de UI para ativá-la e (b) 100% dos usos de cor do produto migrados para os tokens desta seção — pré-requisito de `UXB-C2`/`UXB-M5`.** Até lá, a paleta escura é reserva técnica, não uma segunda superfície suportada. Nenhuma tela deve ser construída assumindo `dark:` como caminho testado.

---

## 3. Tipografia

### 3.1 Fonte

O produto **não carrega nenhuma fonte customizada** — usa a pilha padrão do sistema operacional (`font-sans` do Tailwind: `ui-sans-serif, system-ui, sans-serif, ...`). Isso é oficializado como decisão, não como pendência: pilha de sistema garante carregamento instantâneo (alinhado a "Velocidade" em `DESIGN_PRINCIPLES.md` §3) e já transmite sobriedade sem esforço adicional. Uma fonte customizada só deve ser introduzida com justificativa de marca explícita — não por padrão.

### 3.2 Escala tipográfica

Escala fixa do Tailwind, sem customização — os únicos tamanhos permitidos no produto:

| Classe | Tamanho / altura de linha | Uso oficial |
|---|---|---|
| `text-xs` | 12px / 16px | Legendas, metadados, badges, timestamps |
| `text-sm` | 14px / 20px | Corpo padrão de UI: labels, descrições, células de tabela, botões |
| `text-base` | 16px / 24px | Corpo de leitura longa — enunciado de questão, texto de alternativa |
| `text-lg` | 18px / 28px | Título de card, título de seção secundária (`h2` dentro de card) |
| `text-xl` | 20px / 28px | Título de card em destaque (ex.: cabeçalho de sessão de estudo) |
| `text-2xl` | 24px / 32px | Título de página (`h1`) — único tamanho de título de página permitido |
| `text-3xl`+ | 30px+ | Reservado para landing page (`/`) apenas — nunca dentro de `/admin` ou `/app` |

### 3.3 Pesos

Apenas dois pesos em toda a interface de produto (landing pode usar `font-bold` em headline de marketing):

| Peso | Uso |
|---|---|
| `font-medium` (500) | Labels, botões, valor de tabela em destaque (`font-medium` na coluna principal), item de navegação |
| `font-semibold` (600) | Títulos de card, valores de estatística, `h1`/`h2` de página |

`font-bold` (700) é reservado para `h1` de página (`text-2xl font-bold`) e para a landing page. Não usar `font-bold` dentro de cards ou tabelas — cria peso excessivo em telas de trabalho contínuo.

### 3.4 Hierarquia (ordem obrigatória em qualquer tela)

```
text-2xl font-bold          → Título da página (1 por tela)
text-sm text-muted-foreground → Subtítulo/descrição da página (opcional, logo abaixo)
text-lg font-semibold        → Título de seção/card
text-sm font-medium          → Label de campo ou coluna
text-sm / text-base          → Corpo (dado, enunciado, célula)
text-xs text-muted-foreground → Metadado (data, contagem, legenda)
```

Nenhuma tela deve pular um nível para baixo sem necessidade (ex.: ir de `text-2xl` direto para `text-xs` sem nenhum nível intermediário).

### 3.5 Espaçamento tipográfico

- Título de página → subtítulo: sem `margin-top` extra — ambos dentro do mesmo bloco `<div>`, subtítulo logo abaixo (padrão já consistente em todo o produto).
- Título de página → primeiro bloco de conteúdo: `space-y-6` (24px) — ver grid, §4.
- Label → campo: `space-y-2` (8px).

---

## 4. Grid

### 4.1 Container e espaçamento vertical

| Elemento | Regra oficial |
|---|---|
| Contêiner raiz de qualquer página autenticada | `space-y-6` (24px entre blocos verticais) — já é o padrão em ~95% das telas; oficializado como obrigatório em 100% |
| Padding da área de conteúdo (`<main>`) | `p-6` (24px), definido uma vez em `AppShell.tsx` — nenhuma página deve adicionar padding externo próprio |
| Gap em grids de cards | `gap-4` (16px) |
| Gap em formulários/filtros | `gap-3` (12px) para linhas de filtro, `gap-4` (16px) para grids de campo de formulário |

### 4.2 Larguras máximas — regra única

`UX_AUDIT_RC1.2D.md` (UX-A3) identificou 5 larguras máximas diferentes usadas sem critério ao longo do mesmo fluxo. A partir deste documento, existem **apenas duas** larguras de contêiner de conteúdo, escolhidas por *tipo de tela*, nunca por página individual:

| Tipo de tela | Largura máxima | Exemplos |
|---|---|---|
| **Foco/leitura/tarefa sequencial** | `max-w-2xl` (672px) | Resolver questão, configurar sessão, formulário de uma etapa |
| **Dados/tabela/painel** | Sem `max-w` (largura total do `<main>`) | Dashboard, Histórico, listagens Admin, resultado de sessão |

Não existe uma terceira largura. Uma tela de resultado (`SessionResultsView`) que hoje usa `max-w-4xl` e uma tela de dashboard sem `max-w` devem convergir para "Dados/painel" (sem `max-w`); uma tela de configuração que hoje usa `max-w-lg` ou `max-w-3xl` deve convergir para `max-w-2xl`.

### 4.3 Grids responsivos de cards — padrão único

```
grid gap-4 sm:grid-cols-2 lg:grid-cols-4      → grades de estatística (4 itens)
grid gap-4 md:grid-cols-2 xl:grid-cols-3      → grades de cards de conteúdo (distribuições)
grid gap-4 sm:grid-cols-2                     → grades de 2 itens
```

Não introduzir uma quarta variação de breakpoints para grid de cards sem atualizar esta tabela.

---

## 5. Radius

**Padrão único, sem exceção: `12px` (`rounded-lg`, token `--radius`) em todo componente de interface — botões, inputs, selects, cards, badges, dialogs, popovers, tabelas, tooltips.**

Isso substitui o estado atual identificado em `UXB-A7`, em que Button/Input/Badge usam `rounded-md` (10px) e Card usa `rounded-xl` (16px), com wrappers de tabela oscilando entre `rounded-lg` e `rounded-md`. A partir deste documento:

- Não existe raio menor para "controles" e raio maior para "superfícies" — é a mesma régua para os dois.
- `rounded-sm`, `rounded-md`, `rounded-xl`, `rounded-2xl`, `rounded-full` **não são permitidos** em componentes de produto, com uma única exceção: elementos circulares reais (avatar, ícone-em-círculo) podem usar `rounded-full`, porque ali o raio não é uma escolha estética, é a forma do elemento.
- Este é o critério de aceite objetivo e verificável: buscar por `rounded-md`, `rounded-xl`, `rounded-2xl` em `src/components/ui/*.tsx` e `src/components/admin/**`/`src/components/app/**` deve retornar zero ocorrências (fora do caso de `rounded-full`) quando `UXB-A7` for fechado.

---

## 6. Sombras

Dois níveis apenas — sombra é sinal de elevação, não de decoração:

| Nível | Classe Tailwind | Quando usar |
|---|---|---|
| **Nenhuma** | (sem classe) | Elementos dentro de uma Surface já elevada (linha de tabela, item de lista, badge) — não empilhar sombra sobre sombra |
| **Sutil** | `shadow-sm` | Controles interativos: botão, input, item clicável em hover |
| **Padrão** | `shadow` | Cards e superfícies de conteúdo (Card, dialog, popover) — o nível mais alto permitido no produto |

**Nunca usar:** `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`, ou qualquer sombra colorida. Sombra pronunciada contradiz "sombras leves; bordas discretas" (`DESIGN_PRINCIPLES.md` §7) e não aparece em nenhuma das referências de qualidade citadas (Linear, Notion, Stripe, Arc, GitHub).

---

## 7. Componentes

Regra geral: nenhum componente abaixo tem uma variante exclusiva para Admin ou para Aluno. O componente é o mesmo; o que muda é o dado que ele exibe.

| Componente | Regra oficial |
|---|---|
| **Buttons** | Variantes: `default` (Primary — uma por tela), `outline` (ação secundária), `ghost` (ação terciária/navegação), `destructive` (exclusão/irreversível). Altura única: `h-9` (default), `h-8` (`sm`, dentro de tabelas), `h-10` (`lg`, CTA de tela cheia). Nunca alterar `border-radius` do botão isoladamente (§5). |
| **Inputs** | Altura `h-9`, mesma borda (`--border`/`--input`), mesmo radius (§5). Ícone à esquerda (busca) sempre com `pl-9` e ícone `h-4 w-4` centralizado verticalmente. |
| **Selects** | Mesma altura e borda do Input. `SelectContent` sempre com a mesma Surface (`--card`) e a mesma sombra (`shadow`, §6). |
| **Checkbox / Radio** | Componente Radix padrão, sem recolorir — usam `--primary` no estado marcado. Rótulo sempre clicável (envolve o controle), nunca só o quadrado/círculo. |
| **Cards** | `rounded-lg` (§5), `shadow` (§6), padding único: `p-6` para Card de conteúdo (formulário, listagem), `p-5` reservado exclusivamente para Card de estatística (grade de números). Não misturar os dois paddings no mesmo tipo de card. |
| **Tables** | Sempre dentro de `<div className="overflow-x-auto rounded-lg border">` — sem exceção, mesmo em telas que hoje "cabem" no desktop (fecha `UXB-A5`). Cabeçalho `TableHead` sem customização de cor. Coluna de ação sempre alinhada à direita (`text-right`). |
| **Badges** | `default` = Primary (uso genérico/ativo), `secondary` = neutro/inativo, `destructive` = erro, `outline` = neutro discreto (não respondido, rascunho). Sucesso usa `--success` (token, não `green-*` literal) com texto claro — ver ressalva de contraste em §12. |
| **Sidebar** | Paleta própria (§2.3). Item ativo determinado por `pathname.startsWith(item.url)`, nunca por igualdade exata (fecha `UXB-A1`). Um único grupo de navegação por perfil de produto (Admin: 4 grupos já existentes; Aluno: os itens de `DESIGN_PRINCIPLES.md`/`UX_BACKLOG.md` — incluindo Histórico, `UXB-C1`). |
| **Header** | Altura fixa `h-14`, `border-b`, fundo `--card`. Contém apenas: trigger da sidebar + rótulo do portal. Não adicionar busca global, notificações ou avatar sem atualizar este documento primeiro. |
| **Dialogs** | Surface (`--card`), `rounded-lg`, `shadow`. Sempre envolvidos em `<form onSubmit>` quando contêm campos editáveis — nenhum diálogo de criar/editar sem `<form>` (fecha `UXB-M4`). Largura: `max-w-lg` (padrão), `max-w-2xl`/`max-w-3xl` apenas quando o conteúdo é genuinamente tabular (ex.: edição de questão com alternativas). |
| **Tabs** | Usadas apenas para alternância de contexto dentro da mesma tela (ex.: Login/Criar conta), nunca como substituto de navegação entre páginas. |
| **Pagination** | Padrão único: rótulo "X–Y de Z" à esquerda, botões `outline size="sm"` Anterior/Próxima à direita, ambos com ícone (`ChevronLeft`/`ChevronRight`) — nunca ícone rotacionado no lugar do ícone correto. |
| **Empty States** | Componente único `EmptyState` (ícone em tile 36px — ver §9 —, título, descrição opcional, ação opcional) usado em **100% das telas**, Admin e Aluno (fecha `UXB-M6`). Proibido texto solto ("Nenhum item encontrado.") sem o componente. |
| **Skeletons** | Repetem a forma exata do conteúdo real (mesma altura, mesma grade) — nunca um retângulo genérico desalinhado do layout final. |
| **Loading** | Botão em ação mostra texto de estado ("Salvando...", "Criando sessão...") com o próprio botão desabilitado — nunca um spinner isolado sem texto, exceto em ícones autônomos (ex.: atalho de filtro). |
| **Toasts** | Sonner, posição `top-right`, `richColors`. Sucesso e erro sempre com mensagem de domínio (ex.: "Curso atualizado"), nunca a mensagem crua de erro de rede/RLS exposta ao usuário. |

---

## 8. Estados

Todo componente interativo deve implementar os seis estados abaixo — nenhum pode faltar silenciosamente:

| Estado | Regra visual |
|---|---|
| **Default** | Cor/borda conforme §2, sem transformação |
| **Hover** | `bg-accent`/`hover:bg-primary/90` conforme variante — nunca mudar tamanho ou posição do elemento no hover |
| **Focus** | `focus-visible:ring-1 focus-visible:ring-ring` — obrigatório em todo elemento navegável por teclado, sem exceção (inclusive ícones clicáveis) |
| **Active** | Leve escurecimento (`/90`, `/80`) da cor de base — sem mudança de sombra ou escala |
| **Disabled** | `opacity-50`, `cursor-not-allowed`, sem interação — nunca esconder o elemento, apenas desabilitá-lo |
| **Loading** | Ver "Loading" em §7 — o componente permanece visível e ocupando o mesmo espaço, nunca colapsa o layout |
| **Selected** | `bg-accent`/`border-primary` conforme contexto (item de sidebar ativo, opção de radio marcada, linha de tabela selecionada) |

Nenhum estado usa cor fora da paleta oficial (§2) nem sombra fora dos dois níveis definidos (§6).

---

## 9. Ícones

| Regra | Valor |
|---|---|
| **Biblioteca oficial** | `lucide-react` — única biblioteca de ícones permitida no produto |
| **Peso de traço** | Padrão da biblioteca (`strokeWidth={2}`) — não customizar por tela |
| **Tamanho padrão** | `h-4 w-4` (16px) — ícone inline em botão, label, célula de tabela, navegação |
| **Tamanho de destaque** | `h-5 w-5` (20px) — ícone de cabeçalho de card, ícone de feature na landing |
| **Tile de ícone** (ícone dentro de círculo/quadrado colorido) | Contêiner `h-9 w-9` (36px), `rounded-lg` (§5), fundo `bg-primary/10`, ícone `h-4 w-4 text-primary` dentro. Usado em cards de estatística e `EmptyState`. **Hoje `EmptyState` usa `h-10 w-10` — deve convergir para `h-9 w-9`** para fechar a divergência. |
| **Espaçamento ícone + texto** | `gap-2` (8px) em flex, ou `mr-2` quando o ícone precede texto dentro de um único elemento (botão) |
| **Ícones decorativos** | Sempre `aria-hidden="true"` |
| **Ícones que substituem texto** (botão somente-ícone) | Sempre com `aria-label` — sem exceção em nenhum módulo (fecha `UXB-M1`) |

---

## 10. Responsividade

### 10.1 Breakpoints oficiais

Os breakpoints padrão do Tailwind, sem customização — os únicos usados no produto:

| Breakpoint | Largura mínima | Classe de referência |
|---|---|---|
| Mobile (base) | 0px | (sem prefixo) |
| Tablet | 640px | `sm:` |
| — | 768px | `md:` (mesmo valor usado pelo hook `useIsMobile`, já alinhado) |
| Notebook | 1024px | `lg:` |
| Desktop | 1280px | `xl:` |

### 10.2 Regras por dispositivo

| Dispositivo | Regra |
|---|---|
| **Desktop/Notebook** (`lg:`/`xl:`) | Sidebar expandida por padrão, grids em até 4 colunas, tabelas completas visíveis |
| **Tablet** (`sm:`/`md:`) | Sidebar colapsável para ícones, grids em 2 colunas, tabelas com `overflow-x-auto` obrigatório (§7) |
| **Mobile** (base) | Sidebar em overlay/off-canvas, grids em 1 coluna, formulários em coluna única, botões de ação empilhados (`flex-col`, depois `sm:flex-row`) |

Nenhuma tabela com mais de 6 colunas pode depender apenas de `overflow-x-auto` em mobile sem indicar visualmente que há rolagem (ex.: sombra de borda ou padding residual visível) — closure de `UXB-M3`.

---

## 11. Microinterações

Regra geral: **toda transição deve ser sentida, não vista.** Se o usuário percebe conscientemente a animação, ela é longa demais.

| Interação | Regra |
|---|---|
| **Hover/transição de cor** | `transition-colors`, duração padrão do Tailwind (150ms), sem easing customizado |
| **Abertura de dialog/popover/dropdown** | Usar apenas o comportamento padrão do Radix (fade + leve escala) já embutido nos componentes Shadcn — não adicionar animação própria |
| **Loading** | Spinner (`animate-spin`) apenas em ícone `h-4 w-4`, nunca em elemento de página inteira |
| **Fade de conteúdo carregado** | Não usar — o conteúdo aparece assim que os dados chegam, sem fade-in artificial. Skeleton já cumpre o papel de transição visual |
| **Duração máxima permitida** | 200ms para qualquer transição de UI. Acima disso, a transição deixa de ser microinteração e passa a atrasar a tarefa do aluno — contra "Velocidade" (`DESIGN_PRINCIPLES.md` §3) |

**Proibido:** animação de entrada de página, parallax, confete/celebração ao acertar questão, bounce, shake, ou qualquer efeito com duração perceptível acima de 200ms.

---

## 12. Acessibilidade

### 12.1 Contraste (calculado a partir dos HEX oficiais de §2)

| Par | Contraste | Situação WCAG |
|---|---|---|
| Text Primary sobre Background | 17.9:1 | ✅ AAA |
| Text Primary sobre Surface | 18.8:1 | ✅ AAA |
| Text Secondary/Muted sobre Background ou Surface | ~5.7–6.0:1 | ✅ AA (texto normal) |
| Primary-foreground sobre Primary (texto de botão) | 5.5:1 | ✅ AA — **não usar abaixo de `text-sm`** |
| Warning-foreground sobre Warning | 8.0:1 | ✅ AAA |
| Destructive-foreground sobre Destructive | 4.3:1 | ⚠️ Passa AA só em texto grande (≥18px ou ≥14px bold). **Botões/badges destrutivos devem usar `text-sm font-medium` como piso — nunca `text-xs` em texto branco sobre vermelho.** |
| Success-foreground sobre Success | 3.3:1 | ❌ Não passa AA para texto normal. **Regra obrigatória: nunca usar texto branco sobre `--success` sólido em badges pequenos.** Usar `--success` como texto sobre um fundo `success/10` (tinta clara), seguindo o mesmo padrão já correto em `QuestionCard.tsx` (alerta de acerto) — nunca o padrão do badge "Correta" atual (fundo sólido + texto branco), que fica **proibido** a partir deste documento. |
| Border sobre Background | 1.3:1 | Esperado — borda é decorativa/discreta por design (`DESIGN_PRINCIPLES.md` §7), não veículo de informação. Nenhuma borda pode ser a única forma de comunicar um estado (ex.: erro de campo precisa de cor de texto + ícone, não só borda vermelha). |

### 12.2 Outras regras obrigatórias

| Critério | Regra |
|---|---|
| **Tamanho mínimo de texto** | `text-xs` (12px) é o piso absoluto — nunca menor, em nenhuma tela |
| **Área clicável mínima** | 36×36px (`h-9 w-9`) para qualquer alvo de toque/clique, incluindo botões de ícone em tabela — nenhum ícone clicável menor que isso, mesmo visualmente pequeno |
| **Teclado** | Todo fluxo deve ser operável sem mouse: `Tab` percorre a ordem visual, `Enter` submete formulários (fecha `UXB-M4`), `RadioGroup`/`Select` navegáveis por seta (já garantido pelos componentes Radix — não customizar) |
| **Foco visível** | `focus-visible:ring` obrigatório (ver §8) — nunca `outline: none` sem substituto visível |
| **Rótulo de ícone-somente** | `aria-label` obrigatório (ver §9) |
| **Live regions** | Estado vazio usa `role="status"`; estado de erro usa `role="alert"` — herdados automaticamente ao usar `EmptyState`/`PageErrorState`/`AdminTableBody` (nunca reimplementados manualmente, fecha `UXB-A4`) |

---

## 13. Consistência

Regras obrigatórias, sem exceção documentada caso a caso — exceções exigem atualização deste documento antes da implementação:

1. **Nunca usar cor hardcoded.** Nenhuma classe `bg-green-*`, `text-red-*`, `bg-amber-*`, `bg-emerald-*` (ou qualquer cor literal do Tailwind) é permitida em código de produto. Toda cor vem de um token de §2.
2. **Sempre utilizar tokens.** Se uma tela precisa de uma cor que não existe em §2, a resposta não é usar uma cor literal — é propor a adição do token neste documento primeiro.
3. **Mesmo padding.** `p-6` para Card de conteúdo, `p-5` exclusivamente para Card de estatística (§7) — nenhum terceiro valor de padding de card.
4. **Mesmo radius.** `rounded-lg` (12px) em tudo, sem exceção além de elementos circulares reais (§5).
5. **Mesmo comportamento de botões.** Mesma altura por tamanho, mesma variante por função (uma ação primária por tela), mesmo estado de loading com texto (§7, §8).
6. **Mesmo padrão de tabelas.** `overflow-x-auto` sempre, `AdminTableBody`/equivalente sempre, paginação sempre no mesmo layout (§7).
7. **Admin e Aluno compartilham o mesmo sistema.** Nenhuma decisão de §2 a §12 vale só para um portal. Se uma tela do Admin parece "mais simples" ou "menos polida" que a equivalente do Aluno (ou vice-versa), isso é um defeito a corrigir, não uma característica do portal.

---

## 14. Componentes Premium

Regras de comportamento e hierarquia para as superfícies de maior valor do produto — não são mockups, são o contrato que qualquer implementação futura dessas telas deve respeitar.

| Superfície | Regra de hierarquia e comportamento |
|---|---|
| **Dashboard Cards** (estatística) | Card `p-5`, `rounded-lg`, tile de ícone 36px (§9) com `bg-primary/10`. Todo card de métrica deve ser clicável/navegável para a tela onde essa métrica pode virar ação — métrica sem destino é proibida a partir deste documento (fecha `UXB-A6`). Máximo 4 por linha (`lg:grid-cols-4`); acima disso, agrupar por categoria em vez de esticar a grade. |
| **Cards de Distribuição** | Card `p-6` padrão, título (`text-lg`), descrição do curso/pacote (Text Secondary), ação primária única ("Configurar sessão"/"Estudar") ocupando a largura do card. O clique no card inteiro deve levar ao mesmo destino do botão — e deve carregar o contexto de origem (fecha `UXB-M7`), nunca abrir um formulário genérico. |
| **Questões** (resolução) | Largura de foco/leitura (§4.2, `max-w-2xl`). Um único indicador de progresso por tela (fecha `UXB-A2` — remover a duplicidade "Questão X de Y" + "Respondidas X de Y"; manter apenas a posição atual, com o total respondido como texto auxiliar, não uma segunda barra). Alternativas em `RadioGroup` nativo, nunca card customizado sem semântica de formulário. |
| **Resultados** (pós-sessão) | Largura "Dados/painel" (§4.2, sem `max-w`). Resumo numérico primeiro (acertos/erros/%), lista detalhada depois — ordem "resumo → detalhe → ação" de `DESIGN_PRINCIPLES.md` §6. Badge de acerto/erro segue a regra de contraste de §12.1 (nunca texto branco sobre `--success` sólido). |
| **Histórico** | Largura "Dados/painel". Tabela com prioridade de coluna em telas estreitas (§10.2) — em vez de expor as 11 colunas atuais com rolagem, priorizar Data/Distribuição/Resultado/Ação como colunas sempre visíveis, demais reveladas por expansão ou rolagem (fecha `UXB-M3`). Presente na navegação principal do Aluno, sem exceção (fecha `UXB-C1`). |
| **Admin Tables** | `overflow-x-auto` sempre (§7). Toda tabela usa o mesmo componente de corpo (loading/vazio/erro — fecha `UXB-A4`) e a mesma paginação (§7). Coluna de ação sempre à direita, botões de ícone sempre com `aria-label`. |
| **Filtros** | Mesma estrutura em Admin e Aluno: card com `CardHeader`("Filtros") + grid de campos (`gap-4`) + ação "Limpar filtros" quando há filtro ativo. Nunca filtro solto fora de um contêiner visualmente distinto do conteúdo filtrado. |
| **Indicadores** (atalhos de filtro do dashboard do Aluno) | Rótulos precisam ser semanticamente distintos entre si — "Revisar depois" e "Pendentes de revisão" não podem competir pelo mesmo verbo (fecha `UXB-M8`). Atalho com contagem zero fica visualmente desabilitado, não apenas falha ao ser clicado. |

---

## 15. O que nunca fazer

Proibições explícitas, sem exceção, herdadas de `DESIGN_PRINCIPLES.md` §11 e reforçadas pela auditoria de UX:

- **Gamificação de qualquer tipo** — XP, medalhas, moedas, ranking mundial, avatar, loja, streak decorativo sem função de estudo.
- **Gradientes exagerados** — nenhum gradiente decorativo em botão, card ou fundo. Cor é sólida ou tinta translúcida do próprio token (`primary/10`, `success/10`), nunca um degradê entre duas cores.
- **Excesso de cores** — nenhuma cor fora da paleta oficial (§2), em nenhuma circunstância, inclusive "só para essa tela".
- **Cards gigantes** — nenhum card deve ocupar mais altura do que o conteúdo justifica; espaço vazio dentro de um card não é "respiro", é desperdício de hierarquia.
- **Informação duplicada** — nenhuma tela repete o mesmo dado em dois componentes visuais ao mesmo tempo (o caso concreto: duas barras de progresso na resolução de questão, `UXB-A2`).
- **Animações longas** — nada acima de 200ms (§11); nenhuma celebração animada ao acertar uma questão.
- **Ícones desnecessários** — ícone só existe quando substitui ou reforça texto essencial; ícone puramente decorativo ao lado de um título já claro é ruído.
- **Raio ou padding "só desta vez"** — qualquer valor fora de §4/§5 é um defeito a corrigir no próximo ciclo, nunca uma exceção aceita silenciosamente.
- **Cor hardcoded** — repetido aqui por ênfase: `green-600`, `amber-500` e afins literais estão banidos do código de produto a partir deste documento.

---

## 16. Checklist de homologação

Usar antes de considerar qualquer tela nova (ou tela existente revisada) pronta para produção. Uma tela só está em conformidade quando **todos** os itens abaixo forem verdadeiros:

**Cor e tema**
- [ ] Nenhuma cor hardcoded (`green-*`, `red-*`, `amber-*` etc.) — apenas tokens de §2
- [ ] Badge/texto de sucesso não usa texto branco sobre `--success` sólido (§12.1)
- [ ] Existe no máximo uma ação Primary visível por tela

**Tipografia**
- [ ] Título de página é `text-2xl font-bold`, único por tela
- [ ] Hierarquia de §3.4 respeitada sem pular níveis
- [ ] Nenhum texto abaixo de `text-xs`

**Grid e layout**
- [ ] Contêiner raiz usa `space-y-6`
- [ ] Largura máxima é uma das duas opções de §4.2 — nenhuma terceira variação
- [ ] Grids de card seguem um dos três padrões de §4.3

**Componentes**
- [ ] Todo card, botão, input, badge e tabela usa `rounded-lg` (§5) — zero exceções fora de elementos circulares
- [ ] Sombra é `shadow-sm` (controle) ou `shadow` (superfície) — nunca `shadow-md`+
- [ ] Estado vazio usa `EmptyState`; estado de erro usa `PageErrorState`/equivalente com `role="alert"`
- [ ] Toda tabela está envolta em `overflow-x-auto`
- [ ] Todo diálogo com campos editáveis está dentro de `<form onSubmit>`

**Estados**
- [ ] Hover, focus, active, disabled, loading e selected estão implementados (§8)
- [ ] Botão em mutação mostra texto de estado, não apenas spinner

**Ícones**
- [ ] Ícone é `lucide-react`, `h-4 w-4` (inline) ou `h-5 w-5` (destaque)
- [ ] Todo botão somente-ícone tem `aria-label`
- [ ] Ícones decorativos têm `aria-hidden="true"`

**Responsividade**
- [ ] Testado em `sm`, `md`, `lg` e `xl` (§10.1)
- [ ] Nenhuma tabela larga sem `overflow-x-auto` em mobile

**Acessibilidade**
- [ ] Toda a tela é operável só com teclado
- [ ] Foco visível em todo elemento navegável
- [ ] Área clicável mínima de 36×36px em ícones clicáveis

**Consistência entre portais**
- [ ] A mesma tela, se existisse no outro portal (Admin ↔ Aluno), usaria exatamente os mesmos componentes e tokens

---

*Documento criado na Sprint RC1.2G — Design System Oficial. É a referência normativa para fechar `UX_BACKLOG.md` e para toda implementação visual a partir desta data. Não altera código, componentes ou schema — apenas declara a regra que a implementação futura deve seguir.*
