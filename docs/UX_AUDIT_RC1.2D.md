# RC1.2D — Auditoria de UX/UI (Product Design)

**Projeto:** SimulaPro Core
**Data:** 2026-07-06
**Autor:** Revisão assistida (Claude), lente de Product Designer Sênior
**Escopo:** Experiência do Portal Administrativo (`/admin`) e do Portal do Aluno (`/app`) — hierarquia visual, tipografia, espaçamento, componentes, cor, acessibilidade, responsividade e fluxo de navegação
**Referência normativa:** [`docs/DESIGN_PRINCIPLES.md`](./DESIGN_PRINCIPLES.md) (RC2.0)
**Método:** Revisão estática de código (sem alterações, sem execução de app em browser). Complementa — sem duplicar — a auditoria funcional em [`docs/RC1_AUDIT.md`](./RC1_AUDIT.md)

---

## 1. Como ler este documento

Esta auditoria **não** repete o levantamento funcional de `RC1_AUDIT.md` (CRUD, paginação, toasts, tratamento de erro de rede). O foco aqui é **experiência e linguagem visual**: o que o produto comunica, em que ordem, com que consistência, e onde a implementação diverge do que `DESIGN_PRINCIPLES.md` define como regra.

Cada achado traz:

- **Impacto** — Crítico / Alto / Médio / Baixo (ver critério abaixo)
- **Onde** — arquivo(s) e linha(s) de referência
- **Evidência** — trecho de código real
- **Diagnóstico** — por que isso é um problema de UX, não apenas gosto pessoal
- **Recomendação** — direção da correção (sem prescrever implementação)

**Critério de gravidade** (mesma régua de `RC1_AUDIT.md`, para manter as auditorias comparáveis):

| Nível | Significado |
|-------|--------------|
| **Crítico** | Esconde ou compromete um dos fluxos críticos citados no §6 do guia de design (estudar, revisar, ver resultado, histórico) ou contradiz frontalmente um princípio de marca declarado |
| **Alto** | Prejudica clareza, hierarquia ou eficiência de forma perceptível; existe contorno, mas o padrão esperado é quebrado |
| **Médio** | Inconsistência visível entre telas/módulos; não impede o uso |
| **Baixo** | Polimento, acabamento, ou risco latente de manutenção |

---

## 2. Resumo executivo

| Impacto | Qtde | Área mais afetada |
|---------|------|--------------------|
| 🔴 Crítico | 2 | Navegação do Aluno; sistema de cor |
| 🟠 Alto | 7 | Navegação, layout do fluxo de estudo, dashboard Admin, tabelas |
| 🟡 Médio | 9 | Consistência Admin ↔ Aluno, marca, acessibilidade pontual |
| ⚪ Baixo | 4 | Polimento visual, manutenção do design system |
| **Total** | **22** | |

**Leitura geral:** a base visual é sólida — Shadcn UI + Tailwind aplicados de forma disciplinada, paleta contida, ausência total de gamificação (nenhum XP, medalha, moeda ou ranking encontrado — em conformidade com o §11 do guia). Os problemas não estão na fundação, e sim em **deriva de consistência**: o mesmo conceito (card de estatística, estado vazio, raio de borda, cor de sucesso) foi reimplementado várias vezes com pequenas variações, e uma funcionalidade inteira (Histórico) foi entregue sem ficar visível na navegação.

---

## 3. Pontos fortes observados

Registrados para não corrigir o que já funciona:

- **Sistema de tokens coerente em `styles.css`**: paleta OKLCH única para claro/escuro, radius compartilhado via `--radius`, aplicado consistentemente em `Card`, `Button`, `Input`, `Badge`.
- **Zero gamificação**: nenhuma ocorrência de XP, medalha, moeda, ranking ou avatar em todo `src/` — total aderência ao §11 do guia.
- **Componentes Radix acessíveis por padrão**: `RadioGroup` no fluxo de resolução de questões (`QuestionOptions.tsx`) é navegável por teclado nativamente, sem esforço extra.
- **Skeletons cobrindo os principais carregamentos** do Portal do Aluno (dashboard, estudo, histórico, sessão) e de parte do Admin.
- **`EmptyState` e `PageErrorState`** como componentes compartilhados no Portal do Aluno, com retry padronizado.
- **Ritmo de espaçamento vertical consistente**: praticamente todas as páginas usam `space-y-6` como contêiner raiz — a "respiração visual" pedida no §5 do guia está presente.
- **`aria-label` presente na maioria dos botões de ícone** em Cursos, Taxonomia e Questões (`aria-label={\`Editar ${row.name}\`}`), um padrão bom que só não se estende a 100% dos módulos (ver M1).

---

## 4. Achados críticos

### UX-C1 — Histórico de sessões existe, mas está invisível na navegação

**Onde:** `src/routes/_authenticated/app/route.tsx`; link único em `src/components/app/dashboard/RecentSessions.tsx:30`

O guia de design nomeia explicitamente **"histórico"** como um dos quatro fluxos críticos do produto:

> "Fluxos críticos (estudar, revisar, ver resultado, histórico) devem exigir o mínimo de passos." — `DESIGN_PRINCIPLES.md`, §6

A página `/app/history` (`StudyHistoryPage.tsx`) é robusta — filtros por curso, distribuição, modo, período e status, estatísticas de resumo, paginação, ações de "refazer erradas" e "nova sessão". Mas o menu lateral do Aluno tem **apenas dois itens**:

```tsx
// app/route.tsx
const groups: NavGroup[] = [
  { label: "Meu Estudo", items: [
      { title: "Dashboard", url: "/app", icon: LayoutDashboard },
      { title: "Estudo", url: "/app/study", icon: BookOpen },
  ]},
];
```

O único caminho até o histórico completo é um link de texto discreto dentro do card "Últimas sessões":

```tsx
<Button variant="link" size="sm" className="px-0 shrink-0" asChild>
  <Link to="/app/history">Ver histórico completo →</Link>
</Button>
```

**Diagnóstico:** um aluno que nunca rolou até esse card específico — ou que limpou o cache visualmente e não notou o link — nunca vai descobrir que o histórico existe. Isso não é "menor prioridade de menu": é uma funcionalidade completa (aparentemente entregue na RC1.2C, a julgar pelo histórico de commits) que fica **fora da arquitetura de informação** do produto. Além disso, ao acessar `/app/history` diretamente (ex.: favorito salvo, link compartilhado), nenhum item do menu fica ativo — o aluno perde a referência de onde está.

**Recomendação:** adicionar "Histórico" como terceiro item do grupo "Meu Estudo" na sidebar do Aluno.

---

### UX-C2 — Tokens de cor semântica existem no design system, mas nunca são usados

**Onde:** `src/styles.css:41-44` (tokens `--success`/`--warning` definidos e mapeados em `@theme inline`); uso real em `SessionResultsView.tsx:297`, `QuestionCard.tsx:23-24`, `ImportPage.tsx:424,461,570`

O design system já expõe `--color-success`, `--color-success-foreground`, `--color-warning` e `--color-warning-foreground` como classes Tailwind utilizáveis (`bg-success`, `text-warning`, etc.). Uma busca em todo `src/` não encontra **nenhuma** ocorrência de uso desses tokens:

```
bg-success | text-success | border-success | bg-warning | text-warning | border-warning
→ 0 arquivos
```

Em vez disso, todo feedback de acerto/erro/aviso usa cores literais do Tailwind, aplicadas de forma **diferente em cada lugar**:

```tsx
// QuestionCard.tsx:23-24 — tela de resolução (tem variante dark)
className={feedback.isCorrect
  ? "border-green-500/50 bg-green-500/5 text-green-700 dark:text-green-400"
  : undefined}

// SessionResultsView.tsx:297 — tela de resultado (SEM variante dark)
<Badge className="bg-green-600 hover:bg-green-600">Correta</Badge>

// ImportPage.tsx:461 — badge de aviso, cor amber hardcoded
<Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/15">Aviso</Badge>
```

**Diagnóstico:** três implementações distintas do mesmo conceito ("isto deu certo"), com três tons de verde diferentes (`green-500`, `green-600`, e a paleta de destructive que já é tokenizada). Isso viola diretamente o §7 do guia — *"Sem excesso de cores. Cor decorativa sem significado é proibida"* — e o §8 — *"Todos os componentes devem compartilhar... Estados: default, hover, focus, disabled, loading, erro."* O caso mais sério está exatamente na tela de **"ver resultado"** (um dos quatro fluxos críticos citados no guia): o badge "Correta" não tem variante `dark:`, enquanto o alerta de feedback na mesma jornada (`QuestionCard`) tem. Se o tema escuro do produto (já totalmente definido em `styles.css`, ver M5) for ativado no futuro, o selo de acerto pode ficar com contraste ou tom incorretos exatamente na tela que resume o desempenho do aluno.

**Recomendação:** consolidar todo indicador de acerto/erro/aviso nos tokens `success`/`warning`/`destructive` já existentes, eliminando as cores literais.

---

## 5. Achados de alto impacto

### UX-A1 — Item de menu ativo não reconhece rotas dinâmicas ou aninhadas

**Onde:** `src/components/AppShell.tsx:34,82`

```tsx
const pathname = useRouterState({ select: (s) => s.location.pathname });
...
const active = pathname === it.url; // match exato
```

**Diagnóstico:** ao resolver uma questão em `/app/study/$sessionId` — a tela mais repetida de todo o produto — nenhum item do menu (nem "Estudo") aparece destacado, porque a URL real nunca é exatamente `/app/study`. O mesmo ocorre no Admin ao editar/filtrar dentro de qualquer submódulo. O aluno/admin perde o "você está aqui" durante a tarefa mais frequente do sistema.

**Recomendação:** trocar por `pathname.startsWith(it.url)` (com tratamento para não marcar `/admin` ativo quando a rota é `/admin/courses`, etc. — cuidado apontado também em `RC1_AUDIT.md` B02).

---

### UX-A2 — Duas barras de progresso redundantes na tela de resolução

**Onde:** `src/components/app/study/StudySessionPage.tsx:333-343`

```tsx
<SessionProgress current={question.index + 1} total={question.total} label="Questão" />
<SessionProgress current={answeredCount} total={question.total} label="Respondidas" />
```

**Diagnóstico:** na tela onde o aluno passa a maior parte do tempo (resolver questões — o "produto" propriamente dito, §10 do guia), duas barras idênticas visualmente aparecem uma sob a outra, com números que quase sempre coincidem ("Questão 4 de 20" / "Respondidas 3 de 20"). Isso é carga cognitiva desnecessária em uma tela que o próprio guia manda manter com **"mínima carga cognitiva"**. O aluno precisa parar e entender por que há dois indicadores de progresso muito parecidos.

**Recomendação:** unificar em um único indicador (posição atual) e mover "respondidas" para um rótulo textual secundário, não uma segunda barra.

---

### UX-A3 — Largura da página muda a cada passo do fluxo de estudo

**Onde:** `StudyPage.tsx` (lista: `max-w-3xl`; configurar/criada: `max-w-lg`), `StudySessionPage.tsx` (`max-w-2xl`), `SessionResultsView.tsx` (`max-w-4xl`), `StudentDashboardPage.tsx`/`StudyHistoryPage.tsx` (sem `max-w`, full width)

**Diagnóstico:** dentro da mesma tarefa contínua — escolher disciplina → configurar → resolver → ver resultado — o conteúdo "salta" de largura a cada tela (3xl → lg → 2xl → 4xl). Isso quebra a sensação de continuidade e é perceptível como um "pulo" de layout ao navegar. O guia pede exatamente o oposto no §5 e §8: consistência de padrão entre telas do mesmo fluxo.

**Recomendação:** definir 1–2 larguras máximas padrão para conteúdo de tarefa (ex.: `max-w-2xl` para foco/leitura, `max-w-4xl` para dados tabulares) e aplicá-las de forma previsível por *tipo* de tela, não por página individual.

---

### UX-A4 — Padrão de loading/vazio/erro do Admin não é o mesmo em toda parte

**Onde:** `src/components/admin/shared/AdminTableBody.tsx` usado em ~4–5 de 14 módulos administrativos (Cursos, Bancas, Pacotes, Usuários); os demais (Cargos, Concursos, Disciplinas, Assuntos, Questões, Versões, Distribuições, Assinaturas, Importação) reimplementam a lógica inline

**Diagnóstico:** `AdminTableBody` aplica `role="alert"` no erro e `role="status"` no vazio — ou seja, além da diferença visual, telas que não o usam podem não emitir sinal nenhum para leitores de tela quando uma tabela falha ou está vazia. O guia é explícito: **"Estados vazios, loaders e mensagens de erro seguem o mesmo padrão visual em todo o produto"** (§8). Hoje, ~9 dos 14 módulos administrativos não seguem esse padrão comum, mesmo sendo estruturalmente idênticos entre si (mesma tabela + dialog + alert dialog).

**Recomendação:** estender `AdminTableBody` aos módulos restantes (já listado como pendência opcional em `RC1_CHECKLIST.md`, P8) — do ponto de vista de UX isso deixa de ser "opcional" e passa a ser a forma de cumprir uma regra já escrita no guia oficial.

---

### UX-A5 — Tabelas administrativas densas sem rolagem horizontal

**Onde:** grep por `overflow-x-auto` em `src/` retorna apenas 2 arquivos (`StudyHistoryPage.tsx`, `SessionResultsView.tsx` — ambos do Portal do Aluno). Nenhuma página administrativa usa o wrapper.

**Diagnóstico:** módulos como Questões, Distribuições, Versões e o relatório de Importação têm entre 8 e 11 colunas. Sem um contêiner com `overflow-x-auto`, em telas de tablet/mobile essas tabelas quebram o layout (colunas espremidas ou vazamento horizontal da página), contrariando o §12 do guia — **"Excelente responsividade... estudo em desktop, tablet e mobile"** (o mesmo vale, por extensão, para o trabalho do Admin em tablets). Já apontado como M01 em `RC1_AUDIT.md`; aqui reforçado como um problema de **experiência**, não só de código: sem esse wrapper, o Admin literalmente não consegue operar essas telas fora do desktop.

**Recomendação:** padronizar o wrapper `<div className="overflow-x-auto rounded-md border">` (já usado no Portal do Aluno) em todas as tabelas administrativas.

---

### UX-A6 — Dashboard do Admin: 10 métricas, zero ações

**Onde:** `src/routes/_authenticated/admin/index.tsx:58-79` (`CountCard`, `StatCard`)

```tsx
function StatCard({ title, value, icon: Icon }: ...) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      ...
    </div>
  ); // nenhum <Link>, nenhum onClick
}
```

**Diagnóstico:** o dashboard do Admin apresenta 10 blocos (Cursos, Pacotes, Versões, Questões, Usuários, Assinaturas ativas, Questões publicadas, Questões em revisão, Última importação, Última publicação) em um único grid plano, todos com o mesmo peso visual e **nenhum clicável**. O guia é direto: **"Toda informação exibida deve levar rapidamente a uma ação"** e **"Métricas sem ação associada não devem ocupar espaço privilegiado"** (§9). Hoje o admin vê, por exemplo, "12 questões em revisão" mas precisa navegar manualmente até Importação para agir sobre isso — o dashboard não encurta esse caminho, apenas informa.

**Recomendação:** tornar os cards navegáveis para o módulo correspondente (ex.: clicar em "Questões em revisão" leva a `/admin/import` filtrado por lotes pendentes) e agrupar visualmente por natureza (conteúdo vs. atividade recente vs. ação pendente), em vez de um grid homogêneo.

---

### UX-A7 — Raio e padding fora de uma régua única

**Onde:** `Card` (`rounded-xl`, `card.tsx:9`) vs. `Button`/`Input`/`Badge` (`rounded-md`, `button.tsx:8`, `input.tsx:11`, `badge.tsx:7`) vs. wrappers de tabela ora `rounded-lg` (a maioria das páginas Admin) ora `rounded-md` (Portal do Aluno); padding de card ora `p-5` (StatCards em `admin/index.tsx`, `SessionResultsView.tsx`) ora `p-6` (padrão `CardContent`, `card.tsx:43`)

**Diagnóstico:** o guia declara uma regra explícita e objetiva no §8:

> "**Raio** — Mesmo `border-radius` em cards, botões e inputs" / "**Padding** — Escala consistente (ex.: `p-4`, `p-5`, `p-6`)"

Na prática existem dois valores de raio coexistindo sem critério documentado (controles menores em `rounded-md`, contêineres em `rounded-xl`, mas os *wrappers de tabela* — que são contêineres — oscilam entre os dois) e dois paddings de card usados de forma intercambiável para o mesmo tipo de elemento (cartão de estatística). Isoladamente nenhum dos dois é "feio", mas juntos geram uma textura visual menos precisa do que a que o guia pede.

**Recomendação:** documentar explicitamente os dois níveis de raio como intencionais (ex.: "controles = `rounded-md`, superfícies = `rounded-xl`") e fixar `p-5` **ou** `p-6` como padding único de card de estatística — hoje a escolha parece acidental, não deliberada.

---

## 6. Achados de impacto médio

| ID | Achado | Onde | Por quê importa |
|----|--------|------|------------------|
| **M1** | Botões de ícone sem `aria-label` em parte dos módulos (Pacotes/Versões, per `RC1_AUDIT.md` M09) | `admin/packages`, `admin/versions` | Cursos, Taxonomia e Questões já aplicam `aria-label={`Editar ${nome}`}` — o padrão existe, só não foi levado a todos os módulos |
| **M2** | Logotipo com tamanho e raio diferentes em 3 lugares | Landing `h-9 w-9 rounded-lg` (`index.tsx:14`) · Auth `h-10 w-10 rounded-lg` (`auth.tsx:84`) · Sidebar `h-8 w-8 rounded-md` (`AppShell.tsx:67`) | Mesma marca, três tratamentos — quebra "poucas variações, alta consistência" logo no elemento mais repetido do produto |
| **M3** | Histórico expõe 11 colunas de uma vez, sem priorização para telas estreitas | `StudyHistoryPage.tsx:325-335` | Tem `overflow-x-auto` (correto), mas nenhuma coluna é ocultada/priorizada em mobile — o guia pede *progressive disclosure* quando há excesso de informação (§6.3) |
| **M4** | Diálogos de criação/edição sem `<form>` em parte dos módulos (ex.: Pacotes) | `PackagesPage.tsx` (per `RC1_AUDIT.md` M14) | Enter não submete — quebra a expectativa criada pelos módulos que usam `<form onSubmit>` (Cursos, Taxonomia) |
| **M5** | Paleta escura 100% definida em `styles.css` (`.dark { ... }`), sem nenhum controle de UI para ativá-la | `styles.css:94-122` | Design system "morto" tem risco real: já existe pelo menos uma cor (UX-C2) hardcoded sem variante `dark:` — decidir (ativar com toggle ou remover) evita divergência silenciosa |
| **M6** | Estado vazio no Admin é majoritariamente texto simples; no Aluno usa `EmptyState` com ícone e moldura tracejada | Admin: `"Nenhum curso cadastrado."` inline · Aluno: `<EmptyState icon={...} />` | Mesmo conceito ("nada aqui ainda"), dois níveis de acabamento — quebra "Consistência: mesmos padrões em Admin e Portal do Aluno" (§5) |
| **M7** | Card "Estudar" no dashboard não pré-seleciona a distribuição de origem | `DistributionCard.tsx` → link genérico para `/app/study` (per `RC1_AUDIT.md` M20) | Clique perde contexto — o aluno esperava continuar direto naquela distribuição |
| **M8** | Rótulos "Revisar depois" e "Pendentes de revisão" são conceitualmente próximos | `StudyFilterIndicators.tsx` (per `RC1_AUDIT.md` M19) | Dois filtros distintos (`review_later` vs. questões erradas) competem pelo mesmo verbo "revisar" na cabeça do aluno |
| **M9** | Uso de `font-mono` sem critério documentado (versão, slug, nomes de campo) | `DistributionsPage.tsx:367`, `PackagesPage.tsx:300`, `ImportPage.tsx:454` | Pequena quebra da "tipografia com escala fixa" — funciona, mas não há regra escrita sobre quando um dado "parece código" |

---

## 7. Achados de baixo impacto

| ID | Achado | Onde |
|----|--------|------|
| **B1** | Badge "Em andamento" no card de sessão recém-criada usa a cor primária (`<Badge>` default), a mesma dos botões de ação — ambiguidade sutil entre "isto é um status" e "isto é clicável" | `StudyPage.tsx:146` |
| **B2** | Padrão de campo de busca com ícone (`relative` + `pl-9`) é reconstruído manualmente em cada tela em vez de variante única do `Input` | `CoursesPage.tsx`, `StudyHistoryPage.tsx:224-231`, entre outras |
| **B3** | Rótulos de opção no configurador de sessão (`StudyPage.tsx`) usam `<label>` envolvendo o `RadioGroupItem` sem `htmlFor`/`id` explícitos, diferente do padrão `Label htmlFor` usado nos formulários administrativos | `StudyPage.tsx:182-186` |
| **B4** | `console.log` de debug ainda presente no fluxo de cadastro (já registrado como B01 em `RC1_AUDIT.md`) — citado aqui apenas pelo efeito de "polimento" em produção | `auth.tsx:67-70` |

---

## 8. Ordem sugerida de correção

| Ordem | Achados | Justificativa |
|-------|---------|----------------|
| 1 | UX-C1, UX-A1 | Navegação é a camada que sustenta todos os outros fluxos; sem ela corrigida, qualquer outra melhoria fica difícil de encontrar |
| 2 | UX-C2, A7, M5 | Consolidar o sistema de cor e raio antes de tocar em mais telas evita retrabalho |
| 3 | UX-A2, A3 | Fluxo de estudo é o "produto" (§10 do guia) — maior retorno por esforço |
| 4 | UX-A4, A5, A6 | Consistência e responsividade do Admin |
| 5 | Médios e Baixos (M1–M9, B1–B4) | Polimento contínuo, podem ser distribuídos entre sprints sem bloquear release |

---

## 9. Declaração de escopo

- **Nenhuma alteração de código foi realizada** nesta auditoria.
- Revisão feita por leitura estática de todo o código-fonte relevante (`src/routes/**`, `src/components/admin/**`, `src/components/app/**`, `src/components/ui/**`, `src/components/shared/**`, `src/styles.css`) e da documentação em `docs/`.
- Não foi executado o servidor de desenvolvimento nem capturada tela real do produto — os achados de layout/responsividade decorrem da leitura de classes Tailwind e estrutura JSX, não de teste visual em browser.
- Esta auditoria é complementar a `docs/RC1_AUDIT.md` (funcional) e normatizada por `docs/DESIGN_PRINCIPLES.md` (fonte da verdade de UX/UI do produto).

---

*Relatório gerado na Sprint RC1.2D — Auditoria de UX/UI (Product Design).*
