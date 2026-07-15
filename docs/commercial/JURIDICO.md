# JURIDICO — Auditoria Jurídica e Comercial

**Documento:** Verificação de preparo jurídico do SimulaPro para venda no Brasil
**Data:** 2026-07-15
**Papel assumido:** Auditor Jurídico e Comercial — advogado especialista em Direito Digital, LGPD, E-commerce, SaaS e Direito do Consumidor.
**Escopo:** apenas auditoria. Nenhum código foi escrito, nenhuma arquitetura foi alterada, nenhum banco foi tocado, nenhuma funcionalidade foi criada.

---

## 0. Advertência metodológica

Este documento é uma auditoria de risco jurídico e comercial, feita com base na legislação brasileira aplicável e no estado real do produto (documentação comercial já aprovada em `01-GO_LIVE.md` a `09-ROADMAP.md`, achados técnicos de `AUDITORIA_FINAL.md`, e estado de implementação registrado em `P0_IMPLEMENTATION_PLAN.md`). **Não substitui parecer de advogado inscrito na OAB.** Antes de publicar qualquer Política de Privacidade, Termos de Uso ou Política de Reembolso com efeito contratual real, o texto final deve ser revisado por profissional habilitado — este documento indica *o que* precisa existir e *por quê*, não redige as peças finais.

---

## 1. Marco legal aplicável

| Norma | O que rege, para este produto |
|---|---|
| **LGPD — Lei 13.709/2018** | Tratamento de dados pessoais (e-mail, CPF, senha, dados de desempenho de estudo) — bases legais, direitos do titular, obrigações do controlador |
| **CDC — Lei 8.078/1990** | Relação de consumo entre SimulaPro (fornecedor) e aluno (consumidor final) — informação clara, vedação a publicidade enganosa/abusiva, direito de arrependimento, garantia legal, cláusulas abusivas |
| **Decreto 7.962/2013** | Regulamenta o CDC especificamente para comércio eletrônico — informações que devem constar antes da contratação, atendimento facilitado, confirmação imediata do recebimento da manifestação de arrependimento |
| **Marco Civil da Internet — Lei 12.965/2014** | Guarda de registros, clareza sobre coleta de dados por aplicações de internet |
| **Regulação do Banco Central para arranjos de pagamento** | Aplicável ao Asaas (instituição de pagamento autorizada), não diretamente ao SimulaPro — mas relevante para entender a divisão de responsabilidade em disputas de pagamento |
| **Entendimento consolidado de PROCONs estaduais e Senacon/MJ sobre "cancelamento facilitado"** | Não é uma lei federal única, mas uma linha de entendimento já aplicada em autuações reais: cancelamento de serviço contratado online deve ser tão fácil quanto a contratação, pelo mesmo canal |

---

## 2. Classificação consolidada

| # | Item | Classificação | Risco de não possuir |
|---|---|---|---|
| 1 | Política de Privacidade | **Obrigatório** | Alto — LGPD exige, produto já coleta e-mail/CPF/senha/dados de estudo hoje |
| 2 | Termos de Uso | **Obrigatório na prática** | Alto — sem eles, o contrato é regido só por normas supletivas do CDC, quase sempre mais favoráveis ao consumidor; SimulaPro perde a única ferramenta para normatizar propriedade intelectual, limites de responsabilidade e uso aceitável |
| 3 | Política de Cookies | **Recomendado hoje / Obrigatório quando houver analytics** | Baixo hoje (só cookies essenciais de sessão); torna-se Alto assim que qualquer cookie de analytics/marketing for implementado (`05-CHECKOUT.md` §7 já planeja isso) |
| 4 | Política de Cancelamento | **Obrigatório** | Alto — já referenciada como link no rodapé de `04-LANDING.md`, nunca redigida (gap já identificado em `AUDITORIA_FINAL.md`, AUD-09) |
| 5 | Política de Reembolso | **Obrigatório** | Muito alto — não é um diferencial comercial, é execução do direito de arrependimento do CDC Art. 49, já em vigor independentemente de qualquer decisão do SimulaPro |
| 6 | Consentimento LGPD | **Obrigatório declarar a base legal (não necessariamente "consentimento" em si)** | Médio — a maior parte do tratamento se enquadra em "execução de contrato" (Art. 7º, V), que dispensa consentimento explícito; mas isso precisa estar escrito, não presumido |
| 7 | Consentimento para e-mails | **Recomendado (obrigatório para e-mails de marketing a não-clientes)** | Médio — e-mails transacionais não exigem consentimento à parte; e-mails de reengajamento a clientes já contratados têm base legal mais confortável, mas precisam de opt-out simples (já planejado em `06-EMAILS.md`) |
| 8 | Consentimento para marketing | **Obrigatório assim que o lead magnet (`07-MARKETING.md` §2) for implementado** | Médio hoje (ainda não implementado); torna-se Alto no lançamento do lead magnet, pois captura e-mail de quem nunca foi cliente |
| 9 | Aviso de uso de cookies (banner) | **Recomendado hoje / Obrigatório quando houver cookies não essenciais** | Baixo hoje; Alto assim que analytics/pixels forem adicionados |
| 10 | Direitos do consumidor (CDC, geral) | **Obrigatório — já se aplica, não é opcional** | Altíssimo — não é um item a "criar", é o pano de fundo de toda a operação; ignorá-lo não é uma opção disponível |
| 11 | Garantia (arrependimento + vício do serviço) | **Obrigatório** | Alto — dois institutos distintos, ver seção 3.4 |
| 12 | Responsabilidade / Limitação de responsabilidade | **Recomendado, com limites legais** | Médio — pode limitar expectativa ("não garantimos aprovação"), não pode excluir responsabilidade por vício do serviço (cláusula assim seria nula, CDC Art. 51, I) |
| 13 | Propriedade intelectual | **Recomendado (forte)** | Médio — protege a curadoria/organização/comentários do Acervo contra cópia por concorrentes; questões de prova pública em si não são objeto de direito autoral do SimulaPro |
| 14 | Tratamento de dados (detalhamento LGPD) | **Obrigatório** | Alto — inclui indicar encarregado (DPO), hoje ausente de qualquer documento |
| 15 | Exclusão de conta | **Obrigatório** | Alto — direito à eliminação (LGPD Art. 18, VI), hoje sem nenhuma tela ou processo definido |
| 16 | Exportação de dados | **Obrigatório (processo pode ser manual no início)** | Médio — direito à portabilidade (LGPD Art. 18, V); atender manualmente é aceitável para o volume da Onda A, mas o processo precisa existir |
| 17 | Direitos LGPD (conjunto do Art. 18) | **Obrigatório** | Alto — acesso, correção, anonimização, eliminação, portabilidade, informação sobre compartilhamento, revogação de consentimento — tudo isso precisa estar listado e ter um canal real de exercício |

---

## 3. Detalhamento por categoria

### 3.1 Documentos contratuais e políticas (itens 1, 2, 4, 5)

**Política de Privacidade** e **Termos de Uso** não são intercambiáveis — cobrem riscos diferentes. A Política de Privacidade responde "o que fazemos com seus dados" (LGPD). Os Termos de Uso respondem "quais são as regras do contrato entre nós" (CDC + Código Civil): o que o aluno pode e não pode fazer com o Acervo, o que acontece se ele violar as regras, quem é dono do quê, e como se limita (dentro dos limites legais) a responsabilidade do SimulaPro.

**Política de Cancelamento** e **Política de Reembolso** também são coisas diferentes, mesmo que no modelo do SimulaPro (`02-PLANS.md`: acesso por ciclo, sem recorrência automática) elas colapsem em grande parte: "cancelar" deixa de significar "interromper uma cobrança recorrente" (já que ela não existirá, uma vez corrigido o gap técnico — ver seção 5) e passa a significar, na prática, apenas "pedir reembolso dentro dos 7 dias" ou "decidir não renovar ao fim do ciclo". Ainda assim, os dois processos merecem texto formal próprio, porque o CDC trata prazos e obrigações diferentes para cada um.

### 3.2 Consentimentos e avisos (itens 3, 6, 7, 8, 9)

O ponto central aqui: **nem todo tratamento de dado precisa de consentimento explícito.** A LGPD prevê 10 bases legais (Art. 7º), e "execução de contrato" cobre a maior parte do que o SimulaPro já faz hoje (autenticação, processamento de pagamento, entrega do serviço, dados de desempenho de estudo). Pedir consentimento para tudo, inclusive o que já está coberto por execução de contrato, é prática comum mas desnecessária e às vezes contraproducente (gera fricção sem reduzir risco real). O que precisa, sim, de consentimento (ou de uma base legal alternativa clara e defensável) é:

- Uso de dados para **marketing a quem ainda não é cliente** (o lead magnet de `07-MARKETING.md`).
- Uso de **cookies não essenciais** (analytics, pixels de anúncio) — aqui a LGPD e o entendimento de mercado já convergem para exigir consentimento prévio, não apenas aviso.

E-mails de reengajamento a quem **já é cliente** (`06-EMAILS.md`, fluxos 4.9 a 4.14) têm uma base legal mais confortável (execução de contrato / legítimo interesse do próprio serviço contratado), mas a boa prática — já prevista em `06-EMAILS.md` §1 ("toda comunicação de reengajamento oferece uma saída clara") — precisa estar formalizada na Política de Privacidade, não apenas na intenção de copy.

### 3.3 Direitos do consumidor (item 10)

Este não é um item que se "resolve" com um documento — é o regime jurídico que já governa toda a operação, quer o SimulaPro documente isso ou não. Os pontos mais relevantes para este produto especificamente:

- **CDC Art. 6º, III** — direito à informação clara e adequada sobre o serviço, preço e condições. `08-FAQ.md` já cumpre isso com rigor incomum (a disciplina de "nunca prometer o que o produto não entrega hoje" é, na prática, exatamente o que este artigo exige).
- **CDC Art. 37** — vedação à publicidade enganosa (inclusive por omissão) e abusiva. O risco mais concreto aqui está descrito na seção 5: comunicar "sem cobrança automática" enquanto o sistema técnico ainda cobra automaticamente seria, tecnicamente, publicidade enganosa por omissão, mesmo sem intenção.
- **CDC Art. 51** — cláusulas abusivas são nulas de pleno direito, mesmo que estejam escritas e aceitas pelo usuário. Relevante diretamente para o item 12 (limitação de responsabilidade).

### 3.4 Garantia: dois institutos diferentes (item 11)

Vale destacar porque os documentos comerciais (`03-PRICING.md`, `08-FAQ.md`) tratam a garantia de 7 dias como um diferencial comercial gentil — juridicamente, ela é duas coisas sobrepostas:

1. **Direito de arrependimento (CDC Art. 49)** — incondicional, para qualquer compra feita fora do estabelecimento físico (inclui compras online). O prazo de 7 dias corridos e a devolução integral e **imediata** dos valores pagos, monetariamente atualizados, não são uma cortesia do SimulaPro — são uma obrigação legal preexistente. O SimulaPro **não poderia oferecer menos do que isso** mesmo se quisesse.
2. **Garantia legal contra vício do serviço (CDC Art. 18 a 25)** — se o Acervo tiver um erro grave (ex.: gabarito incorreto, questão duplicada, indisponibilidade prolongada do sistema), o aluno tem direito à reparação **independente do prazo de 7 dias**, dentro do prazo decadencial de 90 dias para vício aparente em serviços (Art. 26, II). Isso não está tratado em nenhum dos 9 documentos comerciais — o FAQ e o Checkout falam apenas do arrependimento comercial, nunca do vício de serviço. **Recomenda-se que a Política de Reembolso trate os dois institutos separadamente**, para não dar a entender que passados 7 dias o aluno perdeu qualquer direito de reclamar de um problema real no produto.

### 3.5 Propriedade intelectual e responsabilidade (itens 12, 13)

O Acervo é composto por questões de provas oficiais de bancas públicas — o **texto original da questão**, em geral, não é protegido por direito autoral do SimulaPro (é produção de banca/órgão público). O que **é** propriedade intelectual do SimulaPro é a curadoria: classificação por disciplina/assunto/banca/ano, explicações escritas, organização do Acervo, e o software em si. Sem um Termo de Uso que deixe isso explícito, o SimulaPro não tem uma base contratual clara para impedir um aluno de copiar e redistribuir o Acervo organizado (ex.: revender a um concorrente) — hoje esse risco não está coberto por nenhum documento.

Sobre limitação de responsabilidade: é lícito e recomendável deixar claro que o SimulaPro **não garante aprovação em concurso** (`08-FAQ.md` já evita essa promessa na comunicação) — isso é gerenciamento de expectativa, não uma cláusula abusiva. O que **não é lícito** é uma cláusula que tente excluir a responsabilidade do SimulaPro por vício real do serviço (erro de gabarito, indisponibilidade do sistema) — isso seria nulo por força do Art. 51, I do CDC, mesmo que o aluno "aceite" os termos.

### 3.6 LGPD operacional (itens 14, 15, 16, 17)

Quatro pontos que operações pequenas costumam esquecer, e que não aparecem em nenhum dos 9 documentos comerciais nem no `P0_IMPLEMENTATION_PLAN.md`:

- **Encarregado (DPO) — LGPD Art. 41.** A lei não exige um profissional dedicado — numa operação de uma pessoa (`01-GO_LIVE.md`), o próprio fundador pode ser o encarregado. Mas precisa haver um canal de contato identificável para essa função, hoje inexistente.
- **Exclusão de conta.** Direito à eliminação (Art. 18, VI) — hoje não existe tela nem processo definido. É a mesma classe de lacuna operacional já identificada para "esqueci minha senha" (`06-EMAILS.md` §0) — pode começar manual, mas precisa de um caminho real e um prazo de atendimento razoável.
- **Exportação/portabilidade de dados.** Direito à portabilidade (Art. 18, V) — pode ser atendido manualmente (extrair um arquivo com o histórico de estudo do aluno mediante pedido) sem exigir uma funcionalidade de self-service no lançamento.
- **Canal para exercício de direitos do titular.** Todos os direitos acima (acesso, correção, eliminação, portabilidade, informação, revogação, oposição) precisam de um canal declarado — que hoje **depende do mesmo canal de suporte que ainda não foi formalizado** (`05-CHECKOUT.md` §10.4, `06-EMAILS.md` §0, e AUD-07 de `AUDITORIA_FINAL.md`).

---

## 4. Pagamentos — análise dedicada

### 4.1 Asaas como instituição de pagamento

O Asaas é uma instituição de pagamento autorizada a funcionar pelo Banco Central — isso é positivo para o SimulaPro em dois sentidos: (a) reduz a exposição a normas de PCI-DSS, já que o SimulaPro nunca processa nem armazena dado de cartão diretamente (confirmado no código: o número do cartão nunca passa pelos servidores do SimulaPro); (b) transfere para um agente regulado a liquidação técnica dos pagamentos.

Isso **não** exime o SimulaPro de responsabilidade perante o consumidor. Pelo CDC (Art. 7º, parágrafo único, e Art. 25, §1º), fornecedores de uma mesma cadeia de consumo respondem solidariamente por defeitos na prestação do serviço — se um reembolso demorar ou falhar por uma falha de integração entre SimulaPro e Asaas, o aluno pode acionar o SimulaPro diretamente, independentemente de a causa técnica estar "do lado do gateway".

### 4.2 PIX

Liquidação instantânea, regulada pelo Banco Central. Risco jurídico direto baixo. O risco real é operacional-reputacional: se a liberação de acesso não for imediata após a confirmação (hoje é, via webhook — confirmado em `05-CHECKOUT.md`), isso gera reclamação por quebra de expectativa de "informação clara" (CDC Art. 6º, III), não um risco jurídico autônomo do meio de pagamento em si.

### 4.3 Cartão de crédito e chargeback

Este é o ponto de maior interseção entre risco jurídico e risco técnico já mapeado em `AUDITORIA_FINAL.md` (AUD-01) e `P0_IMPLEMENTATION_PLAN.md` (Sprint P0.3, ainda não implementada nesta data). Chargeback (contestação pelo titular do cartão junto ao emissor) não é regulado diretamente pelo CDC — é regido pelas regras de bandeira (Visa, Mastercard) e pelo contrato entre Asaas e sua adquirente. Mas o risco **comercial e jurídico combinado** é concreto:

- Enquanto a recorrência automática do Asaas não for neutralizada (`AUDITORIA_FINAL.md`, AUD-01), **todo aluno será cobrado automaticamente no ciclo seguinte sem ter dado uma nova manifestação de vontade para isso**. Uma cobrança recorrente que o consumidor não reconhece como autorizada é a causa mais comum e mais defensável de chargeback — e, sob a ótica do CDC, pode ser enquadrada no **Art. 39, III**, que veda ao fornecedor "enviar ou entregar ao consumidor, sem solicitação prévia, qualquer produto, ou fornecer qualquer serviço" — um novo ciclo de acesso cobrado sem nova ação do aluno é, na prática, um serviço não solicitado.
- Taxas de chargeback acima de limiares definidos pelas bandeiras podem levar a adquirente a suspender ou encerrar a conta de recebimento do lojista — um risco operacional que se soma ao jurídico.
- **Conclusão prática:** a Sprint P0.3 do plano de implementação não é apenas uma correção de UX ou de honestidade comercial — é a correção que evita a única causa previsível e sistemática de chargeback em massa deste produto. Isso eleva a prioridade jurídica desse item ao mesmo patamar da prioridade técnica já atribuída (P0-A).

### 4.4 Boleto

Compensação de 1 a 3 dias úteis, já comunicada. Risco jurídico baixo, desde que a comunicação continue deixando claro que o acesso só libera após confirmação — o que já é o caso na cópia aprovada (`06-EMAILS.md`, `08-FAQ.md`).

### 4.5 Cancelamento

Enquanto a recorrência automática não for neutralizada (AUD-01), existe, tecnicamente, uma assinatura recorrente de fato — e o SimulaPro não oferece hoje um botão de cancelamento self-service (`05-CHECKOUT.md` §10.4). Há uma linha de entendimento consolidada entre PROCONs estaduais (e o próprio Senacon) de que o cancelamento de um serviço contratado online deve ser **tão fácil quanto a contratação**, preferencialmente pelo mesmo canal digital — dificultar deliberadamente o cancelamento (exigir ligação telefônica, múltiplas etapas, ausência de canal digital) já foi objeto de autuação em outros setores (assinaturas de streaming, academias, planos de telefonia). Uma vez que a recorrência for neutralizada (o que elimina a necessidade de "cancelar" no sentido clássico), esse risco praticamente desaparece — outro motivo para tratar a Sprint P0.3 como prioritária também do ponto de vista jurídico.

### 4.6 Reembolso

Já tratado em profundidade na seção 3.4. Do ponto de vista puramente de pagamento: hoje (`AUDITORIA_FINAL.md`, AUD-06) um reembolso processado no painel do Asaas não desativa a assinatura local automaticamente, e (AUD-07) não existe canal de suporte formalizado nem botão self-service para o aluno solicitar. Isso é, neste momento, **o item de maior risco jurídico ativo do conjunto**: o direito de arrependimento do CDC Art. 49 já existe e já está sendo publicamente prometido (`08-FAQ.md`) — prometer um direito legal e não ter musculatura operacional para cumpri-lo na prática é pior do que nunca ter mencionado, porque documenta a promessa (prova documental contra o próprio SimulaPro em uma eventual reclamação) sem o processo por trás.

### 4.7 Renovação

Sem recorrência automática, a "renovação" torna-se uma nova contratação voluntária — o que é, na prática, a postura mais conservadora e mais segura juridicamente possível (elimina de saída a maior parte dos riscos de "cobrança não solicitada"). O risco jurídico aqui é inteiramente **enquanto a implementação não reflete a promessa**: ver seção 4.3.

### 4.8 Plano Fundador — 6 meses, R$149,90, 50 vagas

Preço fixo e ciclo de 6 meses definidos (`P0_IMPLEMENTATION_PLAN.md`, Sprint P0.1, decisão aprovada em 2026-07-14) não geram risco jurídico em si — é uma condição comercial lícita. O ponto de atenção é a **veracidade da escassez**: `04-LANDING.md` promete "vagas limitadas e reais" como argumento central de não usar "urgência artificial". Isso só se sustenta juridicamente (CDC Art. 37, §1º veda publicidade enganosa por promessa de escassez falsa) se o teto de 50 vagas for **efetivamente controlado e respeitado** — ou seja, se a 51ª venda sob o rótulo "Plano Fundador" não acontecer. Hoje não há, em nenhum dos documentos técnicos revisados, um mecanismo que impeça a 51ª venda automaticamente (o `COMMERCIAL_PLANS` configurado na Sprint P0.2 não tem controle de teto embutido) — isso é uma lacuna operacional que, se ignorada, transformaria uma alegação de escassez real em uma alegação de escassez falsa na prática, mesmo que não tenha sido essa a intenção.

### 4.9 Sem recorrência automática

Do ponto de vista regulatório, esta é uma decisão que **antecipa** uma tendência já em curso no Brasil: diversas iniciativas (normas de PROCON-SP, entendimentos do Senacon, e propostas legislativas em tramitação) já convergem para exigir consentimento renovado e cancelamento facilitado em assinaturas recorrentes — na linha do que ficou conhecido informalmente como "lei do cancelamento fácil" em outras jurisdições. Um modelo "sem recorrência automática", **uma vez efetivamente implementado**, coloca o SimulaPro em conformidade voluntária adiantada — um diferencial jurídico genuíno, não apenas de marketing. **Mas, até a Sprint P0.3 ser concluída, é o oposto**: o sistema real faz precisamente o que a comunicação pública já promete que não faz.

---

## 5. Cruzamento com o estado técnico real

Esta auditoria jurídica não parte do zero — ela herda o estado técnico já mapeado em `AUDITORIA_FINAL.md` e o progresso registrado em `P0_IMPLEMENTATION_PLAN.md`. Nesta data, apenas a **Sprint P0.2** (configuração de `COMMERCIAL_PLANS`) foi concluída. Isso muda a leitura de risco jurídico dos itens de pagamento:

| Bloqueador técnico (nomenclatura de `AUDITORIA_FINAL.md`) | Status nesta data | Dimensão jurídica que se soma à comercial |
|---|---|---|
| AUD-01 — recorrência Asaas não neutralizada | Pendente (Sprint P0.3 não iniciada) | Risco de enquadramento no CDC Art. 39, III (serviço não solicitado) a cada ciclo cobrado sem nova ação do aluno |
| AUD-06 — reembolso/chargeback não tratado no webhook | Pendente (Sprint P0.4 não iniciada) | Risco direto de descumprimento do CDC Art. 49 (devolução deve ser imediata) |
| AUD-07 — sem canal de cancelamento/suporte formalizado | Pendente (Sprint P0.5 não iniciada) | Mesmo canal serviria para exercício de direitos LGPD (itens 15–17 desta auditoria) — é uma única lacuna operacional com duas dimensões de risco (consumidor + proteção de dados) |
| AUD-04 — 80 questões órfãs | Pendente (Sprint P0.6 não iniciada) | Risco de publicidade enganosa (CDC Art. 37) enquanto "1.000 questões" for anunciado publicamente sem as 80 estarem de fato acessíveis |
| AUD-05 — cargo duplicado | Pendente (Sprint P0.7 não iniciada) | Sem dimensão jurídica direta — risco puramente operacional/de dados |

**Implicação prática:** nenhuma das lacunas jurídicas identificadas nesta auditoria (Política de Privacidade, Termos de Uso, Política de Reembolso, canal de exercício de direitos LGPD) pode ser resolvida só com texto — três delas (reembolso, cancelamento, exclusão/portabilidade de dados) dependem do mesmo canal de suporte que a Sprint P0.5 já havia identificado como pendência técnica. Isso significa que a Sprint P0.5, além de resolver um bloqueador comercial, é também a sprint que abre caminho para o cumprimento de obrigações LGPD que hoje não têm nenhum canal de exercício.

---

## 6. Síntese — o que impede uma venda juridicamente segura

### Bloqueadores diretos (equivalente jurídico de P0)

1. **Política de Privacidade** — inexistente, obrigatória, o produto já trata dados pessoais hoje.
2. **Termos de Uso** — inexistente, necessário para propriedade intelectual e limitação lícita de responsabilidade.
3. **Política de Reembolso formalizada** — o direito já existe (CDC Art. 49) independentemente do texto, mas sem documento + processo operacional (que depende de AUD-06/AUD-07 do plano técnico), o risco de descumprimento é ativo desde a primeira venda.
4. **Canal de exercício de direitos do titular de dados (LGPD)** — hoje inexistente; converge com a mesma pendência operacional da Sprint P0.5.
5. **Neutralização da recorrência automática do Asaas (AUD-01)** — já era P0 técnico; esta auditoria acrescenta que também é, potencialmente, uma prática vedada pelo CDC Art. 39, III enquanto não corrigida.

### Recomendado antes do Hard Launch, não bloqueia o Soft Launch

- Política de Cookies (hoje só cookies essenciais).
- Aviso de cookies (banner) — mesma lógica.
- Consentimento formal para o lead magnet (`07-MARKETING.md`) — só quando esse fluxo for implementado.
- Cláusula de propriedade intelectual detalhada nos Termos de Uso.
- Indicação formal de encarregado (DPO) — pode ser o próprio fundador, mas precisa estar escrito.
- Mecanismo de controle de teto de vagas do Plano Fundador (50), para que a promessa de escassez real em `04-LANDING.md` permaneça verdadeira à medida que as vendas ocorrem.

---

## 7. Fechamento

O SimulaPro está bem posicionado do ponto de vista de **intenção** — a disciplina de honestidade já presente em `04-LANDING.md`, `06-EMAILS.md` e `08-FAQ.md` (nunca prometer o que o produto não entrega, nunca usar urgência artificial) é, por si só, mais alinhada ao espírito do CDC do que a prática comum de mercado. O risco real não está na estratégia comercial — está, mais uma vez, na mesma distância já identificada em `AUDITORIA_FINAL.md`: entre o que já foi decidido e prometido, e o que já foi de fato implementado e documentado juridicamente. Nenhum dos itens obrigatórios listados aqui (Política de Privacidade, Termos de Uso, Política de Reembolso, canal de direitos LGPD) tem, hoje, um documento correspondente — e três dos cinco bloqueadores diretos desta auditoria dependem da mesma pendência operacional (canal de suporte único) já identificada como Sprint P0.5 do plano técnico.

---

*Fim da auditoria jurídica. Nenhum outro documento foi modificado. Nenhum código foi escrito. Recomenda-se revisão por advogado inscrito na OAB antes da redação final e publicação de qualquer peça contratual (Política de Privacidade, Termos de Uso, Política de Reembolso).*
