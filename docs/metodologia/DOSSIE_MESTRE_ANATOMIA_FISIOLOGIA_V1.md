# DOSSIÊ MESTRE — ANATOMIA E FISIOLOGIA — V1

## Objetivo

Base técnica oficial da disciplina "Anatomia e Fisiologia" do SimulaPro, construída pela mesma metodologia já aplicada às disciplinas anteriores (Políticas Públicas de Saúde, Terapia Intensiva). Não gera questões, não resume para aluno. É a fonte editorial permanente para o Motor Editorial.

## Achados Editoriais (obrigatório registrar — não silenciar)

**Achado 1 — tensão com decisão arquitetural anterior.** O documento de referência real desta disciplina (`docs/editorial/02j-anatomia-fisiologia.md`) traz uma ERRATA V1.1 que classifica Anatomia e Fisiologia como `status = MATERIAL_DE_APOIO`, removida como disciplina curricular própria porque "nenhuma das 10 bancas de referência testa isso como bloco isolado para o cargo Enfermeiro" (exceção parcial: FUNDEP e UFPR/NC). Essa decisão está registrada em `docs/editorial/auditoria/V1.1-arquitetura-corrigida.md` e em `INVENTARIO_GLOBAL_V1.md` (linha 135, "saiu do roadmap"). A Auditoria Forense conduzida nesta sessão confirmou: 0 produção prévia, 0 Dossiê/Plano anteriores para esta disciplina — a decisão de retirada do roadmap é anterior a qualquer tentativa de produção. O usuário revisou essa auditoria e, com pleno conhecimento do achado, instruiu explicitamente a execução do ciclo completo desta disciplina nesta sessão. Este Dossiê **não reverte nem apaga** o achado MATERIAL_DE_APOIO — apenas registra que a produção de conteúdo aqui documentada foi uma decisão editorial explícita e informada do usuário, tomada por cima do status arquitetural existente. A tabela `subjects`/`topics` (real, funcional) sempre manteve Anatomia e Fisiologia como disciplina própria e independente — o status MATERIAL_DE_APOIO existe apenas na taxonomia-sombra `editorial_disciplines`, nunca chegou a ser aplicado à arquitetura real de dados.

**Achado 2 — tópico real não coberto pela taxonomia documentada.** O banco de produção já possui o tópico `Sistema Sensorial — Visão e Audição` (2 questões reais, banca IBFC, criadas em 2026-07-10, antes desta sessão), que **não consta** nos 7 assuntos / 23 subassuntos de `02j-anatomia-fisiologia.md`. Por instrução explícita do usuário ("utilizar a taxonomia existente — 7 assuntos e 23 subassuntos"), este ciclo de produção **usa exclusivamente os 23 subassuntos documentados abaixo** e não expande novo conteúdo em Sistema Sensorial. As 2 questões pré-existentes permanecem no banco, intocadas.

## Nota metodológica

Anatomia e Fisiologia é disciplina de **ciência básica**, sem normativa própria (achado já registrado na fonte: "não se aplica diretamente... disciplina de ciência básica, sem normativa própria"). A Auditoria Normativa desta sprint reflete essa natureza — não há resoluções/portarias a auditar; a auditoria aqui recai sobre a **estabilidade científica** do conteúdo (fisiologia humana consolidada, não sujeita a "revogação"), usando como base as referências bibliográficas clássicas já indicadas pela fonte: Guyton & Hall (Fisiologia Humana), Tortora (Princípios de Anatomia e Fisiologia), Moore (Anatomia Orientada para a Clínica).

**Regra de desambiguação (herdada da fonte, aplicada rigorosamente em toda a produção):** só classificar uma questão em Anatomia e Fisiologia quando o enunciado for sobre **estrutura ou função normal**. Se a questão envolve alteração patológica, tratamento ou cuidado de enfermagem propriamente dito, ela pertence à disciplina clínica correspondente — mesmo que exija conhecimento anatômico para responder. Caso específico documentado: Equilíbrio Hidroeletrolítico e Ácido-Base — mecanismo normal de regulação → Anatomia e Fisiologia; distúrbio (hipo/hipercalemia etc.) e sua correção → disciplina clínica.

---

## MACROTEMA (ASSUNTO) 1 — SISTEMA CARDIOVASCULAR

### 1.1 — Anatomia do Coração e Grandes Vasos (`anatomia-do-coracao-e-grandes-vasos`)
**Objetivo:** localizar e descrever as estruturas macroscópicas do coração e dos grandes vasos. **Conceitos fundamentais:** câmaras (átrios/ventrículos), valvas (mitral, tricúspide, aórtica, pulmonar), camadas da parede cardíaca (endocárdio, miocárdio, pericárdio), grandes vasos (aorta, veias cavas, artérias e veias pulmonares). **Relação com outros capítulos:** base para 1.2 (ciclo cardíaco) e 1.3 (circulação). **Observações importantes:** direção do fluxo sanguíneo através das valvas e câmaras é o gatilho cognitivo mais comum; erro clássico é inverter lado direito (sangue venoso/pulmonar) e esquerdo (sangue arterial/sistêmico). **Referências:** Tortora; Moore.

### 1.2 — Ciclo Cardíaco e Sistema de Condução (`ciclo-cardiaco-e-sistema-de-conducao`)
**Objetivo:** caracterizar a sequência elétrica e mecânica de um batimento cardíaco. **Conceitos fundamentais:** sístole/diástole; sistema de condução (nó sinoatrial → nó atrioventricular → feixe de His → fibras de Purkinje); nó sinoatrial como marca-passo natural. **Relação com outros capítulos:** liga-se a 1.4 (regulação da frequência cardíaca) e ao Sistema Nervoso Autônomo (3.3). **Observações importantes:** distinguir "origem do estímulo elétrico" (nó SA) de "condução até os ventrículos" (nó AV/feixe de His) é pegadinha recorrente. **Referências:** Guyton & Hall; Tortora.

### 1.3 — Circulação Sistêmica e Pulmonar (`circulacao-sistemica-e-pulmonar`)
**Objetivo:** diferenciar os dois circuitos da circulação humana. **Conceitos fundamentais:** pequena circulação (ventrículo direito → artérias pulmonares → pulmões → veias pulmonares → átrio esquerdo, sangue venoso oxigenando-se) e grande circulação (ventrículo esquerdo → aorta → tecidos → veias cavas → átrio direito). **Relação com outros capítulos:** liga-se a 2.2 (trocas gasosas). **Observações importantes:** confundir "artéria pulmonar carrega sangue venoso" (verdadeiro, exceção à regra geral de que artérias carregam sangue arterial) é a pegadinha clássica. **Referências:** Tortora; Guyton & Hall.

### 1.4 — Sistema Cardiovascular (regulação da pressão arterial e do débito cardíaco) (`sistema-cardiovascular`)
**Objetivo:** caracterizar os mecanismos de regulação da pressão arterial e do débito cardíaco. **Conceitos fundamentais:** débito cardíaco = frequência cardíaca × volume sistólico; lei de Frank-Starling; barorreceptores (arco aórtico e seio carotídeo) como mecanismo reflexo de curto prazo. **Relação com outros capítulos:** liga-se a 3.3 (SNA) e ao Macrotema 7 (assuntos que aparecem juntos). **Observações importantes:** tópico já existente no banco (topic real pré-existente) — usado aqui para o conteúdo de regulação, que não se sobrepõe a 1.1-1.3. **Referências:** Guyton & Hall.

---

## MACROTEMA (ASSUNTO) 2 — SISTEMA RESPIRATÓRIO

### 2.1 — Anatomia das Vias Aéreas e Pulmões (`anatomia-das-vias-aereas-e-pulmoes`)
**Objetivo:** descrever a estrutura das vias aéreas superiores/inferiores e dos pulmões. **Conceitos fundamentais:** vias aéreas superiores (nariz, faringe, laringe) e inferiores (traqueia, brônquios, bronquíolos, alvéolos); lobos pulmonares (3 à direita, 2 à esquerda); pleuras (visceral/parietal). **Relação com outros capítulos:** base para 2.2. **Observações importantes:** assimetria dos brônquios principais (direito mais curto, largo e vertical — relevante para aspiração de corpo estranho) é gatilho clássico. **Referências:** Tortora; Moore.

### 2.2 — Mecânica Ventilatória e Trocas Gasosas (`mecanica-ventilatoria-e-trocas-gasosas`)
**Objetivo:** caracterizar o processo mecânico da respiração e a troca de gases. **Conceitos fundamentais:** inspiração (contração do diafragma, pressão intrapleural negativa) e expiração (geralmente passiva); hematose alveolar (difusão de O2/CO2 por gradiente de pressão parcial). **Relação com outros capítulos:** liga-se a 1.3 (circulação pulmonar). **Observações importantes:** diferenciar ventilação (movimento de ar) de respiração celular/hematose (troca gasosa) é pegadinha conceitual comum. **Referências:** Guyton & Hall.

### 2.3 — Controle da Respiração (`controle-da-respiracao`)
**Objetivo:** caracterizar o controle neural e químico do ritmo respiratório. **Conceitos fundamentais:** centro respiratório bulbar/pontino; quimiorreceptores centrais (sensíveis a CO2/pH do líquor) e periféricos (corpos carotídeos/aórticos, sensíveis a O2). **Relação com outros capítulos:** liga-se a 4.1 (SNC) e 5.3 (equilíbrio ácido-base). **Observações importantes:** o principal estímulo fisiológico para respirar é o CO2 (via pH), não a queda de O2 — erro comum inverter essa hierarquia. **Referências:** Guyton & Hall.

---

## MACROTEMA (ASSUNTO) 3 — SISTEMA DIGESTÓRIO

### 3.1 — Anatomia do Trato Gastrointestinal (`anatomia-do-trato-gastrointestinal`)
**Objetivo:** descrever a sequência anatômica do tubo digestivo. **Conceitos fundamentais:** boca → esôfago → estômago (fundo, corpo, antro) → intestino delgado (duodeno, jejuno, íleo) → intestino grosso (ceco, cólons, reto, ânus). **Relação com outros capítulos:** base para 3.3. **Observações importantes:** localização e função de cada segmento (ex.: absorção predominante no jejuno/íleo, não no estômago) é gatilho recorrente. **Referências:** Tortora; Moore.

### 3.2 — Fígado, Vesícula Biliar e Pâncreas Exócrino (`figado-vesicula-biliar-pancreas-exocrino`)
**Objetivo:** caracterizar os órgãos anexos e suas secreções digestivas. **Conceitos fundamentais:** fígado (produção de bile), vesícula biliar (armazenamento/concentração da bile), pâncreas exócrino (enzimas digestivas — amilase, lipase, tripsina — via ducto pancreático). **Relação com outros capítulos:** liga-se a 6.3 (pâncreas endócrino) por contraste (mesmo órgão, funções distintas). **Observações importantes:** distinguir função exócrina (digestiva) de endócrina (hormonal) do pâncreas é pegadinha clássica entre este capítulo e 6.3. **Referências:** Guyton & Hall; Tortora.

### 3.3 — Fisiologia da Digestão e Absorção (`fisiologia-da-digestao-e-absorcao`)
**Objetivo:** caracterizar os processos de digestão química e absorção de nutrientes. **Conceitos fundamentais:** digestão mecânica (motilidade) e química (enzimas); absorção predominante no intestino delgado (vilosidades e microvilosidades aumentam superfície de absorção); água e eletrólitos absorvidos majoritariamente no intestino grosso. **Relação com outros capítulos:** liga-se a 3.1. **Observações importantes:** local de absorção de cada nutriente (ex.: vitamina B12 no íleo terminal) é tema técnico frequente. **Referências:** Guyton & Hall.

---

## MACROTEMA (ASSUNTO) 4 — SISTEMA NERVOSO

### 4.1 — Sistema Nervoso Central (encéfalo, medula) (`sistema-nervoso-central`)
**Objetivo:** descrever a organização estrutural do encéfalo e da medula espinhal. **Conceitos fundamentais:** cérebro (lobos frontal, parietal, temporal, occipital), cerebelo (coordenação motora), tronco encefálico (mesencéfalo, ponte, bulbo — funções vitais), medula espinhal (via de condução e reflexos). **Relação com outros capítulos:** base para 4.2, liga-se a 2.3 (centro respiratório bulbar). **Observações importantes:** localizar função por lobo/estrutura (ex.: área de Broca no lobo frontal, para linguagem) é gatilho comum. **Referências:** Tortora; Moore.

### 4.2 — Sistema Nervoso Periférico e Nervos Cranianos (`sistema-nervoso-periferico-e-nervos-cranianos`)
**Objetivo:** caracterizar os nervos que conectam o SNC ao restante do corpo. **Conceitos fundamentais:** 12 pares de nervos cranianos (nome, número, função predominantemente motora/sensitiva/mista); nervos espinhais e plexos. **Relação com outros capítulos:** liga-se a 4.1. **Observações importantes:** associar número/nome do nervo craniano à sua função (ex.: vago — X par, função autonômica parassimpática) é tema técnico clássico de banca. **Referências:** Tortora; Moore.

### 4.3 — Sistema Nervoso Autônomo (Simpático/Parassimpático) (`sistema-nervoso-autonomo`)
**Objetivo:** caracterizar a divisão involuntária do sistema nervoso e seus efeitos. **Conceitos fundamentais:** simpático (resposta de luta ou fuga — aumenta FC, dilata pupilas, inibe digestão) e parassimpático (resposta de repouso e digestão — reduz FC, estimula digestão); neurotransmissores principais (noradrenalina no simpático pós-ganglionar; acetilcolina no parassimpático). **Relação com outros capítulos:** liga-se fortemente a 1.2/1.4 (regulação cardíaca) — assunto de maior cobrança cruzada da disciplina (ver Macrotema 7). **Observações importantes:** efeitos opostos e complementares (não um "liga/desliga" simples) é o núcleo conceitual mais cobrado. **Referências:** Guyton & Hall.

---

## MACROTEMA (ASSUNTO) 5 — SISTEMA URINÁRIO E RENAL

### 5.1 — Anatomia do Rim e Vias Urinárias (`anatomia-do-rim-e-vias-urinarias`)
**Objetivo:** descrever a estrutura macroscópica do sistema urinário. **Conceitos fundamentais:** rins (córtex, medula, pelve renal), néfron como unidade funcional, ureteres, bexiga, uretra. **Relação com outros capítulos:** base para 5.2. **Observações importantes:** diferença anatômica de uretra masculina (mais longa) e feminina (mais curta), relevante para compreensão de risco de infecção urinária. **Referências:** Tortora; Moore.

### 5.2 — Fisiologia da Filtração Glomerular (`fisiologia-da-filtracao-glomerular`)
**Objetivo:** caracterizar o processo de formação da urina no néfron. **Conceitos fundamentais:** filtração glomerular (cápsula de Bowman), reabsorção tubular (túbulo contorcido proximal/distal, alça de Henle), secreção tubular; taxa de filtração glomerular (TFG) como indicador de função renal. **Relação com outros capítulos:** liga-se a 5.3. **Observações importantes:** distinguir "filtração" (passiva, glomérulo) de "reabsorção/secreção" (ativa, túbulos) é pegadinha central. **Referências:** Guyton & Hall.

### 5.3 — Equilíbrio Hidroeletrolítico e Ácido-Base (`equilibrio-hidroeletrolitico-e-acido-base`)
**Objetivo:** caracterizar os mecanismos normais de regulação de líquidos, eletrólitos e pH. **Conceitos fundamentais:** regulação do sódio/potássio pelos rins (sistema renina-angiotensina-aldosterona); tamponamento ácido-base (sistema bicarbonato/ácido carbônico); compensação respiratória e renal do pH. **Relação com outros capítulos:** liga-se fortemente a 5.2 e a 2.3 (controle da respiração) — ver regra de desambiguação no topo deste dossiê: mecanismo normal aqui, distúrbio (hipercalemia, acidose etc.) em disciplina clínica. **Observações importantes:** este é o subassunto mais sensível à regra de desambiguação — toda questão deve permanecer no mecanismo normal, nunca descrever um distúrbio como diagnóstico/tratamento. **Referências:** Guyton & Hall.

---

## MACROTEMA (ASSUNTO) 6 — SISTEMA ENDÓCRINO

### 6.1 — Glândulas Endócrinas e Hormônios (`glandulas-endocrinas-e-hormonios`)
**Objetivo:** mapear as principais glândulas endócrinas e seus hormônios. **Conceitos fundamentais:** tireoide (T3/T4, calcitonina), paratireoides (PTH), adrenais (córtex: cortisol/aldosterona; medula: adrenalina/noradrenalina), gônadas. **Relação com outros capítulos:** base para 6.2 e 6.3. **Observações importantes:** associar glândula → hormônio → efeito principal é o gatilho cognitivo dominante. **Referências:** Guyton & Hall; Tortora.

### 6.2 — Eixo Hipotálamo-Hipófise (`eixo-hipotalamo-hipofise`)
**Objetivo:** caracterizar o eixo regulador central do sistema endócrino. **Conceitos fundamentais:** hipotálamo (hormônios liberadores/inibidores), hipófise anterior (adeno-hipófise: TSH, ACTH, GH, FSH/LH, prolactina) e posterior (neuro-hipófise: ADH, ocitocina — produzidos no hipotálamo, apenas armazenados/liberados na hipófise posterior). **Relação com outros capítulos:** liga-se a 6.1. **Observações importantes:** distinguir hormônios produzidos vs. apenas armazenados/liberados na neuro-hipófise é pegadinha clássica. **Referências:** Guyton & Hall.

### 6.3 — Pâncreas Endócrino (`pancreas-endocrino`)
**Objetivo:** caracterizar a função hormonal do pâncreas. **Conceitos fundamentais:** ilhotas de Langerhans — células beta (insulina, hipoglicemiante) e células alfa (glucagon, hiperglicemiante), em contraste com a função exócrina já descrita em 3.2. **Relação com outros capítulos:** liga-se diretamente a 3.2 (mesmo órgão, função distinta). **Observações importantes:** insulina reduz glicemia (promove captação celular de glicose); glucagon eleva glicemia (estimula glicogenólise hepática) — inversão é o erro clássico de distrator. **Referências:** Guyton & Hall.

---

## MACROTEMA (ASSUNTO) 7 — OUTROS SISTEMAS

### 7.1 — Sistema Musculoesquelético (`sistema-musculoesqueletico`)
**Objetivo:** descrever a organização básica de ossos, articulações e músculos. **Conceitos fundamentais:** tipos de ossos (longos, curtos, planos, irregulares), tipos de articulações (sinartroses, anfiartroses, diartroses), tipos de tecido muscular (esquelético, liso, cardíaco) e suas características contráteis. **Relação com outros capítulos:** independente, referenciado por disciplinas clínicas de mobilidade/trauma. **Observações importantes:** diferenciar músculo estriado esquelético (voluntário) de estriado cardíaco (involuntário) e liso (involuntário) é gatilho comum. **Referências:** Tortora; Moore.

### 7.2 — Sistema Tegumentar (Pele e Anexos) (`sistema-tegumentar`)
**Objetivo:** descrever a estrutura da pele e seus anexos. **Conceitos fundamentais:** camadas da pele (epiderme, derme, hipoderme), anexos cutâneos (glândulas sudoríparas, sebáceas, pelos, unhas), funções (proteção, termorregulação, sensibilidade). **Relação com outros capítulos:** independente, referenciado por disciplinas de curativo/lesão por pressão. **Observações importantes:** localizar a camada responsável por cada função (ex.: melanócitos na epiderme) é tema técnico recorrente. **Referências:** Tortora.

### 7.3 — Sistema Reprodutor Feminino e Masculino (`sistema-reprodutor`)
**Objetivo:** descrever a anatomia básica dos sistemas reprodutores. **Conceitos fundamentais:** sistema feminino (ovários, tubas uterinas, útero, vagina) e masculino (testículos, epidídimo, ducto deferente, próstata, pênis); ciclo hormonal ovariano em traços gerais (conexão com 6.2, FSH/LH). **Relação com outros capítulos:** liga-se a 6.2. **Observações importantes:** manter o enunciado em estrutura/função normal, sem adentrar patologias (ex.: câncer, infertilidade), que pertencem a disciplinas clínicas. **Referências:** Tortora; Moore.

### 7.4 — Sistema Hematológico e Imunológico (`sistema-hematologico-e-imunologico`)
**Objetivo:** caracterizar os componentes do sangue e a resposta imune básica. **Conceitos fundamentais:** componentes do sangue (hemácias, leucócitos, plaquetas, plasma); hemostasia (vascular, plaquetária, coagulação); imunidade inata (barreiras, fagócitos) e adaptativa (linfócitos B/T, anticorpos). **Relação com outros capítulos:** independente, referenciado amplamente por disciplinas clínicas. **Observações importantes:** diferenciar imunidade inata (inespecífica, imediata) de adaptativa (específica, memória) é pegadinha clássica. **Referências:** Guyton & Hall; Tortora.

---

## MACROTEMA 8 — Assuntos que aparecem juntos (herdado da fonte)

Sistema Cardiovascular + Sistema Respiratório (fisiologia cardiorrespiratória integrada); Sistema Nervoso Autônomo + Sistema Cardiovascular (mecanismos de FC/PA); Sistema Renal + Equilíbrio Hidroeletrolítico (base para distúrbios cobrados em disciplinas clínicas). Estes três pares recebem peso levemente maior no Plano Editorial (ver adiante), por serem os pontos de maior cobrança cruzada real reconhecida pela própria fonte.

---

## Total de assuntos e subassuntos

7 assuntos, 23 subassuntos — idêntico a `docs/editorial/02j-anatomia-fisiologia.md`, sem alteração, sem invenção de novo subassunto. Apenas 1 dos 23 (`sistema-cardiovascular`) já possuía `topic` real no banco antes desta sprint; os demais 22 são criados nesta sprint (fase de Importação), reaproveitando os slugs já definidos na fonte.
