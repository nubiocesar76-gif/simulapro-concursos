# Fase 4.1.1 — Arquitetura de Integração do Gateway de Pagamento

**Data:** 2026-07-07 (atualizado — gateway oficial definido)
**Base:** `COMMERCIAL_V1_ROADMAP.md` (seções 3–8).
**Natureza:** arquitetura técnica de integração. Sem código, sem migration, sem alteração do schema ou das regras atuais — campos e tabelas citados como "necessários" são requisito para a fase de implementação, não uma alteração feita aqui.

---

## 1. Gateway oficial e motivo

**Gateway oficial da V1 Comercial: Asaas.**

**Motivo:** a V1 venderá somente no Brasil — Pix, boleto e cartão nativos, gateway brasileiro, sem necessidade dos recursos internacionais que motivavam a alternativa anterior. Decisão do time, registrada aqui como oficial.

**Stripe deixa de ser o gateway da V1** e passa a ser apenas uma possibilidade futura para uma V2 internacional (ver seção 13) — não faz parte da arquitetura de implementação desta fase.

---

## 2. Pix

Cobrança criada com tipo `PIX` (ou `UNDEFINED`, deixando o aluno escolher a forma no checkout). A API do Asaas retorna QR code e "copia e cola" para o pagamento. Confirmação chega por webhook normalmente em segundos — é a forma de pagamento com ativação mais rápida das três.

---

## 3. Cartão

Cobrança tipo `CREDIT_CARD`. Para a assinatura recorrente, o Asaas suporta tokenização de cartão — o token fica armazenado no lado do Asaas, não no SimulaPro, e é reaproveitado nas cobranças automáticas dos ciclos seguintes sem novo input do aluno.

---

## 4. Boleto

Cobrança tipo `BOLETO` — Asaas gera linha digitável e PDF. Compensação pode levar de 1 a 3 dias úteis, diferente de Pix/cartão. **Implicação de produto:** a ativação da assinatura só deve ocorrer após confirmação de recebimento, não na emissão do boleto — a tela de confirmação de compra deve deixar isso explícito ao aluno ("seu acesso será liberado após a compensação do boleto").

---

## 5. Assinatura recorrente

Usar o objeto de assinatura nativo do Asaas (ciclo mensal/anual, valor fixo). Cada ciclo gera automaticamente uma nova cobrança (`payment`) vinculada à assinatura — os webhooks do Asaas disparam por **cobrança**, não por assinatura em si. O SimulaPro precisa correlacionar o identificador da assinatura presente em cada `payment` recebido de volta à linha local em `subscriptions` (ver seção 7 do documento anterior — campos de referência externa).

---

## 6. Webhook

Endpoint único recebendo eventos de cobrança. Eventos relevantes:

| Evento | Uso |
|---|---|
| `PAYMENT_CREATED` | Cobrança gerada — log, sem ação obrigatória |
| `PAYMENT_CONFIRMED` | Pagamento confirmado (cartão/Pix) — pode liberar acesso já aqui, conforme política de risco do time |
| `PAYMENT_RECEIVED` | Pagamento efetivamente recebido/compensado — evento mais confiável para ativar/renovar, obrigatório para boleto |
| `PAYMENT_OVERDUE` | Cobrança vencida sem pagamento — equivalente a "pagamento recusado" (seção 9) |
| `PAYMENT_REFUNDED` | Estorno |
| `PAYMENT_DELETED` | Cobrança removida/cancelada |

**Autenticidade:** o Asaas permite configurar um token de webhook, enviado em header a cada requisição — o endpoint deve validar esse token antes de processar qualquer evento, para descartar chamadas que não vieram do Asaas.

---

## 7. Ativação automática de assinatura

```
PAYMENT_CONFIRMED (Pix/cartão) ou PAYMENT_RECEIVED (boleto compensado)
   → localizar user_id e distribution_id pela referência enviada na criação da cobrança
   → criar/atualizar a linha em `subscriptions`
   → status = ACTIVE, expires_at = próximo vencimento do ciclo
```

Reaproveita a mesma estrutura já existente (`subscriptions.status`, `expires_at`, `distribution_id`) descrita no documento anterior — nenhuma tabela nova para o núcleo do fluxo, só os campos de referência externa (ID do cliente e da assinatura no Asaas) a adicionar em migration futura.

---

## 8. Cancelamento

Diferente do Stripe, o Asaas não oferece um portal de autoatendimento tão completo quanto o Billing Portal — **implicação de arquitetura:** a área "Minha Assinatura" do SimulaPro precisa de uma tela própria (não um link externo) que chama a API do Asaas para cancelar a assinatura.

```
Aluno solicita cancelamento em "Minha Assinatura"
   → SimulaPro chama a API do Asaas para cancelar a assinatura
   → Asaas interrompe a geração de novas cobranças
   → acesso local mantido até expires_at do ciclo já pago
   → ao vencer sem nova cobrança confirmada, status muda para INACTIVE
```

---

## 9. Expiração

Sem um evento único e explícito de "assinatura encerrada" (diferente do `customer.subscription.deleted` de outros gateways) — o Asaas é centrado em cobrança, não em ciclo de vida de assinatura como objeto próprio. Por isso, o mecanismo de verificação de expiração (checagem periódica ou no momento do acesso, já sinalizado como pendência técnica em `COMMERCIAL_V1_ROADMAP.md` seção 6) é **obrigatório** com o Asaas, não apenas recomendado — sem ele, uma assinatura cancelada ou vencida sem renovação pode continuar com `status = ACTIVE` indefinidamente.

---

## 10. Pagamento recusado

```
PAYMENT_OVERDUE recebido
   → não bloquear acesso imediatamente (grace period a definir)
   → notificar aluno (e-mail, conforme COMMERCIAL_V1_ROADMAP.md seção 11)
   → se persistir sem confirmação, status muda para INACTIVE
```

Para cartão recorrente, uma recusa direta do emissor também cai neste fluxo. Para Pix/boleto, "recusado" na prática é ausência de pagamento até o vencimento.

---

## 11. Sandbox/testes

**Diferença importante frente a outros gateways:** o Asaas Sandbox é um **ambiente inteiramente separado** (`sandbox.asaas.com`), com conta e chave de API próprias — não é um "modo de teste" dentro da mesma conta de produção.

Testar no sandbox: criar cliente de teste, gerar cobrança Pix/boleto/cartão de teste, usar os simuladores de pagamento do próprio Asaas Sandbox para confirmar manualmente uma cobrança e validar que o webhook correspondente chega e ativa a assinatura corretamente.

Checklist mínimo antes de produção: cobrança Pix confirmada → assinatura ativada; cobrança de boleto confirmada com atraso simulado → assinatura ativada só após confirmação; cartão recorrente simulando 2º ciclo → renovação; cobrança vencida sem pagamento → fluxo de recusa; cancelamento pela tela própria → acesso mantido até `expires_at`, depois bloqueado.

---

## 12. Variáveis de ambiente necessárias

| Variável | Uso |
|---|---|
| `ASAAS_API_KEY` | Chave de API — valores diferentes para sandbox e produção |
| `ASAAS_API_BASE_URL` | Alterna entre `https://sandbox.asaas.com/api/v3` e `https://api.asaas.com/v3` |
| `ASAAS_WEBHOOK_TOKEN` | Token para validar autenticidade dos webhooks recebidos (seção 6) |
| `SUPABASE_SERVICE_ROLE_KEY` | Já existe no projeto — reaproveitada pelo handler do webhook para escrever em `subscriptions` no servidor |

---

## 13. Stripe — nota para V2 (internacional)

Fora do escopo de implementação da V1. Se o SimulaPro expandir para venda internacional em uma V2, o Stripe permanece como opção a avaliar naquele momento — pelas mesmas razões já registradas anteriormente (assinatura recorrente madura, portal de autoatendimento pronto, alcance multi-país). Nenhuma decisão tomada agora além de manter essa possibilidade registrada.

---

## Ordem de implementação

1. Criar conta Asaas de produção + conta sandbox separada
2. Configurar variáveis de ambiente (seção 12) por ambiente
3. Cadastrar os planos comerciais como assinaturas recorrentes no Asaas (`COMMERCIAL_V1_ROADMAP.md` seção 2)
4. Endpoint de criação de cliente + assinatura no Asaas a partir do checkout do SimulaPro
5. Endpoint de webhook + validação do token (seção 6)
6. Migration com os campos de referência externa (ID de cliente e de assinatura no Asaas) em `subscriptions`
7. Handlers dos eventos: ativação, renovação, cobrança vencida, cancelamento
8. Tela própria de "Minha Assinatura" (cancelar, ver forma de pagamento/histórico) — sem portal hospedado equivalente disponível
9. Mecanismo de verificação de expiração (seção 9) — obrigatório com este gateway
10. Testes completos em sandbox (seção 11) cobrindo Pix, boleto, cartão, cancelamento e vencimento
11. Troca para chaves/ambiente de produção + monitoramento das primeiras cobranças reais
