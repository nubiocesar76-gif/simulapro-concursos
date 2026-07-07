# RC2.1A — Auditoria de UX/UI do Portal Administrativo

**Escopo:** 14 módulos do `/admin`. Frente a `UI_PREMIUM_GUIDELINES_RC2.0.md`, `DESIGN_SYSTEM.md`, `UX_AUDIT_RC1.2D.md`/`UX_BACKLOG.md` (achados já existentes, citados por ID, não repetidos) e `RC1_AUDIT.md` (achados funcionais com efeito visual).
**Natureza:** apenas auditoria. Nenhuma solução, implementação, regra de negócio ou arquitetura proposta aqui.

---

### Dashboard Admin (`/admin`)

**Pontos fortes:** dados corretos, carregamento via React Query, ícones consistentes.
**Problemas encontrados:** 10 blocos (6 `CountCard` + 4 `StatCard`) num único grid plano, todos com o mesmo peso, nenhum clicável (`UXB-A6`); sem agrupamento por natureza (conteúdo vs. atividade vs. pendência); nenhuma ação sugerida a partir de um número (ex.: "questões em revisão" não leva a Importação).
**Impacto:** primeira tela do portal não aponta próximo passo — o mesmo problema já corrigido no Dashboard do Aluno (`RC1.2H`) segue sem tratamento aqui.
**Prioridade:** Alta.

---

### Cursos (`/admin/courses`)

**Pontos fortes:** referência do portal — `AdminTableBody` (loading/empty/erro padronizado com `role`), busca com debounce, `<form onSubmit>`, paginação, bloqueio de exclusão por dependências.
**Problemas encontrados:** sem `overflow-x-auto` (baixo risco aqui, poucas colunas); tipografia/raio ainda não alinhados a `UI_PREMIUM_GUIDELINES_RC2.0.md` (cabeçalho de tabela sem tracking, radius de wrapper `rounded-lg` vs. regra única de `DESIGN_SYSTEM.md` §5).
**Impacto:** módulo mais próximo do padrão-alvo — funciona como gabarito para os demais.
**Prioridade:** Baixa.

---

### Bancas (`/admin/boards`)

**Pontos fortes:** mesma estrutura de Cursos, incluindo `AdminTableBody`.
**Problemas encontrados:** mesmos da Cursos (radius/tipografia pendentes de `RC2.0`).
**Impacto:** igual a Cursos.
**Prioridade:** Baixa.

---

### Cargos (`/admin/positions`)

**Pontos fortes:** CRUD completo, busca, paginação, bloqueio de exclusão.
**Problemas encontrados:** não usa `AdminTableBody` — loading/empty/erro reimplementados inline (`UXB-A4`); demais pontos iguais a Cursos.
**Impacto:** mesma tela, dois padrões de estado diferentes dentro do próprio portal.
**Prioridade:** Média.

---

### Concursos (`/admin/exams`)

**Pontos fortes:** idem Cargos.
**Problemas encontrados:** idem Cargos (`UXB-A4`).
**Impacto:** idem Cargos.
**Prioridade:** Média.

---

### Disciplinas (`/admin/subjects`)

**Pontos fortes:** idem Cargos.
**Problemas encontrados:** idem Cargos (`UXB-A4`).
**Impacto:** idem Cargos.
**Prioridade:** Média.

---

### Assuntos (`/admin/topics`)

**Pontos fortes:** idem Cargos.
**Problemas encontrados:** idem Cargos (`UXB-A4`); adicionalmente, filtro por disciplina só existe no formulário de criação/edição, não na listagem — em curso com muitas disciplinas, achar assuntos de uma disciplina específica exige rolar a lista inteira.
**Impacto:** único módulo da família taxonomia com uma lacuna de filtro própria, não só de padrão de estado.
**Prioridade:** Média.

---

### Questões (`/admin/questions`)

**Pontos fortes:** painel de filtro mais completo do portal (10 campos), alternativas dinâmicas, bloqueio de exclusão por vínculo.
**Problemas encontrados:** não usa `AdminTableBody` (`UXB-A4`); sem `overflow-x-auto` na tabela mais larga do portal (`UXB-A5`); painel de 10 filtros sem agrupamento/hierarquia entre si (todos com o mesmo peso visual, nenhum "mais usado" em destaque); diálogo de edição (`max-w-3xl`, `max-h-[90vh] overflow-y-auto`) mistura formulário longo com rolagem interna, sem separação visual entre "dados da questão" e "alternativas".
**Impacto:** é a tela onde o Admin passa mais tempo (curadoria do produto central, `DESIGN_PRINCIPLES.md` §10) e é também a mais densa sem tratamento de densidade.
**Prioridade:** Alta.

---

### Pacotes (`/admin/packages`)

**Pontos fortes:** usa `AdminTableBody`, filtros por curso/status, slug automático.
**Problemas encontrados:** diálogo sem `<form>` — Enter não submete (`UXB-M4`); botões de ícone sem `aria-label` (`UXB-M1`).
**Impacto:** dois gaps pontuais de interação/acessibilidade num módulo por lo mais estruturado.
**Prioridade:** Média.

---

### Distribuições (`/admin/distributions`)

**Pontos fortes:** filtros curso/pacote/versão/status, ativar/desativar com auditoria.
**Problemas encontrados:** não usa `AdminTableBody` (`UXB-A4`); sem `overflow-x-auto` (`UXB-A5`); mensagem de vazio única, sem distinguir "sem dados" de "filtro sem resultado" (`RC1_AUDIT.md` M04).
**Impacto:** mesmo padrão de lacunas dos módulos "Regular", sem agravante próprio.
**Prioridade:** Média.

---

### Versões (`/admin/versions`)

**Pontos fortes:** fluxo de publicação com confirmação, colunas de auditoria (publicado em/por).
**Problemas encontrados:** não usa `AdminTableBody` (`UXB-A4`); sem `overflow-x-auto` (`UXB-A5`); botões de ícone sem `aria-label` (`UXB-M1`); dropdown de pacote no diálogo de criação herda o filtro de curso da listagem, podendo parecer incompleto/vazio sem explicação visível (`RC1_AUDIT.md` A07).
**Impacto:** o único módulo onde um campo de formulário pode parecer quebrado por herdar estado de outra parte da tela.
**Prioridade:** Média.

---

### Assinaturas (`/admin/subscriptions`)

**Pontos fortes:** filtros usuário/distribuição/status, validação de datas.
**Problemas encontrados:** não usa `AdminTableBody` (`UXB-A4`); sem `overflow-x-auto` (`UXB-A5`); assinaturas legadas sem `distribution_id` são excluídas da listagem sem aviso (`RC1_AUDIT.md` M15) — Admin pode subestimar o total real sem saber.
**Impacto:** risco de confiança no dado exibido, tema sensível para um portal cujo valor de marca é "confiança" (`DESIGN_PRINCIPLES.md` §1).
**Prioridade:** Média.

---

### Importação (`/admin/import`)

**Pontos fortes:** wizard completo (curso→pacote→versão→arquivo→validar→relatório→aplicar), preview antes de aplicar, confirmação antes de aplicar lote.
**Problemas encontrados:** cards de estatística do relatório usam um estilo próprio (`rounded-lg border bg-background p-3`), diferente de todo outro card de estatística do produto (`rounded-xl border bg-card p-5 shadow-sm`); badge "Aviso" com cor hardcoded (`bg-amber-500/15`), mesma família do achado de token de cor já fechado em outras telas (`UXB-C2`); tabela de detalhes do relatório usa rolagem vertical fixa (`max-h-80 overflow-auto`) em vez do padrão de paginação do resto do produto — dois modelos de "ver mais" diferentes na mesma tela (rolar vs. paginar).
**Impacto:** é o "fluxo sagrado" do portal (`00-VISAO-GERAL.md`) e a tela visualmente mais divergente do restante do Admin — quem chega aqui vindo de qualquer outro módulo encontra um sistema de cartões e de "ver mais" diferente.
**Prioridade:** Alta.

---

### Histórico de importações (dentro de `/admin/import`)

**Pontos fortes:** relatório por lote com status e contadores.
**Problemas encontrados:** `.limit(30)` sem paginação (`RC1_AUDIT.md` M16) — lotes além do 30º simplesmente não aparecem, sem indicação de que a lista está truncada; sem estado de loading/erro visível enquanto a consulta roda (`RC1_AUDIT.md` A09) — tabela aparece vazia até os dados chegarem, indistinguível de "não há lotes".
**Impacto:** dois estados obrigatórios do produto (carregando, truncado) estão ausentes, não apenas estilizados de forma diferente — é uma lacuna estrutural, não só cosmética.
**Prioridade:** Alta.

---

## Resumo Geral

| Módulo | Classificação |
|---|---|
| Dashboard Admin | Precisa redesign |
| Cursos | Bom |
| Bancas | Bom |
| Cargos | Regular |
| Concursos | Regular |
| Disciplinas | Regular |
| Assuntos | Regular |
| Questões | Precisa redesign |
| Pacotes | Regular |
| Distribuições | Regular |
| Versões | Regular |
| Assinaturas | Regular |
| Importação | Precisa redesign |
| Histórico de importações | Precisa redesign |

Nenhum módulo classificado como "Excelente" — nenhum foi ainda auditado contra `UI_PREMIUM_GUIDELINES_RC2.0.md` no nível de implementação; Cursos/Bancas são a referência estrutural mais próxima do alvo.

### Ordem recomendada de redesign

1. **Dashboard Admin** — maior impacto por menor esforço; mesmo padrão de correção já aprovado para o Dashboard do Aluno (`RC1.2H`) é diretamente aplicável.
2. **Importação + Histórico de importações** — tela mais divergente do padrão do produto e com lacunas estruturais de estado (não só estilo); é o fluxo central da missão do Admin.
3. **Questões** — tela de maior uso e densidade, sem tratamento de hierarquia de filtros nem de tabela larga.
4. **Família Taxonomia (Cargos, Concursos, Disciplinas, Assuntos)** — mesma correção (adoção de `AdminTableBody`) resolve os quatro de uma vez, usando Cursos/Bancas como gabarito já validado.
5. **Pacotes, Versões, Distribuições, Assinaturas** — mesmo pacote de correções recorrentes (`AdminTableBody`, `overflow-x-auto`, `aria-label`), aplicável em sequência por serem estruturalmente equivalentes entre si.

---

*RC2.1A — Auditoria. Nenhuma implementação realizada.*
