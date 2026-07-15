# GO_NO_GO — Checklist Oficial de Lançamento

**Documento:** Referência única para autorizar Soft Launch e, posteriormente, Hard Launch do SimulaPro V1
**Data:** 2026-07-15
**Fontes:** `01-GO_LIVE.md` a `09-ROADMAP.md`, `AUDITORIA_FINAL.md`, `JURIDICO.md`, `P0_IMPLEMENTATION_PLAN.md`
**Escopo:** apenas checklist executivo. Nenhum código foi escrito, nenhum documento existente foi alterado, nenhuma implementação foi iniciada.

**Como ler este documento:** ☐ = pendente/não cumprido · ☑ = cumprido e verificado nesta data (2026-07-15). Um item marcado ☑ foi confirmado nesta sessão ou em sessão anterior desta mesma auditoria — não é uma suposição. Onde o estado real não pôde ser confirmado diretamente, isso está dito explicitamente na Observação, não presumido a favor do lançamento.

---

## 1. Engenharia

| Item | Status | Obrigatório | Critério de aceite | Observação | Responsável |
|---|---|---|---|---|---|
| Portal Admin | ☑ | Sim | CRUD de conteúdo, taxonomia e assinaturas funcional | Concluído conforme checkpoint de Fase 8; porém `/admin/subscriptions` não consulta o Asaas ao vivo (visibilidade menor que a do próprio aluno) — não bloqueia, mas limita a operação manual descrita no Bloco 5 | Fundador |
| Portal Aluno | ☑ | Sim | Estudo, Prova, Revisão, Favoritos, Apenas Erradas, painel de desempenho funcionais | Concluído conforme checkpoint de Fase 8 | Fundador |
| Pipeline (importação/produção editorial) | ☑ | Sim | Homologado ponta a ponta | Concluído conforme checkpoint de Fase 8 | Fundador |
| Taxonomia | ☐ | Sim | Sem cargos duplicados sob o mesmo curso | Taxonomia V1.2.1 está congelada, mas ainda contém `"Técnico de Enfermagem"` e `"Técnico em Enfermagem"` como cargos distintos (AUD-05) — Sprint P0.7 do `P0_IMPLEMENTATION_PLAN.md` não iniciada | Fundador |
| Editorial Engine | ☑ | Sim | Homologado | Concluído conforme checkpoint de Fase 8 | Fundador |
| Classification Engine | ☑ | Sim | Homologado | Concluído conforme checkpoint de Fase 8 | Fundador |
| Importação (Acervo → banco) | ☐ | Sim | Toda questão importada resulta em `package_version_id` preenchido | 80 de 1.000 questões (lote SES-AC 2022/IBFC) seguem sem `package`/`packageVersion` (AUD-04) — Sprint P0.6 não iniciada | Fundador |
| Acervo | ☐ | Sim | 100% das questões anunciadas publicamente acessíveis a um aluno pagante | Hoje 920/1.000 (92%) acessíveis — o número "1.000 questões" usado em `04-LANDING.md`/`06-EMAILS.md`/`08-FAQ.md` não é integralmente verdadeiro até AUD-04 ser resolvido | Fundador |
| Performance | ☐ | Recomendado | Sessão de estudo carrega e responde sem lentidão perceptível sob uso real | Não avaliado nesta auditoria — sem dado de carga real (só 1 usuário no sistema hoje, `01-GO_LIVE.md` §0) | Fundador |
| Backup | ☐ | Sim | Backup automático do banco confirmado e restauração testada ao menos uma vez | Não verificado nesta auditoria — depende da configuração do plano Supabase em produção; precisa ser confirmado antes de qualquer venda real, não presumido | Fundador |
| Logs / auditoria | ☐ | Recomendado | Existe rotina definida (mesmo manual) de quem consulta `logs` e com que frequência | Dado tecnicamente maduro (idempotência, eventos do webhook bem registrados — confirmado em código), mas sem tela de consulta e sem rotina operacional definida (`05-CHECKOUT.md` §6, AUD-11) | Fundador |

---

## 2. Comercial

| Item | Status | Obrigatório | Critério de aceite | Observação | Responsável |
|---|---|---|---|---|---|
| Landing | ☐ | Sim | Copy aprovada **e publicada** no ar, mobile-first | Copy de `04-LANDING.md` está aprovada; publicação em produção não foi confirmada nesta auditoria | Fundador |
| Checkout | ☐ | Sim | Fluxo testado ponta a ponta com pagamento real de baixo valor, incluindo cenário de falha | Fluxo mapeado e parcialmente implementado (`05-CHECKOUT.md`); depende da Sprint P0.3 para ser seguro (ver Bloco 3) | Fundador |
| `COMMERCIAL_PLANS` | ☑ | Sim | Plano real configurado, `/app/subscription` exibe o plano para conta sem assinatura | Sprint P0.2 concluída nesta Fase 8: Plano Fundador configurado com `distributionId` real (`Distribuição RC1 - Enfermagem`, confirmado ativo no banco), `value = 149.90`, `accessDurationMonths = 6` | Fundador |
| Minha Assinatura | ☐ | Sim | Aluno consegue ver status e **solicitar** cancelamento/reembolso pela própria tela ou por canal claro | Tela existe e funciona tecnicamente (consulta ao vivo do Asaas), mas sem botão de cancelamento self-service (AUD-07) — Sprint P0.5 não iniciada | Fundador |
| Emails | ☐ | Sim | Ao menos boas-vindas e confirmação de pagamento disparando de verdade | Copy completa e aprovada (`06-EMAILS.md`), mas **nenhum serviço de e-mail transacional está configurado** (`06-EMAILS.md` §0) — sem isso, nenhum fluxo dispara | Fundador |
| Planos | ☑ | Sim | Plano único definido, sem ambiguidade | Plano Fundador — decisão fechada na Sprint P0.1 (2026-07-14) | Fundador |
| Preço | ☑ | Sim | Preço total e duração do ciclo fechados, coerentes com `03-PRICING.md` | R$149,90 / 6 meses (~R$24,98/mês equivalente) — dentro da faixa "Competitiva" já aprovada em `03-PRICING.md` | Fundador |
| Controle de vagas | ☐ | Sim | Existe mecanismo (mesmo manual) que impede vender além do teto anunciado | Teto de 50 vagas decidido (Sprint P0.1), mas **sem nenhum mecanismo técnico ou operacional que impeça a 51ª venda** — risco de publicidade enganosa por escassez que deixa de ser real (`JURIDICO.md` §4.8) | Fundador |
| Plano Fundador (consistência de nome/copy) | ☑ | Recomendado | Nome e descrição idênticos entre Landing e Checkout | Confirmado: descrição usada em `COMMERCIAL_PLANS` (Sprint P0.2) é consistente com a copy de `04-LANDING.md` | Fundador |

---

## 3. Pagamentos

| Item | Status | Obrigatório | Critério de aceite | Observação | Responsável |
|---|---|---|---|---|---|
| Asaas (configuração de produção) | ☐ | Sim | `ASAAS_API_KEY`, `ASAAS_ENVIRONMENT=production`, `ASAAS_WEBHOOK_SECRET`, `APP_URL` configurados e validados | Não verificado nesta auditoria se as credenciais de **produção** (vs. sandbox) já estão configuradas | Fundador |
| PIX | ☑ | Sim | Suportado e liberação de acesso confirmada como automática via webhook | `billingType: UNDEFINED` no plano permite Pix/cartão/boleto; ativação por webhook já homologada tecnicamente em sessões anteriores | Fundador |
| Cartão de crédito | ☐ | Sim | Fluxo de cobrança seguro, sem risco de cobrança não autorizada no ciclo seguinte | Suportado tecnicamente, mas exposto ao risco de AUD-01 (ver linha "Cancelamento" abaixo) até a Sprint P0.3 ser concluída | Fundador |
| Webhook | ☐ | Sim | Todos os eventos relevantes ao ciclo de vida da assinatura são tratados, incluindo reembolso/chargeback | 7 eventos de ativação/desativação já tratados e homologados; `PAYMENT_REFUNDED` e chargeback **ainda fora de `SUPPORTED_EVENTS`** (AUD-06) — Sprint P0.4 não iniciada | Fundador |
| Idempotência | ☑ | Sim | Reenvio do mesmo evento não duplica efeito | Confirmado em código: ledger via tabela `logs`, verificado nesta e em sessões anteriores | Fundador |
| Cancelamento | ☐ | Sim | Assinatura Asaas não gera cobrança automática do ciclo seguinte | **Bloqueador crítico (AUD-01):** `cancelarAssinatura()` existe mas nunca é chamada — confirmado em código nesta data. Sprint P0.3 não iniciada. Vender antes disso cobra automaticamente todo cliente no ciclo seguinte | Fundador |
| Chargeback | ☐ | Sim | Evento de chargeback identificado e tratado (revoga acesso) | Não tratado hoje — nome exato do(s) evento(s) no catálogo do Asaas ainda precisa ser confirmado (Sprint P0.4) | Fundador |
| Refund (reembolso) | ☐ | Sim | `PAYMENT_REFUNDED` desativa a assinatura local automaticamente | Não tratado hoje (AUD-06) — um reembolso manual no painel do Asaas não revoga acesso local | Fundador |
| Expiração (`expires_at`) | ☐ | Sim | Prazo de acesso do aluno reflete a duração real vendida (6 meses), não o intervalo nativo do Asaas | **Achado técnico crítico:** hoje `expires_at` é calculado a partir do `nextDueDate` do Asaas (~1 mês), não da duração de 6 meses decidida — corrigir isso é parte da Sprint P0.3, não uma sprint à parte | Fundador |

---

## 4. Jurídico

| Item | Status | Obrigatório | Critério de aceite | Observação | Responsável |
|---|---|---|---|---|---|
| LGPD (conformidade geral) | ☐ | Sim | Bases legais de tratamento documentadas; direitos do titular com canal de exercício | Obrigações mapeadas em `JURIDICO.md`; nenhum documento formal redigido, nenhum canal definido | Fundador |
| Política de Privacidade | ☐ | Sim | Documento publicado, revisado por advogado | Inexistente — bloqueador direto (`JURIDICO.md` §2, item 1) | Fundador + advogado |
| Termos de Uso | ☐ | Sim (na prática) | Documento publicado cobrindo propriedade intelectual e limites lícitos de responsabilidade | Inexistente — bloqueador direto (`JURIDICO.md` §2, item 2) | Fundador + advogado |
| Política de Reembolso | ☐ | Sim | Documento publicado + processo operacional real por trás (não só o texto) | Inexistente como documento formal; o direito (CDC Art. 49) já existe independentemente do texto — sem processo operacional (depende de AUD-06/AUD-07), publicar o texto sozinho pioraria o risco, não resolveria | Fundador + advogado |
| Política de Cancelamento | ☐ | Sim | Documento publicado, coerente com o modelo "sem recorrência automática" | Inexistente — referenciada como link no rodapé de `04-LANDING.md`, nunca redigida (AUD-09) | Fundador + advogado |
| Cookies (política + banner) | ☐ | Recomendado hoje / Obrigatório se houver analytics | Política publicada; banner de consentimento se houver cookies não essenciais | Hoje só cookies essenciais de sessão — não bloqueia Soft Launch per `JURIDICO.md` §6, mas devia ser tratado antes de qualquer analytics/pixel (Bloco 6) | Fundador |
| Consentimentos (marketing, e-mail) | ☐ | Obrigatório quando lead magnet existir | Base legal declarada para cada tipo de comunicação; opt-out simples em toda comunicação de reengajamento | Lead magnet (`07-MARKETING.md` §2) ainda não implementado — não bloqueia Soft Launch, mas precisa estar pronto antes desse fluxo entrar no ar | Fundador |

---

## 5. Suporte

| Item | Status | Obrigatório | Critério de aceite | Observação | Responsável |
|---|---|---|---|---|---|
| Canal oficial | ☐ | Sim | Um canal único (e-mail ou WhatsApp) definido e testado | Inexistente (AUD-07) — Sprint P0.5 não iniciada. É o mesmo canal necessário para exercício de direitos LGPD (Bloco 4) | Fundador |
| Tempo de resposta | ☐ | Sim | Prazo real definido e comunicável (`06-EMAILS.md` fluxo 4.17 já prevê o texto, falta o número real) | Não definido — depende do canal acima existir primeiro | Fundador |
| Procedimento (revogação manual de acesso por reembolso) | ☐ | Sim | Ensaiado ponta a ponta ao menos uma vez com conta de teste | Não ensaiado — `/admin/subscriptions` já tem a capacidade técnica (ativar/desativar manualmente), mas o processo nunca foi testado como runbook | Fundador |
| Manual (documentação operacional do processo) | ☐ | Recomendado | Processo documentado para quem opera, não descoberto na hora de um caso real | Inexistente | Fundador |

---

## 6. Marketing

| Item | Status | Obrigatório | Critério de aceite | Observação | Responsável |
|---|---|---|---|---|---|
| Landing publicada | ☐ | Sim | No ar, acessível publicamente, mobile-first | Ver Bloco 2 — mesmo item, não verificado nesta auditoria se está de fato publicada | Fundador |
| Pixel | ☐ | Não (Onda A) | — | `07-MARKETING.md` §1 explicitamente descarta mídia paga/pixels até a Fase 4 (Onda B) — não bloqueia Soft Launch | Fundador |
| Analytics | ☐ | Recomendado | Instrumentação mínima de funil (visitante→cadastro→pagamento→1ª sessão) | Não implementado (`05-CHECKOUT.md` §7, "nota honesta") — afeta a mensurabilidade dos critérios do Bloco 7, mas parte pode ser medida manualmente | Fundador |
| SEO | ☐ | Recomendado | Estrutura de H1/H2/H3 e metadados da Landing aplicados | Estrutura definida em `04-LANDING.md`, implementação não verificada nesta auditoria | Fundador |
| Formulários (checkout) | ☑ | Sim | Modal de CPF + redirecionamento ao Asaas funcional | Confirmado em código (`SubscriptionPage.tsx`) | Fundador |
| Formulário (lead magnet) | ☐ | Não (Onda A) | — | Ainda não implementado, não faz parte do Soft Launch (`07-MARKETING.md` Fase 1) | Fundador |
| CTA | ☑ | Sim | Texto consistente em toda a jornada ("Garantir minha vaga no Plano Fundador") | Copy aprovada e consistente em `04-LANDING.md` | Fundador |

---

## 7. Soft Launch — critérios mínimos

Critérios já aprovados em `01-GO_LIVE.md` §5, reaproveitados aqui como referência única — não redefinidos.

| Critério | Meta para "Go" | Meta para "Go com ajuste" | Sinal de "No-Go" | Status atual |
|---|---|---|---|---|
| Conversão visitante → cadastro | ≥ 15% | 8–15% | < 8% | ☐ Sem dado — Onda A não iniciada |
| Conversão cadastro → pagamento | ≥ 20% | 10–20% | < 10% | ☐ Sem dado |
| Uso pós-compra (≥ 1 sessão em 7 dias) | ≥ 70% dos pagantes | 50–70% | < 50% | ☐ Sem dado |
| Pedidos de reembolso/cancelamento em 14 dias | ≤ 10% | 10–20% | > 20% | ☐ Sem dado |
| Feedback qualitativo sobre volume/qualidade | Nenhuma reclamação recorrente | Reclamações pontuais | Reclamação recorrente do mesmo problema | ☐ Sem dado |

**Regra de decisão (já aprovada, não alterada):** avançar para Onda B só se ≥ 4 dos 5 critérios em "Go", nenhum em "No-Go".

**Teto de compradores da Onda A:** **50 alunos** — decisão aprovada na Sprint P0.1 (2026-07-14), dentro da faixa 20–50 já prevista em `01-GO_LIVE.md` §2 (Bloco 2) e coerente com o limite superior da Fase 2 de `07-MARKETING.md`.

**Pré-requisito para sequer iniciar a contagem acima:** todos os itens ☐ dos Blocos 1 a 6 marcados como "Obrigatório" precisam estar ☑ antes de qualquer venda real contar para estes critérios — caso contrário, os 50 primeiros compradores estariam validando um produto diferente do que existirá quando os P0 forem corrigidos.

---

## 8. Hard Launch — critérios para liberar escala

Só aplicável depois que o Bloco 7 estiver integralmente cumprido e a decisão de Onda B (`01-GO_LIVE.md` §2, D24+) for tomada com dado real.

| Critério | Descrição |
|---|---|
| Onda A concluída com Go ou Go-com-ajuste | Conforme regra de decisão do Bloco 7 |
| CAC e LTV mensuráveis com dado real | `07-MARKETING.md` §4 — hoje explicitamente "não é possível calcular", só será depois de um ciclo completo de 6 meses vivido pelos primeiros clientes |
| Pelo menos um canal orgânico validado além de indicação pessoal | Critério de saída da Fase 3 de `07-MARKETING.md` |
| Todos os itens do Bloco 4 (Jurídico) concluídos | Vender em escala com lacunas jurídicas abertas multiplica a exposição pelo volume |
| Painel de Admin com visão ao vivo do Asaas (ou rotina manual comprovadamente sustentável) | Necessário antes de operar volume maior que o de uma pessoa consiga acompanhar manualmente |
| Teto de vagas do Plano Fundador reavaliado | "Plano Fundador" é, por definição, de primeira leva — sua lógica comercial não se estende automaticamente à escala |

**Status:** não aplicável ainda — nenhum dos critérios acima pode ser avaliado antes da conclusão do Bloco 7.

---

## Veredito final

### SOFT LAUNCH

☐ APTO
☑ **NÃO APTO**

**Motivo:** 5 dos 7 bloqueadores P0 de `AUDITORIA_FINAL.md` seguem pendentes (AUD-01, AUD-04, AUD-05, AUD-06, AUD-07 — apenas AUD-02 e AUD-03 concluídos nesta Fase 8), nenhum documento jurídico obrigatório existe (`JURIDICO.md` §6), e o canal de suporte que sustentaria tanto o reembolso quanto os direitos LGPD não foi definido.

### HARD LAUNCH

☐ APTO
☑ **NÃO APTO**

**Motivo:** depende diretamente da conclusão do Soft Launch e de dado real de retenção/CAC que ainda não existe — não avaliável antes disso.

---

*Fim do checklist. Nenhum outro documento foi alterado. Nenhum código foi escrito. Este é o último documento estratégico do SimulaPro V1 — a partir daqui, a atualização deste arquivo (não a criação de novos documentos) é o mecanismo de acompanhamento até "APTO" ser alcançado em ambos os vereditos.*
