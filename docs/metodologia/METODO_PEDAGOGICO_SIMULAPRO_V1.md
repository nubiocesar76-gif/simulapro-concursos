# MÉTODO PEDAGÓGICO SIMULAPRO V1

> Capítulo 1 (Missão) já concluído em documento próprio e não é alterado, reproduzido ou resumido aqui. Este arquivo contém exclusivamente o Capítulo 2.

---

## CAPÍTULO 2 — ESTRUTURA PEDAGÓGICA

### 2.1 Princípio fundamental deste capítulo

O SimulaPro não é um banco de questões. É um sistema de aprendizagem em que questões são instrumento, não produto. Toda decisão estrutural deste capítulo decorre de uma única pergunta: **qual estrutura permite medir e construir domínio de conceito de forma confiável, estável e escalável?** — não "qual estrutura é mais fácil de navegar" nem "qual estrutura espelha o edital".

A estrutura de conteúdo do SimulaPro assenta sobre um princípio que separa dois eixos que são frequentemente confundidos em produtos de preparação para concursos:

- **Eixo de Conteúdo (Ontologia de Domínio):** o que existe para ser aprendido. É estável, cumulativo e **independente de banca**.
- **Eixo de Avaliação (Contexto de Prova):** como e por quem aquele conteúdo é cobrado. É variável, específico de cada banca e de cada concurso.

Toda a estrutura pedagógica do SimulaPro decorre de manter esses dois eixos **separados e relacionados**, nunca fundidos em uma única cadeia hierárquica.

### 2.2 Por que uma estrutura linear única (Concurso → Banca → Disciplina → Assunto → Conceito → Questões) é insuficiente

Uma cadeia linear única, em que Disciplina/Assunto/Conceito nascem *dentro* de uma Banca, apresenta três falhas técnicas do ponto de vista pedagógico:

1. **Fragmenta o domínio de conceito.** Se o Conceito é filho estrutural da Banca, o domínio que um aluno constrói sobre um conceito fica preso ao contexto daquela banca. O mesmo conhecimento estudado em outra banca é tratado pelo sistema como outra coisa. Isso contradiz diretamente o princípio de que o progresso é medido por domínio de conceito: domínio de conceito só é uma métrica coerente se o conceito for uma unidade **estável e reconhecível**, não uma unidade que se multiplica a cada banca.

2. **Duplica esforço editorial sem necessidade.** Se cada banca exige uma árvore própria de Disciplina/Assunto/Conceito, cada nova banca reinicia a modelagem pedagógica do zero, mesmo quando 80–90% do conhecimento envolvido (fisiologia, farmacologia, legislação do SUS, processo de enfermagem etc.) é idêntico entre bancas. Isso é diretamente contrário ao princípio de "cada banca construída completamente antes da próxima": a ordem de construção (IBFC → FGV → CEBRASPE → VUNESP) só gera valor cumulativo real se o trabalho pedagógico de uma banca **beneficiar** a próxima, não se cada banca for um recomeço isolado.

3. **Ignora um eixo inteiro: o Cargo.** Uma disciplina como "Fundamentos de Enfermagem" só é relevante para determinados cargos; os conteúdos específicos de "Enfermeiro" e de "Técnico em Enfermagem", mesmo dentro do mesmo concurso e da mesma banca, divergem estruturalmente. Uma estrutura que não reconhece Cargo como eixo próprio inevitavelmente precisará de exceções e remendos conceituais assim que o catálogo crescer.

Há também uma inconsistência de cardinalidade na ordem apresentada: uma Banca organiza muitos Concursos ao longo do tempo; um Concurso não organiza Bancas. `Concurso` acima de `Banca` só faz sentido como caminho de seleção do aluno (ele escolhe o concurso-alvo, o sistema infere a banca), nunca como relação de posse de conteúdo.

### 2.3 A estrutura proposta

O conteúdo do SimulaPro é organizado em **dois eixos relacionados**, não em uma cadeia única.

**Eixo de Conteúdo — a ontologia de domínio (banca-agnóstica):**

```
Área de Atuação
   └── Cargo
          └── Disciplina
                 └── Assunto
                        └── Conceito
```

**Eixo de Avaliação — o contexto de prova (banca-específico):**

```
Banca
   └── Concurso (edital específico, com data, cargo e instituição)
          └── Questão
```

**Ponto de junção — a Questão:**

Toda Questão pertence a exatamente um Concurso (e, por herança, a uma Banca) **e** testa um ou mais Conceitos do eixo de conteúdo. A Questão é o único ponto do sistema em que os dois eixos se encontram. Ela carrega a proveniência (de que banca, de que concurso, de que ano, de que cargo veio) e, ao mesmo tempo, aponta para o(s) conceito(s) que efetivamente avalia.

Isso significa, na prática:

- O **conceito** "Mecanismo de ação de fármacos vasoativos" existe uma única vez no sistema.
- Ele pode ser testado por uma questão da IBFC, outra da FGV e outra da CEBRASPE — três Questões diferentes, um Conceito só.
- O domínio do aluno sobre esse conceito é uma métrica única, que se constrói (e se mede) independentemente de qual banca forneceu a questão que o exercitou.

### 2.4 Definição de cada camada

**Área de Atuação** — o macro-domínio profissional (ex.: Enfermagem). É o nível mais estável de todos; muda apenas quando o SimulaPro decide entrar em uma nova área de atuação inteira, o que é uma decisão de produto de longuíssimo prazo, não uma decisão editorial recorrente.

**Cargo** — a função/especialidade dentro da área de atuação (ex.: Enfermeiro, Técnico em Enfermagem). Determina quais Disciplinas e Assuntos são relevantes e com que peso. Um mesmo Concurso pode conter múltiplos Cargos; cada Cargo tem sua própria trilha de conteúdo dentro da mesma Área de Atuação.

**Disciplina** — grande campo de conhecimento dentro do cargo (ex.: Farmacologia, Legislação do SUS, Fundamentos de Enfermagem). É o nível de organização que um especialista de conteúdo reconheceria como "matéria".

**Assunto** — subdivisão temática dentro da disciplina (ex.: Fármacos vasoativos e inotrópicos). É o nível em que normalmente um edital de concurso já discrimina o conteúdo programático.

**Conceito** — a unidade atômica de conhecimento, testável e mensurável (ex.: "Diferença entre efeito inotrópico e efeito vasopressor"; "Mecanismo de ação da dobutamina"). É a unidade real de aprendizagem e a unidade real de medição de domínio. Especificação de granularidade no item 2.6.

**Banca** — a instituição organizadora (ex.: CEBRASPE, IBFC, FGV, VUNESP). Não é dona de conteúdo pedagógico; é dona de **contexto de avaliação** — estilo de prova, formato de item, tradição de construção de distratores.

**Concurso** — a instância concreta de um processo seletivo organizado por uma Banca (ex.: EBSERH 2018), com edital, data de aplicação, cargos ofertados e gabarito próprios. É filho de Banca, nunca o contrário.

**Questão** — o artefato concreto extraído de um Concurso real, vinculado a exatamente uma Banca/Concurso/Cargo e a um ou mais Conceitos do eixo de conteúdo. Nunca é criada sem lastro em prova oficial (conforme já praticado na produção editorial do acervo).

### 2.5 Como a escolha de banca opera sobre essa estrutura

A decisão já aprovada de que **o aluno escolhe uma banca e, durante aquele plano de estudos, estuda exclusivamente aquela banca** é mantida de forma absoluta — e fica, com esta estrutura, mais fácil de garantir, não mais difícil.

A escolha de banca funciona como um **filtro de aplicação** sobre o eixo de conteúdo:

1. O aluno escolhe o Concurso-alvo (ou a Banca, se ainda não houver concurso específico definido).
2. O sistema restringe o universo de Questões elegíveis para aquele plano exclusivamente às Questões daquela Banca (nunca havendo mistura automática de bancas dentro do mesmo plano — regra absoluta, sem exceção).
3. O eixo de conteúdo (Disciplina → Assunto → Conceito) permanece o mesmo por trás da cena — o que muda é **quais questões estão disponíveis para exercitar cada conceito** e, potencialmente, **qual o peso/prioridade de cada conceito** dentro daquela banca específica (um conceito muito cobrado pela CEBRASPE pode ser pouco cobrado pela VUNESP; isso é uma característica do concurso, não do conceito).

Essa separação garante duas coisas simultaneamente, que na estrutura linear original eram mutuamente exclusivas:

- **Isolamento total de banca durante o estudo** (decisão já aprovada, preservada sem ressalva).
- **Domínio de conceito como métrica estável e portátil** (decisão já aprovada, agora efetivamente possível de cumprir).

### 2.6 O Conceito como unidade central de domínio

Como o progresso é medido por domínio de conceito — nunca por quantidade de questões —, o Conceito precisa obedecer a regras de qualidade que o tornem uma unidade de medição confiável:

- **Granularidade correta.** Um Conceito não pode ser tão amplo que se torne inmensurável (ex.: "Farmacologia" inteira não é um conceito) nem tão estreito que se confunda com uma única questão (ex.: "resposta da questão 42 da prova X" não é um conceito). O teste prático: um Conceito é uma afirmação de conhecimento que pode ser verdadeira ou falsa, aplicável, e reconhecível por um especialista da área como uma unidade coerente de saber.

- **Testabilidade múltipla e diversificada.** Um Conceito só deve ser considerado "com domínio confiavelmente medido" quando testado por mais de uma Questão, idealmente de mais de uma fonte/redação. Isso é o mecanismo concreto que faz cumprir, na prática, a decisão de que "o aluno aprende conceitos, nunca aprende respostas": se o domínio dependesse de uma única questão, o aluno estaria, na prática, aprendendo a resposta daquela questão específica, não o conceito.

- **Sinalização de evidência insuficiente.** Quando um Conceito tiver apenas uma Questão associada no acervo, o sistema deve tratar o domínio medido sobre ele como não confiável/insuficientemente testado, e não como domínio pleno. Isso não impede o uso editorial daquela questão — impede apenas que o sistema afirme domínio consolidado com base em uma amostra única.

- **Relações de pré-requisito.** Conceitos não formam apenas uma lista plana dentro de um Assunto — alguns dependem de outros para fazer sentido (ex.: não há domínio real de "farmacocinética de vasopressores" sem domínio prévio de "fisiologia cardiovascular básica"). O eixo de conteúdo deve permitir que Conceitos declarem pré-requisitos entre si, mesmo que essas relações sejam mapeadas progressivamente e não precisem existir por completo desde o primeiro lote de conteúdo. Esta é a base conceitual que viabiliza, em capítulos futuros, uma trilha de aprendizagem verdadeiramente adaptativa — não apenas uma lista de tópicos marcados como "concluído".

### 2.7 Como a ordem de construção por banca se beneficia desta estrutura

A ordem já decidida — IBFC, depois FGV, depois CEBRASPE, depois VUNESP, cada uma construída por completo antes da próxima — ganha um efeito cumulativo real nesta estrutura, que não existiria na estrutura linear original:

- Ao construir a cobertura completa da IBFC, o trabalho editorial cria e refina o eixo de conteúdo (Disciplina → Assunto → Conceito) para toda a Área de Atuação/Cargo em questão.
- Ao iniciar a FGV, esse eixo de conteúdo já existe e já foi validado contra uma banca real. O trabalho da FGV concentra-se em **anexar novas Questões aos Conceitos já existentes** (e, quando necessário, refinar ou adicionar Conceitos que a IBFC não havia exercitado) — não em reconstruir a árvore de conhecimento do zero.
- O mesmo se repete para CEBRASPE e VUNESP. Cada banca subsequente é estruturalmente mais rápida de construir que a anterior, porque herda a ontologia de conteúdo já validada, e contribui apenas com o que lhe é próprio: suas Questões e o contexto de avaliação que as acompanha.
- Nenhuma banca "é dona" de um Conceito. Todas as bancas **testam** os mesmos Conceitos, cada uma a seu modo — o que é, tecnicamente, precisamente o que significa "bancas diferentes cobrando o mesmo domínio de conhecimento de formas diferentes".

### 2.8 O que este capítulo não define

Este capítulo define exclusivamente a estrutura pedagógica de conteúdo. Não define:

- Como essa estrutura é implementada tecnicamente (armazenamento, modelagem de dados, APIs).
- Como o aluno navega ou visualiza essa estrutura em tela.
- Como o sistema decide, dentro dessa estrutura, o que apresentar ao aluno em cada sessão de estudo (isso é matéria de um capítulo futuro sobre algoritmo de aprendizagem adaptativa e repetição espaçada).
- Como o Conceito é redigido, revisado ou aprovado pela equipe editorial (matéria de um capítulo futuro sobre fluxo editorial).

Essas definições pertencem a capítulos posteriores deste documento.

---

## CAPÍTULO 3 — DOMÍNIO DE CONHECIMENTO

### 3.1 Por que percentual de acertos não é domínio

Antes de definir o que o SimulaPro usa, é necessário registrar formalmente por que a métrica mais comum do mercado — percentual de acertos — é rejeitada como definição de domínio:

1. **Não corrige adivinhação.** Toda questão de múltipla escolha tem uma probabilidade de acerto ao acaso (50% em Certo/Errado; 20–25% em questões de 4–5 alternativas). Um percentual bruto não distingue um acerto por conhecimento de um acerto por sorte, e trata formatos com probabilidades de acerto ao acaso diferentes como se fossem equivalentes.
2. **Não corrige descuido.** Um erro isolado após uma sequência consistente de acertos é evidência fraca de não-domínio — pode ser desatenção pontual (*slip*), não ausência de conhecimento.
3. **Não tem memória temporal.** Um acerto recente e um acerto antigo pesam igual numa média histórica, tornando impossível representar esquecimento.
4. **Não pondera dificuldade.** Acertar um item difícil é evidência mais forte de domínio do que acertar um item fácil; a média bruta ignora essa diferença.
5. **Não diferencia "pouco testado" de "dominado".** Uma única resposta correta já produz 100%, contrariando a exigência (Capítulo 2, item 2.6) de que evidência única nunca configure domínio confiável.
6. **É gamável por memorização de item específico** — o padrão exato que a missão do produto (Capítulo 1) e a decisão "o aluno aprende conceitos, nunca respostas" existem para impedir.

Por essas razões, o SimulaPro não usa percentual de acertos como definição de domínio. Usa um modelo de **confiança de domínio construída por evidência**, descrito a seguir.

### 3.2 Definição de Domínio

**Domínio** é o grau de confiança, atualizado continuamente, de que o aluno é capaz de aplicar corretamente um Conceito quando este for cobrado — em qualquer formato, em qualquer redação, após qualquer intervalo de tempo razoável desde o último contato.

Domínio não é um número fixo obtido de uma vez. É uma **estimativa viva**, chamada aqui de **Confiança de Domínio**, que:

- aumenta quando o aluno demonstra conhecimento de forma consistente e variada;
- aumenta menos quando a evidência é fraca (formato com alta chance de acerto ao acaso, item fácil, poucas repetições);
- diminui com o tempo sem reforço, mesmo sem nenhum novo erro (representando esquecimento natural);
- cai de forma mais acentuada diante de um erro do que sobe diante de um acerto isolado, porque um erro é sinal direto de falha de recuperação, enquanto um acerto isolado ainda pode ser sorte.

A Confiança de Domínio é sempre acompanhada de um segundo componente, tão importante quanto o primeiro: a **quantidade e a qualidade da evidência já observada**. Um conceito nunca é classificado como dominado com base em pouca evidência, independentemente de quão positiva essa evidência seja.

### 3.3 Evidência: o que conta e o que pesa mais

Cada resposta do aluno a uma Questão vinculada a um Conceito é um evento de evidência. Nem toda evidência vale o mesmo. Fatores que determinam o peso de uma evidência:

- **Correção da resposta** (acerto ou erro) — o fator primário, mas nunca isolado.
- **Chance de acerto ao acaso do formato da questão** — um acerto em uma questão Certo/Errado (50% de chance ao acaso) é evidência mais fraca de domínio do que um acerto em uma questão de 5 alternativas (20% de chance ao acaso). Isso vale simetricamente: um erro em um formato de baixa chance ao acaso é evidência mais forte de não-domínio do que um erro em um formato de alta chance ao acaso.
- **Dificuldade histórica do item** — itens que a maioria dos alunos acerta contam menos como evidência de domínio do que itens que a maioria erra.
- **Tempo decorrido desde a última evidência sobre aquele conceito** — evidência recente pesa mais do que evidência antiga; evidência muito antiga, sem reforço, deixa de sustentar sozinha uma classificação de domínio, mesmo que tenha sido positiva quando ocorreu.
- **Consistência com o histórico** — uma resposta que confirma o padrão já observado reforça a confiança; uma resposta que contradiz o padrão (ex.: erro após vários acertos) reduz a confiança mais do que um evento isolado equivalente reduziria uma média simples, porque contradição é sinal de instabilidade do conhecimento, não apenas um dado a mais.
- **Variedade da fonte** — evidência vinda de questões com redações diferentes entre si vale mais do que evidência repetida sobre itens muito parecidos, porque reduz a chance de o aluno estar reconhecendo o padrão da questão em vez de aplicando o conceito.

### 3.4 Estados do Conceito

Cada Conceito, para cada aluno, existe em um destes estados, determinados pela combinação de Confiança de Domínio e quantidade/qualidade de evidência acumulada — nunca por um número isolado:

1. **Não Iniciado** — nenhuma evidência registrada.
2. **Em Aprendizagem** — evidência inicial existe, mas é insuficiente em quantidade e/ou variedade para sustentar qualquer afirmação de domínio. Mesmo uma sequência curta de acertos mantém o conceito neste estado.
3. **Em Consolidação** — a Confiança de Domínio está subindo de forma consistente e já há evidência suficiente em quantidade e variedade para começar a confiar no sinal, mas ainda não no nível exigido para Domínio Demonstrado.
4. **Domínio Demonstrado** — a Confiança de Domínio atingiu e se manteve acima do limiar exigido, sustentada por evidência suficiente, variada e sem contradições recentes não resolvidas.
5. **Em Risco de Esquecimento** — o conceito já alcançou Domínio Demonstrado no passado, mas o tempo sem reforço fez a Confiança de Domínio projetada cair, aproximando-se do limiar mínimo. Nenhum novo erro ocorreu — é uma previsão de esquecimento, não uma constatação.
6. **Requer Reaprendizagem (Regressão)** — uma nova evidência negativa (ou a Confiança de Domínio projetada caindo abaixo do limiar mínimo) reverteu a classificação de um conceito que já havia sido dominado.

A transição entre estados nunca é instantânea a partir de um único evento em nenhuma direção — nem para cima (um acerto isolado não promove um conceito a Domínio Demonstrado) nem, com uma ressalva importante, para baixo: um único erro após domínio consistente move o conceito para Em Risco de Esquecimento com reavaliação prioritária, não direto para Requer Reaprendizagem — essa distinção existe precisamente para não confundir descuido pontual com esquecimento real (ver 3.7).

### 3.5 Como o sistema identifica aprendizagem real (e não familiaridade com o item)

Aprendizagem real é evidenciada por **recuperação bem-sucedida após intervalo**, não por repetição imediata. Um acerto logo após o primeiro contato com um conceito prova menos do que um acerto obtido depois de algum tempo, com alguma chance real de esquecimento já presente — esse é o efeito de teste (testing effect), amplamente documentado na literatura de aprendizagem, e é usado aqui como princípio orientador, não como fórmula:

- Repetição imediata do mesmo conceito, na mesma sessão, é tratada como reforço de curto prazo, não como evidência forte de domínio.
- Acerto após intervalo, especialmente em uma questão de redação diferente das já vistas, é a evidência mais valiosa que existe para o sistema.
- Um conceito só é elegível para Domínio Demonstrado quando pelo menos parte de sua evidência positiva vier de contextos espaçados no tempo, não apenas de uma sequência concentrada de acertos na mesma sessão.

### 3.6 Como medir evolução ao longo do tempo

Domínio não é reportado como um número único e sim como uma **trajetória**: a sequência de estados e de Confiança de Domínio de um conceito ao longo do tempo. Isso permite distinguir situações que uma métrica estática jamais distingue:

- um conceito que está subindo de forma consistente, mesmo que ainda não tenha atingido Domínio Demonstrado;
- um conceito que atingiu Domínio Demonstrado e está estável;
- um conceito que atingiu Domínio Demonstrado, mas está em declínio silencioso (Em Risco de Esquecimento) por falta de reforço;
- um conceito que regrediu de fato após um erro real (Requer Reaprendizagem).

A evolução do aluno como um todo é a agregação dessas trajetórias por Disciplina, Assunto e Cargo — nunca uma média simples de acertos entre todos os conceitos, pelo mesmo motivo do item 3.1: uma média esconderia exatamente as distinções que este capítulo existe para preservar.

### 3.7 Quando um conceito retorna para revisão

Um conceito retorna à fila de revisão quando sua Confiança de Domínio, projetada no tempo, se aproxima do limiar mínimo de domínio — antes de efetivamente cruzá-lo, sempre que possível. O objetivo é revisar um pouco antes do esquecimento previsto, não depois dele. Isso segue o princípio da repetição espaçada: o intervalo até a próxima revisão de um conceito **aumenta** quando o histórico de domínio é forte e consistente, e **diminui** quando o histórico é recente, instável ou baseado em pouca evidência.

Casos que disparam retorno à fila de revisão:

- Confiança de Domínio projetada caindo em direção ao limiar mínimo (revisão preventiva, sem erro novo).
- Um erro real em um conceito anteriormente em Domínio Demonstrado (revisão corretiva, prioridade mais alta que a preventiva).
- Um conceito em Em Aprendizagem ou Em Consolidação cuja última evidência já está distante no tempo, mesmo sem ainda ter atingido Domínio Demonstrado — para não perder o progresso parcial já construído.

### 3.8 Quando um conceito deixa de ser prioridade

É necessário separar dois construtos que a especificação anterior costuma confundir: **domínio** (o quanto o aluno sabe) e **prioridade de estudo** (o que deve ser mostrado a seguir, dado tempo limitado). São relacionados, mas não são a mesma coisa.

Um conceito deixa de ser prioridade imediata quando:

- atingiu Domínio Demonstrado **e** sua Confiança de Domínio projetada permanece acima do limiar por um horizonte de tempo razoável (ou seja, não está em risco de esquecimento no curto prazo);
- ou, mesmo sem domínio pleno, tem peso/incidência muito baixo para a banca escolhida naquele plano de estudos (critério já estabelecido no Capítulo 2 — a banca influencia prioridade, nunca o conteúdo do conceito em si), e existem outros conceitos com maior retorno esperado para o tempo de estudo disponível.

Um conceito sair da prioridade não significa que ele é esquecido pelo sistema: ele permanece sob observação passiva, e volta automaticamente à prioridade ativa assim que sua Confiança de Domínio projetada indicar risco (item 3.7) ou assim que se tornar pré-requisito de um novo conceito que o aluno esteja prestes a estudar.

### 3.9 Como lidar com regressão (o aluno esqueceu)

Regressão é tratada como informação legítima sobre o estado atual do conhecimento, não como um "erro do sistema" a ser descartado. Princípios:

- Um único erro após domínio consistente não apaga o histórico anterior nem reinicia o conceito do zero. O conceito é reclassificado para Em Risco de Esquecimento (se o padrão amplo ainda for positivo) ou Requer Reaprendizagem (se o padrão recente indicar perda real, não um deslize isolado) — a distinção depende de quantas evidências recentes confirmam ou contrariam o domínio anterior, nunca de um único evento isolado.
- Reaprendizagem parte de uma base diferente de aprendizagem inicial. Um conceito que já foi dominado uma vez e regrediu tende a ser reconquistado mais rapidamente do que foi aprendido da primeira vez — esse efeito (conhecido na literatura como economia de reaprendizagem) deve ser refletido na velocidade com que a Confiança de Domínio se recupera diante de evidência nova positiva, que é mais rápida do que a velocidade de construção da confiança original.
- Regressão detectada em um conceito que é pré-requisito de outros já estudados deve reabrir a prioridade desses conceitos dependentes para revisão, não apenas do conceito que regrediu isoladamente — domínio de um conceito dependente presume domínio ativo do pré-requisito, não apenas domínio histórico dele.

### 3.10 Como o algoritmo decide o próximo conceito a estudar

Esta seção define **princípios de priorização**, não um procedimento técnico. A ordem de decisão, da mais alta para a mais baixa prioridade:

1. **Revisão corretiva** — conceitos com erro real recente em domínio previamente demonstrado (3.7, segundo caso). É a situação de maior risco de perda de conhecimento já consolidado, e por isso tem prioridade máxima.
2. **Revisão preventiva** — conceitos cuja Confiança de Domínio projetada está se aproximando do limiar mínimo, mesmo sem erro novo (3.7, primeiro caso). Prioridade alta, mas abaixo da corretiva, porque ainda é preventiva.
3. **Continuidade de aprendizagem em curso** — conceitos em Em Aprendizagem ou Em Consolidação, priorizados por proximidade de atingir Domínio Demonstrado e por relevância (peso/incidência) na banca escolhida.
4. **Novo conceito** — conceitos em Não Iniciado, elegíveis somente quando seus pré-requisitos (Capítulo 2, item 2.6) já estiverem, no mínimo, em Em Consolidação. Entre múltiplos candidatos elegíveis, prioriza-se pelo peso/incidência do conceito na banca escolhida para aquele plano.

Três princípios adicionais atravessam todas as camadas acima:

- **Intercalação (interleaving).** O sistema nunca deve concentrar múltiplas questões seguidas sobre o mesmo conceito na mesma sessão além do estritamente necessário para a evidência inicial — misturar conceitos e disciplinas dentro de uma sessão produz evidência de domínio mais confiável do que blocos maciços do mesmo assunto, mesmo quando isso parece, à primeira vista, menos eficiente.
- **Respeito absoluto ao filtro de banca.** Toda priorização acontece exclusivamente dentro do universo de Questões da banca escolhida para aquele plano de estudos. Nenhum critério de priorização, por mais forte que seja (nem mesmo revisão corretiva), justifica o uso de uma questão de outra banca.
- **Nunca aleatoriedade pura.** A ordem de apresentação pode ter variação para evitar previsibilidade mecânica, mas a seleção de qual conceito estudar nunca é aleatória entre os candidatos elegíveis — é sempre resultado da priorização acima.

### 3.11 O que este capítulo não define

Este capítulo define o que é domínio, como ele evolui e quais princípios guiam a priorização de estudo. Não define:

- Fórmulas, algoritmos, parâmetros numéricos ou limiares exatos.
- Como esses estados são armazenados, calculados ou exibidos tecnicamente.
- Como o aluno visualiza seu progresso em tela.
- Como a equipe editorial define o peso/incidência de um conceito por banca (matéria de capítulo futuro sobre fluxo editorial).

Essas definições pertencem a capítulos posteriores ou a especificações técnicas fora deste documento.

---

## CAPÍTULO 4 — MOTOR DE APRENDIZAGEM

### 4.1 Natureza do Motor de Aprendizagem

O Motor de Aprendizagem é o comportamento contínuo que transforma o modelo de domínio (Capítulo 3) em experiência de estudo real. Ele não escolhe "a próxima pergunta" — ele decide o que o aluno precisa vivenciar a seguir para que sua Confiança de Domínio avance de forma genuína, e só então seleciona, dentro do universo de Questões da banca escolhida, o item que melhor representa essa decisão.

Duas restrições atravessam todo comportamento descrito neste capítulo, por serem decisões já definitivas:

- O Motor de Aprendizagem é **regras explicáveis**, não um modelo opaco de recomendação. Toda decisão que ele toma deve ser justificável em termos dos conceitos definidos no Capítulo 3 — nunca "porque o sistema achou".
- O Motor de Aprendizagem **nunca usa Inteligência Artificial em tempo real durante o estudo**. IA é ferramenta exclusiva da equipe editorial, na produção de conteúdo — não na condução da sessão do aluno. Personalização, neste documento, significa a aplicação das mesmas regras ao histórico individual de cada aluno, produzindo trajetórias diferentes porque os alunos são diferentes — nunca regras diferentes ou imprevisíveis entre alunos.

### 4.2 Como o motor escolhe o próximo conceito

A ordem de prioridade entre conceitos já está definida no Capítulo 3 (item 3.10): revisão corretiva, revisão preventiva, continuidade de aprendizagem em curso, novo conceito — sempre respeitando pré-requisitos e peso/incidência da banca escolhida. O Motor de Aprendizagem aplica essa ordem continuamente, não apenas no início de uma sessão: a cada nova evidência registrada, a lista de candidatos e sua ordem podem mudar, e a próxima decisão do motor reflete o estado mais atual possível do domínio do aluno — nunca um plano fixo, decidido uma vez e seguido cegamente até o fim da sessão.

O que este capítulo acrescenta ao Capítulo 3 é o comportamento de **composição**: como múltiplos conceitos priorizados se tornam uma sessão de estudo coerente, e não uma fila mecânica processada em ordem estrita — questão essa que as seções seguintes detalham.

### 4.3 Alternância de assuntos e prevenção de fadiga

O motor nunca concentra exposição prolongada a uma única disciplina ou assunto além do necessário para produzir evidência inicial sobre um conceito. Intercalar disciplinas e assuntos dentro de uma mesma sessão é o comportamento padrão, não uma exceção — inclusive quando isso significa alternar entre um conceito em revisão corretiva e um conceito totalmente novo em sequência. Essa alternância existe por dois motivos que se reforçam: produz evidência de domínio mais confiável (retomar um conceito após pensar em outra coisa é uma forma de espaçamento, mesmo dentro da mesma sessão) e mantém o nível de atenção do aluno mais estável ao longo do tempo de estudo.

A alternância tem, porém, um limite inferior e um limite superior. Trocar de assunto a cada item isoladamente, sem permitir nenhuma sequência de raciocínio contínuo, prejudica a formação de repertório tanto quanto insistir demais em um único assunto — o motor busca um ritmo de alternância que mantenha o aluno engajado sem fragmentar o raciocínio a ponto de nenhum assunto ganhar tração.

Fadiga é reconhecida por sinais comportamentais observáveis ao longo de uma sessão — tempo de resposta crescente, desempenho em queda mesmo em conceitos já consolidados, sinais de que o aluno está "insistindo" contra um conceito que não está avançando. Diante desses sinais, o comportamento correto do motor não é continuar insistindo no mesmo conceito na mesma sessão — é rotacionar para uma disciplina diferente, priorizar momentaneamente revisão de conceitos já fortes (para que a sessão não termine em sensação de fracasso) e, se os sinais persistirem, sinalizar o encerramento da sessão como recomendável. Retomar, à força, um conceito que está gerando fadiga dentro da mesma sessão é tratado como comportamento indesejado do motor, não como persistência positiva — o conceito deve esperar por uma sessão futura, com o espaçamento a seu favor, não ser forçado no mesmo momento de esgotamento.

### 4.4 Quando revisar

As condições que disparam retorno de um conceito à revisão já estão definidas no Capítulo 3 (item 3.7). O comportamento que este capítulo acrescenta é como isso se manifesta na experiência do aluno: revisão nunca é um modo separado que o aluno precisa ativar manualmente — ela é tecida dentro do fluxo normal de estudo, priorizada de acordo com a ordem do item 4.2. O aluno não distingue, na prática, entre "estudar algo novo" e "revisar algo antigo" como dois modos diferentes de uso do produto; distingue apenas porque o próprio conteúdo do que aparece muda — o motor está protegendo domínio já conquistado com a mesma naturalidade com que constrói domínio novo.

Quando o volume de conceitos devidos para revisão excede o que é razoável apresentar em uma única sessão, o motor distribui essa carga ao longo de múltiplas sessões futuras em vez de concentrar tudo de uma vez — protegendo a prioridade mais alta (evitar esquecimento) sem transformar toda sessão em uma sessão exclusiva de revisão.

### 4.5 Como identifica que um aluno está estagnado

Estagnação é diferente de "ainda não aprendeu" — todo conceito passa um tempo em Em Aprendizagem antes de evoluir, e isso é esperado, não um problema. Estagnação é a **ausência de tendência de melhora** em um conceito ao longo de múltiplas oportunidades espaçadas no tempo, apesar de exposição e pré-requisitos adequados. Repetição dentro de uma única sessão nunca é suficiente para caracterizar estagnação — exatamente pelo mesmo motivo pelo qual repetição massiva não é suficiente para caracterizar domínio (Capítulo 3, item 3.5): ambas as situações exigem evidência espaçada, não concentrada.

Diante de estagnação identificada, o comportamento do motor não é repetir a mesma abordagem que já não funcionou. É:

- Verificar se algum pré-requisito daquele conceito está, ele próprio, instável — estagnação em um conceito é, com frequência, sintoma de um conceito anterior mal consolidado, não um problema isolado do conceito atual. Quando isso ocorre, a prioridade se desloca para trás, para o pré-requisito, antes de insistir no conceito estagnado.
- Variar a forma de exposição ao conceito — questões de redação, formato ou ângulo diferentes dos já tentados, em vez de mais do mesmo tipo de item que não produziu evolução.
- Reduzir a expectativa de ritmo para aquele conceito especificamente, sem abandoná-lo nem tampouco concentrar nele uma quantidade desproporcional da sessão — ele continua presente, com menor frequência, até que sinais de melhora reapareçam.

### 4.6 Como identifica evolução rápida

Evolução rápida é o padrão inverso: evidência forte, consistente e variada se acumula com menos exposições e em menos tempo do que o típico para aquele tipo de conceito. É importante distinguir isso de "poucos acertos em formato de baixa exigência" (Capítulo 3, item 3.3) — evolução rápida nunca dispensa a exigência de qualidade de evidência; ela significa apenas que evidência de boa qualidade apareceu mais cedo do que o esperado, não que o padrão de evidência exigido foi reduzido.

Diante de evolução rápida confirmada, o comportamento do motor é: parar de insistir em evidência adicional que já não agrega informação nova, avançar o conceito para a próxima etapa do domínio sem demora artificial, estender o intervalo até a próxima revisão preventiva (aprendizagem rápida e consistente tende a indicar retenção também mais sólida, mas essa suposição continua sendo verificada por evidência futura, nunca assumida de forma permanente) e liberar mais cedo o acesso a conceitos que dependem daquele como pré-requisito.

### 4.7 Como distribui conceitos fáceis, médios e difíceis

Dentro da trajetória de um único conceito, a exposição inicial favorece itens mais acessíveis — o objetivo é que o primeiro contato construa a compreensão básica do conceito, não que já teste seus limites. À medida que a evidência positiva se acumula e o conceito avança em direção à consolidação, a dificuldade dos itens apresentados aumenta, incluindo casos-limite e aplicações menos óbvias — é essa exposição a dificuldade crescente que efetivamente sustenta a passagem para Domínio Demonstrado, não apenas o acúmulo de acertos em itens fáceis.

Dentro de uma sessão, que mistura vários conceitos em estágios diferentes, o motor evita tanto concentrar apenas itens fáceis (o que produz falsa sensação de progresso sem desafio real) quanto concentrar apenas itens difíceis (o que produz frustração desproporcional ao início de uma sessão). A mistura de níveis de dificuldade dentro da mesma sessão é, ela própria, parte do mesmo princípio de intercalação descrito no item 4.3.

### 4.8 Como evita que o aluno decore perguntas

Este comportamento estende diretamente os princípios de evidência do Capítulo 3 (itens 3.3 e 3.5). O motor ativamente **rotaciona** entre as questões disponíveis para um mesmo conceito, priorizando variedade de redação sobre repetição do item exato — reencontrar a mesma questão, palavra por palavra, contribui muito menos para a Confiança de Domínio do que uma questão nova sobre o mesmo conceito, mesmo quando a resposta é a mesma.

Quando um conceito tem poucas questões disponíveis dentro da banca escolhida, o motor reconhece esse risco de memorização de item específico e se comporta de forma conservadora: o teto de confiança de domínio atingível apenas com aquele conjunto pequeno de itens é mais baixo do que seria com um conjunto amplo e variado, e essa limitação é tratada como sinal de cobertura de conteúdo insuficiente para aquele conceito — não como um problema do aluno, nem como algo a ser contornado emprestando questões de outra banca (ver item 4.11).

### 4.9 Como mantém o aluno sempre aprendendo

A cada sessão, o motor garante que sempre exista uma próxima ação relevante disponível — nunca "nada a fazer" e nunca "tudo empilhado de uma vez". Isso é o resultado direto de combinar, na proporção certa, revisão devida, conceitos em andamento e conceitos novos elegíveis (item 4.2), pacejados de forma que a sessão nunca seja nem trivialmente fácil (só revisão de coisas já muito fortes) nem esmagadora (só conceitos novos ou só revisões corretivas acumuladas).

Quando um aluno atinge um estado em que não há revisão devida nem conceito novo elegível — situação rara, geralmente de aluno muito avançado dentro daquela banca — o comportamento do motor não é deixá-lo sem sessão. É oferecer prática de enriquecimento sobre conceitos já fortes, em dificuldade crescente, mantendo o aluno em atividade produtiva até que nova prioridade surja naturalmente (por decaimento de confiança projetada ou por liberação de um novo conceito dependente).

### 4.10 Como adapta o estudo ao desempenho individual

A adaptação do SimulaPro não é uma escolha entre "conteúdo diferente para cada aluno" — é a aplicação consistente das mesmas regras de priorização, revisão, alternância e dificuldade (itens 4.2 a 4.9) sobre o histórico de evidência específico de cada aluno. Dois alunos estudando a mesma banca, o mesmo cargo, os mesmos conceitos, vivenciam sequências diferentes de estudo não porque o motor os trata de forma arbitrariamente diferente, mas porque o estado de domínio de cada um — construído pelas próprias respostas de cada um — é diferente. A adaptação é, portanto, sempre explicável: qualquer sequência apresentada a um aluno pode ser justificada apontando exatamente qual regra e qual evidência a produziram.

### 4.11 Como respeita a banca escolhida sem misturar outras bancas

Esta é a única restrição deste capítulo que nunca é flexibilizada por nenhum outro comportamento descrito acima — nem para resolver fadiga (4.3), nem para variar redação e evitar decoreba (4.8), nem para preencher uma sessão que ficaria vazia (4.9). Todo comportamento do Motor de Aprendizagem opera exclusivamente dentro do universo de Questões da banca escolhida para aquele plano de estudos.

Quando essa restrição entra em tensão com outro objetivo do motor — por exemplo, um conceito com poucas questões disponíveis naquela banca, o que limitaria a variedade necessária para evitar decoreba —, a restrição de banca sempre vence. A resposta correta a essa tensão nunca é buscar questões de outra banca; é reconhecer e sinalizar a limitação de cobertura editorial daquele conceito naquela banca especificamente (item 4.8), que é um problema de produção de conteúdo, não um problema a ser resolvido pelo comportamento do motor.

### 4.12 O que este capítulo não define

Este capítulo define o comportamento observável do Motor de Aprendizagem. Não define:

- Algoritmos, fórmulas, parâmetros ou limiares numéricos.
- Como esse comportamento é implementado tecnicamente.
- Como a interface apresenta essas decisões ao aluno.
- Como a equipe editorial identifica e resolve lacunas de cobertura de conteúdo sinalizadas pelo motor (matéria de capítulo futuro sobre fluxo editorial).

Essas definições pertencem a capítulos posteriores ou a especificações técnicas fora deste documento.

---

## CAPÍTULO 5 — METODOLOGIA EDITORIAL

### 5.1 Princípio fundante: consistência editorial é integridade estrutural, não estética

Os Capítulos 2, 3 e 4 assumem que o Conceito é uma unidade única, estável, banca-agnóstica e classificada de forma idêntica independentemente de quem a produziu. Essa premissa não é automática — ela é **produzida** pela metodologia editorial, ou não existe. Portanto, a primeira regra deste capítulo é o reconhecimento de que a inconsistência editorial não degrada a qualidade do produto; ela invalida a métrica de domínio, quebra o efeito cumulativo entre bancas e faz o motor de aprendizagem priorizar unidades irreais. Toda regra a seguir existe para proteger essa integridade, não para "padronizar por elegância".

Deste princípio decorre a distinção operacional central deste capítulo:

- O **Eixo de Conteúdo** (Área → Cargo → Disciplina → Assunto → Conceito) é construído **uma única vez** e pertence ao produto como um todo, não a uma banca. Ele é criado, expandido e refinado, mas nunca duplicado por banca.
- O **Eixo de Avaliação** (Banca → Concurso → Questão) é o que cada projeto de banca acrescenta: questões reais, vinculadas aos Conceitos já existentes, e o peso/incidência com que aquela banca cobra cada Conceito.

Quando um projeto de banca precisa criar um Conceito novo, ele o cria no Eixo de Conteúdo compartilhado — disponível para todas as bancas futuras — nunca em uma árvore privada da banca.

### 5.2 Como uma nova banca entra no SimulaPro

A entrada de uma banca é um projeto editorial com começo, meio e fim verificáveis, executado na ordem já decidida (IBFC, FGV, CEBRASPE, VUNESP), uma banca completa antes de iniciar a seguinte. As fases obrigatórias:

1. **Levantamento do acervo-fonte.** Mapeamento das provas oficiais existentes daquela banca para os cargos-alvo, com verificação de disponibilidade dos três documentos oficiais indispensáveis: edital, prova e gabarito definitivo (mais o documento de justificativas de anulação/alteração, quando existir). Nenhuma prova entra em produção sem esses documentos confirmados em fonte oficial.
2. **Caracterização inicial da banca.** Documentação preliminar do perfil de cobrança daquela banca (formato de item, estilo de distrator, profundidade típica, disciplinas mais e menos incidentes) — o embrião do Dossiê de Banca (item 5.14).
3. **Ancoragem ao Eixo de Conteúdo existente.** Cada questão é vinculada a Conceitos já existentes no Eixo de Conteúdo. Conceitos novos só são criados quando a banca cobra conhecimento ainda não representado — e são criados no eixo compartilhado, seguindo o protocolo de classificação (item 5.9).
4. **Produção supervisionada.** Transcrição fiel, descarte de anuladas, vinculação a Conceitos, redação de explicações — tudo sob os padrões de fidelidade e antifabricação (itens 5.5 e 5.10).
5. **Verificação de completude.** A banca só é declarada completa quando atende integralmente aos critérios do item 5.3.

### 5.3 Critérios para uma banca ser considerada "completa"

"Completo" não significa "todas as provas que já existiram foram importadas" — isso é um alvo móvel e inatingível. Significa que a banca atingiu **cobertura suficiente para sustentar a metodologia de domínio** para os cargos-alvo. Uma banca é completa quando, simultaneamente:

- **Cobertura de conceitos:** todos os Conceitos que aquela banca comprovadamente cobra (segundo o mapeamento de incidência de suas provas) existem no Eixo de Conteúdo e estão vinculados a questões reais daquela banca.
- **Testabilidade mínima por conceito:** cada Conceito relevante para a banca possui mais de uma questão daquela banca, de redações distintas, de modo que o motor de aprendizagem consiga medir domínio sem risco de decoreba de item (Capítulos 3 e 4). Conceitos que só têm uma questão disponível são explicitamente marcados como cobertura insuficiente — a banca não é declarada completa enquanto lacunas dessa natureza forem numerosas o bastante para comprometer o estudo.
- **Fidelidade verificada:** toda questão em produção tem fonte oficial confirmada, gabarito definitivo aplicado, anuladas descartadas.
- **Dossiê de Banca consolidado:** o perfil de cobrança está documentado (item 5.14).

"Completo" é, portanto, um estado auditável — não uma opinião. O portão "cada banca completa antes da próxima" só tem sentido porque completude é definida assim.

### 5.4 Como selecionar as provas relevantes

Nem toda prova disponível merece produção, e a seleção obedece a critérios de valor pedagógico, não de mera disponibilidade:

- **Prioridade por representatividade do perfil atual da banca:** provas mais recentes tendem a refletir melhor como a banca cobra hoje. Provas antigas entram quando ampliam a cobertura de Conceitos ainda pouco testados ou quando documentam a evolução do perfil da banca (item 5.13), não por volume.
- **Prioridade por cobertura de lacunas:** uma prova que exercita Conceitos ainda sem testabilidade mínima vale mais, para a completude, do que uma prova que só repete Conceitos já bem cobertos.
- **Descarte de fontes inadequadas:** provas sem os documentos oficiais indispensáveis, ou cuja fidelidade não possa ser confirmada, são descartadas — nunca completadas por suposição.
- **Independência de banca preservada:** a seleção de provas de uma banca nunca é influenciada por questões de outra banca; cada projeto de banca seleciona seu próprio acervo-fonte.

### 5.5 Como tratar questões anuladas

Questões anuladas são descartadas — decisão já definitiva. Este capítulo apenas operacionaliza a regra:

- A anulação é identificada por documento oficial (gabarito definitivo e/ou justificativas de alteração da banca), nunca por julgamento do editor sobre o mérito da questão.
- Questão anulada não é importada, não é vinculada a Conceito e não gera evidência de domínio.
- Questões com **gabarito alterado** (não anuladas) são importadas com o gabarito definitivo — nunca o preliminar. A alteração de gabarito é uma correção da fonte oficial, não uma anulação.
- Itens que dependem de elemento não reproduzível fielmente (imagem, tabela, diagrama que o texto não captura) são descartados quando a fidelidade não pode ser garantida — descartar é sempre preferível a fabricar.

### 5.6 Como tratar mudanças de legislação (validade temporal do conteúdo)

Este é o risco de maior consequência específico do domínio de concursos brasileiros, e por isso tem tratamento próprio. Uma questão pode estar correta na data da prova e tornar-se factualmente errada por mudança posterior de lei, portaria, resolução ou entendimento normativo. Se o produto continuar apresentando essa questão como verdadeira, ele passa a **ensinar ativamente um conceito errado** — a pior falha possível, pior que a ausência de conteúdo.

Regras:

- **Todo Conceito de natureza normativa carrega a marca de sua vinculação temporal.** Conceitos ancorados em legislação específica são reconhecidos como potencialmente perecíveis, distintos de Conceitos de conhecimento estável (fisiologia, farmacologia de base) que não perecem por mudança de norma.
- **A verdade pedagógica do SimulaPro é o estado atual do conhecimento, não o gabarito histórico.** Quando a legislação muda, o Conceito é atualizado para refletir a norma vigente. As questões antigas vinculadas a esse Conceito são reavaliadas: se a questão ainda testa o conceito de forma válida sob a norma atual, permanece; se a questão só era correta sob a norma antiga, ela é aposentada do uso ativo — mantida como registro histórico, nunca apresentada ao aluno como verdade atual.
- **A revisão legislativa é periódica e disparada por evento.** Além do ciclo periódico (item 5.11), toda mudança normativa relevante conhecida dispara reavaliação dos Conceitos afetados e de suas questões, independentemente do calendário.
- Uma questão nunca é silenciosamente "corrigida" alterando seu enunciado ou gabarito original — isso violaria a fidelidade à fonte. O que muda é o **status de uso** da questão e o **conteúdo do Conceito**, não a transcrição fiel da questão histórica.

### 5.7 Como garantir consistência entre conceitos

A consistência do Eixo de Conteúdo é sustentada por uma única regra de autoridade: **o Eixo de Conteúdo tem um dono editorial único** — uma função de curadoria (uma pessoa ou um comitê pequeno com decisão final unificada), não distribuída entre todos os editores. Editores de produção propõem vinculações e propõem Conceitos novos; a curadoria do Eixo de Conteúdo é quem cria, funde, renomeia ou divide Conceitos oficialmente. Sem essa autoridade central, cada editor vira, na prática, um dono paralelo da ontologia — e a deriva de classificação (5.1) torna-se inevitável.

Além da autoridade central:

- **Granularidade padronizada** conforme o teste do Capítulo 2 (item 2.6): nem tão amplo que se torne inmensurável, nem tão estreito que se confunda com uma única questão. A curadoria é a guardiã desse padrão.
- **Pré-requisitos revisados na criação:** ao criar um Conceito, verifica-se se ele depende de outros já existentes, mantendo o grafo de pré-requisitos coerente (base do que o motor usa nos Capítulos 3 e 4).

### 5.8 Como identificar conceitos duplicados

Duplicação é a manifestação mais comum da deriva de classificação e precisa ser caçada ativamente, não descoberta por acaso:

- **Verificação na entrada:** antes de criar um Conceito novo, é obrigatório buscar se o conhecimento já é representado por um Conceito existente sob outro nome. A criação de Conceito é um ato deliberado de curadoria (5.7), justamente para forçar essa verificação.
- **Sinais de duplicação suspeita:** dois Conceitos com questões-fonte muito semelhantes, ou com o mesmo conjunto de pré-requisitos e a mesma posição no Assunto, são candidatos a fusão.
- **Fusão preserva histórico e domínio:** quando dois Conceitos são reconhecidos como um só, eles são fundidos — as questões de ambos passam a apontar para o Conceito unificado, e o histórico de domínio dos alunos é consolidado, nunca descartado. Fundir dois Conceitos-fantasma em um só *aumenta* a confiabilidade da medição de domínio, porque reúne evidência que estava artificialmente separada.
- A revisão periódica (5.11) inclui uma varredura ativa de duplicação, porque duplicatas também surgem lentamente com o crescimento do acervo.

### 5.9 Como evitar que editores classifiquem o mesmo conceito de formas diferentes

Este é o mecanismo preventivo da deriva. Não basta ter autoridade central (5.7) para corrigir depois — é preciso um **protocolo de classificação** que faça editores diferentes chegarem à mesma classificação antes de haver o que corrigir:

- **Definição canônica de cada Conceito:** todo Conceito tem uma descrição oficial curta que declara sem ambiguidade o que ele cobre e o que ele não cobre — a fronteira, não só o rótulo. É contra essa definição, não contra a intuição do editor, que uma questão é vinculada.
- **Vinculação por conteúdo, nunca por aparência da questão:** a questão é classificada pelo conhecimento que efetivamente testa, não pelas palavras que usa. Duas questões redigidas de formas muito diferentes que testam o mesmo saber vão para o mesmo Conceito; duas questões parecidas na superfície que testam saberes distintos vão para Conceitos distintos.
- **Escalonamento obrigatório de casos ambíguos:** quando um editor não tem certeza de qual Conceito uma questão testa, ou julga que precisa de um Conceito novo, ele não decide sozinho sob pressão de produção — ele escala para a curadoria (5.7). A dúvida é tratada como sinal valioso de fronteira mal definida, não como atraso.
- **Amostragem cruzada de conferência:** parte da produção é reclassificada de forma independente por outro editor; divergências entre a classificação original e a conferência revelam fronteiras de Conceito que precisam de definição mais clara. O objetivo da conferência não é punir o editor — é encontrar as fronteiras onde a definição canônica ainda é fraca.

### 5.10 O papel da IA na produção editorial

A decisão "IA nunca no estudo, IA apenas na equipe editorial" define **onde** a IA pode atuar, mas não a dispensa de limites. A IA editorial é **assistente sob verificação humana obrigatória, nunca autora final**:

- IA pode auxiliar em tarefas de apoio (sugerir vinculação de Conceito, sugerir redação de explicação, apontar possíveis duplicações, sinalizar suspeita de conteúdo desatualizado). Toda saída da IA é uma **proposta**, sujeita à mesma verificação de fidelidade e classificação que o trabalho humano.
- Nenhuma questão, gabarito, vinculação de Conceito ou explicação entra no acervo apenas porque a IA a produziu — sempre há verificação humana responsável.
- A IA nunca é fonte de verdade factual. A verdade vem da fonte oficial (para a questão e o gabarito) e do estado atual do conhecimento (para o Conceito e a explicação). A IA acelera; ela não autoriza.
- Explicações redigidas com apoio de IA seguem a mesma regra antifabricação: fundamentadas em conhecimento estabelecido e verificáveis, nunca inventadas para preencher lacuna.

### 5.11 Como revisar periodicamente o conteúdo

Qualidade editorial não é um estado atingido uma vez; é mantida por ciclos de revisão programados, independentes da produção de conteúdo novo:

- **Revisão legislativa** (5.6): a de maior prioridade, por ciclo e por evento.
- **Varredura de duplicação e granularidade** (5.8, 5.7): verifica se o crescimento do acervo introduziu Conceitos duplicados ou com granularidade fora do padrão.
- **Auditoria de testabilidade:** identifica Conceitos que caíram abaixo da testabilidade mínima (por aposentadoria de questões desatualizadas, por exemplo) e que voltaram a ser cobertura insuficiente.
- **Reconferência amostral de classificação** (5.9): mantém a calibração entre editores ao longo do tempo.

### 5.12 Como manter a qualidade editorial ao longo dos anos

A ameaça de longo prazo não é o erro pontual — é a **deriva lenta**: padrões que se afrouxam gradualmente, editores que entram e saem levando e trazendo critérios próprios, decisões antigas cuja razão se perde. Defesas:

- **A metodologia é o padrão, não a memória das pessoas.** Todo critério de classificação, fidelidade e completude vive documentado (neste capítulo e nos Dossiês de Banca), não na cabeça de um editor veterano. A entrada de um novo editor é a entrada em um padrão escrito, não um aprendizado por osmose.
- **A autoridade central do Eixo de Conteúdo é permanente** (5.7) — a função existe independentemente de quem a ocupa, garantindo continuidade de critério mesmo com rotatividade de equipe.
- **Toda decisão de curadoria não óbvia é registrada com sua razão** — por que dois Conceitos foram fundidos, por que um Conceito foi dividido, por que uma questão foi aposentada. Isso impede que decisões sejam revertidas por desconhecimento anos depois.

### 5.13 Como lidar com mudanças no perfil de cobrança de uma banca ao longo do tempo

Uma banca não cobra hoje como cobrava há dez anos — muda formato, profundidade, ênfase de disciplinas. Tratar o perfil de uma banca como fixo produziria, com o tempo, um retrato desatualizado que enganaria a priorização do motor (que usa o peso/incidência por banca, Capítulos 2 e 4). Regras:

- **O perfil da banca é vivo, versionado no tempo.** O Dossiê de Banca (5.14) registra o perfil como uma trajetória, não uma foto — distinguindo, quando relevante, como a banca cobrava em diferentes períodos.
- **Peso/incidência de Conceito por banca é recalibrado periodicamente**, dando maior influência ao perfil recente sem apagar o histórico. Um Conceito que a banca deixou de cobrar não é removido do Eixo de Conteúdo (ele continua sendo conhecimento válido) — apenas perde peso na priorização para aquela banca.
- **Mudança de perfil nunca justifica misturar bancas.** Se a banca mudou tanto que suas provas antigas já não representam como ela cobra hoje, isso é tratado dentro do projeto daquela banca (seleção de provas, item 5.4), nunca importando questões de outra banca para "cobrir" a mudança.

### 5.14 Como documentar oficialmente as características de cada banca (Dossiê de Banca)

Cada banca tem um documento oficial vivo — o Dossiê de Banca — que é a fonte de verdade sobre seu perfil de avaliação. Ele registra, no mínimo:

- Formato(s) de item que a banca usa (múltipla escolha, Certo/Errado, associação de colunas etc.) e suas implicações para a evidência de domínio (Capítulo 3 — formatos com chances de acerto ao acaso diferentes pesam diferente).
- Estilo característico de construção de distratores e de enunciados.
- Profundidade e ênfase típicas por Disciplina e Assunto para os cargos-alvo.
- Perfil de incidência de Conceitos — quais a banca cobra muito, pouco ou nunca — como insumo direto do peso/incidência usado pelo motor.
- A trajetória temporal do perfil (5.13), quando houver mudança relevante.

O Dossiê de Banca é o que permite que "respeitar a banca escolhida" (Capítulo 4) seja uma decisão informada e documentada, não uma intuição. Ele é consolidado como parte do critério de completude (5.3) e mantido atualizado pela revisão periódica (5.11).

### 5.15 O que este capítulo não define

Este capítulo define a metodologia de produção de conteúdo. Não define:

- Ferramentas, sistemas, formatos de arquivo ou fluxos técnicos de produção.
- Como os documentos e dossiês são armazenados ou versionados tecnicamente.
- A estrutura organizacional ou os cargos concretos da equipe editorial (apenas as funções metodológicas: produção, curadoria do Eixo de Conteúdo, conferência).
- Métricas de produtividade ou gestão da equipe.

Essas definições pertencem a capítulos posteriores ou a documentos operacionais fora deste método.

---

## CAPÍTULO 6 — MODELO DE EVOLUÇÃO DO ALUNO

### 6.1 Escopo: a jornada longitudinal

O Capítulo 4 descreveu o comportamento tático do Motor de Aprendizagem dentro de uma sessão — como ele escolhe o próximo conceito, alterna, revisa, evita fadiga. Este capítulo descreve a **jornada longitudinal**: como esses comportamentos, aplicados dia após dia, produzem a evolução do aluno ao longo de semanas e meses, do primeiro contato até o estado de prontidão para a prova da banca escolhida. Onde o Capítulo 4 respondeu "o que acontece agora", este responde "para onde tudo isso leva, e em que ritmo".

Toda a jornada acontece dentro do modelo já definido: o aluno estuda uma única banca por plano (nunca misturada), o progresso é medido por domínio de conceito (nunca por volume) e nenhuma decisão usa IA durante o estudo.

### 6.2 Como um aluno inicia seus estudos

O aluno inicia escolhendo seu alvo — a banca (ou o concurso específico, do qual a banca é inferida) e o cargo. A partir dessa escolha, o SimulaPro monta o **plano de estudos**: não uma lista de aulas a assistir em ordem, mas o recorte do Eixo de Conteúdo (Disciplina → Assunto → Conceito) relevante para aquele cargo, filtrado pelas questões daquela banca e ponderado pelo peso/incidência de cada Conceito naquela banca (Capítulos 2 e 5).

O início é deliberadamente leve. O aluno não é submetido a nenhuma barreira de entrada — nem uma longa prova de nivelamento, nem uma trilha obrigatória de teoria antes de poder praticar. Ele começa a estudar, e o estudo, desde a primeira sessão, já é aprendizagem real e já é, ao mesmo tempo, calibração (item 6.3).

### 6.3 Como o sistema identifica o nível inicial

O SimulaPro **não** identifica o nível inicial por meio de um grande exame de nivelamento aplicado de uma vez. Fazê-lo seria contraditório com tudo que foi estabelecido: um teste massivo e concentrado produz evidência de baixa qualidade (não espaçada, Capítulo 3), gera sobrecarga logo na entrada e mede um retrato único que o próprio modelo de domínio rejeita.

Em vez disso, o nível inicial **emerge do uso**. As primeiras sessões cumprem dupla função — são aprendizagem genuína e são diagnóstico. À medida que o aluno responde, cada evidência posiciona cada Conceito em seu estado (Capítulo 3): conceitos que o aluno já domina são rapidamente reconhecidos como tal e saem da prioridade ativa (Capítulo 3, item 3.8); conceitos frágeis se revelam pela evidência e recebem prioridade. O "nível inicial", portanto, não é um número atribuído no dia zero — é o retrato de domínio que se forma nas primeiras semanas, mais preciso do que qualquer prova de entrada poderia ser, porque é construído com evidência de melhor qualidade e sem punir o aluno na largada.

Uma consequência importante: um aluno avançado não é forçado a percorrer conceitos que já domina só porque "acabou de chegar". O sistema reconhece o domínio preexistente pela evidência e concentra o tempo dele onde há ganho real — a jornada de cada aluno começa de onde ele efetivamente está, não de um ponto zero comum a todos.

### 6.4 Como o plano de estudos evolui

O plano de estudos é **vivo**, não uma sequência fixa a ser cumprida. Ele não é uma lista de tópicos que o aluno risca um a um até o fim. A cada sessão, o plano é a expressão da priorização contínua do Capítulo 4 (item 4.2) aplicada ao estado de domínio atual do aluno: o que revisar, o que continuar, o que introduzir.

Isso significa que dois alunos com o mesmo alvo (mesma banca, mesmo cargo) têm planos que divergem cada vez mais ao longo do tempo, não porque o sistema os trate de forma arbitrária, mas porque o estado de domínio de cada um — construído pelas próprias respostas — os leva por caminhos diferentes (Capítulo 4, item 4.10). O plano evolui como consequência do domínio, nunca como um cronograma imposto de fora.

### 6.5 Como novos conceitos são liberados

A liberação de conceitos novos é governada pelos pré-requisitos (Capítulos 2 e 3). Um Conceito só se torna elegível para introdução quando os Conceitos dos quais ele depende já estão, no mínimo, em Em Consolidação (Capítulo 3, item 3.10). Isso não é uma restrição burocrática — é o mecanismo que garante que o aluno construa conhecimento sobre uma base minimamente firme, não sobre lacunas.

Entre os conceitos elegíveis em um dado momento, a ordem de introdução respeita o peso/incidência da banca escolhida: conceitos que aquela banca cobra mais são introduzidos antes, dado o tempo finito do aluno. A liberação é gradual e contínua — novos conceitos entram no ritmo em que os anteriores se consolidam, não em lotes que sobrecarregam (item 6.7).

### 6.6 Como conceitos antigos continuam vivos

Nenhum conceito é "concluído" no sentido de sair permanentemente da jornada. Um conceito que atinge Domínio Demonstrado não é arquivado — ele entra em observação passiva e retorna à prioridade ativa quando sua Confiança de Domínio projetada indicar risco de esquecimento (Capítulo 3, itens 3.7 e 3.8), ou quando se tornar pré-requisito de um conceito novo que o aluno está prestes a estudar.

É esta a diferença mais visível em relação ao modelo tradicional criticado no início: lá, o conteúdo estudado fica para trás e nunca volta; aqui, todo conceito dominado permanece vivo, protegido por revisão espaçada, ao longo de toda a jornada até a prova. O aluno nunca chega ao fim de uma disciplina e a esquece enquanto estuda a seguinte.

### 6.7 Como evitar sobrecarga cognitiva

A sobrecarga é evitada controlando **quantos conceitos novos** o aluno enfrenta por período, não a quantidade total de estudo. Um conceito novo exige mais esforço cognitivo do que a revisão de um conceito já conhecido; introduzir muitos conceitos novos ao mesmo tempo esgota o aluno e degrada a qualidade da evidência de todos eles.

Por isso, a introdução de conceitos novos é limitada e proporcional à taxa em que os conceitos já em andamento se consolidam. Enquanto há muitos conceitos em Em Aprendizagem competindo por atenção, o sistema segura a entrada de novos e favorece a consolidação dos que já estão abertos. A regra é: abrir novas frentes de aprendizagem apenas na medida em que as frentes atuais se estabilizam — nunca acumular frentes abertas a ponto de nenhuma avançar.

### 6.8 Como o sistema identifica que o aluno está pronto para avançar

Prontidão para avançar é definida **por conceito** e **por domínio**, nunca por tempo decorrido nem por volume de questões feitas. Um aluno está pronto para que um conceito novo (que depende de um conceito atual) seja liberado quando o conceito atual atingiu, no mínimo, Em Consolidação com evidência suficiente e variada (Capítulos 3 e 5). Não é "estudou por X dias" nem "fez Y questões" — é "demonstrou domínio suficiente do pré-requisito".

Isso vale simetricamente: um aluno que ainda não consolidou um pré-requisito não é considerado pronto para avançar sobre ele, por mais tempo que tenha investido. Tempo e esforço são insumos; prontidão é medida por evidência de domínio.

### 6.9 Como equilibrar novos aprendizados e revisões

O equilíbrio entre aprender o novo e proteger o já conquistado é a decisão central da jornada, e obedece a uma prioridade clara: **proteger domínio já conquistado tem precedência sobre expandir para o novo**. A ordem de prioridade do Capítulo 4 (revisão corretiva > revisão preventiva > continuidade > conceito novo) é exatamente a expressão tática dessa precedência.

Na escala longitudinal, isso significa que a proporção entre novo e revisão muda naturalmente ao longo da jornada: no início, há pouco a revisar e muito a aprender, então o novo domina; à medida que o aluno acumula conceitos dominados, a fração de revisão cresce, porque há mais patrimônio de conhecimento a proteger. Perto da prova, a jornada tende naturalmente a ser mais de revisão e consolidação do que de abertura de conceitos novos — e isso é correto, não uma estagnação.

### 6.10 Como impedir que o aluno "pule etapas"

O aluno não pula etapas porque o grafo de pré-requisitos o impede estruturalmente (Capítulos 2 e 3). Conceitos avançados simplesmente não são apresentados enquanto seus pré-requisitos não estiverem consolidados — não porque o sistema "bloqueie" o aluno como punição, mas porque apresentar um conceito avançado sobre uma base frágil produziria aprendizagem falsa (o aluno acertaria por padrões superficiais sem entender o fundamento).

Há também uma proteção contra o "pulo invisível": um aluno que aparenta dominar um conceito avançado mas cujo pré-requisito regrediu (Capítulo 3, item 3.9) tem esse pré-requisito reaberto para revisão, porque domínio de um conceito dependente presume domínio *ativo* — não apenas histórico — do pré-requisito. O sistema não deixa o aluno construir sobre um alicerce que silenciosamente ruiu.

### 6.11 Como o sistema acompanha a evolução ao longo de semanas e meses

A evolução longitudinal é a agregação das trajetórias de domínio (Capítulo 3, item 3.6) ao longo do tempo, organizada por Assunto, Disciplina e Cargo. Ela distingue coisas que o percentual de acertos jamais distingue:

- quanto do conteúdo cobrado pela banca já está em Domínio Demonstrado e estável;
- quanto está em construção ativa e com que velocidade avança;
- quanto já foi dominado mas está em risco de esquecimento por falta de reforço;
- onde estão as regressões reais e os pontos de estagnação persistente (Capítulo 4, item 4.5).

Essa visão macro é honesta sobre o futuro de um jeito que o modelo tradicional não é: ela não diz "você acertou 85% este mês", ela diz "você domina de forma durável tal fração dos conceitos que esta banca cobra, e estas são as áreas ainda frágeis". É uma medida de prontidão projetada, não de desempenho pontual.

### 6.12 Como o sistema reage quando o aluno fica muitos dias sem estudar

Ausência é tratada como informação sobre o estado atual do conhecimento, não como falha moral a ser punida. Durante a ausência, a Confiança de Domínio projetada dos conceitos continua decaindo no tempo (Capítulo 3) — ou seja, o sistema já sabe, quando o aluno volta, que parte do que ele dominava provavelmente enfraqueceu.

No retorno, a jornada não recomeça do zero nem finge que nada aconteceu. As primeiras sessões após uma ausência longa são mais pesadas em revisão do que em conceito novo, para reconstruir a confiança sobre o que foi provavelmente esquecido antes de abrir novas frentes. Conceitos que estavam em Em Risco de Esquecimento no momento da saída são os primeiros a serem reavaliados. O tom é de recalibração, não de castigo: o objetivo é reancorar o aluno rapidamente no que ele já tinha, e só então retomar a expansão. A regressão eventualmente detectada no retorno é tratada pela mesma economia de reaprendizagem do Capítulo 3 (item 3.9) — reconquistar tende a ser mais rápido do que aprender pela primeira vez.

### 6.13 Como o sistema adapta a carga sem perder a continuidade

Carga de estudo (quanto o aluno estuda por sessão e por período) pode variar conforme a disponibilidade e a resposta do aluno, mas a **continuidade da jornada nunca se perde**. A distinção é entre volume e fio condutor: o volume de conteúdo por sessão se adapta (mais leve quando há sinais de fadiga, sustentável quando o aluno está engajado — Capítulo 4, item 4.3); o fio condutor — o grafo de conceitos, os pré-requisitos, o que está em revisão devida — permanece intacto entre uma sessão e outra, independentemente do intervalo.

Isso significa que reduzir a carga em um período difícil não "quebra" a jornada; apenas a desacelera. O aluno que estuda pouco por algumas semanas continua exatamente de onde parou, com seus conceitos em revisão preservados e seus pré-requisitos intactos — a jornada é resiliente à variação de ritmo por design.

### 6.14 Como o aluno chega ao estado de "pronto para a prova"

Prontidão para a prova é um estado definido e auditável, não uma sensação nem a conclusão de uma trilha. O aluno está **pronto para a prova da banca escolhida** quando, simultaneamente:

- a fração dos Conceitos que aquela banca comprovadamente cobra (segundo seu Dossiê e seu peso/incidência, Capítulo 5) que está em Domínio Demonstrado é alta e cobre as áreas de maior peso da banca;
- essa condição é **sustentada no tempo**, não um pico momentâneo — o domínio se manteve estável sob revisão espaçada, resistindo ao esquecimento;
- não há concentração de fragilidade ou regressão em disciplinas de alto peso para aquela banca.

Duas ressalvas de honestidade, coerentes com todo o método:

- Prontidão é **específica da banca do plano**. Estar pronto para a banca escolhida não é uma afirmação sobre outra banca — mudar de banca é iniciar uma jornada com peso/incidência e questões diferentes, mesmo que o Eixo de Conteúdo por trás seja o mesmo (Capítulo 2).
- Prontidão é **domínio sustentado demonstrado, não garantia de aprovação**. O SimulaPro afirma o que pode medir com integridade — que o aluno demonstrou, de forma durável, domínio dos conceitos que a banca cobra. Nunca promete o resultado da prova, que depende de fatores fora do alcance do método. Essa honestidade é o oposto exato da falsa sensação de aprendizagem que este capítulo, desde a crítica inicial, existe para eliminar.

### 6.15 O que este capítulo não define

Este capítulo define a jornada pedagógica do aluno ao longo do tempo. Não define:

- Como essa jornada é apresentada em tela, painéis ou relatórios ao aluno.
- Como qualquer estado, trajetória ou limiar é calculado, armazenado ou exibido tecnicamente.
- Parâmetros numéricos de qualquer natureza (quantos conceitos novos por período, qual fração configura prontidão, quantos dias caracterizam ausência longa).
- Aspectos motivacionais, de comunicação ou de retenção comercial do aluno.

Essas definições pertencem a capítulos posteriores ou a especificações fora deste método.

---

## CAPÍTULO 7 — AVALIAÇÃO DA PRONTIDÃO PARA A PROVA

### 7.1 Escopo

O Capítulo 6 (item 6.14) definiu prontidão como um estado auditável: domínio sustentado sobre os conceitos de maior peso da banca escolhida. Este capítulo aprofunda esse estado — como a prontidão é medida, como o sistema expõe fragilidade e falsa confiança antes da prova, como distingue conceitos críticos de secundários, e como comunica tudo isso com honestidade, sem jamais prometer aprovação.

Uma premissa governa o capítulo inteiro: **prontidão não é um número obtido em um evento; é uma leitura contínua do estado de domínio, ponderada por importância e projetada até a data da prova.** Nenhuma das métricas rejeitadas nos capítulos anteriores — percentual de acertos, número de questões respondidas, horas estudadas, aulas assistidas — participa dessa leitura. Prontidão é expressa exclusivamente em termos de domínio de conceito ponderado.

### 7.2 Por que uma nota única de simulado não mede prontidão

Registrado formalmente, para que a rejeição seja parte do método e não apenas uma preferência:

- **Um simulado é um evento único** — carrega o ruído do sorteio de questões daquele caderno específico. Prontidão não pode depender de qual recorte calhou de aparecer.
- **A nota agregada apaga a distribuição** — esconde exatamente onde está a fraqueza, que é a única informação acionável.
- **A nota não tem dimensão temporal** — mede o dia em que foi feita, frequentemente logo após revisão intensiva, capturando memória de curto prazo que não sobreviverá até a prova.
- **A nota não pondera pelo perfil da banca** — trata todos os conceitos como iguais, enquanto a prova real pesa cada conceito conforme a banca cobra.
- **A nota confunde desempenho com prontidão** — mede um evento; prontidão é domínio durável e sustentado.

O SimulaPro pode usar simulados como *instrumento de evidência* (várias questões produzem várias evidências de domínio, como qualquer sessão), mas nunca como *medida de prontidão*. A nota de um simulado, isolada, não é reportada como indicador de preparação.

### 7.3 O que significa estar "pronto para a prova"

Estar pronto é ter **domínio consolidado, sustentado no tempo e projetado até a data da prova, sobre os conceitos que a banca escolhida efetivamente cobra, com atenção proporcional ao peso de cada conceito.** Desdobrando cada termo:

- **Consolidado** — os conceitos estão em Domínio Demonstrado (Capítulo 3), não em estados inferiores.
- **Sustentado no tempo** — o domínio resistiu a revisões espaçadas, não é um pico recente. Domínio construído ontem e domínio mantido ao longo de semanas de revisão não valem o mesmo para prontidão.
- **Projetado até a data da prova** — o que importa não é o domínio de hoje, mas o domínio previsto *no dia da prova*, considerando o decaimento natural da Confiança de Domínio no intervalo restante.
- **Ponderado pelo peso da banca** — cobertura dos conceitos de alta incidência importa muito mais do que cobertura dos de baixa incidência (item 7.5).

Prontidão não é um ponto binário atingido de uma vez; é um grau que cresce à medida que mais conceitos críticos entram em domínio sustentado e permanece condicionado à manutenção desse domínio até a data.

### 7.4 Como medir prontidão

A prontidão não é reportada como um número único — pela mesma razão que a nota de simulado é rejeitada (item 7.2): um número agregado apaga a distribuição. Ela é medida como uma **superfície de prontidão**: o mapa do estado de domínio projetado, conceito a conceito, ponderado pelo peso de cada conceito na banca, organizado por Assunto e Disciplina.

Essa superfície distingue, para cada área do conteúdo cobrado:

- o que está em domínio consolidado e sustentado (prontidão real);
- o que está em construção e ainda não consolidado (prontidão em formação);
- o que já foi dominado mas está projetado para enfraquecer até a data da prova (prontidão em risco);
- o que ainda não foi tocado ou está frágil (exposição).

A prontidão global é a leitura ponderada dessa superfície — nunca uma média simples entre conceitos, que esconderia a concentração de fragilidade que mais importa. Um aluno com domínio uniforme de nível médio e um aluno com excelência na maioria e um buraco crítico em uma disciplina de alto peso não têm a mesma prontidão, ainda que uma média os igualasse.

### 7.5 Como ponderar o peso dos conceitos conforme a banca

O peso de um conceito na avaliação de prontidão vem do **peso/incidência daquele conceito na banca escolhida**, registrado no Dossiê de Banca (Capítulo 5). Um conceito que a banca cobra em quase toda prova tem peso alto; um que ela raramente cobra tem peso baixo; um que ela nunca cobra não entra na conta de prontidão daquele plano.

Isso tem uma consequência direta e deliberada: dominar conceitos de baixa incidência **não compensa** fragilidade em conceitos de alta incidência. A superfície de prontidão nunca deixa um domínio forte em áreas pouco cobradas mascarar exposição em áreas muito cobradas — que é precisamente o erro que a nota agregada de simulado comete. O peso da banca é o que torna a prontidão do SimulaPro específica da banca escolhida, coerente com toda a arquitetura (Capítulos 2 e 6).

### 7.6 Como diferenciar conceitos críticos de conceitos secundários

Peso de incidência sozinho não basta para definir criticidade. Um conceito é **crítico** quando é alto em pelo menos um destes dois eixos:

- **Incidência na banca** — a banca o cobra muito (item 7.5).
- **Centralidade no grafo de pré-requisitos** — muitos outros conceitos dependem dele (Capítulos 2 e 3). Um conceito de incidência apenas moderada, mas do qual dependem vários conceitos de alta incidência, é crítico por transitividade: sua fragilidade compromete o domínio de tudo que se apoia nele.

Um conceito é **secundário** quando é baixo em ambos os eixos: a banca cobra pouco e poucos ou nenhum conceito dependem dele.

Essa distinção governa a priorização perto da prova (item 7.12): fragilidade em conceito crítico é sempre mais urgente do que fragilidade em conceito secundário, mesmo quando a segunda parece "mais fácil de resolver". Resolver o fácil e secundário para sentir progresso, deixando o crítico frágil, é exatamente o comportamento que a avaliação de prontidão existe para impedir.

### 7.7 Como detectar conhecimento consolidado

Conhecimento consolidado é reconhecido pela **qualidade e pela durabilidade da evidência**, não pela quantidade de acertos. Um conceito está consolidado quando atingiu Domínio Demonstrado sustentado por evidência que é, cumulativamente (Capítulos 3 e 4): variada (questões de redações diferentes), espaçada no tempo (recuperação bem-sucedida após intervalos, não apenas na mesma sessão), robusta em dificuldade (acertos incluem itens difíceis, não só os fáceis) e sem contradições recentes não resolvidas.

Consolidação é, portanto, o oposto de um bom desempenho pontual: é a demonstração repetida, ao longo do tempo e em contextos variados, de que o aluno recupera e aplica o conceito de forma confiável. É o único tipo de domínio que conta plenamente para prontidão.

### 7.8 Como detectar conhecimento frágil

Conhecimento frágil é o domínio que **parece maior do que é**. O sistema o detecta por sinais que a nota de simulado jamais captaria:

- domínio aparente construído sobre evidência estreita — poucas questões, ou questões muito parecidas entre si (risco de reconhecimento de item, não de domínio do conceito, Capítulo 4);
- domínio apoiado majoritariamente em formatos de alta chance de acerto ao acaso (Certo/Errado), sem confirmação em formatos mais exigentes;
- domínio concentrado em itens fáceis, com desempenho fraco ou ausente nos difíceis do mesmo conceito;
- domínio em declínio projetado — já foi consolidado, mas o tempo sem reforço o está levando para Em Risco de Esquecimento;
- domínio recente e ainda não testado por espaçamento — evidência positiva concentrada em pouco tempo, sem prova de retenção.

Todo conhecimento frágil é tratado, na superfície de prontidão, como **ainda não pronto**, independentemente de quão positiva a evidência pareça à primeira vista. A fragilidade é sinalizada explicitamente para que o aluno saiba onde sua preparação é ilusória — não escondida por trás de uma média favorável.

### 7.9 Como identificar falsa confiança

Falsa confiança é a fragilidade vista do ponto de vista do aluno: a sensação de estar preparado onde a evidência não sustenta. Ela nasce, sobretudo, de uma inversão que o SimulaPro corrige deliberadamente:

**O aluno tende a se sentir mais confiante sobre o que estudou recentemente e menos confiante sobre o que estudou há muito tempo — e essa intuição é frequentemente o inverso da realidade.** Conceitos estudados intensivamente há poucos dias produzem sensação forte de domínio (recência infla confiança percebida), mas ainda não foram testados por espaçamento e podem ser frágeis. Conceitos dominados há semanas e mantidos por revisão espaçada parecem "esquecidos" ao aluno, mas são justamente os mais duráveis.

O SimulaPro não lê a sensação do aluno — lê a evidência. Seu papel diante da falsa confiança é **corrigir a leitura antes que o aluno a confunda com prontidão**: um conceito que o aluno provavelmente sente dominar, mas cuja evidência é recente, estreita ou de baixa exigência, aparece na superfície de prontidão como prontidão em formação ou em risco, não como prontidão real. A avaliação de prontidão é, nesse sentido, um antídoto contra a própria intuição enganosa do candidato.

### 7.10 Como identificar pontos fracos antes da prova

Os pontos fracos são exatamente as regiões da superfície de prontidão (item 7.4) marcadas como exposição, prontidão em risco ou conhecimento frágil (item 7.8) — ordenados por peso e criticidade (itens 7.5 e 7.6). O sistema não espera o aluno descobrir suas fraquezas errando no simulado; ele as expõe continuamente, ao longo de toda a jornada, e com antecedência crescente à medida que a prova se aproxima.

Um ponto fraco em conceito crítico é sinalizado com prioridade máxima; um ponto fraco em conceito secundário é registrado, mas nunca disputa atenção com o crítico. A identificação é sempre acionável: não é "você está fraco em X%", é "estes conceitos, destes assuntos, com este peso para a sua banca, ainda não estão prontos".

### 7.11 Como estimar o risco de desempenho na prova

O SimulaPro estima **risco como superfície de exposição, não como probabilidade de aprovação.** Estimar a chance de o aluno passar seria desonesto (depende de fatores fora do método — concorrência, nota de corte, condições no dia) e metodologicamente insustentável. O que o sistema pode afirmar com integridade é *onde* e *quanto* a preparação está exposta, ponderado pela importância de cada área para a banca.

O risco é, portanto, a leitura da superfície de prontidão sob a ótica da ameaça: quanto do peso da prova, segundo o perfil da banca, recai sobre conceitos que ainda não estão em domínio consolidado e sustentado. Um aluno com exposição concentrada em conceitos de alto peso e alta criticidade tem risco alto; um aluno cuja exposição residual está apenas em conceitos secundários tem risco baixo. É uma medida de vulnerabilidade da preparação, não um prognóstico de resultado.

### 7.12 Como definir se o aluno deve continuar estudando ou apenas revisar

Esta decisão decorre diretamente da superfície de prontidão e da distinção crítico/secundário:

- **Continuar aprendendo (abrir conceitos novos)** enquanto houver conceitos críticos ainda não consolidados. Enquanto existir exposição em área de alto peso ou alta centralidade, a jornada permanece de construção — a proteção do que já se sabe convive com a expansão para fechar os buracos críticos.
- **Passar a apenas revisar/manter** quando a cobertura dos conceitos críticos está essencialmente consolidada e sustentada, e o que resta é baixo peso e baixa criticidade. Nesse ponto, abrir conceitos secundários novos oferece pouco ganho e concorre com a tarefa mais valiosa perto da prova: impedir que o domínio já conquistado decaia até a data.

A transição entre esses dois modos não é declarada por calendário — é consequência do estado de domínio. Um aluno pode chegar a ela cedo (se consolidou o crítico rápido) ou nunca (se o crítico permaneceu frágil), e o sistema responde ao estado real, não ao tempo restante.

### 7.13 Como o sistema informa honestamente a prontidão sem prometer aprovação

A comunicação de prontidão obedece a um princípio inegociável: **o SimulaPro afirma apenas o que pode medir com integridade.** O que ele pode afirmar é o estado de domínio consolidado e sustentado sobre os conceitos que a banca cobra, e onde estão as exposições. O que ele nunca afirma é a probabilidade de aprovação.

Consequências práticas dessa honestidade:

- A prontidão é comunicada como um retrato do domínio ponderado e de suas fragilidades — nunca como uma nota, um selo de "aprovado" ou uma promessa de resultado.
- Fragilidade e falsa confiança são mostradas, não suavizadas. É preferível um aluno saber onde está exposto e desconfortável do que confortável e iludido — a missão do produto é eliminar a falsa sensação de aprendizagem, e mentir por conforto a reintroduziria.
- A prontidão é sempre qualificada como específica da banca do plano (Capítulo 6, item 6.14): estar pronto para a banca escolhida não é afirmação sobre nenhuma outra banca.

### 7.14 Como a prontidão evolui à medida que a data da prova se aproxima

A proximidade da data muda a natureza da avaliação de duas formas:

- **A projeção passa a mirar a data.** Prontidão sempre foi domínio *projetado até o dia da prova* (item 7.3). Quanto mais perto a data, mais curto o intervalo de projeção e mais o que importa é o domínio que efetivamente sobreviverá até lá. Conceitos consolidados há muito tempo, e recentemente reforçados, ganham confiança de que estarão firmes na data; conceitos frágeis têm cada vez menos tempo para se tornarem sustentáveis, o que eleva sua contribuição ao risco.
- **A tolerância a frentes abertas diminui.** Longe da prova, abrir conceitos novos, mesmo secundários, é investimento válido. Perto da prova, o sistema estreita o foco: concentra o pouco tempo restante em consolidar o que é crítico e ainda frágil e em proteger o que já está pronto contra o esquecimento, deixando de investir em conceitos secundários cujo retorno não caberia no tempo disponível. O planejamento de revisão passa a ser feito de trás para frente a partir da data — garantindo que os conceitos críticos estejam no pico de domínio possível no dia certo, não antes nem depois.

Assim, a superfície de prontidão não apenas mede um estado — ela se torna mais exigente e mais focada conforme a data se aproxima, refletindo que preparação relevante é aquela que estará viva no dia da prova, não a que existiu em algum ponto do passado.

### 7.15 O que este capítulo não define

Este capítulo define como a prontidão é medida e comunicada. Não define:

- Parâmetros numéricos de qualquer natureza (qual grau da superfície configura "pronto", quanto peso torna um conceito crítico, qual horizonte de projeção usar).
- Como a superfície de prontidão, o risco ou qualquer estado são calculados, armazenados ou apresentados tecnicamente.
- Como esses conteúdos são exibidos em tela, painéis ou relatórios ao aluno.
- Qualquer previsão de aprovação, nota de corte ou comparação com outros candidatos — que estão fora do que o método se propõe a afirmar.

Essas definições pertencem a capítulos posteriores ou a especificações fora deste método.

---

## CAPÍTULO 8 — FEEDBACK PEDAGÓGICO E O PAPEL DA EXPLICAÇÃO

### 8.1 A explicação é o único instrumento de ensino do SimulaPro

O Capítulo 6 rejeitou o modelo "assistir aula → resolver questões". Uma consequência dessa decisão precisa ser assumida com todas as letras: **sem aulas, o ensino do SimulaPro acontece inteiramente no feedback à questão.** A explicação que aparece depois que o aluno responde não é um complemento de conferência do gabarito — é o momento em que o aprendizado efetivamente ocorre, o único lugar do produto onde se ensina.

Isso eleva a explicação da condição de rodapé à condição de artefato central do método. Toda questão do acervo é, ao mesmo tempo, um instrumento de medição de domínio (Capítulos 3 e 4) e um instrumento de ensino — e é a explicação que cumpre a segunda função. Um acervo com boas questões e explicações fracas é um acervo que mede sem ensinar; para o SimulaPro, isso é uma falha tão grave quanto questões ruins.

### 8.2 Por que o feedback tradicional não ensina

Registrado como parte do método:

- **Confirma o gabarito em vez de ensinar o conceito** — diz qual é a resposta certa, não por que o conceito é o que é, e não por que o raciocínio do aluno falhou.
- **Ignora o erro específico do aluno** — não trata o distrator que ele escolheu, que é justamente onde o equívoco conceitual está localizado.
- **Chega como veredito emocional** — "certo/errado" informa o placar, não o conhecimento, e converte aprendizagem em ansiedade de desempenho.
- **É escrito para defender o gabarito, não para ensinar** — herda o estilo defensivo da banca (resistir a recurso), que é argumentação jurídica, não didática.

O SimulaPro rejeita cada um desses padrões. As seções seguintes definem o que ele coloca no lugar.

### 8.3 O que é feedback pedagógico: ensinar o conceito, não a resposta

O objetivo de todo feedback é que o aluno saia dele sabendo **o conceito** — não a resposta daquela questão. A diferença é decisiva e é a aplicação direta do princípio "o aluno aprende conceitos, nunca respostas" (Capítulos 1 e 3) ao momento do feedback:

- Feedback que ensina a resposta produz conhecimento intransferível: o aluno reconhece aquela questão específica e nada mais.
- Feedback que ensina o conceito produz conhecimento transferível: o aluno passa a resolver *qualquer* questão sobre aquele conceito, inclusive redações que nunca viu.

Na prática, isso significa que a explicação sempre nomeia e desenvolve o conceito que a questão testa (Capítulo 2 — toda questão aponta para um ou mais conceitos), e usa a questão como *exemplo* daquele conceito, não como o objeto do ensino. A questão é o caso; o conceito é a lição. Um feedback que só faz sentido para aquela questão, e não se generaliza, é feedback mal construído por definição.

### 8.4 Feedback sobre o erro: tratar o equívoco, não apenas apontar o certo

Quando o aluno erra, a informação mais valiosa não é qual era a alternativa correta — é **por que a alternativa que ele escolheu é errada.** O distrator plausível que atraiu o aluno é a manifestação visível de um equívoco conceitual específico; corrigir esse equívoco é o ato de ensino de maior retorno que existe.

Por isso, o ideal pedagógico do SimulaPro é o feedback que endereça o distrator escolhido: não apenas "a correta é X", mas "o que fez Y parecer certo, e por que não é". Esse tratamento do erro específico é o padrão-ouro da explicação.

Há aqui uma consequência editorial honesta, que precisa ser declarada: feedback por distrator é conteúdo que precisa ser **produzido antecipadamente** pela equipe editorial (Capítulo 5), alternativa por alternativa — nunca gerado ao vivo, porque IA não atua durante o estudo (Capítulo 4). Isso tem custo. O método define a seguinte gradação, do ideal ao mínimo aceitável:

- **Ideal:** explicação do conceito + tratamento de cada distrator relevante (por que cada alternativa errada atrai e por que falha).
- **Aceitável:** explicação do conceito que, ao desenvolvê-lo, torna evidente por que as alternativas erradas são erradas, mesmo sem tratá-las uma a uma.
- **Insuficiente (a evitar):** explicação que apenas reafirma por que a correta é correta, sem iluminar o erro.

O nível de tratamento de distrator é, portanto, um eixo de qualidade editorial (Capítulo 5) — quanto mais o acervo se aproxima do ideal, mais o produto ensina no ponto exato onde o aluno tropeça.

### 8.5 Feedback sobre o acerto: confirmar o raciocínio, não o resultado

Feedback só faz sentido quando o aluno erra? Não. Um acerto também exige explicação — por uma razão que o modelo tradicional ignora: **o aluno que acerta não sabe se acertou pelo motivo certo.** Ele pode ter acertado por eliminação parcial, por intuição, por reconhecer a questão, ou por sorte (Capítulo 3 — a chance de acerto ao acaso é real). Nenhum desses acertos é domínio.

A explicação apresentada após um acerto tem função de **conversão**: transformar um acerto de qualidade incerta em compreensão consolidada, ou expor ao aluno que ele acertou sem realmente saber. É no feedback ao acerto que uma sorte se converte em aprendizado — ou, no mínimo, que o aluno percebe que precisa firmar aquele conceito. Tratar o acerto como "não precisa de explicação" é desperdiçar exatamente o momento em que o conhecimento frágil (Capítulo 7) poderia ser fortalecido antes de virar falsa confiança.

### 8.6 O momento do feedback

O feedback pedagógico é, por padrão, **imediato** — apresentado logo após a resposta, enquanto a mente do aluno ainda está engajada com o raciocínio que produziu aquela resposta. É nesse instante que a correção de um erro tem máxima eficácia e que o efeito de teste (Capítulo 3) se completa: recuperar da memória e, em seguida, confrontar a recuperação com a explicação é o que consolida o conceito.

Há uma única exceção legítima ao feedback imediato: o **modo de simulação de prova**, em que o aluno deliberadamente adia o feedback para o fim, reproduzindo as condições reais do exame (onde não há correção durante a prova). Mesmo nesse caso, o feedback ao fim continua sendo pedagógico — trata conceito e erro, não apenas nota (a nota isolada foi rejeitada no Capítulo 7). O modo imediato é o padrão de aprendizagem; o modo diferido é um recurso pontual de treino de condições de prova, não o padrão de estudo.

### 8.7 Feedback que generaliza para o conceito, nunca para o item

Este é o antídoto direto contra a memorização de item (Capítulos 3 e 4) aplicado à explicação. Uma explicação pode, sem querer, ensinar a decorar: se ela diz "nesta questão, a resposta é C por causa de tal detalhe do enunciado", ela treina o aluno a reconhecer *aquela* questão. Uma explicação bem construída diz "o conceito é tal; aqui ele apareceu com C correta e B como armadilha comum" — e o aluno leva o conceito, não o item.

A regra editorial que decorre disso: a explicação deve ser redigida de forma que continue verdadeira e útil para *outras* questões do mesmo conceito, não apenas para aquela. Se a explicação só serve para o item em que está anexada, ela está ensinando o item — e precisa ser reescrita para ensinar o conceito.

### 8.8 Proporcionalidade e carga cognitiva

Ensinar o conceito não é despejar todo o conhecimento possível sobre ele. Uma explicação longa demais não é lida, ou dilui o ponto essencial em meio a informação acessória — violando a atenção à carga cognitiva estabelecida no Capítulo 6 (item 6.7). O feedback deve ser **proporcional**: extenso o suficiente para corrigir o equívoco e firmar o conceito, enxuto o suficiente para ser efetivamente absorvido no fluxo do estudo.

A proporcionalidade não é preguiça editorial — é precisão. A melhor explicação é a mais curta que ainda ensina o conceito por completo e trata o erro relevante. Nem um parágrafo defensivo de banca, nem um tratado; o suficiente para que o aluno saia com o conceito firme e siga estudando.

### 8.9 Registro emocional: informar, nunca punir nem manipular

O erro é tratado como informação legítima sobre o estado do conhecimento (coerente com o tratamento de regressão no Capítulo 3), nunca como falha a ser punida. O feedback não envergonha o aluno pelo erro nem o recompensa emocionalmente pelo acerto com artifícios de vaidade. Seu tom é o de quem informa e ensina, não o de quem dá veredito.

Essa neutralidade emocional é metodológica, não estética: um aluno que teme o erro passa a evitar o desafio, a preferir questões fáceis, a estudar para proteger um número — exatamente os comportamentos que todo o método combate. O feedback que trata o erro com naturalidade mantém o aluno disposto a enfrentar o difícil, que é onde o domínio real se constrói (Capítulo 4, item 4.7).

### 8.10 Consciência da armadilha da banca, sem contaminar o conceito

A explicação ensina um conceito banca-agnóstico (Capítulo 2) — essa é a lição durável e transferível entre bancas. Mas ela pode, adicionalmente, alertar sobre *como aquela banca* tende a construir a armadilha em torno daquele conceito, apoiada no Dossiê de Banca (Capítulo 5). É a diferença entre "o conceito é X" (universal) e "atenção: esta banca costuma testar X trocando este termo por aquele" (específico da banca).

Essa camada de consciência de armadilha é útil e coerente com "respeitar a banca escolhida" (Capítulos 4 e 6), mas está subordinada a uma regra: ela nunca substitui nem contamina o ensino do conceito. Primeiro o aluno aprende o conceito de verdade; só então o alerta sobre o estilo da banca faz sentido. Ensinar apenas a armadilha, sem o conceito por trás, seria ensinar a reconhecer pegadinhas — uma forma sofisticada de decorar, não de saber.

### 8.11 O feedback é produzido antecipadamente, nunca gerado durante o estudo

Coerente com a decisão definitiva de que IA não atua durante o estudo (Capítulo 4) e de que toda produção de conteúdo é editorial e verificada por humano (Capítulo 5): toda explicação é **pré-produzida** e anexada à questão pela equipe editorial. Durante a sessão, o sistema *seleciona e apresenta* a explicação certa por regras determinísticas — nunca gera, reescreve ou adapta o texto ao vivo.

A adaptação ao aluno, quando existe, está em *qual* ênfase pré-produzida é trazida à tona (por exemplo, destacar o tratamento do distrator que o aluno de fato escolheu), não em criar texto novo. O aluno nunca recebe uma explicação que nenhum humano verificou. Isso preserva a integridade factual (Capítulo 5) no exato ponto em que o produto ensina — o que é inegociável, porque uma explicação errada não apenas deixa de ensinar: ensina o conceito errado, a pior falha possível (Capítulo 5, item 5.6).

### 8.12 A explicação como artefato editorial de maior responsabilidade

Deste capítulo decorre uma elevação do padrão editorial estabelecido no Capítulo 5, sem alterá-lo: como a explicação é o único instrumento de ensino do produto, ela é o artefato editorial de maior responsabilidade — mais crítico, sob a ótica pedagógica, do que a seleção da questão em si. Uma questão excelente com explicação que apenas confirma o gabarito é uma oportunidade de ensino desperdiçada.

Isso não redefine o processo do Capítulo 5; define os **requisitos pedagógicos** que a produção de explicações do Capítulo 5 deve satisfazer: ensinar o conceito (8.3), tratar o erro (8.4), converter o acerto (8.5), generalizar para além do item (8.7), ser proporcional (8.8), ter registro informativo (8.9) e permanecer factualmente íntegra e verificada (8.11). Uma explicação que não atende a esses requisitos é conteúdo incompleto, ainda que a questão a que ela se anexa esteja perfeita.

### 8.13 O que este capítulo não define

Este capítulo define o papel pedagógico do feedback e da explicação. Não define:

- Como a explicação é apresentada em tela, sua formatação ou disposição visual.
- Como o sistema seleciona ou renderiza tecnicamente a explicação pré-produzida.
- O processo editorial de redação das explicações (definido no Capítulo 5) — aqui ficam apenas os requisitos pedagógicos que esse processo deve cumprir.
- Como o aluno constrói consciência do próprio progresso a partir do acúmulo de feedbacks (matéria de eventual capítulo sobre metacognição).

Essas definições pertencem a outros capítulos ou a especificações fora deste método.

---

## CAPÍTULO 9 — SIMULADOS E AVALIAÇÕES

### 9.1 Posicionamento

O Capítulo 7 já estabeleceu que o simulado pode servir como instrumento de evidência, mas nunca como medida de prontidão, e o Capítulo 8 (item 8.6) já reconheceu o modo de simulação de prova como recurso pontual de treino de condições reais. Este capítulo consolida e delimita: define a **finalidade pedagógica precisa** do simulado dentro do método, quando usá-lo, e as guardas que impedem que ele se torne o que é nas plataformas tradicionais — o centro de gravidade do estudo e a nota como objetivo.

A tese do capítulo é simples e restritiva: no SimulaPro, o simulado é um **instrumento subordinado, de finalidade específica**, nunca o eixo do estudo. O eixo do estudo é a construção contínua de domínio (Capítulos 3, 4 e 6). O simulado serve a esse eixo; jamais o substitui.

### 9.2 Por que o simulado tradicional falha como eixo de estudo

Registrado como parte do método:

- **Inverte ferramenta e objetivo** — torna o simulado o centro do estudo e a nota a recompensa, fazendo o aluno caçar pontuação em vez de construir domínio.
- **Compete contra pessoas via ranking** — desloca o foco do conteúdo para a posição relativa, gerando vaidade e ansiedade em vez de aprendizagem.
- **Diagnostica falsamente quando prematuro** — aplicado antes de haver domínio construído, produz um número desmoralizante e sem valor informativo.
- **Premia o cramming** — recompensa a memória de curto prazo, reforçando o comportamento oposto à retenção durável.
- **É um beco sem saída** — a nota aparece e nada muda no que o aluno estuda a seguir.

### 9.3 Estudo, prática e avaliação são três atividades distintas

Grande parte da confusão do modelo tradicional vem de tratar "resolver questões" como uma coisa só. O SimulaPro distingue três atividades, com finalidades diferentes:

- **Estudo** — a atividade de construir domínio: enfrentar conceitos novos e corrigir os frágeis, com feedback imediato (Capítulo 8), sequência adaptativa e espaçamento (Capítulos 4 e 6). O objeto é o conceito; o feedback ensina.
- **Prática** — a atividade de exercitar e consolidar domínio já em construção: recuperação repetida e variada do que já está sendo aprendido, ainda com feedback e ainda dentro do fluxo adaptativo. O objeto é firmar o que já foi introduzido.
- **Avaliação (simulado)** — um evento controlado que reproduz as condições da prova real: distribuição representativa da banca, tempo, formato e sequência do exame, com feedback tipicamente diferido para o fim (Capítulo 8, item 8.6). O objeto não é aprender um conceito específico, mas ensaiar a prova e gerar evidência agregada sob condições reais.

Confundir essas três atividades — tratar avaliação como se fosse estudo, ou estudo como se fosse avaliação — é um erro de categoria. O simulado é a terceira atividade, e só faz sentido quando as duas primeiras já produziram uma base de domínio.

### 9.4 A finalidade pedagógica do simulado

O simulado tem, no SimulaPro, exatamente duas finalidades legítimas — e nenhuma delas é "medir o quanto o aluno sabe" (isso é feito continuamente pelo modelo de domínio, Capítulo 3):

1. **Treino das condições de prova.** Fazer uma prova completa é uma habilidade distinta de dominar o conteúdo: administrar o tempo, sustentar a atenção por horas, lidar com a pressão, com a sequência de questões e com o formato específico da banca. Essa habilidade se treina, e o simulado é o instrumento que a treina. Um aluno pode dominar todos os conceitos e ainda assim ter desempenho ruim por não estar habituado às condições — o simulado ataca esse risco específico.

2. **Geração de evidência sob condições reais.** Cada resposta em um simulado é um evento de evidência que alimenta o modelo de domínio (Capítulos 3 e 4), como qualquer resposta — mas com uma qualidade particular: é recuperação sob pressão, sem apoio, sem feedback imediato. Isso a torna uma evidência valiosa de domínio *aplicável*, distinta da evidência produzida no estudo com feedback imediato.

Ambas as finalidades são serviços prestados ao eixo do estudo. Nenhuma delas eleva o simulado à condição de objetivo.

### 9.5 O simulado confirma domínio, mas não constrói domínio

Uma distinção metodológica central: por não ter feedback imediato e por concentrar muitas questões sob pressão, o simulado é **forte para confirmar domínio já existente e fraco para construir domínio novo**. A recuperação sem apoio confirma que o aluno realmente sabe (ou revela que não sabe), mas o momento de máxima aprendizagem — a correção do erro enquanto a mente está engajada (Capítulo 8, item 8.6) — não ocorre durante o simulado, e sim depois, quando os erros do simulado voltam ao ciclo de estudo.

Por isso o simulado não pode ser o principal meio de aprender. Um aluno que só faz simulados está se testando sem se corrigir no momento certo — acumula diagnósticos sem tratar as causas. O simulado revela; é o estudo, alimentado por essas revelações, que constrói.

### 9.6 Como o simulado produz evidência sem substituir a medição de domínio

A reconciliação com o Capítulo 7 é precisa: das duas coisas que um simulado produz — as respostas individuais e a nota agregada —, **o SimulaPro usa as primeiras e descarta a segunda como métrica.**

- As **respostas individuais** entram no modelo de domínio conceito a conceito, como evidência (ponderada por suas condições: sob pressão, sem feedback imediato). Elas atualizam a Confiança de Domínio de cada conceito envolvido, exatamente como qualquer sessão de estudo.
- A **nota agregada** não é usada como medida de domínio nem de prontidão. Ela é, no máximo, um subproduto que o aluno pode ver por curiosidade sobre seu desempenho naquele evento — nunca o indicador de sua preparação, que é a superfície de prontidão do Capítulo 7.

Assim, o simulado enriquece a medição de domínio (que continua sendo contínua e por conceito) sem jamais se tornar essa medição. O que mede prontidão é a superfície ponderada e projetada (Capítulo 7); o simulado apenas contribui com evidência para ela.

### 9.7 Em quais momentos o simulado deve ser utilizado

O momento certo decorre diretamente das finalidades (item 9.4):

- **Não no início.** Aplicar simulado antes de existir uma base de domínio é o erro do diagnóstico prematuro (item 9.2). Coerente com a rejeição do exame de nivelamento de entrada (Capítulo 6, item 6.3), o SimulaPro não abre a jornada com um simulado.
- **Periodicamente, uma vez que exista base de domínio.** Quando o aluno já consolidou uma parte relevante do conteúdo, simulados espaçados passam a ter valor: treinam condições e confirmam domínio sob pressão, com resultados que realimentam o estudo.
- **Com frequência crescente à medida que a data da prova se aproxima.** É perto da prova que o treino de condições (tempo, resistência, formato) se torna mais relevante — coerente com o estreitamento de foco descrito no Capítulo 7 (item 7.14). O simulado é mais útil no fim da jornada do que no começo.

Há também uma condição de espaçamento: dois simulados em sequência imediata, sem intervalo para que o estudo absorva os achados do primeiro, desperdiçam o segundo. O simulado só cumpre seu papel quando há tempo, entre um e outro, para agir sobre o que ele revelou.

### 9.8 Como respeitar o estilo e a distribuição de conteúdo da banca escolhida

Um simulado do SimulaPro reproduz a **forma da prova real** daquela banca, não um questionário genérico. É aqui que o Dossiê de Banca (Capítulo 5) se converte em valor direto: a composição do simulado espelha como aquela banca constrói uma prova real para aquele cargo — as disciplinas cobradas e suas proporções, o formato de item (Certo/Errado, múltipla escolha), a quantidade de questões e o tempo característico.

Duas regras inegociáveis governam essa composição:

- **Fidelidade à banca escolhida.** O simulado é composto exclusivamente de questões daquela banca, na distribuição representativa de suas provas. Isso é o que faz o simulado treinar a prova que o aluno vai realmente enfrentar.
- **Nunca misturar bancas.** A regra absoluta de todo o método (Capítulos 2, 4 e 6) vale integralmente aqui: um simulado nunca contém questões de outra banca, por nenhum motivo — nem para "completar" a distribuição, nem por escassez de questões. Escassez que impeça um simulado fiel é sinalizada como limitação de cobertura editorial (Capítulos 4 e 5), nunca contornada com questões de fora.

### 9.9 Como os resultados alimentam o motor sem a nota virar objetivo

O valor de um simulado se realiza **depois** dele, no ciclo de estudo — não no instante em que a nota aparece. Ao terminar um simulado:

- Cada conceito em que o aluno errou ou demonstrou fragilidade volta ao ciclo de priorização como revisão corretiva (Capítulo 4, item 4.2), com o feedback pedagógico completo (Capítulo 8) que o formato de avaliação havia diferido.
- Cada conceito confirmado sob pressão tem sua Confiança de Domínio reforçada como evidência de qualidade (item 9.5).
- A superfície de prontidão (Capítulo 7) é atualizada com essa nova evidência.

O critério de sucesso de um simulado, portanto, não é a nota — é **o que ele mandou o aluno estudar a seguir.** Um simulado cujos erros reabrem os conceitos certos para revisão cumpriu seu papel, tenha a nota sido qual for. Um simulado cuja nota o aluno contemplou e esqueceu, sem mudar nada no estudo, foi desperdiçado — mesmo com nota alta. Essa inversão de critério é o que impede a nota de virar objetivo: o objetivo é sempre o domínio que o simulado ajuda a construir depois, nunca o número que ele produz no momento.

### 9.10 Quando o simulado é útil e quando é apenas geração de ansiedade

A linha que separa as duas coisas é objetiva: **um simulado é útil quando altera o que o aluno estuda a seguir; é apenas ansiedade quando não altera nada.**

É útil quando: existe base de domínio para ele medir, está espaçado o suficiente para que seus achados sejam trabalhados, e seus resultados realimentam o estudo (item 9.9).

É apenas ansiedade quando: é prematuro (não há o que medir), é frequente demais (não há tempo de agir entre um e outro), é focado na nota (o aluno contempla o número em vez de agir sobre ele) ou é competitivo (o aluno mira posição relativa a outros). Em todos esses casos, o simulado consome energia emocional sem produzir aprendizagem — o retrato exato do modelo tradicional.

### 9.11 Como evitar que o aluno use simulados apenas para buscar pontuação maior

As guardas contra a caça à pontuação são metodológicas, não cosméticas:

- **Sem ranking entre alunos.** A competição relevante é do aluno contra o conteúdo cobrado pela banca, nunca contra outros candidatos. Comparação social não é oferecida como métrica, porque ela desloca o foco do domínio para a posição relativa.
- **A nota nunca é apresentada como objetivo nem como medida de preparação.** O resultado do simulado é sempre decomposto na superfície de domínio e prontidão (Capítulo 7) e na lista de conceitos a revisar (item 9.9) — o número agregado é o menos destacado dos resultados, não o mais.
- **Simulados são variados, não repetíveis para inflar nota.** Repetir simulados muito parecidos para ver a nota subir mede familiaridade com os itens (decoreba, Capítulo 4), não domínio. O método favorece composições variadas justamente para que "melhorar a nota" só seja possível melhorando o domínio real, nunca reconhecendo questões repetidas.
- **O feedback pós-simulado fala de conceitos, não de pontos.** Coerente com o Capítulo 8, o que o aluno recebe ao final é o ensino sobre o que errou e o direcionamento do que estudar — não uma celebração ou lamento do número.

O princípio unificador: no SimulaPro, é estruturalmente impossível "melhorar no simulado" sem melhorar o domínio, porque a nota não é tratada como algo que valha a pena perseguir isoladamente. Retira-se o incentivo à caça à pontuação retirando da pontuação o status de objetivo.

### 9.12 O que este capítulo não define

Este capítulo define o papel pedagógico dos simulados e avaliações. Não define:

- Como um simulado é montado, apresentado, cronometrado ou pontuado tecnicamente.
- Como os resultados são exibidos em tela ou relatórios.
- Parâmetros de qualquer natureza (com que frequência, quantas questões, qual proporção por disciplina) — que decorrem do Dossiê de Banca e de decisões operacionais fora deste método.
- Modalidades de avaliação diferentes do simulado de prova (se vierem a existir), que seriam objeto de definição própria.

Essas definições pertencem a outros capítulos ou a especificações fora deste método.

---

## CAPÍTULO 10 — ARQUITETURA DAS AVALIAÇÕES

### 10.1 Escopo

O Capítulo 9 definiu o simulado. Este capítulo dá o passo acima: define a **arquitetura completa das avaliações** do método — quantos tipos existem, qual a finalidade de cada um, quando usar, o que cada um mede e o que não deve medir, como cada um alimenta o Motor de Aprendizagem, e quais são estruturais e quais são opcionais. O simulado, definido no capítulo anterior, é aqui posicionado como um dos componentes dessa arquitetura, não o todo.

### 10.2 Por que o primitivo único de "conjunto de questões" é incorreto

Registrado como parte do método:

- **Trata evidências diferentes como iguais** — uma resposta com feedback imediato e uma resposta sob condições de prova têm naturezas distintas (Capítulo 9), e o primitivo único as achata.
- **Impede o uso correto de cada instrumento** — o aluno não sabe para que serve a atividade, e usa a ferramenta errada no momento errado.
- **Funde medição e ensino, degradando os dois** — medir domínio limpo exige ausência de apoio; ensinar bem exige feedback imediato; um primitivo único força as duas funções a coexistirem mal.
- **Destrói a fidelidade à prova real** — um conjunto genérico não ensaia a forma específica do exame da banca.

A arquitetura a seguir existe para impedir esse colapso.

### 10.3 Princípio reitor: a avaliação primária do SimulaPro é contínua, não um evento

A inversão mais importante deste capítulo em relação ao modelo tradicional: **a avaliação primária do SimulaPro não é um evento discreto — é o fluxo contínuo de evidência.** No modelo tradicional, avaliar é aplicar um teste em um momento. No SimulaPro, avaliar é o que acontece a cada resposta, o tempo todo: cada questão respondida no estudo é, simultaneamente, aprendizagem e avaliação, e é desse fluxo ininterrupto que o domínio é medido (Capítulo 3).

Isso significa que o instrumento avaliativo central do método não é o simulado nem nenhum teste especial — é a avaliação embutida em cada ato de estudo. Todos os demais instrumentos avaliativos são secundários e servem a propósitos específicos que a avaliação contínua, sozinha, não cobre.

### 10.4 O eixo que organiza a arquitetura

A arquitetura de avaliações se organiza por um único eixo distintivo: **o momento do feedback.**

- **Avaliação formativa** — feedback imediato. Ensina enquanto mede. É o modo do estudo, da prática e da revisão (Capítulos 6, 8 e 9).
- **Avaliação de condições** — feedback diferido, sob condições de prova. Mede sob pressão e ensaia o exame; ensina depois, quando os achados voltam ao ciclo (Capítulo 9).

Toda avaliação do método é uma dessas duas modalidades. O que varia dentro de cada uma é o escopo e a composição (item 10.7), nunca a natureza. Não há uma terceira modalidade — e essa contenção é deliberada: multiplicar tipos de avaliação recriaria, por outro caminho, a confusão que o primitivo único produz.

### 10.5 Tipo 1 — Avaliação Contínua Formativa (estrutural, primária)

- **Finalidade:** construir e medir domínio simultaneamente. É onde a aprendizagem acontece (Capítulo 8) e onde o domínio é efetivamente medido (Capítulo 3).
- **Momento:** o tempo todo, desde a primeira sessão até a véspera da prova. É a espinha dorsal permanente da jornada (Capítulo 6). Não tem "hora certa" porque é contínua.
- **O que mede:** a Confiança de Domínio de cada conceito, individualmente, com feedback imediato convertendo cada resposta em aprendizagem (Capítulo 8, item 8.5).
- **O que NÃO deve medir:** não produz nem apresenta uma "nota agregada" como conquista — isso reintroduziria a métrica de quantidade rejeitada nos Capítulos 1 e 3. Sua saída é o estado de domínio por conceito, nunca um placar.
- **Como produz evidência:** cada resposta é uma evidência direta, de alto valor de aprendizagem (por ter feedback imediato), que atualiza o modelo de domínio em tempo contínuo e realimenta imediatamente a priorização do Motor (Capítulo 4).

### 10.6 Tipo 2 — Avaliação de Condições / Simulado (estrutural para treino de prova, situacional)

Definido em detalhe no Capítulo 9; aqui, seu lugar na arquitetura:

- **Finalidade:** treinar as condições reais da prova (tempo, resistência, formato, sequência) e gerar evidência de recuperação sob pressão (Capítulo 9, item 9.4).
- **Momento:** nunca no início; periodicamente uma vez que exista base de domínio; com frequência crescente perto da data (Capítulo 9, item 9.7).
- **O que mede:** desempenho sob condições reais e confirmação de domínio sem apoio.
- **O que NÃO deve medir:** não é a autoridade de medição de domínio por conceito (isso é do Tipo 1), e sua nota agregada não é medida de domínio nem de prontidão (Capítulos 7 e 9). O simulado contribui com evidência para essas medições; não as substitui.
- **Como produz evidência:** cada resposta entra no modelo de domínio como evidência ponderada por suas condições (sob pressão, sem feedback imediato) — evidência forte de confirmação; a nota agregada é descartada como métrica (Capítulo 9, item 9.6).

### 10.7 Variações de escopo dentro da Avaliação de Condições

A modalidade de condições admite variação de escopo, sem se tornar um novo tipo:

- **Simulado completo** — reproduz a prova inteira da banca para o cargo, na forma fiel do Dossiê de Banca (Capítulo 5). É a variação estrutural da modalidade, especialmente perto da prova.
- **Simulado parcial ou temático** — um bloco menor, sob condições de prova (feedback diferido, cronometrado), restrito a parte do conteúdo. É útil no meio da jornada, quando um simulado completo ainda seria prematuro (Capítulo 9), mas o aluno já pode ensaiar condições sobre um subconjunto já construído. Esta variação é **opcional** (item 10.8).

Ambas as variações obedecem às mesmas regras da modalidade: feedback diferido, fidelidade à banca, nota agregada descartada, achados realimentando o estudo.

### 10.8 O que é estrutural e o que é opcional

- **Estrutural (o método não existe sem):**
  - Avaliação Contínua Formativa (Tipo 1) — é o próprio motor de medição de domínio; sem ela não há como medir progresso por domínio (Capítulo 3). Indispensável.
  - Simulado completo fiel à banca (Tipo 2, variação completa) — é o único instrumento que treina as condições reais da prova; sem ele, o aluno pode dominar o conteúdo e ainda assim ser surpreendido pelas condições. Estrutural para a finalidade de treino de prova, embora situacional no tempo.
- **Opcional (agrega, mas o método se sustenta sem):**
  - Simulado parcial/temático (Tipo 2, variação parcial) — conveniência de ensaio de condições em escopo reduzido; seu valor é atendido, de outra forma, pela combinação de avaliação contínua e simulado completo.

Nenhum outro tipo de avaliação é estrutural. Qualquer instrumento avaliativo que venha a existir precisa ser classificável como uma das duas modalidades (item 10.4) e justificar por que não é redundante com o que já existe — sob pena de recriar o primitivo único por acúmulo.

### 10.9 Como cada avaliação alimenta o Motor de Aprendizagem

Toda avaliação, de qualquer modalidade, alimenta o Motor pela mesma via — a evidência por conceito (Capítulo 3) — mas com pesos distintos conforme suas condições:

- A **avaliação formativa** alimenta o Motor de forma contínua e com feedback imediato, sendo a principal fonte tanto de aprendizagem quanto de medição.
- A **avaliação de condições** alimenta o Motor com evidência de confirmação sob pressão, e seus erros disparam revisão corretiva prioritária (Capítulo 4, item 4.2) com o feedback pedagógico que fora diferido (Capítulo 8).

Em nenhum caso a nota agregada de uma avaliação alimenta o Motor — o que o Motor consome são sempre as evidências individuais por conceito. Isso garante que a arquitetura inteira converge para a mesma medição de domínio, sem criar métricas paralelas concorrentes.

### 10.10 Como evitar redundância entre estudo, prática e avaliação

A redundância do modelo tradicional — "fazer mais mil questões" misturando indiscriminadamente as três atividades (Capítulo 9, item 9.3) — é evitada por um princípio: **as atividades são dirigidas pelo estado do conceito, não pelo volume.**

- Não existe "fazer mais questões" como fim em si. Existe "este conceito, neste estado, precisa disto agora": um conceito não iniciado precisa de estudo; um conceito em consolidação precisa de prática; um conjunto de conceitos já construídos pode precisar de ensaio sob condições. O Motor (Capítulo 4) escolhe a atividade conforme o estado, e é isso que impede a repetição sem propósito.
- A mesma questão não é reutilizada entre modalidades para inflar volume — a rotação de itens (Capítulos 4 e 8) evita tanto a redundância quanto a decoreba.
- Uma avaliação de condições nunca é aplicada sobre conteúdo que ainda não foi construído pela avaliação formativa — o que eliminaria a redundância de "testar o que ainda não se aprendeu".

O resultado é que estudo, prática e avaliação nunca competem nem se repetem: cada um é acionado por uma condição diferente do conceito, e a arquitetura garante que o aluno faça, a cada momento, a atividade que aquele estado de domínio requer.

### 10.11 Como preservar a fidelidade ao perfil da banca em cada avaliação

A fidelidade à banca se manifesta de forma diferente em cada modalidade, mas a regra de nunca misturar bancas (Capítulos 2, 4, 6 e 9) vale integralmente em ambas:

- Na **avaliação formativa**, a fidelidade está na *fonte*: só questões da banca escolhida são usadas, e a priorização segue o peso/incidência daquela banca (Capítulos 2 e 4). A composição é dirigida pelo estado de domínio, não pela forma do exame.
- Na **avaliação de condições**, a fidelidade está na *forma*: a composição reproduz a estrutura real da prova daquela banca — disciplinas, proporções, formato e duração — a partir do Dossiê de Banca (Capítulos 5 e 9).

Em ambos os casos, escassez de questões que comprometa a fidelidade é sinalizada como limitação de cobertura editorial (Capítulos 4 e 5), nunca resolvida com questões de outra banca.

### 10.12 O que este capítulo não define

Este capítulo define a arquitetura das avaliações — seus tipos, finalidades e relações. Não define:

- Como qualquer avaliação é montada, cronometrada, corrigida ou apresentada tecnicamente.
- Parâmetros de composição, frequência ou duração de qualquer avaliação.
- Modalidades de interface, relatórios ou visualização de resultados.
- Eventuais instrumentos avaliativos futuros, que só serão admitidos se classificáveis nas duas modalidades deste capítulo e justificados contra redundância.

Essas definições pertencem a outros capítulos ou a especificações fora deste método.

---

## CAPÍTULO 11 — PRINCÍPIOS INVIOLÁVEIS (A CONSTITUIÇÃO DO MÉTODO)

### 11.1 Natureza deste capítulo

Este capítulo é a Constituição do Método Pedagógico SimulaPro V1. Diferentemente dos anteriores, que definem *como* o método funciona, este define *o que jamais pode deixar de ser verdade*, sob qualquer versão futura, qualquer nova banca, qualquer nova tecnologia e qualquer pressão comercial. Ele consolida, em um núcleo protegido, os compromissos que já foram estabelecidos ao longo dos Capítulos 1 a 10 e os declara invioláveis.

Sua função é operacional, não cerimonial: existe para tornar a deriva impossível de acontecer silenciosamente. Toda decisão futura sobre o SimulaPro deve ser testável contra este capítulo, e qualquer decisão que o contrarie é, por definição, uma decisão que descaracteriza o produto — não uma evolução dele.

### 11.2 Por que uma Constituição é necessária

Registrado como fundamento deste capítulo — os métodos educacionais se corroem por mecanismos previsíveis:

- **Morte por mil cortes** — funcionalidades individualmente razoáveis que, somadas, contradizem os princípios uma concessão de cada vez.
- **Ausência de critério de coerência** — sem um núcleo escrito, "isto respeita o método?" é substituído por "isto move a métrica?".
- **Captura pela métrica comercial** — o organização otimiza o que é medível e imediato (engajamento) em detrimento do que é lento e essencial (domínio durável).
- **Perda de intenção por rotatividade** — restrições cuja razão se perdeu parecem acidentes a serem otimizados.
- **Novidade tecnológica como pretexto** — capacidades novas inseridas por serem novas, não por servirem ao método.

A Constituição neutraliza todos esses mecanismos ao dar existência escrita, permanente e testável ao núcleo do método.

### 11.3 Os Princípios Invioláveis

Os princípios a seguir são permanentes. Nenhuma versão futura do SimulaPro pode contrariá-los sem deixar de ser o SimulaPro.

**Artigo 1 — O objetivo é o domínio durável.** O SimulaPro existe para levar o aluno ao domínio real e durável do conteúdo cobrado pela banca escolhida. Nenhum outro objetivo — engajamento, tempo de uso, consumo de conteúdo, crescimento de métrica — pode se sobrepor a este.

**Artigo 2 — Progresso é domínio de conceito.** O progresso do aluno é sempre medido por domínio de conceito, nunca por quantidade de questões respondidas, horas estudadas ou aulas assistidas.

**Artigo 3 — Aprende-se o conceito, nunca a resposta.** Todo conteúdo, feedback e avaliação existe para ensinar conceitos transferíveis. Nada no produto pode induzir a memorização de respostas de itens específicos.

**Artigo 4 — Domínio é evidência ao longo do tempo, não percentual de acertos.** Domínio é confiança construída por evidência ponderada e espaçada. Percentual de acertos nunca é a medida de domínio.

**Artigo 5 — Honestidade radical com o aluno.** O produto expõe a fragilidade real do aluno, nunca infla o progresso e nunca promete aprovação. Conforto, engajamento ou retenção jamais justificam enganar o aluno sobre seu verdadeiro estado de preparação.

**Artigo 6 — Nenhuma métrica de vaidade como objetivo.** Nota, ranking entre alunos e contadores de volume nunca são apresentados como objetivo ou recompensa. A nota agregada de qualquer avaliação nunca mede domínio nem prontidão.

**Artigo 7 — Integridade da fonte.** Todo conteúdo tem lastro em fonte oficial. Nunca se fabrica questão, alternativa, gabarito ou explicação. Questões anuladas são descartadas. Explicações são factualmente verdadeiras e verificadas por humano.

**Artigo 8 — Conceito único e banca-agnóstico.** O eixo de conteúdo é único. O domínio de um conceito é uma medida estável, jamais fragmentada ou duplicada por banca.

**Artigo 9 — Uma banca por plano; bancas nunca se misturam.** O aluno estuda uma única banca por plano de estudos. Nenhuma avaliação, priorização, funcionalidade ou necessidade de cobertura mistura bancas automaticamente.

**Artigo 10 — IA fora do estudo.** A Inteligência Artificial nunca atua durante o estudo do aluno. Atua apenas na produção editorial, sempre sob verificação humana e nunca como fonte final de verdade factual.

### 11.4 O que é imutável e o que é mutável

A Constituição distingue com precisão duas camadas, e essa distinção é o que permite ao SimulaPro evoluir sem se corromper:

- **O núcleo inviolável** — os princípios do item 11.3. É imutável no curso normal do produto. Nenhuma funcionalidade, versão ou decisão comercial pode alterá-lo.
- **A superfície mutável** — tudo o mais. Os comportamentos específicos do Motor de Aprendizagem (Capítulo 4), os limiares e parâmetros, a composição das avaliações (Capítulos 9 e 10), a forma das explicações (Capítulo 8), as tecnologias empregadas, a interface: tudo isso pode e deve ser melhorado ao longo do tempo, desde que continue servindo ao núcleo.

A regra que liga as duas camadas: **a superfície existe para realizar o núcleo, nunca para contorná-lo.** Uma melhoria na superfície que enfraqueça um princípio do núcleo não é melhoria — é violação disfarçada de progresso.

### 11.5 O Teste de Coerência: como avaliar se uma nova funcionalidade respeita ou viola o método

Toda nova funcionalidade, decisão ou mudança é submetida a um teste, e este teste tem uma natureza específica que precisa ser entendida: **é um veto por princípio, não uma ponderação de custo-benefício.**

O teste opera assim:

1. Para cada Artigo do item 11.3, pergunta-se: esta funcionalidade contraria este princípio? Se a resposta for sim para qualquer Artigo, a funcionalidade é **rejeitada — independentemente de seu benefício comercial, de engajamento ou de conveniência.** Não se "compra" a violação de um princípio com ganho de métrica. Um princípio violado não é um custo a ser compensado; é uma linha que não se cruza.
2. Uma funcionalidade **neutra** a todos os princípios é avaliada normalmente, pelos seus méritos.
3. Uma funcionalidade que **fortalece** um ou mais princípios é favorecida.

Dois pontos completam o teste:

- **O ônus da prova é da funcionalidade, não do método.** Cabe a quem propõe demonstrar que a funcionalidade não viola nenhum princípio — não ao método provar que ela viola. Na dúvida, prevalece a proteção do núcleo.
- **A intenção não importa, o efeito importa.** Uma funcionalidade proposta com boa intenção que, na prática, faça o aluno perseguir uma nota, decorar respostas ou receber conteúdo não verificado viola o princípio ainda que ninguém tenha desejado violá-lo. O teste avalia o efeito sobre o aluno, não o propósito de quem propôs.

### 11.6 A subordinação do comercial ao pedagógico

O SimulaPro precisa ser comercialmente sustentável — isso não é negado nem tratado como impuro. O que a Constituição estabelece é a **ordem de precedência quando há conflito**: o sucesso comercial deve ser buscado *através* do método, nunca *contra* ele.

O fundamento dessa ordem é uma tese, não um sacrifício: **a aprendizagem durável é, ela própria, a melhor estratégia comercial de longo prazo.** Um aluno que realmente domina o conteúdo e é aprovado é o melhor produto e o melhor marketing que existem. O conflito entre comercial e pedagógico é quase sempre um conflito entre o *curto prazo medível* (engajamento hoje) e o *longo prazo essencial* (aprovação amanhã) — e a Constituição resolve esse conflito sempre a favor do segundo.

Consequências invioláveis:

- Quando uma métrica comercial e um princípio pedagógico conflitam, o princípio vence — sempre, por construção. A otimização comercial acontece apenas dentro do espaço que os princípios permitem.
- Nenhum mecanismo de monetização pode reintroduzir um padrão anti-pedagógico já rejeitado pelo método: não se vende "mais questões" como se volume fosse valor, não se gamifica a vaidade para reter, não se promete aprovação para converter.

### 11.7 Como preservar a coerência com novas bancas, cursos e tecnologias

A expansão do SimulaPro é esperada e desejada — e a Constituição garante que ela nunca frature o método:

- **Novas bancas** encaixam-se na arquitetura existente (Capítulos 2 e 5): anexam-se ao eixo de conteúdo único e compartilhado, com seu próprio contexto de avaliação e seu Dossiê. Uma nova banca nunca bifurca o eixo de conteúdo nem cria um método paralelo (Artigo 8).
- **Novos cursos** (novas Áreas de Atuação, além da inicial) replicam o *mesmo* método. A estrutura pedagógica (Capítulo 2) e os princípios desta Constituição são agnósticos ao curso: um novo curso é um novo eixo de conteúdo sob a mesma Constituição, jamais um novo conjunto de regras.
- **Novas tecnologias** são admitidas apenas quando servem aos princípios. Nenhuma tecnologia justifica violar um princípio por ser nova ou poderosa. A IA é o caso vivo: admitida na produção editorial sob verificação (Artigo 10), permanece proibida no estudo — e nenhum avanço futuro em IA altera isso enquanto o Artigo 10 for parte do núcleo.

O princípio geral: a expansão adiciona conteúdo e contexto sob a Constituição; nunca adiciona exceções a ela.

### 11.8 Como futuras versões devem evoluir sem romper os fundamentos

Versões futuras (V2, V3 e além) devem mudar — a estagnação também é uma forma de falhar. A Constituição define como essa evolução acontece sem ruptura:

- **Na superfície, mude livremente e com frequência.** Melhorar o Motor, as avaliações, as explicações, a experiência e a tecnologia é não apenas permitido como esperado, desde que cada mudança continue servindo ao núcleo (item 11.4).
- **O núcleo só se altera por emenda constitucional explícita.** Um princípio inviolável jamais pode ser alterado silenciosamente nem como efeito colateral de uma funcionalidade. Alterá-lo exige um ato deliberado, documentado e consciente, que declare abertamente: "este princípio do núcleo está sendo alterado, e esta é a razão". Essa exigência é o mecanismo antideriva central — a corrosão só é possível quando é silenciosa; ao forçar que qualquer mudança no núcleo seja explícita e assumida, a Constituição torna a erosão impossível de acontecer sem que alguém a declare.
- **Alterar o núcleo é criar outro produto.** Mudar um princípio inviolável não produz "uma nova versão do SimulaPro" — produz um produto diferente usando o mesmo nome. A distinção é registrada aqui para que futuras equipes saibam que emendar o núcleo é uma decisão de outra ordem, incomparavelmente mais grave do que qualquer decisão de superfície, e que jamais deve ser tomada por conveniência, pressão ou inércia.

### 11.9 O que este capítulo não define

Esta Constituição define o núcleo inviolável e o processo de proteção e evolução do método. Não define:

- Os detalhes de superfície que ela protege — que estão nos demais capítulos e nas especificações operacionais.
- Processos organizacionais, papéis ou governança concreta da equipe que aplica o Teste de Coerência.
- Qualquer aspecto de implementação, interface, tecnologia ou comercial — que são superfície, sujeitos aos princípios mas não definidos aqui.

Esta Constituição rege todos os capítulos anteriores e todos os que vierem. Em caso de conflito entre qualquer decisão futura e os princípios do item 11.3, prevalecem os princípios.

---

## CAPÍTULO 12 — EVOLUÇÃO CIENTÍFICA DO MÉTODO

### 12.1 Natureza deste capítulo final

O Capítulo 11 estabeleceu o que no método é permanente. Este capítulo, que encerra o documento, estabelece o oposto complementar: **como o método deve mudar.** Ele define a epistemologia da própria evolução do SimulaPro — como um método baseado em evidências aprende sobre si mesmo, corrige-se e incorpora conhecimento novo, sem jamais abandonar os fundamentos que o Capítulo 11 protege.

Sua tese central: o SimulaPro é um sistema vivo, mas não à deriva. Ele evolui continuamente em suas práticas e permanece imutável em seus princípios. Essa combinação — evolução constante dos meios, permanência absoluta dos fins — é o que o distingue tanto do dogma quanto do modismo.

### 12.2 Os dois fracassos que este capítulo previne

Registrado como fundamento:

- **Imobilismo** — confundir estabilidade com congelar as práticas. O método que trata sua forma atual como sagrada para de aprender e transforma práticas datadas em dogma.
- **Ruptura** — confundir inovação com abandonar os fundamentos. O método que muda a cada tendência perde a identidade e vira uma sequência de modismos.

Ambos nascem de não distinguir fins de meios. Este capítulo faz essa distinção o eixo de toda evolução.

### 12.3 Princípios são fins; práticas são hipóteses

A distinção que organiza todo o capítulo:

- **Os princípios (Capítulo 11) são fins — escolhas de valor.** Que o progresso seja medido por domínio, que o aluno aprenda conceitos e não respostas, que o produto seja honesto: nada disso é uma afirmação empírica que dados possam confirmar ou refutar. São decisões sobre o que o método *quer ser*. Por isso são permanentes e não se dobram a evidência — nenhum experimento pode dizer o que se deve valorizar.
- **As práticas (Capítulos 2 a 10) são meios — hipóteses empíricas.** Que o espaçamento com determinado ritmo consolide melhor o domínio, que a intercalação produza evidência mais confiável, que certa forma de explicação ensine mais: tudo isso são afirmações sobre a realidade, testáveis e falíveis. São a *melhor teoria atual* de como realizar os princípios — e, como toda teoria, são provisórias e devem melhorar diante de evidência superior.

O método deve, portanto, sustentar suas práticas com convicção operacional e, ao mesmo tempo, humildade epistemológica: agir segundo elas hoje, sabendo que são hipóteses que podem ser superadas amanhã. Tratar uma prática como se fosse um princípio (imobilismo) ou um princípio como se fosse uma prática (ruptura) são os dois erros que a distinção elimina.

### 12.4 Como distinguir evolução de ruptura

O critério é direto e decorre de 12.3:

- **Evolução** é melhorar uma *prática* para realizar melhor um *princípio*. Muda como o método alcança seus fins, não os fins. É bem-vinda, esperada e contínua. Opera inteiramente sobre a superfície mutável (Capítulo 11, item 11.4) e nunca precisa tocar o núcleo.
- **Ruptura** é alterar um *princípio*. Muda o que o método quer ser. Não é evolução científica — é uma decisão de valor, que só pode ocorrer pelo processo de emenda constitucional explícita (Capítulo 11, item 11.8), jamais como subproduto de uma melhoria técnica.

A pergunta que separa as duas: a mudança proposta altera *o que estamos tentando alcançar* ou *quão bem o alcançamos*? Se a segunda, é evolução — prossiga sob validação (12.6). Se a primeira, é ruptura — e uma proposta de melhoria de prática que só funcione às custas de abandonar um princípio não é uma melhoria; é uma ruptura disfarçada, e deve ser reconhecida e tratada como tal.

### 12.5 Como incorporar novos conhecimentos da ciência da aprendizagem

As práticas do SimulaPro são fundadas em ciência da aprendizagem — espaçamento, efeito de teste, intercalação, curva do esquecimento, dificuldades desejáveis (Capítulos 3, 4 e 6). Essa ciência avança, e o método deve acompanhá-la — mas de forma criteriosa, não reativa:

- **Um achado novo é uma hipótese candidata, não uma verdade a adotar.** A publicação de um resultado — por mais prestigiado que seja — não é razão suficiente para mudar uma prática. O achado é tratado como candidato a melhoria, sujeito a validação no contexto real do SimulaPro (12.6).
- **A validade de um achado é contextual.** Um resultado obtido em outro público, outro conteúdo ou outras condições pode não se transferir para concursos, aprendizes adultos e este acervo. O método pergunta não "isto é verdade em geral?", mas "isto melhora o domínio *aqui*?".
- **A própria ciência da aprendizagem é provisória e contestada.** O método não persegue cada artigo nem trata consenso momentâneo como definitivo. Pesa a força e a convergência da evidência, e resiste tanto a ignorar o conhecimento estabelecido quanto a se curvar a modismos acadêmicos.

Incorporar ciência nova é, assim, um ato de julgamento fundamentado — nunca automático por prestígio nem inércia por tradição.

### 12.6 Como validar que uma mudança realmente melhora o método

Nenhuma prática é alterada por intuição, opinião ou moda. Uma mudança só é adotada quando **demonstra melhorar aquilo que os princípios valorizam** — e este ponto é decisivo:

- **A validação é feita contra desfechos alinhados aos princípios** — domínio durável, prontidão honesta, transferência para questões novas — nunca contra proxies. Uma mudança que aumente o engajamento, o número de questões feitas ou a satisfação imediata, mas não melhore o domínio real, não é uma melhoria do método: é exatamente o tipo de otimização de proxy que o Capítulo 11 (Artigos 1, 2 e 6) proíbe. Não se valida uma mudança pedagógica por uma métrica comercial.
- **Toda mudança é uma hipótese sob teste, não uma certeza a implantar.** Ela é comparada com a prática atual e mantida apenas se superá-la nos desfechos que importam. Se não se puder demonstrar que é melhor, não se adota — o ônus da prova é da mudança (coerente com Capítulo 11, item 11.5), e a prática vigente tem a seu favor a presunção de já estar validada pelo uso.
- **A ausência de melhoria comprovada é razão para não mudar.** Mudar por mudar, ou por novidade, é rejeitado com a mesma firmeza com que o imobilismo é rejeitado. O método muda muito — mas sempre por evidência, nunca por impulso.

### 12.7 Como revisar hipóteses sem comprometer os princípios

Revisar práticas é ciência normal do método e deve ser frequente. A garantia de que essa revisão nunca comprometa os fundamentos está na fronteira definida em 12.3 e 12.4:

- Dentro dos princípios, revise livremente. Qualquer prática pode ser questionada, testada e substituída por outra melhor, desde que a nova continue servindo aos mesmos princípios.
- Se uma revisão de prática só for possível violando um princípio, ela deixa de ser uma revisão de hipótese e passa a ser uma questão constitucional — e é encaminhada ao processo de emenda (Capítulo 11), que é uma decisão de valor deliberada, jamais uma consequência lateral de um experimento.

Assim, o método pode duvidar de tudo o que *acredita* (suas práticas) sem nunca colocar em dúvida, por via científica, o que *escolheu ser* (seus princípios). A dúvida metódica é ilimitada na superfície e não se aplica ao núcleo — porque valores não são refutáveis por dados.

### 12.8 Como lidar com novas tecnologias, incluindo IA

Tecnologia é avaliada exclusivamente como meio a serviço dos princípios — nunca adotada por ser nova ou poderosa:

- **Novidade não é evidência de valor.** Uma tecnologia nova é submetida à mesma validação de qualquer mudança de prática (12.6): só é adotada se melhorar comprovadamente um desfecho alinhado aos princípios. Ser recente ou impressionante não conta.
- **Poder não justifica expandir o papel além de onde a tecnologia serve.** O método resiste ao solucionismo — à tentação de aplicar uma capacidade poderosa em todo lugar porque ela existe. Cada uso é justificado por servir a um princípio, ou não acontece.
- **A IA é o caso vivo e permanente desta regra.** O Artigo 10 (Capítulo 11) fixou que a IA não atua no estudo e atua na produção editorial apenas sob verificação humana. O papel da IA *dentro* da produção editorial pode crescer à medida que a tecnologia melhora — isso é evolução de prática, sujeita a validação. Mas a proibição da IA no estudo é um princípio, não uma prática: **nenhum avanço futuro em IA, por maior que seja, reabre essa questão por via técnica.** Reabri-la exigiria emenda constitucional explícita — uma decisão de valor, não uma resposta ao poder da tecnologia.

### 12.9 Como futuras versões preservam a identidade

A identidade do SimulaPro não está em como ele faz as coisas — está em quais fins persegue e sob quais valores. Versões futuras (V2, V3 e além) mudarão profundamente suas práticas, e devem mudá-las; ainda assim serão reconhecivelmente o SimulaPro se, e somente se, continuarem realizando os princípios do Capítulo 11.

Este documento — o Método Pedagógico SimulaPro V1 — é a referência contra a qual toda evolução futura se mede. Uma versão futura não prova sua legitimidade por fazer as coisas de modo diferente de V1, nem por fazê-las igual; prova-a por ainda buscar os mesmos fins, pelos mesmos valores, com práticas que a evidência mostrou serem melhores. A continuidade da identidade é a continuidade dos princípios, não a das práticas.

### 12.10 Honestidade intelectual e limitações admitidas

Um método baseado em evidências deve a si mesmo a mesma honestidade que o Capítulo 7 exige que o produto tenha com o aluno. Isso significa admitir abertamente:

- **Que suas práticas são hipóteses, não certezas.** O método sustenta suas escolhas atuais como as melhores que conhece hoje — não como verdades finais. Ele distingue o que *sabe* do que *acredita* e do que *espera*.
- **Que tem limitações conhecidas.** A medição de domínio é uma estimativa, não uma certeza; a prontidão é uma projeção, não uma garantia (Capítulo 7); a granularidade e a classificação de conceitos são julgamentos humanos que podem errar (Capítulo 5); o método é fundamentado num contexto específico e não se presume universal sem validação. Essas limitações são declaradas, não escondidas.
- **Que prefere a evidência à consistência com o próprio passado.** Quando evidência melhor contradiz uma prática, mesmo uma prática cara ou antiga, o método a abandona. A coerência que ele preserva é a coerência com seus princípios — nunca a teimosia de manter uma prática só porque foi decidida antes.
- **Que nunca afirma mais do que pode sustentar.** A mesma sobriedade que impede prometer aprovação ao aluno impede o método de se declarar completo, perfeito ou definitivo. Ele é o melhor que se sabe construir hoje, comprometido a ser melhor amanhã.

Essa honestidade não é uma fraqueza do método — é a condição de sua seriedade. Um método que se declara acabado parou de ser científico; um método que admite seus limites e se mantém aberto a evidência melhor é um método vivo.

### 12.11 Encerramento

O Método Pedagógico SimulaPro V1 se encerra como começou: com a convicção de que ensinar de verdade é diferente de dar a sensação de que se ensinou. Ao longo destes doze capítulos, essa convicção se desdobrou em uma estrutura de conteúdo estável, um modelo de domínio que mede aprendizagem real, um motor que a constrói, uma metodologia editorial que a sustenta, uma jornada que a conduz, uma avaliação que a verifica com honestidade, uma arquitetura que organiza seus instrumentos, uma Constituição que a protege e, agora, uma disciplina de evolução que a mantém viva.

O método é, ao mesmo tempo, permanente e mutável — e não há contradição nisso. É permanente naquilo que escolheu ser: seus princípios, que são fins e valores, não se dobram a nada. É mutável em tudo o que faz para chegar lá: suas práticas, que são hipóteses, devem sempre se dobrar a evidência melhor. Essa é a natureza de um sistema vivo baseado em evidências e protegido por princípios permanentes — capaz de estar errado sobre os meios e corrigir-se, sem jamais vacilar sobre os fins.

Este documento é a versão 1. Que as próximas o superem em prática, honrando-o em princípio.

---

*Fim do Capítulo 12 e do Método Pedagógico SimulaPro V1.*
