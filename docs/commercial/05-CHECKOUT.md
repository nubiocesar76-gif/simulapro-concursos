# 05 — CHECKOUT

**Fase:** 7 — Comercial
**Documento:** Jornada comercial completa — do clique em "Assinar" à primeira questão resolvida
**Data:** 2026-07-09
**Pré-requisitos:** `01-GO_LIVE.md`, `02-PLANS.md`, `03-PRICING.md`, `04-LANDING.md` (aprovados)
**Escopo:** projeto da jornada e das políticas. Nenhum código, componente, API ou tabela é criado aqui — o que existe, existe; o que falta, é listado como pendência.

---

## 0. Diagnóstico — o que já existe de verdade

Antes de projetar qualquer coisa, verifiquei o código real (não apenas a documentação anterior, que em parte está desatualizada). Isto muda o que este documento precisa cobrir:

| Peça | Existe hoje? | Onde |
|---|---|---|
| Gateway oficial | **Asaas** (não Stripe — `COMMERCIAL_V1_ROADMAP.md` recomendava Stripe, mas `PAYMENT_GATEWAY_ARCHITECTURE_V1.md`, mais recente, já decidiu Asaas como oficial) | — |
| Criação de cliente/assinatura no Asaas | Sim, implementado | `src/integrations/asaas/AsaasService.server.ts` |
| Correlação evento ↔ aluno | Sim, via `externalReference` (`simulapro:{userId}:{distributionId}`), sem coluna nova no banco | `src/integrations/asaas/reference.server.ts` |
| Endpoint/handler de webhook | Sim, com validação de token, idempotência e despacho de 7 eventos | `src/lib/asaas-webhook.server.ts` |
| Tela "Minha Assinatura" | Sim, já existe e já funciona (diferente do que `COMMERCIAL_V1_ROADMAP.md` registrava como "hoje inexistente") | `src/components/app/subscription/SubscriptionPage.tsx`, rota `/app/subscription` |
| Catálogo de planos comerciais → seleção → checkout | Sim, o fluxo existe ponta a ponta: escolher plano, informar CPF, redirecionar para a fatura do Asaas | `src/lib/student-subscription.functions.ts` (`iniciarCheckout`), `src/config/commercial-plans.ts` |
| Consulta de status ao vivo (aluno) | Sim | `getAsaasLiveStatus` em `student-subscription.functions.ts` |
| **Lista de planos comerciais reais** | **Não — array vazio por padrão** (`COMMERCIAL_PLANS = []`), com comentário explícito no código: "a equipe adiciona os planos reais antes de abrir vendas" | `src/config/commercial-plans.ts` |
| Botão de cancelamento self-service | **Não existe na UI** — a tela mostra status e link de fatura (Asaas), mas nenhuma ação de cancelar pela interface do SimulaPro, embora `AsaasService.cancelarAssinatura()` já exista pronto no backend | `SubscriptionPage.tsx` (ausente), `AsaasService.server.ts` (presente, não chamado por nenhuma tela) |
| Neutralização de recorrência automática | **Não** — o modelo técnico usa assinatura Asaas nativa (`MONTHLY`/`YEARLY`), inerentemente recorrente; nada no fluxo atual cancela a assinatura Asaas após o primeiro pagamento | Ver seção 10.1 — **gap crítico** |
| Visão do Admin sobre pagamentos/faturas | **Parcial** — `/admin/subscriptions` mostra status local (`ACTIVE`/`INACTIVE`), mas não consulta o Asaas ao vivo como a tela do próprio aluno já faz | `src/components/admin/subscriptions/SubscriptionsPage.tsx` |
| Tela de logs/auditoria para Admin | **Não existe** — os eventos do webhook são gravados detalhadamente na tabela `logs`, mas não há nenhuma tela que leia isso | Confirmado: nenhum arquivo de UI de logs no projeto |
| Redirecionamento pós-cadastro para a oferta | **Não existe** — login/cadastro leva a `/app` (dashboard), que não referencia `/app/subscription` em nenhum lugar | `src/routes/auth.tsx`, `StudentDashboardPage.tsx` |

Este diagnóstico não é uma crítica ao trabalho já feito — ao contrário, o núcleo técnico (webhook, idempotência, correlação, criação de cobrança) está mais maduro e mais bem pensado do que a documentação comercial anterior registrava. O que falta é menor em volume, mas é exatamente o que decide se o produto pode ir ao ar com segurança: **um plano de verdade configurado, o cancelamento funcionando, e a recorrência do gateway alinhada com a decisão de negócio já aprovada em `02-PLANS.md`.**

---

## 1. Mapa completo da jornada

```
① Landing (04-LANDING.md)
    CTA: "Garantir minha vaga no Plano Fundador"
        ↓
② Cadastro ou Login (/auth)
    Conta criada → role "student" automática (trigger handle_new_user, já existente)
        ↓
③ Dashboard (/app)
    ⚠️ GAP: hoje não há nenhum direcionamento automático para quem ainda não assinou
        ↓ (aluno precisa navegar manualmente até "Minha Assinatura")
④ Escolher plano (/app/subscription — PlanCatalog)
    Lista de planos vindos de COMMERCIAL_PLANS (hoje vazia — pré-requisito de lançamento)
        ↓ clique em "Assinar"
⑤ Confirmação de CPF (modal, já implementado)
        ↓ iniciarCheckout()
⑥ Redirecionamento para a fatura do Asaas (ambiente do próprio gateway, fora do SimulaPro)
    Aluno escolhe Pix, cartão ou boleto na interface do Asaas
        ↓
⑦ Pagamento confirmado no Asaas
        ↓ webhook: SUBSCRIPTION_CREATED (assinatura local criada como INACTIVE)
        ↓ webhook: PAYMENT_CONFIRMED / PAYMENT_RECEIVED (ativação real)
⑧ Assinatura local ativada (subscriptions.status = ACTIVE, expires_at calculado)
        ↓ (nenhuma ação adicional — content_distributions já existente é a mesma referenciada no plano)
⑨ Distribuição liberada (automática — é a mesma distribution_id do plano comprado)
        ↓
⑩ Aluno retorna ao SimulaPro (link "voltar" da fatura do Asaas, ou navega manualmente)
    /app/subscription agora mostra o card de assinatura ativa
        ↓
⑪ Primeiro acesso a /app/study
    Distribuição aparece na lista (validateSessionAccess já existente confirma assinatura ACTIVE + distribuição ACTIVE)
        ↓
⑫ Primeira sessão de estudo
    createStudySession → startStudySession → primeira questão resolvida
```

**Dois pontos de fricção que o mapa já revela, antes de qualquer seção de erro:**

- **Etapa ③→④:** não há ponte automática entre "acabei de criar minha conta" e "aqui está o plano que você quer comprar". Ver seção 4.3 para o tratamento recomendado.
- **Etapa ⑥→⑩:** o aluno sai do domínio do SimulaPro para pagar (fatura hospedada pelo Asaas) e precisa voltar por conta própria. Ver seção 4.6 para como reduzir o risco de abandono nesse intervalo.

---

## 2. Estados

### 2.1 Estados de pagamento (nível da cobrança individual no Asaas)

| Estado | Definição | Evento/sinal correspondente |
|---|---|---|
| **Iniciado** | Assinatura criada no Asaas, primeira cobrança gerada, aluno ainda não concluiu o pagamento na fatura | `SUBSCRIPTION_CREATED` recebido; assinatura local existe com `status = INACTIVE` |
| **Pendente** | Cobrança emitida (Pix aguardando leitura, boleto aguardando compensação, cartão em processamento) | Nenhum evento de confirmação ainda recebido; `getAsaasLiveStatus` retorna `AGUARDANDO_PAGAMENTO` |
| **Aprovado** | Pagamento confirmado (Pix/cartão) ou recebido/compensado (boleto) | `PAYMENT_CONFIRMED` ou `PAYMENT_RECEIVED` |
| **Recusado** | Cartão recusado pelo emissor, ou cobrança vencida sem pagamento (Pix/boleto) | `PAYMENT_OVERDUE` |
| **Expirado** | Cobrança específica (ex.: Pix com prazo de leitura) venceu sem pagamento | Tratado como `PAYMENT_OVERDUE` no modelo atual — o Asaas não distingue "Pix expirado" de "boleto vencido" como eventos separados |
| **Cancelado** | Cobrança removida antes de qualquer pagamento | `PAYMENT_DELETED` |
| **Reembolso** | Valor devolvido ao aluno após pagamento confirmado | `PAYMENT_REFUNDED` — **não tratado no handler atual** (ver seção 10.2) |
| **Chargeback** | Contestação da cobrança pelo emissor do cartão, após confirmação | Não modelado como evento distinto no handler atual — no Asaas, isso tipicamente chega como uma atualização de status de pagamento; **tratamento a definir na implementação** (ver seção 10.2) |

### 2.2 Estados de assinatura (nível do vínculo aluno ↔ distribuição, local)

| Estado | Definição | Onde vive |
|---|---|---|
| **Criada, aguardando pagamento** | Linha existe em `subscriptions`, `status = INACTIVE`, sem `expires_at` | Criada por `SUBSCRIPTION_CREATED` |
| **Ativa** | `status = ACTIVE`, `expires_at` no futuro | Criada/atualizada por `PAYMENT_CONFIRMED`/`PAYMENT_RECEIVED` |
| **Em atraso** | `status = ACTIVE` localmente, mas o Asaas reporta cobrança vencida — estado *transitório* que a tela do aluno já exibe (`EM_ATRASO`) antes da desativação efetiva | Detectado ao vivo por `getAsaasLiveStatus`, não altera o `status` local sozinho |
| **Expirada** | `status = ACTIVE` localmente, mas `expires_at` já passou | Calculado na exibição (`resolveDisplayStatus`) — **atenção:** confirmar se o controle de acesso real (não só a exibição) também respeita `expires_at`, não somente `status` (ver seção 10.3) |
| **Inativa/cancelada** | `status = INACTIVE` | `PAYMENT_OVERDUE`, `SUBSCRIPTION_UPDATED` (status ≠ ACTIVE), ou `SUBSCRIPTION_CANCELLED` |
| **Renovação manual** | Aluno decide comprar novo ciclo após expiração — **fluxo não distinto de uma primeira compra** no modelo atual: é um novo `iniciarCheckout()` para o mesmo plano | Ver seção 10.1 sobre por que isso é o comportamento correto para o modelo "acesso por ciclo" de `02-PLANS.md` |

---

## 3. Experiência por etapa

### 3.1 Landing → CTA

Já projetado em `04-LANDING.md`. Ponto de reforço aqui: o CTA leva ao cadastro, não a uma tela de pagamento direta — a copy já comunica isso corretamente ("Garantir minha vaga", não "Pagar agora").

### 3.2 Cadastro/Login

- **O que o aluno vê:** tela `/auth`, abas "Entrar" / "Criar conta", já existente e testada.
- **Mensagem a reforçar nesta etapa (texto de apoio, não é uma nova tela):** "Depois de criar sua conta, você escolhe o Plano Fundador na próxima tela" — reduz a ansiedade de "criei conta e agora o quê?".
- **Como reduzir ansiedade:** deixar claro, antes do cadastro, que nenhum pagamento é pedido nesta etapa — só e-mail e senha.

### 3.3 Dashboard sem assinatura (gap identificado na seção 0)

- **O que o aluno vê hoje:** o dashboard padrão (`/app`), com cartões zerados (0 sessões, 0 distribuições) — sem nenhuma chamada explícita para assinar.
- **Recomendação de produto (documentação, não implementação):** o dashboard deveria detectar ausência de assinatura ativa e substituir (ou complementar) o estado vazio por uma chamada direta: "Você ainda não tem acesso a nenhum conteúdo. Ver o Plano Fundador" apontando para `/app/subscription`. Sem isso, o risco de abandono nesta etapa é real e silencioso — o aluno criou conta, mas nada o leva ativamente à compra.
- **Prioridade:** alta — é o ponto de maior risco de abandono de todo o funil, precisamente porque hoje não deixa rastro (o aluno simplesmente não volta, sem gerar nenhum evento de erro para investigar).

### 3.4 Escolher plano (`/app/subscription`, catálogo)

- **O que o aluno vê:** cartão com nome do plano, descrição, valor e botão "Assinar" — já implementado (`PlanCatalog`).
- **Estado vazio já tratado:** se `COMMERCIAL_PLANS` estiver vazio (é o caso hoje), a tela mostra "Nenhum plano disponível no momento" — **isto significa que, sem a configuração da seção 6, ninguém consegue comprar nada.** Não é um bug; é uma trava de segurança que já existe, mas precisa ser resolvida antes do lançamento.
- **Como transmitir confiança:** o nome do plano e a descrição exibidos aqui devem refletir exatamente a copy do Plano Fundador definida em `04-LANDING.md` — inconsistência de nome entre Landing e checkout é um gatilho clássico de desconfiança ("será que cliquei no lugar certo?").

### 3.5 Confirmação de CPF (modal)

- **O que o aluno vê:** modal pedindo CPF, com o texto já implementado: "Você será redirecionado ao checkout seguro do Asaas para concluir o pagamento."
- **Por que isso é uma boa prática já presente no código:** o aluno é avisado *antes* de sair do domínio do SimulaPro — evita a sensação de "fui redirecionado para um site estranho sem aviso", que é um gatilho comum de abandono e de contestação de pagamento por desconfiança.
- **Objeção combatida aqui:** "por que estão pedindo meu CPF?" — recomenda-se um texto de apoio curto: "O CPF é exigido pelo Asaas para emitir a cobrança — não é armazenado pelo SimulaPro." (verificar que isso é factualmente verdade na implementação antes de publicar essa frase).

### 3.6 Pagamento (ambiente do Asaas)

- **O que o aluno vê:** interface hospedada pelo Asaas (fora do controle visual do SimulaPro), com opções de Pix, cartão ou boleto conforme o `billingType` configurado no plano.
- **Como reduzir abandono nesta janela crítica:** como o aluno sai do site, o e-mail de confirmação (`06-EMAILS.md`) precisa disparar rápido o suficiente para servir de "rede de segurança" caso ele feche a aba antes de terminar — e o link de retorno da fatura do Asaas deve apontar de volta para `/app/subscription`, não para a Landing pública.
- **Boleto — expectativa a comunicar:** como já registrado em `PAYMENT_GATEWAY_ARCHITECTURE_V1.md`, a compensação pode levar de 1 a 3 dias úteis. Isso precisa aparecer explicitamente na tela/fatura para quem escolhe boleto, para não gerar a sensação de "paguei e nada aconteceu".

### 3.7 Confirmação e ativação

- **O que o aluno vê:** ao voltar ao SimulaPro, `/app/subscription` já reflete a assinatura ativa (a tela consulta o Asaas ao vivo, então não depende de um refresh manual de página para funcionar — mas o botão "Atualizar" existe como reforço).
- **Latência esperada:** ativação por Pix/cartão tende a ser em segundos (webhook quase imediato); por boleto, só após compensação. A UI deveria comunicar isso na etapa anterior (3.6), não deixar o aluno descobrir sozinho por que "ainda não ativou".

### 3.8 Primeiro acesso a `/app/study`

- **O que o aluno vê:** a distribuição comprada aparece na lista (já validado tecnicamente em sessões anteriores desta conversa — `validateSessionAccess` confirma assinatura ativa e distribuição ativa antes de liberar a tela de configuração de sessão).
- **Momento de maior prova de valor:** esta é a primeira vez que o aluno vê o produto de fato funcionando após pagar — qualquer fricção aqui (ex.: distribuição não aparecer por atraso do webhook) tem custo de confiança desproporcional ao tamanho técnico do problema. Ver seção 5.6.

### 3.9 Primeira sessão de estudo

- **O que o aluno vê:** fluxo já existente e testado (configurar sessão → iniciar resolução → primeira questão).
- **Objetivo desta etapa no funil comercial:** não é mais sobre pagamento — é sobre confirmar ao aluno, o mais rápido possível, que a compra "funcionou de verdade". Recomenda-se que o primeiro contato pós-pagamento (e-mail de boas-vindas, `06-EMAILS.md`) aponte diretamente para `/app/study`, não para o dashboard genérico — reduz um passo de navegação entre "paguei" e "estou estudando".

---

## 4. Cenários de erro

| Cenário | Comportamento hoje | Comportamento recomendado |
|---|---|---|
| **Pix expirado** | Cai em `PAYMENT_OVERDUE` (o Asaas não distingue "Pix expirado" de "cobrança vencida" como evento próprio) → assinatura desativada/mantida `INACTIVE` | Aluno precisa gerar nova cobrança — isso significa um novo `iniciarCheckout()`. **Verificar antes do lançamento:** o `iniciarCheckout` atual bloqueia nova tentativa se já existir uma assinatura Asaas não-ativa com o mesmo `externalReference`? O código lê apenas se está `ACTIVE` para bloquear — uma assinatura `INACTIVE`/pendente não impede nova tentativa, o que é o comportamento correto aqui, mas **pode gerar assinaturas órfãs duplicadas no Asaas** se o aluno tentar várias vezes (ver linha abaixo) |
| **Cartão recusado** | `PAYMENT_OVERDUE` (para cobrança avulsa) — dunning subsequente é responsabilidade do Asaas conforme o ciclo configurado | Mensagem clara ao aluno com motivo genérico ("pagamento não aprovado pelo seu banco") e caminho direto para tentar outro método — hoje isso depende inteiramente da UI do Asaas, fora do controle do SimulaPro |
| **Pagamento duplicado** (aluno paga duas vezes, ou tenta checkout duas vezes) | `iniciarCheckout` verifica assinatura `ACTIVE` existente e bloqueia — mas não impede múltiplas assinaturas `INACTIVE`/pendentes acumuladas se o aluno abandonar e tentar de novo antes de a primeira cobrança vencer | **Gap a resolver na implementação:** antes de criar uma nova assinatura no Asaas, verificar se já existe uma assinatura pendente (não só ativa) para o mesmo `externalReference` e reaproveitar a fatura existente em vez de gerar uma nova |
| **Falha de comunicação** (SimulaPro → Asaas indisponível no momento do checkout) | `iniciarCheckout` propaga o erro como exceção, capturado pelo `onError` da mutation, exibido via toast | Comportamento correto — mas o aluno precisa de uma mensagem que não pareça um erro do próprio SimulaPro ("não conseguimos conectar ao provedor de pagamento, tente novamente em instantes"), não um erro técnico cru |
| **Webhook atrasado** (Asaas confirma, mas o evento demora a chegar) | Aluno paga, volta ao SimulaPro, `/app/subscription` ainda mostra estado anterior até o webhook processar | **Mitigação já parcialmente coberta:** `getAsaasLiveStatus` consulta o Asaas ao vivo (não só o banco local) — então mesmo que o webhook atrase, a tela pode mostrar o pagamento como confirmado no lado do Asaas antes de a assinatura local ser oficialmente ativada. **Risco:** isso pode criar uma divergência temporária entre "o que a tela mostra" (consulta ao vivo) e "o que realmente libera acesso" (`subscriptions.status` local) — comunicar isso com um estado de UI tipo "Pagamento confirmado, liberando seu acesso..." em vez de mostrar acesso liberado antes da hora |
| **Pagamento aprovado mas assinatura não criada** | Coberto explicitamente pelo próprio código: se `payment.subscription` estiver ausente no evento, o handler **recusa a ativação** e registra o erro para investigação manual, em vez de liberar acesso "para sempre" por engano (bug real já identificado e corrigido em sprint anterior, conforme comentário no código) | Comportamento correto e documentado — mantém como está. Fica como **dependência operacional:** alguém precisa efetivamente monitorar esses erros registrados (ver seção 6 sobre a ausência de tela de logs) |
| **Pagamento criado mas usuário fechou a página** | Sem problema técnico — o pagamento continua existindo no Asaas independente da aba do navegador; o webhook processa normalmente quando o pagamento for confirmado, e o aluno vê o resultado a qualquer momento que retornar a `/app/subscription` | Mitigar apenas o risco de **esquecimento** (não técnico): e-mail de "seu pagamento está pendente" caso o webhook não confirme em X horas — ver `06-EMAILS.md` |

---

## 5. Segurança

### 5.1 Fonte oficial da verdade

**O Asaas é a fonte da verdade sobre o estado da cobrança e da assinatura. O banco local (`subscriptions.status`) é a fonte da verdade sobre o que efetivamente controla o acesso ao produto.** As duas coisas são sincronizadas exclusivamente pelo webhook — nunca pelo frontend. Isso já é respeitado hoje: `getAsaasLiveStatus` é uma consulta somente leitura para exibição, e nunca escreve em `subscriptions` (comentário explícito no código confirma essa intenção).

**Regra que nunca deve ser violada:** o frontend nunca decide, por conta própria, que um pagamento foi aprovado. Mesmo o retorno de `iniciarCheckout` (que devolve `redirectUrl`) não marca nada como pago — ele só cria a cobrança e devolve o link. A ativação é sempre, exclusivamente, resultado de um evento de webhook processado no servidor.

### 5.2 Idempotência

Já implementada: cada evento do Asaas tem um `eventId` resolvido (`payload.id`, ou uma combinação `evento:id_aninhado` como fallback), verificado contra a tabela `logs` (`action = "asaas.webhook.processed"`) antes de qualquer processamento. Evento já processado é ignorado silenciosamente. Isso cobre o cenário clássico de reentrega de webhook (o Asaas, como a maioria dos gateways, pode reenviar o mesmo evento mais de uma vez).

### 5.3 Reconciliação

**Não existe hoje um processo ativo de reconciliação** (comparar periodicamente o estado do Asaas com o estado local para achar divergências não capturadas por webhook). O que existe é reconciliação *sob demanda*, disparada pelo próprio aluno ao abrir `/app/subscription` (`getAsaasLiveStatus` consulta o Asaas ao vivo a cada carregamento da tela). Isso cobre o caso "aluno percebe e verifica", mas não cobre "webhook falhou silenciosamente e ninguém percebeu porque o aluno não voltou à tela". **Recomendação:** um processo periódico (mesmo que manual, no início) que rode `buscarAssinaturaPorExternalReference` para assinaturas locais `INACTIVE` há mais de X horas, para detectar pagamentos confirmados no Asaas que nunca geraram webhook.

### 5.4 Logs

Cobertura já ampla no código: todo evento relevante grava uma linha em `logs` (`asaas.webhook.received`, `asaas.webhook.processed`, `asaas.webhook.error` com estágio e mensagem, `asaas.subscription.activated`/`renewed`/`overdue`/`cancelled`/`updated_inactive`). Nunca grava dado sensível (cartão, token, chave de API) — confirmado no comentário do próprio código.

### 5.5 Auditoria

A trilha de auditoria já existe tecnicamente (a tabela `logs`), mas **não existe hoje uma forma de consultá-la exceto por acesso direto ao banco** (SQL/Table Editor do Supabase Studio) — não há tela de admin. Isso é suficiente para investigação pontual por quem tem acesso técnico, mas não é operacionalmente sustentável como processo de acompanhamento comercial contínuo (ver seção 6).

### 5.6 Reprocessamento

Não existe hoje um mecanismo de "reprocessar manualmente um evento perdido" — se um webhook falhar antes de chegar ao servidor (não é o mesmo caso do erro registrado internamente, que já é tratado), a única forma de recuperar é: (a) o Asaas reenviar automaticamente (comportamento padrão de gateways de webhook, geralmente com retentativas), ou (b) verificação manual via `buscarAssinaturaPorExternalReference` + ativação manual pelo Admin em `/admin/subscriptions` (fluxo manual que já existe e continua válido como plano de contingência, conforme `COMMERCIAL_V1_ROADMAP.md`, seção 1).

---

## 6. Admin — como acompanhar hoje (sem criar nada novo)

| Necessidade | Como é possível hoje | Limitação |
|---|---|---|
| Ver assinaturas e status local | `/admin/subscriptions` — CRUD completo já existente | Não mostra dado ao vivo do Asaas (fatura, próxima cobrança, forma de pagamento) — o aluno individualmente vê mais informação sobre a própria assinatura do que o Admin vê sobre ela |
| Ativar/corrigir uma assinatura manualmente | `/admin/subscriptions` — criar/editar/ativar/desativar manualmente | É o mecanismo de contingência para qualquer falha de webhook — **precisa estar testado e documentado como plano de resposta a incidente**, não descoberto na hora de um problema real |
| Ver pagamentos individuais, faturas, tentativas | **Não existe tela** | Só via acesso direto à API do Asaas (painel do próprio Asaas) ou ao banco (`logs`) |
| Ver falhas de webhook | **Não existe tela** — as falhas ficam registradas em `logs` (`asaas.webhook.error`, com estágio e mensagem) | Requer consulta SQL direta; ninguém é alertado proativamente |
| Reprocessar um evento | **Não existe mecanismo dedicado** | Contingência manual via `/admin/subscriptions`, seguida de correção manual no Asaas se necessário |

**Recomendação operacional para o lançamento (sem construir nada):** até que exista uma tela dedicada, definir *quem* e *com que frequência* consulta manualmente o painel do Asaas e a tabela `logs` (mesmo que via SQL Editor do Supabase) — nas primeiras semanas de vendas reais, isso substitui a automação que ainda não existe. É trabalho manual assumido conscientemente, não um esquecimento.

---

## 7. Métricas

| Métrica | Definição | Fonte |
|---|---|---|
| Conversão Landing → Cadastro | Visitantes únicos da Landing que completam `/auth` (criar conta) | Instrumentação de analytics na Landing + contagem de novos `profiles` |
| Conversão Cadastro → Escolha de plano | Novas contas que chegam a `/app/subscription` e clicam em "Assinar" | Evento de clique (front) — hoje não instrumentado, é dependência de analytics básico |
| Conversão Escolha de plano → Pagamento iniciado | Cliques em "Assinar" que resultam em `iniciarCheckout` bem-sucedido (obtém `redirectUrl`) | Log de chamada da server function, ou evento de analytics equivalente |
| Conversão Pagamento iniciado → Aprovado | Assinaturas criadas (`SUBSCRIPTION_CREATED`) que chegam a `PAYMENT_CONFIRMED`/`PAYMENT_RECEIVED` | Contagem de eventos em `logs` (`asaas.subscription.created` vs. `asaas.subscription.activated`) |
| Conversão Aprovado → Primeiro estudo | Assinaturas ativadas que resultam em pelo menos 1 `study_session` iniciada em até 7 dias | Já é, coincidentemente, um dos critérios de sucesso definidos em `01-GO_LIVE.md`, seção 5 |
| Tempo médio de ativação | Intervalo entre `SUBSCRIPTION_CREATED` e `PAYMENT_CONFIRMED`/`RECEIVED`, por forma de pagamento (Pix vs. cartão vs. boleto) | Timestamps dos eventos em `logs` |
| Taxa de abandono por etapa | Inverso de cada conversão acima — permite identificar exatamente qual etapa do funil está vazando mais | Mesmas fontes |
| Taxa de erro de ativação | Proporção de `PAYMENT_CONFIRMED`/`RECEIVED` que **não** resultam em ativação (ex.: `payment.subscription` ausente, distribuição inválida) | Contagem de `asaas.webhook.error` por estágio |

**Nota honesta:** boa parte dessas métricas depende de instrumentação de analytics no frontend que hoje não existe (cliques, funil de página) — o que já existe (via `logs`) cobre bem o lado servidor/webhook, mas não fecha o funil completo sozinho. Isso é uma dependência a resolver antes de reportar essas métricas com confiança.

---

## 8. Checklist de homologação

Cada item precisa de critério objetivo de aceite — não "parece funcionar".

### Configuração

- [ ] `COMMERCIAL_PLANS` preenchido com o Plano Fundador real (`id`, `label`, `description`, `distributionId` apontando para "Distribuição RC1 - Enfermagem", `value`, `cycle`, `billingType`) — **critério:** `/app/subscription` exibe o plano para uma conta sem assinatura
- [ ] Variáveis de ambiente Asaas configuradas em produção (`ASAAS_API_KEY`, `ASAAS_ENVIRONMENT=production`, `ASAAS_WEBHOOK_SECRET`, `APP_URL`) — **critério:** `getAsaasConfig()` não lança erro de variável ausente
- [ ] Webhook do Asaas configurado no painel do gateway, apontando para o endpoint de produção, com o token de autenticação correspondente a `ASAAS_WEBHOOK_SECRET` — **critério:** evento de teste enviado pelo próprio painel do Asaas é aceito (não retorna 401)

### Fluxo feliz (sandbox, depois produção com valor simbólico)

- [ ] Cadastro → escolha de plano → checkout → pagamento Pix confirmado → assinatura ativada → distribuição liberada → sessão de estudo iniciada — **critério:** ciclo completo sem intervenção manual, do clique inicial à primeira questão respondida
- [ ] Mesmo ciclo com cartão de crédito — **critério:** idêntico ao acima
- [ ] Mesmo ciclo com boleto, incluindo simulação de atraso de compensação — **critério:** acesso só é liberado após `PAYMENT_RECEIVED`, nunca na emissão do boleto

### Erros e bordas

- [ ] Cobrança vencida sem pagamento (`PAYMENT_OVERDUE`) — **critério:** assinatura correspondente muda para `INACTIVE`, acesso é bloqueado
- [ ] Evento de webhook duplicado (reenviado manualmente no sandbox) — **critério:** segunda entrega não gera efeito duplicado (idempotência confirmada por inspeção de `logs`)
- [ ] Pagamento confirmado sem `payment.subscription` no payload (simulado manualmente) — **critério:** ativação é recusada e um erro é registrado, acesso não é liberado indevidamente
- [ ] Tentativa de novo checkout com assinatura já `ACTIVE` — **critério:** erro claro ("Você já possui uma assinatura ativa para este plano"), sem gerar cobrança duplicada
- [ ] Cancelamento — **critério: bloqueador de lançamento** (ver seção 10.1) — precisa existir um caminho funcional antes de vender, mesmo que manual via Admin no primeiro momento

### Segurança

- [ ] Requisição ao endpoint de webhook sem o header de token correto é rejeitada — **critério:** confirmado por teste direto (`isAuthenticWebhookRequest` retorna `false`)
- [ ] Nenhum dado sensível de pagamento (número de cartão, token) aparece em `logs` — **critério:** inspeção manual de uma amostra de eventos gravados

### Admin

- [ ] Time operacional sabe onde consultar `logs` e o painel do Asaas manualmente (seção 6) — **critério:** procedimento documentado e testado por quem vai operar, não assumido

---

## 9. Fora do escopo deste documento (confirmação)

Conforme o briefing: nenhuma integração de gateway foi alterada, nenhum código foi escrito, nenhuma tela ou componente foi criado, nenhuma API nova foi definida. Tudo descrito acima já existe no repositório ou é listado explicitamente como pendência a resolver antes do lançamento — não uma proposta de arquitetura nova.

---

## 10. Gaps críticos — decisões pendentes antes do lançamento

Esta seção existe para não deixar enterrado, no meio do documento, o que realmente bloqueia ou coloca em risco o Go-Live.

### 10.1 Recorrência automática do Asaas não foi neutralizada — **bloqueador direto de `02-PLANS.md`**

`02-PLANS.md` decidiu explicitamente: acesso por ciclo, **sem recorrência automática** — o aluno paga uma vez e decide, ao final do ciclo, se renova. Mas a implementação técnica atual cria uma **assinatura nativa do Asaas** (`cycle: MONTHLY | YEARLY`), que é recorrente por natureza: o Asaas vai gerar e cobrar automaticamente o próximo ciclo, sozinho, a menos que a assinatura seja cancelada.

Hoje, nada no fluxo cancela essa assinatura após o primeiro pagamento. Isso significa que, sem uma correção, **todo aluno que comprar será cobrado de novo automaticamente no ciclo seguinte** — exatamente o comportamento que `02-PLANS.md` rejeitou como incompatível com a cultura de compra do público (seção 2.3 daquele documento) e que `04-LANDING.md` promete explicitamente não fazer ("você nunca é cobrado sem saber").

**Isto é uma contradição real entre a decisão comercial aprovada e o sistema técnico já construído — não uma opinião de estilo.**

Caminho de resolução recomendado (para decisão em sessão técnica futura, não implementado aqui): após o primeiro `PAYMENT_CONFIRMED`/`PAYMENT_RECEIVED` ativar a assinatura, chamar `AsaasService.cancelarAssinatura()` (método já existente, já pronto, nunca chamado hoje) para impedir a geração do próximo ciclo — a assinatura Asaas serviria como veículo de cobrança única, não como assinatura de fato. Isso reaproveita 100% do código já existente; não é arquitetura nova, é uma chamada adicional no handler de ativação.

### 10.2 Reembolso e chargeback não têm tratamento no webhook

`PAYMENT_REFUNDED` está listado como evento relevante em `PAYMENT_GATEWAY_ARCHITECTURE_V1.md`, mas **não está no conjunto de eventos tratados pelo handler atual** (`SUPPORTED_EVENTS`). Chargeback não tem um evento dedicado claramente mapeado. Isso significa que, hoje, um reembolso processado no painel do Asaas **não desativa a assinatura local automaticamente** — o aluno manteria acesso mesmo após receber o dinheiro de volta, até alguém perceber manualmente. Dado que `03-PRICING.md` estabelece garantia de 7 dias como política oficial, este é um gap operacional relevante, não cosmético.

### 10.3 Confirmar se o controle de acesso real respeita `expires_at`, não só `status`

Já sinalizado como pendência em `COMMERCIAL_V1_ROADMAP.md` (seção 6) e ainda não confirmado como resolvido. Se o controle de acesso ao Portal do Aluno checar apenas `subscriptions.status = ACTIVE` sem comparar `expires_at` com a data atual, uma assinatura vencida sem renovação continuaria liberando acesso indefinidamente até algum processo externo marcar `INACTIVE`. **Verificar isso é pré-requisito de lançamento, não um "nice to have".**

### 10.4 Sem botão de cancelamento self-service

Mesmo com `02-PLANS.md` definindo que "cancelamento" no sentido clássico quase não se aplica (não há cobrança recorrente automática, uma vez resolvido o item 10.1), o aluno ainda precisa de uma forma de **solicitar reembolso dentro da garantia de 7 dias** (`03-PRICING.md`) sem depender de contato manual com o fundador. Hoje isso não existe como fluxo self-service — é inteiramente manual (o mesmo canal de suporte único definido em `COMMERCIAL_V1_ROADMAP.md`, seção 12, que é aceitável para o volume da Onda A, mas precisa estar combinado e pronto, não improvisado na hora do primeiro pedido).

### 10.5 Ausência de nudge comercial pós-cadastro

Detalhado na seção 3.3 — risco de abandono silencioso entre "criei conta" e "vi o plano". Recomendado, não bloqueador absoluto (o aluno ainda consegue navegar manualmente), mas é a correção de maior impacto por menor esforço de todo este documento.

---

*Próximo documento: `06-EMAILS.md` — aguardando validação desta jornada de checkout.*
