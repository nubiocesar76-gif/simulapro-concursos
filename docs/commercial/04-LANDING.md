# 04 — LANDING

**Fase:** 7 — Comercial
**Documento:** Página de conversão oficial do SimulaPro (arquitetura + copy completa)
**Data:** 2026-07-09
**Pré-requisitos:** `01-GO_LIVE.md`, `02-PLANS.md`, `03-PRICING.md` (aprovados)
**Escopo:** documentação de copy, estrutura e SEO. Nenhum HTML, React ou layout visual é produzido aqui.

---

## 0. Princípios que governam toda a copy deste documento

Antes de qualquer texto, as regras que toda frase abaixo precisa obedecer — e que servem de critério de revisão para qualquer copy futura desta página:

1. **Toda alegação é verificável.** Se uma frase afirma um número, uma funcionalidade ou uma característica, ela corresponde a algo que existe hoje no produto (verificado em `01-GO_LIVE.md`) ou a uma decisão já aprovada (`02-PLANS.md`, `03-PRICING.md`). Nenhuma frase promete o que ainda não foi construído (IA, vídeoaulas, gamificação, ranking, cursos além de Enfermagem).
2. **Proibido:** "a melhor plataforma", "o maior banco", "a maior aprovação", "milhares de questões", "estude mais", "passe em qualquer concurso" — e qualquer variação com o mesmo efeito (superlativo não sustentável, promessa de resultado, apelo a volume).
3. **O argumento de venda é especialização, organização, qualidade editorial, eficiência de estudo e evolução mensurável — nunca quantidade ou preço.**
4. **O leitor já conhece QConcursos, TEC Concursos, Gran e Estratégia.** A copy não finge que ele não sabe comparar — ela dá a ele o critério certo para comparar (foco, não volume).
5. **Sem urgência artificial.** Vagas do Plano Fundador são um número real e finito (`02-PLANS.md`, seção 6.1) — a copy comunica escassez real, nunca contador regressivo fictício ou frases de pressão vazia.

---

## 1. SEO e metadados

| Campo | Conteúdo |
|---|---|
| **Título (title tag)** | SimulaPro — Questões de Concurso para Enfermagem, Organizadas por Banca e Assunto |
| **Meta description** | Banco de questões oficiais exclusivo para concursos de Enfermagem. Organizado por banca, disciplina e assunto. Sem conteúdo de outras carreiras no meio do caminho. |
| **Open Graph — og:title** | SimulaPro — O banco de questões feito só para quem presta concurso de Enfermagem |
| **Open Graph — og:description** | Questões oficiais organizadas por banca, disciplina e assunto. Central de revisão, resultado por disciplina e acervo em atualização contínua. |
| **Open Graph — og:type** | website |
| **Open Graph — og:image** | Imagem do próprio produto (recorte da tela de resolução de questões ou do painel de desempenho por disciplina) — nunca banco de imagem genérico de "profissional de saúde sorrindo"; a prova visual é o produto, não uma foto de estoque |
| **Palavras-chave primárias** | questões de enfermagem para concurso; banco de questões enfermagem; concurso enfermeiro questões; simulado enfermagem concurso público; questões EBSERH enfermagem; questões concurso enfermeiro por banca; questões de enfermagem por disciplina |
| **Palavras-chave secundárias** | concurso EBSERH enfermeiro; questões SES enfermagem; concurso enfermeiro prefeitura; banca IBFC enfermagem; banca FGV enfermagem; legislação do SUS questões |
| **URL sugerida (home/landing)** | `simulapro.com.br/` (domínio raiz — produto único, não há necessidade de segmentar por curso ainda) |
| **URLs de âncora internas** | `/#planos`, `/#como-funciona`, `/#comparativo`, `/#faq` |
| **URL de conversão** | `/fundador` (página de checkout do Plano Fundador, ver `05-CHECKOUT.md`) |

### Estrutura H1/H2/H3

```
H1: O banco de questões feito só para quem presta concurso de Enfermagem
  H2: Como funciona
  H2: Por que o SimulaPro
    H3: Especialização
    H3: Organização
    H3: Qualidade editorial
    H3: Eficiência de estudo
  H2: Comparativo
  H2: Demonstração do fluxo
  H2: Organização por banca
  H2: Organização por disciplina
  H2: Resultados por disciplina
  H2: Central de revisão
  H2: O Acervo SimulaPro
  H2: Plano Fundador
  H2: Garantia
  H2: Perguntas frequentes
    H3: [cada pergunta da FAQ]
  H2: Comece agora
```

Apenas um H1 na página (a headline). Nomes de seção nos H2 priorizam o termo de busca real (ex.: "Organização por banca" em vez de um nome criativo sem valor de SEO).

---

## 2. Mapa de conversão (lógica da ordem das seções)

A ordem não é arbitrária — seve a uma sequência de convencimento:

1. **Hero → Benefícios:** estabelece a promessa central (especialização) antes de qualquer prova.
2. **Como funciona → Por que o SimulaPro:** explica o produto e só depois argumenta o porquê — ninguém se convence de um "porquê" antes de entender o "o quê".
3. **Comparativo:** só entra depois que o leitor já entende a proposta — comparar cedo demais (antes de estabelecer a diferença) faria a página parecer reativa aos concorrentes em vez de segura da própria proposta.
4. **Demonstração do fluxo → Organização por banca → Organização por disciplina → Resultados → Central de revisão:** prova concreta, funcionalidade por funcionalidade, na ordem em que o aluno realmente usa o produto (entra, resolve questões organizadas, vê resultado, revisa).
5. **Acervo:** fecha o argumento de conteúdo depois (não antes) de provar organização — números sem contexto de organização pareceriam justamente a promessa de volume que a página se recusa a fazer.
6. **Planos → Garantia:** a oferta só aparece depois que todo o valor foi demonstrado — preço antes disso vira o único critério de julgamento do visitante.
7. **FAQ:** imediatamente após a oferta, não no rodapé perdido — é o espaço de remover a última dúvida no momento exato em que ela surge (logo depois de ver preço e condição).
8. **CTA final → Rodapé:** última chance de conversão para quem leu tudo e ainda hesita, seguida do encerramento institucional.

---

## 3. Seções da Landing Page

### 3.1 Hero

**Copy:**

> **O banco de questões feito só para quem presta concurso de Enfermagem.**
>
> Questões oficiais organizadas por banca, disciplina e assunto — sem precisar filtrar entre conteúdo de Direito, Administração ou Exatas que você nunca vai usar.
>
> [Garantir minha vaga no Plano Fundador]

- **Objetivo psicológico:** ancorar a diferença central (especialização) antes de qualquer outra informação — o visitante decide em segundos se "isso é para mim", e a resposta certa precisa vir primeiro.
- **Objeção combatida:** "isso é só mais um banco de questões genérico?" — respondida antes mesmo de ser formulada.
- **CTA esperado:** rolagem para a seção de planos ou clique direto no CTA de Fundador — o hero não pede e-mail nem cadastro solto; pede a ação real (não há trial gratuito, `02-PLANS.md` seção 8).

### 3.2 Headline

Já apresentada no Hero. Variante para uso em anúncios/SEO quando o Hero completo não cabe:

> **Questões de concurso, organizadas só para quem estuda Enfermagem.**

- **Objetivo psicológico:** clareza imediata de nicho — filtra visitantes de outras carreiras antes de gastar atenção deles ou verba de mídia com eles.
- **Objeção combatida:** ambiguidade sobre "para quem é isso".
- **CTA esperado:** permanência na página (não é uma seção de ação, é a âncora de identidade).

### 3.3 Subheadline

> Enfermeiro, técnico em formação para o cargo de Enfermeiro ou concurseiro que já conhece QConcursos, TEC Concursos, Gran ou Estratégia: aqui você encontra o mesmo tipo de treino por questões, recortado exclusivamente para o que cai nos editais de Enfermagem — organizado por banca, disciplina e assunto, do jeito que o edital realmente cobra.

- **Objetivo psicológico:** reconhecer explicitamente que o visitante já é um comprador experiente de produtos concorrentes — cria confiança por não fingir ingenuidade sobre o mercado.
- **Objeção combatida:** "por que eu trocaria [concorrente que já uso]?" — não tenta esconder que concorrentes existem, usa isso a favor.
- **CTA esperado:** avançar para "Como funciona".

### 3.4 CTA (padrão usado ao longo da página)

**Texto principal:** `Garantir minha vaga no Plano Fundador`
**Texto secundário (contextual, usado em seções intermediárias):** `Ver como funciona` / `Ver o Acervo completo` / `Ver planos e garantia`

- **Objetivo psicológico:** o CTA nomeia a ação real (entrar no Plano Fundador), não um verbo vago ("comece agora") que esconde o compromisso — coerente com a transparência definida em `02-PLANS.md`.
- **Objeção combatida:** desconfiança sobre "o que acontece quando eu clico" — o texto já entrega a expectativa certa.
- **CTA esperado:** clique para a seção/página de planos (`/#planos` ou `/fundador`).

### 3.5 Benefícios

**Copy:**

> **O que muda quando o banco de questões é feito só para Enfermagem**
>
> **Especialização.** Todo o conteúdo é do cargo Enfermeiro. Você não paga para ter acesso a questões de carreiras que nunca vai prestar.
>
> **Organização.** As questões seguem a mesma estrutura dos editais reais: disciplina, assunto, banca e ano — hoje, 29 disciplinas e 192 assuntos mapeados, cobrindo 8 bancas diferentes.
>
> **Qualidade editorial.** Cada questão passa por classificação e revisão antes de entrar no Acervo — não é um despejo de PDF convertido em banco de dados.
>
> **Eficiência de estudo.** Menos tempo filtrando o que não serve, mais tempo respondendo o que realmente cai na sua prova.
>
> **Evolução mensurável.** Painel de desempenho por disciplina, ordenado do seu ponto mais fraco para o mais forte — você sabe exatamente onde estudar primeiro.

- **Objetivo psicológico:** transformar os cinco pilares abstratos do posicionamento (especialização, organização, qualidade, eficiência, evolução) em benefícios concretos e verificáveis, um por um.
- **Objeção combatida:** "isso é só marketing" — cada benefício vem com um fato de sustentação (29 disciplinas, 192 assuntos, 8 bancas, painel ordenado por desempenho).
- **CTA esperado:** rolagem para "Como funciona".

### 3.6 Como funciona

**Copy:**

> **Como funciona**
>
> 1. **Você garante acesso ao Acervo Enfermeiro** durante o período do seu ciclo de estudo.
> 2. **Escolhe o modo de sessão:** Estudo (com feedback imediato e explicação), Prova (sem feedback, simulando a prova real), Revisão, Favoritos ou Apenas Erradas.
> 3. **Resolve questões organizadas por disciplina, assunto e banca** — filtra exatamente o que precisa revisar antes de uma prova específica.
> 4. **Acompanha o desempenho por disciplina** em tempo real, ordenado do ponto mais fraco para o mais forte.
> 5. **Usa a Central de Revisão** para voltar às questões erradas ou marcadas como favoritas sempre que quiser, sem perder o histórico.

- **Objetivo psicológico:** reduzir a incerteza sobre "o que eu realmente recebo" — um passo a passo concreto reduz a sensação de compra às cegas.
- **Objeção combatida:** "como isso funciona na prática?"
- **CTA esperado:** avançar para "Por que o SimulaPro" ou já considerar o CTA de Fundador se a decisão já estiver tomada.

### 3.7 Por que o SimulaPro

**Copy:**

> **Por que o SimulaPro**
>
> Bancos de questões multi-carreira existem para atender concurseiros de qualquer área — e por isso mesmo, boa parte do que eles oferecem não serve para quem presta Enfermagem. O SimulaPro parte do problema oposto: em vez de cobrir todas as carreiras com pouca profundidade em cada uma, cobre uma única carreira com organização específica para ela.
>
> **Especialização** significa que cada questão do Acervo pertence ao cargo Enfermeiro — não existe a etapa de "filtrar o que não interessa" que acontece em plataformas genéricas.
>
> **Organização** significa que a taxonomia do SimulaPro (disciplina → assunto) foi construída olhando editais reais de Enfermagem — Fundamentos de Enfermagem, Legislação do SUS, Saúde da Mulher, Saúde da Criança, Urgência e Emergência, entre outras — não uma lista genérica de "matérias de concurso" adaptada depois.
>
> **Qualidade editorial** significa que a classificação de cada questão (disciplina, assunto, banca, ano) passa por um processo de revisão antes de entrar no Acervo, não por um algoritmo genérico de importação em massa.
>
> **Eficiência de estudo** é a consequência direta dos três pontos acima: menos tempo gasto decidindo o que estudar, mais tempo estudando o que efetivamente cai na sua prova.

- **Objetivo psicológico:** argumentar a favor da especialização sem atacar diretamente os concorrentes — o leitor tira a própria conclusão sobre por que "cobrir tudo" tem um custo (profundidade) que "cobrir uma coisa só" não tem.
- **Objeção combatida:** "os concorrentes também têm questões de Enfermagem, por que esse seria diferente?"
- **CTA esperado:** avançar para "Comparativo" (o leitor já está pronto para uma comparação direta depois deste argumento).

### 3.8 Comparativo

**Copy:**

> **SimulaPro não compete em quantidade. Compete em foco.**
>
> Se você está comparando com QConcursos, TEC Concursos, Gran ou Estratégia, a pergunta certa não é "quem tem mais questões" — é "quem organiza o que eu preciso, do jeito que eu preciso".

| | Bancos multi-carreira (QConcursos, TEC, Gran) | Cursos completos (Estratégia Questões, Gran Ilimitado) | SimulaPro |
|---|---|---|---|
| Foco | Todas as carreiras de concurso | Curso completo (vídeo + PDF + questões) de qualquer carreira | Exclusivamente Enfermagem |
| Organização | Filtros genéricos por carreira/matéria | Trilha de curso, questões como complemento | Taxonomia própria por disciplina e assunto de Enfermagem |
| O que você paga | Acesso a um volume grande e genérico | Acesso a um ecossistema completo (vídeoaulas, PDFs, trilha) | Acesso a um Acervo curado e organizado para o cargo Enfermeiro |
| Conteúdo fora do seu cargo | Presente (você filtra) | Presente (parte do pacote) | Inexistente |

> Se o que você precisa é um curso completo com vídeoaulas, o SimulaPro não é esse produto — e não finge ser. Se o que você precisa é treinar por questões oficiais de Enfermagem, organizadas do jeito que o edital cobra, é exatamente para isso que o SimulaPro existe.

- **Objetivo psicológico:** honestidade radical sobre o que o produto não é — paradoxalmente aumenta a confiança em quem ele realmente serve, e afasta rápido quem não é o público certo (reduz churn e reembolso por expectativa errada).
- **Objeção combatida:** "por que eu não fico só no QConcursos/Gran, que já tem tudo?" — a resposta não nega o concorrente, redefine o critério de decisão.
- **CTA esperado:** avançar para a demonstração concreta do fluxo.

### 3.9 Demonstração do fluxo

**Copy:**

> **Veja o SimulaPro por dentro**
>
> [Sequência de capturas de tela reais do produto — não ilustração genérica]
>
> 1. Tela de configuração de sessão: escolha de modo (Estudo, Prova, Revisão, Favoritos, Apenas Erradas), quantidade de questões e ordem.
> 2. Tela de resolução: enunciado, alternativas, e — no modo Estudo — feedback imediato com explicação.
> 3. Tela de progresso: "Questão X de Y", contagem de respondidas.
> 4. Painel de desempenho por disciplina, ordenado do ponto mais fraco para o mais forte.

- **Objetivo psicológico:** substituir a ausência de um período gratuito (`02-PLANS.md`, seção 8) por prova visual direta do produto real — reduz a sensação de "comprar às cegas" sem abrir mão da decisão de não ter trial.
- **Objeção combatida:** "eu queria testar antes de pagar."
- **CTA esperado:** avançar para as seções de organização (banca/disciplina), que aprofundam o que foi mostrado aqui.

### 3.10 Organização por banca

**Copy:**

> **Questões das bancas que você realmente vai enfrentar**
>
> O Acervo Enfermeiro reúne questões de 8 bancas organizadoras diferentes — IBFC, FGV, Instituto AOCP, VUNESP, Instituto Consulplan, COSEAC, FUNDATEC e UFPR/NC — cobrindo provas aplicadas entre 2013 e 2024. Você filtra por banca para treinar especificamente o estilo de prova do concurso que está prestando, em vez de estudar um formato genérico que não corresponde ao que vai encontrar no dia da prova.

- **Objetivo psicológico:** ancorar a organização por banca como resposta direta a uma dor real de concurseiro (cada banca tem estilo próprio de cobrança) — informação específica (nomes reais das bancas) constrói credibilidade mais que uma alegação genérica de "questões de várias bancas".
- **Objeção combatida:** "as questões são de bancas que nem caem no meu concurso?"
- **CTA esperado:** avançar para organização por disciplina.

### 3.11 Organização por disciplina

**Copy:**

> **Estude por disciplina e assunto, não por lista solta de questões**
>
> As questões do SimulaPro são classificadas em disciplinas — como Fundamentos de Enfermagem, Legislação do SUS, Saúde da Mulher, Saúde da Criança e do Adolescente, Urgência e Emergência, Enfermagem em Doenças Transmissíveis, Raciocínio Lógico, Português e Informática — e dentro de cada uma, por assunto específico. Isso significa que, se o seu edital cobra "Sistematização da Assistência de Enfermagem" ou "Farmacologia aplicada", você filtra exatamente esse recorte, em vez de vasculhar um banco genérico questão por questão.

- **Objetivo psicológico:** demonstrar profundidade de organização (não de volume) — o argumento central do posicionamento (`03-PRICING.md`, seção 2) fica concreto aqui, com exemplos reais de disciplina.
- **Objeção combatida:** "como eu sei se vou achar o assunto específico que preciso revisar?"
- **CTA esperado:** avançar para resultados por disciplina.

### 3.12 Resultados inteligentes

**Copy:**

> **Saiba exatamente onde estudar primeiro**
>
> O painel de desempenho mostra seu percentual de acerto por disciplina, ordenado do mais fraco para o mais forte. Não é uma média genérica de "aproveitamento geral" — é a informação específica de qual disciplina está puxando seu resultado para baixo, para você decidir com dado, não com achismo, onde investir a próxima hora de estudo.

- **Objetivo psicológico:** apelar à eficiência (um dos cinco pilares) através de uma ferramenta concreta de tomada de decisão — fala diretamente à rotina fragmentada do enfermeiro-concurseiro (`02-PLANS.md`, seção 2.1): tempo é escasso, e saber onde estudar primeiro é mais valioso do que ter "mais uma hora disponível".
- **Objeção combatida:** "como eu sei se estou evoluindo de verdade?"
- **CTA esperado:** avançar para Central de Revisão.

### 3.13 Central de revisão

**Copy:**

> **Central de Revisão**
>
> Toda questão que você errar ou marcar como favorita fica disponível na Central de Revisão. No modo Apenas Erradas, você refaz especificamente o que já errou antes — sem se perder resolvendo de novo o que já domina. O histórico de sessões fica salvo, então você acompanha sua evolução ao longo do tempo, não só no momento em que está estudando.

- **Objetivo psicológico:** reforçar a sensação de controle e progresso contínuo — reduz a ansiedade comum de "estou estudando, mas não sei se estou melhorando".
- **Objeção combatida:** "eu erro muito e não sei se estou revisando direito."
- **CTA esperado:** avançar para a seção do Acervo (fecha o argumento de produto antes de entrar na oferta).

### 3.14 Acervo

**Copy:**

> **O Acervo SimulaPro**
>
> Hoje, o Acervo Enfermeiro reúne 1.000 questões oficiais, organizadas em 29 disciplinas e 192 assuntos, de 8 bancas organizadoras, com provas aplicadas entre 2013 e 2024. O Acervo está em produção contínua: novas provas passam por um processo de classificação e revisão editorial antes de entrar no banco — o objetivo não é acumular volume, é manter a organização e a qualidade de classificação conforme o conteúdo cresce.

- **Objetivo psicológico:** transparência total sobre o tamanho real do banco — evita o efeito rebote de decepção pós-compra (`01-GO_LIVE.md`, risco nº 3) ao comunicar o número real, no contexto certo (organização), em vez de escondê-lo ou inflar a expectativa.
- **Objeção combatida:** "é atualizado? é pouco conteúdo?" — respondida com número real e com o compromisso de processo (produção contínua), não com uma promessa vaga de "sempre teremos mais".
- **CTA esperado:** avançar para Planos.

### 3.15 Planos

**Copy:**

> **Plano Fundador**
>
> O SimulaPro está em lançamento, e as primeiras vagas fazem parte do Plano Fundador: acesso completo ao Acervo Enfermeiro por um ciclo de estudo, em uma condição válida apenas para esta primeira leva, com vagas limitadas e reais.
>
> Sem assinatura recorrente automática: você paga uma vez pelo período do seu ciclo de acesso e decide, ao final, se quer renovar — nunca é cobrado de novo sem decidir isso primeiro.
>
> [Ver condição do Plano Fundador e vagas restantes → checkout]

- **Objetivo psicológico:** apresentar a oferta só depois de todo o valor ter sido demonstrado (seção 2) — e reduzir o maior atrito de confiança do nicho (cobrança automática) diretamente no texto da oferta, não apenas nos termos de uso.
- **Objeção combatida:** "tem assinatura automática?" — respondida na própria seção de venda, não escondida no rodapé.
- **CTA esperado:** clique para o checkout do Plano Fundador (`/fundador`).

### 3.16 Garantia

**Copy:**

> **Garantia de 7 dias**
>
> Se em até 7 dias corridos você achar que o SimulaPro não é para você, devolvemos o valor integral, sem burocracia e sem precisar justificar o motivo. Não é uma condição escondida em letra miúda — é o mesmo prazo que você já conhece de outras plataformas de estudo, porque achamos que essa deveria ser a regra, não a exceção.

- **Objetivo psicológico:** eliminar a última barreira de risco percebido antes da decisão final de compra — colocado logo após a oferta, no momento exato em que a hesitação é mais alta.
- **Objeção combatida:** "e se eu não gostar depois de pagar?"
- **CTA esperado:** retorno ao CTA de checkout, agora com a objeção de risco removida.

### 3.17 FAQ

**Copy:**

> **Perguntas frequentes**
>
> **Vale a pena?**
> Se o que você precisa é treinar por questões oficiais de Enfermagem, organizadas por banca, disciplina e assunto, sim — é exatamente o problema que o SimulaPro resolve. Se você precisa de um curso completo com vídeoaulas, o SimulaPro não é esse produto, e preferimos dizer isso agora a deixar você descobrir depois de pagar.
>
> **É atualizado?**
> O Acervo está em produção contínua. Cada nova prova passa por um processo de classificação e revisão antes de entrar no banco — não prometemos uma quantidade fixa de questões novas por mês, prometemos que o que entra, entra classificado e revisado.
>
> **Como funciona?**
> Você garante acesso ao Acervo Enfermeiro, escolhe o modo de sessão (Estudo, Prova, Revisão, Favoritos ou Apenas Erradas), resolve questões filtradas por disciplina, assunto ou banca, e acompanha seu desempenho por disciplina em tempo real.
>
> **Tem assinatura automática?**
> Não. Você paga uma vez pelo ciclo de acesso contratado. Ao final do período, decide se quer renovar — não há cobrança automática nem necessidade de "lembrar de cancelar".
>
> **Posso cancelar?**
> Como não há cobrança recorrente automática, não existe "cancelamento" no sentido de interromper uma assinatura — seu acesso simplesmente não é renovado se você não quiser continuar. Se quiser reembolso dentro dos primeiros 7 dias, é só solicitar.
>
> **As questões são oficiais?**
> Sim. Todas as questões do Acervo são de provas oficiais aplicadas por bancas organizadoras reais (hoje, IBFC, FGV, Instituto AOCP, VUNESP, Instituto Consulplan, COSEAC, FUNDATEC e UFPR/NC), com classificação por disciplina, assunto, banca e ano.

- **Objetivo psicológico:** eliminar, uma a uma, as objeções mais prováveis no exato momento em que o visitante já viu a oferta e a garantia — é a última barreira antes da decisão.
- **Objeção combatida:** todas as seis listadas explicitamente pelo briefing, respondidas sem evasão.
- **CTA esperado:** avanço para o CTA final.

### 3.18 CTA final

**Copy:**

> **O Acervo Enfermeiro está organizado. As vagas do Plano Fundador, não são ilimitadas.**
>
> Garanta acesso agora, com garantia de 7 dias e sem assinatura automática.
>
> [Garantir minha vaga no Plano Fundador]

- **Objetivo psicológico:** última chance de conversão para quem leu a página inteira e ainda não decidiu — reforça escassez real (não fictícia) e remove o risco residual (garantia) na mesma respiração.
- **Objeção combatida:** procrastinação da decisão ("depois eu vejo").
- **CTA esperado:** clique final para checkout.

### 3.19 Rodapé

**Copy:**

> SimulaPro — Banco de questões oficiais para concursos de Enfermagem.
>
> [Termos de Uso] · [Política de Privacidade] · [Política de Reembolso] · [Contato]
>
> © SimulaPro. Todas as questões pertencem às respectivas bancas organizadoras e são utilizadas para fins de estudo.

- **Objetivo psicológico:** encerramento institucional — transmite seriedade e conformidade legal básica, sem tentar vender de novo.
- **Objeção combatida:** dúvidas residuais sobre legitimidade/propriedade do conteúdo (relevante dado que as questões pertencem originalmente às bancas).
- **CTA esperado:** nenhum — é a única seção da página sem chamada à ação, por design.

---

## 4. Contrapontos de CRO (onde a prática padrão de mercado foi deliberadamente evitada)

1. **Sem contador regressivo (countdown timer).** É a tática mais comum de landing pages de infoproduto e a mais associada, por este público específico, a pressão vazia. Vagas limitadas reais já criam urgência genuína — um timer fictício por cima disso destruiria exatamente a confiança que a ausência de cobrança automática está construindo.
2. **Sem prova social fabricada.** Não há depoimentos, número de alunos ou selos de "aprovados" nesta versão da Landing — porque não existem ainda (`01-GO_LIVE.md`: 1 usuário no sistema). Uma seção de depoimentos vazia ou inventada seria pior que a ausência da seção. Ela deve ser adicionada como uma nova seção **somente quando houver depoimentos reais** da Onda A.
3. **Sem imagem de banco de imagens.** Fotos genéricas de "profissional de saúde sorrindo" são o padrão do setor e não diferenciam nada — a prova visual desta página é o próprio produto (seção 3.9), não uma composição de estoque.
4. **O comparativo (3.8) nomeia os concorrentes reais.** A tentação segura seria falar genericamente em "outras plataformas". Nomear QConcursos, TEC, Gran e Estratégia é mais arriscado, mas também mais convincente — o público já pesquisa exatamente esses nomes, e uma página que finge não saber disso perde credibilidade instantânea com quem já é comprador experiente desse mercado (`02-PLANS.md`, seção 2.1).
5. **A ausência de trial gratuito é tratada como fato a ser compensado, não escondido.** Em vez de omitir que não há período gratuito (o que geraria surpresa negativa no checkout), a página compensa isso ativamente com demonstração visual (3.9) e garantia (3.16) — a objeção é antecipada, não evitada.
6. **O preço não aparece nesta Landing como número fixo.** Por decisão de `03-PRICING.md`, o valor exato do Plano Fundador deve ser testado no lançamento real, não fossilizado permanentemente num documento de arquitetura. A Landing referencia "condição do Plano Fundador" e direciona ao checkout (`05-CHECKOUT.md`) para o valor específico — evita que este documento se torne desatualizado assim que o preço for calibrado com dados reais da Onda A.

---

## 5. Checklist de implementação (para quem for montar a página de fato)

- [ ] Nenhuma das seis frases proibidas (seção 0) aparece em nenhum texto final, incluindo variações de metatags e anúncios
- [ ] Toda captura de tela usada na seção "Demonstração do fluxo" é do produto real, não mockup ilustrativo genérico
- [ ] O número de vagas do Plano Fundador exibido é o número real definido operacionalmente (não "esgotando" ou "poucas vagas" vago)
- [ ] O valor do Plano Fundador é inserido a partir da calibração real feita no lançamento (`03-PRICING.md`, seção 6), não antes
- [ ] FAQ cobre, no mínimo, as seis perguntas obrigatórias listadas no briefing — nenhuma pode ficar sem resposta direta
- [ ] Seção de depoimentos/prova social só é adicionada quando houver depoimentos reais coletados na Onda A
- [ ] Todos os nomes de banca citados (seção 3.10) são revalidados contra o Acervo real antes da publicação, para não desatualizar se o conjunto de bancas mudar

---

*Próximo documento: `05-CHECKOUT.md` — aguardando validação desta Landing Page.*
