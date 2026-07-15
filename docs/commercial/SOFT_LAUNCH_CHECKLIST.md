# SOFT_LAUNCH_CHECKLIST — SimulaPro V1

**Fase:** 9 — Soft Launch (até 20 alunos)
**Papel assumido:** Product Owner + QA + Tech Lead
**Data:** 2026-07-15
**Escopo:** apenas auditoria e checklist operacional. Nenhum código foi escrito, nenhum arquivo do sistema foi alterado nesta sessão além deste documento. Todos os achados abaixo vêm de verificação direta no código nesta data (incluindo um `npm run build` executado como checagem, sem qualquer alteração de arquivo de origem).

**Nota de estado — mudou desde a última auditoria completa (`AUDITORIA_FINAL.md`, `GO_NO_GO.md`):** desde aquela auditoria, os bloqueadores **AUD-01, AUD-02 e AUD-03** (toda a cadeia P0-A) foram implementados e verificados no código nesta data — recorrência do Asaas neutralizada, `COMMERCIAL_PLANS` configurado, `expires_at` calculado corretamente a partir de 6 meses. **AUD-06** foi parcialmente implementado (reembolso automatizado; chargeback registrado mas sem desativação automática ainda). Isso muda o veredito em relação ao documento anterior — ver seção 8.

---

## 1. Checklist geral

| Item | Status | Nota |
|---|---|---|
| Login | ✅ PRONTO | `signInWithPassword` funcional (`src/routes/auth.tsx`) |
| Cadastro | ✅ PRONTO | `signUp` funcional; **a confirmar operacionalmente:** se a confirmação de e-mail está ativa no projeto Supabase (não verificável só pelo código) |
| Recuperação de senha | ⚠ PODE SER MANUAL | Não existe tela/rota "esqueci minha senha" na UI. Para até 20 alunos, o admin pode redefinir manualmente pelo painel do Supabase mediante solicitação de suporte |
| Plano Fundador | ✅ PRONTO | Configurado em `commercial-plans.ts`: 6 meses, R$149,90, `distributionId` confirmado ativo no banco |
| Minha Assinatura | ✅ PRONTO (parcial) | Exibe status ao vivo, fatura, botão atualizar. Sem botão de cancelamento self-service — ver item "Cancelamentos" na seção 3 |
| Checkout | ✅ PRONTO | Fluxo completo: CPF → Asaas → webhook → ativação |
| PIX | ✅ PRONTO | `billingType: "UNDEFINED"` permite Pix na tela do Asaas |
| Cartão | ✅ PRONTO | Mesmo mecanismo acima |
| Webhook | ✅ PRONTO | 12 eventos tratados hoje (`SUPPORTED_EVENTS`), incluindo os de reembolso/chargeback adicionados recentemente |
| Webhook duplicado | ✅ PRONTO | Idempotência via tabela `logs` (`wasEventAlreadyProcessed`/`markEventProcessed`), confirmada em código |
| Webhook inválido | ✅ PRONTO | `isAuthenticWebhookRequest` valida token com `timingSafeEqual` |
| Pagamento aprovado | ✅ PRONTO | `PAYMENT_CONFIRMED`/`PAYMENT_RECEIVED` ativam corretamente; `expires_at` = confirmação + 6 meses (corrigido) |
| Pagamento recusado | ✅ PRONTO (mecanismo) | `PAYMENT_OVERDUE` desativa corretamente. Sem e-mail de aviso ao aluno (e-mails não implementados) — aluno percebe pela tela "Minha Assinatura" |
| Pagamento vencido | ✅ PRONTO | Mesmo mecanismo acima |
| Reembolso | ✅ PRONTO | `PAYMENT_REFUNDED` agora desativa a assinatura automaticamente (implementado) |
| Chargeback | ⚠ PODE SER MANUAL | Eventos (`PAYMENT_CHARGEBACK_REQUESTED`, `PAYMENT_CHARGEBACK_DISPUTE`, `PAYMENT_AWAITING_CHARGEBACK_REVERSAL`) são registrados em `logs`, mas não desativam o acesso automaticamente ainda — requer checagem manual dos logs e desativação manual via `/admin/subscriptions` se ocorrer |
| Expiração | ✅ PRONTO | `expires_at` correto na ativação; controle de acesso já verifica `expires_at` (confirmado em `study-session.ts` em sessão anterior) |
| Renovação | ✅ PRONTO | Sem recorrência automática de fato (assinatura Asaas cancelada pós-pagamento); renovação é nova compra manual, coerente com o modelo aprovado |
| Dashboard | ✅ PRONTO | Funcional; estado vazio usa a mensagem "fale com o administrador" em vez de apontar para `/app/subscription` (achado de UX já registrado, não bloqueia) |
| Study Builder | ✅ PRONTO | Fluxo completo, contador de questões ao vivo antes de criar sessão |
| Sessão | ✅ PRONTO | Feedback visual completo, navegação clara |
| Resultados | ✅ PRONTO | Tela mais madura do produto |
| Revisão | ✅ PRONTO (parcial) | Aba "Não Respondidas" tem um mapeamento de modo de sessão ausente (achado já registrado em `UX_AUDIT.md`) — não impede uso, só não faz exatamente o que o rótulo sugere |
| Histórico | ✅ PRONTO | Completo |
| Landing | ⚠ PODE SER MANUAL | Página em `/` é genérica, não é a copy aprovada em `04-LANDING.md`. Para um Soft Launch por convite direto (não tráfego público), isso é contornável — os 20 convidados recebem contexto por WhatsApp/mensagem pessoal antes de clicar |
| Links | ⚠ ATENÇÃO | Botão "Painel Admin" visível publicamente na Landing — não é falha de autorização (a rota `/admin` continua exigindo login + role), mas expõe a existência do painel a qualquer visitante, inclusive os convidados |
| Documentos jurídicos | ⚠ PODE SER MANUAL | Ver linha abaixo — resolvível sem tocar no código |
| Política de Privacidade | ❌ NÃO EXISTE NO APP — mitigável sem código | Nenhuma rota no app. Pode ser resolvido com um texto hospedado fora do app (ex.: documento externo linkado) para não exigir nova rota/módulo nesta fase |
| Termos | ❌ NÃO EXISTE NO APP — mitigável sem código | Mesma observação acima |
| Política de Reembolso | ❌ NÃO EXISTE NO APP — mitigável sem código | Mesma observação acima. O direito em si (garantia de 7 dias, CDC Art. 49) já existe independente do texto — o texto formaliza, não cria, a obrigação |
| Botão Admin público | ⚠ ATENÇÃO | Mesmo item de "Links" acima |
| Responsividade | ✅ PRONTO (inferido) | Classes responsivas (`sm:`, `lg:`, grid) presentes de forma consistente em todos os componentes revisados; não testado visualmente ao vivo nesta sessão |
| Erro 404 | ✅ PRONTO | `NotFoundComponent` em `__root.tsx`, com botão de volta ao início |
| Erro 500 | ✅ PRONTO | `ErrorComponent` em `__root.tsx`, com botão "Tentar novamente" e relatório de erro (`reportLovableError`) |
| Loading | ✅ PRONTO | Skeletons consistentes em todas as telas do Portal do Aluno |
| Empty States | ✅ PRONTO (com ressalva) | Componente `EmptyState` reaproveitado; ressalva de copy já registrada (Dashboard/Estudo) |
| Mensagens de erro | ✅ PRONTO | Toasts + `PageErrorState` com mensagens específicas por contexto |
| SEO mínimo | ✅ PRONTO | Title, meta description, og:tags, favicons, viewport presentes em `__root.tsx`; copy genérica (mesma ressalva da Landing) |
| Deploy | ✅ PRONTO (mecanismo) | `npm run build` gera `wrangler.json`/config do Cloudflare Workers automaticamente (Nitro) — mecanismo de deploy existe; **a confirmar operacionalmente:** domínio de produção e publicação real |
| Build | ✅ PRONTO | `npm run build` executado nesta auditoria, concluído sem erros |

---

## 2. Itens bloqueadores (❌)

Nenhum item nesta lista bloqueia tecnicamente a venda — mas todos exigem uma ação (não necessariamente código) antes de aceitar o primeiro pagamento real:

| # | Item | Por que bloqueia | Ação mínima (sem código) |
|---|---|---|---|
| 1 | Política de Privacidade | Obrigação legal (LGPD) — o produto já coleta e-mail, CPF (via Asaas), dados de estudo | Redigir um texto curto e hospedá-lo fora do app (documento externo linkado no e-mail de boas-vindas ou enviado manualmente no primeiro contato) |
| 2 | Termos de Uso | Normatiza propriedade intelectual do Acervo e limites de responsabilidade | Mesma solução acima |
| 3 | Política de Reembolso | Formaliza um direito que já existe (CDC Art. 49) — sem o texto, o processo fica sujeito a interpretação ad hoc | Mesma solução acima |

**Estes três itens podem ser resolvidos com um único texto (ou três textos curtos) hospedados externamente — nenhum exige criar rota, componente ou módulo no sistema.** Essa é a diferença entre "bloqueia venda" e "bloqueia código": o requisito é de conteúdo, não de engenharia.

---

## 3. Itens manuais (⚠)

Lista operacional direta — o que a operação (o fundador) faz manualmente durante o Soft Launch, sem automação:

| Operação | Como é feita manualmente |
|---|---|
| **Controle das vagas (até 20 alunos)** | Contagem manual (planilha ou contagem direta em `/admin/subscriptions`) — não existe teto automático no código. Parar de enviar convites ao atingir 20 |
| **Cancelamentos** | Não há botão self-service. Aluno solicita pelo canal de suporte definido; admin desativa manualmente a assinatura em `/admin/subscriptions` |
| **Reembolsos** | O reembolso financeiro em si é processado manualmente no painel do Asaas pelo fundador; a desativação do acesso local **já é automática** (evento `PAYMENT_REFUNDED` tratado) |
| **Chargeback** | Monitorar manualmente os logs dos eventos de chargeback (`asaas.payment.chargeback_requested`, etc., via tabela `logs`) e desativar manualmente a assinatura em `/admin/subscriptions` caso ocorra |
| **Suporte** | Canal único a definir (WhatsApp pessoal do fundador é suficiente para 20 alunos) — nenhuma central de atendimento é necessária nesta fase |
| **Envio de e-mails** | Nenhum e-mail transacional dispara automaticamente (boas-vindas, confirmação, aviso de expiração). Substituir manualmente: mensagem pessoal de boas-vindas via WhatsApp/e-mail direto a cada novo cadastro, e aviso pessoal próximo ao fim do ciclo de cada aluno |
| **Conferência de pagamentos** | Verificar periodicamente o painel do Asaas e a tabela `logs` (`asaas.webhook.error`) para identificar falhas silenciosas de ativação — não há tela dedicada, mas os dados já existem |
| **Ativações manuais de contingência** | Se um webhook falhar, `/admin/subscriptions` permite ativar/corrigir manualmente uma assinatura — já existente e utilizável hoje |
| **Recuperação de senha** | Admin redefine manualmente pelo painel do Supabase, mediante solicitação do aluno pelo canal de suporte |
| **Textos jurídicos** | Enviar o texto (Privacidade/Termos/Reembolso) manualmente por e-mail/WhatsApp no momento do cadastro ou da compra, até que (se algum dia for o caso) uma versão publicada no app seja priorizada |

---

## 4. Itens opcionais (não necessários para até 20 alunos)

| Item | Por que é opcional agora |
|---|---|
| Correção das 80 questões órfãs (lote SES-AC 2022) | 920/1.000 questões já acessíveis (92%); para 20 alunos, o volume restante ainda é amplo. Ajustar a comunicação (evitar "1.000 questões" em mensagens diretas, usar "mais de 900") em vez de reprocessar agora |
| Resolução da duplicidade de cargo "Técnico" | Zero questões vinculadas a qualquer um dos dois hoje — não afeta nenhum aluno do curso de Enfermagem atual |
| Reescrita completa da Landing (`04-LANDING.md`) | Convite direto (WhatsApp/comunidade), não tráfego público — a Landing importa menos neste modelo de aquisição específico da Onda A |
| Remoção do botão "Painel Admin" | Recomendado, mas não bloqueia — a rota continua protegida por autenticação e role |
| Ativação automática de desativação por chargeback | Baixo volume esperado (até 20 clientes) torna o monitoramento manual viável |
| Central de notificação/e-mails automatizados | Substituível por contato pessoal direto na escala de 20 alunos |
| Correção do mapeamento da aba "Não Respondidas" na Central de Revisão | Impacto baixo, não impede uso do produto |

---

## 5. Plano de testes

Antes de aceitar o primeiro pagamento real, executar em sequência:

1. **Cadastro → Login:** criar uma conta de teste, confirmar login/logout.
2. **Recuperação de senha (manual):** confirmar que o admin consegue redefinir uma senha pelo painel do Supabase.
3. **Checkout — Pix:** completar uma compra real de baixo valor (ou o valor cheio, se decidido) via Pix; confirmar ativação em segundos.
4. **Checkout — Cartão:** repetir via cartão de crédito.
5. **Checkout — Boleto (se oferecido):** confirmar que o acesso só libera após compensação, não na emissão.
6. **Verificação pós-pagamento:** confirmar em `subscriptions` que `expires_at` = data da confirmação + 6 meses (não 1 mês).
7. **Verificação Asaas:** confirmar que a assinatura correspondente aparece cancelada no painel do Asaas logo após a ativação.
8. **Teste da corrida corrigida:** confirmar nos `logs` que o evento `SUBSCRIPTION_CANCELLED`/`SUBSCRIPTION_UPDATED` gerado pelo próprio cancelamento não alterou `status`/`expires_at` da assinatura.
9. **Webhook duplicado:** reenviar manualmente o mesmo evento de confirmação (se o painel do Asaas permitir) e confirmar que nada duplica.
10. **Webhook inválido:** enviar uma requisição sem o header de token correto e confirmar rejeição.
11. **Pagamento vencido/recusado:** simular ou aguardar um caso real de `PAYMENT_OVERDUE` e confirmar desativação.
12. **Reembolso:** simular um reembolso no sandbox (se disponível) ou tratar o primeiro caso real com atenção redobrada, confirmando que o acesso é revogado automaticamente.
13. **Sessão de estudo completa:** do cadastro à primeira questão respondida, sem intervenção manual, incluindo tela de resultados.
14. **Erros de rota:** acessar uma URL inexistente (404) e forçar um erro de carregamento (500), confirmando as telas de erro.
15. **Responsividade:** abrir o fluxo completo (Landing → Cadastro → Checkout → Estudo) em uma tela de celular real, não só redimensionar o navegador.

---

## 6. Plano do primeiro pagamento real

1. Confirmar que as variáveis de ambiente do Asaas em produção (`ASAAS_API_KEY`, `ASAAS_ENVIRONMENT=production`, `ASAAS_WEBHOOK_SECRET`, `APP_URL`) estão configuradas — item não verificável só pelo código-fonte, precisa de checagem operacional direta.
2. Confirmar que o webhook está registrado no painel do Asaas apontando para o endpoint de produção, com o token correspondente.
3. Escolher **uma pessoa de confiança** (não o próprio fundador, para simular um comprador real) para realizar a primeira compra com dinheiro real.
4. Acompanhar em tempo real: painel do Asaas (cobrança gerada), tabela `logs` (eventos recebidos/processados), tabela `subscriptions` (ativação e `expires_at`).
5. Confirmar que a pessoa consegue, sem ajuda, ir do pagamento à primeira questão respondida.
6. Só depois desse teste com dinheiro real e acompanhamento total, abrir para o primeiro convidado externo de fato.

---

## 7. Plano dos primeiros 20 alunos

1. **Preparação (D-1):** textos jurídicos mínimos prontos (mesmo que hospedados externamente); canal de suporte único escolhido e comunicado; planilha de controle de vagas criada.
2. **Convites (D0–D3):** convite direto, pessoal, para uma lista fechada — rede do fundador, grupos de Enfermagem com relação genuína. Nunca anúncio público, conforme `07-MARKETING.md` Fase 1.
3. **Acompanhamento diário:** cada novo cadastro recebe contato pessoal (substitui o e-mail de boas-vindas ausente); cada pagamento confirmado é verificado manualmente na tabela `logs`/painel do Asaas nas primeiras 24h de operação, depois espaçar a checagem.
4. **Corte automático informal:** ao atingir 20 vendas, parar de enviar convites — sem necessidade de nenhum controle técnico, dado o acompanhamento manual diário nesta escala.
5. **Janela de garantia:** para cada aluno, anotar a data-limite dos 7 dias de garantia e verificar se ele iniciou pelo menos uma sessão — contato pessoal proativo se não iniciou até o dia 3 (mesma lógica do fluxo de e-mail já especificado em `06-EMAILS.md`, só que manual).
6. **Encerramento do Soft Launch:** ao final do período de observação (mínimo 14 dias corridos, já definido em `01-GO_LIVE.md`), consolidar os 5 critérios de sucesso já aprovados (conversão, uso pós-compra, reembolso, feedback qualitativo) e decidir Go/No-Go para a Onda B — não é objeto deste checklist, que cobre apenas a preparação operacional.

---

## 8. Critério Go / No-Go

### Este Soft Launch (até 20 alunos) está apto?

**SIM, condicionado a 4 ações prévias, nenhuma delas de código:**

1. Redigir e disponibilizar (mesmo externamente) os textos de Política de Privacidade, Termos de Uso e Política de Reembolso.
2. Confirmar as credenciais de produção do Asaas e o registro do webhook de produção.
3. Definir o canal único de suporte e testar o processo manual de desativação de acesso (`/admin/subscriptions`) uma vez, ponta a ponta.
4. Executar o plano de testes da seção 5 e o primeiro pagamento real da seção 6 antes de convidar qualquer pessoa externa.

**O que mudou desde a última auditoria formal (`AUDITORIA_FINAL.md`):** a recorrência automática do Asaas foi neutralizada, o cálculo de `expires_at` foi corrigido para refletir os 6 meses reais, e o reembolso agora desativa o acesso automaticamente — os três problemas de maior risco financeiro/jurídico identificados anteriormente já não existem no código. O que resta são itens de conteúdo (textos jurídicos) e de operação manual (suporte, controle de vagas, chargeback), compatíveis com uma operação de uma pessoa vendendo para até 20 alunos.

### Este sistema está apto para Hard Launch (aquisição em escala)?

**Não é avaliável ainda** — depende do resultado real do Soft Launch (retenção, reembolso, feedback), que só existe depois de operar com os 20 primeiros alunos.

---

## 9. Checklist final

- [ ] Textos jurídicos mínimos redigidos e acessíveis (mesmo que externos)
- [ ] Credenciais Asaas de produção confirmadas
- [ ] Webhook de produção registrado no painel do Asaas
- [ ] Canal de suporte único definido e comunicado
- [ ] Processo manual de desativação (`/admin/subscriptions`) testado uma vez
- [ ] Planilha/contagem manual de vagas criada
- [ ] Plano de testes (seção 5) executado
- [ ] Primeiro pagamento real (seção 6) concluído com acompanhamento total
- [ ] Lista de convite fechada para até 20 alunos definida
- [ ] Critério de garantia de 7 dias com acompanhamento manual definido por aluno

Quando todos os itens acima estiverem marcados, o Soft Launch pode começar.

---

*Fim do checklist. Nenhum arquivo do sistema foi alterado. Nenhuma nova sprint foi iniciada. Encerra a preparação da V1 para a Fase 9.*
