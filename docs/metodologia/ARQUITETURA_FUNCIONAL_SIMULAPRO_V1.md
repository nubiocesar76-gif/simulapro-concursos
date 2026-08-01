# ARQUITETURA FUNCIONAL SIMULAPRO V1

## Introdução

### Propósito deste documento

Este documento traduz o **Método Pedagógico SimulaPro V1** — definitivo e inalterável — em componentes funcionais concretos do sistema. Ele responde a uma única pergunta, e a nenhuma outra:

> **Como o software implementa fielmente o Método Pedagógico SimulaPro V1?**

O Método define *o que* o SimulaPro deve fazer, pedagogicamente, e *por quê*. Este documento define *quais componentes funcionais* o sistema precisa ter, *quais responsabilidades* cada um carrega e *quais garantias* a arquitetura oferece, de modo que cada princípio pedagógico se realize no software. É a camada intermediária entre a metodologia e a construção técnica.

### O que este documento NÃO é

Para preservar essa camada intermediária com rigor, este documento não discute — e nenhum de seus capítulos discutirá:

- **Implementação** — algoritmos, estruturas de dados, código, bibliotecas.
- **Tecnologia** — linguagens, frameworks, serviços, infraestrutura.
- **Persistência** — banco de dados, modelagem de tabelas, armazenamento.
- **Interface** — telas, fluxos de navegação, apresentação visual, experiência do usuário.

Tudo isso pertence às especificações técnicas, que virão *depois* deste documento e *fundamentadas* nele. Aqui, "componente" significa uma unidade funcional de responsabilidade — o que ela é responsável por garantir —, nunca uma unidade de software concreta. "Garantia" significa uma propriedade que a arquitetura assegura, não o mecanismo técnico que a assegura.

### O mandato de fidelidade

Este documento se submete a um mandato único, herdado diretamente da natureza do Método: **fidelidade completa e verificável.** Isso impõe duas obrigações simétricas:

1. **Nenhum princípio do Método pode ficar sem tradução funcional.** Todo princípio, decisão e comportamento definido nos doze capítulos do Método precisa ter, aqui, um componente ou uma garantia que o realize. Um princípio sem componente correspondente é um princípio que o software não implementa — uma falha de fidelidade.
2. **Nenhum componente pode existir sem justificativa no Método.** Todo componente funcional descrito aqui precisa existir *porque* o Método o exige. Um componente sem princípio que o justifique é funcionalidade que o Método não pediu — e, pela Constituição do Método (Capítulo 11), suspeita até prova de coerência.

Essa dupla obrigação é o que distingue este documento de uma simples decomposição de sistema: ele não descreve o que seria conveniente construir, mas exclusivamente o que é necessário para honrar o Método — nem mais, nem menos. O último capítulo (Matriz de Fidelidade) existe para tornar esse mandato auditável, mapeando cada princípio ao componente que o realiza.

### Como este documento se relaciona com o Método

Este documento é subordinado ao Método em todos os pontos. Onde houver dúvida, o Método prevalece. Este documento nunca reinterpreta, flexibiliza ou "melhora" um princípio pedagógico — apenas o traduz em responsabilidade funcional. Em particular, os Princípios Invioláveis (Capítulo 11 do Método) não são aqui tratados como diretrizes a serem respeitadas pela boa vontade de cada componente, mas como princípios **protegidos por garantias estruturais, mecanismos de validação e auditoria** — de modo que qualquer violação seja explícita, detectável e exija decisão consciente, jamais silenciosa (Capítulo 10 deste documento). A diferença é deliberada: um princípio que depende de disciplina é um princípio que a deriva um dia contornará sem que ninguém perceba; um princípio protegido por estrutura, validação e auditoria só pode ser contrariado às claras, por escolha assumida.

### Princípio organizador da estrutura

A estrutura deste documento não espelha o Método capítulo a capítulo de forma mecânica. Ela se organiza em torno de **componentes funcionais** — que às vezes traduzem um único capítulo do Método, às vezes vários — acrescidos de dois blocos que o Método definiu como princípios mas não como arquitetura: as **garantias estruturais** dos princípios invioláveis e a **arquitetura para evolução**. Fecha com a **matriz de fidelidade**, que prova a completude da tradução. Essa organização evita tanto a redundância de um espelhamento 1:1 quanto a omissão das propriedades transversais que nenhum componente isolado sustenta.

---

## Estrutura do Documento (Índice)

> Os capítulos abaixo estão apenas enunciados, com o escopo que cada um cobrirá. Nenhum será desenvolvido antes da validação desta arquitetura geral.

**Capítulo 1 — Modelo Funcional do Sistema**
Estabelece a visão de sistema inteiro: a missão funcional da arquitetura, os grandes componentes funcionais do SimulaPro, a responsabilidade exclusiva de cada um, como se relacionam sem sobreposição, quais pertencem ao núcleo do método e quais o apoiam, e como essa divisão mantém futuras implementações fiéis ao Método. Consolida a Missão (Método, Cap. 1) na organização de responsabilidades que rege todo o documento.

**Capítulo 2 — Modelo de Conhecimento**
Define o componente responsável por representar funcionalmente os dois eixos do Método: o Eixo de Conteúdo (Área → Cargo → Disciplina → Assunto → Conceito) e o Eixo de Avaliação (Banca → Concurso → Questão), sua junção na Questão, o grafo de pré-requisitos entre Conceitos e o peso/incidência de cada Conceito por banca. Traduz a Estrutura Pedagógica (Método, Cap. 2).

**Capítulo 3 — Modelo de Domínio**
Define o componente (Registro de Evidência e Domínio) responsável por transformar cada resposta em evidência, ponderá-la (formato, dificuldade, recência, consistência, variedade), manter a Confiança de Domínio e os estados do Conceito por aluno, e projetar seu decaimento no tempo. Estabelece o caminho único de escrita por evidência que alimenta todo o restante. Traduz o Domínio de Conhecimento (Método, Cap. 3).

**Capítulo 4 — Motor de Aprendizagem**
Define o componente (Motor de Sequenciamento) que decide, de forma explicável e sem IA, o que apresentar a seguir: priorização (revisão corretiva, preventiva, continuidade, conceito novo), intercalação, resposta à fadiga e à estagnação, progressão de dificuldade e rotação de itens contra a memorização. Traduz o Motor de Aprendizagem (Método, Cap. 4).

**Capítulo 5 — Jornada de Aprendizagem**
Define o componente (Gestão da Jornada e do Plano de Estudos) responsável pela dimensão longitudinal: o plano vivo, o diagnóstico pelo uso (sem exame de nivelamento), a liberação de Conceitos por pré-requisito, o agendamento de revisão espaçada, o tratamento de ausência e a adaptação de carga sem perda de continuidade. Traduz o Modelo de Evolução do Aluno (Método, Cap. 6).

**Capítulo 6 — Feedback Pedagógico**
Define o componente responsável por selecionar e entregar a explicação pré-produzida correta no momento certo — ênfase no distrator escolhido, tratamento do acerto, tempo imediato por padrão e diferido em simulação —, garantindo que nada seja gerado ao vivo. Traduz o Feedback Pedagógico e o Papel da Explicação (Método, Cap. 8).

**Capítulo 7 — Orquestração das Avaliações**
Define o componente responsável pelas duas modalidades de avaliação: a contínua formativa (fonte primária de evidência) e a de condições/simulado (composição fiel à banca a partir do Dossiê, feedback diferido, nota agregada descartada como métrica), assegurando que atividades sejam dirigidas por estado do Conceito, não por volume. Traduz Simulados e Avaliações e a Arquitetura das Avaliações (Método, Caps. 9 e 10).

**Capítulo 8 — Prontidão para Prova**
Define o componente (Avaliação de Prontidão) que constrói a superfície de prontidão ponderada e projetada até a data, detecta fragilidade e falsa confiança, distingue Conceitos críticos de secundários e expõe a superfície de risco — sem jamais reduzir prontidão a uma nota nem prever aprovação. Traduz a Avaliação da Prontidão para a Prova (Método, Cap. 7).

**Capítulo 9 — Produção Editorial**
Define o componente de apoio que autora e mantém o patrimônio pedagógico e o que o sistema garante para que a metodologia editorial se cumpra: eixo de conteúdo único, fusão de Conceitos preservando histórico, sinalização de testabilidade insuficiente, marcação de Conceitos perecíveis por legislação, ciclo de vida da questão (ativa/aposentada/anulada), o Dossiê de Banca como estrutura funcional e a verificação como condição de entrada de todo artefato. Traduz a Metodologia Editorial (Método, Cap. 5).

**Capítulo 10 — Garantias Estruturais e Governança**
Consolida os invariantes que emergem dos capítulos anteriores em uma Constituição da Arquitetura Funcional: as propriedades que nunca podem ser violadas, o mapa de caminhos de escrita exclusivos, as dependências permitidas e proibidas, a detecção de inconsistências sem alterar responsabilidades, a preservação de auditabilidade, explicabilidade, rastreabilidade e integridade ao longo da evolução, e a governança que impede que novas funcionalidades criem acoplamentos. Protege, no plano arquitetural, os Princípios Invioláveis do Método (Método, Cap. 11).

*(O capítulo originalmente previsto como "Arquitetura para Evolução" foi oficialmente incorporado ao Capítulo 10 — Garantias Estruturais e Governança, que consolidou a governança da evolução. Não é escrito separadamente.)*

**Capítulo 11 — Matriz de Fidelidade entre Método Pedagógico e Arquitetura Funcional**
Fecha o documento com o mapeamento auditável entre cada princípio, decisão e comportamento do Método e o componente ou garantia funcional que o realiza — provando que nenhum princípio ficou sem tradução e nenhum componente existe sem justificativa. É o instrumento que torna o mandato de fidelidade verificável.

---

## CAPÍTULO 1 — MODELO FUNCIONAL DO SISTEMA

### 1.1 A missão funcional da arquitetura

A missão funcional da arquitetura do SimulaPro é uma só: **ser a tradução fiel, decomposta e auditável do Método Pedagógico em responsabilidades funcionais**, de modo que qualquer implementação construída sobre ela — e qualquer evolução dessa implementação — possa ser verificada contra o Método, componente por componente.

Essa missão tem três qualidades exigidas, que decorrem do mandato de fidelidade da introdução:

- **Fiel** — cada responsabilidade funcional existe porque um princípio do Método a exige, e realiza esse princípio sem reinterpretá-lo.
- **Decomposta** — o Método, que é um todo pedagógico, é dividido em partes funcionais com fronteiras claras, para que a fidelidade possa ser verificada parte a parte, e não apenas como uma impressão geral.
- **Auditável** — a correspondência entre princípio e responsabilidade é explícita e rastreável (consolidada na Matriz de Fidelidade, Capítulo 11), de forma que se possa demonstrar, e não apenas afirmar, que o software honra o Método.

A arquitetura não é, portanto, um projeto de "como construir o SimulaPro". É o contrato que qualquer construção do SimulaPro precisa cumprir para ter o direito de se chamar SimulaPro.

### 1.2 Vocabulário funcional

Três termos são usados com sentido preciso em todo o documento:

- **Componente funcional** — uma unidade de responsabilidade, definida pelo que ela é responsável por garantir. Não é um módulo de software, um serviço ou uma camada técnica; é uma fronteira de responsabilidade. Dizer que "o componente X é responsável por Y" significa que, em qualquer implementação, existe algo que responde por Y, e que Y é atribuição exclusiva desse algo.
- **Responsabilidade exclusiva** — a atribuição que pertence a um único componente e a nenhum outro. É o mecanismo central contra a sobreposição (item 1.5): para cada tipo de fato ou decisão do sistema, existe exatamente um componente que é sua fonte de verdade.
- **Garantia estrutural** — uma propriedade que a arquitetura assegura por construção, validação e auditoria, e não pela boa vontade de quem a implementa (Capítulo 10). Uma garantia estrutural não depende de um componente "lembrar" de respeitá-la; ela é uma condição do sistema.

### 1.3 Os grandes componentes funcionais do SimulaPro

A arquitetura divide o SimulaPro em **oito componentes funcionais**. Cada um é detalhado em um capítulo próprio; aqui é apresentado apenas por sua responsabilidade exclusiva:

1. **Modelo de Conhecimento** — representar o que existe para ser aprendido e como se organiza (os dois eixos, os Conceitos, os pré-requisitos, os pesos por banca, a junção Questão–Conceito). É a fonte de verdade da *estrutura*.
2. **Registro de Evidência e Domínio** — transformar cada resposta do aluno em evidência ponderada e manter o estado de domínio de cada Conceito para cada aluno. É a fonte de verdade de *onde o aluno está*.
3. **Motor de Sequenciamento** — decidir, de forma explicável, o que apresentar ao aluno a seguir. É a fonte de verdade de *o que vem agora*.
4. **Gestão da Jornada e do Plano de Estudos** — administrar a dimensão longitudinal: o plano vivo, o escopo por banca/cargo, a liberação de Conceitos por pré-requisito, o agendamento de revisão no tempo, a ausência e a carga. É a fonte de verdade do *enquadramento longitudinal do estudo*.
5. **Feedback Pedagógico** — selecionar e entregar a explicação pré-produzida correta no momento certo. É a fonte de verdade da *entrega do ensino*.
6. **Orquestração das Avaliações** — conduzir a avaliação de condições (simulado) com composição fiel à banca e feedback diferido, e assegurar que toda avaliação alimente a evidência sem que sua nota agregada vire métrica. É a fonte de verdade dos *eventos de avaliação sob condições distintas do estudo comum*.
7. **Avaliação de Prontidão** — sintetizar o estado de domínio em uma superfície de prontidão ponderada, projetada e honesta. É a fonte de verdade da *leitura de prontidão*.
8. **Suporte à Produção Editorial** — garantir, do lado da produção, as condições que a metodologia editorial exige (eixo único, fusão preservando histórico, sinalizações de testabilidade e de legislação, ciclo de vida da questão, Dossiê de Banca, fronteira da IA sob verificação). É a fonte de verdade da *integridade do conteúdo produzido*.

### 1.4 A responsabilidade exclusiva de cada componente

O princípio que rege a atribuição de responsabilidades é a **fonte de verdade única**: para cada tipo de fato do sistema, exatamente um componente é autoritativo, e os demais o consultam.

| Tipo de fato / decisão | Componente autoritativo |
|---|---|
| Como o conhecimento se estrutura e se pondera | Modelo de Conhecimento |
| Quanto o aluno domina cada Conceito | Registro de Evidência e Domínio |
| Qual a próxima ação de estudo | Motor de Sequenciamento |
| Que Conceitos estão em escopo, liberados e devidos para revisão | Gestão da Jornada e do Plano |
| Qual explicação ensinar, e quando | Feedback Pedagógico |
| Como se compõe e conduz uma avaliação de condições | Orquestração das Avaliações |
| Quão pronto o aluno está | Avaliação de Prontidão |
| Se o conteúdo é íntegro e bem classificado | Suporte à Produção Editorial |

Nenhum fato tem dois donos, e nenhum fato fica sem dono. Essa é a condição que impede tanto a sobreposição (dois componentes decidindo a mesma coisa, com risco de divergência) quanto a lacuna (um princípio do Método que nenhum componente realiza).

### 1.5 Como os componentes se relacionam sem sobrepor responsabilidades

Os componentes se relacionam por um único padrão: **consultar, nunca compartilhar posse.** Um componente lê o que outro é autoritativo para fornecer, mas nunca decide no lugar dele nem mantém uma cópia própria daquele fato como verdade paralela. As relações essenciais:

- O **Modelo de Conhecimento** é consultado por todos, e não consulta ninguém — é a fundação estrutural, somente leitura para o restante do sistema.
- O **Registro de Evidência e Domínio** recebe as respostas do aluno (vindas do estudo comum e das avaliações) e as converte em estado de domínio; é consultado pelo Motor de Sequenciamento, pela Gestão da Jornada e pela Avaliação de Prontidão, mas não decide o que mostrar nem o que significa estar pronto — apenas mede.
- A **Gestão da Jornada** define, no tempo, o que está em escopo, liberado e devido, lendo pré-requisitos do Modelo de Conhecimento e projeções do Registro de Domínio; entrega ao Motor de Sequenciamento o conjunto disponível, mas não escolhe o item do momento.
- O **Motor de Sequenciamento** escolhe a ação do momento dentro do que a Jornada disponibilizou, lendo o estado de domínio; não mede domínio nem administra o plano — apenas seleciona.
- O **Feedback Pedagógico** entra quando o aluno responde, seleciona a explicação pré-produzida pertinente e a entrega; não mede, não sequencia, não produz conteúdo — apenas ensina com o material já existente.
- A **Orquestração das Avaliações** monta e conduz o simulado, roteando cada resposta para o Registro de Evidência exatamente como o estudo comum; não é dona da medição de domínio nem da prontidão — apenas cria as condições de avaliação e descarta a nota agregada como métrica.
- A **Avaliação de Prontidão** lê o estado de domínio e os pesos do Modelo de Conhecimento, projeta-os até a data e sintetiza a superfície de prontidão; não altera o domínio nem decide o estudo — apenas informa.
- O **Suporte à Produção Editorial** opera do lado da produção e alimenta o Modelo de Conhecimento, as questões e as explicações; nunca atua durante o estudo do aluno.

Um ponto de honestidade arquitetural: **a avaliação primária do Método — a avaliação contínua formativa — não é um componente.** Ela é o comportamento emergente do estudo comum (o Motor seleciona, o aluno responde, o Feedback ensina, o Registro de Domínio mede). Criar um "componente de avaliação contínua" duplicaria responsabilidades que já pertencem a outros. Por isso a Orquestração das Avaliações responde apenas pela avaliação de condições (simulado), que tem regras próprias — coerente com o Método (Cap. 10), que estabelece a avaliação primária como contínua e não como evento.

### 1.6 Núcleo e apoio

Os oito componentes dividem-se em dois grupos, conforme executem diretamente a aprendizagem do aluno ou apenas a habilitem:

- **Núcleo do método** — os que realizam, para o aluno, o ciclo de medir, construir, ensinar e avaliar honestamente o domínio: **Modelo de Conhecimento, Registro de Evidência e Domínio, Motor de Sequenciamento, Gestão da Jornada e do Plano, Feedback Pedagógico, Orquestração das Avaliações e Avaliação de Prontidão.** Estes são inseparáveis do Método: sem qualquer um deles, um princípio do Método deixa de se realizar.
- **Apoio ao método** — o que produz e mantém, do lado editorial, o conteúdo que o núcleo consome, sem executar a aprendizagem do aluno: **Suporte à Produção Editorial.** Ele é indispensável — sem conteúdo íntegro não há o que o núcleo ensine —, mas é *upstream*: serve o núcleo, não participa da sessão de estudo.

A distinção não é hierárquica de importância — é de função. O apoio é tão exigível quanto o núcleo; o que muda é que o núcleo atua diante do aluno e o apoio atua antes dele. Reconhecer essa fronteira é o que impede, por exemplo, que capacidades próprias do apoio (como a IA sob verificação editorial) vazem para o núcleo (onde a IA é proibida no estudo) — a separação núcleo/apoio é, ela própria, uma das linhas que as proteções estruturais do Capítulo 10 vigiam.

### 1.7 O que não é componente: propriedades transversais

Duas coisas essenciais deste documento **não** são componentes funcionais e não aparecem na lista do item 1.3, para que não se confundam com unidades de responsabilidade:

- **As proteções estruturais dos princípios invioláveis (Capítulo 10)** são *propriedades transversais* que constrangem todos os componentes ao mesmo tempo — o isolamento de banca, a fronteira da IA, a ausência de métricas de vaidade, a integridade de fonte e a explicabilidade valem para o sistema inteiro, não para um componente. Não são um lugar; são uma condição de todos os lugares.
- **A arquitetura para evolução (Capítulo 11)** é uma *propriedade estrutural* sobre como os componentes mudam ao longo do tempo — a separação entre núcleo funcional protegido e superfície funcional mutável —, não um componente que "faz" a evolução.

Tratar essas duas como componentes seria um erro: elas não têm uma responsabilidade isolável: são qualidades que a arquitetura inteira exibe.

### 1.8 Como essa divisão mantém futuras implementações fiéis ao Método

A divisão funcional descrita neste capítulo é o que torna a fidelidade ao Método verificável ao longo do tempo, e não uma promessa que se perde entre versões:

- **Fidelidade decomposta.** Como cada princípio do Método se realiza em um componente de responsabilidade exclusiva, verificar a fidelidade de uma implementação deixa de ser um julgamento vago sobre o todo e passa a ser um exame componente a componente: cada um pode ser confrontado com os princípios que lhe cabem.
- **Ausência de zonas cinzentas.** Como nenhum fato tem dois donos nem fica sem dono (item 1.4), nenhum princípio do Método pode "cair entre" componentes (ficar sem realização) nem ser "disputado" por dois (com risco de realizações divergentes). Cada princípio tem um endereço funcional único.
- **Proteção do que não pode mudar.** Como o núcleo é explicitamente distinguido do apoio (item 1.6), e como as proteções estruturais e a disciplina de evolução são propriedades de todo o sistema (item 1.7), uma futura implementação sabe exatamente o que jamais pode comprometer — e qualquer tentativa de comprometê-lo, conforme a formulação aprovada, torna-se explícita, detectável e dependente de decisão consciente, nunca fruto de deriva silenciosa.
- **Rastreabilidade final.** A Matriz de Fidelidade (Capítulo 11) fecha o ciclo, mapeando cada princípio ao componente que o realiza, de modo que a afirmação "esta implementação é fiel ao Método" possa ser demonstrada item a item, e não apenas declarada.

Assim, o modelo funcional não descreve apenas como o SimulaPro se organiza — ele estabelece as condições sob as quais qualquer SimulaPro futuro continuará sendo, verificavelmente, o SimulaPro definido pelo Método.

### 1.9 O que este capítulo não define

Este capítulo define o modelo funcional de sistema — os componentes, suas responsabilidades e relações. Não define:

- O funcionamento interno de cada componente, que é objeto dos capítulos seguintes.
- Qualquer aspecto técnico de como os componentes são construídos, comunicam-se ou persistem informação.
- As proteções estruturais e a disciplina de evolução em detalhe, que são objeto dos Capítulos 10 e 11.

---

## CAPÍTULO 2 — MODELO DE CONHECIMENTO

### 2.1 Escopo do componente

O Modelo de Conhecimento é o componente responsável por representar **o que existe para ser aprendido e como se organiza** — e nada além disso. Ele é a fonte de verdade da estrutura do conhecimento e do seu contexto de avaliação, consultada por todos os demais componentes e por eles somente lida (Capítulo 1, item 1.5).

O que este componente representa: as entidades do conhecimento, suas responsabilidades, as relações permitidas entre elas e as garantias de integridade dessa estrutura. O que este componente **não** faz: não mede o quanto um aluno domina (isso é do Registro de Evidência e Domínio), não decide o que apresentar (Motor de Sequenciamento), não ensina (Feedback Pedagógico), não avalia prontidão (Avaliação de Prontidão). O Modelo de Conhecimento é inerte quanto ao aluno: ele descreve o mapa; o percurso é dos outros componentes.

Este capítulo é a tradução funcional da Estrutura Pedagógica (Método, Cap. 2).

### 2.2 Os dois eixos do conhecimento

O Modelo de Conhecimento se organiza em dois eixos que existem em separado e se tocam em um único ponto — a distinção fundadora do Método (Cap. 2):

- **Eixo de Conteúdo** — o que existe para ser aprendido. É independente de banca. Suas entidades descrevem conhecimento, não avaliação.
- **Eixo de Avaliação** — como e por quem o conhecimento é cobrado. É específico de cada banca. Suas entidades descrevem provas, não conhecimento.

Manter esses eixos separados na representação é a condição de toda a fidelidade deste componente: é o que permite que o domínio de um Conceito seja uma medida estável (porque o Conceito vive no eixo agnóstico) enquanto a forma como cada banca o cobra permanece registrada (no eixo de avaliação). Fundir os eixos, em qualquer ponto que não seja o ponto de junção definido no item 2.6, é a violação estrutural que este capítulo existe para impedir.

### 2.3 Entidades do Eixo de Conteúdo

As entidades do Eixo de Conteúdo são banca-agnósticas. Cada uma tem uma responsabilidade única de representação:

- **Área de Atuação** — representar o macro-domínio profissional (ex.: Enfermagem). Responsabilidade: ser a raiz sob a qual todo o conhecimento de uma profissão se organiza. É o nível mais estável do modelo.
- **Cargo** — representar a função/especialidade dentro de uma Área. Responsabilidade: definir quais conteúdos são relevantes para aquela função e com que peso relativo. O Cargo *escopa* relevância; não *possui* o conhecimento (item 2.6).
- **Disciplina** — representar um grande campo de conhecimento. Responsabilidade: agrupar Assuntos afins sob um mesmo campo (ex.: Farmacologia, Legislação do SUS).
- **Assunto** — representar uma subdivisão temática de uma Disciplina. Responsabilidade: agrupar os Conceitos de um mesmo tema (ex.: Fármacos vasoativos e inotrópicos).
- **Conceito** — representar a unidade atômica de conhecimento, testável e mensurável. Responsabilidade: ser a menor unidade coerente de saber sobre a qual se pode medir domínio. É a entidade central de todo o método (item 2.5).

### 2.4 Entidades do Eixo de Avaliação

As entidades do Eixo de Avaliação são específicas de banca. Cada uma tem sua responsabilidade única:

- **Banca** — representar a instituição organizadora (ex.: CEBRASPE, IBFC). Responsabilidade: ser o contexto de avaliação — o portador do estilo, do formato e da tradição de cobrança. A Banca não possui conhecimento; possui contexto de prova.
- **Concurso** — representar a instância concreta de um processo seletivo organizado por uma Banca (ex.: EBSERH 2018). Responsabilidade: agregar as Questões de uma prova real, com sua proveniência (data, cargo ofertado, instituição). O Concurso é sempre filho de uma Banca.
- **Questão** — representar um item concreto extraído de um Concurso real. Responsabilidade: carregar fielmente o conteúdo do item (enunciado, alternativas em número variável conforme o formato da banca, gabarito definitivo e a explicação pré-produzida), sua proveniência única e seu vínculo aos Conceitos que testa. A Questão é o ponto de junção dos dois eixos (item 2.6).

### 2.5 O Conceito em detalhe

O Conceito é a entidade central do Modelo de Conhecimento, porque é sobre ele que todo o método mede domínio (Método, Cap. 3). Suas propriedades de representação:

- **Identidade única e agnóstica.** Um Conceito existe uma única vez no modelo, com identidade própria, independente de qualquer banca e de qualquer cargo. Nem a banca que o cobra, nem o cargo para o qual é relevante, fazem parte da identidade do Conceito — são relações externas a ele (item 2.6).
- **Definição canônica.** Todo Conceito carrega uma delimitação oficial do que ele cobre e do que não cobre — sua fronteira. É contra essa fronteira que uma Questão é vinculada (Método, Cap. 5), não contra a intuição de quem classifica. A definição canônica é o que torna o Conceito reconhecível e não ambíguo.
- **Granularidade coerente.** O Conceito é representado no nível em que é uma afirmação de conhecimento testável — nem amplo a ponto de ser inmensurável, nem estreito a ponto de se confundir com uma única questão (Método, Cap. 2).
- **Natureza temporal declarada.** O Conceito registra se é de conhecimento estável ou perecível por mudança normativa (Método, Cap. 5) — distinção necessária para que a revisão de legislação (tratada no Capítulo 9 deste documento) saiba quais Conceitos reavaliar quando uma norma muda. O Modelo de Conhecimento *representa* essa natureza; o *processo* de reavaliação pertence ao Suporte à Produção Editorial.

### 2.6 Relações permitidas

O Modelo de Conhecimento admite exatamente quatro tipos de relação, e nenhum outro:

1. **Contenção hierárquica dentro de cada eixo.** No Eixo de Conteúdo: uma Área contém Cargos; uma Disciplina contém Assuntos; um Assunto contém Conceitos. No Eixo de Avaliação: uma Banca contém Concursos; um Concurso contém Questões. A contenção é sempre descendente e dentro do mesmo eixo.
2. **Junção Questão–Conceito.** Uma Questão vincula-se a um ou mais Conceitos que efetivamente testa. Este é o **único** ponto em que os dois eixos se tocam. A Questão carrega, de um lado, sua proveniência de avaliação (Concurso/Banca) e, de outro, o vínculo ao conhecimento (Conceito). Nenhuma outra entidade cruza os eixos.
3. **Pré-requisito entre Conceitos.** Um Conceito pode declarar depender de outro(s) Conceito(s). Essa relação é interna ao Eixo de Conteúdo, existe apenas entre Conceitos, e é **acíclica** (item 2.7).
4. **Relevância e incidência como relações externas ao Conceito.** A relevância de um Conceito para um Cargo e a incidência de um Conceito em uma Banca são representadas como relações *entre* entidades — Cargo×Conceito e Banca×Conceito —, nunca como atributos internos do Conceito. O peso com que um cargo exige um Conceito e o peso com que uma banca o cobra são propriedades do vínculo, não do Conceito, preservando a agnosticidade da sua identidade (item 2.5).

### 2.7 Relações proibidas

A integridade do modelo depende tanto do que ele permite quanto do que ele proíbe. São estruturalmente vedadas:

- **Conceito pertencer a uma Banca.** Nenhum Conceito é filho, propriedade ou escopo de uma Banca. A relação Conceito–Banca só existe como incidência externa (item 2.6). Esta é a proibição que garante a independência de banca.
- **Cruzamento de eixos fora da junção.** Nenhuma entidade de conteúdo é filha de uma entidade de avaliação, nem o inverso, exceto pela junção Questão–Conceito. Não existe Disciplina sob uma Banca, Assunto sob um Concurso, nem Conceito sob uma Questão.
- **Concurso acima de Banca.** A cardinalidade é fixa: uma Banca organiza muitos Concursos; um Concurso jamais organiza ou contém Bancas.
- **Duplicação de conhecimento.** Um mesmo conhecimento nunca é representado por dois Conceitos. A existência de dois Conceitos para a mesma unidade de saber é um defeito a ser corrigido por fusão (item 2.8), nunca um estado válido.
- **Contenção entre Conceitos.** Um Conceito nunca contém outro Conceito. Conceitos relacionam-se apenas por pré-requisito; a hierarquia de contenção termina em Assunto→Conceito.
- **Ciclo de pré-requisitos.** Um Conceito nunca é, direta ou transitivamente, pré-requisito de si mesmo. O grafo de pré-requisitos é acíclico — sem isso, a liberação de conteúdo por pré-requisito (Capítulo 5 deste documento) entraria em impasse.
- **Questão sem vínculo ou com proveniência múltipla.** Uma Questão nunca existe sem vínculo a pelo menos um Conceito (sem isso não seria ensinável nem mensurável) e nunca pertence a mais de um Concurso/Banca (sua proveniência é única, condição da fidelidade à fonte).
- **Peso como atributo interno do Conceito.** Relevância de cargo e incidência de banca nunca são gravadas dentro do Conceito. Fazê-lo contaminaria a identidade agnóstica do Conceito com dados específicos de cargo ou banca — precisamente o que a separação dos eixos existe para impedir.

### 2.8 Garantias de unicidade, consistência e independência de banca

O Modelo de Conhecimento oferece três garantias, que são a razão de ser de sua estrutura:

- **Unicidade.** Cada unidade de conhecimento corresponde a exatamente um Conceito. A garantia opera por dois meios: a **definição canônica** (item 2.5), que torna reconhecível quando um conhecimento já está representado, evitando a criação de duplicatas; e a **fusão preservando identidade e histórico**, que, ao se detectar que dois Conceitos representam o mesmo saber, os unifica sem descartar as evidências e vínculos acumulados — reunindo o que estava artificialmente separado (Método, Cap. 5). A unicidade não é presumida; é mantida ativamente.
- **Consistência.** As relações proibidas do item 2.7 são condições permanentes do modelo, não recomendações. Um estado que as viole — um Conceito sob uma Banca, um ciclo de pré-requisitos, uma Questão sem vínculo — é um estado inválido, detectável e sinalizado (as proteções estruturais do Capítulo 10 deste documento respondem por essa detecção). A consistência é a garantia de que o mapa nunca se contradiz.
- **Independência de banca.** Como o Conceito vive no Eixo de Conteúdo e a Banca vive no Eixo de Avaliação, e como a única relação entre eles é a incidência externa e a junção mediada pela Questão, o conhecimento é representado uma vez e as bancas apenas o *referenciam*. Isso é o que permite que o domínio de um Conceito seja uma medida única e portátil (usada igualmente pelo Motor, pela Jornada e pela Prontidão), independentemente de qual banca forneceu a Questão que o exercitou — e é a base representacional do princípio inviolável de que bancas nunca se misturam e de que o domínio nunca se fragmenta por banca.

### 2.9 O que este capítulo não define

Este capítulo define a representação funcional do conhecimento. Não define:

- Como essa representação é armazenada, indexada ou consultada tecnicamente.
- O processo editorial que cria, funde, delimita ou aposenta as entidades — que é o Suporte à Produção Editorial (Capítulo 9).
- Como o estado de domínio do aluno é medido sobre os Conceitos — que é o Registro de Evidência e Domínio (Capítulo 3).
- Como as proteções contra estados inválidos são detectadas e auditadas — que é o Capítulo 10.

---

## CAPÍTULO 3 — MODELO DE DOMÍNIO

### 3.1 Escopo do componente

Este capítulo detalha o componente nomeado no Capítulo 1 como **Registro de Evidência e Domínio**. Sua responsabilidade exclusiva é uma só: **manter, para cada aluno e para cada Conceito, o estado de domínio, derivado unicamente da evidência produzida pelo próprio aluno.** É a fonte de verdade de *onde o aluno está* — e de nada mais.

O componente mede; não faz nada além de medir. Ele não decide o que apresentar (Motor de Sequenciamento), não ensina (Feedback Pedagógico), não sintetiza prontidão (Avaliação de Prontidão), não representa a estrutura do conhecimento (Modelo de Conhecimento). Recebe evidência, converte-a em estado de domínio e disponibiliza esse estado para leitura pelos demais componentes. Essa estreiteza de responsabilidade não é uma limitação — é a condição de confiabilidade de toda a arquitetura: se o estado de domínio pudesse ser produzido por outra coisa que não a evidência do aluno, ele deixaria de significar o que o Método exige que signifique.

Este capítulo é a tradução funcional do Domínio de Conhecimento (Método, Cap. 3).

### 3.2 O que pertence ao Domínio

Pertence, e exclusivamente pertence, ao Domínio manter — sempre por aluno e por Conceito:

- **A Confiança de Domínio** — a estimativa viva de que o aluno é capaz de aplicar corretamente o Conceito quando cobrado, em qualquer formato e após qualquer intervalo razoável (Método, Cap. 3).
- **O estado do Conceito** — a classificação qualitativa que resume a Confiança de Domínio e a evidência acumulada (item 3.6).
- **A projeção temporal do domínio** — como a Confiança de Domínio decai no tempo sem reforço, permitindo antecipar esquecimento antes que ele se confirme. O Domínio é o único componente autoritativo sobre essa projeção.
- **A suficiência e a qualidade da evidência** — o quanto o estado atual se apoia em evidência bastante, variada e espaçada, ou em evidência escassa e frágil. Um Conceito com pouca evidência nunca é representado como dominado, por mais positiva que a evidência seja (Método, Caps. 2 e 3).
- **O histórico de evidência** na medida necessária para sustentar as representações acima — o registro dos eventos que produziram o estado atual, que é o que torna a trajetória de domínio (Método, Cap. 3, item 3.6) uma leitura possível.

Tudo isso é medição do estado de aprendizagem. Nada disso é decisão, ensino ou julgamento de prontidão.

### 3.3 O que nunca pertence ao Domínio

A fronteira do componente é definida tanto pelo que ele mantém quanto pelo que lhe é vedado manter:

- **A decisão do que estudar a seguir** — pertence ao Motor de Sequenciamento. O Domínio informa o estado; não escolhe a ação. A distinção Método entre *domínio* e *prioridade* (Cap. 3) é aqui uma fronteira entre componentes.
- **O ensino** — pertence ao Feedback Pedagógico. O Domínio registra que uma resposta ocorreu e o que ela significa para o estado; não explica nada ao aluno.
- **A leitura de prontidão** — pertence à Avaliação de Prontidão. O Domínio fornece o estado por Conceito; a ponderação por banca, a projeção até a data da prova e a síntese em superfície de prontidão são de outro componente.
- **A estrutura do conhecimento** — pertence ao Modelo de Conhecimento. O Domínio refere-se a Conceitos, mas não os define, organiza nem pondera.
- **Qualquer nota agregada** — o Domínio nunca produz um número único de "quanto o aluno sabe no geral". Progresso é estado por Conceito; agregações são responsabilidade de quem lê o Domínio (a Prontidão), e mesmo lá jamais como métrica de vaidade (Método, Caps. 1, 3 e 7).
- **A ação sobre o estado** — e este é o ponto mais sutil: o Domínio *representa* que um Conceito regrediu, que um pré-requisito enfraqueceu, que uma revisão se tornou devida no tempo; mas *agir* sobre isso — reabrir a prioridade de um Conceito, reprogramar uma revisão — pertence ao Motor e à Jornada. O Domínio constata; outros componentes reagem à constatação.

### 3.4 Como o Domínio recebe evidências

O Domínio possui um **único ponto de entrada de evidência**, e toda mudança de estado passa por ele. Uma evidência é o registro de que o aluno respondeu a uma Questão vinculada a um ou mais Conceitos, acompanhado das condições em que a resposta ocorreu — porque são essas condições que determinam quanto a evidência vale (item 3.5).

Duas propriedades desse recebimento são estruturais:

- **A evidência vem de qualquer atividade em que o aluno responda — o estudo comum e as avaliações de condições — pelo mesmo ponto de entrada.** O Domínio não mantém canais separados para "estudo" e "simulado"; ambos entregam evidência ao mesmo intake, cada uma com suas condições próprias registradas. Isso realiza, funcionalmente, o princípio do Método de que a avaliação primária é o fluxo contínuo de evidência (Cap. 10 do Método): há um só fluxo, e o Domínio é seu destino comum.
- **A evidência é sempre um evento real de resposta do aluno.** O Domínio não recebe "declarações de estado" de nenhum componente — recebe respostas. Não existe entrada pela qual o Motor, o Feedback ou a Prontidão informem ao Domínio que um Conceito está dominado. A única forma de mover o domínio é o aluno responder (item 3.8).

### 3.5 Como o Domínio transforma evidência em estado

Ao receber uma evidência, a responsabilidade do Domínio é ponderá-la e atualizar o estado do Conceito. A ponderação considera — como responsabilidades de julgamento, não como fórmulas, que não pertencem a este documento:

- a **correção** da resposta;
- a **chance de acerto ao acaso** do formato (um acerto em Certo/Errado pesa menos que um acerto em cinco alternativas; um erro em formato de baixa chance ao acaso pesa mais);
- a **dificuldade histórica** do item;
- a **recência** — evidência recente pesa mais; evidência antiga sem reforço deixa de sustentar sozinha uma classificação de domínio;
- a **consistência com o histórico** — uma resposta que contraria o padrão estabelecido reduz a confiança mais do que um evento isolado equivalente elevaria uma média simples;
- a **variedade da fonte** — evidência vinda de redações diferentes vale mais do que a repetição de itens muito semelhantes.

A partir dessa ponderação, o Domínio atualiza a Confiança de Domínio, recomputa o estado do Conceito e mantém sua projeção temporal. Três compromissos regem essa transformação, herdados do Método:

- **Assimetria.** Um erro pesa mais na direção da dúvida do que um acerto isolado pesa na direção da certeza — porque um erro é falha direta de recuperação, enquanto um acerto isolado ainda pode ser sorte.
- **Espaçamento.** Recuperação bem-sucedida após intervalo vale mais como evidência de domínio do que repetição concentrada; o Domínio distingue evidência espaçada de evidência amontoada na mesma sessão.
- **Prudência diante de evidência escassa.** Nenhuma quantidade de acertos sobre pouca evidência, ou sobre itens muito parecidos, é convertida em domínio consolidado. A suficiência de evidência é condição para os estados superiores (item 3.6).

O produto dessa transformação é sempre estado de domínio por Conceito — nunca um placar, nunca uma decisão, nunca uma explicação.

### 3.6 Os estados do Conceito

O Domínio representa o estado de cada Conceito, por aluno, no vocabulário definido pelo Método (Cap. 3): **Não Iniciado, Em Aprendizagem, Em Consolidação, Domínio Demonstrado, Em Risco de Esquecimento e Requer Reaprendizagem.** Esses estados são a forma qualitativa pela qual o Domínio comunica aos demais componentes onde o aluno está, sem exigir que eles interpretem a Confiança de Domínio bruta.

O Domínio é o único responsável por atribuir e transicionar esses estados, e o faz apenas em resposta a evidência ou à passagem do tempo (a projeção que aproxima um Conceito de Em Risco de Esquecimento). Nenhuma transição de estado é jamais provocada por um pedido de outro componente. As transições nunca decorrem de um único evento em qualquer direção — nem promoção por um acerto isolado, nem rebaixamento direto por um erro isolado —, refletindo fielmente as regras do Método sobre consolidação e regressão.

### 3.7 Como o Domínio permanece independente do Motor, do Feedback e da Prontidão

A independência do Domínio é a garantia de que o estado de aprendizagem significa o que deve significar. Ela se sustenta em uma regra de mão única:

- **Os demais componentes leem o Domínio; nunca o escrevem.** O Motor lê o estado para decidir; o Feedback é indiferente ao estado ao selecionar a explicação (que depende da Questão e da resposta, não do domínio acumulado); a Prontidão lê o estado para sintetizar. Nenhum deles altera o estado.
- **O estado de domínio é derivado exclusivamente da evidência do aluno.** Ele não é função de nenhuma decisão de outro componente. O Motor priorizar um Conceito não muda seu domínio; o Feedback ensinar um Conceito não muda seu domínio; a Prontidão considerar um Conceito crítico não muda seu domínio. Só a resposta do aluno muda o domínio.

Disso decorre a limpeza de fronteiras que a arquitetura exige: o Domínio pode ser lido por muitos, mas escrito por um só caminho — a evidência. Um componente que quisesse "corrigir" o domínio estaria, na verdade, querendo mentir sobre o estado do aluno, e a arquitetura não lhe dá meio de fazê-lo.

### 3.8 Garantia estrutural: o caminho único de escrita por evidência

A independência descrita no item 3.7 é sustentada por uma garantia estrutural, no sentido do Capítulo 10: **o estado de domínio tem um único caminho de escrita — a entrada de evidência (item 3.4) — e nenhum outro.**

Consequências:

- Não existe, na arquitetura, forma de um componente definir, sobrescrever ou ajustar diretamente a Confiança de Domínio ou o estado de um Conceito. O único "verbo de escrita" do Domínio é *registrar uma evidência*; tudo o mais é leitura.
- Qualquer tentativa de alterar o estado de domínio por outro meio que não a evidência do aluno é, por construção, inexistente como operação legítima — e, caso um dia se cogite introduzi-la, será uma mudança explícita, detectável e dependente de decisão consciente, jamais um efeito colateral silencioso (formulação aprovada para o Capítulo 10).
- Como todo estado de domínio é rastreável até as evidências que o produziram, a medição é auditável: pode-se sempre demonstrar *por que* um Conceito está no estado em que está, apontando as respostas do aluno que o levaram até ali. Essa auditabilidade é a mesma explicabilidade que o Método exige de todo o sistema (Caps. 4 e 11), aplicada à medição de domínio.

Essa garantia é o que torna o Domínio digno de confiança: seu conteúdo não é opinião de um componente sobre o aluno, mas o registro ponderado do que o próprio aluno demonstrou.

### 3.9 O que este capítulo não define

Este capítulo define a responsabilidade funcional do Modelo de Domínio. Não define:

- Como a Confiança de Domínio é calculada, com que fórmulas, pesos ou limiares — que são decisões de implementação, e cujas próprias escolhas o Método trata como hipóteses revisáveis (Método, Cap. 12).
- Como o estado é armazenado ou consultado tecnicamente.
- Como os componentes que leem o Domínio agem sobre o estado — o que pertence ao Motor (Capítulo 4), à Jornada (Capítulo 5) e à Prontidão (Capítulo 8).
- Como a entrada de evidência é protegida e auditada em detalhe — que é o Capítulo 10.

---

## CAPÍTULO 4 — MOTOR DE APRENDIZAGEM

### 4.1 Escopo do componente

Este capítulo detalha o componente nomeado no Capítulo 1 como **Motor de Sequenciamento**. Sua responsabilidade exclusiva é **decidir, a cada momento, a próxima ação de estudo do aluno** — qual Conceito trabalhar e com qual item —, de forma explicável e sem qualquer uso de Inteligência Artificial. É a fonte de verdade de *o que vem agora*.

O Motor é a expressão tática da aprendizagem: ele opera no instante, decidindo o próximo passo. Isso o distingue da Gestão da Jornada (Capítulo 5), que opera na escala longitudinal — definindo o que está em escopo, liberado e devido ao longo de semanas. O Motor não enquadra a jornada; ele escolhe dentro do enquadramento que a Jornada lhe oferece. Essa divisão entre o tático (Motor) e o longitudinal (Jornada) é a fronteira mais importante deste capítulo, e é mantida com rigor para que os dois não disputem a mesma responsabilidade.

Este capítulo é a tradução funcional do Motor de Aprendizagem (Método, Cap. 4).

### 4.2 Responsabilidade exclusiva

A responsabilidade exclusiva do Motor é a **seleção**: transformar o estado atual do aluno em uma próxima ação concreta de estudo. Nada mais lhe pertence. Ele não mede, não ensina, não planeja o longo prazo, não avalia prontidão, não produz conteúdo. Recebe um quadro (o estado de domínio, o conjunto disponível, o filtro de banca) e devolve uma decisão (o próximo Conceito e o próximo item). O Motor é, funcionalmente, o ponto onde a medição vira ação — e apenas isso.

### 4.3 Quais informações o Motor consulta

O Motor decide lendo — e somente lendo — três fontes, nenhuma das quais ele possui ou altera:

- **O Modelo de Conhecimento** (Capítulo 2) — para conhecer a estrutura relevante: os Conceitos, seus pré-requisitos, os pesos/incidência da banca escolhida e os itens (Questões) disponíveis para cada Conceito dentro daquela banca.
- **O Modelo de Domínio** (Capítulo 3) — para conhecer o estado de cada Conceito do aluno: sua Confiança de Domínio, seu estado e sua projeção no tempo. É a leitura que informa a prioridade.
- **A Gestão da Jornada** (Capítulo 5) — para conhecer o enquadramento longitudinal: quais Conceitos estão em escopo para aquele plano, quais estão liberados (pré-requisitos satisfeitos) e quais estão devidos para revisão naquele momento. O Motor escolhe dentro desse conjunto; não o calcula.

Sobre todas essas leituras incide, permanentemente, o **filtro de banca** do plano de estudos: o universo de itens que o Motor pode selecionar é exclusivamente o da banca escolhida. O Motor respeita esse filtro em cada decisão; a garantia estrutural de que ele nunca pode ser burlado — de que bancas jamais se misturam — é do Capítulo 10.

### 4.4 Quais decisões o Motor pode tomar

Dentro de sua responsabilidade de seleção, o Motor pode decidir:

- **A ordem de prioridade entre os candidatos disponíveis** — realizando a ordenação do Método (revisão corretiva antes de revisão preventiva, antes de continuidade de aprendizagem, antes de conceito novo), aplicada ao conjunto que a Jornada disponibilizou e aos estados que o Domínio informou.
- **Qual Conceito trabalhar a seguir** — o candidato de maior prioridade no momento, respeitando pré-requisitos e o peso da banca entre candidatos de mesma prioridade.
- **Qual item apresentar para aquele Conceito** — escolhendo, entre as Questões disponíveis daquela banca, com rotação que favorece variedade de redação sobre repetição do item exato (contra a memorização) e com dificuldade adequada ao estágio do Conceito (mais acessível no primeiro contato, crescente à medida que consolida).
- **Como intercalar** — alternar Conceitos, Assuntos e disciplinas ao longo da sessão, evitando tanto a concentração excessiva em um único tema quanto a fragmentação que impede qualquer tema de ganhar tração.
- **Como responder a sinais de fadiga e de estagnação** — rotacionar para outra disciplina, favorecer momentaneamente revisão de Conceitos já fortes, variar a forma de exposição de um Conceito que não avança, ou sinalizar que encerrar a sessão é recomendável. Diante de estagnação, pode deslocar a prioridade para um pré-requisito instável em vez de insistir no Conceito estagnado.
- **Como compor a sessão** — equilibrar revisão devida, continuidade e conceito novo de modo que a sessão nunca seja trivial nem esmagadora, e que sempre exista uma próxima ação relevante.

Todas essas decisões são de seleção e de ordenação — nunca de alteração do estado do aluno.

### 4.5 Quais decisões o Motor nunca pode tomar

A fronteira do Motor é definida também pelo que lhe é vedado:

- **Medir ou alterar o domínio** — pertence ao Modelo de Domínio. Priorizar um Conceito não muda seu domínio; o Motor lê o estado, jamais o escreve (item 4.8).
- **Ensinar** — pertence ao Feedback Pedagógico. O Motor decide *qual* item apresentar; o que se diz ao aluno após a resposta é de outro componente.
- **Definir escopo, liberar Conceitos ou agendar revisões no tempo** — pertence à Gestão da Jornada. O Motor consome o conjunto disponível e devido; não decide quais Conceitos entram no plano, quando um Conceito é liberado por pré-requisito, nem quando uma revisão passa a ser devida.
- **Avaliar prontidão** — pertence à Avaliação de Prontidão. O Motor não pondera por banca para dizer "quão pronto", não projeta até a data da prova, não sintetiza superfície alguma.
- **Misturar bancas** — jamais, sob nenhuma prioridade. Nem a revisão corretiva, que é a prioridade máxima, justifica selecionar um item de outra banca.
- **Usar Inteligência Artificial** — o Motor decide por regras explicáveis, nunca por um modelo opaco. É durante o estudo, e o estudo é território proibido à IA (Método, Cap. 11; garantia no Capítulo 10).
- **Produzir conteúdo** — o Motor seleciona entre itens e explicações que já existem; não cria Questão, alternativa nem explicação.
- **Decidir com base em nota agregada** — o Motor prioriza por estado de domínio por Conceito, jamais por um placar.

### 4.6 Como o Motor transforma o estado do Domínio em sequência de estudo

A transformação que o Motor realiza é, em essência: ler o estado e devolver a próxima ação. Descrita como responsabilidade, e não como procedimento:

1. O Motor considera o conjunto de Conceitos que a Jornada disponibilizou (em escopo, liberados, e os devidos para revisão) e lê, para cada um, seu estado no Modelo de Domínio.
2. Ordena esses candidatos pela prioridade do Método — o que protege domínio já conquistado vindo antes do que expande para o novo —, desempatando pelo peso da banca escolhida.
3. Escolhe o candidato de maior prioridade e, para ele, seleciona um item da banca escolhida, aplicando rotação (variedade sobre repetição) e dificuldade adequada ao estágio.
4. Ao longo da sessão, intercala temas e monitora sinais de fadiga e estagnação, ajustando as escolhas seguintes de acordo.

O resultado é uma sequência de estudo que emerge continuamente do estado real do aluno — nunca um roteiro fixo decidido de uma vez. A cada nova evidência que o Domínio registra (após a resposta do aluno), o quadro que o Motor lê muda, e a próxima decisão reflete o estado mais atual. A sequência é, portanto, uma consequência viva do domínio, não um plano rígido.

Uma propriedade é inegociável nessa transformação: **toda decisão do Motor é explicável.** Qualquer item apresentado a um aluno pode ser justificado apontando o estado de domínio, a regra de prioridade e o filtro de banca que o produziram. Não existe seleção que o Motor não consiga fundamentar em suas leituras — o que é a aplicação, a este componente, da exigência de explicabilidade de todo o Método.

### 4.7 Como o Motor permanece separado dos demais componentes

A separação do Motor é mantida por sua responsabilidade única (seleção) e pelo padrão de consultar-sem-possuir (Capítulo 1):

- **Separado do Registro de Evidência e Domínio** — o Motor lê o estado de domínio; nunca o escreve. A resposta do aluno a um item que o Motor apresentou vira evidência, mas essa evidência entra no Domínio pelo caminho próprio do Domínio (Capítulo 3), não pelo Motor. O Motor apresenta; o aluno responde; o Domínio mede — três responsabilidades, três componentes.
- **Separado do Feedback Pedagógico** — o Motor entrega o item; a partir da resposta, o Feedback assume a explicação. O Motor não ensina e o Feedback não seleciona a sequência.
- **Separado da Gestão da Jornada** — a Jornada define o enquadramento longitudinal (escopo, liberação, agendamento); o Motor decide dentro dele, no instante. A Jornada diz "estes estão disponíveis e devidos"; o Motor diz "este agora".
- **Separado da Avaliação de Prontidão** — a Prontidão lê o mesmo Domínio que o Motor lê, mas para sintetizar prontidão, não para decidir estudo. Os dois consultam a mesma fonte e produzem coisas diferentes, sem se sobreporem.

### 4.8 Garantias: decisão sem efeito sobre o estado do aluno

O Motor é o componente que mais se aproxima do estado do aluno sem poder alterá-lo, e a arquitetura garante essa impossibilidade de duas formas, no sentido do Capítulo 10:

- **O Motor não tem caminho de escrita para o Domínio.** Conforme o Capítulo 3 (item 3.8), o estado de domínio só muda por evidência — a resposta real do aluno. O Motor produz *apresentações* (o que mostrar), não *mutações de estado*. Selecionar, priorizar ou repetir um Conceito não altera, por si, o domínio do aluno; apenas cria a oportunidade de o aluno produzir nova evidência. Qualquer efeito do Motor sobre o estado é sempre mediado pela resposta do aluno, nunca direto.
- **A decisão do Motor é auditável e explicável.** Como toda seleção é fundamentada em leituras (estado de domínio, regra de prioridade, filtro de banca), pode-se sempre demonstrar por que uma ação foi escolhida. Não há decisão opaca, e não há decisão que altere o aluno por trás de uma seleção. Isso torna o Motor, apesar de central, incapaz de contaminar a medição de domínio — ele influencia *o que o aluno vivencia*, jamais *o que o sistema registra que o aluno sabe*.

Essa separação entre influenciar a experiência e não poder tocar o registro é o que permite ao Motor ser adaptativo sem jamais comprometer a integridade do domínio: ele decide muito, e não escreve nada.

### 4.9 O que este capítulo não define

Este capítulo define a responsabilidade funcional do Motor de Aprendizagem. Não define:

- Os algoritmos, fórmulas, pesos ou limiares que orientam a priorização, a rotação ou a intercalação — que são implementação, e que o Método trata como hipóteses revisáveis (Método, Cap. 12).
- Como o enquadramento longitudinal (escopo, liberação, agendamento de revisão) é produzido — que é a Gestão da Jornada (Capítulo 5).
- Como a explicação é selecionada e entregue após a resposta — que é o Feedback Pedagógico (Capítulo 6).
- Como o filtro de banca e a proibição de IA são garantidos e auditados estruturalmente — que é o Capítulo 10.

---

## CAPÍTULO 5 — JORNADA DE APRENDIZAGEM

### 5.1 Escopo do componente

Este capítulo detalha o componente nomeado no Capítulo 1 como **Gestão da Jornada e do Plano de Estudos**. Sua responsabilidade exclusiva é **manter o enquadramento longitudinal do estudo** — o contexto, que se estende por semanas e meses, dentro do qual cada sessão acontece. É a fonte de verdade de *o que está em jogo e o que está devido, ao longo do tempo*.

A Jornada é a contraparte longitudinal do Motor. Onde o Motor decide o instante (Capítulo 4), a Jornada administra a duração: ela define o terreno; o Motor caminha sobre ele. Toda a arquitetura deste capítulo se dedica a manter essa fronteira intacta — a Jornada enquadra, mas nunca seleciona; o Motor seleciona, mas nunca enquadra. Confundir as duas é o erro que este capítulo, mais do que qualquer outro, existe para evitar.

Este capítulo é a tradução funcional do Modelo de Evolução do Aluno (Método, Cap. 6).

### 5.2 Responsabilidade exclusiva

A responsabilidade exclusiva da Jornada é **produzir e manter, ao longo do tempo, o quadro de estudo do aluno**: o conjunto de Conceitos em jogo, seu estado de disponibilidade, sua condição temporal (devido ou não para revisão) e a postura de carga do momento. A Jornada não escolhe o próximo item, não mede, não ensina, não avalia prontidão. Ela transforma um objetivo distante (dominar o que a banca cobra até a prova) em um contexto imediato (o que está disponível e devido agora), e mantém esse contexto vivo à medida que o domínio do aluno e o tempo evoluem.

### 5.3 Como a Jornada transforma objetivo de longo prazo em contexto de sessão

A Jornada é a ponte entre o alvo do aluno e cada sessão concreta. Essa transformação se dá em passos, descritos como responsabilidades:

- **Do alvo ao escopo.** A partir da escolha do aluno (banca e cargo), a Jornada delimita o escopo do plano: o conjunto de Conceitos relevantes para aquele cargo, ponderados pela incidência daquela banca (lidos do Modelo de Conhecimento). O escopo é o universo de Conceitos que aquele plano coloca em jogo — nunca mais amplo do que o cargo exige, nunca contaminado por outra banca.
- **Do escopo ao início leve.** A Jornada não impõe barreira de entrada nem exame de nivelamento. Ela abre o plano e deixa que as primeiras sessões, conduzidas pelo Motor, sirvam simultaneamente de aprendizagem e de diagnóstico — o nível inicial emerge do uso (Método, Cap. 6), e a Jornada apenas reconhece o domínio preexistente à medida que ele se revela, ajustando o que ainda vale a pena colocar em jogo.
- **Do estado ao contexto de cada sessão.** A cada sessão, a Jornada apresenta ao Motor o contexto vigente: quais Conceitos estão em escopo, quais estão disponíveis, quais estão devidos para revisão e qual a carga adequada ao momento. Esse contexto é o insumo que o Motor consome para decidir.
- **Da ausência e da variação de ritmo à continuidade.** Quando o aluno retorna após ausência, a Jornada reenquadra o contexto para privilegiar a revisão do que provavelmente enfraqueceu antes de abrir novas frentes — recalibração, não punição (Método, Cap. 6). Quando o ritmo do aluno varia, a Jornada adapta a carga sem romper o fio: o escopo, as liberações e os agendamentos permanecem intactos entre sessões, de modo que reduzir o ritmo desacelera a jornada sem quebrá-la.

### 5.4 Disponibilidade, prioridade temporal e progressão — enquadrar, não selecionar

As três funções que o Método atribui à dimensão longitudinal são responsabilidade da Jornada, e cada uma produz um **quadro**, jamais uma escolha:

- **Disponibilidade.** A Jornada determina quais Conceitos estão liberados para estudo, com base na satisfação de seus pré-requisitos — lendo o grafo de pré-requisitos (Modelo de Conhecimento) e o estado desses pré-requisitos (Modelo de Domínio). Um Conceito torna-se disponível quando seus pré-requisitos atingem, no mínimo, consolidação. A Jornada diz *quais estão liberados*; não diz qual estudar.
- **Prioridade temporal.** A Jornada determina *quando* um Conceito volta a ser candidato — o agendamento da revisão espaçada. Lendo a projeção de decaimento que o Domínio mantém, ela marca um Conceito como devido para revisão quando sua Confiança de Domínio projetada se aproxima do limiar, idealmente antes do esquecimento previsto. A Jornada diz *quais estão devidos agora*; não diz qual dos devidos vem primeiro.
- **Progressão.** A Jornada governa o ritmo longitudinal de abertura de novas frentes: quantos Conceitos novos entram em jogo em um período, liberando-os na medida em que os anteriores consolidam, para evitar sobrecarga cognitiva (Método, Cap. 6). A Jornada controla *o passo com que o plano avança*; não conduz o passo dentro da sessão.

A distinção que sustenta a fronteira com o Motor é a diferença entre **prioridade temporal** e **prioridade de seleção**: a Jornada decide *quando* um Conceito é elegível (agendamento); o Motor decide *qual*, entre os elegíveis agora, é apresentado (seleção). A Jornada estreita o conjunto de candidatos ao longo do tempo; o Motor escolhe dentro do conjunto no instante. Nenhuma das duas invade a outra.

### 5.5 O plano vivo: custódia longitudinal e execução no instante

O plano de estudos que o aluno experimenta como "vivo" é o efeito conjunto de dois componentes, e é importante separar suas contribuições:

- A **Jornada é a custódia longitudinal do plano** — ela mantém o escopo, as disponibilidades e os agendamentos atualizados conforme o domínio e o tempo evoluem. É ela que faz o plano *mudar de forma* ao longo das semanas.
- O **Motor é o executor do plano no instante** — a cada sessão, é ele que anima o quadro que a Jornada mantém, escolhendo o próximo passo (Capítulo 4). É ele que faz o plano *acontecer* agora.

Nenhum dos dois, sozinho, é "o plano". A sensação de um plano vivo e adaptativo nasce da Jornada reenquadrar continuamente e do Motor selecionar continuamente dentro desse enquadramento. Atribuir o plano inteiro a um só dos dois recriaria a sobreposição de responsabilidades que a arquitetura evita: se a Jornada escolhesse o passo, tornar-se-ia um segundo Motor; se o Motor definisse o escopo e os agendamentos, tornar-se-ia uma segunda Jornada. A separação é o que mantém cada um íntegro.

### 5.6 Quais informações a Jornada consulta e quais nunca modifica

A Jornada opera inteiramente por leitura de duas fontes:

- **O Modelo de Conhecimento** (Capítulo 2) — para o escopo (relevância de cargo, incidência de banca) e para o grafo de pré-requisitos.
- **O Modelo de Domínio** (Capítulo 3) — para os estados dos Conceitos (disponibilidade dos pré-requisitos) e para a projeção temporal (agendamento de revisão).

E a Jornada **nunca modifica** nenhuma delas:

- Não escreve o estado de domínio. Ela lê o quanto o aluno domina para enquadrar o que está disponível e devido, mas não altera esse estado — só a evidência o altera (Capítulo 3, item 3.8). A Jornada marcar um Conceito como devido não muda seu domínio; apenas o coloca no quadro de candidatos.
- Não modifica a estrutura do conhecimento. Ela lê pesos e pré-requisitos; não os define nem os altera.
- Não produz nem altera conteúdo, e não interfere na medição, no ensino ou na leitura de prontidão.

### 5.7 Como a Jornada permanece independente do Domínio, do Motor, do Feedback e da Prontidão

A independência da Jornada é mantida por sua responsabilidade única (o enquadramento longitudinal) e pelo padrão de consultar-sem-possuir:

- **Independente do Domínio** — a Jornada lê o estado e a projeção do domínio; nunca os escreve. Ela reage ao que o Domínio mede; não interfere na medição.
- **Independente do Motor** — a Jornada entrega ao Motor um quadro (candidatos disponíveis e devidos, postura de carga); o Motor decide dentro dele. A Jornada nunca seleciona o próximo item, e o Motor nunca calcula o escopo, a disponibilidade ou o agendamento. Cada um consome o produto do outro sem assumir sua função.
- **Independente do Feedback** — a Jornada é indiferente ao ensino. O que se diz ao aluno após uma resposta não altera o enquadramento longitudinal, exceto pela evidência que a resposta gera — e essa evidência chega à Jornada apenas indiretamente, já processada pelo Domínio.
- **Independente da Prontidão** — Jornada e Prontidão leem as mesmas fontes (Domínio e pesos de banca) mas produzem coisas distintas e para consumidores distintos: a Jornada produz o *quadro de estudo* que o Motor consome ("o que está em jogo e devido"); a Prontidão produz a *superfície de prontidão* que informa o aluno ("quão pronto"). Uma orienta o que estudar ao longo do tempo; a outra avalia o quanto já se está preparado. Não se sobrepõem porque suas saídas e seus destinos são diferentes.

### 5.8 Garantia estrutural: a Jornada emite quadro, nunca a próxima ação

A fronteira entre enquadrar e selecionar é sustentada por uma garantia estrutural, no sentido do Capítulo 10: **a saída da Jornada é sempre um quadro — um conjunto de Conceitos com sua disponibilidade, sua condição temporal e a postura de carga —, nunca uma ação de estudo concreta.**

Consequências:

- A Jornada não possui, na arquitetura, o "verbo" de apresentar um item ao aluno. Esse verbo pertence exclusivamente ao Motor. Ainda que a Jornada estreite o conjunto de candidatos a um único Conceito devido, quem transforma esse Conceito em um item apresentado é o Motor, aplicando sua rotação, sua dificuldade e sua explicabilidade. A Jornada, sozinha, jamais entrega uma questão ao aluno.
- Por isso, a Jornada não pode "passar a decidir o estudo em lugar do Motor": ela estruturalmente não produz a próxima ação, apenas o contexto dela. Uma tentativa de fazer a Jornada selecionar o item seria uma mudança explícita de responsabilidade — detectável e dependente de decisão consciente, jamais uma deriva silenciosa (formulação aprovada para o Capítulo 10).
- E porque a Jornada não escreve o Domínio (item 5.6), ela também não pode fabricar o quadro: os candidatos disponíveis e devidos derivam do estado real que o aluno produziu, não de uma preferência da Jornada. Ela enquadra a partir da verdade do Domínio, não a partir de vontade própria.

Assim, a Jornada é poderosa na duração e impotente no instante: molda a trajetória de semanas, e não pode dar um único passo no lugar do aluno nem no lugar do Motor.

### 5.9 O que este capítulo não define

Este capítulo define a responsabilidade funcional da Jornada de Aprendizagem. Não define:

- Os algoritmos, intervalos, ritmos ou limiares que orientam a liberação, o agendamento de revisão ou a progressão — que são implementação, tratados pelo Método como hipóteses revisáveis (Método, Cap. 12).
- Como a próxima ação de estudo é selecionada dentro do quadro — que é o Motor de Aprendizagem (Capítulo 4).
- Como o estado e a projeção que a Jornada lê são medidos — que é o Modelo de Domínio (Capítulo 3).
- Como a prontidão é sintetizada a partir das mesmas fontes — que é a Avaliação de Prontidão (Capítulo 8).
- Como a fronteira entre enquadrar e selecionar é auditada estruturalmente — que é o Capítulo 10.

---

## CAPÍTULO 6 — FEEDBACK PEDAGÓGICO

### 6.1 Escopo do componente

O Feedback Pedagógico é o componente responsável por **entregar a aprendizagem ao aluno** — selecionar e apresentar a explicação pré-produzida correta no momento em que ela ensina. É a fonte de verdade da *entrega do ensino*.

Sua importância na arquitetura decorre de uma decisão do Método: como o SimulaPro não tem aulas (Método, Cap. 6), o ensino acontece inteiramente no feedback à questão (Método, Cap. 8). O Feedback é, portanto, o único componente que ensina — a única superfície didática do sistema. Isso o torna central, mas não o torna poderoso sobre o estado do aluno: ele ensina muito e não mede, não decide e não altera nada. A tensão entre ser o coração do ensino e não ter poder sobre o registro do aluno é o que este capítulo organiza.

Este capítulo é a tradução funcional do Feedback Pedagógico e o Papel da Explicação (Método, Cap. 8).

### 6.2 Responsabilidade exclusiva

A responsabilidade exclusiva do Feedback é **entregar o ensino pré-produzido pertinente a cada resposta do aluno**: selecionar, entre as explicações que já existem para a Questão respondida, a que ensina o Conceito naquele contexto, e apresentá-la no momento certo. Nada mais lhe pertence. Ele não cria a explicação (isso é produção editorial), não mede o efeito dela (isso é o Domínio), não decide qual questão veio antes nem virá depois (isso é o Motor), não enquadra a jornada (isso é a Jornada), não avalia prontidão. O Feedback recebe uma resposta e devolve ensino — e apenas isso.

### 6.3 Como o Feedback transforma uma resposta do aluno em aprendizagem

A transformação que o Feedback realiza é converter o instante da resposta no instante do ensino. Descrita como responsabilidade:

1. Quando o aluno responde a uma Questão, o Feedback identifica o que foi respondido — a Questão, o Conceito que ela testa e a alternativa que o aluno escolheu (correta ou não).
2. Seleciona, entre as explicações pré-produzidas associadas àquela Questão, a ênfase pertinente: o tratamento do distrator que o aluno de fato escolheu, quando errou; ou a confirmação do raciocínio, quando acertou (para converter um acerto de qualidade incerta em compreensão, ou expor que o acerto não veio de domínio real).
3. Entrega essa explicação, que ensina o Conceito, no momento adequado — imediatamente, por padrão, enquanto a mente do aluno ainda está engajada com o raciocínio que produziu a resposta; ou de forma diferida, quando o contexto é o de simulação de prova (Método, Caps. 8 e 9).

O que o Feedback entrega é sempre ensino do Conceito, ancorado na questão como exemplo. A "adaptação" ao aluno existe apenas na escolha de qual ênfase pré-produzida trazer à tona — notadamente, o tratamento do distrator escolhido —, nunca na criação de texto novo. O Feedback compõe a partir do que já existe; não redige nada no momento.

### 6.4 Quais informações o Feedback consulta

O Feedback decide o que entregar lendo — e somente lendo — três coisas:

- **A Questão respondida** (do Modelo de Conhecimento, Capítulo 2) — seu enunciado, o(s) Conceito(s) que ela testa e o conteúdo de ensino pré-produzido a ela associado: a explicação do Conceito, o tratamento dos distratores e a eventual nota sobre a armadilha característica da banca.
- **A resposta do aluno** — qual alternativa foi escolhida e se está correta, para selecionar a ênfase pertinente (tratamento do distrator escolhido ou conversão do acerto).
- **O modo de entrega** — se o contexto é de feedback imediato (estudo comum) ou diferido (simulação de prova), para entregar no momento certo.

Uma ausência é deliberada e importante: **o Feedback não consulta o estado de domínio do aluno.** A explicação a ser entregue depende da Questão e da resposta, não do histórico de domínio (Capítulo 4, item 4.7). O Feedback é, nesse sentido, indiferente à trajetória do aluno: ele ensina o Conceito a partir daquela questão e daquela resposta, seja o aluno iniciante ou avançado. Essa indiferença é uma simplicidade proposital que mantém o componente estreito e independente.

### 6.5 Quais informações o Feedback nunca altera

- **O estado de domínio** — o Feedback nunca o escreve. A resposta do aluno vira evidência, mas por caminho próprio do Domínio (item 6.7), não pelo Feedback. Ensinar um Conceito não altera, por si, o domínio do aluno sobre ele — só a resposta que o aluno der altera (Capítulo 3, item 3.8).
- **O conteúdo** — o Feedback seleciona e apresenta explicações que já existem; nunca as cria, edita ou complementa. A integridade e a qualidade pedagógica desse conteúdo são responsabilidade da produção editorial (Capítulo 9), não do Feedback.
- **A sequência e o plano** — o Feedback não decide o próximo item (Motor) nem o enquadramento longitudinal (Jornada). Ele age sobre a resposta que acabou de ocorrer, não sobre o que virá.
- **A leitura de prontidão** — o Feedback não pondera, não projeta, não sintetiza superfície alguma.

### 6.6 Como o ensino permanece centrado no conceito, nunca apenas na resposta

Esta é a exigência pedagógica que o componente precisa honrar na entrega, e ela se sustenta em duas propriedades funcionais:

- **O Feedback nunca entrega um veredito nu.** Comunicar apenas "você errou, a resposta é tal" não é uma saída válida do Feedback. A saída válida é o ensino do Conceito — por que o raciocínio correto é o que é, e por que o raciocínio que o aluno seguiu falha —, do qual o veredito é consequência, não conteúdo. A correção da alternativa é incidental; o ensino do Conceito é obrigatório.
- **O que o Feedback tem para entregar é, por construção, ensino de Conceito.** O material pré-produzido do qual ele seleciona é, por requisito editorial (Método, Cap. 8; Capítulo 9 deste documento), redigido para ensinar o Conceito de forma transferível a outras questões, nunca para explicar apenas aquele item. O Feedback, portanto, não tem de onde tirar um ensino "só da resposta" — o que ele dispõe para entregar é sempre generalizável ao Conceito.

A eventual nota sobre a armadilha característica da banca é entregue de forma subordinada: primeiro o Conceito, depois — dentro do mesmo ensino — o alerta sobre como aquela banca costuma construir a pegadinha. O Feedback nunca entrega a consciência de armadilha isolada do Conceito, o que seria ensinar a reconhecer pegadinhas em vez de saber (Método, Cap. 8).

### 6.7 Como o Feedback permanece independente do Domínio, do Motor, da Jornada e da Prontidão

A independência do Feedback é mantida por sua responsabilidade única (entregar ensino) e por um ponto de arquitetura que merece destaque: **quando o aluno responde, a resposta é consumida em paralelo, e independentemente, por dois componentes.**

- O **Domínio** consome a resposta como evidência, pelo seu caminho de entrada próprio (Capítulo 3), e atualiza o estado do aluno.
- O **Feedback** consome a mesma resposta como gatilho para selecionar e entregar o ensino.

Esses dois consumos não passam um pelo outro: o Feedback não repassa a resposta ao Domínio, e o Domínio não repassa estado ao Feedback. Ambos reagem ao mesmo evento — a resposta do aluno — de forma separada. É isso que permite que um componente meça e o outro ensine sem se contaminarem.

Das demais fronteiras:

- **Independente do Motor** — o Motor entrega o item e encerra seu turno; a partir da resposta, o Feedback assume o ensino. O Feedback não seleciona a sequência, e o Motor não ensina.
- **Independente da Jornada** — o enquadramento longitudinal é indiferente ao ato de ensinar; o Feedback não altera escopo, disponibilidade nem agendamento.
- **Independente da Prontidão** — o Feedback ensina no instante; a Prontidão sintetiza no agregado. Não se tocam.

### 6.8 Garantias estruturais: o Feedback ensina, mas não mede, decide nem altera o estado

A centralidade do Feedback no ensino convive com sua impotência sobre o estado do aluno, garantida estruturalmente no sentido do Capítulo 10:

- **O Feedback não possui caminho de escrita para o Domínio.** Seu único "verbo" é selecionar e entregar uma explicação existente. Ele não pode registrar, ajustar ou marcar nada no estado de domínio; qualquer efeito do ensino sobre o domínio é mediado pela resposta que o aluno der em seguida, jamais direto.
- **O Feedback não possui o verbo de selecionar a sequência nem o de enquadrar a jornada.** Ele não decide o próximo item nem o contexto longitudinal — essas ações pertencem, respectivamente e exclusivamente, ao Motor e à Jornada. O Feedback age sobre o instante já ocorrido, não sobre o que vem.
- **O Feedback não cria conteúdo — apenas seleciona o que já existe.** Ele não tem o verbo de produzir explicação; compõe a entrega a partir de material pré-produzido e verificado. Assim, ele não pode introduzir ensino não verificado no fluxo do aluno, e a garantia de que nada é gerado durante o estudo é uma propriedade estrutural assegurada no Capítulo 10.

O resultado é um componente que carrega todo o peso do ensino e nenhum poder sobre o registro: ele molda o que o aluno *compreende*, e não pode tocar no que o sistema *mede* que o aluno sabe. Uma tentativa de dar ao Feedback qualquer um desses poderes — medir, decidir, enquadrar ou criar — seria uma mudança explícita de responsabilidade, detectável e dependente de decisão consciente, nunca uma deriva silenciosa (formulação aprovada para o Capítulo 10).

### 6.9 O que este capítulo não define

Este capítulo define a responsabilidade funcional do Feedback Pedagógico. Não define:

- Como a explicação é produzida, redigida, revisada ou verificada — que é o Suporte à Produção Editorial (Capítulo 9).
- Como a explicação é apresentada em tela ou formatada.
- Como a resposta do aluno é convertida em evidência e medida — que é o Modelo de Domínio (Capítulo 3).
- Como se garante estruturalmente que nada é gerado durante o estudo e que o Feedback não escreve estado — que é o Capítulo 10.

---

## CAPÍTULO 7 — ORQUESTRAÇÃO DAS AVALIAÇÕES

### 7.1 Escopo do componente

A Orquestração das Avaliações é o componente responsável por **compor e conduzir os eventos de avaliação que operam sob condições distintas do estudo comum** — os simulados. É a fonte de verdade dos *eventos de avaliação de condições*.

Este escopo exige, de saída, uma precisão herdada do Capítulo 1 e do Método (Cap. 10): a avaliação primária do SimulaPro — a avaliação contínua formativa — **não é orquestrada por este componente**. Ela é o comportamento emergente do estudo comum: o Motor seleciona, o aluno responde, o Feedback ensina, o Domínio mede. Este componente não a organiza, não a conduz e não a possui. O que ele organiza são os eventos que têm regras próprias, diferentes do estudo — e é apenas isso. Assumir que este componente "faz todas as avaliações" recriaria a confusão que o Método rejeita, transformando a medição contínua em uma sucessão de eventos. A contenção do escopo é, aqui, parte da fidelidade.

Este capítulo é a tradução funcional de Simulados e Avaliações e da Arquitetura das Avaliações (Método, Caps. 9 e 10).

### 7.2 Responsabilidade exclusiva

A responsabilidade exclusiva deste componente é **transformar uma solicitação de avaliação de condições em um evento estruturado, fiel à banca, conduzido sob suas condições próprias, cujas respostas alimentam a evidência e cuja nota agregada nunca vira métrica.** Nada além disso lhe pertence. Ele não mede (Domínio), não ensina (Feedback), não seleciona o estudo (Motor), não enquadra a jornada (Jornada), não avalia prontidão (Prontidão) e não cria conteúdo (produção editorial). Ele monta e conduz o evento; o que acontece dentro dele é dos outros componentes.

### 7.3 Os tipos de avaliação e o que este componente organiza

O Método prevê, em sua arquitetura de avaliações (Cap. 10), duas modalidades, distinguidas pelo momento do feedback. É necessário mapear cada forma de avaliação à sua origem, e ser explícito sobre quais este componente organiza:

- **Avaliação contínua formativa** — a medição do domínio a cada resposta no estudo, com feedback imediato. **Não é organizada por este componente**: emerge do estudo comum (Motor + Feedback + Domínio). Este componente não participa dela.
- **Avaliação diagnóstica** — a identificação do nível do aluno. **Não é um evento organizado por este componente**: emerge do uso, nas primeiras sessões, sem exame de nivelamento (Método, Cap. 6; Capítulo 5 deste documento). Não existe uma "prova diagnóstica" que este componente conduza.
- **Avaliação de condições — simulado** — o evento sob condições de prova (feedback diferido, composição fiel à banca, tempo). **É o que este componente organiza.** Admite duas variações de escopo:
  - **Simulado completo (prova completa)** — reproduz a prova inteira da banca para o cargo, na forma fiel do Dossiê. É a variação estrutural, sobretudo perto da prova.
  - **Simulado parcial ou temático** — um bloco menor, sob as mesmas condições, restrito a parte do conteúdo já construído. É a variação opcional, útil no meio da jornada.

Portanto: este componente organiza exclusivamente os simulados (parcial/temático e completo). A avaliação contínua e a diagnóstica são propriedades emergentes do estudo, não eventos deste componente — e essa fronteira é o que impede que a orquestração de avaliações absorva, indevidamente, a medição contínua que pertence ao fluxo comum.

### 7.4 Como transforma uma solicitação de avaliação em experiência estruturada

Diante de uma solicitação de simulado, a responsabilidade do componente se desdobra em compor, condicionar e conduzir — descrita como responsabilidade, não como procedimento:

1. **Compor.** Monta o conjunto de Questões do evento com fidelidade à banca: as disciplinas cobradas e suas proporções, o formato de item, a quantidade e a duração característica, a partir do Dossiê de Banca (Modelo de Conhecimento). A composição é de fidelidade e de escopo — reproduzir a forma da prova daquela banca, restrita ao conteúdo em jogo no plano —, nunca uma seleção otimizada para o aprendizado individual do aluno (item 7.8).
2. **Condicionar.** Estabelece as condições do evento que o distinguem do estudo: o feedback é diferido para o fim, e o tempo reproduz as condições da prova real.
3. **Conduzir.** Apresenta o conjunto composto na sequência do evento e mantém as condições até o fim. Durante a condução, cada resposta do aluno segue para a evidência (item 7.7), exatamente como no estudo comum.
4. **Encerrar e devolver ao fluxo.** Ao fim do evento, o feedback diferido é liberado — entregue pelo componente de Feedback, não por este — e os Conceitos em que o aluno errou ou se mostrou frágil voltam ao ciclo de estudo pela via normal (o Domínio registrou a evidência; o Motor e a Jornada reagem ao novo estado). O componente conduz o evento e o devolve ao fluxo; não realiza, ele próprio, o ensino nem a repriorização.

Um ponto de fronteira merece destaque: no estudo comum, é o **Motor** que seleciona cada item, um a um, adaptando-se ao estado do aluno (Capítulo 4). No simulado, é a **Orquestração** que compõe o conjunto inteiro por fidelidade à banca, e o Motor não conduz a seleção. As duas responsabilidades não se sobrepõem porque atuam em modalidades diferentes: o Motor seleciona no estudo; a Orquestração compõe no simulado. A entrega ao aluno, em ambos os casos, respeita o filtro de banca do plano.

### 7.5 Quais informações a Orquestração consulta e quais nunca modifica

O componente opera por leitura de duas fontes:

- **O Modelo de Conhecimento** (Capítulo 2) — o Dossiê de Banca (para a forma fiel do evento) e as Questões da banca escolhida (para compor o conjunto).
- **A Gestão da Jornada** (Capítulo 5) — o escopo do plano e o que já está em jogo, para restringir a composição ao conteúdo pertinente e já construído, respeitando que um simulado não se aplica sobre conteúdo ainda não estudado (Método, Cap. 10).

E **nunca modifica**:

- **O estado de domínio** — não o escreve. Roteia as respostas para a entrada de evidência do Domínio, mas não mede nem registra estado (item 7.7).
- **O conteúdo** — compõe a partir de Questões e explicações que já existem; não cria nem edita nenhuma.
- **A sequência de estudo e o plano** — não conduz o Motor no estudo comum nem altera o enquadramento longitudinal da Jornada.
- **As explicações e a leitura de prontidão** — não ensina e não sintetiza prontidão.

### 7.6 Como permanece independente dos demais componentes

A independência da Orquestração é mantida por sua responsabilidade única (compor e conduzir o evento de condições) e pelo padrão de consultar-sem-possuir:

- **Independente do Modelo de Conhecimento** — lê o Dossiê e as Questões para compor; não os altera nem os define.
- **Independente do Domínio** — encaminha as respostas do evento à entrada de evidência do Domínio, mas não mede. O Domínio pondera essas respostas como pondera quaisquer outras (item 7.7).
- **Independente do Motor** — compõe o conjunto do simulado por fidelidade à banca; não realiza a seleção tática que é do Motor, e o Motor não conduz o simulado. Modalidades distintas, verbos distintos.
- **Independente da Jornada** — lê o escopo para restringir a composição; não define escopo, não libera Conceitos, não agenda revisões.
- **Independente do Feedback** — conduz o evento com feedback diferido, mas quem ensina, ao final, é o componente de Feedback. A Orquestração decide *quando* o feedback ocorre no evento; não decide *o que* se ensina.
- **Independente da Prontidão** — as respostas do simulado enriquecem a evidência que a Prontidão depois lê; mas a Orquestração não pondera por banca, não projeta e não sintetiza superfície alguma. A nota do simulado não é, para ela, medida de nada.

### 7.7 A avaliação como fonte de evidência, nunca determinante do domínio

Este é o compromisso central do componente, e o que o mantém fiel ao Método (Caps. 3, 9 e 10): **um simulado é uma fonte de evidência, nunca um mecanismo que determina o domínio.**

Funcionalmente, isso se realiza assim:

- **Cada resposta do simulado entra pela mesma porta de evidência que qualquer resposta do estudo** — a entrada única do Domínio (Capítulo 3, item 3.4). A Orquestração encaminha a resposta, com as condições em que ocorreu (sob pressão, sem feedback imediato), e o Domínio a pondera. Não há uma segunda via pela qual um simulado determine domínio; há uma só via de evidência, e o simulado apenas a alimenta.
- **A nota agregada do simulado é descartada como métrica.** O conjunto de acertos e erros do evento não é convertido em medida de domínio nem de prontidão. O que conta são as evidências individuais, uma a uma, processadas pelo Domínio; o placar do evento não tem, na arquitetura, caminho para se tornar estado do aluno.

O efeito é que o domínio permanece sendo determinado exclusivamente pela ponderação de evidência do Domínio, venha a evidência do estudo ou do simulado. A Orquestração contribui com evidência de qualidade particular — recuperação sob condições reais —, mas nunca decide, ela própria, o que o aluno sabe.

### 7.8 Garantias estruturais: a Orquestração conduz o evento, mas não mede, não ensina, não seleciona conteúdo nem altera o estado

As fronteiras acima são sustentadas por garantias estruturais, no sentido do Capítulo 10:

- **Não mede.** A Orquestração não possui caminho de escrita para o Domínio. Seu papel diante das respostas é encaminhá-las à entrada de evidência; a medição é do Domínio. Conduzir um simulado não escreve estado algum.
- **Não ensina.** A Orquestração não possui o verbo de compor ou entregar explicação. Ela apenas define que o feedback é diferido e o aciona ao fim; o ensino é do componente de Feedback, com material pré-produzido e verificado.
- **Não seleciona conteúdo no sentido tático.** A composição do simulado é regida por fidelidade à banca e por escopo do plano — reproduzir a forma da prova sobre o conteúdo em jogo —, não por otimização do aprendizado individual do aluno a partir do seu estado de domínio. Essa seleção tática, orientada pelo domínio, é o verbo exclusivo do Motor, e a Orquestração não o possui. Compor um exame fiel e selecionar o próximo passo de aprendizagem são atos diferentes, em componentes diferentes.
- **Não altera o estado do aluno.** Como não mede, não ensina e não seleciona taticamente, a Orquestração não tem meio de alterar o que o sistema registra sobre o aluno. Seu único produto é o evento estruturado; tudo o que dele decorre — evidência, ensino diferido, repriorização — é realizado pelos componentes próprios.

Qualquer tentativa de conferir à Orquestração um desses poderes — medir, ensinar, selecionar taticamente ou escrever estado — seria uma mudança explícita de responsabilidade, detectável e dependente de decisão consciente, jamais uma deriva silenciosa (formulação aprovada para o Capítulo 10).

### 7.9 O que este capítulo não define

Este capítulo define a responsabilidade funcional da Orquestração das Avaliações. Não define:

- Os algoritmos, proporções, durações ou critérios de composição dos simulados — que são implementação, orientados pelo Dossiê de Banca e tratados pelo Método como hipóteses revisáveis (Método, Cap. 12).
- Como as respostas do simulado são medidas — que é o Modelo de Domínio (Capítulo 3).
- Como o feedback diferido é redigido e entregue — que é a produção editorial (Capítulo 9) e o Feedback Pedagógico (Capítulo 6).
- Como a avaliação contínua e a diagnóstica emergem do estudo — que são propriedades do fluxo comum (Capítulos 3 a 6), não deste componente.
- Como o descarte da nota agregada e o filtro de banca são garantidos e auditados estruturalmente — que é o Capítulo 10.

---

## CAPÍTULO 8 — PRONTIDÃO PARA PROVA

### 8.1 Escopo do componente

A Prontidão para Prova é o componente responsável por **representar a capacidade atual do aluno de enfrentar o contexto real da prova da banca escolhida**. É a fonte de verdade de *quão pronto* o aluno está.

Uma qualidade define este componente e o separa de todos os anteriores: a Prontidão **informa, mas não dirige**. Ela lê o que outros componentes produziram e sintetiza uma leitura de preparação — mas não mede, não ensina, não seleciona estudo, não agenda, não organiza avaliações. Ela é o olhar que interpreta o estado do aluno sob a ótica da prova que se aproxima, e entrega esse olhar; não é uma mão que atua sobre o aluno. Reconhecer essa natureza puramente interpretativa é a chave de todo o capítulo.

Este capítulo é a tradução funcional da Avaliação da Prontidão para a Prova (Método, Cap. 7).

### 8.2 Responsabilidade exclusiva

A responsabilidade exclusiva da Prontidão é **sintetizar e expor a superfície de prontidão**: a representação ponderada, projetada até a data da prova e consciente da criticidade, de quanto o aluno está preparado e onde está exposto, para a banca do seu plano. Nada mais lhe pertence. Ela não produz o estado que sintetiza (Domínio), não decide o estudo que a melhora (Motor e Jornada), não conduz os eventos que a alimentam (Orquestração), não ensina (Feedback). Recebe estados já medidos e pesos já definidos, e devolve uma leitura de prontidão — e apenas isso.

### 8.3 Como a Prontidão usa o que outros componentes produzem sem substituí-los

A Prontidão é, por natureza, um componente que consome sem refazer. Ela se apoia inteiramente no trabalho de outros e não repete nenhum:

- Toma do **Domínio** o estado e a projeção de cada Conceito — e não os recalcula nem os contesta. Se o Domínio diz que um Conceito está frágil, a Prontidão parte dessa verdade; não a remede.
- Toma do **Modelo de Conhecimento** os pesos de incidência da banca e a centralidade dos Conceitos no grafo de pré-requisitos — e não os redefine.
- Toma o horizonte temporal — a data da prova — e o usa para projetar, não para agendar.

Sobre esses insumos, a Prontidão faz o que é exclusivamente seu: **pondera, projeta e sintetiza** em uma superfície de preparação. Ela não substitui nenhum dos componentes de origem porque não refaz o trabalho deles — ela o interpreta em conjunto, para responder a uma pergunta que nenhum deles responde sozinho: "diante desta prova, quão preparado está o aluno, e onde não está?".

Há aqui uma relação que merece nota, para evitar a aparência de sobreposição: a Prontidão e a Jornada leem, em parte, as mesmas fontes — o estado do Domínio, os pesos da banca, o tempo. Mas produzem coisas diferentes, para consumidores diferentes: a Jornada produz o *quadro de estudo* que o Motor consome (o que está em jogo e devido); a Prontidão produz a *superfície de prontidão* que informa o aluno (o quanto já está preparado). São dois leitores paralelos da mesma verdade, cada um sintetizando para o seu fim, sem que um dependa do outro nem o repita.

### 8.4 Como a Prontidão representa preparação sem se confundir com domínio conceitual

Domínio e prontidão são coisas distintas, e a arquitetura as mantém em componentes distintos precisamente para não as confundir:

- **Domínio** é a medida atômica, por Conceito: quanto o aluno sabe cada unidade de conhecimento, independentemente de banca (Capítulo 3). É uma verdade local e agnóstica.
- **Prontidão** é uma síntese ponderada, através dos Conceitos: quanto o aluno está preparado *para a prova daquela banca*, dado o peso com que ela cobra cada Conceito, a criticidade de cada um e o tempo até a data. É uma leitura global e específica da banca.

A consequência funcional dessa distinção: **domínio e prontidão podem divergir, e essa divergência é significativa.** Um aluno pode ter alto domínio de Conceitos que a banca cobra pouco e baixo domínio de Conceitos que ela cobra muito — domínio médio razoável, prontidão baixa. A Prontidão existe justamente para capturar o que a média de domínio esconderia: a preparação ponderada pelo que a prova realmente exige. A Prontidão nunca redefine nem sobrepõe o domínio — ela o interpreta à luz da banca e da data. O domínio permanece a verdade sobre o conhecimento; a prontidão é a leitura dessa verdade sob a ótica da prova.

### 8.5 O que a Prontidão produz

O produto da Prontidão é uma **superfície**, não um número — coerente com a rejeição, pelo Método, de qualquer nota agregada como medida (Caps. 3, 7 e 9). Essa superfície:

- distingue, por área e disciplina ponderadas pela banca, o que está em domínio consolidado e sustentado, o que está em formação, o que está projetado para enfraquecer até a data e o que está exposto;
- distingue Conceitos **críticos** (de alta incidência na banca ou de alta centralidade no grafo de pré-requisitos) de Conceitos **secundários**, de modo que a fragilidade no crítico pese mais do que no secundário;
- sinaliza o **conhecimento frágil e a falsa confiança** — o domínio que parece maior do que é, por se apoiar em evidência estreita, recente ou de baixa exigência —, corrigindo a leitura antes que o aluno a confunda com preparação;
- expõe o **risco como superfície de exposição** — onde e quanto a preparação está vulnerável, ponderado pela importância de cada área para a banca.

E há dois limites que o produto da Prontidão nunca ultrapassa, herdados diretamente do Método:

- **Nunca é uma previsão de aprovação.** A Prontidão representa exposição e preparação; não prevê o resultado da prova, que depende de fatores fora do método. Ela afirma o que pode medir com integridade, e nada além.
- **É sempre específica da banca do plano.** Estar pronto para a banca escolhida não é afirmação sobre nenhuma outra banca.

### 8.6 Quais informações a Prontidão consulta e quais nunca modifica

Consulta, por leitura:

- **O Modelo de Domínio** (Capítulo 3) — o estado e a projeção de cada Conceito do aluno.
- **O Modelo de Conhecimento** (Capítulo 2) — a incidência da banca e a centralidade dos Conceitos, que dão o peso e a criticidade.
- **O horizonte da prova** — a data, para a projeção.

E **nunca modifica**:

- **O estado de domínio** — não o escreve. Interpreta o domínio; não o altera. Considerar um Conceito crítico não muda o domínio que o aluno tem dele (Capítulo 3, item 3.8).
- **A estrutura do conhecimento** — lê pesos e pré-requisitos; não os redefine.
- **A sequência, o plano, o conteúdo e as avaliações** — não seleciona estudo, não enquadra a jornada, não cria conteúdo, não organiza simulados.

### 8.7 Como a Prontidão permanece independente dos demais componentes

A independência da Prontidão decorre de sua responsabilidade única (sintetizar a leitura de preparação) e do padrão de consultar-sem-possuir:

- **Independente do Domínio** — lê o estado; nunca o escreve. É consumidora da medição, não sua autora nem sua revisora.
- **Independente do Motor** — a Prontidão não decide o próximo passo de estudo. Ela pode tornar visível *que* há exposição a fechar, mas quem escolhe o que estudar diante disso é o Motor, a partir do domínio e das regras de prioridade — não a partir de uma ordem da Prontidão. A Prontidão informa; o Motor age.
- **Independente da Jornada** — leitor paralelo, não substituto (item 8.3). A Prontidão não define escopo, não libera Conceitos, não agenda revisões.
- **Independente do Feedback** — a Prontidão não ensina; não entrega explicação alguma.
- **Independente da Orquestração** — a Prontidão consome a evidência que os simulados contribuíram (já processada pelo Domínio), mas não compõe nem conduz avaliação alguma.

### 8.8 Garantias estruturais: a Prontidão interpreta, mas não mede, não ensina, não seleciona estudo nem organiza avaliações

As fronteiras acima são sustentadas por garantias estruturais, no sentido do Capítulo 10:

- **Não mede aprendizagem.** A Prontidão não possui caminho de escrita para o Domínio. Ela lê estados e os interpreta; não registra, não ajusta e não cria evidência. A aprendizagem é medida exclusivamente pelo Domínio, a partir da evidência do aluno; a Prontidão apenas a lê.
- **Não ensina.** A Prontidão não possui o verbo de compor ou entregar explicação. Ela expõe onde o aluno está exposto; não explica o Conceito exposto — isso é do Feedback, no momento do estudo.
- **Não seleciona estudo.** A Prontidão não possui o verbo de selecionar o próximo item (Motor) nem o de enquadrar a jornada (Jornada). Ela pode revelar prioridades; não pode executá-las. Tornar uma exposição visível é diferente de decidir estudá-la — e só o segundo altera o que o aluno vivencia.
- **Não organiza avaliações.** A Prontidão não possui o verbo de compor ou conduzir simulados (Orquestração). Ela lê a evidência que os simulados geraram, já medida pelo Domínio; não os monta nem os aplica.

O resultado é um componente que enxerga o todo e não toca em nada: ele produz a leitura mais abrangente do sistema — a preparação do aluno diante da prova — e é, ao mesmo tempo, o mais impotente para alterar o aluno. Qualquer tentativa de lhe conferir um desses poderes — medir, ensinar, selecionar estudo ou organizar avaliações — seria uma mudança explícita de responsabilidade, detectável e dependente de decisão consciente, jamais uma deriva silenciosa (formulação aprovada para o Capítulo 10).

### 8.9 O que este capítulo não define

Este capítulo define a responsabilidade funcional da Prontidão para Prova. Não define:

- Os algoritmos, pesos, limiares ou horizontes de projeção que constroem a superfície de prontidão — que são implementação, tratados pelo Método como hipóteses revisáveis (Método, Cap. 12).
- Como a superfície de prontidão é apresentada ao aluno em tela ou relatório.
- Como o domínio que a Prontidão lê é medido — que é o Modelo de Domínio (Capítulo 3).
- Como as prioridades que a Prontidão torna visíveis são efetivamente executadas no estudo — que é o Motor (Capítulo 4) e a Jornada (Capítulo 5).
- Como a natureza puramente interpretativa da Prontidão é garantida e auditada estruturalmente — que é o Capítulo 10.

---

## CAPÍTULO 9 — PRODUÇÃO EDITORIAL

### 9.1 Escopo do componente

A Produção Editorial é o componente responsável por **autorar e manter o patrimônio pedagógico do SimulaPro** — o conjunto de artefatos que constituem o que existe para ser aprendido e ensinado. É a fonte de verdade da *integridade do conteúdo produzido*.

É o único componente de apoio da arquitetura (Capítulo 1, item 1.6): diferentemente dos sete componentes de núcleo, ele não executa a aprendizagem do aluno — ele a antecede. A Produção Editorial opera inteiramente *a montante*, produzindo o conteúdo que o núcleo consome, sem jamais participar de uma sessão de estudo. Esta é a primeira e mais importante fronteira do capítulo: a Produção Editorial é onde o conteúdo nasce e se mantém, e é justamente por isso que ela precisa estar completamente apartada de onde o aluno aprende.

Este capítulo é a tradução funcional da Metodologia Editorial (Método, Cap. 5), tratada aqui como responsabilidade e garantia funcional — não como processo de equipe, que está fora do escopo deste documento.

### 9.2 Responsabilidade exclusiva

A responsabilidade exclusiva da Produção Editorial é **criar, manter, revisar e evoluir o patrimônio pedagógico com integridade** — garantindo que cada artigo desse patrimônio tenha lastro, seja consistente com o todo e rastreável em sua origem e em suas mudanças. Nada além disso lhe pertence: ela não mede, não ensina ao aluno, não decide estudo, não enquadra jornada, não avalia prontidão, não organiza avaliações. Ela produz e cuida do conteúdo; o que se faz com ele diante do aluno é dos componentes de núcleo.

### 9.3 Os artefatos que a Produção Editorial produz

O patrimônio pedagógico que este componente autora e mantém compreende:

- **Conceitos** — a unidade atômica de conhecimento, com sua definição canônica (a fronteira do que cobre e não cobre), sua granularidade coerente e sua natureza temporal declarada (estável ou perecível por legislação).
- **Questões** — os itens extraídos de provas reais, com seu conteúdo fiel (enunciado, alternativas, gabarito definitivo), sua proveniência única e seu estado no ciclo de vida (ativa, aposentada, anulada).
- **Explicações (feedbacks)** — o conteúdo de ensino pré-produzido associado às Questões: a explicação do Conceito, o tratamento dos distratores e a nota sobre a armadilha característica da banca. É o material que o Feedback (Capítulo 6) depois seleciona e entrega — o artefato editorial de maior responsabilidade pedagógica, por ser onde o produto efetivamente ensina.
- **Dossiês de Banca** — o perfil de avaliação de cada banca: formato de item, estilo de distrator, incidência por Conceito e a trajetória temporal desse perfil. É a estrutura que a Orquestração (Capítulo 7) consome para compor simulados fiéis e da qual a Prontidão (Capítulo 8) extrai o peso de banca.
- **Metadados e relações** — os vínculos que dão sentido às entidades: os pré-requisitos entre Conceitos, as junções Questão–Conceito, as relações de relevância (Cargo×Conceito) e de incidência (Banca×Conceito), os marcadores de natureza temporal e de estado, e as sinalizações de testabilidade insuficiente de um Conceito.

Todos esses artefatos, uma vez produzidos e mantidos, tornam-se o Modelo de Conhecimento (Capítulo 2) que o núcleo lê. A Produção Editorial é a origem daquilo que, para o restante do sistema, é somente leitura.

### 9.4 Como garante qualidade, consistência e rastreabilidade

Três garantias definem a integridade do patrimônio, e são responsabilidade deste componente:

- **Qualidade — lastro e verificação como condição de entrada.** Nenhum artefato entra no patrimônio sem lastro em fonte oficial e sem verificação. Questão, alternativa, gabarito e explicação nunca são fabricados; a fidelidade à fonte é condição de existência, não uma recomendação. Conteúdo sem lastro ou não verificado não tem caminho para chegar ao aluno — a verificação é a porta única de entrada do patrimônio.
- **Consistência — manutenção dos invariantes do Modelo de Conhecimento.** A Produção Editorial é onde os invariantes do Capítulo 2 são sustentados na origem: o eixo de conteúdo único, a ausência de Conceitos duplicados (mantida pela definição canônica e pela fusão), a granularidade coerente e o grafo de pré-requisitos acíclico. Produzir conteúdo é, aqui, produzir conteúdo que não viola a estrutura — a consistência não é conferida depois; é condição do que se autora.
- **Rastreabilidade — proveniência e histórico de mudança.** Cada artefato carrega sua origem (a Questão, à prova real de onde veio; o Conceito, à sua definição) e cada mudança relevante é registrada com o que mudou e por quê. O patrimônio nunca esquece de onde veio nem por que se tornou o que é — é essa memória que torna a evolução do conteúdo auditável e não arbitrária.

### 9.5 A única fonte de escrita do conteúdo, e a separação da execução da aprendizagem

Há uma assimetria de escrita que organiza toda a arquitetura de conteúdo e que este capítulo torna explícita:

- **O Modelo de Conhecimento é somente leitura para o núcleo** (Capítulo 2) — o Motor, o Domínio, a Jornada, o Feedback, a Orquestração e a Prontidão apenas o consultam.
- **A Produção Editorial é a única autora desse conteúdo** — ela é o único caminho de escrita do patrimônio.

Essa assimetria é o que separa, de forma limpa, a criação do conteúdo do seu uso. E a separação tem um segundo eixo, tão importante quanto: a Produção Editorial opera fora da execução da aprendizagem. Ela não participa de nenhuma sessão de estudo, não observa nem toca o percurso de nenhum aluno individual, e é, quanto ao aluno, cega — produz para todos os alunos e para nenhum em particular. O conteúdo que ela autora passa a existir no patrimônio; os alunos, em suas sessões seguintes, encontram o patrimônio atualizado. Nunca há um ponto em que a Produção Editorial alcance a aprendizagem de um aluno em curso.

### 9.6 Quais informações a Produção Editorial consulta e quais nunca modifica

Consulta:

- **O próprio patrimônio existente** — para manter a consistência: os Conceitos já existentes (para não duplicar), os Dossiês, as relações já estabelecidas.
- **As fontes oficiais** — as provas reais, os gabaritos, as normas — que são a origem externa de todo lastro.

E **nunca modifica**:

- **O estado de domínio de qualquer aluno** — a Produção Editorial é cega ao aluno; não lê nem escreve estado de aprendizagem (item 9.7).
- **A evidência produzida pelos alunos** — nunca destrói, fabrica ou reescreve as respostas reais que os alunos deram.
- **O registro histórico** — nunca reescreve o passado do patrimônio de forma a falsificá-lo (item 9.8).

### 9.7 Como as alterações editoriais nunca modificam diretamente o estado do aluno

Esta é a garantia que concilia a Produção Editorial com o princípio de que o domínio só muda por evidência (Capítulo 3, item 3.8):

- **A Produção Editorial não possui caminho de escrita para o Domínio.** Alterar um Conceito, aposentar uma Questão ou reescrever uma explicação muda *o conteúdo que existe*, nunca *o que o aluno demonstrou saber*. O estado de domínio permanece derivado exclusivamente da evidência do aluno.
- **Mudanças estruturais no conteúdo preservam a evidência, sem reescrever o domínio.** Quando dois Conceitos são fundidos, ou uma Questão muda de estado, a evidência que o aluno já produziu não é destruída nem alterada — ela é preservada e passa a ser interpretada pelo Domínio segundo a estrutura atualizada. A Produção Editorial reestrutura o conteúdo de modo a não órfãos nem perder evidência; mas quem reinterpreta essa evidência preservada, atualizando o estado, é o Domínio — não a Produção Editorial. A fusão preserva o histórico (Método, Cap. 5) porque a evidência do aluno é intocada; o que muda é o Conceito ao qual ela se refere.
- **O efeito de uma mudança editorial é sempre futuro e mediado.** Um Conceito atualizado ou uma Questão aposentada alteram o que os alunos encontrarão em suas próximas sessões; não alcançam retroativamente o que um aluno já vivenciou nem o que já demonstrou.

Assim, a Produção Editorial pode transformar profundamente o patrimônio e jamais tocar o estado de um aluno: ela muda o mundo que o aluno estuda, não o registro do que o aluno sabe.

### 9.8 Versões, revisões, correções, anulações e evolução sem violar a integridade histórica

A Produção Editorial trata a mudança do conhecimento preservando sempre a integridade do passado — o princípio de que o registro histórico nunca é falsificado:

- **Versões e revisões avançam sem apagar.** Uma revisão cria um novo estado do artefato; não reescreve o anterior de forma a fazer desaparecer o que ele foi. A evolução do patrimônio é cumulativa e memoriada, não substitutiva e amnésica.
- **Correções por mudança de conhecimento (legislação) atualizam o Conceito e aposentam o obsoleto.** Quando uma norma muda, o Conceito é atualizado para refletir o estado atual do conhecimento, e as Questões que só eram corretas sob a norma antiga são aposentadas do uso ativo — mantidas como registro, nunca apresentadas ao aluno como verdade atual. A transcrição fiel de uma Questão histórica nunca é alterada; o que muda é o seu estado de uso e o conteúdo do Conceito, jamais o que a Questão originalmente foi.
- **Anulações marcam e excluem do uso ativo, sem apagar.** Uma Questão anulada é identificada por fonte oficial, excluída do uso ativo e nunca vinculada como evidência ativa — mas retida como registro. Anular é remover do fluxo, não apagar da história.
- **A evolução expande o patrimônio sob a mesma estrutura.** Novos Conceitos, novas bancas e novos cargos anexam-se ao eixo único e compartilhado (Capítulo 2), estendendo o patrimônio sem bifurcá-lo nem criar exceções.

O fio comum a todos esses casos: o passado — o que uma Questão foi, o que um aluno respondeu, por que uma decisão foi tomada — nunca é reescrito de forma desonesta. A mudança sempre avança, criando novos estados e mudando o que vale dali para frente, sem falsificar o que já ocorreu. É isso que mantém a integridade histórica do sistema intacta mesmo enquanto o conhecimento evolui.

### 9.9 Garantias estruturais

As fronteiras deste componente sustentam-se em garantias estruturais, no sentido do Capítulo 10:

- **Só entra conteúdo com lastro e verificado.** O patrimônio tem uma porta única de entrada que exige fonte oficial e verificação; conteúdo fabricado ou não verificado não tem caminho para o aluno.
- **A Produção Editorial não escreve estado de aluno.** Não há caminho pelo qual uma mudança editorial altere o domínio de um aluno; o domínio muda só por evidência.
- **O registro histórico é preservado.** Não há caminho pelo qual uma revisão, correção ou anulação apague ou falsifique o passado do patrimônio ou a evidência dos alunos; a mudança avança sem reescrever a história.
- **Os invariantes do Modelo de Conhecimento são mantidos na origem.** Não há caminho pelo qual a autoria introduza duplicação de Conceito, ciclo de pré-requisitos ou cruzamento indevido de eixos.

Qualquer tentativa de contrariar uma dessas garantias — fazer entrar conteúdo não verificado, alterar o estado de um aluno por via editorial, reescrever a história ou violar os invariantes — seria uma mudança explícita de responsabilidade, detectável e dependente de decisão consciente, jamais uma deriva silenciosa (formulação aprovada para o Capítulo 10).

### 9.10 O que este capítulo não define

Este capítulo define a responsabilidade funcional da Produção Editorial. Não define:

- Os processos internos, papéis ou fluxos de trabalho da equipe editorial — que estão fora do escopo deste documento.
- Como os artefatos são armazenados, versionados ou verificados tecnicamente.
- Como a evidência preservada é reinterpretada após uma mudança estrutural — que é o Modelo de Domínio (Capítulo 3).
- Como as garantias de entrada, de não-escrita de estado e de integridade histórica são asseguradas e auditadas estruturalmente — que é o Capítulo 10.

---

## CAPÍTULO 10 — GARANTIAS ESTRUTURAIS E GOVERNANÇA

### 10.1 Natureza deste capítulo

Este capítulo é a **Constituição da Arquitetura Funcional**. Enquanto os capítulos anteriores definiram cada componente e suas fronteiras, este consolida — em um único lugar e como invariantes permanentes — as garantias que já emergiram deles. Ele não introduz componente algum, não altera responsabilidade alguma e não cria nada novo: apenas formaliza o que a arquitetura já é, transformando propriedades dispersas em lei arquitetural explícita.

Assim como o Método tem sua Constituição (Método, Cap. 11), a arquitetura tem a sua — e a relação entre as duas é de níveis: a Constituição do Método protege os princípios pedagógicos; esta protege os invariantes arquiteturais que os realizam. Guardam a mesma coisa de dois planos.

A natureza da proteção segue a formulação aprovada para todo este documento: os invariantes são **protegidos por garantias estruturais, mecanismos de validação e auditoria**, de modo que qualquer violação seja explícita, detectável e dependente de decisão consciente, jamais silenciosa. Não se afirma que violá-los é impossível; afirma-se que violá-los não pode acontecer às escondidas.

### 10.2 As propriedades que nunca podem ser violadas

Os invariantes a seguir são permanentes. Nenhuma versão futura da arquitetura pode contrariá-los sem deixar de realizar o Método:

**Invariante 1 — Fonte de verdade única.** Para cada tipo de fato do sistema, exatamente um componente é autoritativo. Nenhum fato tem dois donos; nenhum fato fica sem dono.

**Invariante 2 — Caminho de escrita exclusivo.** Cada fato só é escrito pelo seu componente autoritativo, por seu verbo próprio. Nenhum componente escreve o fato de outro (mapa no item 10.4).

**Invariante 3 — O domínio só muda por evidência.** O estado de aprendizagem do aluno tem um único caminho de escrita — a resposta real do aluno. Nenhum componente altera o domínio diretamente.

**Invariante 4 — O conteúdo tem uma única autora.** O Modelo de Conhecimento é somente leitura para os componentes de núcleo; sua única fonte de escrita é a Produção Editorial.

**Invariante 5 — Separação dos eixos.** Os eixos de Conteúdo e de Avaliação só se tocam na junção Questão–Conceito. O domínio de um Conceito é único, estável e banca-agnóstico.

**Invariante 6 — Uma banca por plano; bancas nunca se misturam.** Nenhuma seleção, composição, priorização, síntese ou funcionalidade cruza bancas dentro de um plano de estudos.

**Invariante 7 — IA fora do estudo.** Nenhuma decisão tomada diante do aluno durante o estudo usa Inteligência Artificial. A IA atua apenas na produção do conteúdo, sob verificação, nunca como fonte final de verdade.

**Invariante 8 — Nenhuma métrica de vaidade; nota agregada nunca é estado.** Nenhum placar, ranking entre alunos ou contador de volume é objetivo ou medida de progresso. A nota agregada de qualquer avaliação nunca se torna domínio nem prontidão.

**Invariante 9 — Integridade da fonte e do histórico.** Todo conteúdo tem lastro em fonte oficial e verificação como condição de entrada. O passado — transcrições, evidência dos alunos, decisões — nunca é reescrito de forma desonesta.

**Invariante 10 — Explicabilidade de toda decisão.** Toda decisão do sistema diante do aluno é justificável em termos de estado, regra e leitura. Não há decisão opaca.

**Invariante 11 — Rastreabilidade integral.** Todo estado de domínio é rastreável até a evidência que o produziu; todo artefato, até sua fonte e seu histórico; toda decisão, até as leituras que a fundamentaram.

**Invariante 12 — Consultar sem possuir.** Os componentes relacionam-se por leitura. Nenhum mantém cópia paralela do fato de outro como verdade concorrente.

### 10.3 Como a arquitetura preserva a separação de responsabilidades

A separação de responsabilidades — o coração da arquitetura — repousa sobre dois invariantes combinados: a **fonte de verdade única** (Invariante 1) e o **consultar sem possuir** (Invariante 12). Juntos, eles produzem uma propriedade que nenhum componente pode contornar: para saber um fato, um componente só tem um lugar onde buscá-lo (o dono daquele fato), e não pode mantê-lo por conta própria como verdade paralela.

Disso decorre que nenhuma responsabilidade se sobrepõe: dois componentes não podem decidir a mesma coisa (porque o fato tem um só dono), e nenhuma decisão fica órfã (porque todo fato tem dono). A separação não é mantida pela disciplina de cada componente em "não invadir" o outro; é mantida pela estrutura, que não oferece a um componente o meio de possuir o que é de outro.

### 10.4 O mapa de caminhos de escrita exclusivos

O Invariante 2 se concretiza no mapa abaixo, que declara, para cada fato ou produto do sistema, seu único produtor. Ler qualquer um desses é livre para quem precise; produzi-lo é exclusivo de um:

| Fato ou produto | Único produtor / caminho de escrita |
|---|---|
| Estado de domínio do aluno | A evidência (resposta real do aluno), pela entrada única do **Domínio** |
| Conteúdo: Conceitos, Questões, explicações, Dossiês, relações, estados de artefato | **Produção Editorial** |
| Próxima ação de estudo apresentada ao aluno | **Motor de Aprendizagem** |
| Quadro de estudo: escopo, disponibilidade, condição temporal, carga | **Jornada de Aprendizagem** |
| Explicação entregue ao aluno | **Feedback Pedagógico** (seleção de conteúdo pré-produzido) |
| Evento de avaliação de condições (simulado) | **Orquestração das Avaliações** |
| Superfície de prontidão | **Prontidão para Prova** |

Duas leituras importantes deste mapa:

- **Nenhum componente aparece duas vezes na coluna da direita para o mesmo fato**, e nenhum fato tem dois produtores. É a forma tabular do Invariante 2.
- **O estado de domínio é o único cujo produtor não é um componente, mas um evento** — a resposta do aluno. Isso é deliberado e central (Invariante 3): o registro do que o aluno sabe não é produzido por nenhuma decisão de sistema, apenas pela demonstração do próprio aluno. É o que torna esse registro digno de confiança.

### 10.5 Dependências permitidas e proibidas

**Permitidas — todas por leitura (consulta):**

- Todos os componentes leem o Modelo de Conhecimento.
- O Motor lê o Domínio, o quadro da Jornada e o Modelo de Conhecimento.
- A Jornada lê o Modelo de Conhecimento e o Domínio.
- O Feedback lê a Questão (do Modelo de Conhecimento) e a resposta do aluno.
- A Orquestração lê o Dossiê e as Questões (do Modelo de Conhecimento) e o escopo (da Jornada).
- A Prontidão lê o Domínio e o Modelo de Conhecimento.
- O Domínio recebe evidência (respostas) e referencia Conceitos do Modelo de Conhecimento.
- A Produção Editorial lê o patrimônio existente e as fontes oficiais externas.

**Proibidas — todas as que criariam acoplamento de escrita ou posse:**

- Qualquer componente escrever um fato do qual não é o produtor exclusivo (viola Invariantes 1 e 2).
- Qualquer componente adquirir o verbo exclusivo de outro — medir, decidir a ação, enquadrar, ensinar, compor avaliação, sintetizar prontidão ou autorar conteúdo fora do seu dono.
- Qualquer fato passar a ter dois produtores (viola a fonte de verdade única).
- Qualquer componente manter cópia paralela do fato de outro como verdade concorrente (viola o Invariante 12).
- Qualquer novo caminho de escrita que atravesse a fronteira de um componente para dentro do domínio de outro (viola a separação e cria acoplamento).

A distinção que rege tudo: **ler é sempre permitido a quem precise; escrever é sempre exclusivo de um.** Acoplamentos nascem de escrita compartilhada, não de leitura — e é a escrita compartilhada que a arquitetura proíbe.

### 10.6 Detecção de inconsistências sem alterar responsabilidades

Todos os invariantes acima são **observáveis** — e, portanto, suas violações são detectáveis. Um Conceito duplicado, uma relação que cruza os eixos fora da junção, um estado de domínio sem evidência que o sustente, um conteúdo sem lastro chegando ao aluno, uma decisão que não se deixa explicar: cada uma dessas é uma condição que contraria um invariante e que, por isso, pode ser reconhecida.

A propriedade essencial da detecção é que **ela observa sem decidir**. Detectar uma inconsistência é uma leitura sobre o estado e os fluxos da arquitetura; não é um novo componente com responsabilidades, não reatribui verbos e não corrige a inconsistência por autoridade própria. A detecção sinaliza; a correção, quando necessária, é feita pelo componente que já é dono daquele fato, por seu caminho normal (uma inconsistência de conteúdo é resolvida pela Produção Editorial; uma anomalia de domínio é investigada em sua origem de evidência). Assim, a auditabilidade não cria uma nova concentração de poder: ela torna as violações visíveis sem tornar o detector um decisor.

É isto que realiza a formulação aprovada: os invariantes não são "impossíveis de violar", mas qualquer violação é **detectável** — e, por ser detectável, não pode persistir silenciosamente nem ser introduzida sem que se torne explícita.

### 10.7 Auditabilidade, explicabilidade, rastreabilidade e integridade como invariantes permanentes

Quatro propriedades atravessam toda a arquitetura e precisam sobreviver a qualquer evolução:

- **Auditabilidade** — o estado do sistema pode ser inspecionado quanto aos invariantes; violações são reconhecíveis (item 10.6).
- **Explicabilidade** — toda decisão diante do aluno é justificável por suas leituras (Invariante 10). Nenhuma evolução pode introduzir uma decisão opaca no caminho do aluno.
- **Rastreabilidade** — domínio até a evidência, artefato até a fonte, decisão até as leituras (Invariante 11). Nenhuma evolução pode romper essas cadeias.
- **Integridade** — da fonte e do histórico (Invariante 9). Nenhuma evolução pode passar a admitir conteúdo sem lastro ou a reescrever o passado.

Essas quatro não são funcionalidades; são condições de existência da arquitetura. Uma mudança de superfície que preserve toda a lógica de negócio mas quebre qualquer uma delas não é uma melhoria com um efeito colateral — é uma violação da Constituição arquitetural, e como tal só pode ocorrer por decisão consciente e explícita, nunca como subproduto.

### 10.8 Governança da evolução: como novas funcionalidades respeitam as garantias sem criar acoplamentos

A arquitetura deve evoluir — mas sob governança. Toda nova funcionalidade é submetida a um teste de coerência arquitetural, análogo ao teste de coerência do Método (Método, Cap. 11), e igualmente um **veto por invariante, não uma ponderação**:

1. **Encaixe em responsabilidade existente.** A nova funcionalidade deve caber na responsabilidade exclusiva de um componente já existente. Como este capítulo não introduz componentes, uma funcionalidade que exija uma responsabilidade genuinamente nova não é uma adição de superfície — é uma emenda arquitetural, que só ocorre por decisão consciente e explícita, jamais por acréscimo silencioso.
2. **Nenhum novo caminho de escrita entre fronteiras.** A funcionalidade não pode fazer um componente escrever o fato de outro, nem duplicar a posse de um fato. Se ela exige que um componente passe a produzir o que é de outro, ela cria acoplamento — e é rejeitada.
3. **Preservação da fonte de verdade única.** A funcionalidade não pode introduzir uma segunda autoridade sobre um fato já possuído. Cada fato continua com um só dono.
4. **Preservação das quatro propriedades.** A funcionalidade não pode reduzir a auditabilidade, a explicabilidade, a rastreabilidade ou a integridade (item 10.7).

Dois princípios completam o teste, herdados do Método:

- **O ônus da prova é da funcionalidade.** Cabe a quem propõe demonstrar que ela não viola nenhum invariante; na dúvida, prevalece a proteção da arquitetura.
- **O efeito importa, não a intenção.** Uma funcionalidade proposta com boa intenção que, na prática, crie um acoplamento ou uma segunda autoridade sobre um fato viola a arquitetura ainda que ninguém o tenha desejado.

O acoplamento é a ameaça específica que esta governança previne. Sistemas se degradam quando funcionalidades novas, para serem convenientes, deixam um componente escrever no território de outro — e cada uma dessas escritas compartilhadas é um acoplamento que corrói a separação de responsabilidades. A regra é única e inflexível: **funcionalidades novas leem à vontade e escrevem apenas no que já lhes pertence.** Toda a extensibilidade do sistema cabe nesse espaço; o que não cabe nele não é extensão, é ruptura da arquitetura.

### 10.9 Encerramento

Esta Constituição arquitetural rege todos os capítulos anteriores e todos os que vierem. Em caso de conflito entre qualquer decisão futura de arquitetura e os invariantes do item 10.2, prevalecem os invariantes.

Com ela, a arquitetura funcional do SimulaPro fica completa em sua definição: os componentes, suas fronteiras, seus caminhos de escrita exclusivos, suas dependências permitidas e as garantias que tornam tudo isso permanente e auditável. O que resta ao documento é apenas tornar essa fidelidade demonstrável item a item — a Matriz de Fidelidade —, não acrescentar arquitetura nova.

### 10.10 O que este capítulo não define

Esta Constituição arquitetural consolida os invariantes e a governança. Não define:

- Nenhum componente novo nem nenhuma responsabilidade nova — apenas formaliza os já definidos.
- Como os invariantes, os caminhos de escrita e a detecção são assegurados tecnicamente.
- O mapeamento verificável entre cada princípio do Método e o componente que o realiza — que é a Matriz de Fidelidade (Capítulo 11).

---

## CAPÍTULO 11 — MATRIZ DE FIDELIDADE ENTRE MÉTODO PEDAGÓGICO E ARQUITETURA FUNCIONAL

### 11.1 Propósito e leitura da matriz

Este capítulo encerra o documento cumprindo o mandato de fidelidade declarado na Introdução, que impõe duas obrigações simétricas: **nenhum princípio do Método pode ficar sem tradução funcional**, e **nenhum componente pode existir sem justificativa no Método**. A matriz abaixo torna ambas verificáveis item a item, em vez de apenas afirmadas.

Cada linha registra: o princípio do Método, sua localização no Método Pedagógico, o componente da Arquitetura Funcional que o realiza, a garantia estrutural que o protege (Capítulo 10) e a justificativa resumida da correspondência. As linhas estão agrupadas por capítulo do Método, na ordem do documento de origem.

Convenções: "Arq." refere-se a capítulos desta Arquitetura Funcional; "Inv." refere-se aos Invariantes do Capítulo 10, item 10.2. Nenhum princípio, componente ou garantia é criado aqui — a matriz apenas relaciona o que já foi definido nos dois documentos.

### 11.2 A matriz

#### Método, Capítulo 1 — Missão

| Princípio do Método | Localização | Componente responsável | Garantia estrutural | Justificativa da correspondência |
|---|---|---|---|---|
| O objetivo é levar o aluno ao domínio real e durável do conteúdo cobrado | Método, Cap. 1 | Toda a arquitetura, sob o mandato de fidelidade | Inv. 1, 2 (fonte única e escrita exclusiva) | A Missão não é um componente: é o mandato que rege a decomposição inteira (Arq., Introdução e Cap. 1.1) e a razão de cada responsabilidade existir |

#### Método, Capítulo 2 — Estrutura Pedagógica

| Princípio do Método | Localização | Componente responsável | Garantia estrutural | Justificativa da correspondência |
|---|---|---|---|---|
| Dois eixos separados: Conteúdo (agnóstico) e Avaliação (por banca) | Método, 2.2–2.3 | Modelo de Conhecimento (Arq. 2.2) | Inv. 5 | Os eixos são representados separadamente, e sua separação é invariante |
| Os eixos se tocam apenas na junção Questão–Conceito | Método, 2.3 | Modelo de Conhecimento (Arq. 2.6) | Inv. 5 | A junção é a única relação intereixos permitida; qualquer outro cruzamento é proibido (Arq. 2.7) |
| Conceito é a unidade atômica, única e estável de conhecimento | Método, 2.4–2.6 | Modelo de Conhecimento (Arq. 2.5) | Inv. 5 | Identidade única e agnóstica, com definição canônica que impede duplicação |
| Cargo escopa relevância; Banca não possui conteúdo | Método, 2.4–2.5 | Modelo de Conhecimento (Arq. 2.3, 2.6–2.7) | Inv. 5 | Relevância e incidência são relações externas ao Conceito, nunca atributos internos |
| Pré-requisitos entre Conceitos | Método, 2.6 | Modelo de Conhecimento (Arq. 2.6) | Inv. 5 | Relação interna ao eixo de conteúdo, obrigatoriamente acíclica (Arq. 2.7) |
| Domínio de conceito não se fragmenta por banca | Método, 2.2–2.5 | Modelo de Conhecimento (Arq. 2.8) | Inv. 5, 6 | A independência de banca do eixo de conteúdo é garantia declarada do componente |
| Testabilidade múltipla; evidência única não é domínio | Método, 2.6 | Domínio (Arq. 3.2, 3.5) + Produção Editorial (Arq. 9.3) | Inv. 3 | O Domínio representa suficiência de evidência; a Editorial sinaliza testabilidade insuficiente |
| Construção cumulativa entre bancas (IBFC→FGV→CEBRASPE→VUNESP) | Método, 2.7 | Produção Editorial (Arq. 9.5) | Inv. 4, 5 | O eixo único e compartilhado é o que permite cada banca herdar o trabalho da anterior |

#### Método, Capítulo 3 — Domínio de Conhecimento

| Princípio do Método | Localização | Componente responsável | Garantia estrutural | Justificativa da correspondência |
|---|---|---|---|---|
| Domínio não é percentual de acertos | Método, 3.1–3.2 | Domínio (Arq. 3.2, 3.5) | Inv. 3 | O componente mantém Confiança de Domínio por evidência ponderada, nunca um percentual |
| Evidência ponderada (formato, dificuldade, recência, consistência, variedade) | Método, 3.3 | Domínio (Arq. 3.5) | Inv. 3 | A ponderação é responsabilidade declarada do componente na transformação evidência→estado |
| Seis estados do Conceito | Método, 3.4 | Domínio (Arq. 3.6) | Inv. 1, 3 | O Domínio é o único autorizado a atribuir e transicionar estados |
| Aprendizagem real exige recuperação espaçada | Método, 3.5 | Domínio (Arq. 3.5) | Inv. 3 | Evidência espaçada pesa mais que repetição concentrada, por compromisso do componente |
| Evolução medida como trajetória, não número | Método, 3.6 | Domínio (Arq. 3.2) + Prontidão (Arq. 8.5) | Inv. 8 | O Domínio mantém o histórico; a Prontidão sintetiza em superfície, nunca em nota |
| Revisão devida antes do esquecimento previsto | Método, 3.7 | Domínio (projeção, Arq. 3.2) + Jornada (agendamento, Arq. 5.4) | Inv. 1 | O Domínio projeta; a Jornada converte projeção em condição temporal de revisão |
| Domínio e prioridade são construtos distintos | Método, 3.8 | Domínio (Arq. 3.3) + Motor (Arq. 4.2) | Inv. 1, 2 | A distinção conceitual do Método vira fronteira entre dois componentes |
| Regressão e economia de reaprendizagem | Método, 3.9 | Domínio (Arq. 3.6) | Inv. 3 | Transições de regressão são atribuição exclusiva do Domínio, derivadas de evidência |
| Ordem de priorização do estudo | Método, 3.10 | Motor (Arq. 4.4) | Inv. 2 | A ordenação é decisão de seleção, verbo exclusivo do Motor |

#### Método, Capítulo 4 — Motor de Aprendizagem

| Princípio do Método | Localização | Componente responsável | Garantia estrutural | Justificativa da correspondência |
|---|---|---|---|---|
| Decisão explicável, sem IA durante o estudo | Método, 4.1 | Motor (Arq. 4.5–4.6) | Inv. 7, 10 | Decisão por regras justificáveis; a proibição de IA no estudo é invariante |
| Prioridade: corretiva > preventiva > continuidade > novo | Método, 4.2 | Motor (Arq. 4.4) | Inv. 2 | Ordenação tática entre candidatos disponíveis, exclusiva do Motor |
| Intercalação e prevenção de fadiga | Método, 4.3 | Motor (Arq. 4.4) | Inv. 2 | Comportamentos de seleção dentro da sessão |
| Revisão tecida no fluxo normal | Método, 4.4 | Motor (Arq. 4.4) + Jornada (Arq. 5.4) | Inv. 1 | A Jornada torna devido; o Motor apresenta, sem modo separado |
| Resposta à estagnação (variar, voltar ao pré-requisito) | Método, 4.5 | Motor (Arq. 4.4) | Inv. 2 | Ajuste de seleção diante de ausência de evolução |
| Resposta à evolução rápida | Método, 4.6 | Motor (Arq. 4.4) + Jornada (Arq. 5.4) | Inv. 1 | O Motor deixa de insistir; a Jornada estende intervalo e libera dependentes |
| Progressão de dificuldade | Método, 4.7 | Motor (Arq. 4.4) | Inv. 2 | Seleção do item conforme o estágio do Conceito |
| Rotação de itens contra a memorização | Método, 4.8 | Motor (Arq. 4.4) | Inv. 2 | Variedade de redação sobre repetição do item exato |
| Sessão sempre com próxima ação relevante | Método, 4.9 | Motor (Arq. 4.4) | Inv. 2 | Composição da sessão é responsabilidade de seleção |
| Adaptação individual explicável, não arbitrária | Método, 4.10 | Motor (Arq. 4.6) | Inv. 10 | Mesmas regras sobre históricos distintos; toda seleção é justificável |
| Respeito absoluto à banca escolhida | Método, 4.11 | Motor (Arq. 4.3, 4.5) | Inv. 6 | O filtro de banca incide sobre toda decisão e é invariante |

#### Método, Capítulo 5 — Metodologia Editorial

| Princípio do Método | Localização | Componente responsável | Garantia estrutural | Justificativa da correspondência |
|---|---|---|---|---|
| Consistência editorial é integridade estrutural | Método, 5.1 | Produção Editorial (Arq. 9.4) | Inv. 4, 5 | Os invariantes do conteúdo são sustentados na origem, ao autorar |
| Eixo de conteúdo único, nunca duplicado por banca | Método, 5.1 | Produção Editorial (Arq. 9.4–9.5) | Inv. 4, 5 | A Editorial é a única autora, e autora sobre o eixo compartilhado |
| Entrada de nova banca e completude auditável | Método, 5.2–5.3 | Produção Editorial (Arq. 9.3–9.4) | Inv. 9, 11 | Dossiê consolidado, cobertura e testabilidade sinalizadas, tudo rastreável |
| Questões anuladas descartadas | Método, 5.5 | Produção Editorial (Arq. 9.8) | Inv. 9 | Anulada é marcada, excluída do uso ativo e retida como registro |
| Validade temporal e mudança de legislação | Método, 5.6 | Produção Editorial (Arq. 9.8) + Modelo de Conhecimento (Arq. 2.5) | Inv. 9 | Natureza temporal declarada no Conceito; correção atualiza e aposenta sem reescrever a fonte |
| Autoridade única sobre o eixo de conteúdo | Método, 5.7 | Produção Editorial (Arq. 9.5) | Inv. 4 | Único caminho de escrita do conteúdo em toda a arquitetura |
| Detecção e fusão de Conceitos duplicados | Método, 5.8 | Produção Editorial (Arq. 9.7) + Modelo de Conhecimento (Arq. 2.8) | Inv. 5, 9 | Fusão preserva a evidência do aluno intocada; o Domínio a reinterpreta |
| Protocolo de classificação com definição canônica | Método, 5.9 | Modelo de Conhecimento (Arq. 2.5) + Produção Editorial (Arq. 9.3) | Inv. 5 | A fronteira declarada do Conceito é o critério de vinculação |
| IA editorial apenas sob verificação humana | Método, 5.10 | Produção Editorial (Arq. 9.4, 9.9) | Inv. 7, 9 | Verificação é a porta única de entrada do patrimônio |
| Revisão periódica e qualidade ao longo dos anos | Método, 5.11–5.12 | Produção Editorial (Arq. 9.4, 9.8) | Inv. 9, 11 | Proveniência e histórico de mudança tornam a evolução auditável |
| Perfil de banca vivo ao longo do tempo | Método, 5.13 | Produção Editorial (Dossiê, Arq. 9.3, 9.8) | Inv. 6, 9 | O Dossiê registra o perfil e sua trajetória, sem misturar bancas |
| Dossiê de Banca como fonte de verdade do perfil | Método, 5.14 | Produção Editorial (Arq. 9.3) | Inv. 4 | Autorado pela Editorial; consumido por Orquestração e Prontidão |

#### Método, Capítulo 6 — Modelo de Evolução do Aluno

| Princípio do Método | Localização | Componente responsável | Garantia estrutural | Justificativa da correspondência |
|---|---|---|---|---|
| Início leve, sem exame de nivelamento | Método, 6.2–6.3 | Jornada (Arq. 5.3) | Inv. 3 | O nível emerge da evidência do uso, não de um evento de entrada |
| Plano de estudos vivo | Método, 6.4 | Jornada (custódia) + Motor (execução) (Arq. 5.5) | Inv. 1, 2 | O plano é efeito conjunto: nenhum dos dois o possui sozinho |
| Liberação de Conceitos por pré-requisito | Método, 6.5 | Jornada (Arq. 5.4) | Inv. 1 | Disponibilidade é produto exclusivo da Jornada |
| Conceitos dominados permanecem vivos | Método, 6.6 | Domínio (projeção) + Jornada (agendamento) (Arq. 3.2, 5.4) | Inv. 3 | Nada é arquivado: o decaimento projetado retorna o Conceito ao quadro |
| Prevenção de sobrecarga cognitiva | Método, 6.7 | Jornada (progressão, Arq. 5.4) | Inv. 1 | O ritmo de abertura de novas frentes é governança longitudinal |
| Prontidão para avançar medida por domínio, não por tempo ou volume | Método, 6.8 | Domínio (Arq. 3.2) + Jornada (Arq. 5.4) | Inv. 3, 8 | A liberação depende do estado do pré-requisito, nunca de esforço ou volume |
| Equilíbrio entre aprender novo e revisar | Método, 6.9 | Motor (Arq. 4.4) + Jornada (Arq. 5.4) | Inv. 2 | Precedência de proteção do já conquistado, aplicada na seleção |
| Impedimento de pular etapas | Método, 6.10 | Modelo de Conhecimento (pré-requisitos) + Jornada (Arq. 5.4) | Inv. 5 | O grafo acíclico e a liberação condicionada impedem estruturalmente o salto |
| Acompanhamento longitudinal da evolução | Método, 6.11 | Domínio (Arq. 3.2) + Prontidão (Arq. 8.5) | Inv. 11 | Trajetórias rastreáveis até a evidência; síntese entregue pela Prontidão |
| Reação à ausência prolongada | Método, 6.12 | Jornada (Arq. 5.3) | Inv. 3 | Reenquadramento com prioridade a revisão; a evidência passada permanece intacta |
| Adaptação de carga sem perda de continuidade | Método, 6.13 | Jornada (Arq. 5.3) | Inv. 1 | O fio condutor (escopo, liberações, agendamentos) persiste entre sessões |
| Estado "pronto para a prova" | Método, 6.14 | Prontidão (Arq. 8.5) | Inv. 8 | Estado auditável e específico da banca, jamais promessa de aprovação |

#### Método, Capítulo 7 — Avaliação da Prontidão

| Princípio do Método | Localização | Componente responsável | Garantia estrutural | Justificativa da correspondência |
|---|---|---|---|---|
| Nota de simulado não mede prontidão | Método, 7.2 | Prontidão (Arq. 8.5) + Orquestração (Arq. 7.7) | Inv. 8 | A nota agregada é descartada como métrica e não tem caminho para virar estado |
| Prontidão é domínio consolidado, sustentado e projetado até a data | Método, 7.3 | Prontidão (Arq. 8.3, 8.5) | Inv. 11 | Síntese sobre estado e projeção lidos do Domínio |
| Prontidão é superfície, não número | Método, 7.4 | Prontidão (Arq. 8.5) | Inv. 8 | O produto é uma superfície ponderada; nenhuma média agregada é emitida |
| Ponderação pela incidência da banca | Método, 7.5 | Prontidão (Arq. 8.3, 8.5) | Inv. 6 | O peso vem da relação Banca×Conceito, dentro do plano de uma só banca |
| Conceitos críticos vs secundários | Método, 7.6 | Prontidão (Arq. 8.5) | Inv. 5 | Criticidade combina incidência e centralidade no grafo de pré-requisitos |
| Detecção de conhecimento consolidado e frágil | Método, 7.7–7.8 | Prontidão (Arq. 8.5), lendo o Domínio | Inv. 3, 11 | A fragilidade decorre da qualidade da evidência mantida pelo Domínio |
| Identificação de falsa confiança | Método, 7.9 | Prontidão (Arq. 8.5) | Inv. 11 | A leitura corrige a intuição do aluno com base na evidência rastreável |
| Pontos fracos expostos antes da prova | Método, 7.10 | Prontidão (Arq. 8.5) | Inv. 8 | Exposição ordenada por peso e criticidade, nunca por nota |
| Risco como superfície de exposição, nunca previsão de aprovação | Método, 7.11 | Prontidão (Arq. 8.5) | Inv. 8, 9 | O componente afirma apenas o que mede com integridade |
| Decisão entre continuar aprendendo e apenas revisar | Método, 7.12 | Prontidão (informa, Arq. 8.7) + Motor e Jornada (executam) | Inv. 2 | A Prontidão revela prioridades; executá-las é verbo de outros componentes |
| Comunicação honesta, sem prometer aprovação | Método, 7.13 | Prontidão (Arq. 8.5) | Inv. 8, 9 | Limite declarado do produto do componente |
| Prontidão se estreita conforme a data se aproxima | Método, 7.14 | Prontidão (projeção, Arq. 8.3) + Jornada (Arq. 5.4) | Inv. 1 | A projeção é lida pela Prontidão; o estreitamento do estudo é enquadrado pela Jornada |

#### Método, Capítulo 8 — Feedback Pedagógico

| Princípio do Método | Localização | Componente responsável | Garantia estrutural | Justificativa da correspondência |
|---|---|---|---|---|
| A explicação é o único instrumento de ensino | Método, 8.1 | Feedback (Arq. 6.1) | Inv. 2 | Único componente com o verbo de ensinar |
| Ensinar o Conceito, nunca a resposta | Método, 8.3 | Feedback (Arq. 6.6) + Produção Editorial (Arq. 9.3) | Inv. 4 | O material é transferível por requisito editorial; o Feedback nunca entrega veredito nu |
| Tratamento do distrator escolhido | Método, 8.4 | Feedback (Arq. 6.3) + Produção Editorial (Arq. 9.3) | Inv. 4 | A ênfase é selecionada; o conteúdo por distrator é pré-produzido |
| Feedback ao acerto como conversão | Método, 8.5 | Feedback (Arq. 6.3) | Inv. 2 | O acerto também aciona ensino, para converter ou expor sorte |
| Feedback imediato por padrão, diferido em simulação | Método, 8.6 | Feedback (Arq. 6.3) + Orquestração (Arq. 7.4) | Inv. 1 | O Feedback ensina; a Orquestração define o momento no evento de condições |
| Generalização ao Conceito, nunca ao item | Método, 8.7 | Produção Editorial (Arq. 9.3) + Feedback (Arq. 6.6) | Inv. 4 | Requisito de redação do artefato, honrado na entrega |
| Proporcionalidade e carga cognitiva | Método, 8.8 | Produção Editorial (Arq. 9.3) | Inv. 4 | Propriedade do artefato produzido, não da entrega |
| Registro emocional: informar, nunca punir | Método, 8.9 | Feedback (Arq. 6.6) + Produção Editorial (Arq. 9.3) | Inv. 8 | Ausência de veredito nu e de recompensa de vaidade |
| Armadilha da banca subordinada ao Conceito | Método, 8.10 | Feedback (Arq. 6.6) | Inv. 6 | A nota de banca só é entregue dentro do ensino do Conceito |
| Explicação pré-produzida, nunca gerada durante o estudo | Método, 8.11 | Feedback (Arq. 6.8) | Inv. 7 | O Feedback não possui o verbo de criar conteúdo |
| A explicação é o artefato editorial de maior responsabilidade | Método, 8.12 | Produção Editorial (Arq. 9.3) | Inv. 9 | Lastro e verificação como condição de entrada do artefato |

#### Método, Capítulo 9 — Simulados e Avaliações

| Princípio do Método | Localização | Componente responsável | Garantia estrutural | Justificativa da correspondência |
|---|---|---|---|---|
| Simulado é instrumento subordinado, nunca o eixo do estudo | Método, 9.1 | Orquestração (Arq. 7.1–7.2) | Inv. 2 | Escopo contido: organiza eventos, não conduz a aprendizagem |
| Estudo, prática e avaliação são atividades distintas | Método, 9.3 | Orquestração (Arq. 7.3) + Motor (Arq. 4.4) | Inv. 1 | Cada atividade é acionada por estado do Conceito, em componentes distintos |
| Duas finalidades: treinar condições e gerar evidência sob pressão | Método, 9.4 | Orquestração (Arq. 7.4) | Inv. 3 | Evidência sob condições entra pela porta única do Domínio |
| Simulado confirma domínio, mas não o constrói | Método, 9.5 | Orquestração (Arq. 7.5) | Inv. 3 | Sem feedback imediato, o evento revela; a construção ocorre depois, no estudo |
| Evidências individuais usadas; nota agregada descartada | Método, 9.6 | Orquestração (Arq. 7.7) | Inv. 3, 8 | Uma só via de evidência; o placar não tem caminho para virar estado |
| Momento correto: nunca no início, crescente perto da prova | Método, 9.7 | Orquestração (Arq. 7.3) + Jornada (escopo construído, Arq. 5.4) | Inv. 1 | A composição é restrita ao conteúdo já em jogo |
| Fidelidade à forma da prova da banca | Método, 9.8 | Orquestração (Arq. 7.4), lendo o Dossiê | Inv. 6 | Composição fiel, jamais misturando bancas |
| Resultados realimentam o estudo; a nota não é objetivo | Método, 9.9 | Orquestração (Arq. 7.4) + Domínio + Motor | Inv. 8 | Os erros retornam pelo estado do Domínio; a nota não circula como métrica |
| Simulado útil é o que altera o estudo seguinte | Método, 9.10 | Orquestração (Arq. 7.4) | Inv. 1 | O evento é devolvido ao fluxo; o valor está no que reabre |
| Sem ranking entre alunos; sem caça à pontuação | Método, 9.11 | Orquestração (Arq. 7.7) + Prontidão (Arq. 8.5) | Inv. 8 | Nenhuma métrica de vaidade existe como produto de qualquer componente |

#### Método, Capítulo 10 — Arquitetura das Avaliações

| Princípio do Método | Localização | Componente responsável | Garantia estrutural | Justificativa da correspondência |
|---|---|---|---|---|
| A avaliação primária é contínua, não um evento | Método, 10.3 | Emergente do estudo (Motor + Feedback + Domínio), Arq. 1.5 e 7.1 | Inv. 1 | Deliberadamente não é um componente: criá-lo duplicaria responsabilidades |
| O eixo é o momento do feedback: formativa e de condições | Método, 10.4 | Feedback (Arq. 6.3) + Orquestração (Arq. 7.3) | Inv. 1 | Duas modalidades, sem terceira, com donos distintos |
| Tipo 1 — avaliação contínua formativa (estrutural) | Método, 10.5 | Domínio, Motor e Feedback (Arq. 3, 4, 6) | Inv. 3 | Mede e ensina simultaneamente, no fluxo comum |
| Tipo 2 — avaliação de condições (estrutural, situacional) | Método, 10.6 | Orquestração (Arq. 7.4) | Inv. 6 | Evento fiel à banca, com feedback diferido |
| Variações de escopo: completo (estrutural) e parcial (opcional) | Método, 10.7–10.8 | Orquestração (Arq. 7.3) | Inv. 6 | Ambas sob as mesmas regras da modalidade |
| Toda avaliação alimenta o Motor apenas por evidência individual | Método, 10.9 | Domínio (porta única, Arq. 3.4) | Inv. 3, 8 | Nenhuma métrica paralela concorre com a medição de domínio |
| Anti-redundância: atividades dirigidas por estado, não por volume | Método, 10.10 | Motor (Arq. 4.4) + Jornada (Arq. 5.4) | Inv. 8 | Não existe "fazer mais questões" como fim; o estado do Conceito comanda |
| Fidelidade da fonte (formativa) e da forma (condições) | Método, 10.11 | Motor (Arq. 4.3) + Orquestração (Arq. 7.4) | Inv. 6 | Duas expressões da mesma restrição de banca |

#### Método, Capítulo 11 — Princípios Invioláveis (Constituição do Método)

| Princípio do Método | Localização | Componente responsável | Garantia estrutural | Justificativa da correspondência |
|---|---|---|---|---|
| Art. 1 — O objetivo é o domínio durável | Método, 11.3 | Toda a arquitetura (mandato de fidelidade) | Inv. 1, 2 | Nenhum componente existe senão para realizá-lo (Arq., Introdução) |
| Art. 2 — Progresso é domínio de conceito, não quantidade | Método, 11.3 | Domínio (Arq. 3.2–3.3) | Inv. 3, 8 | Nenhuma nota agregada é produzida ou consumida como progresso |
| Art. 3 — Aprende-se o conceito, nunca a resposta | Método, 11.3 | Feedback (Arq. 6.6) + Motor (rotação, Arq. 4.4) | Inv. 5 | Ensino transferível e rotação de itens contra memorização |
| Art. 4 — Domínio é evidência ao longo do tempo | Método, 11.3 | Domínio (Arq. 3.5, 3.8) | Inv. 3 | Caminho único de escrita por evidência |
| Art. 5 — Honestidade radical com o aluno | Método, 11.3 | Prontidão (Arq. 8.5) | Inv. 8, 9 | Fragilidade exposta; nenhuma promessa de aprovação |
| Art. 6 — Nenhuma métrica de vaidade | Método, 11.3 | Orquestração (Arq. 7.7) + Prontidão (Arq. 8.5) + Domínio (Arq. 3.3) | Inv. 8 | Nenhum componente produz placar, ranking ou contador como objetivo |
| Art. 7 — Integridade da fonte | Método, 11.3 | Produção Editorial (Arq. 9.4, 9.9) | Inv. 9 | Lastro e verificação como porta única de entrada |
| Art. 8 — Conceito único e banca-agnóstico | Método, 11.3 | Modelo de Conhecimento (Arq. 2.5, 2.8) | Inv. 5 | Identidade única; peso de banca como relação externa |
| Art. 9 — Uma banca por plano; bancas nunca se misturam | Método, 11.3 | Motor, Jornada, Orquestração, Prontidão (Arq. 4.5, 5.3, 7.4, 8.5) | Inv. 6 | O filtro de banca incide sobre toda decisão, composição e síntese |
| Art. 10 — IA fora do estudo | Método, 11.3 | Motor (Arq. 4.5) + Feedback (Arq. 6.8) | Inv. 7 | Decisão por regras explicáveis; conteúdo apenas pré-produzido |
| Núcleo inviolável vs superfície mutável | Método, 11.4 | Governança arquitetural (Arq. 10.8) | Inv. 1–12 | A superfície evolui; os invariantes permanecem |
| Teste de coerência como veto por princípio | Método, 11.5 | Governança arquitetural (Arq. 10.8) | Inv. 1–12 | Veto por invariante, ônus da prova na funcionalidade, efeito sobre intenção |
| Subordinação do comercial ao pedagógico | Método, 11.6 | Governança arquitetural (Arq. 10.8) | Inv. 8 | Nenhuma métrica de vaidade pode ser reintroduzida por conveniência |
| Coerência na expansão (bancas, cursos, tecnologias) | Método, 11.7 | Modelo de Conhecimento (Arq. 2.8) + Governança (Arq. 10.8) | Inv. 4, 5 | Expansão anexa ao eixo único, sem bifurcação nem exceções |
| Evolução do núcleo apenas por emenda explícita | Método, 11.8 | Governança arquitetural (Arq. 10.1, 10.8) | Inv. 1–12 | Violação sempre explícita, detectável e por decisão consciente |

#### Método, Capítulo 12 — Evolução Científica do Método

| Princípio do Método | Localização | Componente responsável | Garantia estrutural | Justificativa da correspondência |
|---|---|---|---|---|
| Princípios são fins; práticas são hipóteses | Método, 12.3 | Governança arquitetural (Arq. 10.1, 10.7–10.8) | Inv. 1–12 | Invariantes permanentes; parâmetros e algoritmos deixados à superfície |
| Distinção entre evolução e ruptura | Método, 12.4 | Governança arquitetural (Arq. 10.8) | Inv. 1–12 | Alterar invariante é ruptura; melhorar dentro deles é evolução |
| Incorporação criteriosa de ciência nova | Método, 12.5 | Governança arquitetural (Arq. 10.8) | Inv. 1–12 | A arquitetura admite mudança de prática sem tocar responsabilidades |
| Validação contra desfechos alinhados, nunca proxies | Método, 12.6 | Governança arquitetural (Arq. 10.7–10.8) | Inv. 8, 11 | Nenhuma métrica de vaidade pode servir de critério de validação |
| Revisão de hipóteses sem comprometer princípios | Método, 12.7 | Governança arquitetural (Arq. 10.8) | Inv. 1–12 | Livre na superfície; qualquer toque no invariante é emenda explícita |
| Tecnologia serve aos princípios; novidade não é valor | Método, 12.8 | Governança arquitetural (Arq. 10.8) | Inv. 7 | A proibição da IA no estudo não se reabre por avanço técnico |
| Identidade preservada entre versões | Método, 12.9 | Governança arquitetural (Arq. 10.9) | Inv. 1–12 | A identidade é a permanência dos invariantes, não das práticas |
| Honestidade intelectual e limitações admitidas | Método, 12.10 | Governança arquitetural (Arq. 10.6) + disciplina de escopo de cada capítulo | Inv. 11 | Detecção torna falhas visíveis; cada capítulo declara o que não define |

### 11.3 Conclusão institucional

Concluída a matriz, registram-se as três confirmações que encerram este documento:

**1. Todos os princípios do Método possuem implementação arquitetural.** Cada princípio, decisão e comportamento definido nos doze capítulos do Método Pedagógico SimulaPro V1 encontra, nesta Arquitetura Funcional, um componente responsável por realizá-lo e uma garantia estrutural que o protege. Não há princípio do Método sem tradução funcional correspondente.

**2. Nenhum componente existe sem justificativa pedagógica.** Cada um dos oito componentes funcionais — Modelo de Conhecimento, Registro de Evidência e Domínio, Motor de Sequenciamento, Gestão da Jornada e do Plano, Feedback Pedagógico, Orquestração das Avaliações, Avaliação de Prontidão e Suporte à Produção Editorial — existe porque um princípio do Método o exige, e nenhum foi criado por conveniência técnica, operacional ou comercial. As propriedades transversais — as garantias estruturais e a governança da evolução — não são componentes, e existem para proteger os princípios, não para acrescentar função.

**3. A Arquitetura Funcional SimulaPro V1 está oficialmente encerrada.** Com a definição dos componentes, de suas fronteiras e responsabilidades exclusivas, dos caminhos de escrita, das dependências permitidas, dos invariantes arquiteturais, da governança da evolução e desta matriz de fidelidade, o documento cumpre integralmente o mandato declarado em sua Introdução: demonstrar como o software implementa fielmente o Método Pedagógico SimulaPro V1. Nenhum capítulo adicional é necessário.

---

*Fim do Capítulo 11 e da Arquitetura Funcional SimulaPro V1.*
