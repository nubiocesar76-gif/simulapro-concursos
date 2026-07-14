# AUDITORIA_FINAL — Auditoria Comercial Independente

**Fase:** 7.5 — Auditoria (encerra a Fase 7, antecede qualquer implementação)
**Documento:** Auditoria crítica de `01-GO_LIVE.md` a `09-ROADMAP.md`
**Data:** 2026-07-14
**Papel assumido:** auditor externo contratado para encontrar problemas antes do lançamento — não o autor dos documentos. Nenhum achado abaixo foi suavizado para preservar decisões já tomadas.
**Escopo:** apenas auditoria. Nenhum documento comercial foi alterado. Nenhum código foi escrito. Nenhuma arquitetura foi proposta. Onde esta auditoria cita código-fonte, é exclusivamente para **verificar se uma afirmação escrita nos documentos ainda é verdadeira hoje** — não para corrigi-lo.

---

## 0. Metodologia

Esta auditoria não aceitou as conclusões dos 9 documentos por afirmação. Para cada dependência técnica citada como "gap" ou "pendência", o estado real do repositório foi conferido nesta data (2026-07-14):

| Afirmação do documento comercial | Verificado contra | Resultado |
|---|---|---|
| `COMMERCIAL_PLANS` está vazio (`05-CHECKOUT.md`) | `src/config/commercial-plans.ts` | **Confirmado — ainda `[]` hoje** |
| 80 de 1.000 questões sem `package`/`packageVersion` (`01-GO_LIVE.md`) | `docs/seeds/questions.json` (script de contagem) | **Confirmado — ainda 80/1000 hoje, valor idêntico ao diagnóstico original** |
| Cargo duplicado "Técnico em Enfermagem"/"Técnico de Enfermagem" (`01-GO_LIVE.md`) | `docs/seeds/taxonomy.json` | **Confirmado — as duas entradas ainda coexistem** |
| `cancelarAssinatura()` existe mas nunca é chamada (`05-CHECKOUT.md`, seção 10.1) | `src/integrations/asaas/AsaasService.server.ts`, `src/lib/asaas-webhook.server.ts` | **Confirmado — único ponto do código que referencia o método é a própria definição** |
| `PAYMENT_REFUNDED` fora do conjunto de eventos tratados (`05-CHECKOUT.md`, seção 10.2) | `SUPPORTED_EVENTS` em `src/lib/asaas-webhook.server.ts` | **Confirmado — conjunto tem exatamente 7 eventos, nenhum de reembolso/chargeback** |
| Incerteza sobre se o controle de acesso respeita `expires_at` (`05-CHECKOUT.md`, seção 10.3, marcada como "a confirmar") | `src/lib/study-session.ts` | **Não confirma o gap — o código já chama `isSubscriptionActive(starts_at, expires_at)` antes de liberar sessão. Este item pode ser fechado como resolvido, não é bloqueador.** |

O último ponto importa: nem todo receio registrado nos documentos se traduziu em um problema real. Esta auditoria reporta os dois sentidos — o que é bloqueador de fato, e o que os próprios documentos temiam sem necessidade.

---

## 1. Achados

Cada achado segue: **ID · Descrição · Documento(s) · Impacto · Probabilidade · Prioridade · Recomendação.**

### P0 — Bloqueadores diretos de Soft Launch

---

**AUD-01 — Recorrência automática do Asaas continua ativa; nada no fluxo a neutraliza**
- **Descrição:** A assinatura criada no Asaas é nativamente recorrente (`cycle: MONTHLY|YEARLY`). `AsaasService.cancelarAssinatura()` existe mas não é chamada em nenhum ponto do handler de ativação. Confirmado em código nesta data.
- **Documento(s):** `05-CHECKOUT.md` §10.1 (já sinalizado como P0 pelo autor original) · contradiz `02-PLANS.md` §6/§9 ("sem recorrência automática") · contradiz `04-LANDING.md` ("você nunca é cobrado sem saber") · contradiz `06-EMAILS.md` §4.4/§4.12 (copy já escrita afirmando "você não será cobrado de novo automaticamente") · contradiz `08-FAQ.md` §5/§7.
- **Impacto:** Todo aluno que pagar será cobrado automaticamente no ciclo seguinte sem ter consentido para isso de forma clara — o oposto exato do modelo comercial aprovado. Gera chargeback, reclamação em Procon/Reclame Aqui, e destrói a credibilidade da mensagem central de honestidade que sustenta toda a Fase 7.
- **Probabilidade:** Certa — não depende de nenhum evento raro, acontece automaticamente a cada cliente que completar um ciclo, a menos que corrigido.
- **Prioridade:** **P0**
- **Recomendação:** Não vender nenhum acesso real antes de `cancelarAssinatura()` ser chamada logo após a primeira confirmação de pagamento. Sem isso, nenhum outro item desta auditoria importa — é o risco financeiro e reputacional mais alto do conjunto.

---

**AUD-02 — Nenhum plano comercial está configurado; ninguém consegue comprar**
- **Descrição:** `COMMERCIAL_PLANS` é um array vazio no código-fonte hoje. A tela `/app/subscription` mostra "Nenhum plano disponível" para qualquer aluno.
- **Documento(s):** `05-CHECKOUT.md` §0, §3.4, §8.
- **Impacto:** Bloqueador literal — o funil inteiro de checkout descrito em `05-CHECKOUT.md` não pode ser executado por ninguém até este item ser preenchido.
- **Probabilidade:** Certa (é o estado atual, não um risco futuro).
- **Prioridade:** **P0**
- **Recomendação:** Ver AUD-03 — este item não pode ser resolvido sem resolver primeiro a lacuna de duração do ciclo.

---

**AUD-03 — A duração do ciclo de acesso (em meses) nunca foi definida em nenhum documento**
- **Descrição:** `02-PLANS.md` §6 define "Prazo único... a calibrar em `03-PRICING.md`". `03-PRICING.md` nunca fecha essa calibração — todo o documento trabalha com "ticket mensal equivalente" (~R$24,90/mês), nunca com um preço total e uma contagem de meses. Nenhum dos dois documentos, nem qualquer um dos outros sete, declara: "o ciclo dura X meses e custa R$Y no total".
- **Documento(s):** `02-PLANS.md` §6 · `03-PRICING.md` §3, §6.
- **Impacto:** Sem esse número, os campos `value` e `cycle` de `COMMERCIAL_PLANS` (AUD-02) não podem ser preenchidos com base na documentação aprovada — quem for configurar o plano precisa decidir esse número sem lastro em nenhuma decisão documentada, ou inventar um na hora, o que contraria diretamente a disciplina de "nada por entusiasmo" que rege `09-ROADMAP.md` §0.
- **Probabilidade:** Certa — é uma lacuna de conteúdo, não um risco condicional.
- **Prioridade:** **P0**
- **Recomendação:** Fechar esse número explicitamente antes de qualquer configuração de plano — é um retorno pontual a `03-PRICING.md`, não uma nova fase de documentação.

---

**AUD-04 — 80 de 1.000 questões (8%) ainda estão sem `package`/`packageVersion`**
- **Descrição:** Contagem direta em `docs/seeds/questions.json` nesta data confirma exatamente 80 questões sem esses campos — o mesmo número relatado como diagnóstico em `01-GO_LIVE.md` meses atrás. Isso sugere que a correção de causa-raiz do Seed (already feita em fase anterior desta conversa) nunca foi reaplicada a essas 80 questões específicas — elas parecem ser um lote de conteúdo legado nunca reprocessado, não um bug recorrente do mecanismo de seed.
- **Documento(s):** `01-GO_LIVE.md` §0 (diagnóstico) · `09-ROADMAP.md` §1 lista esta correção como pré-requisito explícito de entrada no Soft Launch.
- **Impacto:** Essas questões continuam invisíveis para qualquer aluno, mesmo pagante — 8% do Acervo vendido como "1.000 questões oficiais" (`04-LANDING.md`, `06-EMAILS.md`, `08-FAQ.md`) não é entregável hoje. É uma divergência entre o número anunciado e o número real de questões acessíveis.
- **Probabilidade:** Certa (estado atual verificado, não uma hipótese).
- **Prioridade:** **P0** — o próprio conjunto de documentos já classifica isso como pré-requisito de Soft Launch; esta auditoria apenas confirma que a pendência continua aberta.
- **Recomendação:** Reprocessar essas 80 questões (atribuir `package`/`packageVersion`) antes de anunciar "1.000 questões" publicamente, ou ajustar a comunicação para o número real de questões efetivamente acessíveis até a correção ser concluída.

---

**AUD-05 — Cargo duplicado "Técnico em Enfermagem" / "Técnico de Enfermagem" continua presente na taxonomia**
- **Descrição:** As duas entradas coexistem em `docs/seeds/taxonomy.json` nesta data.
- **Documento(s):** `01-GO_LIVE.md` §0 (Bloco 0, marcado como pré-requisito de lançamento) · `09-ROADMAP.md` §1 e §6.1 (listado de novo como pré-requisito, tanto do Soft Launch quanto da futura expansão V2).
- **Impacto:** Risco de confusão em qualquer tela administrativa que liste cargos, e de um aluno ou operador escolher o cargo errado ao classificar conteúdo futuro. Baixo impacto direto no aluno pagante do V1 (o Acervo vendido hoje é só Enfermeiro), mas alto risco de dívida acumulada silenciosamente — o próprio roadmap já o cita duas vezes como pré-requisito não cumprido.
- **Probabilidade:** Certa (estado atual).
- **Prioridade:** **P0** por critério próprio dos documentos (Bloco 0 de `01-GO_LIVE.md` é definido como pré-requisito de lançamento, não como item de melhoria contínua).
- **Recomendação:** Resolver a duplicidade — mesmo sendo de baixo impacto imediato no aluno, deixar um item auto-classificado como "bloqueador de lançamento" sem solução por múltiplos ciclos de documentação é, em si, um sinal de risco de processo.

---

**AUD-06 — Reembolso e chargeback não desativam a assinatura automaticamente**
- **Descrição:** `PAYMENT_REFUNDED` não está no conjunto de eventos tratados pelo webhook (confirmado em código). Chargeback não tem evento dedicado mapeado.
- **Documento(s):** `05-CHECKOUT.md` §10.2 · contradiz a garantia de 7 dias de `03-PRICING.md` §11 e a resposta publicável em `08-FAQ.md` §14 ("devolvemos o valor integral").
- **Impacto:** Um reembolso processado manualmente no painel do Asaas (o único caminho hoje, ver AUD-07) não revoga o acesso local — o aluno reembolsado mantém acesso ao Acervo indefinidamente até alguém perceber manualmente. Isso é ao mesmo tempo um risco financeiro (uso "grátis" pós-reembolso) e, inversamente, um risco de reclamação se um funcionário desativar manualmente o acesso rápido demais sem processo claro.
- **Probabilidade:** Alta — a própria política de garantia de 7 dias incentiva pedidos de reembolso legítimos logo nas primeiras semanas de vendas reais; é razoável esperar que aconteça já nos primeiros clientes da Onda A.
- **Prioridade:** **P0**
- **Recomendação:** Definir e testar o processo manual de desativação de acesso vinculado a reembolso antes de vender — mesmo que o tratamento automático do evento fique para uma fase posterior, o processo manual precisa existir e estar documentado antes do primeiro pedido real, não descoberto durante ele.

---

**AUD-07 — Não existe caminho self-service de cancelamento/reembolso, e o canal de suporte que substituiria isso também não foi formalizado**
- **Descrição:** `05-CHECKOUT.md` §10.4 já identifica a ausência do botão. Separadamente, `06-EMAILS.md` §0 registra que **nenhum canal de suporte (e-mail dedicado, WhatsApp) foi de fato definido em nenhuma tela ou documento** — apenas assumido como dependência futura. As duas lacunas se combinam: `08-FAQ.md` §8 e `04-LANDING.md` prometem "é só solicitar" o reembolso, mas não há hoje nem botão, nem canal fixado para essa solicitação chegar a alguém.
- **Documento(s):** `05-CHECKOUT.md` §10.4 · `06-EMAILS.md` §0 · `08-FAQ.md` §8, §10 · `04-LANDING.md`.
- **Impacto:** Um cliente real dentro da janela de garantia pode não ter, na prática, nenhum canal funcional e conhecido para exercer um direito que a Landing e o FAQ afirmam existir "sem burocracia". Isso é uma promessa comercial (e, no Brasil, uma obrigação do Código de Defesa do Consumidor para arrependimento) sem via de execução confirmada.
- **Probabilidade:** Alta, pela mesma razão de AUD-06.
- **Prioridade:** **P0**
- **Recomendação:** Fixar um canal único (e-mail ou WhatsApp) e validar o caminho ponta a ponta ("aluno pede reembolso → alguém recebe → acesso é revogado → valor é devolvido no Asaas") antes de abrir a Onda A, mesmo que inteiramente manual.

---

### P1 — Risco relevante, resolver antes ou logo no início do Soft Launch

---

**AUD-08 — O único mecanismo que evita abandono silencioso pós-cadastro pode não existir no Day 1**
- **Descrição:** `05-CHECKOUT.md` §3.3 identifica o gap (dashboard não direciona para assinatura) como o de maior risco/menor esforço do documento. A mitigação proposta é o e-mail de Boas-vindas (`06-EMAILS.md` §4.1). Mas `06-EMAILS.md` §0 também registra que **o serviço de e-mail transacional não está configurado ainda**. Se as duas coisas — nudge no produto e e-mail — estiverem ausentes simultaneamente no lançamento, não sobra nenhuma mitigação para esse ponto do funil.
- **Documento(s):** `05-CHECKOUT.md` §3.3, §10.5 · `06-EMAILS.md` §0, §4.1 · `09-ROADMAP.md` §2 (condiciona o nudge no produto a "dado do Soft Launch mostrar abandono" — mas sem e-mail configurado, esse dado também não seria coletado de forma limpa, criando um ponto cego que se autoalimenta).
- **Impacto:** Risco de perda silenciosa de clientes logo após o cadastro, sem gerar nenhum evento de erro que alguém possa investigar — exatamente o cenário que o próprio `05-CHECKOUT.md` descreve como "o aluno simplesmente não volta".
- **Probabilidade:** Média-alta, condicionada ao estado real do serviço de e-mail no momento do lançamento (não verificável nesta auditoria, pois é infraestrutura externa).
- **Prioridade:** **P1** (torna-se P0 se, no momento do lançamento, o serviço de e-mail ainda não estiver ativo)
- **Recomendação:** Confirmar antes do lançamento qual das duas mitigações (nudge no produto ou e-mail de boas-vindas) estará de fato ativa no Day 1 — não presumir que pelo menos uma delas existirá.

---

**AUD-09 — Nenhum documento comercial redige os textos legais que o rodapé da Landing promete**
- **Descrição:** `04-LANDING.md` linha 355 lista `[Termos de Uso] · [Política de Privacidade] · [Política de Reembolso] · [Contato]` como links do rodapé. Nenhum dos 9 documentos da Fase 7 contém o conteúdo desses textos — apenas compromissos avulsos embutidos em copy (`08-FAQ.md` §15 já faz afirmações materiais sobre uso de dados que deveriam estar espelhadas num documento formal).
- **Documento(s):** `04-LANDING.md` (rodapé) · `08-FAQ.md` §15.
- **Impacto:** Risco jurídico real no Brasil: uma "Política de Reembolso" anunciada como link clicável mas inexistente é, na prática, uma promessa vazia — e a ausência de Política de Privacidade formal é uma exposição direta à LGPD para um produto que já coleta e-mail, CPF (via Asaas) e dados de desempenho de estudo.
- **Probabilidade:** Certa que a lacuna existe; a probabilidade de dano depende de fiscalização/reclamação, que não é controlável, mas o risco de reclamação de um único cliente insatisfeito já é suficiente para expor a lacuna.
- **Prioridade:** **P1** (comportamento recomendado seria tratar como quase-P0, dado que é o único item desta lista com exposição jurídica direta, não apenas comercial)
- **Recomendação:** Redigir os três textos — mesmo que de forma enxuta — antes de publicar a Landing com esses links ativos. Não é escopo desta auditoria produzir esses textos, apenas apontar que eles não existem hoje.

---

**AUD-10 — Recuperação de senha não existe na interface**
- **Descrição:** `06-EMAILS.md` §0 e §4.16 confirmam: não há tela nem rota de "esqueci minha senha" hoje, apesar do Supabase Auth suportar nativamente.
- **Documento(s):** `06-EMAILS.md` §0, §4.16.
- **Impacto:** Um cliente pagante que esquecer a senha não tem caminho self-service de recuperação — cai inteiramente no canal de suporte manual, que (AUD-07) ainda nem está formalizado.
- **Probabilidade:** Média — esquecimento de senha é um evento comum em qualquer base de usuários, não um caso extremo.
- **Prioridade:** **P1**
- **Recomendação:** Conectar a UI de recuperação de senha do Supabase Auth antes do lançamento — é descrito nos próprios documentos como "gap de implementação a resolver antes do lançamento", não como item de fase futura.

---

**AUD-11 — Admin tem menos visibilidade sobre assinaturas do que o próprio aluno**
- **Descrição:** `/admin/subscriptions` não consulta o Asaas ao vivo (`getAsaasLiveStatus`), diferente da tela do aluno. Não existe tela de logs/auditoria nem alerta proativo de falha de webhook.
- **Documento(s):** `05-CHECKOUT.md` §6.
- **Impacto:** Numa operação de uma pessoa (`01-GO_LIVE.md`), a única forma de detectar um webhook que falhou silenciosamente é abrir o SQL Editor do Supabase manualmente e não há garantia de que isso será feito com regularidade — o próprio documento já recomenda isso como "trabalho manual assumido conscientemente", mas nenhum outro documento define quem faz isso e com que frequência.
- **Probabilidade:** Média — depende do volume de vendas e da disciplina operacional do fundador.
- **Prioridade:** **P1**
- **Recomendação:** Definir explicitamente (mesmo que fora deste conjunto de documentos) a rotina manual de checagem antes do lançamento — não deixar como intenção implícita.

---

**AUD-12 — Cronograma de `01-GO_LIVE.md` não foi revisado após `05-CHECKOUT.md` revelar o escopo técnico real**
- **Descrição:** O cronograma original (Bloco 1, D3–D7) foi definido antes de se saber que seriam necessários: neutralizar a recorrência do Asaas (AUD-01), configurar planos reais (AUD-02/03), resolver reembolso/chargeback (AUD-06), criar um caminho de cancelamento (AUD-07). Nenhum dos documentos posteriores retorna a `01-GO_LIVE.md` para ajustar essas datas.
- **Documento(s):** `01-GO_LIVE.md` §2 · gap revelado por `05-CHECKOUT.md` §10.
- **Impacto:** Risco de gestão de expectativa — se o cronograma original for tratado como válido sem revisão, a pressão de prazo pode empurrar o lançamento antes que os P0 acima estejam de fato resolvidos (o próprio risco nº 4 de `01-GO_LIVE.md`, "confundir produto funciona com pronto para mais volume", mas aplicado ao próprio prazo, não ao volume).
- **Probabilidade:** Média-alta — cronogramas não revisados tendem a ser tratados como compromisso mesmo quando o contexto mudou.
- **Prioridade:** **P1**
- **Recomendação:** Revisar explicitamente o cronograma de `01-GO_LIVE.md` à luz dos achados P0 desta auditoria antes de comunicar qualquer data, interna ou externamente.

---

**AUD-13 — Risco de assinaturas Asaas órfãs/duplicadas em tentativas repetidas de pagamento**
- **Descrição:** `iniciarCheckout` bloqueia nova tentativa apenas se já existir assinatura `ACTIVE` — uma assinatura `INACTIVE`/pendente não impede uma nova tentativa, podendo gerar múltiplas cobranças pendentes para o mesmo aluno.
- **Documento(s):** `05-CHECKOUT.md` §4 (cenário "Pagamento duplicado", já autodescrito como gap).
- **Impacto:** Confusão para o aluno (duas cobranças pendentes, incerteza sobre qual pagar) e possível cobrança duplicada não intencional se ambas forem pagas.
- **Probabilidade:** Baixa-média — requer abandono e nova tentativa antes do vencimento da primeira cobrança.
- **Prioridade:** **P1**
- **Recomendação:** Verificar assinatura pendente existente antes de criar uma nova, reaproveitando a fatura já emitida.

---

### P2 — Observações menores, não bloqueiam o Soft Launch

---

**AUD-14 — Citação cruzada imprecisa entre documentos**
- **Descrição:** `04-LANDING.md` (linha 19) cita "`02-PLANS.md`, seção 6.1" para justificar a promessa de vagas limitadas reais. `02-PLANS.md` §6 ("Estrutura dos planos") é uma seção única, sem subdivisões numeradas — não existe uma "seção 6.1" à qual apontar.
- **Documento(s):** `04-LANDING.md` linha 19 · `02-PLANS.md` §6.
- **Impacto:** Cosmético isoladamente, mas é sintoma de que a revisão cruzada final entre os 9 documentos não foi feita com o mesmo rigor da redação individual de cada um.
- **Probabilidade:** Certa (já existe).
- **Prioridade:** **P2**
- **Recomendação:** Corrigir a referência ou numerar as subseções de `02-PLANS.md` §6 quando os documentos forem revisados.

---

**AUD-15 — O número real de vagas do "Plano Fundador" nunca foi fixado**
- **Descrição:** `02-PLANS.md` §6 exige que o teto de vagas seja "definido e comunicado publicamente (número fechado)", mas não define esse número. `04-LANDING.md` já escreve a copy assumindo que esse número existe e será comunicado como "real e finito".
- **Documento(s):** `02-PLANS.md` §6 · `04-LANDING.md` (princípio "sem urgência artificial").
- **Impacto:** Sem o número, a Landing não pode ser publicada como está redigida sem alguém decidir esse valor sem base documentada — o mesmo tipo de lacuna de AUD-03, em menor escala.
- **Probabilidade:** Certa.
- **Prioridade:** **P2** (menor que AUD-03 porque não bloqueia tecnicamente o checkout, apenas a comunicação)
- **Recomendação:** Fixar o número antes de publicar a Landing, não na hora da publicação.

---

**AUD-16 — Métricas de funil dependem de instrumentação de analytics inexistente**
- **Descrição:** Conversões de Landing→Cadastro e Cadastro→Escolha de plano (`05-CHECKOUT.md` §7) dependem de analytics de frontend não implementado hoje.
- **Documento(s):** `05-CHECKOUT.md` §7 (já reconhecido como "nota honesta" pelo próprio documento).
- **Impacto:** Os critérios de sucesso de `01-GO_LIVE.md` §5 podem não ser mensuráveis com precisão total desde o primeiro dia — parte dos 5 indicadores de decisão Go/No-Go dependeria de proxy manual, não de dado automatizado.
- **Probabilidade:** Certa que a lacuna existe hoje.
- **Prioridade:** **P2**
- **Recomendação:** Definir, antes do lançamento, quais dos 5 critérios de `01-GO_LIVE.md` §5 são mensuráveis sem analytics de frontend e quais exigem contagem manual — evita descobrir isso apenas na hora da decisão Go/No-Go.

---

## 2. Contradições entre documentos — síntese

| Contradição | Lado A | Lado B |
|---|---|---|
| Cobrança recorrente | `02-PLANS.md`/`04-LANDING.md`/`06-EMAILS.md`/`08-FAQ.md`: "sem recorrência automática" | Implementação real: assinatura Asaas nativa recorrente, nunca cancelada (AUD-01) |
| Reembolso "sem burocracia" | `04-LANDING.md`/`08-FAQ.md`: "é só solicitar" | Nenhum canal de suporte formalizado, nenhum botão self-service (AUD-07) |
| "1.000 questões oficiais" | `04-LANDING.md`/`06-EMAILS.md`/`08-FAQ.md` | 80 dessas 1.000 (8%) inacessíveis hoje (AUD-04) |
| Preço "claro, sem letra miúda" | `08-FAQ.md` §5: "um único preço, sem letra miúda" | O preço total e a duração do ciclo nunca foram fixados em nenhum documento (AUD-03) |
| Cronograma do Go-Live | `01-GO_LIVE.md` §2 (D3–D7 Bloco 1) | Escopo técnico revelado depois em `05-CHECKOUT.md` nunca foi refletido de volta no cronograma (AUD-12) |

---

## 3. O que a auditoria NÃO encontrou de errado (fechando incertezas em aberto)

- **Controle de acesso por `expires_at`:** `05-CHECKOUT.md` §10.3 registrava isso como "a confirmar". Verificado em código: `study-session.ts` já chama `isSubscriptionActive(starts_at, expires_at)` antes de liberar sessão. **Não é um risco real — pode ser removido da lista de pendências.**
- **Idempotência de webhook:** implementação confirmada consistente com o que os documentos descrevem — nenhuma divergência encontrada.
- **Garantia de 7 dias:** valor consistente entre `03-PRICING.md`, `04-LANDING.md` e `08-FAQ.md` — nenhuma contradição de prazo entre os três.
- **Banned phrases (superlativos proibidos):** aplicadas de forma consistente em `04-LANDING.md`, `06-EMAILS.md` e `08-FAQ.md` — nenhuma violação encontrada nos textos revisados.

---

## 4. Veredito final

### O SimulaPro está apto para Soft Launch?

# **NÃO.**

Sete itens P0 impedem o lançamento com segurança comercial, financeira e jurídica no estado atual — todos verificados como reais nesta data, não apenas teóricos:

1. **AUD-01** — Recorrência automática do Asaas não neutralizada (cobrança indevida garantida a cada cliente).
2. **AUD-02** — `COMMERCIAL_PLANS` vazio (ninguém consegue comprar).
3. **AUD-03** — Duração do ciclo/preço total nunca definidos (impede resolver o item 2 com lastro documental).
4. **AUD-04** — 80/1000 questões (8% do Acervo) ainda inacessíveis.
5. **AUD-05** — Cargo duplicado ainda presente na taxonomia (bloqueador autodeclarado desde `01-GO_LIVE.md`, nunca resolvido).
6. **AUD-06** — Reembolso/chargeback não desativa acesso automaticamente.
7. **AUD-07** — Nenhum caminho funcional (nem self-service, nem manual formalizado) para o aluno exercer a garantia de 7 dias.

Os itens 1, 6 e 7 juntos formam o risco mais grave: o SimulaPro promete, em três documentos de venda diferentes (Landing, E-mails, FAQ), um modelo de cobrança única e reembolso sem burocracia — e hoje **nenhuma das duas promessas é tecnicamente verdadeira**. Vender nessas condições expõe o produto a cobrança contestada, reclamação formal e dano de reputação na primeira semana real de vendas, exatamente o oposto do que toda a Fase 7 foi desenhada para evitar.

### Se resolvidos os 7 itens P0 — o que ainda recomendo antes do Hard Launch (Onda B)

Mesmo depois de destravar o Soft Launch, os itens abaixo devem ser resolvidos **durante** a Onda A, antes de qualquer decisão de avançar para aquisição paga (`01-GO_LIVE.md` Onda B / `07-MARKETING.md` Fase 4):

- **AUD-08** — Confirmar que ao menos uma mitigação real (nudge no produto ou e-mail de boas-vindas) está ativa no Day 1 — hoje há risco de nenhuma das duas estar pronta simultaneamente.
- **AUD-09** — Redigir Termos de Uso, Política de Privacidade e Política de Reembolso antes de publicar os links do rodapé da Landing — exposição jurídica direta (LGPD, CDC), não apenas cosmética.
- **AUD-10** — Conectar recuperação de senha à UI.
- **AUD-11** — Definir explicitamente quem monitora `logs`/painel do Asaas manualmente, e com que frequência.
- **AUD-12** — Revisar o cronograma de `01-GO_LIVE.md` à luz do escopo técnico real antes de comunicá-lo a qualquer parte interessada.
- **AUD-13** — Tratar o risco de assinaturas duplicadas em tentativas repetidas de pagamento.
- **AUD-14, AUD-15, AUD-16** — Ajustes menores de consistência documental e de expectativa de métricas, sem risco de bloquear o lançamento.

**Resumo em uma frase:** a arquitetura comercial da Fase 7 é coerente e bem fundamentada como *decisão* — o problema não está na estratégia, está na distância entre o que já foi decidido e o que já foi construído. Essa distância, hoje, ainda é grande o suficiente para tornar as promessas centrais da Landing e do FAQ tecnicamente falsas se o produto for vendido agora.

---

*Fim da Auditoria. Nenhum outro documento de `docs/commercial/` foi modificado. Nenhum código foi escrito. Aguardando decisão sobre quais itens P0/P1 serão corrigidos antes de qualquer nova fase de implementação.*
