# SES-RS 2013 (Fundatec) — cargo Enfermeiro

- Nome do concurso: Concurso Público — Edital de Abertura nº 01/2013
- Órgão: Secretaria da Saúde do Estado do Rio Grande do Sul (SES-RS)
- Banca: Fundatec (Fundação Universidade Empresa de Tecnologia e Ciências) —
  `fundatec.org.br` (concurso nº 267 no sistema da banca)
- Cargo utilizado: **Enfermeiro** (cargo 18, nível superior, prova ProvaD/ProvaF,
  aplicada em 17/01/2014).
- Status: **CONCLUÍDO**
  ☑ Edital (Anexos II e III — corpo consolidado não republicado separadamente,
     ver "Pré-checagem")
  ☑ Prova
  ☑ Gabarito definitivo (retificado, não preliminar)
  ☑ Formato validado — **A–E (5 alternativas)**
  ☑ CSV
  ☑ questions.json
  ☑ Seed
  ☑ Validado (DB)

Questões importadas: **41 de 70** (ver "Contagem final" abaixo).

## Pré-checagem

1. Cargo Enfermeiro? **SIM** — caderno "Nível Superior – Enfermeiro" (cargo 18),
   70 questões, aplicado em 17/01/2014.
2. Edital público? **SIM**, com ressalva — o corpo consolidado do "Edital de
   Concursos nº 01/2013" não está mais hospedado como arquivo único no portal
   de publicações da Fundatec (apenas as retificações posteriores, Editais
   02/2013 e 03/2013, permanecem publicadas individualmente). Os anexos
   oficiais do edital de abertura seguem públicos e foram obtidos diretamente
   do portal: **Anexo II – Quadro de Provas** (confirma 70 questões, 5
   componentes e critério eliminatório/classificatório) e **Anexo III –
   Programas e Bibliografias** (confirma o conteúdo programático e a
   bibliografia de Enfermagem, incluindo COFEN, PNI, Manual de Vacinação,
   Fundamentos de Enfermagem), salvos em
   `docs/work/ses-rs-2013/edital_anexo_ii_quadro_provas.pdf` e
   `docs/work/ses-rs-2013/edital_anexo_iii_programas_bibliografias.pdf`.
3. Prova pública? **SIM** — obtida via a ferramenta oficial "Provas Anteriores"
   do portal da Fundatec (`provas_anteriores.php?concurso=267`), que resolve
   o cargo 18 (Enfermeiro) para o arquivo público
   `home/portal/concursos/provas/0267.018.PDF`, salvo em
   `docs/work/ses-rs-2013/prova.pdf`.
4. Gabarito definitivo público? **SIM** — utilizado o **Gabarito Retificativo
   — Cargos: Nível Superior** (publicado em 18/02/2014), que é posterior e
   substitui o "Gabarito Oficial" de 13/02/2014 para os cargos de nível
   superior. Consultado diretamente na ferramenta oficial de consulta de
   gabaritos da Fundatec para o cargo 18 – Enfermeiro (com assinatura
   eletrônica de validação nº 37067) e salvo em
   `docs/work/ses-rs-2013/gabarito_retificativo_enfermeiro.html`. **Não foi
   usado** o Gabarito Preliminar (27/01/2014) nem o Gabarito Oficial não
   retificado (13/02/2014).
5. Formato da prova: **A–E (5 alternativas)** — confirmado na capa do caderno:
   "Cada questão oferece 5 (cinco) alternativas de respostas, representadas
   pelas letras A, B, C, D e E".

## Estrutura da prova (conforme Anexo II – Quadro de Provas)

70 questões em 5 componentes: Língua Portuguesa (Q1-10, eliminatória),
Informática (Q11-15, classificatória), Raciocínio Lógico (Q16-20,
classificatória), Legislação (Q21-50, eliminatória) e Conhecimentos
Específicos (Q51-70, eliminatória).

## Questões anuladas (gabarito retificativo oficial, cargo 18 – Enfermeiro)

7 questões anuladas: **Q1, Q2, Q12, Q49, Q63, Q68 e Q70**.

## Questões excluídas por ausência de aderência ao domínio Enfermagem

- **Q11, Q13, Q14 e Q15** (Informática, 4 questões válidas restantes após a
  anulação de Q12): dependem integralmente de figuras (capturas de tela do
  Windows Explorer e do LibreOffice Writer/Calc) para sua resolução; nas
  questões Q14 e Q15, as próprias alternativas de resposta são imagens, sem
  qualquer texto. Sem o conteúdo visual das figuras, a transcrição fiel do
  enunciado e das alternativas é impossível sem fabricar conteúdo, o que é
  expressamente vedado. Excluídas por impossibilidade de transcrição fiel.
- **Q21 a Q37** (17 questões, bloco "Legislação"): tratam de legislação
  estadual e federal sem relação com o SUS ou com o domínio de Enfermagem —
  Estatuto do Servidor Público Civil do RS (Lei Complementar nº 10.098/1994),
  Estatuto Estadual da Igualdade Racial (Lei nº 13.694/2011), Código de Ética
  Pública estadual (Decreto nº 45.746/2008), Lei Maria da Penha (Lei nº
  11.340/2006) e Estatuto da Igualdade Racial federal (Lei nº 12.288/2010).
  Não há disciplina ou assunto correspondente na taxonomia (que trata apenas
  de `legislacao-do-sus`), e a criação de uma nova disciplina para legislação
  estadual/administrativa genérica está fora do escopo de um banco de
  questões de Enfermagem. Excluídas por falta de aderência ao domínio.
- **Q17** (Raciocínio Lógico): as alternativas contêm operadores lógicos
  (conjunção "∧"/disjunção "∨"/negação "¬") tipografados com uma fonte de
  símbolos que não pôde ser extraída de forma confiável do PDF oficial (os
  operadores foram perdidos na extração, restando apenas espaços em branco
  entre as variáveis). Como não é possível reconstituir com certeza qual
  operador lógico original cada alternativa continha, a questão foi excluída
  para evitar fabricar conteúdo.

## Contagem final

- Total de questões na prova: 70
- Anuladas (gabarito retificativo oficial): 7 (Q1, Q2, Q12, Q49, Q63, Q68, Q70)
- Excluídas por falta de aderência ao domínio Enfermagem ou por
  impossibilidade de transcrição fiel: 22 (Q11, Q13, Q14, Q15, Q17, Q21–Q37)
- **Importadas: 41** — Português (Q3–Q10, 8), Raciocínio Lógico (Q16, Q18–Q20,
  4), Legislação do SUS (Q38–Q48, Q50, 12) e Conhecimentos Específicos (Q51,
  Q52–Q62, Q64–Q67, Q69, 17)

## Taxonomia

Reuso quase integral da taxonomia existente (banca `fundatec` já cadastrada).
4 assuntos genuinamente inéditos foram criados, todos dentro de disciplinas já
existentes (nenhuma disciplina nova):

- `imunizacao` → `resposta-imune-humoral-e-imunoglobulinas`
- `imunizacao` → `avaliacao-da-cobertura-vacinal`
- `saude-da-crianca-e-do-adolescente` → `encefalopatia-neonatal-e-paralisia-cerebral`
- `biosseguranca` → `limpeza-e-desinfeccao-de-equipamentos`

1 concurso novo:
`concurso-publico-secretaria-da-saude-do-estado-do-rio-grande-do-sul-edital-1-2013`
(banca `fundatec`, já existente na taxonomia).

## Validação

- `npm run seed:taxonomy`: 4 assuntos criados, 1 concurso criado, 0 erros.
- `npm run convert:questions`: 41 questões convertidas, 0 erros.
- `npm run seed:questions`: 41 questões criadas, 0 ignoradas, 0 erros.
- Verificação via DB (script descartável): exame "Concurso Publico Secretaria
  da Saude do Estado do Rio Grande do Sul Edital 1/2013" com 41 questões
  vinculadas, todas com 5 alternativas persistidas corretamente;
  `package_version_id` resolvido para o pacote `banco-de-questoes-enfermagem`
  versão `1.0` (status PUBLISHED); os 4 novos assuntos confirmados com 1
  questão cada vinculada corretamente; total acumulado no banco = 829
  questões.
