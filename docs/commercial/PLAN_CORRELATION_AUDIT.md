# PLAN_CORRELATION_AUDIT — Auditoria da Correlação do Plano Comercial

**Fase:** 8 — Auditoria (Checkout → Asaas → Webhook)
**Documento:** Como o plano comercial é identificado ao longo de todo o fluxo de pagamento
**Data:** 2026-07-15
**Escopo:** apenas auditoria. Nenhum código foi escrito, nenhum arquivo foi alterado, nenhuma sprint foi iniciada.

**Arquivos lidos:** `src/config/commercial-plans.ts`, `src/lib/student-subscription.functions.ts`, `src/lib/student-subscription.ts`, `src/integrations/asaas/reference.server.ts`, `src/integrations/asaas/AsaasService.server.ts`, `src/lib/asaas-webhook.server.ts`, `src/routes/api/webhooks/asaas.ts`.

---

## 1. Objeto enviado para `iniciarCheckout()`

Confirmado em `student-subscription.functions.ts:76` (validador do server function):

```ts
.validator((data: { planId: string; cpfCnpj: string }) => data)
```

**Campos exatos: `{ planId: string, cpfCnpj: string }`.** Nada além disso é enviado nesta chamada — nem `distributionId`, nem `value`, nem `cycle` são passados pelo frontend; todos são resolvidos no servidor a partir do `planId` (linha 78: `const plan = findCommercialPlan(data.planId)`).

---

## 2. Payload real enviado na criação da assinatura no Asaas

Em `student-subscription.functions.ts:119-126`, a chamada ao serviço:

```ts
AsaasService.criarAssinatura({
  customerId: customer.id,
  billingType: plan.billingType,
  value: plan.value,
  nextDueDate,
  cycle: plan.cycle,
  externalReference: subscriptionRef,
})
```

Que em `AsaasService.server.ts:67-79` vira o corpo HTTP de fato enviado ao Asaas:

```ts
{
  customer: input.customerId,
  billingType: input.billingType,
  value: input.value,
  nextDueDate: input.nextDueDate,
  cycle: input.cycle,
  externalReference: input.externalReference,
}
```

**Não existe nenhum campo `planId` neste payload.** O único lugar onde uma referência ao plano poderia estar embutida é dentro da string de `externalReference` — e, como a seção 3 mostra, ela não contém.

---

## 3. Como `externalReference` é montado

`reference.server.ts:12-14`:

```ts
export function buildExternalReference(userId: string, distributionId: string): string {
  return `${PREFIX}:${userId}:${distributionId}`;
}
```

**Formato exato: `"simulapro:{userId}:{distributionId}"`** — sempre 3 segmentos separados por `:`, sempre exatamente esses dois identificadores dinâmicos.

| Contém... | Resposta |
|---|---|
| `userId` | **Sim** |
| `distributionId` | **Sim** |
| `planId` | **Não** |
| `packageVersion` | **Não** |
| Outro identificador | Não — só existem esses dois segmentos, mais o prefixo fixo `"simulapro"` |

(Existe uma segunda função, `buildCustomerExternalReference(userId)` → `"simulapro-customer:{userId}"`, usada apenas para deduplicar o *cliente* no Asaas — não tem relação com plano nem distribuição.)

---

## 4. Quando o webhook retorna, quais desses campos chegam novamente

`asaas-webhook.server.ts:245` (e equivalente para eventos de assinatura, linha 301, 319, 346, 379, 415, 449):

```ts
const ref = parseExternalReference(payload.payment?.externalReference);
// ref = { userId, distributionId } | null
```

`parseExternalReference` (`reference.server.ts:21-30`) decodifica exatamente os mesmos dois campos que foram codificados: **`userId` e `distributionId`**. Nada mais — nenhum `planId`, nenhum `packageVersion` retorna, porque nenhum dos dois foi colocado na referência originalmente (seção 3).

---

## 5. Hoje existe algum identificador do plano comercial chegando ao webhook?

# **NÃO.**

O webhook nunca recebe um `planId` explícito. O que ele recebe é `distributionId`, e a partir dele **infere** um plano chamando `findCommercialPlanByDistributionId(ref.distributionId)` (`asaas-webhook.server.ts:267`). Essa inferência funcionava sem ambiguidade enquanto existia apenas 1 plano por distribuição — deixou de ser confiável desde a Sprint P0.5 (Plano Mensal), que criou um segundo plano apontando para a mesma distribuição (ver seção 9).

---

## 6. Menor conjunto de alterações para transportar `planId` até o webhook

Sem mudar arquitetura, banco, tabelas ou `AsaasService`, a única via disponível é **estender o próprio `externalReference`**, que já é a técnica de correlação usada e já é uma string livre não persistida em nenhuma coluna:

- **`reference.server.ts`** — mudar o formato de `buildExternalReference`/`parseExternalReference` para incluir um terceiro segmento: `"simulapro:{userId}:{distributionId}:{planId}"`.
- **`student-subscription.functions.ts`** — passar `plan.id` como argumento adicional ao montar a referência em `iniciarCheckout` (linha 111).
- **`asaas-webhook.server.ts`** — usar `ref.planId` (novo campo do `ParsedExternalReference`) para resolver o plano via `findCommercialPlan(ref.planId)` em vez de `findCommercialPlanByDistributionId(ref.distributionId)`, nos três pontos onde essa resolução acontece hoje (linha 267, e as duas checagens de `isCommercialFixedTermPlan`, linhas 424 e 457).

**Por que isso não conta como "mudar arquitetura":** o `externalReference` já é, por desenho, o único canal de correlação entre Asaas e o sistema local (comentário em `asaas-webhook.server.ts:6-8` já documenta essa decisão) — estendê-lo com mais um segmento é usar o mecanismo existente para mais um propósito, não criar um mecanismo novo.

**Cuidado a registrar, não a resolver aqui:** assinaturas já criadas no formato antigo (2 segmentos) continuariam existindo no Asaas até expirarem ou serem canceladas — `parseExternalReference` precisaria aceitar os dois formatos durante uma janela de transição, ou aceitar que assinaturas antigas percam a resolução de plano (mas não a de `userId`/`distributionId`, que continuam funcionando).

---

## 7. Existe alguma informação já existente que permita diferenciar Mensal x Fundador sem usar `distributionId`?

Não, não de forma confiável. O `AsaasWebhookPayload` tipado hoje (`asaas-webhook.server.ts:32-47`) inclui `payment.id`, `payment.subscription`, `payment.externalReference`, `payment.status` e os equivalentes de `subscription` — **não inclui `payment.value`**, embora o Asaas provavelmente envie esse campo no payload real (não lido nem tipado pelo código atual). Se fosse lido, `payment.value` poderia ser comparado contra os valores configurados em `COMMERCIAL_PLANS` (39,90 vs. 149,90) para inferir o plano — mas essa seria uma correlação frágil (dependeria de nenhum plano futuro coincidir em preço) e não é o que o código faz hoje. `cycle`/`nextDueDate` não ajudam — os dois planos usam `cycle: MONTHLY`. **Conclusão: não existe hoje nenhum dado já transportado e confiável para diferenciar os dois planos sem resolver a pergunta 6.**

---

## 8. Qual é a solução arquitetural correta?

| | A) Continuar usando `distributionId` | B) Usar `planId` | C) Outra (ex.: inferir por `payment.value`) |
|---|---|---|---|
| Esforço | Zero | Baixo — 3 arquivos (seção 6) | Baixo-médio — exige tipar `payment.value` e uma lógica de comparação |
| Corretude | **Já falha hoje** com 2+ planos por distribuição (seção 9) | Correlação explícita e inequívoca | Implícita, depende de valores nunca coincidirem entre planos futuros |
| Compatibilidade com assinaturas antigas | Não se aplica (nada muda) | Precisa decidir o que fazer com referências de 2 segmentos já existentes | Não se aplica |
| Alinhamento com a arquitetura já documentada | — | Reaproveita o mecanismo de correlação já formalizado como "o" canal de correlação | Introduz uma segunda forma de correlação (por valor) em paralelo à primeira (por referência), fragmentando o critério |
| Risco de regressão futura | Alto (o bug já existe) | Baixo, se a migração de formato for testada | Médio (nova lógica de comparação de valores, mais um lugar para divergir) |

### Recomendação (auditoria, não implementação)

**B — usar `planId`.** É a única opção que resolve o problema na raiz, sem introduzir um segundo critério de correlação paralelo (o risco real de C) e sem deixar uma inconsistência já confirmada sem solução (o risco de A). O custo de implementação é baixo e concentrado em três arquivos já identificados.

---

## 9. O bug (Plano Mensal → `expires_at` → 6 meses) — confirmação

# **CONFIRMADO.**

**Evidência:**

1. `asaas-webhook.server.ts:267`: `const plan = findCommercialPlanByDistributionId(ref.distributionId);` — resolve o plano **apenas pela distribuição**, nunca pelo plano realmente escolhido no checkout.
2. `commercial-plans.ts` (estado atual, pós Sprint P0.5): os dois planos têm o **mesmo** `distributionId` (`"1b527a9e-eb48-4ad5-b6b5-c480dd894eb3"`):
   ```ts
   { id: "plano-fundador", distributionId: "1b527a9e-...", accessDurationMonths: 6, ... }
   { id: "plano-mensal",   distributionId: "1b527a9e-...", accessDurationMonths: 1, ... }
   ```
3. `findCommercialPlanByDistributionId` (`commercial-plans.ts`) usa `Array.prototype.find`, que **retorna sempre o primeiro elemento que casa** — como `plano-fundador` é declarado primeiro no array, é sempre ele que é retornado para essa `distributionId`, independentemente de qual plano o cliente realmente comprou.
4. Verificação em runtime feita na auditoria da Sprint P0.5 (script `tsx` descartável): `findCommercialPlanByDistributionId("1b527a9e-eb48-4ad5-b6b5-c480dd894eb3")` retornou o objeto de `plano-fundador`, nunca o de `plano-mensal`.
5. Consequência direta em `asaas-webhook.server.ts:278`: `computeCommercialExpiresAt(plan.accessDurationMonths)` usaria `accessDurationMonths: 6` mesmo para um pagamento de R$39,90 do Plano Mensal — o `expires_at` gravado seria de 6 meses, não de 1.

---

## 10. Arquivos que precisarão ser alterados, caso a correção (opção B) seja implementada

| Arquivo | Alteração |
|---|---|
| `src/integrations/asaas/reference.server.ts` | Estender `buildExternalReference`/`parseExternalReference` e o tipo `ParsedExternalReference` para incluir `planId` |
| `src/lib/student-subscription.functions.ts` | Passar `plan.id` ao montar a referência em `iniciarCheckout` |
| `src/lib/asaas-webhook.server.ts` | Trocar `findCommercialPlanByDistributionId(ref.distributionId)` por `findCommercialPlan(ref.planId)` no cálculo de `expiresAt` (linha 267) e nas duas checagens de `isCommercialFixedTermPlan` (linhas 424 e 457) |

**Não precisariam ser alterados:** `AsaasService.server.ts` (o `externalReference` já é um campo de string livre, nenhuma mudança de assinatura de método), `commercial-plans.ts` (o helper `findCommercialPlan` já existe e já resolve por `id`), `student-subscription.ts` (não participa da correlação), `src/routes/api/webhooks/asaas.ts` (só repassa o payload adiante, não interpreta correlação).

---

*Fim da auditoria. Nenhum código foi escrito. Nenhum arquivo do sistema foi alterado. Nenhuma sprint foi iniciada.*
