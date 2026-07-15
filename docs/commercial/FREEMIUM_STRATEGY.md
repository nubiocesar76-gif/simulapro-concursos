# FREEMIUM_STRATEGY — Arquitetura Comercial Freemium do SimulaPro

**Fase:** 10 — Arquitetura Freemium
**Documento:** Projeto completo da estratégia Freemium, sem implementação
**Data:** 2026-07-15
**Escopo:** apenas documentação e arquitetura. Nenhum código foi escrito, nenhum arquivo do sistema foi alterado, nenhum banco foi tocado.

---

## 0. Princípio norteador

**A Experiência Gratuita não é um plano gratuito.** Ela não compete com o Plano Fundador nem com o Plano Mensal — é uma demonstração controlada, de duração e escopo fixos, cujo único objetivo é permitir que um visitante experimente o produto real antes de decidir comprar. Ela não deve, em nenhuma hipótese, ser suficiente para alguém estudar de verdade para um concurso sem pagar. Todo o desenho abaixo é subordinado a essa regra — qualquer decisão que a coloque em risco (repetição ilimitada, acesso a filtros livres, histórico persistente) foi deliberadamente descartada.

**Princípio técnico complementar:** nada aqui cria um sistema paralelo. Toda a Experiência Gratuita é modelada com as mesmas tabelas, os mesmos tipos de dado e os mesmos componentes já usados pelo Plano Fundador — apenas configurados de um jeito diferente (seção 9 detalha exatamente onde).

---

## 1. Experiência Gratuita — definição completa

| Pergunta | Resposta | Justificativa |
|---|---|---|
| Quantas questões? | **20 questões** | Suficiente para gerar uma sensação real de uso (não um teaser de 3 perguntas), insuficiente para substituir a compra — menos de 3% do Acervo total |
| É uma prova completa? | **Não.** É uma seleção curada de 20 questões extraídas de uma única prova oficial real (seção 2) | Uma prova completa (59 questões) already entregaria volume próximo do que planos pagos oferecem por sessão — descaracterizaria a demonstração |
| Pode repetir? | **Não.** Uma única sessão demo por conta, para sempre | Repetição ilimitada transformaria a demo em um plano gratuito de fato, mesmo sem dizer isso |
| Pode revisar? | **Parcial.** Vê o gabarito e a explicação de cada questão dentro da própria sessão (já é o comportamento padrão do modo Estudo), mas não tem acesso à Central de Revisão (favoritos/erradas entre sessões) | A revisão *dentro* da sessão já demonstrado o valor pedagógico do produto; a Central de Revisão é benefício de quem já tem histórico contínuo, que só existe para assinantes |
| Pode favoritar? | **Não** | Favoritar é uma ferramenta de gestão de estudo de médio prazo — não faz sentido para uma sessão única e não repetível |
| Pode usar filtros (banca/disciplina/assunto)? | **Não.** A sessão é pré-configurada, sem Study Builder | Dar controle total ao visitante sobre o que estudar de graça reduziria o incentivo de compra e complicaria a curadoria da demo |
| Pode acessar histórico? | **Não** — vê apenas o resultado da própria sessão demo (tela de resultados, já existente e reaproveitada tal como está) | O Histórico com filtros por período/curso/modo é um benefício de quem acumula múltiplas sessões — não se aplica a uma sessão única |
| Pode acessar Dashboard? | **Sim, uma versão dele.** Vê o card de boas-vindas e o convite à Demo (se ainda não fez) ou o resultado da Demo já feita + o card de conversão (se já fez) | O Dashboard é a porta de entrada; ele muda de conteúdo conforme o estado do usuário, mas continua sendo a mesma tela para todos |
| Pode acessar estatísticas? | **Apenas as da própria sessão demo** (aproveitamento, acertos, erros, desempenho por disciplina daquela sessão) | É exatamente o que a tela de Resultados já entrega hoje, sem nenhuma alteração — não há painel de evolução ao longo do tempo, porque não há "ao longo do tempo" numa sessão única |
| Pode usar a Central de Revisão? | **Não** | Reaproveitar erros/favoritos entre sessões pressupõe uso contínuo, que é justamente o que se vende no plano pago |
| Pode acessar o Study Builder? | **Não** | A sessão demo é pré-configurada por decisão de produto, não montada livremente pelo visitante |

---

## 2. Qual prova será utilizada — análise e escolha

Analisando `docs/seeds/questions.json` (1.000 questões, 17 provas distintas hoje classificadas), os candidatos mais fortes por volume são:

| Prova | Banca | Ano | Questões | Disciplinas |
|---|---|---|---|---|
| SEMSA Manaus, edital 002/2021 | FGV | 2021 | 108 | 16 |
| SES-DF, edital 14/2022 | — | 2022 | 95 | — |
| EBSERH Nacional, edital 01/2019 | IBFC | 2019 | 60 | — |
| EBSERH Nacional, edital 01/2023 | IBFC | 2023 | 59 | 15 |
| EBSERH Nacional, edital 3/2013 | IBFC | 2013 | 50 | — |

**Escolha: EBSERH Nacional, Edital 01/2023 (IBFC), 59 questões, 0 questões com vínculo de pacote pendente.**

**Justificativa:**
1. **Reconhecimento nacional, não regional.** EBSERH (Empresa Brasileira de Serviços Hospitalares) aplica editais simultâneos em hospitais universitários federais de múltiplos estados — é, disparadamente, o concurso de Enfermagem mais reconhecido e aspiracional do país nesse nicho, ao contrário de um edital municipal (SEMSA Manaus) ou estadual (SES-DF), que soa irrelevante para quem não é daquele estado.
2. **Banca consistente com o Acervo.** IBFC é a banca mais representada no Acervo (`01-GO_LIVE.md`: IBFC+FGV = 69% do total) — usar IBFC na demo reforça a mesma identidade de conteúdo que o aluno vai encontrar depois de comprar, sem gerar expectativa dissonante.
3. **Edição mais recente disponível.** 2023 é a edição EBSERH mais nova já classificada no Acervo — transmite atualidade.
4. **Integridade confirmada.** As 59 questões desta prova têm `package`/`packageVersion` preenchidos (nenhuma faz parte do lote de 80 órfãs identificado em `AUDITORIA_FINAL.md`) — zero risco de a demo mostrar uma questão "sumida".

**Achado que exige decisão explícita, não ignorável:** a distribuição por disciplina desta prova é fortemente concentrada em conhecimentos gerais — de 59 questões, 42 são Português, Raciocínio Lógico, Legislação do SUS e Legislação aplicada à EBSERH, e apenas 17 são conhecimentos específicos de Enfermagem (urgência e emergência, saúde do adulto/criança/mulher, administração em enfermagem, controle de infecção hospitalar, biossegurança, farmacologia, segurança do paciente, centro cirúrgico). **Selecionar as 20 questões da demo aleatoriamente dentro dessa prova sub-representaria a especialização em Enfermagem que é o próprio argumento de venda do produto.** Recomendação: a curadoria das 20 questões deve puxar deliberadamente uma proporção maior de conhecimentos específicos do que a prova original tem (sugestão: 12 específicas + 8 gerais, em vez da proporção real de ~29%/71%), mantendo a autenticidade (são questões reais, só a seleção é intencional).

---

## 3. Fluxo do usuário

```
① Landing (já existe, `/`)
    CTA: "Começar agora"
        ↓
② Cadastro (já existe, `/auth`, aba "Criar conta")
    Conta criada → trigger handle_new_user (já existente) → role "student"
    + (novo, pequena adaptação) subscription automática à distribuição Demo
        ↓
③ Dashboard (`/app`, já existe)
    Estado "ainda não fez a demo": card convidando a experimentar
        ↓
④ Sessão Demo (reaproveita StudySessionPage tal como existe)
    20 questões curadas, modo Estudo, feedback imediato por questão
        ↓
⑤ Resultado (reaproveita SessionResultsView tal como existe)
    Aproveitamento, desempenho por disciplina, mesma tela que um assinante vê
        ↓
⑥ Tela de Conversão (seção 4 — pequena adaptação da tela de Resultado ou do Dashboard)
    Oferta explícita do Plano Mensal e do Plano Fundador
        ↓
⑦ Checkout (já existe, inalterado) → Plano Mensal ou Plano Fundador
        ↓
⑧ Estudo pleno (já existe, inalterado)
```

Nenhuma etapa é escondida: o visitante sabe, antes de se cadastrar, que vai ver uma demonstração (comunicado na Landing), e sabe, ao final da demo, que precisa de um plano pago para continuar.

---

## 4. Tela de Conversão

- **Como será:** não é uma tela nova isolada — é a tela de Resultado da sessão demo (já existente, `SessionResultsView`), com uma seção adicional ao final substituindo o que hoje são as "Ações" de um assinante (Nova sessão / Revisar erros / Histórico / Dashboard, que não fazem sentido para quem não tem plano).
- **Quando aparece:** imediatamente após a finalização da sessão demo — no momento de maior engajamento (o visitante acabou de ver seu próprio desempenho), consistente com o princípio já usado no Plano Fundador de "mostrar valor antes da oferta".
- **Copy (rascunho, a validar com o restante da voz de marca já aprovada):**
  > **Isso foi só uma prévia.** Você acabou de treinar com 20 questões reais da EBSERH. O Acervo completo tem centenas de questões organizadas por banca, disciplina e assunto — e um painel que mostra exatamente onde focar.
  >
  > [Ver Plano Mensal] [Ver Plano Fundador — mais econômico]
- **CTAs:** dois botões lado a lado, nunca escondendo o Mensal atrás do Fundador (ver seção 6 sobre o risco de parecer indução) — o visitante escolhe, a diferença de preço já fala por si.

---

## 5. Plano Mensal — definição completa

| Atributo | Valor |
|---|---|
| Valor | **R$ 34,90/mês** |
| Duração do ciclo | 1 mês (`accessDurationMonths: 1`) |
| Renovação | Sem recorrência automática — mesma arquitetura já corrigida na Sprint P0.3: cada mês é uma nova compra manual |
| Cancelamento | Não se aplica no sentido clássico (não há cobrança recorrente) — o acesso simplesmente não é renovado se o aluno não comprar de novo |
| Expiração | `expires_at` = confirmação do pagamento + 1 mês, calculado localmente (mesmo mecanismo do Fundador) |
| Benefícios | Idênticos ao Plano Fundador — acesso completo ao Acervo Enfermeiro, Study Builder, Central de Revisão, Histórico, Dashboard completo |

**Por que o valor é maior que o equivalente mensal do Fundador (~R$24,98):** o Mensal existe para quem converteu pela demo mas ainda não quer se comprometer com 6 meses — a flexibilidade tem um preço maior, e essa diferença é o que torna o Fundador uma escolha racionalmente melhor para quem já decidiu continuar (ver seção 6).

---

## 6. Plano Fundador — revisão e comparação

Mantido exatamente como já configurado (`P0_IMPLEMENTATION_PLAN.md`, Sprint P0.1): R$149,90, 6 meses, ~R$24,98/mês equivalente, teto de 50 vagas (ainda sem controle técnico — ver `JURIDICO.md`/`GO_NO_GO.md`).

| | Plano Mensal | Plano Fundador |
|---|---|---|
| Preço | R$34,90/mês | R$149,90 por 6 meses (R$24,98/mês) |
| Custo em 6 meses | R$209,40 | R$149,90 |
| Economia do Fundador | — | **R$59,50 (≈28%)** |
| Vagas | Ilimitadas | Limitadas (primeira leva) |
| Benefícios | Mesmos | Mesmos |

A tela de conversão (seção 4) deve exibir essa comparação de forma explícita — é a mesma disciplina de honestidade já usada em `04-LANDING.md` (nunca esconder o cálculo que favorece o cliente).

---

## 7. Migração — Mensal → Fundador

**Como funcionará:** tecnicamente, é uma nova compra — `iniciarCheckout` já suporta isso sem nenhuma alteração, pois cada plano é uma cobrança independente vinculada à mesma distribuição de conteúdo.

**Decisão de negócio a fechar (duas opções, nenhuma implementada aqui):**
- **Opção simples (recomendada para o V1 da Freemium):** o novo `expires_at` do Fundador é calculado a partir do momento da nova confirmação (`agora + 6 meses`), independentemente de quantos dias restavam no Mensal. O aluno "abre mão" do saldo residual do Mensal em troca do desconto do Fundador. Zero lógica nova — é o mesmo cálculo já usado hoje para qualquer ativação.
- **Opção mais generosa (fora do escopo do V1, registrar como possibilidade futura):** somar o tempo restante do Mensal ao novo ciclo do Fundador (base = `MAX(agora, expires_at atual)` em vez de `agora`) — tecnicamente trivial, mas é uma peça de lógica nova que não existe hoje e que precisaria ser decidida e testada à parte.

---

## 8. Proteções contra abuso

| Risco | Proteção possível sem criar sistema novo | Limitação honesta |
|---|---|---|
| Múltiplas contas para repetir a demo | Nenhuma automática hoje — e-mail único por conta já é garantido pelo Supabase Auth, mas nada impede múltiplos e-mails da mesma pessoa | Aceito como risco residual no V1: o "prêmio" de burlar é baixo (20 questões, não um plano completo), o que reduz o incentivo real de abuso em escala |
| Repetição da demo pela mesma conta | Verificar, antes de permitir nova sessão demo, se já existe uma `study_sessions` `FINISHED` vinculada à distribuição Demo para aquele usuário — reaproveita a tabela já existente, sem nova coluna | Não impede múltiplas contas, só a mesma conta repetir |
| Bots no cadastro | Nenhuma proteção existe hoje (`auth.tsx` não tem CAPTCHA) | Risco aceito e monitorado — adicionar verificação é decisão de fase futura, não desta arquitetura |
| Fraude financeira | Não se aplica à Demo em si (não há cobrança) — o risco financeiro já é tratado pela arquitetura de pagamento existente (Asaas, webhook, chargeback parcialmente tratado na Sprint P0.4) | A Demo não introduz nenhum vetor novo de fraude financeira, só de uso indevido de conteúdo gratuito |

---

## 9. Impacto técnico — mapeamento, sem implementação

### Tabelas reutilizadas (nenhuma nova, nenhuma coluna nova)

- `content_distributions` — a Demo é uma distribuição como outra qualquer (`status = ACTIVE`).
- `package_versions` / `packages` / `courses` — a Demo referencia um `package_version` próprio, contendo apenas as 20 questões curadas (ou uma referência de filtro sobre elas — decisão de implementação, não desta fase).
- `subscriptions` — **acesso à Demo é modelado como uma `subscriptions` row comum**, criada automaticamente no cadastro, não pelo webhook do Asaas.
- `study_sessions` / `study_session_questions` — sessão demo é uma sessão como qualquer outra.
- `questions` — as 20 questões continuam sendo linhas normais da tabela, sem flag nova.

### Distribuições reutilizadas

Nenhuma distribuição de conteúdo pago é reutilizada para a Demo — é necessária uma `content_distribution` própria (nova linha de dado, não uma tabela nova), apontando para um `package_version` que contenha apenas as 20 questões curadas. Isso evita qualquer risco de a Demo, por engano, liberar acesso ao Acervo completo.

### Módulos que suportam a Demo sem nenhuma alteração

- `StudySessionPage.tsx`, `QuestionCard.tsx`, `QuestionOptions.tsx`, `QuestionFeedbackPanel.tsx`, `SessionSummaryPanel.tsx` — já operam genericamente sobre um `sessionId`, sem saber se é uma sessão paga ou demo.
- `SessionResultsView.tsx` e seus subcomponentes — mesma lógica, resultado de qualquer sessão finalizada.
- `AsaasService.server.ts`, `asaas-webhook.server.ts` — não participam da Demo de forma alguma (não há cobrança envolvida).

### Módulos que precisarão de pequena adaptação (mapeados, não implementados)

| Módulo | Adaptação necessária |
|---|---|
| Trigger `handle_new_user` (banco) | Passar a também inserir uma `subscriptions` row apontando para a distribuição Demo, no momento da criação da conta — é a peça tecnicamente mais delicada de todo o desenho, por mexer em um trigger de banco, não em um arquivo TypeScript |
| `StudyPage.tsx` (Study Builder) | Reconhecer a distribuição Demo e pular a etapa de configuração livre, indo direto para uma sessão pré-definida |
| `StudentDashboardPage.tsx` | Novo estado condicional: "ainda não fez a Demo" (CTA para começar) vs. "já fez a Demo, sem plano pago" (card de conversão) vs. "assinante" (Dashboard atual, inalterado) |
| Criação de sessão (`createStudySession` ou equivalente) | Bloquear nova sessão demo se já existir uma `FINISHED` para a distribuição Demo daquele usuário |
| `SessionResultsView.tsx` (quando a sessão for da distribuição Demo) | Substituir o bloco de "Ações" (Nova sessão/Revisar erros/Histórico/Dashboard) pela Tela de Conversão da seção 4 |

**Nenhum desses itens exige tabela nova, coluna nova ou enum novo** — `subscription_status` continua sendo apenas `ACTIVE`/`INACTIVE`; a Demo usa exatamente o mesmo `ACTIVE` que qualquer assinatura paga, distinguida apenas por apontar para a distribuição Demo em vez de uma distribuição paga.

---

## 10. Métricas

| KPI | Definição | Observação |
|---|---|---|
| Taxa de cadastro | Visitantes da Landing que criam conta | Já mensurável pela mesma instrumentação (ainda pendente) de `01-GO_LIVE.md`/`05-CHECKOUT.md` |
| Taxa de conclusão da Demo | Contas criadas que finalizam a sessão demo (20/20 respondidas) | Novo evento a instrumentar — hoje não existe analytics de funil no produto |
| Taxa de conversão | Sessões demo finalizadas que resultam em compra (Mensal ou Fundador) em até N dias | Métrica central da Freemium — sem ela, não é possível avaliar se o modelo compensa |
| Tempo médio cadastro → Demo | Quanto tempo um novo usuário leva para começar a sessão demo | Indica se o convite do Dashboard é eficaz |
| Tempo médio Demo → conversão | Quanto tempo depois de ver o resultado o aluno decide comprar | Indica se a Tela de Conversão está no momento certo |
| CAC | Custo de aquisição por cliente pagante | **Não calculável ainda** — mesma honestidade já registrada em `07-MARKETING.md`: depende de dado real de canal, inexistente hoje |
| LTV | Valor vitalício por cliente | **Não calculável ainda** — depende de pelo menos um ciclo completo de retenção real |
| Churn | Proporção de assinantes que não renovam ao fim do ciclo | Só mensurável depois do primeiro ciclo completo de clientes reais (Mensal ou Fundador) |

---

## 11. Riscos

1. **A Demo pode diluir a conversão em vez de aumentá-la.** Adicionar uma etapa extra ao funil (Cadastro → Demo → Resultado → Conversão, em vez de Cadastro → Compra direta) introduz fricção onde hoje não há — nem todo visitante que criaria conta e compraria direto vai necessariamente completar a demo antes de decidir. **Contraponto:** a demo também reduz a fricção do lado oposto (medo de comprar sem experimentar), o que pode compensar; mas isso é uma hipótese, não um fato — só um teste real (A/B ou sequencial) resolve.
2. **A prova escolhida para a demo é desbalanceada** (71% conhecimentos gerais). Se as 20 questões forem selecionadas sem curadoria deliberada, a demo vai subvender exatamente o argumento central do produto (especialização em Enfermagem). **Contraponto:** isso é mitigável com curadoria manual (seção 2), mas é um trabalho editorial real, não uma simples configuração — se não for feito com cuidado, o risco se concretiza.
3. **O Plano Mensal pode cancibalizar o Fundador.** Um comprador indeciso pode escolher o Mensal "para testar mais um pouco" e nunca migrar, resultando em receita por aluno menor do que se tivesse ido direto para o Fundador. **Contraponto:** mesmo assim, é receita que hoje não existe (hoje é tudo ou nada no Fundador) — o risco é de mix de receita subótimo, não de perda absoluta.
4. **Trigger de banco é o ponto tecnicamente mais arriscado do desenho.** Alterar `handle_new_user` para inserir uma `subscriptions` automática é a única peça que não é um simples componente React — erros em triggers de banco têm maior potencial de efeito colateral silencioso do que erros de frontend. **Sem contraponto real** — é um risco técnico genuíno que precisa de teste cuidadoso na implementação futura.
5. **Abuso por múltiplas contas permanece sem solução real.** A proteção listada na seção 8 é honesta sobre não resolver o problema, só mitigá-lo pelo baixo valor do prêmio. **Contraponto:** para o volume do Soft Launch (até 20-50 alunos), esse risco é small demais para justificar investimento em detecção de fraude agora.
6. **O teto de vagas do Plano Fundador segue sem controle técnico** (`JURIDICO.md`, `GO_NO_GO.md`) — um funil Freemium bem-sucedido aumentaria o volume de interessados no Fundador, tornando esse gap pré-existente mais urgente, não menos.
7. **Migração sem proration pode gerar percepção de perda.** Um aluno que troca do Mensal para o Fundador no meio do ciclo "perde" dias pagos — mesmo sendo uma escolha voluntária dele, a comunicação precisa ser muito clara para não parecer prática desleal. **Contraponto:** a opção de proration existe e é tecnicamente simples (seção 7) — o risco só se materializa se a comunicação for negligenciada, não pela decisão em si.

---

## 12. Roadmap em sprints

Mesmo padrão de `P0_IMPLEMENTATION_PLAN.md`: cada sprint com objetivo único, poucos arquivos, rollback simples.

| Sprint | Objetivo | Arquivos estimados |
|---|---|---|
| **F1** | Curadoria e cadastro das 20 questões demo (dado, não código) | `docs/seeds/questions.json` (ou script de seleção), nova `content_distribution`/`package_version` no banco |
| **F2** | Adaptar trigger `handle_new_user` para conceder a `subscriptions` automática da Demo | Migration de banco (1 arquivo) |
| **F3** | Adaptar `StudentDashboardPage.tsx` para os 3 estados (sem demo / demo feita sem plano / assinante) | 1 arquivo |
| **F4** | Adaptar `StudyPage.tsx` para pular configuração quando a distribuição for a Demo | 1 arquivo |
| **F5** | Bloqueio de repetição da sessão demo | 1 arquivo (lógica de criação de sessão) |
| **F6** | Tela de Conversão dentro de `SessionResultsView.tsx` para sessões da distribuição Demo | 1 arquivo |
| **F7** | Configurar `COMMERCIAL_PLANS` com o Plano Mensal (reaproveita o padrão já usado no Fundador) | `commercial-plans.ts` |
| **F8** | Instrumentação mínima das métricas da seção 10 | A definir na implementação — fora do escopo desta arquitetura |

Nenhuma sprint mistura dois objetivos independentes; nenhuma exige mais de 1-2 arquivos.

---

*Fim da estratégia. Próximo documento: `FREEMIUM_AUDIT.md` — auditoria crítica desta estratégia.*
