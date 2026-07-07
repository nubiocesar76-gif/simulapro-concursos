# Fase 4 — Roadmap Comercial do SimulaPro (V1.0)

**Data:** 2026-07-07
**Objetivo:** definir a arquitetura comercial que permite iniciar vendas — fluxo de compra, planos, pagamento, ciclo de vida da assinatura e suporte.
**Natureza:** roadmap de produto/negócio. Sem código, sem desenho de schema, sem alteração da arquitetura, do banco ou das regras de negócio já existentes.
**Base:** o que já existe hoje (`00-VISAO-GERAL.md`, `01-ARQUITETURA.md`) — `subscriptions`, `content_distributions`, `package_versions`, Supabase Auth, roles `admin`/`student`. Este documento **adiciona** uma camada comercial sobre esse modelo; não o substitui.

**Fora de escopo deste documento:** preços específicos, condições comerciais do gateway (taxas, prazos de repasse), desenho de colunas/tabelas novas, texto legal (termos de uso, política de cancelamento). Onde uma decisão técnica for necessária no futuro, ela é sinalizada, não especificada aqui.

---

## 1. Fluxo completo da compra

```
Visitante → Escolhe plano → Cadastro/Login → Checkout (pagamento) → Confirmação
    → Ativação automática da assinatura → Primeiro acesso ao Portal do Aluno
```

**Por que cadastro antes do pagamento:** o produto já usa conta + role (`student`) como unidade de acesso — criar a conta antes do checkout evita fluxo de "carrinho anônimo" e reaproveita o `/auth` e o trigger `handle_new_user` já existentes, sem exigir nova lógica de sessão.

| Etapa | O que acontece | Reaproveita hoje | Novo nesta fase |
|---|---|---|---|
| Visitante | Vê a página de planos | Landing (`/`) como ponto de entrada | Página de planos/preços (pública) |
| Cadastro/Login | Cria conta ou entra com conta existente | `/auth`, Supabase Auth, role `student` automática | — |
| Checkout | Escolhe forma de pagamento, confirma compra | — | Página de checkout + integração com gateway |
| Ativação | Gateway confirma pagamento → assinatura liberada | Tabela `subscriptions`, `content_distributions` | Webhook do gateway criando/ativando a assinatura automaticamente, no lugar do Admin fazer isso manualmente |
| Primeiro acesso | Aluno entra em `/app` e já vê o conteúdo liberado | Dashboard do Aluno já lê `subscriptions`/`content_distributions` — nenhuma mudança necessária aqui | — |

A ativação automática **substitui**, para compras comerciais, o fluxo manual que o Admin usa hoje em `/admin/subscriptions` — esse fluxo manual continua existindo para casos especiais (cortesia, parceria, suporte).

---

## 2. Planos comerciais

Um "plano comercial" é um pacote de venda — não uma tabela nova. Ele mapeia para uma ou mais `content_distributions` já existentes:

| Tipo de plano | Mapeamento no modelo atual |
|---|---|
| Plano por curso | 1 plano → 1 `content_distribution` (o curso vendido) |
| Plano combo | 1 plano → N `content_distributions` (múltiplos cursos), ativadas juntas pelo mesmo pagamento |
| Duração (mensal/anual/etc.) | Mesmo plano, `expires_at` calculado a partir da duração escolhida no checkout |

**Preço, nomes comerciais e quais cursos entram em cada plano são decisão comercial da equipe** — fora do escopo deste documento. O que este roadmap define é que a estrutura de dados para representar "o que o aluno comprou" já existe (`content_distributions` + `subscriptions`) e não precisa ser reinventada.

---

## 3. Gateway de pagamento recomendado (Brasil)

**Critérios de escolha, nesta ordem:** (1) assinatura recorrente nativa (cobrança automática, webhooks de sucesso/falha, cancelamento), (2) meios de pagamento brasileiros (cartão de crédito recorrente, Pix, boleto), (3) portal de autoatendimento do próprio gateway (ver seção 10), (4) qualidade de documentação e webhooks para sincronizar com `subscriptions`.

**Recomendação primária: Stripe.** API e webhooks de assinatura maduros, portal de cliente pronto (Stripe Billing Portal), boa documentação de integração com stacks Supabase/serverless — reduz a construção própria em praticamente todas as seções deste documento (assinatura, renovação, cancelamento, dunning, portal de autoatendimento).

**Alternativas nativas do Brasil a comparar antes de decidir:** Vindi e Iugu — especializadas em assinatura recorrente para SaaS brasileiro, com Pix e boleto recorrente maduros nativamente.

**Importante:** taxas, cobertura exata de Pix/boleto recorrente e condições comerciais mudam com frequência — validar as condições atuais de cada gateway no momento da implementação, não a partir deste documento.

---

## 4. Renovação automática

- A cobrança recorrente é responsabilidade do gateway (ele decide quando cobrar, com base no plano).
- Webhook de renovação bem-sucedida → estende `expires_at`, mantém `status = ACTIVE`. Nenhum campo novo necessário além do que `subscriptions` já tem.
- Webhook de falha na cobrança → não expira imediatamente; entra no fluxo de recuperação (seção 8) antes de bloquear.

---

## 5. Cancelamento

- Self-service, a partir da área "Minha Assinatura" (seção 10) — o aluno não deveria precisar contatar o Admin para cancelar.
- Padrão: cancelar interrompe a **renovação futura**, mas mantém acesso até `expires_at` do ciclo já pago (prática padrão de mercado; evita reembolso proporcional).
- Confirmação explícita antes de efetivar (mesmo padrão de diálogo de confirmação já usado em todo o Admin/Aluno — reaproveitar, não criar um novo).
- Cancelamento manual pelo Admin continua possível via `/admin/subscriptions`, sem mudança.

---

## 6. Expiração da assinatura

- `expires_at` já existe em `subscriptions`. Quando vencida sem renovação, `status` muda para `INACTIVE`.
- **Verificação necessária antes de lançar:** confirmar se o acesso do aluno hoje já respeita `expires_at` além de `status = ACTIVE`, ou se essa checagem precisa ser adicionada — é um ajuste técnico a validar na implementação, não um redesenho de arquitetura.

---

## 7. Liberação e bloqueio automático de acesso

Não exige mecanismo novo: o modelo atual já controla acesso via `subscriptions.status` + `content_distributions.status`/datas de disponibilidade (ver `01-ARQUITETURA.md`). A única mudança operacional é **quem** muda `status` — hoje é o Admin manualmente; no fluxo comercial, passa a ser o webhook do gateway automaticamente. A regra de acesso em si não muda.

---

## 8. Recuperação de pagamentos recusados

Fluxo padrão de dunning, delegado ao gateway sempre que possível (a maioria já oferece "smart retries" nativos):

```
Cobrança falha → gateway tenta novamente (dias 1, 3, 7 — configurável no gateway)
    → e-mail ao aluno a cada tentativa (seção 11)
    → acesso mantido durante as tentativas (grace period)
    → todas as tentativas falham → status muda para inativo → acesso bloqueado
    → aluno atualiza forma de pagamento em "Minha Assinatura" → reativação
```

---

## 9. Cupons

Não bloqueante para o lançamento da V1.0. Registrado porque é comum em aquisição de concurseiros (promoções sazonais, indicação).
**Recomendação:** usar o sistema de cupom/desconto nativo do gateway escolhido — não construir lógica própria de cupom no SimulaPro. Pode entrar em uma fase posterior sem exigir mudança de arquitetura.

---

## 10. Área "Minha Assinatura"

Página nova no Portal do Aluno (ex.: `/app/subscription`), hoje inexistente. Deve mostrar:

- Plano atual, status, data de renovação/expiração
- Forma de pagamento (sem lidar com dado de cartão diretamente — ver abaixo)
- Botão de cancelar (seção 5)
- Histórico de cobranças

**Recomendação central:** para forma de pagamento e histórico de cobrança, **reaproveitar o portal de autoatendimento do próprio gateway** (ex.: Stripe Billing Portal) via link/redirecionamento, em vez de construir uma tela própria de gestão de cartão. Reduz escopo de implementação e evita o SimulaPro lidar com dado sensível de pagamento.

---

## 11. E-mails automáticos

| E-mail | Gatilho | Responsável recomendado |
|---|---|---|
| Confirmação de cadastro | Signup | Já existe via Supabase Auth |
| Confirmação de pagamento / ativação | Webhook de pagamento aprovado | Gateway (transacional) ou serviço de e-mail do produto |
| Aviso de cobrança recusada | Cada tentativa de dunning (seção 8) | Gateway (a maioria já dispara nativamente) |
| Confirmação de cancelamento | Ação em "Minha Assinatura" | Serviço de e-mail do produto |
| Aviso de expiração | Fim do acesso após dunning esgotado | Serviço de e-mail do produto |

**Recomendação:** usar os e-mails transacionais nativos do gateway para tudo ligado a cobrança (evita duplicar lógica de billing no SimulaPro); um serviço de e-mail transacional separado (ex.: Resend/Postmark) só para os e-mails de produto que o gateway não cobre.

---

## 12. Fluxo de suporte

Sem necessidade de sistema de tickets para a V1.0 — consistente com a filosofia de simplicidade do produto (`DESIGN_PRINCIPLES.md` §3). Recomendação mínima: um canal único de contato (e-mail dedicado ou WhatsApp), referenciado a partir de "Minha Assinatura" e dos e-mails de cobrança recusada/expiração — os dois momentos de maior probabilidade de o aluno precisar de ajuda.

---

## Fluxo recomendado (resumo)

```
Plano → Cadastro/Login → Checkout (gateway) → Webhook de ativação → Acesso liberado
   ↓ (durante o ciclo)
Renovação automática ⇄ Recuperação de pagamento recusado ⇄ Cancelamento self-service
   ↓
Expiração → bloqueio automático → (reativação possível via Minha Assinatura)
```

---

## Ordem de implementação

1. Escolher e configurar o gateway (conta, sandbox) — seção 3
2. Mapear planos comerciais para `content_distributions` existentes — seção 2
3. Página pública de planos + checkout — seção 1
4. Webhook de ativação automática de assinatura — seções 1 e 7
5. Área "Minha Assinatura", reaproveitando o portal do gateway — seção 10
6. Renovação automática e verificação de expiração — seções 4 e 6
7. Recuperação de pagamentos recusados (dunning) — seção 8
8. Cancelamento self-service — seção 5
9. E-mails automáticos — seção 11
10. Fluxo de suporte — seção 12
11. Cupons (opcional, pós-lançamento) — seção 9
