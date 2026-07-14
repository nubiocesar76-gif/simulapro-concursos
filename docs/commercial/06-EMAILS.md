# 06 — EMAILS

**Fase:** 7 — Comercial
**Documento:** Comunicação completa do ciclo de vida do cliente (não apenas e-mails)
**Data:** 2026-07-09
**Pré-requisitos:** `01-GO_LIVE.md`, `02-PLANS.md`, `03-PRICING.md`, `04-LANDING.md`, `05-CHECKOUT.md` (aprovados)
**Escopo:** documentação de fluxos, copy completa e política de comunicação. Nenhuma automação, provedor, template HTML ou código é criado aqui.

---

## 0. Diagnóstico — o que já existe e o que este documento precisa assumir como dependência

| Item | Situação real | Implicação para este documento |
|---|---|---|
| Serviço de e-mail transacional de produto | **Não configurado ainda** — `COMMERCIAL_V1_ROADMAP.md` recomenda um serviço dedicado (ex.: Resend/Postmark) para os e-mails que não são de cobrança | Todo fluxo abaixo é uma especificação para implementação futura, não algo que já dispara hoje |
| E-mails nativos do Asaas (cobrança) | O Asaas já dispara e-mails próprios de fatura/cobrança nativamente, conforme configuração da conta | Este documento **não duplica** esses e-mails — define o que o SimulaPro complementa por cima deles (ver seção 3.3) |
| Canal de notificação persistente dentro da plataforma (central de notificações, sino, inbox) | **Não existe.** O produto hoje só tem toasts efêmeros (`sonner`) para feedback imediato de uma ação que o próprio aluno acabou de realizar, e estados vazios/banners contextuais nas telas (`EmptyState`) | Nenhuma mensagem deste documento pode depender de "aparecer para o aluno mais tarde dentro do app" se ele não estiver logado no momento — ver seção 2 |
| Recuperação de senha (fluxo de "esqueci minha senha") | **Não existe na interface hoje** — nenhuma rota, nenhum link "esqueci minha senha" no `/auth` atual. O Supabase Auth (usado como base de autenticação) suporta esse recurso nativamente, mas não está conectado à UI do SimulaPro | O fluxo é especificado aqui como deveria funcionar quando implementado — é uma dependência de implementação, não uma automação já ativa |
| Canal de suporte | Nenhum e-mail ou WhatsApp de suporte está hoje referenciado no código do produto — a decisão de usar um canal único e manual (`COMMERCIAL_V1_ROADMAP.md`, seção 12) ainda não foi formalizada em nenhuma tela | Este documento assume que um canal único (e-mail dedicado, ex. `contato@simulapro.com.br`, ou WhatsApp) será definido antes do lançamento — não inventa um número/endereço aqui |
| Divergência de recorrência do Asaas (`05-CHECKOUT.md`, seção 10.1, marcada P0) | Ainda não corrigida | Toda copy de pagamento/renovação abaixo é escrita assumindo o comportamento **aprovado** (sem cobrança automática silenciosa) — se o P0 não for resolvido antes do Soft Launch, os e-mails de "Pagamento aprovado" e "Renovação" descritos aqui ficariam **factualmente falsos**, o que é pior do que não enviar e-mail nenhum. Esta é uma dependência dura, não uma nota de rodapé. |

---

## 1. Princípios de tom de voz

O SimulaPro conversa como um profissional competente que respeita o tempo de quem estuda para concurso — não como uma plataforma de infoproduto tentando manter a atenção de qualquer jeito.

### Como falamos

- **Direto.** Uma informação por mensagem, sem enrolação para "parecer maior".
- **Específico.** "Sua sessão de 20 questões está pronta" em vez de "Prepare-se para uma experiência incrível".
- **Honesto sobre limitação.** Se o Acervo tem 1.000 questões, dizemos 1.000 — nunca arredondamos para cima nem usamos linguagem vaga para esconder o número.
- **Próximo, não íntimo demais.** Tratamos por "você"; assinamos com nome real de pessoa (não "Equipe SimulaPro" genérico) enquanto a operação for pequena — reforça a proximidade real que existe hoje (`01-GO_LIVE.md`: operação de uma pessoa), sem fingir uma estrutura de empresa maior do que é.
- **Dá controle ao aluno.** Toda comunicação de reengajamento oferece uma saída clara (ex.: "pausar esse tipo de aviso"), nunca insiste depois de um "não, obrigado".

### O que nunca fazemos

- **Pressão de urgência artificial.** Nada de "ÚLTIMA CHANCE", contadores regressivos ou "sua vaga está prestes a expirar" quando isso não é literalmente verdade.
- **Culpa por inatividade.** Nunca "você está ficando para trás" ou "seus concorrentes já resolveram X questões hoje" — ansiedade não é ferramenta de retenção aceitável aqui.
- **Superlativo não sustentável.** As mesmas restrições de `04-LANDING.md`, seção 0, valem para toda comunicação: nada de "a melhor", "o maior banco", "milhares de questões", "estude mais", "passe em qualquer concurso".
- **Excesso de pontuação/caixa alta.** Sem "!!!", sem títulos em CAIXA ALTA, sem emoji decorativo fora de contexto.
- **CTA genérico.** Nunca "clique aqui" — sempre o verbo da ação real ("Ver meu plano", "Retomar sessão", "Escolher forma de pagamento").

### Autoridade sem arrogância

Autoridade vem de precisão (números reais, prazos reais, explicação honesta de erro), não de afirmação de superioridade. Uma mensagem de erro que explica exatamente o que aconteceu e o que fazer a seguir transmite mais competência do que qualquer frase de efeito.

### Incentivo sem ansiedade

A diferença entre "lembrete útil" e "gatilho de ansiedade" está no enquadramento: comunicamos o que o aluno **ganha** ao voltar (retomar de onde parou, ver a evolução no painel por disciplina), nunca o que ele **perde** por não ter voltado. "Sua sessão de Legislação do SUS está esperando por você" é aceitável; "Você está desperdiçando seu tempo de estudo" não é.

---

## 2. Canais — definição precisa

O briefing lista oito itens sob "canais", mas só dois são canais de entrega reais — os outros seis são **categorias de conteúdo** que trafegam por um ou ambos os canais, dependendo do contexto. Separar isso evita desenhar um "canal" que não existe tecnicamente hoje.

### 2.1 Canais de entrega (os únicos dois reais)

| Canal | O que é hoje | Limitação a respeitar |
|---|---|---|
| **E-mail** | Não configurado ainda (dependência, seção 0) — mas é o único canal capaz de alcançar o aluno quando ele não está com o produto aberto | Todo fluxo que depende de "avisar alguém que sumiu" só pode ser e-mail — não existe alternativa hoje |
| **Notificação dentro da plataforma** | Hoje existe apenas como **toast efêmero** (confirmação de uma ação que o próprio aluno acabou de fazer) e **estado contextual de tela** (banner/empty state visto só quando o aluno abre aquela tela específica) | Não é um canal assíncrono — não alcança quem não está logado no momento. Usar apenas para reforçar uma ação que acabou de acontecer, nunca como substituto de e-mail para reengajamento |

### 2.2 Categorias de conteúdo (tipos de mensagem, não canais)

| Categoria | Definição | Canal(is) usado(s) |
|---|---|---|
| Mensagem de sucesso | Confirma que uma ação deu certo (cadastro, pagamento, sessão concluída) | Toast (imediato) + e-mail (registro permanente, especialmente para pagamento) |
| Mensagem de erro | Explica o que falhou e o que fazer a seguir | Toast (se o erro acontece com o aluno na tela) + e-mail (se o erro for descoberto de forma assíncrona, ex. webhook atrasado) |
| Mensagem de pagamento | Cobre todo o ciclo de cobrança (iniciado, aprovado, recusado, boleto pendente) | Predominantemente e-mail (o aluno frequentemente já saiu do site para pagar — ver `05-CHECKOUT.md`, seção 3.6) |
| Mensagem de renovação | Aviso de ciclo terminando e decisão de renovar | E-mail (é, por definição, um contato com quem pode não estar usando o produto no momento) |
| Mensagem de expiração | Acesso encerrado | E-mail |
| Mensagem de suporte | Confirmação de recebimento de um contato de suporte | E-mail (o canal de suporte em si, WhatsApp ou e-mail, é decisão operacional separada — `COMMERCIAL_V1_ROADMAP.md`, seção 12) |

---

## 3. Mapa cronológico completo da jornada

```
① Visitante                — sem comunicação (sem contato capturado, sem trial/lead magnet nesta V1)
       ↓
② Cadastro                 — Boas-vindas / Conta criada
       ↓
③ Pagamento                — Pagamento iniciado → Aprovado | Recusado | Pix expirado
       ↓
④ Primeiro acesso          — (reforço dentro do e-mail de Pagamento aprovado, sem e-mail próprio)
       ↓
⑤ Primeira sessão          — Primeira sessão concluída
       ↓
⑥ Primeiro resultado       — reforço em plataforma (painel de desempenho), sem e-mail dedicado
       ↓
⑦ Primeira semana          — Primeira semana sem acesso (nunca voltou) | 7 dias sem estudar (voltou e sumiu)
       ↓ (durante o ciclo)
⑧ Renovação                — Expiração próxima → 30 dias sem estudar (se aplicável)
       ↓
⑨ Expiração                — Expiração
       ↓
⑩ Reativação               — Reativação

Transversais, não presos a uma etapa: Mudança de senha · Recuperação de senha · Contato de suporte
```

**Por que "Visitante" não tem comunicação:** a V1 não tem período gratuito nem captura de lead antes do cadastro (`02-PLANS.md`, seção 8) — não existe e-mail de visitante para acionar. Se uma futura estratégia de conteúdo/lead magnet for criada (`07-MARKETING.md`), este mapa precisa ser revisado.

---

## 4. Fluxos detalhados

Cada fluxo segue a mesma estrutura: Objetivo · Canal · Momento · Mensagem (copy completa) · CTA · Risco · Como medir sucesso.

### 4.1 Boas-vindas

- **Objetivo:** confirmar que a conta foi criada e, principalmente, **suprir a ausência de direcionamento automático do dashboard para a assinatura** (`05-CHECKOUT.md`, seção 3.3 — gap 10.5) — este e-mail é a mitigação direta desse gap enquanto ele não for resolvido no produto.
- **Canal:** e-mail.
- **Momento:** imediatamente após a criação da conta (trigger `handle_new_user`, já existente).
- **Mensagem:**

> **Assunto:** Sua conta no SimulaPro está criada
>
> Olá, [nome],
>
> Sua conta no SimulaPro foi criada com sucesso. Falta um passo para você começar a estudar: escolher o Plano Fundador e garantir acesso ao Acervo Enfermeiro.
>
> O Plano Fundador tem vagas limitadas e é a condição de lançamento — depois que as vagas acabarem, ele não volta.
>
> [Ver o Plano Fundador]
>
> Qualquer dúvida antes de decidir, é só responder este e-mail.
>
> [Nome do remetente]

- **CTA:** "Ver o Plano Fundador" → `/app/subscription`.
- **Risco:** se este e-mail atrasar ou não for enviado, o aluno fica exatamente no vácuo identificado em `05-CHECKOUT.md` (conta criada, sem próximo passo) — é o e-mail de maior prioridade de implementação de todo este documento.
- **Como medir sucesso:** taxa de abertura, CTR para `/app/subscription`, e — a métrica que importa de fato — proporção de contas criadas que chegam a iniciar checkout em até 48h.

### 4.2 Conta criada (confirmação técnica, se distinta do Boas-vindas)

- **Objetivo:** se o Supabase Auth exigir confirmação de e-mail antes do primeiro login, esse é o e-mail transacional de confirmação — diferente do Boas-vindas acima (que pressupõe a conta já confirmada).
- **Canal:** e-mail (nativo do Supabase Auth, se a confirmação de e-mail estiver ativa).
- **Momento:** no cadastro, antes do Boas-vindas.
- **Mensagem:** e-mail padrão de confirmação — recomenda-se customizar o remetente/assunto no painel do Supabase para manter consistência de marca, mas o conteúdo é técnico (link de confirmação), não precisa de copy de produto.
- **CTA:** "Confirmar e-mail".
- **Risco:** se a confirmação de e-mail estiver ativa mas o e-mail cair em spam, o aluno nunca chega ao Boas-vindas — verificar configuração de domínio/SPF/DKIM antes do lançamento é pré-requisito técnico, não deste documento.
- **Como medir sucesso:** taxa de confirmação em até 24h.

### 4.3 Pagamento iniciado

- **Objetivo:** dar segurança durante a janela em que o aluno está fora do site do SimulaPro pagando no ambiente do Asaas (`05-CHECKOUT.md`, seção 3.6).
- **Canal:** e-mail, disparado a partir da criação da cobrança (evento `SUBSCRIPTION_CREATED` já existente no webhook).
- **Momento:** logo após o clique em "Ir para pagamento", em paralelo ao redirecionamento.
- **Mensagem:**

> **Assunto:** Seu pagamento está a caminho
>
> Olá, [nome],
>
> Recebemos sua solicitação de acesso ao Plano Fundador. Se você já concluiu o pagamento na página do Asaas, ótimo — seu acesso é liberado automaticamente assim que a confirmação chegar (em segundos para Pix e cartão; em até 3 dias úteis para boleto, após a compensação).
>
> Se você fechou a página antes de terminar, não tem problema: [Voltar para o pagamento].
>
> [Nome do remetente]

- **CTA:** "Voltar para o pagamento" → link para a fatura do Asaas (`invoiceUrl` já retornado por `iniciarCheckout`).
- **Risco:** se disparado cedo demais e o aluno já tiver pago, a mensagem "se você já concluiu" evita soar como se o sistema não soubesse do pagamento — redação já contempla isso.
- **Como medir sucesso:** proporção de "pagamento iniciado" que chega a "aprovado" em até 24h, comparando quem recebeu este e-mail com quem não recebeu (se testável).

### 4.4 Pagamento aprovado

- **Objetivo:** confirmar a ativação e levar o aluno direto ao primeiro uso real — não ao dashboard genérico (`05-CHECKOUT.md`, seção 3.9).
- **Canal:** e-mail, disparado por `PAYMENT_CONFIRMED`/`PAYMENT_RECEIVED` (já existente).
- **Momento:** imediatamente após a ativação da assinatura.
- **Mensagem:**

> **Assunto:** Seu acesso ao Acervo Enfermeiro está liberado
>
> Olá, [nome],
>
> Seu pagamento foi confirmado e o Acervo Enfermeiro já está liberado para você — 1.000 questões oficiais, organizadas por banca, disciplina e assunto.
>
> Seu acesso é válido até [data de expiração]. Você não será cobrado de novo automaticamente — perto do fim do período, avisamos com antecedência para você decidir se quer renovar.
>
> [Começar a estudar]
>
> [Nome do remetente]

- **CTA:** "Começar a estudar" → `/app/study` diretamente (não `/app`).
- **Risco (dependência dura, ver seção 0):** a frase "você não será cobrado de novo automaticamente" só pode ser enviada depois que o gap P0 de `05-CHECKOUT.md` (recorrência do Asaas não neutralizada) estiver corrigido. Enviar este texto sem a correção técnica correspondente seria comunicação falsa.
- **Como medir sucesso:** CTR para `/app/study`, e proporção que efetivamente inicia uma sessão em até 24h (é também um critério de sucesso do `01-GO_LIVE.md`, seção 5).

### 4.5 Pagamento recusado

- **Objetivo:** informar sem culpar o aluno, e dar caminho claro de correção.
- **Canal:** e-mail, disparado por `PAYMENT_OVERDUE` (cartão recusado ou cobrança vencida sem pagamento).
- **Momento:** assim que o evento chega.
- **Mensagem:**

> **Assunto:** Não conseguimos confirmar seu pagamento
>
> Olá, [nome],
>
> Seu pagamento para o Plano Fundador não foi confirmado — pode ter sido uma recusa do seu banco ou o prazo da cobrança venceu. Isso é comum e fácil de resolver.
>
> [Tentar novamente]
>
> Se preferir outra forma de pagamento (Pix, cartão ou boleto), você escolhe de novo ao clicar acima.
>
> [Nome do remetente]

- **CTA:** "Tentar novamente" → `/app/subscription`.
- **Risco:** tom precisa evitar qualquer sugestão de culpa ("você não pagou") — a redação usa "não foi confirmado", passivo e neutro.
- **Como medir sucesso:** taxa de nova tentativa em até 72h após este e-mail.

### 4.6 Pix expirado

- **Objetivo:** caso específico de pagamento recusado, tratado à parte porque a ação corretiva é mais simples e imediata (gerar novo Pix, não repensar forma de pagamento).
- **Canal:** e-mail.
- **Momento:** quando a cobrança Pix vence sem leitura/pagamento (mesmo evento técnico de `PAYMENT_OVERDUE`, mas copy específica).
- **Mensagem:**

> **Assunto:** Seu Pix expirou — é rápido gerar um novo
>
> Olá, [nome],
>
> O código Pix para o Plano Fundador expirou antes do pagamento ser confirmado. Isso não cancela sua solicitação — é só gerar um novo código.
>
> [Gerar novo Pix]
>
> [Nome do remetente]

- **CTA:** "Gerar novo Pix" → `/app/subscription`.
- **Risco:** nenhum incomum — é o cenário de erro mais simples de resolver do funil.
- **Como medir sucesso:** taxa de conclusão de pagamento em até 1h após este e-mail (janela curta, porque a ação é rápida).

### 4.7 Primeira sessão concluída

- **Objetivo:** reforçar a sensação de progresso logo na primeira interação real com o produto — momento de maior prova de valor (`05-CHECKOUT.md`, seção 3.9).
- **Canal:** e-mail (não apenas toast, porque vale a pena um registro que o aluno pode reabrir depois) + toast imediato na plataforma (já existente, ex.: mensagens de finalização de sessão).
- **Momento:** ao concluir a primeira sessão de estudo.
- **Mensagem:**

> **Assunto:** Sua primeira sessão está registrada
>
> Olá, [nome],
>
> Você concluiu sua primeira sessão de estudo no SimulaPro. Seu desempenho por disciplina já está disponível no painel — é o ponto de partida para saber onde focar nas próximas sessões.
>
> [Ver meu desempenho]
>
> [Nome do remetente]

- **CTA:** "Ver meu desempenho" → `/app` (painel de desempenho por disciplina).
- **Risco:** se disparado para sessões muito curtas ou incompletas, pode soar automático demais — condicionar o disparo a uma sessão efetivamente finalizada (`study_sessions.status = FINISHED`), não apenas iniciada.
- **Como medir sucesso:** CTR para o painel de desempenho; proporção que inicia uma segunda sessão em até 7 dias.

### 4.8 Primeiro resultado (reforço em plataforma, sem e-mail dedicado)

- **Objetivo:** o próprio painel de desempenho por disciplina (já existente, ordenado do ponto mais fraco para o mais forte) já cumpre esse papel visualmente — não é necessário um e-mail à parte além do 4.7.
- **Canal:** apenas plataforma (o painel em si).
- **Momento:** sempre que o aluno acessa `/app` após ter dados suficientes.
- **Risco:** duplicar comunicação aqui (mais um e-mail) seria redundante com 4.7 e correria risco de soar como excesso — decisão deliberada de não criar um fluxo de e-mail spara esta etapa.
- **Como medir sucesso:** tempo de permanência na tela de desempenho, não um funil de e-mail.

### 4.9 Primeira semana sem acesso (pagou, nunca voltou)

- **Objetivo:** reengajar quem converteu mas não chegou a estudar — sinal de risco de reembolso dentro da garantia de 7 dias (`03-PRICING.md`).
- **Canal:** e-mail.
- **Momento:** 3 dias após a ativação, se nenhuma sessão foi iniciada (janela deliberadamente antes do fim da garantia de 7 dias, para dar tempo de reação).
- **Mensagem:**

> **Assunto:** Seu Acervo Enfermeiro está esperando por você
>
> Olá, [nome],
>
> Notamos que você ainda não começou a estudar no SimulaPro. Se tiver qualquer dificuldade para acessar ou alguma dúvida sobre como funciona, é só responder este e-mail — respondemos pessoalmente.
>
> [Começar agora]
>
> [Nome do remetente]

- **CTA:** "Começar agora" → `/app/study`.
- **Risco:** é o momento de maior risco de reembolso silencioso (o aluno simplesmente deixa a garantia vencer sem usar) — este e-mail é uma ação de retenção direta, não apenas informativa.
- **Como medir sucesso:** proporção que inicia a primeira sessão após este e-mail; proporção de reembolsos solicitados por quem recebeu vs. não recebeu.

### 4.10 7 dias sem estudar (já usou, foi embora)

- **Objetivo:** reengajar quem já teve pelo menos uma sessão, mas parou — sinal diferente do 4.9 (aqui já houve prova de valor real).
- **Canal:** e-mail.
- **Momento:** 7 dias corridos sem nova sessão, para quem já teve ao menos uma.
- **Mensagem:**

> **Assunto:** De onde você parou no SimulaPro
>
> Olá, [nome],
>
> Faz uma semana desde sua última sessão de estudo. Seu progresso continua salvo — inclusive as questões marcadas como favoritas ou para revisar.
>
> [Retomar de onde parei]
>
> [Nome do remetente]

- **CTA:** "Retomar de onde parei" → `/app/study` (idealmente pré-selecionando o modo Revisão/Erradas, se tecnicamente possível).
- **Risco:** tom precisa ficar estritamente no lado "útil/prático" (progresso salvo), nunca no lado "você sumiu" — testar internamente antes de considerar aprovado.
- **Como medir sucesso:** taxa de retorno em até 48h após o e-mail.

### 4.11 30 dias sem estudar

- **Objetivo:** último esforço de reengajamento antes de tratar o aluno como dormente de fato — tom muda de "lembrete" para "check-in genuíno".
- **Canal:** e-mail.
- **Momento:** 30 dias corridos sem sessão.
- **Mensagem:**

> **Assunto:** Ainda podemos ajudar no seu estudo?
>
> Olá, [nome],
>
> Faz um mês que você não estuda no SimulaPro. Se sua rotina mudou, ou se o formato não está ajudando do jeito que você esperava, queremos saber — é a única forma de melhorar de verdade.
>
> [Me conta o que aconteceu] · [Retomar meus estudos]
>
> [Nome do remetente]

- **CTA duplo (intencional):** "Me conta o que aconteceu" (abre resposta direta de e-mail, capturando motivo real de abandono — dado valioso de produto) ou "Retomar meus estudos" (`/app/study`).
- **Risco:** enviar isso com frequência excessiva (mais de uma vez por ciclo de inatividade) viraria exatamente o spam que o briefing pede para evitar — este e-mail dispara **uma única vez** por período de inatividade, não repete semanalmente.
- **Como medir sucesso:** taxa de resposta (não apenas clique) — o objetivo real aqui é aprendizado qualitativo, não conversão.

### 4.12 Expiração próxima

- **Objetivo:** dar tempo real de decisão antes do fim do ciclo — nunca surpreender com "seu acesso já acabou".
- **Canal:** e-mail.
- **Momento:** definido por política (ver `02-PLANS.md`, seção 9) — recomenda-se ao menos 7 dias antes de `expires_at`, com um segundo aviso mais próximo (ex.: 2 dias antes) se o primeiro não gerar ação.
- **Mensagem:**

> **Assunto:** Seu acesso ao SimulaPro termina em [X dias]
>
> Olá, [nome],
>
> Seu ciclo de acesso ao Acervo Enfermeiro termina em [data]. Como não há cobrança automática, nada acontece se você não fizer nada — seu acesso simplesmente não é renovado.
>
> Se quiser continuar, é só escolher de novo o seu plano:
>
> [Renovar meu acesso]
>
> [Nome do remetente]

- **CTA:** "Renovar meu acesso" → `/app/subscription`.
- **Risco:** mesma dependência dura da seção 4.4 — este texto só é verdadeiro depois do P0 de `05-CHECKOUT.md` estar resolvido.
- **Como medir sucesso:** taxa de renovação disparada a partir deste e-mail; proporção de renovação em relação ao total de ciclos que vencem.

### 4.13 Expiração

- **Objetivo:** confirmar o encerramento do acesso sem tom de perda ou de venda forçada — porta aberta, não pressão.
- **Canal:** e-mail.
- **Momento:** no vencimento de `expires_at` sem renovação.
- **Mensagem:**

> **Assunto:** Seu acesso ao SimulaPro foi encerrado
>
> Olá, [nome],
>
> Seu ciclo de acesso ao Acervo Enfermeiro terminou. Seus dados e seu histórico de estudo continuam salvos — se quiser voltar, é só escolher um novo plano quando fizer sentido para você.
>
> [Ver planos disponíveis]
>
> [Nome do remetente]

- **CTA:** "Ver planos disponíveis" → `/app/subscription`.
- **Risco:** evitar qualquer linguagem de "você perdeu acesso" — enquadrar como ciclo natural, coerente com o modelo sem recorrência automática de `02-PLANS.md`.
- **Como medir sucesso:** taxa de reativação (fluxo 4.14) originada a partir deste e-mail.

### 4.14 Reativação

- **Objetivo:** trazer de volta quem já foi cliente — o público mais barato de reconquistar (já conhece o produto).
- **Canal:** e-mail.
- **Momento:** periódico após a expiração (ex.: 30 e 90 dias depois, não mais que isso para não virar spam), e sempre que houver uma mudança real e relevante no Acervo (nova leva de questões processada, `01-GO_LIVE.md`/pipeline de produção).
- **Mensagem:**

> **Assunto:** O Acervo Enfermeiro cresceu desde a sua última visita
>
> Olá, [nome],
>
> Desde que seu acesso encerrou, o Acervo Enfermeiro recebeu novas questões classificadas e revisadas. Se você ainda está se preparando para concurso, pode fazer sentido voltar.
>
> [Ver o que mudou]
>
> [Nome do remetente]

- **CTA:** "Ver o que mudou" → `/app/subscription` (ou Landing, se o aluno não estiver logado).
- **Risco:** só enviar este e-mail quando houver, de fato, uma mudança real a comunicar (número novo de questões, nova disciplina) — nunca reativação "porque já faz tempo" sem novidade concreta, sob pena de soar genérico e cair na categoria de spam que o briefing rejeita.
- **Como medir sucesso:** taxa de reativação (novo checkout concluído) por campanha de reativação enviada.

### 4.15 Mudança de senha

- **Objetivo:** confirmação de segurança — o aluno precisa saber que a própria senha foi alterada, mesmo que tenha sido ele mesmo.
- **Canal:** e-mail (nativo do Supabase Auth, se disponível, ou e-mail próprio no momento da implementação).
- **Momento:** imediatamente após a alteração de senha bem-sucedida.
- **Mensagem:**

> **Assunto:** Sua senha do SimulaPro foi alterada
>
> Olá, [nome],
>
> Sua senha foi alterada com sucesso em [data/hora]. Se não foi você, entre em contato imediatamente: [canal de suporte].
>
> [Nome do remetente]

- **CTA:** nenhum CTA de produto — é uma mensagem de segurança, não de engajamento.
- **Risco:** é a única categoria onde velocidade de entrega importa mais que copy — se um terceiro alterou a senha sem autorização, o aluno precisa saber rápido.
- **Como medir sucesso:** não é um fluxo de conversão — métrica relevante é tempo de entrega, não CTR.

### 4.16 Recuperação de senha

- **Objetivo:** permitir que o aluno recupere acesso sem depender de suporte manual.
- **Canal:** e-mail.
- **Momento:** sob demanda, quando o aluno solicita.
- **Mensagem:**

> **Assunto:** Redefinir sua senha do SimulaPro
>
> Olá,
>
> Recebemos uma solicitação para redefinir a senha da sua conta. Se foi você, clique abaixo — o link expira em [prazo].
>
> [Redefinir minha senha]
>
> Se você não solicitou isso, pode ignorar este e-mail com segurança.
>
> [Nome do remetente]

- **CTA:** "Redefinir minha senha".
- **Risco (dependência, ver seção 0):** este fluxo depende de uma tela de "esqueci minha senha" que **ainda não existe** na interface do SimulaPro — o Supabase Auth suporta nativamente, mas precisa ser conectado a uma rota/UI antes de este e-mail poder disparar de verdade. É um gap de implementação a resolver antes do lançamento, não apenas deste documento.
- **Como medir sucesso:** taxa de conclusão da redefinição em até 1h do envio.

### 4.17 Contato de suporte

- **Objetivo:** confirmar recebimento e alinhar expectativa de prazo — reduz ansiedade de "será que alguém viu minha mensagem".
- **Canal:** e-mail (resposta automática de confirmação) + canal humano real definido operacionalmente (`COMMERCIAL_V1_ROADMAP.md`, seção 12).
- **Momento:** imediatamente após o aluno enviar uma mensagem de suporte.
- **Mensagem:**

> **Assunto:** Recebemos sua mensagem
>
> Olá, [nome],
>
> Recebemos sua mensagem e vamos responder pessoalmente — nesta fase, sem central de atendimento automatizada, quem responde é quem constrói o produto.
>
> Prazo esperado de resposta: [prazo real combinado operacionalmente].
>
> [Nome do remetente]

- **CTA:** nenhum — é uma confirmação, não uma ação.
- **Risco:** prometer um prazo que não é cumprido é o dano de confiança mais rápido possível para uma marca nova — o prazo comunicado precisa ser o prazo real que a operação consegue cumprir, não um prazo aspiracional.
- **Como medir sucesso:** tempo real de primeira resposta humana vs. prazo prometido.

---

## 5. Retenção — momentos críticos e ações

| Momento crítico | Por que é crítico | Ação de comunicação | Risco de fazer errado |
|---|---|---|---|
| Pagou e não voltou em 3 dias (4.9) | Maior risco de reembolso dentro da garantia de 7 dias — literalmente o dinheiro na mesa indo embora por falta de ativação, não por insatisfação real com o produto | E-mail de reengajamento com oferta de ajuda direta, não só lembrete | Se soar como cobrança de uso ("por que você não estudou?"), reforça a decisão de pedir reembolso em vez de evitá-la |
| Usou uma vez e sumiu por 7 dias (4.10) | Sinal de que a primeira experiência não gerou hábito — risco de não-renovação silenciosa no fim do ciclo | E-mail focado em retomar exatamente de onde parou (baixo esforço de decisão) | Pressão excessiva pode transformar um usuário ocasional (perfil "Sprint" de `02-PLANS.md`) em cancelamento antecipado |
| 30 dias sem estudar (4.11) | Última janela antes de o aluno esquecer o produto por completo | Pergunta genuína, não venda — captura motivo real de abandono | Enviar mais de uma vez vira exatamente o spam que o briefing pede para evitar |
| Expiração próxima sem sinal de renovação (4.12) | Momento de decisão explícita — se não for comunicado com antecedência real, o aluno vive a expiração como surpresa, não como escolha | Dois avisos espaçados (7 dias e 2 dias antes), nunca mais que isso | Excesso de avisos de "está acabando" pode soar como o próprio padrão de pressão de renovação que o modelo "sem recorrência automática" foi desenhado para evitar |
| Expiração efetiva sem qualquer estudo no último mês do ciclo (4.13→4.14) | Sinal mais forte de que o produto não estava sendo usado — reativação aqui precisa de motivo novo e real, não apenas "sentimos sua falta" | Reativação condicionada a novidade real do Acervo | Reativação vazia (sem novidade) é o principal risco de a comunicação inteira do SimulaPro ser percebida como spam |

**Princípio geral de anti-spam:** nenhum aluno recebe mais de um e-mail de reengajamento por semana, e cada categoria (4.9 a 4.14) dispara no máximo uma vez por ciclo de inatividade — nunca em cascata cumulativa.

---

## 6. Métricas por fluxo

| Fluxo | Taxa de abertura | CTR | Conversão | Reativação | Renovação | Cancelamento |
|---|---|---|---|---|---|---|
| Boas-vindas (4.1) | ✓ | ✓ (para checkout) | ✓ (conta → checkout iniciado) | — | — | — |
| Pagamento iniciado (4.3) | ✓ | ✓ | ✓ (iniciado → aprovado) | — | — | — |
| Pagamento aprovado (4.4) | ✓ | ✓ (para `/app/study`) | ✓ (aprovado → 1ª sessão) | — | — | — |
| Pagamento recusado (4.5) / Pix expirado (4.6) | ✓ | ✓ | ✓ (nova tentativa concluída) | — | — | — |
| Primeira sessão concluída (4.7) | ✓ | ✓ | ✓ (→ 2ª sessão) | — | — | — |
| Primeira semana sem acesso (4.9) | ✓ | ✓ | ✓ (→ 1ª sessão) | — | — | ✓ (correlação com pedido de reembolso) |
| 7 dias sem estudar (4.10) | ✓ | ✓ | ✓ (→ retorno em 48h) | — | — | — |
| 30 dias sem estudar (4.11) | ✓ | ✓ (taxa de resposta, não só clique) | — | — | — | — |
| Expiração próxima (4.12) | ✓ | ✓ | — | — | ✓ | — |
| Expiração (4.13) | ✓ | ✓ | — | ✓ (fluxo seguinte) | — | — |
| Reativação (4.14) | ✓ | ✓ | ✓ (checkout concluído) | ✓ (métrica principal deste fluxo) | — | — |
| Mudança/recuperação de senha (4.15/4.16) | — (prioriza velocidade, não abertura) | — | ✓ (redefinição concluída) | — | — | — |
| Contato de suporte (4.17) | — | — | — | — | — | — (mede tempo de resposta, não conversão) |

---

## 7. Fora do escopo (confirmação)

Nenhuma automação foi implementada, nenhum provedor de e-mail foi integrado, nenhum template HTML foi criado, nenhum código foi escrito. Todo o conteúdo acima é especificação pronta para implementação futura — inclusive as dependências explícitas da seção 0 (recuperação de senha sem UI própria, serviço de e-mail não configurado, gap P0 de `05-CHECKOUT.md`) precisam ser resolvidas antes de qualquer um destes fluxos poder ser ativado de verdade.

---

*Próximo documento: `07-MARKETING.md` — aguardando validação desta comunicação de ciclo de vida.*
