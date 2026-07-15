# FREEMIUM_AUDIT — Auditoria Crítica da Estratégia Freemium

**Documento:** Auditoria independente de `FREEMIUM_STRATEGY.md`
**Data:** 2026-07-15
**Papel assumido:** auditor externo — mesma disciplina de `AUDITORIA_FINAL.md`: não validar automaticamente, procurar o que quebra.
**Escopo:** apenas auditoria. Nenhum código foi escrito, nenhum arquivo do sistema foi alterado, nenhum banco foi tocado.

---

## 0. Metodologia

Esta auditoria verificou cada afirmação técnica de `FREEMIUM_STRATEGY.md` contra o schema real do banco (`src/integrations/supabase/types.ts`) e contra decisões já implementadas em fases anteriores (`04-LANDING.md`, RC4.1/`ActivatePlanCard.tsx`, `P0_IMPLEMENTATION_PLAN.md`). O achado mais grave desta auditoria (AUD-F01) não estava sequer mencionado na estratégia original.

---

## 1. Achados

### AUD-F01 — A arquitetura atual não suporta "20 questões curadas" como uma distribuição própria sem duplicar dados

- **Descrição:** `FREEMIUM_STRATEGY.md` §9 propõe que a Demo tenha "um `package_version` próprio, contendo apenas as 20 questões curadas", tratando isso como "decisão de implementação, não desta fase". Isso não é um detalhe de implementação — é uma questão de viabilidade arquitetural. Verificado no schema: `questions.package_version_id` é uma coluna única (`string | null`), ou seja, **cada questão pertence a exatamente um `package_version`**. As 20 questões escolhidas para a demo já pertencem ao `package_version` do Acervo Enfermeiro publicado (`banco-de-questoes-enfermagem@1.0`). Para que elas também "pertençam" a uma distribuição Demo separada, existem apenas duas saídas: (a) duplicar as 20 questões como novas linhas com um `package_version_id` diferente — cria dado duplicado que pode divergir do original se um dia for corrigido (ex.: erro de gabarito corrigido em um lado e não no outro); ou (b) mudar o modelo de acesso de granularidade "por `package_version`" para "por lista de questões" — o que é uma mudança de arquitetura, exatamente o que `FASE 10` pediu para não fazer.
- **Documento:** `FREEMIUM_STRATEGY.md` §2, §9.
- **Impacto:** Alto — invalida a alegação central do documento de que "nada aqui cria um sistema paralelo" (§0). Sem resolver isso, a Demo não pode ser implementada como descrita sem violar a própria regra que a estratégia se impôs.
- **Probabilidade:** Certa — não é um risco, é uma lacuna de design já presente no documento como está.
- **Prioridade:** P0 (bloqueia qualquer planejamento de sprint de implementação até ser resolvido).
- **Recomendação:** decidir explicitamente entre as duas saídas acima antes de qualquer sprint da seção 12 ser iniciada — provavelmente (a), aceitando a duplicação controlada como o menor mal, com uma nota clara de que futuras correções editoriais nas 20 questões precisam ser replicadas manualmente nos dois lugares até (se algum dia acontecer) o modelo de distribuição evoluir para suportar subconjuntos.

---

### AUD-F02 — Contradição direta com RC4.1: o card de conversão já implementado ficaria morto

- **Descrição:** RC4.1 (implementado nesta mesma sessão) adicionou a `ActivatePlanCard` exatamente para o caso `data.distributions.length === 0` em `StudentDashboardPage.tsx` e `StudyPage.tsx`. A Freemium, por desenho (§9, trigger `handle_new_user` concedendo automaticamente uma `subscriptions` para a distribuição Demo), garante que **todo novo usuário terá `distributions.length >= 1` desde o primeiro segundo** — a condição que a `ActivatePlanCard` foi construída para detectar deixa de ocorrer para contas novas. `FREEMIUM_STRATEGY.md` não menciona essa interação em nenhum momento.
- **Documento:** `FREEMIUM_STRATEGY.md` §9 (F3) vs. `RC4.1` (implementado, não documentado nesta fase por não ser parte da Fase Comercial).
- **Impacto:** Médio-alto — não é um bug que quebra o sistema, mas é uma peça de UX recém-construída que se tornaria, na prática, código morto para contas novas assim que a Freemium for implementada, sem nenhuma decisão explícita de descartá-la ou adaptá-la.
- **Probabilidade:** Certa, assim que F2 (trigger) e F3 (Dashboard) forem implementados juntos.
- **Prioridade:** P1.
- **Recomendação:** a sprint F3 precisa tratar explicitamente os **três** estados (sem demo feita / demo feita sem plano / assinante), substituindo o comportamento de RC4.1 em vez de coexistir silenciosamente com ele — isso já está parcialmente implícito em `FREEMIUM_STRATEGY.md` §9, mas precisa ser dito explicitamente como uma migração da lógica existente, não uma adição.

---

### AUD-F03 — Contradição estratégica com o posicionamento "sem trial" já aprovado e publicado

- **Descrição:** `04-LANDING.md` §4 lista, como um dos seis "contrapontos de CRO" deliberados, que **"a ausência de trial gratuito é tratada como fato a ser compensado, não escondido"** — uma decisão estratégica já aprovada e já implementada na Landing real (verificada nesta sessão). A Freemium introduz, de fato, um trial gratuito (a Demo). Isso não é incompatível por princípio, mas exige **reverter uma decisão de posicionamento já publicada**, não apenas adicionar uma funcionalidade nova por cima dela.
- **Documento:** `04-LANDING.md` §4 vs. `FREEMIUM_STRATEGY.md` (todo o documento).
- **Impacto:** Alto — se a Freemium for implementada sem revisar a Landing, o site vai simultaneamente dizer (na seção de FAQ ou copy) que não há período gratuito e oferecer uma demonstração gratuita, o que é uma contradição literal visível ao visitante.
- **Probabilidade:** Certa, se a implementação seguir apenas o roadmap técnico da seção 12 sem incluir uma revisão de copy da Landing.
- **Prioridade:** P0 para o momento da implementação (não bloqueia esta fase de arquitetura, mas deve ser uma sprint explícita, hoje ausente da seção 12).
- **Recomendação:** adicionar uma sprint de revisão de copy da Landing/FAQ ao roadmap antes de lançar a Freemium — `FREEMIUM_STRATEGY.md` §12 não prevê isso.

---

### AUD-F04 — O controle de "não repetir" depende de uma verificação de aplicação, não de um limite estrutural de dado

- **Descrição:** A `subscriptions` row da Demo, como desenhada, não tem necessariamente um `expires_at` curto — o controle contra repetição descrito em §8 é "verificar se já existe uma `study_sessions FINISHED`" antes de permitir nova sessão. Isso é uma checagem de aplicação, não um limite de dado. Se essa checagem não for implementada em todos os pontos de entrada (ex.: só no botão da UI, não na função de servidor que cria a sessão), a distribuição Demo continua **estruturalmente acessível para sempre** para quem burlar a checagem client-side.
- **Documento:** `FREEMIUM_STRATEGY.md` §1, §8, §9.
- **Impacto:** Médio — não é um risco financeiro (a Demo não envolve pagamento), mas é uma inconsistência entre o princípio "não é um plano gratuito" e o desenho técnico real, que é uma concessão de acesso permanente com um único freio de aplicação.
- **Probabilidade:** Média — depende inteiramente de onde a checagem for implementada.
- **Prioridade:** P1.
- **Recomendação:** decidir, na sprint F5, que a verificação seja feita no lado servidor (na função que cria a sessão), não apenas ocultando o botão na UI — e considerar, como defesa adicional, um `expires_at` curto na própria `subscriptions` da Demo (ex.: 48h após a criação da conta), reduzindo a superfície de um eventual bug de aplicação.

---

### AUD-F05 — Sem plano para o que acontece com a `subscriptions` da Demo após a conversão

- **Descrição:** Nem `FREEMIUM_STRATEGY.md` nem o roadmap da seção 12 definem o que ocorre com a `subscriptions` row da distribuição Demo depois que o aluno compra o Plano Mensal ou o Fundador. Se ela permanecer `ACTIVE` indefinidamente, `fetchAvailableDistributions` passaria a mostrar **duas distribuições simultâneas** no Dashboard de um assinante pagante (a Demo de 20 questões + o Acervo completo) — poluindo a tela "Seu Acervo" (RC4.1) que foi desenhada presumindo uma relação simples entre o aluno e seu conteúdo.
- **Documento:** `FREEMIUM_STRATEGY.md` §9, §12 (ausente).
- **Impacto:** Médio — não é um risco de segurança, é um problema de UX/clareza que reintroduziria confusão exatamente onde a RC4.1 tentou simplificar.
- **Probabilidade:** Certa, se não for tratado.
- **Prioridade:** P1.
- **Recomendação:** adicionar ao roadmap uma ação explícita (dentro de F7 ou como sprint própria) para desativar (`status: INACTIVE`) a `subscriptions` da Demo no momento em que uma assinatura paga for ativada — reaproveita a mesma tabela, é uma linha de lógica adicional no fluxo de ativação já existente.

---

### AUD-F06 — Preço do Plano Mensal (R$34,90) não tem a mesma rigor de fundamentação que `03-PRICING.md` exigiu de si mesmo

- **Descrição:** `03-PRICING.md` estabeleceu três faixas com pesquisa de concorrência (Conservadora R$14,90-19,90; Competitiva ~R$24,90; Premium R$39,90-49,90) antes de fixar qualquer preço — princípio repetido em toda a Fase Comercial ("não assumir preço sem análise"). O valor de R$34,90 do Plano Mensal é proposto em `FREEMIUM_STRATEGY.md` §5 sem nenhuma pesquisa equivalente — é um número que "cai bem" entre duas faixas já aprovadas, mas não foi validado com a mesma disciplina.
- **Documento:** `FREEMIUM_STRATEGY.md` §5 vs. `03-PRICING.md` (todo o documento).
- **Impacto:** Médio — não é um erro grave, mas quebra a consistência metodológica que todas as fases anteriores mantiveram.
- **Probabilidade:** Certa (o número já está escrito sem essa análise).
- **Prioridade:** P2.
- **Recomendação:** tratar R$34,90 como uma hipótese de trabalho, não uma decisão final — validar com o mesmo tipo de análise de elasticidade já feita em `03-PRICING.md` antes de configurar `COMMERCIAL_PLANS` (sprint F7).

---

### AUD-F07 — O teto de vagas do Fundador, já sem controle técnico, fica mais exposto com um funil que aumenta o volume de interessados

- **Descrição:** Já registrado como gap aberto em `JURIDICO.md` e `GO_NO_GO.md`: não existe mecanismo técnico que impeça vender além de 50 vagas do Plano Fundador. `FREEMIUM_STRATEGY.md` §11, risco 6, já reconhece isso, mas não propõe nenhuma mitigação nem prioriza a resolução desse gap antes do lançamento da Freemium — apenas observa que o problema fica "mais urgente".
- **Documento:** `FREEMIUM_STRATEGY.md` §11 (risco 6).
- **Impacto:** Médio (risco jurídico já mapeado, não novo, mas amplificado).
- **Probabilidade:** Aumenta proporcionalmente ao sucesso da própria Freemium — um risco que cresce com o sucesso do que está sendo proposto.
- **Prioridade:** P1.
- **Recomendação:** resolver o controle de vagas do Fundador antes de lançar a Freemium, não depois — a ordem inversa (lançar o funil que gera mais volume antes de corrigir o controle) inverte a lógica de prioridade que o próprio `P0_IMPLEMENTATION_PLAN.md` estabeleceu.

---

### AUD-F08 — Instrumentação de métricas não avançou nada em relação ao gap já conhecido

- **Descrição:** `05-CHECKOUT.md`, `UX_AUDIT.md` e `GO_NO_GO.md` já registram que não existe analytics de funil no produto. `FREEMIUM_STRATEGY.md` §10 introduz KPIs novos (taxa de conclusão da Demo, tempo médio cadastro→Demo, tempo médio Demo→conversão) que dependem exatamente dessa mesma instrumentação ausente — e o roadmap da seção 12 trata isso como "F8: a definir na implementação", ou seja, adia a única peça sem a qual nenhuma das métricas centrais da Freemium pode ser avaliada.
- **Documento:** `FREEMIUM_STRATEGY.md` §10, §12 (F8).
- **Impacto:** Alto para a capacidade de avaliar se a Freemium está funcionando — não para a viabilidade técnica de implementá-la.
- **Probabilidade:** Certa, enquanto a instrumentação não for tratada como pré-requisito, não como sprint final.
- **Prioridade:** P1.
- **Recomendação:** mover a instrumentação mínima para o início do roadmap (antes de F1, não depois de F7) — sem dado de funil, o critério de sucesso da Freemium (seção 10) não pode ser avaliado no momento em que mais importa: logo após o lançamento.

---

## 2. Contradições — síntese

| Contradição | Lado A | Lado B |
|---|---|---|
| "Sem sistema paralelo" | `FREEMIUM_STRATEGY.md` §0 | Modelo de acesso por `package_version_id` único não suporta subconjunto de questões sem duplicação ou mudança de granularidade (AUD-F01) |
| Estado vazio do Dashboard | RC4.1 (`ActivatePlanCard`, já implementado) | Freemium garante `distributions.length >= 1` desde o cadastro, tornando a condição de RC4.1 inatingível para contas novas (AUD-F02) |
| "Sem trial gratuito" como diferencial de confiança | `04-LANDING.md` §4 (já publicado) | Demo é, na prática, um trial gratuito (AUD-F03) |
| "Não é um plano gratuito" | `FREEMIUM_STRATEGY.md` §0 | Controle real de acesso depende de uma checagem de aplicação sobre uma concessão de dado sem limite estrutural (AUD-F04) |

---

## 3. O que a estratégia acertou (sem elogio automático, com verificação)

- A escolha do EBSERH 2023/IBFC como prova de demonstração é bem fundamentada e verificável nos dados reais (`questions.json`) — confirmado nesta auditoria, incluindo o achado adicional (já presente na própria estratégia) sobre o desbalanceamento de disciplinas.
- O reaproveitamento de `StudySessionPage`, `SessionResultsView` e demais componentes de sessão está corretamente identificado como zero-alteração — confirmado: esses componentes já operam genericamente sobre `sessionId`, sem qualquer acoplamento a "sessão paga".
- O modelo de preço do Plano Mensal sem recorrência automática reaproveita corretamente a correção já feita na Sprint P0.3 (`accessDurationMonths`, `computeCommercialExpiresAt`) sem exigir nenhuma mudança no webhook — verificado, essa lógica já é genérica por plano, não hardcoded para o Fundador.

---

## 4. Veredito

### A arquitetura Freemium está pronta para avançar para planejamento de implementação?

# **NÃO, ainda não — um achado bloqueador (AUD-F01) precisa ser resolvido primeiro.**

`FREEMIUM_STRATEGY.md` é uma estratégia comercial bem construída, mas trata como "detalhe de implementação" exatamente a questão que decide se ela é implementável do jeito que promete (sem sistema paralelo). Antes de transformar a seção 12 em sprints reais:

1. **Resolver AUD-F01** — decidir como as 20 questões da Demo coexistem com o `package_version_id` único de cada questão, sem isso o resto do roadmap não tem uma fundação sólida.
2. **Resolver AUD-F02 e AUD-F05** — como a Demo interage com o que já foi implementado em RC4.1 (card de conversão e leitura de "Seu Acervo").
3. **Registrar AUD-F03 como sprint explícita** — revisão da Landing/FAQ antes do lançamento, não como reboque.
4. **Priorizar AUD-F07** — resolver o controle de vagas do Fundador antes, não depois, do funil que aumenta a demanda por ele.

Os demais achados (AUD-F06, AUD-F08) são ajustes de rigor, não bloqueadores — mas devem ser corrigidos antes da primeira sprint de implementação real, não durante.

---

*Fim da auditoria. Nenhum outro documento foi alterado. Nenhum código foi escrito. Nenhuma implementação foi iniciada.*
