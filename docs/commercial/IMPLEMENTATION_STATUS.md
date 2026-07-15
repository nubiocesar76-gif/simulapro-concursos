# IMPLEMENTATION_STATUS — Inventário Operacional de Código

**Documento:** Levantamento do que já existe e do que falta, verificado diretamente no código-fonte
**Data:** 2026-07-15
**Escopo:** apenas inventário. Nenhuma linha de código foi escrita, nenhum arquivo além deste foi criado ou modificado, nenhuma melhoria foi sugerida. Toda classificação abaixo vem de leitura direta do repositório nesta data — não da documentação comercial.

**Legenda de status:** `Existe` (código presente e em uso) · `Completo` (cobre o caso de uso pretendido sem lacuna conhecida) · `Parcial` (existe, mas com lacuna concreta identificada) · `Não existe` (nenhum código encontrado).

---

## 1. Landing

- **Status:** Existe — **Parcial**
- **Arquivos:** `src/routes/index.tsx`
- **Dependências:** nenhuma técnica
- **Bloqueadores:** página renderiza sem seção de preço, sem seção de planos, sem prova/comparativo, sem link direto para o fluxo de checkout — apenas hero genérico e dois links de navegação (`/app`, `/admin`)
- **Estimativa de esforço:** Médio

---

## 2. Checkout

- **Status:** Existe — **Completo** (para o fluxo hoje suportado: escolher plano → CPF → redirecionamento Asaas)
- **Arquivos:** `src/components/app/subscription/SubscriptionPage.tsx` (modal de CPF), `src/lib/student-subscription.functions.ts` (`iniciarCheckout`), `src/integrations/asaas/reference.server.ts`
- **Dependências:** `COMMERCIAL_PLANS` preenchido (já presente), integração Asaas configurada
- **Bloqueadores:** nenhum de código
- **Estimativa de esforço:** Baixo

---

## 3. Minha Assinatura

- **Status:** Existe — **Parcial**
- **Arquivos:** `src/components/app/subscription/SubscriptionPage.tsx` (`SubscriptionCard`), `src/lib/student-subscription.ts`, `src/lib/student-subscription.functions.ts` (`getAsaasLiveStatus`)
- **Dependências:** nenhuma
- **Bloqueadores:** exibe status ao vivo, link de fatura e botão de atualização; não existe botão de cancelamento na tela — `AsaasService.cancelarAssinatura()` existe no código mas não é chamado por nenhum componente
- **Estimativa de esforço:** Baixo

---

## 4. COMMERCIAL_PLANS

- **Status:** Existe — **Completo** (para o escopo atual: 1 plano configurado)
- **Arquivos:** `src/config/commercial-plans.ts`
- **Dependências:** nenhuma
- **Bloqueadores:** nenhum
- **Estimativa de esforço:** Baixo

---

## 5. Asaas (integração)

- **Status:** Existe — **Completo** (para os métodos hoje utilizados pelo produto)
- **Arquivos:** `src/integrations/asaas/AsaasService.server.ts`, `client.server.ts`, `config.server.ts`, `reference.server.ts`
- **Dependências:** variáveis de ambiente `ASAAS_API_KEY`, `ASAAS_ENVIRONMENT`, `ASAAS_WEBHOOK_SECRET`, `APP_URL` — presentes no ambiente local; não verificado se os equivalentes de produção estão configurados
- **Bloqueadores:** nenhum de código
- **Estimativa de esforço:** Baixo

---

## 6. Webhook

- **Status:** Existe — **Completo** (para os 7 eventos tratados)
- **Arquivos:** `src/lib/asaas-webhook.server.ts`
- **Dependências:** endpoint precisa estar registrado no painel do Asaas com o token correspondente a `ASAAS_WEBHOOK_SECRET`
- **Bloqueadores:** nenhum de código
- **Estimativa de esforço:** Baixo

---

## 7. Webhook idempotente

- **Status:** Existe — **Completo**
- **Arquivos:** `src/lib/asaas-webhook.server.ts` (`wasEventAlreadyProcessed`, `markEventProcessed`), tabela `logs`
- **Dependências:** tabela `logs` (já existente)
- **Bloqueadores:** nenhum
- **Estimativa de esforço:** Baixo

---

## 8. Cancelamento

- **Status:** Existe — **Parcial**
- **Arquivos:** `src/integrations/asaas/AsaasService.server.ts` (método `cancelarAssinatura` implementado), `src/lib/asaas-webhook.server.ts` (não invoca o método), `src/components/app/subscription/SubscriptionPage.tsx` (sem botão)
- **Dependências:** nenhuma técnica adicional — o método de API já está pronto
- **Bloqueadores:** nenhum ponto do código chama `cancelarAssinatura()` hoje; a assinatura Asaas nunca é encerrada automaticamente após ativação
- **Estimativa de esforço:** Médio

---

## 9. Chargeback

- **Status:** **Não existe**
- **Arquivos:** nenhum — `SUPPORTED_EVENTS` em `src/lib/asaas-webhook.server.ts` não contém nenhum evento de chargeback
- **Dependências:** nome exato do(s) evento(s) correspondente(s) no catálogo de webhooks do Asaas
- **Bloqueadores:** nome de evento não confirmado no código nem em configuração
- **Estimativa de esforço:** Médio

---

## 10. Refund

- **Status:** **Não existe**
- **Arquivos:** nenhum — `PAYMENT_REFUNDED` ausente de `SUPPORTED_EVENTS`; nenhum método de reembolso presente em `AsaasService.server.ts`
- **Dependências:** nenhuma
- **Bloqueadores:** nenhum de código, apenas ausência
- **Estimativa de esforço:** Baixo

---

## 11. Plano Fundador

- **Status:** Existe — **Completo** (como registro de dado configurado)
- **Arquivos:** `src/config/commercial-plans.ts`
- **Dependências:** nenhuma
- **Bloqueadores:** nenhum
- **Estimativa de esforço:** Baixo

---

## 12. Controle de vagas

- **Status:** **Não existe**
- **Arquivos:** nenhum — busca no código não encontrou nenhuma lógica de teto, contagem ou limite de vendas por plano
- **Dependências:** contagem de assinaturas ativas/criadas vinculadas ao `distributionId` do plano
- **Bloqueadores:** nenhuma consulta ou verificação de teto existe hoje em `iniciarCheckout` nem em nenhum outro ponto
- **Estimativa de esforço:** Médio

---

## 13. LGPD (direitos do titular: acesso, correção, eliminação, portabilidade)

- **Status:** **Não existe**
- **Arquivos:** nenhum — busca no código não encontrou rota, função ou UI relacionada
- **Dependências:** canal de recebimento de solicitações (também inexistente, ver item Emails/Suporte fora desta lista)
- **Bloqueadores:** nenhuma implementação de nenhum tipo
- **Estimativa de esforço:** Alto

---

## 14. Política de Privacidade

- **Status:** **Não existe**
- **Arquivos:** nenhum — nenhuma rota encontrada
- **Dependências:** texto a ser fornecido (fora do escopo de código)
- **Bloqueadores:** nenhum técnico
- **Estimativa de esforço:** Baixo

---

## 15. Termos de Uso

- **Status:** **Não existe**
- **Arquivos:** nenhum — nenhuma rota encontrada
- **Dependências:** texto a ser fornecido (fora do escopo de código)
- **Bloqueadores:** nenhum técnico
- **Estimativa de esforço:** Baixo

---

## 16. Emails

- **Status:** **Não existe**
- **Arquivos:** nenhum — nenhuma dependência de serviço de e-mail transacional no `package.json`, nenhum código de envio encontrado
- **Dependências:** escolha e configuração de um provedor de e-mail transacional, criação de templates
- **Bloqueadores:** nenhuma integração de envio de e-mail existe hoje no código
- **Estimativa de esforço:** Alto

---

## 17. Dashboard

- **Status:** Existe — **Completo**
- **Arquivos:** `src/components/app/dashboard/StudentDashboardPage.tsx`, `DashboardStats.tsx`, `ContinueStudyCard.tsx`, `DistributionCard.tsx`, `RecentSessions.tsx`, `SubjectPerformanceTable.tsx`, `StudyFilterIndicators.tsx`
- **Dependências:** nenhuma
- **Bloqueadores:** nenhum
- **Estimativa de esforço:** Baixo

---

## 18. Study Builder

- **Status:** Existe — **Completo**
- **Arquivos:** `src/components/app/study/StudyPage.tsx`, `StudyBuilderFiltersPanel.tsx`, `StudyBuilderSummary.tsx`, `src/lib/study-builder.ts`, `src/lib/study-session.ts`
- **Dependências:** nenhuma
- **Bloqueadores:** nenhum
- **Estimativa de esforço:** Baixo

---

## 19. Resultados

- **Status:** Existe — **Completo**
- **Arquivos:** `src/components/app/study/SessionResultsView.tsx`, `SessionResultsSummaryCards.tsx`, `SessionResultsPerformanceTable.tsx`, `SessionResultsRecommendations.tsx`, `SessionResultsActions.tsx`, `src/lib/session-results-analytics.ts`, `src/lib/study-engine.ts`
- **Dependências:** nenhuma
- **Bloqueadores:** nenhum
- **Estimativa de esforço:** Baixo

---

## 20. Revisão

- **Status:** Existe — **Parcial**
- **Arquivos:** `src/components/app/review/ReviewCenterPage.tsx`, `ReviewCenterQuestionTable.tsx`, `ReviewCenterFilters.tsx`, `ReviewCenterStatsCards.tsx`, `src/lib/review-center.ts`
- **Dependências:** nenhuma
- **Bloqueadores:** `TAB_SESSION_MODE` (em `ReviewCenterPage.tsx`) mapeia as abas `favorites`, `review` e `wrong` a um modo de sessão específico; a aba `unanswered` não tem mapeamento — a ação correspondente cai em um caminho genérico (`STUDY`, 10 questões aleatórias) sem relação com os itens listados na aba
- **Estimativa de esforço:** Baixo

---

## 21. Histórico

- **Status:** Existe — **Completo**
- **Arquivos:** `src/components/app/history/StudyHistoryPage.tsx`, `HistorySummaryStats.tsx`, `src/lib/study-history.ts`
- **Dependências:** nenhuma
- **Bloqueadores:** nenhum
- **Estimativa de esforço:** Baixo

---

## Resumo por status

| Status | Itens |
|---|---|
| **Completo** | Checkout, COMMERCIAL_PLANS, Asaas, Webhook, Webhook idempotente, Plano Fundador, Dashboard, Study Builder, Resultados, Histórico |
| **Parcial** | Landing, Minha Assinatura, Cancelamento, Revisão |
| **Não existe** | Chargeback, Refund, Controle de vagas, LGPD, Política de Privacidade, Termos de Uso, Emails |

## Resumo por esforço

| Esforço | Itens |
|---|---|
| **Baixo** | Checkout, COMMERCIAL_PLANS, Asaas, Webhook, Webhook idempotente, Refund, Plano Fundador, Dashboard, Study Builder, Resultados, Revisão, Histórico, Minha Assinatura, Política de Privacidade, Termos de Uso |
| **Médio** | Landing, Cancelamento, Chargeback, Controle de vagas |
| **Alto** | LGPD, Emails |

---

*Fim do inventário. Nenhum outro arquivo foi modificado. Nenhum código foi escrito. Nenhuma melhoria foi sugerida — apenas o estado atual verificado.*
