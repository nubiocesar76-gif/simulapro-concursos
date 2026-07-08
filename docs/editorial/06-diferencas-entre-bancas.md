# 06 — Diferenças entre Bancas (Perfil de Estilo e Ênfase)

Perfil qualitativo das 10 bancas de referência do briefing, mais notas sobre
as demais bancas já presentes em `taxonomy.json` porque aparecem no Acervo
(`docs/catalog/enfermagem.csv`). Uso pretendido: calibrar o **estilo do
distrator** e a **ênfase temática** quando o SimulaPro gerar/estruturar
questões no estilo de uma banca específica.

## IBFC
- **Formato**: múltipla escolha, 4 alternativas, enunciado direto e curto.
- **Estilo de comando**: pouco rebuscado, frequentemente pede a "alternativa
  correta" sobre definição/conceito, menos estudo de caso longo.
- **Ênfase temática**: forte em Fundamentos, Ética/Legislação, Saúde
  Coletiva; farmacologia costuma vir diluída em Fundamentos.
- **Nível de dificuldade**: médio, com pegadinhas de decoreba normativa
  (números de lei/portaria).
- **Fonte preferida**: manuais do MS citados quase literalmente.

## FGV
- **Formato**: múltipla escolha, 5 alternativas, enunciados mais longos,
  frequentemente com estudo de caso clínico.
- **Estilo de comando**: pede "assinale a conduta mais adequada" — valoriza
  raciocínio clínico aplicado, não só memorização.
- **Ênfase temática**: forte em Médico-Cirúrgica, Saúde da Mulher/Criança,
  Urgência/UTI; também cobra bastante SAE com taxonomia NANDA.
- **Nível de dificuldade**: médio-alto, distratores plausíveis (todos
  tecnicamente corretos, exceto por um detalhe).
- **Observação de recurso**: FGV tende a manter gabarito mesmo diante de
  questionamentos textuais rígidos — atenção redobrada na conferência do
  gabarito oficial antes de publicar no Acervo.

## Consulplan / Consulpam (Instituto Consulplan)
- **Formato**: múltipla escolha, 5 alternativas.
- **Estilo de comando**: mistura definição direta com pequenos casos
  clínicos objetivos.
- **Ênfase temática**: Saúde Coletiva, Políticas Públicas, Ética/Legislação;
  cobre Farmacologia de forma mais superficial.
- **Nível de dificuldade**: médio.

## IDECAN
- **Formato**: múltipla escolha, 5 alternativas, redação por vezes
  prolixa (frases longas com múltiplas orações subordinadas).
- **Estilo de comando**: gosta de "associe a coluna I com a coluna II" e
  "assinale a incorreta" (atenção: inverte a lógica do comando com
  frequência, risco de erro de gabarito automático).
- **Ênfase temática**: SAE/Processo de Enfermagem, Farmacologia, Saúde
  Mental.
- **Nível de dificuldade**: médio-alto.

## VUNESP
- **Formato**: múltipla escolha, 5 alternativas.
- **Estilo de comando**: cita literalmente trechos de manuais/portarias do
  MS e pede para identificar a afirmação correspondente — forte viés de
  "citação direta de norma".
- **Ênfase temática**: Legislação do SUS, Políticas Públicas de Saúde,
  Saúde Coletiva, Fundamentos; grande presença em concursos estaduais/
  municipais de São Paulo.
- **Nível de dificuldade**: médio.

## Cebraspe (CESPE)
- **Formato**: **Certo/Errado** (itens, não múltipla escolha) — a diferença
  estrutural mais importante desta lista, exige adaptação do simulado.
- **Estilo de comando**: afirmações normativas quase literais de lei/
  portaria/manual, com uma inversão sutil de termo ou uma condição
  adicional que torna o item errado.
- **Ênfase temática**: Ética/Legislação, Legislação do SUS, Urgência e
  Emergência (forte em concursos de Forças Armadas), Saúde do Adulto.
- **Nível de dificuldade**: alto — a "pegadinha" costuma estar em um único
  termo técnico trocado (ex.: "deve" por "pode", ou troca de sigla).
- **Nota de simulado**: ao gerar questões estilo Cebraspe, o SimulaPro deve
  produzir itens Certo/Errado, não múltipla escolha, para manter fidelidade.

## AOCP (Instituto AOCP)
- **Formato**: múltipla escolha, 5 alternativas.
- **Estilo de comando**: direto, favorece "de acordo com [norma/manual],
  é correto afirmar que".
- **Ênfase temática**: Saúde Coletiva, Imunização, Fundamentos; presente em
  concursos de hospitais universitários (HU-UFPE, por exemplo).
- **Nível de dificuldade**: médio.

## FUNDEP (Gestão de Concursos, ligada à UFMG)
- **Formato**: múltipla escolha, 4–5 alternativas.
- **Estilo de comando**: acadêmico, por vezes citando literatura clássica de
  enfermagem (Potter & Perry, Brunner & Suddarth) além de normas do MS.
- **Ênfase temática**: Anatomia e Fisiologia, Farmacologia, Médico-Cirúrgica.
- **Nível de dificuldade**: médio-alto.

## Avalia (Instituto Avalia / Avança SP)
- **Formato**: múltipla escolha, 4 alternativas, provas mais curtas.
- **Estilo de comando**: objetivo, favorece questões de definição/
  classificação simples.
- **Ênfase temática**: Fundamentos, Saúde Coletiva, Ética/Legislação; menor
  profundidade em Farmacologia e UTI.
- **Nível de dificuldade**: baixo-médio — geralmente a banca "mais fácil"
  do conjunto de referência.

## FAFIPA (Fundação FAFIPA)
- **Formato**: múltipla escolha, 4 alternativas, provas curtas.
- **Estilo de comando**: simples e direto, favorece conceitos e listas
  (ex.: "são exemplos de... EXCETO").
- **Ênfase temática**: Fundamentos, Saúde Coletiva, Legislação básica;
  presente majoritariamente em concursos municipais menores do
  Sul/Sudeste.
- **Nível de dificuldade**: baixo-médio.

## Notas sobre outras bancas do Acervo (não pedidas no briefing, mas
já presentes em `taxonomy.json`/`docs/catalog/enfermagem.csv`)

- **Quadrix**: formato de múltipla escolha com 3 alternativas
  (Certo/Errado/Anulado — modelo próprio); comando direto, ênfase em
  Fundamentos e Legislação.
- **IADES**: múltipla escolha, ênfase equilibrada entre clínico e
  normativo.
- **FCC (Fundação Carlos Chagas)**: tradição em provas bem estruturadas e
  gabarito raramente contestável; ênfase forte em Fundamentos, SAE e
  Legislação.
- **Cesgranrio**: presença menor em Enfermagem, mas quando aparece favorece
  estudo de caso clínico como a FGV.
- **UFPR/NC**: perfil acadêmico, semelhante à FUNDEP (ênfase em ciência
  básica e literatura clássica).

## Uso prático desta comparação no SimulaPro

1. Ao **classificar uma questão real** do Acervo, o estilo de comando da
   banca ajuda a confirmar a disciplina (ex.: um item Cebraspe citando
   "Lei 8.080" quase certamente é Legislação do SUS, não Saúde Coletiva).
2. Ao **gerar questões inéditas no estilo de uma banca**, replicar o
   formato (múltipla escolha vs. Certo/Errado), o comprimento do enunciado e
   o nível de "pegadinha normativa vs. raciocínio clínico" descritos acima.
3. Ao **calibrar dificuldade de simulado**, usar a ordenação aproximada
   (do mais fácil ao mais difícil, para o cargo Enfermeiro): Avalia/FAFIPA →
   IBFC/AOCP/Consulplan → VUNESP/FUNDEP/IDECAN → FGV → Cebraspe.
