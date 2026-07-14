# 01 — GO_LIVE

**Fase:** 7 — Comercial
**Documento:** Plano geral de lançamento do SimulaPro V1 (Enfermeiro)
**Data:** 2026-07-09
**Autor funcional:** Head de Produto / Growth / Comercial

---

## 0. Diagnóstico honesto antes do plano

Este plano parte de dados reais verificados no banco de produção em 2026-07-09, não das premissas do briefing. As diferenças importam:

| Alegação | Realidade verificada | Impacto no plano |
|---|---|---|
| "~1.000 questões oficiais" | **Confirmado**: 1.000 questões, 8 bancas, anos 2013–2024 | Base de conteúdo é real, mas concentrada (IBFC+FGV = 69%) e desigual por disciplina |
| "Processo de produção homologado" | Painel do Acervo (`exam_catalog`, 67 provas) mostra **0 questões importadas/aprovadas/publicadas em todas as linhas** — desconectado do banco real | Sem visibilidade confiável de proveniência do conteúdo hoje; corrigir antes de escalar produção |
| Produto pronto para "GO_LIVE" comercial | **80 das 1.000 questões (8%) estão com vínculo de pacote/versão nulo** — existem no banco mas são invisíveis para qualquer aluno | Bloqueador de lançamento — não é aceitável cobrar por um banco que "some" 8% do conteúdo |
| Base pronta para funil de aquisição/upsell/cross-sell | **1 usuário no sistema, 1 assinatura ativa** (ambos do fundador/admin) — zero clientes reais, zero prova social, zero dado de conversão | Não existe "escala" a lançar — existe uma validação zero-to-one a fazer primeiro |
| Dois cargos "Técnico" no roadmap pós-V1 | Taxonomia já tem **dois cargos quase idênticos e provavelmente duplicados por engano**: `Técnico em Enfermagem` e `Técnico de Enfermagem` | Limpar antes de anunciar expansão para Técnicos |

**Conclusão prática:** a Fase 7 não é "ligar o interruptor comercial de um produto validado". É preparar a casa, provar que uma pessoa desconhecida paga e continua usando, e só então escalar aquisição. O cronograma abaixo reflete isso — go-live em duas ondas, não uma.

---

## 1. Plano geral do lançamento

### 1.1 Princípio norteador

Não lançamos "para o mercado". Lançamos em **duas ondas deliberadas**:

- **Onda A — Soft Launch (validação):** grupo pequeno e identificável de compradores reais (dezenas, não milhares), fora de qualquer campanha paga em escala. Objetivo: provar que preço, mensagem, ativação e retenção funcionam com dinheiro real de estranhos.
- **Onda B — Hard Launch (aquisição):** só começa se a Onda A validar os critérios de sucesso da seção 5. Aquisição paga, conteúdo em escala, afiliados — tudo isso é `07-MARKETING.md`, e só é acionado depois da Onda A.

Este documento cobre a preparação e a Onda A por completo. A Onda B é o gatilho para os documentos seguintes (`02` a `09`).

### 1.2 O que "pronto para vender" significa aqui

Pronto não é "o código funciona" — isso já foi verificado em sessões técnicas anteriores (Portal Admin, Portal Aluno, Editorial Engine, seed, importador). Pronto, nesta fase, significa:

1. Conteúdo íntegro (sem questões fantasmas fora do alcance do aluno).
2. Um comprador real, sem ser o fundador, consegue passar de "nunca ouviu falar do SimulaPro" a "está estudando dentro da plataforma" sem intervenção manual.
3. Existe instrumentação mínima para saber se isso está funcionando (não precisa ser sofisticada — precisa existir).

---

## 2. Cronograma

Datas relativas ao início da Fase 7 (D0), não datas de calendário fixas — este projeto já mostrou que "ano do edital ≠ ano da prova ≠ ano de homologação"; tratar prazos comerciais com o mesmo rigor.

| Semana | Bloco | Entregas |
|---|---|---|
| **D0–D3** | **Bloco 0 — Correção de integridade** (pré-requisito, não é "marketing") | Auditar e corrigir as 80 questões órfãs; decidir e limpar a duplicidade `Técnico em Enfermagem` / `Técnico de Enfermagem`; conciliar `exam_catalog` com o que de fato está no banco (ou documentar formalmente que são sistemas desacoplados e ajustar a expectativa de quem opera o Acervo) |
| **D3–D7** | **Bloco 1 — Ativos comerciais mínimos** | `02-PLANS.md`, `03-PRICING.md` definidos e aprovados; Landing Page (`04-LANDING.md`) publicada; Checkout (`05-CHECKOUT.md`) testado ponta a ponta com pagamento real de baixo valor (transação de R$1 ou plano promocional, não simulação) |
| **D7–D10** | **Bloco 2 — Onda A: Soft Launch** | Convite direto a uma lista fechada (rede pessoal do fundador, grupos de enfermagem/concursos onde há relação genuína, comunidade profissional) — **não tráfego pago, não anúncio público**. Meta: 20–50 compradores reais |
| **D10–D24** | **Bloco 3 — Observação e ajuste** (14 dias corridos mínimos) | Medir os critérios da seção 5. Ajustar preço, copy, onboarding com base em comportamento real, não opinião |
| **D24+** | **Decisão Go/No-Go para Onda B** | Se critérios batem: liberar `07-MARKETING.md` e aquisição paga. Se não: iterar no Bloco 3 antes de gastar em aquisição |

**Por que 14 dias de observação e não 3:** com 1 curso e 1.000 questões, o produto é consumido rápido; churn e insatisfação por "acabou o conteúdo" só aparecem depois de uso continuado, não no primeiro login. Decidir Go/No-Go antes disso é decidir no escuro.

---

## 3. Checklist

### Bloco 0 — Integridade (bloqueador, não opcional)

- [ ] Identificar as 80 questões com `package_version_id NULL` e corrigir o vínculo (reprocessar via seed corrigido ou vincular manualmente à versão publicada)
- [ ] Confirmar, após a correção, `0` questões órfãs no banco
- [ ] Decidir qual dos dois cargos "Técnico" é o correto; desativar/mesclar o outro na taxonomia
- [ ] Documentar formalmente a relação (ou falta dela) entre `exam_catalog` (Acervo) e o total real de questões no banco, para que a próxima pessoa que operar o Acervo não confie num painel que mostra "0" onde há 1.000
- [ ] Auditoria de amostra: abrir 20 questões aleatórias no Portal do Aluno como se fosse um aluno pagante e verificar enunciado, alternativas, gabarito e explicação — sem esse passo, "1.000 questões" é uma contagem de linhas no banco, não uma garantia de qualidade

### Bloco 1 — Ativos comerciais

- [ ] Plano(s) definido(s) e aprovado(s) (`02-PLANS.md`)
- [ ] Preço definido com racional documentado (`03-PRICING.md`)
- [ ] Landing Page no ar, mobile-first, com copy final (`04-LANDING.md`)
- [ ] Checkout testado com cartão real, PIX (se aplicável) e boleto (se aplicável), incluindo cenário de falha de pagamento
- [ ] Emails transacionais mínimos funcionando (boas-vindas + confirmação de pagamento) — fluxo completo é `06-EMAILS.md`, mas esses dois não podem esperar
- [ ] Cancelamento de assinatura funcional e testado (não é opcional — é passivo legal e de confiança)

### Bloco 2 — Soft Launch

- [ ] Lista de convite fechada definida (quem, quantos, por qual canal direto)
- [ ] Mensagem de convite escrita (não é anúncio — é convite pessoal/comunidade)
- [ ] Canal de suporte definido para essa fase (WhatsApp do fundador é aceitável aqui — não precisa de infraestrutura de suporte ainda)
- [ ] Instrumentação mínima: saber quantos visitaram a landing, quantos criaram conta, quantos pagaram, quantos fizeram pelo menos 1 sessão de estudo

### Bloco 3 — Decisão

- [ ] Relatório dos critérios de sucesso (seção 5) preenchido com dados reais
- [ ] Decisão documentada: Go / No-Go / Go parcial (ex.: ajustar preço e repetir soft launch antes de escalar)

---

## 4. Riscos

| # | Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| 1 | Cliente paga e encontra questões "faltando" por causa das 80 órfãs (ou de uma recorrência do mesmo bug) | Alta se não corrigido | Alto — perda de confiança imediata, possível pedido de reembolso e review público negativo | Bloco 0 é pré-requisito hard para qualquer venda |
| 2 | Preço calibrado sem nenhum dado de disposição a pagar real | Alta | Médio-alto | Onda A é exatamente para isso — não fixar preço "definitivo" antes dela |
| 3 | Conteúdo raso demais em disciplinas específicas gera sensação de "poucas questões" após poucos dias de uso | Média-alta | Médio — afeta retenção, não aquisição | Comunicar volume com honestidade (seção de posicionamento em `04-LANDING.md`); monitorar quais disciplinas os alunos mais reclamam de "repetição" |
| 4 | Confundir "produto funciona tecnicamente" com "produto pronto para vender" e pular direto para aquisição paga | Alta (é a tendência natural após uma V1 tecnicamente concluída) | Alto — queima orçamento de marketing validando a coisa errada | Onda A obrigatória antes da Onda B; gate de decisão explícito na seção 5 |
| 5 | Único operador (fundador) acumulando produto, suporte, conteúdo e marketing sozinho | Alta | Médio-alto no médio prazo (burnout, gargalo) | Escopo da Onda A é intencionalmente pequeno para ser sustentável por 1 pessoa; não escalar Onda B sem plano de suporte |
| 6 | Painel do Acervo (`exam_catalog`) desatualizado leva a decisões erradas sobre "quanto conteúdo falta produzir" | Média | Médio (afeta roadmap de conteúdo, não o lançamento em si) | Documentar a desconexão agora (Bloco 0); não é bloqueador de venda, é bloqueador de planejamento de produção futura |
| 7 | Posicionamento "banco de questões" competindo direto com incumbentes que têm 50–100x mais conteúdo | Alta se copy não diferenciar | Alto para CAC na Onda B | Nicho + especialização em Enfermagem deve ser o eixo central do posicionamento, não quantidade |

---

## 5. Critérios de sucesso (para decidir Go/No-Go da Onda B)

Metas propositalmente modestas — o objetivo da Onda A é **aprender**, não faturar. Um resultado "morno" com sinal de aprendizado claro é mais valioso que uma venda alta sem entender por quê.

| Critério | Meta mínima para "Go" | Meta mínima para "Go com ajuste" | Sinal de "No-Go" |
|---|---|---|---|
| Conversão visitante → cadastro (soft launch) | ≥ 15% | 8–15% | < 8% (mensagem/oferta não ressoa) |
| Conversão cadastro → pagamento | ≥ 20% | 10–20% | < 10% (preço ou proposta de valor erradas) |
| Uso pós-compra (≥ 1 sessão de estudo em 7 dias) | ≥ 70% dos pagantes | 50–70% | < 50% (produto não engaja mesmo comprado) |
| Pedidos de reembolso/cancelamento em 14 dias | ≤ 10% | 10–20% | > 20% |
| Feedback qualitativo sobre volume/qualidade de conteúdo | Nenhuma reclamação recorrente sobre "poucas questões" ou "erro em questão" | Reclamações pontuais, não recorrentes | Reclamação recorrente do mesmo problema (ex.: mesma disciplina, mesmo tipo de erro) |

**Regra de decisão:** só avançar para Onda B (aquisição paga) se pelo menos 4 dos 5 critérios estiverem em "Go", e nenhum em "No-Go". Um único critério em "No-Go" é motivo para outro ciclo de ajuste antes de gastar em mídia paga.

---

## 6. Dependências

| Dependência | Bloqueia | Status atual |
|---|---|---|
| Correção das 80 questões órfãs | Qualquer venda | Pendente |
| Limpeza da duplicidade de cargo "Técnico" | Comunicação de roadmap (não bloqueia venda do produto Enfermeiro atual) | Pendente |
| Definição de planos e preço (`02`, `03`) | Landing Page e Checkout | Pendente — próximo documento desta fase |
| Landing Page publicada (`04`) | Início da Onda A | Pendente |
| Checkout testado com pagamento real (`05`) | Início da Onda A | Pendente |
| Emails transacionais mínimos (`06`, parcial) | Início da Onda A | Pendente |
| Resultado da Onda A (seção 5) | Início da Onda B / liberação de `07-MARKETING.md` em escala | Não iniciado |

---

## 7. Fora de escopo desta fase (explicitamente adiado)

Para manter a Onda A pequena e honesta, os itens abaixo **não** fazem parte do Go-Live inicial, mesmo estando no briefing original:

- Afiliados e influenciadores — decisão de canal pertence à Onda B (`07-MARKETING.md`), não faz sentido recrutar parceiros para um produto ainda não validado com estranhos
- Upsell/cross-sell sofisticado — com 1 curso e 1 pacote, não há hoje o que fazer cross-sell; vira relevante quando Técnico de Enfermagem for lançado
- Expansão internacional (Portugal) e IA — itens de `09-ROADMAP.md`, não de lançamento
- Testes A/B de preço em escala — fazem sentido com volume de tráfego que a Onda A não terá; a validação de preço aqui é qualitativa (conversas reais com os primeiros compradores), não estatística

---

*Próximo documento: `02-PLANS.md`.*
