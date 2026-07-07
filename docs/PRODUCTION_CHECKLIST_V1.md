# Checklist de Produção — V1 Comercial

**Base:** Sprints 4.2A–4.2E (`COMMERCIAL_V1_ROADMAP.md`, `PAYMENT_GATEWAY_ARCHITECTURE_V1.md`). Marcar item a item antes da primeira venda real.

---

## 1. Credenciais

- [ ] `ASAAS_API_KEY` de produção configurada (distinta da chave de sandbox usada nos testes)
- [ ] `ASAAS_ENVIRONMENT=production` — alterna a base da API de `sandbox.asaas.com` para `api.asaas.com` (`src/integrations/asaas/config.server.ts`)
- [ ] `ASAAS_WEBHOOK_SECRET` configurado no servidor **e** no painel do Asaas, com o mesmo valor nos dois lados
- [ ] `APP_URL` apontando para o domínio público de produção

## 2. Asaas

- [ ] Planos reais criados (preço, ciclo, `distributionId`) em `src/config/commercial-plans.ts` — hoje vazio por decisão de escopo das sprints anteriores
- [ ] Webhook configurado no painel do Asaas apontando para `https://{APP_URL}/api/webhooks/asaas`
- [ ] URL pública do webhook confirmada acessível externamente (não atrás de localhost/VPN)
- [ ] Assinatura do webhook validada — header `asaas-access-token` enviado pelo Asaas confere com `ASAAS_WEBHOOK_SECRET`

## 3. Testes

- [ ] Pix real
- [ ] Cartão real
- [ ] Boleto real
- [ ] Renovação
- [ ] Cancelamento
- [ ] Expiração

## 4. Segurança

- [ ] HTTPS em todo o domínio de produção, incluindo o endpoint do webhook
- [ ] Secrets (`ASAAS_API_KEY`, `ASAAS_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`) presentes só no ambiente do servidor — nenhum com prefixo `VITE_`
- [ ] Logs — conferir em `logs` que nenhum evento do Asaas grava cartão, token ou API key (`src/lib/asaas-webhook.server.ts`)
- [ ] RLS ativa em produção para `subscriptions`, `content_distributions` e `profiles`
- [ ] Build de produção repetido no ambiente real + bundle do cliente inspecionado por segredo vazado (mesma verificação feita na Sprint 4.2E)

## 5. Go Live

- [ ] Primeira venda real realizada
- [ ] Webhook confirmado (evento chegou e foi processado)
- [ ] Ativação automática confirmada (acesso liberado sem intervenção do Admin)
- [ ] Renovação confirmada (ciclo seguinte, quando aplicável)
- [ ] "Minha Assinatura" confirmada refletindo o estado real após a compra

---

**Pendências conhecidas herdadas da Sprint 4.2E (não bloqueiam Go Live, mas devem ser acompanhadas):** idempotência do webhook é melhor esforço (sem índice único, por não haver migration autorizada); "Em atraso" é inferido para exibição, sem estado persistido dedicado no schema atual.
