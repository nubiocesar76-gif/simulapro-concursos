# H1 — Auditoria Editorial Crítica (Enfermagem / Enfermeiro)

Papel: Auditor, não arquiteto. Objetivo: encontrar o que está errado na
arquitetura das Fases 1–2, validado contra a forma real como IBFC, FGV,
Consulplan, IDECAN, VUNESP, Cebraspe, AOCP, FUNDEP, Avalia e FAFIPA
escrevem editais de Enfermeiro. Veredito adiantado: **a árvore de 26
"disciplinas" está estruturalmente inflada.** Metade dela não corresponde
a como as bancas realmente cortam o conteúdo — é uma reorganização
editorial (defensável como taxonomia de estudo) apresentada como se fosse
"a estrutura oficial do curso". Isso precisa ser corrigido antes de virar
schema de produção.

## Erro de método na raiz

O documento da Fase 1 tratou **todo item de lista de edital** como
candidato a "disciplina". Isso está errado. Na prática, quase todas as 10
bancas listadas organizam a prova de Enfermeiro assim:

```
Bloco: Conhecimentos Gerais → Português, (às vezes) Raciocínio Lógico, (às vezes) Informática
Bloco: Conhecimentos Específicos → UMA lista corrida de tópicos de Enfermagem
```

O "bloco de Conhecimentos Específicos" **não tem subdivisão em
disciplinas** no edital real — é uma lista plana de ~15 a ~40 linhas
("Fundamentos de enfermagem; Ética profissional; SAE; Farmacologia; Saúde
da mulher; Saúde da criança; ...; Biossegurança e controle de infecção
hospitalar; ..."). Eu peguei essa lista plana e promovi cada linha (às
vezes cada meia-linha) a "disciplina" com peso e frequência próprios. Isso
não é neutro: infla artificialmente a granularidade e cria a ilusão de que
existem 26 blocos independentes quando, na visão da banca, existe **um
bloco só**, internamente organizado por tópico.

Isso não invalida o conteúdo (os assuntos em si existem e são cobrados),
mas invalida a alegação de que a árvore representa "a estrutura oficial do
curso" — ela representa uma reorganização editorial minha, útil para
navegação de estudo, mas que precisa ser rotulada como tal, não como fato.

---

## Respostas diretas às 10 perguntas

**1. As disciplinas realmente existem nas provas?**
Como *conteúdo*, sim — quase todo assunto que documentei é realmente
cobrado. Como *disciplina nomeada e isolada no edital*, não — a maioria
aparece como item de lista dentro de "Conhecimentos Específicos", não como
cabeçalho próprio. Só um subconjunto pequeno (Fundamentos, Ética e
Legislação, Farmacologia, Saúde Coletiva, Saúde da Mulher, Saúde da
Criança, Saúde Mental, Urgência/Emergência, Médico-Cirúrgica, UTI)
aparece com frequência alta como cabeçalho isolado nas 10 bancas.

**2. Existem disciplinas artificiais?**
Sim, claramente: **Anatomia e Fisiologia** como disciplina isolada é
artificial para o cargo Enfermeiro — nas 10 bancas listadas, isso quase
nunca é cabeçalho próprio; quando aparece, é 1–3 questões dissolvidas em
"Conhecimentos Específicos" ou nem aparece. Elevá-la a disciplina de peso
33% é dar a ela status que a realidade das provas não sustenta.

**3. Existem disciplinas que deveriam ser assuntos?**
Sim, várias:
- **Biossegurança** — quase nunca é item isolado; nas provas reais é
  "Biossegurança **e** Controle de Infecção Hospitalar" como um único
  bullet. Documentei os dois como disciplinas irmãs separadas — na
  prática, deveria ser uma família só, com Biossegurança como assunto
  dentro de Controle de Infecção (ou o inverso).
- **Imunização** — nas 10 bancas, isso é sub-item de Saúde Coletiva
  ("Programa Nacional de Imunização" dentro de "Saúde Pública/Coletiva"),
  quase nunca cabeçalho próprio.
- **Administração em Enfermagem** — aparece, mas raramente como bloco
  isolado com peso equivalente às disciplinas clínicas; nas provas de
  Enfermeiro (diferente de provas de Enfermeiro-Gestor/Diretor de
  Enfermagem) costuma ser 2–4 questões dentro do bloco geral.
- **Enfermagem em Doenças Transmissíveis** — frequentemente absorvida por
  Saúde Coletiva/Epidemiologia como "vigilância epidemiológica das
  doenças transmissíveis", não como bloco autônomo.
- **Segurança do Paciente** — crescente, mas ainda mistura-se com
  Fundamentos na maioria das provas (protocolo de identificação, queda e
  LPP aparecem como "Fundamentos" em bancas mais tradicionais como IBFC e
  FAFIPA).

**4. Existem assuntos que deveriam virar disciplina?**
Um caso real: **Cálculo de Medicamentos/Doses**. Isso funciona, na
prática, como um "mini-exame dentro do exame" — todas as 10 bancas cobram
isso de forma consistente e MUITAS vezes com questão dedicada e cálculo
explícito. Hoje está subordinado a Fundamentos/Farmacologia como
subassunto; dado o padrão de cobrança, mereceria destaque próprio de
"assunto-âncora" (não necessariamente disciplina cheia, mas mais visibilidade
do que tem hoje). SAE já foi corretamente elevada.

**5. Existem duplicidades?**
Sim, além da já conhecida (SAE duplicada em `taxonomy.json`):
- **Saúde do Adulto** vs. **Enfermagem Médico-Cirúrgica** — sobreposição
  real. Nenhuma das 10 bancas separa "doença crônica do adulto" de
  "cuidado cirúrgico do adulto" como dois cabeçalhos distintos; ambos
  vivem dentro de "Enfermagem Clínica e Cirúrgica" ou "Enfermagem
  Médico-Cirúrgica". Manter os dois como disciplinas irmãs cria ambiguidade
  de classificação sem ganho real (o arquivo `05-casos-ambiguos-*.md` já
  precisou de uma regra só para arbitrar entre elas — sintoma de que a
  divisão é fraca).
- **Legislação do SUS × Políticas Públicas de Saúde × Saúde Coletiva** —
  triplicidade. Em VUNESP e Consulplan, por exemplo, é comum ver **um único
  item de edital**: "SUS: princípios, diretrizes, políticas públicas e
  legislação básica". Eu transformei isso em 3 disciplinas separadas.
  Analiticamente defensável (são conceitos diferentes), mas
  operacionalmente isso é sinônimo de edital tratado como 3 disciplinas.

**6. Existem sinônimos tratados como assuntos diferentes?**
Sim — item 5 já cobre o principal caso (SUS/Políticas/Saúde Coletiva).
Adicionalmente, "Biossegurança" e "Controle de Infecção Hospitalar" função
como sinônimo de bullet de edital em pelo menos 6 das 10 bancas analisadas.

**7. Existem assuntos raríssimos que não justificam existir (como estão)?**
Sim:
- **"Computação em Nuvem"** dentro de Informática — para o cargo
  Enfermeiro, o bloco de Informática quase sempre se limita a
  Word/Excel/Internet/conceitos básicos de hardware. "Computação em
  nuvem" como subassunto próprio é irreal para este cargo.
- **"Neurocirurgia (cuidados básicos)"** e **"Cirurgia Cardíaca (cuidados
  básicos)"** como subassuntos isolados dentro de Médico-Cirúrgica — são
  nichos de hospital universitário/especializado, não do Enfermeiro
  generalista que a maioria das 10 bancas testa.
- **PNAN, PNPS, PNPIC** como subassuntos nomeados individualmente —
  políticas reais, mas quase nunca cobradas pelo nome na prova de
  Enfermeiro; hoje ocupam uma linha inteira cada, sugerindo peso que não
  têm.
- **Doença de Chagas / Leishmaniose** como itens fixos de alta relevância
  nacional — na prática, a frequência real dessas depende **fortemente da
  região do concurso** (bancas do Nordeste/Norte cobram muito mais do que
  bancas de capitais do Sudeste). Tratá-las como itens de peso nacional
  uniforme é impreciso; deveriam carregar uma nota de "frequência
  regional", não uma frequência nacional fixa.

**8. Existem assuntos extremamente frequentes que estão subdimensionados?**
Sim, dois erros de calibração claros na Fase 1:
- **Urgência e Emergência** foi classificada como "Média" (52%). Isso está
  errado. Nas 10 bancas listadas, é consistentemente um dos 3–4 blocos mais
  cobrados para Enfermeiro (RCP/SBV/SAV, classificação de risco, sepse,
  IAM, AVC são "clássicos" recorrentes). Deveria estar em "Alta"/"Muito
  Alta", não "Média".
- **Imunização/Calendário Vacinal** foi classificada como "Média" (52%).
  Errado pelo mesmo motivo oposto ao item 3: mesmo sendo estruturalmente um
  subtópico de Saúde Coletiva (não uma disciplina própria), o **calendário
  vacinal específico** é um dos itens mais mecanicamente decoráveis e mais
  cobrados isoladamente em qualquer prova de Enfermagem — bancas adoram
  perguntar idade exata + dose + via de uma vacina específica. Isso é alta
  frequência disfarçada de disciplina de peso médio.

**9. A hierarquia Disciplina → Assunto → Subassunto representa a
realidade das provas?**
Não, e isso precisa ser dito sem rodeio: **nenhuma banca usa hierarquia de
3 níveis no edital.** O edital real é uma lista plana (no máximo 2 níveis:
bloco → item). A hierarquia de 3–4 níveis que construí é uma ferramenta
de **classificação e navegação de estudo**, não uma representação da
estrutura oficial da prova. Isso não é necessariamente errado para os fins
do SimulaPro (um app de estudo se beneficia de granularidade), mas o
documento da Fase 1 apresentou essa hierarquia como se fosse "a estrutura
oficial do curso" (título do documento, inclusive) — isso é uma alegação
que a evidência não sustenta. Precisa ser reclassificado como **taxonomia
editorial derivada**, não como fato de edital.

**10. A arquitetura serviria para classificar automaticamente 100 mil
questões?**
Não, do jeito que está hoje. Motivos concretos:
- 62 regras de classificação (Fase 2) são um protótipo ilustrativo, não
  cobertura de produção. Para 100 mil questões reais, a superfície de
  variação textual é ordens de magnitude maior do que 62 padrões
  SE/ENTÃO cobrem.
- Os "graus de confiança" atribuídos às regras (ex.: 98%, 95%) são
  **opiniões editoriais não medidas** — `evidenceCount = 0` em praticamente
  tudo. Se essa arquitetura fosse rodada contra 100 mil questões reais
  hoje, a taxa real de acerto das regras é desconhecida — os números atuais
  não podem ser usados como estimativa de desempenho.
- As 3 famílias de sobreposição identificadas nos itens 5 e 6 (Saúde do
  Adulto/Médico-Cirúrgica; Biossegurança/CIH; SUS/Políticas/Saúde
  Coletiva) provavelmente respondem por **15–20% de todo o volume de
  questões específicas de Enfermagem** — é uma fatia grande demais para
  deixar sem resolução antes de rodar em escala; hoje, o mecanismo de
  desempate existe no papel, mas nunca foi testado contra questão real.
- Não existe hoje nenhum "balde de não-classificado" testado — a
  arquitetura V2 prevê fila de revisão abaixo de 90% de confiança, o que é
  correto, mas como a confiança de partida é toda estimada (prior
  editorial), é provável que a maioria das 100 mil questões caia em fila de
  revisão humana no primeiro contato — ou seja, hoje a arquitetura **ajuda
  a organizar revisão humana em escala**, mas não classifica 100 mil
  questões sozinha sem essa revisão.

O ponto positivo, para ser justo: a base é reaproveitável — a correção
não é "jogar tudo fora", é achatar a granularidade artificial, resolver as
3 sobreposições e recalibrar frequência com dados reais antes de confiar
na automação total.

---

## Matriz de Confiança — 26 disciplinas

| Disciplina | Evidência (aparece como item isolado no edital?) | Frequência estimada (corrigida) | Grau de confiança | Classificação |
|---|---|---|---|---|
| Fundamentos de Enfermagem | Muito Alta — quase sempre cabeçalho próprio | 76% → mantém | Alto | **Aprovada** |
| Ética e Legislação em Enfermagem | Alta — item quase universal | 68% → mantém | Alto | **Aprovada** |
| Farmacologia | Alta — item comum, especialmente em provas longas | 50% → mantém | Alto | **Aprovada** |
| Saúde Coletiva | Muito Alta — item universal | 76% → mantém | Alto | **Aprovada** |
| Saúde da Mulher | Alta — item comum | 56% → mantém | Alto | **Aprovada** |
| Saúde da Criança e do Adolescente | Alta — item comum | 56% → mantém | Alto | **Aprovada** |
| Saúde Mental | Alta — item cada vez mais comum | 44% → **subir p/ ~55%** | Médio-Alto | **Aprovada (ajustar freq.)** |
| Urgência e Emergência | Muito Alta — top 3–4 em quase toda banca | 52% → **subir p/ ~78%** | Alto | **Aprovada (ajustar freq., erro de calibração)** |
| Terapia Intensiva (UTI) | Alta — item comum em provas hospitalares/HU | 42% → **subir p/ ~55%** | Médio-Alto | **Aprovada (ajustar freq.)** |
| Enfermagem Médico-Cirúrgica | Alta — item comum | 50% → **absorve Saúde do Adulto, sobe p/ ~65%** | Alto | **Aprovada, com fusão** |
| Centro Cirúrgico e CME | Média-Alta — item comum em provas hospitalares | 40% → mantém | Médio | **Aprovada** |
| SAE | Alta, mas com bug de duplicidade estrutural já identificado | 56% → mantém | Médio (por causa do bug) | **Aprovada, corrigir duplicidade (já endereçado em V2)** |
| Português (transversal) | Alta — bloco de Conhecimentos Gerais | 70% → mantém | Alto | **Aprovada** |
| Saúde do Idoso | Média-Alta — crescente, às vezes fundida em Saúde Coletiva | 42% → mantém | Médio | **Aprovada, com ressalva de fusão parcial** |
| Legislação do SUS | Alta, mas frequentemente é o mesmo bullet que Políticas Públicas | 68% | Médio (por sobreposição) | **Revisar — fundir parcialmente com Políticas Públicas** |
| Políticas Públicas de Saúde | Média — muitas vezes é sinônimo de edital de Legislação do SUS/Saúde Coletiva | 60% | Médio-Baixo | **Revisar — candidata a fusão/subordinação** |
| Controle de Infecção Hospitalar | Média — quase sempre junto de Biossegurança no mesmo bullet | 48% | Médio-Baixo | **Revisar — fundir com Biossegurança** |
| Biossegurança | Média — quase nunca sozinha | 57% (número inflado por já incluir conteúdo de CIH) | Médio-Baixo | **Revisar — fundir com Controle de Infecção Hospitalar** |
| Segurança do Paciente | Média, crescente, mas sobrepõe Fundamentos | 56% | Médio | **Revisar — desduplicar protocolos já presentes em Fundamentos** |
| Administração em Enfermagem | Média — presente, mas raramente cabeçalho de peso equivalente às clínicas | 46% | Médio-Baixo | **Revisar — rebaixar peso ou tratar como transversal de menor prioridade** |
| Enfermagem em Doenças Transmissíveis | Média — frequentemente absorvida por Saúde Coletiva | 46% | Médio-Baixo | **Revisar — considerar subordinar a Saúde Coletiva** |
| Imunização | Baixa como "disciplina"; Alta como conteúdo específico (calendário vacinal) | 52% → **conteúdo sobe, mas rebaixar de "disciplina" para "assunto forte" de Saúde Coletiva** | Médio | **Revisar — mudar de nível hierárquico, não de importância** |
| Raciocínio Lógico | Baixa-Média — ausente em muitos editais de Enfermeiro | 48% (número não reflete que é opcional por edital) | Médio-Baixo | **Revisar — marcar como condicional por edital, não fixo** |
| Informática | Baixa-Média — presente de forma inconsistente, conteúdo raso quando presente | 43% | Médio-Baixo | **Revisar — reduzir escopo (remover subtemas irreais) e marcar como condicional** |
| Saúde do Adulto | Baixa como disciplina isolada — sobreposição quase total com Médico-Cirúrgica | 52% | Baixo | **Remover como disciplina — absorver como assunto dentro de Enfermagem Médico-Cirúrgica** |
| Anatomia e Fisiologia | Muito Baixa como disciplina isolada para o cargo Enfermeiro | 33% (mesmo esse número é generoso) | Baixo | **Remover como disciplina — rebaixar a bloco de apoio transversal/opcional, não currículo próprio** |

---

## Entregável final

### O que manter
- A hierarquia Disciplina → Assunto → Subassunto → Palavra-chave como
  **ferramenta de classificação interna**, desde que deixe de ser
  apresentada como "estrutura oficial do edital" e passe a ser rotulada
  como taxonomia editorial derivada.
- As 13 disciplinas com evidência forte e sem sobreposição relevante:
  Fundamentos, Ética e Legislação, Farmacologia, Saúde Coletiva, Saúde da
  Mulher, Saúde da Criança e do Adolescente, Saúde Mental, Urgência e
  Emergência, UTI, Enfermagem Médico-Cirúrgica, Centro Cirúrgico e CME,
  SAE, Saúde do Idoso — mais Português como transversal fixo.
- Todo o conteúdo de subassunto/palavra-chave já escrito — nada precisa
  ser reescrito, só **reancorado** sob a estrutura corrigida.
- O mecanismo de confiança/evidência/evolução da V2 — é exatamente o
  necessário para corrigir, com dados reais, os números que esta auditoria
  está sinalizando como estimados.

### O que alterar
1. **Fundir Biossegurança + Controle de Infecção Hospitalar** em uma única
   disciplina ("Biossegurança e Controle de Infecção Hospitalar"), com os
   assuntos atuais de ambas viram sub-blocos dela.
2. **Fundir Legislação do SUS + Políticas Públicas de Saúde** em uma única
   disciplina ("SUS: Legislação e Políticas Públicas"), preservando os
   assuntos atuais como sub-blocos; manter Saúde Coletiva separada (ela
   tem identidade epidemiológica própria e forte o suficiente para não
   entrar na fusão).
3. **Rebaixar Imunização** de disciplina para assunto de peso alto dentro
   de Saúde Coletiva — sem perder nenhum subassunto, só mudando o nível.
4. **Rebaixar Administração em Enfermagem** e **Enfermagem em Doenças
   Transmissíveis** de prioridade — manter como disciplinas (têm
   identidade própria o suficiente), mas com peso reconhecidamente menor
   e sinalização explícita de "cobertura variável por edital".
5. **Corrigir a calibração de frequência** de Urgência e Emergência
   (52%→~78%), UTI (42%→~55%), Saúde Mental (44%→~55%) e Imunização/
   calendário vacinal (mantendo alta mesmo após virar assunto).
6. **Marcar Raciocínio Lógico e Informática como "condicionais por
   edital"**, não fixos — e remover de Informática os subtemas irreais
   para o cargo (ex.: Computação em Nuvem).
7. **Remover os subassuntos de nicho hospitalar** (Neurocirurgia e
   Cirurgia Cardíaca "cuidados básicos") do currículo padrão — mantê-los
   apenas como tags opcionais para provas de Hospital Universitário
   específicas, não como parte do núcleo nacional.
8. **Adicionar nota de "frequência regional"** em Doença de Chagas e
   Leishmaniose (e qualquer outro agravo endêmico-dependente), em vez de
   frequência nacional fixa.

### O que remover
- **Saúde do Adulto** como disciplina — absorver integralmente (todos os
  assuntos e subassuntos) dentro de Enfermagem Médico-Cirúrgica, que passa
  a se chamar, se necessário, "Enfermagem Clínica e Cirúrgica do Adulto"
  para refletir o escopo ampliado.
- **Anatomia e Fisiologia** como disciplina curricular própria — vira um
  bloco de apoio transversal (referenciável por qualquer disciplina
  clínica), sem peso de frequência próprio no edital, porque nenhuma das
  10 bancas testa isso como bloco isolado para Enfermeiro.
- Os subassuntos PNAN, PNPS, PNPIC como itens de primeira classe — não
  remover a informação, mas consolidar em um único subassunto guarda-chuva
  ("Outras Políticas Nacionais Específicas") para não sugerir peso
  individual que não existe.

### O que criar
- **Nota de proveniência editorial explícita** em todo o documento de
  taxonomia: "esta hierarquia é uma reorganização de estudo; a lista real
  de edital é plana" — evita que a próxima pessoa (ou a própria IA) confunda
  taxonomia de estudo com estrutura oficial de novo.
- **Campo `cobertura_por_edital`** (ex.: `UNIVERSAL` / `FREQUENTE` /
  `VARIAVEL_POR_BANCA` / `REGIONAL`) em cada disciplina/assunto — resolve de
  uma vez os casos de Raciocínio Lógico, Informática, Chagas/Leishmaniose
  e qualquer futuro caso semelhante, em vez de forçar um número nacional
  único que mascara variação real.
- **Assunto-âncora "Cálculo de Medicamentos e Doses"** com visibilidade
  reforçada (não precisa virar disciplina, mas precisa deixar de estar
  "escondido" dentro de Fundamentos/Farmacologia, dado o padrão de
  cobrança quase garantido em toda prova).
- **Processo de recalibração por evidência real**, já desenhado na V2
  (Sistema de Evidências/Confiança/Evolução) — esta auditoria é a prova de
  que os números da Fase 1 precisam ser tratados como hipótese, não como
  fato, até serem confirmados por questões reais importadas.

### Impacto de cada alteração

| Alteração | Impacto estrutural | Impacto de dados | Risco se não for feita |
|---|---|---|---|
| Fundir Biossegurança + CIH | 2 disciplinas → 1; ~7 assuntos preservados como sub-blocos | Nenhuma perda de subassunto/keyword; só reindexação de `disciplina_id` | Classificador continuará recebendo o mesmo par ambíguo com chance real de erro em produção |
| Fundir Legislação do SUS + Políticas Públicas | 2 disciplinas → 1; ~9 assuntos preservados | Idem | Duplicação de cobertura normativa (mesma lei citada nas duas) e confusão de peso editorial |
| Rebaixar Imunização a assunto | Muda nível hierárquico, não conteúdo | Subassuntos migram de `discipline.topics` para `topic.subtopics` sob Saúde Coletiva | Continuará parecendo "27ª prioridade igual às outras" quando na real é um sub-item de peso alto dentro de outra |
| Remover Saúde do Adulto (fundir em Médico-Cirúrgica) | 2 disciplinas → 1, a maior do curso | ~17 subassuntos migram sem perda | Regra de desambiguação seguirá sendo necessária para um par que não deveria existir |
| Remover Anatomia e Fisiologia como disciplina própria | Disciplina vira "bloco de apoio" sem peso de edital | ~23 subassuntos preservados, mas sem frequência própria — passam a ser referenciados, não currículo | Infla artificialmente a percepção de peso curricular de um conteúdo que nenhuma banca testa isolado |
| Corrigir frequência de Urgência/UTI/Saúde Mental/Imunização | Nenhum impacto estrutural, só de calibração | 4 valores numéricos corrigidos em `01-disciplinas.json`/`07-frequencia-*` | Simulados gerados a partir do dado atual sub-representariam um dos blocos mais cobrados de toda a prova |
| Marcar Raciocínio Lógico/Informática como condicionais | Novo campo `cobertura_por_edital`, sem remover disciplina | Nenhuma perda; adiciona 1 campo em 2 registros (e depois em todos) | Simulado "completo" incluiria blocos que uma banca específica nunca cobra, gerando ruído de estudo para o usuário |
| Remover subassuntos de nicho hospitalar do núcleo | Reclassifica 2 subassuntos como "tag opcional" | Nenhuma perda de dado, só de prioridade/visibilidade | Usuário de concurso municipal genérico estudaria conteúdo de HU especializado sem necessidade |

Este é o estado real da arquitetura hoje: **fundação aproveitável, calibração
não confiável, granularidade superestimada em pelo menos 6 das 26
disciplinas.** Recomendo aplicar as fusões/remoções antes de qualquer
importação em massa de questões reais — corrigir depois de popular o banco
é ordens de magnitude mais caro do que corrigir agora.
