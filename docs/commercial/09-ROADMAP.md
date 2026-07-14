# 09 — ROADMAP

**Fase:** 7 — Comercial (documento final)
**Documento:** Evolução pós-lançamento do SimulaPro, condicionada a evidência real
**Data:** 2026-07-09
**Pré-requisitos:** `01-GO_LIVE.md` a `08-FAQ.md` (aprovados)

---

## 0. Regra que governa todo este documento

Nenhum item abaixo entra por entusiasmo. Cada funcionalidade, melhoria ou expansão só é elegível para uma fase se houver (ou houver um critério explícito para gerar) pelo menos um destes tipos de evidência:

- **Feedback direto** de alunos reais (suporte, `06-EMAILS.md` fluxo de 30 dias sem estudar, respostas a pesquisa).
- **Métrica de produto** (uso, conclusão de sessão, retorno).
- **Retenção** (renovação ou não ao fim do ciclo).
- **Receita** (capacidade real de financiar a próxima etapa).
- **Impacto comercial comprovado**, não estimado.

Onde não houver evidência suficiente, o item permanece em "Longo Prazo" com a pergunta em aberto do que precisaria ser verdade primeiro — nunca promovido por antecipação otimista.

### Categorias (usadas para marcar cada item ao longo do documento)

| Categoria | Definição |
|---|---|
| **Correção** | Resolve algo que já está errado hoje (bug, gap, divergência entre decisão aprovada e implementação real) |
| **Melhoria** | Aprimora algo que já existe e já funciona, com base em uso real |
| **Nova funcionalidade** | Capacidade que não existe hoje, validada por dado antes de ser construída |
| **Expansão** | Novo cargo/curso dentro do mesmo mercado (Brasil, concursos públicos) |
| **Novo mercado** | Expansão geográfica ou de público fundamentalmente diferente do atual |

---

## 1. Soft Launch

Esta etapa não é "depois do lançamento" — é o próprio lançamento (`01-GO_LIVE.md`, Ondas A; `07-MARKETING.md`, Fases 1–3). Está aqui porque é o ponto de partida de todo o resto do roadmap: nada em V1.1 em diante existe sem o que se aprende aqui.

- **Objetivo:** validar que um estranho paga, usa e não se arrepende — gerar a primeira evidência real do produto inteiro.
- **Pré-requisitos:** todos os itens do Bloco 0 de `01-GO_LIVE.md` **e** o gap P0 de `05-CHECKOUT.md` (recorrência do Asaas não neutralizada) resolvidos — nenhuma venda real acontece com essas pendências abertas.
- **Funcionalidades incluídas — todas Correção, nenhuma Nova funcionalidade:**
  - Correção das questões com `package_version_id` nulo (`01-GO_LIVE.md`)
  - Resolução da duplicidade de cargo "Técnico em Enfermagem"/"Técnico de Enfermagem" (`01-GO_LIVE.md`) — pré-requisito também da seção 6.1 deste documento
  - Neutralização da recorrência automática do Asaas (`05-CHECKOUT.md`, seção 10.1) — P0
  - Configuração do Plano Fundador em `COMMERCIAL_PLANS` (`05-CHECKOUT.md`)
- **Justificativa:** sem essas correções, qualquer dado gerado nesta fase estaria contaminado (ex.: medir retenção com um bug de conteúdo invisível, ou vender um produto que cobra diferente do prometido).
- **Riscos:** tentação de pular direto para aquisição maior por pressa — `01-GO_LIVE.md`, risco nº 4, já nomeia isso.
- **Critério de entrada:** Bloco 0 e P0 resolvidos, checklist de homologação de `05-CHECKOUT.md` (seção 8) cumprido.
- **Critério de saída:** critérios de sucesso de `01-GO_LIVE.md`, seção 5, atingidos em pelo menos 4 de 5 indicadores, com 100 alunos pagantes reais (`07-MARKETING.md`, Fase 3).

---

## 2. V1.1

- **Objetivo:** corrigir, com dado real do Soft Launch em mãos, as fricções que a validação revelou — não adicionar capacidade nova ainda.
- **Pré-requisitos:** Soft Launch concluído com critério de saída atingido; pelo menos um ciclo completo de acesso já vivido por um grupo de alunos (para ter dado de renovação real, não projetado).
- **Funcionalidades candidatas:**
  - **[Correção]** Direcionamento automático do dashboard (`/app`) para `/app/subscription` quando não há assinatura ativa — gap já identificado em `05-CHECKOUT.md`, seção 3.3, mas só entra em V1.1 (não antes) porque sua urgência real só se confirma se o dado do Soft Launch mostrar abandono nesse ponto específico do funil.
  - **[Correção]** Botão de cancelamento self-service em "Minha Assinatura" (`05-CHECKOUT.md`, seção 10.4) — condicionado a volume real de pedidos de reembolso/cancelamento que justifiquem tirar isso do atendimento manual.
  - **[Correção]** Tratamento de `PAYMENT_REFUNDED` e chargeback no webhook (`05-CHECKOUT.md`, seção 10.2) — condicionado a pelo menos um caso real ter acontecido e exposto o gap na prática, ou a volume que torne o monitoramento manual insustentável.
  - **[Melhoria]** Ajustes de copy na Landing/FAQ com base nas objeções reais mais recorrentes no suporte durante o Soft Launch (`08-FAQ.md`, seção 16 — o padrão de resposta a objeções não mapeadas já prevê isso).
  - **[Nova funcionalidade, condicional]** Painel mínimo de Admin para visão de pagamentos/logs (`05-CHECKOUT.md`, seção 6) — só entra se o volume de assinaturas tornar a consulta manual via SQL/painel do Asaas operacionalmente insustentável, não por "seria mais profissional ter".
- **Justificativa:** cada item acima resolve algo que o próprio Soft Launch expôs — nenhum é hipótese.
- **Riscos:** tratar V1.1 como "hora de adicionar o que ficou de fora do V1" por vontade, não por dado — a disciplina da seção 0 vale igualmente aqui.
- **Critério de entrada:** Soft Launch encerrado com dado de pelo menos um ciclo de renovação real.
- **Critério de saída:** taxa de reembolso/cancelamento estabilizada abaixo do limiar definido em `01-GO_LIVE.md`, seção 5; funil de aquisição (`07-MARKETING.md`) com pelo menos um canal orgânico validado além de indicação pessoal.

---

## 3. V1.2

- **Objetivo:** aprofundar retenção e eficiência de aquisição com base em um segundo ciclo de dado (não apenas o primeiro, que pode ter ruído de novidade).
- **Pré-requisitos:** V1.1 concluído; dado de pelo menos duas janelas de renovação (para distinguir padrão real de ruído de uma única amostra).
- **Funcionalidades candidatas:**
  - **[Melhoria]** Ampliação de cobertura de disciplinas com menor densidade de questões (`01-GO_LIVE.md` já identificou desigualdade entre disciplinas) — priorizada pelas disciplinas que o feedback qualitativo (`06-EMAILS.md`, fluxo 30 dias sem estudar) apontar como motivo real de abandono, não por ordem alfabética ou achismo editorial.
  - **[Nova funcionalidade, condicional]** Programa de indicação formalizado com rastreamento de cupom (`03-PRICING.md`, seção 10; `07-MARKETING.md`, seção 1) — condicionado a confirmação técnica de que o fluxo de pagamento suporta atribuição, e a volume de indicações espontâneas já observado no Soft Launch/V1.1 que justifique formalizar o que já está acontecendo organicamente.
  - **[Melhoria]** Segunda faixa de preço (`03-PRICING.md`, seção 7 — reavaliação da faixa Premium) — só se houver depoimentos reais publicáveis, cobertura de conteúdo mais equilibrada, e dado de retenção que sustente a alegação de valor superior.
  - **[Correção, condicional]** Revisão da política de garantia/reembolso se a taxa real observada divergir da faixa esperada em `03-PRICING.md`, seção 11.
- **Justificativa:** todos os itens dependem de um segundo ponto de dado, não do primeiro isolado — evita decisão por amostra pequena.
- **Riscos:** confundir "o produto está estável" com "está na hora de crescer o escopo" — a pergunta certa continua sendo "o dado pede isso?", não "já faz tempo que lançamos".
- **Critério de entrada:** duas janelas de renovação observadas, com retenção mensurada de forma consistente entre elas.
- **Critério de saída:** retenção e CAC estáveis o suficiente para justificar investimento em algo estruturalmente novo (não apenas correção/melhoria) — é o gatilho de entrada para V2.

---

## 4. V2

- **Objetivo:** primeira mudança estrutural real desde o lançamento — expandir a superfície do produto (segundo cargo, possivelmente segunda estrutura de plano), não apenas corrigir/melhorar o que existe.
- **Pré-requisitos:** V1.2 concluído; receita e retenção comprovadas suficientes para financiar a produção editorial de um segundo cargo sem sacrificar a qualidade do primeiro (`01-GO_LIVE.md` já registrou o risco de profundidade rasa por disciplina — abrir um segundo cargo antes de resolver isso no primeiro repetiria o mesmo erro em dobro).
- **Funcionalidades candidatas:**
  - **[Expansão]** Técnico de Enfermagem como segundo cargo — ver análise dedicada na seção 6.1.
  - **[Nova funcionalidade, condicional]** Múltiplos planos de acesso (ex.: prazos diferentes) — só se `02-PLANS.md`, seção 13, tiver seus critérios de revisão atendidos (banco mais equilibrado, dado de retenção suficiente, volume de tráfego para testar).
  - **[Nova funcionalidade, condicional]** Aplicativo mobile — ver análise dedicada na seção 6.4; entra em V2 só se a evidência exigida already existir a essa altura, não por calendário.
- **Justificativa:** V2 é a primeira fase onde "crescer o produto" (não só consertá-lo) é uma aposta razoável, porque há duas fases inteiras de dado real sustentando a decisão.
- **Riscos:** o maior risco desta fase é justamente o oposto do risco das fases anteriores — em vez de "adicionar por entusiasmo", o risco é "não expandir por medo", travando o crescimento mesmo com dado favorável. Este documento não recomenda cautela infinita — recomenda decisão condicionada a critério, nas duas direções.
- **Critério de entrada:** critério de saída de V1.2 atingido.
- **Critério de saída:** segundo cargo (Técnico de Enfermagem, se essa for a expansão escolhida) com seu próprio ciclo de validação repetindo o modelo do Soft Launch (seção 1) — V2 não termina até o segundo produto também estar validado, não apenas lançado.

---

## 5. Longo Prazo

Itens que exigem evidência que hoje simplesmente não existe, e que só entram em uma fase concreta quando essa evidência aparecer. Não têm prazo — têm condição.

- **Objetivo:** manter registrado o que está sendo conscientemente adiado, e por qual critério exato, para que "queremos fazer isso" nunca vire "vamos fazer isso" sem a evidência correspondente.
- **Pré-requisitos:** variam por item — ver seção 6.
- **Funcionalidades candidatas:** Outras áreas da saúde, Portugal, IA, Gamificação, Comunidade, Ranking — todos analisados individualmente na seção 6, nenhum com data prevista.
- **Justificativa:** existe para não perder itens relevantes de vista, mas sem fingir um cronograma que a empresa não pode prever honestamente hoje.
- **Riscos:** o risco desta seção é puramente de comunicação — se apresentada externamente sem o contexto condicional, "Longo Prazo" soa como promessa. Qualquer comunicação pública deste roadmap (se houver) precisa preservar a condicionalidade, não just listar os itens como certos.
- **Critério de entrada / saída:** não aplicável como fase única — cada item tem seu próprio critério, descrito na seção 6.

---

## 6. Expansões — análise item a item

### 6.1 Técnico de Enfermagem

- **Por que fazer:** já é o segundo público declarado desde o início do projeto (contexto da Fase 7); a taxonomia de Enfermagem já compartilha grande parte da árvore de disciplinas com o cargo Técnico, reduzindo o custo marginal de produção editorial comparado a um curso totalmente novo.
- **Quando fazer:** em V2 (seção 4), depois que o cargo Enfermeiro tiver retenção e receita comprovadas por dois ciclos — nunca antes, porque diluir esforço editorial entre dois cargos antes de o primeiro estar maduro repete o risco de conteúdo raso já identificado em `01-GO_LIVE.md`.
- **O que precisa existir antes:** (1) resolver a duplicidade de cargo "Técnico em Enfermagem"/"Técnico de Enfermagem" já presente na taxonomia (`01-GO_LIVE.md`, Bloco 0 — pré-requisito também do Soft Launch, não só desta expansão); (2) Acervo real de questões de provas de Técnico de Enfermagem produzido (as 1.000 questões atuais são do cargo Enfermeiro); (3) sinal de demanda real — perguntas de suporte ou de FAQ (`08-FAQ.md`, seção 13) pedindo essa cobertura já são o tipo de evidência que contaria aqui.

### 6.2 Outras áreas da saúde (ex.: Fisioterapia, Farmácia, Odontologia)

- **Por que fazer:** amplia o mercado endereçável além de Enfermagem — mas isso tensiona diretamente o argumento central de posicionamento que sustenta toda a Fase 7 (`03-PRICING.md`, `04-LANDING.md`: especialização em Enfermagem é a vantagem competitiva contra concorrentes multi-carreira). Adicionar áreas cedo demais dilui exatamente o que diferencia o produto.
- **Quando fazer:** só depois que o modelo "um curso, produção editorial especializada, retenção comprovada" estiver validado em pelo menos dois cargos dentro de Enfermagem (Enfermeiro + Técnico) — a prova de que o modelo replica precisa vir de dentro do mesmo nicho antes de replicar para um nicho diferente.
- **O que precisa existir antes:** receita e estrutura operacional suficientes para financiar um segundo *nicho* como um produto praticamente novo (não reaproveita taxonomia nem Acervo) sem canibalizar o investimento em Enfermagem.

### 6.3 Portugal

- **Por que fazer:** mencionado desde o início como direção de longo prazo — mas concursos públicos em Portugal têm estrutura de bancas, editais e legislação completamente diferente do Brasil; não é tradução, é um produto de conteúdo novo.
- **Quando fazer:** só após V2 consolidado no Brasil, e apenas com pesquisa de mercado real prévia (hoje inexistente) confirmando demanda — `PAYMENT_GATEWAY_ARCHITECTURE_V1.md` já registra que o gateway atual (Asaas) é uma escolha específica para o mercado brasileiro, e uma expansão internacional reabriria a decisão de gateway (Stripe, já cogitado e adiado exatamente para este cenário).
- **O que precisa existir antes:** pesquisa de mercado sobre concursos de enfermagem em Portugal; taxonomia e Acervo completamente novos para a legislação/bancas portuguesas; decisão de gateway de pagamento internacional.

### 6.4 Aplicativo mobile

- **Por que fazer:** só se houver evidência real de que a experiência via navegador móvel (já suportada hoje, conforme `08-FAQ.md`, seção 12) está gerando fricção mensurável — nunca porque "aplicativo é mais profissional".
- **Quando fazer:** condicionado a dado, não a fase fixa — poderia teoricamente entrar em V1.1 se o dado aparecesse cedo, ou nunca, se o navegador continuar suficiente.
- **O que precisa existir antes:** dados reais de uso mobile via navegador (proporção de sessões, taxa de conclusão comparada a desktop) mostrando fricção específica que uma melhoria de responsividade não resolveria — o app nativo é a última opção depois de esgotar alternativas mais baratas (PWA, ajustes de UI), não a primeira.

### 6.5 IA

- **Por que fazer:** hoje, explicitamente fora de escopo em todos os documentos anteriores desta fase (`02-PLANS.md`, `04-LANDING.md`) — a única justificativa aceitável seria resolver um problema real e específico já mapeado (ex.: acelerar classificação editorial de novas questões, hoje manual), não "ter IA" como recurso genérico de produto.
- **Quando fazer:** só depois que o processo editorial manual (Taxonomy/Editorial Engine) tiver volume e maturidade suficientes para que automatizar uma parte dele tenha retorno mensurável — automatizar um processo ainda instável ou de baixo volume tende a gerar mais erro que economia.
- **O que precisa existir antes:** processo editorial manual homologado e estável, volume de conteúdo grande o suficiente para justificar automação, e um caso de uso específico e mensurável (não "IA" como categoria).

### 6.6 Gamificação

- **Por que fazer:** descartada explicitamente em `02-PLANS.md` para a V1. Só reconsiderar se o feedback qualitativo de churn (`06-EMAILS.md`, fluxo "30 dias sem estudar", que captura o motivo real de abandono) apontar consistentemente para falta de engajamento/motivação como causa — não presumir isso sem esse dado específico.
- **Quando fazer:** nunca antes de haver esse padrão consistente nas respostas reais coletadas.
- **O que precisa existir antes:** volume suficiente de respostas ao fluxo de reengajamento de 30 dias apontando motivação como causa recorrente de abandono, distinta de outras causas já mais prováveis (preço, profundidade de conteúdo, mudança de rotina).

### 6.7 Comunidade

- **Por que fazer:** tem racional de negócio diferente de gamificação — efeito de rede pode reduzir CAC via indicação orgânica (`07-MARKETING.md`, seção 1). Mas exige moderação e manutenção contínuas, custo real para uma operação pequena.
- **Quando fazer:** só com massa crítica de alunos reais (uma comunidade de 20 a 100 pessoas isoladas não tem vida própria) — plausivelmente V2 ou depois, nunca no Soft Launch/V1.1.
- **O que precisa existir antes:** volume de alunos ativos suficiente para sustentar interação orgânica, e capacidade operacional (tempo ou pessoa dedicada) para moderar — sem isso, uma comunidade abandonada é pior para a marca do que não ter comunidade nenhuma.

### 6.8 Ranking

- **Por que fazer:** descartado explicitamente em `02-PLANS.md`. Risco assimétrico real: pode motivar quem está bem posicionado e desmotivar quem está mal posicionado — o oposto do efeito de retenção desejado para uma parcela dos usuários.
- **Quando fazer:** mesma condição de evidência de gamificação (seção 6.6), com uma barra ainda mais alta por causa do risco assimétrico — e, se implementado algum dia, only como recurso opcional/opt-in, nunca exposto por padrão.
- **O que precisa existir antes:** evidência qualitativa robusta de apetite por competição no público (não presumida), e desenho que proteja quem não quer participar de efeito negativo de comparação forçada.

---

## 7. Encerramento da Fase 7

Este é o último documento da Fase 7. A sequência completa (`01-GO_LIVE.md` a `09-ROADMAP.md`) forma a arquitetura comercial oficial do SimulaPro V1 — nenhuma implementação de código, banco ou arquitetura foi feita durante toda esta fase, conforme a regra estabelecida desde `01-GO_LIVE.md`.

**Não avanço além deste documento.** Conforme instruído, aguardo uma auditoria completa de toda a documentação comercial (`docs/commercial/01-GO_LIVE.md` a `09-ROADMAP.md`) antes de qualquer início de implementação.
