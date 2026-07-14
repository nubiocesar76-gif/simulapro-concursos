# 02 — PLANS

**Fase:** 7 — Comercial
**Documento:** Arquitetura comercial de planos (sem definição de preço)
**Data:** 2026-07-09
**Pré-requisito:** `01-GO_LIVE.md` (aprovado)
**Escopo explícito:** definir a ARQUITETURA do modelo comercial. Preços, valores em R$ e testes A/B ficam para `03-PRICING.md`.

---

## 1. Objetivo dos planos

Definir a estrutura comercial que vai converter os primeiros compradores reais da Onda A (`01-GO_LIVE.md`, seção 1.1) sem: (a) contradizer os hábitos de compra reais do público de concurseiros de Enfermagem, (b) assumir volume de tráfego que não existe para testar múltiplas opções, e (c) exigir complexidade operacional incompatível com uma operação de uma única pessoa.

O objetivo não é maximizar receita no dia 1 — é validar que alguém desconhecido paga, usa e não se arrepende, com uma arquitetura simples o bastante para não distorcer o experimento.

---

## 2. Público-alvo

### 2.1 Quem é o comprador

Profissional de Enfermagem (Enfermeiro, nível superior) já formado e frequentemente já empregado — não é um estudante universitário com tempo livre. Características que mudam a estratégia comercial, não só a de produto:

- **Renda historicamente comprimida para o nível de formação.** Mesmo com o Piso da Enfermagem, a categoria tem grande variação salarial e não é o público de maior poder aquisitivo entre concurseiros de nível superior (comparado, por exemplo, a carreiras fiscais/jurídicas/tribunais). Sensibilidade a preço é estrutural, não circunstancial.
- **Rotina de plantão (12x36, noturno).** Estudo é fragmentado — sessões curtas, em horários irregulares, não blocos longos e previsíveis. Isso favorece produtos que entregam valor em qualquer janela de tempo (uma sessão de 20 questões), não produtos que dependem de "trilha longa e sequencial".
- **Já consome muito conteúdo gratuito ou quase-gratuito.** Grupos de WhatsApp/Telegram, perfis de Instagram de professores de enfermagem, PDFs circulando informalmente. A barra para "por que pagar" é mais alta do que em nichos onde o conteúdo pago é a norma.
- **Multi-concurseiro, não mono-concurseiro.** Raramente estuda para um único edital. Estuda para "o próximo que abrir", porque o conteúdo se sobrepõe fortemente entre editais de Enfermagem (Fundamentos, SUS, SAE, Farmacologia) independente da banca ou do órgão.

### 2.2 Ciclo médio de preparação

Não existe um ciclo único. Dois padrões de consumo coexistem e exigem leituras comerciais diferentes:

| Padrão | Comportamento | Implicação comercial |
|---|---|---|
| **Sprint (edital aberto)** | Edital publicado, prova em 30–90 dias. Estudo intenso e concentrado. Compra motivada por urgência real. | Favorece plano de curto/médio prazo com entrega imediata de valor — não interessa "vitalício", interessa "acesso total agora". |
| **Manutenção (sem edital aberto)** | Estudo contínuo de fundo, à espera do próximo edital. Menos intenso, mas mais constante. | Favorece prazo mais longo (menor custo por mês), mas só se o comprador já confiar na marca — não é o perfil de quem compra no primeiro contato com uma marca desconhecida. |

Como o SimulaPro entra no mercado sem marca e sem prova social, o comprador da Onda A tende a ser majoritariamente do padrão **Sprint** (decisão rápida, ticket menor, teste de confiança) — a arquitetura de planos deve servir esse padrão primeiro, não o de manutenção de longo prazo.

### 2.3 Comportamento de compra

- **Compra por gatilho, não por calendário.** Pico de intenção de compra coincide com publicação de edital, não com datas de marketing (Black Friday etc. tem efeito secundário, não primário, neste nicho).
- **Compara preço obsessivamente e publicamente.** Há cultura ativa de comparar mensalidades de plataformas concorrentes em grupos e comunidades — preço é falado abertamente entre pares.
- **Desconfia de cobrança recorrente automática.** Queixas sobre "esqueci de cancelar e fui cobrado de novo" são comuns o suficiente nas plataformas incumbentes para serem um ponto de dor conhecido do nicho, não uma hipótese.
- **Decide perto da prova.** Boa parte da conversão acontece nas últimas 2–6 semanas antes da data do exame — nesse momento, o que importa é acesso imediato e completo, não a arquitetura de planos em si.

### 2.4 Concorrência

| Concorrente | Modelo observado | O que isso ensina |
|---|---|---|
| **Gran Cursos, Estratégia Concursos** | Multi-carreira, professor-marca, cursos em vídeo + PDF + questões. Frequentemente vendido como "acesso ao curso até a data da prova X" (pacote fechado por concurso), além de assinaturas amplas ("acesso ilimitado"). | Competem em amplitude e marca — terreno onde o SimulaPro perde hoje. Não adianta imitar a amplitude; a defesa é o nicho. |
| **QConcursos, Tec Concursos** | Banco de questões (o modelo mais parecido com o SimulaPro). Vendem majoritariamente **planos por prazo determinado** (ex.: 6 ou 12 meses de acesso), não "assinatura perpétua estilo Netflix" como padrão dominante de comunicação — mesmo quando o gateway de cobrança suporta recorrência. | É o comparável mais direto. O padrão do mercado de banco de questões no Brasil é "comprar acesso por um período", não assinatura indefinida. Ir contra esse padrão exige justificativa forte, que não temos ainda. |
| **Plataformas/professores especializados em Enfermagem** (canais e mentorias de Instagram/YouTube) | Tipicamente vendem pacote fechado por tempo (ex.: "mentoria de 3 meses") ou curso avulso, raramente assinatura recorrente longa. | Reforça que, no sub-nicho específico de Enfermagem, "pacote com prazo" é a norma cultural, não a exceção. |

**Conclusão da análise de concorrência:** o mercado já validou, em escala, que "acesso por prazo determinado" é o modelo que este público entende e aceita sem fricção. Propor assinatura recorrente perpétua como padrão seria nadar contra a corrente cultural do próprio nicho, sem nenhum dado próprio que justifique a aposta.

### 2.5 Risco de churn

Duas naturezas de churn distintas, e é importante não confundi-las:

1. **Churn estrutural (bom para o cliente, neutro para o negócio):** o cliente passa no concurso ou desiste dele. O produto cumpriu sua função ou deixou de ser relevante para aquele ciclo de vida — isso é inerente a qualquer ferramenta de preparação para concurso, não um sintoma de insatisfação. Não adianta desenhar um modelo comercial fingindo que esse churn não vai acontecer.
2. **Churn por exaustão de valor (ruim, e agravado pelo estado atual do produto):** cliente sente que "esgotou" o banco de questões antes de terminar seu ciclo de estudo. Dado que já verificamos (`01-GO_LIVE.md`) que a cobertura por disciplina é desigual (algumas com poucas dezenas de questões), esse risco é real e imediato, não hipotético.

Um plano de longuíssimo prazo (ex.: vitalício) esconde mal o risco nº 2 — o cliente percebe rápido que pagou por "para sempre" um banco que já viu inteiro em semanas. Isso pesa contra qualquer modelo que venda "acesso permanente" antes de o conteúdo crescer de forma consistente.

### 2.6 CAC esperado

Nesta fase (Onda A, sem mídia paga, conforme `01-GO_LIVE.md`), o CAC direto é próximo de zero — aquisição é por convite e comunidade. Mas a arquitetura de planos precisa já antecipar o CAC da Onda B:

- Nicho estreito = leilão de mídia paga (Google/Meta) disputado contra concorrentes com orçamento de marketing ordens de grandeza maior. CAC pago tende a ser proporcionalmente alto frente a um ticket de nicho.
- Isso favorece um modelo comercial que **maximize o valor do primeiro ticket** (reduzindo a dependência de recompra futura incerta) mais do que um modelo que aposte tudo em recorrência de longo prazo — especialmente antes de termos qualquer dado real de retenção.

### 2.7 Valor percebido do SimulaPro hoje

Sem rodeios: **baixo**, para um comprador de fora. Marca desconhecida, zero avaliações, zero prova social, banco de 1.000 questões (uma fração do que os incumbentes anunciam) concentrado em 2 bancas (IBFC e FGV somam 69% do conteúdo). O único valor percebido defensável hoje é:

- Foco 100% em Enfermagem (sem diluição por outras carreiras).
- Preço provavelmente mais baixo que os incumbentes (a confirmar em `03-PRICING.md`).
- Curadoria editorial mais granular (taxonomia por disciplina/assunto) do que bancos genéricos.

Isso significa que a arquitetura de planos precisa **reduzir o risco percebido de quem compra primeiro** (prazo curto, garantia clara, preço de entrada) em vez de tentar capturar valor de longo prazo que o produto ainda não provou que tem.

---

## 3. Estratégia comercial

A síntese das seções 2.1 a 2.7 aponta na mesma direção, de forma consistente:

1. O mercado comparável (QConcursos/Tec Concursos) já usa "acesso por prazo", não assinatura perpétua — não há motivo para reinventar isso sem dados.
2. O público desconfia ativamente de cobrança recorrente automática — um ponto de atrito de confiança que pode virar diferencial se evitado.
3. O produto tem churn estrutural inevitável (sucesso do cliente = fim do relacionamento) e um risco adicional de exaustão de valor por causa da cobertura desigual do banco atual.
4. Não há tráfego suficiente na Onda A para testar múltiplos planos com significância estatística.
5. A operação é de uma pessoa só — cada SKU, cada regra de cobrança recorrente, cada exceção de cupom é custo de manutenção manual.
6. O valor percebido de entrada é baixo — a arquitetura precisa reduzir risco do comprador, não maximizar captura de valor de longo prazo ainda não comprovado.

Isso não elimina automaticamente "mensal + anual" como opção — mas estabelece o critério pelo qual toda alternativa deve ser julgada na seção 4: **reduz fricção de confiança e é operacionalmente sustentável por uma pessoa, dado zero prova social?**

---

## 4. Comparativo das alternativas avaliadas

### 4.1 Mensal + Anual

| Aspecto | Avaliação |
|---|---|
| Vantagens | Modelo conhecido, fácil de comunicar; oferece opção de economia para quem já confia |
| Desvantagens | Anual puro tem fricção alta para comprador de marca desconhecida sem prova social; mensal sofre o churn estrutural (passou/desistiu = cancela) mês a mês |
| Riscos | Se recorrência for automática por padrão, herda o mesmo atrito de confiança que o nicho já reclama dos incumbentes |
| Impacto financeiro | Receita mensal previsível apenas se a retenção for boa — o que não temos como assumir ainda |
| Complexidade operacional | Baixa a média — o schema (`packages`, `package_versions`, `subscriptions`) já suporta tecnicamente |

### 4.2 Mensal + Semestral + Anual

| Aspecto | Avaliação |
|---|---|
| Vantagens | Cobre teoricamente mais perfis de disposição a pagar |
| Desvantagens | Paralisia de decisão (3 preços, 3 propostas de valor) logo no primeiro contato com uma marca desconhecida — o pior momento para pedir uma decisão complexa |
| Riscos | Dilui a mensagem; exige volume de tráfego para otimizar que a Onda A (20–50 pessoas) não tem |
| Impacto financeiro | Maximiza captura em tese, mas sem dados reais para calibrar cada faixa, é otimização no escuro |
| Complexidade operacional | Média — mais SKUs, mais comunicação, mais suporte para explicar diferenças |

### 4.3 Plano único

| Aspecto | Avaliação |
|---|---|
| Vantagens | Zero paralisia de decisão; comunicação simples; ideal para fase de validação |
| Desvantagens | Não captura diferentes disposições a pagar |
| Riscos | Baixo — é a opção mais segura para um primeiro ciclo comercial |
| Impacto financeiro | Mais previsível; possivelmente deixa dinheiro na mesa de quem pagaria mais por prazo maior — aceitável nesta fase |
| Complexidade operacional | Mínima — essencial para uma operação de uma pessoa |

### 4.4 Assinatura recorrente (cobrança automática perpétua até cancelamento)

| Aspecto | Avaliação |
|---|---|
| Vantagens | Previsibilidade de receita recorrente (MRR) se a retenção for boa |
| Desvantagens | Atrito cultural direto com o hábito de compra do nicho (seção 2.4); exige gestão de cancelamento, disputa e comunicação de cobrança contínua |
| Riscos | Reputacional — é exatamente o ponto de dor que os concorrentes já acumulam reclamações; alto para uma marca nova que depende de confiança |
| Impacto financeiro | LTV teórico mais alto, mas o padrão real do público (estuda até passar/desistir) sugere retenção mais baixa que SaaS típico — LTV real provavelmente menor que o teórico |
| Complexidade operacional | Média a alta — billing recorrente, chargebacks, e-mails de cobrança, tudo isso sem estrutura de suporte além do próprio fundador |

### 4.5 Pagamento único com atualização (acesso vitalício com conteúdo futuro incluso)

| Aspecto | Avaliação |
|---|---|
| Vantagens | Elimina de vez a fricção de "assinatura escondida"; ticket único mais alto; alinhado ao modelo cultural de "compra de curso" |
| Desvantagens | Sem receita recorrente — depende 100% de aquisição constante de clientes novos; monetização de conteúdo futuro fica comprometida se "vitalício" incluir tudo que vier depois, para sempre |
| Riscos | Sustentabilidade financeira de longo prazo comprometida se o banco crescer muito e o preço de entrada for baixo — quem pagou pouco no início acessa tudo, para sempre, sem pagar de novo |
| Impacto financeiro | Ticket mais alto por venda, mas fluxo de caixa mais dependente de volume constante de vendas novas |
| Complexidade operacional | Baixa para o comprador; exige, porém, definição rígida de escopo ("vitalício de quê, exatamente") para não estourar o modelo |

### 4.6 Período gratuito (trial)

| Aspecto | Avaliação |
|---|---|
| Vantagens | Reduz fricção de entrada — relevante para marca sem prova social |
| Desvantagens | Com banco raso em várias disciplinas, um trial generoso pode ser suficiente para "esgotar" o valor percebido antes da conversão |
| Riscos | Abuso de múltiplas contas; CAC gasto em usuários que nunca converteriam |
| Impacto financeiro | Aumenta topo de funil, mas pode reduzir conversão paga se mal dimensionado frente ao volume atual de conteúdo |
| Complexidade operacional | Baixa a média — a infraestrutura de distribuições já permite limitar acesso, tecnicamente viável sem mudança de código |

### 4.7 Garantia de reembolso

| Aspecto | Avaliação |
|---|---|
| Vantagens | Reduz risco percebido de compra — especialmente relevante com desconhecidos na Onda A |
| Desvantagens | Risco de abuso (uso intensivo dentro do prazo, reembolso em seguida), mais fácil num banco pequeno de "esgotar e devolver" |
| Riscos | Financeiro limitado se o prazo for curto e bem comunicado |
| Impacto financeiro | Custo historicamente baixo em produtos digitais quando a garantia é clara (mercado de infoprodutos costuma operar na faixa de poucos % de acionamento) |
| Complexidade operacional | Baixa — é política comercial, não recurso técnico novo (o cancelamento manual já é pré-requisito do Bloco 1 do `01-GO_LIVE.md`) |

### 4.8 Desconto no lançamento

| Aspecto | Avaliação |
|---|---|
| Vantagens | Cria urgência genuína; recompensa quem confia primeiro; ferramenta clássica e apropriada para soft launch |
| Desvantagens | Pode ancorar expectativa de preço baixo permanente; reverter desconto depois gera atrito se mal comunicado |
| Riscos | Ancoragem de preço — mitigável comunicando o desconto como vantagem de tempo limitado, não como o "preço real" |
| Impacto financeiro | Reduz ticket inicial, mas acelera o objetivo real da Onda A (aprender, não faturar) |
| Complexidade operacional | Baixa |

### 4.9 Cupom

| Aspecto | Avaliação |
|---|---|
| Vantagens | Permite parcerias segmentadas (grupos de enfermagem, parcerias pontuais) sem descontar para todo mundo |
| Desvantagens | Exige rastreamento de atribuição (quem trouxe quem) — não confirmado como já suportado pela integração de pagamento atual; teria de ser verificado/desenhado antes de operacionalizar |
| Riscos | Perda de atribuição de canal se não houver rastreamento — prejudica aprendizado de CAC por canal na Onda B |
| Impacto financeiro | Neutro a positivo, se bem direcionado |
| Complexidade operacional | Média — depende de capacidade de geração/validação de código promocional, a confirmar tecnicamente antes de prometer |

### 4.10 Plano Fundador (Founder)

| Aspecto | Avaliação |
|---|---|
| Vantagens | Cria uma coorte inicial de early adopters com senso de exclusividade; gera prova social genuína ("sou membro fundador"); alinhado perfeitamente ao formato de convite direto e pequeno da Onda A |
| Desvantagens | Se mal delimitado (sem teto de vagas, sem prazo, sem escopo definido), dilui exclusividade e cria obrigação financeira de longuíssimo prazo |
| Riscos | Se o benefício "fundador" não tiver escopo claro, pode ser reivindicado indevidamente para produtos futuros (V2, novos cursos, IA) que ainda nem existem |
| Impacto financeiro | Receita por cliente individual menor, mas altíssimo valor estratégico como motor de validação, feedback qualificado e prova social para o restante do lançamento |
| Complexidade operacional | Baixa — reutiliza a mesma estrutura de um plano único, com rótulo, teto de vagas e prazo de disponibilidade limitados |

---

## 5. Estratégia escolhida

### 5.1 Nome da estratégia

**Acesso por Ciclo, sem recorrência automática, lançado como Plano Fundador.**

Não é nenhuma das dez alternativas isoladamente — é a combinação que a análise das seções 2 a 4 aponta como coerente: um único plano (4.3), estruturado como acesso por prazo fixo e não como assinatura recorrente perpétua (rejeitando 4.4 e adaptando 4.5), lançado sob o rótulo e as condições de Plano Fundador (4.10), com garantia de reembolso (4.7) e desconto de lançamento embutido no próprio conceito de fundador (4.8). Cupom (4.9) e trial (4.6) ficam fora do escopo da V1 por ora — ver seção 8.

### 5.2 Justificativa técnica

1. **Público único, sem prova social, com desconfiança documentada de renovação automática (seções 2.1, 2.3, 2.7)** → cobrança recorrente perpétua (4.4) é descartada como padrão da V1. Não é uma objeção moral a assinaturas — é uma constatação de que este público específico pune esse modelo com desconfiança antes mesmo de experimentar o produto.
2. **O comparável de mercado mais próximo (banco de questões: QConcursos/Tec Concursos) já opera com acesso por prazo determinado (seção 2.4)** → seguir esse padrão reduz a carga de "educar o mercado" que uma marca nova não pode se dar ao luxo de carregar.
3. **Churn estrutural é inevitável e churn por exaustão de valor é um risco real hoje (seção 2.5)** → "vitalício" (4.5, puro) é descartado para a V1: venderia uma promessa de longo prazo que o banco atual (1.000 questões, cobertura desigual) não sustenta com credibilidade. Um prazo definido, renovável por decisão consciente do cliente, resolve isso sem fechar a porta para prazos maiores no futuro.
4. **Sem volume de tráfego para testar múltiplos planos (seção 2.6) e operação de uma pessoa (seção 3, ponto 5)** → planos múltiplos (4.1, 4.2) são adiados; um único plano reduz decisão do comprador e carga operacional do vendedor ao mínimo.
5. **Valor percebido de entrada é baixo (seção 2.7)** → a arquitetura precisa reduzir risco de quem compra primeiro. Garantia de reembolso (4.7) e um rótulo de Fundador com benefício real e escassez genuína (4.10) fazem isso sem exigir desconto agressivo ou trial que o banco atual não sustenta bem (4.6, adiado — ver seção 8).
6. **Compatibilidade técnica:** a infraestrutura já existente (`packages`, `package_versions`, `subscriptions` com `expires_at`, integração Asaas) suporta "acesso por prazo com renovação manual" sem exigir nenhuma mudança de código — é uma escolha de configuração/política de produto, não uma feature nova. Isso mantém total aderência à regra desta fase (nenhuma alteração de código, banco ou arquitetura).

---

## 6. Estrutura dos planos

Sem valores em R$ — apenas arquitetura, conforme escopo deste documento.

| Elemento | Definição |
|---|---|
| Número de planos na V1 | **Um único plano** — "Acesso Enfermeiro" |
| Modelo de cobrança | Pagamento único por um período de acesso fixo (não recorrência automática) |
| Duração do acesso | Prazo único, coberto para um ciclo de preparação típico com folga (a calibrar em `03-PRICING.md`, mas pensado para o padrão "Sprint" da seção 2.2 com margem para o início de um padrão "Manutenção") |
| Rótulo de lançamento | **Plano Fundador** — vagas limitadas e disponível apenas durante a Onda A (`01-GO_LIVE.md`) |
| Teto de vagas do Plano Fundador | Definido e comunicado publicamente (número fechado, não "enquanto durarem os estoques" vago) |
| Renovação | Manual, por decisão do cliente ao fim do prazo — sem cobrança automática (ver seção 9) |
| Abrangência | Curso de Enfermagem, cargo Enfermeiro — o único curso/cargo comercialmente ativo hoje |

---

## 7. Benefícios incluídos

- Acesso completo ao banco de questões vigente durante todo o período de acesso contratado (hoje, 1.000 questões, 8 bancas, todas as disciplinas cadastradas).
- Todos os modos de estudo já existentes no Portal do Aluno (Estudo, Prova, Revisão, Favoritos, Apenas Erradas).
- Histórico de sessões e desempenho por disciplina.
- Qualquer questão nova adicionada ao banco **durante** o período de acesso contratado (atualização incremental, não é um benefício "vitalício" — encerra com o período).
- Selo/reconhecimento de "Membro Fundador" para a primeira coorte, sem expiração do reconhecimento em si (é status, não é acesso ao produto).

---

## 8. Benefícios fora do escopo

Explicitamente **não incluídos** no Plano Fundador da V1, para não repetir o erro de prometer além do que o produto sustenta hoje:

- Acesso a cursos futuros fora de Enfermagem (Técnico de Enfermagem, outras áreas do roadmap) — cada novo curso terá sua própria oferta comercial.
- Acesso vitalício a versões futuras do produto (V1.1, V2) além do período contratado.
- Qualquer funcionalidade de IA — não existe na V1 e não deve ser prometida antecipadamente.
- Simulados cronometrados avançados, gamificação ou ranking — não existem hoje no Portal do Aluno; não prometer o que não foi construído.
- Suporte prioritário ou mentoria individual — fora do escopo de um produto de banco de questões auto-servido.
- Trial gratuito — adiado (ver seção 12) até haver volume de conteúdo que sustente uma amostra generosa sem esgotar o valor percebido.
- Cupons de parceria segmentados — adiado até confirmação técnica de que o fluxo de pagamento suporta rastreamento de atribuição.

---

## 9. Política de renovação

Como o modelo é acesso por prazo, não assinatura recorrente:

1. O acesso expira automaticamente ao fim do período contratado — **sem cobrança automática de continuidade**.
2. O cliente é avisado antes do vencimento (prazo de aviso a definir operacionalmente, mas nunca menor que alguns dias de antecedência) para decidir se quer renovar.
3. Renovar é uma ação deliberada do cliente (novo checkout), não um débito silencioso.
4. Clientes que renovam podem receber uma condição de reconhecimento por continuidade — o desenho exato (desconto, benefício adicional) é decisão de `03-PRICING.md`, não deste documento.
5. Esta política é, em si, um argumento de marketing: "você nunca é cobrado sem saber" é uma resposta direta e honesta a uma queixa real do nicho contra os incumbentes.

---

## 10. Política de cancelamento

Como não há cobrança recorrente automática, "cancelamento" no sentido clássico de assinatura SaaS não se aplica da mesma forma — mas a política ainda precisa ser explícita:

1. **Dentro do prazo de garantia** (seção 11): cancelamento = reembolso integral, mediante solicitação simples, sem necessidade de justificativa.
2. **Fora do prazo de garantia:** não há reembolso proporcional por tempo não utilizado — o acesso já contratado permanece válido até o fim do prazo, mas o valor pago não é devolvido parcialmente, já que não há cobrança futura a interromper (diferente de uma assinatura recorrente, aqui não existe "próxima cobrança" para cancelar).
3. Nenhum cliente deve precisar "lembrar de cancelar" para não ser cobrado de novo — isso é a consequência direta e desejada de não haver recorrência automática.

---

## 11. Política de garantia

- Prazo de garantia incondicional, curto (dimensionado para permitir avaliação honesta do produto sem abrir espaço relevante para consumir o banco inteiro e pedir reembolso — o prazo exato é decisão de `03-PRICING.md`, mas o princípio é: curto o suficiente para desestimular abuso, longo o suficiente para gerar confiança real).
- Sem burocracia: solicitação simples, sem necessidade de justificar o motivo dentro do prazo.
- Monitoramento leve de uso anômalo (ex.: consumo de praticamente todo o banco de questões em poucos dias seguido de pedido de reembolso) como sinal de possível abuso, sem transformar isso em processo hostil para o cliente comum.

---

## 12. Política promocional

- O **Plano Fundador** é, em si, a promoção de lançamento — não é necessário empilhar cupons e descontos adicionais por cima dele na V1 (evita a complexidade operacional de 4.9, ainda não justificada).
- Vagas limitadas e comunicadas com número fechado real (não escassez artificial/fictícia) — condição essencial de credibilidade para não repetir a mesma tática vazia que o público de concurseiros já vê (e despreza) em outras plataformas.
- Disponibilidade encerra ao final da Onda A (`01-GO_LIVE.md`) ou ao esgotar o teto de vagas, o que ocorrer primeiro.
- Trial gratuito e cupons de parceria segmentados ficam explicitamente fora da política promocional da V1 (ver seção 8) — não por serem más ideias, mas por dependerem de pré-condições (mais conteúdo, confirmação técnica de rastreamento) que ainda não estão atendidas.

---

## 13. Critérios para futuras mudanças de planos

A arquitetura de plano único por prazo não é permanente — é a decisão certa para o estado atual do produto e do público. Ela deve ser revisada quando:

1. **O banco de questões crescer de forma consistente e equilibrada entre disciplinas** (não apenas em volume total, mas em cobertura por assunto) — nesse ponto, um plano de prazo mais longo (semestral/anual) passa a ter lastro real de valor para sustentar a promessa.
2. **Houver dados reais de retenção da Onda A e da Onda B** (não estimativa) suficientes para calibrar se múltiplos prazos (4.2) aumentam receita sem aumentar a paralisia de decisão.
3. **O segundo curso (Técnico de Enfermagem) for lançado** — nesse momento, a decisão de "um curso, um plano" deixa de fazer sentido por padrão, e a estrutura de planos precisa decidir entre pacotes por curso ou um plano multi-curso.
4. **A duplicidade de cargo "Técnico em Enfermagem" / "Técnico de Enfermagem" (`01-GO_LIVE.md`, Bloco 0) estiver resolvida** — é pré-requisito técnico para qualquer oferta comercial de Técnico de Enfermagem, não pode ser decidido em paralelo.
5. **O volume de tráfego pago da Onda B for suficiente para rodar teste A/B com significância estatística** — só então testes de preço/plano em escala (mencionados no briefing original) passam a ser uma ferramenta confiável, não um exercício de adivinhação.
6. **A integração de pagamento confirmar suporte robusto a cupons rastreáveis** — pré-requisito para reintroduzir parcerias segmentadas (4.9) com aprendizado de CAC por canal confiável.

Até que essas condições se confirmem, manter a arquitetura de plano único é uma decisão ativa, não uma limitação temporária esquecida.

---

*Próximo documento: `03-PRICING.md` — só após validação desta arquitetura.*
