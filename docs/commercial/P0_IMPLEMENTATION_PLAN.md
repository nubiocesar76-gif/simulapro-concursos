# P0_IMPLEMENTATION_PLAN — Plano de Execução dos Bloqueadores de Soft Launch

**Fase:** 8 — Sprint P0.1 (Integridade Comercial)
**Documento:** Tradução dos 7 bloqueadores P0 de `AUDITORIA_FINAL.md` em sprints executáveis
**Data:** 2026-07-14
**Papel assumido:** Auditor Técnico / Arquiteto de Execução / Tech Lead — não produção de estratégia, apenas organização de execução.
**Escopo:** nenhum código foi escrito, nenhuma arquitetura foi alterada, nenhuma funcionalidade nova foi criada. Onde este documento cita valores, campos ou nomes de arquivo específicos, é para tornar a sprint executável com o menor número de decisões deixadas em aberto no momento da implementação — não uma implementação antecipada.

---

## 0. Verificação de estado real (antes de planejar)

Cada bloqueador foi reconferido no código/dados nesta data, não apenas relido nos documentos. As descobertas abaixo mudam ou detalham a estratégia de correção em relação ao que `AUDITORIA_FINAL.md` havia registrado:

| # | O que foi verificado | Resultado |
|---|---|---|
| 1 | `src/config/commercial-plans.ts` | `COMMERCIAL_PLANS: CommercialPlan[] = []` — confirmado vazio. O tipo `CommercialPlan` já tem `value`, `cycle` (`MONTHLY`\|`YEARLY`), `billingType`, `distributionId` — **não tem nenhum campo de duração do ciclo em meses**. |
| 2 | `src/lib/asaas-webhook.server.ts` | `SUPPORTED_EVENTS` tem exatamente 7 eventos, nenhum de reembolso/chargeback. `cancelarAssinatura` não é chamada em nenhum ponto do arquivo. |
| 3 | `src/integrations/asaas/AsaasService.server.ts` | `cancelarAssinatura(subscriptionId)` já existe, pronta, faz `DELETE /subscriptions/{id}` — só precisa ser chamada. |
| 4 | `docs/seeds/questions.json` (1.000 registros) | 80 registros sem `package`/`packageVersion` — **todos pertencem a um único lote**: `contest = "concurso-publico-sesacre-edital-01-2022"` (IBFC, SES-AC 2022). Os outros 920 têm exatamente `package = "banco-de-questoes-enfermagem"`, `packageVersion = "1.0"`. |
| 5 | `docs/work/sesacre-2022/` | Contém `edital.pdf`, `prova.pdf`, `gabarito.pdf`, sem README de status — o lote foi convertido antes da convenção de `package`/`package_version` existir e nunca foi reconciliado depois. |
| 6 | `docs/seeds/taxonomy.json` (curso Enfermagem) | Confirma duas entradas de cargo: `"Técnico de Enfermagem"` (slug `tecnico-enfermagem`) e `"Técnico em Enfermagem"` (slug `tecnico-em-enfermagem`), ambas `status: ACTIVE`. |
| 7 | `docs/seeds/questions.json` — campo `position` usado pelas 1.000 questões | **Nenhuma questão referencia qualquer um dos dois cargos "Técnico"** — 100% das questões usam `position = "enfermeiro"`. A duplicidade não tem nenhuma questão vinculada hoje. |
| 8 | `package.json` | Scripts existentes: `seed:questions`, `seed:taxonomy`, `export:questions`, `export:taxonomy` — reaproveitáveis sem alteração para reprocessar os itens 4 e 6. |
| 9 | Suíte de testes automatizados do projeto | **Não existe test runner configurado** (`package.json` não tem `vitest`/`jest`/script `test`). Isso é uma limitação real do repositório, não desta sprint — cada item "Teste automatizado" abaixo é proposto assumindo essa lacuna, e não inclui configurar um framework de testes (seria uma mudança de arquitetura, fora do escopo desta fase). |

---

## 1. Nota técnica crítica — encontrada nesta análise, não estava em `AUDITORIA_FINAL.md`

Existe uma dependência técnica entre **AUD-01** (recorrência não neutralizada), **AUD-02** (planos vazios) e **AUD-03** (duração do ciclo nunca definida) que muda a estratégia de correção dos três:

`resolveNextExpiry()` (`src/lib/asaas-webhook.server.ts`, linhas 209–220) calcula o `expires_at` local do aluno consultando `nextDueDate` da assinatura no Asaas — ou seja, **a data de vencimento do acesso do aluno hoje é derivada do próximo ciclo de cobrança nativo do Asaas** (1 mês à frente, se `cycle = MONTHLY`; 1 ano à frente, se `cycle = YEARLY`).

Isso significa que, se a correção de AUD-01 for implementada literalmente como `05-CHECKOUT.md` sugere ("chamar `cancelarAssinatura()` logo após a ativação") **sem mais nada**, o `expires_at` do aluno continuará sendo de apenas 1 mês (ou 1 ano) — **independentemente da duração de ciclo que for decidida em AUD-03** (ex.: se o negócio decidir vender um ciclo de 3 ou 6 meses, o aluno seria expirado incorretamente em 1 mês, porque é o único valor que `nextDueDate` do Asaas consegue expressar nativamente).

**Consequência prática para este plano:** AUD-01 não pode ser corrigido isoladamente do valor decidido em AUD-03. A correção correta é: **parar de derivar `expires_at` do `nextDueDate` do Asaas, e calculá-lo localmente a partir da duração de ciclo decidida no plano** (`now + N meses`), já que a assinatura Asaas será cancelada logo em seguida e vai servir só como veículo de cobrança única — seu `nextDueDate` deixa de ter qualquer relação com o direito real de acesso do aluno. Isso é refletido na Sprint P0.3 abaixo.

Isso não é "misturar dois P0 independentes" — é uma dependência técnica real que só apareceu ao ler o código com atenção; ignorá-la faria a correção de AUD-01 parecer completa enquanto entrega um bug silencioso novo (acesso expirando um mês depois de vendido um ciclo maior).

---

## 2. Reclassificação — P0-A vs. P0-B

**Critério aplicado:** P0-A = impede a existência de qualquer venda (mecanicamente, hoje, ninguém consegue comprar, ou comprar agora é ativamente perigoso por desenho). P0-B = a venda em si é possível, mas o risco correspondente se materializa pouco depois (dentro da janela de garantia, ou quando o número de questões for anunciado publicamente).

### P0-A — impede qualquer venda imediatamente

| Ordem | ID | Nome curto | Por quê é P0-A |
|---|---|---|---|
| 1 | AUD-03 | Definir duração do ciclo e preço final | Sem isso, AUD-02 não pode ser preenchido com lastro documental — é a raiz da cadeia |
| 2 | AUD-02 | Configurar `COMMERCIAL_PLANS` | Bloqueio literal — hoje ninguém compra nada, a tela mostra "Nenhum plano disponível" |
| 3 | AUD-01 | Neutralizar recorrência do Asaas (+ corrigir `expires_at`) | Vender antes disso garante cobrança indevida no ciclo seguinte para 100% dos clientes — o risco mais alto de todo o conjunto, por isso tratado como bloqueador de venda "segura", não apenas de venda "possível" |

### P0-B — pode ser resolvido logo após, mas antes que o risco correspondente vença

| Ordem | ID | Nome curto | Prazo real de exposição ao risco |
|---|---|---|---|
| 4 | AUD-06 | Tratar `PAYMENT_REFUNDED`/chargeback no webhook | Precisa estar pronto antes do dia 7 do primeiro cliente real (garantia de 7 dias, `03-PRICING.md`) |
| 5 | AUD-07 | Fixar canal de suporte + validar revogação manual de acesso | Mesmo prazo do item acima — os dois formam o mesmo runbook |
| 6 | AUD-04 | Corrigir as 80 questões órfãs (lote SES-AC 2022) | Antes de qualquer comunicação pública que reafirme "1.000 questões" |
| 7 | AUD-05 | Resolver duplicidade do cargo "Técnico" | Menor urgência real (zero questões afetadas hoje), mas já é pré-requisito autodeclarado desde `01-GO_LIVE.md` — resolver antes do fim da Onda A |

---

## 3. Sequência de sprints

```
Sprint P0.1 → Sprint P0.2 → Sprint P0.3   (cadeia obrigatória, cada uma depende da anterior)
Sprint P0.4 ⇄ Sprint P0.5                  (mesmo runbook de garantia — podem rodar em paralelo entre si)
Sprint P0.6                                 (independente, pode rodar em paralelo com qualquer uma acima)
Sprint P0.7                                 (independente, menor urgência, pode ser a última)
```

Nenhuma sprint mistura dois bloqueadores independentes. P0.1–P0.3 são sequenciais porque são **dependentes de verdade** (ver seção 1), não por conveniência.

---

## 4. Detalhamento por sprint

---

### Sprint P0.1 — Definir duração do ciclo e preço final do Plano Fundador

- **ID:** AUD-03
- **Nome:** Fechar a lacuna de duração/preço nunca decidida
- **Problema:** `02-PLANS.md` §6 e `03-PRICING.md` §3/§6 nunca declaram quantos meses dura o ciclo nem o preço total — apenas um "ticket mensal equivalente" (~R$24,90/mês).
- **Causa raiz:** decisão de negócio parada na faixa de preço, nunca fechada em um número único.
- **Arquivos envolvidos:** nenhum arquivo de código nesta sprint — é uma decisão que alimenta o campo a ser criado na Sprint P0.2. Se for necessário registrar a decisão em algum lugar, o único lugar apropriado é como comentário/valor no próprio `src/config/commercial-plans.ts`, preenchido na sprint seguinte — não um novo documento.
- **Risco:** Baixo em si mesma; alto se pulada (contamina P0.2 e P0.3 com um valor inventado na hora).
- **Complexidade:** Trivial — decisão, não engenharia.
- **Dependências:** Nenhuma. É o primeiro elo da cadeia.
- **Estratégia de correção:** Decidir, com base na faixa "Competitiva" já aprovada (~R$24,90/mês equivalente), dois números fechados: (a) duração do ciclo em meses, (b) preço total em R$ coerente com (a) × ticket mensal aprovado. Escolher também qual `cycle` nativo do Asaas (`MONTHLY` ou `YEARLY`) será usado para gerar a cobrança — **nota:** por causa da observação da seção 1, esse `cycle` passa a ser só o veículo de cobrança inicial, não a fonte do prazo de acesso real; ainda assim, escolher `MONTHLY` é o mais simples operacionalmente.
- **Checklist:**
  - [x] Duração do ciclo em meses decidida e registrada — **6 meses** (`03-PRICING.md` §13)
  - [x] Preço total em R$ decidido, coerente com o ticket mensal de `03-PRICING.md` — **R$ 149,90**
  - [x] Rótulo comercial final do plano confirmado (mesmo texto do "Plano Fundador" já usado em `04-LANDING.md`)
  - [x] Número de vagas do Plano Fundador (AUD-15 da auditoria) decidido junto — **50 vagas**
- **Decisão registrada (2026-07-14):** ver `03-PRICING.md` §13. Resumo: 6 meses · R$ 149,90 · Plano Fundador · 50 vagas · `cycle` Asaas `MONTHLY` (veículo de cobrança apenas).
- **Critério de aceite:** existe um número de meses e um preço total escritos em algum lugar rastreável (ainda que uma anotação simples), prontos para virar os campos de `CommercialPlan` na Sprint P0.2.
- **Teste manual:** nenhum — é uma decisão, não uma implementação testável.
- **Teste automatizado:** não aplicável.
- **Rollback:** não aplicável (nenhum artefato de código é criado).
- **Tempo estimado:** decisão pontual — não é trabalho de engenharia, é uma reunião/decisão de poucas horas.

---

### Sprint P0.2 — Configurar `COMMERCIAL_PLANS` com o Plano Fundador real

- **ID:** AUD-02
- **Nome:** Preencher o catálogo de planos vendáveis
- **Problema:** `COMMERCIAL_PLANS` é `[]` — a tela `/app/subscription` mostra "Nenhum plano disponível no momento" para qualquer aluno.
- **Causa raiz:** array deixado vazio deliberadamente até a decisão comercial ser fechada (comentário já existente no arquivo confirma a intenção) — a decisão em si (Sprint P0.1) era o bloqueio real.
- **Arquivos envolvidos:**
  - `src/config/commercial-plans.ts` — adicionar 1 objeto ao array `COMMERCIAL_PLANS`; adicionar 1 campo novo ao tipo `CommercialPlan` para a duração do ciclo em meses (ex.: `accessDurationMonths: number`), consumido pela Sprint P0.3.
- **Risco:** Baixo — é preenchimento de dado em um arquivo já preparado para isso; o `distributionId` precisa apontar exatamente para a distribuição real já existente ("Distribuição RC1 - Enfermagem"), erro aqui venderia acesso a um conteúdo errado.
- **Complexidade:** Baixa.
- **Dependências:** Sprint P0.1 (precisa do preço e da duração decididos); precisa confirmar o `distributionId` real da distribuição ativa antes de preencher (consulta simples, não é uma nova decisão).
- **Estratégia de correção:** Adicionar um único objeto ao array com os valores decididos em P0.1 e o `distributionId` real. Adicionar o campo de duração ao tipo `CommercialPlan` na mesma sprint, já que sem ele o valor decidido em P0.1 não tem onde ser guardado — e a Sprint P0.3 depende diretamente desse campo existir.
- **Checklist:**
  - [ ] Campo de duração (`accessDurationMonths` ou nome equivalente) adicionado ao tipo `CommercialPlan`
  - [ ] Objeto do Plano Fundador adicionado a `COMMERCIAL_PLANS` com `id`, `label`, `description`, `distributionId`, `value`, `cycle`, `billingType`, e o novo campo de duração
  - [ ] `distributionId` confirmado contra a distribuição real ativa (consulta ao banco/admin, não suposição)
  - [ ] Nome/descrição do plano idênticos à copy já aprovada em `04-LANDING.md` (evita a inconsistência de nome já sinalizada em `05-CHECKOUT.md` §3.4)
- **Critério de aceite:** `/app/subscription` exibe o Plano Fundador para uma conta sem assinatura, com nome, descrição e preço corretos; o botão "Assinar" abre o modal de CPF normalmente.
- **Teste manual:** criar uma conta de teste nova → abrir `/app/subscription` → confirmar que o card do plano aparece com os dados corretos → clicar em "Assinar" → confirmar que o modal de CPF abre.
- **Teste automatizado:** não há test runner configurado no projeto hoje (ver seção 0, item 9). Substituto imediato: um script Node pontual (`tsx` ad-hoc, descartável) que importa `COMMERCIAL_PLANS` e valida que o array tem exatamente 1 item com todos os campos obrigatórios preenchidos e `value > 0` — não é uma suíte de testes, é uma checagem de sanidade de dado.
- **Rollback:** reverter o arquivo para `COMMERCIAL_PLANS = []` (um único commit revert) — a tela volta a mostrar "Nenhum plano disponível", nenhum dado é perdido.
- **Tempo estimado:** poucas horas (preenchimento + confirmação do `distributionId`).

---

### Sprint P0.3 — Neutralizar recorrência automática do Asaas e corrigir o cálculo de `expires_at`

- **ID:** AUD-01
- **Nome:** Impedir cobrança automática do próximo ciclo e alinhar o prazo de acesso à duração real vendida
- **Problema:** A assinatura Asaas criada em `iniciarCheckout` é nativamente recorrente; nada a cancela após o primeiro pagamento. Adicionalmente (achado da seção 1), o `expires_at` local é hoje derivado do `nextDueDate` do Asaas, que não tem relação com a duração de ciclo comercial decidida em P0.1.
- **Causa raiz:** o modelo técnico reaproveita a assinatura nativa do Asaas como mecanismo de cobrança, mas nunca foi adaptado para o modelo de negócio "acesso por ciclo, sem recorrência" decidido em `02-PLANS.md` — nem no ponto de cancelar a assinatura, nem no ponto de calcular a data de expiração local.
- **Arquivos envolvidos:**
  - `src/lib/asaas-webhook.server.ts` — no bloco `PAYMENT_CONFIRMED`/`PAYMENT_RECEIVED` (linhas 239–270): (a) substituir a chamada a `resolveNextExpiry` por um cálculo local `now + plan.accessDurationMonths meses`; (b) chamar `AsaasService.cancelarAssinatura(payload.payment.subscription)` após a ativação bem-sucedida, dentro de um `try/catch` que apenas registra erro em `logs` sem impedir a ativação (a ativação do aluno não pode falhar por causa de uma falha ao cancelar a cobrança futura).
  - Precisa resolver `planId`/`accessDurationMonths` a partir do `distributionId` do `externalReference` — reaproveita `findCommercialPlan`/estrutura já existente em `src/config/commercial-plans.ts`, sem criar tabela ou campo novo além do já adicionado em P0.2.
- **Risco:** Médio — é o núcleo do fluxo de ativação de pagamento; um erro aqui pode impedir ativações reais. Mitigado por manter a chamada de cancelamento em bloco isolado que nunca interrompe a ativação.
- **Complexidade:** Média — toca lógica de negócio central do webhook, mas é uma mudança localizada (duas alterações dentro de uma função já existente, nenhuma tabela nova).
- **Dependências:** Sprint P0.2 (precisa do campo de duração já existir e estar preenchido no plano real).
- **Estratégia de correção:** 1) calcular `expiresAt` localmente a partir da duração do plano, não do Asaas; 2) logo após confirmar a ativação, chamar `cancelarAssinatura` no `subscriptionId` do Asaas, para impedir a próxima cobrança nativa; 3) qualquer falha nesse cancelamento é registrada em `logs` (`asaas.webhook.error`, stage `cancel_after_activation`) para revisão manual, mas não bloqueia o acesso do aluno.
- **Checklist:**
  - [ ] `expires_at` calculado a partir de `now + accessDurationMonths` do plano, não de `resolveNextExpiry`
  - [ ] `cancelarAssinatura` chamada após ativação bem-sucedida, dentro de bloco que não derruba a ativação em caso de erro
  - [ ] Erro de cancelamento (se houver) registrado em `logs` com estágio identificável
  - [ ] `resolveNextExpiry`/`consultarAssinatura` — decidir se a função antiga é removida ou mantida sem uso; se mantida, documentar que não é mais a fonte de `expires_at` para evitar confusão futura
- **Critério de aceite:** um pagamento confirmado em sandbox resulta em (a) `subscriptions.expires_at` igual a `hoje + accessDurationMonths` do plano, e (b) a assinatura correspondente no Asaas aparece como cancelada/inativa logo após a confirmação (verificável via `consultarAssinatura` ou painel do Asaas).
- **Teste manual:** no sandbox do Asaas, simular um `PAYMENT_CONFIRMED` de teste → verificar `subscriptions.expires_at` no banco → consultar a assinatura no painel/API do Asaas e confirmar que está cancelada → confirmar que nenhum novo `PAYMENT_CONFIRMED` é gerado automaticamente no ciclo seguinte (aguardar ou simular a data).
- **Teste automatizado:** sem test runner configurado (seção 0, item 9); substituto imediato é um script pontual que chama `processAsaasWebhookEvent` com um payload de `PAYMENT_CONFIRMED` mockado (mock de `AsaasService.consultarAssinatura`/`cancelarAssinatura`) e verifica os dois efeitos (expires_at correto, cancelamento chamado) — script descartável de verificação, não uma suíte permanente.
- **Rollback:** reverter as duas alterações no `asaas-webhook.server.ts`. Importante: assinaturas já canceladas no Asaas antes do rollback continuam canceladas — o rollback afeta só pagamentos futuros, não desfaz cancelamentos já realizados (comportamento aceitável, pois cancelar uma cobrança futura nunca é uma ação destrutiva para o aluno).
- **Tempo estimado:** a mudança de código em si é pequena (uma função), mas o tempo real está na homologação em sandbox — tratar como a sprint mais sensível da lista de P0-A.

---

### Sprint P0.4 — Tratar `PAYMENT_REFUNDED` e mapear chargeback no webhook

- **ID:** AUD-06
- **Nome:** Reembolso/chargeback passam a desativar o acesso automaticamente
- **Problema:** `PAYMENT_REFUNDED` não está em `SUPPORTED_EVENTS`; um reembolso processado no painel do Asaas hoje não revoga o acesso local.
- **Causa raiz:** o conjunto de eventos tratados foi definido para o fluxo de ativação (Sprint 4.2C original) e nunca foi revisitado para cobrir o ciclo de saída (reembolso/contestação).
- **Arquivos envolvidos:**
  - `src/lib/asaas-webhook.server.ts` — adicionar `"PAYMENT_REFUNDED"` a `SUPPORTED_EVENTS`; adicionar um `case "PAYMENT_REFUNDED"` no `switch` de `processAsaasWebhookEvent` que chama `deactivateSubscription` com `reason: "refunded"` (mesmo padrão de `PAYMENT_OVERDUE`).
- **Risco:** Baixo-médio — segue exatamente o padrão já existente de `PAYMENT_OVERDUE`, mas depende de confirmar o nome exato do(s) evento(s) de chargeback na documentação oficial do Asaas antes de mapeá-los (ver checklist).
- **Complexidade:** Baixa para o reembolso (replica um padrão existente); indeterminada para chargeback até a pesquisa de nomenclatura ser feita.
- **Dependências:** Nenhuma técnica — pode rodar em paralelo com P0.1–P0.3.
- **Estratégia de correção:** replicar o tratamento já usado para `PAYMENT_OVERDUE`, chamando `deactivateSubscription` com uma razão própria (`"refunded"`) para manter o histórico de auditoria diferenciável. Para chargeback, como o Asaas não expõe um evento único e claramente documentado neste conjunto (`PAYMENT_GATEWAY_ARCHITECTURE_V1.md` já registrava essa incerteza), o primeiro passo é uma verificação pontual na documentação oficial do Asaas — não uma suposição de nome de evento.
- **Checklist:**
  - [ ] `"PAYMENT_REFUNDED"` adicionado a `SUPPORTED_EVENTS`
  - [ ] `case "PAYMENT_REFUNDED"` implementado, chamando `deactivateSubscription(..., reason: "refunded")`
  - [ ] Nome(s) exato(s) do(s) evento(s) de chargeback confirmados na documentação oficial do Asaas (pesquisa pontual, não suposição)
  - [ ] Evento(s) de chargeback confirmados adicionados a `SUPPORTED_EVENTS` com o mesmo tratamento
- **Critério de aceite:** um evento `PAYMENT_REFUNDED` simulado em sandbox desativa a assinatura local correspondente (`status = INACTIVE`) e gera uma entrada em `logs` com `action = "asaas.subscription.refunded"`.
- **Teste manual:** simular um evento `PAYMENT_REFUNDED` (reenvio manual no sandbox do Asaas, ou POST direto ao endpoint de webhook com payload de teste) → confirmar `subscriptions.status = INACTIVE` → confirmar acesso bloqueado ao tentar iniciar uma sessão de estudo.
- **Teste automatizado:** sem test runner (seção 0, item 9); substituto imediato: script pontual chamando `processAsaasWebhookEvent` com payload `PAYMENT_REFUNDED` mockado, verificando a chamada a `deactivateSubscription` e o registro em `logs`.
- **Rollback:** remover o evento de `SUPPORTED_EVENTS` e o `case` correspondente — reembolsos voltam a exigir desativação manual (o processo definido na Sprint P0.5 continua funcionando como fallback).
- **Tempo estimado:** pequena para o reembolso; a parte de chargeback depende do tempo de confirmar a nomenclatura oficial do Asaas antes de codificar.

---

### Sprint P0.5 — Fixar canal de suporte e validar o runbook manual de revogação de acesso

- **ID:** AUD-07
- **Nome:** Garantir que existe, de fato, um caminho funcional para o pedido de reembolso/cancelamento chegar a alguém
- **Problema:** Nenhum canal de suporte (e-mail dedicado, WhatsApp) foi formalizado em nenhuma tela ou documento; o aluno não tem botão self-service, e o processo manual via `/admin/subscriptions` nunca foi testado ponta a ponta.
- **Causa raiz:** decisão operacional (não técnica) nunca fechada — `06-EMAILS.md` §0 já registrava isso como dependência assumida, não resolvida.
- **Arquivos envolvidos:** nenhum arquivo de código é estritamente necessário — `/admin/subscriptions` já tem a capacidade de ativar/desativar manualmente uma assinatura (`src/components/admin/subscriptions/SubscriptionsPage.tsx`, já existente). Esta sprint é primariamente operacional: decidir o canal e ensaiar o processo usando a tela já existente.
- **Risco:** Alto se pulada (é o item que garante que a garantia de 7 dias, já anunciada, é honrada na prática) — mas baixo risco técnico, já que não modifica código.
- **Complexidade:** Baixa tecnicamente, mas exige uma decisão operacional real (quem responde, em qual canal, com que prazo).
- **Dependências:** Nenhuma técnica — pode rodar em paralelo com qualquer outra sprint.
- **Estratégia de correção:** 1) decidir e fixar um canal único (e-mail dedicado ou WhatsApp); 2) simular ponta a ponta, com uma conta de teste: aluno "pede reembolso" → alguém localiza a assinatura em `/admin/subscriptions` → desativa manualmente → confirma que o acesso é bloqueado imediatamente. Isso não cria nenhuma tela nova — apenas comprova que a tela existente resolve o problema operacionalmente.
- **Checklist:**
  - [ ] Canal de suporte único decidido e documentado internamente (fora deste conjunto de documentos comerciais, conforme instrução de não alterá-los)
  - [ ] Ensaio ponta a ponta realizado com conta de teste: localizar assinatura → desativar → confirmar bloqueio de acesso
  - [ ] Prazo real de resposta definido (o mesmo prazo que `06-EMAILS.md` fluxo 4.17 pede para ser "o prazo real que a operação consegue cumprir")
- **Critério de aceite:** existe um canal único conhecido, e uma conta de teste desativada manualmente via `/admin/subscriptions` perde acesso ao Portal do Aluno imediatamente, sem exigir nenhuma alteração de código.
- **Teste manual:** o próprio ensaio descrito na estratégia de correção é o teste.
- **Teste automatizado:** não aplicável — é um processo operacional, não uma lógica de código.
- **Rollback:** não aplicável (nenhum código é alterado).
- **Tempo estimado:** curto — é uma decisão operacional mais um ensaio de poucos minutos na tela já existente.

---

### Sprint P0.6 — Corrigir as 80 questões órfãs do lote SES-AC 2022

- **ID:** AUD-04
- **Nome:** Reconciliar `package`/`packageVersion` do lote `concurso-publico-sesacre-edital-01-2022`
- **Problema:** 80 das 1.000 questões do Acervo não têm `package`/`packageVersion` preenchidos, tornando-as invisíveis para qualquer aluno mesmo pagante.
- **Causa raiz:** identificada com precisão nesta auditoria — todas as 80 questões pertencem a um único lote de importação (SES-AC 2022, IBFC) que foi convertido antes da convenção `package`/`package_version` existir no pipeline, e nunca foi reprocessado depois da correção de causa-raiz do Seed (fase anterior desta conversa).
- **Arquivos envolvidos:**
  - `docs/seeds/questions.json` — atribuir `package: "banco-de-questoes-enfermagem"` e `packageVersion: "1.0"` aos 80 registros com `contest = "concurso-publico-sesacre-edital-01-2022"` (os mesmos valores já usados pelas outras 920 questões — não é um valor novo, é replicar o padrão existente).
- **Risco:** Baixo — é um patch de dado que replica exatamente um valor já usado 920 vezes no mesmo arquivo; não introduz um `package_version` novo, não muda o pipeline.
- **Complexidade:** Trivial.
- **Dependências:** Nenhuma.
- **Estratégia de correção:** patch direto dos 80 registros em `docs/seeds/questions.json` (script pontual de edição em massa, filtrando por `contest`), seguido de `npm run seed:questions` para propagar `package_version_id` ao banco via o contrato de seed já corrigido em fase anterior.
- **Checklist:**
  - [ ] Confirmar que os 80 registros pertencem de fato ao lote SES-AC 2022 (`contest = "concurso-publico-sesacre-edital-01-2022"`) antes de aplicar o patch
  - [ ] Aplicar `package`/`packageVersion` idênticos aos das outras 920 questões
  - [ ] Rodar `npm run seed:questions`
  - [ ] Confirmar em banco que as 80 questões agora têm `package_version_id` preenchido (mesma consulta usada no diagnóstico original de `01-GO_LIVE.md`)
- **Critério de aceite:** contagem de questões com `package_version_id = NULL` no banco cai a zero; as 1.000 questões aparecem no painel Acervo/Admin.
- **Teste manual:** logar como aluno com assinatura ativa → abrir uma sessão de estudo filtrada pela disciplina/banca do lote SES-AC 2022 → confirmar que as questões aparecem.
- **Teste automatizado:** sem test runner (seção 0, item 9); substituto imediato: o mesmo script de contagem usado nesta auditoria (`node -e` filtrando `!q.package || !q.packageVersion`) rodado antes/depois do patch, confirmando que o resultado vai de 80 para 0.
- **Rollback:** reverter o commit do patch em `docs/seeds/questions.json` e rodar `npm run seed:questions` novamente — as 80 questões voltam a ficar invisíveis, sem efeito colateral em outras questões.
- **Tempo estimado:** curto — é um patch de dado mecânico mais o tempo do próprio `seed:questions`.

---

### Sprint P0.7 — Resolver a duplicidade do cargo "Técnico (em/de) Enfermagem"

- **ID:** AUD-05
- **Nome:** Remover a entrada de cargo duplicada na taxonomia
- **Problema:** `docs/seeds/taxonomy.json` tem duas entradas de cargo para o mesmo conceito: `"Técnico de Enfermagem"` e `"Técnico em Enfermagem"`, ambas ativas.
- **Causa raiz:** as duas variantes de nome foram cadastradas em momentos diferentes da produção da taxonomia sem verificação de duplicidade — nenhuma questão jamais foi vinculada a nenhuma das duas, confirmando que o cargo nunca chegou a ser usado de fato (o Acervo de 1.000 questões é 100% do cargo Enfermeiro).
- **Arquivos envolvidos:**
  - `docs/seeds/taxonomy.json` — remover uma das duas entradas de `positions` dentro do curso `"Enfermagem"`.
- **Risco:** Muito baixo — confirmado que nenhuma das 1.000 questões referencia `position` igual a qualquer uma das duas variantes de "Técnico" (100% usam `"enfermeiro"`). Remover uma delas não desvincula nenhum conteúdo real.
- **Complexidade:** Trivial.
- **Dependências:** Nenhuma.
- **Estratégia de correção:** manter `"Técnico em Enfermagem"` (nomenclatura oficial da categoria profissional reconhecida pelo COFEN no Brasil) e remover `"Técnico de Enfermagem"` do array `positions`, depois rodar `npm run seed:taxonomy` para propagar a remoção ao banco.
- **Checklist:**
  - [ ] Confirmar mais uma vez, antes de remover, que nenhuma questão referencia `"tecnico-enfermagem"` (slug da entrada a ser removida) — checagem rápida, já feita nesta auditoria, repetir por segurança antes de aplicar
  - [ ] Remover a entrada duplicada de `docs/seeds/taxonomy.json`
  - [ ] Rodar `npm run seed:taxonomy`
  - [ ] Confirmar em banco/admin que só resta um cargo "Técnico" sob o curso Enfermagem
- **Critério de aceite:** listagem de cargos do curso Enfermagem (admin ou banco) mostra `Enfermeiro` e `Técnico em Enfermagem`, sem duplicata.
- **Teste manual:** abrir a tela de administração de cargos/taxonomia → confirmar visualmente que a duplicata não aparece mais.
- **Teste automatizado:** sem test runner (seção 0, item 9); substituto imediato: script pontual contando entradas de `positions` com `slug` contendo `tecnico` no curso Enfermagem, esperando exatamente 1 após a correção.
- **Rollback:** reverter o commit em `docs/seeds/taxonomy.json` e rodar `npm run seed:taxonomy` novamente — a entrada duplicada volta, sem efeito colateral (nenhum dado dependia dela).
- **Tempo estimado:** curto — edição de um único arquivo mais o tempo do `seed:taxonomy`.

---

## 5. Visão consolidada

| Sprint | ID | Arquivos tocados | Risco | Complexidade | Bloqueia venda? |
|---|---|---|---|---|---|
| P0.1 | AUD-03 | Nenhum (decisão) | Baixo | Trivial | Sim (raiz da cadeia) |
| P0.2 | AUD-02 | `commercial-plans.ts` | Baixo | Baixa | Sim (literal) |
| P0.3 | AUD-01 | `asaas-webhook.server.ts` | Médio | Média | Sim (venda seria insegura) |
| P0.4 | AUD-06 | `asaas-webhook.server.ts` | Baixo-médio | Baixa | Não (mas expõe garantia) |
| P0.5 | AUD-07 | Nenhum (operacional) | Alto se pulada / técnico baixo | Baixa | Não (mas expõe garantia) |
| P0.6 | AUD-04 | `questions.json` | Baixo | Trivial | Não (mas expõe promessa "1.000 questões") |
| P0.7 | AUD-05 | `taxonomy.json` | Muito baixo | Trivial | Não |

**Nota sobre créditos do Cursor:** as sete sprints, somadas, tocam no máximo 4 arquivos de código-fonte distintos (`commercial-plans.ts`, `asaas-webhook.server.ts`, mais os dois arquivos de dado `questions.json`/`taxonomy.json`) — nenhuma delas exige refactor, nenhuma cria arquivo novo, nenhuma introduz dependência nova. P0.3 é a única sprint de complexidade real; todas as outras são preenchimento de dado ou adição de um `case`/evento a uma estrutura já existente.

---

*Fim do plano. Nenhum outro documento de `docs/commercial/` foi modificado. Nenhum código foi escrito. Aguardando validação antes de qualquer início de implementação real.*
